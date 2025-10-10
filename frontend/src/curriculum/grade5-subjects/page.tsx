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

export default function Grade5SubjectsPage() {
  const subjects = [
    {
      id: "language-arts",
      title: "Language Arts",
      icon: BookOpen,
      description:
        "Sophisticated literacy and advanced communication skills including literary analysis and research writing",
      color: "bg-purple-500",
      strands: ["Advanced Reading & Comprehension", "Research Writing", "Oral Communication", "Media Literacy"],
      keyFocus: [
        "Literary analysis and interpretation",
        "Research writing and documentation",
        "Advanced vocabulary development",
        "Public speaking and presentation",
        "Multi-genre composition",
      ],
      learningOutcomes: [
        "Analyze complex texts for literary elements and author's purpose",
        "Conduct research using multiple sources and cite appropriately",
        "Deliver engaging presentations with visual aids and clear organization",
        "Write persuasive and informative essays with strong evidence",
      ],
    },
    {
      id: "mathematics",
      title: "Mathematics",
      icon: Calculator,
      description:
        "Advanced mathematical concepts including pre-algebra, coordinate geometry, and statistical analysis",
      color: "bg-green-500",
      strands: [
        "Pre-Algebraic Thinking",
        "Advanced Number Operations",
        "Coordinate Geometry",
        "Data Analysis & Statistics",
        "Mathematical Reasoning",
      ],
      keyFocus: [
        "Pre-algebraic expressions and equations",
        "Advanced fraction and decimal operations",
        "Coordinate plane and graphing",
        "Statistical analysis and probability",
        "Mathematical problem-solving strategies",
      ],
      learningOutcomes: [
        "Solve complex multi-step problems involving all operations",
        "Graph points and analyze patterns on coordinate planes",
        "Collect, organize, and interpret statistical data",
        "Apply mathematical reasoning to real-world situations",
      ],
    },
    {
      id: "science",
      title: "Science",
      icon: Flask,
      description: "Complex scientific investigation covering matter, energy, space systems, and engineering design",
      color: "bg-amber-500",
      strands: [
        "Matter & Energy Systems",
        "Space & Earth Sciences",
        "Life Science Interactions",
        "Engineering Design Process",
        "Scientific Investigation",
      ],
      keyFocus: [
        "Matter and energy interactions",
        "Space systems and celestial patterns",
        "Ecosystem dynamics and biodiversity",
        "Engineering design and problem-solving",
        "Advanced scientific inquiry methods",
      ],
      learningOutcomes: [
        "Design and conduct controlled scientific experiments",
        "Explain the properties and interactions of matter and energy",
        "Describe patterns in space systems and Earth's place in the universe",
        "Apply engineering design process to solve real-world problems",
      ],
    },
    {
      id: "social-studies",
      title: "Social Studies",
      icon: Globe,
      description: "Advanced historical analysis focusing on Caribbean independence movements and global connections",
      color: "bg-blue-500",
      strands: [
        "Caribbean Historical Analysis",
        "Regional Integration Studies",
        "Global Citizenship",
        "Research & Documentation",
        "Critical Thinking Skills",
      ],
      keyFocus: [
        "Caribbean independence movements",
        "Regional integration and cooperation",
        "Global connections and interdependence",
        "Historical research and source analysis",
        "Contemporary challenges and solutions",
      ],
      learningOutcomes: [
        "Analyze the causes and effects of Caribbean independence movements",
        "Evaluate the impact of regional integration on Caribbean development",
        "Understand their role as global citizens in an interconnected world",
        "Conduct historical research using primary and secondary sources",
      ],
    },
  ]

  const gradeOverview = {
    totalStudents: "11,200+",
    averageAge: "10-11 years",
    keyMilestones: [
      "Elementary education culmination",
      "Middle school preparation",
      "Independent research development",
      "Advanced critical thinking skills",
    ],
    assessmentFocus: [
      "Project-based learning",
      "Collaborative research",
      "Performance-based assessment",
      "Portfolio development",
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Curriculum", href: "/curriculum" },
            { label: "Grade 5 Subjects", href: "/curriculum/grade5-subjects" },
          ]}
        />

        {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
            <span className="text-2xl font-bold text-white">5</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Grade 5 Curriculum</h1>
            <p className="text-xl text-gray-600">Primary Exit Assessment Preparation & Secondary School Readiness</p>
          </div>
        </div>

        <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
          Grade 5 establishes the critical foundation for primary exit assessment success, developing sophisticated 
          analytical skills, independent research abilities, and comprehensive subject mastery that prepares students 
          for the primary exit assessment and the transition to secondary education.
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
              <div className="text-2xl font-bold text-gray-900">93%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Key Milestones */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-6 h-6 text-indigo-600" />
              Grade 5 Key Milestones & Development Focus
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
                      <Link to={`/curriculum/grade5-subjects/${subject.id}`}>View Curriculum</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full sm:flex-1 bg-transparent">
                      <Link to={`/curriculum/grade5-subjects/activities/${subject.id}`}>View Activities</Link>
                    </Button>
                    <Button asChild variant="secondary" className="w-full sm:flex-1">
                      <Link to={`/docs/grade5-${subject.id}-curriculum.pdf`} target="_blank">
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
            <CardTitle>Grade 5 Additional Resources</CardTitle>
            <CardDescription>Supporting materials and tools for Grade 5 education</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Assessment Tools</h3>
                <p className="text-sm text-gray-600">
                  Performance-based assessment rubrics and portfolio evaluation criteria for Grade 5 standards
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Teacher Resources</h3>
                <p className="text-sm text-gray-600">
                  Professional development materials and project-based learning strategies for Grade 5 educators
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Parent Guides</h3>
                <p className="text-sm text-gray-600">
                  Resources to help parents support their Grade 5 students' transition to middle school
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Curriculum Download</h3>
                <p className="text-sm text-gray-600">
                  Download PDF versions of Grade 5 curriculum documents and teaching materials
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
