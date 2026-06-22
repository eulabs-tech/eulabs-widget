const W = '<svg class="eulabs-bundled-widget__svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/></svg>', V = '<svg class="eulabs-bundled-widget__svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 21s7-4.25 7-10a7 7 0 10-14 0c0 5.75 7 10 7 10z"/><circle cx="12" cy="11" r="2.5" fill="currentColor" stroke="none"/></svg>', U = '<svg class="eulabs-bundled-widget__svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 5V3M16 5V3" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
class G {
  constructor(e) {
    this.options = e, this._mounted = !1, this._abort = null, this._keydownHandler = null, this._sectionals = [];
  }
  init() {
    this._mount();
  }
  start() {
    this._mount();
  }
  destroy() {
    var i;
    (i = this._abort) == null || i.abort(), this._abort = null, this._keydownHandler && (document.removeEventListener("keydown", this._keydownHandler), this._keydownHandler = null);
    const e = (
      /** @type {string} */
      this.options.target
    ), t = document.querySelector(e);
    t && (t.innerHTML = ""), this._mounted = !1, this._sectionals = [];
  }
  _mount() {
    if (this._mounted) return;
    const e = (
      /** @type {string} */
      this.options.target
    ), t = document.querySelector(e);
    if (!t) return;
    const i = (
      /** @type {Record<string, string>} */
      this.options.labelTexts && typeof this.options.labelTexts == "object" ? this.options.labelTexts : {}
    ), a = i.origin ?? "Origem", s = i.destination ?? "Destino", r = i.departureDate ?? "Data da ida", l = i.returnDate ?? "Data da volta", c = i.search ?? "Pesquisar viagens", o = i.toggle_go ?? "Somente ida", f = i.toggle_go_and_back ?? "Ida e volta", b = i.clear_origin ?? "Limpar origem", _ = i.clear_destination ?? "Limpar destino", g = "De onde você vai sair?", p = "Para onde você vai?", m = this.options.gratuity && typeof this.options.gratuity == "object" ? (
      /** @type {{ enable?: boolean; errorMessage?: string; optionList?: Array<{ default?: boolean; label: string; value: string }> }} */
      this.options.gratuity
    ) : { enable: !1, optionList: [] }, v = m.enable === !0 && Array.isArray(m.optionList) && m.optionList.length > 0, E = v ? m.optionList.map(
      (w) => `<option value="${u(String(w.value))}"${w.default ? " selected" : ""}>${u(w.label)}</option>`
    ).join("") : "", S = this.options.orientation === "horizontal" ? "horizontal" : "vertical", L = S === "horizontal" ? "eulabs-bundled-widget--horizontal" : "eulabs-bundled-widget--vertical";
    t.innerHTML = `
      <div class="eulabs-bundled-widget ${L}" role="region" aria-label="Busca de viagens" data-orientation="${S}">
        <p class="eulabs-bundled-widget__note eulabs-bundled-widget__status">Carregando seccionamentos…</p>

        <div class="eulabs-bundled-widget__main">
          <div class="eulabs-bundled-widget__trip-row" role="radiogroup" aria-label="Tipo de viagem">
            <label class="eulabs-bundled-widget__trip-opt">
              <input type="radio" class="eulabs-bundled-widget__trip-input" name="eulabs_trip" value="go" checked />
              <span class="eulabs-bundled-widget__trip-disc" aria-hidden="true"></span>
              <span class="eulabs-bundled-widget__trip-text">${u(o)}</span>
            </label>
            <label class="eulabs-bundled-widget__trip-opt">
              <input type="radio" class="eulabs-bundled-widget__trip-input" name="eulabs_trip" value="round" />
              <span class="eulabs-bundled-widget__trip-disc" aria-hidden="true"></span>
              <span class="eulabs-bundled-widget__trip-text">${u(f)}</span>
            </label>
          </div>

          <div class="eulabs-bundled-widget__toolbar">
            <div class="eulabs-bundled-widget__origin-row">
              <div class="eulabs-bundled-widget__field eulabs-bundled-widget__field--origin eulabs-bundled-widget__field--top-label">
                <label class="eulabs-bundled-widget__field-label" for="eulabs_origin_text">${u(a)}</label>
                <div class="eulabs-bundled-widget__control eulabs-bundled-widget__control--combo eulabs-bundled-widget__combo">
                  <span class="eulabs-bundled-widget__icon">${W}</span>
                  <div class="eulabs-bundled-widget__combo-inner">
                    <input type="hidden" name="origin_sectional" id="eulabs_origin_id" value="" />
                    <input type="text" id="eulabs_origin_text" class="eulabs-bundled-widget__input eulabs-bundled-widget__input--combo" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="false" aria-controls="eulabs_origin_list" aria-autocomplete="list" placeholder="${u(g)}" />
                    <button type="button" class="eulabs-bundled-widget__combo-clear" id="eulabs_origin_clear" aria-label="${u(b)}" title="${u(b)}" hidden><span class="eulabs-bundled-widget__combo-clear-icon" aria-hidden="true">×</span></button>
                    <ul class="eulabs-bundled-widget__suggest" id="eulabs_origin_list" role="listbox" hidden></ul>
                  </div>
                </div>
              </div>
              <button type="button" class="eulabs-bundled-widget__swap" aria-label="Trocar origem e destino" title="Trocar">
                <span class="eulabs-bundled-widget__swap-inner" aria-hidden="true">⇄</span>
              </button>
            </div>

            <div class="eulabs-bundled-widget__field eulabs-bundled-widget__field--top-label">
              <label class="eulabs-bundled-widget__field-label" for="eulabs_dest_text">${u(s)}</label>
              <div class="eulabs-bundled-widget__control eulabs-bundled-widget__control--combo eulabs-bundled-widget__combo">
                <span class="eulabs-bundled-widget__icon">${V}</span>
                <div class="eulabs-bundled-widget__combo-inner">
                  <input type="hidden" name="dest_sectional" id="eulabs_dest_id" value="" />
                  <input type="text" id="eulabs_dest_text" class="eulabs-bundled-widget__input eulabs-bundled-widget__input--combo" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="false" aria-controls="eulabs_dest_list" aria-autocomplete="list" placeholder="${u(p)}" />
                  <button type="button" class="eulabs-bundled-widget__combo-clear" id="eulabs_dest_clear" aria-label="${u(_)}" title="${u(_)}" hidden><span class="eulabs-bundled-widget__combo-clear-icon" aria-hidden="true">×</span></button>
                  <ul class="eulabs-bundled-widget__suggest" id="eulabs_dest_list" role="listbox" hidden></ul>
                </div>
              </div>
            </div>

            <div class="eulabs-bundled-widget__field eulabs-bundled-widget__field--top-label">
              <label class="eulabs-bundled-widget__field-label" for="eulabs_dep_text">${u(r)}</label>
              <div class="eulabs-bundled-widget__control eulabs-bundled-widget__control--date">
                <span class="eulabs-bundled-widget__icon">${U}</span>
                <input id="eulabs_dep_text" class="eulabs-bundled-widget__input eulabs-bundled-widget__input--date-display" type="text" name="departure_display" value="" placeholder="00/00/0000" readonly />
                <input id="eulabs_dep" class="eulabs-bundled-widget__native-date" type="date" name="departure" required />
              </div>
            </div>

            <div class="eulabs-bundled-widget__field eulabs-bundled-widget__field--return eulabs-bundled-widget__field--top-label">
              <label class="eulabs-bundled-widget__field-label" for="eulabs_ret_text">${u(l)}</label>
              <div class="eulabs-bundled-widget__control eulabs-bundled-widget__control--date">
                <span class="eulabs-bundled-widget__icon">${U}</span>
                <input id="eulabs_ret_text" class="eulabs-bundled-widget__input eulabs-bundled-widget__input--date-display" type="text" name="return_display" value="" placeholder="00/00/0000" readonly />
                <input id="eulabs_ret" class="eulabs-bundled-widget__native-date" type="date" name="return" />
              </div>
            </div>

            <button type="button" class="eulabs-bundled-widget__submit">${u(c)}</button>
          </div>

          ${v ? `<div class="eulabs-bundled-widget__gratuity-row">
              <label class="eulabs-bundled-widget__field-label" id="eulabs_gratuity_lbl" for="eulabs_gratuity">Tipo de passagem (gratuidade)</label>
              <div class="eulabs-bundled-widget__control eulabs-bundled-widget__control--select">
                <select id="eulabs_gratuity" class="eulabs-bundled-widget__select eulabs-bundled-widget__select--wide" name="gratuity" aria-labelledby="eulabs_gratuity_lbl">${E}</select>
              </div>
              <p class="eulabs-bundled-widget__hint eulabs-bundled-widget__gratuity-hint" hidden></p>
            </div>` : ""}
        </div>
      </div>
    `.trim(), this._bindControls(t, {
      gratuityEnabled: v,
      gratuityError: String(m.errorMessage ?? "")
    }), this._loadSectionals(t), this._mounted = !0;
  }
  /** @param {Sectional} s */
  _sectionalLabel(e) {
    const t = String(e.description ?? "").trim(), i = e.uf_acronym ? String(e.uf_acronym).trim() : "";
    return t ? i ? `${t} (${i})` : t : i;
  }
  /** @param {string} q */
  _filterSectionals(e) {
    const t = e.trim().toLowerCase();
    return t ? this._sectionals.filter((i) => [
      i.description,
      i.uf_acronym,
      i.code,
      String(i.id)
    ].filter(Boolean).join(" ").toLowerCase().includes(t)).slice(0, 12) : this._sectionals.slice(0, 12);
  }
  /**
   * @param {Element} root
   * @param {string} listId
   * @param {Sectional[]} items
   * @param {(s: Sectional) => void} onPick
   */
  _renderSuggestList(e, t, i) {
    e.innerHTML = "";
    for (const a of t) {
      const s = document.createElement("li");
      s.setAttribute("role", "option"), s.tabIndex = -1, s.dataset.id = String(a.id), s.textContent = this._sectionalLabel(a), s.addEventListener("mousedown", (r) => {
        r.preventDefault(), i(a);
      }), e.appendChild(s);
    }
  }
  /** @param {Element} root */
  _closeSuggest(e) {
    for (const t of ["eulabs_origin_list", "eulabs_dest_list"]) {
      const i = e.querySelector(`#${t}`), a = t.replace("_list", "_text"), s = e.querySelector(`#${a}`);
      i && (i.hidden = !0), s && s.setAttribute("aria-expanded", "false");
    }
  }
  /**
   * @param {Element} root
   * @param {'origin' | 'dest'} which
   */
  _syncComboClear(e, t) {
    const i = t === "origin" ? "origin" : "dest", a = (
      /** @type {HTMLInputElement | null} */
      e.querySelector(`#eulabs_${i}_id`)
    ), s = (
      /** @type {HTMLInputElement | null} */
      e.querySelector(`#eulabs_${i}_text`)
    ), r = e.querySelector(`#eulabs_${i}_clear`);
    if (!a || !s || !r) return;
    const l = !!(String(a.value).trim() || s.value.trim());
    r.hidden = !l;
  }
  /**
   * @param {Element} root
   * @param {'origin' | 'dest'} which
   */
  _wireCombo(e, t) {
    const i = t === "origin" ? "origin" : "dest", a = (
      /** @type {HTMLInputElement | null} */
      e.querySelector(`#eulabs_${i}_id`)
    ), s = (
      /** @type {HTMLInputElement | null} */
      e.querySelector(`#eulabs_${i}_text`)
    ), r = e.querySelector(`#eulabs_${i}_list`), l = e.querySelector(`#eulabs_${i}_clear`);
    if (!a || !s || !r) return;
    const c = () => {
      if (!this._sectionals.length) return;
      const o = this._filterSectionals(s.value);
      this._renderSuggestList(r, o, (f) => {
        a.value = String(f.id), s.value = this._sectionalLabel(f), r.hidden = !0, s.setAttribute("aria-expanded", "false"), this._syncComboClear(e, t);
      }), r.hidden = o.length === 0, s.setAttribute("aria-expanded", r.hidden ? "false" : "true"), this._syncComboClear(e, t);
    };
    s.addEventListener("focus", () => {
      this._sectionals.length ? c() : this._syncComboClear(e, t);
    }), s.addEventListener("input", () => {
      a.value = "", c();
    }), s.addEventListener("blur", () => {
      setTimeout(() => {
        r.hidden = !0, s.setAttribute("aria-expanded", "false");
      }, 180);
    }), l == null || l.addEventListener("mousedown", (o) => {
      o.preventDefault();
    }), l == null || l.addEventListener("click", () => {
      a.value = "", s.value = "", r.innerHTML = "", r.hidden = !0, s.setAttribute("aria-expanded", "false"), this._syncComboClear(e, t), s.focus();
    });
  }
  /**
   * @param {Element} root
   * @param {{ gratuityEnabled: boolean; gratuityError: string }} ctx
   */
  _bindControls(e, t) {
    var A;
    const i = e.querySelectorAll('input[name="eulabs_trip"]'), a = e.querySelector(".eulabs-bundled-widget__field--return"), s = (
      /** @type {HTMLInputElement | null} */
      e.querySelector('input[name="return"]')
    ), r = (
      /** @type {HTMLInputElement | null} */
      e.querySelector("#eulabs_ret_text")
    ), l = (
      /** @type {HTMLSelectElement | null} */
      e.querySelector("#eulabs_gratuity")
    ), c = e.querySelector(".eulabs-bundled-widget__gratuity-hint"), o = (
      /** @type {HTMLInputElement | null} */
      e.querySelector('input[name="departure"]')
    ), f = (
      /** @type {HTMLInputElement | null} */
      e.querySelector("#eulabs_dep_text")
    ), b = (
      /** @type {HTMLInputElement | null} */
      e.querySelector("#eulabs_origin_id")
    ), _ = (
      /** @type {HTMLInputElement | null} */
      e.querySelector("#eulabs_dest_id")
    ), g = (
      /** @type {HTMLInputElement | null} */
      e.querySelector("#eulabs_origin_text")
    ), p = (
      /** @type {HTMLInputElement | null} */
      e.querySelector("#eulabs_dest_text")
    ), m = g == null ? void 0 : g.closest(".eulabs-bundled-widget__field"), v = p == null ? void 0 : p.closest(".eulabs-bundled-widget__field"), E = o == null ? void 0 : o.closest(".eulabs-bundled-widget__field"), S = s == null ? void 0 : s.closest(".eulabs-bundled-widget__field"), L = l == null ? void 0 : l.closest(".eulabs-bundled-widget__gratuity-row");
    this._wireCombo(e, "origin"), this._wireCombo(e, "dest"), this._enhancePickerControls(e), this._wireFloatingField(m, g), this._wireFloatingField(v, p), this._wireFloatingField(E, o), this._wireFloatingField(S, s), this._wireFloatingField(L, l);
    const w = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    o && (o.min = w), s && (s.min = w), x(o, f), x(s, r), o == null || o.addEventListener("change", () => {
      s && o.value && (s.min = o.value), x(o, f);
    }), s == null || s.addEventListener("change", () => {
      x(s, r);
    });
    const $ = () => {
      var h;
      const d = (
        /** @type {HTMLInputElement | null} */
        (h = e.querySelector('input[name="eulabs_trip"][value="round"]')) == null ? void 0 : h.checked
      );
      if (a && a.classList.toggle("eulabs-bundled-widget__field--return-muted", !d), s && (s.disabled = !d, s.required = !!d, d ? o != null && o.value && (s.min = o.value) : (s.value = "", r && (r.value = ""))), this._syncFloatingFieldState(S, s), t.gratuityEnabled && l && c) {
        const C = l.value === "gratuity";
        d && C ? (c.textContent = t.gratuityError || "Gratuidade só para viagem de ida.", c.hidden = !1) : (c.hidden = !0, c.textContent = "");
      }
    };
    i.forEach((d) => d.addEventListener("change", $)), $(), l && l.addEventListener("change", $), (A = e.querySelector(".eulabs-bundled-widget__swap")) == null || A.addEventListener("click", () => {
      if (!b || !_ || !g || !p) return;
      const d = b.value;
      b.value = _.value, _.value = d;
      const h = g.value;
      g.value = p.value, p.value = h, this._closeSuggest(e), this._syncComboClear(e, "origin"), this._syncComboClear(e, "dest");
    }), this._keydownHandler = (d) => {
      d.key === "Escape" && this._closeSuggest(e);
    }, document.addEventListener("keydown", this._keydownHandler);
    const k = e.querySelector(".eulabs-bundled-widget__submit");
    k == null || k.addEventListener("click", () => {
      var R;
      const d = (
        /** @type {HTMLInputElement | null} */
        (R = e.querySelector('input[name="eulabs_trip"][value="round"]')) == null ? void 0 : R.checked
      );
      if (!(b != null && b.value) || !(_ != null && _.value)) {
        this._setStatus(e, "Selecione origem e destino na lista ou continue a digitar até escolher.", !0);
        return;
      }
      if (b.value === _.value) {
        this._setStatus(e, "Origem e destino devem ser diferentes.", !0);
        return;
      }
      if (!(o != null && o.value)) {
        this._setStatus(e, "Indique a data de ida.", !0);
        return;
      }
      if (d && !(s != null && s.value)) {
        this._setStatus(e, "Indique a data de volta.", !0);
        return;
      }
      if (t.gratuityEnabled && (l == null ? void 0 : l.value) === "gratuity" && d) {
        this._setStatus(e, t.gratuityError || "Gratuidade só para ida.", !0);
        return;
      }
      const h = String(this.options.urlWL ?? "").trim();
      if (!h) {
        this._setStatus(e, "Configure urlWL (site) para redirecionar após a pesquisa.", !0);
        return;
      }
      const C = this._sectionalById(b.value), T = this._sectionalById(_.value);
      if (!C || !T) {
        this._setStatus(e, "Origem ou destino inválido. Volte a escolher na lista.", !0);
        return;
      }
      const F = B(C), P = B(T);
      if (!F || !P) {
        this._setStatus(e, "Não foi possível montar o endereço desta rota.", !0);
        return;
      }
      const N = j(o.value);
      if (!N) {
        this._setStatus(e, "Data de ida inválida.", !0);
        return;
      }
      const M = h.endsWith("/") ? h : `${h}/`, z = `comprar-passagem-onibus/${F}/${P}`, D = new URL(z, M);
      if (D.searchParams.set("data", N), d && (s != null && s.value)) {
        const O = j(s.value);
        if (!O) {
          this._setStatus(e, "Data de volta inválida.", !0);
          return;
        }
        D.searchParams.set("volta", O);
      }
      window.location.assign(D.href);
    });
  }
  /** @param {Element} root */
  _enhancePickerControls(e) {
    e.querySelectorAll(".eulabs-bundled-widget__control--date").forEach((i) => {
      const a = (
        /** @type {HTMLInputElement | null} */
        i.querySelector(".eulabs-bundled-widget__native-date")
      );
      a && i.addEventListener("click", (s) => {
        if (!a.disabled && s.target !== a && (a.focus(), typeof a.showPicker == "function"))
          try {
            a.showPicker();
          } catch {
          }
      });
    });
  }
  /**
   * @param {Element | null | undefined} field
   * @param {HTMLInputElement | HTMLSelectElement | null | undefined} input
   */
  _wireFloatingField(e, t) {
    if (!e || !t) return;
    const i = () => this._syncFloatingFieldState(e, t);
    t.addEventListener("focus", i), t.addEventListener("blur", i), t.addEventListener("input", i), t.addEventListener("change", i), i();
  }
  /**
   * @param {Element | null | undefined} field
   * @param {HTMLInputElement | HTMLSelectElement | null | undefined} input
   */
  _syncFloatingFieldState(e, t) {
    if (!e || !t) return;
    const a = t.tagName.toLowerCase() === "select" ? String(
      /** @type {HTMLSelectElement} */
      t.value
    ) : t.value;
    e.classList.toggle("eulabs-bundled-widget__field--focused", document.activeElement === t), e.classList.toggle("eulabs-bundled-widget__field--active", !!String(a).trim()), e.classList.toggle("eulabs-bundled-widget__field--disabled", !!t.disabled);
  }
  /** @param {string} id */
  _sectionalById(e) {
    const t = Number(e);
    return Number.isFinite(t) ? this._sectionals.find((i) => Number(i.id) === t) ?? null : null;
  }
  /**
   * @param {Element} root
   * @param {string} msg
   * @param {boolean} [isError]
   */
  _setStatus(e, t, i = !1) {
    const a = e.querySelector(".eulabs-bundled-widget__status");
    a && (a.textContent = t, a.classList.toggle("eulabs-bundled-widget__status--error", !!i));
  }
  /** @param {Element} root */
  async _loadSectionals(e) {
    var r;
    const t = String(this.options.urlAPI ?? ""), i = (
      /** @type {HTMLInputElement | null} */
      e.querySelector("#eulabs_origin_text")
    ), a = (
      /** @type {HTMLInputElement | null} */
      e.querySelector("#eulabs_dest_text")
    );
    if (!t || !i || !a) {
      this._setStatus(e, "Sem urlAPI configurada.", !0);
      return;
    }
    (r = this._abort) == null || r.abort(), this._abort = new AbortController();
    const s = (l) => {
      this._sectionals = l, i.placeholder = "De onde você vai sair?", a.placeholder = "Para onde você vai?", this._setStatus(
        e,
        l.length ? "" : "Nenhum seccionamento.",
        !l.length
      );
    };
    try {
      const l = await fetch(t, {
        signal: this._abort.signal,
        credentials: "omit",
        headers: { Accept: "application/json" }
      });
      if (!l.ok) throw new Error(`HTTP ${l.status}`);
      const c = await l.json();
      if (!Array.isArray(c)) throw new Error("Resposta não é um array");
      s(
        /** @type {Sectional[]} */
        c
      );
    } catch (l) {
      if (
        /** @type {Error} */
        l.name === "AbortError"
      ) return;
      console.error(l), this._sectionals = [], i.placeholder = "De onde você vai sair?", a.placeholder = "Para onde você vai?", this._setStatus(
        e,
        "Não foi possível obter seccionamentos (rede ou CORS). Em dev, use proxy no Vite.",
        !0
      );
    }
  }
}
function u(n) {
  return String(n).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function j(n) {
  const e = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(n).trim());
  return e ? `${e[3]}-${e[2]}-${e[1]}` : "";
}
function x(n, e) {
  !n || !e || (e.value = n.value ? J(n.value) : "");
}
function J(n) {
  const e = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(n).trim());
  if (!e) return "";
  const t = new Date(Number(e[1]), Number(e[2]) - 1, Number(e[3]), 12, 0, 0);
  if (Number.isNaN(t.getTime())) return "";
  const i = new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(t), a = new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(t), s = new Intl.DateTimeFormat("pt-BR", { day: "numeric" }).format(t), r = new Intl.DateTimeFormat("pt-BR", { year: "numeric" }).format(t);
  return `${H(i)}, ${s} de ${H(a)} ${r}`;
}
function H(n) {
  const e = String(n).replace(/\.$/, "").trim();
  return e ? e.charAt(0).toUpperCase() + e.slice(1) : "";
}
function K(n) {
  return String(n || "").normalize("NFD").replace(new RegExp("\\p{M}", "gu"), "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function B(n) {
  const e = n.slug != null ? String(n.slug).trim() : "";
  if (e) {
    const a = e.toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (a) return a;
  }
  const t = K(String(n.description ?? "")), i = String(n.uf_acronym ?? "").trim().toLowerCase().replace(/[^a-z]/g, "");
  return !t && !i ? "" : i ? t ? `${t}-${i}` : i : t;
}
function q(n, e) {
  if (!e || typeof e != "object") return n;
  for (const t of Object.keys(e)) {
    const i = e[t], a = n[t];
    i && typeof i == "object" && !Array.isArray(i) ? a && typeof a == "object" && !Array.isArray(a) ? q(
      /** @type {Record<string, unknown>} */
      a,
      /** @type {Record<string, unknown>} */
      i
    ) : n[t] = q(
      {},
      /** @type {Record<string, unknown>} */
      /** @type {unknown} */
      i
    ) : n[t] = i;
  }
  return n;
}
function Q(n) {
  const e = typeof n == "string" ? document.querySelector(n) : n;
  if (!e) throw new Error("EulabsWidget: target não encontrado");
  return e;
}
function X(n) {
  return new Promise((e) => {
    if (!n) {
      e();
      return;
    }
    if (document.querySelector(`link[href="${n}"]`)) {
      e();
      return;
    }
    const t = document.createElement("link");
    t.rel = "stylesheet", t.href = n, t.onload = () => e(), t.onerror = () => e(), document.head.appendChild(t);
  });
}
function Y(n) {
  return new Promise((e, t) => {
    if (!n) {
      t(new Error("EulabsWidget: jsUrl do runtime é obrigatório em assets.jsUrl"));
      return;
    }
    const i = document.querySelector(`script[src="${n}"]`);
    if (i) {
      const s = () => e();
      if (i.getAttribute("data-loaded") === "true") {
        s();
        return;
      }
      i.addEventListener("load", () => {
        i.setAttribute("data-loaded", "true"), s();
      }), i.addEventListener("error", () => t(new Error("EulabsWidget: falha ao carregar script")));
      return;
    }
    const a = document.createElement("script");
    a.src = n, a.async = !0, a.onload = () => {
      a.setAttribute("data-loaded", "true"), e();
    }, a.onerror = () => t(new Error("EulabsWidget: falha ao carregar script")), document.body.appendChild(a);
  });
}
const I = "eulabs-widget-root", Z = {
  theme: "white",
  orientation: "vertical",
  labelTexts: {
    origin: "Origem",
    destination: "Destino",
    departureDate: "Data da ida",
    returnDate: "Data da volta",
    search: "Pesquisar viagens",
    toggle_go: "Somente ida",
    toggle_go_and_back: "Ida e volta",
    clear_origin: "Limpar origem",
    clear_destination: "Limpar destino"
  },
  calendarReposition: !0,
  calendarNumberMonths: 2,
  useDefaultCss: !0,
  customCss: null,
  customHeading: {
    enable: !1,
    tag: null,
    content: null
  },
  tracking: {
    source: "undefined",
    medium: "undefined",
    campaign: "undefined"
  },
  customOutput: {
    enable: !1,
    parameter: "",
    where: "after"
  },
  hasRadioButtons: !0,
  gratuity: {
    enable: !1,
    errorMessage: "Consulta de gratuidade somente para viagens de ida",
    optionList: [
      { default: !0, label: "Passagem comum", value: "common" },
      { default: !1, label: "Passagem com benefício", value: "gratuity" }
    ]
  },
  assets: {
    cssUrl: "",
    jsUrl: ""
  },
  rootId: I,
  cssVariables: {
    primary: "#1e9755",
    secondary: "#1e9755",
    primaryDark: "#1e9755",
    transparentSecondary: "#1e97551A"
  }
};
class te {
  /**
   * @param {Record<string, unknown>} [options]
   */
  constructor(e = {}) {
    this.options = q(structuredClone(Z), e), this.instance = null, this._mountEl = null, this._targetEl = null;
  }
  /**
   * Inicializa o widget (carrega assets, monta e liga o runtime).
   * @returns {Promise<EulabsWidget>}
   */
  init() {
    return this.bootstrap();
  }
  /**
   * @returns {Promise<EulabsWidget>}
   */
  async bootstrap() {
    return await this.loadAssets(), this.render(), this.applyCssVariables(), this.bind(), this;
  }
  /**
   * @param {Element} [scope]
   */
  applyCssVariables(e) {
    const t = this.options.cssVariables;
    if (!t || typeof t != "object") return;
    const i = e ?? this._targetEl ?? document.documentElement, a = {
      primary: y(t.primary),
      secondary: y(t.secondary),
      primaryDark: y(t.primaryDark),
      transparentSecondary: ee(t.transparentSecondary, t.secondary)
    }, s = [
      ["primary", "--primary"],
      ["secondary", "--secondary"],
      ["primaryDark", "--primaryDark"],
      ["transparentSecondary", "--transparentSecondary"]
    ];
    for (const [r, l] of s)
      a[r] !== "" && i.style.setProperty(l, a[r]);
    a.primary !== "" && i.style.setProperty("--input-focus-border-color", a.primary), y(t.submitHover) !== "" && i.style.setProperty("--submit-button-background-color-hover", y(t.submitHover));
  }
  async loadAssets() {
    const e = this.options.assets, t = typeof (e == null ? void 0 : e.cssUrl) == "string" ? e.cssUrl : "", i = typeof (e == null ? void 0 : e.jsUrl) == "string" ? e.jsUrl : "";
    this.options.useDefaultCss !== !1 && t && await X(t), i && await Y(i);
  }
  render() {
    const e = Q(
      /** @type {string | Element} */
      this.options.target
    );
    this._targetEl = e;
    const t = typeof this.options.rootId == "string" ? this.options.rootId : I;
    e.innerHTML = `<div id="${t}" class="eulabs-widget-root"></div>`, this._mountEl = document.getElementById(t);
    const i = this.resolveRuntimeConstructor(), s = {
      target: `#${t}`,
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
      gratuity: this.options.gratuity
    };
    this.instance = new i(s), document.readyState === "complete" && this.instance && typeof this.instance.start == "function" ? this.instance.start() : this.instance && typeof this.instance.init == "function" && this.instance.init();
  }
  resolveRuntimeConstructor() {
    var i;
    if (typeof this.options.runtimeConstructor == "function") {
      const a = this.options.runtimeConstructor();
      if (typeof a == "function") return a;
    }
    if (!(typeof ((i = this.options.assets) == null ? void 0 : i.jsUrl) == "string" ? this.options.assets.jsUrl : ""))
      return (
        /** @type {new (opts: object) => RuntimeInstance} */
        G
      );
    const t = this.options.runtimeGlobal;
    if (typeof t == "string" && t && typeof window[
      /** @type {keyof Window} */
      t
    ] == "function")
      return (
        /** @type {new (opts: object) => RuntimeInstance} */
        window[
          /** @type {keyof Window} */
          t
        ]
      );
    throw new Error(
      "EulabsWidget: com assets.jsUrl definido, informe options.runtimeGlobal ou options.runtimeConstructor."
    );
  }
  bind() {
  }
  destroy() {
    this.instance && typeof this.instance.destroy == "function" && this.instance.destroy(), this.instance = null, this._mountEl = null, this._targetEl && (this._targetEl.innerHTML = "", this._targetEl = null);
  }
}
function y(n) {
  return n == null ? "" : String(n).trim();
}
function ee(n, e) {
  const t = y(n);
  if (!t) {
    const i = y(e);
    return i ? `color-mix(in srgb, ${i} 10%, transparent)` : "";
  }
  return /^#([0-9a-f]{4}|[0-9a-f]{8})$/i.test(t) || /^rgba?\(/i.test(t) || /^hsla?\(/i.test(t) || /^color-mix\(/i.test(t) ? t : `color-mix(in srgb, ${t} 10%, transparent)`;
}
export {
  te as default
};
