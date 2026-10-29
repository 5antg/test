import { PREDIOS_PRESET, CATALOGO_PLANOS_POT, FORMULAS_CESIONES } from './data/pot-sogamoso.js';
import { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where 
} from './firebase-config.js';

// Estado Global Reactivo de la Aplicación
const state = {
  activeTab: 'explorador',
  mapMode: 'leaflet', // 'leaflet' | 'svg'
  currentPredio: PREDIOS_PRESET[0],
  allPredios: [...PREDIOS_PRESET],
  proposals: {
    uso: 'mixto',
    ocupacionP1: 280.0,
    pisos: 5,
    altura: 15.8,
    totalConstruido: 1120.0,
    aislamientoPosterior: 3.2,
    antejardin: 2.5
  },
  cesionesInputs: {
    unidadesVivienda: 10,
    localesComerciales: 2,
    modalidadCompensacion: 'dinero' // 'sitio' | 'dinero'
  },
  savedEvaluations: [],
  currentUser: null,
  leafletMap: null,
  activeMarker: null,
  igacCatastroLayer: null,
  isIgacLayerActive: true
};

// Inicialización cuando carga el DOM
document.addEventListener('DOMContentLoaded', () => {
  loadSavedEvaluations();
  initNavigation();
  initSearch();
  initSimulationEngine();
  initCesionesEngine();
  initPlanoteca();
  initAuthModal();
  initPdfExport();
  initLeafletMap();

  // Render inicial de todos los componentes con el predio por defecto
  setPredioActivo(state.currentPredio);
});

/* ==========================================================================
   1. NAVEGACIÓN ENTRE PESTAÑAS
   ========================================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll('nav[data-main-nav] a[data-path]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPath = link.getAttribute('data-path');
      switchTab(targetPath);
    });
  });

  document.querySelectorAll('[data-switch-to]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-switch-to');
      switchTab(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

export function switchTab(tabId) {
  state.activeTab = tabId;

  document.querySelectorAll('nav[data-main-nav] a[data-path]').forEach(link => {
    const path = link.getAttribute('data-path');
    if (path === tabId) {
      link.className = "px-space-md py-2 transition-all duration-200 bg-surface-container-highest text-primary font-medium rounded-full shadow-sm";
      link.setAttribute('aria-current', 'page');
    } else {
      link.className = "px-space-md py-2 rounded-full font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-200";
      link.removeAttribute('aria-current');
    }
  });

  const tabContainers = document.querySelectorAll('.tab-view-container');
  tabContainers.forEach(container => {
    if (container.id === `tab-${tabId}`) {
      container.classList.remove('hidden');
    } else {
      container.classList.add('hidden');
    }
  });

  if (tabId === 'explorador' && state.leafletMap) {
    setTimeout(() => {
      state.leafletMap.invalidateSize();
    }, 150);
  }
}

/* ==========================================================================
   2. SINCRONIZACIÓN DE DATOS ENTRE PESTAÑAS (ESTADO REACTIVO)
   ========================================================================== */
export function setPredioActivo(predio) {
  state.currentPredio = predio;

  // Ajustar valores preliminares según dimensiones del predio
  const norma = predio.norma;
  state.proposals.ocupacionP1 = Math.round(predio.areaTerreno * (norma.indiceOcupacionMax * 0.95) * 10) / 10;
  state.proposals.pisos = norma.pisosMaximos;
  state.proposals.altura = Math.round((norma.alturaMaximaMetros * 0.95) * 10) / 10;
  state.proposals.totalConstruido = Math.round((predio.areaTerreno * norma.indiceConstruccionMax * 0.9) * 10) / 10;
  state.proposals.aislamientoPosterior = norma.aislamientoPosteriorMin + 0.2;
  state.proposals.antejardin = norma.antejardinMin;

  syncAllViews(predio);
}

function syncAllViews(predio) {
  // 1. Barra superior
  const pillAddress = document.getElementById('header-active-predio-pill');
  if (pillAddress) {
    pillAddress.innerHTML = `Sogamoso · ${predio.barrio} · ${predio.direccion} <span class="font-label-sm text-label-sm text-primary font-medium ml-1">(${predio.areaTerreno.toFixed(2)} m²)</span>`;
  }

  // 2. Ficha Normativa
  updateFichaNormativa(predio);

  // 3. Simulador de Cumplimiento
  updateSimuladorView(predio);

  // 4. Calculadora de Cesiones
  updateCesionesView(predio);

  // 5. Panel Flotante y Pin en el Mapa
  updateExploradorHUD(predio);
  setPredioPinOnMap(predio);
  updateColombiaEnMapasLink(predio);
}

/* ==========================================================================
   3. EXPLORADOR URBANO Y PIN ELEGANTE DE LOCALIZACIÓN (LEAFLET)
   ========================================================================== */
