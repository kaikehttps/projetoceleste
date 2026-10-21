<p align="center">
  <img src="public/og-image.png" alt="Projeto Celeste — Deadlock Fã Dublado em PT-BR" width="100%" />
</p>

<h1 align="center">✦ Duas vozes. Um universo que nunca dorme. ✦</h1>

<p align="center">
  <em>Uma cidade amaldiçoada. Duas vozes. Uma nova interpretação.</em><br />
  Fã dublagem independente de <strong>Deadlock</strong> em português brasileiro, por <strong>Kaike Alves</strong>.
</p>

---

São três da manhã em Nova York. A névoa sobe do asfalto, um trem passa lá em cima no elevado e, numa
rua que não aparece no mapa, uma loja continua com a luz acesa. Do outro lado da cidade, uma urna velha
espera alguém para carregá-la… e ela **não para de falar**.

Este repositório é essa noite. Uma página feita para apresentar ao
**Projeto Celeste — Deadlock Fã Dublado em PT-BR** duas interpretações de personagens que não são
heróis, mas sempre roubam a cena:

| | Registro | Personagem | Gravações |
| :-: | --- | --- | --- |
| 🕯️ | **Nº 001** | **O Vendedor** · *The Shopkeeper* | 1 gravação com 7 interações (Abrams, Yamato, Dynamo, Lash, McGinnis, Paradox, Haze) |
| ⚱️ | **Nº 002** | **A Urna Espiritual** · *Soul Urn* | 7 falas, incluindo interações com Abrams, Drifter, Vyper, Mina e… **Celeste** |

Além delas, há uma gravação de apresentação e outra de despedida, na minha própria voz.

---

## ✦ O que tem nessa cidade

**🌃 Uma capa de cinema.** Skyline art déco gerado por código, holofotes de estreia, trem elevado,
névoa que deriva e uma lua que é a pupila de um olho que vigia a cidade (presta atenção no céu).

**📁 Um arquivo secreto.** A apresentação é uma ficha de papel envelhecido, com clipe, carimbo e a
gravura de um microfone de carvão dos anos 20.

**🕯️ Uma loja escondida.** Vitrine com letreiro dourado, frascos brilhando e uma lâmpada que
**acende conforme a voz do Vendedor**.

**⚱️ Uma rua que some no escuro.** Perspectiva real com ponto de fuga e postes desaparecendo na névoa.
Quando a Urna fala, ela brilha e as **almas começam a orbitar**.

**🌙 Dia e noite.** O tema escuro é a madrugada. O claro é a mesma cidade ao amanhecer, em papel e
tinta arroxeada.

### Os players

Nada de player padrão do navegador. Cada um foi desenhado para o seu cenário (latão na loja, vidro
espectral na Urna, tinta no papel do dossiê), e todos têm:

- waveform calculada a partir do próprio áudio, com clique e arraste para buscar
- atalhos de capítulo para pular direto para cada herói
- controle total pelo teclado (`←` `→` `Home` `End` `Espaço`)
- **uma voz por vez**: dar play numa gravação pausa a outra
- mini player flutuante que aparece quando você rola para longe
- zero autoplay. A cidade espera você apertar o play.

---

## ✦ Acendendo as luzes

```bash
npm install
npm run dev       # abre em http://localhost:5173
npm run build     # gera a pasta dist/
npm run preview   # testa o build
```

O `dist/` roda em qualquer hospedagem estática (Netlify, Vercel, GitHub Pages, itch.io…), até dentro
de subpastas, porque os caminhos são relativos.

**Stack:** React 19 · TypeScript · Vite · CSS puro com tokens · Lucide · fontes locais (Bodoni Moda,
Fraunces, Instrument Sans e Big Shoulders). Nada é carregado de servidores externos.

---

## ✦ Onde mexer

| Quero mudar… | Arquivo |
| --- | --- |
| Link do Projeto Celeste e meus contatos | `src/config.ts` |
| Títulos das falas e capítulos | `src/data/recordings.ts` |
| Cores, fontes e espaçamentos dos dois temas | `src/styles/tokens.css` |
| Textos de cada seção | `src/sections/*.tsx` |

> Campo vazio em `src/config.ts` não aparece no site. O botão **"Conhecer o Projeto Celeste"** só
> surge quando o link estiver preenchido.

---

## ✦ Os arquivos de voz

Os originais moram em `TESTE DUBLAGEM/` e nunca são alterados. Antes de entrar no site, cada
gravação foi ouvida (transcrita) para confirmar de quem era a voz. Nenhum arquivo foi associado a um
personagem só pelo nome.

| Original | Vira | Aparece em |
| --- | --- | --- |
| `MEAPRESENTANDO.m4a` | `audio/apresentacao.m4a` | Por trás dessas vozes |
| `vendedor.m4a` | `audio/vendedor.m4a` | Registro Nº 001 |
| `Recording (5)` → `(11).m4a` | `audio/urna-01` → `urna-07.m4a` | Registro Nº 002 |
| `MEDESPEDINDO.m4a` | `audio/despedida.m4a` | Epílogo |
| `Recording (2).m4a` | — | ficou de fora: é só um "Oi!" de teste de microfone |

Os capítulos foram conferidos com as falas originais na [Deadlock Wiki](https://deadlock.wiki/Shopkeeper).

### Gravou uma fala nova?

1. Solte o arquivo em `TESTE DUBLAGEM/`.
2. Adicione ele no mapa `FILES` de `scripts/prepare-audio.mjs`.
3. Rode (precisa de [ffmpeg](https://ffmpeg.org/)):

   ```bash
   FFMPEG_PATH=/caminho/para/ffmpeg npm run audio
   ```

   O script copia o áudio para `public/audio/` **sem recodificar**: o som sai idêntico, só fica
   pronto para tocar mais rápido. Ele também mede a duração e desenha a waveform e o "envelope" de
   intensidade que faz a lâmpada e a Urna reagirem à voz.
4. Registre a faixa em `src/data/recordings.ts`.

---

## ✦ Bastidores da arte

- **Logo do Projeto Celeste:** extraída do banner original para fundo transparente, pixel a pixel,
  **sem redesenho** (`scripts/extract-logo.py`). No tema claro entra a mesma forma em tinta escura.
- **Névoa, papel e granulação:** gerados por ruído procedural em `scripts/generate-textures.py`.
- **Cidade, loja e rua:** SVG original em `src/components/art/`. Não são artes oficiais do jogo, e a
  página diz isso.
- **Urna:** imagem enviada pelo Kaike (`src/assets/art/`), com aura, anéis arcanos e almas
  desenhados em volta.

---

<p align="center">
  <sub>
    ✦ Projeto independente de fã, sem vínculo oficial ou patrocínio da Valve ou do Projeto Celeste.<br />
    Deadlock, seus personagens e demais propriedades intelectuais pertencem aos respectivos titulares. ✦
  </sub>
</p>

<p align="center"><em>A voz é sua. A próxima cena também.</em></p>
