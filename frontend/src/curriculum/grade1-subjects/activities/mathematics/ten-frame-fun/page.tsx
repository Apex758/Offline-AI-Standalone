import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Hash, ListChecks, Users, RotateCcw, CalendarDays } from "lucide-react"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

export default function TenFrameFunPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-teal-100 to-cyan-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-600">
            Ten Frame Fun
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            An engaging number sense activity using ten frames to develop counting, addition, and 
            number composition skills through hands-on exploration and games.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-teal-600" />
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Ten Frame Fun is an interactive number sense activity that uses ten frames to help 
                students develop a deep understanding of numbers 1-10 and beyond. Through hands-on 
                manipulation of counters, dice, and ten frame mats, students explore number composition, 
                addition strategies, and visual representations of quantities. This engaging approach 
                builds a strong foundation for mathematical thinking and problem-solving skills.
              </p>

              <div className="relative w-full h-64 mb-6 rounded-md overflow-hidden">
                <img src="/g1math-ten-frame-fun.png" alt="Ten Frame Fun Activity" className="w-full h-full object-cover" />
              </div>

              <h3 className="text-lg font-semibold mb-2">Learning Outcomes</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Recognize and represent numbers 1-10 on ten frames</li>
                <li>Understand number composition and decomposition</li>
                <li>Develop addition strategies using visual models</li>
                <li>Practice counting and subitizing skills</li>
                <li>Build number sense and mathematical fluency</li>
                <li>Work with partners in cooperative learning activities</li>
                <li>Connect concrete manipulatives to abstract concepts</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Curriculum Connections</h3>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>ELO 5:</strong> Learners will use number concepts and operations to solve problems.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>SCO 5.1: Use number concepts</li>
                  <li>SCO 5.2: Use number operations</li>
                  <li>SCO 5.3: Solve number problems</li>
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
                <ListChecks className="h-5 w-5 text-teal-600" />
                Implementation Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-teal-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      1
                    </span>
                    Ten Frame Introduction (10-15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Introduce ten frames as a tool for showing numbers</li>
                    <li>Demonstrate filling a ten frame with counters</li>
                    <li>Practice counting numbers 1-10 on ten frames</li>
                    <li>Discuss the visual patterns created</li>
                    <li>Introduce vocabulary: full, empty, row, column</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-teal-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      2
                    </span>
                    Number Recognition Games (15-20 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Play "Show Me" with ten frame cards</li>
                    <li>Students create numbers on their ten frames</li>
                    <li>Practice subitizing (quick recognition) of quantities</li>
                    <li>Compare different representations of the same number</li>
                    <li>Work in pairs to check each other's work</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-teal-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      3
                    </span>
                    Addition Activities (15-20 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Roll dice and add numbers using ten frames</li>
                    <li>Explore different ways to make the same sum</li>
                    <li>Practice "making ten" strategies</li>
                    <li>Record addition sentences with ten frame drawings</li>
                    <li>Discuss efficient counting strategies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-teal-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      4
                    </span>
                    Partner Games (15-20 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Play "Ten Frame War" with number cards</li>
                    <li>Create number stories using ten frames</li>
                    <li>Challenge partners to find missing addends</li>
                    <li>Practice verbalizing mathematical thinking</li>
                    <li>Celebrate successful problem-solving strategies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-teal-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      5
                    </span>
                    Reflection and Extension (10-15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Share favorite ten frame activities</li>
                    <li>Discuss what was learned about numbers</li>
                    <li>Explore how ten frames help with counting</li>
                    <li>Plan future ten frame challenges</li>
                    <li>Create individual ten frame portfolios</li>
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
                <RotateCcw className="h-5 w-5 text-teal-600" />
                Activity Variations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-teal-50 p-3 rounded-md border border-teal-200">
                  <h3 className="text-md font-semibold mb-1 text-teal-700">Double Ten Frames</h3>
                  <p className="text-sm">
                    Extend to numbers 11-20 using two ten frames side by side.
                  </p>
                </div>

                <div className="bg-green-50 p-3 rounded-md border border-green-200">
                  <h3 className="text-md font-semibold mb-1 text-green-700">Digital Ten Frames</h3>
                  <p className="text-sm">
                    Use interactive whiteboards or tablets for digital ten frame activities.
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                  <h3 className="text-md font-semibold mb-1 text-blue-700">Ten Frame Stories</h3>
                  <p className="text-sm">
                    Create word problems and stories using ten frame representations.
                  </p>
                </div>

                <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                  <h3 className="text-md font-semibold mb-1 text-amber-700">Ten Frame Art</h3>
                  <p className="text-sm">
                    Create artistic representations using ten frame patterns and designs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-teal-600" />
                Differentiation Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-teal-700">For Students Who Excel</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Work with larger numbers (11-20)</li>
                    <li>Explore subtraction using ten frames</li>
                    <li>Create complex addition combinations</li>
                    <li>Design new ten frame games</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-teal-700">For Students Who Need Support</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Focus on numbers 1-5 initially</li>
                    <li>Use larger, easier-to-handle counters</li>
                    <li>Provide ten frame templates with outlines</li>
                    <li>Work with a partner for support</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-teal-700">Language Considerations</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use number words in students' home languages</li>
                    <li>Provide visual number cards for reference</li>
                    <li>Allow students to count in their preferred language</li>
                    <li>Use gestures and expressions to support understanding</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-teal-600" />
                Assessment Rubric
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-teal-700">Number Recognition</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li><strong>Excellent:</strong> Recognizes all numbers 1-10 on ten frames</li>
                    <li><strong>Good:</strong> Recognizes most numbers 1-10 on ten frames</li>
                    <li><strong>Developing:</strong> Recognizes some numbers 1-10 on ten frames</li>
                    <li><strong>Beginning:</strong> Struggles with number recognition</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-teal-700">Ten Frame Usage</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li><strong>Excellent:</strong> Uses ten frames independently and accurately</li>
                    <li><strong>Good:</strong> Uses ten frames with some guidance</li>
                    <li><strong>Developing:</strong> Uses ten frames with significant support</li>
                    <li><strong>Beginning:</strong> Needs help using ten frames</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-teal-700">Addition Skills</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li><strong>Excellent:</strong> Solves addition problems using ten frames</li>
                    <li><strong>Good:</strong> Solves some addition problems using ten frames</li>
                    <li><strong>Developing:</strong> Solves addition problems with support</li>
                    <li><strong>Beginning:</strong> Struggles with addition concepts</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-teal-50 p-6 rounded-xl shadow-md border border-teal-200 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-teal-800">Materials and Preparation Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-teal-700">Essential Materials</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ten frame mats (laminated or printed)</li>
              <li>Counters (Unifix cubes, buttons, or small objects)</li>
              <li>Dice for number generation</li>
              <li>Number cards (1-10)</li>
              <li>Recording sheets for activities</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-teal-700">Preparation Tips</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Prepare enough ten frame mats for each student</li>
              <li>Organize counters in easy-to-access containers</li>
              <li>Set up partner work stations around the classroom</li>
              <li>Have backup activities ready for different skill levels</li>
              <li>Test ten frame activities beforehand</li>
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
        <Link to="/curriculum/grade1-subjects/activities/mathematics/pattern-playground">
          <Button className="bg-teal-600 hover:bg-teal-700">Next Activity: Pattern Playground</Button>
        </Link>
      </div>
    </div>
  )
}
