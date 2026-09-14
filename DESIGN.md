# Como este projeto foi desenhado

Escrito para ser reaproveitado: cole em `CLAUDE.md`, nas instruções de um
agente ou leia antes de pegar uma tela. As regras estão em forma imperativa, e
cada uma vem com o caso real deste repositório que a produziu — é o exemplo que
transfere, não o princípio solto.

**Parte I — de onde vem o olhar** (§1 a §5): referências, cor, minimalismo,
tipografia, movimento.
**Parte II — a disciplina** (§6 a §18): o que impede o resultado de desandar.

---

# Parte I — De onde vem o olhar

## 1. As referências, nomeadas

Nenhuma decisão visual aqui saiu do nada. Três fontes, em ordem de peso:

**O próprio Pigz Partner.** `global/theme/primitive.ts` deu a paleta inteira;
`SurveyDetail/styles.ts` deu o cartão de 16px com filete `#F0F0F0`, o título de
12px em `#676767`, o número de 40px com `letter-spacing: -1px` e o donut de
90px com recorte de 68%; `NewTicketWizard/styles.ts` e `chatStyles.ts` deram o
painel e o balão. Os comentários desses arquivos citam medidas de Figma — é a
fonte primária, e foi dela que copiei.

**Duas capturas que o Rodrigo mandou**: uma pesquisa de satisfação com trilho
branco à esquerda e uma pergunta por tela, e uma página de construtor de
formulário. Delas vieram duas decisões estruturais: o **trilho fixo** que diz
o tempo todo onde a pessoa está, e a **pergunta por tela** em vez do modal com
tudo de uma vez.

**O que o próprio produto já resolveu.** Antes de inventar um componente,
procurei um que já existisse: o aviso do relato usa a receita do `InvalidText`,
a pílula de resposta usa a do kanban do Gestão, o card de sugestão usa a do
`GlobalInfoContainer` amarelo. Quase toda "nova ideia" de UI já tem um
equivalente na casa — **procurar é mais barato e sai mais coerente do que
desenhar**.

> Quando citar uma referência, cite o arquivo e a linha. "Parecido com o
> Partner" não é referência; `SurveyDetail/styles.ts:150` é.

## 2. Cor: uma paleta, duas distribuições

O projeto tem duas camadas — o **palco** (a réplica do produto) e o
**laboratório** (apresentação, avaliação, painel). Elas precisam parecer
parentes e nunca ser confundidas. A solução não foi trocar de paleta, foi
trocar a **distribuição** da mesma paleta.

| | Palco | Laboratório |
| --- | --- | --- |
| Fundo | `#F2F2F4`, o cinza do Partner | branco |
| Laranja `#FA641E` | onde o produto usa | só no passo atual, na ação primária e no selecionado |
| Superfície escura | não existe | `#212121` na faixa e no balão de dica |

A **faixa preta** e o **balão de dica** usam `Neutral[900]` como superfície —
uma cor que o Partner nunca usa para fundo. É o sinal, sem legenda, de que
aquilo é a mão do teste e não o sistema. Quem olha entende em meio segundo, e
essa é a única função daquele preto.

**Quatro regras de cor que segui sem exceção:**

1. **Um acento só.** Laranja aparece no passo atual do trilho, no botão
   primário, no item selecionado e na marca. Em mais nada. Quando tudo é
   destaque, nada é.
2. **Status é reservado.** Verde `#00AB50`, amarelo `#EBA417` e vermelho
   `#CC221F` significam bom/atenção/ruim e **nunca** viram "a quarta cor da
   série". Se um gráfico precisar de uma quarta categoria, ela não é status.
3. **Neutro escolhido, não herdado.** Os cinzas vêm da rampa `Neutral` do
   produto (`#212121`, `#616161`, `#898888`, `#E0E0E0`), não de um `#999`
   qualquer. Cinza padrão de navegador denuncia que ninguém escolheu.
4. **Cor nunca carrega a informação sozinha.** Todo segmento de donut tem nome
   e número; toda linha da tabela tem o ponto **e** o texto.

