import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Ear, Pencil } from "lucide-react"

export default function Grade1CurriculumPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Grade 1 Language Arts Curriculum</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Language is the foundation of communication and the primary instrument of thought. The study of Language Arts
          provides access to multiple and inter-related oral, aural, written, and visual ways of representing,
          exploring, problem solving, communicating and sharing meaning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Ear className="h-5 w-5" />
              Listening and Speaking
            </CardTitle>
            <CardDescription>Foundational for all learning and communication</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">
              The strategies and skills of listening and speaking allow learners to contribute meaningfully to social
              environments. As learners receive, reflect on, and communicate ideas, they develop increasing proficiency
              in cognitive organization, critical thinking, and problem-solving.
            </p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Link href="/curriculum/grade1/listening-speaking">
              <Button className="w-full">View Strand</Button>
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Reading and Viewing
            </CardTitle>
            <CardDescription>Meaning-making and problem solving activities</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">
              Reading and viewing provide opportunities to interact with a wide range of written and visual text for a
              variety of purposes. Readers learn to integrate strategies and skills as they develop thoughtful and
              critical understanding of text.
            </p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Link href="/curriculum/grade1/reading-viewing">
              <Button className="w-full">View Strand</Button>
            </Link>
          </div>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Writing and Representing
            </CardTitle>
            <CardDescription>Communication through various formats</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4">
              Writing and Representing strategies and skills provide opportunities for learners to communicate with
              their peers and other meaningful audiences using paper and digital formats. The process includes planning,
              organizing, revising, refining, and sharing feedback.
            </p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Link href="/curriculum/grade1/writing-representing">
              <Button className="w-full">View Strand</Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">About the Curriculum</h2>
        <p className="mb-4">
          This curriculum is designed to develop students' language skills through an integrated approach. The three
          strands—Listening and Speaking, Reading and Viewing, and Writing and Representing—are interconnected and
          support each other in the development of literacy.
        </p>
        <p>
          Each strand includes Essential Learning Outcomes (ELOs), Specific Curriculum Outcomes (SCOs), assessment
          strategies, and learning strategies to guide instruction and learning.
        </p>
      </div>
    </div>
  )
}
