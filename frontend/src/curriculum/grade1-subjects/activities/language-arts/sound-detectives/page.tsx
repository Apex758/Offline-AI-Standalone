import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Volume2, ListChecks, Users, RotateCcw, CalendarDays } from "lucide-react"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

export default function SoundDetectivesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-orange-100 to-red-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
            Sound Detectives
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            An interactive phonological awareness activity that develops students' ability to identify, isolate, and
            manipulate sounds in words through engaging detective games.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-orange-600" />
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Sound Detectives transforms phonological awareness instruction into an exciting investigation where
                students become sound detectives, using their listening skills to solve phonetic mysteries. This
                multi-sensory approach engages students in identifying initial sounds, finding rhyming words, blending
                sounds together, and segmenting words into individual phonemes. The detective theme adds motivation and
                makes abstract sound concepts concrete and memorable for young learners.
              </p>

              <div className="relative w-full h-64 mb-6 rounded-md overflow-hidden">
                <img src="/children-wearing-detective-hats-playing-with-sound.png" alt="Sound Detectives Activity" className="w-full h-full object-cover" />
              </div>

              <h3 className="text-lg font-semibold mb-2">Learning Outcomes</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Develop phonological awareness through sound identification and manipulation</li>
                <li>Practice isolating initial, medial, and final sounds in words</li>
                <li>Strengthen rhyming recognition and production skills</li>
                <li>Build sound blending and segmentation abilities</li>
                <li>Enhance auditory discrimination and listening skills</li>
                <li>Prepare for phonics instruction and reading development</li>
                <li>Increase phonemic awareness through playful activities</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Curriculum Connections</h3>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>ELO 4:</strong> Learners will select and use appropriate strategies and cueing systems to
                  construct meaning when reading and viewing.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>SCO 4.1: Use strategies and cues</li>
                  <li>SCO 4.2: Use phonics and structural analysis</li>
                  <li>SCO 4.3: Use semantic and syntactic cues</li>
                </ul>
              </div>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>ELO 1:</strong> Learners will speak and listen to explore, extend, clarify and reflect on
                  their thoughts, ideas, feelings and experiences.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>SCO 1.1: Communicate information and ideas effectively</li>
                  <li>SCO 1.2: Listen critically to others' ideas</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-orange-600" />
                Implementation Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-orange-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      1
                    </span>
                    Detective Setup (5 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Introduce the Sound Detective theme with props (magnifying glasses, detective hats)</li>
                    <li>Explain that detectives use their ears to solve sound mysteries</li>
                    <li>Set up sound boxes, picture cards, and letter tiles in investigation stations</li>
                    <li>Create a "case board" to display the day's sound mystery</li>
                    <li>Distribute detective badges or notebooks for recording findings</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-orange-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      2
                    </span>
                    Sound Mystery Introduction (5-10 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Present the day's sound case: "The Case of the Missing Initial Sound"</li>
                    <li>Demonstrate the target skill with clear examples</li>
                    <li>Model detective thinking: "I hear /b/ at the beginning of 'ball'"</li>
                    <li>Practice with 2-3 examples as a whole group</li>
                    <li>Explain the investigation procedures and expectations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-orange-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      3
                    </span>
                    Detective Investigation Stations (15-20 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>
                      <strong>Initial Sound Station:</strong> Sort pictures by beginning sounds
                    </li>
                    <li>
                      <strong>Rhyme Time Station:</strong> Match rhyming pairs and create new rhymes
                    </li>
                    <li>
                      <strong>Sound Boxes Station:</strong> Use counters to represent sounds in words
                    </li>
                    <li>
                      <strong>Blending Station:</strong> Combine individual sounds to make words
                    </li>
                    <li>
                      <strong>Segmenting Station:</strong> Break words apart into individual sounds
                    </li>
                    <li>Rotate students through stations every 3-4 minutes</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-orange-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      4
                    </span>
                    Detective Games (10-15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>
                      <strong>Sound Hunt:</strong> Find objects in the room with target sounds
                    </li>
                    <li>
                      <strong>Mystery Word:</strong> Guess words from sound clues
                    </li>
                    <li>
                      <strong>Rhyme Detective:</strong> Identify the word that doesn't rhyme
                    </li>
                    <li>
                      <strong>Sound Swap:</strong> Change one sound to make a new word
                    </li>
                    <li>
                      <strong>Clapping Syllables:</strong> Solve how many beats are in mystery words
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-orange-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      5
                    </span>
                    Case Closed Celebration (5 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Gather detectives to share their sound discoveries</li>
                    <li>Review the target skill and celebrate successful investigations</li>
                    <li>Award detective certificates for participation and effort</li>
                    <li>Preview tomorrow's sound mystery to build anticipation</li>
                    <li>Sing a detective song or chant to conclude</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-orange-600" />
                Detective Case Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-orange-50 p-3 rounded-md border border-orange-200">
                  <h3 className="text-md font-semibold mb-1 text-orange-700">Initial Sound Cases</h3>
                  <p className="text-sm">
                    Investigate words that begin with the same sound. Sort pictures, find classroom objects, or play "I
                    Spy" with beginning sounds.
                  </p>
                </div>

                <div className="bg-red-50 p-3 rounded-md border border-red-200">
                  <h3 className="text-md font-semibold mb-1 text-red-700">Rhyming Mysteries</h3>
                  <p className="text-sm">
                    Solve rhyming puzzles by matching words that sound alike at the end. Create rhyming chains and
                    identify rhyme imposters.
                  </p>
                </div>

                <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                  <h3 className="text-md font-semibold mb-1 text-yellow-700">Blending Investigations</h3>
                  <p className="text-sm">
                    Put sound clues together to discover mystery words. Start with /c/-/a/-/t/ to solve "cat."
                  </p>
                </div>

                <div className="bg-pink-50 p-3 rounded-md border border-pink-200">
                  <h3 className="text-md font-semibold mb-1 text-pink-700">Segmenting Cases</h3>
                  <p className="text-sm">
                    Break words into their sound parts using sound boxes and counters. Discover how many sounds hide in
                    each word.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                Differentiation Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-orange-700">For Students Who Excel</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Introduce medial and final sound identification</li>
                    <li>Challenge with consonant blends and digraphs</li>
                    <li>Create their own sound detective cases for classmates</li>
                    <li>Work with longer, multi-syllabic words</li>
                    <li>Lead detective games as junior investigators</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-orange-700">For Students Who Need Support</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Focus on initial sounds with very distinct differences</li>
                    <li>Use visual and tactile supports (hand gestures, mouth movements)</li>
                    <li>Provide fewer choices in sorting activities</li>
                    <li>Work with shorter, familiar words</li>
                    <li>Allow extra processing time and repetition</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-orange-700">Language Considerations</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Be aware of sounds that may not exist in students' home languages</li>
                    <li>Use familiar vocabulary from students' experiences</li>
                    <li>Allow practice with sounds in home language first</li>
                    <li>Provide visual mouth position cards for difficult sounds</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-orange-600" />
                Weekly Case Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-orange-700">Monday: Initial Sound Cases</h3>
                  <p className="text-sm">Focus on beginning sounds with picture sorts and sound hunts.</p>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-orange-700">Tuesday: Rhyming Mysteries</h3>
                  <p className="text-sm">Investigate rhyming patterns and create rhyming families.</p>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-orange-700">Wednesday: Blending Investigations</h3>
                  <p className="text-sm">Practice putting sounds together to solve word mysteries.</p>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-orange-700">Thursday: Segmenting Cases</h3>
                  <p className="text-sm">Break words apart into individual sound components.</p>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-orange-700">Friday: Mixed Mystery Review</h3>
                  <p className="text-sm">Combine all detective skills in challenging mixed cases.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-orange-50 p-6 rounded-xl shadow-md border border-orange-200 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-orange-800">Detective Tools and Materials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-orange-700">Essential Detective Kit</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Magnifying glasses (real or toy)</li>
              <li>Detective hats or badges</li>
              <li>Picture cards for sound sorting</li>
              <li>Sound boxes (3-4 boxes per student)</li>
              <li>Counters or small manipulatives</li>
              <li>Letter tiles or magnetic letters</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-orange-700">Optional Enhancements</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Detective notebooks for recording findings</li>
              <li>Case board or investigation chart</li>
              <li>Timer for timed sound challenges</li>
              <li>Rhyming picture pairs</li>
              <li>Sound mystery boxes with objects</li>
              <li>Detective theme music or sound effects</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Link to="/resources/activities/story-sequence-cards">
          <Button variant="outline" className="mr-4 bg-transparent">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous Activity
          </Button>
        </Link>
        <Link to="/resources/activities/interactive-writing">
          <Button className="bg-orange-600 hover:bg-orange-700">Next Activity: Interactive Writing</Button>
        </Link>
      </div>
    </div>
  )
}
