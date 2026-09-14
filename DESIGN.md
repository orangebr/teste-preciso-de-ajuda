# Como este projeto foi desenhado

Escrito para ser reaproveitado: cole em `CLAUDE.md`, nas instruções de um
agente ou leia antes de pegar uma tela. As regras estão em forma imperativa, e
cada uma vem com o caso real deste repositório que a produziu — é o exemplo que
transfere, não o princípio solto.

---

## 1. Fidelidade vem do código, não do olho

**Ao replicar um produto, transcreva o CSS da fonte. Não olhe um print e
reproduza "parecido".**

A primeira versão deste teste foi feita de memória, olhando capturas. Ficou
feia e, pior, errada: media uma tela que não existe. A segunda foi feita
abrindo `primitive.ts`, `NewTicketWizard/styles.ts`, `chatStyles.ts`,
`DSButton`, `DSStepper`, `DSHelpButton`, `GlobalRadio*OptionList` e
`SideModalV3`, e copiando os valores.

Quando não há código — porque a tela é de terceiros ou o componente é remoto —
**meça no navegador**: `getComputedStyle` e `getBoundingClientRect` na página
rodando. Foi assim que saíram a grade de colunas da tabela de Vendas
(`24px 50px 80px 116px 156px 262px 80px 96px 128px 36px`) e a altura de 57px
da linha.

> Um teste de usabilidade que "melhora" um espaçamento deixa de testar o
> produto. A regra vale além de testes: qualquer réplica — protótipo, e-mail,
> documentação — perde a serventia quando diverge sem querer.

## 2. Toda divergência é deliberada e marcada

Duas coisas aqui **não** são iguais ao Partner: a confirmação antes de
descartar um chamado começado, e o contador do relato que mostra o mínimo de 50
em vez do teto de 500. As duas nasceram de evidência das sessões, estão
comentadas no código, listadas no `README.md` e foram avisadas a quem decide.

**Divergência não marcada é bug.** Se você mudou de propósito, escreva onde e
por quê, no código e para o dono do produto.

## 3. Meça; e quando errar duas vezes, remova a conta

O balão de dica caía no canto oposto ao que apontava. Tentei `getBoundingClientRect`
e errou. Ancorei pela direita e errou de novo. Atrasei a medição e errou uma
terceira vez — a pílula muda de largura no meio da animação e empurra o header
inteiro, então **não havia instante correto para medir**.

A correção foi apagar o cálculo: o balão virou filho do próprio lançador
(`position: absolute` dentro de um pai `relative`) e passou a andar colado nele
por construção.

> **Conserto estrutural vence conserto aritmético.** Se você está na segunda
> tentativa de acertar uma coordenada, o problema não é o número.

## 4. Declare o estado de repouso, nunca só na animação

Os dois ícones do "?" alternavam por keyframes, e a opacidade só existia
dentro deles. Com a animação desligada — economia de bateria,
`prefers-reduced-motion`, extensão — cada SVG assumia a opacidade padrão 1 e os
dois apareciam **empilhados**.

```css
/* errado: o repouso não existe */
svg:first-child { animation-name: swapOut }
svg:last-child  { animation-name: swapIn }

/* certo: o repouso está declarado; os keyframes só o sobrescrevem */
svg:first-child { opacity: 1; animation-name: swapOut }
svg:last-child  { opacity: 0; animation-name: swapIn }
```

Generalizando: **nenhuma propriedade visual pode ter a animação como única
fonte**. Vale para `transform`, `opacity`, `visibility` e para qualquer estado
que só apareça em `:hover` ou numa media query.

## 5. Desenhe o caminho que falha, não só o feliz

Cada integração tem um estado visível para quando não funciona:

| Falha | O que a pessoa vê |
| --- | --- |
| Coleta sem endpoint | aviso + botão de baixar o arquivo |
| CORS bloqueando a resposta | reenvio cego, e o aviso só se os dois falharem |
| GitHub limitando chamadas | o painel explica o limite e mantém o que já leu |
| Animação desligada | o "?" sozinho, sem empilhar |
| Tela pequena demais | empty state com o motivo e o link para copiar |

A pergunta a fazer em toda tela: **o que aparece quando isto não funcionar?**
Se a resposta for "nada" ou "trava", ainda não terminou.

## 6. Texto é material de design

- **Dê o motivo, não a regra.** "No celular a tabela não cabe, e a gente
  acabaria testando outra tela" funciona; "resolução não suportada" não.
- **Assuma a culpa quando é sua.** "a gente acabaria testando" em vez de "seu
  aparelho não atende".
- **Nomeie como a pessoa nomeia.** O lojista tem *chamado*, não *ticket*.
- **Todo beco sem saída ganha uma saída.** O empty state de celular tem
  "Copiar o link", porque quem está com o celular na mão quer mandar o endereço
  para si mesmo.
- **O botão diz o que acontece**, e a confirmação repete o mesmo verbo:
  "Descartar" → "Descartar este chamado?".

