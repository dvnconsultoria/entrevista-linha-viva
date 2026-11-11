# Auto Avaliação do Líder · Projeto Líder Padrão Goiás (Grupo Equatorial)

Versão conversacional (com voz e vídeo) do formulário Jotform **AUTO AVALIAÇÃO LÍDER PADRÃO GOIÁS**, no mesmo modelo da Entrevista Linha Viva (Energisa).

O instrutor virtual Carlos (voz Anderson Costa, ElevenLabs) conduz o líder por:

1. **Identificação**: consentimento LGPD, nome, telefone, e-mail, função (Supervisor, Fiscal ou Encarregado), regional, cidade, empresa e foto do rosto.
2. **Experiência**: processos em que atua (Construção/Manutenção e Plantão de Rede Aérea, Comercial, Poda, Linha Viva).
3. **Módulos técnicos**: notas de 1 (menor conhecimento) a 5 (pleno conhecimento) para cada atividade, com o POP de referência. Aparecem só os módulos dos processos marcados.
4. **Liderança**: 10 afirmações da função escolhida, de 1 (nunca) a 5 (sempre).
5. **Finalização**: observação opcional e assinatura na tela.

Antes de começar, o líder pode assistir ao vídeo de apresentação (`video/intro.mp4`).

- **Formulário:** `index.html`
- **Painel da equipe (dashboard):** o mesmo endereço com `#painel` no final

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `index.html` | O formulário e o painel da equipe |
| `config.js` | Endereço da planilha (único arquivo que precisa ser editado) |
| `audios/` | Falas do Carlos (voz Anderson Costa, ElevenLabs) |
| `video/intro.mp4` | Vídeo introdutório com o profissional do setor elétrico |
| `img/` | Logo da old educação |
| `google-apps-script/Code.gs` | Script que grava as respostas na planilha |

## Ligar a planilha (uma vez só)

1. Crie uma planilha nova no Google Sheets, por exemplo "Auto Avaliação Líder Padrão Goiás".
2. Na planilha, abra **Extensões → Apps Script**.
3. Apague o conteúdo e cole todo o arquivo `google-apps-script/Code.gs`.
4. Na linha `const SENHA_PAINEL = 'troque-esta-senha';`, troque pela senha que a equipe vai usar no painel. Salve.
5. Clique em **Implantar → Nova implantação**, escolha o tipo **App da Web** e configure:
   - **Executar como:** Eu
   - **Quem pode acessar:** Qualquer pessoa
6. Clique em **Implantar**, autorize com sua conta Google e copie o **URL do app da Web** (termina com `/exec`).
7. Edite `config.js` e cole o endereço no lugar de `COLE_AQUI_O_ENDERECO_DO_APPS_SCRIPT`.

Cada auto avaliação concluída cria:
- uma linha na aba **Avaliacoes** (dados do líder, médias por módulo, média de liderança, foto e assinatura);
- uma linha por item na aba **Notas** (bloco, módulo, atividade, POP e nota), pronta para gráficos e tabelas dinâmicas.

> Se você alterar o script depois, use **Implantar → Gerenciar implantações → Editar → Nova versão** para manter o mesmo endereço.

## Trocar uma fala do Carlos

Substitua o arquivo em `audios/` mantendo o mesmo nome. Os nomes seguem as etapas: `intro`, `lgpd`, `nome`, `telefone`, `email`, `funcao`, `regional`, `cidade`, `empresa`, `foto`, `processos`, `escala`, `m1_q` a `m4_q`, `lideranca`, `observacao`, `assinatura`, `fim`. Se um arquivo faltar, o site usa a voz do navegador.

## Alterar perguntas

Perguntas, módulos, POPs, escalas, regionais, empresas e afirmações de liderança ficam no início do script do `index.html`, nos blocos `FORM` e `FALAS`.
