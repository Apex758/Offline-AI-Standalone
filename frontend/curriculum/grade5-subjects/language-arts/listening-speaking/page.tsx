"use client"

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
      
      <Link href="/curriculum/grade5-subjects/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 5 Language Arts
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-purple-700 flex items-center">
            <MessageSquare className="mr-2 h-7 w-7 text-purple-600" />
            Listening and Speaking
          </h1>
          <p className="text-gray-700">
            In Grade 5, students refine their listening and speaking skills to engage in critical discourse and express
            themselves effectively in diverse contexts. They learn to analyze persuasive techniques, adapt their
            language to different situations, and appreciate the nuances of both Standard English and Caribbean
            dialects.
          </p>
        </div>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Five Expectations for Listening and Speaking
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
                Continue to listen to and appreciate messages of increasingly diverse genres of diverse music, stories,
                information
              </li>
              <li>
                Continue to demonstrate interest, curiosity, and responsive engagement in sharing the experiences of
                others and with oral stories and information sharing
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
                Demonstrate how conversing with peers with empathy, clarity, intonation, intentionality, animation, and
                expression builds positive relationships
              </li>
              <li>Listen carefully and follow up on others' ideas as they respectfully voice their ideas or opinion</li>
              <li>
                Use speaking skills and strategies appropriately to communicate for a variety of purposes with different
                audiences
              </li>
              <li>
                Continue to develop an understanding of the purpose, impact and use of Home Language(s) or Standard
                English for a variety of oral language purposes and activities
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="cognitive" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">To Develop and Serve as Cognitive Tools</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                Observe, practice, modify and critically examine how tone, fluency and intonation impact meaning and
                mood
              </li>
              <li>
                Apply individual and clusters of listening comprehension strategies independent of purpose and intuition
              </li>
              <li>Develop increasingly complex vocabulary in meaningful and sometimes insightful ways</li>
              <li>
                Tell real and imagined stories with focused attention to topic, sequence, language use and the
                conventions of the genre
              </li>
              <li>
                Demonstrate how to connect phoneme manipulation with meaningful use of affixes to build on existing
                roots
              </li>
              <li>
                Recognize and use oral strategies to create a presentation by developing and elaborating on an idea and
                make increasingly sophisticated decisions about word choice, sentence fluency and voice
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
            <CardDescription>By the end of Grade Five, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Listen and Speak for Pleasure and Personal Growth
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Clarify opinions by responding to the questions and ideas/opinions of others</li>
                    <li>
                      Continue to use intonation, tone, and expression to communicate ideas and feelings in a variety of
                      situations
                    </li>
                    <li>Discuss news, current events, opinions in class discussions</li>
                    <li>
                      Reflect on and identify their strengths as listeners and speakers, areas for improvement and the
                      strategies they found most helpful in oral communication situations.
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
                    <li>Participate as active listeners in group learning activities</li>
                    <li>
                      Report on a topic or text, tell a story, or recount an experience in an organized manner, using
                      appropriate facts and relevant descriptive details to support main ideas or themes
                    </li>
                    <li>Follow agreed-upon rules for discussions and carry out assigned roles</li>
                    <li>
                      Create and/or use visual aids in presentations when appropriate to enhance development of themes
                      and/or main ideas
                    </li>
                    <li>Use appropriate facial expressions and gestures to support the message</li>
                    <li>Adapt speech to a variety of contexts and tasks, using formal English when appropriate</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Listen and Speak to Develop Appreciation of Culture and Languages
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Orally present an argument or perspective</li>
                    <li>
                      Create, presents, participates in mini debates/speeches using persuasive techniques e.g.,
                      promises, dares, flattery
                    </li>
                    <li>Identify the reasons and evidence a speaker provides to support points</li>
                    <li>
                      Respond to and to give sequential multi-step directions and instructions with increasing detail
                    </li>
                    <li>Listen to identify and discuss critically persuasive techniques used in advertisements</li>
                    <li>
                      Critically listen to the ideas and perspectives of others in a variety of collaborative learning
                      experiences
                    </li>
                    <li>
                      Develop ability to adjust level of language used to suit the specific communication situation
                    </li>
                    <li>
                      Reflect critically upon a variety of oral presentations evaluating the speaker’s perspective
                    </li>
                    <li>
                      Make language choices that affirm sensitivity and respect the ideas and experiences of others
                    </li>
                    <li>
                      Listen to understand and respond appropriately in a variety of situations and for a variety of
                      purposes
                    </li>
                    <li>
                      Review the key ideas expressed and draw conclusions considering information and knowledge gained
                      from the discussions
                    </li>
                    <li>Engage in self and peer reflection on accuracy of providing or identifying information</li>
                    <li>Consider others’ responses and begin to offer opinions supported with some evidence</li>
                    <li>
                      Ask questions to check understanding of information presented, stay on topic, and link their
                      comments to the remarks of others
                    </li>
                    <li>Ask a speaker for clarification about the subject matter of his / her contribution</li>
                    <li>
                      Talk confidently in complete sentences using appropriate intonation and courteous expression with
                      peers and in various levels of formality
                    </li>
                    <li>
                      Create age-appropriate media messages (e.g., videos, podcasts, print advertisements) for
                      evaluation, focusing on effectiveness of the message
                    </li>
                    <li>
                      Converse and collaborate in a variety of situations with increasing sensitivity and respect,
                      considering cultural contexts, audience, and purpose
                    </li>
                    <li>
                      Explain ideas and opinions with supporting details, and respond to others’ questions and ideas
                    </li>
                    <li>
                      Speak clearly in an audible voice using volume, pitch, phrasing, pace, modulation, and gestures to
                      enhance meaning at various levels of formality
                    </li>
                    <li>
                      Listen to distinguish between Standard English and nonstandard varieties spoken in the Caribbean
                    </li>
                    <li>
                      Use complex sentences that incorporate specific vocabulary and style to enhance oral presentations
                    </li>
                    <li>Use words for their figurative and metaphorical meanings in their oral presentations</li>
                    <li>Interpret the meanings of words in the contexts in which they are used</li>
                    <li>
                      Paraphrase portions of a text read aloud, or information presented in diverse media and formats,
                      including visually and orally
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
                  <li>Anecdotal records of student participation in discussions</li>
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
                      <li>
                        <strong>Media Analysis:</strong> Listen to and analyze advertisements, news broadcasts, and
                        speeches to identify purpose, tone, and subtle messages.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Oral Expression</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Debate Club:</strong> Organize structured debates on age-appropriate topics where
                        students research, prepare arguments, and practice respectful disagreement.
                      </li>
                      <li>
                        <strong>Podcast Creation:</strong> Guide students in creating short podcasts on topics of
                        interest, focusing on clear speech, organization, and engaging delivery.
                      </li>
                      <li>
                        <strong>Storytelling Circles:</strong> Establish regular storytelling sessions where students
                        share personal or fictional stories with attention to sequence, descriptive language, and
                        audience engagement.
                      </li>
                      <li>
                        <strong>How-To Demonstrations:</strong> Have students prepare and deliver clear step-by-step
                        instructions for completing a task or making something.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Communication Etiquette</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Fishbowl Discussions:</strong> Arrange students in inner and outer circles where the
                        inner circle discusses a topic while the outer circle observes communication skills and provides
                        feedback.
                      </li>
                      <li>
                        <strong>Constructive Feedback Practice:</strong> Teach and model the "I notice... I wonder..."
                        format for providing respectful and helpful feedback to peers.
                      </li>
                      <li>
                        <strong>Situation Cards:</strong> Create cards with different social scenarios for students to
                        role-play appropriate communication responses.
                      </li>
                      <li>
                        <strong>Active Listening Signals:</strong> Establish classroom signals and gestures that
                        demonstrate active listening and engagement during discussions.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Cultural Appreciation</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Language Comparison:</strong> Compare expressions and sayings in Home Language(s) and
                        Standard English, discussing the cultural contexts and appropriate usage of each.
                      </li>
                      <li>
                        <strong>Cultural Celebration Days:</strong> Dedicate days to celebrating different cultural
                        expressions through music, food, stories, and traditions, with students sharing from their own
                        backgrounds.
                      </li>
                      <li>
                        <strong>Community Interviews:</strong> Guide students in preparing questions and conducting
                        interviews with community members about local history, traditions, and cultural practices.
                      </li>
                      <li>
                        <strong>Poetry and Song Analysis:</strong> Analyze local and regional songs, calypso, and poetry
                        for meaning, cultural references, and language features.
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
                <li>Debate and discussion prompt cards</li>
                <li>Books and resources in both Standard English and Home Languages</li>
                <li>OECS Grade 5 Language Arts Curriculum Guide</li>
                <li>Digital recording equipment for student podcasts and presentations</li>
                <li>Sample rubrics for assessing various speaking activities</li>
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
                <li>Graphic organizers for planning oral presentations</li>
                <li>Self-assessment checklists for speaking activities</li>
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
              In Grade 5, students are ready to engage with more complex listening and speaking tasks that require
              critical thinking and analysis. They can begin to identify subtle messages, biases, and implied meanings
              in oral communications. Teachers should provide opportunities for students to practice formal speaking in
              various contexts and to engage in more structured discussions and debates. The integration of technology
              can enhance listening and speaking activities through recordings, multimedia presentations, and digital
              storytelling.
            </p>
            <p className="mt-2">
              Teachers should continue to value and respect linguistic diversity while also teaching the conventions of
              Standard English. Creating a classroom environment that celebrates cultural expressions through language
              helps students develop confidence in their communication skills and appreciation for diverse perspectives.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
