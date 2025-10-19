import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/breadcrumb"
import { ArrowLeft, Clock, Users, Globe, DollarSign, BookOpen, Target, Lightbulb } from "lucide-react"
import { Link } from "react-router-dom"

export default function Grade5SocialStudiesActivitiesPage() {
  const activityStrands = [
    {
      id: "historical-cultural-thinking",
      title: "Historical and Cultural Thinking Activities",
      description:
        "Explore communication technology, media literacy, colonization impacts, and African heritage through interactive investigations",
      icon: Clock,
      color: "from-amber-500 to-orange-600",
      activities: [
        "Mix-Freeze-Pair Communication Technology Review",
        "Plus-Minus-Interesting Communication Analysis",
        "Interactive Digital Storytelling Presentations",
        "Historical Communication Scenario Analysis",
        "Media Scavenger Hunt and Definition Building",
        "Fact vs. Opinion Detective Work",
        "Media Misinformation Investigation",
        "European Settlement Mapping Investigation",
        "Impact Analysis Through Sorting and Role-Play",
        "Triangular Trade Route Investigation",
      ],
      learningOutcomes: [
        "Explain advantages and disadvantages of communication technology",
        "Demonstrate skills in determining facts and opinions in media",
        "Identify European settlement patterns in the Caribbean",
        "Map the route of the triangular slave trade",
        "Develop awareness of African cultural impact on Caribbean",
      ],
      image: "/placeholder.svg?height=200&width=300&text=Historical+Thinking",
    },
    {
      id: "spatial-thinking",
      title: "Spatial Thinking Activities",
      description:
        "Investigate Caribbean geography, island formations, landmarks, and climate through hands-on mapping and analysis",
      icon: Globe,
      color: "from-emerald-500 to-teal-600",
      activities: [
        "Interactive Island Classification System",
        "Volcanic vs. Coral Island Formation Investigation",
        "Caribbean Landmarks Discovery and Mapping",
        "Climate Analysis and Regional Cooperation",
      ],
      learningOutcomes: [
        "Describe various classifications of the Caribbean region",
        "Plot linguistic, political, and economic information on maps",
        "Explain geographic differences between coral and volcanic islands",
        "Identify popular landmarks and map their locations",
        "Describe climatic differences across the Caribbean",
      ],
      image: "/placeholder.svg?height=200&width=300&text=Spatial+Thinking",
    },
    {
      id: "civic-participation",
      title: "Civic Participation Activities",
      description:
        "Explore government systems, regional integration, and democratic participation through research and role-play",
      icon: Users,
      color: "from-blue-500 to-indigo-600",
      activities: ["Caribbean Government Systems Investigation", "Regional Integration and Caribbean Unity"],
      learningOutcomes: [
        "Identify various government systems in the region",
        "Compare structures of main government types",
        "State reasons for regional integration",
        "Research different areas of Caribbean integration",
        "Appreciate advantages and limitations of regional cooperation",
      ],
      image: "/placeholder.svg?height=200&width=300&text=Civic+Participation",
    },
    {
      id: "economic-decision-making",
      title: "Economic Decision Making Activities",
      description: "Investigate trade relationships, business networks, migration patterns, and economic cooperation",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
      activities: ["Caribbean Business and Trade Networks Investigation"],
      learningOutcomes: [
        "Identify major Caribbean companies and their services",
        "Investigate ownership levels of goods and services",
        "Appreciate importance of locally owned companies",
        "Understand trade relationships and economic cooperation",
      ],
      image: "/placeholder.svg?height=200&width=300&text=Economic+Decision+Making",
    },
  ]

  const assessmentStrategies = [
    {
      type: "Formative Assessments",
      methods: [
        "Observation Checklists: Monitor participation and skill development",
        "Conversation Records: Document verbal responses and discussions",
        "Exit Slips: Quick checks for understanding",
        "Peer Evaluations: Students assess each other's work",
      ],
    },
    {
      type: "Summative Assessments",
      methods: [
        "Portfolio Creation: Compile comprehensive work samples",
        "Presentation Projects: Formal presentations with rubrics",
        "Research Reports: In-depth investigation projects",
        "Creative Products: Songs, poems, artwork, models demonstrating learning",
      ],
    },
  ]

  const technologyIntegration = [
    "Digital Tools: Kahoot, Quizizz, Mentimeter, Flipgrid, Padlet",
    "Multimedia Presentations: Google Slides, PowerPoint, video creation",
    "Online Research: Guided internet investigation activities",
    "Virtual Experiences: Online tours, digital museums, video conferences",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Curriculum", href: "/curriculum" },
            { label: "Grade 5 Subjects", href: "/curriculum/grade5-subjects" },
            { label: "Social Studies Activities", href: "/curriculum/grade5-subjects/activities/social-studies" },
          ]}
        />

        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-8 text-white">
            <h1 className="text-4xl font-bold mb-4">Grade 5 Social Studies Activities</h1>
            <p className="text-xl text-blue-100 mb-6">
              Comprehensive, culturally relevant activities aligned with the Caribbean Grade 5 Social Studies curriculum
            </p>
            <div className="flex flex-wrap gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <BookOpen className="mr-1 h-4 w-4" />4 Activity Strands
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Target className="mr-1 h-4 w-4" />
                Multiple Learning Outcomes
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Lightbulb className="mr-1 h-4 w-4" />
                Interactive & Engaging
              </Badge>
            </div>
          </div>
        </div>

        {/* Activity Strands */}
        <div className="grid gap-8 mb-12">
          {activityStrands.map((strand) => {
            const IconComponent = strand.icon
            return (
              <Card key={strand.id} className="overflow-hidden">
                <CardHeader className={`bg-gradient-to-r ${strand.color} text-white`}>
                  <div className="flex items-center gap-4">
                    <IconComponent className="h-8 w-8" />
                    <div>
                      <CardTitle className="text-2xl">{strand.title}</CardTitle>
                      <CardDescription className="text-white/90">{strand.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-lg mb-3">Key Activities</h4>
                      <ul className="space-y-2">
                        {strand.activities.slice(0, 5).map((activity, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{activity}</span>
                          </li>
                        ))}
                        {strand.activities.length > 5 && (
                          <li className="text-sm text-gray-600 italic">
                            ...and {strand.activities.length - 5} more activities
                          </li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-3">Learning Outcomes</h4>
                      <ul className="space-y-2">
                        {strand.learningOutcomes.map((outcome, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link to={`/curriculum/grade5-subjects/activities/social-studies/${strand.id}`}>
                      <Button className="w-full">Explore {strand.title}</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Assessment Strategies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Assessment Strategies</CardTitle>
            <CardDescription>Comprehensive evaluation methods to measure student learning and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {assessmentStrategies.map((strategy, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-lg mb-3 text-blue-700">{strategy.type}</h4>
                  <ul className="space-y-2">
                    {strategy.methods.map((method, methodIndex) => (
                      <li key={methodIndex} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{method}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technology Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Technology Integration</CardTitle>
            <CardDescription>Digital tools and platforms to enhance learning experiences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {technologyIntegration.map((tech, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{tech}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
