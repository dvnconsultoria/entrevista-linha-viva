# Entrevista do Multiplicador · Linha Viva

Site da entrevista conversacional da **old educação**: o instrutor virtual Carlos faz as perguntas com voz, o multiplicador dá notas de 1 a 4 em Teoria e Prática nos 8 módulos e assina na tela. As respostas vão para uma planilha do Google Sheets.

- **Entrevista:** `https://dvnconsultoria.github.io/entrevista-linha-viva/`
- **Painel da equipe (dashboard):** `https://dvnconsultoria.github.io/entrevista-linha-viva/#painel`

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `index.html` | A entrevista e o painel da equipe |
| `config.js` | Endereço da planilha (único arquivo que precisa ser editado) |
| `audios/` | Falas do Carlos (voz Anderson Costa, ElevenLabs) |
| `img/` | Logo da old educação |
| `google-apps-script/Code.gs` | Script que grava as respostas na planilha |

## Ligar a planilha (uma vez só)

1. Crie uma planilha nova no Google Sheets, por exemplo "Entrevistas Linha Viva".
2. Na planilha, abra **Extensões → Apps Script**.
3. Apague o conteúdo e cole todo o arquivo `google-apps-script/Code.gs`.
4. Na linha `const SENHA_PAINEL = 'troque-esta-senha';`, troque pela senha que a equipe vai usar no painel. Salve.
5. Clique em **Implantar → Nova implantação**, escolha o tipo **App da Web** e configure:
   - **Executar como:** Eu
   - **Quem pode acessar:** Qualquer pessoa
6. Clique em **Implantar**, autorize com sua conta Google e copie o **URL do app da Web** (termina com `/exec`).
7. No GitHub, edite `config.js` e cole o endereço no lugar de `COLE_AQUI_O_ENDERECO_DO_APPS_SCRIPT`. Salve (Commit).

Pronto. Cada entrevista concluída cria:
- uma linha na aba **Entrevistas** (dados pessoais, médias, observação e assinatura);
- uma linha por atividade na aba **Notas** (módulo, atividade, teoria, prática e média), pronta para gráficos e tabelas dinâmicas.

> Se você alterar o script depois, use **Implantar → Gerenciar implantações → Editar → Nova versão** para manter o mesmo endereço.

## Trocar uma fala do Carlos

Substitua o arquivo em `audios/` mantendo o mesmo nome (por exemplo `escala.mp3`). Os nomes seguem as etapas da entrevista: `intro`, `unidade`, `cidade`, `nome`, `idade`, `cpf`, `whatsapp`, `email`, `formacao`, `formacaoOutro`, `experiencia`, `escala`, `m1_q` a `m8_q` (nome de cada módulo), `observacao`, `assinatura`, `fim`.

## Novos formulários

As perguntas, módulos, escala e falas ficam no início do `index.html`, nos blocos `FORM` e `FALAS`. Um novo formulário reaproveita o mesmo motor trocando esses blocos e os áudios.
