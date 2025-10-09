import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Ear, MessageSquare, Users, BookOpen, ChevronRight, ClipboardCheck } from 'lucide-react'
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade2ListeningSpeakingPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade2-subjects/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Language Arts
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-purple-800 flex items-center">
            <Ear className="mr-2 h-7 w-7 text-purple-600" />
            Grade 2 Listening and Speaking
          </h1>
          <p className="text-gray-700">
            Listening and Speaking are foundational for all learning. The strategies and skills of listening and speaking
            allow learners to contribute meaningfully to social environments. As learners receive, reflect on, and
            communicate ideas, they develop increasing proficiency in cognitive organization, critical thinking, and
            problem solving.
          </p>
        </div>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Two Expectations for Listening and Speaking
        </h3>

        <Tabs defaultValue="pleasure">
          <TabsList className="grid w-full grid-cols-3 bg-purple-100">
            <TabsTrigger value="pleasure" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Pleasure & Growth
            </TabsTrigger>
            <TabsTrigger value="relationships" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Relationships
            </TabsTrigger>
            <TabsTrigger value="cognitive" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Cognitive Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pleasure" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">For pleasure and personal growth</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Listen to music, stories, information, conversation, and environmental sounds for personal enjoyment</li>
              <li>Demonstrate interest, curiosity, engagement in sharing the experiences of others and with oral stories, and information sharing</li>
              <li>Begin to be aware of how purposeful oral language provides a receptive or expressive venue for sharing emotions</li>
            </ul>
          </TabsContent>

          <TabsContent value="relationships" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">To form and foster relationships</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Listen to identify emotional tone and respond with empathy</li>
              <li>Explain their own views, consider, and respond respectfully to the views of others and take part in frequent small group and class discussions</li>
              <li>Appreciate the diversity of their Home Language(s) and Standard English</li>
            </ul>
          </TabsContent>

          <TabsContent value="cognitive" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">To develop and serve as cognitive tools for engaging in and sharing learning</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Continue to observe and practice using tone, fluency, intonation, impact, meaning, and mood</li>
              <li>Begin to apply listening comprehension strategies enhance understanding of fiction and nonfiction oral language experiences</li>
              <li>Develop questioning skills that go beyond the literal level</li>
              <li>Make simple comparisons and contrasts</li>
              <li>Further develop oral language vocabularies in all subject areas</li>
              <li>Further develop understanding of the purpose and authentic use of grammatically structured sentences</li>
              <li>Continue to develop their understanding of oral word analysis skills</li>
              <li>Demonstrate understanding by providing a summary of an oral presentation</li>
              <li>Continue to develop oral fluency and meaningful phrasing</li>
              <li>Further develop how to maintain focus and order while sharing information</li>
              <li>Apply lessons in phonological awareness to make predictions about meaningful manipulation of phonemes</li>
              <li>Develop an understanding of when and why either Home Language(s) or Standard English is appropriate for presentations and discussions</li>
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
            <CardDescription>By the end of Grade Two, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  For pleasure, personal growth
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Engage with various genres of music, oral poetry, and oral stories for pleasure</li>
                    <li>Offer thoughts and opinions on the meaning and mood of music, stories, and poetry</li>
                    <li>Sustain one-to-one conversations and contribute to small and large group interactions with peers</li>
                    <li>Continue to develop comfort while engaging in interactions with adults</li>
                    <li>Describe a personal experience in sequential order</li>
                    <li>Continue to develop vocabulary that reflects interests as well as application of synonyms, antonyms, and descriptive words to build more complex sentences</li>
                    <li>Use some transition words to connect phrases</li>
                    <li>Respond to and give instructions that involve 3-4 steps</li>
                    <li>Demonstrate application of oral comprehension strategies such as: visualizing, predicting, connecting, analysis, synthesising, determining importance</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  To form and foster relationships
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Describe, share, and discuss thoughts, feelings, and experiences</li>
                    <li>Ask and respond to questions to clarify information and to explore possibilities or solutions to problems</li>
                    <li>Consider others’ ideas and ask/ respond to questions to clarify information and to explore possibilities or solutions to problems</li>
                    <li>Recognize some examples of unfair and hurtful vocabulary, and begin to make vocabulary choices that affirm rather than hurt people</li>
                    <li>Experiment with the impact of intonation, expression, and tone while communicating ideas and feelings in small- and whole-group situations</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md text-justify">
                  To develop an appreciation and celebration of culture and of oral languages
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Begin to make vocabulary choices that affirm sensitivity to the personal ideas, cultural contexts, and experiences of others</li>
                    <li>Use social conventions, in range of conversations and cooperative play situations, (turn taking, politeness, when to speak, and when to listen) in multiple cultural contexts</li>
                    <li>Use different forms (Home Language, Standard English) of language dependent upon audience and purpose</li>
                    <li>Recognize that volume of voice needs to be adjusted according to situation XC</li>
                    <li>Continue to develop monitoring and self correction of oral language use</li>
                    <li>Develop automaticity with the meaningful application of phonological awareness in oral expression of: rhyming, onset and rime, segmenting, blending, beats in a word (syllables)</li>
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
                  <strong className="text-blue-700">Observations:</strong> Teacher observations during discussions, storytelling, and
                  group activities
                </li>
                <li>
                  <strong className="text-blue-700">Conversations:</strong> Student explanations of their thoughts, feelings, and
                  experiences
                </li>
                <li>
                  <strong className="text-blue-700">Products:</strong> Student-created stories, poems, and presentations
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <h4 className="font-semibold mb-2 text-blue-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Learner Interest Inventory</li>
                  <li>Checklists for monitoring participation and engagement</li>
                  <li>Rubrics for evaluating oral presentations and storytelling</li>
                  <li>Self-assessment checklists for poetry and creative expression</li>
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
                  <AccordionTrigger>For pleasure, personal growth</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Tell me a story: Celebrate a culture of classroom storytelling</li>
                      <li>Please Read to Me!: Schedule Teacher Read Alouds every day</li>
                      <li>Opposites/Synonym Chant: Draw a hopscotch box then write words in each box</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>To form and foster relationships</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Follow me!: Teacher indicates to learners that she has hidden a special gift/treat in the classroom/school</li>
                      <li>What’s That Sound?: Begin the year with a focus on active listening</li>
                      <li>Listening to our feelings and emotions: Teacher engages learners in a Read-aloud that focuses on a text that depicts a specific feeling/emotion</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>To develop an appreciation and celebration of culture and of oral languages</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>This is How We Say It: Explore Home Language by sharing common spoken expressions to describe various scenarios</li>
                      <li>Catch the Beat, Hear the Rhyme: Schedule time to play with the sounds of language</li>
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
                <li>Observation of Student Learning Journal</li>
                <li>Learner Interest Inventory</li>
                <li>Sample rubrics and checklists</li>
                <li>OECS Grade 2 Language Arts Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Variety of books, magazines, and digital texts</li>
                <li>Materials for creating visual representations</li>
                <li>Props for storytelling and dramatization</li>
                <li>Personal dictionaries and word banks</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Listening and Speaking are foundational for all learning. The strategies and skills of listening and speaking
              allow learners to contribute meaningfully to social environments. As learners receive, reflect on, and
              communicate ideas, they develop increasing proficiency in cognitive organization, critical thinking, and
              problem solving. Listening and speaking strategies and skills are foundational for the development of
              reading, viewing, writing, and representing.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
