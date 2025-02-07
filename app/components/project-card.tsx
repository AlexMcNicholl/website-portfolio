import { Card, CardContent, CardFooter } from "./ui/card";
import { Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
}

export default function ProjectCard({ title, description, image, link, tags }: ProjectCardProps) {
  // If it's the "Pairs Trading" project, override the link to an internal Next.js route
  const isPairsTrading = title === "Pairs Trading";
  const projectLink = isPairsTrading ? "/projects/pairs-trading" : link;

  return (
    <Card className="overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <Link href={projectLink} className="block">
        <div className="relative aspect-video">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <h3 className="font-semibold text-xl mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10 transition-all duration-300 hover:bg-blue-500 hover:text-white"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {isPairsTrading ? (
          <Link href="/projects/pairs-trading" className="inline-flex items-center gap-2 text-sm hover:underline">
            📄 View Project Details
          </Link>
        ) : (
          <Link href={link} target="_blank" className="inline-flex items-center gap-2 text-sm hover:underline">
            <Github className="h-4 w-4 transition-all duration-300 hover:text-blue-400" />
            View on GitHub
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
