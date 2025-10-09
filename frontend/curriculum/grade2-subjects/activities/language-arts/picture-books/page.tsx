import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Clock, Users, BookOpen, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/breadcrumb"

export default function PictureBooksPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade2-subjects/activities/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Language Arts Activities
        </Button>
      </Link>

      <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-xl shadow-md mb-8">
        <h1 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Picture Books
        </h1>
        <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
          An engaging activity to develop visual literacy, descriptive language skills, and comprehension through
          picture exploration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <Clock className="h-3.5 w-3.5" /> 25 minutes
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <Users className="h-3.5 w-3.5" /> Individual or pairs
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <BookOpen className="h-3.5 w-3.5" /> Reading & Viewing
                </Badge>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Overview</h2>
              <p className="mb-6">
                The Picture Books activity engages students in exploring wordless or minimal-text picture books to
                develop their visual literacy skills, descriptive language, and comprehension abilities. Students
                examine illustrations to interpret meaning, make predictions, and create their own narratives based on
                the visual elements. This activity fosters creativity, critical thinking, and a deeper appreciation for
                how images can tell stories.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Learning Objectives</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Develop visual literacy skills by interpreting meaning from illustrations</li>
                <li>Enhance descriptive language through detailed observation and discussion</li>
                <li>Practice making predictions and inferences based on visual cues</li>
                <li>Create and articulate narratives inspired by images</li>
                <li>Understand the relationship between text and illustrations in storytelling</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Materials Needed</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>A selection of wordless picture books or picture books with minimal text</li>
                <li>Drawing paper and coloring supplies</li>
                <li>Writing materials for older or more advanced students</li>
                <li>Document camera or digital display (optional, for group viewing)</li>
                <li>Recording device (optional, for capturing student narratives)</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Preparation</h2>
              <ol className="list-decimal pl-6 mb-6 space-y-2">
                <li>Select a variety of picture books appropriate for Grade 2 students</li>
                <li>Create a comfortable reading area where students can view books individually or in pairs</li>
                <li>Prepare simple graphic organizers for students to record observations (optional)</li>
                <li>Set up a display area for sharing student work</li>
                <li>Create a list of prompting questions to guide student observations</li>
              </ol>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Activity Steps</h2>
              <ol className="list-decimal pl-6 mb-6 space-y-3">
                <li>
                  <strong>Introduction (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Gather students and explain that pictures can tell stories without words</li>
                    <li>Demonstrate how to "read" a picture by pointing out details in an illustration</li>
                    <li>Model how to describe what you see and what might be happening in the picture</li>
                  </ul>
                </li>
                <li>
                  <strong>Picture Exploration (10 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Distribute picture books to individuals or pairs</li>
                    <li>Instruct students to look carefully at each page without reading any text</li>
                    <li>Encourage them to notice details in the illustrations</li>
                    <li>Have students discuss what they see with a partner</li>
                  </ul>
                </li>
                <li>
                  <strong>Storytelling (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Ask students to create their own story based on the pictures</li>
                    <li>Provide prompts: "What is happening in this picture? What might happen next?"</li>
                    <li>For students working in pairs, have them take turns adding to the story</li>
                  </ul>
                </li>
                <li>
                  <strong>Sharing and Discussion (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Invite several students to share their picture book and tell their story</li>
                    <li>Compare different interpretations of the same book (if applicable)</li>
                    <li>Discuss how illustrations provide clues about characters, setting, and plot</li>
                  </ul>
                </li>
              </ol>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Differentiation</h2>
              <div className="mb-6">
                <p className="font-semibold mb-2">For students who need additional support:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Provide books with simpler illustrations and clearer narrative sequences</li>
                  <li>Offer sentence starters to help describe what they see</li>
                  <li>Work in small teacher-guided groups to model observation skills</li>
                  <li>Use a picture walk approach with more structured guiding questions</li>
                </ul>

                <p className="font-semibold mb-2">For students who need additional challenge:</p>
                <ul className="list-disc pl-6">
                  <li>Provide books with more complex illustrations and subtle details</li>
                  <li>Encourage them to write their stories based on the illustrations</li>
                  <li>Ask them to consider multiple perspectives (different characters' viewpoints)</li>
                  <li>Challenge them to create alternative endings or sequels to the stories</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Assessment</h2>
              <p className="mb-4">Observe and note students' abilities to:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Identify key details in illustrations</li>
                <li>Make logical inferences based on visual information</li>
                <li>Create coherent narratives that align with the illustrations</li>
                <li>Use descriptive language when discussing pictures</li>
                <li>Demonstrate understanding of story elements (character, setting, problem, solution)</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Extensions</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Have students create their own wordless picture books</li>
                <li>Record students narrating their stories and create digital talking books</li>
                <li>Compare a wordless version of a story with the text version</li>
                <li>Create a class book where each student contributes one page</li>
                <li>Use picture books as inspiration for drama activities</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="relative h-48 w-full mb-4">
                  <Image
                    src="/picture-books.png"
                    alt="Students exploring picture books"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-bold mb-4 text-blue-700">Curriculum Connections</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Visual Literacy: Interpreting meaning from images</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Oral Language: Developing descriptive vocabulary</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Comprehension: Making inferences and predictions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Creativity: Generating original stories from visual prompts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4 text-blue-700">Teacher Tips</h3>
                <ul className="space-y-4">
                  <li className="pb-3 border-b border-gray-100">
                    <p className="italic text-gray-600 mb-1">
                      "I create a 'Picture Book of the Week' display where we focus on one book's illustrations in
                      depth. Students love becoming experts on the visual details of their favorite books."
                    </p>
                    <p className="text-sm text-right">- Ms. Rivera, Grade 2 Teacher</p>
                  </li>
                  <li className="pb-3 border-b border-gray-100">
                    <p className="italic text-gray-600 mb-1">
                      "For my English language learners, picture books provide a wonderful opportunity to develop
                      vocabulary without the pressure of decoding text. I've seen tremendous growth in their descriptive
                      language."
                    </p>
                    <p className="text-sm text-right">- Mr. Patel, Grade 2 Teacher</p>
                  </li>
                  <li>
                    <p className="italic text-gray-600 mb-1">
                      "I take photos of our classroom activities and create our own picture books. Students love
                      'reading' stories about themselves and their classmates!"
                    </p>
                    <p className="text-sm text-right">- Mrs. Johnson, Grade 2 Teacher</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Link href="/curriculum/grade2-subjects/activities/language-arts/reading-buddies">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous Activity
          </Button>
        </Link>
        <Link href="/curriculum/grade2-subjects/activities/language-arts/video-clips">
          <Button>
            Next Activity <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
