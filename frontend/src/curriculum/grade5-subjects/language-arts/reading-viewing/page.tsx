"use client"

import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Eye, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function ReadingViewingPage() {
  return (
    <div className="container mx-auto py-8">
      
      <Link href="/curriculum/grade5-subjects/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 5 Language Arts
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-blue-700 flex items-center">
            <Eye className="mr-2 h-7 w-7 text-blue-600" />
            Reading and Viewing
          </h1>
          <p className="text-gray-700">
            In Grade 5, students engage with a wide range of texts, developing advanced comprehension and critical
            thinking skills. They explore author's craft, make sophisticated connections across texts and cultures, and
            appreciate Caribbean literature and global perspectives.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Five Expectations for Reading and Viewing
        </h3>

        <Tabs defaultValue="pleasure">
          <TabsList className="grid w-full grid-cols-3 bg-blue-100">
            <TabsTrigger value="pleasure" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Read for Pleasure & Personal Growth
            </TabsTrigger>
            <TabsTrigger value="background" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Use Background Knowledge
            </TabsTrigger>
            <TabsTrigger value="interact" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Interact Meaningfully
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pleasure" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Read for Pleasure and Personal Growth</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Develop increased personal choice in favorite authors, genres, and text forms</li>
              <li>
                Reflect on and identify their strengths as readers, areas for improvement and the strategies they found
                most useful before, during and after reading
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="background" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Use Background Knowledge</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Refine skills and strategies as progress toward the Proficient reading level consolidates</li>
              <li>
                Discuss, reflect, and respond to a wide variety of literary genres and informational text using evidence
                from text and background knowledge
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="interact" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Interact Meaningfully</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                Recognize a variety of texts forms, text features and stylistic elements, and demonstrate understanding
                of how they help communicate meaning
              </li>
              <li>
                Self-monitor reading and adjust use of comprehension strategies, vocabulary knowledge and word solving
                to become better readers
              </li>
              <li>
                Choose a range of more challenging texts based on personal preference, topic, genre, theme, or author
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
            <CardDescription>By the end of Grade Five, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Use Background Knowledge and Interests
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Select engaging paper based and digital, visual texts for Independent Reading based on interests,
                      learning needs, appropriate level of difficulty, various genres, and diverse cultures
                    </li>
                    <li>Utilize background knowledge to better comprehend a topic, picture, or title</li>
                    <li>Read widely and experience a variety of literature from the Caribbean and other cultures</li>
                    <li>
                      Reflect on and identify their strengths and areas for improvement as readers while utilizing the
                      strategies they found most useful during reading
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Engage Critically with Texts
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Use pictures and illustrations, word structures and text features to locate information and verify
                      their understanding of the information
                    </li>
                    <li>
                      Continue to develop and demonstrate critical questioning strategies to gather information from
                      favorite visual, musical, and written text
                    </li>
                    <li>
                      Apply problem-solving strategies to follow written multi-step instructions effectively while
                      reflecting on their learning processes
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Develop Reading Fluency
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Use Independent Reading Time to develop reading fluency (accuracy, phrasing, and intonation)
                    </li>
                    <li>
                      Use all sources of information (meaning, structure, visual) to search, check, self-monitor, and
                      self-correct with grade appropriate, instructional-level text
                    </li>
                    <li>
                      Develop an understanding of how illustrations enhance mood, establish setting, and advance plot in
                      written or visual text
                    </li>
                    <li>
                      Foster critical thinking skills and appreciation for the relationship between words and images in
                      storytelling
                    </li>
                    <li>
                      Apply higher-order thinking skills including analysis, synthesis, inference, and application to
                      critically evaluate visual and/or text-based information
                    </li>
                    <li>
                      Deepen understanding of the purpose and influences of different types of popular texts (e.g.,
                      websites, advertisements, social media, etc.)
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
                  <strong className="text-purple-700">Observations:</strong> Teacher observations during reading and
                  viewing activities, noting student engagement, comprehension, and critical thinking skills
                </li>
                <li>
                  <strong className="text-purple-700">Conversations:</strong> One-on-one discussions with students about
                  their reading and viewing experiences, strategies, and insights
                </li>
                <li>
                  <strong className="text-purple-700">Products:</strong> Student reading logs, response journals,
                  character analyses, and multimedia presentations
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <h4 className="font-semibold mb-2 text-blue-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Running records to assess reading fluency and accuracy</li>
                  <li>Checklists for evaluating critical thinking skills</li>
                  <li>Rubrics for assessing character analysis and theme exploration</li>
                  <li>Self-assessment tools for students to reflect on their reading habits</li>
                  <li>Peer assessment forms for collaborative discussions</li>
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
                  <AccordionTrigger>Text Exploration</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Multicultural Book Club:</strong> Assign students to small groups so they can read and
                        discuss books from other civilizations that highlight certain cultural origins.
                      </li>
                      <li>
                        <strong>Text Feature Scavenger Hunt:</strong> Provide each learner or group a worksheet listing
                        text features like table of contents, headings, glossaries, and indices.
                      </li>
                      <li>
                        <strong>‘Chatting’ with the text:</strong> Encourage learners to ask and answer questions of a
                        text being read.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Comprehension and Connection</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Comprehend - Connect - Reflect Reading:</strong> Develop learners’ ability to reflect on
                        what they read, by introducing or reviewing reading strategies in a mini lesson before the
                        Independent Reading session begins.
                      </li>
                      <li>
                        <strong>Multimodal Reading Stations:</strong> Create different reading stations around the
                        classroom, each featuring a variety of texts and media formats.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card className="border-t-4 border-green-500 shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="bg-green-50">
          <CardTitle className="text-green-700 flex items-center">
            <ClipboardCheck className="mr-2 h-5 w-5" />
            Additional Resources and Materials
          </CardTitle>
          <CardDescription>Comprehensive resources to support Grade 5 reading and viewing instruction</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="literature">
            <TabsList className="grid w-full grid-cols-4 bg-green-100">
              <TabsTrigger
                value="literature"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Literature & Texts
              </TabsTrigger>
              <TabsTrigger value="digital" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                Digital Resources
              </TabsTrigger>
              <TabsTrigger
                value="assessment"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Assessment Tools
              </TabsTrigger>
              <TabsTrigger
                value="professional"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Professional Development
              </TabsTrigger>
            </TabsList>

            <TabsContent value="literature" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
              <h4 className="font-semibold mb-3 text-green-700">Recommended Literature and Texts</h4>

              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-green-600 mb-2">Caribbean Authors and Literature</h5>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>
                      <strong>Jamaica Kincaid:</strong> "Annie John" (excerpts appropriate for Grade 5)
                    </li>
                    <li>
                      <strong>Earl Lovelace:</strong> "Jestina's Calypso" and other short stories
                    </li>
                    <li>
                      <strong>Olive Senior:</strong> "Birthday in the Bush" and selected poems
                    </li>
                    <li>
                      <strong>Lynn Joseph:</strong> "The Mermaid's Twin Sister" and other Caribbean folktales
                    </li>
                    <li>
                      <strong>Richardo Keens-Douglas:</strong> "The Nutmeg Princess" and other stories
                    </li>
                    <li>
                      <strong>Dionne Brand:</strong> Selected poems suitable for Grade 5
                    </li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-green-600 mb-2">Global Literature with Caribbean Connections</h5>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>
                      <strong>Multicultural Poetry Collections:</strong> Featuring Caribbean diaspora voices
                    </li>
                    <li>
                      <strong>Historical Fiction:</strong> Books about Caribbean history and culture
                    </li>
                    <li>
                      <strong>Graphic Novels:</strong> Age-appropriate titles exploring cultural themes
                    </li>
                    <li>
                      <strong>Biography Series:</strong> Caribbean leaders, artists, and changemakers
                    </li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-green-600 mb-2">Text Types and Genres</h5>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Informational texts about Caribbean ecosystems and geography</li>
                    <li>Historical documents and primary sources (adapted for Grade 5)</li>
                    <li>Contemporary realistic fiction with Caribbean settings</li>
                    <li>Traditional and modern Caribbean folktales and legends</li>
                    <li>Poetry collections celebrating Caribbean culture and nature</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="digital" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
              <h4 className="font-semibold mb-3 text-green-700">Digital Resources and Platforms</h4>

              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-green-600 mb-2">Online Reading Platforms</h5>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>
                      <strong>Epic! for Education:</strong> Digital library with Caribbean and multicultural titles
                    </li>
                    <li>
                      <strong>Raz-Kids:</strong> Leveled reading with comprehension quizzes
                    </li>
                    <li>
                      <strong>Storyline Online:</strong> Celebrity read-alouds of quality children's literature
                    </li>
                    <li>
                      <strong>International Children's Digital Library:</strong> Global literature collection
                    </li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-green-600 mb-2">Interactive Tools</h5>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>
                      <strong>Padlet:</strong> For collaborative reading responses and discussions
                    </li>
                    <li>
                      <strong>Flipgrid:</strong> Video discussions about books and reading experiences
                    </li>
                    <li>
                      <strong>Book Creator:</strong> For students to create digital book reviews and responses
                    </li>
                    <li>
                      <strong>Kahoot:</strong> Interactive reading comprehension games and quizzes
                    </li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-green-600 mb-2">Multimedia Resources</h5>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Caribbean Broadcasting Corporation educational content</li>
                    <li>National Geographic Kids articles about Caribbean wildlife and culture</li>
                    <li>TED-Ed videos on reading strategies and literary analysis</li>
                    <li>Virtual museum tours of Caribbean cultural institutions</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="assessment" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
              <h4 className="font-semibold mb-3 text-green-700">Assessment Tools and Resources</h4>

              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-green-600 mb-2">Formal Assessment Tools</h5>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>
                      <strong>Running Records:</strong> Templates for assessing reading fluency and accuracy
                    </li>
                    <li>
                      <strong>Comprehension Rubrics:</strong> For evaluating understanding of complex texts
                    </li>
                    <li>
                      <strong>Critical Thinking Checklists:</strong> To assess analysis and inference skills
                    </li>
                    <li>
                      <strong>Reading Interest Inventories:</strong> To guide book selection and motivation
                    </li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-green-600 mb-2">Student Self-Assessment</h5>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Reading goal-setting templates and tracking sheets</li>
                    <li>Reflection journals for reading experiences and strategies</li>
                    <li>Book recommendation forms for peer sharing</li>
                    <li>Reading strategy self-evaluation checklists</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-green-600 mb-2">Portfolio Components</h5>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Reading logs with variety tracking (genres, authors, cultures)</li>
                    <li>Character analysis graphic organizers</li>
                    <li>Text-to-text, text-to-self, text-to-world connection charts</li>
                    <li>Visual response projects (artwork, diagrams, timelines)</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="professional" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
              <h4 className="font-semibold mb-3 text-green-700">Professional Development Resources</h4>

              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-green-600 mb-2">Teacher Resources</h5>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>
                      <strong>Reading Recovery Training:</strong> Intensive intervention strategies
                    </li>
                    <li>
                      <strong>Fountas & Pinnell:</strong> Guided reading level assessments and instruction
                    </li>
                    <li>
                      <strong>Lucy Calkins Units of Study:</strong> Reading workshop methodology
                    </li>
                    <li>
                      <strong>Caribbean Literature in Education:</strong> Specialized training programs
                    </li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-green-600 mb-2">Research and Best Practices</h5>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>International Reading Association (IRA) position statements</li>
                    <li>National Reading Panel findings on effective reading instruction</li>
                    <li>Research on culturally responsive literacy practices</li>
                    <li>Studies on multilingual learners and reading development</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-green-600 mb-2">Collaborative Networks</h5>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Caribbean Association of Reading Teachers</li>
                    <li>Regional literacy coaching networks</li>
                    <li>Online professional learning communities</li>
                    <li>University partnerships for ongoing education</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <h4 className="font-semibold mb-2 text-green-700">Implementation Notes:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Ensure all selected materials reflect the diversity of Caribbean cultures and experiences</li>
              <li>Provide texts at various reading levels to support all learners</li>
              <li>Include both print and digital formats to accommodate different learning preferences</li>
              <li>Regularly update resources to include contemporary Caribbean voices and perspectives</li>
              <li>Consider accessibility features for students with diverse learning needs</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
