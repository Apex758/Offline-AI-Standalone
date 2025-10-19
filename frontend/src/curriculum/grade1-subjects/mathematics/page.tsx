import { Link } from "react-router-dom"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  ChevronLeft,
  Calculator,
  Hash,
  Shapes,
  Ruler,
  BarChart,
  Plus,
  Sparkles,
  Search,
  BookOpen,
  Play,
  Download,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TeachingTip } from "@/components/math-strand-page"

export default function Grade1MathematicsPage() {
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render until client-side
  if (!isClient) {
    return <div>Loading...</div>
  }

  const handleCardHover = (id: string) => {
    setActiveCard(id)
  }

  const handleCardLeave = () => {
    setActiveCard(null)
  }

  const resources = [
    {
      id: "number-sense",
      title: "Number Sense",
      icon: <Hash className="h-6 w-6" />,
      color: "from-blue-50 to-blue-100",
      textColor: "text-blue-700",
      bgColor: "bg-blue-500",
      features: ["Counting and cardinality", "Place value understanding", "Comparing numbers"],
      path: "/curriculum/grade1-subjects/mathematics/number-sense",
    },
    {
      id: "operations",
      title: "Operations with Numbers",
      icon: <Plus className="h-6 w-6" />,
      color: "from-orange-50 to-orange-100",
      textColor: "text-orange-700",
      bgColor: "bg-orange-500",
      features: ["Addition strategies", "Subtraction concepts", "Equal groups"],
      path: "/curriculum/grade1-subjects/mathematics/operations-with-numbers",
    },
    {
      id: "patterns",
      title: "Patterns & Relationships",
      icon: <Calculator className="h-6 w-6" />,
      color: "from-purple-50 to-purple-100",
      textColor: "text-purple-700",
      bgColor: "bg-purple-500",
      features: ["Repeating patterns", "Growing patterns", "Equivalence"],
      path: "/curriculum/grade1-subjects/mathematics/patterns-relationships",
    },
    {
      id: "geometry",
      title: "Geometrical Thinking",
      icon: <Shapes className="h-6 w-6" />,
      color: "from-green-50 to-green-100",
      textColor: "text-green-700",
      bgColor: "bg-green-500",
      features: ["2D and 3D shapes", "Spatial relationships", "Composing shapes"],
      path: "/curriculum/grade1-subjects/mathematics/geometrical-thinking",
    },
    {
      id: "measurement",
      title: "Measurement",
      icon: <Ruler className="h-6 w-6" />,
      color: "from-amber-50 to-amber-100",
      textColor: "text-amber-700",
      bgColor: "bg-amber-500",
      features: ["Length and height", "Weight and capacity", "Time concepts"],
      path: "/curriculum/grade1-subjects/mathematics/measurement",
    },
    {
      id: "data",
      title: "Data Handling & Probability",
      icon: <BarChart className="h-6 w-6" />,
      color: "from-red-50 to-red-100",
      textColor: "text-red-700",
      bgColor: "bg-red-500",
      features: ["Sorting and classifying", "Pictographs and graphs", "Likelihood of events"],
      path: "/curriculum/grade1-subjects/mathematics/data-probability",
    },
  ]

  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.features.some((feature) => feature.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const featuredActivities = [
    {
      title: "Number Bond Puzzles",
      description: "Students practice number composition and decomposition with hands-on puzzles",
      image: "/placeholder-h9shi.png",
      complexity: "Beginner",
      time: "20 min",
      url: "#",
    },
    {
      title: "Shape Scavenger Hunt",
      description: "Students identify and classify 2D and 3D shapes in their environment",
      image: "/placeholder.svg?height=200&width=300&query=geometry classroom activity",
      complexity: "Intermediate",
      time: "30 min",
      url: "#",
    },
    {
      title: "Data Collection Project",
      description: "Students collect, organize, and represent data about their classmates",
      image: "/placeholder.svg?height=200&width=300&query=students creating graphs",
      complexity: "Advanced",
      time: "45 min",
      url: "#",
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <Link to="/curriculum/grade1-subjects">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 1 Curriculum
        </Button>
      </Link>

      <div
        className="relative mb-12 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white shadow-lg"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10"></div>
        <div className="relative z-10">
          <h1 className="mb-2 text-4xl font-bold">Grade 1 Mathematics</h1>
          <p className="mb-4 max-w-3xl text-lg text-white/90">
            Explore the exciting world of numbers, shapes, patterns, and problem-solving! The Grade 1 Mathematics
            curriculum builds foundational skills through hands-on activities and engaging challenges.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm">
              <Sparkles className="mr-1 h-4 w-4" /> Problem Solving
            </span>
            <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm">
              <Sparkles className="mr-1 h-4 w-4" /> Critical Thinking
            </span>
            <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm">
              <Sparkles className="mr-1 h-4 w-4" /> Hands-on Learning
            </span>
          </div>
          <div className="mt-6">
            <div className="flex gap-3">
              <Button className="bg-white text-blue-600 hover:bg-white/90" asChild>
                <Link to="/curriculum/grade1-subjects/activities/mathematics">View Activities</Link>
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link to="/planner">Create Lesson Plan</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search math strands, concepts, or topics..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="strands" className="mb-12">
        <TabsList className="mb-6 grid w-full grid-cols-3">
          <TabsTrigger value="strands">Curriculum Strands</TabsTrigger>
          <TabsTrigger value="approach">Teaching Approach</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        <TabsContent value="strands">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <Link to={resource.path} className="block" key={resource.id}>
                <div
                  className={`h-full overflow-hidden rounded-lg border transition-all duration-300 ${
                    activeCard === resource.id
                      ? `border-${resource.id === "number-sense" ? "blue" : resource.id === "operations" ? "orange" : resource.id === "patterns" ? "purple" : resource.id === "geometry" ? "green" : resource.id === "measurement" ? "amber" : "red"}-400 shadow-lg shadow-${resource.id === "number-sense" ? "blue" : resource.id === "operations" ? "orange" : resource.id === "patterns" ? "purple" : resource.id === "geometry" ? "green" : resource.id === "measurement" ? "amber" : "red"}-100`
                      : "border-transparent shadow"
                  }`}
                  onMouseEnter={() => handleCardHover(resource.id)}
                  onMouseLeave={handleCardLeave}
                >
                  <div className={`bg-gradient-to-r ${resource.color} p-6`}>
                    <div
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${resource.bgColor} text-white`}
                    >
                      {resource.icon}
                    </div>
                    <h3 className={`mb-2 text-xl font-bold ${resource.textColor}`}>{resource.title}</h3>
                    <p className={resource.textColor}>
                      Develop understanding of {resource.title.toLowerCase()} through interactive activities and
                      conceptual learning.
                    </p>
                  </div>
                  <div className="p-6">
                    <ul className="mb-4 space-y-2 text-sm">
                      {resource.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span
                            className={`mr-2 mt-0.5 text-${resource.id === "number-sense" ? "blue" : resource.id === "operations" ? "orange" : resource.id === "patterns" ? "purple" : resource.id === "geometry" ? "green" : resource.id === "measurement" ? "amber" : "red"}-500`}
                          >
                            •
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div
                      className={`flex items-center text-sm font-medium text-${resource.id === "number-sense" ? "blue" : resource.id === "operations" ? "orange" : resource.id === "patterns" ? "purple" : resource.id === "geometry" ? "green" : resource.id === "measurement" ? "amber" : "red"}-500`}
                    >
                      Explore {resource.title} <ChevronLeft className="ml-1 h-4 w-4 rotate-180" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="approach">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold">Our Teaching Approach</h2>
              <p className="mb-4 text-gray-700">
                The Grade 1 Mathematics curriculum is designed to foster a deep understanding of mathematical concepts
                through a balanced approach that includes:
              </p>
              <ul className="mb-6 space-y-3">
                <li className="flex items-start">
                  <div className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    1
                  </div>
                  <div>
                    <span className="font-medium">Concrete Experiences</span> - Using manipulatives and hands-on
                    activities to build understanding
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    2
                  </div>
                  <div>
                    <span className="font-medium">Pictorial Representations</span> - Using visual models to bridge
                    concrete and abstract thinking
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    3
                  </div>
                  <div>
                    <span className="font-medium">Abstract Concepts</span> - Developing symbolic understanding and
                    mathematical fluency
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    4
                  </div>
                  <div>
                    <span className="font-medium">Problem-Solving</span> - Applying mathematical knowledge in meaningful
                    contexts
                  </div>
                </li>
              </ul>

              <div className="mt-8">
                <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
                  <div className="flex h-full items-center justify-center bg-gray-800">
                    <Button size="lg" className="flex items-center gap-2">
                      <Play className="h-5 w-5" />
                      <span>Watch Overview Video</span>
                    </Button>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600">
                  This video provides an overview of the Grade 1 Mathematics teaching approach and demonstrates key
                  instructional strategies.
                </p>
              </div>
            </div>
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="mb-3 text-xl font-bold text-blue-700">Key Principles</h3>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <h4 className="mb-2 font-semibold text-blue-600">Active Learning</h4>
                  <p className="text-sm text-gray-600">
                    Students actively engage with mathematical concepts through exploration and discovery.
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <h4 className="mb-2 font-semibold text-blue-600">Differentiation</h4>
                  <p className="text-sm text-gray-600">
                    Instruction is tailored to meet the diverse needs and learning styles of all students.
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <h4 className="mb-2 font-semibold text-blue-600">Meaningful Context</h4>
                  <p className="text-sm text-gray-600">
                    Mathematics is connected to real-world situations relevant to students' lives.
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <h4 className="mb-2 font-semibold text-blue-600">Mathematical Discourse</h4>
                  <p className="text-sm text-gray-600">
                    Students communicate their mathematical thinking and reasoning.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-white p-5">
                <h4 className="mb-3 font-semibold text-blue-700">Professional Development Resources</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Teaching Mathematics in Grade 1</p>
                      <p className="text-sm text-gray-600">Comprehensive guide for educators</p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto">
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </li>
                  <li className="flex items-center gap-3">
                    <Play className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Math Talk in the Classroom</p>
                      <p className="text-sm text-gray-600">Video workshop series</p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Watch
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <TeachingTip
              title="Teaching Mathematics Effectively"
              description="Begin lessons with a concrete experience, then move to pictorial representations before introducing abstract symbols. This CPA (Concrete-Pictorial-Abstract) approach supports deeper conceptual understanding."
              category="Instructional Strategies"
            />
          </div>
        </TabsContent>
        <TabsContent value="resources">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div
              className="rounded-lg border border-blue-100 bg-white shadow-sm"
            >
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle>Teacher Resources</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span>
                    <span>Lesson plans and unit guides</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span>
                    <span>Assessment tools and rubrics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span>
                    <span>Manipulatives and teaching aids</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span>
                    <span>Digital tools and interactive activities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-blue-500">•</span>
                    <span>Professional development materials</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Access Teacher Portal
                </Button>
              </CardFooter>
            </div>

            <div
              className="rounded-lg border border-green-100 bg-white shadow-sm"
            >
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                <CardTitle>Student Materials</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span>
                    <span>Student workbooks and journals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span>
                    <span>Hands-on activity kits</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span>
                    <span>Digital learning platforms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span>
                    <span>Math games and puzzles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span>
                    <span>Home learning resources</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Student Resources
                </Button>
              </CardFooter>
            </div>

            <div
              className="rounded-lg border border-purple-100 bg-white shadow-sm"
            >
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
                <CardTitle>Parent Support</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="mr-2 text-purple-500">•</span>
                    <span>Home activity guides</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-purple-500">•</span>
                    <span>Math vocabulary glossary</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-purple-500">•</span>
                    <span>Strategy explanations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-purple-500">•</span>
                    <span>Progress monitoring tools</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-purple-500">•</span>
                    <span>Family math night materials</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Parent Resources
                </Button>
              </CardFooter>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-4 text-xl font-bold">Featured Downloadable Resources</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <Card className="transition-all duration-200 hover:shadow-md">
                <CardContent className="flex flex-col items-center p-4 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Download className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="mb-1 font-medium">Math Manipulatives Guide</h4>
                  <p className="mb-3 text-sm text-gray-600">Comprehensive guide to using manipulatives effectively</p>
                  <Badge>PDF • 2.3 MB</Badge>
                  <Button className="mt-3 w-full" size="sm">
                    Download
                  </Button>
                </CardContent>
              </Card>

              <Card className="transition-all duration-200 hover:shadow-md">
                <CardContent className="flex flex-col items-center p-4 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Download className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="mb-1 font-medium">Math Games Collection</h4>
                  <p className="mb-3 text-sm text-gray-600">25 printable math games for small groups and centers</p>
                  <Badge>PDF • 4.8 MB</Badge>
                  <Button className="mt-3 w-full" size="sm">
                    Download
                  </Button>
                </CardContent>
              </Card>

              <Card className="transition-all duration-200 hover:shadow-md">
                <CardContent className="flex flex-col items-center p-4 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <Download className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="mb-1 font-medium">Assessment Pack</h4>
                  <p className="mb-3 text-sm text-gray-600">Formative and summative assessments for all strands</p>
                  <Badge>PDF • 3.5 MB</Badge>
                  <Button className="mt-3 w-full" size="sm">
                    Download
                  </Button>
                </CardContent>
              </Card>

              <Card className="transition-all duration-200 hover:shadow-md">
                <CardContent className="flex flex-col items-center p-4 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                    <Download className="h-6 w-6 text-amber-600" />
                  </div>
                  <h4 className="mb-1 font-medium">Visual Aids Bundle</h4>
                  <p className="mb-3 text-sm text-gray-600">Printable posters, charts, and visual references</p>
                  <Badge>ZIP • 8.2 MB</Badge>
                  <Button className="mt-3 w-full" size="sm">
                    Download
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mb-12 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <h2 className="mb-4 text-2xl font-bold text-blue-800">Featured Activities</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featuredActivities.map((activity, index) => (
            <div key={index} className="overflow-hidden rounded-lg bg-white shadow-sm">
              <div className="relative h-40">
                <img src="" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold">{activity.title}</h3>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">
                      {activity.complexity}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {activity.time}
                    </Badge>
                  </div>
                </div>
                <p className="mb-4 text-sm text-gray-600">{activity.description}</p>
                <Button asChild className="w-full">
                  <Link to={activity.url}>View Activity</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-gray-50 p-6">
        <h2 className="mb-6 text-center text-2xl font-bold">Mathematics in Action</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="relative h-48 bg-gray-200">
              <img src="/placeholder-4d0eb.png" alt="Students counting blocks" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="mb-2 font-semibold">Hands-on Learning</h3>
              <p className="text-sm text-gray-600">
                Students develop number sense through concrete experiences with manipulatives.
              </p>
              <Button variant="link" className="mt-2 p-0" asChild>
                <Link to="#">View lesson ideas</Link>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="relative h-48 bg-gray-200">
              <img src="/placeholder-34akh.png" alt="Students measuring" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="mb-2 font-semibold">Measurement Activities</h3>
              <p className="text-sm text-gray-600">
                Exploring measurement concepts through practical, real-world applications.
              </p>
              <Button variant="link" className="mt-2 p-0" asChild>
                <Link to="#">View lesson ideas</Link>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="relative h-48 bg-gray-200">
              <img src="/placeholder-dzl0x.png" alt="Students creating patterns" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="mb-2 font-semibold">Pattern Exploration</h3>
              <p className="text-sm text-gray-600">
                Discovering and creating patterns helps develop algebraic thinking skills.
              </p>
              <Button variant="link" className="mt-2 p-0" asChild>
                <Link to="#">View lesson ideas</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center text-center">
        <h2 className="mb-4 text-2xl font-bold">Ready to Explore Grade 1 Mathematics?</h2>
        <p className="mb-6 max-w-2xl text-gray-600">
          Dive into our comprehensive curriculum resources, engaging activities, and professional development materials
          to support effective mathematics instruction.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link to="/curriculum/grade1-subjects/activities/mathematics">Browse Activities</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/planner">Create Lesson Plan</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
