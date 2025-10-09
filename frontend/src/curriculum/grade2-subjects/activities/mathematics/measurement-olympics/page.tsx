import { Breadcrumb } from "@/components/breadcrumb"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Printer } from "lucide-react"

export default function MeasurementOlympicsActivity() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Curriculum", href: "/curriculum" },
            { label: "Grade 2 Subjects", href: "/curriculum/grade2-subjects" },
            { label: "Mathematics", href: "/curriculum/grade2-subjects/mathematics" },
            { label: "Activities", href: "/curriculum/grade2-subjects/activities/mathematics" },
            {
              label: "Measurement Olympics",
              href: "/curriculum/grade2-subjects/activities/mathematics/measurement-olympics",
            },
          ]}
        />
        <ThemeToggle />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Measurement Olympics</h1>
        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
          <span className="mr-4">Time: 45 minutes</span>
          <span>Difficulty: Easy</span>
        </div>
        <img
          src="/placeholder.svg?height=300&width=800&query=children+measuring+activities"
          alt="Measurement Olympics Activity"
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="mb-4">
                In this engaging activity, students participate in a "Measurement Olympics" where they rotate through
                various stations to measure objects using both standard and non-standard units. The competitive format
                makes learning about measurement fun and interactive while developing essential measurement skills.
              </p>
              <p>
                Students will work in teams to complete measurement challenges, record their findings, and compare
                results. This hands-on approach helps students understand the importance of accurate measurement and the
                relationship between different units of measure.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Learning Objectives</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Measure the length of objects using standard units (centimeters, inches)</li>
                <li>Measure the length of objects using non-standard units (paper clips, cubes, etc.)</li>
                <li>Compare measurements using appropriate vocabulary (longer, shorter, taller, etc.)</li>
                <li>Understand the relationship between the size of a unit and the number of units needed</li>
                <li>Record and represent measurement data accurately</li>
                <li>Estimate lengths before measuring to develop measurement sense</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Materials</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Rulers (centimeters and inches)</li>
                <li>Measuring tapes</li>
                <li>Non-standard measuring tools (paper clips, cubes, craft sticks, etc.)</li>
                <li>Various objects to measure at each station</li>
                <li>Station instruction cards</li>
                <li>Student recording sheets or "Olympic Scorecards"</li>
                <li>Clipboards</li>
                <li>Pencils</li>
                <li>Timer or stopwatch</li>
                <li>Optional: Medals or certificates for teams</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Preparation</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Set up 4-6 measurement stations around the classroom or outdoor area</li>
                <li>Prepare station instruction cards with clear directions for each measurement task</li>
                <li>Gather objects of various lengths for students to measure at each station</li>
                <li>Create student recording sheets or "Olympic Scorecards"</li>
                <li>Organize students into teams of 3-4 students</li>
                <li>Place appropriate measuring tools at each station</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Steps</h2>
              <ol className="list-decimal pl-6 space-y-4">
                <li>
                  <strong>Introduction (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Introduce the concept of the "Measurement Olympics"</li>
                    <li>Review proper measuring techniques (starting at zero, measuring in a straight line, etc.)</li>
                    <li>Demonstrate how to use different measuring tools</li>
                    <li>Explain how to record measurements on the scorecard</li>
                    <li>Review the rotation procedure for moving between stations</li>
                  </ul>
                </li>
                <li>
                  <strong>Team Organization (3 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Divide students into teams of 3-4</li>
                    <li>Assign each team a starting station</li>
                    <li>Distribute scorecards and clipboards to each team</li>
                    <li>Review expectations for teamwork and cooperation</li>
                  </ul>
                </li>
                <li>
                  <strong>Station Rotations (30 minutes, 5 minutes per station):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      <strong>Station 1: Standard Measurement (Centimeters)</strong> - Measure classroom objects using
                      centimeter rulers
                    </li>
                    <li>
                      <strong>Station 2: Standard Measurement (Inches)</strong> - Measure classroom objects using inch
                      rulers
                    </li>
                    <li>
                      <strong>Station 3: Non-Standard Measurement (Paper Clips)</strong> - Measure objects using paper
                      clips
                    </li>
                    <li>
                      <strong>Station 4: Non-Standard Measurement (Cubes)</strong> - Measure objects using connecting
                      cubes
                    </li>
                    <li>
                      <strong>Station 5: Body Measurement</strong> - Measure objects using hand spans or finger widths
                    </li>
                    <li>
                      <strong>Station 6: Estimation Challenge</strong> - Estimate lengths before measuring to check
                      accuracy
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Wrap-up Discussion (7 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Gather students to discuss their findings and observations</li>
                    <li>Compare measurements across teams to check for consistency</li>
                    <li>Discuss why measurements might differ slightly between teams</li>
                    <li>Talk about which measuring tools were most appropriate for different objects</li>
                    <li>Discuss the relationship between unit size and measurement count</li>
                  </ul>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Differentiation</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">For Students Who Need Support:</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Provide visual guides showing proper ruler placement and reading</li>
                    <li>Use larger objects that are easier to measure</li>
                    <li>Pair students with peer helpers</li>
                    <li>Simplify recording sheets with fewer measurements per station</li>
                    <li>Focus on whole-unit measurements initially</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">For Students Who Need Challenge:</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Include measurements that require precision to half or quarter units</li>
                    <li>Add stations that involve measuring perimeter of shapes</li>
                    <li>Include conversion challenges between different units</li>
                    <li>Add problem-solving tasks that require measurement data</li>
                    <li>Challenge students to create their own measurement tools with consistent units</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Assessment</h2>
              <p className="mb-4">Observe students during the activity and look for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Proper use of measuring tools (starting at zero, aligning correctly, reading accurately)</li>
                <li>Accurate recording of measurements</li>
                <li>Understanding of the relationship between different units</li>
                <li>Ability to estimate lengths reasonably</li>
                <li>Appropriate use of measurement vocabulary</li>
                <li>Teamwork and collaboration skills</li>
              </ul>
              <p className="mt-4">
                Collect and review student scorecards to assess accuracy and understanding. Note any patterns of errors
                that might indicate misconceptions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Extensions</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create a class measurement book with illustrations and examples of different units</li>
                <li>Extend to measuring area by covering surfaces with square units</li>
                <li>Explore measurement in real-world contexts (cooking, construction, etc.)</li>
                <li>Compare measurements of the same objects using different units</li>
                <li>Investigate the history of measurement systems and why standard units were developed</li>
                <li>Design and build an object to specific measurement requirements</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Printable Station Cards
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Olympic Scorecard Template
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Measurement Reference Guide
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Assessment Checklist
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Curriculum Connections</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium">Measurement:</h3>
                    <p className="text-sm">Understanding standard and non-standard units of length</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Number Sense:</h3>
                    <p className="text-sm">Recording and comparing numerical measurements</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Data Handling:</h3>
                    <p className="text-sm">Collecting and recording measurement data</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Teacher Tips</h2>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>Practice proper measuring techniques before the activity</li>
                  <li>Take photos of students measuring at different stations for documentation</li>
                  <li>Consider conducting the activity outdoors for more space and varied objects to measure</li>
                  <li>Have extra measuring tools available in case of breakage</li>
                  <li>Use a timer or music to signal station rotations</li>
                </ul>
              </CardContent>
            </Card>

            <div className="flex justify-between mt-6">
              <Button variant="outline" className="flex items-center gap-2">
                <ChevronLeft size={16} />
                Previous Activity
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                Next Activity
                <ChevronRight size={16} />
              </Button>
            </div>

            <Button variant="outline" className="w-full mt-4 flex items-center justify-center gap-2">
              <Printer size={16} />
              Print Activity
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
