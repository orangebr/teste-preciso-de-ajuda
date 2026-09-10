/**
 * Coleta do teste do Preciso de Ajuda.
 *
 * Cada sessão vira um `.json` completo (relatório + replay do rrweb) e um
 * `.md` legível. Os dois vão para duas casas:
 *
 *   1. GitHub — orangebr/teste-preciso-de-ajuda, pasta `respostas/`. É o
 *      destino oficial: fica junto do código do teste e o player abre direto
 *      pela URL.
 *   2. Google Drive — pasta "Teste Preciso de Ajuda". Rede de segurança: se o
 *      commit falhar (token vencido, GitHub fora), a sessão não se perde.
 *
 * O Drive grava PRIMEIRO, de propósito: é o passo que não depende de
 * credencial nenhuma.
 *
 * Uma sessão chega mais de uma vez — um reenvio por minuto enquanto o teste
 * corre, o beacon de quem fecha a aba no meio e o envio final. Por isso os
 * arquivos são sobrescritos pelo id da sessão em vez de duplicados: o que
 * vale é sempre o último retrato.
 *
 * ── O token do GitHub ──────────────────────────────────────────────────
 * Fica nas Propriedades do Script, NUNCA no código (este arquivo está num
 * repositório público). Para configurar:
 *
 *   1. github.com/settings/personal-access-tokens/new
 *      - Resource owner: orangebr
 *      - Repository access: Only select repositories → teste-preciso-de-ajuda
 *      - Permissions → Repository permissions → Contents: Read and write
 *      - Expiration: o que a política da Orange permitir
 *   2. No editor do Apps Script: engrenagem (Configurações do projeto) →
 *      Propriedades do script → Adicionar
 *      - Propriedade: GITHUB_TOKEN
 *      - Valor: o token
 *   3. Implantar → Gerenciar implantações → editar → Nova versão.
 *
 * Sem o token o teste continua funcionando: as sessões ficam no Drive e a
 * resposta do endpoint traz `github: "sem token"`.
 */

var PASTA_DRIVE = 'Teste Preciso de Ajuda';
var REPO = 'orangebr/teste-preciso-de-ajuda';
var BRANCH = 'main';
var DIRETORIO = 'respostas';

function doPost(e) {
  var resultado = { ok: true };
  var payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, erro: 'payload inválido' });
  }

  var sessao = String(payload.sessionId || 'sem-id').replace(/[^A-Za-z0-9_-]/g, '');
  var base = 'teste-preciso-de-ajuda-' + sessao;
  var md = String(payload.md || '');
  var temReplay = Boolean(payload.replay && payload.replay.length);
  var completo = JSON.stringify(payload);

  try {
    var destino = pastaDoDrive();
    gravarNoDrive(destino, base + '.md', md, MimeType.PLAIN_TEXT);
    if (temReplay) gravarNoDrive(destino, base + '.json', completo, 'application/json');
    resultado.drive = 'ok';
  } catch (err) {
    console.error('drive: ' + err);
    resultado.drive = String(err);
  }

  try {
    resultado.github = enviarAoGitHub(base, md, temReplay ? completo : null);
  } catch (err) {
    console.error('github: ' + err);
    resultado.github = String(err);
  }

  // Nunca devolve erro ao lojista: quando isso roda, o teste dele já acabou.
  return json(resultado);
}

/** Abrir a URL no navegador responde isto — serve de teste de vida. */
function doGet() {
  var token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  return json({
    ok: true,
    servico: 'coleta do teste do Preciso de Ajuda',
    drive: pastaDoDrive().getName(),
    repo: REPO,
    github: token ? 'token configurado' : 'sem token — só Drive',
  });
}

// ── Drive ────────────────────────────────────────────────────────────────

function pastaDoDrive() {
  var achadas = DriveApp.getFoldersByName(PASTA_DRIVE);
  return achadas.hasNext() ? achadas.next() : DriveApp.createFolder(PASTA_DRIVE);
}

function gravarNoDrive(destino, nome, conteudo, tipo) {
  var existentes = destino.getFilesByName(nome);
  if (existentes.hasNext()) {
    existentes.next().setContent(conteudo);
  } else {
    destino.createFile(nome, conteudo, tipo);
  }
}

// ── GitHub ───────────────────────────────────────────────────────────────

function enviarAoGitHub(base, md, completo) {
  var token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  if (!token) return 'sem token';

  var enviados = [];
  enviados.push(commitar(token, DIRETORIO + '/' + base + '.md', md));
  if (completo) enviados.push(commitar(token, DIRETORIO + '/' + base + '.json', completo));
  return enviados.join(', ');
}

/**
 * Cria ou atualiza um arquivo via Contents API. O `sha` do arquivo atual é
 * obrigatório para sobrescrever — sem ele o GitHub responde 422, que é o que
 * acontece no segundo envio da mesma sessão.
 */
function commitar(token, caminho, conteudo) {
  var url = 'https://api.github.com/repos/' + REPO + '/contents/' + encodeURI(caminho);
  var cabecalhos = {
    Authorization: 'Bearer ' + token,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  var sha = null;
  var atual = UrlFetchApp.fetch(url + '?ref=' + BRANCH, {
    method: 'get', headers: cabecalhos, muteHttpExceptions: true,
  });
  if (atual.getResponseCode() === 200) sha = JSON.parse(atual.getContentText()).sha;

  var corpo = {
    message: 'Sessão ' + caminho.split('/').pop(),
    content: Utilities.base64Encode(conteudo, Utilities.Charset.UTF_8),
    branch: BRANCH,
  };
  if (sha) corpo.sha = sha;

  var r = UrlFetchApp.fetch(url, {
    method: 'put', headers: cabecalhos, contentType: 'application/json',
    payload: JSON.stringify(corpo), muteHttpExceptions: true,
  });
  var codigo = r.getResponseCode();
  if (codigo >= 200 && codigo < 300) return caminho + ' ok';
  return caminho + ' HTTP ' + codigo + ' ' + r.getContentText().slice(0, 160);
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
