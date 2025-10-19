import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Volume2, PenTool, Users, Search, BookOpen as BookOpenIcon } from "lucide-react"

export default function LanguageArtsActivitiesPage() {
  const activities = [
    {
      title: "Story Sequence Cards",
      description: "Reading Comprehension Activity",
      icon: BookOpen,
      color: "from-blue-500 to-indigo-600",
      bgColor: "from-blue-50 to-indigo-100",
      iconColor: "text-blue-600",
      duration: "30-40 minutes",
      materials: ["Picture books", "Story sequence cards", "Sentence strips", "Pocket chart"],
      href: "/curriculum/grade1-subjects/activities/language-arts/story-sequence-cards"
    },
    {
      title: "Sound Detectives",
      description: "Phonological Awareness Activity",
      icon: Volume2,
      color: "from-orange-500 to-red-600",
      bgColor: "from-orange-50 to-red-100",
      iconColor: "text-orange-600",
      duration: "20-30 minutes",
      materials: ["Picture cards", "Sound boxes", "Counters", "Letter tiles", "Rhyming pairs"],
      href: "/curriculum/grade1-subjects/activities/language-arts/sound-detectives"
    },
    {
      title: "Interactive Writing",
      description: "Writing Activity",
      icon: PenTool,
      color: "from-purple-500 to-pink-600",
      bgColor: "from-purple-50 to-pink-100",
      iconColor: "text-purple-600",
      duration: "30-40 minutes",
      materials: ["Chart paper", "Markers", "Pointer", "Whiteboards", "Word wall"],
      href: "/curriculum/grade1-subjects/activities/language-arts/interactive-writing"
    },
    {
      title: "Puppet Show Storytelling",
      description: "Speaking and Listening Activity",
      icon: Users,
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-50 to-teal-100",
      iconColor: "text-emerald-600",
      duration: "45-60 minutes",
      materials: ["Stick puppets", "Sock puppets", "Puppet theater", "Story props", "Story planning sheets"],
      href: "/curriculum/grade1-subjects/activities/language-arts/puppet-show-storytelling"
    },
    {
      title: "Word Detectives",
      description: "Word Study Activity",
      icon: Search,
      color: "from-amber-500 to-yellow-600",
      bgColor: "from-amber-50 to-yellow-100",
      iconColor: "text-amber-600",
      duration: "30-40 minutes",
      materials: ["Word cards", "Magnetic letters", "Word games", "Rainbow writing materials", "Word hunt sheets"],
      href: "/curriculum/grade1-subjects/activities/language-arts/word-detectives"
    },
    {
      title: "Reading Response Centers",
      description: "Comprehension Activity",
      icon: BookOpenIcon,
      color: "from-indigo-500 to-purple-600",
      bgColor: "from-indigo-50 to-purple-100",
      iconColor: "text-indigo-600",
      duration: "45-60 minutes",
      materials: ["Picture books", "Response templates", "Art supplies", "Story map organizers", "Character puppets"],
      href: "/curriculum/grade1-subjects/activities/language-arts/reading-response-centers"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto py-8 px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Grade 1 Language Arts Activities
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover engaging, hands-on activities designed to develop essential language skills through 
            interactive learning experiences that make literacy fun and meaningful.
          </p>
        </div>

        {/* Overview Card */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Building Strong Language Foundations
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  These carefully crafted activities support the Grade 1 Language Arts curriculum by providing 
                  engaging experiences that help students develop listening, speaking, reading, writing, viewing, 
                  and representing skills through meaningful contexts and hands-on exploration.
                </p>
              </div>
            </CardContent>
          </Card>
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
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${activity.color} rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`w-8 h-8 ${activity.iconColor.replace('text-', 'text-white')}`} />
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
                        <span className="text-blue-600">📚</span>
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
            <span className="text-sm font-medium">Ready to get started?</span>
          </div>
          <p className="text-lg text-gray-700 mb-6">
            Choose an activity above to begin your language arts journey!
          </p>
        </div>
      </div>
    </div>
  )
}
