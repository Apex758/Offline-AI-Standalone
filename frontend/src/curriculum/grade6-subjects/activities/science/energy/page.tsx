"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb } from "@/components/breadcrumb"
import { Clock, Users, Target, Zap, Battery } from "lucide-react"

export default function EnergyActivitiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 6 Subjects", href: "/curriculum/grade6-subjects" },
          { label: "Science Activities", href: "/curriculum/grade6-subjects/activities/science" },
          {
            label: "Energy",
            href: "/curriculum/grade6-subjects/activities/science/energy",
          },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Energy Activities</h1>
        <p className="text-xl text-gray-600 mb-6">
          Investigate energy transformations, renewable energy systems, and conservation principles through hands-on
          experiments and Caribbean energy applications.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Activity 1: Energy Transformation Laboratory */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50">
            <CardTitle className="text-2xl text-gray-900">
              Activity 1: Caribbean Renewable Energy Systems Investigation
            </CardTitle>
            <CardDescription className="text-gray-600">
              Design and test renewable energy systems suitable for Caribbean island environments
            </CardDescription>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>110 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>Teams of 4</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                <span>Energy conversion & system design</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Learning Objectives</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Design renewable energy systems for island communities</li>
                  <li>• Investigate energy conversion efficiency</li>
                  <li>• Analyze factors affecting energy production</li>
                  <li>• Evaluate environmental impacts of energy systems</li>
                  <li>• Calculate energy costs and benefits</li>
                </ul>

                <h4 className="font-semibold text-gray-900 mb-3 mt-6">Energy System Components</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Small solar panels and photovoltaic cells</li>
                  <li>• Wind turbine construction materials</li>
                  <li>• LED lights and small motors</li>
                  <li>• Batteries and capacitors</li>
                  <li>• Multimeters and measurement tools</li>
                  <li>• Construction materials (wood, plastic)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Design Process</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-semibold text-yellow-600">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Energy Assessment (25 minutes)</p>
                      <p className="text-sm text-gray-600">Analyze Caribbean energy resources and community needs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-semibold text-yellow-600">
                      2
                    </div>
                    <div>
                      <p className="font-medium">System Design and Construction (50 minutes)</p>
                      <p className="text-sm text-gray-600">Build and optimize renewable energy prototypes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-semibold text-yellow-600">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Performance Testing (35 minutes)</p>
                      <p className="text-sm text-gray-600">Measure efficiency and analyze optimization strategies</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-400">
                  <div className="flex items-start gap-2">
                    <Zap className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-800">Caribbean Energy Resources</h4>
                      <ul className="text-amber-700 text-sm mt-1">
                        <li>• Solar: 300+ days of sunshine annually</li>
                        <li>• Wind: Trade winds 15-25 mph</li>
                        <li>• Geothermal: Volcanic island potential</li>
                        <li>• Ocean: Wave and tidal energy</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Energy System Design Challenges</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800">Solar Power System</h5>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Optimize panel angle for latitude</li>
                    <li>• Design battery storage system</li>
                    <li>• Calculate daily energy production</li>
                    <li>• Account for weather variability</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800">Wind Energy System</h5>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• Design efficient turbine blades</li>
                    <li>• Optimize for trade wind patterns</li>
                    <li>• Consider hurricane resistance</li>
                    <li>• Minimize noise and visual impact</li>
                  </ul>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-800">Hybrid System Integration</h5>
                  <ul className="text-sm text-purple-700 mt-2 space-y-1">
                    <li>• Combine solar and wind sources</li>
                    <li>• Design smart grid connections</li>
                    <li>• Implement energy storage solutions</li>
                    <li>• Create backup power systems</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Energy Efficiency Analysis</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-800">Performance Metrics</h5>
                  <ul className="text-sm text-orange-700 mt-2 space-y-1">
                    <li>• Power output measurements (watts)</li>
                    <li>• Energy conversion efficiency (%)</li>
                    <li>• Cost per kilowatt-hour</li>
                    <li>• Environmental impact assessment</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-800">Optimization Strategies</h5>
                  <ul className="text-sm text-red-700 mt-2 space-y-1">
                    <li>• Maximum power point tracking</li>
                    <li>• Load balancing techniques</li>
                    <li>• Maintenance scheduling</li>
                    <li>• System redundancy planning</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity 2: Energy Conservation Investigation */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
            <CardTitle className="text-2xl text-gray-900">
              Activity 2: Energy Conservation and Efficiency Laboratory
            </CardTitle>
            <CardDescription className="text-gray-600">
              Investigate energy conservation principles through thermal dynamics and mechanical efficiency experiments
            </CardDescription>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>90 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>Teams of 3</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                <span>Conservation laws & efficiency analysis</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Learning Objectives</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Investigate conservation of energy principles</li>
                  <li>• Analyze energy transformations in mechanical systems</li>
                  <li>• Measure thermal energy transfer rates</li>
                  <li>• Calculate efficiency of energy conversion devices</li>
                  <li>• Design energy-efficient solutions for Caribbean buildings</li>
                </ul>

                <h4 className="font-semibold text-gray-900 mb-3 mt-6">Laboratory Equipment</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Pendulum apparatus and timing devices</li>
                  <li>• Inclined planes and rolling objects</li>
                  <li>• Calorimeters and thermometers</li>
                  <li>• Insulation materials for testing</li>
                  <li>• Spring scales and force meters</li>
                  <li>• Data logging sensors</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Investigation Protocol</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-semibold text-green-600">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Mechanical Energy Conservation (35 minutes)</p>
                      <p className="text-sm text-gray-600">Test pendulum and inclined plane energy transformations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-semibold text-green-600">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Thermal Energy Transfer (35 minutes)</p>
                      <p className="text-sm text-gray-600">Investigate heat conduction, convection, and radiation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-semibold text-green-600">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Building Efficiency Design (20 minutes)</p>
                      <p className="text-sm text-gray-600">Apply findings to Caribbean building design challenges</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-teal-50 border-l-4 border-teal-400">
                  <div className="flex items-start gap-2">
                    <Battery className="h-5 w-5 text-teal-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-teal-800">Energy Forms</h4>
                      <ul className="text-teal-700 text-sm mt-1">
                        <li>• Kinetic energy (motion)</li>
                        <li>• Potential energy (position)</li>
                        <li>• Thermal energy (heat)</li>
                        <li>• Electrical energy (current)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Mechanical Energy Experiments</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800">Pendulum Energy Analysis</h5>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Measure potential energy at maximum height</li>
                    <li>• Calculate kinetic energy at bottom of swing</li>
                    <li>• Analyze energy losses due to friction</li>
                    <li>• Investigate period and amplitude relationships</li>
                  </ul>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-800">Inclined Plane Investigation</h5>
                  <ul className="text-sm text-purple-700 mt-2 space-y-1">
                    <li>• Compare rolling vs. sliding objects</li>
                    <li>• Measure work done against friction</li>
                    <li>• Calculate mechanical advantage</li>
                    <li>• Analyze efficiency of simple machines</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Caribbean Building Efficiency Applications</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h5 className="font-medium text-yellow-800">Cooling Strategies</h5>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                    <li>• Natural ventilation design</li>
                    <li>• Reflective roofing materials</li>
                    <li>• Thermal mass optimization</li>
                    <li>• Shade structure placement</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-800">Insulation Testing</h5>
                  <ul className="text-sm text-orange-700 mt-2 space-y-1">
                    <li>• Compare local vs. imported materials</li>
                    <li>• Test coconut fiber insulation</li>
                    <li>• Analyze bamboo thermal properties</li>
                    <li>• Evaluate cost-effectiveness</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-800">Hurricane Resistance</h5>
                  <ul className="text-sm text-red-700 mt-2 space-y-1">
                    <li>• Wind load calculations</li>
                    <li>• Structural energy absorption</li>
                    <li>• Emergency power systems</li>
                    <li>• Rapid recovery designs</li>
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
