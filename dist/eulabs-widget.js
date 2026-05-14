const U = '<svg class="eulabs-bundled-widget__svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/></svg>', R = '<svg class="eulabs-bundled-widget__svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 21s7-4.25 7-10a7 7 0 10-14 0c0 5.75 7 10 7 10z"/><circle cx="12" cy="11" r="2.5" fill="currentColor" stroke="none"/></svg>', q = '<svg class="eulabs-bundled-widget__svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 5V3M16 5V3" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
class H {
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
    var s;
    (s = this._abort) == null || s.abort(), this._abort = null, this._keydownHandler && (document.removeEventListener("keydown", this._keydownHandler), this._keydownHandler = null);
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
    const s = (
      /** @type {Record<string, string>} */
      this.options.labelTexts && typeof this.options.labelTexts == "object" ? this.options.labelTexts : {}
    ), n = s.origin ?? "Origem", i = s.destination ?? "Destino", l = s.departureDate ?? "Data da ida", r = s.returnDate ?? "Data da volta", o = s.search ?? "Pesquisar viagens", u = s.toggle_go ?? "Somente ida", b = s.toggle_go_and_back ?? "Ida e volta", f = s.clear_origin ?? "Limpar origem", m = s.clear_destination ?? "Limpar destino", y = "De onde você vai sair?", g = this.options.gratuity && typeof this.options.gratuity == "object" ? (
      /** @type {{ enable?: boolean; errorMessage?: string; optionList?: Array<{ default?: boolean; label: string; value: string }> }} */
      this.options.gratuity
    ) : { enable: !1, optionList: [] }, h = g.enable === !0 && Array.isArray(g.optionList) && g.optionList.length > 0, v = h ? g.optionList.map(
      (p) => `<option value="${c(String(p.value))}"${p.default ? " selected" : ""}>${c(p.label)}</option>`
    ).join("") : "", d = this.options.orientation === "horizontal" ? "horizontal" : "vertical", _ = d === "horizontal" ? "eulabs-bundled-widget--horizontal" : "eulabs-bundled-widget--vertical";
    t.innerHTML = `
      <div class="eulabs-bundled-widget ${_}" role="region" aria-label="Busca de viagens" data-orientation="${d}">
        <p class="eulabs-bundled-widget__note eulabs-bundled-widget__status">Carregando seccionamentos…</p>

        <div class="eulabs-bundled-widget__main">
          <div class="eulabs-bundled-widget__trip-row" role="radiogroup" aria-label="Tipo de viagem">
            <label class="eulabs-bundled-widget__trip-opt">
              <input type="radio" class="eulabs-bundled-widget__trip-input" name="eulabs_trip" value="go" checked />
              <span class="eulabs-bundled-widget__trip-disc" aria-hidden="true"></span>
              <span class="eulabs-bundled-widget__trip-text">${c(u)}</span>
            </label>
            <label class="eulabs-bundled-widget__trip-opt">
              <input type="radio" class="eulabs-bundled-widget__trip-input" name="eulabs_trip" value="round" />
              <span class="eulabs-bundled-widget__trip-disc" aria-hidden="true"></span>
              <span class="eulabs-bundled-widget__trip-text">${c(b)}</span>
            </label>
          </div>

          <div class="eulabs-bundled-widget__toolbar">
            <div class="eulabs-bundled-widget__origin-row">
              <div class="eulabs-bundled-widget__field eulabs-bundled-widget__field--origin">
                <label class="eulabs-bundled-widget__field-label" for="eulabs_origin_text">${c(n)}</label>
                <div class="eulabs-bundled-widget__control eulabs-bundled-widget__combo">
                  <span class="eulabs-bundled-widget__icon">${U}</span>
                  <div class="eulabs-bundled-widget__combo-inner">
                    <input type="hidden" name="origin_sectional" id="eulabs_origin_id" value="" />
                    <input type="text" id="eulabs_origin_text" class="eulabs-bundled-widget__input eulabs-bundled-widget__input--combo" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="false" aria-controls="eulabs_origin_list" aria-autocomplete="list" placeholder="${c(y)}" />
                    <button type="button" class="eulabs-bundled-widget__combo-clear" id="eulabs_origin_clear" aria-label="${c(f)}" title="${c(f)}" hidden><span class="eulabs-bundled-widget__combo-clear-icon" aria-hidden="true">×</span></button>
                    <ul class="eulabs-bundled-widget__suggest" id="eulabs_origin_list" role="listbox" hidden></ul>
                  </div>
                </div>
              </div>
              <button type="button" class="eulabs-bundled-widget__swap" aria-label="Trocar origem e destino" title="Trocar">
                <span class="eulabs-bundled-widget__swap-inner" aria-hidden="true">⇄</span>
              </button>
            </div>

            <div class="eulabs-bundled-widget__field">
              <label class="eulabs-bundled-widget__field-label" for="eulabs_dest_text">${c(i)}</label>
              <div class="eulabs-bundled-widget__control eulabs-bundled-widget__combo">
                <span class="eulabs-bundled-widget__icon">${R}</span>
                <div class="eulabs-bundled-widget__combo-inner">
                  <input type="hidden" name="dest_sectional" id="eulabs_dest_id" value="" />
                  <input type="text" id="eulabs_dest_text" class="eulabs-bundled-widget__input eulabs-bundled-widget__input--combo" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="false" aria-controls="eulabs_dest_list" aria-autocomplete="list" placeholder="${c(y)}" />
                  <button type="button" class="eulabs-bundled-widget__combo-clear" id="eulabs_dest_clear" aria-label="${c(m)}" title="${c(m)}" hidden><span class="eulabs-bundled-widget__combo-clear-icon" aria-hidden="true">×</span></button>
                  <ul class="eulabs-bundled-widget__suggest" id="eulabs_dest_list" role="listbox" hidden></ul>
                </div>
              </div>
            </div>

            <div class="eulabs-bundled-widget__field">
              <span class="eulabs-bundled-widget__field-label">${c(l)}</span>
              <div class="eulabs-bundled-widget__control">
                <span class="eulabs-bundled-widget__icon">${q}</span>
                <input id="eulabs_dep" class="eulabs-bundled-widget__input eulabs-bundled-widget__input--date" type="date" name="departure" required />
              </div>
            </div>

            <div class="eulabs-bundled-widget__field eulabs-bundled-widget__field--return">
              <span class="eulabs-bundled-widget__field-label">${c(r)}</span>
              <div class="eulabs-bundled-widget__control">
                <span class="eulabs-bundled-widget__icon">${q}</span>
                <input id="eulabs_ret" class="eulabs-bundled-widget__input eulabs-bundled-widget__input--date" type="date" name="return" />
              </div>
            </div>

            <button type="button" class="eulabs-bundled-widget__submit">${c(o)}</button>
          </div>

          ${h ? `<div class="eulabs-bundled-widget__gratuity-row">
              <span class="eulabs-bundled-widget__field-label" id="eulabs_gratuity_lbl">Tipo de passagem (gratuidade)</span>
              <select id="eulabs_gratuity" class="eulabs-bundled-widget__select eulabs-bundled-widget__select--wide" name="gratuity" aria-labelledby="eulabs_gratuity_lbl">${v}</select>
              <p class="eulabs-bundled-widget__hint eulabs-bundled-widget__gratuity-hint" hidden></p>
            </div>` : ""}
        </div>
      </div>
    `.trim(), this._bindControls(t, {
      gratuityEnabled: h,
      gratuityError: String(g.errorMessage ?? "")
    }), this._loadSectionals(t), this._mounted = !0;
  }
  /** @param {Sectional} s */
  _sectionalLabel(e) {
    const t = String(e.description ?? ""), s = e.uf_acronym ? String(e.uf_acronym) : "", n = e.code ? String(e.code) : "", i = s ? `${t} (${s})` : t;
    return n ? `${i} — ${n}` : i;
  }
  /** @param {string} q */
  _filterSectionals(e) {
    const t = e.trim().toLowerCase();
    return t ? this._sectionals.filter((s) => [
      s.description,
      s.uf_acronym,
      s.code,
      String(s.id)
    ].filter(Boolean).join(" ").toLowerCase().includes(t)).slice(0, 12) : this._sectionals.slice(0, 12);
  }
  /**
   * @param {Element} root
   * @param {string} listId
   * @param {Sectional[]} items
   * @param {(s: Sectional) => void} onPick
   */
  _renderSuggestList(e, t, s) {
    e.innerHTML = "";
    for (const n of t) {
      const i = document.createElement("li");
      i.setAttribute("role", "option"), i.tabIndex = -1, i.dataset.id = String(n.id), i.textContent = this._sectionalLabel(n), i.addEventListener("mousedown", (l) => {
        l.preventDefault(), s(n);
      }), e.appendChild(i);
    }
  }
  /** @param {Element} root */
  _closeSuggest(e) {
    for (const t of ["eulabs_origin_list", "eulabs_dest_list"]) {
      const s = e.querySelector(`#${t}`), n = t.replace("_list", "_text"), i = e.querySelector(`#${n}`);
      s && (s.hidden = !0), i && i.setAttribute("aria-expanded", "false");
    }
  }
  /**
   * @param {Element} root
   * @param {'origin' | 'dest'} which
   */
  _syncComboClear(e, t) {
    const s = t === "origin" ? "origin" : "dest", n = (
      /** @type {HTMLInputElement | null} */
      e.querySelector(`#eulabs_${s}_id`)
    ), i = (
      /** @type {HTMLInputElement | null} */
      e.querySelector(`#eulabs_${s}_text`)
    ), l = e.querySelector(`#eulabs_${s}_clear`);
    if (!n || !i || !l) return;
    const r = !!(String(n.value).trim() || i.value.trim());
    l.hidden = !r;
  }
  /**
   * @param {Element} root
   * @param {'origin' | 'dest'} which
   */
  _wireCombo(e, t) {
    const s = t === "origin" ? "origin" : "dest", n = (
      /** @type {HTMLInputElement | null} */
      e.querySelector(`#eulabs_${s}_id`)
    ), i = (
      /** @type {HTMLInputElement | null} */
      e.querySelector(`#eulabs_${s}_text`)
    ), l = e.querySelector(`#eulabs_${s}_list`), r = e.querySelector(`#eulabs_${s}_clear`);
    if (!n || !i || !l) return;
    const o = () => {
      if (!this._sectionals.length) return;
      const u = this._filterSectionals(i.value);
      this._renderSuggestList(l, u, (b) => {
        n.value = String(b.id), i.value = this._sectionalLabel(b), l.hidden = !0, i.setAttribute("aria-expanded", "false"), this._syncComboClear(e, t);
      }), l.hidden = u.length === 0, i.setAttribute("aria-expanded", l.hidden ? "false" : "true"), this._syncComboClear(e, t);
    };
    i.addEventListener("focus", () => {
      this._sectionals.length ? o() : this._syncComboClear(e, t);
    }), i.addEventListener("input", () => {
      n.value = "", o();
    }), i.addEventListener("blur", () => {
      setTimeout(() => {
        l.hidden = !0, i.setAttribute("aria-expanded", "false");
      }, 180);
    }), r == null || r.addEventListener("mousedown", (u) => {
      u.preventDefault();
    }), r == null || r.addEventListener("click", () => {
      n.value = "", i.value = "", l.innerHTML = "", l.hidden = !0, i.setAttribute("aria-expanded", "false"), this._syncComboClear(e, t), i.focus();
    });
  }
  /**
   * @param {Element} root
   * @param {{ gratuityEnabled: boolean; gratuityError: string }} ctx
   */
  _bindControls(e, t) {
    var v;
    const s = e.querySelectorAll('input[name="eulabs_trip"]'), n = e.querySelector(".eulabs-bundled-widget__field--return"), i = (
      /** @type {HTMLInputElement | null} */
      e.querySelector('input[name="return"]')
    ), l = (
      /** @type {HTMLSelectElement | null} */
      e.querySelector("#eulabs_gratuity")
    ), r = e.querySelector(".eulabs-bundled-widget__gratuity-hint"), o = (
      /** @type {HTMLInputElement | null} */
      e.querySelector('input[name="departure"]')
    ), u = (
      /** @type {HTMLInputElement | null} */
      e.querySelector("#eulabs_origin_id")
    ), b = (
      /** @type {HTMLInputElement | null} */
      e.querySelector("#eulabs_dest_id")
    ), f = (
      /** @type {HTMLInputElement | null} */
      e.querySelector("#eulabs_origin_text")
    ), m = (
      /** @type {HTMLInputElement | null} */
      e.querySelector("#eulabs_dest_text")
    );
    this._wireCombo(e, "origin"), this._wireCombo(e, "dest");
    const y = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    o && (o.min = y), i && (i.min = y), o == null || o.addEventListener("change", () => {
      i && o.value && (i.min = o.value);
    });
    const g = () => {
      var _;
      const d = (
        /** @type {HTMLInputElement | null} */
        (_ = e.querySelector('input[name="eulabs_trip"][value="round"]')) == null ? void 0 : _.checked
      );
      if (n && n.classList.toggle("eulabs-bundled-widget__field--return-muted", !d), i && (i.disabled = !d, i.required = !!d, d ? o != null && o.value && (i.min = o.value) : i.value = ""), t.gratuityEnabled && l && r) {
        const p = l.value === "gratuity";
        d && p ? (r.textContent = t.gratuityError || "Gratuidade só para viagem de ida.", r.hidden = !1) : (r.hidden = !0, r.textContent = "");
      }
    };
    s.forEach((d) => d.addEventListener("change", g)), g(), l && l.addEventListener("change", g), (v = e.querySelector(".eulabs-bundled-widget__swap")) == null || v.addEventListener("click", () => {
      if (!u || !b || !f || !m) return;
      const d = u.value;
      u.value = b.value, b.value = d;
      const _ = f.value;
      f.value = m.value, m.value = _, this._closeSuggest(e), this._syncComboClear(e, "origin"), this._syncComboClear(e, "dest");
    }), this._keydownHandler = (d) => {
      d.key === "Escape" && this._closeSuggest(e);
    }, document.addEventListener("keydown", this._keydownHandler);
    const h = e.querySelector(".eulabs-bundled-widget__submit");
    h == null || h.addEventListener("click", () => {
      var L;
      const d = (
        /** @type {HTMLInputElement | null} */
        (L = e.querySelector('input[name="eulabs_trip"][value="round"]')) == null ? void 0 : L.checked
      );
      if (!(u != null && u.value) || !(b != null && b.value)) {
        this._setStatus(e, "Selecione origem e destino na lista ou continue a digitar até escolher.", !0);
        return;
      }
      if (u.value === b.value) {
        this._setStatus(e, "Origem e destino devem ser diferentes.", !0);
        return;
      }
      if (!(o != null && o.value)) {
        this._setStatus(e, "Indique a data de ida.", !0);
        return;
      }
      if (d && !(i != null && i.value)) {
        this._setStatus(e, "Indique a data de volta.", !0);
        return;
      }
      if (t.gratuityEnabled && (l == null ? void 0 : l.value) === "gratuity" && d) {
        this._setStatus(e, t.gratuityError || "Gratuidade só para ida.", !0);
        return;
      }
      const _ = String(this.options.urlWL ?? "").trim();
      if (!_) {
        this._setStatus(e, "Configure urlWL (site) para redirecionar após a pesquisa.", !0);
        return;
      }
      const p = this._sectionalById(u.value), C = this._sectionalById(b.value);
      if (!p || !C) {
        this._setStatus(e, "Origem ou destino inválido. Volte a escolher na lista.", !0);
        return;
      }
      const E = A(p), x = A(C);
      if (!E || !x) {
        this._setStatus(e, "Não foi possível montar o endereço desta rota.", !0);
        return;
      }
      const $ = D(o.value);
      if (!$) {
        this._setStatus(e, "Data de ida inválida.", !0);
        return;
      }
      const O = _.endsWith("/") ? _ : `${_}/`, j = `comprar-passagem-onibus/${E}/${x}`, w = new URL(j, O);
      if (w.searchParams.set("data", $), d && (i != null && i.value)) {
        const k = D(i.value);
        if (!k) {
          this._setStatus(e, "Data de volta inválida.", !0);
          return;
        }
        w.searchParams.set("volta", k);
      }
      window.location.assign(w.href);
    });
  }
  /** @param {string} id */
  _sectionalById(e) {
    const t = Number(e);
    return Number.isFinite(t) ? this._sectionals.find((s) => Number(s.id) === t) ?? null : null;
  }
  /**
   * @param {Element} root
   * @param {string} msg
   * @param {boolean} [isError]
   */
  _setStatus(e, t, s = !1) {
    const n = e.querySelector(".eulabs-bundled-widget__status");
    n && (n.textContent = t, n.classList.toggle("eulabs-bundled-widget__status--error", !!s));
  }
  /** @param {Element} root */
  async _loadSectionals(e) {
    var l;
    const t = String(this.options.urlAPI ?? ""), s = (
      /** @type {HTMLInputElement | null} */
      e.querySelector("#eulabs_origin_text")
    ), n = (
      /** @type {HTMLInputElement | null} */
      e.querySelector("#eulabs_dest_text")
    );
    if (!t || !s || !n) {
      this._setStatus(e, "Sem urlAPI configurada.", !0);
      return;
    }
    (l = this._abort) == null || l.abort(), this._abort = new AbortController();
    const i = (r) => {
      this._sectionals = r, s.placeholder = r.length ? "De onde você vai sair?" : "Sem seccionamentos", n.placeholder = r.length ? "Para onde você vai?" : "Sem seccionamentos", this._setStatus(
        e,
        r.length ? "" : "Nenhum seccionamento.",
        !r.length
      );
    };
    try {
      const r = await fetch(t, {
        signal: this._abort.signal,
        credentials: "omit",
        headers: { Accept: "application/json" }
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const o = await r.json();
      if (!Array.isArray(o)) throw new Error("Resposta não é um array");
      i(
        /** @type {Sectional[]} */
        o
      );
    } catch (r) {
      if (
        /** @type {Error} */
        r.name === "AbortError"
      ) return;
      console.error(r), this._sectionals = [], s.placeholder = "Erro ao carregar", n.placeholder = "Erro ao carregar", this._setStatus(
        e,
        "Não foi possível obter seccionamentos (rede ou CORS). Em dev, use proxy no Vite.",
        !0
      );
    }
  }
}
function c(a) {
  return String(a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function D(a) {
  const e = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(a).trim());
  return e ? `${e[3]}-${e[2]}-${e[1]}` : "";
}
function I(a) {
  return String(a || "").normalize("NFD").replace(new RegExp("\\p{M}", "gu"), "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function A(a) {
  const e = a.slug != null ? String(a.slug).trim() : "";
  if (e) {
    const n = e.toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (n) return n;
  }
  const t = I(String(a.description ?? "")), s = String(a.uf_acronym ?? "").trim().toLowerCase().replace(/[^a-z]/g, "");
  return !t && !s ? "" : s ? t ? `${t}-${s}` : s : t;
}
function S(a, e) {
  if (!e || typeof e != "object") return a;
  for (const t of Object.keys(e)) {
    const s = e[t], n = a[t];
    s && typeof s == "object" && !Array.isArray(s) ? n && typeof n == "object" && !Array.isArray(n) ? S(
      /** @type {Record<string, unknown>} */
      n,
      /** @type {Record<string, unknown>} */
      s
    ) : a[t] = S(
      {},
      /** @type {Record<string, unknown>} */
      /** @type {unknown} */
      s
    ) : a[t] = s;
  }
  return a;
}
function P(a) {
  const e = typeof a == "string" ? document.querySelector(a) : a;
  if (!e) throw new Error("EulabsWidget: target não encontrado");
  return e;
}
function M(a) {
  return new Promise((e) => {
    if (!a) {
      e();
      return;
    }
    if (document.querySelector(`link[href="${a}"]`)) {
      e();
      return;
    }
    const t = document.createElement("link");
    t.rel = "stylesheet", t.href = a, t.onload = () => e(), t.onerror = () => e(), document.head.appendChild(t);
  });
}
function N(a) {
  return new Promise((e, t) => {
    if (!a) {
      t(new Error("EulabsWidget: jsUrl do runtime é obrigatório em assets.jsUrl"));
      return;
    }
    const s = document.querySelector(`script[src="${a}"]`);
    if (s) {
      const i = () => e();
      if (s.getAttribute("data-loaded") === "true") {
        i();
        return;
      }
      s.addEventListener("load", () => {
        s.setAttribute("data-loaded", "true"), i();
      }), s.addEventListener("error", () => t(new Error("EulabsWidget: falha ao carregar script")));
      return;
    }
    const n = document.createElement("script");
    n.src = a, n.async = !0, n.onload = () => {
      n.setAttribute("data-loaded", "true"), e();
    }, n.onerror = () => t(new Error("EulabsWidget: falha ao carregar script")), document.body.appendChild(n);
  });
}
const T = "eulabs-widget-root", B = {
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
  rootId: T,
  cssVariables: {
    primary: "#253040",
    secondary: "#253040",
    primaryDark: "#f4c5b8",
    transparentSecondary: "#2530401A"
  }
};
class W {
  /**
   * @param {Record<string, unknown>} [options]
   */
  constructor(e = {}) {
    this.options = S(structuredClone(B), e), this.instance = null, this._mountEl = null, this._targetEl = null;
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
    return this.applyCssVariables(), await this.loadAssets(), this.render(), this.bind(), this;
  }
  applyCssVariables() {
    const e = this.options.cssVariables;
    if (!e || typeof e != "object") return;
    const t = document.documentElement, s = [
      ["primary", "--primary"],
      ["secondary", "--secondary"],
      ["primaryDark", "--primaryDark"],
      ["transparentSecondary", "--transparentSecondary"]
    ];
    for (const [n, i] of s)
      e[n] != null && e[n] !== "" && t.style.setProperty(i, String(e[n]));
  }
  async loadAssets() {
    const e = this.options.assets, t = typeof (e == null ? void 0 : e.cssUrl) == "string" ? e.cssUrl : "", s = typeof (e == null ? void 0 : e.jsUrl) == "string" ? e.jsUrl : "";
    this.options.useDefaultCss !== !1 && t && await M(t), s && await N(s);
  }
  render() {
    const e = P(
      /** @type {string | Element} */
      this.options.target
    );
    this._targetEl = e;
    const t = typeof this.options.rootId == "string" ? this.options.rootId : T;
    e.innerHTML = `<div id="${t}" class="eulabs-widget-root"></div>`, this._mountEl = document.getElementById(t);
    const s = this.resolveRuntimeConstructor(), i = {
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
    this.instance = new s(i), document.readyState === "complete" && this.instance && typeof this.instance.start == "function" ? this.instance.start() : this.instance && typeof this.instance.init == "function" && this.instance.init();
  }
  resolveRuntimeConstructor() {
    var s;
    if (typeof this.options.runtimeConstructor == "function") {
      const n = this.options.runtimeConstructor();
      if (typeof n == "function") return n;
    }
    if (!(typeof ((s = this.options.assets) == null ? void 0 : s.jsUrl) == "string" ? this.options.assets.jsUrl : ""))
      return (
        /** @type {new (opts: object) => RuntimeInstance} */
        H
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
export {
  W as default
};
