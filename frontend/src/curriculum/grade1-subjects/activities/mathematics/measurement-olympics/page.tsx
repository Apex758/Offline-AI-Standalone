import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Ruler, ListChecks, Users, RotateCcw, CalendarDays } from "lucide-react"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

export default function MeasurementOlympicsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-orange-100 to-red-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
            Measurement Olympics
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            An exciting measurement activity where students participate in Olympic-style challenges using 
            non-standard units to develop measurement skills and understanding.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-orange-600" />
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Measurement Olympics transforms the classroom into an exciting arena where students become 
                measurement athletes competing in various challenges. Using non-standard units like paper clips, 
                Unifix cubes, and string, students measure distance, capacity, and time while developing 
                fundamental measurement concepts. This engaging approach helps young learners understand 
                measurement as a process of comparison and develops their ability to use appropriate tools 
                and units.
              </p>

              <div className="relative w-full h-64 mb-6 rounded-md overflow-hidden">
                <img src="/g1math-measurement-olympics.png" alt="Measurement Olympics Activity" className="w-full h-full object-cover" />
              </div>

              <h3 className="text-lg font-semibold mb-2">Learning Outcomes</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Understand measurement as a process of comparison</li>
                <li>Use non-standard units to measure length, capacity, and time</li>
                <li>Develop estimation and measurement skills</li>
                <li>Practice recording and comparing measurements</li>
                <li>Build vocabulary related to measurement concepts</li>
                <li>Work collaboratively in competitive activities</li>
                <li>Connect measurement to real-world applications</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Curriculum Connections</h3>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>ELO 8:</strong> Learners will use measurement to solve problems and communicate 
                  information.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>SCO 8.1: Use measurement concepts</li>
                  <li>SCO 8.2: Use measurement tools</li>
                  <li>SCO 8.3: Solve measurement problems</li>
                </ul>
              </div>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>ELO 6:</strong> Learners will use mathematical language and symbols to communicate 
                  mathematical thinking.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>SCO 6.1: Use mathematical language</li>
                  <li>SCO 6.2: Use mathematical symbols</li>
                  <li>SCO 6.3: Communicate mathematical thinking</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-orange-600" />
                Implementation Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-orange-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      1
                    </span>
                    Olympic Setup (10-15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Transform classroom into Olympic arena with decorations</li>
                    <li>Set up measurement stations around the room</li>
                    <li>Introduce Olympic theme and measurement concepts</li>
                    <li>Explain non-standard units and their use</li>
                    <li>Divide students into Olympic teams</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-orange-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      2
                    </span>
                    Distance Challenge (15-20 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Teams measure various distances using paper clips</li>
                    <li>Measure classroom objects, hallways, and play areas</li>
                    <li>Record measurements and compare results</li>
                    <li>Discuss why measurements might differ</li>
                    <li>Practice estimation before measuring</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-orange-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      3
                    </span>
                    Capacity Challenge (15-20 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Teams measure container capacities using Unifix cubes</li>
                    <li>Fill various containers and count cubes needed</li>
                    <li>Compare container sizes and capacities</li>
                    <li>Estimate capacity before measuring</li>
                    <li>Create capacity ranking from smallest to largest</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-orange-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      4
                    </span>
                    Time Challenge (10-15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Teams complete activities while timing with sand timers</li>
                    <li>Measure how long different activities take</li>
                    <li>Compare times between teams and activities</li>
                    <li>Discuss why some activities take longer</li>
                    <li>Practice estimating time durations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-orange-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      5
                    </span>
                    Medal Ceremony (10-15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Compile and display all measurement results</li>
                    <li>Award medals for different measurement categories</li>
                    <li>Discuss what was learned about measurement</li>
                    <li>Compare results and identify patterns</li>
                    <li>Plan future measurement challenges</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-orange-600" />
                Activity Variations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-orange-50 p-3 rounded-md border border-orange-200">
                  <h3 className="text-md font-semibold mb-1 text-orange-700">Home Olympics</h3>
                  <p className="text-sm">
                    Send students home to conduct measurement challenges with family members.
                  </p>
                </div>

                <div className="bg-green-50 p-3 rounded-md border border-green-200">
                  <h3 className="text-md font-semibold mb-1 text-green-700">Digital Measurement</h3>
                  <p className="text-sm">
                    Use tablets to photograph and record measurements for digital portfolios.
                  </p>
                </div>

                <div className="bg-purple-50 p-3 rounded-md border border-purple-200">
                  <h3 className="text-md font-semibold mb-1 text-purple-700">Measurement Art</h3>
                  <p className="text-sm">
                    Create artwork using measured materials and display in measurement gallery.
                  </p>
                </div>

                <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                  <h3 className="text-md font-semibold mb-1 text-amber-700">Standard Units</h3>
                  <p className="text-sm">
                    Introduce standard units and compare with non-standard measurements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                Differentiation Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-orange-700">For Students Who Excel</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use more complex measurement units</li>
                    <li>Measure irregular shapes and objects</li>
                    <li>Create measurement conversion charts</li>
                    <li>Design new Olympic challenges</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-orange-700">For Students Who Need Support</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use larger, easier-to-count units</li>
                    <li>Provide measurement templates</li>
                    <li>Work with a partner for support</li>
                    <li>Focus on one measurement type at a time</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-orange-700">Language Considerations</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use measurement terms in students' home languages</li>
                    <li>Provide visual measurement cards for reference</li>
                    <li>Allow students to describe measurements in their preferred language</li>
                    <li>Use gestures and expressions to support understanding</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-orange-600" />
                Assessment Rubric
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-orange-700">Measurement Accuracy</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li><strong>Excellent:</strong> Consistently accurate measurements</li>
                    <li><strong>Good:</strong> Mostly accurate measurements</li>
                    <li><strong>Developing:</strong> Some accurate measurements</li>
                    <li><strong>Beginning:</strong> Struggles with measurement accuracy</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-orange-700">Unit Understanding</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li><strong>Excellent:</strong> Understands and uses units correctly</li>
                    <li><strong>Good:</strong> Uses units with some understanding</li>
                    <li><strong>Developing:</strong> Uses units with guidance</li>
                    <li><strong>Beginning:</strong> Needs help understanding units</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-orange-700">Estimation Skills</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li><strong>Excellent:</strong> Makes accurate estimates</li>
                    <li><strong>Good:</strong> Makes reasonable estimates</li>
                    <li><strong>Developing:</strong> Makes some estimates</li>
                    <li><strong>Beginning:</strong> Struggles with estimation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-orange-50 p-6 rounded-xl shadow-md border border-orange-200 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-orange-800">Materials and Preparation Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-orange-700">Essential Materials</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Unifix cubes for capacity measurement</li>
              <li>Paper clips for distance measurement</li>
              <li>String for measuring curved surfaces</li>
              <li>Cups and containers of various sizes</li>
              <li>Sand timers for time measurement</li>
              <li>Recording sheets for each team</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-orange-700">Preparation Tips</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Set up measurement stations around the classroom</li>
              <li>Prepare Olympic-themed decorations and materials</li>
              <li>Test measurement activities beforehand</li>
              <li>Ensure safety of all measurement areas</li>
              <li>Have backup activities ready for indoor use</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Link to="/curriculum/grade1-subjects/activities/mathematics">
          <Button variant="outline" className="mr-4 bg-transparent">
            ← Back to Mathematics Activities
          </Button>
        </Link>
        <Link to="/curriculum/grade1-subjects/activities/mathematics/favorite-things-graph">
          <Button className="bg-orange-600 hover:bg-orange-700">Next Activity: Our Favorite Things Graph</Button>
        </Link>
      </div>
    </div>
  )
}
