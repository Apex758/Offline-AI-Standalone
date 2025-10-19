import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import {
  CloudSun,
  CloudRain,
  Calendar,
  Sun,
  Thermometer,
  Palette,
  MessageCircle,
  Users,
  Music,
  Scissors,
  Eye,
  Clock,
  BookOpen,
  ArrowLeft,
} from "lucide-react"

export default function WeatherUnitActivitiesPage() {
  const weeks = [
    {
      id: "week1",
      title: "Weather All Around Us",
      description: "How do we observe and describe weather?",
      color: "cyan",
      icon: <CloudSun className="h-5 w-5" />,
      activities: [
        {
          id: "weather-observation-station",
          title: "Weather Observation Station",
          duration: "20 minutes",
          type: "Science",
          description: "Set up a classroom weather station and practice daily weather observations using all five senses.",
        },
        {
          id: "weather-word-wall",
          title: "Weather Word Wall Creation",
          duration: "25 minutes",
          type: "Language Arts",
          description: "Build a collaborative weather vocabulary wall with pictures and student-generated descriptions.",
        },
        {
          id: "weather-feelings-dance",
          title: "Weather Feelings Dance",
          duration: "15 minutes",
          type: "Movement",
          description: "Express different weather conditions through simple movements and discuss how weather makes us feel.",
        },
      ],
    },
    {
      id: "week2",
      title: "Types of Weather",
      description: "What different kinds of weather do we have?",
      color: "blue",
      icon: <CloudRain className="h-5 w-5" />,
      activities: [
        {
          id: "weather-in-a-bottle",
          title: "Weather in a Bottle",
          duration: "25 minutes",
          type: "Science Experiment",
          description: "Create mini weather systems in bottles to observe clouds and water drops (teacher-led demonstration).",
        },
        {
          id: "weather-sound-matching",
          title: "Weather Sound Matching Game",
          duration: "20 minutes",
          type: "Listening",
          description: "Match weather sounds to pictures and create our own safe weather sound effects.",
        },
        {
          id: "rainbow-after-rain",
          title: "Rainbow After the Rain Art",
          duration: "25 minutes",
          type: "Art",
          description: "Create beautiful rainbow art while learning about what happens after rainstorms.",
        },
      ],
    },
    {
      id: "week3",
      title: "Weather and Daily Life",
      description: "How does weather affect what we do and wear?",
      color: "green",
      icon: <Calendar className="h-5 w-5" />,
      activities: [
        {
          id: "weather-clothing-sort",
          title: "Weather Clothing Sort",
          duration: "20 minutes",
          type: "Social Studies",
          description: "Sort clothing items for different weather conditions and discuss appropriate choices.",
        },
        {
          id: "weather-activities-chart",
          title: "Weather Activities Planning Chart",
          duration: "25 minutes",
          type: "Social Studies",
          description: "Plan fun activities for different types of weather and discuss indoor vs. outdoor choices.",
        },
        {
          id: "weather-mood-journal",
          title: "Weather and Mood Journal",
          duration: "20 minutes",
          type: "Social-Emotional",
          description: "Explore how different weather makes us feel and create a personal weather mood journal.",
        },
      ],
    },
    {
      id: "week4",
      title: "Weather Tools and Communication",
      description: "How do we measure and report weather?",
      color: "amber",
      icon: <Sun className="h-5 w-5" />,
      activities: [
        {
          id: "weather-tool-construction",
          title: "Weather Tool Construction",
          duration: "30 minutes",
          type: "Engineering",
          description: "Build simple weather tools like rain gauges, wind vanes, and thermometers using everyday materials.",
        },
        {
          id: "weather-reporter-newscast",
          title: "Weather Reporter Newscast",
          duration: "30 minutes",
          type: "Communication",
          description: "Practice being weather reporters and present daily weather forecasts to the class.",
        },
      ],
    },
    {
      id: "week5",
      title: "Weather Patterns and Celebration",
      description: "How do we observe and celebrate weather learning?",
      color: "purple",
      icon: <Thermometer className="h-5 w-5" />,
      activities: [
        {
          id: "weather-patterns-art",
          title: "Weather Patterns Art",
          duration: "25 minutes",
          type: "Art",
          description: "Create artwork representing different weather patterns and seasonal changes.",
        },
        {
          id: "weather-celebration",
          title: "Weather Celebration Day",
          duration: "35 minutes",
          type: "Celebration",
          description: "Celebrate learning about weather with a fun weather-themed party and activities.",
        },
      ],
    },
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      cyan: {
        border: "border-cyan-200",
        bg: "bg-cyan-50",
        text: "text-cyan-700",
        badge: "bg-cyan-100 text-cyan-700",
      },
      blue: {
        border: "border-blue-200",
        bg: "bg-blue-50",
        text: "text-blue-700",
        badge: "bg-blue-100 text-blue-700",
      },
      green: {
        border: "border-green-200",
        bg: "bg-green-50",
        text: "text-green-700",
        badge: "bg-green-100 text-green-700",
      },
      amber: {
        border: "border-amber-200",
        bg: "bg-amber-50",
        text: "text-amber-700",
        badge: "bg-amber-100 text-amber-700",
      },
      purple: {
        border: "border-purple-200",
        bg: "bg-purple-50",
        text: "text-purple-700",
        badge: "bg-purple-100 text-purple-700",
      },
    }
    return colorMap[color as keyof typeof colorMap]
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/curriculum/kindergarten">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Kindergarten
            </Link>
          </Button>
        </div>

        <h1 className="text-4xl font-bold mb-2 text-sky-700">Weather Unit Activities</h1>
        <p className="text-gray-600 mb-4">
          Hands-on activities for exploring weather and its impacts on our world
        </p>

        <div className="bg-sky-50 border border-sky-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-sky-700 flex items-center">
            <CloudSun className="mr-2 h-6 w-6" /> Activity Overview
          </h2>
          <p className="mb-4">
            This collection includes 18 engaging, age-appropriate activities designed specifically for kindergarten
            students to explore weather concepts through hands-on experiments, observations, art projects, and interactive games.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-sky-600" />
              <span>15-35 minutes each</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-sky-600" />
              <span>Whole & small groups</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-sky-600" />
              <span>Cross-curricular</span>
            </div>
            <div className="flex items-center gap-2">
              <CloudSun className="h-4 w-4 text-sky-600" />
              <span>Weather science</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {weeks.map((week) => {
          const colors = getColorClasses(week.color)
          return (
            <div key={week.id}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${colors.bg}`}>{week.icon}</div>
                <div>
                  <h2 className={`text-2xl font-bold ${colors.text}`}>{week.title}</h2>
                  <p className="text-gray-600">{week.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {week.activities.map((activity) => (
                  <Card key={activity.id} className={`${colors.border} hover:shadow-md transition-shadow`}>
                    <CardHeader className={`${colors.bg} border-b ${colors.border}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className={`text-lg ${colors.text}`}>{activity.title}</CardTitle>
                          <CardDescription className="mt-1">{activity.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {activity.duration}
                          </div>
                        </div>
                        <Badge className={colors.badge}>{activity.type}</Badge>
                      </div>

                      <Button asChild className="w-full">
                        <Link to={`/curriculum/kindergarten/activities/weather-unit/${week.id}/${activity.id}`}
                        >
                          View Full Instructions
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-12 text-center">
        <div className="bg-sky-50 border border-sky-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-sky-700 mb-2">Ready to Begin?</h3>
          <p className="text-gray-600 mb-4">
            Start with Week 1 activities to introduce students to weather observation and vocabulary.
          </p>
          <Link to="/curriculum/kindergarten/activities/weather-unit/week1/weather-observation-station"><Button>
              Start with Weather Observation Station
            </Button></Link>
        </div>
      </div>
    </div>
  )
}
