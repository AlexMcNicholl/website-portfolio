import backtrader as bt
import yfinance as yf
import pandas as pd
import datetime

# Define a simple strategy
class SmaCross(bt.Strategy):
    params = (('pfast', 10), ('pslow', 30),)

    def __init__(self):
        self.dataclose = self.datas[0].close
        self.sma1 = bt.ind.SMA(period=self.params.pfast)
        self.sma2 = bt.ind.SMA(period=self.params.pslow)
        self.crossover = bt.ind.CrossOver(self.sma1, self.sma2)

    def next(self):
        if not self.position:
            if self.crossover > 0:
                self.buy()
        elif self.crossover < 0:
            self.close()

if __name__ == '__main__':
    cerebro = bt.Cerebro()
    cerebro.addstrategy(SmaCross)

    # Download Data
    print("Downloading data for SPY...")
    df = yf.download('SPY', start='2023-01-01', end='2024-01-01', progress=False)
    
    # Fix for yfinance returning MultiIndex columns
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)
    
    # Ensure columns are what Backtrader expects
    df = df[['Open', 'High', 'Low', 'Close', 'Volume']]
    df['OpenInterest'] = 0
    
    print("Data Head:")
    print(df.head())

    data = bt.feeds.PandasData(dataname=df)

    cerebro.adddata(data)
    cerebro.broker.setcash(10000.0)
    cerebro.broker.setcommission(commission=0.001)

    print('Starting Portfolio Value: %.2f' % cerebro.broker.getvalue())
    cerebro.run()
    print('Final Portfolio Value: %.2f' % cerebro.broker.getvalue())
