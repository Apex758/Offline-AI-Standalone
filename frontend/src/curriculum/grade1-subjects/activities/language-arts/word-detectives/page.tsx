import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Search, ListChecks, Users, RotateCcw, CalendarDays } from "lucide-react"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

export default function WordDetectivesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-600">
            Word Detectives
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            A word study activity where students explore high-frequency words and word patterns through engaging
            detective games and hands-on activities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-amber-600" />
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Word Detectives transforms word study into an exciting investigation where students become word sleuths,
                using their analytical skills to discover patterns, decode high-frequency words, and solve spelling
                mysteries. This engaging approach makes abstract word concepts concrete and memorable while building
                essential reading and writing vocabulary. Students learn to recognize word families, spelling patterns,
                and sight words through hands-on exploration and meaningful practice in authentic contexts.
              </p>

              <div className="relative w-full h-64 mb-6 rounded-md overflow-hidden">
                <img src="/children-with-magnifying-glasses-examining-word-ca.png" alt="Word Detectives Activity" className="w-full h-full object-cover" />
              </div>

              <h3 className="text-lg font-semibold mb-2">Learning Outcomes</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Develop automatic recognition of high-frequency sight words</li>
                <li>Discover and understand spelling patterns and word families</li>
                <li>Practice reading, writing, and using words in meaningful contexts</li>
                <li>Build phonics skills through pattern recognition</li>
                <li>Enhance vocabulary through word exploration and investigation</li>
                <li>Develop word analysis and problem-solving strategies</li>
                <li>Strengthen memory and recall of important reading vocabulary</li>
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
                  <strong>ELO 7:</strong> Learners will use their knowledge of spoken language, written language and
                  writing conventions to refine the precision and enhance the meaning and clarity of their written work.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>SCO 7.1-7.5: Develop spelling conventions</li>
                  <li>SCO 7.8-7.10: Develop presentation formats</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-amber-600" />
                Implementation Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-amber-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      1
                    </span>
                    Detective Briefing (5-10 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Introduce the word mystery of the day (word family, sight words, spelling pattern)</li>
                    <li>Present detective tools: magnifying glasses, word cards, letter tiles</li>
                    <li>Explain the investigation mission and success criteria</li>
                    <li>Review detective strategies for word analysis</li>
                    <li>Set up investigation stations with appropriate materials</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-amber-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      2
                    </span>
                    Word Pattern Investigation (15-20 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Guide students to examine word patterns and similarities</li>
                    <li>Use magnetic letters to build and rebuild words</li>
                    <li>Sort words by patterns, families, or characteristics</li>
                    <li>Encourage students to make discoveries and share findings</li>
                    <li>Record patterns and rules on detective investigation charts</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-amber-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      3
                    </span>
                    Detective Games and Activities (15-20 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>
                      <strong>Word Hunt:</strong> Search for target words in books, around the room
                    </li>
                    <li>
                      <strong>Rainbow Writing:</strong> Write words in multiple colors to aid memory
                    </li>
                    <li>
                      <strong>Word Building:</strong> Use letter tiles to construct word families
                    </li>
                    <li>
                      <strong>Memory Games:</strong> Match words with definitions or pictures
                    </li>
                    <li>
                      <strong>Word Puzzles:</strong> Complete crosswords or word searches
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-amber-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      4
                    </span>
                    Application and Practice (10-15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Use discovered words in sentences and short writing pieces</li>
                    <li>Practice reading words in context through guided reading</li>
                    <li>Play word games that reinforce pattern recognition</li>
                    <li>Create personal word detective journals or word banks</li>
                    <li>Connect new words to previously learned vocabulary</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-amber-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      5
                    </span>
                    Case Closed Summary (5 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Review discoveries and patterns found during investigation</li>
                    <li>Add new words to classroom word wall or personal dictionaries</li>
                    <li>Celebrate successful word detective work</li>
                    <li>Preview next investigation focus</li>
                    <li>Assign follow-up practice or homework activities</li>
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
                <RotateCcw className="h-5 w-5 text-amber-600" />
                Investigation Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                  <h3 className="text-md font-semibold mb-1 text-amber-700">Word Family Cases</h3>
                  <p className="text-sm">
                    Investigate words that share common endings (-at, -an, -ig) to discover spelling patterns and build
                    reading fluency.
                  </p>
                </div>

                <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                  <h3 className="text-md font-semibold mb-1 text-yellow-700">Sight Word Mysteries</h3>
                  <p className="text-sm">
                    Focus on high-frequency words that don't follow typical patterns, building automatic recognition
                    through games.
                  </p>
                </div>

                <div className="bg-orange-50 p-3 rounded-md border border-orange-200">
                  <h3 className="text-md font-semibold mb-1 text-orange-700">Spelling Pattern Investigations</h3>
                  <p className="text-sm">
                    Explore spelling rules and patterns (silent e, double letters) through hands-on word manipulation.
                  </p>
                </div>

                <div className="bg-red-50 p-3 rounded-md border border-red-200">
                  <h3 className="text-md font-semibold mb-1 text-red-700">Vocabulary Explorations</h3>
                  <p className="text-sm">
                    Investigate word meanings, synonyms, and connections to build deeper vocabulary understanding.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-600" />
                Differentiation Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-amber-700">For Students Who Excel</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Introduce more complex word patterns and multi-syllabic words</li>
                    <li>Challenge them to find exceptions to spelling rules</li>
                    <li>Have them create word games and activities for classmates</li>
                    <li>Explore word origins and etymology connections</li>
                    <li>Work with advanced vocabulary and academic language</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-amber-700">For Students Who Need Support</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Focus on fewer words with more repetition and practice</li>
                    <li>Use multisensory approaches (tracing, building, saying)</li>
                    <li>Provide picture supports and visual cues</li>
                    <li>Start with very simple, consistent patterns</li>
                    <li>Allow extra time for word recognition and recall</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-amber-700">Language Considerations</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Connect English patterns to similar patterns in home languages</li>
                    <li>Provide extra support for words with sounds not in home language</li>
                    <li>Use cognates and word connections across languages</li>
                    <li>Allow discussion of word meanings in home language first</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-amber-600" />
                Weekly Investigation Focus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-amber-700">Monday: New Pattern Introduction</h3>
                  <p className="text-sm">Introduce new word family or spelling pattern through guided discovery.</p>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-amber-700">Tuesday: Pattern Building</h3>
                  <p className="text-sm">Build and manipulate words using magnetic letters and word cards.</p>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-amber-700">Wednesday: Word Games</h3>
                  <p className="text-sm">Practice through engaging games, sorts, and interactive activities.</p>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-amber-700">Thursday: Application Practice</h3>
                  <p className="text-sm">Use words in reading and writing contexts, rainbow writing, word hunts.</p>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-amber-700">Friday: Assessment and Review</h3>
                  <p className="text-sm">Review the week's patterns, assess understanding, celebrate progress.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-xl shadow-md border border-amber-200 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-amber-800">Detective Tools and Materials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-amber-700">Essential Detective Kit</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Word cards with target vocabulary</li>
              <li>Magnetic letters or letter tiles</li>
              <li>Magnifying glasses for word examination</li>
              <li>Word sort mats and sorting trays</li>
              <li>Rainbow writing materials (colored pencils, markers)</li>
              <li>Word hunt sheets and clipboards</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-amber-700">Investigation Enhancements</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Detective badges and notebooks</li>
              <li>Word building mats with boxes</li>
              <li>Timer for word challenge games</li>
              <li>Pocket charts for word displays</li>
              <li>Word games and puzzles</li>
              <li>Digital word study apps or tools</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Link to="/resources/activities/puppet-show-storytelling">
          <Button variant="outline" className="mr-4 bg-transparent">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous Activity
          </Button>
        </Link>
        <Link to="/resources/activities/reading-response-centers">
          <Button className="bg-amber-600 hover:bg-amber-700">Next Activity: Reading Response Centers</Button>
        </Link>
      </div>
    </div>
  )
}