## 7. Dê altura definida a quem precisa de altura

O header da réplica subia junto com o scroll. A causa não era `position`: o
`#view-stage` não tinha altura, então o `height: 100%` do filho virava `auto`,
o conteúdo crescia além da janela e qualquer `scrollIntoView` arrastava a caixa
inteira.

> Em coluna flex ou grid, **`min-height: 0` no filho e altura definida no pai**
> são a diferença entre um painel que rola por dentro e um layout que escorrega.
> Sempre que "algo rola quando não devia", olhe a cadeia de alturas antes do
> `overflow`.

## 8. Verifique nos tamanhos que as pessoas têm

Uma sessão real chegou de **1366×633** — notebook com zoom. Nesse tamanho a
tabela pedia 357px de rolagem horizontal e o `NaN`, que é metade do defeito
plantado, ficava escondido atrás da barra. A pessoa não tinha como ver o
problema que a tarefa pede para relatar.

Os tamanhos vêm dos dados, não do seu monitor. Aqui o campo `janela` é gravado
em toda sessão justamente para isso.

## 9. Gráfico: forma primeiro, cor por último

1. **Qual é o trabalho do dado?** Magnitude → barra de uma cor só. Composição
   com polaridade → status. Um número que é a manchete → não é gráfico, é
   número grande.
2. **Cor por função**, não por gosto: categórica (identidade), sequencial
   (magnitude), divergente (polaridade), status (estado).
3. **Valide por script, não no olho.** O trio de status da Pigz
   (`#00AB50` / `#EBA417` / `#CC221F`) tem separação de ΔE 6,0 entre verde e
   amarelo em protanopia — faixa que só é legal com codificação secundária. Por
   isso toda fatia carrega nome e número, há 2px de folga entre elas e existe a
   mesma informação em tabela. Testei alternativas mais escuras e **falharam
   pior**; o número decidiu, não a impressão.
4. **Texto nunca veste a cor da série.** Rótulos e valores ficam na tinta
   normal; a cor mora na marca ao lado.

## 10. Painel é operado, documento é lido

O painel de resultados põe o resumo antes do detalhe, codifica estado em forma
além de cor (ponto verde/amarelo/vermelho **mais** o texto), e usa número
grande só onde o número é a manchete. Um documento faria o contrário: texto
corrido, hierarquia tipográfica, uma imagem por argumento.

Saber em qual dos dois você está muda todas as decisões seguintes.

## 11. O instrumento não pode contaminar a medida

Quando o teste dá uma dica para quem se perdeu, ele **registra que deu**. No
relatório, "achou sozinho" e "achou depois da dica" nunca viram a mesma coisa.
A dica também só aparece depois de 40s de silêncio, porque uma ajuda cedo
demais transformaria a resposta em nossa, não do lojista.

> Toda vez que a interface ajuda, pergunte: isso muda o que estou medindo? Se
> muda, guarde que ajudou.

## 12. Comentário explica por quê, não o quê

```js
/* O envio é text/plain de propósito: é o único Content-Type que o navegador
   trata como requisição simples. Com qualquer outro ele dispara um preflight
   OPTIONS, que o Apps Script não responde — e nada chegaria. */
```

O código já diz *o que* faz. O comentário guarda a decisão que você levaria
uma hora para redescobrir — inclusive as tentativas que falharam, que é o que
impede alguém de refazer o mesmo caminho.

## 13. Deixe a página inteira legível parada

Nada de conteúdo esperando scroll para aparecer. O primeiro quadro é o que vai
para a miniatura, para o link compartilhado e para quem só passa o olho. Aqui o
teste inteiro cabe numa tela de propósito: rolar tiraria o "?" do campo de
visão, e achar o "?" é metade do que se mede.

---

## Antes de dizer que terminou

- [ ] Os valores vêm do código-fonte ou de medição, não de memória
- [ ] Toda divergência proposital está comentada e avisada
- [ ] Nenhuma propriedade visual depende só de animação, `:hover` ou media query
- [ ] Cada integração tem um estado visível de falha
- [ ] Os textos dão motivo e oferecem saída
- [ ] A paleta passou pelo validador, e o WARN tem a codificação secundária
- [ ] Testado nos tamanhos reais dos dados, não só no seu monitor
- [ ] Abri no navegador e olhei — o validador confere cor, não geometria

## Sinais de que algo está errado

| Sintoma | Onde olhar |
| --- | --- |
| "Só falta acertar essa coordenada" | a estrutura, não o número (§3) |
| Dois elementos aparecem juntos "às vezes" | estado de repouso ausente (§4) |
| Algo rola e não deveria | cadeia de alturas, antes do `overflow` (§7) |
| Ficou bonito mas ninguém entende o dado | escolheu a cor antes da forma (§9) |
| Só quebra na máquina de alguém | tamanho ou modo que você não testou (§5, §8) |
