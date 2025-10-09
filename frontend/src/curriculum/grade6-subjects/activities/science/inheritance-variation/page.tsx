"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb } from "@/components/breadcrumb"
import { Clock, Users, Target, AlertTriangle, Camera } from "lucide-react"

export default function InheritanceVariationActivitiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 6 Subjects", href: "/curriculum/grade6-subjects" },
          { label: "Science Activities", href: "/curriculum/grade6-subjects/activities/science" },
          {
            label: "Inheritance, Variation and Life Cycles",
            href: "/curriculum/grade6-subjects/activities/science/inheritance-variation",
          },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Inheritance, Variation and Life Cycles Activities</h1>
        <p className="text-xl text-gray-600 mb-6">
          Long-term investigations of complete life cycles, genetic variation, and reproduction through systematic
          observation and data collection.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Activity 1: Butterfly Life Cycle */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="text-2xl text-gray-900">
              Activity 1: Complete Butterfly Life Cycle Investigation
            </CardTitle>
            <CardDescription className="text-gray-600">
              Document complete metamorphosis stages and analyze individual variation within species
            </CardDescription>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>3-4 weeks with daily 15-minute observations</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>Teams of 4 (2-3 teams per habitat)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                <span>Long-term observation & data tracking</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Learning Objectives</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Document complete metamorphosis stages</li>
                  <li>• Measure growth rates and developmental timing</li>
                  <li>• Compare individual variation within species</li>
                  <li>• Analyze environmental factors affecting development</li>
                  <li>• Connect life cycle knowledge to pest management</li>
                </ul>

                <h4 className="font-semibold text-gray-900 mb-3 mt-6">Materials per Habitat</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Large clear container (10-gallon aquarium)</li>
                  <li>• Ventilated lid with fine mesh</li>
                  <li>• Fresh host plants (species-dependent)</li>
                  <li>• Monarch caterpillars or local species</li>
                  <li>• Digital calipers for precise measurement</li>
                  <li>• Digital microscopes or hand lenses</li>
                  <li>• Temperature and humidity monitors</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Weekly Investigation Schedule</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-semibold text-green-600">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Week 1: Larval Stage Documentation</p>
                      <p className="text-sm text-gray-600">Daily measurements, feeding behavior, molting events</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-semibold text-green-600">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Week 2: Growth Rate Analysis</p>
                      <p className="text-sm text-gray-600">
                        Calculate growth rates, compare individuals, environmental correlation
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-semibold text-green-600">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Week 3: Pupation and Chrysalis Formation</p>
                      <p className="text-sm text-gray-600">
                        Document metamorphosis, monitor development, predict emergence
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-semibold text-green-600">
                      4
                    </div>
                    <div>
                      <p className="font-medium">Week 4: Adult Emergence and Analysis</p>
                      <p className="text-sm text-gray-600">Document emergence, measure adults, comparative analysis</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400">
                  <div className="flex items-start gap-2">
                    <Camera className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800">Documentation Protocol</h4>
                      <ul className="text-blue-700 text-sm mt-1">
                        <li>• Daily photographs with scale rulers</li>
                        <li>• Precise measurements with digital calipers</li>
                        <li>• Behavioral observations and timing</li>
                        <li>• Environmental condition monitoring</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Data Analysis Projects</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-800">Individual Growth Analysis</h5>
                  <ul className="text-sm text-purple-700 mt-2 space-y-1">
                    <li>• Create detailed growth charts for each caterpillar</li>
                    <li>• Calculate average daily growth rates per instar</li>
                    <li>• Identify factors correlating with development speed</li>
                    <li>• Compare individual variation within group</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-800">Environmental Impact Study</h5>
                  <ul className="text-sm text-orange-700 mt-2 space-y-1">
                    <li>• Correlate development timing with temperature</li>
                    <li>• Analyze humidity effects on molting success</li>
                    <li>• Compare food plant quality effects</li>
                    <li>• Document unusual environmental events</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Assessment Components (100 points total)</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800">Scientific Journal (40 pts)</h5>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• Daily observation entries</li>
                    <li>• Technical drawings with labels</li>
                    <li>• Data tables with measurements</li>
                    <li>• Weekly reflection entries</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800">Data Analysis Report (35 pts)</h5>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Statistical analysis of growth data</li>
                    <li>• Environmental correlation analysis</li>
                    <li>• Individual development patterns</li>
                    <li>• Agricultural applications</li>
                  </ul>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-800">Presentation Project (25 pts)</h5>
                  <ul className="text-sm text-purple-700 mt-2 space-y-1">
                    <li>• 10-minute team presentation</li>
                    <li>• Visual aids and demonstrations</li>
                    <li>• Q&A session participation</li>
                    <li>• Conservation recommendations</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity 2: Plant Reproduction */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50">
            <CardTitle className="text-2xl text-gray-900">
              Activity 2: Plant Reproduction and Pollination Laboratory
            </CardTitle>
            <CardDescription className="text-gray-600">
              Investigate plant reproductive structures and pollination processes through hands-on dissection and
              experimentation
            </CardDescription>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>90 minutes (can be conducted over 2 days)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>Pairs</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                <span>Flower dissection & pollination simulation</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Learning Objectives</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Identify male and female reproductive structures in flowers</li>
                  <li>• Demonstrate pollination process through simulation</li>
                  <li>• Analyze adaptations for different pollination strategies</li>
                  <li>• Investigate factors affecting pollination success</li>
                  <li>• Connect plant reproduction to ecosystem services</li>
                </ul>

                <h4 className="font-semibold text-gray-900 mb-3 mt-6">Investigation Phases</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-pink-50 rounded">
                    <p className="font-medium text-pink-800">Phase 1: Flower Structure Investigation (30 min)</p>
                    <p className="text-sm text-pink-700">Systematic dissection and microscopic examination</p>
                  </div>
                  <div className="p-2 bg-rose-50 rounded">
                    <p className="font-medium text-rose-800">Phase 2: Pollination Simulation (35 min)</p>
                    <p className="text-sm text-rose-700">Hand pollination and pollinator simulation</p>
                  </div>
                  <div className="p-2 bg-red-50 rounded">
                    <p className="font-medium text-red-800">Phase 3: Pollination Strategy Analysis (25 min)</p>
                    <p className="text-sm text-red-700">Classification and efficiency analysis</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Materials per Pair</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Fresh flowers (hibiscus, lily, rose, sunflower)</li>
                  <li>• Dissection tools: scalpels, forceps, probes</li>
                  <li>• Hand lenses (10x magnification)</li>
                  <li>• Microscopes with prepared pollen slides</li>
                  <li>• Cotton swabs of various sizes</li>
                  <li>• Paintbrushes (small and medium)</li>
                  <li>• Colored powder (pollen simulation)</li>
                  <li>• UV light source (blacklight)</li>
                </ul>

                <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Safety Considerations</h4>
                      <ul className="text-yellow-700 text-sm mt-1">
                        <li>• Proper handling of dissection tools</li>
                        <li>• Supervision during microscope use</li>
                        <li>• Allergy awareness for pollen sensitivity</li>
                        <li>• Proper disposal of biological materials</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Pollination Simulation Experiments</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800">Hand Pollination Technique</h5>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Use paintbrush to collect pollen from anther</li>
                    <li>• Transfer to stigma (self vs. cross pollination)</li>
                    <li>• Use colored powders to track transfer</li>
                    <li>• Document success rate of pollen adhesion</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800">Pollinator Simulation</h5>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• Students act as different pollinators</li>
                    <li>• Use cotton swabs of different sizes</li>
                    <li>• Track pollen transfer efficiency</li>
                    <li>• Analyze optimal pollinator types</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Assessment Components (85 points total)</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-medium text-purple-800">Laboratory Report (45 pts)</h5>
                  <ul className="text-sm text-purple-700 mt-2 space-y-1">
                    <li>• Flower dissection documentation (15 pts)</li>
                    <li>• Experimental results (20 pts)</li>
                    <li>• Analysis and conclusions (10 pts)</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-medium text-orange-800">Communication Project (25 pts)</h5>
                  <ul className="text-sm text-orange-700 mt-2 space-y-1">
                    <li>• Scientific poster OR</li>
                    <li>• Video documentary OR</li>
                    <li>• Teaching demonstration</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-800">Problem-Solving (15 pts)</h5>
                  <ul className="text-sm text-red-700 mt-2 space-y-1">
                    <li>• Garden design for pollinators</li>
                    <li>• Crop pollination solutions</li>
                    <li>• Conservation strategies</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Real-World Applications</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800">Agricultural Applications</h5>
                  <p className="text-sm text-green-700">
                    Commercial crop pollination, Colony Collapse Disorder impact, hand-pollination techniques
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800">Conservation Projects</h5>
                  <p className="text-sm text-blue-700">
                    Local flower and pollinator surveys, butterfly garden design, habitat improvement
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
