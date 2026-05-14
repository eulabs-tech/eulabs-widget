/**
 * Runtime embutido: origem/destino com autocomplete (sem select nativo).
 * Cores via `cssVariables` do `EulabsWidget` (`--primary`, `--secondary`, …).
 */

/** @typedef {{ id: number; code?: string; description: string; uf_acronym?: string; slug?: string }} Sectional */

const ICON_TARGET =
  '<svg class="eulabs-bundled-widget__svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/></svg>'

const ICON_PIN =
  '<svg class="eulabs-bundled-widget__svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 21s7-4.25 7-10a7 7 0 10-14 0c0 5.75 7 10 7 10z"/><circle cx="12" cy="11" r="2.5" fill="currentColor" stroke="none"/></svg>'

const ICON_CALENDAR =
  '<svg class="eulabs-bundled-widget__svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 5V3M16 5V3" fill="none" stroke="currentColor" stroke-width="2"/></svg>'

export default class EulabsBundledRuntime {
  constructor(options) {
    this.options = options
    this._mounted = false
    this._abort = null
    this._keydownHandler = null
    /** @type {Sectional[]} */
    this._sectionals = []
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
    this._sectionals = []
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
    const labelClearOrigin = lt.clear_origin ?? 'Limpar origem'
    const labelClearDest = lt.clear_destination ?? 'Limpar destino'
    const phCombo = 'De onde você vai sair?'

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
            <div class="eulabs-bundled-widget__origin-row">
              <div class="eulabs-bundled-widget__field eulabs-bundled-widget__field--origin">
                <label class="eulabs-bundled-widget__field-label" for="eulabs_origin_text">${escapeHtml(labelOrigin)}</label>
                <div class="eulabs-bundled-widget__control eulabs-bundled-widget__combo">
                  <span class="eulabs-bundled-widget__icon">${ICON_TARGET}</span>
                  <div class="eulabs-bundled-widget__combo-inner">
                    <input type="hidden" name="origin_sectional" id="eulabs_origin_id" value="" />
                    <input type="text" id="eulabs_origin_text" class="eulabs-bundled-widget__input eulabs-bundled-widget__input--combo" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="false" aria-controls="eulabs_origin_list" aria-autocomplete="list" placeholder="${escapeHtml(phCombo)}" />
                    <button type="button" class="eulabs-bundled-widget__combo-clear" id="eulabs_origin_clear" aria-label="${escapeHtml(labelClearOrigin)}" title="${escapeHtml(labelClearOrigin)}" hidden><span class="eulabs-bundled-widget__combo-clear-icon" aria-hidden="true">×</span></button>
                    <ul class="eulabs-bundled-widget__suggest" id="eulabs_origin_list" role="listbox" hidden></ul>
                  </div>
                </div>
              </div>
              <button type="button" class="eulabs-bundled-widget__swap" aria-label="Trocar origem e destino" title="Trocar">
                <span class="eulabs-bundled-widget__swap-inner" aria-hidden="true">⇄</span>
              </button>
            </div>

            <div class="eulabs-bundled-widget__field">
              <label class="eulabs-bundled-widget__field-label" for="eulabs_dest_text">${escapeHtml(labelDest)}</label>
              <div class="eulabs-bundled-widget__control eulabs-bundled-widget__combo">
                <span class="eulabs-bundled-widget__icon">${ICON_PIN}</span>
                <div class="eulabs-bundled-widget__combo-inner">
                  <input type="hidden" name="dest_sectional" id="eulabs_dest_id" value="" />
                  <input type="text" id="eulabs_dest_text" class="eulabs-bundled-widget__input eulabs-bundled-widget__input--combo" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="false" aria-controls="eulabs_dest_list" aria-autocomplete="list" placeholder="${escapeHtml(phCombo)}" />
                  <button type="button" class="eulabs-bundled-widget__combo-clear" id="eulabs_dest_clear" aria-label="${escapeHtml(labelClearDest)}" title="${escapeHtml(labelClearDest)}" hidden><span class="eulabs-bundled-widget__combo-clear-icon" aria-hidden="true">×</span></button>
                  <ul class="eulabs-bundled-widget__suggest" id="eulabs_dest_list" role="listbox" hidden></ul>
                </div>
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
      </div>
    `.trim()

    this._bindControls(root, {
      gratuityEnabled,
      gratuityError: String(gratuity.errorMessage ?? ''),
    })
    void this._loadSectionals(root)

    this._mounted = true
  }

  /** @param {Sectional} s */
  _sectionalLabel(s) {
    const d = String(s.description ?? '')
    const u = s.uf_acronym ? String(s.uf_acronym) : ''
    const c = s.code ? String(s.code) : ''
    const tail = u ? `${d} (${u})` : d
    return c ? `${tail} — ${c}` : tail
  }

  /** @param {string} q */
  _filterSectionals(q) {
    const n = q.trim().toLowerCase()
    if (!n) return this._sectionals.slice(0, 12)
    return this._sectionals
      .filter((s) => {
        const blob = [
          s.description,
          s.uf_acronym,
          s.code,
          String(s.id),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return blob.includes(n)
      })
      .slice(0, 12)
  }

  /**
   * @param {Element} root
   * @param {string} listId
   * @param {Sectional[]} items
   * @param {(s: Sectional) => void} onPick
   */
  _renderSuggestList(listEl, items, onPick) {
    listEl.innerHTML = ''
    for (const s of items) {
      const li = document.createElement('li')
      li.setAttribute('role', 'option')
      li.tabIndex = -1
      li.dataset.id = String(s.id)
      li.textContent = this._sectionalLabel(s)
      li.addEventListener('mousedown', (ev) => {
        ev.preventDefault()
        onPick(s)
      })
      listEl.appendChild(li)
    }
  }

  /** @param {Element} root */
  _closeSuggest(root) {
    for (const listId of ['eulabs_origin_list', 'eulabs_dest_list']) {
      const ul = root.querySelector(`#${listId}`)
      const textId = listId.replace('_list', '_text')
      const textEl = root.querySelector(`#${textId}`)
      if (ul) ul.hidden = true
      if (textEl) textEl.setAttribute('aria-expanded', 'false')
    }
  }

  /**
   * @param {Element} root
   * @param {'origin' | 'dest'} which
   */
  _syncComboClear(root, which) {
    const idSuffix = which === 'origin' ? 'origin' : 'dest'
    const hidden = /** @type {HTMLInputElement | null} */ (root.querySelector(`#eulabs_${idSuffix}_id`))
    const text = /** @type {HTMLInputElement | null} */ (root.querySelector(`#eulabs_${idSuffix}_text`))
    const clearBtn = root.querySelector(`#eulabs_${idSuffix}_clear`)
    if (!hidden || !text || !clearBtn) return
    const show = !!(String(hidden.value).trim() || text.value.trim())
    clearBtn.hidden = !show
  }

  /**
   * @param {Element} root
   * @param {'origin' | 'dest'} which
   */
  _wireCombo(root, which) {
    const idSuffix = which === 'origin' ? 'origin' : 'dest'
    const hidden = /** @type {HTMLInputElement | null} */ (root.querySelector(`#eulabs_${idSuffix}_id`))
    const text = /** @type {HTMLInputElement | null} */ (root.querySelector(`#eulabs_${idSuffix}_text`))
    const list = root.querySelector(`#eulabs_${idSuffix}_list`)
    const clearBtn = root.querySelector(`#eulabs_${idSuffix}_clear`)
    if (!hidden || !text || !list) return

    const open = () => {
      if (!this._sectionals.length) return
      const items = this._filterSectionals(text.value)
      this._renderSuggestList(list, items, (s) => {
        hidden.value = String(s.id)
        text.value = this._sectionalLabel(s)
        list.hidden = true
        text.setAttribute('aria-expanded', 'false')
        this._syncComboClear(root, which)
      })
      list.hidden = items.length === 0
      text.setAttribute('aria-expanded', list.hidden ? 'false' : 'true')
      this._syncComboClear(root, which)
    }

    text.addEventListener('focus', () => {
      if (this._sectionals.length) open()
      else this._syncComboClear(root, which)
    })

    text.addEventListener('input', () => {
      hidden.value = ''
      open()
    })

    text.addEventListener('blur', () => {
      setTimeout(() => {
        list.hidden = true
        text.setAttribute('aria-expanded', 'false')
      }, 180)
    })

    clearBtn?.addEventListener('mousedown', (ev) => {
      ev.preventDefault()
    })
    clearBtn?.addEventListener('click', () => {
      hidden.value = ''
      text.value = ''
      list.innerHTML = ''
      list.hidden = true
      text.setAttribute('aria-expanded', 'false')
      this._syncComboClear(root, which)
      text.focus()
    })
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
    const originId = /** @type {HTMLInputElement | null} */ (root.querySelector('#eulabs_origin_id'))
    const destId = /** @type {HTMLInputElement | null} */ (root.querySelector('#eulabs_dest_id'))
    const originText = /** @type {HTMLInputElement | null} */ (root.querySelector('#eulabs_origin_text'))
    const destText = /** @type {HTMLInputElement | null} */ (root.querySelector('#eulabs_dest_text'))
    this._wireCombo(root, 'origin')
    this._wireCombo(root, 'dest')

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
      if (!originId || !destId || !originText || !destText) return
      const hi = originId.value
      originId.value = destId.value
      destId.value = hi
      const ti = originText.value
      originText.value = destText.value
      destText.value = ti
      this._closeSuggest(root)
      this._syncComboClear(root, 'origin')
      this._syncComboClear(root, 'dest')
    })

    this._keydownHandler = (ev) => {
      if (ev.key === 'Escape') this._closeSuggest(root)
    }
    document.addEventListener('keydown', this._keydownHandler)

    const submit = root.querySelector('.eulabs-bundled-widget__submit')
    submit?.addEventListener('click', () => {
      const round = /** @type {HTMLInputElement | null} */ (
        root.querySelector('input[name="eulabs_trip"][value="round"]')
      )?.checked

      if (!originId?.value || !destId?.value) {
        this._setStatus(root, 'Selecione origem e destino na lista ou continue a digitar até escolher.', true)
        return
      }
      if (originId.value === destId.value) {
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

      const wl = String(this.options.urlWL ?? '').trim()
      if (!wl) {
        this._setStatus(root, 'Configure urlWL (site) para redirecionar após a pesquisa.', true)
        return
      }

      const originSec = this._sectionalById(originId.value)
      const destSec = this._sectionalById(destId.value)
      if (!originSec || !destSec) {
        this._setStatus(root, 'Origem ou destino inválido. Volte a escolher na lista.', true)
        return
      }

      const oSlug = sectionalPathSlug(originSec)
      const dSlug = sectionalPathSlug(destSec)
      if (!oSlug || !dSlug) {
        this._setStatus(root, 'Não foi possível montar o endereço desta rota.', true)
        return
      }

      const dataBr = isoDateToBr(depInput.value)
      if (!dataBr) {
        this._setStatus(root, 'Data de ida inválida.', true)
        return
      }

      const base = wl.endsWith('/') ? wl : `${wl}/`
      const path = `comprar-passagem-onibus/${oSlug}/${dSlug}`
      const target = new URL(path, base)
      target.searchParams.set('data', dataBr)
      if (round && retInput?.value) {
        const voltaBr = isoDateToBr(retInput.value)
        if (!voltaBr) {
          this._setStatus(root, 'Data de volta inválida.', true)
          return
        }
        target.searchParams.set('volta', voltaBr)
      }

      window.location.assign(target.href)
    })
  }

  /** @param {string} id */
  _sectionalById(id) {
    const n = Number(id)
    if (!Number.isFinite(n)) return null
    return this._sectionals.find((s) => Number(s.id) === n) ?? null
  }

  /**
   * @param {Element} root
   * @param {string} msg
   * @param {boolean} [isError]
   */
  _setStatus(root, msg, isError = false) {
    const el = root.querySelector('.eulabs-bundled-widget__status')
    if (!el) return
    el.textContent = msg
    el.classList.toggle('eulabs-bundled-widget__status--error', !!isError)
  }

  /** @param {Element} root */
  async _loadSectionals(root) {
    const apiUrl = String(this.options.urlAPI ?? '')
    const originText = /** @type {HTMLInputElement | null} */ (root.querySelector('#eulabs_origin_text'))
    const destText = /** @type {HTMLInputElement | null} */ (root.querySelector('#eulabs_dest_text'))
    if (!apiUrl || !originText || !destText) {
      this._setStatus(root, 'Sem urlAPI configurada.', true)
      return
    }

    this._abort?.abort()
    this._abort = new AbortController()

    const onOk = (/** @type {Sectional[]} */ list) => {
      this._sectionals = list
      originText.placeholder = list.length ? 'De onde você vai sair?' : 'Sem seccionamentos'
      destText.placeholder = list.length ? 'Para onde você vai?' : 'Sem seccionamentos'
      this._setStatus(
        root,
        list.length ? `` : 'Nenhum seccionamento.',
        !list.length,
      )
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
      onOk(/** @type {Sectional[]} */ (data))
    } catch (e) {
      if (/** @type {Error} */ (e).name === 'AbortError') return
      console.error(e)
      this._sectionals = []
      originText.placeholder = 'Erro ao carregar'
      destText.placeholder = 'Erro ao carregar'
      this._setStatus(
        root,
        'Não foi possível obter seccionamentos (rede ou CORS). Em dev, use proxy no Vite.',
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

/** `YYYY-MM-DD` → `DD-MM-YYYY` */
function isoDateToBr(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso).trim())
  if (!m) return ''
  return `${m[3]}-${m[2]}-${m[1]}`
}

/** @param {string} raw */
function slugifyCity(raw) {
  return String(raw || '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** @param {Sectional} s */
function sectionalPathSlug(s) {
  const raw = s.slug != null ? String(s.slug).trim() : ''
  if (raw) {
    const cleaned = raw.toLowerCase().replace(/[^a-z0-9-]/g, '')
    if (cleaned) return cleaned
  }
  const city = slugifyCity(String(s.description ?? ''))
  const uf = String(s.uf_acronym ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, '')
  if (!city && !uf) return ''
  if (!uf) return city
  if (!city) return uf
  return `${city}-${uf}`
}
