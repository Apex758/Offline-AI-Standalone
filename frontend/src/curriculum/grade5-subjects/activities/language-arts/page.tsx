import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Headphones, Eye, PenTool, BookOpen, Users, Lightbulb } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade5LanguageArtsActivitiesPage() {
  const activityCategories = [
    {
      title: "Listening & Speaking Activities",
      description: "Advanced oral communication and critical discourse",
      icon: <Headphones className="h-6 w-6" />,
      color: "border-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      activities: [
        {
          name: "Communication Olympics",
          description: "Debate and discussion skills for effective communication",
          link: "/curriculum/grade5-subjects/activities/language-arts/communication-olympics",
          skills: ["Debate", "Critical Thinking", "Active Listening"],
        },
        {
          name: "Caribbean Culture Showcase",
          description: "Oral presentations celebrating local dialects and traditions",
          link: "/curriculum/grade5-subjects/activities/language-arts/caribbean-culture-showcase",
          skills: ["Cultural Appreciation", "Public Speaking", "Research"],
        },
        {
          name: "Interview with Local Artists",
          description: "Conducting interviews with Caribbean calypsonians and artists",
          link: "/curriculum/grade5-subjects/activities/language-arts/artist-interviews",
          skills: ["Interview Skills", "Questioning", "Note-taking"],
        },
        {
          name: "Persuasive Speaking Challenge",
          description: "Mini debates and speeches using persuasive techniques",
          link: "/curriculum/grade5-subjects/activities/language-arts/persuasive-speaking",
          skills: ["Persuasion", "Evidence", "Argumentation"],
        },
      ],
    },
    {
      title: "Reading & Viewing Activities",
      description: "Critical analysis and advanced comprehension",
      icon: <Eye className="h-6 w-6" />,
      color: "border-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      activities: [
        {
          name: "Multicultural Book Club",
          description: "Exploring Caribbean literature and global perspectives",
          link: "/curriculum/grade5-subjects/activities/language-arts/multicultural-book-club",
          skills: ["Cultural Analysis", "Comparison", "Critical Thinking"],
        },
        {
          name: "Digital Text Features Hunt",
          description: "Exploring text features in digital and print media",
          link: "/curriculum/grade5-subjects/activities/language-arts/text-features-hunt",
          skills: ["Digital Literacy", "Text Analysis", "Research"],
        },
        {
          name: "Author's Purpose Detective",
          description: "Analyzing author's purpose across different genres and media",
          link: "/curriculum/grade5-subjects/activities/language-arts/authors-purpose-detective",
          skills: ["Analysis", "Inference", "Critical Reading"],
        },
        {
          name: "Visual Thinking Routines",
          description: "See-Think-Wonder activities with various media",
          link: "/curriculum/grade5-subjects/activities/language-arts/visual-thinking-routines",
          skills: ["Visual Literacy", "Questioning", "Observation"],
        },
      ],
    },
    {
      title: "Writing & Representing Activities",
      description: "Sophisticated composition and digital publishing",
      icon: <PenTool className="h-6 w-6" />,
      color: "border-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      activities: [
        {
          name: "Digital Storytelling Studio",
          description: "Creating multimedia stories using various digital tools",
          link: "/curriculum/grade5-subjects/activities/language-arts/digital-storytelling-studio",
          skills: ["Digital Creation", "Multimedia", "Story Structure"],
        },
        {
          name: "Genre Writing Workshop",
          description: "Exploring narrative, expository, descriptive, and persuasive writing",
          link: "/curriculum/grade5-subjects/activities/language-arts/genre-writing-workshop",
          skills: ["Genre Knowledge", "Writing Process", "Revision"],
        },
        {
          name: "Publishing Celebration",
          description: "Author celebration and portfolio showcase",
          link: "/curriculum/grade5-subjects/activities/language-arts/publishing-celebration",
          skills: ["Presentation", "Reflection", "Publication"],
        },
        {
          name: "Research & Report Writing",
          description: "Short research projects building knowledge about topics",
          link: "/curriculum/grade5-subjects/activities/language-arts/research-report-writing",
          skills: ["Research", "Information Synthesis", "Academic Writing"],
        },
      ],
    },
    {
      title: "Critical Thinking Activities",
      description: "Analysis, synthesis, and evaluation skills",
      icon: <Lightbulb className="h-6 w-6" />,
      color: "border-amber-500",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      activities: [
        {
          name: "Question-Answer Relationships",
          description: "Developing explicit and implicit comprehension skills",
          link: "/curriculum/grade5-subjects/activities/language-arts/question-answer-relationships",
          skills: ["Comprehension", "Text Analysis", "Questioning"],
        },
        {
          name: "Media Literacy Detective",
          description: "Analyzing messages in social media and advertisements",
          link: "/curriculum/grade5-subjects/activities/language-arts/media-literacy-detective",
          skills: ["Media Analysis", "Critical Thinking", "Digital Citizenship"],
        },
        {
          name: "Point of View Analysis",
          description: "Exploring different perspectives and narrator voices",
          link: "/curriculum/grade5-subjects/activities/language-arts/point-of-view-analysis",
          skills: ["Perspective", "Analysis", "Comparison"],
        },
        {
          name: "Figurative Language Exploration",
          description: "Creating and analyzing similes, metaphors, and other devices",
          link: "/curriculum/grade5-subjects/activities/language-arts/figurative-language-exploration",
          skills: ["Literary Devices", "Creative Expression", "Analysis"],
        },
      ],
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 5 Subjects", href: "/curriculum/grade5-subjects" },
          { label: "Language Arts", href: "/curriculum/grade5-subjects/language-arts" },
          { label: "Activities", href: "/curriculum/grade5-subjects/activities/language-arts" },
        ]}
      />

      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Grade 5 Language Arts Activities
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Explore sophisticated language arts activities designed to develop advanced communication skills, critical
            thinking, and cultural appreciation. These activities integrate listening, speaking, reading, viewing,
            writing, and representing through meaningful, authentic learning experiences.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {activityCategories.map((category, categoryIndex) => (
          <div
            key={categoryIndex}
            className={`border-l-4 ${category.color} ${category.bgColor} p-6 rounded-r-xl shadow-md`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg bg-white ${category.textColor}`}>{category.icon}</div>
              <div>
                <h2 className={`text-2xl font-bold ${category.textColor}`}>{category.title}</h2>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {category.activities.map((activity, activityIndex) => (
                <Card key={activityIndex} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{activity.name}</CardTitle>
                    <CardDescription>{activity.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {activity.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <Link to={activity.link}>
                      <Button className="w-full" size="sm">
                        Start Activity <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <Users className="h-6 w-6" />
          Implementation Guide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-purple-700">Essential Learning Outcomes Focus</h3>
            <ul className="text-gray-700 space-y-1 text-sm">
              <li>• ELO 1: Listening and Speaking for critical discourse</li>
              <li>• ELO 2: Independent reading with diverse texts</li>
              <li>• ELO 3: Comprehensive reading instruction</li>
              <li>• ELO 4: Understanding author's craft</li>
              <li>• ELO 5-7: Complete writing process mastery</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-blue-700">Assessment Integration</h3>
            <ul className="text-gray-700 space-y-1 text-sm">
              <li>• Conversations: Interviews, discussions, conferences</li>
              <li>• Observations: Running records, anecdotal notes</li>
              <li>• Products: Portfolios, presentations, publications</li>
              <li>• Self/Peer Assessment: Reflection and feedback</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">
          Ready to explore individual language arts activities? Choose an activity above to begin your sophisticated
          language learning journey!
        </p>
        <Link to="/curriculum/grade5-subjects">
          <Button variant="outline" size="lg">
            <BookOpen className="mr-2 h-5 w-5" />
            Explore All Grade 5 Subjects
          </Button>
        </Link>
      </div>
    </div>
  )
}
