class p {
  /** @param {Record<string, unknown>} options */
  constructor(t) {
    this.options = t, this._mounted = !1;
  }
  /** @returns {void} */
  _mount() {
    if (this._mounted) return;
    const t = (
      /** @type {string} */
      this.options.target
    ), e = document.querySelector(t);
    if (!e) return;
    const s = (
      /** @type {Record<string, string>} */
      this.options.labelTexts && typeof this.options.labelTexts == "object" ? this.options.labelTexts : {}
    ), n = s.origin ?? "Origem?", i = s.destination ?? "Para onde?", d = s.search ?? "Buscar";
    e.innerHTML = `
      <div class="eulabs-bundled-widget" role="region" aria-label="Busca de viagens">
        <p class="eulabs-bundled-widget__note">Modo embutido (pacote npm).</p>
        <div class="eulabs-bundled-widget__row">
          <label class="eulabs-bundled-widget__label">${r(n)}</label>
          <input class="eulabs-bundled-widget__input" type="text" name="origin" autocomplete="off" placeholder="${r(n)}" />
        </div>
        <div class="eulabs-bundled-widget__row">
          <label class="eulabs-bundled-widget__label">${r(i)}</label>
          <input class="eulabs-bundled-widget__input" type="text" name="destination" autocomplete="off" placeholder="${r(i)}" />
        </div>
        <button type="button" class="eulabs-bundled-widget__submit">${r(d)}</button>
      </div>
    `.trim();
    const l = e.querySelector(".eulabs-bundled-widget__submit");
    l && l.addEventListener("click", () => {
      const u = String(this.options.urlWL ?? "");
      u && window.location.assign(u);
    }), this._mounted = !0;
  }
  init() {
    this._mount();
  }
  start() {
    this._mount();
  }
  destroy() {
    const t = (
      /** @type {string} */
      this.options.target
    ), e = document.querySelector(t);
    e && (e.innerHTML = ""), this._mounted = !1;
  }
}
function r(o) {
  return o.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function a(o, t) {
  if (!t || typeof t != "object") return o;
  for (const e of Object.keys(t)) {
    const s = t[e], n = o[e];
    s && typeof s == "object" && !Array.isArray(s) ? n && typeof n == "object" && !Array.isArray(n) ? a(
      /** @type {Record<string, unknown>} */
      n,
      /** @type {Record<string, unknown>} */
      s
    ) : o[e] = a(
      {},
      /** @type {Record<string, unknown>} */
      /** @type {unknown} */
      s
    ) : o[e] = s;
  }
  return o;
}
function m(o) {
  const t = typeof o == "string" ? document.querySelector(o) : o;
  if (!t) throw new Error("EulabsWidget: target não encontrado");
  return t;
}
function h(o) {
  return new Promise((t) => {
    if (!o) {
      t();
      return;
    }
    if (document.querySelector(`link[href="${o}"]`)) {
      t();
      return;
    }
    const e = document.createElement("link");
    e.rel = "stylesheet", e.href = o, e.onload = () => t(), e.onerror = () => t(), document.head.appendChild(e);
  });
}
function f(o) {
  return new Promise((t, e) => {
    if (!o) {
      e(new Error("EulabsWidget: jsUrl do runtime é obrigatório em assets.jsUrl"));
      return;
    }
    const s = document.querySelector(`script[src="${o}"]`);
    if (s) {
      const i = () => t();
      if (s.getAttribute("data-loaded") === "true") {
        i();
        return;
      }
      s.addEventListener("load", () => {
        s.setAttribute("data-loaded", "true"), i();
      }), s.addEventListener("error", () => e(new Error("EulabsWidget: falha ao carregar script")));
      return;
    }
    const n = document.createElement("script");
    n.src = o, n.async = !0, n.onload = () => {
      n.setAttribute("data-loaded", "true"), t();
    }, n.onerror = () => e(new Error("EulabsWidget: falha ao carregar script")), document.body.appendChild(n);
  });
}
const c = "eulabs-widget-root", b = {
  theme: "white",
  orientation: "vertical",
  labelTexts: {
    origin: "Origem?",
    destination: "Para onde?",
    departureDate: "Ida",
    returnDate: "Volta",
    search: "Buscar",
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
    enable: !0,
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
  rootId: c,
  cssVariables: {
    primary: "#253040",
    secondary: "#253040",
    primaryDark: "#f4c5b8",
    transparentSecondary: "#2530401A"
  }
};
class g {
  /**
   * @param {Record<string, unknown>} [options]
   */
  constructor(t = {}) {
    this.options = a(structuredClone(b), t), this.instance = null, this._mountEl = null, this._targetEl = null;
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
    const t = this.options.cssVariables;
    if (!t || typeof t != "object") return;
    const e = document.documentElement, s = [
      ["primary", "--primary"],
      ["secondary", "--secondary"],
      ["primaryDark", "--primaryDark"],
      ["transparentSecondary", "--transparentSecondary"]
    ];
    for (const [n, i] of s)
      t[n] != null && t[n] !== "" && e.style.setProperty(i, String(t[n]));
  }
  async loadAssets() {
    const t = this.options.assets, e = typeof (t == null ? void 0 : t.cssUrl) == "string" ? t.cssUrl : "", s = typeof (t == null ? void 0 : t.jsUrl) == "string" ? t.jsUrl : "";
    this.options.useDefaultCss !== !1 && e && await h(e), s && await f(s);
  }
  render() {
    const t = m(
      /** @type {string | Element} */
      this.options.target
    );
    this._targetEl = t;
    const e = typeof this.options.rootId == "string" ? this.options.rootId : c;
    t.innerHTML = `<div id="${e}" class="eulabs-widget-root"></div>`, this._mountEl = document.getElementById(e);
    const s = this.resolveRuntimeConstructor(), i = {
      target: `#${e}`,
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
        p
      );
    const e = this.options.runtimeGlobal;
    if (typeof e == "string" && e && typeof window[
      /** @type {keyof Window} */
      e
    ] == "function")
      return (
        /** @type {new (opts: object) => RuntimeInstance} */
        window[
          /** @type {keyof Window} */
          e
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
  g as default
};
