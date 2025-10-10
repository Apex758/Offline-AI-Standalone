import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
// Removed Next.js notFound - using React Router navigation instead
import {
  Heart,
  Users,
  School,
  MapPin,
  Sparkles,
  Palette,
  MessageCircle,
  Camera,
  Book,
  Music,
  Scissors,
  Star,
  Clock,
  BookOpen,
  Target,
  Package,
} from "lucide-react"

// Unit data structure
const unitData = {
  "belonging-unit": {
    title: "Belonging Unit Activities",
    description:
      "Engaging hands-on activities to help kindergarten students explore identity, family, school, and community through creative expression and meaningful connections.",
    weeklyActivities: [
      {
        week: 1,
        title: "All About Me",
        color: "bg-pink-100 text-pink-700 border-pink-200",
        badgeColor: "bg-pink-500",
        icon: Heart,
        activities: [
          {
            type: "Art Activity",
            title: "Self-Portrait Gallery",
            description: "Draw yourself using mirrors and create a classroom gallery of unique self-portraits.",
            materials: ["Mirrors", "Crayons", "Paper", "Picture frames"],
            icon: Palette,
            slug: "self-portrait-gallery",
            duration: "25 min",
          },
          {
            type: "Discussion",
            title: "My Favorite Things Circle",
            description: "Share three favorite things in a circle time discussion with show-and-tell elements.",
            materials: ["Favorite items from home", "Circle time carpet"],
            icon: MessageCircle,
            slug: "favorite-things-circle",
            duration: "20 min",
          },
          {
            type: "Movement",
            title: "Name Dance Party",
            description: "Create movements for each letter of your name and perform for the class.",
            materials: ["Music player", "Space to move"],
            icon: Music,
            slug: "name-dance-party",
            duration: "15 min",
          },
        ],
      },
      {
        week: 2,
        title: "My Family",
        color: "bg-blue-100 text-blue-700 border-blue-200",
        badgeColor: "bg-blue-500",
        icon: Users,
        activities: [
          {
            type: "Craft",
            title: "Family Tree Collage",
            description: "Create a family tree using photos and drawings of family members.",
            materials: ["Family photos", "Construction paper", "Glue", "Scissors", "Markers"],
            icon: Scissors,
            slug: "family-tree-collage",
            duration: "30 min",
          },
          {
            type: "Storytelling",
            title: "Family Tradition Show & Tell",
            description: "Share a special family tradition or celebration with the class.",
            materials: ["Items representing traditions", "Photo props"],
            icon: Book,
            slug: "family-tradition-show-tell",
            duration: "25 min",
          },
          {
            type: "Photography",
            title: "Family Photo Scavenger Hunt",
            description: "Find and share photos that show different family activities and relationships.",
            materials: ["Family photos", "Magnifying glasses", "Display board"],
            icon: Camera,
            slug: "family-photo-scavenger-hunt",
            duration: "20 min",
          },
        ],
      },
      {
        week: 3,
        title: "My School",
        color: "bg-green-100 text-green-700 border-green-200",
        badgeColor: "bg-green-500",
        icon: School,
        activities: [
          {
            type: "Exploration",
            title: "School Helper Hunt",
            description: "Visit different areas of school to meet helpers and learn about their jobs.",
            materials: ["Clipboards", "Pencils", "Camera", "Thank you cards"],
            icon: MapPin,
            slug: "school-helper-hunt",
            duration: "35 min",
          },
          {
            type: "Art Activity",
            title: "Classroom Rules Poster",
            description: "Collaborate to create colorful posters showing classroom rules and expectations.",
            materials: ["Large paper", "Markers", "Stickers", "Magazines for cutting"],
            icon: Palette,
            slug: "classroom-rules-poster",
            duration: "30 min",
          },
          {
            type: "Role Play",
            title: "School Jobs Dramatic Play",
            description: "Act out different school jobs like teacher, librarian, principal, and custodian.",
            materials: ["Dress-up clothes", "Props for different jobs", "Name tags"],
            icon: Star,
            slug: "school-jobs-dramatic-play",
            duration: "25 min",
          },
        ],
      },
      {
        week: 4,
        title: "My Community",
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        badgeColor: "bg-yellow-500",
        icon: MapPin,
        activities: [
          {
            type: "Field Work",
            title: "Community Helper Interviews",
            description: "Interview community helpers and create a book about their important work.",
            materials: ["Recording device", "Questions list", "Paper for book", "Crayons"],
            icon: MessageCircle,
            slug: "community-helper-interviews",
            duration: "40 min",
          },
          {
            type: "Building",
            title: "Our Town Model",
            description: "Build a model of your community using blocks and recyclable materials.",
            materials: ["Blocks", "Cardboard boxes", "Tape", "Markers", "Small toys"],
            icon: School,
            slug: "our-town-model",
            duration: "35 min",
          },
          {
            type: "Movement",
            title: "Community Places Walk",
            description: "Take a walking tour to identify important places in your neighborhood.",
            materials: ["Clipboards", "Pencils", "Camera", "Safety vests"],
            icon: MapPin,
            slug: "community-places-walk",
            duration: "30 min",
          },
        ],
      },
      {
        week: 5,
        title: "Belonging Together",
        color: "bg-purple-100 text-purple-700 border-purple-200",
        badgeColor: "bg-purple-500",
        icon: Sparkles,
        activities: [
          {
            type: "Celebration",
            title: "Belonging Celebration Feast",
            description: "Share foods from different cultures and celebrate what makes each person special.",
            materials: ["Cultural foods", "Plates", "Napkins", "Decorations", "Music"],
            icon: Heart,
            slug: "belonging-celebration-feast",
            duration: "45 min",
          },
          {
            type: "Collaborative Art",
            title: "Unity Quilt Project",
            description: "Each child decorates a square that gets sewn together into a classroom unity quilt.",
            materials: ["Fabric squares", "Fabric markers", "Needle and thread", "Display area"],
            icon: Palette,
            slug: "unity-quilt-project",
            duration: "40 min",
          },
          {
            type: "Performance",
            title: "We Belong Together Song",
            description: "Learn and perform a song about friendship, kindness, and belonging.",
            materials: ["Song lyrics", "Simple instruments", "Microphone", "Audience seating"],
            icon: Music,
            slug: "we-belong-together-song",
            duration: "25 min",
          },
        ],
      },
    ],
  },
}

