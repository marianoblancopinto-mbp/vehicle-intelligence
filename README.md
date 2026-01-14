# 🚗 Vehicle Intelligence Platform

### *Inteligencia de Mercado y Valuación Econométrica Automotriz*

**Nota personal:** Este proyecto nació por una necesidad real: quería comprarme un auto y necesitaba tomar una decisión basada en datos, no en corazonadas. Lo que empezó como una planilla de Excel terminó evolucionando en esta plataforma de modelado econométrico para entender de verdad cómo se deprecia un vehículo en Argentina.

Este desarrollo fue realizado utilizando técnicas de **Agentic Coding**, integrando agentes de IA para la extracción de datos, limpieza y modelado estadístico.

---

Esta plataforma ofrece predicciones de "Precio Justo de Mercado" para vehículos usados, utilizando datos reales extraídos de los principales marketplaces y modelos econométricos personalizados.

## 🧠 El Motor: Análisis de Depreciación Dual

A diferencia de las calculadoras que solo tiran un promedio, esta plataforma usa un **Motor de Depreciación Dual**. Separa los dos factores que más afectan el valor de un auto:

1.  **Depreciación por Tiempo (Costo de Antigüedad):** La pérdida de valor fija por cada año que pasa.
2.  **Depreciación por Uso (Desgaste):** La pérdida de valor variable por cada 10.000 km recorridos.

Combinando ambos mediante un **Ensemble Model** (Regresiones Lineales + Exponenciales), la plataforma predice un "Precio Justo" con alta confianza estadística.

## 🛠️ Stack Técnico y Features

-   **Frontend:** Next.js 15, TypeScript, Tailwind CSS.
-   **Visualizaciones:** Scatterplots interactivos y gráficos de área con **Recharts** para ver la dispersión del mercado.
-   **Ingeniería de Datos:**
    *   **Scraping Automatizado:** Motores personalizados para extraer datos de MercadoLibre y Kavak.
    *   **Normalización:** Conversión de ARS a USD (blue/mep), eliminación de duplicados y filtrado de outliers.
    *   **Segregación por Versión:** Agrupa y analiza versiones específicas (ej. Toyota Corolla Cross *SEG* vs *XEI*) para no mezclar peras con manzanas.
-   **Modelador Econométrico:** Un motor científico independiente que procesa los JSON para generar coeficientes de tendencia y etiquetas de estabilidad (Platinum, Gold, Silver).

## 📊 Valor del Proyecto

Este proyecto demuestra capacidad en:
-   **Pipeline de Data Science:** Desde la extracción de datos crudos hasta el modelado estadístico.
-   **UX/UI para Analytics:** Presentar datos complejos en un dashboard premium e intuitivo.
-   **Desarrollo Full-Stack:** Patrones modernos de React y seguridad con TypeScript.

---

### Cómo correrlo localmente

1. Clonar el repo: `git clone https://github.com/marianoblancopinto-mbp/vehicle-intelligence.git`
2. Instalar dependencias: `npm install`
3. Correr el servidor de desarrollo: `npm run dev`

---
*Desarrollado como muestra de análisis de datos avanzado y desarrollo de aplicaciones modernas.*
