import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, MessageSquare, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function ListeningSpeakingPage() {
  return (
    <div className="container mx-auto py-8">
      
      <Link href="/curriculum/grade3-subjects/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 3 Language Arts
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-purple-700 flex items-center">
            <MessageSquare className="mr-2 h-7 w-7 text-purple-600" />
            Listening and Speaking
          </h1>
          <p className="text-gray-700">
            In Grade 3, students develop their listening and speaking skills to communicate effectively in various
            contexts. They learn to listen attentively, respond critically, and express ideas with clarity and
            confidence while developing an appreciation for both Standard English and Home Languages.
          </p>
        </div>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Three Expectations for Listening and Speaking
        </h3>

        <Tabs defaultValue="pleasure">
          <TabsList className="grid w-full grid-cols-3 bg-purple-100">
            <TabsTrigger value="pleasure" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              For Pleasure & Personal Growth
            </TabsTrigger>
            <TabsTrigger
              value="relationships"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              To Form & Foster Relationships
            </TabsTrigger>
            <TabsTrigger value="cognitive" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              As Cognitive Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pleasure" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">For Pleasure and Personal Growth</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                Continue to listen to and appreciate messages of music, stories, information, conversation and
                environmental sounds for personal enjoyment
              </li>
              <li>
                Further develop an awareness of how purposeful oral language provides a receptive or expressive venue
                for sharing emotions
              </li>
              <li>
                Reflect on and identify personal strengths as listeners and speakers, areas for improvement and the
                strategies they found most helpful in oral communication
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="relationships" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">To Form and Foster Relationships</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                Understand and practice how listening respectfully and responding with empathy impacts communications
                and builds positive relationships
              </li>
              <li>
                Listen, understand, and respond respectfully to others, considering variations in language and
                background experience
              </li>
              <li>Speak fluently and confidently in a range of contexts and with a range of audiences</li>
              <li>Tell stories and share information in ways engaging to a variety of audiences</li>
              <li>Make relevant comments and ask questions to clarify understanding during conversations</li>
              <li>
                Continue to develop understanding of the purpose, impact and use of Home Language(s) or Standard English
                for a variety of oral language purposes and activities
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="cognitive" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">To Develop and Serve as Cognitive Tools</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Observe, practice, and modify how tone, fluency and intonation impact meaning and mood</li>
              <li>Further develop and apply listening comprehension strategies with increasing independence</li>
              <li>Use critical listening strategies to search for meaning within and beyond the words they hear</li>
              <li>Begin to apply multi-subject vocabulary with intent and meaning</li>
              <li>Increase the complexity and meaningful use of oral word analysis</li>
              <li>Present ideas and oral reports in a logical, appropriate sequence in an oral presentation</li>
              <li>
                Reflect on and identify their strengths as listeners and speakers, areas for improvement and the
                strategies they found most helpful in oral communication
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
            <CardDescription>By the end of Grade Three, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Listen and Speak for Pleasure and Personal Growth
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Engage with and share various genres of music, oral poetry, artwork, and oral stories that have
                      been chosen for pleasure
                    </li>
                    <li>
                      Experience and enjoy playful use of language, to communicate e.g., telling jokes, asking riddles,
                      singing songs, composing rhymes and verses
                    </li>
                    <li>Respond to oral/aural language through improvisational drama and/or artwork</li>
                    <li>
                      Listen attentively and critically to fiction and nonfiction text and music to demonstrate
                      understanding of the mood, main idea, and some supporting details
                    </li>
                    <li>
                      Continue to develop strategies to describe, share, and discuss thoughts, feelings, and experiences
                      with peers
                    </li>
                    <li>
                      Ask and respond to questions to clarify information and to explore possibilities or solutions to
                      problems
                    </li>
                    <li>Listen critically for subtle messages in conversation, music, and environmental sounds</li>
                    <li>Create and use oral instructions describing how to make or do something</li>
                    <li>
                      Discuss solutions to local, regional and world events by extending use of questioning to consider:
                      why? how? when? what if? what else?, etc.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Listen and Speak to Form and Foster Relationships
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Demonstrate understanding and use of conversation courtesies during peer group work, class
                      discussions and play
                    </li>
                    <li>Use vocabulary that shows respect for all people</li>
                    <li>
                      Listen attentively and build on others' ideas with increasing confidence in group and class
                      discussions and individual presentations
                    </li>
                    <li>Continue to develop understanding of point of view without expressing judgment</li>
                    <li>
                      Explore ideas and feelings by asking respectful questions and listening with minimal interruption
                    </li>
                    <li>Use and respond to verbal and nonverbal cues respectfully</li>
                    <li>Develop confidence in asking for assistance from peers and adults</li>
                    <li>Retell stories and events with peers and engage in follow up conversations</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Listen and Speak to Develop Appreciation of Culture and Languages
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Share relevant ideas, opinions, and feelings on topics of personal and social interest using both
                      Standard English and Home Languages
                    </li>
                    <li>
                      Develop an appreciation for various forms of language and their appropriateness to different
                      situations
                    </li>
                    <li>Use thoughtful, respectful, and non-hurtful vocabulary</li>
                    <li>Continue to develop oral comprehension strategies to determine word meanings</li>
                    <li>
                      Participate in the sharing of culturally relevant songs, raps, drama, and poetry with fluency,
                      rhythm, and pace
                    </li>
                    <li>
                      Continue to develop understanding of how and when to adjust volume, projection, facial
                      expressions, gestures, and tone of voice to the speaking occasion
                    </li>
                    <li>
                      Continue to develop meaningful language use and conventions of oral language(s) as appropriate to
                      the context and purpose
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-blue-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-blue-700">Observations:</strong> Teacher observations during listening and
                  speaking activities, noting student engagement, comprehension, and participation
                </li>
                <li>
                  <strong className="text-blue-700">Conversations:</strong> One-on-one discussions with students about
                  their listening and speaking skills, strengths, and areas for improvement
                </li>
                <li>
                  <strong className="text-blue-700">Products:</strong> Student presentations, dramatic performances, and
                  oral responses to various prompts
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <h4 className="font-semibold mb-2 text-blue-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for listening and speaking skills</li>
                  <li>Rubrics for evaluating oral presentations and storytelling</li>
                  <li>Self-assessment tools for students to reflect on their communication skills</li>
                  <li>Peer feedback forms for collaborative speaking activities</li>
                  <li>Audio recordings of student speaking for assessment and reflection</li>
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
                  <AccordionTrigger>Active Listening</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Listening Centers:</strong> Create listening centers with recordings of music, sounds,
                        stories, etc. for students to practice listening comprehension strategies with peers.
                      </li>
                      <li>
                        <strong>Think Aloud:</strong> Use Think Alouds to demonstrate how to use comprehension
                        strategies, such as making predictions, connections, visualizations, and summarizing what was
                        heard.
                      </li>
                      <li>
                        <strong>Cultural Performances:</strong> Invite cultural groups and individuals to perform
                        aspects of local culture (singing, dancing, role-playing, storytelling) and encourage students
                        to ask questions and respond.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Oral Expression</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Puppetry:</strong> Create simple puppets for students to retell local folk stories,
                        encouraging oral expression and creativity.
                      </li>
                      <li>
                        <strong>Press Conference:</strong> Organize mock press conferences where students ask questions
                        relevant to local, regional, and world problems.
                      </li>
                      <li>
                        <strong>Language Translation:</strong> Listen to folk stories and have students orally summarize
                        the stories, then translate these summaries from local creole stories into Standard English.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Communication Etiquette</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Role Play:</strong> Provide scenarios for students to practice appropriate communication
                        in different contexts, such as welcoming a visitor or helping a new student.
                      </li>
                      <li>
                        <strong>Respectful Feedback:</strong> Teach students how to provide constructive feedback to
                        peers after presentations or during conversations.
                      </li>
                      <li>
                        <strong>Welcome Songs:</strong> Start each day with music and songs, discussing the beat, mood,
                        and meaning while acknowledging local vocabulary and phrases.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Cultural Appreciation</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Calypso Tent:</strong> Listen to local calypso music and have students respond by moving
                        with the beat, sharing feelings, and discussing the meaning of the songs.
                      </li>
                      <li>
                        <strong>Local Artisans:</strong> Visit or view videos of local artisans creating handmade
                        products, allowing students to observe, illustrate, record, or make notes about the process.
                      </li>
                      <li>
                        <strong>Language Awareness:</strong> Create activities that help students recognize and
                        appreciate the differences between Home Language and Standard English, discussing when each is
                        appropriate.
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
                <li>Audio recordings of local music, stories, and environmental sounds</li>
                <li>Visual aids for storytelling and presentations</li>
                <li>Puppets and props for dramatic activities</li>
                <li>Books and resources in both Standard English and Home Languages</li>
                <li>OECS Grade 3 Language Arts Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Listening journals for recording observations and reflections</li>
                <li>Visual cues for active listening and speaking</li>
                <li>Vocabulary cards for new words and expressions</li>
                <li>Recording devices for self-assessment of speaking</li>
                <li>Cultural artifacts and realia for discussion and storytelling</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Listening and Speaking are foundational for all learning. The strategies and skills of listening and
              speaking allow learners to contribute meaningfully to social environments. As learners receive, reflect
              on, and communicate ideas, they develop increasing proficiency in cognitive organization, critical
              thinking, and problem solving. Listening and speaking strategies and skills are foundational for the
              development of reading, viewing, writing, and representing.
            </p>
            <p className="mt-2">
              Teachers should be aware of the importance of both Standard English and Home Languages in developing
              students' oral language skills. Creating a classroom environment that values and respects linguistic
              diversity while also teaching the conventions of Standard English is essential for students' language
              development.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