// Mock Breadcrumb component since it's not in the standard shadcn/ui
function Breadcrumb({ items }: { items: { label: string; href: string }[] }) {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <svg className="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <Link to={item.href} className="text-sm font-medium text-gray-700 hover:text-blue-600">
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default async function UnitActivitiesPage({ params }: { params: Promise<{ unitId: string }> }) {
  const { unitId } = await params
  const unit = unitData[unitId as keyof typeof unitData]

  if (!unit) {
    navigate("/404")
  }

  // Generate breadcrumb items based on unit ID
  const getBreadcrumbItems = (unitId: string) => {
    const unitTitles: { [key: string]: string } = {
      "belonging-unit": "Belonging Unit",
      "weather-unit": "Weather Unit",
      "celebrations-unit": "Celebrations Unit",
      "plants-and-animals-unit": "Plants and Animals Unit",
      "games-unit": "Games Unit",
    }
    
    return [
      { label: "Curriculum", href: "/curriculum" },
      { label: "Kindergarten", href: "/curriculum/kindergarten" },
      { label: unitTitles[unitId] || "Unit", href: `/curriculum/kindergarten/activities/${unitId}` },
    ]
  }

  // Get unit-specific styling and content
  const getUnitStyling = (unitId: string) => {
    switch (unitId) {
      case "belonging-unit":
        return {
          mainColor: "text-purple-700",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-100",
          badgeColors: ["bg-purple-100 text-purple-700", "bg-pink-100 text-pink-700", "bg-blue-100 text-blue-700", "bg-green-100 text-green-700", "bg-yellow-100 text-yellow-700"],
          description: "Engaging hands-on activities to help kindergarten students explore identity, family, school, and community through creative expression and meaningful connections.",
          highlights: [
            { title: "Identity & Self-Expression", items: ["Self-portrait activities", "Personal story sharing", "Individual preferences exploration", "Cultural background celebration"] },
            { title: "Family & Community Connections", items: ["Family tree projects", "Community helper interviews", "Local tradition sharing", "Neighborhood exploration"] }
          ]
        }
      case "games-unit":
        return {
          mainColor: "text-purple-700",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-100",
          badgeColors: ["bg-pink-100 text-pink-700", "bg-amber-100 text-amber-700", "bg-blue-100 text-blue-700", "bg-emerald-100 text-emerald-700", "bg-indigo-100 text-indigo-700"],
          description: "Hands-on activities exploring games and their role in our lives",
          highlights: [
            { title: "Caribbean Cultural Integration", items: ["Traditional Saint Lucian games", "Local nature references", "Elder wisdom through grandparent demonstrations", "Community-based game sharing"] },
            { title: "Kindergarten-Appropriate Features", items: ["15-35 minute activity durations", "Hands-on, movement-based learning", "Simple rules and clear instructions", "Social-emotional skill development"] }
          ]
        }
      default:
        return {
          mainColor: "text-blue-700",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-100",
          badgeColors: ["bg-blue-100 text-blue-700", "bg-green-100 text-green-700", "bg-yellow-100 text-yellow-700", "bg-purple-100 text-purple-700", "bg-pink-100 text-pink-700"],
          description: "Engaging activities for kindergarten students",
          highlights: [
            { title: "Learning Objectives", items: ["Age-appropriate activities", "Hands-on learning", "Social development", "Creative expression"] },
            { title: "Implementation Tips", items: ["Clear instructions", "Material preparation", "Group management", "Assessment strategies"] }
          ]
        }
    }
  }

  const unitStyling = getUnitStyling(unitId)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumb items={getBreadcrumbItems(unitId)} />
      
      <div className="mb-8">
        <h1 className={`text-4xl font-bold mb-2 ${unitStyling.mainColor}`}>{unit.title}</h1>
        <p className="text-gray-600 mb-4">{unitStyling.description}</p>
        <div className={`${unitStyling.bgColor} border ${unitStyling.borderColor} p-6 rounded-lg`}>
          <p className="mb-2">
            <strong>{unit.weeklyActivities.reduce((total, week) => total + week.activities.length, 0)} engaging activities</strong> across {unit.weeklyActivities.length} weeks that help kindergarten students explore different
            concepts through hands-on learning, creative expression, and meaningful connections.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className={`${unitStyling.badgeColors[0]}`}>Hands-on Learning</Badge>
            <Badge className={`${unitStyling.badgeColors[1]}`}>Creative Expression</Badge>
            <Badge className={`${unitStyling.badgeColors[2]}`}>Social Development</Badge>
            <Badge className={`${unitStyling.badgeColors[3]}`}>Cultural Connection</Badge>
          </div>
          
          {/* Lesson Plan Creation Button */}
          <div className="mt-6 text-center">
            <Link to="/kindergarten-planner"><Button>
                <BookOpen className="mr-2 h-5 w-5" />
                Create Lesson Plan for This Unit
              </Button></Link>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {unit.weeklyActivities.map((week, weekIndex) => (
          <div key={week.week} className="space-y-4">
            <div className={`p-4 rounded-lg border-2 ${week.color.split(" ")[2]}`}>
              <h2 className={`text-2xl font-bold mb-2 ${week.color.split(" ")[1]} flex items-center`}>
                <week.icon className="h-5 w-5 mr-2" />
                <span className="ml-2">
                  Week {week.week}: {week.title}
                </span>
              </h2>
              <p className="text-gray-600">{week.activities.length} activities focusing on {week.title.toLowerCase()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {week.activities.map((activity) => (
                <Card
                  key={activity.slug}
                  className={`border-2 ${week.color.split(" ")[2]} hover:shadow-md transition-shadow`}
                >
                  <CardHeader className={`${week.color.split(" ")[0]} py-3`}>
                    <CardTitle className="text-sm font-medium">{activity.title}</CardTitle>
                    <div className="text-xs text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.duration || "20-30 min"}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-3 space-y-3">
                    {/* Materials section */}
                    <div>
                      <div className="flex items-center mb-2">
                        <Package className="h-3 w-3 mr-1 text-gray-500" />
                        <span className="text-xs font-medium text-gray-600">Materials needed:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {activity.materials.map((material, index) => (
                          <Badge 
                            key={index}
                            variant="secondary" 
                            className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 hover:bg-gray-200"
                          >
                            {material}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action button */}
                    <Button
                      asChild
                      size="sm"
                      className={`w-full ${week.color.split(" ")[1].replace("text-", "bg-").replace("-700", "-600")} hover:${week.color.split(" ")[1].replace("text-", "bg-").replace("-700", "-700")}`}
                    >
                      <Link to={`/curriculum/kindergarten/activities/${unitId}/${week.week}/${activity.slug}`}>
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
          <Star className="mr-2 h-6 w-6" />
          Unit Highlights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {unitStyling.highlights.map((highlight, index) => (
            <div key={index}>
              <h4 className="font-semibold text-purple-600 mb-2">{highlight.title}</h4>
              <ul className="text-sm space-y-1">
                {highlight.items.map((item, itemIndex) => (
                  <li key={itemIndex}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" asChild>
          <Link to="/curriculum/kindergarten">Back to Kindergarten Overview</Link>
        </Button>
        <Button className="bg-purple-600 hover:bg-purple-700" asChild>
          <Link to={`/curriculum/kindergarten/activities/${unitId}/${unit.weeklyActivities[0].week}/${unit.weeklyActivities[0].activities[0].slug}`}>
            Start with Week 1 Activities
          </Link>
        </Button>
      </div>
    </div>
  )
}