"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb } from "@/components/breadcrumb"
import { Clock, Users, Target, Leaf, Microscope } from "lucide-react"

export default function MatterEnergyOrganismsActivitiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 6 Subjects", href: "/curriculum/grade6-subjects" },
          { label: "Science Activities", href: "/curriculum/grade6-subjects/activities/science" },
          {
            label: "Matter and Energy in Organisms",
            href: "/curriculum/grade6-subjects/activities/science/matter-energy-organisms",
          },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Matter and Energy in Organisms and Ecosystems Activities
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Investigate energy flow and matter cycling through Caribbean ecosystems using advanced experimental techniques
          and ecosystem modeling.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Activity 1: Photosynthesis and Cellular Respiration */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-lime-50">
            <CardTitle className="text-2xl text-gray-900">
              Activity 1: Caribbean Plant Photosynthesis Efficiency Investigation
            </CardTitle>
            <CardDescription className="text-gray-600">
              Compare photosynthetic efficiency across different Caribbean plant species and environmental conditions
            </CardDescription>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>105 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>Teams of 4</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                <span>Photosynthesis analysis & energy conversion</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Learning Objectives</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Measure photosynthetic rates in Caribbean plant species</li>
                  <li>• Analyze factors affecting photosynthetic efficiency</li>
                  <li>• Investigate cellular respiration and energy release</li>
                  <li>• Compare C3, C4, and CAM photosynthesis adaptations</li>
                  <li>• Connect plant metabolism to ecosystem productivity</li>
                </ul>

                <h4 className="font-semibold text-gray-900 mb-3 mt-6">Laboratory Equipment</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Aquatic plants (Elodea, Cabomba)</li>
                  <li>• Light sources of varying intensities</li>
                  <li>• Oxygen sensors and data loggers</li>
                  <li>• pH indicators and bromothymol blue</li>
                  <li>• Microscopes for cellular observation</li>
                  <li>• Caribbean plant specimens (various types)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Experimental Protocol</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-semibold text-green-600">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Oxygen Production Measurement (40 minutes)</p>
                      <p className="text-sm text-gray-600">
                        Quantify photosynthetic rates under different light conditions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-semibold text-green-600">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Cellular Respiration Analysis (35 minutes)</p>
                      <p className="text-sm text-gray-600">Measure CO₂ production and oxygen consumption</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-semibold text-green-600">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Adaptation Comparison (30 minutes)</p>
                      <p className="text-sm text-gray-600">Compare metabolic strategies across plant types</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-lime-50 border-l-4 border-lime-400">
                  <div className="flex items-start gap-2">
                    <Leaf className="h-5 w-5 text-lime-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-lime-800">Caribbean Plant Adaptations</h4>
                      <ul className="text-lime-700 text-sm mt-1">
                        <li>• C4 plants: Sugar cane, corn</li>
                        <li>• CAM plants: Cacti, agave, pineapple</li>
                        <li>• C3 plants: Most trees and shrubs</li>
                        <li>• Aquatic adaptations: Mangroves</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Advanced Photosynthesis Investigations</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800">Light Spectrum Analysis</h5>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Test different wavelengths of light</li>
                    <li>• Measure chlorophyll absorption spectra</li>
                    <li>• Compare efficiency across light colors</li>
                    <li>• Analyze underwater light penetration</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800">Temperature Effects</h5>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• Investigate optimal temperature ranges</li>
                    <li>• Analyze heat stress responses</li>
                    <li>• Compare tropical vs. temperate adaptations</li>
                    <li>• Study climate change implications</li>
                  </ul>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h5 className="font-medium text-yellow-800">CO₂ Concentration Studies</h5>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                    <li>• Test varying CO₂ concentrations</li>
                    <li>• Analyze carbon fixation efficiency</li>
                    <li>• Study ocean acidification effects</li>
                    <li>• Predict future productivity changes</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Cellular Respiration Experiments</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-800">Aerobic Respiration</h5>
                  <ul className="text-sm text-purple-700 mt-2 space-y-1">
                    <li>• Measure oxygen consumption rates</li>
                    <li>• Calculate respiratory quotients</li>
                    <li>• Analyze substrate utilization</li>
                    <li>• Compare plant and animal respiration</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-800">Anaerobic Conditions</h5>
                  <ul className="text-sm text-orange-700 mt-2 space-y-1">
                    <li>• Study fermentation in plant tissues</li>
                    <li>• Analyze alcohol and lactic acid production</li>
                    <li>• Investigate flood tolerance mechanisms</li>
                    <li>• Compare anaerobic efficiency</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity 2: Ecosystem Energy Flow */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
            <CardTitle className="text-2xl text-gray-900">
              Activity 2: Caribbean Ecosystem Energy Flow and Nutrient Cycling
            </CardTitle>
            <CardDescription className="text-gray-600">
              Model energy transfer and nutrient cycling in Caribbean marine and terrestrial ecosystems
            </CardDescription>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>95 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>Teams of 3</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                <span>Energy pyramids & biogeochemical cycles</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Learning Objectives</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Construct energy pyramids for Caribbean ecosystems</li>
                  <li>• Analyze nutrient cycling in tropical environments</li>
                  <li>• Investigate decomposition rates and factors</li>
                  <li>• Model carbon and nitrogen cycles</li>
                  <li>• Evaluate human impacts on ecosystem processes</li>
                </ul>

                <h4 className="font-semibold text-gray-900 mb-3 mt-6">Ecosystem Modeling Materials</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Ecosystem component cards and tokens</li>
                  <li>• Energy transfer simulation materials</li>
                  <li>• Decomposition chambers and organic matter</li>
                  <li>• Nutrient testing kits (N, P, K)</li>
                  <li>• pH meters and conductivity sensors</li>
                  <li>• Microscopes for decomposer observation</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Modeling Process</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-xs font-semibold text-amber-600">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Energy Pyramid Construction (35 minutes)</p>
                      <p className="text-sm text-gray-600">Build quantitative energy flow models</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-xs font-semibold text-amber-600">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Nutrient Cycling Investigation (40 minutes)</p>
                      <p className="text-sm text-gray-600">Track carbon, nitrogen, and phosphorus cycles</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-xs font-semibold text-amber-600">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Human Impact Assessment (20 minutes)</p>
                      <p className="text-sm text-gray-600">Analyze anthropogenic effects on ecosystem processes</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-orange-50 border-l-4 border-orange-400">
                  <div className="flex items-start gap-2">
                    <Microscope className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-800">Trophic Levels</h4>
                      <ul className="text-orange-700 text-sm mt-1">
                        <li>• Primary producers (1% efficiency)</li>
                        <li>• Primary consumers (10% efficiency)</li>
                        <li>• Secondary consumers (10% efficiency)</li>
                        <li>• Tertiary consumers (10% efficiency)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Caribbean Ecosystem Comparisons</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800">Coral Reef Ecosystem</h5>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• High productivity in nutrient-poor waters</li>
                    <li>• Tight nutrient recycling</li>
                    <li>• Complex food webs</li>
                    <li>• Calcium carbonate cycling</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800">Rainforest Ecosystem</h5>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• Rapid nutrient cycling</li>
                    <li>• High biomass, low soil nutrients</li>
                    <li>• Vertical stratification</li>
                    <li>• Mycorrhizal associations</li>
                  </ul>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h5 className="font-medium text-yellow-800">Mangrove Ecosystem</h5>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                    <li>• Salt tolerance adaptations</li>
                    <li>• Detritus-based food webs</li>
                    <li>• Nursery habitat functions</li>
                    <li>• Carbon sequestration</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Biogeochemical Cycle Investigations</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h5 className="font-medium text-indigo-800">Carbon Cycle</h5>
                  <ul className="text-sm text-indigo-700 mt-2 space-y-1">
                    <li>• Photosynthesis and respiration balance</li>
                    <li>• Ocean-atmosphere CO₂ exchange</li>
                    <li>• Soil carbon storage</li>
                    <li>• Human carbon emissions</li>
                  </ul>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg">
                  <h5 className="font-medium text-teal-800">Nitrogen Cycle</h5>
                  <ul className="text-sm text-teal-700 mt-2 space-y-1">
                    <li>• Nitrogen fixation by bacteria</li>
                    <li>• Nitrification and denitrification</li>
                    <li>• Agricultural fertilizer impacts</li>
                    <li>• Eutrophication processes</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Assessment Components (100 points total)</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800">Energy Flow Model (40 pts)</h5>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• Pyramid accuracy (20 pts)</li>
                    <li>• Efficiency calculations (15 pts)</li>
                    <li>• Energy transfer analysis (5 pts)</li>
                  </ul>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h5 className="font-medium text-amber-800">Nutrient Cycling (35 pts)</h5>
                  <ul className="text-sm text-amber-700 mt-2 space-y-1">
                    <li>• Cycle diagram completion (20 pts)</li>
                    <li>• Process explanation (10 pts)</li>
                    <li>• Rate measurements (5 pts)</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-800">Impact Analysis (25 pts)</h5>
                  <ul className="text-sm text-orange-700 mt-2 space-y-1">
                    <li>• Human impact identification (10 pts)</li>
                    <li>• Mitigation strategies (10 pts)</li>
                    <li>• Future predictions (5 pts)</li>
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
