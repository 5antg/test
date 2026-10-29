import { PREDIOS_PRESET, CATALOGO_PLANOS_POT, FORMULAS_CESIONES } from './data/pot-sogamoso.js';

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
    modalidadCompensacion: 'dinero' // 'cesion' | 'dinero'
  },
  savedEvaluations: [],
  currentUser: null, // null = Invitado
  leafletMap: null,
  leafletMarker: null
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
  syncAllViews(state.currentPredio);
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

  // Botones de acción rápida entre pantallas
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

  // Actualizar clases activas en la barra de navegación
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

  // Mostrar el contenedor de la pestaña correspondiente y ocultar los demás
  const tabContainers = document.querySelectorAll('.tab-view-container');
  tabContainers.forEach(container => {
    if (container.id === `tab-${tabId}`) {
      container.classList.remove('hidden');
    } else {
      container.classList.add('hidden');
    }
  });

  // Si se cambia a la pestaña del explorador y Leaflet está activo, revalidar tamaño
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

  // Actualizar valores del simulador ajustados a la escala del nuevo predio
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

  // 5. Panel Flotante del Explorador Urbano
  updateExploradorHUD(predio);
}

/* ==========================================================================
   3. EXPLORADOR URBANO Y MAPA INTERACTIVO (LEAFLET + SVG)
   ========================================================================== */
