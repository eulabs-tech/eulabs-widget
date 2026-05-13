# eulabs-widget

Código-fonte: [github.com/eulabs-tech/eulabs-widget](https://github.com/eulabs-tech/eulabs-widget).

Pacote npm com a classe **EulabsWidget** para embutir o formulário de busca em qualquer site ou framework (React, Vue, Angular, JS puro). O pacote carrega o CSS/JS do **runtime** que você configurar e delega as opções ao construtor exposto globalmente por esse script.

## Instalação

```bash
npm install eulabs-widget
```

## Uso (ESM)

```javascript
import EulabsWidget from 'eulabs-widget'

await new EulabsWidget({
  target: '#widget-eulabs-wrapper',
  assets: {
    cssUrl: 'https://exemplo.com/caminho/para/widget.min.css',
    jsUrl: 'https://exemplo.com/caminho/para/widget.min.js',
  },
  runtimeGlobal: 'NomeDoConstrutorNoWindow',
  theme: 'white',
  clientId: 10770,
  urlWL: 'https://seudominio.com.br/',
  urlAPI: 'https://seudominio.com.br/',
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

### Alternativa ao `runtimeGlobal`

Se preferir não expor o nome do construtor em string no bundle, use uma função:

```javascript
runtimeConstructor: () => window['NomeDoConstrutor'],
```

## Uso (HTML + UMD)

Inclua o arquivo gerado em `dist/eulabs-widget.umd.cjs` e use o global **EulabsWidget** (conforme saída do Vite para `lib.name`).

## Build da biblioteca

```bash
cd eulabs-widget
npm install
npm run build
```

Artefatos em `dist/`: módulo ES (`eulabs-widget.js`) e UMD (`eulabs-widget.umd.cjs`).

## Opções principais

| Opção | Descrição |
|--------|------------|
| `target` | Seletor CSS ou `Element` onde o widget será montado |
| `assets.cssUrl` | URL do CSS do runtime (opcional se `useDefaultCss: false`) |
| `assets.jsUrl` | URL do JS do runtime (**obrigatório**) |
| `runtimeGlobal` | Nome da função/classe no `window` após carregar o script |
| `runtimeConstructor` | Função que retorna o construtor (substitui `runtimeGlobal`) |
| `rootId` | Id do nó interno (padrão: `eulabs-widget-root`) |
| `cssVariables` | Objeto com `primary`, `secondary`, `primaryDark`, `transparentSecondary` aplicados em `:root` |
| Demais campos | Repassados ao runtime (`clientId`, `urlWL`, `urlAPI`, `labelTexts`, etc.) |

## SSR

Use apenas no navegador (código que roda após `document` existir). Em Next/Nuxt, importe dinamicamente com `ssr: false` ou chame dentro de `onMounted` / `useEffect`.
