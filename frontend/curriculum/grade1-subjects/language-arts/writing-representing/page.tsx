import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, PenTool, FileEdit, FileCheck, FileText, Pencil, ClipboardCheck } from "lucide-react"

export default function WritingRepresentingPage() {
  return (
    <div className="container mx-auto py-8">
      <Link href="/curriculum/grade1-subjects/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 1 Language Arts
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-pink-100 to-rose-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-pink-700 flex items-center">
            <Pencil className="mr-2 h-7 w-7 text-pink-600" />
            Writing and Representing
          </h1>
          <p className="text-gray-700">
            Writing and Representing strategies and skills provide opportunities for learners to communicate with their
            peers and other meaningful audiences within and beyond their community using paper and digital formats. The
            process of writing includes planning, organizing, revising, refining, and sharing feedback. Throughout this
            process, ongoing problem solving and critical thinking strategies, applicable to subject areas and to life
            develop.
          </p>
        </div>
      </div>

      <Tabs defaultValue="elo5" className="mb-8">
        <TabsList className="grid w-full grid-cols-3 bg-pink-100">
          <TabsTrigger
            value="elo5"
            className="flex items-center gap-2 data-[state=active]:bg-pink-600 data-[state=active]:text-white"
          >
            <PenTool className="h-4 w-4" />
            ELO 5: Drafting
          </TabsTrigger>
          <TabsTrigger
            value="elo6"
            className="flex items-center gap-2 data-[state=active]:bg-pink-600 data-[state=active]:text-white"
          >
            <FileEdit className="h-4 w-4" />
            ELO 6: Revising
          </TabsTrigger>
          <TabsTrigger
            value="elo7"
            className="flex items-center gap-2 data-[state=active]:bg-pink-600 data-[state=active]:text-white"
          >
            <FileCheck className="h-4 w-4" />
            ELO 7: Editing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="elo5" className="mt-4">
          <Card className="border-t-4 border-pink-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-pink-50">
              <CardTitle className="text-pink-700">Essential Learning Outcome 5</CardTitle>
              <CardDescription>
                Learners will generate, gather and organize thoughts to explore, clarify and reflect on ideas, feelings
                and experiences as they create a written or representative draft, independently and collaboratively, for
                a range of audiences and purposes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-4 text-pink-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Grade One Expectations
              </h3>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="pleasure" className="border border-pink-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-pink-50 px-4 py-2 rounded-md">
                    Write for pleasure and personal growth
                  </AccordionTrigger>
                  <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Use the writing process to share ideas with peers.</li>
                      <li>Identify personal strengths as writers and search for new ways to explore ideas.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="process" className="border border-pink-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-pink-50 px-4 py-2 rounded-md">
                    Engage in the writing process
                  </AccordionTrigger>
                  <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Understand that the printed word conveys a message.</li>
                      <li>Participate in the plan, draft, revise, edit and share cycle.</li>
                      <li>Use classroom tools and resources to improve writing.</li>
                      <li>
                        Communicate through a variety of written forms, for various purposes and to a specific audience.
                      </li>
                      <li>Begin to notice and attempt to self correct some errors.</li>
                      <li>Continue to develop a legible and efficient style of printing.</li>
                      <li>
                        Notices a variety of presentation style elements including print, script, fonts, graphics, and
                        layout.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="language" className="border border-pink-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-pink-50 px-4 py-2 rounded-md">
                    Explore language structures
                  </AccordionTrigger>
                  <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Use a combination of home language(s) and English to share their ideas in writing.</li>
                      <li>
                        Use symbols, letters, images and words to communicate ideas about objects, pictures and events.
                      </li>
                      <li>Become aware of how language structure influence meaningful sentences.</li>
                      <li>Begin to organize information around a central idea.</li>
                      <li>Experiment with writing simple sentences in a variety of genres and formats.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="word" className="border border-pink-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-pink-50 px-4 py-2 rounded-md">
                    Explore word solving
                  </AccordionTrigger>
                  <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Focus on spelling words of personal importance.</li>
                      <li>Continue to connect phonological awareness with phonemic information.</li>
                      <li>Spell more high frequency words correctly.</li>
                      <li>
                        Further develop their use of sound symbol strategies, word structure and word meanings to spell
                        unfamiliar words.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                  <h4 className="font-semibold mb-2 text-pink-700 flex items-center">
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Specific Curriculum Outcomes
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>5.1-5.4 Generate and gather thoughts to explore ideas, feelings and experiences.</li>
                    <li>
                      5.5-5.7 Use organisational strategies to arrange thoughts to explore, clarify and reflect on
                      ideas, feelings and experiences.
                    </li>
                    <li>5.8-5.16 Create a written or representative draft.</li>
                  </ul>
                </div>

                <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                  <h4 className="font-semibold mb-2 text-pink-700 flex items-center">
                    <PenTool className="mr-2 h-4 w-4" />
                    Key Learning Strategies
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Pre-writing strategies:</strong> Provide each learner with a writer's notebook to track
                      brainstorming, drafting, revising and editing.
                    </li>
                    <li>
                      <strong>Starting with a Prompt and a Picture Poster:</strong> Discuss writing prompts and have
                      learners create posters with drawings about their topic.
                    </li>
                    <li>
                      <strong>Brainstorming:</strong> Participate in teacher-directed brainstorming to generate ideas
                      for writing.
                    </li>
                    <li>
                      <strong>Organising the Brainstorm:</strong> Demonstrate how to use graphic organizers to place
                      ideas in logical order.
                    </li>
                    <li>
                      <strong>Interactive Writing of a Draft:</strong> Use Interactive Writing to provide differentiated
                      opportunities for learners to contribute to a class or group story.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Assessment Approaches</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>The Writing Journal:</strong> Provides ongoing evidence of progress.
                  </li>
                  <li>
                    <strong>Formative Writing Rubric:</strong> The Northwestern Illustrated Rubric provides insight into
                    writing development stages.
                  </li>
                  <li>
                    <strong>Purpose of Writing Treasure Hunt:</strong> Learners gather writing samples and explain their
                    purpose.
                  </li>
                  <li>
                    <strong>Observation during prewriting:</strong> Teacher observes and guides learners as they gather
                    ideas.
                  </li>
                  <li>
                    <strong>Peer Assessment:</strong> Learners work in small groups to create sentences about a picture
                    and provide feedback.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="elo6" className="mt-4">
          <Card className="border-t-4 border-pink-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-pink-50">
              <CardTitle className="text-pink-700">Essential Learning Outcome 6</CardTitle>
              <CardDescription>
                Learners will revise the organization, and language use (vocabulary and grammar) of drafted writing or
                representation, collaboratively and independently, for a variety of purposes and audiences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                  <h4 className="font-semibold mb-2 text-pink-700 flex items-center">
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Specific Curriculum Outcomes
                  </h4>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="organization" className="border border-pink-200 rounded-md mb-2">
                      <AccordionTrigger className="hover:bg-pink-50 px-4 py-2 rounded-md">
                        Revise organization styles of drafted writing
                      </AccordionTrigger>
                      <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            6.1 Engage in teacher assisted and peer collaboration to review the organisation of the
                            written draft through the process of ARMS: Add, Remove, Move, Substitute.
                          </li>
                          <li>6.2 Revisit brainstorming and illustration to add details to and/or delete details.</li>
                          <li>
                            6.3 Reread their draft and begin to recognize where they can make changes to better organise
                            the beginning, middle, and end.
                          </li>
                          <li>6.4 Experiment with developing writing with a sense of flow.</li>
                          <li>
                            6.5 Begin to establish a personal voice in their writing by using pictures and words that
                            convey their attitude or feelings.
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="vocabulary" className="border border-pink-200 rounded-md mb-2">
                      <AccordionTrigger className="hover:bg-pink-50 px-4 py-2 rounded-md">
                        Develop language use when revising (vocabulary)
                      </AccordionTrigger>
                      <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            6.5 Begin to extend writing to include vocabulary learned during reading and conversation.
                          </li>
                          <li>6.6 Experiment with using multi-sensory words to improve writing.</li>
                          <li>6.7 Begin to use comparison words to distinguish one thing from another.</li>
                          <li>
                            6.8 Become comfortable making decisions about when to include Home Language and/or Standard
                            English.
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="grammar" className="border border-pink-200 rounded-md mb-2">
                      <AccordionTrigger className="hover:bg-pink-50 px-4 py-2 rounded-md">
                        Develop language use when revising (grammar)
                      </AccordionTrigger>
                      <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            6.8 Monitor and revise writing to ensure simple but complete sentences are meaningful.
                          </li>
                          <li>6.9 Develop more understanding of how and when to use descriptive or action words.</li>
                          <li>
                            6.10 Apply knowledge of spoken language to know when to use pronouns, plurals, and words
                            indicating position.
                          </li>
                          <li>6.11 Experiment with some variety in first sentences (leads) of writing.</li>
                          <li>
                            6.12 Demonstrate understanding of the connection between word order and meaningful writing.
                          </li>
                          <li>6.13 Begin to use various types of sentences: declarative, question, and exclamation.</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="voice" className="border border-pink-200 rounded-md mb-2">
                      <AccordionTrigger className="hover:bg-pink-50 px-4 py-2 rounded-md">
                        Develop language use when revising (voice)
                      </AccordionTrigger>
                      <AccordionContent className="bg-pink-50 px-4 py-2 rounded-b-md">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>6.14 Use techniques demonstrated by favorite authors.</li>
                          <li>6.16 Use expressive language to elaborate and create interest.</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                  <h4 className="font-semibold mb-2 text-pink-700 flex items-center">
                    <FileEdit className="mr-2 h-4 w-4" />
                    Learning Strategies
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Going from good to better:</strong> Engage in discussions about how writing improves with
                      revision.
                    </li>
                    <li>
                      <strong>How do we go from good to better?:</strong> Use sample writing to demonstrate revision
                      process.
                    </li>
                    <li>
                      <strong>Keeping it in order:</strong> Create lists of scrambled sentences to practice organizing
                      into meaningful order.
                    </li>
                    <li>
                      <strong>Better writing everyday:</strong> Provide mini-lessons on writing traits (ideas,
                      organization, sentence fluency, voice, word choice).
                    </li>
                    <li>
                      <strong>Better words, better writing:</strong> Co-create charts of interesting words to enhance
                      descriptions.
                    </li>
                    <li>
                      <strong>Begin at the beginning:</strong> Study and practice different types of lead sentences.
                    </li>
                    <li>
                      <strong>Who said that?:</strong> Discuss how favorite authors write in identifiable ways.
                    </li>
                    <li>
                      <strong>Author's Chair:</strong> Provide regular sessions for learners to share revised writing
                      with peers.
                    </li>
                  </ul>

                  <h4 className="font-semibold mb-2 mt-4 text-pink-700 flex items-center">
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Assessment Approaches
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>On demand writing:</strong> Periodic independent writing on chosen topics.
                    </li>
                    <li>
                      <strong>Writing in sequence:</strong> Observe learners creating "How To Books" with sequential
                      steps.
                    </li>
                    <li>
                      <strong>Self and Peer Assessment:</strong> Provide checklists for reviewing writing before
                      revision.
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="elo7" className="mt-4">
          <Card className="border-t-4 border-pink-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-pink-50">
              <CardTitle className="text-pink-700">Essential Learning Outcome 7</CardTitle>
              <CardDescription>
                Learners will use their knowledge of spoken language, written language and writing conventions to refine
                the precision and enhance the meaning and clarity of their written work.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                  <h4 className="font-semibold mb-2 text-pink-700 flex items-center">
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Specific Curriculum Outcomes
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      7.1-7.5 Develop increased confidence, accuracy and willingness to try various strategies to
                      improve writing presentation.
                    </li>
                    <li>
                      7.6-7.13 Apply letter and word knowledge strategies during the writing process to monitor, edit
                      errors and check for correctness.
                    </li>
                    <li>
                      7.14 Begin to add grade-level punctuation conventions (full stops, question marks, exclamation
                      marks, capitals).
                    </li>
                    <li>7.15 Develop hand created or digital presentation styles using various forms.</li>
                    <li>
                      7.16 Participate in opportunities to share a chosen piece of writing with peers or an invited
                      audience.
                    </li>
                  </ul>
                </div>

                <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                  <h4 className="font-semibold mb-2 text-pink-700 flex items-center">
                    <FileCheck className="mr-2 h-4 w-4" />
                    Learning Strategies
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Set the tone for success:</strong> Encourage learners to show what they can do and take
                      risks with editing.
                    </li>
                    <li>
                      <strong>Oops!:</strong> Include spelling errors in morning messages for learners to identify and
                      correct.
                    </li>
                    <li>
                      <strong>Actions help us learn to spell:</strong> Demonstrate strategies for learning spelling
                      through phonological awareness.
                    </li>
                    <li>
                      <strong>Reading to learn spelling:</strong> During Independent Reading, note unfamiliar words to
                      learn.
                    </li>
                    <li>
                      <strong>Error checker:</strong> Provide cards with correct and incorrect spellings for learners to
                      identify.
                    </li>
                    <li>
                      <strong>Be a spelling detective:</strong> Approach spelling as problem-solving using clues from
                      various sources.
                    </li>
                    <li>
                      <strong>The creation of punctuation:</strong> Use videos and examples to teach punctuation in
                      context.
                    </li>
                    <li>
                      <strong>Make a book:</strong> Present writing in various formats using paper folding techniques.
                    </li>
                    <li>
                      <strong>Author's Chair:</strong> Share completed writing projects with peers, parents, or other
                      classes.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Assessment Considerations</h4>
                <p className="mb-2">
                  When assessing learner progress in editing, remember to look for progress and not perfection.
                  Consider:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Reviewing daily writing to gather information about increasing number of correctly spelled words.
                  </li>
                  <li>Identifying areas of difficulty to inform next steps in spelling instruction.</li>
                  <li>Using sentences on topics of interest rather than isolated spelling lists.</li>
                  <li>Acknowledging parts of words or entire words that are correct before addressing errors.</li>
                  <li>Creating a "Wonky Word Wall" for troublesome words and celebrating mastery.</li>
                  <li>Using the Phonics checklist to track development of phonological awareness strategies.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Additional Resources and Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">For Teachers</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Interactive Writing resources and examples</li>
                <li>Northwestern Illustrated Writing Rubric</li>
                <li>Graphic organizers for brainstorming</li>
                <li>Videos about learning to spell</li>
                <li>Dolch word lists for grade-appropriate spelling</li>
                <li>Writing process activities (CUPS: Capitalization, Usage, Punctuation, Spelling)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Writer's notebooks</li>
                <li>Sensory words usage worksheets</li>
                <li>Home writing activities (list making, family stories, bookmaking)</li>
                <li>Field notes templates</li>
                <li>Message board activities</li>
                <li>"I can" book templates</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg border border-pink-100 shadow-md">
            <h3 className="font-semibold mb-4 text-pink-700 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Writing Process Overview
            </h3>
            <p className="mb-4 text-gray-700">
              The writing process in Grade 1 focuses on developing an understanding of the purpose and use of the Traits
              of Writing:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-pink-200 shadow-sm">
                <h4 className="font-semibold text-pink-700 flex items-center mb-2">
                  <PenTool className="mr-2 h-4 w-4" />
                  ELO 5: Drafting
                </h4>
                <p className="text-sm">
                  Brainstorming and Writing the First Draft - Think ideas out loud or draw them before writing.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-pink-200 shadow-sm">
                <h4 className="font-semibold text-pink-700 flex items-center mb-2">
                  <FileEdit className="mr-2 h-4 w-4" />
                  ELO 6: Revising
                </h4>
                <p className="text-sm">
                  After completing the first draft, reread and perhaps share it before revising.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-pink-200 shadow-sm">
                <h4 className="font-semibold text-pink-700 flex items-center mb-2">
                  <FileCheck className="mr-2 h-4 w-4" />
                  ELO 7: Editing
                </h4>
                <p className="text-sm">
                  Writing the final version using best efforts at spelling and visual presentation.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
