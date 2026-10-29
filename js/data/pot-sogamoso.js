/**
 * Base de Datos Normativa del POT de Sogamoso - Acuerdo Municipal 029 del 28 de diciembre de 2016
 * Catálogo de Sectores Normativos, Tratamientos Urbanísticos (UTD), Índices y Usos del Suelo.
 */

export const PREDIOS_PRESET = [
  {
    id: "predio-rosario",
    codigoCatastral: "157590102000000340012000",
    matricula: "095-481920",
    direccion: "Calle 11 # 14-25",
    barrio: "El Rosario",
    comuna: "Comuna 02 Sugamuxi",
    manzana: "MZ-034",
    lote: "LOTE-012",
    areaTerreno: 420.00,
    frente: 14.00,
    fondo: 30.00,
    estrato: 4,
    perfilVial: "V-3 (Calle 11 Colectora, 12.00 m)",
    coordenadas: {
      lat: 5.7162,
      lng: -72.9325,
      norteMagna: "1.108.432,15 m",
      esteMagna: "1.124.891,40 m",
      texto: "5°42'58.3\"N 72°55'57.0\"W"
    },
    tratamiento: "Consolidación Urbana (TU-2)",
    tratamientoDesc: "Mantenimiento y consolidación de la estructura predial existente con redensificación moderada.",
    zonificacion: "CAM-2 (Comercial / Residencial Mixto)",
    zonificacionDesc: "Corredor de actividad mixta con comercio en primeros pisos y vivienda en altura.",
    norma: {
      indiceOcupacionMax: 0.70, // 70%
      indiceConstruccionMax: 2.80, // 2.8 x lote
      pisosMaximos: 5,
      alturaMaximaMetros: 16.50,
      aislamientoPosteriorMin: 3.00,
      aislamientoLateralMin: 0.00, // continuo adosado
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
      permitidos: ["Vivienda Multifamiliar", "Comercio Minorista (Piso 1)", "Servicios Profesionales y Oficinas", "Cafeterías y Restaurantes"],
      compatibles: ["Entidades Financieras", "Consultorios Médicos", "Instituciones Educativas Nivel Básico"],
      condicionados: ["Talleres de mecánica ligera (máx. 100 m²)", "Alojamientos Turísticos / Hoteles"],
      prohibidos: ["Industria Pesada o Mediana", "Bares / Discotecas de Alto Impacto", "Estaciones de Servicio"]
    },
    amenazaRiesgo: "Muy Bajo (Suelo apto para edificación sin restricciones geotécnicas)",
    equipamientosCercanos: [
      { nombre: "Parque El Laguito", tipo: "Parque Urbano", distancia: "380 m", icon: "park" },
      { nombre: "Plaza de Mercado Central", tipo: "Comercio / Abasto", distancia: "620 m", icon: "storefront" },
      { nombre: "Hospital Regional de Sogamoso", tipo: "Salud Nivel II", distancia: "850 m", icon: "local_hospital" },
      { nombre: "Colegio Sugamuxi", tipo: "Educación", distancia: "420 m", icon: "school" }
    ]
  },
  {
    id: "predio-mochaca",
    codigoCatastral: "157590101000000120005000",
    matricula: "095-214589",
    direccion: "Carrera 9 # 4-18",
    barrio: "Mochacá (Centro Histórico)",
    comuna: "Comuna 01 Centro",
    manzana: "MZ-012",
    lote: "LOTE-005",
    areaTerreno: 310.00,
    frente: 11.50,
    fondo: 27.00,
    estrato: 3,
    perfilVial: "V-5 (Peatonal / Compartida 8.00 m)",
    coordenadas: {
      lat: 5.7135,
      lng: -72.9360,
      norteMagna: "1.108.120,40 m",
      esteMagna: "1.124.510,10 m",
      texto: "5°42'48.6\"N 72°56'09.6\"W"
    },
    tratamiento: "Conservación Patrimonial (BIC Grado 2)",
    tratamientoDesc: "Protección estricta de fachada y volumetría acorde al perfil histórico patrimonial.",
    zonificacion: "ZUR-H (Zona Histórica Mochacá)",
    zonificacionDesc: "Sector de preservación de tipologías coloniales y republicanas.",
    norma: {
      indiceOcupacionMax: 0.60,
      indiceConstruccionMax: 1.50,
      pisosMaximos: 2,
      alturaMaximaMetros: 7.50,
      aislamientoPosteriorMin: 4.00,
      aislamientoLateralMin: 0.00,
      antejardinMin: 0.00, // Cero antejardín por alineamiento histórico
      voladizoMax: 0.00, // Prohibido voladizos
      articulos: {
        ocupacion: "Art. 240 Acuerdo 029/2016",
        construccion: "Art. 242 Acuerdo 029/2016",
        altura: "Art. 245 Acuerdo 029/2016",
        aislamiento: "Art. 249 Acuerdo 029/2016",
        cesiones: "Art. 255 Acuerdo 029/2016"
      }
    },
    usos: {
      permitidos: ["Vivienda Unifamiliar", "Talleres Artesanales", "Galerías y Cafés Culturales"],
      compatibles: ["Hospedajes Boutique", "Librerías"],
      condicionados: ["Restaurantes típicos (con adecuación acústica)"],
      prohibidos: ["Edificios en Altura", "Discotecas", "Talleres Industriales", "Parqueaderos Descubiertos"]
    },
    amenazaRiesgo: "Bajo (Zona de amortiguamiento patrimonial)",
    equipamientosCercanos: [
      { nombre: "Plaza de la Villa", tipo: "Espacio Público Patrimonial", distancia: "210 m", icon: "account_balance" },
      { nombre: "Museo Arqueológico Suamox", tipo: "Cultura", distancia: "980 m", icon: "museum" },
      { nombre: "Parque Santander", tipo: "Parque Urbano", distancia: "350 m", icon: "park" }
    ]
  },
  {
    id: "predio-cataluna",
    codigoCatastral: "157590103000000880003000",
    matricula: "095-789321",
    direccion: "Carrera 18 # 22-50",
    barrio: "Cataluña / El Recreo",
    comuna: "Comuna 03 Norte",
    manzana: "MZ-088",
    lote: "LOTE-003",
    areaTerreno: 850.00,
    frente: 25.00,
    fondo: 34.00,
    estrato: 4,
    perfilVial: "V-2 (Avenida Arterial, 24.00 m)",
    coordenadas: {
      lat: 5.7240,
      lng: -72.9280,
      norteMagna: "1.109.280,50 m",
      esteMagna: "1.125.320,00 m",
      texto: "5°43'26.4\"N 72°55'40.8\"W"
    },
    tratamiento: "Desarrollo Urbano / Redensificación (TU-1)",
    tratamientoDesc: "Zonas en consolidación con capacidad de soporte para proyectos de gran escala.",
    zonificacion: "R-4 (Residencial de Alta Densidad)",
    zonificacionDesc: "Área apta para conjuntos residenciales multifamiliares en altura.",
    norma: {
      indiceOcupacionMax: 0.65,
      indiceConstruccionMax: 3.50,
      pisosMaximos: 8,
      alturaMaximaMetros: 26.00,
      aislamientoPosteriorMin: 5.00,
      aislamientoLateralMin: 3.00, // Aislamiento lateral obligatorio para > 5 pisos
      antejardinMin: 4.00,
      voladizoMax: 1.00,
      articulos: {
        ocupacion: "Art. 185 Acuerdo 029/2016",
        construccion: "Art. 187 Acuerdo 029/2016",
        altura: "Art. 194 Acuerdo 029/2016",
        aislamiento: "Art. 200 Acuerdo 029/2016",
        cesiones: "Art. 218 Acuerdo 029/2016"
      }
    },
    usos: {
      permitidos: ["Vivienda Multifamiliar en Torre", "Comercio de Cobertura Local"],
      compatibles: ["Oficinas y Coworking", "Centros de Cuidado Infantil"],
      condicionados: ["Supermercados de Mediana Escala"],
      prohibidos: ["Industria", "Bodegajes Pesados"]
    },
    amenazaRiesgo: "Muy Bajo",
    equipamientosCercanos: [
      { nombre: "Terminal de Transportes Sogamoso", tipo: "Movilidad", distancia: "1.1 km", icon: "directions_bus" },
      { nombre: "Complejo Deportivo El Prado", tipo: "Deporte y Recreación", distancia: "550 m", icon: "sports_soccer" },
      { nombre: "Universidad Pedagógica y Tecnológica (UPTC)", tipo: "Educación Superior", distancia: "1.4 km", icon: "school" }
    ]
  }
];