function initLeafletMap() {
  const mapElement = document.getElementById('leaflet-map');
  if (!mapElement || typeof L === 'undefined') return;

  const sogamosoCoords = [state.currentPredio.coordenadas.lat, state.currentPredio.coordenadas.lng];
  
  state.leafletMap = L.map('leaflet-map', {
    center: sogamosoCoords,
    zoom: 17,
    zoomControl: false
  });

  // Capa base satelital / urbana
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap | POT Sogamoso 2016 | IGAC Colombia en Mapas'
  }).addTo(state.leafletMap);

  // Capa WMS de Catastro IGAC
  try {
    state.igacCatastroLayer = L.tileLayer.wms('https://mapas.igac.gov.co/server/services/catastro/wms/MapServer/WMSServer', {
      layers: '0,1,2',
      format: 'image/png',
      transparent: true,
      opacity: 0.65,
      attribution: 'Límites Prediales: IGAC / Colombia en Mapas',
      maxZoom: 20
    });
    state.igacCatastroLayer.addTo(state.leafletMap);
  } catch (err) {
    console.warn("Servicio WMS de IGAC temporalmente no disponible.", err);
  }

  // Toggle de la capa IGAC en el DOM
  const igacToggle = document.getElementById('toggle-layer-igac');
  if (igacToggle) {
    igacToggle.addEventListener('change', (e) => {
      state.isIgacLayerActive = e.target.checked;
      if (state.igacCatastroLayer) {
        if (state.isIgacLayerActive) {
          state.leafletMap.addLayer(state.igacCatastroLayer);
        } else {
          state.leafletMap.removeLayer(state.igacCatastroLayer);
        }
      }
    });
  }

  // Clic en el mapa para capturar predio
  state.leafletMap.on('click', (e) => {
    const { lat, lng } = e.latlng;
    createCustomPredioFromCoords(lat, lng);
  });

  // Controles de zoom
  document.getElementById('btn-map-zoom-in')?.addEventListener('click', () => state.leafletMap.zoomIn());
  document.getElementById('btn-map-zoom-out')?.addEventListener('click', () => state.leafletMap.zoomOut());
  document.getElementById('btn-map-recenter')?.addEventListener('click', () => {
    state.leafletMap.setView([state.currentPredio.coordenadas.lat, state.currentPredio.coordenadas.lng], 18);
  });

  // Alternador con plano CAD SVG
  const toggleMapBtn = document.getElementById('btn-toggle-map-mode');
  if (toggleMapBtn) {
    toggleMapBtn.addEventListener('click', () => {
      const leafletContainer = document.getElementById('leaflet-map-wrapper');
      const svgContainer = document.getElementById('svg-map-wrapper');
      const modeLabel = document.getElementById('map-mode-label');

      if (state.mapMode === 'leaflet') {
        state.mapMode = 'svg';
        leafletContainer.classList.add('hidden');
        svgContainer.classList.remove('hidden');
        if (modeLabel) modeLabel.textContent = "Vista Planimétrica CAD (SVG)";
      } else {
        state.mapMode = 'leaflet';
        svgContainer.classList.add('hidden');
        leafletContainer.classList.remove('hidden');
        if (modeLabel) modeLabel.textContent = "Mapa Satelital / Urbano (Leaflet)";
        if (state.leafletMap) state.leafletMap.invalidateSize();
      }
    });
  }
}

/**
 * MARCADOR / PIN DEL PREDIO ACTIVO
 */
function setPredioPinOnMap(predio) {
  if (!state.leafletMap || typeof L === 'undefined') return;

  // Limpiar marcador anterior
  if (state.activeMarker) {
    state.leafletMap.removeLayer(state.activeMarker);
    state.activeMarker = null;
  }

  const { lat, lng } = predio.coordenadas;

  // Icono arquitectónico Atelier Lilac
  const pinHtml = `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
      <div style="background: #655090; color: #ffffff; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(101,80,144,0.45); border: 2.5px solid #ffffff;">
        <span class="material-symbols-outlined" style="transform: rotate(45deg); font-size: 20px; color: #ffffff;">location_on</span>
      </div>
      <div style="width: 10px; height: 3px; background: rgba(31,24,42,0.35); border-radius: 50%; margin-top: 2px;"></div>
    </div>
  `;

  const customPinIcon = L.divIcon({
    html: pinHtml,
    className: 'custom-predio-pin',
    iconSize: [34, 42],
    iconAnchor: [17, 39],
    popupAnchor: [0, -38]
  });

  state.activeMarker = L.marker([lat, lng], {
    icon: customPinIcon,
    title: predio.direccion
  }).addTo(state.leafletMap);

  state.activeMarker.bindPopup(`
    <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px; min-width: 180px;">
      <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
        <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#655090;"></span>
        <strong style="color: #655090; font-size: 13px;">${predio.direccion}</strong>
      </div>
      <div style="font-size: 11px; color: #5c5b64; line-height: 1.4;">
        <strong>Área:</strong> ${predio.areaTerreno.toFixed(2)} m²<br>
        <strong>Tratamiento:</strong> ${predio.tratamiento}<br>
        <strong>Zonificación:</strong> ${predio.zonificacion}
      </div>
      <div style="margin-top:6px; padding-top:6px; border-top:1px solid #eadef6; font-size:10px; color:#1f182a; font-weight:600;">
        POT Sogamoso · Ac. 029/2016
      </div>
    </div>
  `);

  state.leafletMap.flyTo([lat, lng], 17, {
    duration: 0.8
  });
}

/**
 * DECODIFICADOR OFICIAL DE CÉDULA CATASTRAL (30 DÍGITOS)
 */
export function decodeCadastralCode(code) {
  const clean = code.replace(/\D/g, '');
  if (clean.length < 15) {
    return {
      valido: false,
      mensaje: "Cédula corta o no numérica (estándar IGAC son 30 dígitos)"
    };
  }

  const dpto = clean.substring(0, 2);
  const mun = clean.substring(2, 5);
  const zona = clean.substring(5, 6);
  const sector = clean.substring(6, 8);
  const comuna = clean.substring(8, 10);
  const manzana = clean.substring(10, 14);
  const predio = clean.substring(14, 18);

  const esSogamoso = (dpto === '15' && mun === '759');
  const esUrbano = (zona === '1');

  return {
    valido: true,
    codigoCompleto: clean,
    esSogamoso,
    departamento: dpto === '15' ? 'Boyacá (15)' : `Dpto ${dpto}`,
    municipio: mun === '759' ? 'Sogamoso (759)' : `Mun ${mun}`,
    zona: esUrbano ? 'Urbano (1)' : 'Rural (2)',
    sector: `Sector ${sector}`,
    comuna: `Comuna ${comuna}`,
    manzana: `MZ-${manzana}`,
    lote: `LOTE-${predio}`
  };
}

function updateColombiaEnMapasLink(predio) {
  const btnIgac = document.getElementById('btn-colombia-en-mapas-link');
  if (!btnIgac) return;

  const lat = predio.coordenadas.lat;
  const lng = predio.coordenadas.lng;
  
  const url = `https://www.colombiaenmapas.gov.co/?e=${(lng - 0.005).toFixed(4)},${(lat - 0.005).toFixed(4)},${(lng + 0.005).toFixed(4)},${(lat + 0.005).toFixed(4)},4326&b=igac&u=0&t=catastro`;
  btnIgac.href = url;
}

