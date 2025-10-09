"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/breadcrumb"
import Link from "next/link"
import { Clock, Users, Target, Beaker, Zap, Globe, Microscope, Atom, Waves, Rocket } from "lucide-react"

const scienceActivities = [
  {
    id: "structure-properties-matter",
    title: "Structure and Properties of Matter",
    description: "Hands-on investigations of atomic structure, molecular models, and material properties",
    icon: <Atom className="h-6 w-6" />,
    duration: "60-75 minutes",
    activities: ["Building Atomic Models with Marshmallows", "Synthetic vs. Natural Materials Investigation"],
    skills: ["Molecular modeling", "Material testing", "Data analysis"],
    realWorld: "Medicine development, material engineering, nanotechnology",
  },
  {
    id: "chemical-reactions",
    title: "Chemical Reactions",
    description: "Quantitative analysis of chemical changes and energy transformations",
    icon: <Beaker className="h-6 w-6" />,
    duration: "50-75 minutes",
    activities: ["Baking Soda and Vinegar Quantitative Analysis", "Steel Wool Oxidation Energy Investigation"],
    skills: ["Chemical analysis", "Energy measurement", "Conservation laws"],
    realWorld: "Industrial chemistry, corrosion prevention, energy storage",
  },
  {
    id: "inheritance-variation",
    title: "Inheritance, Variation and Life Cycles",
    description: "Long-term studies of life cycles, genetics, and reproduction",
    icon: <Microscope className="h-6 w-6" />,
    duration: "3-4 weeks + daily observations",
    activities: ["Complete Butterfly Life Cycle Investigation", "Plant Reproduction and Pollination Laboratory"],
    skills: ["Long-term observation", "Data tracking", "Life cycle analysis"],
    realWorld: "Agriculture, conservation biology, pest management",
  },
  {
    id: "waves-electromagnetic-radiation",
    title: "Waves and Electromagnetic Radiation",
    description: "Comprehensive wave properties and sound transmission studies",
    icon: <Waves className="h-6 w-6" />,
    duration: "75-90 minutes",
    activities: ["Wave Properties Investigation", "Sound Wave Transmission and Properties"],
    skills: ["Wave measurement", "Frequency analysis", "Engineering design"],
    realWorld: "Communication technology, medical imaging, earthquake detection",
  },
  {
    id: "forces-interactions",
    title: "Forces and Interactions",
    description: "Newton's laws, collision dynamics, and electromagnetic forces",
    icon: <Zap className="h-6 w-6" />,
    duration: "80-90 minutes",
    activities: [
      "Newton's Third Law Action-Reaction Investigation",
      "Collision Dynamics and Momentum Conservation",
      "Electromagnetic Force Investigation",
    ],
    skills: ["Force measurement", "Mathematical modeling", "Safety analysis"],
    realWorld: "Vehicle safety, space technology, transportation systems",
  },
  {
    id: "matter-energy-organisms",
    title: "Matter and Energy in Organisms and Ecosystems",
    description: "Population dynamics, competition, and ecosystem interactions",
    icon: <Globe className="h-6 w-6" />,
    duration: "75-90 minutes + ongoing monitoring",
    activities: ["Predator-Prey Population Dynamics Simulation", "Ecosystem Resource Competition Investigation"],
    skills: ["Population modeling", "Statistical analysis", "Systems thinking"],
    realWorld: "Wildlife management, agriculture, conservation planning",
  },
  {
    id: "interdependent-relationships",
    title: "Interdependent Relationships in Ecosystems",
    description: "Symbiosis, food webs, and ecosystem stability studies",
    icon: <Globe className="h-6 w-6" />,
    duration: "80-90 minutes",
    activities: ["Symbiotic Relationships Investigation Laboratory", "Food Web Disruption and Cascade Effects"],
    skills: ["Relationship analysis", "Network thinking", "Impact assessment"],
    realWorld: "Ecosystem restoration, invasive species management, biodiversity conservation",
  },
  {
    id: "energy",
    title: "Energy",
    description: "Kinetic energy, potential energy, and thermal energy investigations",
    icon: <Zap className="h-6 w-6" />,
    duration: "85-100 minutes",
    activities: [
      "Kinetic Energy Quantitative Investigation",
      "Potential Energy and Energy Transformations",
      "Thermal Energy Transfer Engineering Challenge",
    ],
    skills: ["Energy calculations", "Engineering design", "Efficiency optimization"],
    realWorld: "Renewable energy, building design, transportation efficiency",
  },
  {
    id: "space-systems",
    title: "Space Systems",
    description: "Solar system scale, gravitational forces, and orbital mechanics",
    icon: <Rocket className="h-6 w-6" />,
    duration: "85-95 minutes",
    activities: ["Solar System Scale Investigation and Modeling", "Gravitational Forces and Orbital Mechanics"],
    skills: ["Scale modeling", "Mathematical analysis", "Space technology"],
    realWorld: "Space exploration, satellite technology, astronomy",
  },
  {
    id: "history-earth",
    title: "History of the Earth",
    description: "Continental drift evidence and plate tectonic processes",
    icon: <Globe className="h-6 w-6" />,
    duration: "85-90 minutes",
    activities: ["Continental Drift Evidence Analysis", "Plate Tectonics and Earth Processes Investigation"],
    skills: ["Evidence analysis", "Geological modeling", "Historical thinking"],
    realWorld: "Natural hazard prediction, mineral exploration, climate understanding",
  },
  {
    id: "earth-systems",
    title: "Earth Systems",
    description: "Water cycle quantification and resource management studies",
    icon: <Globe className="h-6 w-6" />,
    duration: "95-100 minutes + ongoing monitoring",
    activities: ["Water Cycle Quantitative Investigation", "Earth's Resources and Human Impact Investigation"],
    skills: ["Systems analysis", "Resource assessment", "Sustainability planning"],
    realWorld: "Water management, environmental protection, sustainable development",
  },
]

