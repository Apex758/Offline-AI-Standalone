import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Pencil, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade2WritingRepresentingPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade2-subjects/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Language Arts
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-pink-100 to-pink-200 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-pink-800 flex items-center">
            <Pencil className="mr-2 h-7 w-7 text-pink-600" />
            Grade 2 Writing and Representing
          </h1>
          <p className="text-gray-700">
            Writing and Representing strategies and skills provide opportunities for learners to communicate with their
            peers and other meaningful audiences. The process includes planning, organizing, revising, refining, and
            sharing feedback, developing problem-solving and critical thinking strategies.
          </p>
        </div>
      </div>

      <div className="bg-pink-50 p-6 rounded-lg border border-pink-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-pink-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Two Expectations for Writing and Representing
        </h3>

        <Tabs defaultValue="pleasure">
          <TabsList className="grid w-full grid-cols-3 bg-pink-100">
            <TabsTrigger value="pleasure" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
              Pleasure & Growth
            </TabsTrigger>
            <TabsTrigger value="process" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
              Engage in Process
            </TabsTrigger>
            <TabsTrigger value="structures" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
              Explore Language
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pleasure" className="p-4 border rounded-md mt-2 bg-pink-50 border-pink-200">
            <h4 className="font-semibold mb-2">Write for pleasure and personal growth</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Participate in author’s corner</li>
              <li>Share and receive feedback with peers</li>
            </ul>
          </TabsContent>

          <TabsContent value="process" className="p-4 border rounded-md mt-2 bg-pink-50 border-pink-200">
            <h4 className="font-semibold mb-2">Engage in the writing process</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Use process strategies in pre-writing, drafting, revising, and editing their writing</li>
              <li>
                Develop organizational strategies, such as story grammar, to participate in individual and small group
                writing experiences
              </li>
              <li>
                Use background knowledge, interests, and the modelling of favourite authors to identify a topic and
                format that suits a chosen audience
              </li>
              <li>
                A variety of meaningful text types intended for quick communication e.g., personal communication, lists,
                narratives, simple advertisements
              </li>
              <li>Write a friendly letter, expository paragraph etc</li>
              <li>Write legibly</li>
              <li>
                Becomes aware of a variety of presentation style elements including print, script, fonts, graphics, and
                layout
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="structures" className="p-4 border rounded-md mt-2 bg-pink-50 border-pink-200">
            <h4 className="font-semibold mb-2">Explore language structures</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Experiment with different ways of writing sentences</li>
              <li>
                Continue to use combination of Home Languages and Standard English to develop an understanding of
                purpose, meaning and tone
              </li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-pink-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-pink-50">
            <CardTitle className="text-pink-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade Two, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-pink-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-pink-50 px-4 py-2 rounded-md">
                  Generate and gather thoughts to explore, ideas, feelings, and experiences
                </AccordionTrigger>
                <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Engage in writing and representing activities every day and sustain engagement in writing</li>
                    <li>
                      Continue to engage in conversations about: why we write or draw, how we write or draw, how authors
                      use words and sentences to share their ideas, how illustrators provide additional information to
                      the writing, how authors use choices about when to use Home Language and when to use Standard
                      English
                    </li>
                    <li>
                      Develop comfort in experimenting within different forms of formal and informal writing, such as:
                      simple handwritten or digital notes, thank you notes, invitations to school or class, letters to
                      peers or community members
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-pink-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-pink-50 px-4 py-2 rounded-md text-justify">
                  Use organisational strategies to arrange thoughts and to explore, clarify and reflect on ideas,
                  feelings, and experiences
                </AccordionTrigger>
                <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Organise brainstormed ideas through increasingly independent use of: a print, visual or digital
                      graphic organizer, group conversation, story boards, role play, text based models
                    </li>
                    <li>
                      Organize writing to match the genre being studied: narrative writing, expository writing,
                      descriptive writing, persuasive writing
                    </li>
                    <li>
                      Make decisions about when illustrations, charts, and alternate language use will enhance the
                      writing
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-pink-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-pink-50 px-4 py-2 rounded-md">
                  Create a written or representative draft
                </AccordionTrigger>
                <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Understand that writing a draft is connected to the prewriting/brainstorming and organising
                      process
                    </li>
                    <li>
                      Approach draft writing from a positive perspective of taking risks by: using temporary spelling,
                      exploring various languages, writing freely with a focus on getting ideas on paper or device
                    </li>
                    <li>Refer to anchor texts as examples of the genre of the writing project</li>
                    <li>
                      Continue to work with a partner, small group or independently, to begin the process of drafting
                      and organising sentences
                    </li>
                    <li>
                      Further develop the structure of the genre throughout the draft process of: narrative writing,
                      expository writing, descriptive writing, persuasive writing
                    </li>
                    <li>
                      Continue to develop understanding of the social aspect of writing by engaging with peers and the
                      teacher for ideas, suggestions, and ongoing feedback
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-rose-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-rose-50">
              <CardTitle className="text-rose-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-rose-700">Conversations:</strong> Teacher-learner conferences, peer feedback
                  sessions
                </li>
                <li>
                  <strong className="text-rose-700">Observations:</strong> Monitoring engagement, participation, and
                  application of writing strategies
                </li>
                <li>
                  <strong className="text-rose-700">Products:</strong> Student-created brainstorms, drafts, and final
                  writing pieces
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-100">
                <h4 className="font-semibold mb-2 text-rose-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Single point rubrics for brainstorming and drafting</li>
                  <li>Checklists for monitoring progress in organization and sentence fluency</li>
                  <li>Portfolios showcasing student writing samples over time</li>
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
                  <AccordionTrigger>
                    Generate and gather thoughts to explore, ideas, feelings, and experiences
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Writing and representing for the love of it: Begin each writing lesson with a two-three minute
                        free write
                      </li>
                      <li>
                        How do I become an author?: Review the writing process at the beginning of the year and
                        throughout the year
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger className="text-justify">
                    Use organisational strategies to arrange thoughts and to explore, clarify and reflect on ideas,
                    feelings, and experiences
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Organizing ideas and words: Use a Think Aloud to demonstrate the purpose and use of Graphic
                        Organisers designed to create images of how words and ideas are related
                      </li>
                      <li>
                        Learning while we are sharing our writing: Schedule a group writing lesson and invite individual
                        learners to “share the pen” as you demonstrate how a brainstorm evolves into a draft as you
                        Model writing and use writing circle
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
                <li>Observation of Student Learning Journal</li>
                <li>Sample rubrics and checklists</li>
                <li>Graphic organizers</li>
                <li>OECS Grade 2 Language Arts Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Writing journals</li>
                <li>Graphic organizers</li>
                <li>Writing utensils and paper</li>
                <li>Digital devices for writing and representing</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Writing and Representing strategies and skills provide opportunities for learners to communicate with
              their peers and other meaningful audiences within and beyond their community using paper and digital
              formats. The process includes planning, organizing, revising, refining, and sharing feedback, developing
              problem-solving and critical thinking strategies.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
