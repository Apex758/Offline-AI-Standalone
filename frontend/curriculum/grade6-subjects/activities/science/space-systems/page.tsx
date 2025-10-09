"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb } from "@/components/breadcrumb"
import { Clock, Users, Target, Search, Rocket } from "lucide-react"

export default function SpaceSystemsActivitiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 6 Subjects", href: "/curriculum/grade6-subjects" },
          { label: "Science Activities", href: "/curriculum/grade6-subjects/activities/science" },
          {
            label: "Space Systems",
            href: "/curriculum/grade6-subjects/activities/science/space-systems",
          },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Space Systems Activities</h1>
        <p className="text-xl text-gray-600 mb-6">
          Explore solar system dynamics, stellar evolution, and space exploration through modeling and observational
          astronomy.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Activity 1: Solar System Scale Modeling */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardTitle className="text-2xl text-gray-900">
              Activity 1: Accurate Solar System Scale Investigation
            </CardTitle>
            <CardDescription className="text-gray-600">
              Create scale models demonstrating the vast distances and size relationships in our solar system
            </CardDescription>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>100 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>Teams of 4</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                <span>Scale modeling & astronomical distances</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Learning Objectives</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Understand the scale of distances in space</li>
                  <li>• Model planetary size and orbital relationships</li>
                  <li>• Investigate gravitational effects on orbital motion</li>
                  <li>• Analyze factors affecting planetary characteristics</li>
                  <li>• Connect solar system formation to current structure</li>
                </ul>

                <h4 className="font-semibold text-gray-900 mb-3 mt-6">Scale Modeling Materials</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Various sized spheres and balls</li>
                  <li>• Measuring tapes (100+ meters)</li>
                  <li>• Calculators for scale calculations</li>
                  <li>• Colored markers and labels</li>
                  <li>• Large outdoor space or gymnasium</li>
                  <li>• Astronomical data reference sheets</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Modeling Process</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-semibold text-indigo-600">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Scale Calculation Phase (25 minutes)</p>
                      <p className="text-sm text-gray-600">Calculate appropriate scales for both size and distance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-semibold text-indigo-600">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Physical Model Construction (45 minutes)</p>
                      <p className="text-sm text-gray-600">Build and position scaled solar system model</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-semibold text-indigo-600">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Orbital Mechanics Investigation (30 minutes)</p>
                      <p className="text-sm text-gray-600">Analyze orbital periods and gravitational relationships</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-purple-50 border-l-4 border-purple-400">
                  <div className="flex items-start gap-2">
                    <Search className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-purple-800">Scale Challenges</h4>
                      <ul className="text-purple-700 text-sm mt-1">
                        <li>• If Earth = 1cm, Sun = 1.1 meters</li>
                        <li>• If Earth = 1cm, Moon = 30cm away</li>
                        <li>• If Earth = 1cm, Mars = 78cm away</li>
                        <li>• If Earth = 1cm, Neptune = 30 meters away</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Advanced Investigations</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800">Kepler's Laws Application</h5>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Orbital period calculations</li>
                    <li>• Elliptical orbit modeling</li>
                    <li>• Velocity changes in orbits</li>
                    <li>• Gravitational force relationships</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800">Planetary Characteristics</h5>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• Density and composition analysis</li>
                    <li>• Atmospheric pressure comparisons</li>
                    <li>• Temperature gradient investigations</li>
                    <li>• Magnetic field strength variations</li>
                  </ul>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h5 className="font-medium text-yellow-800">Habitability Factors</h5>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                    <li>• Goldilocks zone boundaries</li>
                    <li>• Atmospheric composition requirements</li>
                    <li>• Water presence indicators</li>
                    <li>• Exoplanet comparison studies</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity 2: Stellar Evolution Observatory */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardTitle className="text-2xl text-gray-900">
              Activity 2: Stellar Life Cycle Investigation Laboratory
            </CardTitle>
            <CardDescription className="text-gray-600">
              Model stellar evolution processes and analyze star formation in different galactic environments
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
                <span>Stellar evolution & nuclear processes</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Learning Objectives</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Model stellar formation and evolution processes</li>
                  <li>• Investigate nuclear fusion in stellar cores</li>
                  <li>• Analyze stellar classification systems</li>
                  <li>• Explore stellar death and remnant formation</li>
                  <li>• Connect stellar evolution to element formation</li>
                </ul>

                <h4 className="font-semibold text-gray-900 mb-3 mt-6">Observatory Equipment</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Star charts and constellation maps</li>
                  <li>• Spectroscopy simulation materials</li>
                  <li>• Hertzsprung-Russell diagram templates</li>
                  <li>• Nuclear fusion modeling kits</li>
                  <li>• Digital astronomy software</li>
                  <li>• Stellar evolution timeline materials</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Investigation Sequence</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-semibold text-yellow-600">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Star Formation Modeling (30 minutes)</p>
                      <p className="text-sm text-gray-600">Model nebular collapse and protostar development</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-semibold text-yellow-600">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Stellar Classification (35 minutes)</p>
                      <p className="text-sm text-gray-600">Analyze stellar spectra and create H-R diagrams</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-semibold text-yellow-600">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Stellar Death Investigation (20 minutes)</p>
                      <p className="text-sm text-gray-600">Model supernovae, neutron stars, and black holes</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-orange-50 border-l-4 border-orange-400">
                  <div className="flex items-start gap-2">
                    <Rocket className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-800">Stellar Mass Categories</h4>
                      <ul className="text-orange-700 text-sm mt-1">
                        <li>• Low mass: Red dwarf → White dwarf</li>
                        <li>• Solar mass: Main sequence → Red giant → White dwarf</li>
                        <li>• High mass: Supergiant → Supernova → Neutron star</li>
                        <li>• Very high mass: Supernova → Black hole</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Nuclear Fusion and Element Formation</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-800">Fusion Processes</h5>
                  <ul className="text-sm text-red-700 mt-2 space-y-1">
                    <li>• Hydrogen to helium fusion (main sequence)</li>
                    <li>• Helium to carbon fusion (red giant phase)</li>
                    <li>• Carbon to heavier elements (massive stars)</li>
                    <li>• Silicon burning to iron (pre-supernova)</li>
                  </ul>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-800">Element Distribution</h5>
                  <ul className="text-sm text-purple-700 mt-2 space-y-1">
                    <li>• Light elements from Big Bang nucleosynthesis</li>
                    <li>• Medium elements from stellar cores</li>
                    <li>• Heavy elements from supernovae</li>
                    <li>• Cosmic abundance patterns</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Caribbean Astronomy Connections</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800">Southern Hemisphere Views</h5>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Southern Cross constellation</li>
                    <li>• Magellanic Clouds visibility</li>
                    <li>• Centaurus and Crux observations</li>
                    <li>• Seasonal constellation changes</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800">Navigation History</h5>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• Indigenous astronomical knowledge</li>
                    <li>• European navigation techniques</li>
                    <li>• Polaris and latitude determination</li>
                    <li>• Modern GPS satellite systems</li>
                  </ul>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h5 className="font-medium text-yellow-800">Space Weather Effects</h5>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                    <li>• Solar flare impacts on communications</li>
                    <li>• Aurora visibility at Caribbean latitudes</li>
                    <li>• Satellite interference patterns</li>
                    <li>• Hurricane season and solar activity</li>
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
