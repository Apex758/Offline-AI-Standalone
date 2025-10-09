import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calculator,
  Shapes,
  TrendingUp,
  Ruler,
  BarChart3,
  Users,
  Clock,
  Target,
  ChevronRight,
  BookOpen,
} from "lucide-react"
import Link from "next/link"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade6MathematicsActivitiesPage() {
  const activityStrands = [
    {
      id: "number-sense",
      title: "Number Sense Activities",
      icon: Calculator,
      description: "Hands-on activities exploring place value, special number sets, and number relationships",
      color: "bg-blue-500",
      activities: [
        "Place Value Detective",
        "Square Number Garden",
        "Prime Number Investigation",
        "Large Number Representation",
      ],
      keySkills: [
        "7-digit place value identification",
        "Square, prime, and composite numbers",
        "Number representation and comparison",
        "Mathematical reasoning and proof",
      ],
      realWorldConnections: [
        "Population statistics",
        "Scientific notation applications",
        "Financial calculations",
        "Data analysis in sports",
      ],
    },
    {
      id: "operations",
      title: "Operations Activities",
      icon: Target,
      description:
        "Practical activities for mastering addition, subtraction, multiplication, and division with various number types",
      color: "bg-green-500",
      activities: [
        "Decimal Shopping Spree",
        "Recipe Ratio Challenge",
        "Fraction Operation Olympics",
        "Mental Math Strategies",
      ],
      keySkills: [
        "Decimal operations to thousandths",
        "Fraction and whole number operations",
        "Estimation and mental math",
        "Problem-solving strategies",
      ],
      realWorldConnections: [
        "Shopping and budgeting",
        "Cooking and recipes",
        "Construction and measurements",
        "Business calculations",
      ],
    },
    {
      id: "patterns-relationships",
      title: "Patterns & Relationships",
      icon: TrendingUp,
      description: "Exploring algebraic thinking through patterns, graphs, and coordinate geometry",
      color: "bg-purple-500",
      activities: [
        "Growing Pattern Investigation",
        "Coordinate Art Gallery",
        "Function Machine Experiments",
        "Table and Graph Connections",
      ],
      keySkills: [
        "Pattern recognition and extension",
        "Algebraic expression writing",
        "Coordinate graphing",
        "Function relationships",
      ],
      realWorldConnections: [
        "Computer graphics and animation",
        "Architecture and design",
        "Scientific data trends",
        "Economic forecasting",
      ],
    },
    {
      id: "geometrical-thinking",
      title: "Geometrical Thinking",
      icon: Shapes,
      description: "Interactive geometry activities covering shapes, angles, transformations, and spatial reasoning",
      color: "bg-orange-500",
      activities: [
        "Angle Hunt Photography",
        "3D Shape Deconstruction Lab",
        "Transformation Art Studio",
        "Tessellation Design Workshop",
      ],
      keySkills: [
        "Angle measurement and classification",
        "3D shape analysis and nets",
        "Geometric transformations",
        "Spatial visualization",
      ],
      realWorldConnections: [
        "Architecture and engineering",
        "Art and design",
        "Navigation and mapping",
        "Technology and robotics",
      ],
    },
    {
      id: "measurement",
      title: "Measurement Activities",
      icon: Ruler,
      description: "Real-world measurement applications including area, perimeter, volume, and scale",
      color: "bg-red-500",
      activities: [
        "Olympic Measurement Games",
        "Scale Model Architecture",
        "Surface Area Investigations",
        "Volume and Capacity Explorations",
      ],
      keySkills: [
        "Standard unit applications",
        "Area and perimeter formulas",
        "Volume calculations",
        "Scale and proportion",
      ],
      realWorldConnections: [
        "Sports and athletics",
        "Construction and building",
        "Manufacturing and production",
        "Environmental monitoring",
      ],
    },
    {
      id: "data-probability",
      title: "Data & Probability",
      icon: BarChart3,
      description: "Statistical investigations and probability experiments using real data and authentic contexts",
      color: "bg-teal-500",
      activities: [
        "School Survey Investigation",
        "Weather Pattern Analysis",
        "Carnival Game Design",
        "Two-Step Probability Experiments",
      ],
      keySkills: [
        "Statistical question formulation",
        "Data collection and analysis",
        "Probability calculations",
        "Statistical reasoning",
      ],
      realWorldConnections: [
        "Market research and surveys",
        "Weather forecasting",
        "Gaming and entertainment",
        "Risk assessment",
      ],
    },
  ]

  const crossCurricularProjects = [
    {
      title: "Mathematical Art Museum",
      description: "Create artwork incorporating mathematical concepts across all strands",
      subjects: ["Art", "History", "Technology"],
      duration: "2-3 weeks",
    },
    {
      title: "School Store Business Plan",
      description: "Design a complete business plan using mathematical analysis and projections",
      subjects: ["Business Studies", "Economics", "Language Arts"],
      duration: "3-4 weeks",
    },
    {
      title: "Environmental Data Project",
      description: "Collect and analyze environmental data using statistical methods",
      subjects: ["Science", "Geography", "Environmental Studies"],
      duration: "2-3 weeks",
    },
  ]

  const assessmentStrategies = [
    {
      type: "Formative Assessment",
      methods: [
        "Math journals and reflection",
        "Peer collaboration observations",
        "Exit tickets and quick checks",
        "Process-focused questioning",
      ],
    },
    {
      type: "Summative Assessment",
      methods: [
        "Project-based evaluations",
        "Performance task rubrics",
        "Portfolio collections",
        "Authentic problem solving",
      ],
    },
    {
      type: "Self-Assessment",
      methods: [
        "Learning goal tracking",
        "Strategy reflection sheets",
        "Peer feedback sessions",
        "Growth mindset discussions",
      ],
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
          ]}
        />

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Grade 6 Mathematics Activities</h1>
              <p className="text-xl text-gray-600">Hands-On Learning & Real-World Applications</p>
            </div>
          </div>

          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Engage Grade 6 students with interactive mathematics activities that connect abstract concepts to real-world
            applications. These comprehensive activities promote critical thinking, problem-solving, and mathematical
            reasoning across all curriculum strands.
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">16+</div>
              <div className="text-sm text-gray-600">Core Activities</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">6</div>
              <div className="text-sm text-gray-600">Mathematical Strands</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">45-90</div>
              <div className="text-sm text-gray-600">Minutes Per Activity</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Target className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-600">Curriculum Aligned</div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Strands */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {activityStrands.map((strand) => {
            const IconComponent = strand.icon
            return (
              <Card key={strand.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${strand.color} rounded-xl flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{strand.title}</CardTitle>
                      <CardDescription className="text-base">{strand.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Featured Activities */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Featured Activities</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {strand.activities.map((activity, index) => (
                        <div key={index} className="text-sm bg-gray-50 p-2 rounded-md">
                          {activity}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Skills */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Skills Developed</h4>
                    <ul className="space-y-1">
                      {strand.keySkills.slice(0, 3).map((skill, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Real-World Connections */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Real-World Connections</h4>
                    <div className="flex flex-wrap gap-2">
                      {strand.realWorldConnections.slice(0, 3).map((connection, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {connection}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4">
                    <Button asChild className="w-full">
                      <Link href={`/curriculum/grade6-subjects/activities/mathematics/${strand.id}`}>
                        Explore {strand.title}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Cross-Curricular Projects */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-600" />
              Cross-Curricular Integration Projects
            </CardTitle>
            <CardDescription>
              Extended projects that integrate mathematics with other subject areas for authentic learning experiences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {crossCurricularProjects.map((project, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{project.description}</p>

                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-gray-500">Connected Subjects:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.subjects.map((subject, subIndex) => (
                          <Badge key={subIndex} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      Duration: {project.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Assessment Strategies */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-green-600" />
              Assessment Strategies
            </CardTitle>
            <CardDescription>
              Comprehensive assessment approaches that support learning and demonstrate understanding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {assessmentStrategies.map((strategy, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="font-semibold text-gray-900">{strategy.type}</h3>
                  <ul className="space-y-2">
                    {strategy.methods.map((method, methodIndex) => (
                      <li key={methodIndex} className="text-sm text-gray-600 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        {method}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Differentiation Support */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              Differentiation & Support Strategies
            </CardTitle>
            <CardDescription>Inclusive approaches to meet diverse learning needs and styles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 text-green-700">For Advanced Learners</h3>
                <ul className="space-y-2">
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Add complexity to problems
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Require multiple solution methods
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Lead peer tutoring sessions
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    Create problems for other students
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 text-blue-700">For Struggling Learners</h3>
                <ul className="space-y-2">
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    Provide manipulatives and visual aids
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    Break activities into smaller steps
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    Allow collaborative work
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    Offer choice in demonstration methods
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 text-orange-700">For English Language Learners</h3>
                <ul className="space-y-2">
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    Use visual representations
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    Provide vocabulary support
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    Allow native language discussion
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    Connect to cultural contexts
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Menu */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Access to Mathematics Activities</CardTitle>
            <CardDescription>Jump directly to specific activity types and resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {activityStrands.map((strand) => (
                <Button key={strand.id} asChild variant="outline" className="h-auto p-4">
                  <Link
                    href={`/curriculum/grade6-subjects/activities/mathematics/${strand.id}`}
                    className="flex flex-col items-center gap-2"
                  >
                    <strand.icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{strand.title}</span>
                  </Link>
                </Button>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button asChild size="lg">
                <Link href="/curriculum/grade6-subjects/mathematics">View Full Mathematics Curriculum</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
