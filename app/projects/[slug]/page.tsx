"use client"; // This makes it a Client Component

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import projectsData from "@/data/projects"; // Import the projects data

export default function ProjectPage() {
  const router = useRouter();
  const slug = router.query?.slug as string; // Get the project slug from the URL

  const project = projectsData.find((p) => p.slug === slug);

  if (!project) {
    return <div className="text-center text-red-500 text-xl font-semibold">Project not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
      <Image src={project.image} alt={project.title} width={800} height={450} className="rounded-lg mb-6" />

      <p className="max-w-2xl text-lg text-center text-gray-400">{project.description}</p>

      <div className="mt-6">
        <Link href={project.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-lg">
          🔗 View on GitHub
        </Link>
      </div>

      <div className="mt-6">
        <Link href="/" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all">
          ⬅ Back to Home
        </Link>
      </div>
    </div>
  );
}
