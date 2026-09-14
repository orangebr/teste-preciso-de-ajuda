# Teste do Preciso de Ajuda

Teste de usabilidade do novo fluxo de abertura de chamado do Pigz Partner.

| | |
| --- | --- |
| Teste | https://usabilidade.pigz.com.br/ |
| **Resultados** | https://usabilidade.pigz.com.br/resultados.html |
| Player de uma sessão | https://usabilidade.pigz.com.br/player.html |

> **Vai mexer no design?** As regras que guiaram este projeto — e os erros que
> as produziram — estão em **[DESIGN.md](DESIGN.md)**.

> **Vai ligar a coleta no n8n?** As instruções passo a passo estão em
> **[HANDOFF.md](HANDOFF.md)**.

## O que é

Página única, sem build: `index.html`. Uma réplica da tela de Vendas com um
defeito plantado (valores que não fecham, linha duplicada, `NaN`), o fluxo do
"Preciso de ajuda" transcrito do produto e um formulário de avaliação em quatro
telas. Todos os dados são fictícios — nada aqui conversa com produção.

O CSS e o catálogo de perguntas vêm do código real: `primitive.ts`,
`NewTicketWizard/`, `NeedHelpPanel/chatStyles.ts`, `DSButton`, `DSStepper`,
`DSHelpButton`, `GlobalRadio*OptionList` e `SideModalV3`. Quando o produto
mudar, esta réplica precisa mudar junto.

## Como as respostas chegam

A página envia cada sessão para um Web App do Google Apps Script (constante
`ENDPOINT_PADRAO`, no topo do script). O Apps Script grava dois arquivos por
sessão: o `.md` legível e o `.json` com o replay do rrweb — DOM, ponteiro e
scroll, no estilo do Clarity, sem pedir permissão de tela.

O destino é `respostas/` neste repositório. Enquanto o token do GitHub não
estiver configurado no Apps Script, os arquivos ficam apenas no Drive (ver
`apps-script-coleta.gs` e `respostas/README.md`).

Se o envio falhar, a própria página oferece o download do `.json` para o
lojista devolver à mão.

## Arquivos

| Arquivo | O que é |
| --- | --- |
| `index.html` | o teste inteiro |
| `player.html` | reproduz uma sessão gravada |
| `apps-script-coleta.gs` | o coletor que roda no Google Apps Script |
| `respostas/` | uma sessão = um `.json` |