E a decisão que mais me surpreendeu: **validei a paleta por script em vez de no
olho**. O trio de status tem separação de apenas ΔE 6,0 entre verde e amarelo
para protanopia. Testei duas alternativas mais escuras achando que
melhorariam — **as duas falharam pior**. Mantive o trio do produto e paguei o
preço com codificação secundária (rótulo, número, folga de 2px, tabela). A
impressão dizia uma coisa, o número dizia outra, e o número decidiu.

## 3. Minimalismo é remover, não arrumar

Minimalismo aqui nunca significou "deixar bonito e vazio". Significou **tirar
coisa até sobrar só o que a pessoa precisa naquele instante**.

O caso mais claro é a tela final. A primeira versão trazia o markdown cru, a
contagem de cliques, o protocolo, o tempo total e um aviso técnico de envio.
Nada daquilo é da conta do lojista — ele terminou, quer saber que valeu a pena
e ir embora. A versão atual tem título, uma frase, "pode fechar esta aba", e o
bloco de download **só quando o envio falha**, porque aí sim ele precisa agir.

As outras remoções, na mesma lógica:

- **Uma pergunta por tela** na avaliação, em vez de quatro empilhadas. A pessoa
  responde sem decidir por onde começar.
- **Filete em vez de cartão** na lista da apresentação. Borda, fundo, raio e
  sombra cada um diz "objeto separado"; gastar os quatro em tudo achata a
  hierarquia. Na apresentação, uma linha de 1px basta.
- **Sem ilustração decorativa.** A única arte do projeto é o desenho do empty
  state de celular, e ela existe porque explica o problema (tela grande × tela
  pequena) mais rápido do que a frase.
- **O trilho é quieto** — cinza, 13px, sem cor — justamente para o palco poder
  ser o produto inteiro, colorido e denso, sem competir.

> O teste de minimalismo não é "está limpo?". É **"o que aconteceria se eu
> tirasse isto?"**. Se a resposta for "nada", já era para ter saído.

E o espaço em branco é ferramenta, não sobra: as telas da avaliação são uma
pergunta grande no alto e muito ar embaixo. Esse ar é o que faz a pergunta
parecer respondível em cinco segundos.

## 4. Tipografia e números

**Uma família só: Poppins** — a do produto. Eu poderia ter separado o
laboratório com outra fonte, mas escolhi separar por **cor e peso**, que é uma
variável a menos para errar. Duas fontes num projeto pequeno quase sempre
viram ruído.

A escala saiu do produto e não foi inventada: `11 · 12 · 13 · 14 · 15 · 16 ·
20 · 30 · 34 · 40`. Pesos: 400 para corpo, 500 para rótulo e pergunta, 600 para
título e número grande. **Nada de 300 ou 700** — o produto não usa, e mais
pesos é mais chance de inconsistência.

Três detalhes que quase ninguém faz e que mudam a leitura:

- **`font-variant-numeric: tabular-nums`** em tudo que é número comparável:
  contador, cronômetro, tabela, KPI. Sem isso as colunas dançam a cada dígito.
- **`letter-spacing: -1px`** no número de 40px. Número grande com espaçamento
  normal parece esticado; é o que o Figma do Feedback já especificava.
- **`text-wrap: balance`** nos títulos. Evita a última linha com uma palavra
  sozinha, de graça.

Hierarquia por **peso e tamanho**, não por caixa. A pergunta do wizard é 14/500
e a resposta 14/400 — a diferença de um passo de peso é o que diz qual linha é
a pergunta. Antes as duas eram 500 e a lista lia como títulos empilhados.

## 5. Movimento só onde significa

Toda animação deste projeto responde a uma pergunta. As que não respondiam
foram cortadas.

| Animação | O que ela diz |
| --- | --- |
| Painel sobe do canto inferior direito, 380ms | "sou o balão que você acabou de abrir, virando formulário" |
| Blocos entram em cascata de 70ms | "leia nesta ordem" — e só na troca de passo |
| Pílula se apresenta aos 5s com estrelas | "existo, e sirvo para isto" |
| Ícones "?" e balão se alternando, ciclo de 7s | "do outro lado tem alguém" |

E o corte que importa: a cascata **rodava a cada clique**, porque eu
reconstruía o passo inteiro. O passo inteiro reaparecendo quando você marca um
rádio parece falha de renderização, não transição. Ficou preso a uma classe que
só entra quando o passo muda de verdade.

