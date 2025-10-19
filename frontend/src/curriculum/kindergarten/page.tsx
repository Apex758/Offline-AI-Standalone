import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  Cloud,
  PartyPopper,
  Leaf,
  Gamepad2,
  CalendarDays,
  BookOpen,
  Clock,
  ListChecks,
  Target,
  Award,
  FileText,
  Download,
} from "lucide-react"
import { Link } from "react-router-dom"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

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

export default function KindergartenSubjectsPage() {
  // Mapping from unit IDs to their corresponding activities directory names
  const unitToActivitiesMap: Record<string, string> = {
    "plants-and-animals": "plants-animals-unit",
    celebrations: "celebrations-unit",
    weather: "weather-unit",
    belonging: "belonging-unit",
    games: "games-unit",
  }

  const thematicUnits = [
    {
      id: "belonging",
      title: "Belonging Unit",
      icon: Users,
      timeframe: "September-October (5 weeks)",
      essentialQuestion: "Is it important to belong?",
      description:
        "Children explore identity, family, school, and community connections through engaging activities that help them understand their place in the world.",
      color: "bg-blue-500",
      image: "/belonging.png",
      topics: ["All About Me", "My Family", "My School", "My Community"],
    },
    {
      id: "weather",
      title: "Weather Unit",
      icon: Cloud,
      timeframe: "November-December (5 weeks)",
      essentialQuestion: "Is the weather important?",
      description:
        "Children investigate weather patterns, seasons, and how weather affects daily life through observation, experimentation, and creative expression.",
      color: "bg-cyan-500",
      image: "/weather.png",
      topics: ["Weather Types", "Seasons", "Weather & Me", "Weather Tools"],
    },
    {
      id: "celebrations",
      title: "Celebrations Unit",
      icon: PartyPopper,
      timeframe: "January-February (4 weeks)",
      essentialQuestion: "What do I like about celebrations with my family?",
      description:
        "Children explore family celebrations, cultural traditions, and community events, developing an appreciation for diversity and shared experiences.",
      color: "bg-purple-500",
      image: "/celebrations-unit.png",
      topics: ["Family Traditions", "Cultural Celebrations", "Community Events"],
    },
    {
      id: "plants-and-animals",
      title: "Plants and Animals Unit",
      icon: Leaf,
      timeframe: "March-April (5 weeks)",
      essentialQuestion: "How do plants and animals make a difference to me and my world?",
      description:
        "Children discover the characteristics, needs, and habitats of plants and animals through hands-on exploration, observation, and care activities.",
      color: "bg-green-500",
      image: "/plants_animals.png",
      topics: ["Plant Life", "Animal Habitats", "Living Things", "Our Environment"],
    },
    {
      id: "games",
      title: "Games Unit",
      icon: Gamepad2,
      timeframe: "May-June (5 weeks)",
      essentialQuestion: "How do games help us learn and grow?",
      description:
        "Children engage with games that promote physical, social, and cognitive development, learning cooperation, problem-solving, and motor skills.",
      color: "bg-amber-500",
      image: "/games.png",
      topics: ["Movement Games", "Thinking Games", "Cooperative Games", "Traditional Games"],
    },
  ]

  const gradeOverview = {
    totalStudents: "6,000+",
    averageAge: "4-5 years",
    keyMilestones: [
      "School readiness and social skills development",
      "Play-based learning and exploration",
      "Language and communication foundations",
      "Creative expression and imagination",
    ],
    assessmentFocus: [
      "Observational assessment through play",
      "Portfolio documentation of growth",
      "Social-emotional development tracking",
      "Hands-on learning experiences",
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Curriculum", href: "/curriculum" },
            { label: "Kindergarten Subjects", href: "/curriculum/kindergarten-subjects" },
          ]}
        />

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">K</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Kindergarten Curriculum</h1>
              <p className="text-xl text-gray-600">Play-Based Learning & Early Childhood Development</p>
            </div>
          </div>

          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            The Kindergarten curriculum is structured as a comprehensive, thematic approach to early childhood
            education, focusing on developing the whole child through engaging, play-based learning experiences that
            nurture curiosity, creativity, and foundational skills.
          </p>
        </div>

        {/* Grade Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{gradeOverview.totalStudents}</div>
              <div className="text-sm text-gray-600">Students Enrolled</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Target className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{gradeOverview.averageAge}</div>
              <div className="text-sm text-gray-600">Average Age</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">5</div>
              <div className="text-sm text-gray-600">Thematic Units</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">83%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Key Milestones */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-6 h-6 text-orange-600" />
              Kindergarten Key Milestones & Development Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Milestones</h3>
                <ul className="space-y-2">
                  {gradeOverview.keyMilestones.map((milestone, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
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
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{focus}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lesson Plan Creation Button */}
        <div className="mb-12 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Create Your Lesson Plan?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Use our AI-powered kindergarten lesson planner to create engaging, standards-aligned lesson plans tailored
              to your students' needs and learning objectives.
            </p>
            <Link to="/kindergarten-planner"><Button>
                <BookOpen className="mr-2 h-5 w-5" />
                Create Lesson Plan
              </Button></Link>
          </div>
        </div>

        {/* OECS Harmonised Kindergarten Curriculum Overview */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">OECS Harmonised Kindergarten Curriculum Overview</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              A comprehensive, integrated approach to early childhood education designed to ensure positive and
              successful educational transitions for every child in the OECS region.
            </p>
          </div>

          {/* Curriculum Philosophy */}
          <Card className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="w-6 h-6 text-amber-600" />
                Curriculum Philosophy & Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Vision for an Educated Person</h4>
                  <p className="text-sm text-gray-700 mb-4">
                    Persons in the OECS will reach their full potential academically, socially, culturally, emotionally,
                    spiritually and physically to support success in their lives.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      Future-oriented lifelong learners with 21st Century skills
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      Attends to well-being of self and others
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      Demonstrates respect for diversity and inclusion
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Play-Based Learning Approach</h4>
                  <p className="text-sm text-gray-700 mb-4">
                    Play is the foundation of all learning in kindergarten and the most appropriate means by which
                    children can engage in meaningful learning experiences.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-amber-200">
                    <p className="text-sm text-gray-700 italic">
                      "Children come to school as active thinkers, possessing natural curiosity and eagerness to learn.
                      Through play, children exhibit control that reflects their developmental needs, building
                      self-confidence and security in learning."
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Essential Education Competencies */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                  Citizenship
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Engaged, responsible citizenship</li>
                  <li>• Cultural heritage appreciation</li>
                  <li>• Democratic participation</li>
                  <li>• Community contribution</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-purple-600" />
                  Critical Thinking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Problem-solving approaches</li>
                  <li>• Effective communication</li>
                  <li>• Ethical interactions</li>
                  <li>• Creative thinking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="w-5 h-5 text-green-600" />
                  Well-being
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Healthy, active lifestyle</li>
                  <li>• Self-care strategies</li>
                  <li>• Individual well-being</li>
                  <li>• Collective well-being</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5 text-orange-600" />
                  Knowledge & Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Multiple literacies</li>
                  <li>• Entrepreneurial thinking</li>
                  <li>• Technology integration</li>
                  <li>• Flexible application</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Learning Principles */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="w-6 h-6 text-indigo-600" />
                Foundational Learning Principles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Equitable</h4>
                  <p className="text-sm text-gray-600">
                    All learners have access to opportunities that support continued growth, regardless of background.
                    Learning is built on prior knowledge and respects unique abilities.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Meaningfully Constructed</h4>
                  <p className="text-sm text-gray-600">
                    Learning occurs in safe, supportive environments that develop self-confidence and motivation.
                    Promotes holistic development and joy for learning.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Deep & Comprehensive</h4>
                  <p className="text-sm text-gray-600">
                    Active, engaging learning with sustained opportunities for critical thinking. Values curiosity,
                    creativity, and cross-curricular connections.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subject Areas Integration */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-teal-600" />
                Integrated Subject Areas
              </CardTitle>
              <CardDescription>
                All subject areas are woven together through thematic units for meaningful, connected learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Language Arts</h4>
                  <p className="text-xs text-gray-600">Listening, Speaking, Reading, Viewing, Writing & Representing</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Mathematics</h4>
                  <p className="text-xs text-gray-600">
                    Number Sense, Operations, Patterns, Geometry, Measurement & Data
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Science</h4>
                  <p className="text-xs text-gray-600">Forces & Motion, Ecosystems, Weather & Climate</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Social Studies</h4>
                  <p className="text-xs text-gray-600">
                    Historical-Cultural Thinking, Civic Participation, Spatial Thinking
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Approach */}
          <Card className="mb-8 bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="w-6 h-6 text-green-600" />
                Assessment Philosophy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-600" />
                    Learner-Centred
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Positive and affirming</li>
                    <li>• Builds on learner confidence</li>
                    <li>• Acknowledges unique strengths</li>
                    <li>• Developmentally appropriate</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-600" />
                    Informs Learning
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Monitors progress</li>
                    <li>• Provides transparent feedback</li>
                    <li>• Identifies learning gaps</li>
                    <li>• Guides teaching decisions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-green-600" />
                    Balanced Approach
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Multiple assessment strategies</li>
                    <li>• Observation, conversation, products</li>
                    <li>• Formative and summative</li>
                    <li>• Self and peer assessment</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sample Daily Structure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-indigo-600" />
                Sample Kindergarten Daily Structure
              </CardTitle>
              <CardDescription>
                A balanced approach supporting social-emotional development alongside academic learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        20
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">Opening & Morning Meeting</h5>
                        <p className="text-sm text-gray-600">Devotion and daily planning</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        60
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">Language Arts</h5>
                        <p className="text-sm text-gray-600">Whole group, small group, individual learning</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        60
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">Mathematics</h5>
                        <p className="text-sm text-gray-600">Stand-alone skills and integrated activities</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        90
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">Integrated Unit Time</h5>
                        <p className="text-sm text-gray-600">Project work, exploration, role play</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                      <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        20
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">Physical Education</h5>
                        <p className="text-sm text-gray-600">Wellness and movement activities</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                      <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        20
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">Review & Celebration</h5>
                        <p className="text-sm text-gray-600">Reflection and next day preparation</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <p className="text-sm text-gray-700 italic text-center">
                    <strong>Note:</strong> This structure provides routine while allowing flexibility for individual
                    needs and developmental differences. Choice time and creative arts are integrated throughout the
                    day.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kindergarten Overview Document Download */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-green-600" />
                Kindergarten Overview Document
              </CardTitle>
              <CardDescription>
                Download the official OHPC Kindergarten Guidelines document for comprehensive curriculum information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">OHPC Kindergarten Guidelines</h4>
                    <p className="text-sm text-gray-600">Official document updated November 14, 2024</p>
                    <p className="text-xs text-gray-500">PDF format • Comprehensive curriculum details</p>
                  </div>
                </div>
                <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                  <a 
                    href="/docs/OHPC Kindergarten Guidelines 14November2024.pdf" 
                    download="OHPC_Kindergarten_Guidelines_14November2024.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </a>
                </Button>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>What's included:</strong> Complete kindergarten curriculum framework, learning objectives, 
                  assessment strategies, thematic units, and teaching methodologies aligned with OECS standards.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Thematic Units Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Thematic Learning Units</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {thematicUnits.map((unit) => {
              const IconComponent = unit.icon
              return (
                <Card key={unit.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <div className="relative w-full h-48">
                    <img
                      src={unit.image}
                      alt={unit.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 ${unit.color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <CardTitle className="text-lg">{unit.title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm font-medium text-gray-600">{unit.timeframe}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">Essential Question:</p>
                      <p className="text-sm text-gray-600 italic">"{unit.essentialQuestion}"</p>
                    </div>

                    <p className="text-sm text-gray-700">{unit.description}</p>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Key Topics</h4>
                      <div className="flex flex-wrap gap-1">
                        {unit.topics.map((topic, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button asChild className="flex-1 text-sm">
                        <Link to={`/curriculum/kindergarten/${unit.id}`}>Explore Unit</Link>
                      </Button>
                      <Button asChild variant="outline" className="flex-1 text-sm bg-transparent">
                        <Link to={`/curriculum/kindergarten/activities/${unitToActivitiesMap[unit.id] || `${unit.id}-unit`}`}
                        >
                          View Activities
                        </Link>
                      </Button>
                    </div>
                    <div className="mt-2">
                      <Button asChild variant="secondary" className="w-full text-sm">
                        <Link to={`/docs/kindergarten-${unit.id}-unit.pdf`} target="_blank" rel="noopener noreferrer">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Download Unit PDF
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Curriculum Organization */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Curriculum Organization</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <CalendarDays className="mr-2 h-5 w-5 text-orange-600" />
                  Weekly Organization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Each unit is broken down into weekly themes that build upon each other:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  <li>
                    <span className="font-medium">Week 1:</span> Introduction to the unit's core concepts
                  </li>
                  <li>
                    <span className="font-medium">Weeks 2-4:</span> Exploration of specific aspects of the theme
                  </li>
                  <li>
                    <span className="font-medium">Final Week:</span> Integration and synthesis of learning
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Clock className="mr-2 h-5 w-5 text-teal-600" />
                  Daily Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Each day follows a consistent structure to provide routine and comprehensive learning:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  <li>
                    <span className="font-medium">Morning Circle:</span> Introduction to the day's focus
                  </li>
                  <li>
                    <span className="font-medium">Literacy Activity:</span> Language and literacy development
                  </li>
                  <li>
                    <span className="font-medium">Math Activity:</span> Numeracy and mathematical thinking
                  </li>
                  <li>
                    <span className="font-medium">Content Activity:</span> Science, art, or social studies
                  </li>
                  <li>
                    <span className="font-medium">Closing Circle:</span> Reflection and consolidation
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <ListChecks className="mr-2 h-5 w-5 text-indigo-600" />
                  Learning Components
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Each unit integrates multiple learning domains to support holistic development:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  <li>
                    <span className="font-medium">Learning Objectives:</span> Specific, measurable outcomes
                  </li>
                  <li>
                    <span className="font-medium">Key Vocabulary:</span> Essential terms children should learn
                  </li>
                  <li>
                    <span className="font-medium">Assessment Strategies:</span> Methods to evaluate understanding
                  </li>
                  <li>
                    <span className="font-medium">Materials and Resources:</span> Teaching tools and supports
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Kindergarten Additional Resources</CardTitle>
            <CardDescription>Supporting materials and tools for Kindergarten education</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Assessment Tools</h3>
                <p className="text-sm text-gray-600">
                  Observational assessment tools and developmental checklists for kindergarten milestones
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Teacher Resources</h3>
                <p className="text-sm text-gray-600">
                  Play-based activities and thematic teaching materials for kindergarten educators
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Parent Guides</h3>
                <p className="text-sm text-gray-600">
                  Resources to help parents support their kindergarten students' early learning journey
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Curriculum Download</h3>
                <p className="text-sm text-gray-600">
                  Download PDF versions of kindergarten thematic unit plans and teaching materials
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Link to="/curriculum/kindergarten/resources"><Button>
                  <BookOpen className="mr-2 h-5 w-5" />
                  Access Kindergarten Resources
                </Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
