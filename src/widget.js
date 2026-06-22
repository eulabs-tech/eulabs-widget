import './style.css'
import BundledRuntime from './bundled-runtime.js'
import { loadCss, loadScript, mergeDeep, resolveTarget } from './utils.js'

const DEFAULT_ROOT_ID = 'eulabs-widget-root'

/**
 * @typedef {object} RuntimeInstance
 * @property {() => void} [start]
 * @property {() => void} [init]
 * @property {() => void} [destroy]
 */

const DEFAULT_OPTIONS = {
  theme: 'white',
  orientation: 'vertical',
  labelTexts: {
    origin: 'Origem',
    destination: 'Destino',
    departureDate: 'Data da ida',
    returnDate: 'Data da volta',
    search: 'Pesquisar viagens',
    toggle_go: 'Somente ida',
    toggle_go_and_back: 'Ida e volta',
    clear_origin: 'Limpar origem',
    clear_destination: 'Limpar destino',
  },
  calendarReposition: true,
  calendarNumberMonths: 2,
  useDefaultCss: true,
  customCss: null,
  customHeading: {
    enable: false,
    tag: null,
    content: null,
  },
  tracking: {
    source: 'undefined',
    medium: 'undefined',
    campaign: 'undefined',
  },
  customOutput: {
    enable: false,
    parameter: '',
    where: 'after',
  },
  hasRadioButtons: true,
  gratuity: {
    enable: false,
    errorMessage: 'Consulta de gratuidade somente para viagens de ida',
    optionList: [
      { default: true, label: 'Passagem comum', value: 'common' },
      { default: false, label: 'Passagem com benefício', value: 'gratuity' },
    ],
  },
  assets: {
    cssUrl: '',
    jsUrl: '',
  },
  rootId: DEFAULT_ROOT_ID,
  cssVariables: {
    primary: '#1e9755',
    secondary: '#1e9755',
    primaryDark: '#1e9755',
    transparentSecondary: '#1e97551A',
  },
}

export default class EulabsWidget {
  /**
   * @param {Record<string, unknown>} [options]
   */
  constructor(options = {}) {
    this.options = mergeDeep(structuredClone(DEFAULT_OPTIONS), options)
    /** @type {RuntimeInstance | null} */
    this.instance = null
    /** @type {Element | null} */
    this._mountEl = null
    /** @type {Element | null} */
    this._targetEl = null
  }

  /**
   * Inicializa o widget (carrega assets, monta e liga o runtime).
   * @returns {Promise<EulabsWidget>}
   */
  init() {
    return this.bootstrap()
  }

  /**
   * @returns {Promise<EulabsWidget>}
   */
  async bootstrap() {
    await this.loadAssets()
    this.render()
    this.applyCssVariables()
    this.bind()
    return this
  }

  /**
   * @param {Element} [scope]
   */
  applyCssVariables(scope) {
    const cv = this.options.cssVariables
    if (!cv || typeof cv !== 'object') return
    const root = scope ?? this._targetEl ?? document.documentElement
    const normalized = {
      primary: normalizeCssValue(cv.primary),
      secondary: normalizeCssValue(cv.secondary),
      primaryDark: normalizeCssValue(cv.primaryDark),
      transparentSecondary: resolveTransparentSecondary(cv.transparentSecondary, cv.secondary),
    }
    const map = [
      ['primary', '--primary'],
      ['secondary', '--secondary'],
      ['primaryDark', '--primaryDark'],
      ['transparentSecondary', '--transparentSecondary'],
    ]
    for (const [key, prop] of map) {
      if (normalized[key] !== '') root.style.setProperty(prop, normalized[key])
    }
    if (normalized.primary !== '') {
      root.style.setProperty('--input-focus-border-color', normalized.primary)
    }
    if (normalizeCssValue(cv.submitHover) !== '') {
      root.style.setProperty('--submit-button-background-color-hover', normalizeCssValue(cv.submitHover))
    }
  }

