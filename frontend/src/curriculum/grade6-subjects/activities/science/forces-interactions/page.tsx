"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb } from "@/components/breadcrumb"
import { Clock, Users, Target, Zap, Car, Magnet } from "lucide-react"

export default function ForcesInteractionsActivitiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 6 Subjects", href: "/curriculum/grade6-subjects" },
          { label: "Science Activities", href: "/curriculum/grade6-subjects/activities/science" },
          {
            label: "Forces and Interactions",
            href: "/curriculum/grade6-subjects/activities/science/forces-interactions",
          },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Forces and Interactions Activities</h1>
        <p className="text-xl text-gray-600 mb-6">
          Investigate Newton's laws, collision dynamics, and electromagnetic forces through quantitative experiments and
          real-world applications.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Activity 1: Newton's Third Law */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
            <CardTitle className="text-2xl text-gray-900">
              Activity 1: Newton's Third Law - Action-Reaction Investigation
            </CardTitle>
            <CardDescription className="text-gray-600">
              Demonstrate and quantify action-reaction force pairs through balloon rockets and collision analysis
            </CardDescription>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>80 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>Teams of 4</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                <span>Force measurement & space technology</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Learning Objectives</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Demonstrate Newton's Third Law through multiple examples</li>
                  <li>• Quantify action-reaction force pairs using measurements</li>
                  <li>• Apply Newton's Third Law to design motion solutions</li>
                  <li>• Connect force concepts to transportation and space technology</li>
                  <li>• Analyze safety applications in vehicle design</li>
                </ul>

                <h4 className="font-semibold text-gray-900 mb-3 mt-6">Balloon Rocket System</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Balloons (various sizes), balloon pumps</li>
                  <li>• Fishing line or string (15 meters)</li>
                  <li>• Drinking straws, tape, scissors</li>
                  <li>• Measuring tape, stopwatch</li>
                  <li>• Small masses for payload testing</li>
                  <li>• Spring scales (Newton meters)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Investigation Phases</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-xs font-semibold text-red-600">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Balloon Rocket Analysis (35 minutes)</p>
                      <p className="text-sm text-gray-600">
                        Test balloon size, inflation pressure, and payload effects
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-xs font-semibold text-red-600">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Direct Force Measurement (25 minutes)</p>
                      <p className="text-sm text-gray-600">
                        Measure action-reaction pairs using spring scales and collisions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-xs font-semibold text-red-600">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Real-World Applications (20 minutes)</p>
                      <p className="text-sm text-gray-600">Analyze transportation systems and safety applications</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-orange-50 border-l-4 border-orange-400">
                  <div className="flex items-start gap-2">
                    <Car className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-800">Transportation Analysis</h4>
                      <ul className="text-orange-700 text-sm mt-1">
                        <li>• Car: tires push road, road pushes car forward</li>
                        <li>• Boat: propeller pushes water, water pushes boat</li>
                        <li>• Airplane: engines push air, air pushes plane</li>
                        <li>• Rocket: exhaust pushes down, rocket pushes up</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Quantitative Analysis</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800">Balloon Rocket Performance</h5>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Calculate average velocity and acceleration</li>
                    <li>• Estimate thrust force from performance data</li>
                    <li>• Analyze energy conversion efficiency</li>
                    <li>• Compare theoretical vs. measured forces</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800">Statistical Analysis</h5>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• Calculate means and standard deviations</li>
                    <li>• Identify sources of experimental error</li>
                    <li>• Use error bars on graphs</li>
                    <li>• Compare experimental with theoretical results</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Assessment Components (100 points total)</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-800">Laboratory Report (50 pts)</h5>
                  <ul className="text-sm text-red-700 mt-2 space-y-1">
                    <li>• Experimental design (10 pts)</li>
                    <li>• Data collection and analysis (25 pts)</li>
                    <li>• Newton's Third Law applications (10 pts)</li>
                    <li>• Real-world connections (5 pts)</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-800">Engineering Design (30 pts)</h5>
                  <ul className="text-sm text-orange-700 mt-2 space-y-1">
                    <li>• Rocket optimization project (20 pts)</li>
                    <li>• Performance demonstration (10 pts)</li>
                  </ul>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h5 className="font-medium text-yellow-800">Problem-Solving (20 pts)</h5>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                    <li>• Space mission planning OR</li>
                    <li>• Vehicle safety design OR</li>
                    <li>• Sports biomechanics OR</li>
                    <li>• Transportation innovation</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity 2: Collision Dynamics */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-2xl text-gray-900">
              Activity 2: Collision Dynamics and Momentum Conservation
            </CardTitle>
            <CardDescription className="text-gray-600">
              Investigate elastic and inelastic collisions while applying conservation of momentum principles
            </CardDescription>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>90 minutes (can be split into two 45-minute sessions)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>Teams of 3</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                <span>Collision analysis & vehicle safety</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Learning Objectives</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Investigate elastic and inelastic collisions quantitatively</li>
                  <li>• Apply conservation of momentum to predict outcomes</li>
                  <li>• Analyze factors affecting collision dynamics</li>
                  <li>• Connect collision physics to vehicle safety and sports</li>
                  <li>• Use mathematical models to predict and verify results</li>
                </ul>

                <h4 className="font-semibold text-gray-900 mb-3 mt-6">Collision Investigation Equipment</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Toy cars with adjustable masses</li>
                  <li>• Modeling clay for mass adjustment</li>
                  <li>• Digital balance for precise measurements</li>
                  <li>• Track system with minimal friction</li>
                  <li>• High-speed video recording capability</li>
                  <li>• Motion analysis software or apps</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Investigation Phases</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-600">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Elastic Collision Investigation (35 minutes)</p>
                      <p className="text-sm text-gray-600">Equal mass, unequal mass, and both cars moving scenarios</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-600">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Inelastic Collision Analysis (30 minutes)</p>
                      <p className="text-sm text-gray-600">Sticky collisions and partially inelastic scenarios</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-600">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Advanced Analysis (25 minutes)</p>
                      <p className="text-sm text-gray-600">Mathematical modeling and real-world applications</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400">
                  <div className="flex items-start gap-2">
                    <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800">Mathematical Modeling</h4>
                      <ul className="text-blue-700 text-sm mt-1">
                        <li>• Conservation of momentum: m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂'</li>
                        <li>• Energy analysis: KE before vs. after collision</li>
                        <li>• Coefficient of restitution calculations</li>
                        <li>• Theoretical vs. experimental comparisons</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Real-World Applications</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-800">Vehicle Safety Engineering</h5>
                  <ul className="text-sm text-red-700 mt-2 space-y-1">
                    <li>• Crash test analysis and comparison</li>
                    <li>• Crumple zone design and effectiveness</li>
                    <li>• Airbag deployment timing optimization</li>
                    <li>• Passenger force reduction strategies</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800">Sports Applications</h5>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• Ball sport collision dynamics analysis</li>
                    <li>• Equipment design for optimal performance</li>
                    <li>• Protective equipment effectiveness</li>
                    <li>• Impact force calculations in contact sports</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Assessment Components (100 points total)</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800">Quantitative Analysis (45 pts)</h5>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Data collection accuracy (15 pts)</li>
                    <li>• Mathematical analysis (20 pts)</li>
                    <li>• Experimental design (10 pts)</li>
                  </ul>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-800">Video Analysis (25 pts)</h5>
                  <ul className="text-sm text-purple-700 mt-2 space-y-1">
                    <li>• Motion tracking accuracy (15 pts)</li>
                    <li>• Comparative analysis (10 pts)</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-800">Problem-Solving (30 pts)</h5>
                  <ul className="text-sm text-orange-700 mt-2 space-y-1">
                    <li>• Vehicle crash investigation OR</li>
                    <li>• Sports equipment design OR</li>
                    <li>• Space mission planning OR</li>
                    <li>• Asteroid impact analysis</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity 3: Electromagnetic Forces */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50">
            <CardTitle className="text-2xl text-gray-900">
              Activity 3: Electromagnetic Force Investigation and Applications
            </CardTitle>
            <CardDescription className="text-gray-600">
              Construct and test electromagnets while investigating factors affecting electromagnetic force
            </CardDescription>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>70 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>Teams of 4</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                <span>Electromagnet construction & optimization</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Learning Objectives</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Construct and test electromagnets with variable parameters</li>
                  <li>• Quantify relationships between current, coil turns, and strength</li>
                  <li>• Investigate factors affecting electromagnetic force</li>
                  <li>• Design electromagnetic solutions to practical problems</li>
                  <li>• Connect principles to modern technology applications</li>
                </ul>

                <h4 className="font-semibold text-gray-900 mb-3 mt-6">Electromagnet Construction</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Iron nails (various sizes: 2", 3", 4")</li>
                  <li>• Insulated copper wire (22-24 gauge)</li>
                  <li>• D-cell and 9V batteries</li>
                  <li>• Battery holders and connecting wires</li>
                  <li>• Paper clips for testing (100 per team)</li>
                  <li>• Digital multimeter for current measurement</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Investigation Phases</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-semibold text-yellow-600">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Basic Construction and Testing (25 minutes)</p>
                      <p className="text-sm text-gray-600">
                        Build standard electromagnet and establish baseline performance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-semibold text-yellow-600">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Variable Parameter Investigation (30 minutes)</p>
                      <p className="text-sm text-gray-600">
                        Test wire turns, battery configuration, and core materials
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-semibold text-yellow-600">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Advanced Analysis and Applications (15 minutes)</p>
                      <p className="text-sm text-gray-600">
                        Magnetic field mapping and real-world application research
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-400">
                  <div className="flex items-start gap-2">
                    <Magnet className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-800">Safety Protocol</h4>
                      <ul className="text-amber-700 text-sm mt-1">
                        <li>• Battery safety: prevent short circuits</li>
                        <li>• Monitor for overheating during operation</li>
                        <li>• Proper wire handling to prevent cuts</li>
                        <li>• Supervision with electrical equipment</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Systematic Parameter Testing</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-800">Number of Wire Turns Investigation</h5>
                  <ul className="text-sm text-orange-700 mt-2 space-y-1">
                    <li>• Test: 10, 20, 40, 60, 80, 100 wire turns</li>
                    <li>• Record paper clips lifted for each configuration</li>
                    <li>• Measure current draw with multimeter</li>
                    <li>• Graph paper clips lifted vs. number of turns</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-800">Battery Configuration Testing</h5>
                  <ul className="text-sm text-red-700 mt-2 space-y-1">
                    <li>• Single 1.5V battery baseline</li>
                    <li>• Two 1.5V batteries in series (3V total)</li>
                    <li>• Single 9V battery comparison</li>
                    <li>• Analyze voltage, current, and magnetic strength</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Real-World Applications</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800">Industrial Applications</h5>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Scrapyard crane electromagnets</li>
                    <li>• Magnetic levitation (maglev) trains</li>
                    <li>• MRI machine electromagnet design</li>
                    <li>• Electric motor and generator principles</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800">Design Challenge Applications</h5>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• Sorting recyclable metals from waste</li>
                    <li>• Maximum mass lifting with minimum power</li>
                    <li>• Uniform magnetic field for instruments</li>
                    <li>• Electromagnetic door lock systems</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Assessment Components (100 points total)</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h5 className="font-medium text-yellow-800">Laboratory Report (40 pts)</h5>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                    <li>• Experimental design and methodology (10 pts)</li>
                    <li>• Data collection and analysis (20 pts)</li>
                    <li>• Electromagnetic theory application (10 pts)</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-800">Engineering Design (35 pts)</h5>
                  <ul className="text-sm text-orange-700 mt-2 space-y-1">
                    <li>• Optimization project (20 pts)</li>
                    <li>• Performance testing (10 pts)</li>
                    <li>• Cost-benefit analysis (5 pts)</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-800">Technology Applications (25 pts)</h5>
                  <ul className="text-sm text-red-700 mt-2 space-y-1">
                    <li>• Real-world connections research (15 pts)</li>
                    <li>• Innovation proposal (10 pts)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Performance Optimization Analysis</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-800">Efficiency Calculations</h5>
                  <p className="text-sm text-purple-700">
                    Calculate "lifting power per amp" and determine optimal turns-to-current ratio
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <h5 className="font-medium text-indigo-800">Mathematical Modeling</h5>
                  <p className="text-sm text-indigo-700">
                    Apply Ampère's law and B = μnI formula to predict magnetic field strength
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
