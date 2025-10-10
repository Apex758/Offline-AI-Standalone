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

export default function Grade3SubjectsPage() {
  const subjects = [
    {
      id: "language-arts",
      title: "Language Arts",
      icon: BookOpen,
      description: "Communication and literacy development through listening, speaking, reading, and writing",
      color: "bg-purple-500",
      strands: ["Listening & Speaking", "Reading & Viewing", "Writing & Representing", "Language Foundations"],
      keyFocus: [
        "Foundational reading comprehension skills",
        "Basic writing composition and structure",
        "Oral communication and presentation",
        "Vocabulary development and usage",
        "Beginning critical thinking about texts",
      ],
      learningOutcomes: [
        "Read and comprehend grade-appropriate texts with fluency",
        "Write clear, organized paragraphs with proper sentence structure",
        "Participate effectively in classroom discussions and presentations",
        "Demonstrate understanding of basic grammar and language conventions",
      ],
    },
    {
      id: "mathematics",
      title: "Mathematics",
      icon: Calculator,
      description: "Numerical reasoning and problem solving with foundational mathematical concepts",
      color: "bg-green-500",
      strands: [
        "Number Sense & Operations",
        "Patterns & Relations",
        "Geometry & Spatial Sense",
        "Measurement",
        "Data Management",
      ],
      keyFocus: [
        "Multi-digit addition and subtraction",
        "Introduction to multiplication and division",
        "Basic geometric shapes and properties",
        "Standard units of measurement",
        "Simple data collection and graphing",
      ],
      learningOutcomes: [
        "Solve addition and subtraction problems with regrouping",
        "Understand basic multiplication and division concepts",
        "Identify and describe properties of 2D and 3D shapes",
        "Measure length, mass, and capacity using standard units",
      ],
    },
    {
      id: "science",
      title: "Science",
      icon: Flask,
      description: "Inquiry-based exploration of life science, physical science, and earth systems",
      color: "bg-amber-500",
      strands: [
        "Life Science Exploration",
        "Physical Science Basics",
        "Earth & Space Systems",
        "Scientific Inquiry",
        "Science & Technology",
      ],
      keyFocus: [
        "Plant and animal life cycles and habitats",
        "Properties of materials and simple forces",
        "Weather patterns and seasonal changes",
        "Basic scientific observation and recording",
        "Simple tools and their uses",
      ],
      learningOutcomes: [
        "Describe the basic needs and characteristics of living things",
        "Investigate properties of different materials and substances",
        "Observe and record weather patterns and seasonal changes",
        "Use simple tools to make observations and measurements",
      ],
    },
    {
      id: "social-studies",
      title: "Social Studies",
      icon: Globe,
      description: "Understanding communities, relationships, and basic geographic and historical concepts",
      color: "bg-blue-500",
      strands: [
        "Community Studies",
        "Geographic Thinking",
        "Historical Understanding",
        "Citizenship & Identity",
        "Economic Concepts",
      ],
      keyFocus: [
        "Local and diverse communities around the world",
        "Basic map skills and geographic features",
        "Simple historical timelines and events",
        "Rights, responsibilities, and community participation",
        "Basic needs, wants, and simple economic concepts",
      ],
      learningOutcomes: [
        "Compare and contrast different types of communities",
        "Use simple maps and globes to locate places and features",
        "Sequence events in chronological order using timelines",
        "Identify rights and responsibilities as community members",
      ],
    },
  ]

  const gradeOverview = {
    totalStudents: "9,600+",
    averageAge: "8-9 years",
    keyMilestones: [
      "Foundational literacy and numeracy mastery",
      "Independent learning skill development",
      "Critical thinking introduction",
      "Middle primary preparation",
    ],
    assessmentFocus: [
      "Foundational skill assessment",
      "Hands-on learning activities",
      "Collaborative group work",
      "Creative expression and exploration",
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Curriculum", href: "/curriculum" },
            { label: "Grade 3 Subjects", href: "/curriculum/grade3-subjects" },
          ]}
        />

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Grade 3 Curriculum</h1>
              <p className="text-xl text-gray-600">Foundation Building & Middle Primary Development</p>
            </div>
          </div>

          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Grade 3 builds upon the foundations established in earlier grades, encouraging students to develop deeper
            understanding, critical thinking skills, and greater independence in their learning journey across all
            academic disciplines.
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
              <div className="text-2xl font-bold text-gray-900">89%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Key Milestones */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-6 h-6 text-indigo-600" />
              Grade 3 Key Milestones & Development Focus
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
                      <Link to={`/curriculum/grade3-subjects/${subject.id}`}>View Curriculum</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full sm:flex-1 bg-transparent">
                      <Link to={`/curriculum/grade3-subjects/activities/${subject.id}`}>View Activities</Link>
                    </Button>
                    <Button asChild variant="secondary" className="w-full sm:flex-1">
                      <Link to={`/docs/grade3-${subject.id}-curriculum.pdf`} target="_blank">
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
            <CardTitle>Grade 3 Additional Resources</CardTitle>
            <CardDescription>Supporting materials and tools for Grade 3 education</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Assessment Tools</h3>
                <p className="text-sm text-gray-600">
                  Foundational skill assessment tools and creative evaluation methods for Grade 3 standards
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Teacher Resources</h3>
                <p className="text-sm text-gray-600">
                  Hands-on learning activities and collaborative teaching strategies for Grade 3 educators
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Parent Guides</h3>
                <p className="text-sm text-gray-600">
                  Resources to help parents support their Grade 3 students' foundational learning development
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Curriculum Download</h3>
                <p className="text-sm text-gray-600">
                  Download PDF versions of Grade 3 curriculum documents and teaching materials
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
