import { Link } from "react-router-dom"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag
import { useState } from "react"
import { BookOpen, GraduationCap, Calendar, Search, Filter, ChevronRight, Users, Target, Award, Sparkles } from "lucide-react"
//import { CurriculumSearch } from "@/components/curriculum-search"

export default function CurriculumPage() {
  const [hoveredStandard, setHoveredStandard] = useState<string | null>(null)

  const standardsPreview = [
    {
      subject: "Mathematics",
      icon: "🔢",
      color: "bg-blue-500",
      standards:"",
      description: "Number sense, operations, patterns & geometry"
    },
    {
      subject: "Language Arts",
      icon: "📚",
      color: "bg-pink-500",
      standards:"",
      description: "Reading, writing, listening & speaking"
    },
    {
      subject: "Science",
      icon: "🔬",
      color: "bg-green-500",
      standards:"",
      description: "Forces, ecosystems, matter & energy"
    },
    {
      subject: "Social Studies",
      icon: "🌍",
      color: "bg-yellow-500",
      standards: "",
      description: "History, culture, civic participation"
    }
  ]

  return (
    <div className="flex justify-center w-full">
      <div className="container max-w-7xl py-8">
        <h1 className="text-3xl text-green-600 font-bold mb-6 text-center">The OECS Harmonised Primary Curriculum</h1>

        <div className="grid gap-6 mb-8">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <p className="mb-4">
              The Organisation of Eastern Caribbean States (OECS) Curriculum Framework is designed to provide a
              comprehensive, student-centered approach to education across member states. The curriculum focuses on
              developing essential knowledge, skills, and values that prepare students for lifelong learning and
              active participation in society.
            </p>
            <p>
              This curriculum management system provides teachers and educators with access to curriculum guides,
              lesson plans, activities, and resources aligned with the OECS educational standards.
            </p>
          </div>
        </div>

        {/* Enhanced Interactive Curriculum Standards Section */}
        <div className="mb-12">
          <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-2xl border-2 border-green-200 shadow-lg">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute top-1/2 -left-8 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
              <div className="absolute bottom-4 right-1/3 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse delay-500"></div>
            </div>

            <div className="relative p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Explore Specific Curriculum Outcomes</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Discover our comprehensive collection of 596 specific curriculum outcomes across all subjects and grade levels
                </p>
              </div>

              {/* Interactive Standards Preview Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {standardsPreview.map((item, index) => (
                  <div
                    key={item.subject}
                    className={`relative p-4 bg-white rounded-xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg ${
                      hoveredStandard === item.subject ? 'border-green-400 shadow-lg' : 'border-gray-200'
                    }`}
                    onMouseEnter={() => setHoveredStandard(item.subject)}
                    onMouseLeave={() => setHoveredStandard(null)}
                  >
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center w-12 h-12 ${item.color} rounded-lg mb-3 text-white text-xl`}>
                        {item.icon}
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1">{item.subject}</h3>
                      <div className="text-2xl font-bold text-green-600 mb-1">{item.standards}</div>
                      <p className="text-xs text-gray-500 leading-tight">{item.description}</p>
                    </div>
                    {hoveredStandard === item.subject && (
                      <div className="absolute inset-0 bg-green-500 bg-opacity-5 rounded-xl border-2 border-green-400 animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Features Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Search className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Smart Search</h4>
                    <p className="text-sm text-gray-500">Find standards by keyword or code</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <Filter className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Advanced Filters</h4>
                    <p className="text-sm text-gray-500">Filter by subject, grade, or strand</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Organized Structure</h4>
                    <p className="text-sm text-gray-500">Hierarchical browsing experience</p>
                  </div>
                </div>
              </div>

              {/* Call-to-Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/curriculum/standards" className="group">
                  <div className="relative overflow-hidden bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                    <div className="flex items-center justify-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      <span>Explore All Outcomes</span>
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-pulse"></div>
                  </div>
                </Link>
                
                <Link to="/curriculum/standards?quick=true" className="group">
                  <div className="relative bg-white hover:bg-gray-50 text-green-600 font-semibold px-8 py-4 rounded-xl border-2 border-green-600 shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                    <div className="flex items-center justify-center">
                      <Filter className="w-5 h-5 mr-2" />
                      <span>Quick Filter View</span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Stats Footer */}
              <div className="flex justify-center items-center mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>K-6 Coverage</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    <span>OECS Aligned</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    <span>Learning Focused</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 text-center py-4 mb-2">Explore the Curriculum</h2>
        <p className="text-gray-600 text-center mb-6">Discover engaging units, hands-on activities, and resources tailored to support every learner's journey.</p>

        {/* Curriculum Search Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200 p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-full mb-3">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Search Curriculum Content</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find specific curriculum outcomes, strategies, and content across all subjects and grade levels. 
                Search for concepts like "verbs", "numbers", "forces", or any curriculum topic.
              </p>
            </div>
            {/* <CurriculumSearch /> */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Kindergarten */}
          <div className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition-shadow">
            <div className="relative w-full h-48 overflow-hidden">
              <img src="/kindergarten.png" alt="Kindergarten classroom" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">Kindergarten</h3>
              <p className="text-sm text-gray-600 mb-3">Early childhood education</p>
              <p className="text-sm text-gray-500 mb-4">
                The Kindergarten curriculum nurtures early development through play-based learning, focusing on social skills, 
                language development, creative expression, and basic numeracy concepts. Children develop curiosity and 
                a love for learning in a supportive environment.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                  <span>4 Learning Areas</span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                  <span>12 Developmental Goals</span>
                </div>
              </div>
              <Link to="/curriculum/kindergarten" className="w-full inline-block text-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                View Kindergarten Curriculum
              </Link>
            </div>
          </div>

          {/* Grade 1 */}
          <div className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition-shadow">
            <div className="relative w-full h-48 overflow-hidden">
              <img src="/grade_1.png" alt="Grade 1 classroom" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">Grade 1</h3>
              <p className="text-sm text-gray-600 mb-3">Foundation year curriculum</p>
              <p className="text-sm text-gray-500 mb-4">
                The Grade 1 curriculum focuses on building foundational skills in literacy, numeracy, scientific
                inquiry, and social awareness. Students develop essential competencies through engaging, play-based
                learning experiences.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                  <span>4 Subjects</span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                  <span>16 Strands</span>
                </div>
              </div>
              <Link to="/curriculum/grade1-subjects" className="w-full inline-block text-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                View Grade 1 Curriculum
              </Link>
            </div>
          </div>

          {/* Grade 2 */}
          <div className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition-shadow">
            <div className="relative w-full h-48 overflow-hidden">
              <img src="/Grade_2.png" alt="Grade 2 classroom" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">Grade 2</h3>
              <p className="text-sm text-gray-600 mb-3">Building on foundations</p>
              <p className="text-sm text-gray-500 mb-4">
                The Grade 2 curriculum extends students' knowledge and skills across all subject areas. Students engage
                in more complex learning tasks while continuing to develop their confidence and independence as
                learners.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                  <span>4 Subjects</span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                  <span>16 Strands</span>
                </div>
              </div>
              <Link to="/curriculum/grade2-subjects" className="w-full inline-block text-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                View Grade 2 Curriculum
              </Link>
            </div>
          </div>

          {/* Grade 3 */}
          <div className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition-shadow">
            <div className="relative w-full h-48 overflow-hidden">
              <img src="/grade_3.png" alt="Grade 3 classroom" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">Grade 3</h3>
              <p className="text-sm text-gray-600 mb-3">Expanding knowledge</p>
              <p className="text-sm text-gray-500 mb-4">
                The Grade 3 curriculum focuses on expanding students' knowledge and developing more sophisticated skills
                across all subject areas. Students engage in deeper inquiry and begin to make connections between
                subjects.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                  <span>4 Subjects</span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                  <span>16 Strands</span>
                </div>
              </div>
              <Link to="/curriculum/grade3-subjects" className="w-full inline-block text-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                View Grade 3 Curriculum
              </Link>
            </div>
          </div>

          {/* Grade 4 */}
          <div className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition-shadow">
            <div className="relative w-full h-48 overflow-hidden">
              <img src="/grade_4.png" alt="Grade 4 classroom" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">Grade 4</h3>
              <p className="text-sm text-gray-600 mb-3">Developing independence</p>
              <p className="text-sm text-gray-500 mb-4">
                The Grade 4 curriculum encourages students to become more independent learners. Students develop
                critical thinking skills and apply their knowledge to solve increasingly complex problems across all
                subject areas.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                  <span>4 Subjects</span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                  <span>16 Strands</span>
                </div>
              </div>
              <Link to="/curriculum/grade4-subjects" className="w-full inline-block text-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                View Grade 4 Curriculum
              </Link>
            </div>
          </div>

          {/* Grade 5 */}
          <div className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition-shadow">
            <div className="relative w-full h-48 overflow-hidden">
              <img src="/grade_5.png" alt="Grade 5 classroom" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">Grade 5</h3>
              <p className="text-sm text-gray-600 mb-3">Applying knowledge</p>
              <p className="text-sm text-gray-500 mb-4">
                The Grade 5 curriculum focuses on applying knowledge in real-world contexts. Students engage in
                project-based learning and develop research skills while preparing for the transition to secondary
                education.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                  <span>4 Subjects</span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                  <span>16 Strands</span>
                </div>
              </div>
              <Link to="/curriculum/grade5-subjects" className="w-full inline-block text-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                View Grade 5 Curriculum
              </Link>
            </div>
          </div>

          {/* Grade 6 */}
          <div className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition-shadow">
            <div className="relative w-full h-48 overflow-hidden">
              <img src="/grade_6.png" alt="Grade 6 classroom" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">Grade 6</h3>
              <p className="text-sm text-gray-600 mb-3">Preparing for secondary education</p>
              <p className="text-sm text-gray-500 mb-4">
                The Grade 6 curriculum prepares students for the transition to secondary education. Students synthesize
                their learning across all subject areas and develop the skills needed for success in higher grades.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                  <span>4 Subjects</span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                  <span>16 Strands</span>
                </div>
              </div>
              <Link to="/curriculum/grade6-subjects" className="w-full inline-block text-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                View Grade 6 Curriculum
              </Link>
            </div>
          </div>

          {/* Enrichment Programmes */}
          <div className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition-shadow">
            <div className="relative w-full h-48 overflow-hidden">
              <img src="/enrichment.png" alt="Enrichment programmes" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">Enrichment Programmes</h3>
              <p className="text-sm text-gray-600 mb-3">Extended learning opportunities</p>
              <p className="text-sm text-gray-500 mb-4">
                Our enrichment programmes provide students with opportunities to explore their interests, develop new skills,
                and engage in challenging activities beyond the regular curriculum. These programmes foster creativity,
                critical thinking, and personal growth.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                  <span>6 Programmes</span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                  <span>12 Activities</span>
                </div>
              </div>
              <Link to="/curriculum/enrichment" className="w-full inline-block text-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                View Enrichment Programmes
              </Link>
            </div>
          </div>

          {/* Digital Skills */}
          <div className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition-shadow">
            <div className="relative w-full h-48 overflow-hidden">
              <img src="/digital_skills.png" alt="Digital skills" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">Digital Skills</h3>
              <p className="text-sm text-gray-600 mb-3">Technology and digital literacy</p>
              <p className="text-sm text-gray-500 mb-4">
                The Digital Skills curriculum equips students with essential technology competencies, digital citizenship,
                and computational thinking skills. Students learn to use technology responsibly and effectively in their
                learning and daily lives.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                  <span>5 Modules</span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                  <span>10 Skills</span>
                </div>
              </div>
              <Link to="https://dl.oecslearning.org/" className="w-full inline-block text-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                View Digital Skills
              </Link>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 text-center py-4 mb-2">Curriculum Resources</h2>
        <p className="text-gray-600 text-center mb-6">Access a rich collection of teaching tools, guides, and materials to support effective classroom instruction.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <div className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition-shadow">
            <div className="relative w-full h-48 overflow-hidden">
              <img src="/tresources.png" alt="Teaching resources" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">Teaching Resources</h3>
              <p className="text-sm text-gray-600 mb-3">Access teaching materials and resources</p>
              <p className="text-sm text-gray-500 mb-4">
                Browse our collection of teaching resources including worksheets, activities, videos, and more to
                support your classroom instruction.
              </p>
              <Link to="/resources" className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Resources
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition-shadow">
            <div className="relative w-full h-48 overflow-hidden">
              <img src="/planner.png" alt="Lesson planning" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">Lesson Planner</h3>
              <p className="text-sm text-gray-600 mb-3">Create and manage lesson plans</p>
              <p className="text-sm text-gray-500 mb-4">
                Use our lesson planner to create, organize, and manage your lesson plans aligned with the OECS
                curriculum standards.
              </p>
              <Link to="/planner" className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <Calendar className="mr-2 h-4 w-4" />
                Go to Planner
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}