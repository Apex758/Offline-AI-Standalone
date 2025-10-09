import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Clock, Users, BookOpen, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/breadcrumb"

export default function VideoClipsPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade2-subjects/activities/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Language Arts Activities
        </Button>
      </Link>

      <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-xl shadow-md mb-8">
        <h1 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Video Clips
        </h1>
        <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
          An engaging activity to develop viewing comprehension, critical thinking, and discussion skills through short
          video content.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <Clock className="h-3.5 w-3.5" /> 20 minutes
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <Users className="h-3.5 w-3.5" /> Whole class or small groups
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <BookOpen className="h-3.5 w-3.5" /> Reading & Viewing
                </Badge>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Overview</h2>
              <p className="mb-6">
                The Video Clips activity engages students in watching and discussing short, age-appropriate video
                content to develop their viewing comprehension skills, critical thinking abilities, and discussion
                techniques. Students learn to analyze visual media, identify key information, make predictions, and
                respond thoughtfully to what they've viewed. This activity helps students become more discerning
                consumers of digital content while building important literacy skills.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Learning Objectives</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Develop active viewing skills and visual literacy</li>
                <li>Enhance comprehension of visual and auditory information</li>
                <li>Practice making predictions and inferences based on video content</li>
                <li>Build vocabulary through exposure to new words and concepts</li>
                <li>Strengthen discussion skills and ability to respond to media</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Materials Needed</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>A selection of age-appropriate, educational video clips (2-5 minutes in length)</li>
                <li>Digital display or projector with audio capabilities</li>
                <li>Viewing guide worksheets (optional)</li>
                <li>Whiteboard or chart paper for recording responses</li>
                <li>Drawing and writing materials for student responses</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Preparation</h2>
              <ol className="list-decimal pl-6 mb-6 space-y-2">
                <li>Select video clips that align with curriculum goals or current topics of study</li>
                <li>Preview all video content to ensure appropriateness and relevance</li>
                <li>Prepare discussion questions for before, during, and after viewing</li>
                <li>Set up and test technology before the lesson</li>
                <li>Create a comfortable viewing area where all students can see and hear</li>
              </ol>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Activity Steps</h2>
              <ol className="list-decimal pl-6 mb-6 space-y-3">
                <li>
                  <strong>Pre-Viewing (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Introduce the topic of the video clip</li>
                    <li>Activate prior knowledge with questions about the subject</li>
                    <li>Set a purpose for viewing (e.g., "Watch for three facts about...")</li>
                    <li>Preview key vocabulary that will appear in the video</li>
                  </ul>
                </li>
                <li>
                  <strong>Viewing (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Play the video clip once through without interruption</li>
                    <li>Observe students' reactions and engagement</li>
                    <li>For longer clips, consider pausing at key moments to check understanding</li>
                  </ul>
                </li>
                <li>
                  <strong>Post-Viewing Discussion (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Ask students to recall key information from the video</li>
                    <li>Discuss the main idea and supporting details</li>
                    <li>Encourage students to make connections to their own experiences</li>
                    <li>Address any questions or misconceptions</li>
                  </ul>
                </li>
                <li>
                  <strong>Response Activity (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Have students complete a follow-up activity based on the video</li>
                    <li>
                      Options include drawing a scene, writing a summary, answering questions, or creating a sequence
                      chart
                    </li>
                    <li>Share responses with partners or small groups</li>
                  </ul>
                </li>
              </ol>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Differentiation</h2>
              <div className="mb-6">
                <p className="font-semibold mb-2">For students who need additional support:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Provide a simplified viewing guide with fewer questions</li>
                  <li>Pre-teach key vocabulary and concepts</li>
                  <li>Allow for multiple viewings of the video</li>
                  <li>Offer sentence starters for discussion and written responses</li>
                </ul>

                <p className="font-semibold mb-2">For students who need additional challenge:</p>
                <ul className="list-disc pl-6">
                  <li>Ask higher-order thinking questions about the content</li>
                  <li>Have students compare and contrast information from multiple sources</li>
                  <li>Encourage students to create their own questions about the video</li>
                  <li>Assign extension research on the topic</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Assessment</h2>
              <p className="mb-4">Observe and note students' abilities to:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Focus attention during viewing</li>
                <li>Recall key information accurately</li>
                <li>Make logical inferences based on what they've seen</li>
                <li>Connect video content to prior knowledge</li>
                <li>Participate meaningfully in discussions</li>
                <li>Complete response activities that demonstrate understanding</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Extensions</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Create a class KWL chart about the video topic</li>
                <li>Have students create their own short videos on related topics</li>
                <li>Compare information from the video with information from books or articles</li>
                <li>Use the video as inspiration for creative writing or art projects</li>
                <li>Create a "Video Review" board where students rate and recommend videos to classmates</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Recommended Video Sources</h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="font-semibold mb-2">Educational Video Resources:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>National Geographic Kids</li>
                  <li>BBC Bitesize</li>
                  <li>PBS Kids</li>
                  <li>Scholastic Watch & Learn Library</li>
                  <li>BrainPOP Jr.</li>
                  <li>Local educational programming</li>
                </ul>

                <p className="font-semibold mb-2">Video Topics for Grade 2:</p>
                <ul className="list-disc pl-6">
                  <li>Animal habitats and adaptations</li>
                  <li>Weather patterns and seasons</li>
                  <li>Community helpers and occupations</li>
                  <li>Cultural celebrations around the world</li>
                  <li>Life cycles of plants and animals</li>
                  <li>Historical figures and events</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="relative h-48 w-full mb-4">
                  <Image
                    src="/video-clips.png"
                    alt="Students watching educational video"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-bold mb-4 text-blue-700">Curriculum Connections</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Visual Literacy: Interpreting meaning from moving images and sound</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Listening Comprehension: Processing and understanding auditory information</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Critical Thinking: Analyzing content and making inferences</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Digital Literacy: Understanding and evaluating media content</span>
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
                      "I create a 'Video Viewing Guide' with simple icons that help my students focus on key elements
                      like characters, setting, problem, and solution while they watch."
                    </p>
                    <p className="text-sm text-right">- Ms. Hernandez, Grade 2 Teacher</p>
                  </li>
                  <li className="pb-3 border-b border-gray-100">
                    <p className="italic text-gray-600 mb-1">
                      "I've found that showing the same video clip twice—once for general understanding and once for
                      specific details—really helps my students process the information more deeply."
                    </p>
                    <p className="text-sm text-right">- Mr. Washington, Grade 2 Teacher</p>
                  </li>
                  <li>
                    <p className="italic text-gray-600 mb-1">
                      "We have a 'Video of the Week' that connects to our current unit of study. Students look forward
                      to it, and it's a great way to build background knowledge on our topics."
                    </p>
                    <p className="text-sm text-right">- Mrs. Chen, Grade 2 Teacher</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Link href="/curriculum/grade2-subjects/activities/language-arts/picture-books">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous Activity
          </Button>
        </Link>
        <Link href="/curriculum/grade2-subjects/activities/language-arts/drawing-stories">
          <Button>
            Next Activity <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
