# Respostas

Uma sessão do teste = dois arquivos aqui:

- `teste-preciso-de-ajuda-<sessão>.md` — o relatório legível
- `teste-preciso-de-ajuda-<sessão>.json` — o mesmo relatório mais o replay
  do rrweb (DOM, ponteiro, scroll)

Para assistir a uma sessão:

    https://orangebr.github.io/teste-preciso-de-ajuda/player.html?f=respostas/teste-preciso-de-ajuda-SESSAO.json

Ou abra o player e carregue o arquivo pelo botão.

## Como chegam aqui

O GitHub Pages é estático e não recebe POST, e um token de escrita dentro de
uma página pública seria um vazamento — qualquer pessoa que abrisse o teste
teria acesso de escrita a este repositório. Por isso quem escreve aqui não é a
página, é o Apps Script, que guarda o token do lado servidor.

    página do teste  →  Web App do Apps Script  →  este repositório
                                               ↘  Google Drive (cópia de segurança)

O Drive é gravado primeiro, porque é o passo que não depende de credencial. Se
o commit falhar, a sessão continua salva lá.

Enquanto a propriedade `GITHUB_TOKEN` não estiver configurada no Apps Script,
nada chega nesta pasta — as instruções estão no cabeçalho de
`apps-script-coleta.gs`.
