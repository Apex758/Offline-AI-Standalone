import { Breadcrumb } from "@/components/breadcrumb"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Printer } from "lucide-react"

export default function FractionFunActivity() {
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
              label: "Fraction Fun",
              href: "/curriculum/grade2-subjects/activities/mathematics/fraction-fun",
            },
          ]}
        />
        <ThemeToggle />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Fraction Fun</h1>
        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
          <span className="mr-4">Time: 35 minutes</span>
          <span>Difficulty: Medium</span>
        </div>
        <img
          src="/placeholder.svg?height=300&width=800"
          alt="Fraction Fun Activity"
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="mb-4">
                In this activity, students explore basic fractions through hands-on activities with food, paper folding,
                and drawings. They will develop an understanding of fractions as equal parts of a whole and learn to
                identify, name, and represent simple fractions like halves, thirds, and fourths.
              </p>
              <p>
                Students will use concrete materials and real-world contexts to build foundational fraction concepts.
                Through cutting, folding, and sharing activities, they'll discover that fractions represent equal parts
                and develop vocabulary for describing fractional relationships.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Learning Objectives</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Understand fractions as equal parts of a whole</li>
                <li>Identify and name unit fractions: 1/2, 1/3, 1/4</li>
                <li>Recognize that equal parts must be the same size</li>
                <li>Represent fractions using concrete materials, drawings, and symbols</li>
                <li>Compare fractions using visual models (which is larger: 1/2 or 1/4?)</li>
                <li>Use fraction vocabulary: whole, half, third, fourth, equal parts</li>
                <li>Connect fractions to real-world sharing situations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Materials</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Paper circles, squares, and rectangles for folding</li>
                <li>Scissors for cutting shapes into equal parts</li>
                <li>Crayons and colored pencils</li>
                <li>Play dough or modeling clay</li>
                <li>Plastic knives for cutting play dough</li>
                <li>Fraction manipulatives (fraction circles, bars)</li>
                <li>Real food items: apples, oranges, crackers, pizza slices (optional)</li>
                <li>Fraction vocabulary cards</li>
                <li>Chart paper for class demonstrations</li>
                <li>Student recording sheets</li>
                <li>Glue sticks for fraction collages</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Preparation</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Cut paper shapes (circles, squares, rectangles) for student use</li>
                <li>Prepare fraction manipulatives and organize by type</li>
                <li>Set up stations with different fraction exploration materials</li>
                <li>Create fraction vocabulary word wall with visual examples</li>
                <li>Prepare play dough portions for hands-on fraction work</li>
                <li>Print student recording sheets for fraction documentation</li>
                <li>Gather real food items if using for concrete fraction experiences</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Steps</h2>
              <ol className="list-decimal pl-6 space-y-4">
                <li>
                  <strong>Introduction to Fractions (8 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Begin with a real-world scenario: sharing a pizza or cookie equally</li>
                    <li>Demonstrate folding a paper circle in half, emphasizing "equal parts"</li>
                    <li>Introduce vocabulary: whole, half, equal parts</li>
                    <li>Show examples of equal vs. unequal parts using paper shapes</li>
                    <li>Explain that fractions help us describe parts of a whole</li>
                  </ul>
                </li>
                <li>
                  <strong>Paper Folding Exploration (10 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Students work with paper circles and squares</li>
                    <li>Fold shapes to create halves, then unfold and color one half</li>
                    <li>Fold different shapes to create fourths, color one fourth</li>
                    <li>Try folding into thirds (more challenging, may need teacher help)</li>
                    <li>Discuss: "Are all the parts the same size?" "How many parts make the whole?"</li>
                    <li>Record findings on student sheets: "1 out of 2 equal parts = 1/2"</li>
                  </ul>
                </li>
                <li>
                  <strong>Hands-On Fraction Stations (12 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      <strong>Station 1: Play Dough Fractions</strong> - Roll play dough into shapes, cut into equal
                      parts
                    </li>
                    <li>
                      <strong>Station 2: Fraction Manipulatives</strong> - Use fraction circles and bars to explore
                      parts and wholes
                    </li>
                    <li>
                      <strong>Station 3: Drawing Fractions</strong> - Draw shapes and divide them into equal parts,
                      color fractions
                    </li>
                    <li>
                      <strong>Station 4: Real Food Fractions</strong> - Cut apples or crackers into equal parts (if
                      available)
                    </li>
                    <li>Students rotate through stations, exploring fractions with different materials</li>
                  </ul>
                </li>
                <li>
                  <strong>Fraction Comparison and Sharing (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Gather students to compare fraction discoveries</li>
                    <li>Show 1/2 and 1/4 using the same whole - which is bigger?</li>
                    <li>Students share interesting fraction creations from stations</li>
                    <li>Discuss real-world uses of fractions: cooking, sharing, time</li>
                    <li>Review fraction vocabulary and key concepts learned</li>
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
                    <li>Focus only on halves initially, then gradually introduce fourths</li>
                    <li>Use larger, easier-to-manipulate materials</li>
                    <li>Provide pre-folded examples to trace and color</li>
                    <li>Work with concrete objects before moving to abstract representations</li>
                    <li>Use consistent shapes (circles) rather than varying shapes</li>
                    <li>Pair with supportive classmates for station work</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">For Students Who Need Challenge:</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Explore more complex fractions: fifths, sixths, eighths</li>
                    <li>Compare different fractions using the same whole</li>
                    <li>Create fraction stories and word problems</li>
                    <li>Explore equivalent fractions (2/4 = 1/2) using manipulatives</li>
                    <li>Find fractions in different orientations and arrangements</li>
                    <li>Create fraction art projects with multiple fractional parts</li>
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
                <li>Understanding that fractions represent equal parts of a whole</li>
                <li>Ability to create equal parts through folding and cutting</li>
                <li>Correct identification and naming of unit fractions (1/2, 1/3, 1/4)</li>
                <li>Recognition that equal parts must be the same size</li>
                <li>Appropriate use of fraction vocabulary in discussions</li>
                <li>Ability to represent fractions using multiple methods</li>
                <li>Understanding of relative size (1/2 is larger than 1/4)</li>
              </ul>
              <p className="mt-4">
                Collect student recording sheets and fraction creations to assess understanding. Use simple fraction
                identification tasks as exit tickets to gauge individual progress.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Extensions</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create a fraction cookbook with recipes that use simple fractions</li>
                <li>Explore fractions in art by creating symmetrical designs with fractional parts</li>
                <li>Connect to music by exploring fractions in rhythm and beat patterns</li>
                <li>Use fraction concepts in PE activities (divide class into equal groups)</li>
                <li>Create fraction gardens by dividing planting areas into equal sections</li>
                <li>Explore cultural foods that naturally come in fractional parts</li>
                <li>Use technology apps that allow virtual fraction manipulation</li>
                <li>Create fraction story books for younger students</li>
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
                      Fraction Shape Templates
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Student Recording Sheets
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Fraction Vocabulary Cards
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
                    <h3 className="font-medium">Number and Operations:</h3>
                    <p className="text-sm">Understanding fractions as numbers and parts of wholes</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Geometry:</h3>
                    <p className="text-sm">Partitioning shapes into equal parts</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Life Skills:</h3>
                    <p className="text-sm">Practical applications in cooking and sharing</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Teacher Tips</h2>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>Emphasize "equal parts" consistently throughout the lesson</li>
                  <li>Use the same whole when comparing different fractions</li>
                  <li>Connect fractions to students' real-world experiences</li>
                  <li>Allow plenty of hands-on exploration before introducing symbols</li>
                  <li>Take photos of student fraction work for documentation</li>
                  <li>Create a fraction word wall with visual examples</li>
                </ul>
              </CardContent>
            </Card>

            <div className="flex justify-between mt-6">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <ChevronLeft size={16} />
                Previous Activity
              </Button>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                Next Activity
                <ChevronRight size={16} />
              </Button>
            </div>

            <Button variant="outline" className="w-full mt-4 flex items-center justify-center gap-2 bg-transparent">
              <Printer size={16} />
              Print Activity
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
