import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Calculator, Microscope, Globe, Users, Target, Clock, Award } from "lucide-react"
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

export default function Grade6SubjectsPage() {
  const subjects = [
    {
      id: "language-arts",
      title: "Language Arts",
      icon: BookOpen,
      description:
        "Advanced literacy skills including critical reading, analytical writing, and sophisticated communication",
      color: "bg-blue-500",
      strands: ["Advanced Listening & Speaking", "Critical Reading & Viewing", "Analytical Writing & Representing"],
      keyFocus: [
        "Literary analysis and interpretation",
        "Persuasive and expository writing",
        "Advanced vocabulary development",
        "Media literacy and critical thinking",
        "Caribbean literature appreciation",
      ],
      learningOutcomes: [
        "Analyze complex texts for theme, character development, and literary devices",
        "Write well-structured essays with clear thesis statements and supporting evidence",
        "Deliver confident presentations using appropriate language and visual aids",
        "Evaluate media messages for bias, accuracy, and persuasive techniques",
      ],
    },
    {
      id: "mathematics",
      title: "Mathematics",
      icon: Calculator,
      description: "Advanced mathematical concepts including algebra basics, complex geometry, and data analysis",
      color: "bg-green-500",
      strands: [
        "Advanced Number Sense",
        "Algebraic Thinking",
        "Geometric Reasoning",
        "Measurement & Data Analysis",
        "Probability & Statistics",
      ],
      keyFocus: [
        "Introduction to algebraic expressions",
        "Complex geometric constructions",
        "Statistical analysis and interpretation",
        "Problem-solving strategies",
        "Mathematical reasoning and proof",
      ],
      learningOutcomes: [
        "Solve multi-step problems involving fractions, decimals, and percentages",
        "Understand basic algebraic concepts and solve simple equations",
        "Calculate area and volume of complex shapes",
        "Collect, organize, and interpret data using various statistical methods",
      ],
    },
    {
      id: "science",
      title: "Science",
      icon: Microscope,
      description: "Comprehensive scientific inquiry covering advanced life, physical, and earth sciences",
      color: "bg-purple-500",
      strands: [
        "Advanced Life Science",
        "Physical Science Principles",
        "Earth & Space Systems",
        "Scientific Investigation",
        "Science & Technology",
      ],
      keyFocus: [
        "Ecosystem interactions and biodiversity",
        "Forces, motion, and energy transformations",
        "Weather systems and climate change",
        "Scientific method and experimental design",
        "Technology's impact on society",
      ],
      learningOutcomes: [
        "Design and conduct controlled scientific experiments",
        "Explain the interdependence of organisms in ecosystems",
        "Describe the relationship between forces and motion",
        "Analyze the impact of human activities on the environment",
      ],
    },
    {
      id: "social-studies",
      title: "Social Studies",
      icon: Globe,
      description: "Advanced study of Caribbean society, global connections, and citizenship responsibilities",
      color: "bg-orange-500",
      strands: [
        "Advanced Historical Thinking",
        "Geographic Analysis",
        "Civic Engagement",
        "Economic Understanding",
        "Global Connections",
      ],
      keyFocus: [
        "Caribbean independence movements",
        "Regional and global geography",
        "Democratic institutions and processes",
        "Economic systems and globalization",
        "Cultural diversity and human rights",
      ],
      learningOutcomes: [
        "Analyze the causes and effects of historical events in the Caribbean",
        "Evaluate the impact of geographic factors on human settlement patterns",
        "Understand the rights and responsibilities of democratic citizenship",
        "Examine the effects of globalization on Caribbean economies",
      ],
    },
  ]

  const gradeOverview = {
    totalStudents: "12,500+",
    averageAge: "11-12 years",
    keyMilestones: [
      "Transition to secondary school preparation",
      "Advanced critical thinking development",
      "Independent research skills",
      "Leadership and collaboration",
    ],
    assessmentFocus: [
      "Analytical thinking and reasoning",
      "Complex problem-solving",
      "Independent project work",
      "Peer collaboration and leadership",
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Curriculum", href: "/curriculum" },
            { label: "Grade 6 Subjects", href: "/curriculum/grade6-subjects" },
          ]}
        />

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">6</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Grade 6 Curriculum</h1>
              <p className="text-xl text-gray-600">Advanced Learning & Secondary School Preparation</p>
            </div>
          </div>

          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Grade 6 represents the culmination of primary education, focusing on advanced academic skills, critical
            thinking, and preparation for secondary school. Students develop independence, leadership qualities, and
            sophisticated understanding across all subject areas.
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
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Key Milestones */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-6 h-6 text-indigo-600" />
              Grade 6 Key Milestones & Development Focus
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
                      <Link to={`/curriculum/grade6-subjects/${subject.id}`}>View Curriculum</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full sm:flex-1 bg-transparent">
                      <Link to={`/curriculum/grade6-subjects/activities/${subject.id}`}>View Activities</Link>
                    </Button>
                    <Button asChild variant="secondary" className="w-full sm:flex-1">
                      <Link to={`/docs/grade6-${subject.id}-curriculum.pdf`} target="_blank">
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
            <CardTitle>Grade 6 Additional Resources</CardTitle>
            <CardDescription>Supporting materials and tools for Grade 6 education</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Assessment Tools</h3>
                <p className="text-sm text-gray-600">
                  Comprehensive assessment rubrics and evaluation criteria for Grade 6 standards
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Teacher Resources</h3>
                <p className="text-sm text-gray-600">
                  Professional development materials and teaching strategies for Grade 6 educators
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Parent Guides</h3>
                <p className="text-sm text-gray-600">
                  Resources to help parents support their Grade 6 students' academic journey
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Curriculum Download</h3>
                <p className="text-sm text-gray-600">
                  Download PDF versions of Grade 6 curriculum documents and teaching materials
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
