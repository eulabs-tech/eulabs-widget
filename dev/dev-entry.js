import EulabsWidget from '../src/index.js'

const mount = document.getElementById('widget-eulabs-wrapper')

function showErr(msg) {
  mount.innerHTML = '<p style="color:#b00020">' + msg + '</p>'
}

try {
  await new EulabsWidget({
    target: '#widget-eulabs-wrapper',
    theme: 'white',
    clientId: 10770,
     /** URL do site (front / white-label) */
    urlWL: 'https://www.eucatur.com.br/',
    /** URL da API (back) para listagem de seccionamentos */
    urlAPI: 'https://api-v4.eucatur.com.br/sectionals?is_road_station=true',
    orientation: 'horizontal', /** 'vertical' = coluna; 'horizontal' = linha em ecrãs ≥768px (ver CSS do runtime embutido) */
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
