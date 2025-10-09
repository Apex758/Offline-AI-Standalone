import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Mic, Eye, PenTool, Users, Clock, Target, Star } from "lucide-react"
import Link from "next/link"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade6LanguageArtsActivitiesPage() {
  const activityStrands = [
    {
      id: "listening-speaking",
      title: "Listening & Speaking Activities",
      icon: Mic,
      description: "Interactive oral communication activities that build confidence and critical thinking",
      color: "bg-blue-500",
      activities: [
        "Caribbean Culture Podcast Studio",
        "Parliamentary Debate Championship",
        "Storytelling Circle with Digital Recording",
        "News Anchor Challenge",
        "Poetry Slam & Spoken Word",
        "Interview the Expert",
      ],
      skills: [
        "Critical listening",
        "Public speaking",
        "Questioning techniques",
        "Voice modulation",
        "Audience awareness",
      ],
    },
    {
      id: "reading-viewing",
      title: "Reading & Viewing Activities",
      icon: Eye,
      description: "Engaging activities that develop critical reading and visual literacy skills",
      color: "bg-green-500",
      activities: [
        "Digital Detective: Fact vs Fiction",
        "Caribbean Literature Circle",
        "Multimedia Text Exploration",
        "Author Study Investigation",
        "Genre Transformation Workshop",
        "Visual Literacy Gallery Walk",
      ],
      skills: [
        "Critical analysis",
        "Comprehension strategies",
        "Media literacy",
        "Cultural awareness",
        "Text connections",
      ],
    },
    {
      id: "writing-representing",
      title: "Writing & Representing Activities",
      icon: PenTool,
      description: "Creative and analytical writing activities across multiple genres and purposes",
      color: "bg-purple-500",
      activities: [
        "Caribbean Magazine Creation",
        "Persuasive Campaign Design",
        "Digital Storytelling Studio",
        "Research Report Publishing",
        "Creative Writing Workshop",
        "Multimedia Presentation Lab",
      ],
      skills: ["Process writing", "Genre awareness", "Digital literacy", "Research skills", "Creative expression"],
    },
    {
      id: "integrated-projects",
      title: "Integrated Strand Projects",
      icon: Users,
      description: "Cross-curricular projects that braid all language arts strands together",
      color: "bg-orange-500",
      activities: [
        "Climate Change Action Campaign",
        "Caribbean Heritage Festival",
        "Community Problem Solvers",
        "Historical Documentary Project",
        "Science Fair Communication",
        "Cultural Exchange Program",
      ],
      skills: ["Collaboration", "Critical thinking", "Problem solving", "Cultural appreciation", "Communication"],
    },
  ]

  const featuredActivities = [
    {
      title: "Caribbean Culture Podcast Studio",
      description:
        "Students create professional podcasts exploring Caribbean traditions, interviewing community members, and sharing cultural stories.",
      strands: ["Listening & Speaking", "Reading & Viewing"],
      duration: "3-4 weeks",
      difficulty: "Intermediate",
    },
    {
      title: "Digital Detective: Fact vs Fiction",
      description:
        "Students analyze online content, identify misinformation, and create guides for digital literacy in their community.",
      strands: ["Reading & Viewing", "Writing & Representing"],
      duration: "2-3 weeks",
      difficulty: "Advanced",
    },
    {
      title: "Climate Change Action Campaign",
      description:
        "Integrated project where students research, debate, write, and present solutions for climate challenges in the Caribbean.",
      strands: ["All Strands", "Science Integration"],
      duration: "4-6 weeks",
      difficulty: "Advanced",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Curriculum", href: "/curriculum" },
            { label: "Grade 6 Subjects", href: "/curriculum/grade6-subjects" },
            { label: "Language Arts", href: "/curriculum/grade6-subjects/language-arts" },
            { label: "Activities", href: "/curriculum/grade6-subjects/activities/language-arts" },
          ]}
        />

        {/* Header Section */}
        <div className="text-center my-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Grade 6 Language Arts Activities</h1>
              <p className="text-xl text-gray-600">Comprehensive Activities Across All Strands</p>
            </div>
          </div>

          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Engaging, culturally responsive activities that develop advanced literacy skills through authentic,
            real-world applications. These activities braid multiple strands and integrate with other subjects to create
            meaningful learning experiences.
          </p>
        </div>

        {/* Featured Activities */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredActivities.map((activity, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">{activity.title}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    {activity.strands.map((strand, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {strand}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{activity.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {activity.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {activity.difficulty}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Activity Strands */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {activityStrands.map((strand) => {
            const IconComponent = strand.icon
            return (
              <Card key={strand.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${strand.color} rounded-xl flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{strand.title}</CardTitle>
                      <CardDescription className="text-base">{strand.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Featured Activities */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Activities</h4>
                    <ul className="space-y-2">
                      {strand.activities.map((activity, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Skills Developed */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Skills Developed</h4>
                    <div className="flex flex-wrap gap-2">
                      {strand.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4">
                    <Button asChild className="w-full">
                      <Link href={`/curriculum/grade6-subjects/activities/language-arts/${strand.id}`}>
                        Explore Activities
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Assessment & Standards */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Assessment & Standards Alignment</CardTitle>
            <CardDescription>How these activities align with OECS curriculum standards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Formative Assessment</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Peer feedback sessions</li>
                  <li>• Self-reflection journals</li>
                  <li>• Digital portfolios</li>
                  <li>• Observation checklists</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Summative Assessment</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Project presentations</li>
                  <li>• Published writing pieces</li>
                  <li>• Performance rubrics</li>
                  <li>• Portfolio conferences</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Standards Alignment</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• OECS Language Arts ELOs</li>
                  <li>• Caribbean cultural standards</li>
                  <li>• Digital literacy frameworks</li>
                  <li>• Critical thinking benchmarks</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teacher Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Teacher Resources & Support</CardTitle>
            <CardDescription>Materials and guidance for implementing these activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Planning Resources</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Detailed lesson plans</li>
                  <li>• Assessment rubrics</li>
                  <li>• Differentiation strategies</li>
                  <li>• Technology integration guides</li>
                  <li>• Cultural context materials</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Professional Development</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Activity implementation workshops</li>
                  <li>• Assessment training sessions</li>
                  <li>• Technology skills development</li>
                  <li>• Collaborative planning time</li>
                  <li>• Peer observation opportunities</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
