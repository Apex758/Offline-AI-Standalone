import { Breadcrumb } from "@/components/breadcrumb"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Printer } from "lucide-react"

export default function GrowingPatternsActivity() {
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
            { label: "Growing Patterns", href: "/curriculum/grade2-subjects/activities/mathematics/growing-patterns" },
          ]}
        />
        <ThemeToggle />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Growing Patterns</h1>
        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
          <span className="mr-4">Time: 25 minutes</span>
          <span>Difficulty: Medium</span>
        </div>
        <img
          src="/placeholder.svg?height=300&width=800&query=growing+patterns+math"
          alt="Growing Patterns Activity"
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="mb-4">
                In this activity, students explore growing patterns using manipulatives, drawings, and numbers. They
                will identify, extend, and create patterns that grow according to a rule, developing their algebraic
                thinking and pattern recognition skills.
              </p>
              <p>
                Students will work with visual patterns that increase in a predictable way, identify the rule that
                governs the growth, and use that understanding to extend patterns and predict future terms. This
                foundational work with patterns helps build the groundwork for later algebraic concepts.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Learning Objectives</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Identify growing patterns in visual and numerical contexts</li>
                <li>Determine the rule that describes how a pattern grows</li>
                <li>Extend growing patterns based on the identified rule</li>
                <li>Create original growing patterns following a specified rule</li>
                <li>Make predictions about future terms in a growing pattern</li>
                <li>Use mathematical vocabulary to describe growing patterns</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Materials</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Pattern blocks or other manipulatives (cubes, counters, etc.)</li>
                <li>Growing pattern cards (prepared examples)</li>
                <li>Student recording sheets</li>
                <li>Colored pencils or markers</li>
                <li>Grid paper</li>
                <li>Chart paper for class examples</li>
                <li>Optional: Digital pattern tool on tablets or computers</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Preparation</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Create or gather examples of growing patterns (visual and numerical)</li>
                <li>Prepare pattern cards showing the first 3-4 terms of different growing patterns</li>
                <li>Print student recording sheets with space for drawing and describing patterns</li>
                <li>Organize manipulatives in containers for easy distribution</li>
                <li>Set up a demonstration area with document camera or large chart paper</li>
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
                    <li>Show students a simple growing pattern (e.g., 1 triangle, 2 triangles, 3 triangles, etc.)</li>
                    <li>Ask students to describe what they notice about how the pattern changes</li>
                    <li>Introduce vocabulary: growing pattern, term, rule</li>
                    <li>
                      Demonstrate how to identify and describe the rule (e.g., "Each term adds one more triangle")
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Guided Practice (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Show a different growing pattern with the first 3 terms visible</li>
                    <li>Guide students to identify the pattern rule</li>
                    <li>Have students predict what the next 2 terms would look like</li>
                    <li>Reveal or create the next terms to check predictions</li>
                    <li>Model how to record the pattern and its rule</li>
                  </ul>
                </li>
                <li>
                  <strong>Partner Exploration (8 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Arrange students in pairs</li>
                    <li>Distribute pattern cards and manipulatives to each pair</li>
                    <li>Partners work together to identify the rule for their pattern</li>
                    <li>Partners extend the pattern by creating the next 2-3 terms</li>
                    <li>Partners record their work on the recording sheet</li>
                  </ul>
                </li>
                <li>
                  <strong>Pattern Creation (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Each pair creates their own growing pattern following a rule of their choice</li>
                    <li>Students show the first 4 terms of their pattern using manipulatives</li>
                    <li>Students record their pattern and describe the rule in writing</li>
                  </ul>
                </li>
                <li>
                  <strong>Sharing and Discussion (2 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Select 2-3 pairs to share their created patterns</li>
                    <li>Have the class identify the rule and predict the next term</li>
                    <li>Discuss different types of growing patterns observed</li>
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
                    <li>Focus on simple patterns that grow by adding 1 or 2 elements each time</li>
                    <li>Provide sentence frames for describing pattern rules</li>
                    <li>Use color coding to highlight the growing part of each pattern</li>
                    <li>Work with concrete materials before moving to pictorial representations</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">For Students Who Need Challenge:</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Introduce patterns that grow in multiple dimensions (both height and width)</li>
                    <li>Explore patterns that grow by multiplying (doubling or tripling each term)</li>
                    <li>Challenge students to find the 10th or 20th term without building all previous terms</li>
                    <li>Create patterns with two alternating growing rules</li>
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
                <li>Accurate identification of pattern rules</li>
                <li>Correct extension of patterns based on identified rules</li>
                <li>Ability to create original patterns that follow a consistent rule</li>
                <li>Use of mathematical vocabulary in describing patterns</li>
                <li>Reasoning skills when making predictions about future terms</li>
              </ul>
              <p className="mt-4">
                Collect and review student recording sheets to assess understanding and identify any misconceptions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Extensions</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Connect growing patterns to numerical sequences (e.g., 2, 4, 6, 8, ...)</li>
                <li>Explore growing patterns in real-world contexts (e.g., plant growth, population changes)</li>
                <li>Create a pattern book with original growing patterns and their rules</li>
                <li>Use growing patterns to introduce simple function tables</li>
                <li>Investigate triangular numbers or square numbers as special growing patterns</li>
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
                      Printable Pattern Cards
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Student Recording Sheet
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Growing Pattern Examples
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
                    <h3 className="font-medium">Patterns and Algebra:</h3>
                    <p className="text-sm">Identifying, extending, and creating patterns</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Number Sense:</h3>
                    <p className="text-sm">Skip counting and number sequences</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Geometry:</h3>
                    <p className="text-sm">Spatial patterns and arrangements</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Teacher Tips</h2>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>Start with visual patterns before moving to numerical patterns</li>
                  <li>Encourage students to verbalize the pattern rule in their own words</li>
                  <li>Use consistent language when describing patterns (term, rule, grows by)</li>
                  <li>Take photos of student-created patterns to create a class pattern book</li>
                  <li>Connect to patterns observed in nature and everyday life</li>
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
