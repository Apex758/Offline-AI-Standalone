"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/breadcrumb"
import { StandardsBadge } from "@/components/standards-badge"
import { Zap, ArrowUpDown, Battery } from "lucide-react"

export default function ForcesInteractionsPage() {
  const breadcrumbItems = [
    { label: "Curriculum", href: "/curriculum" },
    { label: "Grade 6", href: "/curriculum/grade6-subjects" },
    { label: "Science", href: "/curriculum/grade6-subjects/science" },
    { label: "Forces and Interactions", href: "/curriculum/grade6-subjects/science/forces-interactions" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mt-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <Zap className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Forces and Interactions</h1>
            <p className="text-lg text-gray-600">Grade 6 Science Strand</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <StandardsBadge code="6.FI.1" description="Forces and Interactions standards for Grade 6 Science" subject="Science" grade="6" strand="Forces and Interactions" />
          <StandardsBadge code="6.FI.2" description="Forces and Interactions standards for Grade 6 Science" subject="Science" grade="6" strand="Forces and Interactions" />
          <StandardsBadge code="6.FI.3" description="Forces and Interactions standards for Grade 6 Science" subject="Science" grade="6" strand="Forces and Interactions" />
          <StandardsBadge code="6.FI.4" description="Forces and Interactions standards for Grade 6 Science" subject="Science" grade="6" strand="Forces and Interactions" />
        </div>
      </div>

      <div className="grid gap-8">
        {/* Curriculum Outcomes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5 text-red-600" />
              Curriculum Outcomes
            </CardTitle>
            <CardDescription>Students will understand forces, motion, and electromagnetic interactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg mb-3">Forces and Motion</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Identify and describe different types of forces (contact and non-contact)</li>
                <li>• Explain the relationship between force, mass, and acceleration</li>
                <li>• Investigate balanced and unbalanced forces</li>
                <li>• Apply Newton's laws of motion to everyday situations</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-3">Gravitational Forces</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Understand gravity as a universal force</li>
                <li>• Explain how gravitational force depends on mass and distance</li>
                <li>• Investigate weight vs. mass concepts</li>
                <li>• Describe gravitational effects on objects and celestial bodies</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-3">Electric and Magnetic Forces</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Investigate static electricity and electric charges</li>
                <li>• Explore magnetic fields and magnetic materials</li>
                <li>• Understand the relationship between electricity and magnetism</li>
                <li>• Design and test simple electric circuits</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-3">Applied Forces in Technology</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Analyze forces in simple machines and tools</li>
                <li>• Understand electromagnetic applications in technology</li>
                <li>• Investigate forces in transportation systems</li>
                <li>• Design solutions using force and motion principles</li>
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
                <li>• Force identification and classification activities</li>
                <li>• Motion prediction and testing exercises</li>
                <li>• Circuit building and troubleshooting</li>
                <li>• Magnetic field mapping investigations</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Performance-Based Assessment</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• Design and test force-measuring devices</li>
                <li>• Create electromagnetic demonstrations</li>
                <li>• Build and evaluate simple machines</li>
                <li>• Investigate local transportation forces</li>
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
                  <li>• Force diagrams and vectors</li>
                  <li>• Motion graphs and charts</li>
                  <li>• Magnetic field visualizations</li>
                  <li>• Circuit diagrams and schematics</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Kinesthetic Learners</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Hands-on force experiments</li>
                  <li>• Building and testing machines</li>
                  <li>• Magnetic material investigations</li>
                  <li>• Circuit construction activities</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Analytical Learners</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Force calculations and problems</li>
                  <li>• Data analysis from experiments</li>
                  <li>• Electrical measurements</li>
                  <li>• Mathematical modeling</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technology Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Battery className="h-5 w-5 text-blue-600" />
              Technology Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Digital Tools</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Force and motion simulation software</li>
                  <li>• Circuit design and testing apps</li>
                  <li>• Data logging for experiments</li>
                  <li>• Virtual physics laboratories</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Measurement Technology</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Digital force meters and scales</li>
                  <li>• Multimeters for electrical measurements</li>
                  <li>• Motion sensors and timers</li>
                  <li>• Magnetic field detectors</li>
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
                  <li>• Force calculations and equations</li>
                  <li>• Graphing motion and relationships</li>
                  <li>• Geometric principles in forces</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Badge variant="outline">Language Arts</Badge>
                </h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Scientific explanation writing</li>
                  <li>• Technology impact research</li>
                  <li>• Procedure documentation</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Badge variant="outline">Social Studies</Badge>
                </h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Transportation development history</li>
                  <li>• Technology impact on society</li>
                  <li>• Energy resources in the Caribbean</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Badge variant="outline">Physical Education</Badge>
                </h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Forces in sports and movement</li>
                  <li>• Biomechanics applications</li>
                  <li>• Equipment design principles</li>
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
                  <li>• Spring scales and force meters</li>
                  <li>• Magnets (bar, horseshoe, disc)</li>
                  <li>• Electric circuit components</li>
                  <li>• Batteries and power sources</li>
                  <li>• Pulleys, levers, and inclined planes</li>
                  <li>• Compass and iron filings</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Caribbean Applications</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Hurricane wind force studies</li>
                  <li>• Solar panel and wind turbine examples</li>
                  <li>• Local transportation analysis</li>
                  <li>• Seismic activity and forces</li>
                  <li>• Marine vessel propulsion systems</li>
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
                  <li>• Understanding of Newton's laws of motion</li>
                  <li>• Knowledge of electromagnetic principles</li>
                  <li>• Familiarity with simple machines</li>
                  <li>• Basic electrical circuit concepts</li>
                  <li>• Safety procedures for electrical experiments</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Caribbean Context Integration</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Local renewable energy projects</li>
                  <li>• Transportation challenges in island nations</li>
                  <li>• Natural disaster preparedness and forces</li>
                  <li>• Traditional Caribbean tools and machines</li>
                  <li>• Marine and coastal engineering examples</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
