import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Calculator, BarChart3, Shapes, Ruler, TrendingUp, Hash } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade5MathematicsActivitiesPage() {
  const activities = [
    {
      title: "Number Sense Activities",
      description: "Engaging activities for number sense concepts",
      icon: Hash,
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-200",
      href: "/curriculum/grade5-subjects/activities/mathematics/number-sense",
      highlights: ["Detective Games", "Skip Counting Adventures", "Place Value Construction"],
    },
    {
      title: "Operations with Numbers Activities",
      description: "Hands-on activities for mastering operations",
      icon: Calculator,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      href: "/curriculum/grade5-subjects/activities/mathematics/operations-with-numbers",
      highlights: ["Fraction Cooking", "Decimal Store", "Code Breaking"],
    },
    {
      title: "Patterns & Relationships Activities",
      description: "Interactive activities for exploring patterns",
      icon: TrendingUp,
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      borderColor: "border-amber-200",
      href: "/curriculum/grade5-subjects/activities/mathematics/patterns-relationships",
      highlights: ["Dance Studio", "Function Machines", "Quilt Designs"],
    },
    {
      title: "Geometrical Thinking Activities",
      description: "Practical activities for geometrical concepts",
      icon: Shapes,
      color: "from-purple-500 to-violet-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      borderColor: "border-purple-200",
      href: "/curriculum/grade5-subjects/activities/mathematics/geometrical-thinking",
      highlights: ["Shape Classification", "Coordinate Adventures", "Tangram Puzzles"],
    },
    {
      title: "Measurement Activities",
      description: "Hands-on activities for measurement skills",
      icon: Ruler,
      color: "from-rose-500 to-pink-600",
      bgColor: "bg-rose-50",
      textColor: "text-rose-700",
      borderColor: "border-rose-200",
      href: "/curriculum/grade5-subjects/activities/mathematics/measurement",
      highlights: ["Unit Conversions", "Volume Projects", "Design Challenges"],
    },
    {
      title: "Data Handling & Probability Activities",
      description: "Engaging activities for data analysis and probability",
      icon: BarChart3,
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-700",
      borderColor: "border-cyan-200",
      href: "/curriculum/grade5-subjects/activities/mathematics/data-probability",
      highlights: ["Data Collection", "Probability Experiments", "Statistical Analysis"],
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 5 Subjects", href: "/curriculum/grade5-subjects" },
          { label: "Mathematics", href: "/curriculum/grade5-subjects/mathematics" },
          { label: "Activities", href: "/curriculum/grade5-subjects/activities/mathematics" },
        ]}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-90"></div>
        <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Calculator className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">Grade 5 Mathematics Activities</h1>
          <p className="text-xl text-white/90 text-center max-w-3xl mx-auto leading-relaxed">
            Discover exciting hands-on activities and interactive projects designed to make mathematics engaging and fun
            while building essential skills.
          </p>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity, index) => {
          const IconComponent = activity.icon
          return (
            <Card
              key={index}
              className={`group hover:shadow-2xl transition-all duration-500 ${activity.borderColor} border-2 hover:-translate-y-2 overflow-hidden`}
            >
              <div className={`h-2 bg-gradient-to-r ${activity.color}`}></div>
              <CardHeader className={`${activity.bgColor} pb-4`}>
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`p-2 bg-gradient-to-r ${activity.color} rounded-lg text-white shadow-lg`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <CardTitle
                    className={`${activity.textColor} group-hover:scale-105 transition-transform duration-300`}
                  >
                    {activity.title}
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-600 leading-relaxed">{activity.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-grow p-6">
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-gray-700 mb-2">Featured Activities:</h4>
                  <div className="space-y-2">
                    {activity.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${activity.color}`}></div>
                        <span className="text-sm text-gray-600">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link to={activity.href}>
                  <Button
                    className={`w-full bg-gradient-to-r ${activity.color} hover:shadow-lg hover:scale-105 transition-all duration-300 text-white font-semibold py-3`}
                  >
                    Explore Activities
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Fun Facts Section */}
      <div className="mt-12 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">🎯 Did You Know?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-yellow-600">6</div>
            <p className="text-gray-700">Mathematical Strands</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-orange-600">50+</div>
            <p className="text-gray-700">Interactive Activities</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-red-600">∞</div>
            <p className="text-gray-700">Learning Possibilities</p>
          </div>
        </div>
      </div>
    </div>
  )
}
