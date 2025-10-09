import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Clock, Users, BookOpen, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/breadcrumb"

export default function DrawingStoriesPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade2-subjects/activities/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Language Arts Activities
        </Button>
      </Link>

      <div className="bg-gradient-to-r from-green-100 to-teal-100 p-6 rounded-xl shadow-md mb-8">
        <h1 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">
          Drawing Stories
        </h1>
        <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
          An engaging activity to develop visualization, comprehension, and creative expression through artistic
          representation of stories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <Clock className="h-3.5 w-3.5" /> 30 minutes
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <Users className="h-3.5 w-3.5" /> Individual
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <BookOpen className="h-3.5 w-3.5" /> Writing & Representing
                </Badge>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Overview</h2>
              <p className="mb-6">
                The Drawing Stories activity engages students in creating visual representations of stories they have
                read or heard. Students use drawing as a way to demonstrate comprehension, visualize narrative elements,
                and express their understanding of characters, settings, and plot. This activity helps students develop
                their visualization skills, deepen their comprehension of texts, and explore creative ways to represent
                and communicate their understanding.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Learning Objectives</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Develop visualization skills by creating mental images from text</li>
                <li>Demonstrate comprehension of story elements through artistic representation</li>
                <li>Enhance recall and sequencing of narrative events</li>
                <li>Express understanding of character traits, settings, and plot through visual means</li>
                <li>Connect visual and written forms of storytelling</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Materials Needed</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Drawing paper (white or colored)</li>
                <li>Coloring supplies (crayons, colored pencils, markers)</li>
                <li>Story books or prepared stories to read aloud</li>
                <li>Story sequence frames (optional)</li>
                <li>Sample drawings to use as models (optional)</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Preparation</h2>
              <ol className="list-decimal pl-6 mb-6 space-y-2">
                <li>Select age-appropriate stories with vivid descriptions and clear narrative structure</li>
                <li>Prepare drawing materials and ensure each student has access to supplies</li>
                <li>Create a display area for sharing completed work</li>
                <li>Prepare story sequence frames if using them (divided paper for beginning, middle, end)</li>
                <li>Set up a comfortable area for reading aloud or listening to stories</li>
              </ol>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Activity Steps</h2>
              <ol className="list-decimal pl-6 mb-6 space-y-3">
                <li>
                  <strong>Introduction (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Explain that good readers create pictures in their minds as they read</li>
                    <li>Discuss how illustrators help readers understand stories through pictures</li>
                    <li>Share that students will be creating their own illustrations for a story</li>
                  </ul>
                </li>
                <li>
                  <strong>Story Presentation (10 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Read a story aloud to students or have them read independently</li>
                    <li>For read-alouds, avoid showing illustrations initially to encourage visualization</li>
                    <li>Pause at key moments to ask students what they're picturing in their minds</li>
                    <li>After reading, discuss important story elements (characters, setting, problem, solution)</li>
                  </ul>
                </li>
                <li>
                  <strong>Drawing Activity (10 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Distribute drawing materials to students</li>
                    <li>Instruct students to draw their favorite part of the story or a sequence of events</li>
                    <li>Encourage inclusion of important details from the text</li>
                    <li>Circulate and provide support, asking questions to prompt deeper thinking</li>
                  </ul>
                </li>
                <li>
                  <strong>Sharing and Discussion (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Have students share their drawings with partners or small groups</li>
                    <li>Ask students to explain why they chose to draw that particular scene</li>
                    <li>Compare different interpretations of the same story</li>
                    <li>Display drawings in the classroom or compile into a class book</li>
                  </ul>
                </li>
              </ol>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Differentiation</h2>
              <div className="mb-6">
                <p className="font-semibold mb-2">For students who need additional support:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Provide story frames with labeled sections for beginning, middle, and end</li>
                  <li>Offer sentence starters to help explain their drawings</li>
                  <li>Use stories with simpler plots and fewer characters</li>
                  <li>Allow students to work with a partner to discuss ideas before drawing</li>
                </ul>

                <p className="font-semibold mb-2">For students who need additional challenge:</p>
                <ul className="list-disc pl-6">
                  <li>Have students create a multi-panel comic strip showing sequence of events</li>
                  <li>Ask them to include speech bubbles or thought bubbles for characters</li>
                  <li>Encourage them to draw from multiple perspectives or points of view</li>
                  <li>Challenge them to create an alternative ending and illustrate it</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Assessment</h2>
              <p className="mb-4">Observe and note students' abilities to:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Include key story elements in their drawings</li>
                <li>Represent characters and settings accurately based on text descriptions</li>
                <li>Demonstrate understanding of the story's sequence and plot</li>
                <li>Explain their artistic choices and connect them to the text</li>
                <li>Show attention to detail and evidence of visualization</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Extensions</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Add captions or short paragraphs to accompany drawings</li>
                <li>Create a class book with illustrations from the same story</li>
                <li>Compare student drawings with the illustrator's pictures (if available)</li>
                <li>Use drawings as storyboards for dramatic reenactments</li>
                <li>Create a gallery walk where students view and comment on each other's work</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Variations</h2>
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <p className="font-semibold mb-2">Different Approaches to Drawing Stories:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    <strong>Story Map:</strong> Draw a map showing where events in the story take place
                  </li>
                  <li>
                    <strong>Character Portrait:</strong> Create detailed drawings of main characters with labeled traits
                  </li>
                  <li>
                    <strong>Story Timeline:</strong> Draw a series of small pictures showing the sequence of events
                  </li>
                  <li>
                    <strong>Before and After:</strong> Draw how a character or setting changes from beginning to end
                  </li>
                  <li>
                    <strong>Story Elements Collage:</strong> Create a collage representing different elements of the
                    story
                  </li>
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
                    src="/drawing-stories.png"
                    alt="Students drawing story illustrations"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-bold mb-4 text-green-700">Curriculum Connections</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Reading Comprehension: Visualizing and interpreting text</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Visual Arts: Using drawing to express ideas and understanding</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Oral Language: Discussing and explaining artistic choices</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Story Elements: Identifying and representing characters, setting, and plot</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4 text-green-700">Teacher Tips</h3>
                <ul className="space-y-4">
                  <li className="pb-3 border-b border-gray-100">
                    <p className="italic text-gray-600 mb-1">
                      "I create a 'visualization anchor chart' with prompts like 'What do you see? Hear? Smell? Feel?'
                      to help students create richer mental images before drawing."
                    </p>
                    <p className="text-sm text-right">- Ms. Torres, Grade 2 Teacher</p>
                  </li>
                  <li className="pb-3 border-b border-gray-100">
                    <p className="italic text-gray-600 mb-1">
                      "For students who are reluctant artists, I remind them that drawing is about showing their
                      understanding, not creating perfect pictures. Stick figures are perfectly acceptable!"
                    </p>
                    <p className="text-sm text-right">- Mr. Campbell, Grade 2 Teacher</p>
                  </li>
                  <li>
                    <p className="italic text-gray-600 mb-1">
                      "We create 'Story Drawing Journals' where students regularly illustrate stories we read. It's
                      amazing to see how their visualization skills and attention to detail improve over time."
                    </p>
                    <p className="text-sm text-right">- Mrs. Patel, Grade 2 Teacher</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Link href="/curriculum/grade2-subjects/activities/language-arts/video-clips">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous Activity
          </Button>
        </Link>
        <Link href="/curriculum/grade2-subjects/activities/language-arts/writing-journal">
          <Button>
            Next Activity <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