function initLeafletMap() {
  const mapElement = document.getElementById('leaflet-map');
  if (!mapElement) return;

  // Coordenadas del casco urbano de Sogamoso: 5.7148 N, -72.9333 W
  const sogamosoCoords = [state.currentPredio.coordenadas.lat, state.currentPredio.coordenadas.lng];
  
  if (typeof L !== 'undefined') {
    state.leafletMap = L.map('leaflet-map', {
      center: sogamosoCoords,
      zoom: 16,
      zoomControl: false
    });

    // Capa base OpenStreetMap estándar limpia
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors | POT Sogamoso 2016'
    }).addTo(state.leafletMap);

    // Marcadores para los predios predeterminados
    state.allPredios.forEach(p => {
      const marker = L.circleMarker([p.coordenadas.lat, p.coordenadas.lng], {
        radius: 9,
        fillColor: '#655090',
        color: '#ffffff',
        weight: 2.5,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(state.leafletMap);

      marker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px;">
          <strong style="color: #655090; font-size: 13px;">${p.direccion}</strong><br>
          <span style="font-size: 11px; color: #5c5b64;">${p.barrio} · ${p.areaTerreno} m²</span><br>
          <span style="font-size: 10px; font-weight: 600; color: #1f182a;">${p.zonificacion}</span><br>
          <button onclick="window.selectPreset('${p.id}')" style="margin-top:6px; background:#655090; color:white; border:none; border-radius:12px; padding:4px 8px; font-size:10px; cursor:pointer;">
            Seleccionar Predio
          </button>
        </div>
      `);
    });

    // Clic en el mapa para capturar coordenadas
    state.leafletMap.on('click', (e) => {
      const { lat, lng } = e.latlng;
      createCustomPredioFromCoords(lat, lng);
    });

    // Botones de control de zoom personalizados
    document.getElementById('btn-map-zoom-in')?.addEventListener('click', () => state.leafletMap.zoomIn());
    document.getElementById('btn-map-zoom-out')?.addEventListener('click', () => state.leafletMap.zoomOut());
    document.getElementById('btn-map-recenter')?.addEventListener('click', () => {
      state.leafletMap.setView([state.currentPredio.coordenadas.lat, state.currentPredio.coordenadas.lng], 16);
    });
  }

  // Toggle entre vista Leaflet y vista CAD SVG
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

function createCustomPredioFromCoords(lat, lng) {
  const customPredio = {
    id: `custom-${Date.now()}`,
    codigoCatastral: `15759010${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`,
    matricula: `095-${Math.floor(100000 + Math.random() * 900000)}`,
    direccion: `Coordenadas [${lat.toFixed(4)}, ${lng.toFixed(4)}]`,
    barrio: "Sector Urbano Central",
    comuna: "Comuna 02 Sugamuxi",
    manzana: `MZ-${Math.floor(10 + Math.random() * 80)}`,
    lote: `LOTE-${Math.floor(1 + Math.random() * 30)}`,
    areaTerreno: 450.00,
    frente: 15.00,
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
    tratamientoDesc: "Reglamentación oficial del Acuerdo 029 de 2016 para el sector urbano.",
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
      articulos: {
        ocupacion: "Art. 184 Acuerdo 029/2016",
        construccion: "Art. 186 Acuerdo 029/2016",
        altura: "Art. 192 Acuerdo 029/2016",
        aislamiento: "Art. 198 Acuerdo 029/2016",
        cesiones: "Art. 215 Acuerdo 029/2016"
      }
    },
    usos: {
      permitidos: ["Vivienda Multifamiliar", "Comercio Minorista P1"],
      compatibles: ["Oficinas y Consultorios"],
      condicionados: ["Talleres y Bodegas Menores"],
      prohibidos: ["Industria de Alto Impacto"]
    },
    amenazaRiesgo: "Bajo (Área clasificada apta)",
    equipamientosCercanos: [
      { nombre: "Parque Urbano Cercano", tipo: "Recreación", distancia: "420 m", icon: "park" },
      { nombre: "Centro de Salud", tipo: "Salud", distancia: "680 m", icon: "local_hospital" }
    ]
  };

  setPredioActivo(customPredio);
}

function updateExploradorHUD(predio) {
  // Cédula Catastral
  const elCedula = document.getElementById('hud-cedula-catastral');
  if (elCedula) elCedula.textContent = predio.codigoCatastral;

  // Código Manzana / Lote
  const elMzLote = document.getElementById('hud-manzana-lote');
  if (elMzLote) elMzLote.textContent = `${predio.manzana} · ${predio.lote}`;

  // Tarjeta flotante de diagnóstico
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

  // Centrar mapa de Leaflet si existe
  if (state.leafletMap && predio.coordenadas) {
    state.leafletMap.panTo([predio.coordenadas.lat, predio.coordenadas.lng]);
  }
}

function initSearch() {
  const searchInput = document.getElementById('main-search-input');
  const searchBtn = document.getElementById('main-search-btn');

  function executeSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;

    // Buscar en los predios predeterminados
    const found = state.allPredios.find(p => 
      p.direccion.toLowerCase().includes(query) ||
      p.codigoCatastral.includes(query) ||
      p.barrio.toLowerCase().includes(query)
    );

    if (found) {
      setPredioActivo(found);
    } else {
      // Simular geocodificación en Sogamoso
      const lat = 5.7148 + (Math.random() - 0.5) * 0.02;
      const lng = -72.9333 + (Math.random() - 0.5) * 0.02;
      createCustomPredioFromCoords(lat, lng);
    }
  }

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', executeSearch);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') executeSearch();
    });
  }

  // Preset selector pills
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

  // Encabezados y títulos
  const elTitle = document.getElementById('ficha-title-address');
  if (elTitle) elTitle.innerHTML = `${predio.direccion} <span class="text-primary font-normal italic">· ${predio.barrio}</span>`;

  const elSubtitle = document.getElementById('ficha-subtitle-loc');
  if (elSubtitle) elSubtitle.innerHTML = `${predio.comuna} · Sogamoso (Boyacá) · Perfil Vía <span class="text-on-surface font-semibold">${predio.perfilVial}</span>`;

  const elMatricula = document.getElementById('ficha-meta-matricula');
  if (elMatricula) elMatricula.textContent = `Matrícula: ${predio.matricula}`;

  // Métricas Clave
  const elArea = document.getElementById('ficha-metric-area');
  if (elArea) elArea.textContent = predio.areaTerreno.toFixed(2);

  const elFrente = document.getElementById('ficha-metric-frente');
  if (elFrente) elFrente.textContent = predio.frente.toFixed(2);

  const elFondo = document.getElementById('ficha-metric-fondo');
  if (elFondo) elFondo.textContent = predio.fondo.toFixed(2);

  // Parámetros Volumétricos
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

  // Tratamiento y Zonificación
  const elTrat = document.getElementById('ficha-desc-tratamiento');
  if (elTrat) elTrat.textContent = `${predio.tratamiento}: ${predio.tratamientoDesc}`;

  const elZonif = document.getElementById('ficha-desc-zonificacion');
  if (elZonif) elZonif.textContent = `${predio.zonificacion}: ${predio.zonificacionDesc}`;

  // Matriz de Usos
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
   5. SIMULADOR Y MOTOR DE CUMPLIMIENTO EN TIEMPO REAL
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
  // Llenar inputs con el estado
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

  // Actualizar top chips
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

  // 1. Ocupación P1 (IO)
  const maxOcupacion = predio.areaTerreno * norma.indiceOcupacionMax;
  const ioCalculado = prop.ocupacionP1 / predio.areaTerreno;
  const cumpleOcupacion = prop.ocupacionP1 <= maxOcupacion;

  updateTrafficLight('chk-ocupacion', {
    cumple: cumpleOcupacion,
    valorPropuesto: `${prop.ocupacionP1.toFixed(2)} m² (IO: ${(ioCalculado * 100).toFixed(1)}%)`,
    limitePermitido: `Máx. ${maxOcupacion.toFixed(2)} m² (${(norma.indiceOcupacionMax * 100).toFixed(0)}%)`,
    articulo: norma.articulos.ocupacion
  });

  // 2. Número de pisos y Altura
  const cumplePisos = prop.pisos <= norma.pisosMaximos;
  const cumpleAltura = prop.altura <= norma.alturaMaximaMetros;
  const cumpleVolumetria = cumplePisos && cumpleAltura;

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

  updateTrafficLight('chk-construccion', {
    cumple: cumpleConstruccion,
    valorPropuesto: `${prop.totalConstruido.toFixed(2)} m² (IC: ${icCalculado.toFixed(2)})`,
    limitePermitido: `Máx. ${maxConstruido.toFixed(2)} m² (IC: ${norma.indiceConstruccionMax.toFixed(2)})`,
    articulo: norma.articulos.construccion
  });

  // 4. Aislamiento Posterior
  const cumpleAislamiento = prop.aislamientoPosterior >= norma.aislamientoPosteriorMin;

  updateTrafficLight('chk-aislamiento', {
    cumple: cumpleAislamiento,
    valorPropuesto: `${prop.aislamientoPosterior.toFixed(2)} m`,
    limitePermitido: `Mínimo: ${norma.aislamientoPosteriorMin.toFixed(2)} m`,
    articulo: norma.articulos.aislamiento
  });

  // Scorecard General
  const scoreCard = document.getElementById('sim-global-scorecard');
  const allCumple = cumpleOcupacion && cumpleVolumetria && cumpleConstruccion && cumpleAislamiento;

  if (scoreCard) {
    if (allCumple) {
      scoreCard.className = "p-space-md rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between";
      scoreCard.innerHTML = `
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-emerald-600 text-[28px]">check_circle</span>
          <div>
            <h4 class="font-headline-sm text-headline-sm font-semibold text-emerald-950">Propuesta Viable y Cumplimiento Normativo 100%</h4>
            <p class="font-body-sm text-body-sm text-emerald-800">Cumple con las directrices volumétricas y urbanísticas del Acuerdo 029 de 2016.</p>
          </div>
        </div>
        <span class="px-3 py-1 bg-emerald-600 text-white rounded-full font-label-sm text-label-sm uppercase font-semibold">Aprobado</span>
      `;
    } else {
      scoreCard.className = "p-space-md rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between";
      scoreCard.innerHTML = `
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-amber-600 text-[28px]">warning</span>
          <div>
            <h4 class="font-headline-sm text-headline-sm font-semibold text-amber-950">Observaciones Normativas Pendientes</h4>
            <p class="font-body-sm text-body-sm text-amber-800">Uno o más parámetros superan los límites permitidos por el POT de Sogamoso. Ajusta los valores en rojo.</p>
          </div>
        </div>
        <span class="px-3 py-1 bg-amber-600 text-white rounded-full font-label-sm text-label-sm uppercase font-semibold">Requiere Ajuste</span>
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
  
  // Cálculo de Espacio Público Efectivo: 4.0 m² por habitante
  const m2EspacioPublico = habEstimados * FORMULAS_CESIONES.espacioPublicoM2PorHabitante;

  // Equipamiento Comunal: 8% del área neta
  const m2Equipamiento = predio.areaTerreno * FORMULAS_CESIONES.porcentajeEquipamientoComunal;

  // Total cesión
  const totalM2Cesion = m2EspacioPublico + m2Equipamiento;

  // Compensación económica (Fondo de Compensación Urbana Art. 128)
  const valorTotalCompensacionCOP = totalM2Cesion * FORMULAS_CESIONES.valorMetroCuadradoSueloRefCOP;

  // Actualizar DOM
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
}

/* ==========================================================================
   7. PLANOTECA OFICIAL POT 2016 (VISOR DE PLANOS PDF DEL DRIVE)
   ========================================================================== */
function initPlanoteca() {
  const container = document.getElementById('planoteca-categories-container');
  if (!container) return;

  container.innerHTML = '';

  CATALOGO_PLANOS_POT.forEach((cat, index) => {
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
          <a href="${plano.urlDescarga}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm hover:bg-primary-container transition-all">
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
   8. SISTEMA DE USUARIOS & HISTORIAL DE PREDIOS GUARDADOS (FIREBASE / LOCAL)
   ========================================================================== */
function initAuthModal() {
  const openBtn = document.getElementById('btn-open-user-modal');
  const modal = document.getElementById('modal-user-auth');
  const closeBtn = document.getElementById('btn-close-user-modal');
  const saveCurrentBtn = document.getElementById('btn-save-current-predio');

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

  // Guardar predio actual en el historial
  if (saveCurrentBtn) {
    saveCurrentBtn.addEventListener('click', () => {
      saveCurrentEvaluation();
    });
  }
}

function saveCurrentEvaluation() {
  const evaluation = {
    id: `eval-${Date.now()}`,
    fecha: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    predio: { ...state.currentPredio },
    propuesta: { ...state.proposals },
    cesiones: { ...state.cesionesInputs }
  };

  state.savedEvaluations.unshift(evaluation);
  localStorage.setItem('sogamoso_saved_evaluations', JSON.stringify(state.savedEvaluations));
  renderSavedEvaluationsList();

  // Notificación visual rápida
  alert(`✓ Predio guardado con éxito en tu historial personal (${evaluation.predio.direccion}).`);
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

function renderSavedEvaluationsList() {
  const container = document.getElementById('saved-predios-list');
  if (!container) return;

  if (state.savedEvaluations.length === 0) {
    container.innerHTML = `
      <div class="p-4 rounded-xl bg-surface-container-low text-center text-tertiary font-body-sm">
        No tienes evaluaciones guardadas aún. Haz clic en "Guardar Evaluación Actual" para conservarla.
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
      <button onclick="window.restoreEvaluation('${ev.id}')" class="px-3 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm hover:bg-primary-container transition-all">
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
   9. GENERADOR DE REPORTE / DOSSIER PDF
   ========================================================================== */
function initPdfExport() {
  const exportButtons = document.querySelectorAll('[data-export-dossier-pdf]');
  exportButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.print();
    });
  });
}