export default function Grade6ScienceActivitiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 6 Subjects", href: "/curriculum/grade6-subjects" },
          { label: "Science Activities", href: "/curriculum/grade6-subjects/activities/science" },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Grade 6 Science Activities</h1>
        <p className="text-xl text-gray-600 mb-6">
          Comprehensive hands-on investigations designed to build deep understanding of scientific concepts through
          inquiry-based learning and real-world applications.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Activity Features</h3>
          <div className="grid md:grid-cols-2 gap-4 text-blue-800">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              <span>Inquiry-based investigations with clear learning objectives</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>Collaborative learning with differentiated support</span>
            </div>
            <div className="flex items-center gap-2">
              <Beaker className="h-5 w-5" />
              <span>Hands-on experiments with quantitative analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <span>Caribbean context and real-world applications</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        {scienceActivities.map((strand) => (
          <Card key={strand.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">{strand.icon}</div>
                  <div>
                    <CardTitle className="text-2xl text-gray-900">{strand.title}</CardTitle>
                    <CardDescription className="text-gray-600 mt-1">{strand.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{strand.duration}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Key Activities</h4>
                  <ul className="space-y-2">
                    {strand.activities.map((activity, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Skills Developed</h4>
                  <div className="flex flex-wrap gap-2">
                    {strand.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Real-World Applications</h4>
                  <p className="text-gray-600 text-sm">{strand.realWorld}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link href={`/curriculum/grade6-subjects/activities/science/${strand.id}`}>
                  <Button className="w-full sm:w-auto">Explore {strand.title} Activities</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Assessment and Differentiation</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Assessment Strategies</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Performance-based assessment through practical application</li>
              <li>• Portfolio development showing learning progression</li>
              <li>• Collaborative project evaluation</li>
              <li>• Real-time formative assessment during investigations</li>
              <li>• Student reflection and self-assessment</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Differentiation Support</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Visual supports and multilingual resources</li>
              <li>• Flexible timing and alternative recording methods</li>
              <li>• Extension investigations for advanced learners</li>
              <li>• Collaborative grouping strategies</li>
              <li>• Technology integration and assistive tools</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
