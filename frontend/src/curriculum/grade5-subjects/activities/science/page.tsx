import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, FlaskConical, Leaf, Globe, Star, Cog, Users } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

export default function Grade5ScienceActivitiesPage() {
  const activityStrands = [
    {
      title: "Structure and Properties of Matter",
      description: "Hands-on investigations exploring particle theory, conservation of mass, and material properties",
      icon: FlaskConical,
      href: "/curriculum/grade5-subjects/activities/science/structure-properties-matter",
      activities: [
        "Mystery Powder Investigation",
        "Conservation of Mass Chocolate Melt",
        "Design Your Own Separation Method",
      ],
      color: "emerald",
      image: "/placeholder.svg?height=200&width=300&text=Matter+Investigations",
    },
    {
      title: "Matter and Energy in Organisms and Ecosystems",
      description: "Ecosystem investigations, photosynthesis experiments, and food web analysis",
      icon: Leaf,
      href: "/curriculum/grade5-subjects/activities/science/matter-energy-organisms-ecosystems",
      activities: [
        "Build a School Ecosystem Terrarium",
        "Photosynthesis Olympic Games",
        "Community Food Web Investigation",
      ],
      color: "orange",
      image: "/placeholder.svg?height=200&width=300&text=Ecosystem+Studies",
    },
    {
      title: "Earth Systems",
      description: "Sphere interaction investigations, water distribution studies, and environmental solutions",
      icon: Globe,
      href: "/curriculum/grade5-subjects/activities/science/earth-systems",
      activities: [
        "Sphere Interaction Detective Work",
        "Water Distribution Simulation",
        "Pollution Solution Engineering",
      ],
      color: "sky",
      image: "/placeholder.svg?height=200&width=300&text=Earth+Systems",
    },
    {
      title: "Space Systems: Stars and the Solar System",
      description: "Astronomy observations, gravity experiments, and solar system investigations",
      icon: Star,
      href: "/curriculum/grade5-subjects/activities/science/space-systems-stars-solar-system",
      activities: ["Shadow Clock Construction Project", "Star Brightness Laboratory", "Gravity Demonstration Olympics"],
      color: "purple",
      image: "/placeholder.svg?height=200&width=300&text=Space+Investigations",
    },
    {
      title: "Engineering Design",
      description: "Design challenges, simple machine investigations, and problem-solving projects",
      icon: Cog,
      href: "/curriculum/grade5-subjects/activities/science/engineering-design",
      activities: ["Simple Machine Efficiency Challenge", "Circuit Design Challenge", "Structural Engineering Design"],
      color: "amber",
      image: "/placeholder.svg?height=200&width=300&text=Engineering+Projects",
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 5 Subjects", href: "/curriculum/grade5-subjects" },
          { label: "Science", href: "/curriculum/grade5-subjects/science" },
          { label: "Activities", href: "/curriculum/grade5-subjects/activities/science" },
        ]}
      />

      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-blue-700 flex items-center">
            <FlaskConical className="mr-2 h-7 w-7 text-blue-600" />
            Grade 5 Science Activities
          </h1>
          <p className="text-gray-700 text-lg mb-4">
            Engage students with hands-on investigations, real-world problem solving, and inquiry-based learning
            experiences across all five science strands.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Inquiry-Based Learning</Badge>
            <Badge variant="secondary">Hands-On Investigations</Badge>
            <Badge variant="secondary">Real-World Applications</Badge>
            <Badge variant="secondary">Caribbean Connections</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {activityStrands.map((strand, index) => {
          const IconComponent = strand.icon
          return (
            <Card
              key={index}
              className={`border-t-4 border-${strand.color}-500 shadow-md hover:shadow-lg transition-all duration-300 group`}
            >
              <CardHeader className={`bg-${strand.color}-50`}>
                <div className="flex items-center justify-between">
                  <IconComponent className={`h-8 w-8 text-${strand.color}-600`} />
                  <Badge variant="outline" className="text-xs">
                    3 Activities
                  </Badge>
                </div>
                <CardTitle
                  className={`text-${strand.color}-700 group-hover:text-${strand.color}-800 transition-colors`}
                >
                  {strand.title}
                </CardTitle>
                <CardDescription>{strand.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="mb-4">
                  <img src="" alt="" className="w-auto h-auto" />
                </div>
                <div className="space-y-2 mb-4">
                  <h4 className="font-semibold text-sm">Featured Activities:</h4>
                  <ul className="text-xs space-y-1">
                    {strand.activities.map((activity, actIndex) => (
                      <li key={actIndex} className="flex items-center">
                        <div className={`w-2 h-2 bg-${strand.color}-400 rounded-full mr-2`}></div>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to={strand.href}>
                  <Button className={`w-full bg-${strand.color}-600 hover:bg-${strand.color}-700`}>
                    Explore Activities
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-indigo-500">
          <CardHeader className="bg-indigo-50">
            <CardTitle className="text-indigo-700 flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Cross-Strand Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-sm mb-4">
              Connect learning across multiple science strands with comprehensive projects that demonstrate the
              interconnected nature of scientific concepts.
            </p>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Integration Projects:</h4>
              <ul className="text-xs space-y-1">
                <li>• Community Science Fair Project</li>
                <li>• Water Quality Monitoring</li>
                <li>• Solar Oven Design Challenge</li>
                <li>• Weather Station Construction</li>
              </ul>
            </div>
            <Link to="/curriculum/grade5-subjects/activities/science/cross-strand-integration">
              <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700">View Integration Projects</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-green-500">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-700">Implementation Support</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm mb-1">Safety Guidelines</h4>
                <p className="text-xs text-gray-600">Comprehensive safety protocols for all laboratory activities</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Material Lists</h4>
                <p className="text-xs text-gray-600">Complete equipment and supply requirements for each activity</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Assessment Rubrics</h4>
                <p className="text-xs text-gray-600">Detailed evaluation criteria for student performance</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">Differentiation Strategies</h4>
                <p className="text-xs text-gray-600">Adaptations for diverse learning needs and abilities</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Implementation Timeline</CardTitle>
          <CardDescription>Suggested pacing and sequencing for Grade 5 science activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-blue-600">Term 1 (Sept-Dec)</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <FlaskConical className="h-4 w-4 mr-2 text-emerald-500" />
                  Structure and Properties of Matter
                </li>
                <li className="flex items-center">
                  <Leaf className="h-4 w-4 mr-2 text-orange-500" />
                  Matter and Energy in Ecosystems
                </li>
                <li className="text-xs text-gray-600 ml-6">Focus: Foundation concepts and ecosystem investigations</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-blue-600">Term 2 (Jan-Mar)</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-sky-500" />
                  Earth Systems
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-purple-500" />
                  Space Systems
                </li>
                <li className="text-xs text-gray-600 ml-6">Focus: Earth and space science investigations</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-blue-600">Term 3 (Apr-June)</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Cog className="h-4 w-4 mr-2 text-amber-500" />
                  Engineering Design
                </li>
                <li className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-indigo-500" />
                  Cross-Strand Integration
                </li>
                <li className="text-xs text-gray-600 ml-6">Focus: Design thinking and synthesis projects</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
