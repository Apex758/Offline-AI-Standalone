"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  ChevronLeft,
  Hash,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  PenTool,
  Brain,
  Share2,
  Printer,
  Download,
  Play,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion } from "@/components/ui/accordion"

export default function NumberSensePage() {
  const [resourceFilter, setResourceFilter] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render until client-side
  if (!isClient) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/curriculum/grade1-subjects/mathematics" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Mathematics
        </Link>
      </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Number Sense</h1>
          <p className="text-lg text-gray-600">
            Understanding numbers, their relationships, and how to work with them effectively.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-gray-700 mb-4">
            Number sense is the foundation of mathematical thinking. Students develop an intuitive understanding of numbers, their relationships, and how to work with them effectively.
            </p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-blue-600" />
                Counting
                </CardTitle>
              </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Learn to count accurately and understand number sequences.
              </p>
                  </CardContent>
                </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                Number Relationships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Explore how numbers relate to each other and patterns.
              </p>
                  </CardContent>
                </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Mental Math
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Develop mental calculation strategies and number fluency.
              </p>
                  </CardContent>
                </Card>
        </div>
      </div>
    </div>
  )
}
