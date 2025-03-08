"use client"

import { useSelector } from "react-redux"
// import type { RootState } from "@/lib/store"
import { motion } from "framer-motion"
import { Check, User, GraduationCap, Briefcase, FileCheck, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, name: "Personal Info", icon: User },
  { id: 2, name: "Education", icon: GraduationCap },
  { id: 3, name: "Experience", icon: Briefcase },
  { id: 4, name: "Terms", icon: FileCheck },
  { id: 5, name: "Complete", icon: CheckCircle },
]

export function Stepper() {
  const currentStep = useSelector((state: RootState) => state.form.currentStep)

  return (
    <div className="w-full py-6 sm:py-8 md:py-10">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-center space-x-2 sm:space-x-4 md:space-x-8">
          {steps.map((step) => (
            <li key={step.id} className="relative">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2",
                    step.id < currentStep
                      ? "border-primary bg-primary text-primary-foreground"
                      : step.id === currentStep
                        ? "border-primary text-primary"
                        : "border-muted-foreground/30 text-muted-foreground/50",
                  )}
                >
                  {step.id < currentStep ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                </motion.div>
                <motion.span
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className={cn(
                    "mt-2 text-xs font-medium",
                    step.id <= currentStep ? "text-foreground" : "text-muted-foreground/50",
                  )}
                >
                  {step.name}
                </motion.span>
              </div>
              {step.id < steps.length && (
                <div className="absolute left-full top-5 hidden -translate-y-1/2 translate-x-1/2 transform md:block">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5 }}
                    className={cn("h-0.5 w-8 md:w-16", step.id < currentStep ? "bg-primary" : "bg-muted-foreground/30")}
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}

