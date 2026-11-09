/**
 * Entrevista Linha Viva · old educação
 * Recebe as entrevistas do site e grava na planilha.
 * Também entrega os dados ao Painel do site (protegido por senha).
 *
 * Como instalar: veja o README.md do repositório.
 */

// Troque pela senha do painel da equipe (use letras e números).
const SENHA_PAINEL = 'troque-esta-senha';

const ABA_ENTREVISTAS = 'Entrevistas';
const ABA_NOTAS = 'Notas';

const COLUNAS_ENTREVISTAS = [
  'id', 'concluida_em', 'status', 'nome', 'cpf', 'idade', 'email', 'whatsapp',
  'unidade', 'cidade', 'formacao', 'experiencia_anos', 'media_teoria', 'media_pratica',
  'modulos_avaliados', 'observacao', 'assinatura_png', 'dados_json'
];
const COLUNAS_NOTAS = [
  'id', 'concluida_em', 'nome', 'unidade', 'cidade', 'experiencia_anos',
  'modulo', 'item', 'atividade', 'teoria', 'pratica', 'media'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (!d || !d.id || !d.nome) return json_({ ok: false, erro: 'dados incompletos' });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ent = aba_(ss, ABA_ENTREVISTAS, COLUNAS_ENTREVISTAS);
    const notas = aba_(ss, ABA_NOTAS, COLUNAS_NOTAS);

    // Se a mesma entrevista chegar de novo, substitui a anterior.
    apagarPorId_(ent, d.id);
    apagarPorId_(notas, d.id);

    const formacao = (d.formacao || []).join(' / ') + (d.formacaoOutro ? ' (' + d.formacaoOutro + ')' : '');
    const semPesados = Object.assign({}, d);
    delete semPesados.assinatura;
    delete semPesados.notas;

    ent.appendRow([
      d.id, d.concluidaEm || new Date().toISOString(), d.status || '', d.nome || '', texto_(d.cpf), d.idade || '',
      d.email || '', texto_(d.whatsapp), d.unidade || '', d.cidade || '', formacao, d.experiencia || '',
      d.mediaTeoria, d.mediaPratica, d.modulosAvaliados || 0, d.observacao || '',
      d.assinatura || '', JSON.stringify(semPesados)
    ]);

    const linhas = (d.notas || []).map(function (n) {
      return [d.id, d.concluidaEm || '', d.nome || '', d.unidade || '', d.cidade || '', d.experiencia || '',
        n.modulo, n.item, n.atividade, n.teoria, n.pratica, n.media];
    });
    if (linhas.length) notas.getRange(notas.getLastRow() + 1, 1, linhas.length, COLUNAS_NOTAS.length).setValues(linhas);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, erro: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  const senha = (e && e.parameter && e.parameter.senha) || '';
  if (senha !== SENHA_PAINEL) return json_({ ok: false, erro: 'senha' });
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ent = aba_(ss, ABA_ENTREVISTAS, COLUNAS_ENTREVISTAS);
  const valores = ent.getDataRange().getValues();
  const iJson = COLUNAS_ENTREVISTAS.indexOf('dados_json');
  const iAss = COLUNAS_ENTREVISTAS.indexOf('assinatura_png');
  const rows = [];
  for (let r = 1; r < valores.length; r++) {
    try {
      const o = JSON.parse(valores[r][iJson]);
      o.assinatura = valores[r][iAss] || '';
      o.atualizadoEm = o.atualizadoEm || o.concluidaEm;
      rows.push(o);
    } catch (err) { /* linha editada à mão: ignora */ }
  }
  return json_({ ok: true, rows: rows });
}

function aba_(ss, nome, colunas) {
  let sh = ss.getSheetByName(nome);
  if (!sh) sh = ss.insertSheet(nome);
  if (sh.getLastRow() === 0) {
    sh.appendRow(colunas);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, colunas.length).setFontWeight('bold');
  }
  return sh;
}

function apagarPorId_(sh, id) {
  const n = sh.getLastRow();
  if (n < 2) return;
  const ids = sh.getRange(2, 1, n - 1, 1).getValues();
  for (let i = ids.length - 1; i >= 0; i--) {
    if (String(ids[i][0]) === String(id)) sh.deleteRow(i + 2);
  }
}

// Evita que o Sheets transforme CPF e telefone em número.
function texto_(v) { return v ? "'" + v : ''; }

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
