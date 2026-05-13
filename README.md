# eulabs-widget

Código-fonte: [github.com/eulabs-tech/eulabs-widget](https://github.com/eulabs-tech/eulabs-widget).

Pacote npm com a classe **EulabsWidget** para embutir o formulário de busca em qualquer site ou framework (React, Vue, Angular, JS puro). Por defeito o **JS e o CSS vão no próprio bundle** (`import` em ESM / UMD); não é necessário outro servidor nem `assets.jsUrl`. Opcionalmente pode carregar um runtime externo (script no `window`) se passar `assets.jsUrl` e `runtimeGlobal` (ou `runtimeConstructor`).

## Instalação

```bash
npm install eulabs-widget
```

## Página de demonstração

O arquivo [`demo.html`](demo.html) usa apenas `./dist/eulabs-widget.css` e `./dist/eulabs-widget.umd.js` (runtime embutido). Rode `npm run build` e `npx serve .` na raiz e abra `/demo.html` (evite `file://`: caminhos relativos ao `./dist/` falham).

## Uso (ESM) — modo embutido (padrão)

```javascript
import EulabsWidget from 'eulabs-widget'

await new EulabsWidget({
  target: '#widget-eulabs-wrapper',
  theme: 'white',
  clientId: 10770,
  urlWL: 'https://www.eucatur.com.br/',
  urlAPI: 'https://api-v4.eucatur.com.br/sectionals?is_road_station=true',
  orientation: 'vertical',
  labelTexts: {
    origin: 'Origem?',
    destination: 'Para onde?',
    departureDate: 'Ida',
    returnDate: 'Volta',
    search: 'Buscar',
    toggle_go: 'Somente ida',
    toggle_go_and_back: 'Ida e volta',
  },
  calendarReposition: true,
  calendarNumberMonths: 2,
  useDefaultCss: true,
  customCss: null,
  customHeading: { enable: false, tag: null, content: null },
  tracking: { source: 'undefined', medium: 'undefined', campaign: 'undefined' },
  customOutput: { enable: false, parameter: '', where: 'after' },
  hasRadioButtons: true,
  gratuity: {
    enable: true,
    errorMessage: 'Consulta de gratuidade somente para viagens de ida',
    optionList: [
      { default: true, label: 'Passagem comum', value: 'common' },
      { default: false, label: 'Passagem com benefício', value: 'gratuity' },
    ],
  },
}).init()
```

O UI mínimo fica em `src/bundled-runtime.js` (podes substituir pela integração completa).

## Runtime externo (opcional)

Se definires `assets.jsUrl`, o pacote injeta esse script e usa o construtor em `window`:

```javascript
const base = typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
  ? import.meta.env.BASE_URL
  : '/'

await new EulabsWidget({
  target: '#widget-eulabs-wrapper',
  assets: {
    cssUrl: `${base}eulabs-runtime/widget.min.css`,
    jsUrl: `${base}eulabs-runtime/widget.min.js`,
  },
  runtimeGlobal: 'NomeDoConstrutorNoWindow',
  // …mesmas opções de cliente
}).init()
```

Ou `runtimeConstructor: () => window['NomeDoConstrutor']` em vez de `runtimeGlobal`.

## Uso (HTML + UMD)

Inclua `dist/eulabs-widget.umd.js` e `dist/eulabs-widget.css` e use o global **EulabsWidget**.

## Build da biblioteca

```bash
cd eulabs-widget
npm install
npm run build
```

Artefatos em `dist/`: módulo ES (`eulabs-widget.js`), UMD (`eulabs-widget.umd.js`) e CSS (`eulabs-widget.css`).

## Opções principais

| Opção | Descrição |
|--------|------------|
| `target` | Seletor CSS ou `Element` onde o widget será montado |
| `assets.cssUrl` | Só com runtime externo: URL extra de CSS (opcional se `useDefaultCss: false`) |
| `assets.jsUrl` | Se vazio, usa runtime **embutido**. Se preenchido, carrega esse script e exige `runtimeGlobal` ou `runtimeConstructor` |
| `runtimeGlobal` | Com `assets.jsUrl`: nome em `window` do construtor após o script carregar |
| `runtimeConstructor` | Função que retorna o construtor (substitui `runtimeGlobal`; também pode ser usada sozinha com runtime embutido se quiseres outra classe) |
| `rootId` | Id do nó interno (padrão: `eulabs-widget-root`) |
| `cssVariables` | `primary`, `secondary`, `primaryDark`, `transparentSecondary` em `:root` |
| Demais campos | Repassados ao runtime (`clientId`, `urlWL`, `urlAPI`, `labelTexts`, etc.) |

## SSR

Use apenas no navegador (código que roda após `document` existir). Em Next/Nuxt, importe dinamicamente com `ssr: false` ou chame dentro de `onMounted` / `useEffect`.


https://cdn.jsdelivr.net/npm/eulabs-widget@1.0.3/dist/