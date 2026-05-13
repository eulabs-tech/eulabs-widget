const T = '<svg class="eulabs-bundled-widget__svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/></svg>', D = '<svg class="eulabs-bundled-widget__svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 21s7-4.25 7-10a7 7 0 10-14 0c0 5.75 7 10 7 10z"/><circle cx="12" cy="11" r="2.5" fill="currentColor" stroke="none"/></svg>', $ = '<svg class="eulabs-bundled-widget__svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 5V3M16 5V3" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
class x {
  /** @param {Record<string, unknown>} options */
  constructor(e) {
    this.options = e, this._mounted = !1, this._abort = null, this._keydownHandler = null;
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
    t && (t.innerHTML = ""), this._mounted = !1;
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
    ), n = s.origin ?? "Origem", i = s.destination ?? "Destino", c = s.departureDate ?? "Data da ida", r = s.returnDate ?? "Data da volta", o = s.search ?? "Pesquisar viagens", b = s.toggle_go ?? "Somente ida", m = s.toggle_go_and_back ?? "Ida e volta", d = this.options.gratuity && typeof this.options.gratuity == "object" ? (
      /** @type {{ enable?: boolean; errorMessage?: string; optionList?: Array<{ default?: boolean; label: string; value: string }> }} */
      this.options.gratuity
    ) : { enable: !1, optionList: [] }, p = d.enable === !0 && Array.isArray(d.optionList) && d.optionList.length > 0, y = p ? d.optionList.map(
      (f) => `<option value="${u(String(f.value))}"${f.default ? " selected" : ""}>${u(f.label)}</option>`
    ).join("") : "", h = this.options.orientation === "horizontal" ? "horizontal" : "vertical", v = h === "horizontal" ? "eulabs-bundled-widget--horizontal" : "eulabs-bundled-widget--vertical";
    t.innerHTML = `
      <div class="eulabs-bundled-widget ${v}" role="region" aria-label="Busca de viagens" data-orientation="${h}">
        <p class="eulabs-bundled-widget__note eulabs-bundled-widget__status">Carregando seccionamentos…</p>

        <div class="eulabs-bundled-widget__main">
          <div class="eulabs-bundled-widget__trip-row" role="radiogroup" aria-label="Tipo de viagem">
            <label class="eulabs-bundled-widget__trip-opt">
              <input type="radio" class="eulabs-bundled-widget__trip-input" name="eulabs_trip" value="go" checked />
              <span class="eulabs-bundled-widget__trip-disc" aria-hidden="true"></span>
              <span class="eulabs-bundled-widget__trip-text">${u(b)}</span>
            </label>
            <label class="eulabs-bundled-widget__trip-opt">
              <input type="radio" class="eulabs-bundled-widget__trip-input" name="eulabs_trip" value="round" />
              <span class="eulabs-bundled-widget__trip-disc" aria-hidden="true"></span>
              <span class="eulabs-bundled-widget__trip-text">${u(m)}</span>
            </label>
          </div>

          <div class="eulabs-bundled-widget__toolbar">
            <div class="eulabs-bundled-widget__field">
              <span class="eulabs-bundled-widget__field-label">${u(n)}</span>
              <div class="eulabs-bundled-widget__control">
                <span class="eulabs-bundled-widget__icon">${T}</span>
                <select id="eulabs_origin" class="eulabs-bundled-widget__select" name="origin_sectional" required>
                  <option value="">Carregando…</option>
                </select>
              </div>
            </div>

            <button type="button" class="eulabs-bundled-widget__swap" aria-label="Trocar origem e destino" title="Trocar">
              <span class="eulabs-bundled-widget__swap-inner" aria-hidden="true">⇄</span>
            </button>

            <div class="eulabs-bundled-widget__field">
              <span class="eulabs-bundled-widget__field-label">${u(i)}</span>
              <div class="eulabs-bundled-widget__control">
                <span class="eulabs-bundled-widget__icon">${D}</span>
                <select id="eulabs_dest" class="eulabs-bundled-widget__select" name="dest_sectional" required>
                  <option value="">Carregando…</option>
                </select>
              </div>
            </div>

            <div class="eulabs-bundled-widget__field">
              <span class="eulabs-bundled-widget__field-label">${u(c)}</span>
              <div class="eulabs-bundled-widget__control">
                <span class="eulabs-bundled-widget__icon">${$}</span>
                <input id="eulabs_dep" class="eulabs-bundled-widget__input eulabs-bundled-widget__input--date" type="date" name="departure" required />
              </div>
            </div>

            <div class="eulabs-bundled-widget__field eulabs-bundled-widget__field--return">
              <span class="eulabs-bundled-widget__field-label">${u(r)}</span>
              <div class="eulabs-bundled-widget__control">
                <span class="eulabs-bundled-widget__icon">${$}</span>
                <input id="eulabs_ret" class="eulabs-bundled-widget__input eulabs-bundled-widget__input--date" type="date" name="return" />
              </div>
            </div>

            <button type="button" class="eulabs-bundled-widget__submit">${u(o)}</button>
          </div>

          ${p ? `<div class="eulabs-bundled-widget__gratuity-row">
              <span class="eulabs-bundled-widget__field-label" id="eulabs_gratuity_lbl">Tipo de passagem (gratuidade)</span>
              <select id="eulabs_gratuity" class="eulabs-bundled-widget__select eulabs-bundled-widget__select--wide" name="gratuity" aria-labelledby="eulabs_gratuity_lbl">${y}</select>
              <p class="eulabs-bundled-widget__hint eulabs-bundled-widget__gratuity-hint" hidden></p>
            </div>` : ""}
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
    `.trim(), this._bindControls(t, {
      gratuityEnabled: p,
      gratuityError: String(d.errorMessage ?? "")
    }), this._loadSectionals(t), this._mounted = !0;
  }
  /**
   * @param {Element} root
   * @param {{ gratuityEnabled: boolean; gratuityError: string }} ctx
   */
  _bindControls(e, t) {
    var C;
    const s = e.querySelectorAll('input[name="eulabs_trip"]'), n = e.querySelector(".eulabs-bundled-widget__field--return"), i = (
      /** @type {HTMLInputElement | null} */
      e.querySelector('input[name="return"]')
    ), c = (
      /** @type {HTMLSelectElement | null} */
      e.querySelector("#eulabs_gratuity")
    ), r = e.querySelector(".eulabs-bundled-widget__gratuity-hint"), o = (
      /** @type {HTMLInputElement | null} */
      e.querySelector('input[name="departure"]')
    ), b = (
      /** @type {HTMLSelectElement | null} */
      e.querySelector('[name="origin_sectional"]')
    ), m = (
      /** @type {HTMLSelectElement | null} */
      e.querySelector('[name="dest_sectional"]')
    ), d = e.querySelector(".eulabs-bundled-modal"), p = e.querySelector(".eulabs-bundled-modal__times"), y = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    o && (o.min = y), i && (i.min = y), o == null || o.addEventListener("change", () => {
      i && o.value && (i.min = o.value);
    });
    const h = () => {
      var g;
      const a = (
        /** @type {HTMLInputElement | null} */
        (g = e.querySelector('input[name="eulabs_trip"][value="round"]')) == null ? void 0 : g.checked
      );
      if (n && n.classList.toggle("eulabs-bundled-widget__field--return-muted", !a), i && (i.disabled = !a, i.required = !!a, a ? o != null && o.value && (i.min = o.value) : i.value = ""), t.gratuityEnabled && c && r) {
        const _ = c.value === "gratuity";
        a && _ ? (r.textContent = t.gratuityError || "Gratuidade só para viagem de ida.", r.hidden = !1) : (r.hidden = !0, r.textContent = "");
      }
    };
    s.forEach((a) => a.addEventListener("change", h)), h(), c && c.addEventListener("change", h), (C = e.querySelector(".eulabs-bundled-widget__swap")) == null || C.addEventListener("click", () => {
      if (!b || !m) return;
      const a = b.value;
      b.value = m.value, m.value = a;
    });
    const v = ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
    p && (p.innerHTML = v.map(
      (a) => `<button type="button" class="eulabs-bundled-modal__slot" data-hour="${u(a)}">${u(a)}</button>`
    ).join(""));
    const f = () => {
      d && (d.hidden = !1);
    }, S = () => {
      d && (d.hidden = !0);
    };
    this._keydownHandler = (a) => {
      a.key === "Escape" && d && !d.hidden && S();
    }, document.addEventListener("keydown", this._keydownHandler), d == null || d.querySelectorAll("[data-close]").forEach((a) => a.addEventListener("click", S)), p == null || p.addEventListener("click", (a) => {
      const _ = /** @type {HTMLElement} */ a.target.closest(".eulabs-bundled-modal__slot");
      if (!_) return;
      const w = _.getAttribute("data-hour") ?? "", q = String(this.options.urlWL ?? "");
      if (q) {
        const L = new URL(q, window.location.href);
        L.searchParams.set("hour", w), window.location.assign(L.toString());
      } else
        S();
    });
    const E = e.querySelector(".eulabs-bundled-widget__submit");
    E == null || E.addEventListener("click", () => {
      var w;
      const a = (
        /** @type {HTMLSelectElement | null} */
        e.querySelector('[name="origin_sectional"]')
      ), g = (
        /** @type {HTMLSelectElement | null} */
        e.querySelector('[name="dest_sectional"]')
      ), _ = (
        /** @type {HTMLInputElement | null} */
        (w = e.querySelector('input[name="eulabs_trip"][value="round"]')) == null ? void 0 : w.checked
      );
      if (!(a != null && a.value) || !(g != null && g.value)) {
        this._setStatus(e, "Selecione origem e destino.", !0);
        return;
      }
      if (a.value === g.value) {
        this._setStatus(e, "Origem e destino devem ser diferentes.", !0);
        return;
      }
      if (!(o != null && o.value)) {
        this._setStatus(e, "Indique a data de ida.", !0);
        return;
      }
      if (_ && !(i != null && i.value)) {
        this._setStatus(e, "Indique a data de volta.", !0);
        return;
      }
      if (t.gratuityEnabled && (c == null ? void 0 : c.value) === "gratuity" && _) {
        this._setStatus(e, t.gratuityError || "Gratuidade só para ida.", !0);
        return;
      }
      this._setStatus(e, "Escolha um horário na janela abaixo.", !1), f();
    });
  }
  /**
   * @param {Element} root
   * @param {string} msg
   * @param {boolean} isError
   */
  _setStatus(e, t, s) {
    const n = e.querySelector(".eulabs-bundled-widget__status");
    n && (n.textContent = t, n.classList.toggle("eulabs-bundled-widget__status--error", s));
  }
  /** @param {Element} root */
  async _loadSectionals(e) {
    var c;
    const t = String(this.options.urlAPI ?? ""), s = (
      /** @type {HTMLSelectElement | null} */
      e.querySelector('[name="origin_sectional"]')
    ), n = (
      /** @type {HTMLSelectElement | null} */
      e.querySelector('[name="dest_sectional"]')
    );
    if (!t || !s || !n) {
      this._setStatus(e, "Sem urlAPI configurada.", !0);
      return;
    }
    (c = this._abort) == null || c.abort(), this._abort = new AbortController();
    const i = (r) => {
      const o = `<option value="">${r.length ? "Selecione…" : "Sem dados"}</option>` + r.map(
        (b) => `<option value="${b.id}">${u(b.description)}${b.uf_acronym ? ` (${u(b.uf_acronym)})` : ""}</option>`
      ).join("");
      s.innerHTML = o, n.innerHTML = o, this._setStatus(e, `${r.length} seccionamento(s) carregado(s).`, !1);
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
      console.error(r), s.innerHTML = '<option value="">Erro ao carregar</option>', n.innerHTML = '<option value="">Erro ao carregar</option>', this._setStatus(
        e,
        "Não foi possível obter seccionamentos (rede ou CORS). Em dev, use proxy no Vite ou extensão só para testes.",
        !0
      );
    }
  }
}
function u(l) {
  return String(l).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function k(l, e) {
  if (!e || typeof e != "object") return l;
  for (const t of Object.keys(e)) {
    const s = e[t], n = l[t];
    s && typeof s == "object" && !Array.isArray(s) ? n && typeof n == "object" && !Array.isArray(n) ? k(
      /** @type {Record<string, unknown>} */
      n,
      /** @type {Record<string, unknown>} */
      s
    ) : l[t] = k(
      {},
      /** @type {Record<string, unknown>} */
      /** @type {unknown} */
      s
    ) : l[t] = s;
  }
  return l;
}
function j(l) {
  const e = typeof l == "string" ? document.querySelector(l) : l;
  if (!e) throw new Error("EulabsWidget: target não encontrado");
  return e;
}
function H(l) {
  return new Promise((e) => {
    if (!l) {
      e();
      return;
    }
    if (document.querySelector(`link[href="${l}"]`)) {
      e();
      return;
    }
    const t = document.createElement("link");
    t.rel = "stylesheet", t.href = l, t.onload = () => e(), t.onerror = () => e(), document.head.appendChild(t);
  });
}
function M(l) {
  return new Promise((e, t) => {
    if (!l) {
      t(new Error("EulabsWidget: jsUrl do runtime é obrigatório em assets.jsUrl"));
      return;
    }
    const s = document.querySelector(`script[src="${l}"]`);
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
    n.src = l, n.async = !0, n.onload = () => {
      n.setAttribute("data-loaded", "true"), e();
    }, n.onerror = () => t(new Error("EulabsWidget: falha ao carregar script")), document.body.appendChild(n);
  });
}
const A = "eulabs-widget-root", U = {
  theme: "white",
  orientation: "vertical",
  labelTexts: {
    origin: "Origem",
    destination: "Destino",
    departureDate: "Data da ida",
    returnDate: "Data da volta",
    search: "Pesquisar viagens",
    toggle_go: "Somente ida",
    toggle_go_and_back: "Ida e volta"
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
  rootId: A,
  cssVariables: {
    primary: "#253040",
    secondary: "#253040",
    primaryDark: "#f4c5b8",
    transparentSecondary: "#2530401A"
  }
};
class R {
  /**
   * @param {Record<string, unknown>} [options]
   */
  constructor(e = {}) {
    this.options = k(structuredClone(U), e), this.instance = null, this._mountEl = null, this._targetEl = null;
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
    this.options.useDefaultCss !== !1 && t && await H(t), s && await M(s);
  }
  render() {
    const e = j(
      /** @type {string | Element} */
      this.options.target
    );
    this._targetEl = e;
    const t = typeof this.options.rootId == "string" ? this.options.rootId : A;
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
        x
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
  R as default
};
