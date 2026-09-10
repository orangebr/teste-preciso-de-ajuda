# Handoff — ligar a coleta do teste no n8n

**Para quem vai executar:** você não precisa mexer no teste. Ele está no ar e
funcionando. O que falta é trocar quem recebe as respostas: hoje é um Google
Apps Script pessoal, e a ideia é passar para o n8n da Pigz.

Tempo estimado: 20 minutos, sendo 15 de espera do GitHub.

- Teste no ar: https://orangebr.github.io/teste-preciso-de-ajuda/
- Repositório: https://github.com/orangebr/teste-preciso-de-ajuda
- n8n: https://automation.pigz.com.br

---

## Por que existe um intermediário

A página é estática (GitHub Pages) e não recebe POST. Colocar um token de
escrita dentro dela seria um vazamento: o HTML é público, qualquer pessoa que
abrisse o teste teria acesso de escrita ao repositório. Então quem escreve
nunca é a página.

```
lojista → página (Pages) ──POST──► n8n ──commit──► respostas/ no repo
```

O n8n guarda a credencial do lado servidor. É a única peça que falta.

---

## O que já está pronto

| | Estado |
| --- | --- |
| Página do teste | no ar, Pages na branch `main` |
| Player das sessões | `/player.html`, no ar |
| Workflow do n8n | `n8n-coleta.json`, pronto para importar |
| Coleta atual | Apps Script → Google Drive (funcionando, ~25 sessões) |
| Coleta desejada | n8n → `respostas/` neste repo |

---

## Passo 1 — Criar o token do GitHub

Repositório público, então basta um **classic PAT** com escopo `public_repo`.
Não precisa de aprovação de admin da organização.

https://github.com/settings/tokens/new?scopes=public_repo&description=n8n%20-%20teste-preciso-de-ajuda

O link já abre com o escopo marcado. Escolha a expiração, gere e copie —
o GitHub mostra o valor uma única vez.

> Se a organização `orangebr` exigir SSO, aparece um botão **Configure SSO →
> Authorize** ao lado do token na lista. Sem isso o commit responde `403`.

## Passo 2 — Criar a credencial no n8n

**Credentials → Add credential → Header Auth**

| Campo | Valor |
| --- | --- |
| Nome da credencial (campo do topo) | `GitHub - teste-preciso-de-ajuda` |
| Name | `Authorization` |
| Value | `Bearer SEU_TOKEN` |

Dois detalhes que costumam custar tempo:

- São **dois campos chamados "Name"** na mesma tela. O de cima batiza a
  credencial; o de baixo é o nome do cabeçalho HTTP.
- O `Bearer ` faz parte do **Value**, com o espaço.

O nome da credencial precisa ser exatamente `GitHub - teste-preciso-de-ajuda`
— é por ele que o workflow importado se liga a ela. Se você usar outro nome,
reaponte a credencial nos dois nós de HTTP Request depois de importar.

## Passo 3 — Importar e ativar o workflow

**Workflows → ⋯ → Import from File →** `n8n-coleta.json` (está na raiz deste
repositório).

São cinco nós: recebe o POST → monta os arquivos → busca o `sha` do arquivo
atual → commita → responde `{"ok":true}`.

Ative o workflow. A URL de produção fica:

```
https://automation.pigz.com.br/webhook/teste-preciso-de-ajuda
```

## Passo 4 — Testar antes de trocar

```bash
curl -i -X POST https://automation.pigz.com.br/webhook/teste-preciso-de-ajuda \
  -H 'Content-Type: text/plain;charset=utf-8' \
  --data '{"sessionId":"SFUMACA","md":"# fumaca","dados":{},"replay":[{"type":4}]}'
```

Esperado: `200` com `{"ok":true}`, e dois arquivos novos em `respostas/`
(`...-SFUMACA.md` e `...-SFUMACA.json`). Rode o mesmo comando **duas vezes** —
o segundo prova que a busca de `sha` está funcionando; sem ela o GitHub
responde `422` em toda sobrescrita.

Depois, teste pela página real sem alterar nada, usando o parâmetro `?api=`:

```
https://orangebr.github.io/teste-preciso-de-ajuda/?api=https://automation.pigz.com.br/webhook/teste-preciso-de-ajuda
```

Percorra o teste até o fim. Se a tela final **não** mostrar o aviso de erro
com o botão de download, o envio funcionou.

## Passo 5 — Trocar o destino de vez

Uma linha, no topo do `<script>` do `index.html` (procure por
`ENDPOINT_PADRAO`, tem um comentário em caixa apontando para ela):

```js
const ENDPOINT_PADRAO = 'https://automation.pigz.com.br/webhook/teste-preciso-de-ajuda';
```

Commit na `main`. O Pages republica sozinho em 1 a 3 minutos.

> O Pages serve do cache por alguns minutos. Se depois do deploy a página
> ainda parecer antiga, force com `?v=2` na URL.

## Passo 6 — Desligar o Apps Script (só depois de tudo funcionando)

O projeto **"Coleta - Teste Preciso de Ajuda"** está na conta
rodrigo.lima@pigz.com.br. Em *Implantar → Gerenciar implantações*, arquive a
implantação. As ~25 sessões já coletadas ficam na pasta **"Teste Preciso de
Ajuda"** do Drive dessa conta e podem ser copiadas para `respostas/`.

---

## Se der errado

| Sintoma | Causa provável |
| --- | --- |
| `403` no commit | token sem `public_repo`, ou SSO não autorizado para `orangebr` |
| `422` no commit | o `sha` não chegou — confira se o nó "Busca o sha atual" está com *Never Error* ligado |
| `404` do webhook | workflow não está **ativo**; a URL de teste (`/webhook-test/`) só vale com o editor aberto |
| Erro de CORS no console | o nó Webhook precisa de *Allowed Origins* = `https://orangebr.github.io` (já vem no JSON) |
| A tela final mostra o aviso de erro | o POST não chegou. O `.json` continua disponível para download ali mesmo — nenhuma sessão se perde |

---

## Mapa do repositório

| Arquivo | O que é |
| --- | --- |
| `index.html` | o teste inteiro — página única, sem build |
| `player.html` | reproduz uma sessão gravada (rrweb) |
| `n8n-coleta.json` | o workflow deste handoff |
| `apps-script-coleta.gs` | o coletor antigo, que sai de cena no passo 6 |
| `respostas/` | uma sessão = um `.md` + um `.json` |
| `COLETA.md` | as duas opções de coleta, lado a lado |

## Uma coisa a saber antes de mexer no `index.html`

O CSS e as perguntas do teste são **transcrição do código real** do Partner —
`primitive.ts`, `NewTicketWizard/`, `NeedHelpPanel/chatStyles.ts`, `DSButton`,
`DSStepper`, `DSHelpButton`, `GlobalRadio*OptionList` e `SideModalV3`. A
fidelidade é o que faz o teste valer: se você "melhorar" um espaçamento aqui,
o teste passa a medir uma tela que não existe.

Duas divergências são intencionais, nasceram das primeiras sessões e estão
comentadas no código: a confirmação antes de descartar um chamado começado, e
o contador do relato que mostra o mínimo de 50 em vez do teto de 500.
