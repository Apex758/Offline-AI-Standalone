import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Calculator, FlaskRoundIcon as Flask, BookText, Users, Target, Clock, Award } from "lucide-react"
import Link from "next/link"

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
            <Link href={item.href} className="text-sm font-medium text-gray-700 hover:text-blue-600">
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default function Grade1SubjectsPage() {
  const subjects = [
    {
      id: "language-arts",
      title: "Language Arts",
      icon: BookText,
      description:
        "Foundational literacy development through interactive storytelling, phonics, and creative expression",
      color: "bg-blue-500",
      strands: ["Listening & Speaking", "Beginning Reading", "Early Writing", "Phonics & Word Study"],
      keyFocus: [
        "Letter recognition and phonics sounds",
        "Simple sentence formation and writing",
        "Interactive storytelling and listening",
        "Basic vocabulary building",
        "Beginning reading comprehension",
      ],
      learningOutcomes: [
        "Recognize and name all letters of the alphabet",
        "Write simple sentences using basic sight words",
        "Listen to stories and respond to simple questions",
        "Use phonics to decode simple words",
      ],
    },
    {
      id: "mathematics",
      title: "Mathematics",
      icon: Calculator,
      description: "Number sense and problem-solving through hands-on activities and real-world connections",
      color: "bg-green-500",
      strands: [
        "Number Recognition & Counting",
        "Basic Addition & Subtraction",
        "Patterns & Sorting",
        "Shapes & Spatial Awareness",
        "Simple Measurement",
      ],
      keyFocus: [
        "Numbers 1-20 recognition and counting",
        "Simple addition and subtraction within 10",
        "Pattern recognition and creation",
        "Basic 2D shapes identification",
        "Comparing sizes and simple measurements",
      ],
      learningOutcomes: [
        "Count objects up to 20 and recognize written numbers",
        "Add and subtract within 10 using concrete objects",
        "Identify and create simple patterns",
        "Recognize and name basic geometric shapes",
      ],
    },
    {
      id: "science",
      title: "Science",
      icon: Flask,
      description: "Exploration and discovery of the natural world through hands-on investigations and observations",
      color: "bg-purple-500",
      strands: [
        "Living Things & Nature",
        "Materials & Objects",
        "Simple Forces & Movement",
        "Weather & Seasons",
        "Observation & Investigation",
      ],
      keyFocus: [
        "Plants, animals, and their basic needs",
        "Properties of everyday materials",
        "Push, pull, and simple movements",
        "Daily weather and seasonal changes",
        "Making observations and asking questions",
      ],
      learningOutcomes: [
        "Identify basic needs of living things (food, water, shelter)",
        "Describe simple properties of materials (hard, soft, smooth, rough)",
        "Demonstrate push and pull movements with objects",
        "Observe and describe daily weather patterns",
      ],
    },
    {
      id: "social-studies",
      title: "Social Studies",
      icon: BookOpen,
      description: "Understanding self, family, and community through engaging activities and cultural exploration",
      color: "bg-amber-500",
      strands: [
        "Self & Family Identity",
        "Community Helpers",
        "Basic Geography",
        "Rules & Responsibilities",
        "Cultural Awareness",
      ],
      keyFocus: [
        "Personal identity and family structures",
        "Community helpers and their roles",
        "School and neighborhood geography",
        "Classroom rules and basic responsibilities",
        "Celebrating diversity and traditions",
      ],
      learningOutcomes: [
        "Describe their own identity and family structure",
        "Identify community helpers and explain their jobs",
        "Locate familiar places in their school and neighborhood",
        "Follow classroom rules and understand basic responsibilities",
      ],
    },
  ]

  const gradeOverview = {
    totalStudents: "7,200+",
    averageAge: "6-7 years",
    keyMilestones: [
      "School readiness and routine establishment",
      "Basic literacy and numeracy introduction",
      "Social and emotional development",
      "Curiosity and wonder cultivation",
    ],
    assessmentFocus: [
      "Play-based learning observation",
      "Hands-on activity participation",
      "Social interaction development",
      "Creative expression encouragement",
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Curriculum", href: "/curriculum" },
            { label: "Grade 1 Subjects", href: "/curriculum/grade1-subjects" },
          ]}
        />

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Grade 1 Curriculum</h1>
              <p className="text-xl text-gray-600">Foundation Building & Early Learning Adventure</p>
            </div>
          </div>

          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Grade 1 provides a strong foundation for young learners through engaging, play-based learning experiences
            that nurture curiosity, creativity, and essential academic skills in a supportive and developmentally
            appropriate environment.
          </p>
        </div>

        {/* Grade Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{gradeOverview.totalStudents}</div>
              <div className="text-sm text-gray-600">Students Enrolled</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{gradeOverview.averageAge}</div>
              <div className="text-sm text-gray-600">Average Age</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">4</div>
              <div className="text-sm text-gray-600">Core Subjects</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">85%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Key Milestones */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-6 h-6 text-indigo-600" />
              Grade 1 Key Milestones & Development Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Milestones</h3>
                <ul className="space-y-2">
                  {gradeOverview.keyMilestones.map((milestone, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{milestone}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Focus Areas</h3>
                <ul className="space-y-2">
                  {gradeOverview.assessmentFocus.map((focus, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{focus}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {subjects.map((subject) => {
            const IconComponent = subject.icon
            return (
              <Card key={subject.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${subject.color} rounded-xl flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{subject.title}</CardTitle>
                      <CardDescription className="text-base">{subject.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Strands */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Curriculum Strands</h4>
                    <div className="flex flex-wrap gap-2">
                      {subject.strands.map((strand, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {strand}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Key Focus Areas */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Focus Areas</h4>
                    <ul className="space-y-1">
                      {subject.keyFocus.slice(0, 3).map((focus, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          {focus}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Learning Outcomes Preview */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Sample Learning Outcomes</h4>
                    <ul className="space-y-1">
                      {subject.learningOutcomes.slice(0, 2).map((outcome, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-4">
                    <Button asChild className="w-full sm:flex-1">
                      <Link href={`/curriculum/grade1-subjects/${subject.id}`}>View Curriculum</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full sm:flex-1 bg-transparent">
                      <Link href={`/curriculum/grade1-subjects/activities/${subject.id}`}>View Activities</Link>
                    </Button>
                    <Button asChild variant="secondary" className="w-full sm:flex-1">
                      <Link href={`/docs/grade1-${subject.id}-curriculum.pdf`} target="_blank">
                        Download PDF
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Grade 1 Additional Resources</CardTitle>
            <CardDescription>Supporting materials and tools for Grade 1 education</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Assessment Tools</h3>
                <p className="text-sm text-gray-600">
                  Play-based observation tools and developmental checklists for Grade 1 learning milestones
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Teacher Resources</h3>
                <p className="text-sm text-gray-600">
                  Interactive activities and developmentally appropriate teaching methods for Grade 1 educators
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Parent Guides</h3>
                <p className="text-sm text-gray-600">
                  Resources to help parents support their Grade 1 students' first formal learning experiences
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Curriculum Download</h3>
                <p className="text-sm text-gray-600">
                  Download PDF versions of Grade 1 curriculum documents and teaching materials
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Button asChild variant="outline">
                <Link href="/resources">Access All Resources</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
