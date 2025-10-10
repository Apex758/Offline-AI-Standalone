import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import { Gamepad2, Users, MapPin, Briefcase, Heart, Clock, BookOpen, Target } from "lucide-react"

export default function GamesUnitActivities() {
  const weeks = [
    {
      week: 1,
      title: "What are games?",
      description: "Explore the idea of games and recognize games from our community",
      color: "bg-pink-100 text-pink-700 border-pink-200",
      icon: <Gamepad2 className="h-5 w-5" />,
      activities: [
        {
          slug: "favourite-game-show-tell",
          name: "My Favourite Game Show & Tell",
          duration: "25 min",
          type: "Discussion",
        },
        { slug: "classroom-game-corner", name: "Classroom Game Corner Setup", duration: "30 min", type: "Exploration" },
        { slug: "drawing-my-game", name: "Drawing My Game", duration: "20 min", type: "Art" },
        { slug: "song-movement-game", name: "Song & Movement Game", duration: "15 min", type: "Movement" },
      ],
    },
    {
      week: 2,
      title: "How are games played?",
      description: "Understand game rules, turns, and fair play",
      color: "bg-amber-100 text-amber-700 border-amber-200",
      icon: <Users className="h-5 w-5" />,
      activities: [
        { slug: "simon-says-local", name: "Simon Says (Local Twist)", duration: "20 min", type: "Movement" },
        { slug: "hopscotch-chalk", name: "Hopscotch (Drawn with Chalk)", duration: "25 min", type: "Physical" },
        { slug: "passing-ball-game", name: "Passing the Ball Game", duration: "15 min", type: "Circle Time" },
        { slug: "rules-play-discussion", name: "Rules of Play Discussion", duration: "20 min", type: "Discussion" },
      ],
    },
    {
      week: 3,
      title: "Who plays games?",
      description: "Recognize that people of all ages and backgrounds play games",
      color: "bg-blue-100 text-blue-700 border-blue-200",
      icon: <MapPin className="h-5 w-5" />,
      activities: [
        { slug: "family-game-stories", name: "Family Game Time Stories", duration: "25 min", type: "Sharing" },
        {
          slug: "grandparents-game-demo",
          name: "Grandparents' Game Demonstration",
          duration: "35 min",
          type: "Cultural",
        },
        { slug: "animal-imitation-tag", name: "Animal Imitation Tag", duration: "20 min", type: "Movement" },
        { slug: "who-plays-where-chart", name: "Who Plays Where? Chart", duration: "20 min", type: "Sorting" },
      ],
    },
    {
      week: 4,
      title: "Where can we play games?",
      description: "Identify safe spaces for playing games",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: <Briefcase className="h-5 w-5" />,
      activities: [
        { slug: "schoolyard-safety-walk", name: "Schoolyard Safety Walk", duration: "30 min", type: "Exploration" },
        { slug: "indoor-games-rotation", name: "Indoor Games Rotation", duration: "35 min", type: "Game Play" },
        { slug: "drawing-playground", name: "Drawing Our Playground", duration: "25 min", type: "Art" },
        { slug: "movement-obstacle-course", name: "Movement Obstacle Course", duration: "30 min", type: "Physical" },
      ],
    },
    {
      week: 5,
      title: "How do we feel when we play games?",
      description: "Understand emotions connected to playing games",
      color: "bg-indigo-100 text-indigo-700 border-indigo-200",
      icon: <Heart className="h-5 w-5" />,
      activities: [
        { slug: "faces-game-activity", name: "Faces of the Game Activity", duration: "20 min", type: "Discussion" },
        { slug: "feelings-role-play", name: "Feelings Role-Play", duration: "25 min", type: "Drama" },
        { slug: "parachute-play", name: "Cooperative Game: Parachute Play", duration: "20 min", type: "Cooperative" },
        { slug: "thankfulness-circle", name: "Game Thankfulness Circle", duration: "15 min", type: "Circle Time" },
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-purple-700">Games Unit Activities</h1>
        <p className="text-gray-600 mb-4">Hands-on activities exploring games and their role in our lives</p>
        <div className="bg-purple-50 border border-purple-100 p-6 rounded-lg">
          <p className="mb-2">
            <strong>20 engaging activities</strong> across 5 weeks that help kindergarten students explore different
            types of games, understand rules and fair play, and develop social skills through traditional Caribbean
            games and local cultural connections.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className="bg-purple-100 text-purple-700">Caribbean Context</Badge>
            <Badge className="bg-purple-100 text-purple-700">Traditional Games</Badge>
            <Badge className="bg-purple-100 text-purple-700">Social Skills</Badge>
            <Badge className="bg-purple-100 text-purple-700">Movement & Play</Badge>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {weeks.map((week) => (
          <div key={week.week} className="space-y-4">
            <div className={`p-4 rounded-lg border-2 ${week.color.split(" ")[2]}`}>
              <h2 className={`text-2xl font-bold mb-2 ${week.color.split(" ")[1]} flex items-center`}>
                {week.icon}
                <span className="ml-2">
                  Week {week.week}: {week.title}
                </span>
              </h2>
              <p className="text-gray-600">{week.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {week.activities.map((activity) => (
                <Card
                  key={activity.slug}
                  className={`border-2 ${week.color.split(" ")[2]} hover:shadow-md transition-shadow`}
                >
                  <CardHeader className={`${week.color.split(" ")[0]} py-3`}>
                    <CardTitle className="text-sm font-medium">{activity.name}</CardTitle>
                    <div className="text-xs text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.duration}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-3">
                    <Button
                      asChild
                      size="sm"
                      className={`w-full ${week.color.split(" ")[1].replace("text-", "bg-").replace("-700", "-600")} hover:${week.color.split(" ")[1].replace("text-", "bg-").replace("-700", "-700")}`}
                    >
                      <Link to={`/curriculum/kindergarten/activities/games-unit/week${week.week}/${activity.slug}`}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        View Full Instructions
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-100">
        <h3 className="text-xl font-bold text-purple-700 mb-4 flex items-center">
          <Target className="mr-2 h-6 w-6" />
          Unit Highlights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-purple-600 mb-2">Caribbean Cultural Integration</h4>
            <ul className="text-sm space-y-1">
              <li>• Traditional Saint Lucian games like "All Fours" and "Zoot Zoot"</li>
              <li>• Local nature references (banana trees, grasshoppers)</li>
              <li>• Elder wisdom through grandparent demonstrations</li>
              <li>• Community-based game sharing</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-purple-600 mb-2">Kindergarten-Appropriate Features</h4>
            <ul className="text-sm space-y-1">
              <li>• 15-35 minute activity durations</li>
              <li>• Hands-on, movement-based learning</li>
              <li>• Simple rules and clear instructions</li>
              <li>• Social-emotional skill development</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" asChild>
          <Link to="/curriculum/kindergarten">Back to Kindergarten Overview</Link>
        </Button>
        <Button className="bg-purple-600 hover:bg-purple-700" asChild>
          <Link to="/curriculum/kindergarten/activities/games-unit/week1/favourite-game-show-tell">
            Start with Week 1 Activities
          </Link>
        </Button>
      </div>
    </div>
  )
}
