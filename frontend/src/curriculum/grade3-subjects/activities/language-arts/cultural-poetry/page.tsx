import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, MessageSquare, BookOpen, Users, Mic, FileText } from "lucide-react"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

export default function CulturalPoetryPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-teal-100 to-cyan-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-600">
            Cultural Poetry Exploration
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            A creative journey through diverse poetic traditions that celebrates cultural heritage, language diversity,
            and personal expression through the power of verse.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-teal-600" />
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Cultural Poetry Exploration is an immersive literacy activity where students discover, analyze, and create
                poems that reflect their cultural heritage and diverse linguistic traditions. Through reading, writing,
                and performing poetry, students develop appreciation for various forms of language while building
                fluency, comprehension, and creative expression skills.
              </p>

              <div className="relative w-full h-64 mb-6 rounded-md overflow-hidden">
                <img src="./diverse-children-poetry.png" alt="Cultural Poetry Exploration Activity" className="w-full h-full object-cover" />
              </div>

              <h3 className="text-lg font-semibold mb-2">Learning Outcomes</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Develop appreciation for diverse poetic traditions and cultural expressions</li>
                <li>Enhance reading fluency through rhythmic and expressive poetry reading</li>
                <li>Build comprehension through analysis of figurative language and imagery</li>
                <li>Strengthen creative writing skills through poetry composition</li>
                <li>Foster cultural pride and respect for linguistic diversity</li>
                <li>Improve oral presentation skills through poetry recitation</li>
                <li>Connect personal experiences to universal themes in poetry</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Curriculum Connections</h3>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>ELO 1:</strong> Learners will explore, use, and critically apply oral language for pleasure,
                  personal growth, to foster relationships and to develop an appreciation and celebration of culture and
                  oral languages.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    SCO 1.22: Participate in the sharing of culturally relevant songs, raps, drama, and poetry with
                    fluency, rhythm, and pace
                  </li>
                  <li>
                    SCO 1.23: Continue to develop understanding of how and when to adjust volume, projection, facial
                    expressions, gestures, and tone of voice to the speaking occasion
                  </li>
                  <li>
                    SCO 1.24: Develop appreciation for various forms of language and their cultural significance
                  </li>
                </ul>
              </div>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>ELO 4:</strong> Learners will respond to a variety of texts in meaningful ways, demonstrating
                  understanding and appreciation of how authors use language to create meaning and impact.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>SCO 4.15: Recognize how illustrations, fonts, and language structures engage the reader</li>
                  <li>
                    SCO 4.16: Experiment with figurative language to enhance understanding and appreciation of texts
                  </li>
                  <li>
                    SCO 4.17: Respond to texts through creative expression, including art, drama, and writing
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-teal-600" />
                Implementation Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-teal-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      1
                    </span>
                    Introduction to Cultural Poetry (Day 1, 30 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Introduce the concept of cultural poetry through examples from various traditions</li>
                    <li>Share poems from Caribbean, African, Asian, and other cultural backgrounds</li>
                    <li>Discuss how poetry reflects cultural values, traditions, and experiences</li>
                    <li>Explore different poetic forms: haiku, limericks, free verse, traditional ballads</li>
                    <li>Establish appreciation for linguistic diversity and cultural expression</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-teal-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      2
                    </span>
                    Poetry Exploration and Analysis (Day 1-2)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Read and analyze poems from different cultural traditions as a class</li>
                    <li>Identify figurative language: similes, metaphors, personification, alliteration</li>
                    <li>Discuss rhythm, rhyme, and sound patterns in various poetic forms</li>
                    <li>Explore how cultural context influences meaning and interpretation</li>
                    <li>Practice reading poems aloud with appropriate expression and pacing</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-teal-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      3
                    </span>
                    Cultural Poetry Collection (Day 2-3, 30 minutes daily)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Students research and collect poems from their cultural background</li>
                    <li>Create a class anthology of diverse cultural poetry</li>
                    <li>Practice reading selected poems with proper pronunciation and expression</li>
                    <li>Discuss cultural significance and personal connections to the poems</li>
                    <li>Prepare for poetry sharing and recitation activities</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-teal-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      4
                    </span>
                    Poetry Writing Workshop (Days 4-5, 30 minutes daily)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Introduce simple poetic forms: acrostic, cinquain, haiku, free verse</li>
                    <li>Guide students in brainstorming cultural themes and personal experiences</li>
                    <li>Model the writing process: planning, drafting, revising, editing</li>
                    <li>Encourage use of figurative language and sensory details</li>
                    <li>Provide individual and small-group writing support</li>
                    <li>Allow time for peer feedback and revision</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-teal-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      5
                    </span>
                    Poetry Performance Preparation (Day 5, 30 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Practice reading original and selected poems with expression</li>
                    <li>Work on volume, pacing, and emotional delivery</li>
                    <li>Prepare introduction statements explaining cultural significance</li>
                    <li>Rehearse transitions and audience engagement techniques</li>
                    <li>Set up performance space and establish audience expectations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-teal-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      6
                    </span>
                    Poetry Sharing Celebration (Day 6, 45 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Create a welcoming atmosphere for cultural celebration</li>
                    <li>Students share both original poems and cultural favorites</li>
                    <li>Encourage respectful listening and cultural appreciation</li>
                    <li>Facilitate discussion about cultural connections and themes</li>
                    <li>Celebrate diversity and linguistic richness</li>
                    <li>Reflect on learning and cultural understanding gained</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-teal-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      7
                    </span>
                    Extension Activities
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Create illustrated poetry books combining art and writing</li>
                    <li>Record audio versions of poems for digital sharing</li>
                    <li>Organize poetry slam events with other classes</li>
                    <li>Connect with community poets for guest presentations</li>
                    <li>Create multilingual poetry displays celebrating language diversity</li>
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
                <Mic className="h-5 w-5 text-teal-600" />
                Poetry Performance Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-teal-50 p-3 rounded-md border border-teal-200">
                  <h3 className="text-md font-semibold mb-1 text-teal-700">Rhythm and Flow</h3>
                  <p className="text-sm">
                    Reading poetry with natural rhythm and musicality. Teach students to feel the beat and flow of
                    the language, pausing at line breaks and emphasizing stressed syllables.
                  </p>
                </div>

                <div className="bg-teal-50 p-3 rounded-md border border-teal-200">
                  <h3 className="text-md font-semibold mb-1 text-teal-700">Emotional Expression</h3>
                  <p className="text-sm">
                    Conveying the mood and feeling of the poem through voice tone and facial expressions. Practice
                    matching vocal expression to the emotional content of the poetry.
                  </p>
                </div>

                <div className="bg-teal-50 p-3 rounded-md border border-teal-200">
                  <h3 className="text-md font-semibold mb-1 text-teal-700">Cultural Authenticity</h3>
                  <p className="text-sm">
                    Respecting and honoring the cultural origins of poems. Encourage students to learn proper
                    pronunciation and cultural context for authentic presentation.
                  </p>
                </div>

                <div className="bg-teal-50 p-3 rounded-md border border-teal-200">
                  <h3 className="text-md font-semibold mb-1 text-teal-700">Audience Connection</h3>
                  <p className="text-sm">
                    Engaging listeners through eye contact, clear articulation, and expressive delivery. Teach
                    students to share the poem's meaning with their audience.
                  </p>
                </div>

                <div className="bg-teal-50 p-3 rounded-md border border-teal-200">
                  <h3 className="text-md font-semibold mb-1 text-teal-700">Confidence and Presence</h3>
                  <p className="text-sm">
                    Standing tall, speaking clearly, and sharing poetry with pride. Build students' confidence
                    through practice and positive reinforcement.
                  </p>
                </div>

                <div className="bg-teal-50 p-3 rounded-md border border-teal-200">
                  <h3 className="text-md font-semibold mb-1 text-teal-700">Cultural Respect</h3>
                  <p className="text-sm">
                    Approaching different cultural traditions with curiosity and respect. Teach students to ask
                    questions and learn about cultural significance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-teal-600" />
                Differentiation Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-teal-700">For Students Who Excel</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Encourage exploration of more complex poetic forms and structures</li>
                    <li>Challenge them to write poems in multiple languages or dialects</li>
                    <li>Offer opportunities to mentor peers in poetry writing and performance</li>
                    <li>Introduce advanced literary devices and sophisticated themes</li>
                    <li>Allow creation of longer, multi-stanza poems with complex imagery</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-teal-700">For Students Who Need Support</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Provide simple, structured poetic forms like acrostic or haiku</li>
                    <li>Use visual aids and graphic organizers for poetry planning</li>
                    <li>Offer sentence starters and word banks for writing support</li>
                    <li>Allow drawing or dictation as alternatives to written poetry</li>
                    <li>Pair struggling writers with confident peers for collaborative writing</li>
                    <li>Provide extra time for practice and revision</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-teal-700">Language Considerations</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Celebrate and incorporate students' Home Languages in poetry</li>
                    <li>Create bilingual poems that honor linguistic diversity</li>
                    <li>Discuss pronunciation variations across dialects with respect</li>
                    <li>Allow students to express themselves in their preferred language</li>
                    <li>Use poetry as a bridge between Home Language and Standard English</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-teal-600" />
                Poetry Resources and Ideas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Where to Find Cultural Poetry</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Caribbean folk tales and traditional stories adapted as poetry</li>
                <li>Local poets and cultural organizations in your community</li>
                <li>International children's poetry collections and anthologies</li>
                <li>Online resources featuring diverse cultural poetry</li>
                <li>Traditional songs, chants, and oral traditions from various cultures</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Poetry Characteristics for Grade 3</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Clear, accessible language with some challenging vocabulary</li>
                <li>Strong rhythm and musical quality for oral reading</li>
                <li>Cultural themes and experiences relevant to students</li>
                <li>Opportunities for creative interpretation and expression</li>
                <li>Appropriate length for memorization and performance</li>
                <li>Rich imagery and figurative language for analysis</li>
              </ul>

              <div className="bg-teal-50 p-4 rounded-md border border-teal-200">
                <h3 className="text-lg font-semibold mb-2 text-teal-700">Assessment Ideas</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Poetry reading rubrics focusing on expression, rhythm, and cultural respect</li>
                  <li>Writing portfolios tracking growth in poetic expression</li>
                  <li>Self-reflection journals on cultural learning and appreciation</li>
                  <li>Peer feedback forms for collaborative learning</li>
                  <li>Performance assessments during poetry sharing events</li>
                  <li>Cultural understanding checks through discussion and reflection</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-teal-50 p-6 rounded-xl shadow-md border border-teal-200 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-teal-800">Cultural Connections and Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-teal-700">Cultural Relevance</h3>
            <p className="mb-3">
              Cultural Poetry Exploration celebrates the rich linguistic and cultural diversity of the Caribbean and
              beyond. By engaging with poetry from various traditions, students develop appreciation for different
              ways of expressing ideas, emotions, and cultural values through language.
            </p>
            <p>
              This activity honors students' cultural backgrounds while expanding their understanding of global
              poetic traditions. When appropriate, incorporate words and phrases from Home Languages to create
              authentic, culturally responsive learning experiences that validate linguistic diversity.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-teal-700">Beyond Poetry: Additional Benefits</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Cultural Pride:</strong> Students develop pride in their cultural heritage and traditions
              </li>
              <li>
                <strong>Global Awareness:</strong> Exposure to diverse cultures and perspectives
              </li>
              <li>
                <strong>Language Development:</strong> Enhanced vocabulary and understanding of language structures
              </li>
              <li>
                <strong>Creative Expression:</strong> Opportunities for personal and artistic growth
              </li>
              <li>
                <strong>Community Building:</strong> Creates shared appreciation for cultural diversity
              </li>
              <li>
                <strong>Academic Skills:</strong> Strengthens reading, writing, and critical thinking abilities
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Link to="/curriculum/grade3-subjects/activities/language-arts/readers-theater">
          <Button variant="outline" className="mr-4">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous Activity
          </Button>
        </Link>
        <Link to="/curriculum/grade3-subjects/activities/language-arts/vocabulary-detective">
          <Button className="bg-teal-600 hover:bg-teal-700">Next Activity: Vocabulary Detective</Button>
        </Link>
      </div>
    </div>
  )
}
