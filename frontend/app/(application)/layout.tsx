"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Stepper } from "@/components/auth/ui/Stepper"

interface FormLayoutProps {
  children: React.ReactNode
}

export default function FormLayout({ children }: FormLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-10">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Application Form</h1>
          <p className="mt-2 text-muted-foreground">Complete all steps to submit your application</p>
        </motion.div>

        <Stepper />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 overflow-hidden rounded-lg border bg-card shadow-sm"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}

