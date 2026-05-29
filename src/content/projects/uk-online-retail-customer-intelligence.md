---
title: "UK Online Retail: Customer Intelligence & Revenue Analysis"
description: "E-commerce customer segmentation via RFM analysis and probabilistic BG/NBD customer lifetime value (CLV) modeling."
date: 2026-05-10
tags: ["Business Intelligence", "RFM Segmentation", "Customer Lifetime Value", "BG/NBD Model"]
coverImage: "uk_retail_rfm_segments.png"
category: "Business Analytics"
visualizations:
  - filename: "uk_retail_rfm_segments.png"
    title: "RFM Customer Segments"
    description: "Segmentation breakdown classifying customer groups into Champions, Loyal Customers, At Risk, etc."
  - filename: "uk_retail_monthly_revenue.png"
    title: "Monthly Revenue Performance"
    description: "Tracking overall store sales month-over-month, showing key Q4 retail peaks."
  - filename: "uk_retail_revenue_by_country.png"
    title: "Geographical Revenue Split"
    description: "E-commerce revenue distribution across countries, showing UK dominance."
  - filename: "uk_retail_monthly_cancellations.png"
    title: "Transaction Cancellation Volume"
    description: "Analyzing seasonal returns and order cancellations, highlighting the November wholesale anomaly."
  - filename: "uk_retail_top_customers.png"
    title: "Top Customers by Value"
    description: "Revenue contributions from the highest-grossing individual accounts."
  - filename: "uk_retail_top_products.png"
    title: "Top-Selling Products"
    description: "Most popular items by inventory quantity sold."
  - filename: "uk_retail_revenue_by_day_hour.png"
    title: "Order Placement Activity Heatmap"
    description: "Sales distribution by hour of day and day of week to optimize operations."
  - filename: "uk_retail_order_frequency_distribution.png"
    title: "Order Frequency Distribution"
    description: "Histogram showing how many times unique customers make repeat purchases."
  - filename: "uk_retail_rfm_scatter.png"
    title: "RFM Metric Scatter Plot"
    description: "Multi-dimensional grouping showing correlations between Recency, Frequency, and Monetary values."
  - filename: "uk_retail_model_calibration.png"
    title: "BG/NBD Model Calibration"
    description: "Comparison of actual transaction frequency vs. probabilistic model predictions."
  - filename: "uk_retail_probability_alive_vs_recency.png"
    title: "Probability of Being Active"
    description: "Customer active probability mapping against their purchase recency and frequency."
  - filename: "uk_retail_probability_alive_heatmap.png"
    title: "Active Probability Heatmap"
    description: "Grid representation of customer survival likelihood based on historical patterns."
  - filename: "uk_retail_expected_purchases_heatmap.png"
    title: "Expected Purchases Matrix"
    description: "Expected purchase frequency predictions for the next 12 months based on user transactions."
  - filename: "uk_retail_clv_distribution.png"
    title: "Customer Lifetime Value Distribution"
    description: "Density plot showing the distribution of predicted 12-month Customer Lifetime Value."
  - filename: "uk_retail_clv_scatter.png"
    title: "Predicted CLV vs. Current Spending"
    description: "Comparing historical monetary contribution against future predicted lifetime value."
---

## Problem Statement

This business analytics case study investigates twelve months of transaction data from a UK-based e-commerce gift retailer to evaluate operational health, customer purchasing patterns, and revenue distribution. The analysis aims to segment the customer base to prioritize retention efforts and build a predictive Customer Lifetime Value (CLV) model to optimize marketing budget allocations.

## Methodology

The study cleans 541,909 raw transactions to yield 392,692 clean customer records, which are segmented using quartile-based RFM (Recency, Frequency, Monetary) analysis. It then applies probabilistic modeling using a Beta-Geometric/Negative Binomial Distribution (BG/NBD) model for customer transaction rates and dropout probabilities, combined with a Gamma-Gamma model to predict 12-month forward CLV for 2,790 repeat purchasers.

## Key Insights

- **Champions Dominate:** Revenue is heavily concentrated with the top 30% of customers (Champions) generating 73.0% of total revenue, while Q4 sales peak sharply in November at roughly three times the July trough.
- **Return Rate Anomaly:** The business carries an average return rate of 11.3%, which spikes to 27.4% in November due to wholesale buyers over-ordering and subsequently cancelling excess stock.
- **CLV Forward Projections:** The probabilistic models estimate a total 12-month forward revenue of £8,317,572 from repeat buyers, with a median individual CLV of £1,394 and a top-decile floor of £5,130.
