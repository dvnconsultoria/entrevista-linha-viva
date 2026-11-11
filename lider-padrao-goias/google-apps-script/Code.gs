/**
 * Auto Avaliação Líder Padrão Goiás · Grupo Equatorial · old educação
 * Recebe as auto avaliações do site e grava na planilha.
 * Também entrega os dados ao Painel do site (protegido por senha).
 *
 * Como instalar: veja o README.md.
 */

// Troque pela senha do painel da equipe (use letras e números).
const SENHA_PAINEL = 'troque-esta-senha';

const ABA_AVALIACOES = 'Avaliacoes';
const ABA_NOTAS = 'Notas';

const COLUNAS_AVALIACOES = [
  'id', 'concluida_em', 'status', 'nome', 'telefone', 'email', 'funcao', 'regional', 'cidade', 'empresa',
  'processos', 'media_tecnica', 'media_m1_rede_aerea', 'media_m2_comercial', 'media_m3_poda', 'media_m4_linha_viva',
  'media_lideranca', 'modulos_avaliados', 'observacao', 'foto_jpg', 'assinatura_png', 'dados_json'
];
const COLUNAS_NOTAS = [
  'id', 'concluida_em', 'nome', 'funcao', 'regional', 'cidade', 'empresa',
  'bloco', 'modulo', 'item', 'atividade', 'pop', 'nota'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (!d || !d.id || !d.nome) return json_({ ok: false, erro: 'dados incompletos' });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const av = aba_(ss, ABA_AVALIACOES, COLUNAS_AVALIACOES);
    const notas = aba_(ss, ABA_NOTAS, COLUNAS_NOTAS);

    // Se a mesma avaliação chegar de novo, substitui a anterior.
    apagarPorId_(av, d.id);
    apagarPorId_(notas, d.id);

    const leve = Object.assign({}, d);
    delete leve.assinatura; delete leve.foto; delete leve.notas;
    const m = d.medias || {};

    av.appendRow([
      d.id, d.concluidaEm || new Date().toISOString(), d.status || '', d.nome || '', texto_(d.telefone), d.email || '',
      d.funcao || '', d.regional || '', d.cidade || '', d.empresa || '', (d.processos || []).join(' / '),
      num_(d.mediaTecnica), num_(m.m1), num_(m.m2), num_(m.m3), num_(m.m4), num_(d.mediaLideranca),
      d.modulosAvaliados || 0, d.observacao || '', d.foto || '', d.assinatura || '', JSON.stringify(leve)
    ]);

    const linhas = (d.notas || []).map(function (n) {
      return [d.id, d.concluidaEm || '', d.nome || '', d.funcao || '', d.regional || '', d.cidade || '', d.empresa || '',
        n.bloco, n.modulo, n.item, n.atividade, n.pop || '', n.nota];
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
  const av = aba_(ss, ABA_AVALIACOES, COLUNAS_AVALIACOES);
  const valores = av.getDataRange().getValues();
  const iJson = COLUNAS_AVALIACOES.indexOf('dados_json');
  const iAss = COLUNAS_AVALIACOES.indexOf('assinatura_png');
  const iFoto = COLUNAS_AVALIACOES.indexOf('foto_jpg');
  const rows = [];
  for (let r = 1; r < valores.length; r++) {
    try {
      const o = JSON.parse(valores[r][iJson]);
      o.assinatura = valores[r][iAss] || '';
      o.foto = valores[r][iFoto] || '';
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

// Evita que o Sheets transforme telefone em número.
function texto_(v) { return v ? "'" + v : ''; }
function num_(v) { return (v === null || v === undefined) ? '' : v; }

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
