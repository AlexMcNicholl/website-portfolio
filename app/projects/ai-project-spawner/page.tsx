"use client";

import { useState } from "react";
import Link from "next/link";

export default function AIProjectSpawnerPage() {
  const [userIdea, setUserIdea] = useState("");
  const [projectDetails, setProjectDetails] = useState<{ title: string; description: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitIdea = async () => {
    if (userIdea.trim() === "") return;

    setIsLoading(true);
    setProjectDetails(null);

    try {
      const response = await fetch("/api/evaluate-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: userIdea }),
      });

      const data = await response.json();

      if (data.success) {
        setProjectDetails({ title: data.title, description: data.description });
      } else {
        alert(`Warning: ${data.message}`);
      }
    } catch (error) {
      console.error("Error evaluating idea:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
      setUserIdea(""); // Clear the input field
    }
  };

  const handleBuildProject = async () => {
    if (!projectDetails) return;

    try {
      const response = await fetch("/api/build-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scaffold: projectDetails.description }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Project is being built! Check your GitHub repository.");
      } else {
        alert(`Failed to build project: ${data.message}`);
      }
    } catch (error) {
      console.error("Error building project:", error);
      alert("An error occurred while building the project. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">AI Project Spawner</h1>
        <p className="text-lg text-muted-foreground mb-4">
          The AI Project Spawner is an autonomous agent designed to generate new and unique tech projects across various domains. It leverages AI to brainstorm ideas, scaffold code, and even deploy projects.
        </p>

        {/* User Input Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Submit Your Own Idea</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={userIdea}
              onChange={(e) => setUserIdea(e.target.value)}
              placeholder="Enter your project idea"
              className="flex-1 px-4 py-2 border rounded"
            />
            <button
              onClick={handleSubmitIdea}
              className="px-6 py-2 bg-primary text-white rounded hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Submit Idea"}
            </button>
          </div>
        </div>

        {/* Display AI Response */}
        {projectDetails && (
          <div className="mt-8 p-4 bg-gray-800 text-white rounded">
            <h2 className="text-2xl font-bold mb-2">{projectDetails.title}</h2>
            <p>{projectDetails.description}</p>

            {/* Build Project Button */}
            <button
              onClick={handleBuildProject}
              className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Build Project
            </button>
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/projects"
            className="inline-block px-6 py-3 bg-primary text-white rounded hover:bg-primary/90"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    </main>
  );
}
