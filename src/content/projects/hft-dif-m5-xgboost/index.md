---
title: "Algorithmic Trading Post-Mortem: Mengapa Model XGBoost HFT Mengalami Kerugian di MetaTrader 5"
description: "Analisis Post-Mortem migrasi strategi kuantitatif HFT instrumen Emas (XAUUSD) dari Python ke MetaTrader 5, mendeteksi target leakage akibat Fractional Differencing dan timezone mismatch."
date: 2026-06-04
tags: ["Quantitative Finance", "Machine Learning", "XGBoost", "MQL5", "Time Series"]
coverImage: "hft-dif-m5-xgboost/00_equity_curve.png"
category: "Quantitative Finance"
visualizations:
  - filename: "hft-dif-m5-xgboost/00_equity_curve.png"
    title: "Equity Curve MT5 Live Simulation"
    description: "Performa drawdown strategi sebelum perbaikan dilakukan, menunjukkan gap besar antara backtest riset dengan realitas eksekusi live."
  - filename: "hft-dif-m5-xgboost/01_fractional_diff_scan.png"
    title: "Fractional Differencing Scan"
    description: "Uji ADF Statistic & p-value untuk mencari nilai d terkecil yang stasioner (d = 0.3 terpilih untuk mempertahankan memori tren harga)."
  - filename: "hft-dif-m5-xgboost/02_target_class_distribution.png"
    title: "Target Class Distribution"
    description: "Distribusi imbalance momentum target naik dan turun berbasis rolling quantile."
  - filename: "hft-dif-m5-xgboost/03_mutual_information_heatmap.png"
    title: "Mutual Information Heatmap"
    description: "Menguji korelasi non-linear fitur input (volume dan volatilitas) terhadap target pergerakan harga."
  - filename: "hft-dif-m5-xgboost/04_spearman_correlation_atlas.png"
    title: "Spearman Correlation Atlas"
    description: "Kekuatan korelasi linearitas fitur volume terhadap target return pasar."
  - filename: "hft-dif-m5-xgboost/05_predictive_horizon_scan.png"
    title: "Predictive Horizon Scan"
    description: "Scan parameter horizon prediksi masa depan untuk menemukan bar momentum terbaik."
  - filename: "hft-dif-m5-xgboost/06_feature_importance_comparison.png"
    title: "Feature Importance Comparison"
    description: "Perbandingan kontribusi signifikansi fitur teknikal komparatif."
  - filename: "hft-dif-m5-xgboost/07_consensus_ranking_heatmap.png"
    title: "Consensus Ranking Heatmap"
    description: "Konsensus fitur terbaik dari berbagai metode pembobotan untuk menekan bias overfitting."
  - filename: "hft-dif-m5-xgboost/08_optuna_optimization_history.png"
    title: "Optuna Optimization History"
    description: "Bayesian Optimization pada pencarian parameter XGBoost Classifier untuk meminimalkan log-loss."
  - filename: "hft-dif-m5-xgboost/09_out_of_sample_roc_curve.png"
    title: "Out-of-Sample ROC Curve"
    description: "Akurasi metrik model (ROC-AUC = 0.7810) sebelum perbaikan kebocoran target terdeteksi."
  - filename: "hft-dif-m5-xgboost/10_confusion_matrix.png"
    title: "Out-of-Sample Confusion Matrix"
    description: "Matriks klasifikasi arah momentum naik dan turun out-of-sample (~72.5% akurasi riset)."
  - filename: "hft-dif-m5-xgboost/12_shap_feature_beeswarm.png"
    title: "SHAP Feature Beeswarm Plot"
    description: "Explainable AI (XAI) memetakan pengaruh volume fraksional (F2/F3) sebagai kontributor keputusan model terbesar."
  - filename: "hft-dif-m5-xgboost/11_probability_threshold_calibration.png"
    title: "Probability Threshold Calibration"
    description: "Diagram kalibrasi keandalan probabilitas model setelah rekayasa ulang untuk menyaring kebisingan pasar (market noise)."
---

## 1. Desain Sistem & Konteks Timeframe (M1 vs. M5)

Strategi ini beroperasi pada timeframe 5 menit (M5) untuk mengantisipasi masalah biaya transaksi (spread) yang sering menghabiskan keunggulan prediktif pada timeframe 1 menit (M1).

