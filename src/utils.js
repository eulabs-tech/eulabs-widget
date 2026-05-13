/**
 * @param {Record<string, unknown>} target
 * @param {Record<string, unknown>} source
 * @returns {Record<string, unknown>}
 */
export function mergeDeep(target, source) {
  if (!source || typeof source !== 'object') return target
  for (const key of Object.keys(source)) {
    const sv = source[key]
    const tv = target[key]
    if (sv && typeof sv === 'object' && !Array.isArray(sv)) {
      if (tv && typeof tv === 'object' && !Array.isArray(tv)) {
        mergeDeep(/** @type {Record<string, unknown>} */ (tv), /** @type {Record<string, unknown>} */ (sv))
      } else {
        target[key] = mergeDeep({}, /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (sv)))
      }
    } else {
      target[key] = sv
    }
  }
  return target
}

/**
 * @param {string | Element} selector
 * @returns {Element}
 */
export function resolveTarget(selector) {
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector
  if (!el) throw new Error('EulabsWidget: target não encontrado')
  return el
}

/**
 * @param {string | undefined | null} href
 * @returns {Promise<void>}
 */
export function loadCss(href) {
  return new Promise((resolve) => {
    if (!href) {
      resolve()
      return
    }
    if (document.querySelector(`link[href="${href}"]`)) {
      resolve()
      return
    }
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.onload = () => resolve()
    link.onerror = () => resolve()
    document.head.appendChild(link)
  })
}

/**
 * @param {string | undefined | null} src
 * @returns {Promise<void>}
 */
export function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error('EulabsWidget: jsUrl do runtime é obrigatório em assets.jsUrl'))
      return
    }
    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) {
      const done = () => resolve()
      if (existing.getAttribute('data-loaded') === 'true') {
        done()
        return
      }
      existing.addEventListener('load', () => {
        existing.setAttribute('data-loaded', 'true')
        done()
      })
      existing.addEventListener('error', () => reject(new Error('EulabsWidget: falha ao carregar script')))
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => {
      script.setAttribute('data-loaded', 'true')
      resolve()
    }
    script.onerror = () => reject(new Error('EulabsWidget: falha ao carregar script'))
    document.body.appendChild(script)
  })
}