export const CATALOGO_PLANOS_POT = [
  {
    categoria: "Componente Urbano",
    descripcion: "Planos oficiales de usos del suelo, tratamientos y estructuras urbanas de Sogamoso.",
    planos: [
      {
        codigo: "U-01",
        titulo: "Plano de Usos del Suelo Urbano",
        escala: "1:5.000",
        fecha: "Diciembre 2016",
        driveId: "0B0erYQEtPPx4ZUlSSEpxTjEtVnc",
        urlDescarga: "https://drive.google.com/drive/folders/0B0erYQEtPPx4ZUlSSEpxTjEtVnc"
      },
      {
        codigo: "U-02",
        titulo: "Plano de Tratamientos Urbanísticos (UTD)",
        escala: "1:5.000",
        fecha: "Diciembre 2016",
        driveId: "0B0erYQEtPPx4ZUlSSEpxTjEtVnc",
        urlDescarga: "https://drive.google.com/drive/folders/0B0erYQEtPPx4ZUlSSEpxTjEtVnc"
      },
      {
        codigo: "U-03",
        titulo: "Plano de Malla Vial Arterial y Perfiles Viales",
        escala: "1:7.500",
        fecha: "Diciembre 2016",
        driveId: "0B0erYQEtPPx4ZUlSSEpxTjEtVnc",
        urlDescarga: "https://drive.google.com/drive/folders/0B0erYQEtPPx4ZUlSSEpxTjEtVnc"
      },
      {
        codigo: "U-04",
        titulo: "Plano de Servicios Públicos y Redes Matrices",
        escala: "1:10.000",
        fecha: "Diciembre 2016",
        driveId: "0B0erYQEtPPx4ZUlSSEpxTjEtVnc",
        urlDescarga: "https://drive.google.com/drive/folders/0B0erYQEtPPx4ZUlSSEpxTjEtVnc"
      }
    ]
  },
  {
    categoria: "Amenazas y Riesgos",
    descripcion: "Cartografía de amenazas naturales, inundación por ríos Chicamocha/Monquirá y remoción en masa.",
    planos: [
      {
        codigo: "R-01",
        titulo: "Zonificación de Amenaza por Inundación Urbana",
        escala: "1:5.000",
        fecha: "Diciembre 2016",
        driveId: "0B0erYQEtPPx4ZUlSSEpxTjEtVnc",
        urlDescarga: "https://drive.google.com/drive/folders/0B0erYQEtPPx4ZUlSSEpxTjEtVnc"
      },
      {
        codigo: "R-02",
        titulo: "Amenaza por Remoción en Masa (Laderas Orientales)",
        escala: "1:10.000",
        fecha: "Diciembre 2016",
        driveId: "0B0erYQEtPPx4ZUlSSEpxTjEtVnc",
        urlDescarga: "https://drive.google.com/drive/folders/0B0erYQEtPPx4ZUlSSEpxTjEtVnc"
      },
      {
        codigo: "R-03",
        titulo: "Microzonificación Sísmica y Zonificación Geotécnica",
        escala: "1:7.500",
        fecha: "Diciembre 2016",
        driveId: "0B0erYQEtPPx4ZUlSSEpxTjEtVnc",
        urlDescarga: "https://drive.google.com/drive/folders/0B0erYQEtPPx4ZUlSSEpxTjEtVnc"
      }
    ]
  },
  {
    categoria: "Espacio Público y Equipamientos",
    descripcion: "Estructura ecológica principal, parques urbanos y red de equipamientos colectivos.",
    planos: [
      {
        codigo: "E-01",
        titulo: "Sistema de Espacio Público Efectivo y Parques",
        escala: "1:5.000",
        fecha: "Diciembre 2016",
        driveId: "0B0erYQEtPPx4ZUlSSEpxTjEtVnc",
        urlDescarga: "https://drive.google.com/drive/folders/0B0erYQEtPPx4ZUlSSEpxTjEtVnc"
      },
      {
        codigo: "E-02",
        titulo: "Red de Equipamientos Dotacionales (Salud, Educación, Recreación)",
        escala: "1:7.500",
        fecha: "Diciembre 2016",
        driveId: "0B0erYQEtPPx4ZUlSSEpxTjEtVnc",
        urlDescarga: "https://drive.google.com/drive/folders/0B0erYQEtPPx4ZUlSSEpxTjEtVnc"
      }
    ]
  },
  {
    categoria: "Patrimonio Cultural y Centro Histórico",
    descripcion: "Bienes de Interés Cultural (BIC) Grado 1 y 2, Mochacá, Santa Bárbara y Plaza de la Villa.",
    planos: [
      {
        codigo: "P-01",
        titulo: "Delimitación del Centro Histórico y Áreas de Influencia Patrimonial",
        escala: "1:2.500",
        fecha: "Diciembre 2016",
        driveId: "0B0erYQEtPPx4ZUlSSEpxTjEtVnc",
        urlDescarga: "https://drive.google.com/drive/folders/0B0erYQEtPPx4ZUlSSEpxTjEtVnc"
      }
    ]
  }
];

export const FORMULAS_CESIONES = {
  // Según Acuerdo 029 de 2016 de Sogamoso
  espacioPublicoM2PorHabitante: 4.0, // 4 m² por habitante en suelo urbano consolidado
  densidadHabitantesPorVivienda: 3.5,
  porcentajeEquipamientoComunal: 0.08, // 8% sobre área neta urbanizable
  porcentajeViasLocales: 0.15, // 15% estimado
  valorMetroCuadradoSueloRefCOP: 450000 // Valor de referencia catastral/comercial para compensación
};
