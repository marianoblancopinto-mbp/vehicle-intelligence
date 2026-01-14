# Vehicle Intelligence Platform

### Inteligencia de Mercado y Valuación Econométrica Automotriz

Nota: Este proyecto surgió inicialmente como una herramienta personal para analizar precios de autos y luego evolucionó en esta plataforma de modelado econométrico.

Este desarrollo fue realizado utilizando técnicas de Agentic Coding, para asistir en la implementación, el ajuste de parámetros de los modelos estadísticos y el refinamiento de la lógica de negocio.

---

Esta plataforma ofrece predicciones de "Precio Justo de Mercado" para vehículos usados, utilizando datos reales extraídos de los principales marketplaces y modelos econométricos personalizados.

## El Motor: Análisis de Depreciación Dual

A diferencia de las calculadoras que solo ofrecen un promedio, esta plataforma usa un Motor de Depreciación Dual. Separa los dos factores que más afectan el valor de un auto:

1. Depreciación por Tiempo (Costo de Antigüedad): La pérdida de valor fija por cada año que pasa.
2. Depreciación por Uso (Desgaste): La pérdida de valor variable por los kms recorridos. Las deprececiaciones fueron modeladas como decaimentos lineales o exponenciales y se combinaron mediante un Ensemble. La plataforma predice un "Precio Justo" con alta confianza estadística.

## Stack Técnico y Features

- Frontend: Next.js 15, TypeScript, Tailwind CSS.
- Visualizaciones: Scatterplots interactivos y gráficos de área con Recharts para ver la dispersión del mercado.
- Ingeniería de Datos:
    - Scraping Automatizado: Motores personalizados para extraer datos de marketplaces.
    - Normalización: Conversión de divisas, eliminación de duplicados y filtrado de outliers.
    - Segregación por Versión: Agrupa y analiza versiones específicas para mayor precisión en la comparativa.
- Modelador Econométrico: Un motor científico independiente que procesa los datos para generar coeficientes de tendencia y etiquetas de estabilidad.

## Valor del Proyecto

Este proyecto demuestra capacidad en:
- Pipeline de datos: Desde la extracción de datos crudos hasta el modelado estadístico asistido.
- UX/UI para Analytics: Presentar datos complejos en un dashboard premium e intuitivo.
- Desarrollo Full-Stack: Patrones modernos de React y seguridad con TypeScript.

---

### Cómo correrlo localmente

1. Clonar el repo: git clone https://github.com/marianoblancopinto-mbp/vehicle-intelligence.git
2. Instalar dependencias: npm install
3. Correr el servidor de desarrollo: npm run dev

---
Desarrollado como muestra de análisis de datos y desarrollo de aplicaciones modernas.
