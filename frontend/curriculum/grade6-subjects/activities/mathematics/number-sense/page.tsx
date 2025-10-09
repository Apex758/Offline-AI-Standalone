import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calculator,
  Users,
  Clock,
  Target,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Grid3x3,
  Search,
} from "lucide-react"
import Link from "next/link"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade6NumberSenseActivitiesPage() {
  const activities = [
    {
      id: "place-value-detective",
      title: "Place Value Detective",
      outcome: "N1.1 - Whole Number",
      duration: "45-60 minutes",
      difficulty: "Intermediate",
      groupSize: "Pairs or Small Groups",
      icon: Search,
      description: "Students become mathematical detectives to investigate and identify place values in large numbers.",
      materials: [
        "Place value charts",
        "Digit cards (0-9)",
        "Base-ten blocks",
        "Detective badges (optional)",
        "Mystery number cards",
        "Recording sheets",
      ],
      instructions: [
        {
          step: 1,
          title: "Setup Detective Agency",
          description:
            "Give learners cards with 7-digit numbers written on them. Distribute detective materials and explain their mission.",
        },
        {
          step: 2,
          title: "Investigate Numbers",
          description:
            "For each mystery number, learners identify face value, place value, and total value of specified digits using detective skills.",
        },
        {
          step: 3,
          title: "Build Evidence",
          description: "Using base-ten blocks, represent the number concretely to verify their detective work.",
        },
        {
          step: 4,
          title: "Create Mystery Cases",
          description:
            "Students create their own 'mystery number' where they give clues about place values for others to solve.",
        },
        {
          step: 5,
          title: "Detective Presentation",
          description: "Present findings to the class, explaining their detective reasoning and mathematical evidence.",
        },
      ],
      assessment: {
        formative: [
          "Observe learners' ability to correctly identify place values",
          "Listen to mathematical explanations and reasoning",
          "Check accuracy of concrete representations",
        ],
        summative: [
          "Mystery number creation and solution accuracy",
          "Written explanations of place value concepts",
          "Peer assessment of detective presentations",
        ],
      },
      extensions: [
        "Investigate place values in different number systems (binary, base-5)",
        "Create place value word problems using real-world contexts",
        "Design a place value board game for younger students",
      ],
      realWorldConnections: [
        "Population statistics and census data",
        "Financial calculations and banking",
        "Scientific measurements and data",
        "Technology and computer science",
      ],
    },
    {
      id: "square-number-garden",
      title: "Square Number Garden",
      outcome: "N1.1 - Special Sets of Numbers",
      duration: "60-75 minutes",
      difficulty: "Intermediate",
      groupSize: "Individual or Pairs",
      icon: Grid3x3,
      description:
        "Students explore square numbers through hands-on tile arrangements and create artistic representations.",
      materials: [
        "Square tiles (at least 100 per group)",
        "Graph paper",
        "Calculators",
        "Colored pencils or markers",
        "Art supplies for decoration",
        "Recording templates",
      ],
      instructions: [
        {
          step: 1,
          title: "Tile Exploration",
          description:
            "Provide learners with square tiles to form actual squares. Start with 1 tile, then 4, then 9, observing the pattern.",
        },
        {
          step: 2,
          title: "Pattern Discovery",
          description:
            "Count tiles to discover square numbers (1, 4, 9, 16, 25...) and discuss what makes them 'square'.",
        },
        {
          step: 3,
          title: "Mathematical Recording",
          description: "Record findings on graph paper showing the visual pattern and the numerical sequence.",
        },
        {
          step: 4,
          title: "Challenge Investigation",
          description:
            "Find the next three square numbers and verify with tiles. Explore the pattern: 1², 2², 3², 4², 5²...",
        },
        {
          step: 5,
          title: "Artistic Garden Creation",
          description:
            "Create an art piece showing the first 10 square numbers as decorated squares, incorporating mathematical labels.",
        },
      ],
      assessment: {
        formative: [
          "Observe tile arrangement accuracy",
          "Check pattern recognition and extension",
          "Listen to mathematical vocabulary usage",
        ],
        summative: [
          "Square number garden artwork with mathematical annotations",
          "Written explanation of square number patterns",
          "Problem-solving accuracy in finding new square numbers",
        ],
      },
      extensions: [
        "Investigate cube numbers using 3D materials",
        "Explore triangular numbers and other figurate numbers",
        "Research historical uses of square numbers in architecture",
        "Create digital animations showing square number growth",
      ],
      realWorldConnections: [
        "Architecture and building design",
        "Garden and landscape planning",
        "Art and geometric patterns",
        "Sports field dimensions",
      ],
    },
    {
      id: "prime-composite-investigation",
      title: "Prime & Composite Investigation",
      outcome: "N1.1 - Special Sets of Numbers",
      duration: "50-65 minutes",
      difficulty: "Advanced",
      groupSize: "Small Groups",
      icon: Target,
      description:
        "Students investigate prime and composite numbers through systematic exploration and pattern analysis.",
      materials: [
        "Number grids (1-100)",
        "Colored pencils or markers",
        "Factor cards",
        "Calculators",
        "Investigation recording sheets",
        "Prime number reference charts",
      ],
      instructions: [
        {
          step: 1,
          title: "Number Classification Setup",
          description:
            "Introduce the concepts of prime and composite numbers. Provide number grids and classification criteria.",
        },
        {
          step: 2,
          title: "Systematic Investigation",
          description:
            "Students systematically test numbers 1-100, identifying factors and classifying as prime or composite.",
        },
        {
          step: 3,
          title: "Pattern Analysis",
          description:
            "Color-code prime numbers on the grid and look for patterns. Discuss observations about prime distribution.",
        },
        {
          step: 4,
          title: "Factor Exploration",
          description:
            "For composite numbers, find all factors and explore relationships between factors and the original number.",
        },
        {
          step: 5,
          title: "Mathematical Reporting",
          description: "Create a report summarizing findings, including patterns observed and mathematical reasoning.",
        },
      ],
      assessment: {
        formative: [
          "Check factor-finding accuracy",
          "Observe systematic investigation approaches",
          "Listen to pattern discussions and mathematical reasoning",
        ],
        summative: [
          "Classification accuracy on number grids",
          "Mathematical report quality and insights",
          "Understanding demonstration through examples",
        ],
      },
      extensions: [
        "Explore twin primes and prime gaps",
        "Investigate the Sieve of Eratosthenes method",
        "Research historical significance of prime numbers",
        "Connect to modern cryptography applications",
      ],
      realWorldConnections: [
        "Computer science and cybersecurity",
        "Mathematical research and academia",
        "Engineering and technology",
        "Code-breaking and encryption",
      ],
    },
    {
      id: "large-number-representation",
      title: "Large Number Representation Challenge",
      outcome: "N1.1 - Whole Number",
      duration: "45-60 minutes",
      difficulty: "Intermediate",
      groupSize: "Individual or Pairs",
      icon: Calculator,
      description: "Students master reading, writing, and representing numbers up to 1,000,000 using multiple formats.",
      materials: [
        "Large number cards",
        "Place value charts (up to millions)",
        "Base-ten blocks or drawings",
        "Number word cards",
        "Expanded form templates",
        "Real-world number examples",
      ],
      instructions: [
        {
          step: 1,
          title: "Number Format Introduction",
          description:
            "Present the same large number in different formats: standard form, word form, and expanded form.",
        },
        {
          step: 2,
          title: "Conversion Practice",
          description:
            "Students practice converting between different number representations using place value understanding.",
        },
        {
          step: 3,
          title: "Real-World Applications",
          description:
            "Use actual examples from population data, distances, and measurements to practice with authentic numbers.",
        },
        {
          step: 4,
          title: "Visual Representation",
          description: "Create visual models using base-ten concepts to represent large numbers concretely.",
        },
        {
          step: 5,
          title: "Number Comparison Challenge",
          description: "Compare and order large numbers, explaining reasoning using place value concepts.",
        },
      ],
      assessment: {
        formative: [
          "Monitor conversion accuracy between formats",
          "Observe place value understanding in explanations",
          "Check visual representation correctness",
        ],
        summative: [
          "Multi-format number representation portfolio",
          "Comparison and ordering task accuracy",
          "Real-world application problem solving",
        ],
      },
      extensions: [
        "Explore scientific notation introduction",
        "Research world populations and geographical distances",
        "Create number stories using large numbers",
        "Investigate historical large numbers (ancient civilizations, etc.)",
      ],
      realWorldConnections: [
        "Geography and world populations",
        "Astronomy and space distances",
        "Economics and national budgets",
        "Sports statistics and records",
      ],
    },
  ]

  const learningOutcomes = [
    "Read and write numbers in words and figures up to 1,000,000 (seven digits)",
    "State the face value, place value and total value of any digit in a whole number up to 999,999,999",
    "Identify and describe special sets of numbers (square, prime and composite)",
    "Compare and order large numbers using place value understanding",
    "Represent numbers using multiple formats and visual models",
  ]

  const vocabularyTerms = [
    { term: "Place Value", definition: "The value of a digit based on its position in a number" },
    { term: "Face Value", definition: "The actual value of a digit regardless of its position" },
    { term: "Total Value", definition: "The face value multiplied by the place value" },
    { term: "Prime Number", definition: "A number greater than 1 with exactly two factors: 1 and itself" },
    { term: "Composite Number", definition: "A number greater than 1 with more than two factors" },
    { term: "Square Number", definition: "A number that can be expressed as n × n for some integer n" },
    { term: "Standard Form", definition: "Numbers written using digits (e.g., 456,789)" },
    { term: "Word Form", definition: "Numbers written in words (e.g., four hundred fifty-six thousand)" },
    {
      term: "Expanded Form",
      definition: "Numbers written showing place value (e.g., 400,000 + 50,000 + 6,000 + 700 + 80 + 9)",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Curriculum", href: "/curriculum" },
            { label: "Grade 6 Subjects", href: "/curriculum/grade6-subjects" },
            { label: "Mathematics Activities", href: "/curriculum/grade6-subjects/activities/mathematics" },
            { label: "Number Sense", href: "/curriculum/grade6-subjects/activities/mathematics/number-sense" },
          ]}
        />

        <Link href="/curriculum/grade6-subjects/activities/mathematics">
          <Button variant="outline" className="mb-6">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Mathematics Activities
          </Button>
        </Link>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Number Sense Activities</h1>
              <p className="text-xl text-gray-600">Grade 6 Mathematics</p>
            </div>
          </div>

          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Develop deep understanding of number concepts through hands-on investigations of place value, special number
            sets, and number relationships. These activities build foundational skills for advanced mathematical
            thinking.
          </p>
        </div>

        {/* Learning Outcomes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              Learning Outcomes
            </CardTitle>
            <CardDescription>By the end of these activities, students will be able to:</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {learningOutcomes.map((outcome, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{outcome}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Activities */}
        <div className="space-y-8 mb-12">
          {activities.map((activity) => {
            const IconComponent = activity.icon
            return (
              <Card key={activity.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900">{activity.title}</CardTitle>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline">{activity.outcome}</Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {activity.duration}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            {activity.groupSize}
                          </div>
                          <Badge
                            variant={
                              activity.difficulty === "Advanced"
                                ? "destructive"
                                : activity.difficulty === "Intermediate"
                                  ? "secondary"
                                  : "default"
                            }
                          >
                            {activity.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-base mt-4">{activity.description}</CardDescription>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Materials */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Grid3x3 className="w-4 h-4" />
                          Materials Needed
                        </h4>
                        <ul className="space-y-1">
                          {activity.materials.map((material, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              {material}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Assessment */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Assessment Strategies
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-1">Formative Assessment:</h5>
                            <ul className="space-y-1">
                              {activity.assessment.formative.map((item, index) => (
                                <li key={index} className="text-sm text-gray-600">
                                  • {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-1">Summative Assessment:</h5>
                            <ul className="space-y-1">
                              {activity.assessment.summative.map((item, index) => (
                                <li key={index} className="text-sm text-gray-600">
                                  • {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Instructions */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Step-by-Step Instructions
                        </h4>
                        <div className="space-y-3">
                          {activity.instructions.map((instruction, index) => (
                            <div key={index} className="border-l-4 border-blue-200 pl-4">
                              <h5 className="font-medium text-gray-900 text-sm">
                                Step {instruction.step}: {instruction.title}
                              </h5>
                              <p className="text-sm text-gray-600 mt-1">{instruction.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Real-World Connections */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          Real-World Connections
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {activity.realWorldConnections.map((connection, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {connection}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Extensions */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Extension Activities</h4>
                        <ul className="space-y-1">
                          {activity.extensions.map((extension, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                              {extension}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Mathematical Vocabulary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-6 h-6 text-purple-600" />
              Key Mathematical Vocabulary
            </CardTitle>
            <CardDescription>Essential terms students should understand and use correctly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vocabularyTerms.map((vocab, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <h4 className="font-semibold text-gray-900 text-sm">{vocab.term}</h4>
                  <p className="text-xs text-gray-600 mt-1">{vocab.definition}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-center">
          <Button asChild size="lg">
            <Link href="/curriculum/grade6-subjects/activities/mathematics/operations">
              Next: Operations Activities
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
