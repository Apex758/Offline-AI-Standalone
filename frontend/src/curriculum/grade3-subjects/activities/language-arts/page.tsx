import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Headphones, Eye, PenTool, MessageSquare, BookOpen } from "lucide-react"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

export default function Grade3LanguageArtsActivitiesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Grade 3 Language Arts Activities
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Explore these engaging activities designed to develop essential language arts skills through listening,
            speaking, reading, viewing, writing, and representing. Each activity aligns with curriculum standards and
            provides opportunities for meaningful learning experiences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-purple-500 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Headphones className="h-5 w-5" />
              Storytelling Circle
            </CardTitle>
            <CardDescription>Develop listening and speaking skills</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
              <img src="/storytelling-circle.png" alt="Storytelling Circle" className="w-full h-full object-cover" />
            </div>
            <p className="mb-4">
              Students take turns sharing stories based on personal experiences, cultural tales, or creative prompts.
              This interactive activity builds oral language skills, active listening, and confidence in public
              speaking.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">Speaking</span>
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">Listening</span>
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Cultural Appreciation
              </span>
            </div>
            <Link to="/curriculum/grade3-subjects/activities/language-arts/storytelling-circle">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">View Activity</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Eye className="h-5 w-5" />
              Reading Response Journals
            </CardTitle>
            <CardDescription>Deepen reading comprehension and critical thinking</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
              <img src="/reading-response-journals.png" alt="Reading Response Journals" className="w-full h-full object-cover" />
            </div>
            <p className="mb-4">
              Students maintain journals to record their thoughts, questions, and connections to texts they read. This
              activity encourages deeper engagement with reading materials and develops critical thinking skills.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Reading</span>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Writing</span>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Comprehension</span>
            </div>
            <Link to="/curriculum/grade3-subjects/activities/language-arts/reading-response-journals">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">View Activity</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-green-500 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <PenTool className="h-5 w-5" />
              Authors' Workshop
            </CardTitle>
            <CardDescription>Develop writing skills through the writing process</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
              <img src="/authors-workshop.png" alt="Authors" className="w-full h-full object-cover" />
            </div>
            <p className="mb-4">
              Students engage in the complete writing process: brainstorming, drafting, revising, editing, and
              publishing. This structured approach helps develop organization, voice, and writing conventions.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Writing</span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Editing</span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Creativity</span>
            </div>
            <Link to="/curriculum/grade3-subjects/activities/language-arts/authors-workshop">
              <Button className="w-full bg-green-600 hover:bg-green-700">View Activity</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-amber-500 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <MessageSquare className="h-5 w-5" />
              Reader's Theater
            </CardTitle>
            <CardDescription>Enhance fluency and expression through dramatic reading</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
              <img src="/readers-theater-children.png" alt="Reader" className="w-full h-full object-cover" />
            </div>
            <p className="mb-4">
              Students perform dramatic readings of scripts, focusing on expression, fluency, and character voices. This
              activity builds confidence in public speaking and deepens understanding of dialogue and narrative.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded">Fluency</span>
              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded">Expression</span>
              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Collaboration
              </span>
            </div>
            <Link to="/curriculum/grade3-subjects/activities/language-arts/readers-theater">
              <Button className="w-full bg-amber-600 hover:bg-amber-700">View Activity</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-pink-500 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-pink-700">
              <BookOpen className="h-5 w-5" />
              Vocabulary Detective
            </CardTitle>
            <CardDescription>Build vocabulary through context and word study</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
              <img src="/vocab-detective.png" alt="Vocabulary Detective" className="w-full h-full object-cover" />
            </div>
            <p className="mb-4">
              Students become "word detectives," investigating new vocabulary through context clues, word parts, and
              dictionaries. They collect words, determine meanings, and use them in their speaking and writing.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded">Vocabulary</span>
              <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded">Word Study</span>
              <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded">Research</span>
            </div>
            <Link to="/curriculum/grade3-subjects/activities/language-arts/vocabulary-detective">
              <Button className="w-full bg-pink-600 hover:bg-pink-700">View Activity</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-t-4 border-teal-500 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-teal-700">
              <PenTool className="h-5 w-5" />
              Cultural Poetry Exploration
            </CardTitle>
            <CardDescription>Celebrate cultural diversity through poetry</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
              <img src="/diverse-children-poetry.png" alt="Cultural Poetry Exploration" className="w-full h-full object-cover" />
            </div>
            <p className="mb-4">
              Students explore poetry from diverse cultures, analyzing structures, themes, and language. They create
              their own poems inspired by cultural traditions, celebrating home languages and heritage.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded">Poetry</span>
              <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Cultural Studies
              </span>
              <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Creative Writing
              </span>
            </div>
            <Link to="/curriculum/grade3-subjects/activities/language-arts/cultural-poetry">
              <Button className="w-full bg-teal-600 hover:bg-teal-700">View Activity</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Implementing Language Arts Activities</h2>
        <p className="mb-4 text-gray-700">
          These activities are designed to support the Grade 3 Language Arts curriculum by providing engaging, hands-on
          learning experiences across all language domains. Each activity can be adapted to meet the diverse needs of
          students and integrated with other subject areas.
        </p>
        <p className="text-gray-700">
          Teachers are encouraged to use these activities as starting points and modify them based on student interests,
          available resources, and learning goals. Regular assessment through observations, conversations, and student
          products will help track progress and inform instruction.
        </p>
      </div>
    </div>
  )
}
