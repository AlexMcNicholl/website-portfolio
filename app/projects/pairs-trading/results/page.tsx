"use client"; // Ensure this is a Client Component

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading results...</div>}>
      <ResultsContent />
    </Suspense>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const stock1 = searchParams.get("stock1");
  const stock2 = searchParams.get("stock2");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Trading Results</h1>
      <p>Analyzing {stock1} and {stock2}</p>
      {/* Display results here */}
    </div>
  );
}
