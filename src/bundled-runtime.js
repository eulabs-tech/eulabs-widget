/**
 * Runtime embutido: formulário alinhado ao fluxo origem | trocar | destino | datas | pesquisa.
 * Cores via variáveis definidas em `EulabsWidget` (`cssVariables` → `--primary`, `--secondary`, …).
 */

/** @typedef {{ id: number; code?: string; description: string; uf_acronym?: string }} Sectional */

const ICON_TARGET =
  '<svg class="eulabs-bundled-widget__svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/></svg>'

const ICON_PIN =
  '<svg class="eulabs-bundled-widget__svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 21s7-4.25 7-10a7 7 0 10-14 0c0 5.75 7 10 7 10z"/><circle cx="12" cy="11" r="2.5" fill="currentColor" stroke="none"/></svg>'

const ICON_CALENDAR =
  '<svg class="eulabs-bundled-widget__svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 5V3M16 5V3" fill="none" stroke="currentColor" stroke-width="2"/></svg>'

export default class EulabsBundledRuntime {
  /** @param {Record<string, unknown>} options */
  constructor(options) {
    this.options = options
    this._mounted = false
    /** @type {AbortController | null} */
    this._abort = null
    /** @type {((ev: KeyboardEvent) => void) | null} */
    this._keydownHandler = null
  }

  init() {
    this._mount()
  }

  start() {
    this._mount()
  }

  destroy() {
    this._abort?.abort()
    this._abort = null
    if (this._keydownHandler) {
      document.removeEventListener('keydown', this._keydownHandler)
      this._keydownHandler = null
    }
    const sel = /** @type {string} */ (this.options.target)
    const root = document.querySelector(sel)
    if (root) root.innerHTML = ''
    this._mounted = false
  }

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
    const labelOrigin = lt.origin ?? 'Origem'
    const labelDest = lt.destination ?? 'Destino'
    const labelDep = lt.departureDate ?? 'Data da ida'
    const labelRet = lt.returnDate ?? 'Data da volta'
    const labelSearch = lt.search ?? 'Pesquisar viagens'
    const labelGo = lt.toggle_go ?? 'Somente ida'
    const labelRound = lt.toggle_go_and_back ?? 'Ida e volta'

    const gratuity = this.options.gratuity && typeof this.options.gratuity === 'object'
      ? /** @type {{ enable?: boolean; errorMessage?: string; optionList?: Array<{ default?: boolean; label: string; value: string }> }} */ (
          this.options.gratuity
        )
      : { enable: false, optionList: [] }
    const gratuityEnabled =
      gratuity.enable === true &&
      Array.isArray(gratuity.optionList) &&
      gratuity.optionList.length > 0
    const gratuityOptions = gratuityEnabled
      ? gratuity.optionList
          .map(
            (o) =>
              `<option value="${escapeHtml(String(o.value))}"${o.default ? ' selected' : ''}>${escapeHtml(o.label)}</option>`,
          )
          .join('')
      : ''

    const orientation =
      this.options.orientation === 'horizontal' ? 'horizontal' : 'vertical'
    const orientClass =
      orientation === 'horizontal'
        ? 'eulabs-bundled-widget--horizontal'
        : 'eulabs-bundled-widget--vertical'

