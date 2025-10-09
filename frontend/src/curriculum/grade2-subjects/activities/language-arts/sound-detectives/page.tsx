import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Clock, Users, BookOpen, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/breadcrumb"

export default function SoundDetectivesPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade2-subjects/activities/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Language Arts Activities
        </Button>
      </Link>

      <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl shadow-md mb-8">
        <h1 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          Sound Detectives
        </h1>
        <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
          An engaging activity to develop active listening skills, auditory discrimination, and vocabulary.
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
                  <Users className="h-3.5 w-3.5" /> Whole class or small groups
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <BookOpen className="h-3.5 w-3.5" /> Listening & Speaking
                </Badge>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-purple-700">Overview</h2>
              <p className="mb-6">
                "Sound Detectives" is an engaging activity where students listen to recordings of various sounds and
                identify what's making each sound. This activity sharpens students' listening skills, develops their
                auditory discrimination abilities, and expands their vocabulary while encouraging them to make
                connections between sounds and their sources.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-purple-700">Learning Objectives</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Develop focused listening skills and auditory attention</li>
                <li>Improve auditory discrimination and sound identification</li>
                <li>Expand vocabulary related to sounds and their sources</li>
                <li>Practice describing sounds using appropriate adjectives</li>
                <li>Make connections between sounds and real-world objects or events</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-purple-700">Materials Needed</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Audio recordings of various sounds (animals, vehicles, weather, musical instruments, etc.)</li>
                <li>Audio playback device (computer, tablet, or speaker)</li>
                <li>Sound detective worksheets (optional)</li>
                <li>Pictures representing the sounds (optional)</li>
                <li>Writing materials for recording guesses</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-purple-700">Preparation</h2>
              <ol className="list-decimal pl-6 mb-6 space-y-2">
                <li>Collect or create audio recordings of various sounds appropriate for Grade 2 students</li>
                <li>Organize sounds into categories (e.g., animal sounds, household sounds, nature sounds)</li>
                <li>Test audio equipment to ensure good sound quality</li>
                <li>Prepare a response sheet or whiteboard for students to record their guesses</li>
                <li>Create a quiet environment conducive to focused listening</li>
              </ol>

              <h2 className="text-2xl font-bold mb-4 text-purple-700">Activity Steps</h2>
              <ol className="list-decimal pl-6 mb-6 space-y-3">
                <li>
                  <strong>Introduction (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>
                      Explain that today students will be "sound detectives" who solve mysteries by identifying sounds
                    </li>
                    <li>Discuss the importance of careful listening in everyday life</li>
                    <li>
                      Model how to listen attentively and describe a sound (e.g., "That sounds like water dripping—it's
                      a slow, quiet, repeating sound")
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Sound Identification (15 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Play each sound recording for students</li>
                    <li>Have students write or draw their guesses about what's making each sound</li>
                    <li>After each sound, discuss what students heard and reveal the correct answer</li>
                    <li>Encourage students to describe the qualities of each sound (loud/soft, high/low, etc.)</li>
                  </ul>
                </li>
                <li>
                  <strong>Sound Categories (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Group the identified sounds into categories (animal, machine, nature, etc.)</li>
                    <li>Discuss patterns and similarities among sounds in the same category</li>
                    <li>Have students suggest additional sounds that would fit in each category</li>
                  </ul>
                </li>
                <li>
                  <strong>Reflection (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Discuss which sounds were easy or difficult to identify and why</li>
                    <li>Talk about strategies for better listening</li>
                    <li>Connect the activity to everyday situations where sound identification is important</li>
                  </ul>
                </li>
              </ol>

              <h2 className="text-2xl font-bold mb-4 text-purple-700">Differentiation</h2>
              <div className="mb-6">
                <p className="font-semibold mb-2">For students who need additional support:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Provide picture choices to match with each sound</li>
                  <li>Use sounds that are more distinct and easily recognizable</li>
                  <li>Allow students to work with a partner to discuss what they hear</li>
                  <li>Provide clues or categories for the sounds before playing them</li>
                </ul>

                <p className="font-semibold mb-2">For students who need additional challenge:</p>
                <ul className="list-disc pl-6">
                  <li>Include more ambiguous or similar sounds that require careful discrimination</li>
                  <li>Have students create detailed descriptions of the sounds using rich vocabulary</li>
                  <li>Ask students to identify multiple sounds played simultaneously</li>
                  <li>Have them create their own sound recordings for classmates to identify</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-purple-700">Assessment</h2>
              <p className="mb-4">Observe and note students' abilities to:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Listen attentively to sounds without visual cues</li>
                <li>Accurately identify common sounds from their environment</li>
                <li>Use descriptive language to explain the qualities of sounds</li>
                <li>Make logical connections between sounds and their sources</li>
                <li>Categorize sounds based on common characteristics</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-purple-700">Extensions</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Create a sound walk around the school, identifying and recording sounds heard</li>
                <li>Have students create a "sound map" of the classroom or playground</li>
                <li>Connect to writing by having students write sound poems or stories inspired by sounds</li>
                <li>Create a sound matching game for a listening center</li>
                <li>Integrate with science by exploring how sounds are made and travel</li>
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
                    src="/children-sound-identification.png"
                    alt="Children identifying sounds"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-bold mb-4 text-purple-700">Curriculum Connections</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Auditory Processing: Discriminating between similar sounds</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Vocabulary Development: Learning words to describe sounds</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Critical Thinking: Making connections between sounds and sources</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Science Connection: Understanding how sounds are produced</span>
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
                      "I create a 'mystery sound box' with objects inside that make distinctive sounds when shaken or
                      manipulated. Students love trying to guess what's inside based just on the sound."
                    </p>
                    <p className="text-sm text-right">- Ms. Rodriguez, Grade 2 Teacher</p>
                  </li>
                  <li className="pb-3 border-b border-gray-100">
                    <p className="italic text-gray-600 mb-1">
                      "I use this activity as a transition between subjects. Playing a quick sound and having students
                      identify it helps them refocus their attention."
                    </p>
                    <p className="text-sm text-right">- Mr. Lee, Grade 2 Teacher</p>
                  </li>
                  <li>
                    <p className="italic text-gray-600 mb-1">
                      "For students who are learning English, I pair sound identification with picture cards to help
                      build vocabulary connections."
                    </p>
                    <p className="text-sm text-right">- Mrs. Sharma, Grade 2 Teacher</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Link href="/curriculum/grade2-subjects/activities/language-arts/follow-the-leader">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous Activity
          </Button>
        </Link>
        <Link href="/curriculum/grade2-subjects/activities/language-arts/reading-buddies">
          <Button>
            Next Activity <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
