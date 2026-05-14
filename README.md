# eulabs-widget

Código-fonte: [github.com/eulabs-tech/eulabs-widget](https://github.com/eulabs-tech/eulabs-widget).

Pacote npm com a classe **EulabsWidget** para embutir o formulário de busca em qualquer site ou framework (React, Vue, Angular, JS puro). O **JS e o CSS vão no próprio bundle** (`import` em ESM / UMD); não é necessário outro servidor nem `assets.jsUrl`. Opcionalmente pode carregar um runtime externo (script no `window`) se passar `assets.jsUrl` e `runtimeGlobal` (ou `runtimeConstructor`).

## Instalação

```bash
npm install eulabs-widget
```

### Vue.js (Vue 3 + Vite)

1. Instale o pacote (comando acima).
2. Importe o CSS do bundle (o estilo não vem automaticamente só pelo `import` da classe em muitos projetos):

```javascript
import 'eulabs-widget/dist/eulabs-widget.css'
```

3. Monte o widget num elemento do DOM após o componente estar montado e destrua-o ao sair (evita duplicar o formulário e liberta listeners).

Exemplo com **Composition API** (`<script setup>`):

```vue
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import EulabsWidget from 'eulabs-widget'
import 'eulabs-widget/dist/eulabs-widget.css'

const host = ref(null)
let widget = null

onMounted(async () => {
  if (!host.value) return
  widget = await new EulabsWidget({
    target: host.value,
    clientId: 10770,
    urlWL: 'https://www.eucatur.com.br/',
    urlAPI: 'https://api-v4.eucatur.com.br/sectionals?is_road_station=true',
    orientation: 'vertical',
  }).init()
})

onBeforeUnmount(() => {
  widget?.destroy()
  widget = null
})
</script>

<template>
  <div ref="host" />
</template>
```

**Nuxt 3:** o widget precisa do `document`. Envolva o markup em [`<ClientOnly>`](https://nuxt.com/docs/api/components/client-only) e mantenha a mesma lógica em `onMounted` / `onBeforeUnmount`, ou importe `eulabs-widget` só no cliente (`import()` dinâmico dentro de `onMounted`). Não execute `init()` durante o render no servidor.

### React (Vite / CRA)

1. Instale o pacote (comando acima).
2. Importe o CSS:

```javascript
import 'eulabs-widget/dist/eulabs-widget.css'
```

3. Use um `ref` no contentor e `useEffect` com função de limpeza que chama `destroy()` no `EulabsWidget`.

```jsx
import { useEffect, useRef } from 'react'
import EulabsWidget from 'eulabs-widget'
import 'eulabs-widget/dist/eulabs-widget.css'

export function EulabsBusca() {
  const hostRef = useRef(null)

  useEffect(() => {
    const el = hostRef.current
    if (!el) return undefined

    let cancelled = false
    let w = null

    ;(async () => {
      w = await new EulabsWidget({
        target: el,
        clientId: 10770,
        urlWL: 'https://www.eucatur.com.br/',
        urlAPI: 'https://api-v4.eucatur.com.br/sectionals?is_road_station=true',
        orientation: 'vertical',
      }).init()
      if (cancelled) w.destroy()
    })()

    return () => {
      cancelled = true
      w?.destroy()
    }
  }, [])

  return <div ref={hostRef} />
}
```

**Next.js:** use o mesmo padrão dentro de um componente com [`'use client'`](https://nextjs.org/docs/app/building-your-application/rendering/client-components) e, se necessário, `dynamic(..., { ssr: false })` para não avaliar o módulo no servidor.

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
  cssVariables: {
    primary: '#253040',
    secondary: '#253040',
    primaryDark: '#f4c5b8',
    transparentSecondary: '#2530401A',
  },
  labelTexts: {
    origin: 'Origem',
    destination: 'Destino',
    departureDate: 'Data da ida',
    returnDate: 'Data da volta',
    search: 'Pesquisar viagens',
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
  // gratuity omitido → usa `widget.js` (por defeito `enable: false`, sem select no HTML).
  // Para mostrar: gratuity: { enable: true, errorMessage: '...', optionList: [...] },
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

## Desenvolvimento (sem build)

```bash
npm install
npm run dev
# ou: yarn dev
```

Abre o endereço indicado no terminal (ex.: `http://localhost:5173/`): o [`index.html`](index.html) importa [`dev/dev-entry.js`](dev/dev-entry.js), que usa o código em **`src/`** com hot reload. A API usa o **proxy** `/api-eucatur` (ver [`vite.config.js`](vite.config.js)) para evitar CORS em desenvolvimento. O arquivo estático [`demo.html`](demo.html) continua disponível em `/demo.html` para testar o UMD/CSS do `dist/` após `npm run build` (aí a API precisa permitir CORS no browser ou usar o mesmo host com proxy no seu servidor).

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
| `cssVariables` | `primary`, `secondary`, `primaryDark`, `transparentSecondary` → aplicados em `:root` e usados pelo runtime embutido (ícones, rádios, bordas, botão) |
| `orientation` | `'vertical'` (padrão) ou `'horizontal'`: layout responsivo do runtime embutido |
| `target` | Seletor CSS ou `Element` onde o widget será montado |
| `assets.cssUrl` | Só com runtime externo: URL extra de CSS (opcional se `useDefaultCss: false`) |
| `assets.jsUrl` | Se vazio, usa runtime **embutido**. Se preenchido, carrega esse script e exige `runtimeGlobal` ou `runtimeConstructor` |
| `runtimeGlobal` | Com `assets.jsUrl`: nome em `window` do construtor após o script carregar |
| `runtimeConstructor` | Função que retorna o construtor (substitui `runtimeGlobal`; também pode ser usada sozinha com runtime embutido se quiseres outra classe) |
| `rootId` | Id do nó interno (padrão: `eulabs-widget-root`) |
| `urlWL` | URL base do **front** (site / white-label): redirecionamentos e contexto do widget |
| `urlAPI` | URL da **API** (back): dados de seccionamentos, origens/destinos, etc. |
| `clientId` | Identificador do cliente no ecossistema Eulabs |
| Outros campos | `theme`, `labelTexts`, `tracking`, … repassados ao runtime. **`gratuity.enable`**: no runtime embutido tem de ser **`true`** (booleano) para o select de gratuidade aparecer; com `false` ou omitido o bloco não é renderizado. |

## SSR

Use apenas no navegador (código que roda após `document` existir). Em Next/Nuxt, importe dinamicamente com `ssr: false` ou chame dentro de `onMounted` / `useEffect`.
