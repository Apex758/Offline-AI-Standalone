"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ChevronLeft,
  Search,
  Clock,
  Users,
  Home,
  Filter,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Printer,
  X,
  MinusCircle,
  PlusCircle,
  ArrowUp,
  Menu,
  CloudRain,
  Palette,
  Leaf,
  Shapes,
  Map,
} from "lucide-react"

// Define activity types and structure for better organization
type ActivitySkill =
  | "science"
  | "math"
  | "language"
  | "social"
  | "art"
  | "critical-thinking"
  | "observation"
  | "collaboration"

interface Activity {
  id: string
  title: string
  description: string
  timeRequired: string
  groupSize: string
  skills: ActivitySkill[]
  materials: string[]
  instructions: string[]
  curriculumConnections: {
    mathematics: string[]
    science: string[]
    languageArts: string[]
    socialStudies: string[]
    arts?: string[]
  }
  extensions: string[]
  homeConnection: string[]
  icon: React.ReactNode
  category: "nature" | "arts" | "community" | "stem"
  printableResource?: {
    title: string
    content: React.ReactNode
  }
}

export default function CrossCurricularActivitiesPage() {
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<ActivitySkill[]>([])
  const [expandedActivities, setExpandedActivities] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"title" | "timeRequired">("title")
  const [showNavigation, setShowNavigation] = useState(true)
  const [minimizedNavigation, setMinimizedNavigation] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [scrollPosition, setScrollPosition] = useState(0)

  // Handle scroll position for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Toggle expanded state for an activity
  const toggleExpanded = (id: string) => {
    if (expandedActivities.includes(id)) {
      setExpandedActivities(expandedActivities.filter((activityId) => activityId !== id))
    } else {
      setExpandedActivities([...expandedActivities, id])
    }
  }

  // Toggle skill filter
  const toggleSkillFilter = (skill: ActivitySkill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill))
    } else {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  // Toggle navigation visibility
  const toggleNavigation = () => {
    setShowNavigation(!showNavigation)
    setMinimizedNavigation(false)
  }

  // Toggle navigation minimized state
  const toggleMinimized = () => {
    setMinimizedNavigation(!minimizedNavigation)
  }

  // Define cross-curricular activities
  const crossCurricularActivities: Activity[] = [
    {
      id: "weather-station",
      title: "Our Weather Station",
      description: "An integrated project combining science, math, language arts, and social studies",
      timeRequired: "30-45 minutes daily for 2 weeks",
      groupSize: "Whole class and small groups",
      skills: ["science", "math", "observation", "collaboration"],
      icon: <CloudRain className="h-5 w-5 text-blue-600" />,
      category: "stem",
      materials: [
        "Rain gauge (plastic bottle with measurements)",
        "Wind sock (paper bag and streamers)",
        "Temperature chart (happy face, neutral face, sad face)",
        "Weather journal",
        "Weather symbols for tracking",
        "Chart paper for graphing",
      ],
      instructions: [
        "Create a simple classroom weather station with student-made tools.",
        'Students take turns being the "meteorologist" who records daily weather.',
        "Record observations in a class weather journal and on a weather calendar.",
        "At the end of each week, count and graph the number of sunny, rainy, cloudy, and windy days.",
        "Discuss how weather affects plants, animals, and people's activities.",
        "Write simple weather reports using sentence frames.",
      ],
      curriculumConnections: {
        mathematics: [
          "Counting and recording data",
          "Creating and interpreting simple graphs",
          "Measuring rainfall and temperature",
          "Comparing quantities (more/less/same)",
        ],
        science: [
          "Observing and recording weather patterns",
          "Understanding seasonal changes",
          "Exploring how weather affects living things",
          "Using simple tools to collect data",
        ],
        languageArts: [
          "Writing weather reports using sentence frames",
          "Building weather vocabulary",
          "Reading weather-related books",
          "Oral communication during weather discussions",
        ],
        socialStudies: [
          "Discussing how weather affects community activities",
          "Exploring how people adapt to different weather conditions",
          "Understanding how weather influences jobs and transportation",
          "Comparing weather in different places",
        ],
      },
      extensions: [
        "Create a digital weather tracking calendar where students can drag weather symbols onto dates.",
        "Compare weather data from different months or seasons.",
        "Research how weather affects different jobs in the community.",
        "Create weather-appropriate clothing for paper dolls.",
        "Write and perform a weather forecast for the class.",
      ],
      homeConnection: [
        "Track weather at home for a weekend",
        "Discuss how weather affects their plans",
        "Create a simple weather tool (rain gauge or wind sock)",
        "Compare home weather observations with school observations",
      ],
      printableResource: {
        title: "Weather Journal Page",
        content: (
          <div className="border-2 border-gray-300 p-4 rounded-lg max-w-md mx-auto">
            <div className="text-center border-b-2 border-gray-300 pb-2 mb-2">
              <p className="font-semibold">My Weather Journal</p>
              <p>Meteorologist: ___________________</p>
              <p>Date: ___________________</p>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-semibold">Today's Weather:</p>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <div className="text-center">
                    <div className="w-12 h-12 border border-gray-300 mx-auto"></div>
                    <p className="text-sm mt-1">Sunny</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 border border-gray-300 mx-auto"></div>
                    <p className="text-sm mt-1">Cloudy</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 border border-gray-300 mx-auto"></div>
                    <p className="text-sm mt-1">Rainy</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 border border-gray-300 mx-auto"></div>
                    <p className="text-sm mt-1">Windy</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="font-semibold">Temperature:</p>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="text-center">
                    <div className="w-12 h-12 border border-gray-300 mx-auto"></div>
                    <p className="text-sm mt-1">Cold</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 border border-gray-300 mx-auto"></div>
                    <p className="text-sm mt-1">Just Right</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 border border-gray-300 mx-auto"></div>
                    <p className="text-sm mt-1">Hot</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="font-semibold">My Weather Report:</p>
                <div className="h-16 border border-gray-300 mt-2"></div>
              </div>
            </div>
          </div>
        ),
      },
    },
    {
      id: "five-senses-museum",
      title: "Our Five Senses Museum",
      description: "An integrated project exploring the five senses through multiple subject areas",
      timeRequired: "45-60 minutes daily for 1-2 weeks",
      groupSize: "Whole class and small groups",
      skills: ["science", "language", "art", "observation"],
      icon: <Palette className="h-5 w-5 text-purple-600" />,
      category: "arts",
      materials: [
        "Sensory materials for each sense",
        "Display boards or boxes",
        "Recording sheets",
        "Art supplies",
        "Digital camera (optional)",
        "Books about the five senses",
      ],
      instructions: [
        "Introduce the five senses through books, discussions, and hands-on explorations.",
        "Create five stations, one for each sense, with various materials to explore.",
        "Students rotate through stations, recording their observations on a five senses recording sheet.",
        "Create artwork representing each sense (e.g., texture collage for touch, sound shakers for hearing).",
        "Write simple descriptive sentences about sensory experiences.",
        'Create a classroom "Five Senses Museum" with student work and interactive displays.',
        "Invite other classes or families to visit the museum, with students as docents.",
      ],
      curriculumConnections: {
        science: [
          "Understanding how our senses help us learn about the world",
          "Exploring properties of materials (texture, sound, taste, smell, appearance)",
          "Making and recording observations",
          "Classifying objects based on sensory properties",
        ],
        languageArts: [
          "Building sensory vocabulary",
          "Writing descriptive sentences",
          "Reading books about the five senses",
          "Oral communication when presenting museum exhibits",
        ],
        mathematics: [
          "Sorting and classifying objects",
          "Creating graphs of favorite smells, tastes, etc.",
          "Measuring ingredients for sensory recipes",
          "Counting and comparing objects",
        ],
        socialStudies: [
          "Exploring how different cultures use spices, music, art, and textures",
          "Understanding how people with sensory impairments adapt",
          "Learning about jobs that use specific senses",
          "Discussing how senses help us in our community",
        ],
        arts: [
          "Creating artwork inspired by the senses",
          "Making musical instruments for sound exploration",
          "Using different textures in art",
          "Exploring colors and visual patterns",
        ],
      },
      extensions: [
        'Create a digital "Five Senses" book with photos and student recordings.',
        "Explore how animals use their senses differently than humans.",
        "Investigate how people with sensory impairments adapt and use other senses.",
        "Create sensory-themed poetry or stories.",
        "Explore how different cultures use spices, music, art, and textures.",
      ],
      homeConnection: [
        "Find items around the home that appeal to each sense",
        'Create a family "favorite smells" or "favorite sounds" list',
        "Cook a simple recipe together, focusing on sensory experiences",
        "Create a texture collection from safe household items",
      ],
      printableResource: {
        title: "My 5 Senses Recording Sheet",
        content: (
          <div className="border-2 border-gray-300 p-4 rounded-lg max-w-md mx-auto">
            <div className="text-center border-b-2 border-gray-300 pb-2 mb-2">
              <p className="font-semibold">My 5 Senses</p>
              <p>Name: ___________________</p>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-semibold">I can see: ___________________</p>
                <div className="h-8 border-b border-gray-300 mt-2"></div>
              </div>
              <div>
                <p className="font-semibold">I can hear: ___________________</p>
                <div className="h-8 border-b border-gray-300 mt-2"></div>
              </div>
              <div>
                <p className="font-semibold">I can smell: ___________________</p>
                <div className="h-8 border-b border-gray-300 mt-2"></div>
              </div>
              <div>
                <p className="font-semibold">I can taste: ___________________</p>
                <div className="h-8 border-b border-gray-300 mt-2"></div>
              </div>
              <div>
                <p className="font-semibold">I can touch: ___________________</p>
                <div className="h-8 border-b border-gray-300 mt-2"></div>
              </div>
            </div>
          </div>
        ),
      },
    },
    {
      id: "growing-garden",
      title: "Our Growing Garden",
      description: "An integrated project exploring plant growth through multiple subject areas",
      timeRequired: "20-30 minutes daily for 3-4 weeks",
      groupSize: "Whole class and individual",
      skills: ["science", "math", "observation", "critical-thinking"],
      icon: <Leaf className="h-5 w-5 text-green-600" />,
      category: "nature",
      materials: [
        "Seeds (fast-growing varieties like beans or grass)",
        "Clear plastic cups",
        "Soil",
        "Plant growth journals",
        "Rulers",
        "Books about plants",
        "Chart paper for recording data",
      ],
      instructions: [
        "Introduce plants and their needs through books and discussions.",
        "Each student plants seeds in a clear cup to observe root and stem growth.",
        "Create a plant growth journal where students record observations, measurements, and drawings.",
        "Measure and graph plant growth over time.",
        "Conduct simple experiments with variables like light, water, or soil type.",
        "Write simple sentences about plant observations and create plant-themed artwork.",
        "Create a class book about the plant life cycle.",
      ],
      curriculumConnections: {
        science: [
          "Understanding plant needs and life cycles",
          "Observing changes over time",
          "Conducting simple experiments",
          "Learning about plant parts and their functions",
        ],
        mathematics: [
          "Measuring plant growth",
          "Creating and interpreting growth graphs",
          "Counting days and recording dates",
          "Comparing heights and growth rates",
        ],
        languageArts: [
          "Building plant vocabulary",
          "Writing observations and predictions",
          "Reading books about plants",
          "Creating plant-themed stories or poems",
        ],
        socialStudies: [
          "Learning about plants in different environments",
          "Understanding how plants provide food and materials",
          "Exploring plant-based traditions in different cultures",
          "Discussing responsibility for caring for living things",
        ],
      },
      extensions: [
        "Create a digital time-lapse of plant growth using photos taken each day.",
        "Explore how different plants are used for food, medicine, and materials.",
        "Investigate plants native to your local area.",
        "Create plant-inspired art using different techniques.",
        "Taste test different plant foods and create a class preference graph.",
      ],
      homeConnection: [
        "Plant seeds at home and compare growth with classroom plants",
        "Go on a plant scavenger hunt in their neighborhood",
        "Cook a meal using different plant parts (roots, stems, leaves, fruits)",
        "Create a family plant care routine for a houseplant",
      ],
      printableResource: {
        title: "Plant Growth Journal Page",
        content: (
          <div className="border-2 border-gray-300 p-4 rounded-lg max-w-md mx-auto">
            <div className="text-center border-b-2 border-gray-300 pb-2 mb-2">
              <p className="font-semibold">My Plant Journal</p>
              <p>Plant Scientist: ___________________</p>
              <p>Date: ___________________</p>
              <p>Day Number: ___________________</p>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-semibold">My plant is _____ cm tall.</p>
              </div>
              <div>
                <p className="font-semibold">I observe:</p>
                <div className="h-16 border-b border-gray-300 mt-2"></div>
              </div>
              <div>
                <p className="font-semibold">Drawing of my plant:</p>
                <div className="h-24 border border-gray-300 mt-2"></div>
              </div>
            </div>
          </div>
        ),
      },
    },
    {
      id: "shape-city",
      title: "Shape City",
      description: "Students design and build a city using geometric shapes and map skills",
      timeRequired: "45-60 minutes daily for 1 week",
      groupSize: "Small groups",
      skills: ["math", "art", "collaboration", "critical-thinking"],
      icon: <Shapes className="h-5 w-5 text-orange-600" />,
      category: "stem",
      materials: [
        "Construction paper in various colors",
        "Scissors and glue",
        "Large poster board for city base",
        "Rulers and measuring tools",
        "Shape templates",
        "Books about cities and architecture",
        "Small boxes and recycled materials",
      ],
      instructions: [
        "Introduce the project by exploring shapes in buildings and city structures through books and photos.",
        "Discuss different types of buildings and community spaces needed in a city (homes, schools, parks, etc.).",
        "Have students identify and name 2D and 3D shapes in buildings and structures.",
        "In small groups, students plan their city layout on poster board, marking streets and zones.",
        "Students create buildings using paper shapes or small boxes, labeling each with its purpose.",
        "Groups present their cities, describing the shapes used and the city's features.",
        "Create a class book about shapes in our community.",
      ],
      curriculumConnections: {
        mathematics: [
          "Identifying and naming 2D and 3D shapes",
          "Composing shapes to form larger shapes",
          "Using spatial reasoning",
          "Measuring distances and areas",
        ],
        science: [
          "Exploring building materials and their properties",
          "Investigating stability and structure",
          "Discussing environmental considerations in city planning",
          "Learning about natural resources in communities",
        ],
        languageArts: [
          "Building vocabulary related to shapes and communities",
          "Writing descriptions of buildings and city features",
          "Reading books about cities and architecture",
          "Oral presentations about city designs",
        ],
        socialStudies: [
          "Understanding community planning and organization",
          "Learning about different types of buildings and their purposes",
          "Exploring how cities meet people's needs",
          "Discussing transportation and infrastructure",
        ],
      },
      extensions: [
        "Add a grid system and create simple maps with coordinates.",
        "Create a digital version of the city using simple design software.",
        "Add people and vehicles to the city and create stories about them.",
        'Design "green" features for the city like parks, gardens, and renewable energy.',
        "Compare city designs with rural communities.",
      ],
      homeConnection: [
        "Look for different shapes in buildings in your neighborhood",
        "Draw a simple map of your home or neighborhood",
        "Build a model of your home using boxes or blocks",
        "Discuss different buildings in your community and their purposes",
      ],
      printableResource: {
        title: "Shape City Planning Sheet",
        content: (
          <div className="border-2 border-gray-300 p-4 rounded-lg max-w-md mx-auto">
            <div className="text-center border-b-2 border-gray-300 pb-2 mb-2">
              <p className="font-semibold">My Shape City Plan</p>
              <p>City Planner: ___________________</p>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-semibold">City Name: ___________________</p>
              </div>
              <div>
                <p className="font-semibold">Buildings I will include:</p>
                <div className="h-16 border border-gray-300 mt-2"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">2D Shapes I'll use:</p>
                  <div className="h-16 border border-gray-300 mt-2"></div>
                </div>
                <div>
                  <p className="font-semibold">3D Shapes I'll use:</p>
                  <div className="h-16 border border-gray-300 mt-2"></div>
                </div>
              </div>
              <div>
                <p className="font-semibold">My City Map:</p>
                <div className="h-32 border border-gray-300 mt-2"></div>
              </div>
            </div>
          </div>
        ),
      },
    },
    {
      id: "community-helpers",
      title: "Community Helpers Project",
      description: "Students explore different jobs and roles in their community",
      timeRequired: "30-45 minutes daily for 2 weeks",
      groupSize: "Whole class and small groups",
      skills: ["social", "language", "collaboration", "critical-thinking"],
      icon: <Map className="h-5 w-5 text-red-600" />,
      category: "community",
      materials: [
        "Books about community helpers",
        "Dress-up clothes and props for different jobs",
        "Art supplies for creating posters",
        "Thank you card materials",
        "Camera for documenting visits",
        "Chart paper for recording information",
      ],
      instructions: [
        "Introduce the concept of community helpers through books and discussions.",
        "Create a class list of different jobs people do in the community.",
        "Invite community helpers to visit the classroom or arrange virtual meetings.",
        "Students prepare questions to ask community helpers about their jobs.",
        "After each visit, create a class chart about what was learned.",
        "Students create thank you cards for visitors.",
        "Set up dramatic play areas where students can role-play different community jobs.",
        'Create a class book about "People Who Help Our Community."',
      ],
      curriculumConnections: {
        mathematics: [
          "Sorting and categorizing jobs",
          "Creating graphs of student job preferences",
          "Using time concepts related to work schedules",
          "Counting and comparing tools used in different jobs",
        ],
        science: [
          "Learning about tools and technology used in different jobs",
          "Exploring safety equipment and its purposes",
          "Discussing how weather affects different jobs",
          "Investigating materials used by different workers",
        ],
        languageArts: [
          "Building vocabulary related to community jobs",
          "Writing thank you letters and job descriptions",
          "Reading books about community helpers",
          "Developing questioning skills for interviews",
        ],
        socialStudies: [
          "Understanding the concept of community",
          "Learning about different jobs and their importance",
          "Exploring how community members depend on each other",
          "Discussing how communities meet people's needs",
        ],
      },
      extensions: [
        'Create a classroom "Community Helper of the Week" feature.',
        "Make a digital slideshow about community helpers to share with other classes.",
        "Design simple maps showing where different community helpers work.",
        'Hold a "Career Day" where students dress up as different community helpers.',
        "Create a service project to help the community.",
      ],
      homeConnection: [
        "Interview family members about their jobs",
        "Create a family job chart showing responsibilities at home",
        "Visit community helpers in the neighborhood (mail carrier, store clerk, etc.)",
        "Discuss how family members help the community",
      ],
      printableResource: {
        title: "Community Helper Interview Sheet",
        content: (
          <div className="border-2 border-gray-300 p-4 rounded-lg max-w-md mx-auto">
            <div className="text-center border-b-2 border-gray-300 pb-2 mb-2">
              <p className="font-semibold">Community Helper Interview</p>
              <p>Reporter: ___________________</p>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-semibold">Community Helper: ___________________</p>
              </div>
              <div>
                <p className="font-semibold">Job: ___________________</p>
              </div>
              <div>
                <p className="font-semibold">Tools they use:</p>
                <div className="h-12 border border-gray-300 mt-2"></div>
              </div>
              <div>
                <p className="font-semibold">How they help our community:</p>
                <div className="h-12 border border-gray-300 mt-2"></div>
              </div>
              <div>
                <p className="font-semibold">Something interesting I learned:</p>
                <div className="h-12 border border-gray-300 mt-2"></div>
              </div>
            </div>
          </div>
        ),
      },
    },
  ]

  // Filter activities based on search, selected skills, and active tab
  const filterActivities = (activities: Activity[]) => {
    return activities
      .filter(
        (activity) =>
          activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .filter(
        (activity) => selectedSkills.length === 0 || selectedSkills.some((skill) => activity.skills.includes(skill)),
      )
      .filter((activity) => activeTab === "all" || activity.category === activeTab)
      .sort((a, b) => {
        if (sortBy === "title") {
          return a.title.localeCompare(b.title)
        } else {
          // Simple time sorting (not perfect but works for demo)
          const aTime = Number.parseInt(a.timeRequired.split("-")[0])
          const bTime = Number.parseInt(b.timeRequired.split("-")[0])
          return aTime - bTime
        }
      })
  }

  // Skill filter options with colors
  const skillFilters: { skill: ActivitySkill; label: string; color: string }[] = [
    { skill: "science", label: "Science", color: "bg-green-100 text-green-800" },
    { skill: "math", label: "Math", color: "bg-blue-100 text-blue-800" },
    { skill: "language", label: "Language", color: "bg-purple-100 text-purple-800" },
    { skill: "social", label: "Social Studies", color: "bg-yellow-100 text-yellow-800" },
    { skill: "art", label: "Arts", color: "bg-pink-100 text-pink-800" },
    { skill: "critical-thinking", label: "Critical Thinking", color: "bg-orange-100 text-orange-800" },
    { skill: "observation", label: "Observation", color: "bg-teal-100 text-teal-800" },
    { skill: "collaboration", label: "Collaboration", color: "bg-indigo-100 text-indigo-800" },
  ]

  // Get badge color for a skill
  const getSkillBadgeColor = (skill: ActivitySkill) => {
    return skillFilters.find((f) => f.skill === skill)?.color || "bg-gray-100 text-gray-800"
  }

  // Print activity function
  const printActivity = (activity: Activity) => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${activity.title} - Activity</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; }
              h2 { color: #555; margin-top: 20px; }
              .section { margin-bottom: 20px; }
              ul, ol { margin-top: 10px; }
              .footer { margin-top: 30px; font-size: 12px; color: #777; }
            </style>
          </head>
          <body>
            <h1>${activity.title}</h1>
            <p>${activity.description}</p>
            
            <div class="section">
              <h2>Materials</h2>
              <ul>
                ${activity.materials.map((item) => `<li>${item}</li>`).join("")}
              </ul>
            </div>
            
            <div class="section">
              <h2>Instructions</h2>
              <ol>
                ${activity.instructions.map((item) => `<li>${item}</li>`).join("")}
              </ol>
            </div>
            
            <div class="section">
              <h2>Curriculum Connections</h2>
              
              <h3>Mathematics</h3>
              <ul>
                ${activity.curriculumConnections.mathematics.map((item) => `<li>${item}</li>`).join("")}
              </ul>
              
              <h3>Science</h3>
              <ul>
                ${activity.curriculumConnections.science.map((item) => `<li>${item}</li>`).join("")}
              </ul>
              
              <h3>Language Arts</h3>
              <ul>
                ${activity.curriculumConnections.languageArts.map((item) => `<li>${item}</li>`).join("")}
              </ul>
              
              <h3>Social Studies</h3>
              <ul>
                ${activity.curriculumConnections.socialStudies.map((item) => `<li>${item}</li>`).join("")}
              </ul>
              
              ${
                activity.curriculumConnections.arts
                  ? `
                <h3>Arts</h3>
                <ul>
                  ${activity.curriculumConnections.arts.map((item) => `<li>${item}</li>`).join("")}
                </ul>
              `
                  : ""
              }
            </div>
            
            <div class="section">
              <h2>Extensions</h2>
              <ul>
                ${activity.extensions.map((item) => `<li>${item}</li>`).join("")}
              </ul>
            </div>
            
            <div class="section">
              <h2>Home Connection</h2>
              <ul>
                ${activity.homeConnection.map((item) => `<li>${item}</li>`).join("")}
              </ul>
            </div>
            
            <div class="footer">
              <p>Grade 1 Cross-Curricular Activities | Time Required: ${activity.timeRequired} | Group Size: ${
                activity.groupSize
              }</p>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Link href="/curriculum/grade1-subjects/activities">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Activities
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Cross-Curricular Activities</h1>
        <p className="text-gray-600 mb-4">
          These integrated activities combine concepts from multiple subject areas, helping Grade 1 students make
          connections across the curriculum. Each activity incorporates elements from mathematics, science, language
          arts, and social studies to provide a comprehensive learning experience.
        </p>
      </div>

      {/* Search and filter bar */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search activities..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Sort by:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortBy("title")}
              className={sortBy === "title" ? "bg-gray-100" : ""}
            >
              Name <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortBy("timeRequired")}
              className={sortBy === "timeRequired" ? "bg-gray-100" : ""}
            >
              Time <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>

        <div>
          <span className="text-sm font-medium mr-2">Filter by skill:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {skillFilters.map(({ skill, label, color }) => (
              <Badge
                key={skill}
                className={`cursor-pointer ${selectedSkills.includes(skill) ? color : "bg-gray-100 text-gray-800"}`}
                onClick={() => toggleSkillFilter(skill)}
              >
                {label}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Activities</TabsTrigger>
          <TabsTrigger value="nature" className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            Nature
          </TabsTrigger>
          <TabsTrigger value="stem" className="flex items-center gap-2">
            <Shapes className="h-4 w-4" />
            STEM
          </TabsTrigger>
          <TabsTrigger value="arts" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Arts
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Community
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {filterActivities(crossCurricularActivities).length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filterActivities(crossCurricularActivities).map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  isExpanded={expandedActivities.includes(activity.id)}
                  toggleExpanded={() => toggleExpanded(activity.id)}
                  getSkillBadgeColor={getSkillBadgeColor}
                  skillFilters={skillFilters}
                  printActivity={printActivity}
                />
              ))}
            </div>
          ) : (
            <EmptyState setSearchQuery={setSearchQuery} setSelectedSkills={setSelectedSkills} />
          )}
        </TabsContent>

        {["nature", "stem", "arts", "community"].map((category) => (
          <TabsContent key={category} value={category} className="mt-4">
            {filterActivities(crossCurricularActivities).length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filterActivities(crossCurricularActivities).map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    isExpanded={expandedActivities.includes(activity.id)}
                    toggleExpanded={() => toggleExpanded(activity.id)}
                    getSkillBadgeColor={getSkillBadgeColor}
                    skillFilters={skillFilters}
                    printActivity={printActivity}
                  />
                ))}
              </div>
            ) : (
              <EmptyState setSearchQuery={setSearchQuery} setSelectedSkills={setSelectedSkills} />
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Quick navigation sidebar */}
      {showNavigation && (
        <div className="fixed right-4 bottom-4 md:right-8 md:bottom-8 z-10">
          <div
            className={`bg-white rounded-lg shadow-lg border p-4 ${minimizedNavigation ? "w-12" : "w-64"} transition-all duration-300 ease-in-out`}
          >
            <div className="flex justify-between items-center mb-3">
              {!minimizedNavigation && <h3 className="font-semibold">Quick Navigation</h3>}
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={toggleMinimized}
                  aria-label={minimizedNavigation ? "Expand navigation" : "Minimize navigation"}
                >
                  {minimizedNavigation ? <PlusCircle className="h-4 w-4" /> : <MinusCircle className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={toggleNavigation}
                  aria-label="Close navigation"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {!minimizedNavigation && (
              <ScrollArea className="h-64">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 mt-2">Nature Activities</p>
                  {crossCurricularActivities
                    .filter((activity) => activity.category === "nature")
                    .map((activity) => (
                      <a
                        key={activity.id}
                        href={`#${activity.id}`}
                        className={`block text-sm py-1 px-2 rounded hover:bg-gray-100 ${
                          activeTab === "all" || activeTab === activity.category ? "" : "text-gray-400"
                        }`}
                      >
                        {activity.title}
                      </a>
                    ))}

                  <p className="text-sm font-medium text-gray-500 mt-2">STEM Activities</p>
                  {crossCurricularActivities
                    .filter((activity) => activity.category === "stem")
                    .map((activity) => (
                      <a
                        key={activity.id}
                        href={`#${activity.id}`}
                        className={`block text-sm py-1 px-2 rounded hover:bg-gray-100 ${
                          activeTab === "all" || activeTab === activity.category ? "" : "text-gray-400"
                        }`}
                      >
                        {activity.title}
                      </a>
                    ))}

                  <p className="text-sm font-medium text-gray-500 mt-2">Arts Activities</p>
                  {crossCurricularActivities
                    .filter((activity) => activity.category === "arts")
                    .map((activity) => (
                      <a
                        key={activity.id}
                        href={`#${activity.id}`}
                        className={`block text-sm py-1 px-2 rounded hover:bg-gray-100 ${
                          activeTab === "all" || activeTab === activity.category ? "" : "text-gray-400"
                        }`}
                      >
                        {activity.title}
                      </a>
                    ))}

                  <p className="text-sm font-medium text-gray-500 mt-2">Community Activities</p>
                  {crossCurricularActivities
                    .filter((activity) => activity.category === "community")
                    .map((activity) => (
                      <a
                        key={activity.id}
                        href={`#${activity.id}`}
                        className={`block text-sm py-1 px-2 rounded hover:bg-gray-100 ${
                          activeTab === "all" || activeTab === activity.category ? "" : "text-gray-400"
                        }`}
                      >
                        {activity.title}
                      </a>
                    ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      )}

      {/* Mobile navigation toggle */}
      <div className="md:hidden fixed right-4 bottom-4 z-10">
        {!showNavigation && (
          <Button className="rounded-full h-12 w-12 shadow-lg" onClick={toggleNavigation} aria-label="Show navigation">
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Back to top button */}
      {scrollPosition > 300 && (
        <Button
          className="fixed left-4 bottom-4 rounded-full h-10 w-10 shadow-lg md:h-12 md:w-12"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}

// Activity Card Component
interface ActivityCardProps {
  activity: Activity
  isExpanded: boolean
  toggleExpanded: () => void
  getSkillBadgeColor: (skill: ActivitySkill) => string
  skillFilters: { skill: ActivitySkill; label: string; color: string }[]
  printActivity: (activity: Activity) => void
}

function ActivityCard({
  activity,
  isExpanded,
  toggleExpanded,
  getSkillBadgeColor,
  skillFilters,
  printActivity,
}: ActivityCardProps) {
  return (
    <Card key={activity.id} id={activity.id} className="overflow-hidden">
      <CardHeader className="bg-gray-50 pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              {activity.icon}
              {activity.title}
            </CardTitle>
            <CardDescription className="mt-1">{activity.description}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
            aria-label={isExpanded ? "Collapse activity" : "Expand activity"}
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {activity.skills.map((skill) => (
            <Badge key={skill} className={getSkillBadgeColor(skill)}>
              {skillFilters.find((f) => f.skill === skill)?.label}
            </Badge>
          ))}
          <div className="flex items-center text-xs text-gray-500 ml-1">
            <Clock className="h-3 w-3 mr-1" />
            {activity.timeRequired}
          </div>
          <div className="flex items-center text-xs text-gray-500 ml-1">
            <Users className="h-3 w-3 mr-1" />
            {activity.groupSize}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                Materials
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  aria-label="Print materials list"
                  onClick={() => window.print()}
                >
                  <Printer className="h-4 w-4" />
                </Button>
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {activity.materials.map((material, index) => (
                  <li key={index}>{material}</li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h3 className="font-semibold mb-2">Instructions</h3>
              <ol className="list-decimal pl-5 space-y-2">
                {activity.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold mb-2">Curriculum Connections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-800">Mathematics</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {activity.curriculumConnections.mathematics.map((connection, index) => (
                    <li key={index}>{connection}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Science</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {activity.curriculumConnections.science.map((connection, index) => (
                    <li key={index}>{connection}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Language Arts</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {activity.curriculumConnections.languageArts.map((connection, index) => (
                    <li key={index}>{connection}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Social Studies</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {activity.curriculumConnections.socialStudies.map((connection, index) => (
                    <li key={index}>{connection}</li>
                  ))}
                </ul>
              </div>
              {activity.curriculumConnections.arts && (
                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-800">Arts</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {activity.curriculumConnections.arts.map((connection, index) => (
                      <li key={index}>{connection}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Extensions</h3>
              <ul className="list-disc pl-5 space-y-1">
                {activity.extensions.map((extension, index) => (
                  <li key={index}>{extension}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Home Connection</h3>
              <p className="mb-2">Send home a related activity where families:</p>
              <ul className="list-disc pl-5 space-y-1">
                {activity.homeConnection.map((connection, index) => (
                  <li key={index}>{connection}</li>
                ))}
              </ul>
            </div>
          </div>

          {activity.printableResource && (
            <div className="mt-6 border p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Printable Resource: {activity.printableResource.title}</h3>
              {activity.printableResource.content}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button variant="outline" size="sm" className="mr-2">
              <Home className="mr-2 h-4 w-4" />
              Send Home
            </Button>
            <Button onClick={() => printActivity(activity)}>
              <Printer className="mr-2 h-4 w-4" />
              Print Activity
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// Empty State Component
interface EmptyStateProps {
  setSearchQuery: (query: string) => void
  setSelectedSkills: (skills: ActivitySkill[]) => void
}

function EmptyState({ setSearchQuery, setSelectedSkills }: EmptyStateProps) {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <p className="text-gray-500">No activities match your search criteria. Try adjusting your filters.</p>
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => {
          setSearchQuery("")
          setSelectedSkills([])
        }}
      >
        Clear Filters
      </Button>
    </div>
  )
}
