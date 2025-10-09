import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Shapes, Grid3X3, Navigation, Square, Puzzle, Compass } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Grade5MathematicsGeometricalThinkingActivitiesPage() {
  const activities = [
    {
      id: "2d-shapes",
      title: "2D Shape Classification Adventure",
      icon: Shapes,
      difficulty: "Medium",
      time: "40 mins",
      color: "from-blue-500 to-cyan-500",
      description:
        "Learners classify and sort two-dimensional shapes based on their properties through interactive sorting activities.",
      materials: "Shape templates, sorting mats, attribute cards",
      procedure: [
        "Provide learners with a variety of 2D shape templates (e.g., triangles, squares, rectangles, pentagons, hexagons).",
        "Have learners sort the shapes based on different attributes, such as:",
        "- Number of sides",
        "- Number of angles",
        "- Symmetry properties",
        "Provide attribute cards with descriptions of different shape properties (e.g., 'has 4 sides,' 'has a right angle,' 'is symmetrical').",
        "Learners match the attribute cards with the corresponding shapes.",
      ],
    },
    {
      id: "coordinates",
      title: "Coordinate Plotting Treasure Hunt",
      icon: Navigation,
      difficulty: "Medium",
      time: "45 mins",
      color: "from-green-500 to-emerald-500",
      description:
        "Learners engage in coordinate plotting and navigation challenges to enhance their understanding of coordinate systems.",
      materials: "Coordinate grids, graph paper, rulers, pencils",
      procedure: [
        "Provide learners with coordinate grids and graph paper.",
        "Have learners plot points on the coordinate grid based on given coordinates.",
        "Create navigation challenges where learners must follow a series of coordinates to reach a specific destination.",
        "Have learners design their own coordinate-based challenges for their classmates to solve.",
      ],
    },
    {
      id: "patterns",
      title: "Geometric Property Detective Work",
      icon: Grid3X3,
      difficulty: "Hard",
      time: "50 mins",
      color: "from-purple-500 to-indigo-500",
      description:
        "Learners identify geometric properties such as parallel and perpendicular sides, equal sides and angles, and lines of symmetry.",
      materials: "Geometric shapes, rulers, protractors, symmetry tools",
      procedure: [
        "Provide learners with a set of geometric shapes (e.g., triangles, squares, rectangles, parallelograms).",
        "Have learners use rulers and protractors to measure the sides and angles of each shape.",
        "Instruct learners to identify and mark parallel and perpendicular sides, equal sides and angles, and lines of symmetry.",
        "Have learners create a chart or table to record their findings for each shape.",
      ],
    },
    {
      id: "area-perimeter",
      title: "Real-World Geometry Problem Solving",
      icon: Square,
      difficulty: "Medium",
      time: "55 mins",
      color: "from-orange-500 to-red-500",
      description: "Learners solve real-world geometry problems involving perimeter and area of rectangles.",
      materials: "Real-world scenarios, rulers, calculators, worksheets",
      procedure: [
        "Present learners with real-world scenarios that involve calculating the perimeter and area of rectangles (e.g., fencing a garden, tiling a floor).",
        "Have learners use rulers to measure the dimensions of the rectangles.",
        "Instruct learners to apply the appropriate formulas to calculate the perimeter and area.",
        "Have learners solve the problems and explain their reasoning.",
      ],
    },
    {
      id: "tangram",
      title: "Tangram Geometry Creations",
      icon: Puzzle,
      difficulty: "Medium",
      time: "35 mins",
      color: "from-pink-500 to-rose-500",
      description: "Students use tangram pieces to create various shapes and explore geometric relationships.",
      materials: "Tangram sets, templates, design sheets",
      procedure: [
        "Provide students with tangram sets and templates.",
        "Have students create various shapes using the tangram pieces.",
        "Students analyze the geometric relationships between the tangram pieces and the shapes they create.",
        "Have students create their own tangram puzzles for their classmates to solve.",
      ],
    },
    {
      id: "angles",
      title: "Angle Measurement Scavenger Hunt",
      icon: Compass,
      difficulty: "Easy",
      time: "30 mins",
      color: "from-teal-500 to-blue-500",
      description:
        "Students search for angles in the classroom and measure them using protractors, enhancing their understanding of angle measurement.",
      materials: "Protractors, rulers, scavenger hunt checklists",
      procedure: [
        "Provide students with protractors and rulers.",
        "Have students search the classroom for angles (e.g., corners of desks, doors, windows).",
        "Instruct students to measure the angles using the protractors and record their measurements on a scavenger hunt checklist.",
        "Have students classify the angles as acute, right, or obtuse.",
      ],
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 5 Subjects", href: "/curriculum/grade5-subjects" },
          { label: "Mathematics", href: "/curriculum/grade5-subjects/mathematics" },
          { label: "Activities", href: "/curriculum/grade5-subjects/activities/mathematics" },
          {
            label: "Geometrical Thinking",
            href: "/curriculum/grade5-subjects/activities/mathematics/geometrical-thinking",
          },
        ]}
      />

      <Link href="/curriculum/grade5-subjects/mathematics/geometrical-thinking">
        <Button variant="outline" className="mb-6 hover:bg-gray-50 transition-colors">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Geometrical Thinking
        </Button>
      </Link>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 opacity-90"></div>
        <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Shapes className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">Geometrical Thinking Activities</h1>
          <p className="text-xl text-white/90 text-center max-w-3xl mx-auto leading-relaxed">
            Practical activities designed to enhance spatial reasoning, geometric properties, and problem-solving skills
            through hands-on exploration.
          </p>
        </div>
      </div>

      {/* Activities Accordion */}
      <Card className="border-2 border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
          <CardTitle className="text-2xl text-purple-700 flex items-center space-x-2">
            <Shapes className="h-6 w-6" />
            <span>Spatial Reasoning Activities</span>
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Explore geometry through {activities.length} interactive and hands-on activities
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="space-y-4">
            {activities.map((activity) => {
              const IconComponent = activity.icon
              return (
                <AccordionItem
                  key={activity.id}
                  value={activity.id}
                  className="border-2 border-gray-200 rounded-lg px-4 hover:border-purple-300 transition-colors"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center space-x-4 w-full">
                      <div className={`p-3 bg-gradient-to-r ${activity.color} rounded-lg text-white shadow-lg`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-lg font-semibold text-gray-800">{activity.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getDifficultyColor(activity.difficulty)}>{activity.difficulty}</Badge>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700">
                          {activity.time}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6">
                    <div className="space-y-6">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">🎯 Learning Objective</h4>
                        <p className="text-gray-700">{activity.description}</p>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2 flex items-center">🧰 Materials Needed</h4>
                        <p className="text-gray-700">{activity.materials}</p>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                          📋 Step-by-Step Procedure
                        </h4>
                        <ol className="space-y-2 text-gray-700">
                          {activity.procedure.map((step, index) => (
                            <li key={index} className="flex">
                              {step.startsWith("-") ? (
                                <div className="flex">
                                  <span className="mr-3 text-green-600">•</span>
                                  <span>{step.substring(1).trim()}</span>
                                </div>
                              ) : (
                                <div className="flex">
                                  <span className="mr-3 font-semibold text-green-600 min-w-[24px]">
                                    {step.match(/^\d+\./) ? "" : `${index + 1}.`}
                                  </span>
                                  <span>{step}</span>
                                </div>
                              )}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </CardContent>
      </Card>

      {/* Geometry Tools Section */}
      <div className="mt-8 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-200">
        <h2 className="text-xl font-bold text-center mb-4 text-violet-700">📐 Essential Geometry Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center space-y-2">
            <div className="text-2xl">📏</div>
            <div className="font-semibold text-violet-700">Rulers & Measuring Tools</div>
            <div className="text-gray-600">For accurate measurements and constructions</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-2xl">📐</div>
            <div className="font-semibold text-violet-700">Protractors & Compasses</div>
            <div className="text-gray-600">For angle measurement and circle construction</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-2xl">🔷</div>
            <div className="font-semibold text-violet-700">Shape Manipulatives</div>
            <div className="text-gray-600">For hands-on exploration and discovery</div>
          </div>
        </div>
      </div>
    </div>
  )
}
