import sys
from pairs_trading_strategy import main as run_strategy
from backtest_pairs_trading import main as run_backtest

def main():
    if len(sys.argv) < 3:
        print("Error: Please provide two stock symbols.")
        return
    
    stock1 = sys.argv[1]
    stock2 = sys.argv[2]

    print(f"Running Pairs Trading Strategy for {stock1} and {stock2}...")

    # Run the strategy
    strategy_results = run_strategy(stock1, stock2)

    # Run the backtest
    backtest_results = run_backtest(stock1, stock2)

    # Print results so that Node.js can capture it
    print({"strategy_results": strategy_results, "backtest_results": backtest_results})

if __name__ == "__main__":
    main()