Três regras:

- **Curva única**, `cubic-bezier(0.32, 0.72, 0, 1)`, a do produto. Sai rápido e
  assenta devagar; misturar curvas é o que faz uma interface parecer montada
  por gente diferente.
- **Animação com fim conta as voltas.** As estrelas rodam duas vezes com
  `both`, e a pílula só recolhe depois — cortar no meio parecia bug.
- **`prefers-reduced-motion` desliga tudo**, e o estado de repouso continua
  correto sozinho (§9).

---

# Parte II — A disciplina

## 6. Fidelidade vem do código, não do olho

**Ao replicar um produto, transcreva o CSS da fonte. Não olhe um print e
reproduza "parecido".**

A primeira versão deste teste foi feita de memória, olhando capturas. Ficou
feia e, pior, errada: media uma tela que não existe. A segunda foi feita
abrindo os arquivos citados em §1 e copiando os valores.

Quando não há código — tela de terceiros, componente remoto — **meça no
navegador**: `getComputedStyle` e `getBoundingClientRect` na página rodando.
Foi assim que saíram a grade de colunas da tabela de Vendas
(`24px 50px 80px 116px 156px 262px 80px 96px 128px 36px`) e a altura de 57px
da linha.

## 7. Toda divergência é deliberada e marcada

Duas coisas aqui **não** são iguais ao Partner: a confirmação antes de
descartar um chamado começado, e o contador do relato que mostra o mínimo de 50
em vez do teto de 500. As duas nasceram de evidência das sessões, estão
comentadas no código, listadas no `README.md` e foram avisadas a quem decide.

**Divergência não marcada é bug.**

## 8. Meça; e quando errar duas vezes, remova a conta

O balão de dica caía no canto oposto ao que apontava. Tentei
`getBoundingClientRect` e errou. Ancorei pela direita e errou de novo. Atrasei a
medição e errou de novo — a pílula muda de largura no meio da animação e empurra
o header inteiro, então **não havia instante correto para medir**.

A correção foi apagar o cálculo: o balão virou filho do próprio lançador
(`absolute` dentro de um pai `relative`) e passou a andar colado por construção.

> **Conserto estrutural vence conserto aritmético.** Se você está na segunda
> tentativa de acertar uma coordenada, o problema não é o número.

## 9. Declare o estado de repouso, nunca só na animação

```css
/* errado: o repouso não existe */
svg:first-child { animation-name: swapOut }
svg:last-child  { animation-name: swapIn }

/* certo: o repouso está declarado; os keyframes só o sobrescrevem */
svg:first-child { opacity: 1; animation-name: swapOut }
svg:last-child  { opacity: 0; animation-name: swapIn }
```

Com a animação desligada — economia de bateria, `prefers-reduced-motion`,
extensão — cada SVG assumia a opacidade padrão 1 e os dois apareciam
**empilhados**. **Nenhuma propriedade visual pode ter a animação como única
fonte**; vale também para o que só existe em `:hover` ou dentro de media query.

## 10. Desenhe o caminho que falha

| Falha | O que a pessoa vê |
| --- | --- |
| Coleta sem endpoint | aviso + botão de baixar o arquivo |
| CORS bloqueando a resposta | reenvio cego, e o aviso só se os dois falharem |
| GitHub limitando chamadas | o painel explica o limite e mantém o que já leu |
| Animação desligada | o "?" sozinho, sem empilhar |
| Tela pequena demais | empty state com o motivo e o link para copiar |

**O que aparece quando isto não funcionar?** Se a resposta for "nada" ou
"trava", ainda não terminou.

## 11. Texto é material de design

- **Dê o motivo, não a regra.** "No celular a tabela não cabe, e a gente
  acabaria testando outra tela" funciona; "resolução não suportada" não.
- **Assuma a culpa quando é sua.** "a gente acabaria testando" em vez de "seu
  aparelho não atende".
- **Nomeie como a pessoa nomeia.** O lojista tem *chamado*, não *ticket*.
- **Todo beco sem saída ganha uma saída.** O empty state de celular tem
  "Copiar o link".
