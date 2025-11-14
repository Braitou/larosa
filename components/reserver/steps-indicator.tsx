"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepsIndicatorProps {
  currentStep: number;
  steps: Step[];
}

export function StepsIndicator({ currentStep, steps }: StepsIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
                  currentStep > step.number
                    ? "bg-blue-primary text-background-main"
                    : currentStep === step.number
                    ? "bg-blue-primary text-background-main"
                    : "bg-background-card text-text-secondary border-2 border-border"
                )}
              >
                {currentStep > step.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
              <div className="text-center mt-2 hidden sm:block">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    currentStep >= step.number
                      ? "text-blue-primary"
                      : "text-text-secondary"
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Line between steps */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 sm:mx-4 transition-colors",
                  currentStep > step.number
                    ? "bg-blue-primary"
                    : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}



