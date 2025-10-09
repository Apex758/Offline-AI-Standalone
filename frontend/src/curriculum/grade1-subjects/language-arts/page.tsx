"use client"

import type React from "react"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Ear, Pencil, ChevronLeft, ChevronRight, Star, Heart, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"

// Floating animation component
function FloatingElement({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div
      className="animate-bounce"
      style={{
        animationDelay: `${delay}s`,
        animationDuration: "3s",
        animationIterationCount: "infinite",
      }}
    >
      {children}
    </div>
  )
}

// Interactive alphabet component
function InteractiveAlphabet() {
  const [activeLetters, setActiveLetters] = useState<number[]>([])
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * letters.length)
      setActiveLetters((prev) => [...prev.slice(-5), randomIndex])
    }, 500)

    return () => clearInterval(interval)
  }, [letters.length])

  return (
    <div className="flex flex-wrap justify-center gap-1 sm:gap-2 lg:gap-2 xl:gap-3 p-3 sm:p-6 lg:p-6 xl:p-8 bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-100 rounded-xl sm:rounded-2xl lg:rounded-2xl">
      {letters.map((letter, index) => (
        <div
          key={index}
          className={`w-8 h-8 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-full flex items-center justify-center text-sm sm:text-xl lg:text-xl xl:text-2xl font-bold cursor-pointer transition-all duration-300 ${
            activeLetters.includes(index)
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110 sm:scale-125 lg:scale-130 shadow-lg"
              : "bg-white text-purple-600 hover:bg-purple-100 hover:scale-105 sm:hover:scale-110 lg:hover:scale-115"
          }`}
          onClick={() => setActiveLetters((prev) => [...prev, index])}
        >
          {letter}
        </div>
      ))}
    </div>
  )
}