  async loadAssets() {
    const assets = this.options.assets
    const cssUrl = typeof assets?.cssUrl === 'string' ? assets.cssUrl : ''
    const jsUrl = typeof assets?.jsUrl === 'string' ? assets.jsUrl : ''
    if (this.options.useDefaultCss !== false && cssUrl) {
      await loadCss(cssUrl)
    }
    if (jsUrl) {
      await loadScript(jsUrl)
    }
  }

  render() {
    const target = resolveTarget(/** @type {string | Element} */ (this.options.target))
    this._targetEl = target
    const rootId = typeof this.options.rootId === 'string' ? this.options.rootId : DEFAULT_ROOT_ID
    target.innerHTML = `<div id="${rootId}" class="eulabs-widget-root"></div>`
    this._mountEl = document.getElementById(rootId)

    const Runtime = this.resolveRuntimeConstructor()
    const selector = `#${rootId}`

    const payload = {
      target: selector,
      theme: this.options.theme,
      clientId: this.options.clientId,
      urlWL: this.options.urlWL,
      urlAPI: this.options.urlAPI,
      orientation: this.options.orientation,
      labelTexts: this.options.labelTexts,
      calendarReposition: this.options.calendarReposition,
      calendarNumberMonths: this.options.calendarNumberMonths,
      useDefaultCss: this.options.useDefaultCss,
      customCss: this.options.customCss,
      customHeading: this.options.customHeading,
      tracking: this.options.tracking,
      customOutput: this.options.customOutput,
      hasRadioButtons: this.options.hasRadioButtons,
      gratuity: this.options.gratuity,
    }

    this.instance = new Runtime(payload)

    if (
      document.readyState === 'complete' &&
      this.instance &&
      typeof this.instance.start === 'function'
    ) {
      this.instance.start()
    } else if (this.instance && typeof this.instance.init === 'function') {
      this.instance.init()
    }
  }

  resolveRuntimeConstructor() {
    if (typeof this.options.runtimeConstructor === 'function') {
      const Ctor = this.options.runtimeConstructor()
      if (typeof Ctor === 'function') return Ctor
    }
    const jsUrl = typeof this.options.assets?.jsUrl === 'string' ? this.options.assets.jsUrl : ''
    if (!jsUrl) {
      return /** @type {new (opts: object) => RuntimeInstance} */ (BundledRuntime)
    }
    const name = this.options.runtimeGlobal
    if (typeof name === 'string' && name && typeof window[/** @type {keyof Window} */ (name)] === 'function') {
      return /** @type {new (opts: object) => RuntimeInstance} */ (window[/** @type {keyof Window} */ (name)])
    }
    throw new Error(
      'EulabsWidget: com assets.jsUrl definido, informe options.runtimeGlobal ou options.runtimeConstructor.',
    )
  }

  bind() {
    // Ponto de extensão: eventos, telemetria, integrações.
  }

  destroy() {
    if (this.instance && typeof this.instance.destroy === 'function') {
      this.instance.destroy()
    }
    this.instance = null
    this._mountEl = null
    if (this._targetEl) {
      this._targetEl.innerHTML = ''
      this._targetEl = null
    }
  }
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function normalizeCssValue(value) {
  return value == null ? '' : String(value).trim()
}

/**
 * `transparentSecondary` precisa ser translúcido; se vier opaco, deriva a partir de `secondary`.
 * @param {unknown} transparentSecondary
 * @param {unknown} secondary
 * @returns {string}
 */
function resolveTransparentSecondary(transparentSecondary, secondary) {
  const explicit = normalizeCssValue(transparentSecondary)
  if (!explicit) {
    const base = normalizeCssValue(secondary)
    return base ? `color-mix(in srgb, ${base} 10%, transparent)` : ''
  }
  if (
    /^#([0-9a-f]{4}|[0-9a-f]{8})$/i.test(explicit) ||
    /^rgba?\(/i.test(explicit) ||
    /^hsla?\(/i.test(explicit) ||
    /^color-mix\(/i.test(explicit)
  ) {
    return explicit
  }
  return `color-mix(in srgb, ${explicit} 10%, transparent)`
}
