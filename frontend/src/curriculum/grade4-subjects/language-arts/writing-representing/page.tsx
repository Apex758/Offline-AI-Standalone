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
      
      <Link href="/curriculum/grade4-subjects/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 4 Language Arts
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-100 to-teal-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-green-700 flex items-center">
            <PenTool className="mr-2 h-7 w-7 text-green-600" />
            Writing and Representing
          </h1>
          <p className="text-gray-700">
            In Grade 4, students refine their writing and representing skills through a more sophisticated application
            of the writing process. They develop greater independence as writers, crafting texts in various genres for
            different purposes and audiences while strengthening their understanding of writing conventions, voice, and
            style.
          </p>
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Four Expectations for Writing and Representing
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
              <li>Choose sophisticated topics of personal interest to explore in writing</li>
              <li>Analyze and apply techniques from favorite authors as models for their own writing</li>
              <li>Write daily for various purposes to develop writing fluency and confidence</li>
              <li>
                Independently reflect on personal strengths as writers, identify areas for improvement, and implement
                strategies for growth throughout the writing process
              </li>
              <li>Begin to develop a unique writing voice and personal style</li>
            </ul>
          </TabsContent>

          <TabsContent value="process" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Engage in the Writing Process</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                Demonstrate deeper understanding and application of genre structures: Narrative, Expository,
                Descriptive, Opinion/Argumentative, and Persuasive
              </li>
              <li>
                Write with clarity and purpose for multiple audiences, adjusting tone and formality as appropriate
              </li>
              <li>
                Generate, organize, and develop focused ideas with supporting details appropriate to genre and purpose
              </li>
              <li>
                Apply editing, proofreading, and publishing skills with increasing independence to produce polished,
                effective writing
              </li>
              <li>Integrate information from multiple print and digital sources to support research and writing</li>
              <li>
                Make deliberate choices about presentation elements including layout, formatting, graphics, and
                multimedia to enhance communication
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="structures" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Explore Language Structures</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Craft well-organized paragraphs with clear topic sentences and supporting details</li>
              <li>Use transitional words and phrases to connect ideas within and between paragraphs</li>
              <li>
                Distinguish between and appropriately apply formal and informal language according to purpose and
                audience
              </li>
              <li>
                Independently monitor and revise for varied sentence structures, precise vocabulary, engaging voice, and
                correct grammar
              </li>
              <li>
                Apply understanding of text features (headings, captions, charts, etc.) to enhance informational writing
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="wordsolving" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Explore Word Solving</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Select precise and nuanced vocabulary to effectively convey meaning and create desired impact</li>
              <li>Write legibly in both manuscript and cursive with appropriate spacing and formatting</li>
              <li>Apply knowledge of spelling patterns, morphology, and etymology to spell grade-level words</li>
              <li>
                Use reference materials and digital tools with increasing independence to verify spelling and word usage
              </li>
              <li>Develop understanding of how word choice contributes to tone, mood, and author's purpose</li>
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
            <CardDescription>By the end of Grade Four, the learner will be expected to:</CardDescription>
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
                      Maintain and effectively use a writer's notebook to collect ideas, observations, quotations, and
                      information for writing projects
                    </li>
                    <li>
                      Curate a writing portfolio that demonstrates growth and learning across multiple drafts and genres
                    </li>
                    <li>
                      Independently identify appropriate topic, purpose, audience, and form before beginning to write
                    </li>
                    <li>
                      Apply various brainstorming techniques (mind mapping, listing, webbing, etc.) to generate and
                      develop ideas for writing
                    </li>
                    <li>Gather and evaluate information from multiple sources to support writing on specific topics</li>
                    <li>
                      Create and use increasingly complex graphic organizers appropriate to different writing genres
                    </li>
                    <li>
                      Contribute meaningfully to collaborative writing projects, respecting and building on others'
                      ideas
                    </li>
                    <li>
                      Write informational texts that introduce a topic clearly, group related information logically, and
                      include facts, definitions, details, and quotations
                    </li>
                    <li>
                      Craft narrative texts that establish situation, introduce characters, and unfold events naturally
                      with dialogue and description
                    </li>
                    <li>
                      Develop opinion pieces with reasons supported by facts and details, organized in a logical
                      sequence with a strong conclusion
                    </li>
                    <li>
                      Use digital platforms for various writing purposes, including blogs, shared documents, and
                      multimedia presentations
                    </li>
                    <li>
                      Intentionally apply the traits of Ideas, Organization, Voice, Word Choice, Sentence Fluency, and
                      Conventions in drafting
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">Revising</AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Independently assess drafts for clarity, completeness, and organization, making revisions as
                      needed
                    </li>
                    <li>
                      Provide and thoughtfully incorporate specific, constructive feedback during peer revision sessions
                    </li>
                    <li>
                      Evaluate and revise text structure to ensure logical progression of ideas and smooth transitions
                    </li>
                    <li>
                      Demonstrate understanding of the distinctions between Home Language and Standard English, making
                      appropriate choices for purpose and audience
                    </li>
                    <li>Revise for precise word choice, eliminating repetitive, vague, or overused language</li>
                    <li>Use thesaurus (print or digital) to enhance vocabulary and word choice independently</li>
                    <li>Expand, combine, and reduce sentences for meaning, interest, and style</li>
                    <li>
                      Apply figurative language (similes, metaphors, personification, idioms) effectively to enhance
                      writing
                    </li>
                    <li>Assess and revise for sentence variety, considering length, structure, and beginnings</li>
                    <li>Develop character depth through dialogue, thoughts, feelings, actions, and reactions</li>
                    <li>Enhance descriptions using sensory details and specific language to create vivid images</li>
                    <li>
                      Analyze mentor texts to identify effective techniques and incorporate them into original writing
                    </li>
                    <li>
                      Experiment with perspective and point of view (first, third, multiple narrators) to achieve
                      desired effect
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
                    <li>
                      Apply systematic strategies to identify and correct spelling errors, using patterns, rules, and
                      reference materials
                    </li>
                    <li>
                      Use knowledge of common Greek and Latin roots, prefixes, and suffixes to determine spelling and
                      meaning
                    </li>
                    <li>
                      Edit for correct use of capitalization, punctuation (including quotation marks, commas in a
                      series, commas in compound sentences), and end marks
                    </li>
                    <li>
                      Apply understanding of subject-verb agreement, verb tense consistency, pronoun usage, and commonly
                      confused words
                    </li>
                    <li>
                      Use multiple proofreading strategies to identify and correct errors in spelling, punctuation, and
                      grammar
                    </li>
                    <li>Make informed choices about final format and presentation for various writing purposes</li>
                    <li>
                      Use technology to produce, publish, and share writing, demonstrating sufficient command of
                      keyboarding skills
                    </li>
                    <li>Incorporate appropriate visuals, charts, graphs, or multimedia elements to enhance text</li>
                    <li>Correctly cite sources used in research according to grade-appropriate guidelines</li>
                    <li>Provide constructive feedback to peers on published work using specific criteria</li>
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
                      <span className="font-medium">Writing Conferences:</span> Structured individual discussions
                      focused on specific skills, goals, and growth areas in student writing
                    </li>
                    <li>
                      <span className="font-medium">Process Portfolios:</span> Collections showing development of
                      writing pieces from brainstorming through final publication
                    </li>
                    <li>
                      <span className="font-medium">Self-Assessment Checklists:</span> Detailed criteria for students to
                      evaluate their own writing in different genres
                    </li>
                    <li>
                      <span className="font-medium">Peer Review:</span> Guided feedback sessions using specific
                      protocols to provide constructive criticism
                    </li>
                    <li>
                      <span className="font-medium">Focused Observations:</span> Teacher notes on student application of
                      specific writing strategies during independent writing
                    </li>
                    <li>
                      <span className="font-medium">Writing Reflections:</span> Student analysis of their growth,
                      challenges, and goals as writers
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
                      <span className="font-medium">Genre-Specific Rubrics:</span> Detailed scoring guides tailored to
                      narrative, informational, opinion, and poetic writing
                    </li>
                    <li>
                      <span className="font-medium">Trait-Based Assessments:</span> Evaluation of specific traits such
                      as ideas, organization, voice, word choice, sentence fluency, and conventions
                    </li>
                    <li>
                      <span className="font-medium">Research Reports:</span> Multi-stage projects incorporating
                      research, note-taking, drafting, revising, and presenting
                    </li>
                    <li>
                      <span className="font-medium">Multimedia Presentations:</span> Integrated projects that combine
                      written text with visual, audio, or interactive elements
                    </li>
                    <li>
                      <span className="font-medium">Timed Writing:</span> On-demand writing tasks to assess independent
                      application of writing skills
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
                      <span className="font-medium">Multimodal Options:</span> Allowing students to demonstrate writing
                      skills through various formats (handwritten, typed, dictated, illustrated, digital)
                    </li>
                    <li>
                      <span className="font-medium">Differentiated Rubrics:</span> Adjusting criteria and expectations
                      based on individual student goals while maintaining high standards
                    </li>
                    <li>
                      <span className="font-medium">Culturally Responsive Writing Tasks:</span> Designing assignments
                      that connect to students' cultural backgrounds, experiences, and interests
                    </li>
                    <li>
                      <span className="font-medium">Choice Boards:</span> Offering options for demonstrating writing
                      skills through different products or processes
                    </li>
                    <li>
                      <span className="font-medium">Strategic Scaffolding:</span> Providing appropriate supports
                      (graphic organizers, sentence frames, word banks) based on individual needs
                    </li>
                    <li>
                      <span className="font-medium">Progress Monitoring:</span> Tracking individual growth over time
                      rather than comparing students to a single standard
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
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Mentor Text Analysis
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <p className="mb-2">
                    Using exemplary texts to analyze and learn from author's craft and writing techniques.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Select diverse texts that demonstrate specific writing skills or techniques</li>
                    <li>
                      Guide students to identify and analyze effective elements (leads, descriptions, dialogue, etc.)
                    </li>
                    <li>
                      Annotate texts to highlight structure, vocabulary, transitional phrases, and literary devices
                    </li>
                    <li>Have students experiment with applying identified techniques in their own writing</li>
                    <li>Use mentor texts from Caribbean authors to highlight culturally relevant writing styles</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="teach-2" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Guided Writing Workshops
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <p className="mb-2">
                    Structured approach combining explicit instruction, guided practice, independent writing, and
                    feedback.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Begin with focused mini-lessons (10-15 minutes) on specific writing techniques</li>
                    <li>Model the writing process through think-alouds and demonstrations</li>
                    <li>Provide scaffolded writing time with teacher support for those who need it</li>
                    <li>Conduct targeted small group instruction while others write independently</li>
                    <li>Include regular conferencing, peer review, and sharing opportunities</li>
                    <li>Maintain consistent routines, expectations, and resources for writing time</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="teach-3" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Genre Study Approach
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <p className="mb-2">
                    Deep exploration of specific writing genres through reading, analysis, and targeted writing
                    practice.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Immerse students in a particular genre through wide reading and discussion</li>
                    <li>Collaboratively identify and chart the characteristics and structures of the genre</li>
                    <li>Analyze mentor texts within the genre for specific techniques and features</li>
                    <li>Guide students through the writing process to create their own examples of the genre</li>
                    <li>
                      Cycle through important genres (narrative, informational, opinion/argument, poetry) throughout the
                      year
                    </li>
                    <li>Connect genre studies to content area learning when appropriate</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="teach-4" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Digital Writing and Multimedia
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <p className="mb-2">
                    Integrating technology and digital tools to enhance writing instruction and expand communication
                    options.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Teach digital writing skills including keyboarding, formatting, and basic design principles</li>
                    <li>Explore digital storytelling tools that combine text, images, audio, and simple animation</li>
                    <li>Use collaborative writing platforms for peer feedback and group projects</li>
                    <li>Create class blogs or digital portfolios to showcase student writing</li>
                    <li>Teach responsible research and citation practices using digital sources</li>
                    <li>Discuss digital citizenship and appropriate online communication</li>
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
                    <li>Caribbean and OECS children's literature that reflects local culture, history, and language</li>
                    <li>Picture books and novels with exceptional descriptive language and dialogue</li>
                    <li>Well-structured informational texts with clear organization and features</li>
                    <li>Persuasive and argumentative texts that demonstrate effective reasoning</li>
                    <li>Poetry collections showcasing various forms, techniques, and cultural perspectives</li>
                    <li>Digital and multimodal texts that integrate various forms of communication</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="res-2" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Classroom Materials
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Writer's notebooks for collecting ideas, observations, and writing experiments</li>
                    <li>Genre-specific planning templates and graphic organizers</li>
                    <li>Revision and editing checklists tailored to Grade 4 expectations</li>
                    <li>Anchor charts for writing strategies, grammar rules, and revision techniques</li>
                    <li>Word walls featuring content vocabulary, transitional phrases, and descriptive language</li>
                    <li>Publishing materials for creating finished products (binding, covers, special paper)</li>
                    <li>Writing center with varied paper types, writing tools, thesauruses, and dictionaries</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="res-3" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Digital Resources
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Word processing programs with appropriate features for Grade 4 students</li>
                    <li>Digital storytelling platforms (e.g., Book Creator, StoryJumper, Adobe Spark)</li>
                    <li>Collaborative writing tools (e.g., Google Docs with commenting features)</li>
                    <li>Online graphic organizers and planning tools</li>
                    <li>Digital portfolios for collecting and reflecting on writing</li>
                    <li>Age-appropriate grammar and spelling practice programs</li>
                    <li>Research resources designed for elementary students</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="res-4" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Teacher Resources
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>OECS Grade 4 Language Arts Curriculum Guide</li>
                    <li>Professional books on teaching writing in upper elementary grades</li>
                    <li>Assessment resources including rubrics, checklists, and conference guides</li>
                    <li>Lesson plan templates for writing mini-lessons and workshops</li>
                    <li>Collections of writing prompts for various genres and purposes</li>
                    <li>Sample mentor text lessons with discussion questions and activities</li>
                    <li>Resources on supporting diverse learners in developing writing skills</li>
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
            <CardDescription>Engaging writing activities for Grade 4 students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-green-200 rounded-lg p-4 bg-white hover:shadow-md transition-all">
                <h4 className="font-semibold text-green-700 mb-2">Caribbean Heritage Journal</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Students research and write about aspects of their cultural heritage, combining personal narratives
                  with historical information.
                </p>
                <Link href="/curriculum/grade4-subjects/activities/language-arts/heritage-journal">
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                    View Activity
                  </Button>
                </Link>
              </div>

              <div className="border border-green-200 rounded-lg p-4 bg-white hover:shadow-md transition-all">
                <h4 className="font-semibold text-green-700 mb-2">Multimedia News Report</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Students create news reports on local or school events, integrating written articles with photos,
                  graphics, and video interviews.
                </p>
                <Link href="/curriculum/grade4-subjects/activities/language-arts/multimedia-news">
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                    View Activity
                  </Button>
                </Link>
              </div>

              <div className="border border-green-200 rounded-lg p-4 bg-white hover:shadow-md transition-all">
                <h4 className="font-semibold text-green-700 mb-2">Environmental Advocacy Campaign</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Students research local environmental issues and create persuasive writing pieces to advocate for
                  positive changes in their community.
                </p>
                <Link href="/curriculum/grade4-subjects/activities/language-arts/environmental-advocacy">
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                    View Activity
                  </Button>
                </Link>
              </div>

              <div className="border border-green-200 rounded-lg p-4 bg-white hover:shadow-md transition-all">
                <h4 className="font-semibold text-green-700 mb-2">Digital Poetry Collection</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Students explore different poetic forms and create an illustrated digital anthology of original poems
                  incorporating Caribbean themes.
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
        <Link href="/curriculum/grade4-subjects/language-arts/reading-viewing">
          <Button variant="outline" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" /> Reading & Viewing
          </Button>
        </Link>
        <Link href="/curriculum/grade4-subjects/activities/language-arts">
          <Button className="bg-green-600 hover:bg-green-700">Explore Language Arts Activities</Button>
        </Link>
      </div>
    </div>
  )
}
