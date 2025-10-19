import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Users, Palette, Music, Heart, Star, Gift, Camera } from "lucide-react"

export default function CelebrationsActivitiesPage() {
  const activities = [
    // Week 1: Family Celebrations
    {
      id: "family-celebration-book",
      title: "My Family Celebration Book",
      week: "week1",
      duration: "25 minutes",
      type: "Art & Literacy",
      icon: <Heart className="h-5 w-5" />,
      description: "Create a personal book about family celebrations with drawings and simple words",
      materials: ["Construction paper", "Crayons", "Family photos (optional)", "Stapler"],
    },
    {
      id: "birthday-party-dramatic-play",
      title: "Birthday Party Play",
      week: "week1",
      duration: "20 minutes",
      type: "Dramatic Play",
      icon: <Gift className="h-5 w-5" />,
      description: "Role-play a Caribbean-style birthday party with traditional songs and games",
      materials: ["Party hats", "Pretend cake", "Caribbean music", "Colorful scarves"],
    },
    {
      id: "family-tree-celebration",
      title: "Family Celebration Tree",
      week: "week1",
      duration: "30 minutes",
      type: "Art & Social",
      icon: <Users className="h-5 w-5" />,
      description: "Create a family tree showing different celebrations your family enjoys",
      materials: ["Brown paper", "Colored paper circles", "Glue sticks", "Markers"],
    },

    // Week 2: Cultural Celebrations
    {
      id: "carnival-mask-making",
      title: "Carnival Masks",
      week: "week2",
      duration: "30 minutes",
      type: "Art & Culture",
      icon: <Palette className="h-5 w-5" />,
      description: "Design and create colorful carnival masks inspired by Caribbean traditions",
      materials: ["Paper plates", "Feathers", "Sequins", "Bright paint", "Elastic string"],
    },
    {
      id: "steel-pan-music-exploration",
      title: "Steel Pan Music Fun",
      week: "week2",
      duration: "20 minutes",
      type: "Music & Movement",
      icon: <Music className="h-5 w-5" />,
      description: "Explore steel pan music and create simple rhythms",
      materials: ["Metal pans", "Wooden spoons", "Steel pan music recordings", "Scarves"],
    },
    {
      id: "independence-day-flags",
      title: "OECS Independence Flags",
      week: "week2",
      duration: "25 minutes",
      type: "Art & Geography",
      icon: <Star className="h-5 w-5" />,
      description: "Learn about and create flags from different OECS countries",
      materials: ["Colored paper", "Glue", "Craft sticks", "Flag examples", "Crayons"],
    },

    // Week 3: Special Foods & Decorations
    {
      id: "caribbean-feast-pretend-play",
      title: "Caribbean Feast Cooking",
      week: "week3",
      duration: "25 minutes",
      type: "Dramatic Play",
      icon: <Heart className="h-5 w-5" />,
      description: "Pretend to cook traditional Caribbean celebration foods",
      materials: ["Play kitchen items", "Pretend fruits", "Mixing bowls", "Aprons"],
    },
    {
      id: "coconut-palm-decorations",
      title: "Coconut Palm Decorations",
      week: "week3",
      duration: "30 minutes",
      type: "Art & Nature",
      icon: <Palette className="h-5 w-5" />,
      description: "Create tropical decorations using coconut and palm themes",
      materials: ["Green paper", "Brown paper", "Cotton balls", "Glue", "Scissors (teacher use)"],
    },
    {
      id: "calypso-rhythm-shakers",
      title: "Calypso Rhythm Shakers",
      week: "week3",
      duration: "20 minutes",
      type: "Music & Craft",
      icon: <Music className="h-5 w-5" />,
      description: "Make musical shakers and dance to calypso rhythms",
      materials: ["Plastic bottles", "Rice/beans", "Colorful tape", "Calypso music"],
    },

    // Week 4: Celebrating Together
    {
      id: "classroom-carnival-parade",
      title: "Mini Carnival Parade",
      week: "week4",
      duration: "30 minutes",
      type: "Movement & Music",
      icon: <Star className="h-5 w-5" />,
      description: "Organize a classroom carnival parade with costumes and music",
      materials: ["Carnival masks", "Colorful scarves", "Rhythm instruments", "Caribbean music"],
    },
    {
      id: "celebration-memory-book",
      title: "Our Celebration Memories",
      week: "week4",
      duration: "25 minutes",
      type: "Literacy & Art",
      icon: <Camera className="h-5 w-5" />,
      description: "Create a class book documenting all the celebrations we've learned about",
      materials: ["Large paper", "Crayons", "Photos from activities", "Glue sticks"],
    },
    {
      id: "unity-friendship-circle",
      title: "Unity Friendship Circle",
      week: "week4",
      duration: "15 minutes",
      type: "Social & Emotional",
      icon: <Heart className="h-5 w-5" />,
      description: "Share what we love about celebrating together as a class family",
      materials: ["Soft ball or talking stick", "Circle time area", "Calm music"],
    },
  ]

  const weekColors = {
    week1: "bg-pink-100 text-pink-800 border-pink-200",
    week2: "bg-orange-100 text-orange-800 border-orange-200",
    week3: "bg-green-100 text-green-800 border-green-200",
    week4: "bg-purple-100 text-purple-800 border-purple-200",
  }

  const weekTitles = {
    week1: "Family Celebrations",
    week2: "Cultural Celebrations",
    week3: "Special Foods & Decorations",
    week4: "Celebrating Together",
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-cyan-700">Celebrations Unit Activities</h1>
        <p className="text-lg text-gray-600 mb-6">
          Explore Caribbean and family celebrations through hands-on activities, music, art, and dramatic play. Perfect
          for kindergarten students to learn about traditions and cultural diversity.
        </p>

        <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
          <h2 className="text-lg font-semibold text-cyan-700 mb-2">Caribbean Cultural Focus</h2>
          <p className="text-cyan-600">
            These activities celebrate Caribbean and OECS traditions including Carnival, steel pan music, independence
            celebrations, and traditional foods and crafts.
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Activities</TabsTrigger>
          <TabsTrigger value="week1">Week 1</TabsTrigger>
          <TabsTrigger value="week2">Week 2</TabsTrigger>
          <TabsTrigger value="week3">Week 3</TabsTrigger>
          <TabsTrigger value="week4">Week 4</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <Card key={activity.id} className="border-cyan-100 hover:shadow-lg transition-shadow flex flex-col h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {activity.icon}
                      <CardTitle className="text-lg text-cyan-700">{activity.title}</CardTitle>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className={weekColors[activity.week as keyof typeof weekColors]}>
                      {weekTitles[activity.week as keyof typeof weekTitles]}
                    </Badge>
                    <Badge variant="outline" className="text-gray-600">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.duration}
                    </Badge>
                    <Badge variant="outline" className="text-gray-600">
                      {activity.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 flex-1 flex flex-col">
                  <div className="flex-1">
                    <p className="text-gray-600 mb-3">{activity.description}</p>
                    <div className="mb-4">
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Materials:</h4>
                      <p className="text-sm text-gray-600">{activity.materials.join(", ")}</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4">
                    <Button asChild className="w-full bg-cyan-600 hover:bg-cyan-700">
                      <Link to={`/curriculum/kindergarten/activities/celebrations-unit/${activity.week}/${activity.id}`}
                      >
                        View Full Instructions
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {["week1", "week2", "week3", "week4"].map((week) => (
          <TabsContent key={week} value={week} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities
                .filter((activity) => activity.week === week)
                .map((activity) => (
                  <Card key={activity.id} className="border-cyan-100 hover:shadow-lg transition-shadow flex flex-col h-full">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {activity.icon}
                          <CardTitle className="text-lg text-cyan-700">{activity.title}</CardTitle>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className={weekColors[activity.week as keyof typeof weekColors]}>
                          {weekTitles[activity.week as keyof typeof weekTitles]}
                        </Badge>
                        <Badge variant="outline" className="text-gray-600">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.duration}
                        </Badge>
                        <Badge variant="outline" className="text-gray-600">
                          {activity.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 flex-1 flex flex-col">
                      <div className="flex-1">
                        <p className="text-gray-600 mb-3">{activity.description}</p>
                        <div className="mb-4">
                          <h4 className="font-medium text-sm text-gray-700 mb-1">Materials:</h4>
                          <p className="text-sm text-gray-600">{activity.materials.join(", ")}</p>
                        </div>
                      </div>
                      <div className="mt-auto pt-4">
                        <Button asChild className="w-full bg-cyan-600 hover:bg-cyan-700">
                          <Link to={`/curriculum/kindergarten/activities/celebrations-unit/${activity.week}/${activity.id}`}
                          >
                            View Full Instructions
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="text-center">
        <Button variant="outline" asChild>
          <Link to="/curriculum/kindergarten">Back to Kindergarten Curriculum</Link>
        </Button>
      </div>
    </div>
  )
}
