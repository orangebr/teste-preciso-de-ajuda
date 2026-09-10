# Respostas

Uma sessão do teste = um arquivo `.json` aqui, com este formato:

```json
{
  "sessionId": "S...",
  "md": "# Teste do Preciso de Ajuda — ... (o relatório legível)",
  "dados": { "marcos": [], "form": {}, "draft": {} },
  "replay": [ /* eventos do rrweb */ ]
}
```

Para assistir a uma sessão, abra o player apontando para o arquivo:

    https://eucj.github.io/teste-preciso-de-ajuda/player.html?f=respostas/NOME.json

Ou abra `player.html` e carregue o arquivo pelo botão.

## Como os arquivos chegam aqui

O GitHub Pages é estático e não recebe POST, e um token com permissão de
escrita dentro de uma página pública seria um vazamento — qualquer pessoa que
abrisse o teste teria acesso de escrita ao repositório. Por isso a página **não
grava aqui sozinha**. O caminho é:

1. A página envia a sessão para o Web App do Apps Script.
2. O Apps Script grava no Google Drive (pasta *Teste Preciso de Ajuda*).
3. Os arquivos são copiados do Drive para cá.

Se o envio automático falhar, a própria página oferece o download do `.json`
para o lojista — é só soltar o arquivo nesta pasta.
