import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FlaskConical, Leaf, Package, Cloud, Sun, PawPrint, Zap, Sparkles } from "lucide-react"

export default function ScienceActivitiesPage() {
  const activities = [
    {
      title: "Plant Detectives",
      description: "Life Science Activity",
      icon: Leaf,
      color: "from-green-500 to-emerald-600",
      bgColor: "from-green-50 to-emerald-100",
      iconColor: "text-green-600",
      duration: "45-60 minutes",
      materials: ["Various plants and flowers", "Hand lenses", "Tweezers", "Paper plates", "Observation journals"],
      href: "/curriculum/grade1-subjects/activities/science/plant-detectives",
      category: "Life Science"
    },
    {
      title: "Material Sorters",
      description: "Physical Science Activity",
      icon: Package,
      color: "from-blue-500 to-indigo-600",
      bgColor: "from-blue-50 to-indigo-100",
      iconColor: "text-blue-600",
      duration: "40-50 minutes",
      materials: ["Collection of various materials", "Sorting hoops or containers", "Property cards", "Water tubs", "Recording sheets"],
      href: "/curriculum/grade1-subjects/activities/science/material-sorters",
      category: "Physical Science"
    },
    {
      title: "Weather Watchers",
      description: "Earth and Space Science Activity",
      icon: Cloud,
      color: "from-sky-500 to-blue-600",
      bgColor: "from-sky-50 to-blue-100",
      iconColor: "text-sky-600",
      duration: "Ongoing (15 minutes daily)",
      materials: ["Weather chart", "Weather symbols", "Thermometer", "Rain gauge", "Weather journals"],
      href: "/curriculum/grade1-subjects/activities/science/weather-watchers",
      category: "Earth & Space Science"
    },
    {
      title: "Shadow Investigators",
      description: "Physical Science Activity",
      icon: Sun,
      color: "from-amber-500 to-orange-600",
      bgColor: "from-amber-50 to-orange-100",
      iconColor: "text-amber-600",
      duration: "45-60 minutes",
      materials: ["Flashlights", "Various objects", "White paper", "Chalk", "Shadow puppet templates"],
      href: "/curriculum/grade1-subjects/activities/science/shadow-investigators",
      category: "Physical Science"
    },
    {
      title: "Animal Adaptations",
      description: "Life Science Activity",
      icon: PawPrint,
      color: "from-purple-500 to-pink-600",
      bgColor: "from-purple-50 to-pink-100",
      iconColor: "text-purple-600",
      duration: "50-60 minutes",
      materials: ["Animal pictures and cards", "Samples of animal coverings", "Habitat posters", "Movement cards", "Animal masks"],
      href: "/curriculum/grade1-subjects/activities/science/animal-adaptations",
      category: "Life Science"
    },
    {
      title: "Push and Pull Playground",
      description: "Physical Science Activity",
      icon: Zap,
      color: "from-red-500 to-pink-600",
      bgColor: "from-red-50 to-pink-100",
      iconColor: "text-red-600",
      duration: "45-60 minutes",
      materials: ["Toy cars", "Balls of different sizes", "Ramps", "Surface materials", "Spring scales", "Recording sheets"],
      href: "/curriculum/grade1-subjects/activities/science/push-pull-playground",
      category: "Physical Science"
    }
  ]

  const categories = [...new Set(activities.map(activity => activity.category))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto py-8 px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full mb-6 shadow-lg">
            <FlaskConical className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Grade 1 Science Activities
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover exciting, hands-on science activities that spark curiosity, develop scientific thinking, 
            and build understanding of the natural world through inquiry-based exploration and discovery.
          </p>
        </div>

        {/* Overview Card */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Nurturing Scientific Minds
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  These carefully designed activities support the Grade 1 Science curriculum by providing 
                  hands-on, inquiry-based experiences that help students explore the natural world, develop 
                  scientific thinking skills, and build conceptual understanding through observation and investigation.
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
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">Duration: {activity.duration}</span>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <span className="text-blue-600">🔬</span>
                        Materials Needed:
                      </h4>
                      <ul className="space-y-1">
                        {activity.materials.slice(0, 3).map((material, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
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
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Ready to explore science?</span>
          </div>
          <p className="text-lg text-gray-700 mb-6">
            Choose an activity above to begin your scientific adventure!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="text-sm text-gray-500 bg-white/60 px-4 py-2 rounded-full">
              🌱 Life Science • ⚡ Physical Science • 🌍 Earth & Space Science • 🔬 Scientific Inquiry
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
