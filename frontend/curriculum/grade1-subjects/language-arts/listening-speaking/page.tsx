import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Ear, ClipboardCheck } from "lucide-react"

export default function ListeningSpeakingPage() {
  return (
    <div className="container mx-auto py-8">
      <Link href="/curriculum/grade1-subjects/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 1 Language Arts
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-purple-700 flex items-center">
            <Ear className="mr-2 h-7 w-7 text-purple-600" />
            Listening and Speaking
          </h1>
          <p className="text-gray-700">
            Listening and Speaking are foundational for all learning. The strategies and skills of listening and
            speaking allow learners to contribute meaningfully to social environments. As learners receive, reflect on,
            and communicate ideas, they develop increasing proficiency in cognitive organization, critical thinking, and
            problem-solving.
          </p>
        </div>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade One Expectations for Listening and Speaking
        </h3>

        <Tabs defaultValue="personal">
          <TabsList className="grid w-full grid-cols-3 bg-purple-100">
            <TabsTrigger value="personal" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              For Pleasure & Personal Growth
            </TabsTrigger>
            <TabsTrigger
              value="relationships"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              For Relationships
            </TabsTrigger>
            <TabsTrigger value="culture" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              For Cultural Appreciation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Listen to a range of music, rhymes, poetry, stories, information, conversation and environmental sounds
                for personal enjoyment
              </li>
              <li>
                Demonstrate interest, curiosity and engagement in sharing the experiences of others with oral stories
                and information sharing
              </li>
              <li>Respond with thought to artistic representations</li>
            </ul>
          </TabsContent>

          <TabsContent value="relationships" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Listen respectfully to what other people are saying as they become aware of how to respond with empathy
                and share with clarity
              </li>
              <li>Begin to identify overt and implied messages</li>
              <li>Become more aware of active Listening and Speaking strategies</li>
              <li>Recognise and understand verbal and non-verbal communication in various situations</li>
            </ul>
          </TabsContent>

          <TabsContent value="culture" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <ul className="list-disc pl-5 space-y-2">
              <li>Observe and practice how tone, fluency and intonation impact meaning and mood</li>
              <li>
                Demonstrate understanding by retelling an oral story or restating factual information in Home
                Language(s) and/or Standard English
              </li>
              <li>
                Begin to apply listening comprehension strategies to enhance understanding of spoken language, music,
                and environmental sounds
              </li>
              <li>Begin to appreciate how languages are used to share and reflect on past and present experiences</li>
              <li>
                Continue to engage in and apply phonological awareness and word play to discriminate among letters and
                letter patterns
              </li>
              <li>
                Continue to develop and apply vocabulary and language structures to enhance communication of ideas with
                purpose and focus for a range of audiences
              </li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-purple-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-purple-50">
            <CardTitle className="text-purple-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade One, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Listen and speak for pleasure and personal growth
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>1.1 Choose to listen to music, poetry and stories for pleasure.</li>
                    <li>1.2 Connect environmental sounds to meaning.</li>
                    <li>1.3 Use different voices in role playing to indicate tone and mood.</li>
                    <li>1.4 Describe how musical and environmental sounds affect mood.</li>
                    <li>
                      1.5 Use Listening Comprehension Strategies to make and simplify meaning: ask questions, recall
                      ideas, predict, visualise, and make connections.
                    </li>
                    <li>1.6 Listen to, retell, and express an opinion about the story.</li>
                    <li>1.7 Listen to differentiate between make-believe and truth.</li>
                    <li>1.8 Listen to follow and give direction e.g. 2-3 steps.</li>
                    <li>
                      1.9 Listen and respond with increasing understanding and confidence to conversations expressed in
                      Standard English.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Listen and speak to form and foster relationships
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>1.10 Use turn taking strategies as a listener and a speaker.</li>
                    <li>
                      1.11 Identify and use some non-verbal cues (e.g., facial expressions, gestures etc.) and in oral
                      communication with thoughtfulness.
                    </li>
                    <li>
                      1.12 Listen, share information ask and answer questions on a topic opinion in response to views
                      articulated by others.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md text-justify">
                  Listen and speak to develop appreciation and celebration of culture and oral languages
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      1.13 Use and respond to Home Language(s) with awareness and purpose to greet, thank, make a
                      request, explain, apologise and issue an invitation.
                    </li>
                    <li>
                      1.14 Continue to develop Home Language and Standard English vocabulary, phrasing and sentence use
                      to share ideas.
                    </li>
                    <li>
                      1.15 Describe sounds, images, events, people, and places with clarity that includes relevant
                      details and a range of descriptive words reflecting size, colour, intensity, etc.
                    </li>
                    <li>1.16 Produce complete sentences when suitable to task and setting.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Phonological Awareness
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      1.17 Continue to develop the foundation of phonological awareness by orally identifying,
                      producing, and manipulating various units of speech sounds within words, including:
                      <ul className="list-disc pl-5 mt-2">
                        <li>Initial and final sounds</li>
                        <li>Segmenting sounds in one syllable words</li>
                        <li>Beats in a word (syllables)</li>
                        <li>Onset and rhyme</li>
                        <li>Blending sounds to make one-syllable words</li>
                        <li>Identifying phonemes in one syllable words</li>
                      </ul>
                    </li>
                    <li>
                      1.18 Use common singular and plural nouns in the meaningful context of sentences (e.g. She runs,
                      We run).
                    </li>
                    <li>
                      1.19 Begin to use common irregular plural forms, such as man/men, child/children, and foot/feet.
                    </li>
                    <li>
                      1.20 Use common pronouns with increasing understanding (I, me, mine, they, them, theirs, him, his,
                      hers).
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-indigo-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-indigo-50">
              <CardTitle className="text-indigo-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-indigo-700">Conversations:</strong> Anecdotal notes, class chats, learner
                  interest inventory
                </li>
                <li>
                  <strong className="text-indigo-700">Observations:</strong> During lessons and playtime to gather
                  information about comfort level with communication, friendships, language choices, and vocabulary use
                </li>
                <li>
                  <strong className="text-indigo-700">Products:</strong> Questioning after listening activities,
                  phonological awareness checklist, quizzes
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                <h4 className="font-semibold mb-2 text-indigo-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation of Student Learning Journal</li>
                  <li>Four-level rubrics for listening comprehension</li>
                  <li>Single point rubrics for turn taking and responding</li>
                  <li>Self-assessment of listening habits</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inclusive Learning Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="strategy-1">
                  <AccordionTrigger>Listen and speak for pleasure and personal growth</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Listen to enjoy and reflect:</strong> Schedule opportunities to pause, relax and listen
                        for pleasure by providing brief selections of music throughout the day.
                      </li>
                      <li>
                        <strong>The Sounds of Silence:</strong> Gather learners to create total silence and listen to
                        ambient sounds, discussing the messages each sound conveys.
                      </li>
                      <li>
                        <strong>Please Read to Me!</strong> Schedule daily Teacher Read Alouds with a variety of texts
                        relevant to learner interests.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Listen and speak to form and foster relationships</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>We are Good Listeners:</strong> Co-create a "We Are Good Listeners Chart" with positive
                        statements about listening behaviors.
                      </li>
                      <li>
                        <strong>Silent Languages:</strong> Introduce simple sign language as a means to send quiet
                        messages.
                      </li>
                      <li>
                        <strong>This is ME!</strong> Provide learners with containers to collect objects representing
                        their interests for sharing during class chats.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Listen and speak to develop appreciation of culture and languages</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Welcome!</strong> Begin each day with greetings that celebrate culture and language.
                      </li>
                      <li>
                        <strong>What's Happening?</strong> Create vignettes reflecting common occurrences where polite
                        and courteous Home Language and Standard English are used.
                      </li>
                      <li>
                        <strong>You say, I say, we might also say:</strong> Create classroom charts of different words
                        for objects and actions.
                      </li>
                      <li>
                        <strong>Loose Parts Learning Centre:</strong> Create a space for displaying items collected from
                        the environment for vocabulary development.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Phonological Awareness</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>What Does That Sound Feel Like?</strong> Focus on how the mouth looks and feels when
                        making different sounds.
                      </li>
                      <li>
                        <strong>Hear the Rhyme and Feel the Beat:</strong> Schedule time to play with sounds of language
                        through poetry, rhyming, clapping beats, and tapping sounds.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Additional Resources and Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">For Teachers</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Phonological Awareness Guide for Kindergarten</li>
                <li>Reading Rockets literacy resources</li>
                <li>Mindfulness activities for classrooms</li>
                <li>Loose parts learning activities</li>
                <li>Sign language for classroom management</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Audio/video books for listening centers</li>
                <li>Storyline Online resources</li>
                <li>Puppets for oral language development</li>
                <li>Environmental sound recordings</li>
                <li>Cultural songs and rhymes</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Phonological Awareness is an essential skill in early literacy development. While many resources are
              available online, choose resources that are developmentally appropriate and culturally relevant. Adapt
              examples to use words that are of interest to students and reflect the home language(s) used in the
              community.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
