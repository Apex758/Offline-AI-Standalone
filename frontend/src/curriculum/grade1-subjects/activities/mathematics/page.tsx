import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Search, Ruler, BarChart3, Hash, Shapes, Target, Sparkles } from "lucide-react"

export default function MathematicsActivitiesPage() {
  const activities = [
    {
      title: "Number Detectives",
      description: "Number Sense Activity",
      icon: Search,
      color: "from-blue-500 to-indigo-600",
      bgColor: "from-blue-50 to-indigo-100",
      iconColor: "text-blue-600",
      duration: "30-40 minutes",
      materials: ["Clipboards", "Recording sheets", "Pencils", "Magnifying glasses (optional)"],
      href: "/curriculum/grade1-subjects/activities/mathematics/number-detectives",
      category: "Number Sense"
    },
    {
      title: "Shape Hunt",
      description: "Geometry Activity",
      icon: Shapes,
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-50 to-teal-100",
      iconColor: "text-emerald-600",
      duration: "45 minutes",
      materials: ["Shape cards", "Clipboards", "Paper", "Scissors and glue", "Cameras (optional)"],
      href: "/curriculum/grade1-subjects/activities/mathematics/shape-hunt",
      category: "Geometry"
    },
    {
      title: "Measurement Olympics",
      description: "Measurement Activity",
      icon: Ruler,
      color: "from-orange-500 to-red-600",
      bgColor: "from-orange-50 to-red-100",
      iconColor: "text-orange-600",
      duration: "60 minutes",
      materials: ["Unifix cubes", "Paper clips", "String", "Cups", "Sand timer", "Recording sheets"],
      href: "/curriculum/grade1-subjects/activities/mathematics/measurement-olympics",
      category: "Measurement"
    },
    {
      title: "Our Favorite Things Graph",
      description: "Data and Probability Activity",
      icon: BarChart3,
      color: "from-purple-500 to-pink-600",
      bgColor: "from-purple-50 to-pink-100",
      iconColor: "text-purple-600",
      duration: "40-50 minutes",
      materials: ["Chart paper", "Sticky notes", "Markers", "Picture cards"],
      href: "/curriculum/grade1-subjects/activities/mathematics/favorite-things-graph",
      category: "Data & Probability"
    },
    {
      title: "Ten Frame Fun",
      description: "Number Sense Activity",
      icon: Hash,
      color: "from-amber-500 to-yellow-600",
      bgColor: "from-amber-50 to-yellow-100",
      iconColor: "text-amber-600",
      duration: "30-40 minutes",
      materials: ["Ten frames", "Counters", "Number cards", "Recording sheets"],
      href: "/curriculum/grade1-subjects/activities/mathematics/ten-frame-fun",
      category: "Number Sense"
    },
    {
      title: "Pattern Playground",
      description: "Patterns and Relationships Activity",
      icon: Target,
      color: "from-pink-500 to-rose-600",
      bgColor: "from-pink-50 to-rose-100",
      iconColor: "text-pink-600",
      duration: "45-60 minutes",
      materials: ["Pattern blocks", "Beads and buttons", "Colored paper", "Pattern cards", "Recording sheets"],
      href: "/curriculum/grade1-subjects/activities/mathematics/pattern-playground",
      category: "Patterns & Relationships"
    },
    {
      title: "Pattern Block Puzzles",
      description: "Geometry Activity",
      icon: Target,
      color: "from-rose-500 to-pink-600",
      bgColor: "from-rose-50 to-pink-100",
      iconColor: "text-rose-600",
      duration: "30-40 minutes",
      materials: ["Pattern blocks", "Pattern cards", "Outline puzzles", "Paper for tracing"],
      href: "/curriculum/grade1-subjects/activities/mathematics/pattern-block-puzzles",
      category: "Geometry"
    }
  ]

  const categories = [...new Set(activities.map(activity => activity.category))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      <div className="container mx-auto py-8 px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-6 shadow-lg">
            <Calculator className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Grade 1 Mathematics Activities
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover exciting, hands-on mathematics activities that build number sense, spatial thinking, 
            and problem-solving skills through engaging exploration and discovery.
          </p>
        </div>

        {/* Overview Card */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Building Mathematical Minds
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  These carefully designed activities support the Grade 1 Mathematics curriculum by providing 
                  hands-on, engaging experiences that help students develop number sense, spatial awareness, 
                  measurement skills, and problem-solving abilities through meaningful contexts.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <div
              key={category}
              className="px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              {category}
            </div>
          ))}
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {activities.map((activity, index) => {
            const IconComponent = activity.icon
            return (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-sm overflow-hidden"
              >
                {/* Card Header with Gradient */}
                <div className={`bg-gradient-to-r ${activity.bgColor} p-6 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${activity.color} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 bg-white/60 px-3 py-1 rounded-full">
                        {activity.category}
                      </span>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                      {activity.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 font-medium">
                      {activity.description}
                    </CardDescription>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Duration: {activity.duration}</span>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <span className="text-emerald-600">🔧</span>
                        Materials Needed:
                      </h4>
                      <ul className="space-y-1">
                        {activity.materials.slice(0, 3).map((material, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                            {material}
                          </li>
                        ))}
                        {activity.materials.length > 3 && (
                          <li className="text-sm text-gray-500 italic">
                            +{activity.materials.length - 3} more items
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Button 
                    asChild 
                    className={`w-full bg-gradient-to-r ${activity.color} hover:shadow-lg transform hover:scale-105 transition-all duration-300 border-0 text-white font-semibold py-3`}
                  >
                    <Link to={activity.href} className="flex items-center justify-center gap-2">
                      Explore Activity
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-gray-600 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Ready to explore mathematics?</span>
          </div>
          <p className="text-lg text-gray-700 mb-6">
            Choose an activity above to begin your mathematical adventure!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="text-sm text-gray-500 bg-white/60 px-4 py-2 rounded-full">
              🧮 Number Sense • 🔷 Geometry • 📏 Measurement • 📊 Data & Probability
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
