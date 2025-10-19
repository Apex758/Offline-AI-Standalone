import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import { Leaf, Droplets, Home, TreesIcon as Tree, Recycle, Clock, Users, BookOpen, ArrowLeft } from "lucide-react"

export default function PlantsAnimalsActivitiesPage() {
  const weeks = [
    {
      id: "week1",
      title: "Plants and Animals in Our Lives",
      description: "How do plants and animals make a difference to me?",
      color: "pink",
      icon: <Leaf className="h-5 w-5" />,
      activities: [
        {
          id: "community-food-connection",
          title: "Community Food Connection Show & Tell",
          duration: "25 minutes",
          type: "Discussion",
          description: "Help children recognize how local plants and animals contribute to their daily meals",
        },
        {
          id: "living-vs-nonliving-sorting",
          title: "Living vs. Non-Living Sorting Game",
          duration: "20 minutes",
          type: "Game",
          description: "Distinguish between living and non-living things in the local environment",
        },
        {
          id: "favourite-meal-art",
          title: "Favourite Meal Art Project",
          duration: "30 minutes",
          type: "Art",
          description: "Identify plant and animal sources in meals through creative art",
        },
        {
          id: "local-farm-song",
          title: "Local Farm Song",
          duration: "15 minutes",
          type: "Music",
          description: "Build vocabulary of local plants and animals through adapted songs",
        },
      ],
    },
    {
      id: "week2",
      title: "Survival Needs",
      description: "What do plants and animals need to survive?",
      color: "amber",
      icon: <Droplets className="h-5 w-5" />,
      activities: [
        {
          id: "water-for-life-experiment",
          title: "Water for Life Experiment",
          duration: "20 minutes daily",
          type: "Science",
          description: "Observe how water affects plant survival through hands-on experimentation",
        },
        {
          id: "animal-care-roleplay",
          title: "Animal Care Role-Play",
          duration: "25 minutes",
          type: "Dramatic Play",
          description: "Recognize basic animal survival needs through interactive role-play",
        },
        {
          id: "survival-needs-chart",
          title: "Survival Needs Chart",
          duration: "20 minutes",
          type: "Discussion",
          description: "Identify survival needs of plants and animals using visual charts",
        },
        {
          id: "coconut-tree-story",
          title: "Story Time: The Coconut Tree",
          duration: "25 minutes",
          type: "Literature",
          description: "Learn about plant survival and uses through Caribbean folktales",
        },
      ],
    },
    {
      id: "week3",
      title: "Habitats",
      description: "Where do plants and animals live and why do they live there?",
      color: "blue",
      icon: <Home className="h-5 w-5" />,
      activities: [
        {
          id: "nature-walk-habitat-hunt",
          title: "Nature Walk Habitat Hunt",
          duration: "30 minutes",
          type: "Outdoor",
          description: "Explore local habitats and identify residents through guided observation",
        },
        {
          id: "habitat-mural",
          title: "Habitat Mural",
          duration: "35 minutes",
          type: "Art",
          description: "Show understanding of different Caribbean habitats through collaborative art",
        },
        {
          id: "home-matching-game",
          title: "Home Matching Game",
          duration: "20 minutes",
          type: "Game",
          description: "Match animals and plants to their appropriate habitats",
        },
        {
          id: "local-habitat-chant",
          title: "Local Habitat Chant",
          duration: "15 minutes",
          type: "Music",
          description: "Reinforce habitat vocabulary through rhythm and movement",
        },
      ],
    },
    {
      id: "week4",
      title: "Changing Environments",
      description: "Can plants and animals change the place where they live?",
      color: "emerald",
      icon: <Tree className="h-5 w-5" />,
      activities: [
        {
          id: "mangrove-story-model",
          title: "Mangrove Story & Model",
          duration: "30 minutes",
          type: "Science",
          description: "Show how plants change environments using local mangrove examples",
        },
        {
          id: "crab-hole-observation",
          title: "Crab Hole Observation",
          duration: "25 minutes",
          type: "Outdoor",
          description: "Observe animal-made environmental changes through field study",
        },
        {
          id: "seed-spread-simulation",
          title: "Seed Spread Simulation",
          duration: "20 minutes",
          type: "Movement",
          description: "Understand how plants spread seeds through interactive simulation",
        },
        {
          id: "coral-reef-roleplay",
          title: "Coral Reef Role-Play",
          duration: "25 minutes",
          type: "Dramatic Play",
          description: "Explore how animals change their habitat through Caribbean reef examples",
        },
      ],
    },
    {
      id: "week5",
      title: "Environmental Stewardship",
      description: "Can we do some things so the environment is not changed so much by humans?",
      color: "purple",
      icon: <Recycle className="h-5 w-5" />,
      activities: [
        {
          id: "beach-cleanup",
          title: "Beach or Schoolyard Clean-Up",
          duration: "30 minutes",
          type: "Service",
          description: "Teach care for the environment through hands-on community action",
        },
        {
          id: "plant-tree-day",
          title: "Plant a Tree Day",
          duration: "25 minutes",
          type: "Service",
          description: "Take action to improve the environment through tree planting",
        },
        {
          id: "how-can-we-help-chart",
          title: "How Can We Help? Chart",
          duration: "20 minutes",
          type: "Discussion",
          description: "Brainstorm actions to protect plants and animals in our community",
        },
        {
          id: "protect-our-island-song",
          title: "Protect Our Island Song",
          duration: "15 minutes",
          type: "Music",
          description: "Reinforce environmental stewardship through Caribbean-themed music",
        },
      ],
    },
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      pink: {
        border: "border-pink-200",
        bg: "bg-pink-50",
        text: "text-pink-700",
        badge: "bg-pink-100 text-pink-700",
      },
      amber: {
        border: "border-amber-200",
        bg: "bg-amber-50",
        text: "text-amber-700",
        badge: "bg-amber-100 text-amber-700",
      },
      blue: {
        border: "border-blue-200",
        bg: "bg-blue-50",
        text: "text-blue-700",
        badge: "bg-blue-100 text-blue-700",
      },
      emerald: {
        border: "border-emerald-200",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        badge: "bg-emerald-100 text-emerald-700",
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

        <h1 className="text-4xl font-bold mb-2 text-emerald-700">Plants and Animals Unit Activities</h1>
        <p className="text-gray-600 mb-4">
          Hands-on activities exploring how plants and animals make a difference to our Caribbean world
        </p>

        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-emerald-700 flex items-center">
            <Leaf className="mr-2 h-6 w-6" /> Activity Overview
          </h2>
          <p className="mb-4">
            This collection includes 20 engaging, age-appropriate activities designed specifically for kindergarten
            students to explore plants and animals in their Caribbean environment. Each activity incorporates local
            context, hands-on learning, and cultural connections.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600" />
              <span>15-35 minutes each</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-600" />
              <span>Whole & small groups</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              <span>Cross-curricular</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-emerald-600" />
              <span>Caribbean context</span>
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
                        <Link to={`/curriculum/kindergarten/activities/plants-animals-unit/${week.id}/${activity.id}`}
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
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-emerald-700 mb-2">Ready to Begin?</h3>
          <p className="text-gray-600 mb-4">
            Start with Week 1 activities to introduce students to the wonderful world of plants and animals in the
            Caribbean.
          </p>
          <Link to="/curriculum/kindergarten/activities/plants-animals-unit/week1/community-food-connection"><Button>
              Start with Community Food Connection
            </Button></Link>
        </div>
      </div>
    </div>
  )
}
