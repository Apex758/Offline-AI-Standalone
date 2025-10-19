import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PDFExportButton } from "@/components/pdf-export-button"
import { Clock, Users, BookOpen, Globe, Users2, Map, Building2, Sparkles, Heart, Compass, Palette } from "lucide-react"

// Enhanced activities data with icons and colors
const activities = [
  {
    id: "1",
    title: "My Family Tree",
    strand: "Historical and Cultural Thinking",
    description: "Students create a family tree to explore their family history and cultural heritage.",
    icon: Heart,
    color: "from-pink-500 to-rose-600",
    bgColor: "from-pink-50 to-rose-100",
    iconColor: "text-pink-600",
    duration: 45,
    groupSize: "Individual",
    materials: ["Paper", "Colored pencils", "Family photos (optional)", "Template handout"],
    href: "/curriculum/grade1-subjects/activities/social-studies/my-family-tree",
    instructions: [
      "Introduce the concept of a family tree",
      "Show examples of different family trees",
      "Distribute the template handout",
      "Have students fill in their family members' names",
      "Allow time for students to decorate their family trees",
      "Have students share their family trees with the class",
    ],
  },
  {
    id: "2",
    title: "Community Helper Role Play",
    strand: "Civic Participation",
    description: "Students role-play different community helpers to understand their roles and responsibilities.",
    icon: Building2,
    color: "from-blue-500 to-indigo-600",
    bgColor: "from-blue-50 to-indigo-100",
    iconColor: "text-blue-600",
    duration: 30,
    groupSize: "Small groups",
    materials: ["Community helper props (hats, tools, etc.)", "Role cards", "Scenario cards"],
    href: "/curriculum/grade1-subjects/activities/social-studies/community-helper-role-play",
    instructions: [
      "Discuss different community helpers and their roles",
      "Divide students into small groups",
      "Assign each group a community helper to role-play",
      "Distribute props and scenario cards",
      "Allow time for groups to practice their role-plays",
      "Have each group perform for the class",
      "Discuss the importance of each community helper",
    ],
  },
  {
    id: "3",
    title: "Neighborhood Map",
    strand: "Spatial Thinking",
    description: "Students create a map of their neighborhood or school, identifying key locations and landmarks.",
    icon: Map,
    color: "from-emerald-500 to-teal-600",
    bgColor: "from-emerald-50 to-teal-100",
    iconColor: "text-emerald-600",
    duration: 60,
    groupSize: "Pairs",
    materials: ["Large paper", "Markers", "Rulers", "Stickers for landmarks"],
    href: "/curriculum/grade1-subjects/activities/social-studies/neighborhood-map",
    instructions: [
      "Introduce the concept of maps and their purpose",
      "Show examples of simple maps",
      "Discuss important features of the neighborhood or school",
      "Have students work in pairs to create their maps",
      "Encourage students to include a title, compass rose, and legend",
      "Allow time for students to share their maps with the class",
    ],
  },
  {
    id: "4",
    title: "Needs vs. Wants Sorting Game",
    strand: "Economic Decision Making",
    description: "Students sort pictures of various items into 'needs' and 'wants' categories.",
    icon: Palette,
    color: "from-purple-500 to-pink-600",
    bgColor: "from-purple-50 to-pink-100",
    iconColor: "text-purple-600",
    duration: 25,
    groupSize: "Small groups",
    materials: [
      "Picture cards of various items",
      "Two sorting containers labeled 'Needs' and 'Wants'",
      "Sorting worksheet",
    ],
    href: "/curriculum/grade1-subjects/activities/social-studies/needs-vs-wants-sorting",
    instructions: [
      "Discuss the difference between needs and wants",
      "Provide examples of each category",
      "Divide students into small groups",
      "Distribute picture cards and sorting containers",
      "Have students sort the cards into the appropriate containers",
      "Discuss any items that were difficult to categorize",
      "Complete the sorting worksheet as a class",
    ],
  },
  {
    id: "5",
    title: "Cultural Celebration Show and Tell",
    strand: "Historical and Cultural Thinking",
    description: "Students share an item or tradition from their cultural background with the class.",
    icon: Globe,
    color: "from-amber-500 to-orange-600",
    bgColor: "from-amber-50 to-orange-100",
    iconColor: "text-amber-600",
    duration: 45,
    groupSize: "Individual",
    materials: ["Cultural items brought from home", "World map or globe", "Cultural celebration worksheet"],
    href: "/curriculum/grade1-subjects/activities/social-studies/cultural-celebration-show-tell",
    instructions: [
      "Send a note home asking parents to help students select a cultural item to share",
      "Create a schedule for student presentations",
      "Have each student share their item and explain its significance",
      "Use the world map to identify where each cultural tradition originates",
      "Complete the cultural celebration worksheet",
      "Create a classroom display of cultural traditions",
    ],
  },
  {
    id: "6",
    title: "Cardinal Directions Treasure Hunt",
    strand: "Spatial Thinking",
    description: "Students use cardinal directions to find hidden treasures around the classroom or school yard.",
    icon: Compass,
    color: "from-red-500 to-pink-600",
    bgColor: "from-red-50 to-pink-100",
    iconColor: "text-red-600",
    duration: 40,
    groupSize: "Pairs",
    materials: ["Compass", "Direction cards", "Small treasures or prizes", "Simple maps with directions"],
    href: "/curriculum/grade1-subjects/activities/social-studies/cardinal-directions-treasure-hunt",
    instructions: [
      "Teach students about the four cardinal directions",
      "Practice identifying North, South, East, and West in the classroom",
      "Divide students into pairs",
      "Distribute simple maps with directions",
      "Have students follow the directions to find hidden treasures",
      "Discuss the importance of directions for finding locations",
    ],
  },
]

