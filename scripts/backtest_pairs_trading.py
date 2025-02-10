import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import yfinance as yf
from backtesting import Backtest, Strategy

class PairsTradingStrategy(Strategy):
    entry_threshold = 1.5
    exit_threshold = 0.5

    def init(self):
        self.zscore = self.I(lambda x: (x - x.mean()) / x.std(), self.data.Close)

    def next(self):
        if self.zscore[-1] < -self.entry_threshold:
            self.buy()
        elif self.zscore[-1] > self.entry_threshold:
            self.sell()
        elif abs(self.zscore[-1]) < self.exit_threshold:
            self.position.close()

def fetch_data(stock1, stock2):
    df1 = yf.download(stock1, period="5y", interval="1d")['Adj Close']
    df2 = yf.download(stock2, period="5y", interval="1d")['Adj Close']
    return pd.DataFrame({stock1: df1, stock2: df2}).dropna()

def main(stock1, stock2):
    df = fetch_data(stock1, stock2)
    df['spread'] = df[stock1] - df[stock2]

    backtest = Backtest(df, PairsTradingStrategy, cash=100000, commission=0.001)
    results = backtest.run()
    backtest.plot()

    print(results)

if __name__ == "__main__":
    main("AAPL", "MSFT")
