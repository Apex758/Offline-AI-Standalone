import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Target,
  Users,
  Clock,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  ShoppingCart,
  ChefHat,
  Calculator,
  Trophy,
} from "lucide-react"
import Link from "next/link"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade6OperationsActivitiesPage() {
  const activities = [
    {
      id: "decimal-shopping-spree",
      title: "Decimal Shopping Spree",
      outcome: "O1.1 - Adding and Subtracting Decimals",
      duration: "60-75 minutes",
      difficulty: "Intermediate",
      groupSize: "Individual or Pairs",
      icon: ShoppingCart,
      description:
        "Students practice decimal operations through realistic shopping scenarios while developing financial literacy skills.",
      materials: [
        "Shopping catalogs or online store printouts",
        "Calculators",
        "Play money (bills and coins)",
        "Shopping budget cards ($50.00 each)",
        "Receipt templates",
        "Tax calculation guides (10%)",
      ],
      instructions: [
        {
          step: 1,
          title: "Shopping Budget Setup",
          description:
            "Give each learner a budget of $50.00. Explain they must plan purchases within this budget including tax.",
        },
        {
          step: 2,
          title: "Product Selection",
          description:
            "Using real catalogs or store websites, select items to purchase. Record item names and prices on shopping list.",
        },
        {
          step: 3,
          title: "Mathematical Calculations",
          description:
            "Calculate subtotal, tax (10%), total cost, and change from budget. Show all decimal addition/subtraction work.",
        },
        {
          step: 4,
          title: "Verification Process",
          description: "Use calculators to verify calculations and make adjustments if over budget.",
        },
        {
          step: 5,
          title: "Shopping Presentation",
          description: "Present purchases to class explaining mathematical reasoning and budgeting decisions.",
        },
      ],
      assessment: {
        formative: [
          "Monitor decimal calculation accuracy during work",
          "Observe budgeting decision-making process",
          "Check understanding of tax calculations",
        ],
        summative: [
          "Accuracy of all decimal operations on receipt",
          "Quality of mathematical explanations in presentation",
          "Demonstration of financial literacy understanding",
        ],
      },
      extensions: [
        "Compare prices across different stores",
        "Calculate sales discounts and percentage savings",
        "Explore interest rates and payment plans",
        "Create a monthly budget using decimal operations",
      ],
      realWorldConnections: [
        "Personal finance and budgeting",
        "Consumer mathematics and smart shopping",
        "Tax calculations and civic responsibility",
        "Business operations and profit calculations",
      ],
    },
    {
      id: "recipe-ratio-challenge",
      title: "Recipe Ratio Challenge",
      outcome: "O2.1 - Multiplicative Thinking",
      duration: "50-65 minutes",
      difficulty: "Advanced",
      groupSize: "Small Groups (3-4)",
      icon: ChefHat,
      description:
        "Students explore multiplication and division with fractions through authentic cooking scenarios and scaling recipes.",
      materials: [
        "Recipe cards (serves 4 people)",
        "Measuring tools and conversion charts",
        "Calculators",
        "Scaling worksheets",
        "Fraction manipulatives",
        "Kitchen equipment (if cooking)",
      ],
      instructions: [
        {
          step: 1,
          title: "Recipe Analysis",
          description:
            "Provide recipes that serve 4 people. Analyze ingredients and measurements, identifying fractions and mixed numbers.",
        },
        {
          step: 2,
          title: "Scaling Challenge",
          description:
            "Challenge learners to adjust recipe for different group sizes (6, 8, 12 people) using multiplication and division.",
        },
        {
          step: 3,
          title: "Mathematical Calculations",
          description:
            "Calculate new ingredient amounts using fraction operations. Show work for each calculation step.",
        },
        {
          step: 4,
          title: "Visual Representation",
          description: "Create visual representations showing the scaling process using diagrams or fraction models.",
        },
        {
          step: 5,
          title: "Ratio Discussion",
          description:
            "Discuss how ratios remain constant even when quantities change. Present scaled recipes to class.",
        },
      ],
      assessment: {
        formative: [
          "Observe fraction operation strategies",
          "Check scaling calculation accuracy",
          "Listen to ratio reasoning discussions",
        ],
        summative: [
          "Accuracy of all scaled recipe calculations",
          "Quality of visual representations",
          "Understanding demonstration of constant ratios",
        ],
      },
      extensions: [
        "Actually prepare the scaled recipe if facilities allow",
        "Explore international recipes and metric conversions",
        "Calculate nutritional information scaling",
        "Create a cookbook with multiple serving sizes",
      ],
      realWorldConnections: [
        "Culinary arts and professional cooking",
        "Event planning and catering",
        "Manufacturing and production scaling",
        "Cultural studies through food traditions",
      ],
    },
    {
      id: "fraction-operation-olympics",
      title: "Fraction Operation Olympics",
      outcome: "O2.2 - Fraction and Whole Number Operations",
      duration: "90 minutes (multiple sessions)",
      difficulty: "Intermediate",
      groupSize: "Teams of 4-5",
      icon: Trophy,
      description:
        "Students compete in mathematical 'Olympic' events that require mastery of fraction operations with whole numbers.",
      materials: [
        "Fraction operation task cards",
        "Stopwatches",
        "Scoresheets and clipboards",
        "Fraction manipulatives",
        "Calculators for verification",
        "Olympic medals or certificates",
      ],
      instructions: [
        {
          step: 1,
          title: "Olympic Setup",
          description:
            "Set up stations for different 'events': multiplication sprint, division relay, mixed operations marathon.",
        },
        {
          step: 2,
          title: "Training Round",
          description:
            "Teams practice at each station with sample problems involving whole numbers and proper fractions.",
        },
        {
          step: 3,
          title: "Competition Events",
          description:
            "Teams rotate through events, solving problems accurately and efficiently. Record times and accuracy.",
        },
        {
          step: 4,
          title: "Strategy Sharing",
          description:
            "Between events, teams share strategies for multiplying and dividing fractions with whole numbers.",
        },
        {
          step: 5,
          title: "Awards Ceremony",
          description:
            "Recognize achievements in accuracy, teamwork, and mathematical reasoning. Discuss learning outcomes.",
        },
      ],
      assessment: {
        formative: [
          "Monitor problem-solving strategies during training",
          "Observe teamwork and mathematical communication",
          "Check use of appropriate mathematical tools",
        ],
        summative: [
          "Accuracy scores across all Olympic events",
          "Quality of strategy explanations",
          "Demonstration of fraction operation understanding",
        ],
      },
      extensions: [
        "Create new Olympic events for younger students",
        "Explore historical Olympic statistics using fractions",
        "Design fraction operation board games",
        "Research real Olympic records and make comparisons",
      ],
      realWorldConnections: [
        "Sports statistics and performance analysis",
        "Fitness training and measurement",
        "International competition and scoring",
        "Time management and efficiency",
      ],
    },
    {
      id: "mental-math-strategies",
      title: "Mental Math Strategy Workshop",
      outcome: "O1.3 - Make Reasonable Estimations",
      duration: "45-60 minutes",
      difficulty: "Intermediate",
      groupSize: "Pairs and Whole Class",
      icon: Calculator,
      description:
        "Students develop and share mental mathematics strategies for quick and accurate calculations with decimals and fractions.",
      materials: [
        "Strategy recording sheets",
        "Number cards and operation cards",
        "Estimation challenge problems",
        "Calculators for verification",
        "Chart paper for strategy displays",
        "Timer for mental math challenges",
      ],
      instructions: [
        {
          step: 1,
          title: "Strategy Introduction",
          description:
            "Introduce various mental math strategies: rounding, compensation, breaking apart numbers, using benchmarks.",
        },
        {
          step: 2,
          title: "Practice Sessions",
          description:
            "Practice each strategy with guided examples, focusing on decimal addition/subtraction and simple fractions.",
        },
        {
          step: 3,
          title: "Strategy Comparison",
          description:
            "Compare different approaches to the same problem. Discuss when each strategy is most effective.",
        },
        {
          step: 4,
          title: "Estimation Challenges",
          description: "Complete timed estimation challenges, explaining reasoning and checking with calculators.",
        },
        {
          step: 5,
          title: "Strategy Sharing Gallery",
          description: "Create displays showing different strategies and present to other classes or parents.",
        },
      ],
      assessment: {
        formative: [
          "Observe strategy selection and application",
          "Listen to mathematical reasoning explanations",
          "Check estimation reasonableness",
        ],
        summative: [
          "Strategy demonstration and explanation quality",
          "Estimation accuracy across various problem types",
          "Ability to choose appropriate strategies for different situations",
        ],
      },
      extensions: [
        "Create mental math strategy videos for younger students",
        "Research historical calculation methods",
        "Explore mental math techniques from different cultures",
        "Design apps or games for practicing mental math",
      ],
      realWorldConnections: [
        "Quick calculations in daily life situations",
        "Professional settings requiring fast mental math",
        "Financial decision-making and budgeting",
        "Problem-solving in time-sensitive situations",
      ],
    },
  ]

  const learningOutcomes = [
    "Add decimals up to the thousandth place accurately",
    "Subtract decimals up to the thousandth place accurately",
    "Multiply whole numbers by proper fractions using appropriate tools and strategies",
    "Divide whole numbers by proper fractions using appropriate tools and strategies",
    "Divide unit fractions by whole numbers",
    "Use properties of operations and explain inverse relationships",
    "Make reasonable estimations when using operations",
  ]

  const operationStrategies = [
    {
      operation: "Adding Decimals",
      strategies: [
        "Line up decimal points vertically",
        "Use place value understanding",
        "Add zeros as placeholders when needed",
        "Check reasonableness of answers",
      ],
    },
    {
      operation: "Subtracting Decimals",
      strategies: [
        "Line up decimal points vertically",
        "Borrow across place values carefully",
        "Add zeros as placeholders when needed",
        "Use addition to check subtraction",
      ],
    },
    {
      operation: "Multiplying Fractions and Whole Numbers",
      strategies: [
        "Use visual models and area representations",
        "Apply the rule: multiply numerator by whole number",
        "Simplify fractions when possible",
        "Connect to repeated addition concepts",
      ],
    },
    {
      operation: "Dividing Fractions and Whole Numbers",
      strategies: [
        "Use visual models and partitioning",
        "Apply 'multiply by reciprocal' rule",
        "Think about 'how many groups' questions",
        "Connect to multiplication as inverse operation",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Curriculum", href: "/curriculum" },
            { label: "Grade 6 Subjects", href: "/curriculum/grade6-subjects" },
            { label: "Mathematics Activities", href: "/curriculum/grade6-subjects/activities/mathematics" },
            { label: "Operations", href: "/curriculum/grade6-subjects/activities/mathematics/operations" },
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
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Operations Activities</h1>
              <p className="text-xl text-gray-600">Grade 6 Mathematics</p>
            </div>
          </div>

          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Master mathematical operations through engaging, real-world activities. Students develop fluency with
            decimal operations and fraction-whole number operations while building practical life skills.
          </p>
        </div>

        {/* Learning Outcomes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
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

        {/* Operation Strategies Reference */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-6 h-6 text-blue-600" />
              Key Operation Strategies
            </CardTitle>
            <CardDescription>Essential strategies students should master for different operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {operationStrategies.map((strategy, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">{strategy.operation}</h4>
                  <ul className="space-y-1">
                    {strategy.strategies.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-gray-600 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activities */}
        <div className="space-y-8 mb-12">
          {activities.map((activity) => {
            const IconComponent = activity.icon
            return (
              <Card key={activity.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
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
                          <Target className="w-4 h-4" />
                          Materials Needed
                        </h4>
                        <ul className="space-y-1">
                          {activity.materials.map((material, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
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
                            <div key={index} className="border-l-4 border-green-200 pl-4">
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

        {/* Quick Reference */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              Common Student Errors & Misconceptions
            </CardTitle>
            <CardDescription>Anticipate and address these common challenges in operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Decimal Operations</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Not aligning decimal points when adding/subtracting</li>
                  <li>• Confusing place value in decimal numbers</li>
                  <li>• Adding zeros incorrectly as placeholders</li>
                  <li>• Misplacing decimal point in final answer</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Fraction Operations</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Multiplying denominators when multiplying fractions</li>
                  <li>• Confusion between multiplication and division of fractions</li>
                  <li>• Not simplifying fractions in final answers</li>
                  <li>• Difficulty visualizing fraction operations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button asChild variant="outline">
            <Link href="/curriculum/grade6-subjects/activities/mathematics/number-sense">
              Previous: Number Sense Activities
            </Link>
          </Button>
          <Button asChild>
            <Link href="/curriculum/grade6-subjects/activities/mathematics/patterns-relationships">
              Next: Patterns & Relationships Activities
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
