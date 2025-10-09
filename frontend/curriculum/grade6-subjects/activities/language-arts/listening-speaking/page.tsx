import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mic, Users, Clock, Target, Video, Headphones, MessageCircle } from "lucide-react"
import Link from "next/link"
import { Breadcrumb } from "@/components/breadcrumb"

export default function ListeningSpeakingActivitiesPage() {
  const activities = [
    {
      id: "caribbean-podcast-studio",
      title: "Caribbean Culture Podcast Studio",
      description:
        "Students create professional podcasts exploring Caribbean traditions, interviewing community members, and sharing cultural stories.",
      duration: "3-4 weeks",
      difficulty: "Intermediate",
      participants: "Groups of 3-4",
      icon: Headphones,
      objectives: [
        "Develop interviewing and questioning skills",
        "Practice clear articulation and voice modulation",
        "Learn audio editing and production basics",
        "Explore Caribbean cultural heritage",
        "Build confidence in public speaking",
      ],
      materials: [
        "Recording devices or smartphones",
        "Audio editing software (Audacity, GarageBand)",
        "Interview planning templates",
        "Cultural research resources",
        "Presentation equipment",
      ],
      procedures: [
        "Research Caribbean cultural topics and identify interview subjects",
        "Develop interview questions using various questioning techniques",
        "Conduct practice interviews with peers for feedback",
        "Record interviews with community members or experts",
        "Edit audio content and add intro/outro music",
        "Create podcast cover art and episode descriptions",
        "Present podcasts to class and school community",
      ],
      assessment: [
        "Interview question quality and depth",
        "Speaking clarity and engagement",
        "Technical production skills",
        "Cultural knowledge demonstrated",
        "Collaboration and time management",
      ],
      extensions: [
        "Submit to local radio stations",
        "Create podcast series throughout the year",
        "Interview students from other Caribbean islands",
        "Develop transcripts for accessibility",
      ],
    },
    {
      id: "parliamentary-debate",
      title: "Parliamentary Debate Championship",
      description:
        "Students engage in formal debates on current Caribbean issues, developing argumentation and critical listening skills.",
      duration: "4-5 weeks",
      difficulty: "Advanced",
      participants: "Teams of 4-6",
      icon: MessageCircle,
      objectives: [
        "Master formal debate structure and procedures",
        "Develop logical argumentation skills",
        "Practice active and critical listening",
        "Research current Caribbean issues",
        "Build confidence in public speaking",
      ],
      materials: [
        "Debate topic cards",
        "Research materials and databases",
        "Timer for debate segments",
        "Evaluation rubrics",
        "Parliamentary procedure guides",
      ],
      procedures: [
        "Learn parliamentary debate format and rules",
        "Research assigned topics related to Caribbean issues",
        "Practice constructing logical arguments with evidence",
        "Conduct preliminary debates within class",
        "Participate in inter-class championship rounds",
        "Serve as judges for other teams' debates",
        "Reflect on debate performance and learning",
      ],
      assessment: [
        "Argument construction and evidence use",
        "Rebuttal skills and critical thinking",
        "Speaking delivery and confidence",
        "Listening and response quality",
        "Research depth and accuracy",
      ],
      extensions: [
        "Participate in regional debate competitions",
        "Debate with students from other schools",
        "Create video recordings for analysis",
        "Develop position papers on debate topics",
      ],
    },
    {
      id: "storytelling-circle",
      title: "Digital Storytelling Circle",
      description:
        "Students share personal and cultural stories using traditional oral techniques enhanced with digital recording and sharing.",
      duration: "2-3 weeks",
      difficulty: "Beginner to Intermediate",
      participants: "Whole class",
      icon: Users,
      objectives: [
        "Preserve and share cultural stories",
        "Develop narrative speaking skills",
        "Practice active listening and response",
        "Use voice modulation and expression",
        "Build classroom community",
      ],
      materials: [
        "Recording devices",
        "Story planning templates",
        "Cultural story collections",
        "Props and visual aids",
        "Sharing platform (class blog/website)",
      ],
      procedures: [
        "Collect family and cultural stories from community",
        "Practice storytelling techniques (voice, gesture, pacing)",
        "Share stories in small circles for feedback",
        "Record polished versions of stories",
        "Create digital story collections with images",
        "Host storytelling festival for school community",
        "Reflect on cultural learning and connections",
      ],
      assessment: [
        "Story structure and narrative flow",
        "Voice expression and engagement",
        "Cultural authenticity and respect",
        "Listening skills during others' stories",
        "Digital presentation quality",
      ],
      extensions: [
        "Create illustrated story books",
        "Share with elderly community members",
        "Translate stories into multiple languages",
        "Develop story-based drama performances",
      ],
    },
    {
      id: "news-anchor-challenge",
      title: "Caribbean News Anchor Challenge",
      description:
        "Students research, write, and present news broadcasts focusing on Caribbean current events and issues.",
      duration: "3 weeks",
      difficulty: "Intermediate",
      participants: "Groups of 4-5",
      icon: Video,
      objectives: [
        "Develop news writing and presentation skills",
        "Practice clear, professional speaking",
        "Learn about current Caribbean events",
        "Understand media literacy and bias",
        "Build confidence in formal presentation",
      ],
      materials: [
        "News sources and databases",
        "Video recording equipment",
        "News script templates",
        "Teleprompter apps",
        "Green screen or backdrop",
      ],
      procedures: [
        "Research current events in Caribbean region",
        "Write news scripts using proper format",
        "Practice news anchor delivery techniques",
        "Record news segments with proper pacing",
        "Edit videos with graphics and transitions",
        "Present live news broadcasts to class",
        "Analyze and critique news presentation styles",
      ],
      assessment: [
        "News writing accuracy and clarity",
        "Professional speaking delivery",
        "Research quality and current events knowledge",
        "Technical production skills",
        "Critical analysis of media",
      ],
      extensions: [
        "Create weekly news show for school",
        "Interview local news professionals",
        "Analyze bias in different news sources",
        "Develop investigative reporting skills",
      ],
    },
    {
      id: "poetry-slam",
      title: "Caribbean Poetry Slam & Spoken Word",
      description:
        "Students write and perform original poetry celebrating Caribbean culture, identity, and contemporary issues.",
      duration: "3-4 weeks",
      difficulty: "Intermediate",
      participants: "Individual and small groups",
      icon: Mic,
      objectives: [
        "Explore Caribbean poetic traditions",
        "Develop creative writing and performance skills",
        "Practice expressive speaking and voice control",
        "Build confidence in artistic expression",
        "Connect with cultural identity",
      ],
      materials: [
        "Caribbean poetry collections",
        "Writing journals and materials",
        "Recording equipment",
        "Performance space setup",
        "Evaluation rubrics",
      ],
      procedures: [
        "Study Caribbean poets and spoken word artists",
        "Explore themes of identity, culture, and social issues",
        "Write original poems using various forms",
        "Practice performance techniques (rhythm, emphasis)",
        "Participate in class poetry slams",
        "Record performances for digital portfolio",
        "Organize school-wide poetry celebration",
      ],
      assessment: [
        "Creative writing quality and originality",
        "Performance delivery and expression",
        "Cultural themes and authenticity",
        "Audience engagement and response",
        "Reflection on artistic growth",
      ],
      extensions: [
        "Participate in community poetry events",
        "Create poetry chapbooks",
        "Collaborate with local artists",
        "Develop multimedia poetry presentations",
      ],
    },
    {
      id: "interview-expert",
      title: "Interview the Expert",
      description:
        "Students conduct formal interviews with community experts, professionals, and elders to gather knowledge and stories.",
      duration: "2-3 weeks",
      difficulty: "Intermediate",
      participants: "Pairs or small groups",
      icon: Users,
      objectives: [
        "Develop professional interviewing skills",
        "Practice question formulation techniques",
        "Learn from community knowledge holders",
        "Build intergenerational connections",
        "Develop active listening skills",
      ],
      materials: [
        "Interview planning templates",
        "Recording devices",
        "Contact lists of community experts",
        "Thank you note templates",
        "Presentation materials",
      ],
      procedures: [
        "Identify community experts in various fields",
        "Research background information on interviewees",
        "Develop thoughtful interview questions",
        "Practice interview techniques with peers",
        "Conduct formal interviews with experts",
        "Transcribe and analyze interview content",
        "Share learning with class through presentations",
      ],
      assessment: [
        "Interview preparation and research quality",
        "Question development and variety",
        "Professional conduct during interviews",
        "Active listening and follow-up skills",
        "Knowledge sharing and presentation",
      ],
      extensions: [
        "Create community knowledge database",
        "Develop mentorship relationships",
        "Organize expert speaker series",
        "Create documentary-style presentations",
      ],
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
            {
              label: "Listening & Speaking",
              href: "/curriculum/grade6-subjects/activities/language-arts/listening-speaking",
            },
          ]}
        />

        {/* Header */}
        <div className="text-center my-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Listening & Speaking Activities</h1>
              <p className="text-xl text-gray-600">Grade 6 Oral Communication Excellence</p>
            </div>
          </div>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Engaging activities that develop confident speakers, critical listeners, and effective communicators through
            authentic Caribbean contexts and real-world applications.
          </p>
        </div>

        {/* Activities Grid */}
        <div className="space-y-8">
          {activities.map((activity) => {
            const IconComponent = activity.icon
            return (
              <Card key={activity.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{activity.title}</CardTitle>
                        <CardDescription className="text-base mt-2">{activity.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-right">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.duration}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Target className="w-3 h-3 mr-1" />
                        {activity.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Users className="w-3 h-3 mr-1" />
                        {activity.participants}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Objectives */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Learning Objectives</h4>
                      <ul className="space-y-1">
                        {activity.objectives.map((objective, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Materials */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Materials Needed</h4>
                      <ul className="space-y-1">
                        {activity.materials.map((material, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            {material}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Procedures */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Activity Procedures</h4>
                    <ol className="space-y-2">
                      {activity.procedures.map((step, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-3">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full min-w-[24px] text-center">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Assessment */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Assessment Criteria</h4>
                      <ul className="space-y-1">
                        {activity.assessment.map((criteria, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                            {criteria}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Extensions */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Extension Activities</h4>
                      <ul className="space-y-1">
                        {activity.extensions.map((extension, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            {extension}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button asChild>
                      <Link
                        href={`/curriculum/grade6-subjects/activities/language-arts/listening-speaking/${activity.id}`}
                      >
                        View Detailed Lesson Plan
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Teaching Tips */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Teaching Tips for Listening & Speaking Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Creating Safe Speaking Environments</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Establish clear ground rules for respectful listening</li>
                  <li>• Use warm-up activities to build confidence</li>
                  <li>• Provide sentence starters for reluctant speakers</li>
                  <li>• Celebrate effort as much as achievement</li>
                  <li>• Allow processing time before responses</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Supporting Diverse Learners</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Honor home languages and dialects</li>
                  <li>• Provide visual supports and graphic organizers</li>
                  <li>• Offer choice in presentation formats</li>
                  <li>• Use peer partnerships for support</li>
                  <li>• Scaffold complex speaking tasks</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
