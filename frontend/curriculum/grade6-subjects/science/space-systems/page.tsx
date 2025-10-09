"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/breadcrumb"
import { StandardsBadge } from "@/components/standards-badge"
import { Rocket, Star, Satellite } from "lucide-react"

export default function SpaceSystemsPage() {
  const breadcrumbItems = [
    { label: "Curriculum", href: "/curriculum" },
    { label: "Grade 6", href: "/curriculum/grade6-subjects" },
    { label: "Science", href: "/curriculum/grade6-subjects/science" },
    { label: "Space Systems", href: "/curriculum/grade6-subjects/science/space-systems" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mt-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Rocket className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Space Systems</h1>
            <p className="text-lg text-gray-600">Grade 6 Science Strand</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <StandardsBadge code="6.SS.1" description="Space Systems standards for Grade 6 Science" subject="Science" grade="6" strand="Space Systems" />
          <StandardsBadge code="6.SS.2" description="Space Systems standards for Grade 6 Science" subject="Science" grade="6" strand="Space Systems" />
          <StandardsBadge code="6.SS.3" description="Space Systems standards for Grade 6 Science" subject="Science" grade="6" strand="Space Systems" />
          <StandardsBadge code="6.SS.4" description="Space Systems standards for Grade 6 Science" subject="Science" grade="6" strand="Space Systems" />
        </div>
      </div>

      <div className="grid gap-8">
        {/* Curriculum Outcomes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-indigo-600" />
              Curriculum Outcomes
            </CardTitle>
            <CardDescription>
              Students will understand celestial objects, space exploration, and astronomical phenomena
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg mb-3">Solar System Structure</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Identify and describe characteristics of planets, moons, and other celestial bodies</li>
                <li>• Explain the organization and scale of the solar system</li>
                <li>• Understand the role of gravity in planetary motion</li>
                <li>• Compare and contrast different types of celestial objects</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-3">Earth-Moon-Sun System</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Explain the causes of day and night, seasons, and lunar phases</li>
                <li>• Understand tidal forces and their effects on Earth</li>
                <li>• Investigate solar and lunar eclipses</li>
                <li>• Describe the Moon's influence on Earth's systems</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-3">Stars and Galaxies</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Understand stellar formation, evolution, and death</li>
                <li>• Explain the structure and scale of galaxies</li>
                <li>• Investigate the expanding universe and Big Bang theory</li>
                <li>• Use astronomical tools and techniques for observation</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-3">Space Exploration and Technology</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Understand the history and future of space exploration</li>
                <li>• Investigate space technology and its applications</li>
                <li>• Explain the challenges of human space travel</li>
                <li>• Design solutions for space exploration problems</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Strategies */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment Strategies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Formative Assessment</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• Celestial object identification activities</li>
                <li>• Astronomical observation journals</li>
                <li>• Scale model construction exercises</li>
                <li>• Space mission planning activities</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Performance-Based Assessment</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• Create solar system models and presentations</li>
                <li>• Design space exploration missions</li>
                <li>• Build and test rocket prototypes</li>
                <li>• Conduct astronomical observations and analysis</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Differentiated Learning */}
        <Card>
          <CardHeader>
            <CardTitle>Differentiated Learning Approaches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Visual Learners</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Astronomical images and videos</li>
                  <li>• Solar system diagrams and charts</li>
                  <li>• Constellation maps and guides</li>
                  <li>• Space mission infographics</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Kinesthetic Learners</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Hands-on model building</li>
                  <li>• Telescope operation and observation</li>
                  <li>• Rocket construction and testing</li>
                  <li>• Planetary motion demonstrations</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Analytical Learners</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Astronomical calculations and measurements</li>
                  <li>• Data analysis from space missions</li>
                  <li>• Scale and distance computations</li>
                  <li>• Space technology research projects</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technology Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Satellite className="h-5 w-5 text-blue-600" />
              Technology Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Digital Tools</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Planetarium software and apps</li>
                  <li>• Virtual space exploration programs</li>
                  <li>• Astronomical simulation tools</li>
                  <li>• NASA and space agency resources</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Observation Technology</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Telescopes and binoculars</li>
                  <li>• Digital cameras for astrophotography</li>
                  <li>• Star charts and navigation tools</li>
                  <li>• Satellite tracking applications</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cross-Curricular Connections */}
        <Card>
          <CardHeader>
            <CardTitle>Cross-Curricular Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Badge variant="outline">Mathematics</Badge>
                </h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Scale, proportion, and astronomical distances</li>
                  <li>• Geometric principles in orbital mechanics</li>
                  <li>• Data analysis from space missions</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Badge variant="outline">Language Arts</Badge>
                </h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Science fiction literature connections</li>
                  <li>• Space exploration research writing</li>
                  <li>• Astronomical observation reporting</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Badge variant="outline">Social Studies</Badge>
                </h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• History of space exploration</li>
                  <li>• International space cooperation</li>
                  <li>• Cultural perspectives on astronomy</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Badge variant="outline">Arts</Badge>
                </h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Astronomical art and visualization</li>
                  <li>• Space-themed creative projects</li>
                  <li>• Constellation mythology and stories</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources and Materials */}
        <Card>
          <CardHeader>
            <CardTitle>Resources and Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Required Equipment</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Telescopes and observation tools</li>
                  <li>• Solar system model materials</li>
                  <li>• Star charts and constellation guides</li>
                  <li>• Rocket building supplies</li>
                  <li>• Astronomical measurement tools</li>
                  <li>• Digital cameras and recording devices</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Caribbean Context Resources</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Southern hemisphere constellation guides</li>
                  <li>• Tropical astronomy observation tips</li>
                  <li>• Caribbean space program information</li>
                  <li>• Hurricane satellite imagery studies</li>
                  <li>• Navigation history in the Caribbean</li>
                  <li>• Indigenous astronomical knowledge</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teacher Preparation */}
        <Card>
          <CardHeader>
            <CardTitle>Teacher Preparation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Content Knowledge Requirements</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Understanding of solar system structure and dynamics</li>
                  <li>• Knowledge of stellar evolution and galactic structure</li>
                  <li>• Familiarity with space exploration history and technology</li>
                  <li>• Basic astronomical observation techniques</li>
                  <li>• Safety procedures for telescope use and night observations</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Caribbean Context Integration</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Southern hemisphere sky visibility and seasonal changes</li>
                  <li>• Historical navigation methods used by Caribbean peoples</li>
                  <li>• Satellite technology applications in the region</li>
                  <li>• Space weather effects on Caribbean communications</li>
                  <li>• Opportunities for Caribbean participation in space science</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