// Animated progress bar
function ProgressBar({ progress, color }: { progress: number; color: string }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out rounded-full`}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default function Grade1LanguageArtsPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const strands = [
    {
      id: 1,
      title: "Listening and Speaking",
      icon: Ear,
      description: "Foundational for all learning and communication",
      content:
        "The strategies and skills of listening and speaking allow learners to contribute meaningfully to social environments. As learners receive, reflect on, and communicate ideas, they develop increasing proficiency in cognitive organization, critical thinking, and problem-solving.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-500",
      textColor: "text-purple-700",
      progress: 85,
      progressColor: "from-purple-400 to-purple-600",
      link: "/curriculum/grade1-subjects/language-arts/listening-speaking",
    },
    {
      id: 2,
      title: "Reading and Viewing",
      icon: BookOpen,
      description: "Meaning-making and problem solving activities",
      content:
        "Reading and viewing provide opportunities to interact with a wide range of written and visual text for a variety of purposes. Readers learn to integrate strategies and skills as they develop thoughtful and critical understanding of text.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      textColor: "text-blue-700",
      progress: 78,
      progressColor: "from-blue-400 to-blue-600",
      link: "/curriculum/grade1-subjects/language-arts/reading-viewing",
    },
    {
      id: 3,
      title: "Writing and Representing",
      icon: Pencil,
      description: "Communication through various formats",
      content:
        "Writing and Representing strategies and skills provide opportunities for learners to communicate with their peers and other meaningful audiences using paper and digital formats. The process includes planning, organizing, revising, refining, and sharing feedback.",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-500",
      textColor: "text-pink-700",
      progress: 92,
      progressColor: "from-pink-400 to-pink-600",
      link: "/curriculum/grade1-subjects/language-arts/writing-representing",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50">
      {/* Floating decorative elements - hidden on mobile for performance */}
      <div className="hidden sm:block fixed inset-0 pointer-events-none overflow-hidden">
        <FloatingElement delay={0}>
          <Star className="absolute top-20 left-10 text-yellow-400 w-4 h-4 sm:w-6 sm:h-6" />
        </FloatingElement>
        <FloatingElement delay={1}>
          <Heart className="absolute top-40 right-20 text-pink-400 w-6 h-6 sm:w-8 sm:h-8" />
        </FloatingElement>
        <FloatingElement delay={2}>
          <Sparkles className="absolute bottom-40 left-20 text-purple-400 w-5 h-5 sm:w-7 sm:h-7" />
        </FloatingElement>
        <FloatingElement delay={0.5}>
          <Star className="absolute bottom-20 right-10 text-blue-400 w-4 h-4 sm:w-5 sm:h-5" />
        </FloatingElement>
      </div>

      <div className="container mx-auto px-4 lg:px-6 xl:px-8 py-4 sm:py-8 lg:py-10 xl:py-12 relative z-10 max-w-7xl">
        <Link href="/curriculum/grade1-subjects">
          <Button
            variant="outline"
            className="mb-4 sm:mb-6 hover:scale-105 transition-transform bg-transparent text-sm sm:text-base"
          >
            <ChevronLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Back to Grade 1 Subjects
          </Button>
        </Link>

        {/* Hero Section */}
        <div className="relative mb-8 sm:mb-12 lg:mb-16">
          <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 p-4 sm:p-8 lg:p-10 xl:p-12 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 xl:p-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-6 lg:mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 animate-pulse">
                🌟 Grade 1 Language Arts 🌟
              </h1>
              <p className="text-sm sm:text-lg md:text-xl lg:text-xl xl:text-2xl text-gray-700 text-center max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto leading-relaxed">
                Language is the foundation of communication and the primary instrument of thought. Join us on an
                exciting journey of discovery through speaking, reading, and writing! 📚✨
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Strands Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-6 xl:gap-8 mb-8 sm:mb-12 lg:mb-12">
          {strands.map((strand, index) => {
            const IconComponent = strand.icon
            return (
              <Card
                key={strand.id}
                className={`relative overflow-hidden hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 border-t-4 sm:border-t-8 ${strand.borderColor} transform hover:-translate-y-1 sm:hover:-translate-y-2 sm:hover:rotate-1 cursor-pointer group h-full flex flex-col`}
                onMouseEnter={() => setHoveredCard(strand.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Animated background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${strand.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                <CardHeader className={`pb-3 sm:pb-4 lg:pb-6 ${strand.bgColor} rounded-t-lg relative`}>
                  <div className="flex items-center justify-between">
                    <CardTitle
                      className={`flex items-center gap-2 sm:gap-3 lg:gap-3 ${strand.textColor} text-lg sm:text-xl lg:text-xl`}
                    >
                      <div
                        className={`p-1.5 sm:p-2 lg:p-2 rounded-full bg-gradient-to-r ${strand.color} text-white shadow-lg`}
                      >
                        <IconComponent className="h-4 w-4 sm:h-6 sm:w-6 lg:h-6 lg:w-6" />
                      </div>
                      <span className="text-sm sm:text-lg md:text-xl lg:text-2xl">{strand.title}</span>
                    </CardTitle>
                    {hoveredCard === strand.id && (
                      <div className="animate-spin hidden sm:block">
                        <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-yellow-500" />
                      </div>
                    )}
                  </div>
                  <CardDescription className="text-sm sm:text-base lg:text-base font-medium mt-2 lg:mt-2">
                    {strand.description}
                  </CardDescription>

                  {/* Progress indicator */}
                  <div className="mt-2 sm:mt-3 lg:mt-4">
                    <div className="flex justify-between text-xs sm:text-sm lg:text-base mb-1 lg:mb-2">
                      <span>Learning Progress</span>
                      <span>{strand.progress}%</span>
                    </div>
                    <ProgressBar progress={strand.progress} color={strand.progressColor} />
                  </div>
                </CardHeader>

                <CardContent className="flex-grow p-4 sm:p-6 lg:p-6 flex flex-col">
                  <p className="mb-4 sm:mb-6 lg:mb-6 text-gray-700 leading-relaxed text-sm sm:text-base lg:text-base flex-grow">
                    {strand.content}
                  </p>

                  {/* Fun facts or tips */}
                  <div className="bg-yellow-100 p-3 sm:p-4 lg:p-4 rounded-lg mb-3 sm:mb-4 lg:mb-4 border-l-4 border-yellow-400">
                    <p className="text-xs sm:text-sm lg:text-sm text-yellow-800 font-medium">
                      💡 Fun Tip:{" "}
                      {strand.id === 1
                        ? "Practice listening games with friends!"
                        : strand.id === 2
                          ? "Read colourful picture books every day!"
                          : "Draw pictures to tell your stories!"}
                    </p>
                  </div>

                  <Link href={strand.link}>
                    <Button
                      className={`w-full bg-gradient-to-r ${strand.color} hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm sm:text-lg lg:text-base py-2 sm:py-3 lg:py-3`}
                    >
                      Explore This Strand! 🚀
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Interactive Alphabet Section */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold mb-4 sm:mb-6 lg:mb-6 text-center text-purple-700 flex items-center justify-center gap-1 sm:gap-2 lg:gap-2">
            <span>🔤</span> Interactive Alphabet Fun! <span>🔤</span>
          </h2>
          <div className="max-w-7xl mx-auto">
            <InteractiveAlphabet />
          </div>
          <p className="text-center mt-3 sm:mt-4 lg:mt-4 text-gray-600 text-sm sm:text-base lg:text-base">
            Click on letters to make them glow! ✨
          </p>
        </div>

        {/* About Section with Enhanced Design */}
        <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4 sm:p-6 md:p-8 lg:p-8 xl:p-10 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-indigo-200 sm:border-2 mb-8 sm:mb-12 lg:mb-12 relative overflow-hidden max-w-6xl mx-auto">
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 lg:top-6 lg:right-6">
            <div className="flex space-x-1 sm:space-x-2 lg:space-x-3">
              <div className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-red-400 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-yellow-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-green-400 rounded-full animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold mb-4 sm:mb-6 lg:mb-6 text-indigo-700">
            About Our Amazing Curriculum!
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-12">
            <div className="lg:col-span-1 xl:col-span-2">
              <p className="mb-3 sm:mb-4 lg:mb-4 text-gray-700 text-sm sm:text-lg lg:text-base xl:text-lg leading-relaxed">
                This curriculum is designed to develop students' language skills through an integrated approach. The
                three strands work together like best friends! 👫
              </p>
              <p className="text-gray-700 text-sm sm:text-lg lg:text-base xl:text-lg leading-relaxed">
                Each strand includes fun activities, learning goals, and exciting ways to practice your new skills! 🎯
              </p>
            </div>

            <div className="bg-white/70 p-4 sm:p-6 lg:p-6 xl:p-7 rounded-xl sm:rounded-2xl lg:col-span-1">
              <h3 className="font-bold text-base sm:text-lg lg:text-lg xl:text-xl mb-2 sm:mb-3 lg:mb-3 text-purple-700">
                What You'll Learn:
              </h3>
              <ul className="space-y-1 sm:space-y-2 lg:space-y-3">
                <li className="flex items-center gap-2 lg:gap-2 text-sm sm:text-base lg:text-base xl:text-lg">
                  <span className="text-green-500 text-lg lg:text-lg">✓</span>
                  <span>How to be a great listener</span>
                </li>
                <li className="flex items-center gap-2 lg:gap-2 text-sm sm:text-base lg:text-base xl:text-lg">
                  <span className="text-green-500 text-lg lg:text-lg">✓</span>
                  <span>Reading amazing stories</span>
                </li>
                <li className="flex items-center gap-2 lg:gap-2 text-sm sm:text-base lg:text-base xl:text-lg">
                  <span className="text-green-500 text-lg lg:text-lg">✓</span>
                  <span>Writing your own adventures</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 hover:from-purple-600 hover:via-pink-600 hover:to-yellow-600 text-white px-6 sm:px-12 lg:px-14 xl:px-16 py-4 sm:py-6 lg:py-6 xl:py-7 rounded-xl sm:rounded-2xl lg:rounded-2xl shadow-xl sm:shadow-2xl hover:shadow-2xl sm:hover:shadow-3xl transform hover:scale-105 sm:hover:scale-110 transition-all duration-300 text-base sm:text-xl lg:text-xl xl:text-2xl font-bold"
            onClick={() => setShowConfetti(true)}
          >
            <Link
              href="/curriculum/grade1-subjects/activities/language-arts"
              className="flex items-center gap-2 sm:gap-3 lg:gap-4"
            >
              <span>🎮 Start Your Language Adventure!</span>
              <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6 lg:h-6 lg:w-6" />
            </Link>
          </Button>
        </div>

        {/* Decorative Footer */}
        <div className="flex justify-center">
          <div className="flex space-x-2 sm:space-x-3">
            {["🌟", "📚", "✏️", "🎨", "🌈"].map((emoji, index) => (
              <div
                key={index}
                className="text-xl sm:text-3xl animate-bounce hover:scale-110 sm:hover:scale-125 cursor-pointer transition-transform"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
