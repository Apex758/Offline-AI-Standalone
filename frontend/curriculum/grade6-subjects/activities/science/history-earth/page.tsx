"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb } from "@/components/breadcrumb"
import { Clock, Users, Target, Calendar, FingerprintIcon as Fossil } from "lucide-react"

export default function HistoryOfEarthActivitiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 6 Subjects", href: "/curriculum/grade6-subjects" },
          { label: "Science Activities", href: "/curriculum/grade6-subjects/activities/science" },
          {
            label: "History of Earth",
            href: "/curriculum/grade6-subjects/activities/science/history-of-earth",
          },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">History of Earth Activities</h1>
        <p className="text-xl text-gray-600 mb-6">
          Explore Earth's geological timeline through fossil analysis, rock dating, and climate reconstruction using
          Caribbean geological evidence.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Activity 1: Geological Timeline Construction */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
            <CardTitle className="text-2xl text-gray-900">
              Activity 1: Caribbean Geological Timeline Investigation
            </CardTitle>
            <CardDescription className="text-gray-600">
              Construct detailed geological timelines using Caribbean rock formations and fossil evidence
            </CardDescription>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>95 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>Teams of 4</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                <span>Geological dating & timeline analysis</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Learning Objectives</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Analyze rock layers to determine relative ages</li>
                  <li>• Use fossil evidence to date geological formations</li>
                  <li>• Construct accurate geological timelines</li>
                  <li>• Investigate Caribbean island formation history</li>
                  <li>• Connect geological events to climate changes</li>
                </ul>

                <h4 className="font-semibold text-gray-900 mb-3 mt-6">Investigation Materials</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Rock and mineral samples from Caribbean</li>
                  <li>• Fossil replicas and identification guides</li>
                  <li>• Geological maps of Caribbean islands</li>
                  <li>• Magnifying glasses and measuring tools</li>
                  <li>• Timeline construction materials</li>
                  <li>• Digital microscopes for detailed analysis</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Timeline Construction Process</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-semibold text-purple-600">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Rock Layer Analysis (35 minutes)</p>
                      <p className="text-sm text-gray-600">
                        Examine stratification and apply principles of superposition
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-semibold text-purple-600">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Fossil Dating Investigation (40 minutes)</p>
                      <p className="text-sm text-gray-600">Use index fossils and radiometric dating principles</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-semibold text-purple-600">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Timeline Synthesis (20 minutes)</p>
                      <p className="text-sm text-gray-600">Integrate evidence into comprehensive geological history</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-indigo-50 border-l-4 border-indigo-400">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-indigo-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-indigo-800">Key Time Periods</h4>
                      <ul className="text-indigo-700 text-sm mt-1">
                        <li>• Cretaceous: Caribbean formation begins</li>
                        <li>• Paleogene: Volcanic arc development</li>
                        <li>• Neogene: Modern island configuration</li>
                        <li>• Quaternary: Sea level changes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Caribbean Geological Evidence</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800">Limestone Formations</h5>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Coral reef fossils in Barbados</li>
                    <li>• Marine sedimentary layers</li>
                    <li>• Sea level change indicators</li>
                    <li>• Karst landscape formation</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800">Volcanic Sequences</h5>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• Basaltic pillow lavas</li>
                    <li>• Pyroclastic deposits</li>
                    <li>• Intrusive igneous bodies</li>
                    <li>• Metamorphic core complexes</li>
                  </ul>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h5 className="font-medium text-yellow-800">Fossil Records</h5>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                    <li>• Planktonic foraminifera</li>
                    <li>• Rudist bivalves</li>
                    <li>• Coral species evolution</li>
                    <li>• Terrestrial vertebrate remains</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity 2: Climate Change Through Time */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
            <CardTitle className="text-2xl text-gray-900">Activity 2: Paleoclimate Reconstruction Laboratory</CardTitle>
            <CardDescription className="text-gray-600">
              Analyze ice cores, tree rings, and sediment cores to reconstruct past climate conditions
            </CardDescription>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>80 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>Teams of 3</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                <span>Climate analysis & data interpretation</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Learning Objectives</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Analyze proxy data for climate reconstruction</li>
                  <li>• Interpret ice core and sediment core data</li>
                  <li>• Investigate natural climate variability</li>
                  <li>• Compare past and present climate patterns</li>
                  <li>• Evaluate human impacts on climate systems</li>
                </ul>

                <h4 className="font-semibold text-gray-900 mb-3 mt-6">Climate Proxy Materials</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Simulated ice core samples</li>
                  <li>• Tree ring cross-sections</li>
                  <li>• Sediment core models</li>
                  <li>• Pollen identification guides</li>
                  <li>• Isotope ratio data sheets</li>
                  <li>• Climate graphing software</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Analysis Protocol</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-semibold text-green-600">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Proxy Data Collection (30 minutes)</p>
                      <p className="text-sm text-gray-600">
                        Measure and record climate indicators from multiple sources
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-semibold text-green-600">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Data Analysis and Graphing (35 minutes)</p>
                      <p className="text-sm text-gray-600">Create climate timeline graphs and identify patterns</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-semibold text-green-600">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Climate Prediction Modeling (15 minutes)</p>
                      <p className="text-sm text-gray-600">Use historical data to predict future climate scenarios</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-teal-50 border-l-4 border-teal-400">
                  <div className="flex items-start gap-2">
                    <Fossil className="h-5 w-5 text-teal-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-teal-800">Climate Indicators</h4>
                      <ul className="text-teal-700 text-sm mt-1">
                        <li>• Oxygen isotope ratios</li>
                        <li>• Tree ring width variations</li>
                        <li>• Pollen assemblage changes</li>
                        <li>• Coral growth band analysis</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Caribbean Climate History</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800">Ice Age Impacts</h5>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Sea level changes of 120+ meters</li>
                    <li>• Land bridge formations between islands</li>
                    <li>• Species migration patterns</li>
                    <li>• Coral reef development cycles</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-800">Recent Climate Trends</h5>
                  <ul className="text-sm text-orange-700 mt-2 space-y-1">
                    <li>• Hurricane intensity changes</li>
                    <li>• Ocean temperature warming</li>
                    <li>• Precipitation pattern shifts</li>
                    <li>• Coral bleaching events</li>
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