export default function SocialStudiesActivitiesPage() {
  // Group activities by strand
  const activitiesByStrand = activities.reduce(
    (acc, activity) => {
      const strand = activity.strand
      if (!acc[strand]) {
        acc[strand] = []
      }
      acc[strand].push(activity)
      return acc
    },
    {} as Record<string, typeof activities>,
  )

  const categories = [...new Set(activities.map(activity => activity.strand))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      <div className="container mx-auto py-8 px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-600 to-amber-600 rounded-full mb-6 shadow-lg">
            <Globe className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent mb-4">
            Grade 1 Social Studies Activities
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover engaging, hands-on social studies activities that help students explore communities, 
            cultures, geography, and civic responsibility through interactive learning experiences.
          </p>
        </div>

        {/* Overview Card */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Building Community Understanding
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  These carefully designed activities support the Grade 1 Social Studies curriculum by providing 
                  hands-on, inquiry-based experiences that help students develop understanding of communities, 
                  cultural diversity, spatial thinking, and civic participation through meaningful contexts.
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

        {/* Enhanced Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg">
              <TabsTrigger value="all" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                All Activities
              </TabsTrigger>
              {Object.keys(activitiesByStrand).map((strand) => (
                <TabsTrigger key={strand} value={strand} className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  {strand}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {activities.map((activity) => (
                <EnhancedActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </TabsContent>

          {Object.entries(activitiesByStrand).map(([strand, strandActivities]) => (
            <TabsContent key={strand} value={strand} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {strandActivities.map((activity) => (
                  <EnhancedActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-gray-600 mb-4">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Ready to explore social studies?</span>
          </div>
          <p className="text-lg text-gray-700 mb-6">
            Choose an activity above to begin your community and cultural adventure!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="text-sm text-gray-500 bg-white/60 px-4 py-2 rounded-full">
              🌍 Cultural Understanding • 🏘️ Community Building • 🗺️ Spatial Thinking • 🎭 Civic Participation
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EnhancedActivityCard({ activity }: { activity: any }) {
  const IconComponent = activity.icon
  
  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
      {/* Card Header with Gradient */}
      <div className={`bg-gradient-to-r ${activity.bgColor} p-6 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${activity.color} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <Badge className="bg-white/60 text-gray-700 border-0 font-medium">
              {activity.strand}
            </Badge>
          </div>
          <Link to={activity.href} className="block group-hover:text-gray-900 transition-colors">
            <CardTitle className="text-xl font-bold text-gray-800 mb-2 cursor-pointer">
              {activity.title}
            </CardTitle>
            <CardDescription className="text-gray-600 font-medium cursor-pointer">
              {activity.description}
            </CardDescription>
          </Link>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="font-medium">{activity.duration} min</span>
            </div>
            <div className="flex items-center gap-2">
              <Users2 className="w-4 h-4 text-orange-500" />
              <span className="font-medium">{activity.groupSize}</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-orange-600">📚</span>
              Materials Needed:
            </h4>
            <ul className="space-y-1">
              {activity.materials.slice(0, 3).map((material: string, idx: number) => (
                <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
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

      <CardFooter className="p-6 pt-0 flex gap-2">
        <Button 
          asChild
          variant="outline" 
          size="sm" 
          className="flex-1 border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300"
        >
          <Link to={activity.href} className="flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4" />
            View Details
          </Link>
        </Button>
        <PDFExportButton
          title={activity.title}
          subtitle="Grade 1 Social Studies Activity"
          content={[
            {
              text: activity.description,
            },
            {
              heading: "Activity Details",
              text: `Duration: ${activity.duration} minutes\nGroup Size: ${activity.groupSize}`,
            },
            {
              heading: "Materials",
              list: activity.materials,
            },
            {
              heading: "Instructions",
              list: activity.instructions,
            },
          ]}
          filename={`activity-${activity.id}.pdf`}
        />
      </CardFooter>
    </Card>
  )
}