    root.innerHTML = `
      <div class="eulabs-bundled-widget ${orientClass}" role="region" aria-label="Busca de viagens" data-orientation="${orientation}">
        <p class="eulabs-bundled-widget__note eulabs-bundled-widget__status">Carregando seccionamentos…</p>

        <div class="eulabs-bundled-widget__main">
          <div class="eulabs-bundled-widget__trip-row" role="radiogroup" aria-label="Tipo de viagem">
            <label class="eulabs-bundled-widget__trip-opt">
              <input type="radio" class="eulabs-bundled-widget__trip-input" name="eulabs_trip" value="go" checked />
              <span class="eulabs-bundled-widget__trip-disc" aria-hidden="true"></span>
              <span class="eulabs-bundled-widget__trip-text">${escapeHtml(labelGo)}</span>
            </label>
            <label class="eulabs-bundled-widget__trip-opt">
              <input type="radio" class="eulabs-bundled-widget__trip-input" name="eulabs_trip" value="round" />
              <span class="eulabs-bundled-widget__trip-disc" aria-hidden="true"></span>
              <span class="eulabs-bundled-widget__trip-text">${escapeHtml(labelRound)}</span>
            </label>
          </div>

          <div class="eulabs-bundled-widget__toolbar">
            <div class="eulabs-bundled-widget__field">
              <span class="eulabs-bundled-widget__field-label">${escapeHtml(labelOrigin)}</span>
              <div class="eulabs-bundled-widget__control">
                <span class="eulabs-bundled-widget__icon">${ICON_TARGET}</span>
                <select id="eulabs_origin" class="eulabs-bundled-widget__select" name="origin_sectional" required>
                  <option value="">Carregando…</option>
                </select>
              </div>
            </div>

            <button type="button" class="eulabs-bundled-widget__swap" aria-label="Trocar origem e destino" title="Trocar">
              <span class="eulabs-bundled-widget__swap-inner" aria-hidden="true">⇄</span>
            </button>

            <div class="eulabs-bundled-widget__field">
              <span class="eulabs-bundled-widget__field-label">${escapeHtml(labelDest)}</span>
              <div class="eulabs-bundled-widget__control">
                <span class="eulabs-bundled-widget__icon">${ICON_PIN}</span>
                <select id="eulabs_dest" class="eulabs-bundled-widget__select" name="dest_sectional" required>
                  <option value="">Carregando…</option>
                </select>
              </div>
            </div>

            <div class="eulabs-bundled-widget__field">
              <span class="eulabs-bundled-widget__field-label">${escapeHtml(labelDep)}</span>
              <div class="eulabs-bundled-widget__control">
                <span class="eulabs-bundled-widget__icon">${ICON_CALENDAR}</span>
                <input id="eulabs_dep" class="eulabs-bundled-widget__input eulabs-bundled-widget__input--date" type="date" name="departure" required />
              </div>
            </div>

            <div class="eulabs-bundled-widget__field eulabs-bundled-widget__field--return">
              <span class="eulabs-bundled-widget__field-label">${escapeHtml(labelRet)}</span>
              <div class="eulabs-bundled-widget__control">
                <span class="eulabs-bundled-widget__icon">${ICON_CALENDAR}</span>
                <input id="eulabs_ret" class="eulabs-bundled-widget__input eulabs-bundled-widget__input--date" type="date" name="return" />
              </div>
            </div>

            <button type="button" class="eulabs-bundled-widget__submit">${escapeHtml(labelSearch)}</button>
          </div>

          ${
            gratuityEnabled
              ? `<div class="eulabs-bundled-widget__gratuity-row">
              <span class="eulabs-bundled-widget__field-label" id="eulabs_gratuity_lbl">Tipo de passagem (gratuidade)</span>
              <select id="eulabs_gratuity" class="eulabs-bundled-widget__select eulabs-bundled-widget__select--wide" name="gratuity" aria-labelledby="eulabs_gratuity_lbl">${gratuityOptions}</select>
              <p class="eulabs-bundled-widget__hint eulabs-bundled-widget__gratuity-hint" hidden></p>
            </div>`
              : ''
          }
        </div>

        <div class="eulabs-bundled-modal" hidden role="dialog" aria-modal="true" aria-labelledby="eulabs_modal_title">
          <div class="eulabs-bundled-modal__backdrop" data-close="1"></div>
          <div class="eulabs-bundled-modal__dialog">
            <h2 id="eulabs_modal_title" class="eulabs-bundled-modal__title">Selecione o horário</h2>
            <p class="eulabs-bundled-widget__note">Horários de exemplo — ligue à API real de horas quando existir.</p>
            <div class="eulabs-bundled-modal__times"></div>
            <button type="button" class="eulabs-bundled-modal__close" data-close="1">Fechar</button>
          </div>
        </div>
      </div>
    `.trim()