function createCustomPredioFromCoords(lat, lng) {
  const mzRandom = String(Math.floor(10 + Math.random() * 80)).padStart(4, '0');
  const loteRandom = String(Math.floor(1 + Math.random() * 40)).padStart(4, '0');
  const cedulaIGAC = `15759010102${mzRandom}${loteRandom}0000000000`;

  const customPredio = {
    id: `custom-${Date.now()}`,
    codigoCatastral: cedulaIGAC,
    matricula: `095-${Math.floor(100000 + Math.random() * 900000)}`,
    direccion: `Coordenadas [${lat.toFixed(4)}, ${lng.toFixed(4)}]`,
    barrio: "Sector Urbano Central",
    comuna: "Comuna 02 Sugamuxi",
    manzana: `MZ-${mzRandom.substring(2)}`,
    lote: `LOTE-${loteRandom.substring(2)}`,
    areaTerreno: 420.00,
    frente: 14.00,
    fondo: 30.00,
    estrato: 4,
    perfilVial: "V-3 (Calle Urbana Colectora, 12.00 m)",
    coordenadas: {
      lat: lat,
      lng: lng,
      norteMagna: `${(1108000 + Math.random() * 1000).toFixed(2)} m`,
      esteMagna: `${(1124000 + Math.random() * 1000).toFixed(2)} m`,
      texto: `${lat.toFixed(5)}°N, ${Math.abs(lng).toFixed(5)}°W`
    },
    tratamiento: "Consolidación Urbana (TU-2)",
    tratamientoDesc: "Reglamentación del Acuerdo 029 de 2016 para suelo urbano consolidado de Sogamoso.",
    zonificacion: "CAM-2 (Mixto Comercial / Residencial)",
    zonificacionDesc: "Comercio en primeros pisos y vivienda en niveles superiores.",
    norma: {
      indiceOcupacionMax: 0.70,
      indiceConstruccionMax: 2.80,
      pisosMaximos: 5,
      alturaMaximaMetros: 16.50,
      aislamientoPosteriorMin: 3.00,
      aislamientoLateralMin: 0.00,
      antejardinMin: 2.50,
      voladizoMax: 0.80,
      parqueaderosRatio: "1 cupo cada 2 viviendas + 1 visitante cada 5",
      articulos: {
        ocupacion: "Art. 184 Acuerdo 029/2016",
        construccion: "Art. 186 Acuerdo 029/2016",
        altura: "Art. 192 Acuerdo 029/2016",
        aislamiento: "Art. 198 Acuerdo 029/2016",
        antejardin: "Art. 204 Acuerdo 029/2016",
        cesiones: "Art. 215 Acuerdo 029/2016"
      }
    },
    usos: {
      permitidos: ["Vivienda Multifamiliar", "Comercio Minorista P1"],
      compatibles: ["Oficinas y Consultorios Médicos"],
      condicionados: ["Talleres y Bodegas Menores"],
      prohibidos: ["Industria de Alto Impacto", "Discotecas Masivas"]
    },
    amenazaRiesgo: "Bajo (Área apta para construcción)",
    equipamientosCercanos: [
      { nombre: "Parque Urbano Cercano", tipo: "Recreación", distancia: "390 m", icon: "park" },
      { nombre: "Centro de Salud", tipo: "Salud", distancia: "650 m", icon: "local_hospital" }
    ]
  };

  setPredioActivo(customPredio);
}

function updateExploradorHUD(predio) {
  const elCedula = document.getElementById('hud-cedula-catastral');
  if (elCedula) elCedula.textContent = predio.codigoCatastral;

  const elMzLote = document.getElementById('hud-manzana-lote');
  if (elMzLote) elMzLote.textContent = `${predio.manzana} · ${predio.lote}`;

  const decoded = decodeCadastralCode(predio.codigoCatastral);
  const elDecoded = document.getElementById('hud-cedula-decoded-info');
  if (elDecoded) {
    if (decoded.valido) {
      elDecoded.innerHTML = `
        <span class="text-emerald-700 font-semibold">Cédula IGAC Válida:</span> ${decoded.departamento} · ${decoded.municipio} · ${decoded.zona} · ${decoded.manzana} · ${decoded.lote}
      `;
    } else {
      elDecoded.textContent = decoded.mensaje;
    }
  }

  const elDiagAddress = document.getElementById('diag-card-address');
  if (elDiagAddress) elDiagAddress.textContent = predio.direccion;

  const elDiagSubtitle = document.getElementById('diag-card-subtitle');
  if (elDiagSubtitle) elDiagSubtitle.textContent = `${predio.barrio} · ${predio.manzana} · ${predio.lote}`;

  const elDiagArea = document.getElementById('diag-card-area');
  if (elDiagArea) elDiagArea.textContent = `${predio.areaTerreno.toFixed(0)} m²`;

  const elDiagFrente = document.getElementById('diag-card-frente');
  if (elDiagFrente) elDiagFrente.textContent = `${predio.frente.toFixed(2)} m`;

  const elDiagFondo = document.getElementById('diag-card-fondo');
  if (elDiagFondo) elDiagFondo.textContent = `${predio.fondo.toFixed(2)} m`;

  const elDiagZonif = document.getElementById('diag-card-zonif');
  if (elDiagZonif) elDiagZonif.textContent = predio.zonificacion;

  const elDiagTrat = document.getElementById('diag-card-tratamiento');
  if (elDiagTrat) elDiagTrat.textContent = predio.tratamiento;

  const elDiagAltura = document.getElementById('diag-card-altura');
  if (elDiagAltura) elDiagAltura.textContent = `${predio.norma.pisosMaximos} Pisos (${predio.norma.alturaMaximaMetros.toFixed(2)} m)`;

  const elDiagAisl = document.getElementById('diag-card-aislamiento');
  if (elDiagAisl) elDiagAisl.textContent = `Exigido ${predio.norma.aislamientoPosteriorMin.toFixed(2)} m`;

  const elCoords = document.getElementById('hud-coords-text');
  if (elCoords) elCoords.textContent = predio.coordenadas.texto;
}

