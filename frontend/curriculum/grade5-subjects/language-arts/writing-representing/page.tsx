"use client"

import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, PenTool, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function WritingRepresentingPage() {
  return (
    <div className="container mx-auto py-8">
      
      <Link href="/curriculum/grade5-subjects/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 5 Language Arts
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-green-700 flex items-center">
            <PenTool className="mr-2 h-7 w-7 text-green-600" />
            Writing and Representing
          </h1>
          <p className="text-gray-700">
            In Grade 5, students develop sophisticated writing skills across multiple genres, learning to revise and
            refine their work for various audiences and purposes. They explore the writing process from brainstorming to
            publication, incorporating digital tools and multimedia elements.
          </p>
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Five Expectations for Writing and Representing
        </h3>

        <Tabs defaultValue="pleasure">
          <TabsList className="grid w-full grid-cols-3 bg-green-100">
            <TabsTrigger value="pleasure" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Write for Pleasure & Personal Growth
            </TabsTrigger>
            <TabsTrigger value="process" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Engage in the Writing Process
            </TabsTrigger>
            <TabsTrigger value="language" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Explore Language Structures
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pleasure" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Write for Pleasure and Personal Growth</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                Understand that writing provides a way to recognize and share their culture, thinking and demonstrations
                of learning
              </li>
              <li>Discuss the quality of what is written and relate it to the principles of author's craft</li>
              <li>
                Reflect on and identify their strengths as writers, areas of improvement and the strategies they found
                most useful at different stages of the writing process
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="process" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Engage in the Writing Process</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Generate, gather and organize ideas and information to write for an intended purpose and audience</li>
              <li>
                Draft and revise their writing, using a variety of informational, literary and graphic forms and
                stylistic elements appropriate for the purpose and audience
              </li>
              <li>
                Use editing, proofreading and publishing skills and strategies and knowledge of language conventions
              </li>
              <li>Use a range of presentation style elements including print, script, fonts, graphics and layout</li>
            </ul>
          </TabsContent>

          <TabsContent value="language" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Explore Language Structures</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Monitor language use for intended and unintended messages</li>
              <li>Use complex punctuation meaningfully</li>
              <li>Broaden vocabulary and vary their writing to suit the purpose and the reader</li>
              <li>
                Use a clear structure to organize their writing, sequence events and recount them in appropriate detail
              </li>
              <li>Use most conventions to correct errors, refine expression and present their work effectively</li>
              <li>Explore similarities and differences in how affixes affect meaning</li>
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
            <CardDescription>By the end of Grade Five, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Generate, Gather and Organize Ideas (ELO 5)
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Generate, gather and organize ideas and information to write for an intended purpose and audience
                    </li>
                    <li>
                      Reflect on and identify their strengths as writers, areas of improvement and the strategies they
                      found most useful at different stages of the writing process
                    </li>
                    <li>Brainstorm content for short research projects that build knowledge about a topic</li>
                    <li>
                      Continue to use personal interests or community experiences, music, books, documentaries, videos,
                      pictures as writing prompts
                    </li>
                    <li>Maintain writing portfolios - drafts, revisions, personal writing prompts, etc.</li>
                    <li>
                      Use a variety of paper-based and digital resources to gather information to support and enhance
                      the brainstorming process
                    </li>
                    <li>
                      Examine samples of different genres as models for organizing a sequence of events, changes in
                      setting, and character development
                    </li>
                    <li>
                      Develop competence in organizing and arranging ideas and information to write for an intended
                      purpose and audience
                    </li>
                    <li>Organize and strengthen writing during drafting stage</li>
                    <li>
                      Create and use simple paper based or digital graphic organizers to aid the organization of ideas
                    </li>
                    <li>
                      Continue to explore and experiment with various ways to express their thoughts and ideas in
                      various text forms (e.g., Narrative, Descriptive, Expository, Persuasive)
                    </li>
                    <li>
                      Continue to utilize strategies to organize ideas into a draft that supports the topic, enhances
                      clarity, and sequences logically
                    </li>
                    <li>
                      Demonstrate understanding by using linking words and phrases to develop a logical progression of
                      ideas and thoughts
                    </li>
                    <li>
                      Continue to explore and represent in written pieces: introductory/topic sentences, concluding
                      sentences, paragraphs, a range of vocabulary to match the genre and purpose of the writing
                    </li>
                    <li>Continue to develop purpose and use of the form of simple, compound, and complex sentences</li>
                    <li>
                      Build on existing knowledge of the various genres: narrative writing, expository writing,
                      descriptive writing, persuasive writing, poetry, book reports
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Revise Organization and Language Use (ELO 6)
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Analyse and identify different organization styles used in written drafts and representations,
                      including narrative, descriptive, expository, persuasive structures
                    </li>
                    <li>Evaluate the effectiveness of organization styles within various subgenres</li>
                    <li>
                      Revise written drafts to improve organization by selecting and applying appropriate organization
                      styles based on the purpose, audience, and content of the writing
                    </li>
                    <li>
                      Demonstrate proficiency in using graphic organizers, outlines, and other planning tools to
                      structure and organize ideas effectively in written drafts
                    </li>
                    <li>
                      Communicate ideas clearly and coherently through written drafts, employing transitions, topic
                      sentences, and logical sequencing to enhance organization and flow
                    </li>
                    <li>
                      Reflect on their own writing process and make strategic decisions to refine organization styles
                      based on feedback from peers and teachers
                    </li>
                    <li>
                      Apply organization principles learned in writing drafts to other forms of representation, such as
                      presentations, posters, and multimedia projects
                    </li>
                    <li>
                      Expand their vocabulary repertoire by identifying and incorporating a variety of precise and
                      descriptive vocabulary words into their written drafts
                    </li>
                    <li>
                      Demonstrate the ability to select appropriate synonyms and antonyms to enhance the clarity, depth,
                      and richness of their vocabulary choices in written compositions
                    </li>
                    <li>
                      Apply context clues and word analysis strategies to infer the meanings of unfamiliar vocabulary
                      words encountered in written drafts and effectively incorporate them into their writing
                    </li>
                    <li>
                      Revise and refine their written drafts by replacing generic or repetitive vocabulary with more
                      specific and nuanced language to convey precise meanings and evoke vivid imagery
                    </li>
                    <li>
                      Analyse the impact of word choice on the tone, mood, and overall effectiveness of their written
                      compositions
                    </li>
                    <li>
                      Reflect on their vocabulary learning process, identifying strengths and areas for growth, and
                      setting goals for further expanding and diversifying their vocabulary skills
                    </li>
                    <li>
                      Engage in peer collaboration and feedback sessions to receive input on their vocabulary usage in
                      written drafts
                    </li>
                    <li>
                      Identify and correct grammatical errors in written drafts, including errors related to verb tense,
                      subject-verb agreement, punctuation, and sentence structure
                    </li>
                    <li>
                      Revise written drafts to enhance sentence fluency, ensuring that sentences are varied in length
                      and structure, and flow smoothly from one to the next
                    </li>
                    <li>
                      Apply knowledge of sentence-level grammar rules and conventions to improve the clarity, coherence,
                      and readability of written compositions
                    </li>
                    <li>
                      Demonstrate mastery of transitional devices and cohesive elements to connect ideas within and
                      between sentences, paragraphs, and sections of written drafts
                    </li>
                    <li>
                      Analyse the impact of different sentence structures and stylistic choices on the overall
                      effectiveness and tone of written compositions
                    </li>
                    <li>
                      Collaborate with peers to provide and receive constructive feedback on grammar and sentence
                      fluency in written drafts
                    </li>
                    <li>
                      Reflect on personal growth and development in language use, identifying areas of strength and
                      areas for improvement in grammar and sentence fluency skills
                    </li>
                    <li>
                      Apply revision strategies and techniques learned in the writing process to independently revise
                      and polish written drafts for grammar and sentence fluency prior to final submission
                    </li>
                    <li>
                      Demonstrate an enhanced ability to effectively express ideas and convey meaning through written
                      and visual representations
                    </li>
                    <li>
                      Understand and use formal, informal, Home Language and Standard English as appropriate to the
                      purpose, topic, setting, plot line and characters in writing
                    </li>
                    <li>
                      Continue to engage in individual and peer revision opportunities to share drafts and provide/
                      receive feedback on elements of grammar and sentence fluency
                    </li>
                    <li>
                      Make use of reference material (e.g., dictionaries, glossaries, thesauruses), both print and
                      digital, to find the pronunciation and determine or clarify the precise meaning of key words and
                      phrases for use in their writing
                    </li>
                    <li>
                      Make use of figurative language to revise and enhance their writing (e.g., similes, metaphors,
                      onomatopoeia, hyperbole, idioms, alliteration, etc.)
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Use Writing Conventions and Presentation (ELO 7)
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Continue to apply learning and further develop proficiency in spelling, contributing to the
                      overall quality of written work (affixes, synonyms, antonyms, root words)
                    </li>
                    <li>Transfer understanding of spelling conventions across various subjects</li>
                    <li>Further develop self-monitoring strategies to notice and correct spelling errors</li>
                    <li>
                      Develop proficiency in the use of punctuation conventions, including: full stops, commas,
                      apostrophes, other punctuation marks as needed to accurately convey meaning and enhance the
                      clarity of written work
                    </li>
                    <li>
                      Begin to make decision about the strategic use of punctuation, considering the potential impact on
                      sentence structure and overall coherence of the passage
                    </li>
                    <li>Connect punctuation choice to decisions about style and format</li>
                    <li>
                      Develop the ability to choose a variety presentation formats throughout the year based on the
                      nature of the content and the intended audience
                    </li>
                    <li>
                      Integrate visual elements, including images, charts, graphs, and other graphics, into written work
                      to enhance overall clarity and appeal to the reader
                    </li>
                    <li>Publish written work for varying audiences using various tools</li>
                    <li>
                      Engage in collaborative projects to create and present written content using various formats
                    </li>
                    <li>
                      Add titles, cover images, tables of content, glossaries, book blurbs, information about the
                      author, etc. as needed
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-purple-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-purple-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-purple-700">Observations:</strong> Teacher observations during writing
                  activities, noting student engagement, writing process, and skill development
                </li>
                <li>
                  <strong className="text-purple-700">Conversations:</strong> Writing conferences with students about
                  their writing process, challenges, and achievements
                </li>
                <li>
                  <strong className="text-purple-700">Products:</strong> Student writing portfolios, published pieces,
                  multimedia presentations, and collaborative projects
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <h4 className="font-semibold mb-2 text-blue-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Writing rubrics based on the 6+1 Traits of Writing</li>
                  <li>Checklists for evaluating different stages of the writing process</li>
                  <li>Self-assessment tools for students to reflect on their writing skills</li>
                  <li>Peer feedback forms for collaborative writing activities</li>
                  <li>Portfolio assessment rubrics for tracking growth over time</li>
                  <li>Genre-specific rubrics for different types of writing</li>
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
                  <AccordionTrigger>Brainstorming and Prewriting</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Graphic Organizers:</strong> Demonstrate the process by writing an idea on the board and
                        think aloud as you generate words, phrases, additional ideas related to the idea.
                      </li>
                      <li>
                        <strong>Use of Mentor Text:</strong> Remind learners of the genre and subgenre of the writing
                        assignment by reading aloud an excerpt of a mentor text that reviews the purpose and format.
                      </li>
                      <li>
                        <strong>Peer Modelling:</strong> Pair learners with varying skill levels and have them observe
                        each other's prewriting and drafting.
                      </li>
                      <li>
                        <strong>Independent Writing:</strong> Schedule time for learners to write in their private
                        e-journals or paper based journals.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Revision and Refinement</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Treasure Hunt:</strong> Provide learners with short sections of written drafts. Learners
                        review, name the subgenre represented and form explanations of how they know it is this
                        subgenre.
                      </li>
                      <li>
                        <strong>Think-Pair-Share:</strong> Share a think aloud as you read aloud your writing and
                        consider revisions to the organisation.
                      </li>
                      <li>
                        <strong>Visual Supports:</strong> Collect words of interest throughout all subject areas.
                        Discuss their use and meaning and place on a word wall.
                      </li>
                      <li>
                        <strong>Grammar Workshop:</strong> Offer short, focused mini-lessons on common grammar issues
                        such as subject-verb agreement, punctuation, verb tenses, and sentence structure.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Editing and Publishing</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Word Walls:</strong> Engage learners in the development of Word Walls throughout the
                        year by suggesting words encountered in all subject areas.
                      </li>
                      <li>
                        <strong>Let's Edit:</strong> Introduce learners to common editing marks used in revising writing
                        and their meanings.
                      </li>
                      <li>
                        <strong>Patrol Your Writing:</strong> Engage learners in an exploration of various punctuation
                        marks and how they affect and enhance writing.
                      </li>
                      <li>
                        <strong>Publishing Party:</strong> Host an author celebration of the wide range of genres,
                        topics, formats and publishing styles learners have accomplished within the year.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Digital Tools and Multimedia</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Online Mind Mapping Tools:</strong> Once brainstorms and prewriting activities are
                        complete, demonstrate how to use an online mind mapping tool.
                      </li>
                      <li>
                        <strong>Storyboarding:</strong> Demonstrate or provide examples storyboards and provide
                        opportunities for Learners create paper based or digital storyboards.
                      </li>
                      <li>
                        <strong>Digitize My Story:</strong> Create 'publications' of their writing pieces using free
                        websites such as Story Jumper, Bloom Library.
                      </li>
                      <li>
                        <strong>Writing Portfolios:</strong> Use writing portfolios to make a compilation of published
                        pieces of writing.
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
                <li>Writing mentor texts from various genres and cultures</li>
                <li>Digital writing tools and platforms</li>
                <li>Graphic organizers and planning templates</li>
                <li>Assessment rubrics and checklists</li>
                <li>OECS Grade 5 Language Arts Curriculum Guide</li>
                <li>Local authors and cultural resources</li>
                <li>Multimedia creation tools and software</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Writing portfolios and journals</li>
                <li>Personal dictionaries and thesauruses</li>
                <li>Editing checklists and revision guides</li>
                <li>Access to digital writing platforms</li>
                <li>Cultural artifacts and community resources for inspiration</li>
                <li>Peer feedback forms and collaboration tools</li>
                <li>Publishing materials and presentation tools</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Writing and Representing strategies and skills provide opportunities for learners to communicate with
              their peers and other meaningful audiences within and beyond their community using paper and digital
              formats. The process of writing includes planning, organizing, revising, refining, and sharing feedback.
              Throughout this process, ongoing problem solving and critical thinking strategies, applicable to subject
              areas and to life develop.
            </p>
            <p className="mt-2">
              In Grade 5, students are developing more sophisticated writing skills and can engage with complex revision
              processes. They are ready to explore various genres in depth and can begin to understand how audience and
              purpose influence their writing choices. Teachers should provide opportunities for authentic writing
              experiences that connect to students' lives and communities while also exposing them to diverse cultural
              perspectives through literature and multimedia.
            </p>
            <p className="mt-2">
              The integration of technology in writing instruction allows students to explore multimedia storytelling,
              digital publishing, and collaborative writing experiences. Teachers should balance traditional writing
              skills with digital literacy, helping students understand how to effectively communicate in both print and
              digital formats.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
