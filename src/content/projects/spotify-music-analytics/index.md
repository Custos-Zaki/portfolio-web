---
title: "Spotify Music Analytics"
description: "Acoustic space clustering and popularity prediction using K-Means and principal component analysis (PCA) to map sonic drifts over six decades."
date: 2026-04-15
tags: ["Data Science", "Machine Learning", "Clustering", "Python"]
coverImage: "spotify-music-analytics/spotify_kmeans_clusters.png"
category: "Data Science & ML"
visualizations:
  - filename: "spotify-music-analytics/spotify_kmeans_clusters.png"
    title: "Spotify K-Means Clusters"
    description: "Visualization of the 5 distinct audio archetypes mapped in the reduced acoustic space."
  - filename: "spotify-music-analytics/spotify_valence_vs_energy.png"
    title: "Valence vs. Energy"
    description: "Scatter plot analyzing the correlation between musical positivity (valence) and energy levels."
  - filename: "spotify-music-analytics/spotify_audio_feature_distribution.png"
    title: "Audio Feature Distributions"
    description: "Probability density distributions of key track metrics: danceability, energy, loudness, etc."
  - filename: "spotify-music-analytics/spotify_yearly_feature_trends.png"
    title: "Yearly Feature Trends"
    description: "Historical progression showing the 'sonic drift' of popular music metrics over six decades."
  - filename: "spotify-music-analytics/spotify_feature_correlation_heatmap.png"
    title: "Feature Correlation Heatmap"
    description: "Correlation matrix highlighting links between acoustic variables like loudness and energy."
  - filename: "spotify-music-analytics/spotify_popularity_correlation_bar.png"
    title: "Popularity Correlation Bar Chart"
    description: "Direct linear relationship strengths between track features and Spotify's popularity score."
  - filename: "spotify-music-analytics/spotify_pca_explained_variance.png"
    title: "PCA Explained Variance"
    description: "Scree plot illustrating how many principal components are required to explain the variance."
  - filename: "spotify-music-analytics/spotify_pca_loadings_heatmap.png"
    title: "PCA Loadings Heatmap"
    description: "Visual weights mapping original audio features to the four primary components."
  - filename: "spotify-music-analytics/spotify_pca_scatter_plot.png"
    title: "PCA Projection"
    description: "High-dimensional audio space projected onto the first two principal components."
  - filename: "spotify-music-analytics/spotify_kmeans_elbow_silhouette.png"
    title: "Elbow & Silhouette Metrics"
    description: "Statistical validation for selecting K=5 clusters using inertia and silhouette coefficients."
  - filename: "spotify-music-analytics/spotify_cluster_radar_profiles.png"
    title: "Cluster Radar Profiles"
    description: "Mean feature fingerprints illustrating the unique characteristics of each cluster."
  - filename: "spotify-music-analytics/spotify_random_forest_importance.png"
    title: "Random Forest Feature Importance"
    description: "Relative weights of features predicting track popularity, showing release year dominance."
---

## Problem Statement

This project treats Spotify's track-level audio fingerprints as primary data to investigate the latent structure within its high-dimensional acoustic space and identify meaningful music segments. It interrogates how reliably audio features correlate with a song's popularity score while mapping the aggregate "sonic drift" of popular music across six decades (1960–2020) of commercial production.

## Methodology

The analysis applies Exploratory Data Analysis (EDA) and non-parametric correlation (Pearson, Spearman, and Kendall $\tau$) to identify multivariate trends and temporal shifts. Dimensionality reduction is performed via Principal Component Analysis (PCA) to extract four components explaining 77.3% of audio variance, followed by K-Means clustering ($K=5$) to segment the catalog and machine learning models (Ridge Regression and Random Forest) to predict popularity.

## Key Insights

- **Recency Dominance:** Release year dominates the popularity signal ($r \approx +0.68$) due to Spotify's recency-weighted scoring algorithm, whereas audio features alone explain only 25% of popularity variance (Random Forest $R^2 \approx 0.25$).
- **Catalog Archetypes:** The catalog segments into 5 distinct audio archetypes with compressed median popularities (ranging from 36 to 47), dominated by PC1 (Production Intensity) which explains 43.2% of variance.
- **Six-Decade Sonic Drift:** Over six decades, music has shifted monotonically ($p < 0.001$) toward becoming louder ($\tau = +0.32$), less acoustic ($\tau = -0.22$), more energetic ($\tau = +0.19$), more danceable ($\tau = +0.15$), and emotionally darker/less positive ($\tau = -0.08$).
