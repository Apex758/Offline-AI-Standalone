import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Search, BookOpen, Monitor, Users, Clock, Target, Lightbulb } from "lucide-react"
import Link from "next/link"
import { Breadcrumb } from "@/components/breadcrumb"

export default function ReadingViewingActivitiesPage() {
  const activities = [
    {
      id: "digital-detective",
      title: "Digital Detective: Fact vs Fiction",
      description:
        "Students analyze online content, identify misinformation, and create guides for digital literacy in their community.",
      duration: "2-3 weeks",
      difficulty: "Advanced",
      participants: "Groups of 3-4",
      icon: Search,
      objectives: [
        "Develop critical evaluation skills for digital media",
        "Identify reliable vs unreliable sources",
        "Recognize bias and propaganda techniques",
        "Create digital literacy resources for others",
        "Practice research and verification strategies",
      ],
      materials: [
        "Computers/tablets with internet access",
        "Fact-checking websites and tools",
        "Sample articles (reliable and unreliable)",
        "Digital creation tools (Canva, Google Sites)",
        "Evaluation rubrics and checklists",
      ],
      procedures: [
        "Learn about information literacy and source evaluation",
        "Practice identifying reliable vs unreliable sources",
        "Analyze sample articles for bias and misinformation",
        "Research fact-checking techniques and tools",
        "Create digital literacy guides for younger students",
        "Test guides with target audience for feedback",
        "Present findings to school community",
      ],
      assessment: [
        "Source evaluation accuracy",
        "Critical thinking demonstrated in analysis",
        "Quality of digital literacy guides created",
        "Collaboration and research skills",
        "Presentation effectiveness",
      ],
      extensions: [
        "Partner with local media organizations",
        "Create school-wide digital literacy campaign",
        "Develop fact-checking protocols for school",
        "Interview journalists about verification",
      ],
    },
    {
      id: "caribbean-literature-circle",
      title: "Caribbean Literature Circle",
      description:
        "Students engage in deep discussions about Caribbean literature, exploring themes of identity, culture, and social justice.",
      duration: "4-6 weeks",
      difficulty: "Intermediate to Advanced",
      participants: "Groups of 5-6",
      icon: BookOpen,
      objectives: [
        "Explore Caribbean literary traditions and themes",
        "Develop analytical reading and discussion skills",
        "Make connections between literature and life",
        "Practice collaborative learning strategies",
        "Build cultural knowledge and appreciation",
      ],
      materials: [
        "Caribbean literature selections (novels, short stories, poetry)",
        "Literature circle role sheets",
        "Discussion guides and question prompts",
        "Cultural context resources",
        "Reading journals and response materials",
      ],
      procedures: [
        "Select diverse Caribbean literature for each circle",
        "Assign rotating roles (Discussion Director, Connector, etc.)",
        "Read assigned sections and prepare role responsibilities",
        "Conduct weekly literature circle discussions",
        "Complete individual reading responses and reflections",
        "Research cultural and historical contexts",
        "Present book recommendations to other circles",
      ],
      assessment: [
        "Quality of role preparation and participation",
        "Depth of literary analysis and discussion",
        "Cultural connections and understanding",
        "Reading comprehension and response quality",
        "Collaboration and leadership skills",
      ],
      extensions: [
        "Author study projects on Caribbean writers",
        "Creative responses through art or drama",
        "Connect with Caribbean authors virtually",
        "Create book recommendation videos",
      ],
    },
    {
      id: "multimedia-text-exploration",
      title: "Multimedia Text Exploration Station",
      description:
        "Students rotate through stations exploring different text types and media formats to develop comprehensive literacy skills.",
      duration: "2-3 weeks",
      difficulty: "Intermediate",
      participants: "Small groups rotating",
      icon: Monitor,
      objectives: [
        "Experience diverse text types and formats",
        "Develop multimodal literacy skills",
        "Practice different reading strategies",
        "Compare how meaning is created across media",
        "Build flexibility in text approach",
      ],
      materials: [
        "Various text types (print, digital, visual, audio)",
        "Tablets/computers for digital texts",
        "Graphic organizers for each station",
        "Audio equipment for listening stations",
        "Response journals and reflection prompts",
      ],
      procedures: [
        "Set up stations with different text types and media",
        "Introduce specific strategies for each station type",
        "Rotate groups through stations with focused tasks",
        "Complete graphic organizers and responses at each station",
        "Compare experiences and strategies across stations",
        "Reflect on how different media affect comprehension",
        "Share insights and preferences with class",
      ],
      assessment: [
        "Completion and quality of station tasks",
        "Strategy application across different media",
        "Comparative analysis of text types",
        "Reflection depth and insight",
        "Adaptation to different formats",
      ],
      extensions: [
        "Create multimedia texts combining formats",
        "Develop station activities for other classes",
        "Research how different cultures use media",
        "Design accessibility features for texts",
      ],
    },
    {
      id: "author-study-investigation",
      title: "Caribbean Author Study Investigation",
      description:
        "Students conduct in-depth research on Caribbean authors, analyzing their works, themes, and cultural contributions.",
      duration: "3-4 weeks",
      difficulty: "Intermediate to Advanced",
      participants: "Individual or pairs",
      icon: Lightbulb,
      objectives: [
        "Research and analyze author's life and works",
        "Identify recurring themes and literary techniques",
        "Understand cultural and historical contexts",
        "Make connections between author's life and writing",
        "Present findings through creative formats",
      ],
      materials: [
        "Caribbean author biographies and works",
        "Research databases and online resources",
        "Interview templates for author research",
        "Presentation tools and materials",
        "Timeline and graphic organizer templates",
      ],
      procedures: [
        "Select Caribbean author for in-depth study",
        "Research author's biography and cultural background",
        "Read multiple works by the chosen author",
        "Analyze themes, style, and literary techniques",
        "Create timeline of author's life and major works",
        "Develop creative presentation of findings",
        "Share author studies with class and school",
      ],
      assessment: [
        "Research depth and accuracy",
        "Literary analysis quality and insight",
        "Cultural context understanding",
        "Creative presentation effectiveness",
        "Connection-making between life and works",
      ],
      extensions: [
        "Contact living authors for interviews",
        "Create author appreciation events",
        "Develop reading guides for other students",
        "Write in the style of studied authors",
      ],
    },
    {
      id: "genre-transformation",
      title: "Genre Transformation Workshop",
      description:
        "Students analyze how the same story or information changes when presented in different genres and formats.",
      duration: "2-3 weeks",
      difficulty: "Intermediate",
      participants: "Groups of 4-5",
      icon: Users,
      objectives: [
        "Understand how genre affects meaning and purpose",
        "Analyze author's choices in different formats",
        "Compare effectiveness of different genres",
        "Practice adapting content for different audiences",
        "Develop genre awareness and flexibility",
      ],
      materials: [
        "Same story/topic in multiple genres",
        "Genre characteristic charts",
        "Comparison graphic organizers",
        "Creation tools for different formats",
        "Audience analysis templates",
      ],
      procedures: [
        "Examine same content presented in different genres",
        "Analyze how genre affects presentation and meaning",
        "Identify target audience for each genre version",
        "Compare effectiveness for different purposes",
        "Choose content to transform into new genre",
        "Create transformed version with justification",
        "Present transformations and analysis to class",
      ],
      assessment: [
        "Genre analysis accuracy and depth",
        "Understanding of audience and purpose",
        "Quality of genre transformation",
        "Justification of creative choices",
        "Comparative analysis skills",
      ],
      extensions: [
        "Create genre transformation guides",
        "Analyze how news is presented differently",
        "Transform historical events into various genres",
        "Study how social media changes communication",
      ],
    },
    {
      id: "visual-literacy-gallery",
      title: "Visual Literacy Gallery Walk",
      description:
        "Students analyze visual texts, advertisements, and media to develop critical viewing skills and visual literacy.",
      duration: "1-2 weeks",
      difficulty: "Beginner to Intermediate",
      participants: "Individual and small groups",
      icon: Eye,
      objectives: [
        "Develop visual analysis and interpretation skills",
        "Recognize persuasive techniques in visual media",
        "Understand how images convey meaning",
        "Practice critical viewing of advertisements",
        "Create visual texts with intentional messages",
      ],
      materials: [
        "Collection of visual texts and advertisements",
        "Visual analysis frameworks and guides",
        "Magnifying tools for detail examination",
        "Response sheets and reflection prompts",
        "Creation materials for visual responses",
      ],
      procedures: [
        "Set up gallery with diverse visual texts",
        "Introduce visual analysis techniques and vocabulary",
        "Rotate through gallery analyzing different visuals",
        "Complete analysis sheets for each visual text",
        "Discuss findings and interpretations in groups",
        "Create original visual text with intentional message",
        "Present visual creations with analysis explanation",
      ],
      assessment: [
        "Visual analysis depth and accuracy",
        "Use of appropriate vocabulary",
        "Critical thinking about visual messages",
        "Quality of original visual creation",
        "Explanation of creative choices",
      ],
      extensions: [
        "Analyze visual texts from different cultures",
        "Create visual literacy guides for others",
        "Study historical changes in visual communication",
        "Develop media literacy presentations",
      ],
    },
  ]

  const readingStrategies = [
    {
      strategy: "Before Reading",
      techniques: [
        "Preview text features and structure",
        "Activate prior knowledge",
        "Set reading purpose and goals",
        "Make predictions about content",
        "Identify text type and genre",
      ],
    },
    {
      strategy: "During Reading",
      techniques: [
        "Monitor comprehension actively",
        "Make connections (text-to-self, text-to-text, text-to-world)",
        "Visualize and create mental images",
        "Question and clarify understanding",
        "Summarize key points regularly",
      ],
    },
    {
      strategy: "After Reading",
      techniques: [
        "Synthesize and evaluate information",
        "Reflect on reading experience",
        "Make judgments about text quality",
        "Connect to broader themes and issues",
        "Plan follow-up actions or research",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Curriculum", href: "/curriculum" },
            { label: "Grade 6 Subjects", href: "/curriculum/grade6-subjects" },
            { label: "Language Arts", href: "/curriculum/grade6-subjects/language-arts" },
            { label: "Activities", href: "/curriculum/grade6-subjects/activities/language-arts" },
            {
              label: "Reading & Viewing",
              href: "/curriculum/grade6-subjects/activities/language-arts/reading-viewing",
            },
          ]}
        />

        {/* Header */}
        <div className="text-center my-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Reading & Viewing Activities</h1>
              <p className="text-xl text-gray-600">Grade 6 Critical Literacy Development</p>
            </div>
          </div>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Comprehensive activities that develop critical readers and viewers through diverse texts, multimedia
            experiences, and analytical thinking in Caribbean contexts.
          </p>
        </div>

        {/* Reading Strategies Overview */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Essential Reading Strategies for Grade 6</CardTitle>
            <CardDescription>Strategic approaches students will practice across all activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {readingStrategies.map((phase, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-900 mb-3">{phase.strategy}</h3>
                  <ul className="space-y-2">
                    {phase.techniques.map((technique, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        {technique}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activities Grid */}
        <div className="space-y-8">
          {activities.map((activity) => {
            const IconComponent = activity.icon
            return (
              <Card key={activity.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
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
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
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
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
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
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full min-w-[24px] text-center">
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
                        href={`/curriculum/grade6-subjects/activities/language-arts/reading-viewing/${activity.id}`}
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
            <CardTitle>Teaching Tips for Reading & Viewing Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Building Critical Readers</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Model thinking aloud during text analysis</li>
                  <li>• Encourage questioning at all levels</li>
                  <li>• Provide diverse text types and perspectives</li>
                  <li>• Connect reading to students' lives and interests</li>
                  <li>• Celebrate different interpretations and insights</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Supporting Diverse Learners</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Offer texts at multiple reading levels</li>
                  <li>• Use multimedia and visual supports</li>
                  <li>• Provide choice in response formats</li>
                  <li>• Include culturally relevant texts</li>
                  <li>• Allow collaborative reading opportunities</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
