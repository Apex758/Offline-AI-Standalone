import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Ruler, Scale, CuboidIcon as Cube, Target, Triangle, BarChart } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Grade5MathematicsMeasurementActivitiesPage() {
  const activities = [
    {
      id: "conversions",
      title: "Unit Conversion Challenge",
      icon: Scale,
      difficulty: "Medium",
      time: "45 mins",
      color: "from-blue-500 to-cyan-500",
      description:
        "Hands-on measurement activities with real objects, conversion problem-solving tasks, and real-world measurement applications.",
      materials: "Rulers, measuring tapes, scales, graduated cylinders, conversion charts, worksheets",
      procedure: [
        "Provide learners with a variety of measurement tools, including rulers, measuring tapes, scales, and graduated cylinders.",
        "Have learners engage in hands-on measurement activities with real objects, such as measuring the length of a table, the mass of a book, or the volume of water in a container.",
        "Present learners with conversion problem-solving tasks, such as converting meters to centimeters or kilograms to grams.",
        "Have learners apply their measurement skills to real-world scenarios, such as calculating the amount of fabric needed to make a curtain or the amount of paint needed to cover a wall.",
      ],
    },
    {
      id: "volume",
      title: "Volume Calculation Projects",
      icon: Cube,
      difficulty: "Hard",
      time: "60 mins",
      color: "from-green-500 to-emerald-500",
      description:
        "Volume calculation projects using manipulatives, real-world measurement applications, and estimation and measurement accuracy challenges.",
      materials: "Unit cubes, rectangular prisms, measuring tools, calculators, worksheets",
      procedure: [
        "Provide learners with unit cubes and rectangular prisms of various sizes.",
        "Have learners calculate the volume of the rectangular prisms by counting the number of unit cubes they contain.",
        "Present learners with real-world measurement applications, such as calculating the volume of a room or a swimming pool.",
        "Challenge learners to estimate the volume of different objects and then measure them to check their accuracy.",
      ],
    },
    {
      id: "area-perimeter",
      title: "Area & Perimeter Investigations",
      icon: Triangle,
      difficulty: "Medium",
      time: "50 mins",
      color: "from-purple-500 to-indigo-500",
      description:
        "Real-world measurement applications, estimation and measurement accuracy challenges, and portfolio of measurement investigations.",
      materials: "Rulers, measuring tapes, graph paper, worksheets",
      procedure: [
        "Provide learners with rulers and measuring tapes.",
        "Have learners measure the dimensions of various objects in the classroom, such as desks, tables, and bulletin boards.",
        "Instruct learners to calculate the area and perimeter of the objects using the appropriate formulas.",
        "Present learners with real-world measurement applications, such as calculating the amount of fencing needed to enclose a garden or the amount of carpet needed to cover a floor.",
        "Challenge learners to estimate the area and perimeter of different objects and then measure them to check their accuracy.",
        "Have learners create a portfolio of their measurement investigations, including diagrams, calculations, and explanations.",
      ],
    },
    {
      id: "tools-estimation",
      title: "Tools & Estimation Mastery",
      icon: Ruler,
      difficulty: "Medium",
      time: "40 mins",
      color: "from-orange-500 to-red-500",
      description:
        "Hands-on measurement activities with real objects, conversion problem-solving tasks, and real-world measurement applications.",
      materials: "Various measuring tools, objects to measure, conversion charts, worksheets",
      procedure: [
        "Provide learners with a variety of measuring tools, including rulers, measuring tapes, scales, and graduated cylinders.",
        "Have learners engage in hands-on measurement activities with real objects, such as measuring the length of a table, the mass of a book, or the volume of water in a container.",
        "Present learners with conversion problem-solving tasks, such as converting meters to centimeters or kilograms to grams.",
        "Have learners apply their measurement skills to real-world scenarios, such as calculating the amount of fabric needed to make a curtain or the amount of paint needed to cover a wall.",
      ],
    },
    {
      id: "angles",
      title: "Angle Estimation Challenge",
      icon: Target,
      difficulty: "Easy",
      time: "30 mins",
      color: "from-pink-500 to-rose-500",
      description:
        "Students estimate and measure angles in the classroom, improving their angle sense and measurement skills.",
      materials: "Protractors, rulers, angle estimation worksheets",
      procedure: [
        "Provide students with protractors and rulers.",
        "Have students estimate the measure of various angles in the classroom (e.g., corners of desks, doors, windows).",
        "Instruct students to measure the angles using the protractors and record their measurements.",
        "Have students compare their estimates with the actual measurements and calculate the difference.",
      ],
    },
    {
      id: "design",
      title: "Perimeter and Area Design Project",
      icon: BarChart,
      difficulty: "Hard",
      time: "55 mins",
      color: "from-teal-500 to-blue-500",
      description:
        "Students design a garden or room layout with specific area and perimeter requirements, applying their measurement skills to a creative design project.",
      materials: "Graph paper, rulers, colored pencils, design templates",
      procedure: [
        "Provide students with graph paper and rulers.",
        "Have students design a garden or room layout with specific area and perimeter requirements.",
        "Instruct students to draw the layout on the graph paper, ensuring that the dimensions meet the requirements.",
        "Have students calculate the area and perimeter of their design and label the dimensions.",
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
          { label: "Measurement", href: "/curriculum/grade5-subjects/activities/mathematics/measurement" },
        ]}
      />

      <Link href="/curriculum/grade5-subjects/mathematics/measurement">
        <Button variant="outline" className="mb-6 hover:bg-gray-50 transition-colors">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Measurement
        </Button>
      </Link>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-pink-600 to-purple-600 opacity-90"></div>
        <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Ruler className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">Measurement Activities</h1>
          <p className="text-xl text-white/90 text-center max-w-3xl mx-auto leading-relaxed">
            Hands-on activities and projects designed to enhance your understanding of measurement concepts and
            practical applications.
          </p>
        </div>
      </div>

      {/* Activities Accordion */}
      <Card className="border-2 border-rose-200">
        <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50">
          <CardTitle className="text-2xl text-rose-700 flex items-center space-x-2">
            <Ruler className="h-6 w-6" />
            <span>Measurement Mastery Activities</span>
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Build measurement skills through {activities.length} practical and engaging activities
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
                  className="border-2 border-gray-200 rounded-lg px-4 hover:border-rose-300 transition-colors"
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
                        <Badge variant="outline" className="bg-rose-50 text-rose-700">
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
                              <span className="mr-3 font-semibold text-green-600 min-w-[24px]">{index + 1}.</span>
                              <span>{step}</span>
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

      {/* Measurement Units Reference */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
        <h2 className="text-xl font-bold text-center mb-4 text-blue-700">📏 Measurement Reference Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-700 mb-2">Length/Distance</h3>
            <div className="space-y-1 text-gray-600">
              <div>• Millimeter (mm)</div>
              <div>• Centimeter (cm)</div>
              <div>• Meter (m)</div>
              <div>• Kilometer (km)</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-700 mb-2">Mass/Weight</h3>
            <div className="space-y-1 text-gray-600">
              <div>• Gram (g)</div>
              <div>• Kilogram (kg)</div>
              <div>• Pound (lb)</div>
              <div>• Ounce (oz)</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-700 mb-2">Volume/Capacity</h3>
            <div className="space-y-1 text-gray-600">
              <div>• Milliliter (ml)</div>
              <div>• Liter (L)</div>
              <div>• Cup (c)</div>
              <div>• Gallon (gal)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
