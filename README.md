# 🚗 Vehicle Intelligence Platform

### *Market Intelligence & Econometric Valuation for the Automotive Industry*

**Note:** This project started as a personal tool to help me make a data-driven decision when buying a car. What began as a simple spreadsheet evolved into this full-scale econometric platform to understand market trends and fair pricing.

---

This platform provides data-driven insights and fair market value predictions for used vehicles, using real-world data scraped from major marketplaces and custom econometric modeling.

![Dashboard Preview](https://via.placeholder.com/800x450?text=Vehicle+Intelligence+Dashboard+Preview)

## 🧠 The Core Engine: Dual Depreciation Analysis

Unlike simple average-based calculators, this platform uses a **Dual Depreciation Motor**. It isolates the two main factors that affect a vehicle's value:

1.  **Time-Based Decay (Cost of Aging):** The fixed loss of value per year.
2.  **Usage-Based Decay (Wear & Tear):** The variable loss of value per every 10,000 km.

By combining these using an **Ensemble Model** (Linear + Exponential Regressions), the platform can predict a "Fair Market Price" with high statistical confidence (verified by R² scores).

## 🛠️ Technical Stack & Features

-   **Frontend:** Next.js 15, TypeScript, Tailwind CSS.
-   **Visualizations:** Interactive Scatterplots and Area Charts using **Recharts** to visualize market dispersion.
-   **Data Engineering:**
    *   **Automated Scraping:** Custom engines to extract data from MercadoLibre and Kavak.
    *   **Data Normalization:** Handling currency conversion (ARS to USD), duplicate removal, and outlier filtering.
    *   **Variant Segregation:** Automatically groups and analyzes sub-models (e.g., Toyota Corolla Cross *SEG* vs. *XEI*) for niche precision.
-   **Econometric Modeler:** A standalone science agent that processes JSON datasets to generate trend coefficients and stability labels (Platinum, Gold, Silver).

## 📊 Project Impact

This project demonstrates proficiency in:
-   **Data Science Pipeline:** From raw data extraction (Web Scraping) to statistical modeling.
-   **UX/UI for Analytics:** Presenting complex data in an intuitive, premium dashboard.
-   **Full-Stack Development:** Modern React patterns and TypeScript safety.

---

### How to run locally

1. Clone the repo: `git clone https://github.com/YOUR_USER/vehicle-intelligence.git`
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`

---
*Developed as a showcase for advanced data analysis and web application development.*