*   **Masalah Over-head Transaksi di M1:** Target pergerakan harga 1 menit berkisar **3 s.d. 8 pip**. Sementara spread rata-rata XAUUSD berkisar **1.5 s.d. 3 pip**. Biaya transaksi memakan **30% s.d. 50%** keuntungan kotor.
*   **Keuntungan Timeframe M5:** Dengan target pergerakan 3-bar M5 (15 menit) sebesar **15 s.d. 25 pip**, spread hanya menyumbang **6% s.d. 15%** biaya transaksi, sehingga secara teori keunggulan statistik model dapat dimonetisasi.

---

## 2. Feature Engineering & Uji Stasioneritas (Fractional Differencing)

Untuk menghindari regresi semu (spurious regression) tanpa membuang informasi jangka panjang (tren historis), digunakan metode **Fractional Differencing (Hosking, 1981)**.

Dilakukan scan nilai $d$ dari 0.10 hingga 0.90 dengan uji Augmented Dickey-Fuller (ADF) untuk mencari nilai differencing terkecil yang stasioner (p-value < 0.05).

*(Hasil visualisasi stasioneritas dapat dilihat pada Gambar 2 di Galeri Visualisasi di bawah)*

### Struktur Fitur (8 Fitur Input)
1.  **F1 (FracDiff Mid-Price):** Tren stasioner harga dengan $d=0.3$.
2.  **F2 & F3 (FracDiff Buy/Sell Volume Proxies):** Aliran volume beli/jual yang distasionerkan.
3.  **F4 (OFI Z-Score):** Imbalance aliran order dengan rolling Z-score 30 bar.
4.  **F5 (HAR-RV Volatility Forecast):** Komposit volatilitas multiskala (10, 30, 60 bar M5).
5.  **F6 (Time-of-Day Encoding):** Siklus jam pasar menggunakan representasi sin/cos.
6.  **F7 (Normalized Volatility):** Rasio volatilitas jangka pendek terhadap jangka panjang.
7.  **F8 (Rolling Autocorrelation lag-1):** Detektor perubahan mikrostruktur pasar.

---

## 3. Kesalahan Fatal: Desain Label Target (The Target Leakage)

Untuk menghindari bias masa depan, pembuatan label target menggunakan metode biner berbasis *rolling quantile* (top/bottom 30% dari forward return 1 bar ke depan). Namun, di sinilah letak bug utama yang menyebabkan kegagalan sistem ketika dijalankan di MT5:

> [!CAUTION]
> **BUG STRUKTURAL (Label-Instrument Mismatch):**  
> Label target ($Y$) dihitung menggunakan return dari **harga hasil Fractional Differencing (F1)**, *bukan* dari harga transaksi riil (Close Price asli).
> ```python
> F1_vals = df["F1_FracDiff_MidPrice"].values.astype(np.float64)
> fwd_ret[:-HORIZON] = F1_vals[HORIZON:] - F1_vals[:-HORIZON]
> y_raw = np.where(fwd_ret >= q_hi_roll, 1, 0)
> ```

---

## 4. Signal Diagnostics (Metrik Sinyal Kuantitatif)

Karena target ($Y$) yang diprediksi adalah arah pergerakan harga stasioner (`F1_FracDiff_MidPrice`) yang memiliki autokorelasi kuat, model menunjukkan kekuatan prediktif fiktif yang sangat tinggi selama fase diagnostik sinyal.

*(Silakan periksa Gambar 4, 5, dan 8 pada galeri di bawah untuk memverifikasi signifikansi linear dan kepentingan fitur)*

---

## 5. Pelatihan Model & Optimasi Hiperparameter (XGBoost & Optuna)

Model dilatih menggunakan **XGBoost Classifier** dengan 4-Fold Purged Walk-Forward Cross Validation. Untuk mencari arsitektur model terbaik tanpa mengalami overfitting, digunakan optimasi hiperparameter berbasis Bayesian Optimization lewat **Optuna**.

*(Riwayat optimasi dapat diverifikasi pada Gambar 9 di bawah)*

Hasil evaluasi pada data out-of-sample (tersegel) memberikan metrik riset yang luar biasa sebelum debugging dilakukan:

*   **OOS ROC-AUC:** **0.7810** (Nilai yang sangat tinggi untuk trading frekuensi tinggi)
*   **OOS Macro F1-Score:** **0.7254**

*(Gambar 10 dan 11 menunjukkan visual kurva ROC dan Confusion Matrix hasil pelatihan tersebut)*

