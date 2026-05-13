import EulabsWidget from '../src/index.js'

/** URL do site (front / white-label) */
const URL_FRONT = 'https://www.eucatur.com.br/'
/** URL da API (back). Em `npm run dev` o Vite faz proxy de `/api-eucatur` → api-v4.eucatur.com.br */
const URL_API = '/api-eucatur/sectionals?is_road_station=true'

const mount = document.getElementById('widget-eulabs-wrapper')

function showErr(msg) {
  mount.innerHTML = '<p style="color:#b00020">' + msg + '</p>'
}

try {
  await new EulabsWidget({
    target: '#widget-eulabs-wrapper',
    theme: 'white',
    clientId: 10770,
    urlWL: URL_FRONT,
    urlAPI: URL_API,
    orientation: 'horizontal',
    cssVariables: {
      primary: '#253040',
      secondary: '#253040',
      primaryDark: '#f4c5b8',
      transparentSecondary: '#2530401A',
    },
    calendarReposition: true,
    calendarNumberMonths: 2,
    useDefaultCss: true,
    customCss: null,
    customHeading: { enable: false, tag: null, content: null },
    tracking: { source: 'undefined', medium: 'undefined', campaign: 'undefined' },
    customOutput: { enable: false, parameter: '', where: 'after' },
    hasRadioButtons: true,
    // gratuity: {
    //   enable: true,
    //   errorMessage: 'Consulta de gratuidade somente para viagens de ida',
    //   optionList: [
    //     { default: true, label: 'Passagem comum', value: 'common' },
    //     { default: false, label: 'Passagem com benefício', value: 'gratuity' },
    //   ],
    // },
  }).init()
} catch (e) {
  console.error(e)
  showErr('Erro ao iniciar o widget: ' + (e && e.message ? e.message : String(e)))
}