- **O botão diz o que acontece**, e a confirmação repete o verbo:
  "Descartar" → "Descartar este chamado?".

## 12. Dê altura definida a quem precisa de altura

O header da réplica subia junto com o scroll. A causa não era `position`: o
`#view-stage` não tinha altura, o `height: 100%` do filho virava `auto`, o
conteúdo crescia além da janela e qualquer `scrollIntoView` arrastava a caixa
inteira.

> Em coluna flex ou grid, **`min-height: 0` no filho e altura definida no pai**.
> Sempre que "algo rola quando não devia", olhe a cadeia de alturas antes do
> `overflow`.

## 13. Verifique nos tamanhos que as pessoas têm

Uma sessão real chegou de **1366×633** — notebook com zoom. Ali a tabela pedia
357px de rolagem horizontal e o `NaN`, metade do defeito plantado, ficava atrás
da barra. Os tamanhos vêm dos dados, não do seu monitor.

## 14. Gráfico: forma primeiro, cor por último

1. **Qual é o trabalho do dado?** Magnitude → barra de uma cor. Composição com
   polaridade → status. Manchete → não é gráfico, é número grande.
2. **Cor por função:** categórica, sequencial, divergente, status.
3. **Valide por script** (§2).
4. **Texto nunca veste a cor da série.**

## 15. Painel é operado, documento é lido

O painel põe resumo antes de detalhe, codifica estado em forma além de cor
(ponto **mais** texto) e usa número grande só onde o número é a manchete. Um
documento faz o contrário. Saber em qual dos dois você está muda tudo depois.

## 16. O instrumento não pode contaminar a medida

Quando o teste dá uma dica, ele **registra que deu**. "Achou sozinho" e "achou
depois da dica" nunca viram a mesma coisa. A dica também só aparece depois de
40s, porque ajuda cedo demais transforma a resposta em nossa.

## 17. Comentário explica por quê, não o quê

```js
/* O envio é text/plain de propósito: é o único Content-Type que o navegador
   trata como requisição simples. Com qualquer outro ele dispara um preflight
   OPTIONS, que o Apps Script não responde — e nada chegaria. */
```

O código já diz *o que* faz. O comentário guarda a decisão — inclusive as
tentativas que falharam, que é o que impede alguém de refazer o caminho.

## 18. Deixe a página inteira legível parada

Nada esperando scroll para aparecer. O primeiro quadro é o que vai para a
miniatura, para o link compartilhado e para quem passa o olho. Aqui o teste
inteiro cabe numa tela: rolar tiraria o "?" do campo de visão, e achar o "?" é
metade do que se mede.

---

## Antes de dizer que terminou

- [ ] As referências estão nomeadas com arquivo, não com "parecido com"
- [ ] Um acento só; status reservado; nenhuma informação só na cor
- [ ] Tirei tudo que, removido, não faria falta
- [ ] Uma família tipográfica, escala do produto, `tabular-nums` nos números
- [ ] Toda animação responde a uma pergunta
- [ ] Os valores vêm do código-fonte ou de medição, não de memória
- [ ] Toda divergência proposital está comentada e avisada
- [ ] Nada visual depende só de animação, `:hover` ou media query
- [ ] Cada integração tem um estado visível de falha
- [ ] Os textos dão motivo e oferecem saída
- [ ] A paleta passou pelo validador, e o WARN tem codificação secundária
- [ ] Testado nos tamanhos reais dos dados
- [ ] Abri no navegador e olhei — validador confere cor, não geometria

## Sinais de que algo está errado

| Sintoma | Onde olhar |
| --- | --- |
| "Ficou meio sem graça, vou colorir mais" | acento demais; o problema é hierarquia (§2, §4) |
| "Está poluído" | some com coisa antes de reorganizar (§3) |
| "Só falta acertar essa coordenada" | a estrutura, não o número (§8) |
| Dois elementos aparecem juntos "às vezes" | estado de repouso ausente (§9) |
| Algo rola e não deveria | cadeia de alturas, antes do `overflow` (§12) |
| Bonito, mas ninguém entende o dado | escolheu a cor antes da forma (§14) |
| Só quebra na máquina de alguém | tamanho ou modo não testado (§10, §13) |