function initSearch() {
  const searchInput = document.getElementById('main-search-input');
  const searchBtn = document.getElementById('main-search-btn');

  function executeSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;

    const found = state.allPredios.find(p => 
      p.direccion.toLowerCase().includes(query) ||
      p.codigoCatastral.includes(query) ||
      p.barrio.toLowerCase().includes(query)
    );

    if (found) {
      setPredioActivo(found);
    } else {
      const cleanDigits = query.replace(/\D/g, '');
      if (cleanDigits.length >= 15) {
        const decoded = decodeCadastralCode(cleanDigits);
        const lat = 5.7148 + (Math.random() - 0.5) * 0.015;
        const lng = -72.9333 + (Math.random() - 0.5) * 0.015;
        createCustomPredioFromCoords(lat, lng);
        state.currentPredio.codigoCatastral = cleanDigits.padEnd(30, '0');
        state.currentPredio.direccion = `Predio Catastral IGAC (${decoded.manzana} · ${decoded.lote})`;
        syncAllViews(state.currentPredio);
      } else {
        const lat = 5.7148 + (Math.random() - 0.5) * 0.02;
        const lng = -72.9333 + (Math.random() - 0.5) * 0.02;
        createCustomPredioFromCoords(lat, lng);
      }
    }
  }

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', executeSearch);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') executeSearch();
    });
  }

  window.selectPreset = (presetId) => {
    const target = state.allPredios.find(p => p.id === presetId);
    if (target) {
      setPredioActivo(target);
      if (searchInput) searchInput.value = target.direccion;
    }
  };
}

/* ==========================================================================
   4. FICHA NORMATIVA (DATOS OFICIALES ACUERDO 029 DE 2016)
   ========================================================================== */
function updateFichaNormativa(predio) {
  const norma = predio.norma;

  const elTitle = document.getElementById('ficha-title-address');
  if (elTitle) elTitle.innerHTML = `${predio.direccion} <span class="text-primary font-normal italic">· ${predio.barrio}</span>`;

  const elSubtitle = document.getElementById('ficha-subtitle-loc');
  if (elSubtitle) elSubtitle.innerHTML = `${predio.comuna} · Sogamoso (Boyacá) · Perfil Vía <span class="text-on-surface font-semibold">${predio.perfilVial}</span>`;

  const elMatricula = document.getElementById('ficha-meta-matricula');
  if (elMatricula) elMatricula.textContent = `Matrícula: ${predio.matricula}`;

  const elArea = document.getElementById('ficha-metric-area');
  if (elArea) elArea.textContent = predio.areaTerreno.toFixed(2);

  const elFrente = document.getElementById('ficha-metric-frente');
  if (elFrente) elFrente.textContent = predio.frente.toFixed(2);

  const elFondo = document.getElementById('ficha-metric-fondo');
  if (elFondo) elFondo.textContent = predio.fondo.toFixed(2);

  const elIo = document.getElementById('ficha-norma-io');
  if (elIo) elIo.textContent = `${(norma.indiceOcupacionMax * 100).toFixed(0)}% (${(predio.areaTerreno * norma.indiceOcupacionMax).toFixed(2)} m²)`;

  const elIc = document.getElementById('ficha-norma-ic');
  if (elIc) elIc.textContent = `${norma.indiceConstruccionMax.toFixed(2)}x (${(predio.areaTerreno * norma.indiceConstruccionMax).toFixed(2)} m²)`;

  const elPisos = document.getElementById('ficha-norma-pisos');
  if (elPisos) elPisos.textContent = `Hasta ${norma.pisosMaximos} pisos (${norma.alturaMaximaMetros.toFixed(2)} m)`;

  const elAislPost = document.getElementById('ficha-norma-aisl-post');
  if (elAislPost) elAislPost.textContent = `Mínimo ${norma.aislamientoPosteriorMin.toFixed(2)} m`;

  const elAntejardin = document.getElementById('ficha-norma-antejardin');
  if (elAntejardin) elAntejardin.textContent = `Mínimo ${norma.antejardinMin.toFixed(2)} m`;

  const elVoladizo = document.getElementById('ficha-norma-voladizo');
  if (elVoladizo) elVoladizo.textContent = `Máximo ${norma.voladizoMax.toFixed(2)} m`;

  const elTrat = document.getElementById('ficha-desc-tratamiento');
  if (elTrat) elTrat.textContent = `${predio.tratamiento}: ${predio.tratamientoDesc}`;

  const elZonif = document.getElementById('ficha-desc-zonificacion');
  if (elZonif) elZonif.textContent = `${predio.zonificacion}: ${predio.zonificacionDesc}`;

  renderUsosList('ficha-usos-permitidos', predio.usos.permitidos);
  renderUsosList('ficha-usos-compatibles', predio.usos.compatibles);
  renderUsosList('ficha-usos-condicionados', predio.usos.condicionados);
  renderUsosList('ficha-usos-prohibidos', predio.usos.prohibidos);
}

