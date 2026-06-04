---
title: "MQL5 Systematic Trading Suite: Profitable Expert Advisors"
description: "A production suite of 4 hardcoded algorithmic trading systems built in MQL5 for MetaTrader 5, engineered with strict risk parameters and statistical edge verification."
date: 2026-06-04
tags: ["MQL5", "Systematic Trading", "Expert Advisors", "MetaTrader 5", "Risk Management"]
coverImage: "mql5-expert-advisors-suite/orb_propfirm.png"
category: "Systematic Trading"
visualizations:
  - filename: "mql5-expert-advisors-suite/orb_propfirm.png"
    title: "ORB for Prop Firm - 7-Month Backtest"
    description: "Equity curve showing the performance of the Opening Range Breakout strategy using safe and aggressive parameter sets optimized for prop firm drawdowns."
  - filename: "mql5-expert-advisors-suite/asian_breakout.png"
    title: "Asian Breakout - 17-Month Backtest"
    description: "Backtest performance of the session breakout strategy, capturing volatility swings at the London open."
  - filename: "mql5-expert-advisors-suite/mean_reversion.png"
    title: "Volatility Exhaustion Mean Reversion - 17-Month Backtest"
    description: "Performance chart for the mean reversion model exploiting volatility expansions with wick rejection filters."
  - filename: "mql5-expert-advisors-suite/zero_wick_atr.png"
    title: "Zero Wick ATR Momentum - 1-Year Backtest"
    description: "Linear equity accumulation of the trend-following breakout model using M1 resolution triggers."
---

This project showcases a suite of production-ready, hardcoded algorithmic trading robots (Expert Advisors) developed in **MQL5** for **MetaTrader 5**. These systems do not rely on machine learning filters; instead, they exploit structural market behaviors (session boundaries, momentum breakouts, and volatility exhaustion) verified through rigorous backtesting and live risk management parameters.

> [!WARNING]
> **ALPHA DECAY DISCLAIMER:**  
> The systematic Expert Advisors documented in this suite are shared for educational, architectural, and historical validation purposes. Due to shifting market regimes, these hardcoded rulesets have begun to exhibit **alpha decay** and are no longer active in their original, un-calibrated forms.

Below is a technical breakdown of each system's execution logic, risk controls, and active configurations.

---

## 1. Opening Range Breakout (ORB) for Prop Firms

This EA is specifically designed to navigate the strict drawdown requirements of proprietary trading accounts (e.g., FundingPips). It captures opening range momentum at critical trading hours by mapping high-low ranges and placing breakout pending orders.

### Execution Logic
The system monitors the market at specific hours of the day. It defines a reference candle on a 5-minute timeframe. Once the range is established, Buy Stop and Sell Stop pending orders are placed at the high and low boundaries.
*   **Safe Mode:** Stop Loss (SL) is placed at the opposite range boundary of the reference candle, giving the trade room to breathe.
*   **Aggressive Mode:** SL is placed closer to the opening price, lowering the stop distance to maximize leverage and contract sizes.
*   **Drawdown Protection:** Global protection parameters monitor the account balance and halt execution if the maximum equity drawdown limit is reached.

### Active Configuration Set
*   **Reference Candle Timeframe:** 5 Minutes
*   **Strategy 1 (Asia 01:25 SAFE):** Active | Reference Hour 1:25 | Risk: 50.0 units | R:R Ratio: 2.25
*   **Strategy 3 (Asia 02:30 SAFE):** Active | Reference Hour 2:30 | Risk: 50.0 units | R:R Ratio: 2.25
*   **Strategy 4 (NY 13:35 AGGRESSIVE):** Active | Reference Hour 13:35 | Risk: 50.0 units | R:R Ratio: 2.70
*   **Prop Firm Safety Parameters:** Active | Balance Base: $5,000 | Max Total Drawdown Limit: 10%

---

## 2. Asian Session Breakout

A classic session momentum strategy built to exploit price expansions that occur when the European/London sessions open after the lower-volatility Asian trading range.

### Execution Logic
*   **Session Mapping:** The EA identifies the absolute High and Low price levels established during the Asian trading session (00:00 to 07:59 GMT).
*   **Order Execution:** At the London open (08:00 GMT), the EA places pending orders at the boundaries. If price breaks out of the range, the momentum triggers an entry.
*   **Spread Control:** The system actively filters out entries if the current broker spread exceeds a specific fraction of the Stop Loss distance, preventing execution during high-spread slippage events.

### Active Configuration Set
*   **Asian Session Window:** Start 00:00 | End 07:59 (GMT+0)
*   **Trading Window Open:** 08:00 GMT (No new orders allowed after 21:00 GMT)
*   **Risk per Trade:** $50 fixed risk
*   **Risk-to-Reward (TP):** 2.0 (Take Profit = 2.0 * SL distance)
*   **Max Spread Ratio:** 0.5 (Spread must be less than 50% of the SL distance)

---

## 3. Volatility Exhaustion (Mean Reversion)

A mean-reversion strategy designed to trade counter-trend reversals at extreme statistical boundaries on intraday timeframes.

### Execution Logic
*   **Volatility Baseline:** The system calculates the median price range over a rolling lookback window of 48 candles.
*   **Stretch Trigger:** If a price movement exceeds a multiplier of this median volatility baseline, the market is flagged as exhausted (overextended).
*   **Rejection Filter:** The system will not enter immediately. It waits for price rejection confirmed by the wick ratio of the candle. If the wick opposite to the momentum is long enough (representing selling/buying pressure pushing the price back), a market order is executed.
*   **Execution Cooldown:** To prevent entering multiple times during a prolonged trend, the EA enforces a cooldown period (in bars) before permitting a new trade.

### Active Configuration Set
*   **Trading Timeframe:** 5 Minutes
*   **Median Lookback Window:** 48 bars
*   **Expansion Multiplier:** 3.5x baseline
*   **Min Wick Ratio:** 0.5 (The candle wick must comprise at least 50% of the total high-low range)
*   **Stop Loss:** ATR-based (ATR Period 14 | ATR Multiplier 2.0)
*   **Take Profit:** 2.5x SL distance
*   **Risk per Trade:** $10 fixed risk
*   **Max Spread/SL Ratio:** 0.2 (Max spread must not exceed 20% of the SL distance)
*   **Cooldown:** 4 bars after a trade closes

---

## 4. Zero Wick ATR Momentum

A high-frequency trend-following momentum strategy operating on 1-minute chart resolutions based on high-timeframe average true ranges.

### Execution Logic
*   **Base Anchor:** The EA calculates a 14-period Average True Range (ATR) on a larger 20-minute base timeframe.
*   **Momentum Threshold:** The system monitors the 1-minute close price. If the M1 close moves a full ATR distance away from the opening price of the current 20-minute candle, it confirms a strong momentum breakout and enters a market trade in that direction.
*   **Risk Structure:** Enforces strict percentage-based risk sizing and ATR-derived stop distances.

### Active Configuration Set
*   **Base Timeframe:** 20 Minutes
*   **ATR Period (HTF):** 14
*   **Breakout Trigger:** 1.0 * ATR distance from Base Open
*   **Risk per Trade:** 0.5% of account balance
*   **Stop Loss:** 2.0 * ATR
*   **Take Profit:** 1.5x SL distance
