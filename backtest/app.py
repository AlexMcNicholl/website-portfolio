import streamlit as st
import backtrader as bt
import yfinance as yf
import pandas as pd
import matplotlib.pyplot as plt

# Page Config
st.set_page_config(page_title="AlphaTrade Research Lab", layout="wide")

st.title("🧪 AlphaTrade Research Lab")
st.markdown("### Interactive Strategy Backtester")

# Sidebar - Configuration
st.sidebar.header("Strategy Parameters")
ticker = st.sidebar.text_input("Ticker Symbol", "SPY")
start_date = st.sidebar.date_input("Start Date", pd.to_datetime("2023-01-01"))
end_date = st.sidebar.date_input("End Date", pd.to_datetime("2024-01-01"))
cash = st.sidebar.number_input("Initial Cash", 10000, 1000000, 10000)

# Strategy Selection
strategy_name = st.sidebar.selectbox("Strategy", ["SMA Crossover", "Iron Condor (Mock)"])

# Strategy Parameters
fast_ma = 10
slow_ma = 30
if strategy_name == "SMA Crossover":
    fast_ma = st.sidebar.slider("Fast MA Period", 5, 50, 10)
    slow_ma = st.sidebar.slider("Slow MA Period", 20, 200, 30)

# Run Button
if st.sidebar.button("Run Backtest"):
    with st.spinner("Downloading Data & Simulating..."):
        # 1. Data Loading
        try:
            df = yf.download(ticker, start=start_date, end=end_date, progress=False)
            if isinstance(df.columns, pd.MultiIndex):
                df.columns = df.columns.get_level_values(0)
            df = df[['Open', 'High', 'Low', 'Close', 'Volume']]
            df['OpenInterest'] = 0
            
            data = bt.feeds.PandasData(dataname=df)
        except Exception as e:
            st.error(f"Error loading data: {e}")
            st.stop()

        # 2. Setup Cerebro
        cerebro = bt.Cerebro()
        cerebro.adddata(data)
        cerebro.broker.setcash(cash)
        cerebro.broker.setcommission(commission=0.001)

        # 3. Add Strategy
        class SmaCross(bt.Strategy):
            params = (('pfast', fast_ma), ('pslow', slow_ma),)
            def __init__(self):
                self.dataclose = self.datas[0].close
                self.sma1 = bt.ind.SMA(period=self.params.pfast)
                self.sma2 = bt.ind.SMA(period=self.params.pslow)
                self.crossover = bt.ind.CrossOver(self.sma1, self.sma2)
            def next(self):
                if not self.position:
                    if self.crossover > 0: self.buy()
                elif self.crossover < 0: self.close()

        cerebro.addstrategy(SmaCross)

        # 4. Run
        initial_value = cerebro.broker.getvalue()
        cerebro.run()
        final_value = cerebro.broker.getvalue()
        pnl = final_value - initial_value
        ret = (pnl / initial_value) * 100

        # 5. Display Results
        col1, col2, col3 = st.columns(3)
        col1.metric("Final Portfolio Value", f"${final_value:,.2f}")
        col2.metric("Total PnL", f"${pnl:,.2f}", f"{ret:.2f}%")
        col3.metric("Trades", "N/A (Coming Soon)")

        st.success("Backtest Complete!")
        
        # Simple Price Chart for now (Backtrader plot is hard to embed in Streamlit without saving to image)
        st.subheader("Price History")
        st.line_chart(df['Close'])

else:
    st.info("Adjust parameters and click 'Run Backtest' to start.")
