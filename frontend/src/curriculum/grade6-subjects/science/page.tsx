import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Atom, Zap, Dna, Radio, Magnet, Globe, Rocket, BookOpen } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade6SciencePage() {
  const scienceStrands = [
    {
      title: "Structure and Properties of Matter",
      description: "Investigate atomic structure, chemical properties, and material behavior",
      icon: Atom,
      href: "/curriculum/grade6-subjects/science/structure-properties-matter",
      color: "bg-purple-100 text-purple-700",
      topics: ["Atomic Structure", "Chemical Properties", "Material Behavior", "Molecular Motion"],
    },
    {
      title: "Chemical Reactions",
      description: "Explore chemical changes, conservation of mass, and reaction evidence",
      icon: Zap,
      href: "/curriculum/grade6-subjects/science/chemical-reactions",
      color: "bg-orange-100 text-orange-700",
      topics: ["Chemical Changes", "Conservation of Mass", "Reaction Evidence", "Energy Transfer"],
    },
    {
      title: "Inheritance and Variation of Traits",
      description: "Study heredity, genetic variation, and environmental influences on traits",
      icon: Dna,
      href: "/curriculum/grade6-subjects/science/inheritance-variation",
      color: "bg-green-100 text-green-700",
      topics: ["Heredity", "Genetic Variation", "Environmental Factors", "Life Cycles"],
    },
    {
      title: "Waves and Electromagnetic Radiation",
      description: "Understand wave properties, electromagnetic spectrum, and energy transfer",
      icon: Radio,
      href: "/curriculum/grade6-subjects/science/waves-electromagnetic",
      color: "bg-blue-100 text-blue-700",
      topics: ["Wave Properties", "Electromagnetic Spectrum", "Energy Transfer", "Communication"],
    },
    {
      title: "Forces and Interactions",
      description: "Analyze forces, motion, and gravitational interactions in systems",
      icon: Magnet,
      href: "/curriculum/grade6-subjects/science/forces-interactions",
      color: "bg-red-100 text-red-700",
      topics: ["Force and Motion", "Gravitational Forces", "Magnetic Forces", "Electric Forces"],
    },
    {
      title: "Earth Systems",
      description: "Examine Earth's spheres, climate patterns, and natural resources",
      icon: Globe,
      href: "/curriculum/grade6-subjects/science/earth-systems",
      color: "bg-cyan-100 text-cyan-700",
      topics: ["Earth's Spheres", "Climate Patterns", "Natural Resources", "Human Impact"],
    },
    {
      title: "Space Systems",
      description: "Explore solar system objects, gravity, and scale relationships",
      icon: Rocket,
      href: "/curriculum/grade6-subjects/science/space-systems",
      color: "bg-indigo-100 text-indigo-700",
      topics: ["Solar System", "Gravity", "Scale Relationships", "Space Exploration"],
    },
  ]

  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade6-subjects">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 6 Subjects
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-blue-700 flex items-center">
            <BookOpen className="mr-2 h-7 w-7 text-blue-600" />
            Grade 6 Science Curriculum
          </h1>
          <p className="text-gray-700 text-lg mb-4">
            Explore the natural world through inquiry-based investigations, developing scientific thinking skills and
            understanding of fundamental science concepts across multiple disciplines.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Physical Science</Badge>
            <Badge variant="secondary">Life Science</Badge>
            <Badge variant="secondary">Earth Science</Badge>
            <Badge variant="secondary">Space Science</Badge>
            <Badge variant="secondary">Scientific Inquiry</Badge>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <Card className="border-t-4 border-blue-500">
          <CardHeader>
            <CardTitle className="text-blue-700">Science Learning Approach</CardTitle>
            <CardDescription>
              Grade 6 science emphasizes hands-on investigations, critical thinking, and real-world applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-700 mb-2">Inquiry-Based Learning</h3>
                <p className="text-sm text-gray-600">
                  Students ask questions, design investigations, and draw conclusions from evidence
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-700 mb-2">Cross-Curricular Connections</h3>
                <p className="text-sm text-gray-600">
                  Integrate mathematics, technology, and language arts with scientific concepts
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-700 mb-2">Real-World Applications</h3>
                <p className="text-sm text-gray-600">
                  Connect scientific principles to everyday life and Caribbean environmental contexts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scienceStrands.map((strand, index) => {
          const IconComponent = strand.icon
          return (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-300 border-t-4 border-gray-200 hover:border-blue-400"
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${strand.color} flex items-center justify-center mb-3`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{strand.title}</CardTitle>
                <CardDescription className="text-sm">{strand.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Key Topics:</h4>
                    <div className="flex flex-wrap gap-1">
                      {strand.topics.map((topic, topicIndex) => (
                        <Badge key={topicIndex} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Link href={strand.href}>
                    <Button className="w-full mt-4" variant="outline">
                      Explore Strand
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Science Activities & Investigations</CardTitle>
            <CardDescription>Hands-on learning experiences designed for Grade 6 students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Link href="/curriculum/grade6-subjects/activities/science">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <BookOpen className="mr-2 h-5 w-5" />
                  View Science Activities
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
