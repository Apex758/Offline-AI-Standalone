"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/breadcrumb"
import { StandardsBadge } from "@/components/standards-badge"
import { Waves, Radio, Smartphone } from "lucide-react"

export default function WavesElectromagneticRadiationPage() {
  const breadcrumbItems = [
    { label: "Curriculum", href: "/curriculum" },
    { label: "Grade 6", href: "/curriculum/grade6-subjects" },
    { label: "Science", href: "/curriculum/grade6-subjects/science" },
    {
      label: "Waves and Electromagnetic Radiation",
      href: "/curriculum/grade6-subjects/science/waves-electromagnetic-radiation",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mt-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Waves className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Waves and Electromagnetic Radiation</h1>
            <p className="text-lg text-gray-600">Grade 6 Science Strand</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <StandardsBadge code="6.WER.1" description="Waves and Electromagnetic Radiation standards for Grade 6 Science" subject="Science" grade="6" strand="Waves and Electromagnetic Radiation" />
          <StandardsBadge code="6.WER.2" description="Waves and Electromagnetic Radiation standards for Grade 6 Science" subject="Science" grade="6" strand="Waves and Electromagnetic Radiation" />
          <StandardsBadge code="6.WER.3" description="Waves and Electromagnetic Radiation standards for Grade 6 Science" subject="Science" grade="6" strand="Waves and Electromagnetic Radiation" />
          <StandardsBadge code="6.WER.4" description="Waves and Electromagnetic Radiation standards for Grade 6 Science" subject="Science" grade="6" strand="Waves and Electromagnetic Radiation" />
        </div>
      </div>

      <div className="grid gap-8">
        {/* Curriculum Outcomes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-purple-600" />
              Curriculum Outcomes
            </CardTitle>
            <CardDescription>
              Students will understand wave properties and electromagnetic radiation applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg mb-3">Wave Properties and Behavior</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Identify and describe properties of waves (amplitude, wavelength, frequency)</li>
                <li>• Explain how waves transfer energy without transferring matter</li>
                <li>• Compare and contrast mechanical and electromagnetic waves</li>
                <li>• Demonstrate wave reflection, refraction, and absorption</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-3">Electromagnetic Spectrum</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Identify different types of electromagnetic radiation</li>
                <li>• Explain the relationship between wavelength, frequency, and energy</li>
                <li>• Describe applications of different electromagnetic waves</li>
                <li>• Understand the role of electromagnetic radiation in communication</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-3">Light and Vision</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Explain how light interacts with different materials</li>
                <li>• Describe how the human eye detects light</li>
                <li>• Investigate color formation and perception</li>
                <li>• Apply understanding of light to optical technologies</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-3">Communication Technologies</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Explain how electromagnetic waves enable wireless communication</li>
                <li>• Compare different communication technologies (radio, TV, cell phones)</li>
                <li>• Understand the impact of communication technology on Caribbean society</li>
                <li>• Design simple communication devices using wave principles</li>
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
                <li>• Wave property identification activities</li>
                <li>• Electromagnetic spectrum sorting exercises</li>
                <li>• Light behavior prediction tasks</li>
                <li>• Communication technology analysis</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Performance-Based Assessment</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• Design and test simple optical devices</li>
                <li>• Create electromagnetic spectrum presentations</li>
                <li>• Build wave demonstration models</li>
                <li>• Investigate local communication infrastructure</li>
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
                  <li>• Wave animation videos</li>
                  <li>• Electromagnetic spectrum charts</li>
                  <li>• Light ray diagrams</li>
                  <li>• Technology infographics</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Kinesthetic Learners</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Wave rope demonstrations</li>
                  <li>• Prism light experiments</li>
                  <li>• Mirror and lens activities</li>
                  <li>• Communication device building</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Auditory Learners</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Sound wave investigations</li>
                  <li>• Radio frequency explorations</li>
                  <li>• Group discussions on technology</li>
                  <li>• Peer explanations of concepts</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technology Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-blue-600" />
              Technology Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Digital Tools</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Wave simulation software</li>
                  <li>• Spectrum analysis apps</li>
                  <li>• Virtual optics labs</li>
                  <li>• Communication technology research</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Hands-on Technology</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Digital cameras for light studies</li>
                  <li>• Smartphones for wave apps</li>
                  <li>• LED and laser demonstrations</li>
                  <li>• Radio and communication devices</li>
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
                  <li>• Wave calculations and graphing</li>
                  <li>• Frequency and wavelength relationships</li>
                  <li>• Geometric optics and angles</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Badge variant="outline">Language Arts</Badge>
                </h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Scientific communication writing</li>
                  <li>• Technology impact essays</li>
                  <li>• Research presentations</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Badge variant="outline">Social Studies</Badge>
                </h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Communication technology history</li>
                  <li>• Impact on Caribbean development</li>
                  <li>• Global connectivity studies</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Badge variant="outline">Arts</Badge>
                </h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Color theory and light</li>
                  <li>• Photography and optics</li>
                  <li>• Sound and music waves</li>
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
                  <li>• Wave demonstration rope</li>
                  <li>• Prisms and lenses</li>
                  <li>• Mirrors (plane and curved)</li>
                  <li>• LED lights and lasers</li>
                  <li>• Radio and communication devices</li>
                  <li>• Spectrum tubes and viewers</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Recommended Resources</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Caribbean telecommunications case studies</li>
                  <li>• Local radio station visits</li>
                  <li>• Optical fiber demonstrations</li>
                  <li>• Satellite communication examples</li>
                  <li>• Solar energy applications</li>
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
                  <li>• Understanding of wave properties and behavior</li>
                  <li>• Knowledge of electromagnetic spectrum</li>
                  <li>• Familiarity with optical principles</li>
                  <li>• Awareness of communication technologies</li>
                  <li>• Safety procedures for light and laser use</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Caribbean Context Integration</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Local telecommunications infrastructure</li>
                  <li>• Hurricane communication systems</li>
                  <li>• Solar energy applications in the region</li>
                  <li>• Radio and TV broadcasting history</li>
                  <li>• Underwater cable communications</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
