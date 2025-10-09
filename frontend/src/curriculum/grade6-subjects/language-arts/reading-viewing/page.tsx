"use client"

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
      
      <Link href="/curriculum/grade6-subjects/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 6 Language Arts
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-green-700 flex items-center">
            <BookOpen className="mr-2 h-7 w-7 text-green-600" />
            Reading and Viewing
          </h1>
          <p className="text-gray-700">
            In Grade 6, students develop sophisticated reading and viewing skills to analyze complex texts and
            multimedia. They learn to think critically about authors' purposes, evaluate information sources, and make
            connections between texts and their own experiences while appreciating diverse perspectives and cultural
            contexts.
          </p>
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Six Expectations for Reading and Viewing
        </h3>

        <Tabs defaultValue="pleasure">
          <TabsList className="grid w-full grid-cols-3 bg-green-100">
            <TabsTrigger value="pleasure" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              For Pleasure & Personal Growth
            </TabsTrigger>
            <TabsTrigger
              value="relationships"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              To Form & Foster Relationships
            </TabsTrigger>
            <TabsTrigger value="cognitive" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              As Cognitive Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pleasure" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">For Pleasure and Personal Growth</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Read and view increasingly complex and diverse texts for enjoyment and personal enrichment</li>
              <li>Demonstrate sustained engagement with challenging texts and multimedia across various genres</li>
              <li>Develop sophisticated personal reading preferences and can articulate reasons for choices</li>
              <li>
                Reflect critically on how reading and viewing experiences contribute to personal growth and
                understanding
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="relationships" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">To Form and Foster Relationships</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Share reading experiences and recommendations with peers in meaningful and persuasive ways</li>
              <li>Participate in sophisticated book discussions and literature circles with critical insights</li>
              <li>Connect with diverse characters and perspectives to develop empathy and cultural understanding</li>
              <li>Use reading and viewing experiences to build bridges across cultural and linguistic differences</li>
            </ul>
          </TabsContent>

          <TabsContent value="cognitive" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">To Develop and Serve as Cognitive Tools</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Apply sophisticated reading strategies independently to comprehend complex and challenging texts</li>
              <li>Analyze and evaluate information from multiple sources for credibility, bias, and perspective</li>
              <li>Synthesize information across texts to develop new understandings and insights</li>
              <li>Use reading and viewing to research, investigate, and solve complex problems</li>
              <li>
                Demonstrate advanced vocabulary development through strategic word learning and morphological analysis
              </li>
              <li>Critically analyze literary elements, themes, and author's craft in sophisticated ways</li>
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
            <CardDescription>By the end of Grade Six, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Read and View for Pleasure and Personal Growth
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Select and read complex texts independently for extended periods</li>
                    <li>Articulate sophisticated personal responses to literature and multimedia</li>
                    <li>Make meaningful connections between texts and personal experiences</li>
                    <li>Develop and maintain a diverse reading portfolio with reflective commentary</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Read and View to Form and Foster Relationships
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Lead and participate in sophisticated literature discussions and book clubs</li>
                    <li>Share reading recommendations with detailed analysis and persuasive reasoning</li>
                    <li>Collaborate effectively on complex reading and research projects</li>
                    <li>
                      Demonstrate empathy and understanding through connections with diverse characters and perspectives
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Read and View to Develop Appreciation of Culture and Languages
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Analyze complex literary elements including theme, symbolism, and author's craft</li>
                    <li>Compare and contrast texts from different cultures and time periods</li>
                    <li>Evaluate information sources for credibility, bias, and perspective</li>
                    <li>Synthesize information from multiple sources to develop well-supported conclusions</li>
                    <li>Use advanced vocabulary strategies to understand complex and technical texts</li>
                    <li>Critically analyze media messages and visual texts for purpose and effectiveness</li>
                    <li>Demonstrate sophisticated understanding of how language varies across contexts and cultures</li>
                    <li>Read and analyze texts that reflect Caribbean experiences and perspectives</li>
                    <li>Apply reading strategies flexibly and independently based on text type and purpose</li>
                    <li>Make sophisticated inferences and draw conclusions based on textual evidence</li>
                    <li>Analyze how authors use literary devices to create meaning and effect</li>
                    <li>Compare multiple accounts of the same event to understand different perspectives</li>
                    <li>Evaluate arguments and claims in persuasive and informational texts</li>
                    <li>Use context clues and morphological analysis to determine word meanings</li>
                    <li>Analyze the relationship between visual and textual elements in multimedia</li>
                    <li>Demonstrate understanding of figurative language and its effects</li>
                    <li>Read fluently with appropriate expression and comprehension</li>
                    <li>Use technology effectively to locate, evaluate, and synthesize information</li>
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
                  <strong className="text-blue-700">Observations:</strong> Systematic observations during independent
                  reading, literature discussions, and research activities
                </li>
                <li>
                  <strong className="text-blue-700">Conversations:</strong> In-depth conferences about reading goals,
                  strategies, and comprehension development
                </li>
                <li>
                  <strong className="text-blue-700">Products:</strong> Reading portfolios, literary analysis essays,
                  multimedia presentations, and research projects
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100">
                <h4 className="font-semibold mb-2 text-blue-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Complex reading comprehension rubrics</li>
                  <li>Literary analysis assessment criteria</li>
                  <li>Digital reading response portfolios</li>
                  <li>Peer evaluation forms for literature discussions</li>
                  <li>Self-assessment tools for reading strategy use</li>
                  <li>Research project evaluation rubrics</li>
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
                  <AccordionTrigger>Advanced Reading Comprehension</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Close Reading Protocols:</strong> Teach students to analyze complex texts through
                        multiple readings, focusing on different aspects each time.
                      </li>
                      <li>
                        <strong>Text Complexity Analysis:</strong> Guide students in evaluating text difficulty and
                        selecting appropriate strategies for challenging materials.
                      </li>
                      <li>
                        <strong>Comparative Text Studies:</strong> Analyze multiple texts on the same topic to
                        understand different perspectives and approaches.
                      </li>
                      <li>
                        <strong>Digital Annotation Tools:</strong> Use technology to annotate, highlight, and share
                        insights about complex texts collaboratively.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Literary Analysis and Appreciation</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Literature Circles Plus:</strong> Facilitate student-led book discussions with rotating
                        roles and sophisticated discussion protocols.
                      </li>
                      <li>
                        <strong>Author Study Projects:</strong> Conduct in-depth studies of Caribbean and international
                        authors, analyzing themes and writing styles.
                      </li>
                      <li>
                        <strong>Genre Exploration:</strong> Systematically explore different literary genres, comparing
                        conventions and analyzing author's choices.
                      </li>
                      <li>
                        <strong>Creative Response Projects:</strong> Create artistic, dramatic, or multimedia responses
                        to literature that demonstrate deep understanding.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Critical Media Literacy</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>News Analysis Labs:</strong> Analyze news articles, videos, and social media posts for
                        bias, credibility, and persuasive techniques.
                      </li>
                      <li>
                        <strong>Visual Literacy Skills:</strong> Decode and analyze images, infographics,
                        advertisements, and multimedia presentations.
                      </li>
                      <li>
                        <strong>Source Evaluation Training:</strong> Teach students to evaluate online sources for
                        reliability, authority, and relevance.
                      </li>
                      <li>
                        <strong>Fact-Checking Projects:</strong> Engage students in verifying information and
                        identifying misinformation in various media formats.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Cultural and Linguistic Connections</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Caribbean Literature Focus:</strong> Explore works by Caribbean authors and texts that
                        reflect regional experiences and perspectives.
                      </li>
                      <li>
                        <strong>Multilingual Text Exploration:</strong> Read texts in different languages and dialects,
                        discussing how language choices affect meaning.
                      </li>
                      <li>
                        <strong>Cultural Context Studies:</strong> Research historical and cultural contexts that inform
                        understanding of literary works.
                      </li>
                      <li>
                        <strong>Global Connections:</strong> Make connections between local and international texts,
                        exploring universal themes and unique perspectives.
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
                <li>Diverse collection of complex texts across genres and cultures</li>
                <li>Digital annotation and collaboration tools</li>
                <li>Assessment rubrics for literary analysis and critical thinking</li>
                <li>Caribbean literature anthology and resources</li>
                <li>OECS Grade 6 Language Arts Curriculum Guide</li>
                <li>Professional development resources on critical literacy</li>
                <li>Multimedia and visual literacy resources</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Digital reading portfolios and response journals</li>
                <li>Access to diverse print and digital libraries</li>
                <li>Research databases and fact-checking tools</li>
                <li>Graphic organizers for complex text analysis</li>
                <li>Vocabulary development apps and tools</li>
                <li>Book recommendation and review platforms</li>
                <li>Creative response project materials and software</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Grade 6 reading and viewing instruction should focus on developing critical literacy skills that prepare
              students for complex academic and real-world reading demands. Students at this level can engage with
              sophisticated texts and multimedia, analyze multiple perspectives, and synthesize information from various
              sources.
            </p>
            <p className="mt-2">
              Teachers should provide explicit instruction in advanced reading strategies while maintaining a balance
              between guided instruction and independent exploration. The integration of technology enhances students'
              ability to access diverse texts and collaborate on reading projects.
            </p>
            <p className="mt-2">
              Cultural responsiveness is essential, ensuring that students see themselves reflected in texts while also
              exploring diverse perspectives. Assessment should focus on students' ability to think critically, make
              connections, and communicate their understanding in sophisticated ways.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
