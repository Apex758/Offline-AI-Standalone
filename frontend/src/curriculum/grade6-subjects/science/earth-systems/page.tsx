"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/breadcrumb"
import { StandardsBadge } from "@/components/standards-badge"
import { Globe, Mountain, Thermometer } from "lucide-react"

export default function EarthSystemsPage() {
  const breadcrumbItems = [
    { label: "Curriculum", href: "/curriculum" },
    { label: "Grade 6", href: "/curriculum/grade6-subjects" },
    { label: "Science", href: "/curriculum/grade6-subjects/science" },
    { label: "Earth Systems", href: "/curriculum/grade6-subjects/science/earth-systems" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mt-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Globe className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Earth Systems</h1>
            <p className="text-lg text-gray-600">Grade 6 Science Strand</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <StandardsBadge code="6.ES.1" description="Earth Systems standards for Grade 6 Science" subject="Science" grade="6" strand="Earth Systems" />
          <StandardsBadge code="6.ES.2" description="Earth Systems standards for Grade 6 Science" subject="Science" grade="6" strand="Earth Systems" />
          <StandardsBadge code="6.ES.3" description="Earth Systems standards for Grade 6 Science" subject="Science" grade="6" strand="Earth Systems" />
          <StandardsBadge code="6.ES.4" description="Earth Systems standards for Grade 6 Science" subject="Science" grade="6" strand="Earth Systems" />
        </div>
      </div>

      <div className="grid gap-8">
        {/* Curriculum Outcomes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mountain className="h-5 w-5 text-green-600" />
              Curriculum Outcomes
            </CardTitle>
            <CardDescription>Students will understand Earth's systems and their interactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg mb-3">Weather and Climate Systems</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Explain the water cycle and its role in weather patterns</li>
                <li>• Describe factors that influence local and regional climate</li>
                <li>• Investigate the relationship between air pressure, temperature, and humidity</li>
                <li>• Analyze weather data and make predictions</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-3">Atmospheric Interactions</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Understand the composition and layers of the atmosphere</li>
                <li>• Explain how solar energy drives atmospheric circulation</li>
                <li>• Investigate the greenhouse effect and climate change</li>
                <li>• Describe the formation of severe weather events</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-3">Geosphere Processes</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Explain rock cycle processes and mineral formation</li>
                <li>• Investigate plate tectonics and geological changes</li>
                <li>• Understand erosion, weathering, and deposition</li>
                <li>• Analyze soil formation and composition</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-3">Human Impact on Earth Systems</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• Evaluate human activities affecting Earth's systems</li>
                <li>• Investigate pollution and its environmental impacts</li>
                <li>• Understand sustainable resource management</li>
                <li>• Design solutions for environmental challenges</li>
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
                <li>• Weather observation and data collection</li>
                <li>• Rock and mineral identification activities</li>
                <li>• Climate pattern analysis exercises</li>
                <li>• Environmental impact assessments</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Performance-Based Assessment</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• Create weather monitoring stations</li>
                <li>• Design erosion prevention models</li>
                <li>• Develop environmental action plans</li>
                <li>• Investigate local geological features</li>
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
                  <li>• Weather maps and satellite images</li>
                  <li>• Geological cross-sections</li>
                  <li>• Climate change infographics</li>
                  <li>• Rock cycle diagrams</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Kinesthetic Learners</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Hands-on weather experiments</li>
                  <li>• Rock and mineral handling</li>
                  <li>• Erosion simulation models</li>
                  <li>• Field studies and observations</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Analytical Learners</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Weather data analysis</li>
                  <li>• Climate trend investigations</li>
                  <li>• Environmental impact calculations</li>
                  <li>• Geological timeline studies</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technology Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-blue-600" />
              Technology Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Digital Tools</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Weather monitoring apps and websites</li>
                  <li>• Satellite imagery and mapping tools</li>
                  <li>• Climate simulation software</li>
                  <li>• Virtual geological field trips</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Measurement Technology</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Digital weather stations</li>
                  <li>• pH meters and water testing kits</li>
                  <li>• GPS devices for field studies</li>
                  <li>• Data loggers for environmental monitoring</li>
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
                  <li>• Weather data graphing and analysis</li>
                  <li>• Scale and proportion in geological time</li>
                  <li>• Statistical analysis of climate trends</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Badge variant="outline">Language Arts</Badge>
                </h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Environmental issue research and writing</li>
                  <li>• Weather reporting and communication</li>
                  <li>• Scientific explanation development</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Badge variant="outline">Social Studies</Badge>
                </h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Climate impact on human settlements</li>
                  <li>• Natural disaster preparedness</li>
                  <li>• Resource management and economics</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Badge variant="outline">Arts</Badge>
                </h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Environmental art and awareness</li>
                  <li>• Weather photography and documentation</li>
                  <li>• Geological formation modeling</li>
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
                  <li>• Weather monitoring instruments</li>
                  <li>• Rock and mineral samples</li>
                  <li>• Soil testing materials</li>
                  <li>• Water quality testing kits</li>
                  <li>• Maps and geological charts</li>
                  <li>• Erosion demonstration materials</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Caribbean Context Resources</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Hurricane tracking and preparation materials</li>
                  <li>• Local geological formation studies</li>
                  <li>• Coral reef ecosystem investigations</li>
                  <li>• Volcanic activity monitoring examples</li>
                  <li>• Coastal erosion case studies</li>
                  <li>• Climate change impact assessments</li>
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
                  <li>• Understanding of weather and climate systems</li>
                  <li>• Knowledge of geological processes and rock cycle</li>
                  <li>• Familiarity with environmental science concepts</li>
                  <li>• Awareness of human impact on Earth systems</li>
                  <li>• Safety procedures for field studies</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Caribbean Context Integration</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Regional climate patterns and hurricane seasons</li>
                  <li>• Volcanic and seismic activity in the Caribbean</li>
                  <li>• Coral reef ecosystems and threats</li>
                  <li>• Sea level rise and coastal communities</li>
                  <li>• Sustainable tourism and environmental protection</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