---

## 6. Penjelasan Keputusan Model (Explainable AI - SHAP)

Untuk memverifikasi logika pengambilan keputusan XGBoost secara matematis, kami mengekstrak nilai SHAP (SHapley Additive exPlanations). Ini memastikan model tidak mengambil keputusan berdasarkan bias noise.

*(Visual sebaran kontribusi fitur dapat ditinjau pada Gambar 12 di bawah)*

---

## 7. Benturan Realitas & Diagnosis Debugging

Ketika model dengan akurasi 78% ini diuji di live trading MT5, hasil eksekusi riil sangat bertolak belakang dengan hasil backtest ideal di Python. Setelah audit kode dilakukan, ditemukan beberapa penyebab utama kegagalan tersebut:

### A. Konsekuensi Matematis Label-Instrument Mismatch
Model XGBoost berhasil menebak ke mana arah harga stasioner *FracDiff* ($d=0.3$) akan bergerak dengan akurasi tinggi. Namun, karena Fractional Differencing membuang tren jangka panjang demi mencapai stasioneritas, pergerakan naik pada FracDiff sering kali bertepatan dengan harga riil yang sebenarnya sedang turun atau bergerak flat. Akibatnya, robot trading melakukan pembelian (*Buy*) pada harga fisik saat model menerima sinyal naik dari representasi harga stasioner abstrak. Hal ini mengakibatkan akumulasi kerugian yang besar karena ketidaksesuaian instrumen transaksi.

### B. Pergeseran Zona Waktu (TOD Timezone Shift)
*   **Masalah:** Fitur waktu harian (TOD sin/cos) menggunakan menit-dalam-hari. Data latih Python menggunakan waktu UTC/GMT, sementara MetaTrader 5 berjalan pada waktu server broker (EET/GMT+2).
*   **Dampak:** Pergeseran 2-3 jam membuat model salah membaca sesi perdagangan, mengira sesi London yang tenang sedang berlangsung ketika pasar live sebenarnya berada dalam sesi New York yang sangat volatil.

### C. Densitas Volume Tick Broker
*   **Masalah:** CFD Emas bersifat desentralisasi. Setiap broker MT5 menyuplai feed volume tick yang berbeda.
*   **Dampak:** Model XGBoost yang dilatih pada batas absolut split volume (misal: `F2 > 1500`) akan gagal membaca sinyal saat berjalan pada broker yang memiliki kepadatan volume tick yang berbeda.

---

## 8. Solusi Kuantitatif & Hasil Setelah Koreksi Target

Untuk mengatasi bug struktural ini, kami menerapkan **Protokol Perbaikan Kuantitatif**:

1.  **Pemisahan Peran Stasioneritas:** Fitur Input ($X$) tetap menggunakan data stasioner (FracDiff d=0.3, OFI, HAR-RV) untuk analisis pola jangka pendek. Namun, Label Target ($Y$) wajib menggunakan return dari **Close Price fisik asli** (`Close[t+HORIZON] - Close[t]`).
2.  **Kalibrasi Probabilitas:** Kami menambahkan lapisan kalibrasi probabilitas (Probability Calibration) untuk menyaring sinyal trading yang tidak pasti.

*(Gambar 13 menunjukkan kurva kalibrasi probabilitas keandalan sistem)*

### Evaluasi Realitas Finansial (The True Benchmark)

Setelah melatih ulang model dengan target Close Price fisik riil, metrik performa menunjukkan realitas pasar yang sesungguhnya:

*   **OOS ROC-AUC Terkoreksi:** **0.5061** (Sangat dekat dengan *random walk* 0.50).
*   **Perilaku Model:** Dengan model baru ini, sistem mengenali bahwa pasar pada timeframe M5 sangat acak (*efficient market hypothesis*). Model bertindak sebagai **Risk Gatekeeper** yang tangguh: alih-alih melakukan transaksi acak secara berlebihan yang akan merugi akibat spread, model secara pintar menyaring 99.8% data sebagai kebisingan (*noise*) dan membatasi transaksi hanya sebanyak 21 trade selama periode pengujian out-of-sample.

Hal ini membuktikan keberhasilan rekayasa ulang: model berhasil diubah dari sistem yang "percaya diri secara keliru" (overconfident dan merugi akibat sinyal palsu) menjadi sistem protektif yang memahami keterbatasan informasinya sendiri di pasar yang efisien.
