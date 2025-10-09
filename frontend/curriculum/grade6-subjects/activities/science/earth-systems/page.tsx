"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb } from "@/components/breadcrumb"
import { Clock, Users, Target, Mountain, Droplets } from "lucide-react"

export default function EarthSystemsActivitiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 6 Subjects", href: "/curriculum/grade6-subjects" },
          { label: "Science Activities", href: "/curriculum/grade6-subjects/activities/science" },
          {
            label: "Earth Systems",
            href: "/curriculum/grade6-subjects/activities/science/earth-systems",
          },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Earth Systems Activities</h1>
        <p className="text-xl text-gray-600 mb-6">
          Investigate Earth's interconnected systems through hands-on modeling and data analysis of atmospheric,
          hydrospheric, and geospheric processes.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Activity 1: Water Cycle Modeling */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="text-2xl text-gray-900">Activity 1: Advanced Water Cycle System Modeling</CardTitle>
            <CardDescription className="text-gray-600">
              Create comprehensive models of the water cycle including energy transfers and climate interactions
            </CardDescription>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>90 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>Teams of 4</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                <span>Systems modeling & energy flow</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Learning Objectives</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Model water movement through Earth's systems</li>
                  <li>• Analyze energy transfers in the water cycle</li>
                  <li>• Investigate climate factors affecting water distribution</li>
                  <li>• Connect local Caribbean water systems to global patterns</li>
                  <li>• Evaluate human impacts on water cycle processes</li>
                </ul>

                <h4 className="font-semibold text-gray-900 mb-3 mt-6">Materials</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Large clear containers for ecosystem models</li>
                  <li>• Heat lamps and thermometers</li>
                  <li>• Ice cubes and hot water</li>
                  <li>• Plastic wrap and rubber bands</li>
                  <li>• Food coloring and pH strips</li>
                  <li>• Digital scales for mass measurements</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Investigation Process</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-600">
                      1
                    </div>
                    <div>
                      <p className="font-medium">System Construction (30 minutes)</p>
                      <p className="text-sm text-gray-600">
                        Build closed-system water cycle models with multiple variables
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-600">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Data Collection (40 minutes)</p>
                      <p className="text-sm text-gray-600">
                        Monitor temperature, humidity, and water movement patterns
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-600">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Climate Analysis (20 minutes)</p>
                      <p className="text-sm text-gray-600">
                        Connect findings to Caribbean climate patterns and global systems
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-cyan-50 border-l-4 border-cyan-400">
                  <div className="flex items-start gap-2">
                    <Droplets className="h-5 w-5 text-cyan-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-cyan-800">Energy Variables</h4>
                      <ul className="text-cyan-700 text-sm mt-1">
                        <li>• Solar radiation intensity</li>
                        <li>• Surface temperature differences</li>
                        <li>• Atmospheric pressure changes</li>
                        <li>• Humidity and condensation rates</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Caribbean Climate Connections</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800">Hurricane Formation</h5>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Ocean temperature requirements</li>
                    <li>• Atmospheric pressure systems</li>
                    <li>• Water vapor and energy transfer</li>
                    <li>• Seasonal pattern analysis</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800">Drought and Rainfall Patterns</h5>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• Trade wind effects on precipitation</li>
                    <li>• Orographic rainfall in mountainous islands</li>
                    <li>• El Niño/La Niña impacts</li>
                    <li>• Water resource management strategies</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity 2: Rock Cycle and Plate Tectonics */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
            <CardTitle className="text-2xl text-gray-900">
              Activity 2: Caribbean Geology and Plate Tectonic Modeling
            </CardTitle>
            <CardDescription className="text-gray-600">
              Investigate volcanic activity and earthquake patterns in the Caribbean through geological modeling
            </CardDescription>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>85 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>Teams of 3</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                <span>Geological processes & hazard assessment</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Learning Objectives</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Model plate tectonic processes affecting the Caribbean</li>
                  <li>• Investigate volcanic formation and eruption patterns</li>
                  <li>• Analyze earthquake distribution and causes</li>
                  <li>• Evaluate geological hazards and risk assessment</li>
                  <li>• Connect geological processes to island formation</li>
                </ul>

                <h4 className="font-semibold text-gray-900 mb-3 mt-6">Geological Modeling Kit</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Modeling clay (different colors)</li>
                  <li>• Foam boards for plate models</li>
                  <li>• Baking soda and vinegar for eruptions</li>
                  <li>• Sand and gravel for sediment layers</li>
                  <li>• Pressure plates and weights</li>
                  <li>• Caribbean geological maps</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Modeling Sequence</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-xs font-semibold text-orange-600">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Plate Boundary Construction (25 minutes)</p>
                      <p className="text-sm text-gray-600">
                        Model Caribbean, North American, and South American plates
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-xs font-semibold text-orange-600">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Volcanic Activity Simulation (35 minutes)</p>
                      <p className="text-sm text-gray-600">Create eruption models and analyze lava flow patterns</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-xs font-semibold text-orange-600">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Hazard Assessment (25 minutes)</p>
                      <p className="text-sm text-gray-600">Evaluate risks and develop emergency preparedness plans</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400">
                  <div className="flex items-start gap-2">
                    <Mountain className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-800">Caribbean Volcanoes</h4>
                      <ul className="text-red-700 text-sm mt-1">
                        <li>• Soufrière Hills (Montserrat)</li>
                        <li>• La Soufrière (St. Vincent)</li>
                        <li>• Mount Pelée (Martinique)</li>
                        <li>• Kick 'em Jenny (Grenada)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Risk Assessment and Preparedness</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h5 className="font-medium text-yellow-800">Volcanic Hazards</h5>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                    <li>• Pyroclastic flows</li>
                    <li>• Ash fall patterns</li>
                    <li>• Lahar formation</li>
                    <li>• Gas emissions</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-800">Earthquake Risks</h5>
                  <ul className="text-sm text-orange-700 mt-2 space-y-1">
                    <li>• Fault line mapping</li>
                    <li>• Tsunami potential</li>
                    <li>• Building codes</li>
                    <li>• Emergency protocols</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-800">Community Preparedness</h5>
                  <ul className="text-sm text-red-700 mt-2 space-y-1">
                    <li>• Evacuation routes</li>
                    <li>• Emergency supplies</li>
                    <li>• Communication systems</li>
                    <li>• Recovery planning</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
