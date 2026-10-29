/**
 * Base de Datos Normativa del POT de Sogamoso - Acuerdo Municipal 029 del 28 de diciembre de 2016
 * Catálogo de Sectores Normativos, Tratamientos Urbanísticos (UTD), Índices, Usos del Suelo y Planoteca Oficial.
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
    tratamientoDesc: "Mantenimiento y consolidación de la estructura predial existente con redensificación moderada y densidades medias.",
    zonificacion: "CAM-2 (Comercial / Residencial Mixto)",
    zonificacionDesc: "Corredor de actividad mixta con comercio en primeros pisos y vivienda en altura.",
    norma: {
      indiceOcupacionMax: 0.70, // 70%
      indiceConstruccionMax: 2.80, // 2.8 x lote
      pisosMaximos: 5,
      alturaMaximaMetros: 16.50,
      aislamientoPosteriorMin: 3.00,
      aislamientoLateralMin: 0.00,
      antejardinMin: 2.50,
      voladizoMax: 0.80,
      parqueaderosRatio: "1 cupo cada 2 viviendas + 1 visitante cada 5 viviendas",
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
      permitidos: ["Vivienda Multifamiliar", "Comercio Minorista (Piso 1)", "Servicios Profesionales y Oficinas", "Cafeterías y Restaurantes"],
      compatibles: ["Entidades Financieras", "Consultorios Médicos", "Instituciones Educativas Nivel Básico", "Farmacias"],
      condicionados: ["Talleres de mecánica ligera (máx. 100 m²)", "Alojamientos Turísticos / Hoteles", "Gimnasios"],
      prohibidos: ["Industria Pesada o Mediana", "Bares / Discotecas de Alto Impacto", "Estaciones de Servicio de Combustible", "Bodegas de Reciclaje"]
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
    perfilVial: "V-5 (Vía Tradicional / Compartida 8.00 m)",
    coordenadas: {
      lat: 5.7135,
      lng: -72.9360,
      norteMagna: "1.108.120,40 m",
      esteMagna: "1.124.510,10 m",
      texto: "5°42'48.6\"N 72°56'09.6\"W"
    },
    tratamiento: "Conservación Patrimonial (BIC Grado 2)",
    tratamientoDesc: "Protección rigurosa de tipologías arquitectónicas coloniales y republicanas, volumetría y alineamiento histórico.",
    zonificacion: "ZUR-H (Zona Histórica Mochacá)",
    zonificacionDesc: "Sector de preservación cultural, arquitectura en adobe, teja de barro y zócalos tradicionales.",
    norma: {
      indiceOcupacionMax: 0.60,
      indiceConstruccionMax: 1.40,
      pisosMaximos: 2,
      alturaMaximaMetros: 7.50,
      aislamientoPosteriorMin: 4.00,
      aislamientoLateralMin: 0.00,
      antejardinMin: 0.00, // Cero antejardín por alineamiento estricto
      voladizoMax: 0.00, // Voladizo prohibido
      parqueaderosRatio: "Exento o según patio interior existente",
      articulos: {
        ocupacion: "Art. 240 Acuerdo 029/2016",
        construccion: "Art. 242 Acuerdo 029/2016",
        altura: "Art. 245 Acuerdo 029/2016",
        aislamiento: "Art. 249 Acuerdo 029/2016",
        antejardin: "Art. 251 Acuerdo 029/2016",
        cesiones: "Art. 255 Acuerdo 029/2016"
      }
    },
    usos: {
      permitidos: ["Vivienda Unifamiliar", "Talleres Artesanales", "Galerías de Arte y Museos", "Cafés Culturales"],
      compatibles: ["Hospedajes Boutique / Posadas Turísticas", "Librerías", "Tiendas de Souvenirs"],
      condicionados: ["Restaurantes típicos (requiere concepto acústico y de olores de la Curaduría)", "Oficinas Administrativas"],
      prohibidos: ["Edificios en Altura (> 2 pisos)", "Discotecas y Bares Ruidosos", "Talleres Automotrices", "Parqueaderos en Lote Descubierto"]
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
    tratamientoDesc: "Suelo urbano en consolidación con capacidad de soporte infraestructural para proyectos de alta densidad.",
    zonificacion: "R-4 (Residencial de Alta Densidad)",
    zonificacionDesc: "Área apta para conjuntos residenciales multifamiliares y torres en altura.",
    norma: {
      indiceOcupacionMax: 0.65,
      indiceConstruccionMax: 3.50,
      pisosMaximos: 8,
      alturaMaximaMetros: 26.00,
      aislamientoPosteriorMin: 5.00,
      aislamientoLateralMin: 3.00, // Obligatorio para > 5 pisos
      antejardinMin: 4.00,
      voladizoMax: 1.00,
      parqueaderosRatio: "1 cupo por vivienda + 1 visitante cada 4 viviendas",
      articulos: {
        ocupacion: "Art. 185 Acuerdo 029/2016",
        construccion: "Art. 187 Acuerdo 029/2016",
        altura: "Art. 194 Acuerdo 029/2016",
        aislamiento: "Art. 200 Acuerdo 029/2016",
        antejardin: "Art. 205 Acuerdo 029/2016",
        cesiones: "Art. 218 Acuerdo 029/2016"
      }
    },
    usos: {
      permitidos: ["Vivienda Multifamiliar en Torre", "Conjuntos Cerrados", "Comercio de Cobertura Local"],
      compatibles: ["Oficinas y Coworking", "Centros de Cuidado Infantil", "Gimnasios"],
      condicionados: ["Supermercados de Mediana Escala", "Centros Médicos Ambulatorios"],
      prohibidos: ["Industria Pesada", "Bodegajes Logísticos", "Bares de Alto Impacto"]
    },
    amenazaRiesgo: "Muy Bajo",
    equipamientosCercanos: [
      { nombre: "Terminal de Transportes Sogamoso", tipo: "Movilidad", distancia: "1.1 km", icon: "directions_bus" },
      { nombre: "Complejo Deportivo El Prado", tipo: "Deporte y Recreación", distancia: "550 m", icon: "sports_soccer" },
      { nombre: "Universidad Pedagógica y Tecnológica (UPTC)", tipo: "Educación Superior", distancia: "1.4 km", icon: "school" }
    ]
  },
  {
    id: "predio-chicamocha",
    codigoCatastral: "157590102000000450008000",
    matricula: "095-334190",
    direccion: "Carrera 11 # 18-30",
    barrio: "Plaza España / Chicamocha",
    comuna: "Comuna 02 Sugamuxi",
    manzana: "MZ-045",
    lote: "LOTE-008",
    areaTerreno: 510.00,
    frente: 17.00,
    fondo: 30.00,
    estrato: 3,
    perfilVial: "V-3 (Eje Urbano Carrera 11, 14.00 m)",
    coordenadas: {
      lat: 5.7195,
      lng: -72.9305,
      norteMagna: "1.108.780,20 m",
      esteMagna: "1.125.080,10 m",
      texto: "5°43'10.2\"N 72°55'49.8\"W"
    },
    tratamiento: "Consolidación Comercial y Servicios (TU-2)",
    tratamientoDesc: "Corredor estructurante de servicios y comercio central con renovación predial.",
    zonificacion: "CAM-1 (Comercial Central)",
    zonificacionDesc: "Área de servicios metropolitanos, comercio mayorista/minorista y vivienda complementaria.",
    norma: {
      indiceOcupacionMax: 0.75,
      indiceConstruccionMax: 3.20,
      pisosMaximos: 6,
      alturaMaximaMetros: 19.80,
      aislamientoPosteriorMin: 3.50,
      aislamientoLateralMin: 0.00,
      antejardinMin: 2.00,
      voladizoMax: 0.90,
      parqueaderosRatio: "1 cupo cada 40 m² de comercio + 1 por cada 2 viviendas",
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
      permitidos: ["Comercio Central", "Entidades Bancarias", "Oficinas y Consultorios", "Vivienda en Pisos Altos"],
      compatibles: ["Hoteles y Hostales", "Centros de Enseñanza Técnica"],
      condicionados: ["Estaciones de Servicio", "Talleres de Mecánica Rápida"],
      prohibidos: ["Industria Química o Contaminante", "Minera"]
    },
    amenazaRiesgo: "Bajo",
    equipamientosCercanos: [
      { nombre: "Plaza España", tipo: "Espacio Público", distancia: "120 m", icon: "park" },
      { nombre: "Teatro Sogamoso", tipo: "Cultura", distancia: "480 m", icon: "theater_comedy" },
      { nombre: "Cámara de Comercio de Sogamoso", tipo: "Institucional", distancia: "320 m", icon: "domain" }
    ]
  }
];

export const CATALOGO_PLANOS_POT = [
  {
    categoria: "Componente Urbano",
    descripcion: "Planos oficiales de usos del suelo, tratamientos urbanísticos y estructuras viales de Sogamoso.",
    planos: [
      {
        codigo: "U-01",
        titulo: "Plano de Usos del Suelo Urbano",
        escala: "1:5.000",
        fecha: "Diciembre 2016",
        archivoPdf: "Plano_U01_Usos_Suelo_Urbano.pdf",
        urlDescarga: "https://drive.google.com/drive/folders/0B0erYQEtPPx4ZUlSSEpxTjEtVnc"
      },
      {
        codigo: "U-02",
        titulo: "Plano de Tratamientos Urbanísticos (UTD)",
        escala: "1:5.000",
        fecha: "Diciembre 2016",
        archivoPdf: "Plano_U02_Tratamientos_Urbanisticos.pdf",
        urlDescarga: "https://drive.google.com/drive/folders/0B0erYQEtPPx4ZUlSSEpxTjEtVnc"
      },
      {
        codigo: "U-03",
        titulo: "Plano de Malla Vial Arterial y Perfiles Viales",
        escala: "1:7.500",
        fecha: "Diciembre 2016",
        archivoPdf: "Plano_U03_Malla_Vial_Perfiles.pdf",
        urlDescarga: "https://drive.google.com/drive/folders/0B0erYQEtPPx4ZUlSSEpxTjEtVnc"
      },
      {
        codigo: "U-04",
        titulo: "Plano de Servicios Públicos y Redes Matrices",
        escala: "1:10.000",
        fecha: "Diciembre 2016",
        archivoPdf: "Plano_U04_Servicios_Publicos.pdf",
        urlDescarga: "https://drive.google.com/drive/folders/0B0erYQEtPPx4ZUlSSEpxTjEtVnc"
      }
    ]
  },
  {
    categoria: "Amenazas y Riesgos",
    descripcion: "Cartografía de amenazas por inundación de los ríos Chicamocha y Monquirá, y remoción en masa.",
    planos: [
      {
        codigo: "R-01",
        titulo: "Zonificación de Amenaza por Inundación Urbana",
        escala: "1:5.000",
        fecha: "Diciembre 2016",
        archivoPdf: "Plano_R01_Amenaza_Inundacion.pdf",
        urlDescarga: "https://drive.google.com/drive/folders/0B0erYQEtPPx4ZUlSSEpxTjEtVnc"
      },
      {
        codigo: "R-02",
        titulo: "Amenaza por Remoción en Masa (Laderas Orientales)",
        escala: "1:10.000",
        fecha: "Diciembre 2016",
        archivoPdf: "Plano_R02_Remocion_Masa.pdf",
        urlDescarga: "https://drive.google.com/drive/folders/0B0erYQEtPPx4ZUlSSEpxTjEtVnc"
      },
      {
        codigo: "R-03",
        titulo: "Microzonificación Sísmica y Zonificación Geotécnica",
        escala: "1:7.500",
        fecha: "Diciembre 2016",
        archivoPdf: "Plano_R03_Microzonificacion_Sismica.pdf",
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
        archivoPdf: "Plano_E01_Espacio_Publico_Parques.pdf",
        urlDescarga: "https://drive.google.com/drive/folders/0B0erYQEtPPx4ZUlSSEpxTjEtVnc"
      },
      {
        codigo: "E-02",
        titulo: "Red de Equipamientos Dotacionales (Salud, Educación, Recreación)",
        escala: "1:7.500",
        fecha: "Diciembre 2016",
        archivoPdf: "Plano_E02_Equipamientos_Dotacionales.pdf",
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
        archivoPdf: "Plano_P01_Centro_Historico_Patrimonio.pdf",
        urlDescarga: "https://drive.google.com/drive/folders/0B0erYQEtPPx4ZUlSSEpxTjEtVnc"
      }
    ]
  }
];

export const FORMULAS_CESIONES = {
  // Según Acuerdo 029 de 2016 de Sogamoso
  espacioPublicoM2PorHabitante: 4.0, // 4 m² por habitante en suelo urbano
  densidadHabitantesPorVivienda: 3.5, // 3.5 personas por unidad de vivienda
  porcentajeEquipamientoComunal: 0.08, // 8% sobre área neta
  porcentajeViasLocales: 0.15, // 15% estimado
  valorMetroCuadradoSueloRefCOP: 480000 // Valor de referencia catastral/comercial para liquidación de compensación en Sogamoso
};
