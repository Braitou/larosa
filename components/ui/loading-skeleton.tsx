"use client";

import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "default" | "dashboard" | "card";
}

export function LoadingSkeleton({ className, variant = "default" }: LoadingSkeletonProps) {
  if (variant === "dashboard") {
    return (
      <div className={cn("flex flex-col items-center justify-center min-h-[400px] gap-6", className)}>
        {/* Pneu qui tourne */}
        <div className="relative">
          <svg
            className="w-24 h-24 animate-spin"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Cercle extérieur (pneu) */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              className="text-blue-primary"
              fill="none"
            />
            
            {/* Cercle intérieur (jante) */}
            <circle
              cx="50"
              cy="50"
              r="25"
              stroke="currentColor"
              strokeWidth="4"
              className="text-blue-secondary"
              fill="none"
            />
            
            {/* Rayons de la jante */}
            <line x1="50" y1="25" x2="50" y2="75" stroke="currentColor" strokeWidth="3" className="text-blue-primary" />
            <line x1="25" y1="50" x2="75" y2="50" stroke="currentColor" strokeWidth="3" className="text-blue-primary" />
            <line x1="32" y1="32" x2="68" y2="68" stroke="currentColor" strokeWidth="3" className="text-blue-primary" />
            <line x1="68" y1="32" x2="32" y2="68" stroke="currentColor" strokeWidth="3" className="text-blue-primary" />
            
            {/* Motifs du pneu */}
            <circle cx="50" cy="5" r="3" fill="currentColor" className="text-blue-primary" />
            <circle cx="95" cy="50" r="3" fill="currentColor" className="text-blue-primary" />
            <circle cx="50" cy="95" r="3" fill="currentColor" className="text-blue-primary" />
            <circle cx="5" cy="50" r="3" fill="currentColor" className="text-blue-primary" />
          </svg>
        </div>

        {/* Texte de chargement */}
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-blue-primary">
            Chargement en cours...
          </p>
          <div className="flex gap-1 justify-center">
            <span className="w-2 h-2 bg-blue-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 bg-blue-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 bg-blue-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("space-y-3 p-4", className)}>
        <div className="flex items-center gap-3">
          {/* Mini pneu qui tourne */}
          <div className="flex-shrink-0">
            <svg
              className="w-8 h-8 animate-spin"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" className="text-blue-primary/20" fill="none" />
              <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="4" className="text-blue-primary/40" fill="none" />
              <line x1="50" y1="25" x2="50" y2="75" stroke="currentColor" strokeWidth="3" className="text-blue-primary" />
              <line x1="25" y1="50" x2="75" y2="50" stroke="currentColor" strokeWidth="3" className="text-blue-primary" />
            </svg>
          </div>
          {/* Lignes de skeleton */}
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("animate-pulse space-y-3", className)}>
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  );
}

