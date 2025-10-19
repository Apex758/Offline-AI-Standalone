import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Calculator, FlaskRoundIcon as Flask, Globe, Users, Target, Clock, Award } from "lucide-react"
import { Link } from "react-router-dom"

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

export default function Grade2SubjectsPage() {
  const subjects = [
    {
      id: "language-arts",
      title: "Language Arts",
      icon: BookOpen,
      description: "Communication and literacy development through listening, speaking, reading, and writing",
      color: "bg-purple-500",
      strands: ["Listening & Speaking", "Reading & Viewing", "Writing & Representing", "Language Foundations"],
      keyFocus: [
        "Phonics and word recognition skills",
        "Simple sentence writing and structure",
        "Oral communication and storytelling",
        "Basic vocabulary development",
        "Beginning reading comprehension",
      ],
      learningOutcomes: [
        "Read simple texts with increasing fluency and comprehension",
        "Write simple sentences and short paragraphs with proper spacing",
        "Listen actively and respond appropriately in conversations",
        "Recognize and use basic grammar patterns in speaking and writing",
      ],
    },
    {
      id: "mathematics",
      title: "Mathematics",
      icon: Calculator,
      description: "Numerical reasoning and problem solving with basic mathematical concepts",
      color: "bg-green-500",
      strands: [
        "Number Sense & Counting",
        "Basic Operations",
        "Patterns & Sorting",
        "Simple Geometry",
        "Measurement Basics",
      ],
      keyFocus: [
        "Numbers to 100 and place value",
        "Addition and subtraction within 20",
        "Simple patterns and sequences",
        "Basic 2D and 3D shapes",
        "Non-standard and standard measurement units",
      ],
      learningOutcomes: [
        "Count, read, and write numbers to 100",
        "Add and subtract single-digit numbers fluently",
        "Identify and extend simple patterns",
        "Recognize and describe basic geometric shapes",
      ],
    },
    {
      id: "science",
      title: "Science",
      icon: Flask,
      description: "Inquiry-based exploration of living things, materials, and simple scientific concepts",
      color: "bg-amber-500",
      strands: [
        "Living Things & Habitats",
        "Materials & Properties",
        "Forces & Movement",
        "Seasons & Weather",
        "Simple Investigations",
      ],
      keyFocus: [
        "Animal and plant characteristics and needs",
        "Properties of everyday materials",
        "Push, pull, and simple movements",
        "Seasonal changes and weather patterns",
        "Making observations and simple predictions",
      ],
      learningOutcomes: [
        "Identify basic needs of living things and their habitats",
        "Describe properties of common materials (hard, soft, rough, smooth)",
        "Demonstrate understanding of push and pull forces",
        "Observe and describe seasonal changes in nature",
      ],
    },
    {
      id: "social-studies",
      title: "Social Studies",
      icon: Globe,
      description: "Understanding family, community, and basic concepts about the world around us",
      color: "bg-blue-500",
      strands: [
        "Family & Community",
        "Basic Geography",
        "Past & Present",
        "Rules & Responsibilities",
        "Cultural Awareness",
      ],
      keyFocus: [
        "Family structures and community helpers",
        "Simple maps and basic directions",
        "Changes over time in families and communities",
        "Classroom and school rules and responsibilities",
        "Celebrating diversity and different traditions",
      ],
      learningOutcomes: [
        "Describe roles of family members and community helpers",
        "Use simple maps to locate familiar places",
        "Compare how things were different in the past",
        "Follow rules and understand basic responsibilities",
      ],
    },
  ]

  const gradeOverview = {
    totalStudents: "8,400+",
    averageAge: "7-8 years",
    keyMilestones: [
      "Basic literacy and numeracy development",
      "Social and emotional skill building",
      "Curiosity and exploration encouragement",
      "Foundation for future learning",
    ],
    assessmentFocus: [
      "Play-based learning assessment",
      "Observation and documentation",
      "Hands-on activity evaluation",
      "Social interaction development",
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Curriculum", href: "/curriculum" },
            { label: "Grade 2 Subjects", href: "/curriculum/grade2-subjects" },
          ]}
        />

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Grade 2 Curriculum</h1>
              <p className="text-xl text-gray-600">Building Foundations & Early Primary Development</p>
            </div>
          </div>

          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Grade 2 builds upon the foundation established in Grade 1, encouraging students to develop deeper
            understanding, critical thinking skills, and greater independence in their learning journey through
            engaging, developmentally appropriate activities.
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
              <div className="text-2xl font-bold text-gray-900">87%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Key Milestones */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-6 h-6 text-indigo-600" />
              Grade 2 Key Milestones & Development Focus
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
                      <Link to={`/curriculum/grade2-subjects/${subject.id}`}>View Curriculum</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full sm:flex-1 bg-transparent">
                      <Link to={`/curriculum/grade2-subjects/activities/${subject.id}`}>View Activities</Link>
                    </Button>
                    <Button asChild variant="secondary" className="w-full sm:flex-1">
                      <Link to={`/docs/grade2-${subject.id}-curriculum.pdf`} target="_blank">
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
            <CardTitle>Grade 2 Additional Resources</CardTitle>
            <CardDescription>Supporting materials and tools for Grade 2 education</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Assessment Tools</h3>
                <p className="text-sm text-gray-600">
                  Play-based assessment tools and observation methods for Grade 2 developmental standards
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Teacher Resources</h3>
                <p className="text-sm text-gray-600">
                  Hands-on activities and developmentally appropriate teaching strategies for Grade 2 educators
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Parent Guides</h3>
                <p className="text-sm text-gray-600">
                  Resources to help parents support their Grade 2 students' early learning and development
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Curriculum Download</h3>
                <p className="text-sm text-gray-600">
                  Download PDF versions of Grade 2 curriculum documents and teaching materials
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Link to="/resources"><Button>Access All Resources</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
