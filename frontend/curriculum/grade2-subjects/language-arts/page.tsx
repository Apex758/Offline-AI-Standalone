"use client"

import type React from "react"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Ear,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  Sparkles,
  Target,
  Lightbulb,
} from "lucide-react"
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

// Interactive word building component for Grade 2
function InteractiveWordBuilder() {
  const [activeWords, setActiveWords] = useState<number[]>([])
  const words = ["READ", "WRITE", "SPEAK", "LISTEN", "THINK", "LEARN", "SHARE", "CREATE"]

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * words.length)
      setActiveWords((prev) => [...prev.slice(-3), randomIndex])
    }, 800)

    return () => clearInterval(interval)
  }, [words.length])

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-2 xl:gap-3 p-3 sm:p-6 lg:p-6 xl:p-8 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-xl sm:rounded-2xl lg:rounded-2xl">
      {words.map((word, index) => (
        <div
          key={index}
          className={`px-3 py-2 sm:px-4 sm:py-3 lg:px-4 lg:py-3 xl:px-5 xl:py-3 rounded-full flex items-center justify-center text-xs sm:text-base lg:text-base xl:text-lg font-bold cursor-pointer transition-all duration-300 ${
            activeWords.includes(index)
              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white scale-110 sm:scale-125 lg:scale-130 shadow-lg"
              : "bg-white text-blue-600 hover:bg-blue-100 hover:scale-105 sm:hover:scale-110 lg:hover:scale-115"
          }`}
          onClick={() => setActiveWords((prev) => [...prev, index])}
        >
          {word}
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

export default function Grade2LanguageArtsPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const strands = [
    {
      id: 1,
      title: "Listening and Speaking",
      icon: Ear,
      description: "Essential for all learning and communication",
      content:
        "In Grade 2, students develop more sophisticated listening and speaking skills. They learn to contribute meaningfully to social environments, express opinions, ask critical questions, and develop increasing proficiency in cognitive organization and critical thinking.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-500",
      textColor: "text-purple-700",
      progress: 88,
      progressColor: "from-purple-400 to-purple-600",
      link: "/curriculum/grade2-subjects/language-arts/listening-speaking",
    },
    {
      id: 2,
      title: "Reading and Viewing",
      icon: BookOpen,
      description: "Meaning-making and problem solving activities",
      content:
        "Grade 2 students interact with a wider range of written and visual texts for various purposes. They develop more advanced comprehension strategies, learn to integrate multiple sources of information, and develop thoughtful and critical understanding of texts.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      textColor: "text-blue-700",
      progress: 82,
      progressColor: "from-blue-400 to-blue-600",
      link: "/curriculum/grade2-subjects/language-arts/reading-viewing",
    },
    {
      id: 3,
      title: "Writing and Representing",
      icon: Pencil,
      description: "Communication through various formats",
      content:
        "In Grade 2, students develop more sophisticated writing and representing skills. They learn to plan, organize, revise, and refine their writing with greater independence. Students explore different genres and formats while developing their unique voice and style.",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-500",
      textColor: "text-pink-700",
      progress: 90,
      progressColor: "from-pink-400 to-pink-600",
      link: "/curriculum/grade2-subjects/language-arts/writing-representing",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Floating decorative elements - hidden on mobile for performance */}
      <div className="hidden sm:block fixed inset-0 pointer-events-none overflow-hidden">
        <FloatingElement delay={0}>
          <Target className="absolute top-20 left-10 text-blue-400 w-4 h-4 sm:w-6 sm:h-6" />
        </FloatingElement>
        <FloatingElement delay={1}>
          <Heart className="absolute top-40 right-20 text-pink-400 w-6 h-6 sm:w-8 sm:h-8" />
        </FloatingElement>
        <FloatingElement delay={2}>
          <Lightbulb className="absolute bottom-40 left-20 text-purple-400 w-5 h-5 sm:w-7 sm:h-7" />
        </FloatingElement>
        <FloatingElement delay={0.5}>
          <Star className="absolute bottom-20 right-10 text-blue-400 w-4 h-4 sm:w-5 sm:h-5" />
        </FloatingElement>
      </div>

      <div className="container mx-auto px-4 lg:px-6 xl:px-8 py-4 sm:py-8 lg:py-10 xl:py-12 relative z-10 max-w-7xl">
        <Link href="/curriculum/grade2-subjects">
          <Button
            variant="outline"
            className="mb-4 sm:mb-6 hover:scale-105 transition-transform bg-transparent text-sm sm:text-base"
          >
            <ChevronLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Back to Grade 2 Subjects
          </Button>
        </Link>

        {/* Hero Section */}
        <div className="relative mb-8 sm:mb-12 lg:mb-16">
          <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 p-4 sm:p-8 lg:p-10 xl:p-12 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 xl:p-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-6 lg:mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-pulse">
                🌟 Grade 2 Language Arts 🌟
              </h1>
              <p className="text-sm sm:text-lg md:text-xl lg:text-xl xl:text-2xl text-gray-700 text-center max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto leading-relaxed">
                Language is the foundation of communication and the primary instrument of thought. Continue your amazing
                journey of discovery through advanced speaking, reading, and writing skills! 📚✨
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
                      💡 Grade 2 Tip:{" "}
                      {strand.id === 1
                        ? "Practice expressing your opinions clearly!"
                        : strand.id === 2
                          ? "Try reading chapter books and graphic novels!"
                          : "Write stories with beginning, middle, and end!"}
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

        {/* Interactive Word Building Section */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold mb-4 sm:mb-6 lg:mb-6 text-center text-purple-700 flex items-center justify-center gap-1 sm:gap-2 lg:gap-2">
            <span>📝</span> Interactive Word Building! <span>📝</span>
          </h2>
          <div className="max-w-7xl mx-auto">
            <InteractiveWordBuilder />
          </div>
          <p className="text-center mt-3 sm:mt-4 lg:mt-4 text-gray-600 text-sm sm:text-base lg:text-base">
            Click on words to see them light up! Build your vocabulary! ✨
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
            About Our Grade 2 Curriculum!
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-12">
            <div className="lg:col-span-1 xl:col-span-2">
              <p className="mb-3 sm:mb-4 lg:mb-4 text-gray-700 text-sm sm:text-lg lg:text-base xl:text-lg leading-relaxed">
                The Grade 2 Language Arts curriculum builds upon the foundation established in Grade 1. It is designed
                to develop students' language skills through an integrated approach. The three strands work together
                like a team! 🤝
              </p>
              <p className="text-gray-700 text-sm sm:text-lg lg:text-base xl:text-lg leading-relaxed">
                Each strand includes Essential Learning Outcomes (ELOs), assessment strategies, and exciting activities
                to guide your learning adventure! 🎯
              </p>
            </div>

            <div className="bg-white/70 p-4 sm:p-6 lg:p-6 xl:p-7 rounded-xl sm:rounded-2xl lg:col-span-1">
              <h3 className="font-bold text-base sm:text-lg lg:text-lg xl:text-xl mb-2 sm:mb-3 lg:mb-3 text-purple-700">
                Grade 2 Skills:
              </h3>
              <ul className="space-y-1 sm:space-y-2 lg:space-y-3">
                <li className="flex items-center gap-2 lg:gap-2 text-sm sm:text-base lg:text-base xl:text-lg">
                  <span className="text-green-500 text-lg lg:text-lg">✓</span>
                  <span>Express opinions clearly</span>
                </li>
                <li className="flex items-center gap-2 lg:gap-2 text-sm sm:text-base lg:text-base xl:text-lg">
                  <span className="text-green-500 text-lg lg:text-lg">✓</span>
                  <span>Read longer stories</span>
                </li>
                <li className="flex items-center gap-2 lg:gap-2 text-sm sm:text-base lg:text-base xl:text-lg">
                  <span className="text-green-500 text-lg lg:text-lg">✓</span>
                  <span>Write with independence</span>
                </li>
                <li className="flex items-center gap-2 lg:gap-2 text-sm sm:text-base lg:text-base xl:text-lg">
                  <span className="text-green-500 text-lg lg:text-lg">✓</span>
                  <span>Think critically about texts</span>
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
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-6 sm:px-12 lg:px-14 xl:px-16 py-4 sm:py-6 lg:py-6 xl:py-7 rounded-xl sm:rounded-2xl lg:rounded-2xl shadow-xl sm:shadow-2xl hover:shadow-2xl sm:hover:shadow-3xl transform hover:scale-105 sm:hover:scale-110 transition-all duration-300 text-base sm:text-xl lg:text-xl xl:text-2xl font-bold"
            onClick={() => setShowConfetti(true)}
          >
            <Link
              href="/curriculum/grade2-subjects/activities/language-arts"
              className="flex items-center gap-2 sm:gap-3 lg:gap-4"
            >
              <span>🎮 Continue Your Language Journey!</span>
              <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6 lg:h-6 lg:w-6" />
            </Link>
          </Button>
        </div>

        {/* Decorative Footer */}
        <div className="flex justify-center">
          <div className="flex space-x-2 sm:space-x-3">
            {["🌟", "📖", "✍️", "🎨", "🌈"].map((emoji, index) => (
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
