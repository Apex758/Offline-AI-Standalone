import { Breadcrumb } from "@/components/breadcrumb"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Printer } from "lucide-react"

export default function PlaceValuePartnersActivity() {
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
              label: "Place Value Partners",
              href: "/curriculum/grade2-subjects/activities/mathematics/place-value-partners",
            },
          ]}
        />
        <ThemeToggle />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Place Value Partners</h1>
        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
          <span className="mr-4">Time: 30 minutes</span>
          <span>Difficulty: Medium</span>
        </div>
        <img
          src="/placeholder.svg?height=300&width=800&query=students+working+with+base+10+blocks"
          alt="Place Value Partners Activity"
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="mb-4">
                In this activity, students work in pairs to represent two-digit numbers using base-10 blocks and place
                value charts. This hands-on approach helps students understand the concept of place value and how
                numbers are composed of tens and ones.
              </p>
              <p>
                Students will take turns creating numbers, representing them with manipulatives, and challenging their
                partners to identify the numbers. This collaborative activity reinforces place value understanding while
                developing communication and mathematical vocabulary.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Learning Objectives</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Understand that the two digits of a two-digit number represent amounts of tens and ones</li>
                <li>Represent two-digit numbers using concrete materials and place value charts</li>
                <li>Decompose two-digit numbers into tens and ones</li>
                <li>Use place value understanding to compare two two-digit numbers</li>
                <li>Use mathematical vocabulary to describe place value concepts</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Materials</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Base-10 blocks (tens rods and ones cubes) or alternative manipulatives</li>
                <li>Place value mats or charts (one per pair)</li>
                <li>Number cards (0-9, two sets per pair)</li>
                <li>Student recording sheets</li>
                <li>Pencils</li>
                <li>Optional: Digital place value tool on tablets or computers</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Preparation</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Prepare place value mats with clearly labeled columns for tens and ones</li>
                <li>Organize base-10 blocks or alternative manipulatives for each pair</li>
                <li>Create number cards with digits 0-9 (two sets per pair)</li>
                <li>Print student recording sheets</li>
                <li>Set up a demonstration area with a document camera or large place value chart</li>
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
                    <li>Review the concept of place value with the whole class</li>
                    <li>Demonstrate how to represent two-digit numbers using base-10 blocks on a place value mat</li>
                    <li>
                      Show examples of how the same number can be represented in different ways (e.g., 42 as 4 tens and
                      2 ones, or 3 tens and 12 ones)
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Partner Setup (3 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Arrange students in pairs</li>
                    <li>
                      Distribute materials to each pair: place value mat, base-10 blocks, number cards, and recording
                      sheets
                    </li>
                    <li>Assign roles: Partner A and Partner B</li>
                  </ul>
                </li>
                <li>
                  <strong>Activity Round 1 (7 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Partner A selects two number cards to create a two-digit number</li>
                    <li>
                      Without showing the cards, Partner A represents this number on the place value mat using base-10
                      blocks
                    </li>
                    <li>Partner B observes the representation and identifies the number</li>
                    <li>Partners discuss and record the number, showing how many tens and ones it contains</li>
                    <li>Partners switch roles and repeat</li>
                  </ul>
                </li>
                <li>
                  <strong>Activity Round 2 (7 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      Partner A creates a two-digit number with base-10 blocks but represents it in a non-standard way
                      (e.g., 42 as 3 tens and 12 ones)
                    </li>
                    <li>Partner B identifies the number and then rearranges the blocks to show the standard form</li>
                    <li>Partners record both representations on their sheet</li>
                    <li>Partners switch roles and repeat</li>
                  </ul>
                </li>
                <li>
                  <strong>Challenge Round (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Each partner creates a two-digit number with blocks</li>
                    <li>Partners compare their numbers using &lt;, &gt;, or = symbols</li>
                    <li>Partners record their comparison and explain their reasoning</li>
                    <li>Repeat with new numbers if time allows</li>
                  </ul>
                </li>
                <li>
                  <strong>Wrap-up Discussion (3 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Bring the class back together to share observations and insights</li>
                    <li>Discuss different strategies used to identify and compare numbers</li>
                    <li>Reinforce key vocabulary: place value, tens, ones, greater than, less than, equal to</li>
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
                    <li>Limit number range to 11-50</li>
                    <li>Provide a number line or hundred chart as reference</li>
                    <li>Use only standard representations of numbers initially</li>
                    <li>Offer sentence frames for mathematical discussions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">For Students Who Need Challenge:</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Extend to three-digit numbers</li>
                    <li>Create and solve simple addition or subtraction problems using the numbers</li>
                    <li>Represent numbers in multiple non-standard ways</li>
                    <li>Compare three numbers instead of two</li>
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
                <li>Accurate representation of two-digit numbers using base-10 blocks</li>
                <li>Correct identification of numbers from their representations</li>
                <li>Understanding of standard and non-standard forms of numbers</li>
                <li>Appropriate use of comparison symbols and reasoning</li>
                <li>Use of mathematical vocabulary in discussions</li>
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
                <li>
                  Create a place value game where students roll dice to build the largest possible two-digit number
                </li>
                <li>Use place value understanding to add or subtract two-digit numbers</li>
                <li>Explore patterns in the place value system by counting by tens from different starting points</li>
                <li>Connect to money concepts by representing amounts up to $1.00 using dimes and pennies</li>
                <li>
                  Create place value riddles for classmates to solve (e.g., "I have 3 tens and 7 ones. What number am
                  I?")
                </li>
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
                      Printable Place Value Mat
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Student Recording Sheet
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Number Cards Template
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Assessment Rubric
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
                    <h3 className="font-medium">Number Sense:</h3>
                    <p className="text-sm">Understanding place value of two-digit numbers</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Operations:</h3>
                    <p className="text-sm">Foundation for addition and subtraction with regrouping</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Measurement:</h3>
                    <p className="text-sm">Connecting to concepts of tens and ones in measurement</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Teacher Tips</h2>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>Pre-sort base-10 blocks into containers for easy distribution</li>
                  <li>Model proper handling and organization of materials</li>
                  <li>Use a timer to keep activity segments on track</li>
                  <li>Circulate during partner work to provide support and note observations</li>
                  <li>Take photos of interesting representations to share during discussion</li>
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