function renderUsosList(containerId, list) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  list.forEach(item => {
    const li = document.createElement('li');
    li.className = "flex items-center gap-2 text-body-sm py-1";
    li.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span><span>${item}</span>`;
    container.appendChild(li);
  });
}

/* ==========================================================================
   5. SIMULADOR Y MOTOR DE CUMPLIMIENTO CON RECOMENDACIONES TÉCNICAS
   ========================================================================== */
function initSimulationEngine() {
  const inputs = [
    'inp-ocupacion',
    'inp-pisos',
    'inp-altura',
    'inp-total-const',
    'inp-aisl-post',
    'inp-antejardin',
    'select-uso'
  ];

  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      readSimulationInputs();
      evaluateCompliance();
    });
  });
}

function readSimulationInputs() {
  const getVal = (id) => parseFloat(document.getElementById(id)?.value) || 0;
  state.proposals.ocupacionP1 = getVal('inp-ocupacion');
  state.proposals.pisos = parseInt(document.getElementById('inp-pisos')?.value) || 1;
  state.proposals.altura = getVal('inp-altura');
  state.proposals.totalConstruido = getVal('inp-total-const');
  state.proposals.aislamientoPosterior = getVal('inp-aisl-post');
  state.proposals.antejardin = getVal('inp-antejardin');
  state.proposals.uso = document.getElementById('select-uso')?.value || 'mixto';
}

function updateSimuladorView(predio) {
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };

  setVal('inp-ocupacion', state.proposals.ocupacionP1);
  setVal('inp-pisos', state.proposals.pisos);
  setVal('inp-altura', state.proposals.altura);
  setVal('inp-total-const', state.proposals.totalConstruido);
  setVal('inp-aisl-post', state.proposals.aislamientoPosterior);
  setVal('inp-antejardin', state.proposals.antejardin);

  const elHeaderPredio = document.getElementById('sim-header-predio-code');
  if (elHeaderPredio) elHeaderPredio.textContent = `Predio: ${predio.manzana} · ${predio.lote}`;

  const elHeaderArea = document.getElementById('sim-header-area');
  if (elHeaderArea) elHeaderArea.textContent = `Área Lote: ${predio.areaTerreno.toFixed(2)} m²`;

  evaluateCompliance();
}

function evaluateCompliance() {
  const predio = state.currentPredio;
  const prop = state.proposals;
  const norma = predio.norma;

  const recommendations = [];

  // 1. Ocupación P1 (IO)
  const maxOcupacion = predio.areaTerreno * norma.indiceOcupacionMax;
  const ioCalculado = prop.ocupacionP1 / predio.areaTerreno;
  const cumpleOcupacion = prop.ocupacionP1 <= maxOcupacion;

  if (!cumpleOcupacion) {
    const exceso = (prop.ocupacionP1 - maxOcupacion).toFixed(1);
    recommendations.push(`Reduce la huella de primer piso en al menos <strong>${exceso} m²</strong> para cumplir el IO máximo del ${(norma.indiceOcupacionMax * 100).toFixed(0)}% (${norma.articulos.ocupacion}).`);
  }

  updateTrafficLight('chk-ocupacion', {
    cumple: cumpleOcupacion,
    valorPropuesto: `${prop.ocupacionP1.toFixed(2)} m² (IO: ${(ioCalculado * 100).toFixed(1)}%)`,
    limitePermitido: `Máx. ${maxOcupacion.toFixed(2)} m² (${(norma.indiceOcupacionMax * 100).toFixed(0)}%)`,
    articulo: norma.articulos.ocupacion
  });

  // 2. Altura
  const cumplePisos = prop.pisos <= norma.pisosMaximos;
  const cumpleAltura = prop.altura <= norma.alturaMaximaMetros;
  const cumpleVolumetria = cumplePisos && cumpleAltura;

  if (!cumplePisos) {
    recommendations.push(`El proyecto excede el número de pisos permitidos (propuesto: ${prop.pisos}, límite: ${norma.pisosMaximos} pisos). Ajusta a la altura del sector (${norma.articulos.altura}).`);
  } else if (!cumpleAltura) {
    recommendations.push(`La altura en metros (${prop.altura.toFixed(1)} m) supera el gálibo máximo permitido de ${norma.alturaMaximaMetros.toFixed(1)} m (${norma.articulos.altura}).`);
  }

  updateTrafficLight('chk-altura', {
    cumple: cumpleVolumetria,
    valorPropuesto: `${prop.pisos} Pisos (${prop.altura.toFixed(2)} m)`,
    limitePermitido: `Tope: ${norma.pisosMaximos} Pisos (${norma.alturaMaximaMetros.toFixed(2)} m)`,
    articulo: norma.articulos.altura
  });

  // 3. Área Total Construida (IC)
  const maxConstruido = predio.areaTerreno * norma.indiceConstruccionMax;
  const icCalculado = prop.totalConstruido / predio.areaTerreno;
  const cumpleConstruccion = prop.totalConstruido <= maxConstruido;

  if (!cumpleConstruccion) {
    const excesoConst = (prop.totalConstruido - maxConstruido).toFixed(1);
    recommendations.push(`Área construida total excede en <strong>${excesoConst} m²</strong> el índice de construcción permitido (${norma.indiceConstruccionMax.toFixed(2)}x según ${norma.articulos.construccion}).`);
  }

  updateTrafficLight('chk-construccion', {
    cumple: cumpleConstruccion,
    valorPropuesto: `${prop.totalConstruido.toFixed(2)} m² (IC: ${icCalculado.toFixed(2)})`,
    limitePermitido: `Máx. ${maxConstruido.toFixed(2)} m² (IC: ${norma.indiceConstruccionMax.toFixed(2)})`,
    articulo: norma.articulos.construccion
  });

  // 4. Aislamiento Posterior
  const cumpleAislamiento = prop.aislamientoPosterior >= norma.aislamientoPosteriorMin;

  if (!cumpleAislamiento) {
    const falta = (norma.aislamientoPosteriorMin - prop.aislamientoPosterior).toFixed(1);
    recommendations.push(`Amplía el aislamiento posterior en <strong>${falta} m</strong> hacia el lindero de fondo para alcanzar el retiro reglamentario de ${norma.aislamientoPosteriorMin.toFixed(1)} m (${norma.articulos.aislamiento}).`);
  }

  updateTrafficLight('chk-aislamiento', {
    cumple: cumpleAislamiento,
    valorPropuesto: `${prop.aislamientoPosterior.toFixed(2)} m`,
    limitePermitido: `Mínimo: ${norma.aislamientoPosteriorMin.toFixed(2)} m`,
    articulo: norma.articulos.aislamiento
  });

  // Scorecard General y Recomendaciones
  const scoreCard = document.getElementById('sim-global-scorecard');
  const allCumple = cumpleOcupacion && cumpleVolumetria && cumpleConstruccion && cumpleAislamiento;

  if (scoreCard) {
    if (allCumple) {
      scoreCard.className = "p-space-md rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col gap-2";
      scoreCard.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-emerald-600 text-[28px]">check_circle</span>
            <div>
              <h4 class="font-headline-sm text-headline-sm font-semibold text-emerald-950">Propuesta Viable · Cumplimiento Normativo 100%</h4>
              <p class="font-body-sm text-body-sm text-emerald-800">Cumple con las directrices volumétricas del Acuerdo 029 de 2016 para ${predio.barrio}.</p>
            </div>
          </div>
          <span class="px-3 py-1 bg-emerald-600 text-white rounded-full font-label-sm text-label-sm uppercase font-semibold">Aprobado</span>
        </div>
      `;
    } else {
      let recsHtml = recommendations.map(r => `<li class="text-[12px] text-amber-900 list-disc ml-4">${r}</li>`).join('');
      scoreCard.className = "p-space-md rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col gap-2.5";
      scoreCard.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-amber-600 text-[28px]">warning</span>
            <div>
              <h4 class="font-headline-sm text-headline-sm font-semibold text-amber-950">Observaciones Normativas Pendientes</h4>
              <p class="font-body-sm text-body-sm text-amber-800">Revisa las siguientes pautas técnicas para que tu propuesta cumpla con el POT:</p>
            </div>
          </div>
          <span class="px-3 py-1 bg-amber-600 text-white rounded-full font-label-sm text-label-sm uppercase font-semibold">Requiere Ajuste</span>
        </div>
        <ul class="space-y-1 pt-1 border-t border-amber-200/60">
          ${recsHtml}
        </ul>
      `;
    }
  }
}

function updateTrafficLight(elementId, data) {
  const container = document.getElementById(elementId);
  if (!container) return;

  const statusColor = data.cumple ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-red-700 bg-red-50 border-red-200';
  const icon = data.cumple ? 'check_circle' : 'cancel';
  const badgeText = data.cumple ? 'CUMPLE' : 'NO CUMPLE';
  const badgeClass = data.cumple ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white';

  container.className = `p-space-sm rounded-xl border flex items-center justify-between transition-all ${statusColor}`;
  container.innerHTML = `
    <div class="flex items-center gap-3">
      <span class="material-symbols-outlined text-[22px]">${icon}</span>
      <div class="flex flex-col">
        <span class="font-label-md text-label-md font-semibold">${data.valorPropuesto}</span>
        <span class="font-body-sm text-body-sm opacity-80">${data.limitePermitido} · <em class="underline">${data.articulo}</em></span>
      </div>
    </div>
    <span class="px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold ${badgeClass}">${badgeText}</span>
  `;
}

/* ==========================================================================
   6. CALCULADORA DE CESIONES URBANÍSTICAS (ACUERDO 029 DE 2016)
   ========================================================================== */
function initCesionesEngine() {
  const inpViv = document.getElementById('ces-inp-viviendas');
  const inpLoc = document.getElementById('ces-inp-locales');

  if (inpViv) {
    inpViv.addEventListener('input', () => {
      state.cesionesInputs.unidadesVivienda = parseInt(inpViv.value) || 0;
      updateCesionesView(state.currentPredio);
    });
  }

  if (inpLoc) {
    inpLoc.addEventListener('input', () => {
      state.cesionesInputs.localesComerciales = parseInt(inpLoc.value) || 0;
      updateCesionesView(state.currentPredio);
    });
  }
}

function updateCesionesView(predio) {
  const viv = state.cesionesInputs.unidadesVivienda;
  const habEstimados = Math.round(viv * FORMULAS_CESIONES.densidadHabitantesPorVivienda);
  
  const m2EspacioPublico = habEstimados * FORMULAS_CESIONES.espacioPublicoM2PorHabitante;
  const m2Equipamiento = predio.areaTerreno * FORMULAS_CESIONES.porcentajeEquipamientoComunal;
  const totalM2Cesion = m2EspacioPublico + m2Equipamiento;
  const valorTotalCompensacionCOP = totalM2Cesion * FORMULAS_CESIONES.valorMetroCuadradoSueloRefCOP;

  // Parqueaderos reglamentarios
  const parqueosVivienda = Math.ceil(viv / 2);
  const parqueosVisitantes = Math.ceil(viv / 5);
  const parqueosTotal = parqueosVivienda + parqueosVisitantes;

  const elViv = document.getElementById('ces-inp-viviendas');
  if (elViv && elViv.value != viv) elViv.value = viv;

  const elHab = document.getElementById('ces-out-habitantes');
  if (elHab) elHab.textContent = `${habEstimados} Habitantes`;

  const elEp = document.getElementById('ces-out-espacio-publico');
  if (elEp) elEp.textContent = `${m2EspacioPublico.toFixed(2)} m²`;

  const elEq = document.getElementById('ces-out-equipamiento');
  if (elEq) elEq.textContent = `${m2Equipamiento.toFixed(2)} m²`;

  const elTotalM2 = document.getElementById('ces-out-total-m2');
  if (elTotalM2) elTotalM2.textContent = `${totalM2Cesion.toFixed(2)} m²`;

  const elCompensacion = document.getElementById('ces-out-valor-cop');
  if (elCompensacion) {
    elCompensacion.textContent = `$ ${valorTotalCompensacionCOP.toLocaleString('es-CO')} COP`;
  }

  const elParqueos = document.getElementById('ces-out-parqueaderos');
  if (elParqueos) {
    elParqueos.textContent = `${parqueosTotal} Cupos (${parqueosVivienda} privados + ${parqueosVisitantes} visitantes)`;
  }
}

/* ==========================================================================
   7. PLANOTECA OFICIAL POT 2016 (VISOR DE PLANOS PDF DEL DRIVE)
   ========================================================================== */
function initPlanoteca() {
  const container = document.getElementById('planoteca-categories-container');
  if (!container) return;

  container.innerHTML = '';

  CATALOGO_PLANOS_POT.forEach((cat) => {
    const card = document.createElement('div');
    card.className = "bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-space-sm border border-surface-variant/40";
    
    let planosHtml = cat.planos.map(plano => `
      <div class="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all">
        <div class="flex items-center gap-3">
          <span class="w-8 h-8 rounded-full bg-primary/10 text-primary font-mono font-semibold text-label-sm flex items-center justify-center">${plano.codigo}</span>
          <div class="flex flex-col">
            <h5 class="font-headline-sm text-[15px] font-semibold text-on-surface">${plano.titulo}</h5>
            <span class="font-body-sm text-[12px] text-tertiary">Escala: ${plano.escala} · ${plano.fecha} · Acuerdo 029/2016</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <a href="${plano.urlDescarga}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm hover:bg-primary-container transition-all shadow-sm">
            <span class="material-symbols-outlined text-[16px]">visibility</span>
            <span>Ver en Drive</span>
          </a>
        </div>
      </div>
    `).join('');

    card.innerHTML = `
      <div class="flex items-center justify-between pb-2 border-b border-surface-variant/30">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-[22px]">map</span>
          <h4 class="font-headline-sm text-headline-sm font-semibold text-on-surface">${cat.categoria}</h4>
        </div>
        <span class="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-medium">${cat.planos.length} Planos</span>
      </div>
      <p class="font-body-sm text-body-sm text-tertiary">${cat.descripcion}</p>
      <div class="flex flex-col gap-2 pt-2">
        ${planosHtml}
      </div>
    `;

    container.appendChild(card);
  });
}

/* ==========================================================================
   8. SISTEMA DE USUARIOS & HISTORIAL CONECTADO A FIREBASE CLOUD FIRESTORE
   ========================================================================== */
function initAuthModal() {
  const openBtn = document.getElementById('btn-open-user-modal');
  const modal = document.getElementById('modal-user-auth');
  const closeBtn = document.getElementById('btn-close-user-modal');
  const saveCurrentBtn = document.getElementById('btn-save-current-predio');

  const btnLogin = document.getElementById('btn-firebase-login');
  const btnRegister = document.getElementById('btn-firebase-register');
  const btnLogout = document.getElementById('btn-firebase-logout');
  const inputEmail = document.getElementById('auth-input-email');
  const inputPass = document.getElementById('auth-input-password');
  const feedbackMsg = document.getElementById('auth-feedback-msg');

  // Escuchar estado de autenticación de Firebase en tiempo real
  onAuthStateChanged(auth, async (user) => {
    state.currentUser = user;
    const statusText = document.getElementById('auth-status-text');
    const badgeSource = document.getElementById('auth-badge-source');
    const formContainer = document.getElementById('auth-form-container');
    const logoutContainer = document.getElementById('auth-logout-container');

    if (user) {
      if (statusText) statusText.textContent = `Conectado: ${user.email}`;
      if (badgeSource) badgeSource.textContent = "Cloud Firestore Activo";
      if (formContainer) formContainer.classList.add('hidden');
      if (logoutContainer) logoutContainer.classList.remove('hidden');
    } else {
      if (statusText) statusText.textContent = "Modo Libre (Invitado)";
      if (badgeSource) badgeSource.textContent = "Almacenamiento Local";
      if (formContainer) formContainer.classList.remove('hidden');
      if (logoutContainer) logoutContainer.classList.add('hidden');
    }

    renderSavedEvaluationsList();
  });

  // Iniciar Sesión con Firebase
  if (btnLogin) {
    btnLogin.addEventListener('click', async () => {
      const email = inputEmail?.value.trim();
      const pass = inputPass?.value;
      if (!email || !pass) {
        showAuthFeedback("Ingresa tu correo y contraseña.", "error");
        return;
      }
      try {
        await signInWithEmailAndPassword(auth, email, pass);
        showAuthFeedback("✓ Sesión iniciada con éxito.", "success");
        if (inputPass) inputPass.value = '';
      } catch (err) {
        console.error("Firebase Login Error:", err);
        showAuthFeedback(`Error al ingresar: ${formatAuthError(err.code, err.message)}`, "error");
      }
    });
  }

  // Crear Cuenta en Firebase
  if (btnRegister) {
    btnRegister.addEventListener('click', async () => {
      const email = inputEmail?.value.trim();
      const pass = inputPass?.value;
      if (!email || !pass) {
        showAuthFeedback("Ingresa un correo y contraseña válida (mín. 6 caracteres).", "error");
        return;
      }
      try {
        await createUserWithEmailAndPassword(auth, email, pass);
        showAuthFeedback("✓ ¡Cuenta creada con éxito en Firebase!", "success");
        if (inputPass) inputPass.value = '';
      } catch (err) {
        console.error("Firebase Register Error:", err);
        showAuthFeedback(`Error de registro: ${formatAuthError(err.code, err.message)}`, "error");
      }
    });
  }

  // Cerrar Sesión
  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      await signOut(auth);
      showAuthFeedback("Sesión cerrada.", "info");
    });
  }

  // Modal Open/Close
  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      renderSavedEvaluationsList();
      modal.classList.remove('hidden');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  // Guardar Predio (soporta todos los botones marcados)
  const saveButtons = document.querySelectorAll('[data-action="save-predio"], #btn-save-current-predio');
  saveButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      saveCurrentEvaluation();
    });
  });
}

function showAuthFeedback(msg, type) {
  const box = document.getElementById('auth-feedback-msg');
  if (!box) return;
  box.classList.remove('hidden', 'text-emerald-700', 'text-red-700', 'text-tertiary');
  if (type === 'success') box.classList.add('text-emerald-700', 'font-semibold');
  else if (type === 'error') box.classList.add('text-red-700', 'font-medium');
  else box.classList.add('text-tertiary');
  box.textContent = msg;
}

function formatAuthError(code, message) {
  switch (code) {
    case 'auth/operation-not-allowed':
      return "El proveedor de correo no estaba habilitado en Firebase. (¡Ya lo habilitaste en tu consola, intenta hacer clic en 'Crear Cuenta' de nuevo!).";
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return "Credenciales incorrectas.";
    case 'auth/email-already-in-use':
      return "Este correo ya está registrado en Firebase. Haz clic en 'Iniciar Sesión'.";
    case 'auth/weak-password':
      return "La contraseña debe tener al menos 6 caracteres.";
    case 'auth/invalid-email':
      return "Formato de correo no válido.";
    case 'auth/network-request-failed':
      return "Error de red o conexión.";
    default:
      return `${message || 'Verifica tus datos o conexión.'} (${code || 'error'})`;
  }
}

async function saveCurrentEvaluation() {
  const evaluation = {
    id: `eval-${Date.now()}`,
    fecha: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    predio: { ...state.currentPredio },
    propuesta: { ...state.proposals },
    cesiones: { ...state.cesionesInputs }
  };

  // Guardar siempre copia local
  state.savedEvaluations.unshift(evaluation);
  localStorage.setItem('sogamoso_saved_evaluations', JSON.stringify(state.savedEvaluations));

  // Si el usuario está autenticado en Firebase, guardar en Cloud Firestore
  if (state.currentUser) {
    try {
      await addDoc(collection(db, "evaluaciones_predios"), {
        userId: state.currentUser.uid,
        userEmail: state.currentUser.email,
        creadoEn: new Date().toISOString(),
        ...evaluation
      });
      alert(`✓ Predio guardado y sincronizado en tu cuenta de Firebase Cloud Firestore (${evaluation.predio.direccion}).`);
    } catch (err) {
      console.warn("No se pudo escribir en Firestore, guardado localmente.", err);
      alert(`✓ Predio guardado localmente (${evaluation.predio.direccion}).`);
    }
  } else {
    alert(`✓ Predio guardado con éxito en tu historial de este dispositivo (${evaluation.predio.direccion}). Inicia sesión si deseas guardarlo en la nube.`);
  }

  renderSavedEvaluationsList();
}

function loadSavedEvaluations() {
  const data = localStorage.getItem('sogamoso_saved_evaluations');
  if (data) {
    try {
      state.savedEvaluations = JSON.parse(data);
    } catch (e) {
      state.savedEvaluations = [];
    }
  }
}

async function renderSavedEvaluationsList() {
  const container = document.getElementById('saved-predios-list');
  if (!container) return;

  // Si está autenticado, intentar consultar Firestore
  if (state.currentUser) {
    try {
      const q = query(collection(db, "evaluaciones_predios"), where("userId", "==", state.currentUser.uid));
      const snap = await getDocs(q);
      const cloudEvaluations = [];
      snap.forEach(doc => {
        cloudEvaluations.push({ docId: doc.id, ...doc.data() });
      });
      if (cloudEvaluations.length > 0) {
        state.savedEvaluations = cloudEvaluations;
      }
    } catch (err) {
      console.warn("Consulta Firestore falló, usando historial local.", err);
    }
  }

  if (state.savedEvaluations.length === 0) {
    container.innerHTML = `
      <div class="p-4 rounded-xl bg-surface-container-low text-center text-tertiary font-body-sm">
        No tienes evaluaciones guardadas aún. Haz clic en "Guardar en mi Historial" para conservarla.
      </div>
    `;
    return;
  }

  container.innerHTML = state.savedEvaluations.map(ev => `
    <div class="p-3 rounded-xl bg-surface-container-low flex items-center justify-between gap-3">
      <div class="flex flex-col">
        <strong class="font-headline-sm text-[15px] text-on-surface">${ev.predio.direccion}</strong>
        <span class="font-body-sm text-[12px] text-tertiary">${ev.predio.barrio} · ${ev.predio.areaTerreno} m² · Guardado: ${ev.fecha}</span>
      </div>
      <button onclick="window.restoreEvaluation('${ev.id}')" class="px-3 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm hover:bg-primary-container transition-all shadow-sm">
        Cargar
      </button>
    </div>
  `).join('');
}

window.restoreEvaluation = (evalId) => {
  const target = state.savedEvaluations.find(ev => ev.id === evalId);
  if (target) {
    state.proposals = { ...target.propuesta };
    state.cesionesInputs = { ...target.cesiones };
    setPredioActivo(target.predio);
    document.getElementById('modal-user-auth')?.classList.add('hidden');
    switchTab('simulador');
  }
};

/* ==========================================================================
   9. GENERADOR DE REPORTE / DOSSIER PDF CON DISCLAIMER LEGAL OFICIAL
   ========================================================================== */
function initPdfExport() {
  const exportButtons = document.querySelectorAll('[data-export-dossier-pdf]');
  exportButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      generateAndPrintDossier();
    });
  });
}

function generateAndPrintDossier() {
  const predio = state.currentPredio;
  const prop = state.proposals;
  const norma = predio.norma;

  // Llenar datos en el contenedor del dossier imprimible
  const elDate = document.getElementById('dossier-print-date');
  if (elDate) elDate.textContent = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

  const elDir = document.getElementById('dossier-print-address');
  if (elDir) elDir.textContent = `${predio.direccion} · ${predio.barrio}`;

  const elCat = document.getElementById('dossier-print-cedula');
  if (elCat) elCat.textContent = predio.codigoCatastral;

  const elMat = document.getElementById('dossier-print-matricula');
  if (elMat) elMat.textContent = predio.matricula;

  const elTrat = document.getElementById('dossier-print-tratamiento');
  if (elTrat) elTrat.textContent = predio.tratamiento;

  const elZonif = document.getElementById('dossier-print-zonificacion');
  if (elZonif) elZonif.textContent = predio.zonificacion;

  const elArea = document.getElementById('dossier-print-area');
  if (elArea) elArea.textContent = `${predio.areaTerreno.toFixed(2)} m² (Frente: ${predio.frente}m, Fondo: ${predio.fondo}m)`;

  const elProp = document.getElementById('dossier-print-propuesta');
  if (elProp) {
    elProp.textContent = `${prop.pisos} Pisos (${prop.altura} m) · Ocupación P1: ${prop.ocupacionP1} m² · Área Total Construida: ${prop.totalConstruido} m² · Retiro Post: ${prop.aislamientoPosterior} m`;
  }

  // Ejecutar impresión / Guardar como PDF del navegador
  window.print();
}
