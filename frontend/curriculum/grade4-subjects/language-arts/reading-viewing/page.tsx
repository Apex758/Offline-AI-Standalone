import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, BookOpen, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function ReadingViewingPage() {
  return (
    <div className="container mx-auto py-8">
      
      <Link href="/curriculum/grade4-subjects/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 4 Language Arts
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-100 to-teal-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-blue-700 flex items-center">
            <BookOpen className="mr-2 h-7 w-7 text-blue-600" />
            Reading and Viewing
          </h1>
          <p className="text-gray-700">
            In Grade 4, students further develop their reading and viewing skills to interact critically with a wider
            variety of texts. They apply more sophisticated comprehension strategies, expand their vocabulary, and
            analyze how authors craft texts to convey meaning and influence readers. Students read for pleasure,
            personal growth, and to gather and evaluate information.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Four Expectations for Reading and Viewing
        </h3>

        <Tabs defaultValue="pleasure">
          <TabsList className="grid w-full grid-cols-4 bg-blue-100">
            <TabsTrigger value="pleasure" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              For Pleasure & Growth
            </TabsTrigger>
            <TabsTrigger value="background" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Using Background Knowledge
            </TabsTrigger>
            <TabsTrigger value="vocabulary" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Developing Vocabulary
            </TabsTrigger>
            <TabsTrigger value="structures" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Language Structures
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pleasure" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Read for Pleasure and Personal Growth</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Select and read a variety of materials with fluency at the transitional to fluent levels</li>
              <li>
                Participate in independent reading with books chosen to provide appropriate challenge and expand
                interests
              </li>
              <li>Explore complex texts of interest, developing strategies to navigate challenging content</li>
              <li>
                Reflect on and evaluate their strengths as readers, areas for improvement, and the strategies they found
                most helpful before, during and after reading
              </li>
              <li>Develop personal reading preferences and articulate reasons for their choices</li>
            </ul>
          </TabsContent>

          <TabsContent value="background" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Use Background Knowledge</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Develop deeper connections to a range of authors, genres, and text styles</li>
              <li>
                Use knowledge of the author's craft, topic, or genre to analyze purpose, perspective, and meaning in
                texts
              </li>
              <li>Interact critically with an expanded range of genres and text forms</li>
              <li>
                Read and demonstrate understanding of a variety of Transitional to Fluent-level literary, graphic, and
                informational texts using sophisticated strategies to construct and evaluate meaning
              </li>
              <li>Use multiple sources to find, compare, and synthesize information</li>
              <li>Identify key elements, meaningful details, and implicit messages to construct deeper meaning</li>
              <li>Respond to what is read with critical analysis and personal connections in a variety of ways</li>
              <li>
                Compare and contrast themes, settings, and plots of stories written by the same author or about similar
                topics
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="vocabulary" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Develop Vocabulary</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Actively build and apply new vocabulary gathered while reading across genres and subject areas</li>
              <li>
                Determine the meaning of unfamiliar words using multiple strategies: context clues, word parts,
                reference materials
              </li>
              <li>Analyze connections between the vocabulary of Home Language(s) and Standard English</li>
              <li>Develop understanding of the history, etymology, and cultural context of local language(s)</li>
              <li>Recognize and interpret figurative language, including similes, metaphors, idioms, and proverbs</li>
              <li>Distinguish between literal and figurative meanings of words and phrases in context</li>
            </ul>
          </TabsContent>

          <TabsContent value="structures" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Recognize and Use Language Structures</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                Analyze a variety of text forms, text features, and stylistic elements and explain how they contribute
                to meaning
              </li>
              <li>Compare and contrast the organizational structures of print and digital texts</li>
              <li>Apply word-solving strategies with automaticity to read with increased fluency and expression</li>
              <li>Use reading as a model for understanding and applying writing conventions</li>
              <li>Identify and analyze how text structure contributes to the development of ideas in a text</li>
              <li>
                Interpret information presented visually, orally, or quantitatively and explain how it contributes to
                understanding
              </li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-blue-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade Four, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Independent Reading
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Select and engage with a diverse range of literary, visual, graphic, and informational texts for
                      independent reading
                    </li>
                    <li>Apply genre knowledge to analyze and interpret fiction, poetry, drama, and nonfiction texts</li>
                    <li>
                      Apply advanced comprehension strategies during independent reading: analyzing themes, evaluating
                      evidence, comparing perspectives, distinguishing fact from opinion
                    </li>
                    <li>
                      Demonstrate understanding of texts through critical responses that analyze author's purpose,
                      message, and craft
                    </li>
                    <li>
                      Respond critically to texts by formulating and supporting opinions with evidence from the text
                    </li>
                    <li>
                      Analyze how the sequence of events, setting, and character development contribute to the overall
                      meaning of a text
                    </li>
                    <li>Compare and contrast the treatment of similar themes and topics across genres</li>
                    <li>
                      Identify and analyze the narrator's point of view in a text and how it influences how events are
                      described
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Vocabulary Development
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Analyze and appreciate the connections between Home Language(s) and Standard English vocabulary
                    </li>
                    <li>
                      Investigate the historical and cultural origins of local language expressions and vocabulary
                    </li>
                    <li>Expand reading vocabulary through systematic study of words across genres and content areas</li>
                    <li>
                      Apply knowledge of Greek and Latin roots, prefixes, and suffixes to determine the meaning of
                      unfamiliar words
                    </li>
                    <li>Use reference materials efficiently to verify word meanings and explore etymology</li>
                    <li>Analyze how affixes change word meanings and functions (e.g., re-, un-, -ly, -tion, -ment)</li>
                    <li>
                      Apply specialized vocabulary from science, mathematics, social studies, and the arts to enhance
                      comprehension
                    </li>
                    <li>
                      Interpret and explain the meaning and effect of figurative language (similes, metaphors,
                      personification)
                    </li>
                    <li>
                      Analyze how authors use idioms, allusions, and wordplay to enhance meaning and engage readers
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Language Structures
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Analyze how sentence structure and word order impact meaning and tone</li>
                    <li>Evaluate how reading fluency, phrasing, and expression enhance comprehension</li>
                    <li>Analyze how word choice, phrasing, and punctuation create effects and influence readers</li>
                    <li>Compare and contrast the structural elements of poems, drama, and prose</li>
                    <li>Describe the overall structure of events, ideas, concepts, or information in a text</li>
                    <li>Use advanced text features to locate information efficiently and enhance understanding</li>
                    <li>
                      Develop research skills: formulating questions, gathering relevant information from multiple
                      sources, synthesizing information, and presenting findings
                    </li>
                    <li>
                      Interpret information presented in diverse media and formats, explaining how it contributes to a
                      topic
                    </li>
                    <li>Evaluate the effectiveness of visual elements in conveying information and supporting text</li>
                    <li>
                      Integrate information from two texts on the same topic to write or speak knowledgeably about the
                      subject
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">Author's Craft</AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Analyze and compare the purpose, style, and techniques of various authors and illustrators</li>
                    <li>Examine the structural elements and themes of traditional literature from various cultures</li>
                    <li>
                      Analyze the purpose and effectiveness of various media texts, identifying techniques used to
                      inform, entertain, persuade, or manipulate
                    </li>
                    <li>
                      Identify and analyze elements of author's style, including word choice, sentence variety, and tone
                    </li>
                    <li>
                      Evaluate how illustrations, text features, and multimedia elements enhance or contribute to the
                      meaning of a text
                    </li>
                    <li>
                      Analyze how authors use language devices (repetition, rhyme, rhythm, alliteration) to create mood,
                      emphasize points, or evoke emotions
                    </li>
                    <li>
                      Make connections between the text of a story or drama and a visual or oral presentation of the
                      text
                    </li>
                    <li>
                      Critically analyze advertisements, social media, and news media for bias, cultural representation,
                      and hidden messages
                    </li>
                    <li>Compare and contrast firsthand and secondhand accounts of the same event or topic</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-teal-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-teal-50">
              <CardTitle className="text-teal-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-teal-700">Observations:</strong> Teacher observations during independent
                  reading, noting strategy application, text selection, and critical analysis skills
                </li>
                <li>
                  <strong className="text-teal-700">Conversations:</strong> Reading conferences to discuss comprehension
                  strategies, text connections, and personal responses to reading
                </li>
                <li>
                  <strong className="text-teal-700">Products:</strong> Reading response journals, text analysis charts,
                  multimedia presentations, and comparative text studies
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-100">
                <h4 className="font-semibold mb-2 text-teal-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Reading inventories to assess comprehension, fluency, and strategy use</li>
                  <li>Text analysis rubrics for evaluating critical thinking and textual evidence use</li>
                  <li>Self-assessment tools for students to monitor reading growth and strategy effectiveness</li>
                  <li>Theme and character development tracking charts</li>
                  <li>Vocabulary acquisition logs with etymology and context applications</li>
                  <li>Media literacy analysis guides for evaluating diverse text types</li>
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
                  <AccordionTrigger>Critical Reading</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Advanced Comprehension Strategies:</strong> Teach students to analyze author's purpose,
                        evaluate evidence, compare perspectives, and distinguish fact from opinion through guided
                        practice with increasingly complex texts.
                      </li>
                      <li>
                        <strong>Socratic Seminars:</strong> Facilitate student-led discussions about texts where
                        students pose questions, cite evidence, and build on each other's ideas to deepen understanding.
                      </li>
                      <li>
                        <strong>Cultural Text Analysis:</strong> Provide diverse texts from Caribbean and global
                        authors, guiding students to analyze how cultural context influences themes, characters, and
                        language.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Vocabulary Enrichment</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Etymology Exploration:</strong> Investigate word origins, especially those with
                        Caribbean connections, creating word history charts that show how language evolves across
                        cultures.
                      </li>
                      <li>
                        <strong>Vocabulary Inquiry:</strong> Implement a word study approach where students collect,
                        categorize, and analyze patterns in words based on meaning, structure, and origin.
                      </li>
                      <li>
                        <strong>Figurative Language Hunt:</strong> Challenge students to identify and interpret similes,
                        metaphors, personification, and idioms in texts, discussing how they enhance meaning.
                      </li>
                      <li>
                        <strong>Content-Area Vocabulary:</strong> Create cross-curricular word walls that highlight
                        specialized terminology from science, social studies, mathematics, and the arts.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Text Structure Analysis</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Genre Comparison:</strong> Guide students in comparing how different genres (poetry,
                        drama, fiction, nonfiction) present similar themes or topics, noting structural differences.
                      </li>
                      <li>
                        <strong>Text Mapping:</strong> Teach students to create visual representations of text structure
                        (sequence, cause/effect, problem/solution, compare/contrast) to enhance comprehension.
                      </li>
                      <li>
                        <strong>Digital vs. Print Analysis:</strong> Compare how information is organized in print and
                        digital formats, discussing the advantages and challenges of navigating each.
                      </li>
                      <li>
                        <strong>Fluency Development:</strong> Implement readers' theater, poetry performances, and
                        paired reading to develop expressive reading that enhances comprehension.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Author's Craft Analysis</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Author Study:</strong> Conduct in-depth studies of Caribbean and international authors,
                        analyzing their distinctive styles, themes, and techniques across multiple works.
                      </li>
                      <li>
                        <strong>Craft Emulation:</strong> After analyzing an author's style, have students create short
                        pieces that emulate specific techniques, reinforcing understanding of craft elements.
                      </li>
                      <li>
                        <strong>Media Literacy:</strong> Guide critical analysis of advertisements, news articles, and
                        social media posts, identifying persuasive techniques, bias, and cultural representations.
                      </li>
                      <li>
                        <strong>Visual Literacy:</strong> Analyze how illustrations, photographs, charts, and multimedia
                        elements contribute to text meaning, discussing artistic choices and their effects.
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
                <li>Diverse classroom library with Caribbean and international literature across genres</li>
                <li>Digital reading platforms with leveled texts and comprehension activities</li>
                <li>Text analysis guides and graphic organizers for different text structures</li>
                <li>Media literacy resources for analyzing diverse text types</li>
                <li>OECS Grade 4 Language Arts Curriculum Guide</li>
                <li>Professional resources on teaching critical literacy and text analysis</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Reading response journals with prompts for critical analysis</li>
                <li>Strategy bookmarks with advanced comprehension techniques</li>
                <li>Personal vocabulary notebooks with etymology sections</li>
                <li>Text feature and structure analysis templates</li>
                <li>Author study guides for tracking style elements across texts</li>
                <li>Media literacy evaluation checklists</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              In Grade 4, Reading and Viewing instruction builds on previous skills while developing more sophisticated
              critical literacy. Students should engage with increasingly complex texts that challenge them to analyze
              author's purpose, evaluate evidence, compare perspectives, and distinguish fact from opinion. The focus
              shifts from basic comprehension to deeper analysis of how texts work and how authors craft meaning.
            </p>
            <p className="mt-2">
              Teachers should understand the progression of reading development from transitional to fluent stages,
              recognizing that Grade 4 students are developing the capacity for abstract thinking that allows for more
              sophisticated text analysis. Instruction should balance explicit teaching of advanced comprehension
              strategies with ample opportunities for independent reading of self-selected texts. Cultural relevance
              remains essential, with texts that reflect Caribbean experiences while also expanding students' global
              awareness.
            </p>
            <p className="mt-2">
              Media literacy becomes increasingly important at this level, as students encounter more complex
              information sources. Teachers should guide students to critically evaluate diverse media, identifying
              bias, perspective, and persuasive techniques. The connection between reading and writing should be
              emphasized, with students analyzing author's craft as models for their own composition.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
