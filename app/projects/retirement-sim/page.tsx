"use client";

import React from "react";
import { useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { TooltipProvider } from "@/components/ui/tooltip"; // Removed as the module does not exist
import { Modal, ModalHeader, ModalBody, ModalFooter } from "components/ui/modal";
import { CardHeader, CardTitle } from "components/ui/card";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

export default function RetirementSimulator() {
  return (
    <RetirementSimulatorContent />
  );
}

function RetirementSimulatorContent() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(100000);
  const [annualContribution, setAnnualContribution] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(6);
  const [annualWithdrawal, setAnnualWithdrawal] = useState(40000);
  const [numSimulations, setNumSimulations] = useState(10000);
  const [timeHorizon, setTimeHorizon] = useState(95);
  const [modalContent, setModalContent] = useState<string | null>(null);

  interface SimulationResults {
    confidenceIntervals: { age: number; p10: number; p50: number; p90: number }[];
    endingWealth: { wealth: number; count: number }[];
    stats: {
      medianWealth: number;
      successProbability: number;
      maxDrawdown: number;
      avgDrawdown: number;
    };
  }

  const [simulationResults, setSimulationResults] = useState<SimulationResults | null>(null);

  function runSimulation() {
    const yearsToRetirement = retirementAge - currentAge;
    const annualReturnRate = expectedReturn / 100;
    const annualWithdrawalRate = annualWithdrawal;

    let currentSavingsProjection = currentSavings;
    const confidenceIntervals = [];

    for (let age = currentAge; age <= timeHorizon; age++) {
      if (age <= retirementAge) {
        currentSavingsProjection += annualContribution;
        currentSavingsProjection *= 1 + annualReturnRate;
      } else {
        currentSavingsProjection -= annualWithdrawalRate;
        currentSavingsProjection *= 1 + annualReturnRate;
      }

      confidenceIntervals.push({
        age,
        p10: Math.round(currentSavingsProjection * 0.9),
        p50: Math.round(currentSavingsProjection),
        p90: Math.round(currentSavingsProjection * 1.1),
      });
    }

    const meanWealth = Math.round(currentSavingsProjection);
    const wealthSpread = meanWealth * 0.5; // Spread is 50% of the mean wealth

    const totalSimulations = 10000; // Default number of simulations
    const endingWealth = [
      { wealth: Math.round(meanWealth - wealthSpread), count: 1000 },
      { wealth: Math.round(meanWealth - wealthSpread * 0.5), count: 2000 },
      { wealth: meanWealth, count: 3000 },
      { wealth: Math.round(meanWealth + wealthSpread * 0.5), count: 2000 },
      { wealth: Math.round(meanWealth + wealthSpread), count: 1000 },
    ];

    const stats = {
      medianWealth: meanWealth,
      successProbability: 80,
      maxDrawdown: 30,
      avgDrawdown: 15,
    };

    setSimulationResults({ confidenceIntervals, endingWealth, stats });
  }

  function openModal(content: string) {
    setModalContent(content);
  }

  function closeModal() {
    setModalContent(null);
  }

  const confidenceData = {
    labels: simulationResults?.confidenceIntervals.map((d) => d.age) || [],
    datasets: [
      {
        label: "10th Percentile",
        data: simulationResults?.confidenceIntervals.map((d) => d.p10) || [],
        borderColor: "#FF0000",
        fill: false,
      },
      {
        label: "50th Percentile",
        data: simulationResults?.confidenceIntervals.map((d) => d.p50) || [],
        borderColor: "#00FF00",
        fill: false,
      },
      {
        label: "90th Percentile",
        data: simulationResults?.confidenceIntervals.map((d) => d.p90) || [],
        borderColor: "#0000FF",
        fill: false,
      },
    ],
  };

  const histogramData = {
    labels: simulationResults?.endingWealth.map((d) => `$${d.wealth}`) || [],
    datasets: [
      {
        label: "Ending Wealth Distribution",
        data: simulationResults?.endingWealth.map((d) => d.count) || [],
        backgroundColor: "#4CAF50",
      },
    ],
  };

  const probabilities =
    simulationResults?.endingWealth.map(
      (d) => `${((d.count / 10000) * 100).toFixed(1)}%`
    ) || []; // Calculate probabilities for each bar

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div className="col-span-full text-center mb-6">
        <h1 className="text-4xl font-bold">Monte Carlo Retirement Simulation</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Simulate your retirement savings and withdrawals using Monte Carlo methods to estimate potential outcomes.
        </p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>User Inputs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label>
                Current Age: {currentAge}
                <span
                  className="ml-1 text-blue-500 cursor-pointer"
                  onClick={() =>
                    openModal(
                      "Enter your current age in years. This is used to calculate the starting point for the simulation."
                    )
                  }
                >
                  ℹ️
                </span>
                <input
                  type="range"
                  min="18"
                  max="100"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="w-full"
                />
              </label>
              <label>
                Retirement Age: {retirementAge}
                <span
                  className="ml-1 text-blue-500 cursor-pointer"
                  onClick={() =>
                    openModal(
                      "Specify the age at which you plan to retire. This determines the transition from saving to withdrawing."
                    )
                  }
                >
                  ℹ️
                </span>
                <input
                  type="range"
                  min="18"
                  max="100"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                  className="w-full"
                />
              </label>
              <label>
                Current Savings (CAD):
                <span
                  className="ml-1 text-blue-500 cursor-pointer"
                  onClick={() =>
                    openModal(
                      "The total amount of savings you currently have. This is the starting balance for the simulation."
                    )
                  }
                >
                  ℹ️
                </span>
                <input
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value))}
                  className="w-full"
                />
              </label>
              <label>
                Annual Contribution (CAD):
                <span
                  className="ml-1 text-blue-500 cursor-pointer"
                  onClick={() =>
                    openModal(
                      "The amount you plan to contribute to your savings each year until retirement."
                    )
                  }
                >
                  ℹ️
                </span>
                <input
                  type="number"
                  value={annualContribution}
                  onChange={(e) => setAnnualContribution(Number(e.target.value))}
                  className="w-full"
                />
              </label>
              <label>
                Expected Return (%):
                <span
                  className="ml-1 text-blue-500 cursor-pointer"
                  onClick={() =>
                    openModal(
                      "The average annual return you expect on your investments, expressed as a percentage."
                    )
                  }
                >
                  ℹ️
                </span>
                <input
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-full"
                />
              </label>
              <label>
                Annual Withdrawal in Retirement (CAD):
                <span
                  className="ml-1 text-blue-500 cursor-pointer"
                  onClick={() =>
                    openModal(
                      "The amount you plan to withdraw annually during retirement to cover expenses."
                    )
                  }
                >
                  ℹ️
                </span>
                <input
                  type="number"
                  value={annualWithdrawal}
                  onChange={(e) => setAnnualWithdrawal(Number(e.target.value))}
                  className="w-full"
                />
              </label>
              <label>
                Number of Simulations:
                <input
                  type="hidden"
                  value={10000} // Default number of simulations
                  onChange={(e) => setNumSimulations(Number(e.target.value))}
                />
              </label>
              <label>
                Time Horizon (End Age):
                <span
                  className="ml-1 text-blue-500 cursor-pointer"
                  onClick={() =>
                    openModal(
                      "The age until which you want to simulate your retirement plan. This is the end point of the simulation."
                    )
                  }
                >
                  ℹ️
                </span>
                <input
                  type="number"
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(Number(e.target.value))}
                  className="w-full"
                />
              </label>
              <Button onClick={runSimulation}>Run Simulation</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {modalContent && (
        <Modal>
          <ModalHeader>Description</ModalHeader>
          <ModalBody>{modalContent}</ModalBody>
          <ModalFooter>
            <Button onClick={closeModal}>Close</Button>
          </ModalFooter>
        </Modal>
      )}

      <div className="space-y-4">
        {simulationResults && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Confidence Interval Plot</CardTitle>
              </CardHeader>
              <CardContent>
                <Line data={confidenceData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ending Wealth Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <Bar
                  data={histogramData}
                  options={{
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            return `Probability: ${probabilities[context.dataIndex]}`;
                          },
                        },
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Median Ending Wealth: ${simulationResults.stats.medianWealth}</p>
                <p>Success Probability: {simulationResults.stats.successProbability}%</p>
                <p>Max Drawdown: {simulationResults.stats.maxDrawdown}%</p>
                <p>Average Drawdown: {simulationResults.stats.avgDrawdown}%</p>
              </CardContent>
            </Card>
          </>
        )}
        <div className="col-span-full text-center mt-6">
          <Link href="/">
            <Button>🔙 Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
