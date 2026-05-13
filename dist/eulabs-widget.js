function i(s, t) {
  if (!t || typeof t != "object") return s;
  for (const e of Object.keys(t)) {
    const n = t[e], o = s[e];
    n && typeof n == "object" && !Array.isArray(n) ? o && typeof o == "object" && !Array.isArray(o) ? i(
      /** @type {Record<string, unknown>} */
      o,
      /** @type {Record<string, unknown>} */
      n
    ) : s[e] = i(
      {},
      /** @type {Record<string, unknown>} */
      /** @type {unknown} */
      n
    ) : s[e] = n;
  }
  return s;
}
function u(s) {
  const t = typeof s == "string" ? document.querySelector(s) : s;
  if (!t) throw new Error("EulabsWidget: target não encontrado");
  return t;
}
function l(s) {
  return new Promise((t) => {
    if (!s) {
      t();
      return;
    }
    if (document.querySelector(`link[href="${s}"]`)) {
      t();
      return;
    }
    const e = document.createElement("link");
    e.rel = "stylesheet", e.href = s, e.onload = () => t(), e.onerror = () => t(), document.head.appendChild(e);
  });
}
function c(s) {
  return new Promise((t, e) => {
    if (!s) {
      e(new Error("EulabsWidget: jsUrl do runtime é obrigatório em assets.jsUrl"));
      return;
    }
    const n = document.querySelector(`script[src="${s}"]`);
    if (n) {
      const r = () => t();
      if (n.getAttribute("data-loaded") === "true") {
        r();
        return;
      }
      n.addEventListener("load", () => {
        n.setAttribute("data-loaded", "true"), r();
      }), n.addEventListener("error", () => e(new Error("EulabsWidget: falha ao carregar script")));
      return;
    }
    const o = document.createElement("script");
    o.src = s, o.async = !0, o.onload = () => {
      o.setAttribute("data-loaded", "true"), t();
    }, o.onerror = () => e(new Error("EulabsWidget: falha ao carregar script")), document.body.appendChild(o);
  });
}
const a = "eulabs-widget-root", d = {
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
  rootId: a,
  cssVariables: {
    primary: "#253040",
    secondary: "#253040",
    primaryDark: "#f4c5b8",
    transparentSecondary: "#2530401A"
  }
};
class p {
  /**
   * @param {Record<string, unknown>} [options]
   */
  constructor(t = {}) {
    this.options = i(structuredClone(d), t), this.instance = null, this._mountEl = null, this._targetEl = null;
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
    const e = document.documentElement, n = [
      ["primary", "--primary"],
      ["secondary", "--secondary"],
      ["primaryDark", "--primaryDark"],
      ["transparentSecondary", "--transparentSecondary"]
    ];
    for (const [o, r] of n)
      t[o] != null && t[o] !== "" && e.style.setProperty(r, String(t[o]));
  }
  async loadAssets() {
    const t = this.options.assets, e = typeof (t == null ? void 0 : t.cssUrl) == "string" ? t.cssUrl : "", n = typeof (t == null ? void 0 : t.jsUrl) == "string" ? t.jsUrl : "";
    if (this.options.useDefaultCss !== !1 && e && await l(e), !n)
      throw new Error("EulabsWidget: informe options.assets.jsUrl com a URL do script do runtime.");
    await c(n);
  }
  render() {
    const t = u(
      /** @type {string | Element} */
      this.options.target
    );
    this._targetEl = t;
    const e = typeof this.options.rootId == "string" ? this.options.rootId : a;
    t.innerHTML = `<div id="${e}" class="eulabs-widget-root"></div>`, this._mountEl = document.getElementById(e);
    const n = this.resolveRuntimeConstructor(), r = {
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
    this.instance = new n(r), document.readyState === "complete" && this.instance && typeof this.instance.start == "function" ? this.instance.start() : this.instance && typeof this.instance.init == "function" && this.instance.init();
  }
  resolveRuntimeConstructor() {
    if (typeof this.options.runtimeConstructor == "function") {
      const e = this.options.runtimeConstructor();
      if (typeof e == "function") return e;
    }
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
      "EulabsWidget: defina options.runtimeGlobal (string) ou options.runtimeConstructor (função que retorna o construtor)."
    );
  }
  bind() {
  }
  destroy() {
    this.instance && typeof this.instance.destroy == "function" && this.instance.destroy(), this.instance = null, this._mountEl = null, this._targetEl && (this._targetEl.innerHTML = "", this._targetEl = null);
  }
}
export {
  p as default
};
