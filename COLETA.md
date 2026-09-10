# Como as respostas chegam

A página é estática (GitHub Pages) e não recebe POST. Um token com permissão
de escrita dentro dela seria um vazamento — qualquer pessoa que abrisse o
teste teria acesso de escrita a este repositório. Por isso quem escreve aqui
nunca é a página: é um intermediário que guarda o token do lado servidor.

Há dois intermediários prontos. **Escolha um.**

```
página do teste ──POST──► intermediário ──► respostas/ neste repo
```

## Opção A — n8n (recomendada)

Roda na infraestrutura de vocês, em `automation.pigz.com.br`, e tira o Google
do caminho por inteiro.

1. Importe `n8n-coleta.json` no n8n (**Workflows → ⋯ → Import from File**).
2. Crie a credencial **Header Auth** chamada
   `GitHub - teste-preciso-de-ajuda`:
   - Name: `Authorization`
   - Value: `Bearer SEU_TOKEN`
3. Ative o workflow. A URL fica
   `https://automation.pigz.com.br/webhook/teste-preciso-de-ajuda`.
4. Troque `ENDPOINT_PADRAO` no topo do `index.html` por essa URL.

O token pode ser um **classic PAT com escopo `public_repo`**, criado por você
mesmo em github.com/settings/tokens — como o repositório é público, não é
preciso pedir aprovação a ninguém. Se a organização exigir SSO, autorize o
token para `orangebr` na própria tela do GitHub.

**Antes de trocar o endpoint**, teste o webhook:

```bash
curl -X POST https://automation.pigz.com.br/webhook/teste-preciso-de-ajuda \
  -H 'Content-Type: text/plain;charset=utf-8' \
  --data '{"sessionId":"SFUMACA","md":"# fumaça","dados":{},"replay":[{"type":4}]}'
```

Deve responder `{"ok":true}` e aparecer `respostas/teste-preciso-de-ajuda-SFUMACA.md`.

## Opção B — Google Apps Script (o que está no ar hoje)

`apps-script-coleta.gs`, no projeto "Coleta - Teste Preciso de Ajuda" da conta
rodrigo.lima@pigz.com.br. Grava no Google Drive (pasta *Teste Preciso de
Ajuda*) e, quando a propriedade `GITHUB_TOKEN` existir, também aqui. As
instruções estão no cabeçalho do arquivo.

Funciona hoje, sem token: as sessões ficam no Drive.

## Em qualquer uma das duas

Se o envio falhar, a página mostra o aviso e oferece o download do `.json`
para o lojista devolver à mão. Nenhuma sessão depende de a integração estar
de pé.
