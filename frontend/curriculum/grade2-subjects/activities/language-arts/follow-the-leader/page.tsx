import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Clock, Users, BookOpen, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/breadcrumb"

export default function FollowTheLeaderPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade2-subjects/activities/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Language Arts Activities
        </Button>
      </Link>

      <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl shadow-md mb-8">
        <h1 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          Follow the Leader
        </h1>
        <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
          An interactive activity to develop listening comprehension and sequential processing skills.
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
                  <BookOpen className="h-3.5 w-3.5" /> Listening & Speaking
                </Badge>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-purple-700">Overview</h2>
              <p className="mb-6">
                "Follow the Leader" is an engaging activity where students practice following multi-step oral
                instructions to complete tasks or find hidden objects. This activity develops critical listening
                comprehension skills, sequential processing abilities, and attention to detail while being fun and
                interactive.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-purple-700">Learning Objectives</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Develop active listening skills and auditory processing</li>
                <li>Follow multi-step directions in sequence</li>
                <li>Improve memory for verbal instructions</li>
                <li>Enhance spatial awareness and directional concepts</li>
                <li>Build vocabulary related to position and movement</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-purple-700">Materials Needed</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Open space for movement</li>
                <li>Small objects to hide (optional, for treasure hunt variation)</li>
                <li>Direction cards with multi-step instructions (optional)</li>
                <li>Visual aids for directional concepts (optional)</li>
                <li>Clipboard and checklist for teacher assessment</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-purple-700">Preparation</h2>
              <ol className="list-decimal pl-6 mb-6 space-y-2">
                <li>Clear an open space in the classroom or use the playground</li>
                <li>Prepare a list of age-appropriate multi-step directions</li>
                <li>If using the treasure hunt variation, hide objects around the room</li>
                <li>
                  Review directional vocabulary with students (e.g., left, right, forward, backward, beside, between)
                </li>
              </ol>

              <h2 className="text-2xl font-bold mb-4 text-purple-700">Activity Steps</h2>
              <ol className="list-decimal pl-6 mb-6 space-y-3">
                <li>
                  <strong>Introduction (3 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Explain that today's activity focuses on careful listening and following directions</li>
                    <li>Review the importance of listening to all instructions before beginning</li>
                    <li>Demonstrate a simple example with 2-3 steps</li>
                  </ul>
                </li>
                <li>
                  <strong>Basic Follow the Leader (7 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Start with simple 2-step directions (e.g., "Stand up and touch your toes")</li>
                    <li>
                      Gradually increase to 3-4 step directions (e.g., "Walk to the door, turn around three times, and
                      hop back to your seat")
                    </li>
                    <li>Have students take turns being the "leader" who gives directions</li>
                  </ul>
                </li>
                <li>
                  <strong>Treasure Hunt Variation (7 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Divide students into pairs</li>
                    <li>One student gives directions to find a hidden object</li>
                    <li>The partner must listen carefully and follow the directions to find the object</li>
                    <li>Switch roles and repeat</li>
                  </ul>
                </li>
                <li>
                  <strong>Reflection (3 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Discuss which directions were easy or difficult to follow and why</li>
                    <li>Talk about strategies for remembering multi-step directions</li>
                    <li>Connect the activity to real-life situations where following directions is important</li>
                  </ul>
                </li>
              </ol>

              <h2 className="text-2xl font-bold mb-4 text-purple-700">Differentiation</h2>
              <div className="mb-6">
                <p className="font-semibold mb-2">For students who need additional support:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Reduce the number of steps in directions</li>
                  <li>Provide visual cues along with verbal instructions</li>
                  <li>Allow them to repeat the instructions aloud before following them</li>
                  <li>Pair them with a supportive peer</li>
                </ul>

                <p className="font-semibold mb-2">For students who need additional challenge:</p>
                <ul className="list-disc pl-6">
                  <li>Increase the number of steps in directions (5-6 steps)</li>
                  <li>
                    Add conditional elements (e.g., "If the object is red, put it on the shelf; if it's blue, put it in
                    the basket")
                  </li>
                  <li>Include more complex spatial and directional language</li>
                  <li>Have them create elaborate multi-step directions for others</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-purple-700">Assessment</h2>
              <p className="mb-4">Observe and note students' abilities to:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Listen attentively to multi-step directions</li>
                <li>Follow directions in the correct sequence</li>
                <li>Remember all steps without prompting</li>
                <li>Use directional and positional vocabulary correctly</li>
                <li>Give clear, logical directions when in the leader role</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-purple-700">Extensions</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Create a classroom obstacle course with written directions</li>
                <li>Connect to writing by having students write their own multi-step directions</li>
                <li>Incorporate technology by recording audio directions for students to follow</li>
                <li>Create a "Direction Detective" center where students solve direction puzzles</li>
                <li>Integrate with math by including counting or pattern elements in the directions</li>
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
                    src="/children-following-directions.png"
                    alt="Children following directions"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-bold mb-4 text-purple-700">Curriculum Connections</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Listening Comprehension: Processing and following verbal instructions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Spatial Concepts: Understanding positional and directional language</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Sequential Thinking: Following steps in the correct order</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Vocabulary Development: Learning and using directional terms</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4 text-purple-700">Teacher Tips</h3>
                <ul className="space-y-4">
                  <li className="pb-3 border-b border-gray-100">
                    <p className="italic text-gray-600 mb-1">
                      "I use colored tape on the floor to create pathways for students to follow. This adds a visual
                      element that helps my students who need extra support."
                    </p>
                    <p className="text-sm text-right">- Ms. Williams, Grade 2 Teacher</p>
                  </li>
                  <li className="pb-3 border-b border-gray-100">
                    <p className="italic text-gray-600 mb-1">
                      "I connect this activity to our morning routine by giving multi-step directions for unpacking and
                      starting the day. It's great practice and serves a practical purpose!"
                    </p>
                    <p className="text-sm text-right">- Mr. Thompson, Grade 2 Teacher</p>
                  </li>
                  <li>
                    <p className="italic text-gray-600 mb-1">
                      "For assessment, I keep a clipboard handy and note which students consistently follow all steps
                      and which need support with multi-step directions."
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
        <Link href="/curriculum/grade2-subjects/activities/language-arts/storytelling-circle">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous Activity
          </Button>
        </Link>
        <Link href="/curriculum/grade2-subjects/activities/language-arts/sound-detectives">
          <Button>
            Next Activity <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
