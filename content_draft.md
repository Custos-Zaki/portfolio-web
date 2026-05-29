# Spotify Music Analytics

**Problem Statement:**
This project treats Spotify's track-level audio fingerprints as primary data to investigate the latent structure within its high-dimensional acoustic space and identify meaningful music segments. It interrogates how reliably audio features correlate with a song's popularity score while mapping the aggregate "sonic drift" of popular music across six decades (1960–2020) of commercial production.

**Methodology:**
The analysis applies Exploratory Data Analysis (EDA) and non-parametric correlation (Pearson, Spearman, and Kendall $\tau$) to identify multivariate trends and temporal shifts. Dimensionality reduction is performed via Principal Component Analysis (PCA) to extract four components explaining 77.3% of audio variance, followed by K-Means clustering ($K=5$) to segment the catalog and machine learning models (Ridge Regression and Random Forest) to predict popularity.

**Key Insights:**
Release year dominates the popularity signal ($r \approx +0.68$) due to Spotify's recency-weighted scoring algorithm, whereas audio features alone explain only 25% of popularity variance (Random Forest $R^2 \approx 0.25$). The catalog segments into 5 distinct audio archetypes with compressed median popularities (ranging from 36 to 47), dominated by PC1 (Production Intensity) which explains 43.2% of variance. Over six decades, music has shifted monotonically ($p < 0.001$) toward becoming louder ($\tau = +0.32$), less acoustic ($\tau = -0.22$), more energetic ($\tau = +0.19$), more danceable ($\tau = +0.15$), and emotionally darker/less positive ($\tau = -0.08$).

---

# UK Online Retail: Customer Intelligence & Revenue Analysis

**Problem Statement:**
This business analytics case study investigates twelve months of transaction data from a UK-based e-commerce gift retailer to evaluate operational health, customer purchasing patterns, and revenue distribution. The analysis aims to segment the customer base to prioritize retention efforts and build a predictive Customer Lifetime Value (CLV) model to optimize marketing budget allocations.

**Methodology:**
The study cleans 541,909 raw transactions to yield 392,692 clean customer records, which are segmented using quartile-based RFM (Recency, Frequency, Monetary) analysis. It then applies probabilistic modeling using a Beta-Geometric/Negative Binomial Distribution (BG/NBD) model for customer transaction rates and dropout probabilities, combined with a Gamma-Gamma model to predict 12-month forward CLV for 2,790 repeat purchasers.

**Key Insights:**
Revenue is heavily concentrated with the top 30% of customers (Champions) generating 73.0% of total revenue, while Q4 sales peak sharply in November at roughly three times the July trough. The business carries an average return rate of 11.3%, which spikes to 27.4% in November due to wholesale buyers over-ordering and subsequently cancelling excess stock. The probabilistic models estimate a total 12-month forward revenue of £8,317,572 from repeat buyers, with a median individual CLV of £1,394 and a top-decile floor of £5,130.
