"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb } from "@/components/breadcrumb"
import { Clock, Users, Target, AlertTriangle, TrendingUp, Thermometer } from "lucide-react"

export default function ChemicalReactionsActivitiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 6 Subjects", href: "/curriculum/grade6-subjects" },
          { label: "Science Activities", href: "/curriculum/grade6-subjects/activities/science" },
          { label: "Chemical Reactions", href: "/curriculum/grade6-subjects/activities/science/chemical-reactions" },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Chemical Reactions Activities</h1>
        <p className="text-xl text-gray-600 mb-6">
          Quantitative analysis of chemical changes, energy transformations, and conservation laws through controlled
          laboratory investigations.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Activity 1: Baking Soda and Vinegar */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
            <CardTitle className="text-2xl text-gray-900">
              Activity 1: Quantitative Analysis of Baking Soda and Vinegar Reaction
            </CardTitle>
            <CardDescription className="text-gray-600">
              Identify chemical change indicators and demonstrate conservation of mass in closed systems
            </CardDescription>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>50 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>Teams of 3</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                <span>Quantitative analysis & conservation laws</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Learning Objectives</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Identify multiple indicators of chemical change</li>
                  <li>• Demonstrate law of conservation of mass</li>
                  <li>• Distinguish between open and closed systems</li>
                  <li>• Calculate and analyze quantitative data</li>
                  <li>• Classify reactions as endothermic or exothermic</li>
                </ul>

                <h4 className="font-semibold text-gray-900 mb-3 mt-6">Materials per Team</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Precision balance (0.1g accuracy)</li>
                  <li>• 500mL plastic bottles with narrow necks</li>
                  <li>• Balloons (2 per team)</li>
                  <li>• Graduated cylinders (100mL, 25mL)</li>
                  <li>• Digital thermometers</li>
                  <li>• Baking soda and white vinegar</li>
                  <li>• Safety goggles</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Investigation Phases</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-xs font-semibold text-orange-600">
                      1
                    </div>
                    <div>
                      <p className="font-medium">System Setup (15 minutes)</p>
                      <p className="text-sm text-gray-600">
                        Prepare closed system with precise measurements of reactants
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-xs font-semibold text-orange-600">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Reaction Observation (20 minutes)</p>
                      <p className="text-sm text-gray-600">
                        Monitor temperature, gas production, and qualitative changes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-xs font-semibold text-orange-600">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Gas Testing (15 minutes)</p>
                      <p className="text-sm text-gray-600">Identify CO₂ gas and analyze mass conservation</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800">Quantitative Analysis</h4>
                      <ul className="text-blue-700 text-sm mt-1">
                        <li>• Mass conservation calculations</li>
                        <li>• Temperature change analysis</li>
                        <li>• Gas volume estimation</li>
                        <li>• Energy classification (endo/exothermic)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800">Safety Protocol</h4>
                  <ul className="text-red-700 text-sm mt-1">
                    <li>• All students wear safety goggles</li>
                    <li>• Teacher handles all flame tests</li>
                    <li>• Proper ventilation for gas release</li>
                    <li>• Clean up spills immediately</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Assessment Rubric (50 points total)</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800">Data Collection Accuracy (15 pts)</h5>
                  <p className="text-sm text-green-700">Precise measurements, complete data tables</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800">Qualitative Observations (10 pts)</h5>
                  <p className="text-sm text-blue-700">Detailed descriptions of changes observed</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-800">Quantitative Analysis (15 pts)</h5>
                  <p className="text-sm text-purple-700">Correct calculations, logical conclusions</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-800">Scientific Communication (10 pts)</h5>
                  <p className="text-sm text-orange-700">Clear explanations using proper terminology</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity 2: Steel Wool Oxidation */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardTitle className="text-2xl text-gray-900">
              Activity 2: Steel Wool Oxidation - Energy and Evidence Investigation
            </CardTitle>
            <CardDescription className="text-gray-600">
              Measure exothermic reaction energy release and analyze factors affecting oxidation rates
            </CardDescription>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>60 minutes + 24-hour observation</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>Teams of 4</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                <span>Oxidation analysis & energy measurement</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Learning Objectives</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Identify oxidation as a chemical reaction</li>
                  <li>• Measure exothermic reaction energy release</li>
                  <li>• Analyze factors affecting reaction rates</li>
                  <li>• Connect laboratory observations to real-world corrosion</li>
                  <li>• Study environmental effects on chemical reactions</li>
                </ul>

                <h4 className="font-semibold text-gray-900 mb-3 mt-6">Treatment Conditions</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-blue-50 rounded">
                    <p className="font-medium text-blue-800">Sample 1: Steel wool + vinegar</p>
                    <p className="text-sm text-blue-700">Experimental condition</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <p className="font-medium text-green-800">Sample 2: Steel wool + water</p>
                    <p className="text-sm text-green-700">Control condition</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="font-medium text-gray-800">Sample 3: Steel wool + air only</p>
                    <p className="text-sm text-gray-700">Baseline condition</p>
                  </div>
                  <div className="p-2 bg-orange-50 rounded">
                    <p className="font-medium text-orange-800">Sample 4: Steel wool + vinegar + salt</p>
                    <p className="text-sm text-orange-700">Enhanced condition</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Investigation Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-semibold text-yellow-600">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Pre-Reaction Analysis (15 minutes)</p>
                      <p className="text-sm text-gray-600">
                        Initial observations, mass measurements, hypothesis formation
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-semibold text-yellow-600">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Reaction Monitoring (25 minutes)</p>
                      <p className="text-sm text-gray-600">Temperature tracking, visual changes, data collection</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-semibold text-yellow-600">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Extended Observation (24 hours)</p>
                      <p className="text-sm text-gray-600">Long-term monitoring, final analysis, pattern recognition</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-400">
                  <div className="flex items-start gap-2">
                    <Thermometer className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800">Temperature Analysis</h4>
                      <ul className="text-green-700 text-sm mt-1">
                        <li>• Record every 30 seconds for first 5 minutes</li>
                        <li>• Then every 2 minutes for next 15 minutes</li>
                        <li>• Calculate maximum temperature and rate of change</li>
                        <li>• Graph temperature vs. time relationships</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Real-World Applications</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800">Corrosion Prevention</h5>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Car rust protection methods</li>
                    <li>• Marine corrosion in Caribbean</li>
                    <li>• Building material selection</li>
                    <li>• Galvanization processes</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800">Economic Impact</h5>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• Cost of corrosion damage</li>
                    <li>• Maintenance schedules</li>
                    <li>• Protective coating industry</li>
                    <li>• Infrastructure planning</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Assessment Components (75 points total)</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-800">Laboratory Report (40 pts)</h5>
                  <ul className="text-sm text-purple-700 mt-2 space-y-1">
                    <li>• Complete data tables</li>
                    <li>• Professional graphs</li>
                    <li>• Analysis of temperature patterns</li>
                    <li>• Real-world applications</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-800">Scientific Drawing (20 pts)</h5>
                  <ul className="text-sm text-orange-700 mt-2 space-y-1">
                    <li>• Before/during/after sketches</li>
                    <li>• Detailed labels and annotations</li>
                    <li>• Comparison between treatments</li>
                    <li>• Evidence of careful observation</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-800">Problem-Solving (15 pts)</h5>
                  <ul className="text-sm text-red-700 mt-2 space-y-1">
                    <li>• Outdoor sculpture design scenario</li>
                    <li>• Material recommendations</li>
                    <li>• Protective measures</li>
                    <li>• Experimental evidence justification</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Extensions and Differentiation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Extensions and Differentiation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Extension Activities</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Research industrial applications of acid-base reactions</li>
                  <li>• Design experiments with different acids and bases</li>
                  <li>• Calculate theoretical vs. actual gas production</li>
                  <li>• Investigate electrochemical aspects of corrosion</li>
                  <li>• Study reaction rates with temperature changes</li>
                  <li>• Research Caribbean environmental corrosion challenges</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Differentiation Strategies</h4>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-blue-800">Visual Learners</p>
                    <p className="text-sm text-gray-600">
                      Emphasize photographic documentation and color change observations
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Mathematical Learners</p>
                    <p className="text-sm text-gray-600">
                      Focus on graphing, rate calculations, and quantitative analysis
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-purple-800">Kinesthetic Learners</p>
                    <p className="text-sm text-gray-600">Hands-on setup and manipulation of materials</p>
                  </div>
                  <div>
                    <p className="font-medium text-orange-800">Advanced Students</p>
                    <p className="text-sm text-gray-600">
                      Research electrochemical aspects, design additional variables to test
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
