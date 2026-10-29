# PDR: Plataforma de análisis urbano y normativa de predios para Sogamoso

**Aplicación de apoyo a la evaluación temprana de predios**  
- **Alcance inicial:** Municipio de Sogamoso, Boyacá  
- **Base normativa:** Plan de Ordenamiento Territorial (POT), Acuerdo Municipal 029 del 28 de diciembre de 2016  
- **Curso:** Electiva Libre 772242026211 — Universidad de Boyacá (2026)  
- **Docente:** Santiago Correal Mantilla (`scorreal@uniboyaca.edu.co`)  
- **Integrantes:**  
  - Ángela María Gómez Rodríguez — Cód. 77423512 (`amgomezr@uniboyaca.edu.co`)  
  - Santiago Dueñas Barón — Cód. 77424015 (`sduenas@uniboyaca.edu.co`)  
  - Laura Sofía Burgos Vargas — Cód. 77424016 (`lsburgos@uniboyaca.edu.co`)  

---

## 1. El Problema
Evaluar un predio en Sogamoso antes de diseñar exige reunir información dispersa: cartografía del municipio, el articulado y los planos del POT. Todo se consulta y se calcula a mano, lo que toma tiempo, deja espacio para errores al interpretar la norma y retrasa saber si una idea es viable en un lote concreto. Además, el POT vigente fue adoptado en 2016 (Acuerdo 029) y la propia Secretaría de Planeación reconoce que su cartografía rural no tiene el nivel de detalle necesario, por lo que la información más confiable y utilizable se concentra en el área urbana.

---

## 2. El Usuario
- Arquitectos independientes y estudios de diseño.
- Estudiantes de arquitectura y urbanismo.
- Pequeños constructores y promotores inmobiliarios.
- Propietarios de lotes en suelo urbano de Sogamoso que necesitan una primera lectura de viabilidad técnica antes de contratar diseño o iniciar trámites ante curaduría.

---

## 3. Funciones Principales
1. **Análisis urbano y de sitio:** Al ingresar una zona o predio (búsqueda interactiva en mapa, dirección o coordenadas), entrega morfología, usos del suelo, equipamientos cercanos, movilidad y alturas del entorno urbano.
2. **Consulta normativa del predio:** Muestra la ficha técnica con índices de ocupación (IO) y de construcción (IC), alturas máximas permitidas, aislamientos (frontal, laterales, posterior), tratamientos urbanísticos y matriz de usos (permitidos, compatibles, condicionados, prohibidos).
3. **Verificación de cumplimiento:** El usuario ingresa los datos de su propuesta preliminar (área de lote, área construida, número de pisos, área de ocupación en primer piso, uso proyectado) y la aplicación semaforiza qué parámetros cumple (*Cumple / No cumple / Alerta*) referenciando los artículos del POT.
4. **Calculadora de cesiones:** Calcula de forma automatizada las áreas de cesión pública obligatoria (vías, parques, equipamiento comunal) según el predio y la escala del proyecto.
5. **Planoteca Oficial POT 2016 (Módulo Adicional):** Catálogo interactivo con selector por categorías de los planos oficiales en PDF aprobados por el Acuerdo 029 de 2016 (repositorio oficial Drive de la Alcaldía de Sogamoso).
6. **Historial de Predios y Autenticación (Módulo Adicional - Firebase):** Registro de usuarios y persistencia de consultas/evaluaciones guardadas.
7. **Generador de Reporte / Dossier PDF:** Exportación del reporte técnico de viabilidad preliminar con su respectivo descargo de responsabilidad legal.

---

## 4. Lo que la App NO hace (Límites y Exclusiones)
- **No reemplaza la consulta oficial** ante la Secretaría de Planeación ni la Curaduría Urbana: los resultados son orientativos y sin validez legal de licenciamiento.
- **No cubre en esta primera versión el suelo rural** ni otros municipios (enfoque 100% urbano en Sogamoso).
- **No diseña ni genera planos o volumetrías 3D automáticas.**
- **No tramita licencias ni permisos.**
- **No hace cálculos estructurales ni de instalaciones**, ni estimaciones de costos o presupuestos de obra.