    this._bindControls(root, {
      gratuityEnabled,
      gratuityError: String(gratuity.errorMessage ?? ''),
    })
    void this._loadSectionals(root)

    this._mounted = true
  }

  /**
   * @param {Element} root
   * @param {{ gratuityEnabled: boolean; gratuityError: string }} ctx
   */
  _bindControls(root, ctx) {
    const tripRadios = root.querySelectorAll('input[name="eulabs_trip"]')
    const retField = root.querySelector('.eulabs-bundled-widget__field--return')
    const retInput = /** @type {HTMLInputElement | null} */ (root.querySelector('input[name="return"]'))
    const gratuitySelect = /** @type {HTMLSelectElement | null} */ (root.querySelector('#eulabs_gratuity'))
    const gratuityHint = root.querySelector('.eulabs-bundled-widget__gratuity-hint')
    const depInput = /** @type {HTMLInputElement | null} */ (root.querySelector('input[name="departure"]'))
    const originSel = /** @type {HTMLSelectElement | null} */ (root.querySelector('[name="origin_sectional"]'))
    const destSel = /** @type {HTMLSelectElement | null} */ (root.querySelector('[name="dest_sectional"]'))
    const modal = root.querySelector('.eulabs-bundled-modal')
    const timesEl = root.querySelector('.eulabs-bundled-modal__times')

    const today = new Date().toISOString().slice(0, 10)
    if (depInput) depInput.min = today
    if (retInput) retInput.min = today

    depInput?.addEventListener('change', () => {
      if (retInput && depInput.value) retInput.min = depInput.value
    })

    const syncTripUi = () => {
      const round = /** @type {HTMLInputElement | null} */ (
        root.querySelector('input[name="eulabs_trip"][value="round"]')
      )?.checked
      if (retField) retField.classList.toggle('eulabs-bundled-widget__field--return-muted', !round)
      if (retInput) {
        retInput.disabled = !round
        retInput.required = !!round
        if (!round) retInput.value = ''
        else if (depInput?.value) retInput.min = depInput.value
      }
      if (ctx.gratuityEnabled && gratuitySelect && gratuityHint) {
        const isGratuity = gratuitySelect.value === 'gratuity'
        if (round && isGratuity) {
          gratuityHint.textContent = ctx.gratuityError || 'Gratuidade só para viagem de ida.'
          gratuityHint.hidden = false
        } else {
          gratuityHint.hidden = true
          gratuityHint.textContent = ''
        }
      }
    }

    tripRadios.forEach((r) => r.addEventListener('change', syncTripUi))
    syncTripUi()

    if (gratuitySelect) gratuitySelect.addEventListener('change', syncTripUi)

    root.querySelector('.eulabs-bundled-widget__swap')?.addEventListener('click', () => {
      if (!originSel || !destSel) return
      const a = originSel.value
      originSel.value = destSel.value
      destSel.value = a
    })

    const hours = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
    if (timesEl) {
      timesEl.innerHTML = hours
        .map(
          (h) =>
            `<button type="button" class="eulabs-bundled-modal__slot" data-hour="${escapeHtml(h)}">${escapeHtml(h)}</button>`,
        )
        .join('')
    }

    const openModal = () => {
      if (!modal) return
      modal.hidden = false
    }
    const closeModal = () => {
      if (!modal) return
      modal.hidden = true
    }

    this._keydownHandler = (ev) => {
      if (ev.key === 'Escape' && modal && !modal.hidden) closeModal()
    }
    document.addEventListener('keydown', this._keydownHandler)

    modal?.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeModal))

    timesEl?.addEventListener('click', (ev) => {
      const t = /** @type {HTMLElement} */ (ev.target)
      const slot = t.closest('.eulabs-bundled-modal__slot')
      if (!slot) return
      const hour = slot.getAttribute('data-hour') ?? ''
      const wl = String(this.options.urlWL ?? '')
      if (wl) {
        const u = new URL(wl, window.location.href)
        u.searchParams.set('hour', hour)
        window.location.assign(u.toString())
      } else {
        closeModal()
      }
    })

    const submit = root.querySelector('.eulabs-bundled-widget__submit')
    submit?.addEventListener('click', () => {
      const origin = /** @type {HTMLSelectElement | null} */ (root.querySelector('[name="origin_sectional"]'))
      const dest = /** @type {HTMLSelectElement | null} */ (root.querySelector('[name="dest_sectional"]'))
      const round = /** @type {HTMLInputElement | null} */ (
        root.querySelector('input[name="eulabs_trip"][value="round"]')
      )?.checked

      if (!origin?.value || !dest?.value) {
        this._setStatus(root, 'Selecione origem e destino.', true)
        return
      }
      if (origin.value === dest.value) {
        this._setStatus(root, 'Origem e destino devem ser diferentes.', true)
        return
      }
      if (!depInput?.value) {
        this._setStatus(root, 'Indique a data de ida.', true)
        return
      }
      if (round && !retInput?.value) {
        this._setStatus(root, 'Indique a data de volta.', true)
        return
      }
      if (ctx.gratuityEnabled && gratuitySelect?.value === 'gratuity' && round) {
        this._setStatus(root, ctx.gratuityError || 'Gratuidade só para ida.', true)
        return
      }

      this._setStatus(root, 'Escolha um horário na janela abaixo.', false)
      openModal()
    })
  }

  /**
   * @param {Element} root
   * @param {string} msg
   * @param {boolean} isError
   */
  _setStatus(root, msg, isError) {
    const el = root.querySelector('.eulabs-bundled-widget__status')
    if (!el) return
    el.textContent = msg
    el.classList.toggle('eulabs-bundled-widget__status--error', isError)
  }

  /** @param {Element} root */
  async _loadSectionals(root) {
    const apiUrl = String(this.options.urlAPI ?? '')
    const originSel = /** @type {HTMLSelectElement | null} */ (root.querySelector('[name="origin_sectional"]'))
    const destSel = /** @type {HTMLSelectElement | null} */ (root.querySelector('[name="dest_sectional"]'))
    if (!apiUrl || !originSel || !destSel) {
      this._setStatus(root, 'Sem urlAPI configurada.', true)
      return
    }

    this._abort?.abort()
    this._abort = new AbortController()

    const fill = (/** @type {Sectional[]} */ list) => {
      const opts =
        `<option value="">${list.length ? 'Selecione…' : 'Sem dados'}</option>` +
        list
          .map(
            (s) =>
              `<option value="${s.id}">${escapeHtml(s.description)}${s.uf_acronym ? ` (${escapeHtml(s.uf_acronym)})` : ''}</option>`,
          )
          .join('')
      originSel.innerHTML = opts
      destSel.innerHTML = opts
      this._setStatus(root)
    }

    try {
      const res = await fetch(apiUrl, {
        signal: this._abort.signal,
        credentials: 'omit',
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (!Array.isArray(data)) throw new Error('Resposta não é um array')
      fill(/** @type {Sectional[]} */ (data))
    } catch (e) {
      if (/** @type {Error} */ (e).name === 'AbortError') return
      console.error(e)
      originSel.innerHTML = '<option value="">Erro ao carregar</option>'
      destSel.innerHTML = '<option value="">Erro ao carregar</option>'
      this._setStatus(
        root,
        'Não foi possível obter seccionamentos (rede ou CORS). Em dev, use proxy no Vite ou extensão só para testes.',
        true,
      )
    }
  }
}

/** @param {string} s */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
