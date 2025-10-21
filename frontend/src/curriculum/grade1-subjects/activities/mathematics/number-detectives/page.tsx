import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, ListChecks, Users, RotateCcw, CalendarDays } from "lucide-react"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

export default function NumberDetectivesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Number Detectives
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            An engaging number sense activity where students become "number detectives" searching for numbers 
            in their environment to develop mathematical awareness and counting skills.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Number Detectives transforms students into mathematical investigators as they search for numbers 
                throughout the classroom and school environment. This hands-on activity helps young learners develop 
                number recognition, counting skills, and an understanding of how numbers are used in everyday life. 
                Students record their findings and discuss the purpose and meaning of numbers they discover, building 
                a strong foundation for mathematical thinking.
              </p>

              <div className="relative w-full h-64 mb-6 rounded-md overflow-hidden">
                <img src="./g1math-number-detective.png" alt="Number Detectives Activity" className="w-full h-full object-cover" />
              </div>

              <h3 className="text-lg font-semibold mb-2">Learning Outcomes</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Develop number recognition and counting skills</li>
                <li>Understand the purpose and meaning of numbers in context</li>
                <li>Practice recording and organizing mathematical information</li>
                <li>Build vocabulary related to numbers and counting</li>
                <li>Develop observation and investigation skills</li>
                <li>Enhance communication about mathematical discoveries</li>
                <li>Connect classroom learning to real-world applications</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Curriculum Connections</h3>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>ELO 4:</strong> Learners will select and use appropriate strategies and cueing systems to
                  construct meaning when reading and viewing.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>SCO 4.1: Use strategies and cues</li>
                  <li>SCO 4.2: Use phonics and structural analysis</li>
                  <li>SCO 4.3: Use semantic and syntactic cues</li>
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
                <ListChecks className="h-5 w-5 text-blue-600" />
                Implementation Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-blue-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      1
                    </span>
                    Detective Setup (5-10 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Introduce the Number Detective theme with props (magnifying glasses, detective hats)</li>
                    <li>Explain that detectives use their eyes to find numbers everywhere</li>
                    <li>Set up recording sheets and clipboards for each student</li>
                    <li>Create a "case board" to display the day's number mystery</li>
                    <li>Establish safety rules for exploring the classroom</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-blue-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      2
                    </span>
                    Number Hunt (15-20 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Students explore the classroom and school environment</li>
                    <li>Record numbers they find on their detective sheets</li>
                    <li>Include numbers from books, calendars, clocks, and objects</li>
                    <li>Take photos or draw pictures of interesting number discoveries</li>
                    <li>Work in pairs or small groups for support</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-blue-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      3
                    </span>
                    Evidence Collection (10-15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Return to the classroom and organize findings</li>
                    <li>Create a class chart of discovered numbers</li>
                    <li>Categorize numbers by type (counting, identification, measurement)</li>
                    <li>Discuss why these numbers are important</li>
                    <li>Share interesting discoveries with the class</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-blue-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      4
                    </span>
                    Detective Report (10-15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Students present their findings to the class</li>
                    <li>Use detective language: "I discovered..." "The evidence shows..."</li>
                    <li>Practice counting and number recognition with found numbers</li>
                    <li>Discuss patterns and relationships between numbers</li>
                    <li>Create a class number museum display</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-blue-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      5
                    </span>
                    Case Closed (5-10 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Reflect on what was learned about numbers</li>
                    <li>Discuss where else numbers might be found</li>
                    <li>Plan future number detective missions</li>
                    <li>Celebrate successful detective work</li>
                    <li>Clean up materials and organize findings</li>
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
                <RotateCcw className="h-5 w-5 text-blue-600" />
                Activity Variations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                  <h3 className="text-md font-semibold mb-1 text-blue-700">Home Detective Mission</h3>
                  <p className="text-sm">
                    Send students home with detective kits to find numbers in their home environment and report back.
                  </p>
                </div>

                <div className="bg-green-50 p-3 rounded-md border border-green-200">
                  <h3 className="text-md font-semibold mb-1 text-green-700">Digital Number Hunt</h3>
                  <p className="text-sm">
                    Use tablets to photograph numbers and create a digital number collection with captions.
                  </p>
                </div>

                <div className="bg-purple-50 p-3 rounded-md border border-purple-200">
                  <h3 className="text-md font-semibold mb-1 text-purple-700">Number Story Creation</h3>
                  <p className="text-sm">
                    Use discovered numbers to create simple number stories or word problems.
                  </p>
                </div>

                <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                  <h3 className="text-md font-semibold mb-1 text-amber-700">Number Art Gallery</h3>
                  <p className="text-sm">
                    Create artistic representations of found numbers using various art materials.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Differentiation Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-blue-700">For Students Who Excel</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Search for larger numbers (beyond 20)</li>
                    <li>Identify number patterns and sequences</li>
                    <li>Create number riddles for classmates</li>
                    <li>Research the history of numbers</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-blue-700">For Students Who Need Support</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Focus on numbers 1-10 initially</li>
                    <li>Provide picture clues for number locations</li>
                    <li>Work with a partner for support</li>
                    <li>Use familiar objects and locations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-blue-700">Language Considerations</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use numbers in students' home languages</li>
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
                <CalendarDays className="h-5 w-5 text-blue-600" />
                Assessment Rubric
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-blue-700">Number Recognition</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li><strong>Excellent:</strong> Recognizes all numbers 1-20</li>
                    <li><strong>Good:</strong> Recognizes most numbers 1-20</li>
                    <li><strong>Developing:</strong> Recognizes some numbers 1-10</li>
                    <li><strong>Beginning:</strong> Recognizes few numbers</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-blue-700">Investigation Skills</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li><strong>Excellent:</strong> Finds many numbers independently</li>
                    <li><strong>Good:</strong> Finds several numbers with some guidance</li>
                    <li><strong>Developing:</strong> Finds some numbers with support</li>
                    <li><strong>Beginning:</strong> Needs significant guidance</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-blue-700">Communication</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li><strong>Excellent:</strong> Clearly explains findings</li>
                    <li><strong>Good:</strong> Describes most findings clearly</li>
                    <li><strong>Developing:</strong> Describes some findings</li>
                    <li><strong>Beginning:</strong> Struggles to communicate findings</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-xl shadow-md border border-blue-200 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">Materials and Preparation Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-blue-700">Essential Materials</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Clipboards and recording sheets for each student</li>
              <li>Pencils and erasers</li>
              <li>Magnifying glasses (optional but engaging)</li>
              <li>Detective hats or badges for role-play</li>
              <li>Chart paper for class findings</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-blue-700">Preparation Tips</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Pre-scout the area for interesting number discoveries</li>
              <li>Ensure safety of exploration areas</li>
              <li>Prepare recording sheets with clear categories</li>
              <li>Set up a central display area for findings</li>
              <li>Have backup activities ready for indoor exploration</li>
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
        <Link to="/curriculum/grade1-subjects/activities/mathematics/shape-hunt">
          <Button className="bg-blue-600 hover:bg-blue-700">Next Activity: Shape Hunt</Button>
        </Link>
      </div>
    </div>
  )
}
