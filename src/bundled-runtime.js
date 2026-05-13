/**
 * Runtime embutido no pacote (sem carregar script externo).
 * Amplie este arquivo quando integrar o DOM completo do widget.
 */

export default class EulabsBundledRuntime {
  /** @param {Record<string, unknown>} options */
  constructor(options) {
    this.options = options
    /** @type {boolean} */
    this._mounted = false
  }

  /** @returns {void} */
  _mount() {
    if (this._mounted) return
    const sel = /** @type {string} */ (this.options.target)
    const root = document.querySelector(sel)
    if (!root) return

    const lt = /** @type {Record<string, string>} */ (
      this.options.labelTexts && typeof this.options.labelTexts === 'object'
        ? this.options.labelTexts
        : {}
    )
    const origin = lt.origin ?? 'Origem?'
    const destination = lt.destination ?? 'Para onde?'
    const search = lt.search ?? 'Buscar'

    root.innerHTML = `
      <div class="eulabs-bundled-widget" role="region" aria-label="Busca de viagens">
        <p class="eulabs-bundled-widget__note">Modo embutido (pacote npm).</p>
        <div class="eulabs-bundled-widget__row">
          <label class="eulabs-bundled-widget__label">${escapeHtml(origin)}</label>
          <input class="eulabs-bundled-widget__input" type="text" name="origin" autocomplete="off" placeholder="${escapeHtml(origin)}" />
        </div>
        <div class="eulabs-bundled-widget__row">
          <label class="eulabs-bundled-widget__label">${escapeHtml(destination)}</label>
          <input class="eulabs-bundled-widget__input" type="text" name="destination" autocomplete="off" placeholder="${escapeHtml(destination)}" />
        </div>
        <button type="button" class="eulabs-bundled-widget__submit">${escapeHtml(search)}</button>
      </div>
    `.trim()

    const btn = root.querySelector('.eulabs-bundled-widget__submit')
    if (btn) {
      btn.addEventListener('click', () => {
        const wl = String(this.options.urlWL ?? '')
        if (wl) window.location.assign(wl)
      })
    }

    this._mounted = true
  }

  init() {
    this._mount()
  }

  start() {
    this._mount()
  }

  destroy() {
    const sel = /** @type {string} */ (this.options.target)
    const root = document.querySelector(sel)
    if (root) root.innerHTML = ''
    this._mounted = false
  }
}

/** @param {string} s */
function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
