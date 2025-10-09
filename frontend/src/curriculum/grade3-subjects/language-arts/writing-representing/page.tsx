import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, PenTool, ClipboardCheck, BookOpen, Lightbulb, CheckSquare } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function WritingRepresentingPage() {
  return (
    <div className="container mx-auto py-8">
      
      <Link href="/curriculum/grade3-subjects/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 3 Language Arts
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-100 to-teal-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-green-700 flex items-center">
            <PenTool className="mr-2 h-7 w-7 text-green-600" />
            Writing and Representing
          </h1>
          <p className="text-gray-700">
            In Grade 3, students develop their writing and representing skills through the writing process: planning,
            drafting, revising, editing, and publishing. They learn to write for various purposes and audiences, using
            different genres and text forms while developing their understanding of writing conventions.
          </p>
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Three Expectations for Writing and Representing
        </h3>

        <Tabs defaultValue="pleasure">
          <TabsList className="grid w-full grid-cols-4 bg-green-100">
            <TabsTrigger value="pleasure" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              For Pleasure & Growth
            </TabsTrigger>
            <TabsTrigger value="process" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Writing Process
            </TabsTrigger>
            <TabsTrigger value="structures" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Language Structures
            </TabsTrigger>
            <TabsTrigger
              value="wordsolving"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Word Solving
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pleasure" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Write for Pleasure and Personal Growth</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Choose topics of personal interest to share</li>
              <li>Use the writing of favourite authors as models for their own writing</li>
              <li>
                Reflect on and identify their strengths as writers, areas for improvement and the strategies they found
                most helpful at different stages in the writing process
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="process" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Engage in the Writing Process</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                Continue to develop understanding and application of the purpose and structure of the genres: Narrative,
                Expository, Descriptive, Opinion, Persuasive
              </li>
              <li>
                State the purpose and write for a variety of purposes including self, to explain, to describe, to
                report, to write about real or imagined experiences
              </li>
              <li>Generate, gather, and organize ideas and information to write for intended purposes and audiences</li>
              <li>
                Use editing, proofreading, and publishing skills and strategies and knowledge of language conventions to
                correct errors, refine expression and present their work effectively
              </li>
              <li>Use print and technological resources for locating information</li>
              <li>
                Begin to use a variety of presentation style elements including print, script, fonts, graphics, and
                layout
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="structures" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Explore Language Structures</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Organize writing into paragraphs</li>
              <li>Apply selected text types previously studied</li>
              <li>
                Make decisions about when casual or formal language is required and apply those language structures
              </li>
              <li>
                Monitor writing more independently to revise and edit vocabulary, sentence fluency, voice and grammar
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="wordsolving" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Explore Word Solving</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Select words for their appropriateness and exactness in conveying intended meanings</li>
              <li>Write legibly</li>
              <li>Monitor writing more independently to edit spelling</li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-green-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade Three, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Prewriting and Drafting
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Maintain a personal record of interests, personal or community experiences, music, books, pictures
                      for use as writing prompts
                    </li>
                    <li>
                      Maintain a writing portfolio that includes drafts, revisions, personal dictionary, personal
                      writing prompts, etc.
                    </li>
                    <li>Identify the topic, purpose, audience, and form for writing</li>
                    <li>
                      Participate in group and individual brainstorming to gather ideas for their writing, to write for
                      an intended purpose and audience
                    </li>
                    <li>Become familiar with a variety of paper based and digital brainstorming techniques</li>
                    <li>
                      Gather information from a variety of paper based and digital resources to support and enhance
                      brainstorm
                    </li>
                    <li>Reflect on ideas gathered and add, revise, or delete to suit to topic and genre</li>
                    <li>Organize ideas and information to write for an intended purpose and audience</li>
                    <li>Further develop independence in using, choosing, and creating simple graphic organizers</li>
                    <li>Participate and contribute to shared writing opportunities that reflect the genre studied</li>
                    <li>Write a simple nonfiction report on a topic of personal relevance</li>
                    <li>
                      Explore and begin to use blogs, google classroom diary, social media to contribute to various
                      genres of writing
                    </li>
                    <li>
                      Refer to texts and conversations as anchors for organizing a sequence of events, changes in
                      setting, and character development
                    </li>
                    <li>Further develop understanding of the purpose and organization of various writing genres</li>
                    <li>
                      Continue to develop and apply understanding of the Writing Traits of Ideas, Organization and
                      Language Use with increasing independence
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">Revising</AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Continue to develop self assessment revision strategies by self monitoring writing for form and
                      organization
                    </li>
                    <li>
                      Use feedback given by peers and teachers as an aid in writing and strengthening the organization
                      of the draft
                    </li>
                    <li>Experiment with digital and paper-based organization with various real-world genres</li>
                    <li>
                      Continue to develop and appreciate the purpose and place of Home Language and Standard English
                      vocabulary
                    </li>
                    <li>Continue to develop self monitoring of errors in word use</li>
                    <li>Explore synonyms to enhance, clarify and expand information</li>
                    <li>Connect the use of sensory verbs, adjectives, and adverbs to enliven language</li>
                    <li>
                      Demonstrate understanding of figurative language by using simple similes, metaphors, and
                      personification in their writing
                    </li>
                    <li>Use a paper based or digital dictionary or thesaurus to clarify the meaning of keywords</li>
                    <li>Recognize and use words with multiple meanings with understanding and intent</li>
                    <li>
                      Acknowledge the importance and purpose of the grammar of Home Language(s), standard and informal
                      writing
                    </li>
                    <li>
                      Revise with a focus on monitoring for complete and well-formed sentences that are clear and
                      understandable
                    </li>
                    <li>
                      Continue to engage in individual and shared peer revision opportunities to share drafts aloud and
                      provide/receive feedback
                    </li>
                    <li>Begin to use a simple digital grammar checker</li>
                    <li>Begin to notice how favourite authors use language and why it is engaging</li>
                    <li>Experiment with a variety of writing styles to develop a sense of authorship</li>
                    <li>Experiment with writing from another perspective (an animal, an alien, etc.)</li>
                    <li>
                      Experiment with character, dialogue and descriptions of actions, thoughts, and feelings to fully
                      develop character
                    </li>
                    <li>
                      Experiment with real or imagined experiences or events using descriptive details and intentional
                      sequences of event
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Editing and Publishing
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Continue to develop spelling accuracy and automaticity</li>
                    <li>
                      Use temporary (or attempted) spelling with an increasing knowledge of spelling patterns of
                      language(s) in common use
                    </li>
                    <li>Continue to refine the use spelling patterns and generalizations</li>
                    <li>
                      Consult reference materials, including paper based, digital dictionaries and spell check, to
                      monitor and correct spellings
                    </li>
                    <li>
                      Use technology to produce and publish writing (using keyboarding skills) as well as to interact
                      and collaborate with others
                    </li>
                    <li>
                      Engage in individual and shared peer editing opportunities to share drafts aloud and
                      provide/receive feedback
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-green-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-700 flex items-center">
              <CheckSquare className="mr-2 h-5 w-5" />
              Assessment Strategies
            </CardTitle>
            <CardDescription>Approaches to assess writing and representing skills</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="assess-1" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Formative Assessment
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Writing Conferences:</span> Regular one-on-one meetings with
                      students to discuss their writing progress, provide feedback, and set goals
                    </li>
                    <li>
                      <span className="font-medium">Writing Portfolios:</span> Collections of student writing samples
                      that demonstrate growth over time
                    </li>
                    <li>
                      <span className="font-medium">Self-Assessment Checklists:</span> Students evaluate their own
                      writing using grade-appropriate criteria
                    </li>
                    <li>
                      <span className="font-medium">Peer Feedback:</span> Structured opportunities for students to share
                      and respond to each other's writing
                    </li>
                    <li>
                      <span className="font-medium">Observation Notes:</span> Teacher observations of students during
                      the writing process
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="assess-2" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Summative Assessment
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Writing Samples:</span> Completed pieces that demonstrate mastery of
                      specific writing skills and genres
                    </li>
                    <li>
                      <span className="font-medium">Rubrics:</span> Detailed scoring guides for different types of
                      writing (narrative, informational, opinion)
                    </li>
                    <li>
                      <span className="font-medium">Writing Projects:</span> Multi-stage writing assignments that
                      incorporate research, planning, drafting, and publishing
                    </li>
                    <li>
                      <span className="font-medium">Digital Presentations:</span> Multimedia projects that combine
                      writing with visual elements
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="assess-3" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Inclusive Assessment
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium">Multiple Modes:</span> Allowing students to demonstrate writing
                      skills through various formats (handwritten, typed, dictated, illustrated)
                    </li>
                    <li>
                      <span className="font-medium">Scaffolded Assessments:</span> Providing appropriate supports such
                      as graphic organizers, word banks, or sentence starters
                    </li>
                    <li>
                      <span className="font-medium">Culturally Responsive Topics:</span> Offering writing prompts that
                      connect to students' cultural backgrounds and experiences
                    </li>
                    <li>
                      <span className="font-medium">Extended Time:</span> Allowing additional time for students who need
                      it to complete writing tasks
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-green-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-700 flex items-center">
              <Lightbulb className="mr-2 h-5 w-5" />
              Teaching Strategies
            </CardTitle>
            <CardDescription>Effective approaches for teaching writing and representing</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="teach-1" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">Modeled Writing</AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <p className="mb-2">
                    The teacher demonstrates the writing process by thinking aloud while composing text, making the
                    internal process of writing visible to students.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Model prewriting strategies such as brainstorming, mind mapping, and outlining</li>
                    <li>Demonstrate how to craft strong beginnings, middles, and endings</li>
                    <li>Show how to revise for clarity, organization, and word choice</li>
                    <li>Model editing for spelling, punctuation, and grammar</li>
                    <li>Demonstrate how to publish and share finished writing</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="teach-2" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Shared and Interactive Writing
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <p className="mb-2">
                    Collaborative writing experiences where the teacher and students compose text together, with varying
                    levels of teacher support.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Co-create class stories, poems, or informational texts</li>
                    <li>Take turns contributing ideas and sentences</li>
                    <li>Discuss writing decisions in real-time</li>
                    <li>Use interactive writing for morning messages, class rules, or letters</li>
                    <li>Gradually release responsibility to students as skills develop</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="teach-3" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">Writers Workshop</AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <p className="mb-2">
                    A structured approach to writing instruction that includes mini-lessons, independent writing time,
                    conferences, and sharing.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Begin with focused mini-lessons on specific writing skills or strategies</li>
                    <li>Provide extended time for independent writing</li>
                    <li>Conduct individual or small group conferences during writing time</li>
                    <li>End with author's chair or sharing time</li>
                    <li>Maintain consistent routines and expectations</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="teach-4" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Digital Writing Tools
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <p className="mb-2">
                    Incorporating technology to enhance the writing process and develop digital literacy skills.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Use word processing programs with age-appropriate features</li>
                    <li>Explore digital storytelling platforms</li>
                    <li>Create simple blogs or digital journals</li>
                    <li>Use collaborative writing tools for group projects</li>
                    <li>Teach basic keyboarding skills alongside handwriting</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-green-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-700 flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Resources
            </CardTitle>
            <CardDescription>Materials to support writing and representing instruction</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="res-1" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">Mentor Texts</AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <p className="mb-2">High-quality literature that serves as models for student writing.</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Caribbean and OECS children's literature that reflects local culture and language</li>
                    <li>Picture books with strong examples of descriptive language</li>
                    <li>Narrative texts with well-developed characters and settings</li>
                    <li>Informational texts with clear organization and features</li>
                    <li>Poetry collections showcasing various forms and techniques</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="res-2" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Classroom Materials
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Writing journals or notebooks for daily writing</li>
                    <li>Graphic organizers for different writing genres</li>
                    <li>Word walls with high-frequency words and content vocabulary</li>
                    <li>Editing checklists appropriate for Grade 3</li>
                    <li>Publishing materials (special paper, binding supplies, etc.)</li>
                    <li>Writing center with various paper types, writing tools, and reference materials</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="res-3" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Digital Resources
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Age-appropriate word processing programs</li>
                    <li>Digital storytelling platforms (e.g., Book Creator, StoryJumper)</li>
                    <li>Online dictionaries and thesauruses designed for children</li>
                    <li>Grammar and spelling practice websites</li>
                    <li>Virtual writing prompts and idea generators</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="res-4" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Teacher Resources
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Professional books on writing instruction for elementary students</li>
                    <li>Assessment tools and rubrics for different writing genres</li>
                    <li>Lesson plan templates for writing mini-lessons</li>
                    <li>Writing prompt collections for various genres</li>
                    <li>Professional development resources on teaching writing</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="border-t-4 border-green-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-700 flex items-center">
              <Lightbulb className="mr-2 h-5 w-5" />
              Recommended Learning Activities
            </CardTitle>
            <CardDescription>Engaging writing activities for Grade 3 students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-green-200 rounded-lg p-4 bg-white hover:shadow-md transition-all">
                <h4 className="font-semibold text-green-700 mb-2">Author's Workshop</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Students work through the complete writing process to create their own books on topics of their
                  choice.
                </p>
                <Link href="/curriculum/grade3-subjects/activities/language-arts/authors-workshop">
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                    View Activity
                  </Button>
                </Link>
              </div>

              <div className="border border-green-200 rounded-lg p-4 bg-white hover:shadow-md transition-all">
                <h4 className="font-semibold text-green-700 mb-2">Cultural Poetry Writing</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Students explore and create poems that celebrate their cultural heritage and local traditions.
                </p>
                <Link href="/curriculum/grade3-subjects/activities/language-arts/cultural-poetry">
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                    View Activity
                  </Button>
                </Link>
              </div>

              <div className="border border-green-200 rounded-lg p-4 bg-white hover:shadow-md transition-all">
                <h4 className="font-semibold text-green-700 mb-2">Reading Response Journals</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Students maintain journals where they respond to their reading through writing and drawing.
                </p>
                <Link href="/curriculum/grade3-subjects/activities/language-arts/reading-response-journals">
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                    View Activity
                  </Button>
                </Link>
              </div>

              <div className="border border-green-200 rounded-lg p-4 bg-white hover:shadow-md transition-all">
                <h4 className="font-semibold text-green-700 mb-2">Digital Storytelling</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Students create multimedia stories combining text, images, and simple animations.
                </p>
                <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                  Coming Soon
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-between">
        <Link href="/curriculum/grade3-subjects/language-arts/reading-viewing">
          <Button variant="outline" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" /> Reading & Viewing
          </Button>
        </Link>
        <Link href="/curriculum/grade3-subjects/activities/language-arts">
          <Button className="bg-green-600 hover:bg-green-700">Explore Language Arts Activities</Button>
        </Link>
      </div>
    </div>
  )
}
