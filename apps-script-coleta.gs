/**
 * Coleta do teste do Preciso de Ajuda.
 *
 * Cada sessão vira dois arquivos numa pasta do Drive: o `.md` legível, para
 * ler o que aconteceu, e o `.json` completo, que o player reproduz como se
 * fosse um vídeo da sessão (é o replay do rrweb — DOM, ponteiro e scroll).
 *
 * A pasta é criada na primeira execução e reaproveitada depois — nada de id
 * colado na mão, que é o passo em que essas integrações costumam quebrar.
 *
 * Uma sessão chega mais de uma vez: um reenvio por minuto enquanto o teste
 * corre, o beacon de quem fecha a aba no meio e o envio final. Por isso os
 * arquivos são sobrescritos pelo id da sessão em vez de duplicados — o que
 * vale é sempre o último retrato.
 */

/** Nome da pasta no Drive. */
var PASTA = 'Teste Preciso de Ajuda';

function pasta() {
  var achadas = DriveApp.getFoldersByName(PASTA);
  return achadas.hasNext() ? achadas.next() : DriveApp.createFolder(PASTA);
}

/** Grava ou substitui um arquivo pelo nome, dentro da pasta. */
function gravar(destino, nome, conteudo, tipo) {
  var existentes = destino.getFilesByName(nome);
  if (existentes.hasNext()) {
    existentes.next().setContent(conteudo);
  } else {
    destino.createFile(nome, conteudo, tipo);
  }
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var sessao = String(payload.sessionId || 'sem-id').replace(/[^A-Za-z0-9_-]/g, '');
    var base = 'teste-preciso-de-ajuda-' + sessao;
    var destino = pasta();

    gravar(destino, base + '.md', String(payload.md || ''), MimeType.PLAIN_TEXT);

    // O replay só é regravado quando vem junto: o beacon de saída não o carrega
    // (teto de 64KB do navegador) e sobrescrever com vazio perderia a sessão.
    if (payload.replay && payload.replay.length) {
      gravar(destino, base + '.json', JSON.stringify(payload), 'application/json');
    }

    return json({ ok: true, arquivo: base, eventos: (payload.replay || []).length });
  } catch (err) {
    // Nunca devolve erro para o lojista: quando isso roda, o teste dele já
    // acabou, e a página oferece o download do arquivo como saída.
    console.error(err);
    return json({ ok: false, erro: String(err) });
  }
}

/** Abrir a URL no navegador responde isto — serve de teste de vida. */
function doGet() {
  return json({ ok: true, servico: 'coleta do teste do Preciso de Ajuda', pasta: pasta().getName() });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
