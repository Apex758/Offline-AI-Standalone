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
      
      <Link href="/curriculum/grade6-subjects/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 6 Language Arts
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-orange-100 to-red-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-orange-700 flex items-center">
            <PenTool className="mr-2 h-7 w-7 text-orange-600" />
            Writing and Representing
          </h1>
          <p className="text-gray-700">
            In Grade 6, students develop sophisticated writing and representing skills to communicate complex ideas
            effectively across various purposes and audiences. They learn to craft compelling arguments, create engaging
            narratives, and use multimedia to enhance their communication while demonstrating mastery of writing
            conventions and processes.
          </p>
        </div>
      </div>

      <div className="bg-orange-50 p-6 rounded-lg border border-orange-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-orange-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Six Expectations for Writing and Representing
        </h3>

        <Tabs defaultValue="pleasure">
          <TabsList className="grid w-full grid-cols-3 bg-orange-100">
            <TabsTrigger value="pleasure" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              For Pleasure & Personal Growth
            </TabsTrigger>
            <TabsTrigger
              value="relationships"
              className="data-[state=active]:bg-orange-600 data-[state=active]:text-white"
            >
              To Form & Foster Relationships
            </TabsTrigger>
            <TabsTrigger value="cognitive" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              As Cognitive Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pleasure" className="p-4 border rounded-md mt-2 bg-orange-50 border-orange-200">
            <h4 className="font-semibold mb-2">For Pleasure and Personal Growth</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Write and create multimedia representations for personal enjoyment and creative expression</li>
              <li>Develop a distinctive personal voice and style in various forms of writing</li>
              <li>Use writing and representing as tools for self-reflection and personal growth</li>
              <li>Maintain writing portfolios that demonstrate growth and experimentation over time</li>
            </ul>
          </TabsContent>

          <TabsContent value="relationships" className="p-4 border rounded-md mt-2 bg-orange-50 border-orange-200">
            <h4 className="font-semibold mb-2">To Form and Foster Relationships</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Write and create representations that connect with diverse audiences and build understanding</li>
              <li>Collaborate effectively on complex writing and multimedia projects</li>
              <li>Provide constructive feedback to peers and incorporate feedback to improve their own work</li>
              <li>Use writing and representing to advocate for important causes and community issues</li>
            </ul>
          </TabsContent>

          <TabsContent value="cognitive" className="p-4 border rounded-md mt-2 bg-orange-50 border-orange-200">
            <h4 className="font-semibold mb-2">To Develop and Serve as Cognitive Tools</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Use sophisticated writing processes to plan, draft, revise, and publish complex texts</li>
              <li>Apply advanced knowledge of writing conventions, grammar, and mechanics accurately</li>
              <li>Adapt writing style and format appropriately for different purposes and audiences</li>
              <li>Integrate research and evidence effectively to support arguments and explanations</li>
              <li>Use technology strategically to enhance writing and create multimedia representations</li>
              <li>Demonstrate sophisticated understanding of how language choices affect meaning and impact</li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-orange-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-orange-50">
            <CardTitle className="text-orange-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade Six, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-orange-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-orange-50 px-4 py-2 rounded-md">
                  Write and Represent for Pleasure and Personal Growth
                </AccordionTrigger>
                <AccordionContent className="bg-orange-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Create original creative works including stories, poems, and multimedia presentations</li>
                    <li>
                      Develop and maintain a personal writing style that reflects individual voice and perspective
                    </li>
                    <li>Use writing as a tool for self-reflection and personal exploration</li>
                    <li>Experiment with various forms and genres to discover personal preferences and strengths</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-orange-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-orange-50 px-4 py-2 rounded-md">
                  Write and Represent to Form and Foster Relationships
                </AccordionTrigger>
                <AccordionContent className="bg-orange-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Collaborate effectively on complex writing and multimedia projects</li>
                    <li>Write persuasive pieces that advocate for important causes and community issues</li>
                    <li>Create multimedia presentations that engage and inform diverse audiences</li>
                    <li>Provide constructive feedback to peers and incorporate feedback to improve own work</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-orange-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-orange-50 px-4 py-2 rounded-md">
                  Write and Represent to Develop Appreciation of Culture and Languages
                </AccordionTrigger>
                <AccordionContent className="bg-orange-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Write sophisticated arguments with well-developed claims and evidence</li>
                    <li>Create informational texts that synthesize research from multiple sources</li>
                    <li>Use advanced writing processes including planning, drafting, revising, and publishing</li>
                    <li>Apply sophisticated knowledge of grammar, mechanics, and writing conventions</li>
                    <li>Adapt writing style and format for different purposes and audiences</li>
                    <li>Use technology effectively to enhance writing and create multimedia representations</li>
                    <li>Demonstrate understanding of how language choices affect meaning and impact</li>
                    <li>Write narratives with well-developed characters, settings, and plot structures</li>
                    <li>Conduct research using multiple sources and integrate findings effectively</li>
                    <li>Use sophisticated vocabulary and varied sentence structures</li>
                    <li>Create visual and multimedia representations that enhance written communication</li>
                    <li>Edit and proofread work for accuracy in grammar, spelling, and mechanics</li>
                    <li>Write in response to literature with sophisticated analysis and interpretation</li>
                    <li>Use writing to explore and express cultural identity and experiences</li>
                    <li>Demonstrate understanding of plagiarism and proper citation practices</li>
                    <li>Create digital stories and multimedia presentations with purpose and audience in mind</li>
                    <li>Use writing to document and preserve cultural knowledge and traditions</li>
                    <li>Experiment with different forms of poetry and creative expression</li>
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
                  <strong className="text-blue-700">Observations:</strong> Systematic observations during writing
                  processes, peer collaboration, and multimedia creation activities
                </li>
                <li>
                  <strong className="text-blue-700">Conversations:</strong> Writing conferences focusing on goals,
                  strategies, and reflection on growth as writers
                </li>
                <li>
                  <strong className="text-blue-700">Products:</strong> Writing portfolios, published pieces, multimedia
                  presentations, and collaborative projects
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg border border-blue-100">
                <h4 className="font-semibold mb-2 text-blue-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Sophisticated writing rubrics for different genres and purposes</li>
                  <li>Digital portfolios showcasing writing growth over time</li>
                  <li>Peer review protocols and feedback forms</li>
                  <li>Self-assessment tools for writing process and product</li>
                  <li>Multimedia presentation evaluation criteria</li>
                  <li>Research and citation accuracy checklists</li>
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
                  <AccordionTrigger>Advanced Writing Processes</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Writers' Workshop Model:</strong> Implement a structured workshop approach with
                        mini-lessons, independent writing time, and conferencing.
                      </li>
                      <li>
                        <strong>Revision Strategies:</strong> Teach sophisticated revision techniques focusing on
                        content, organization, voice, and style improvements.
                      </li>
                      <li>
                        <strong>Peer Review Circles:</strong> Establish protocols for constructive peer feedback and
                        collaborative editing processes.
                      </li>
                      <li>
                        <strong>Publishing Opportunities:</strong> Create authentic publishing opportunities including
                        school publications, community newsletters, and digital platforms.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Genre-Based Writing Instruction</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Argument Writing:</strong> Teach students to construct sophisticated arguments with
                        claims, evidence, and counterarguments.
                      </li>
                      <li>
                        <strong>Research Writing:</strong> Guide students through complex research processes including
                        source evaluation, note-taking, and synthesis.
                      </li>
                      <li>
                        <strong>Creative Writing:</strong> Explore various forms of creative expression including short
                        stories, poetry, and dramatic scripts.
                      </li>
                      <li>
                        <strong>Technical Writing:</strong> Practice writing instructions, reports, and informational
                        texts with clarity and precision.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Digital and Multimedia Composition</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Digital Storytelling:</strong> Create multimedia narratives combining text, images,
                        audio, and video elements.
                      </li>
                      <li>
                        <strong>Blog Writing:</strong> Maintain class or individual blogs focusing on topics of interest
                        and current events.
                      </li>
                      <li>
                        <strong>Infographic Creation:</strong> Design visual representations of information and data
                        using digital tools.
                      </li>
                      <li>
                        <strong>Collaborative Documents:</strong> Use cloud-based platforms for real-time collaborative
                        writing and editing.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Cultural and Personal Expression</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Cultural Heritage Projects:</strong> Research and write about family histories, cultural
                        traditions, and community stories.
                      </li>
                      <li>
                        <strong>Social Justice Writing:</strong> Explore issues affecting the Caribbean region and write
                        persuasive pieces advocating for change.
                      </li>
                      <li>
                        <strong>Multilingual Writing:</strong> Encourage writing in home languages and translation
                        projects that celebrate linguistic diversity.
                      </li>
                      <li>
                        <strong>Community Connections:</strong> Write for authentic audiences including community
                        organizations, local newspapers, and government officials.
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
                <li>Comprehensive writing rubrics for various genres and purposes</li>
                <li>Digital writing and multimedia creation tools</li>
                <li>Model texts and mentor texts for different writing forms</li>
                <li>Grammar and mechanics reference materials</li>
                <li>OECS Grade 6 Language Arts Curriculum Guide</li>
                <li>Professional development resources on writing instruction</li>
                <li>Publishing platforms and submission guidelines</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Digital writing portfolios and reflection tools</li>
                <li>Access to word processing and multimedia software</li>
                <li>Research databases and citation tools</li>
                <li>Graphic organizers for planning and organizing writing</li>
                <li>Peer review and feedback protocols</li>
                <li>Grammar and style reference guides</li>
                <li>Creative writing prompts and inspiration resources</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Grade 6 writing and representing instruction should emphasize the recursive nature of the writing process
              while building students' capacity for sophisticated communication across genres and purposes. Students at
              this level can engage in complex research, craft compelling arguments, and create multimedia
              representations that demonstrate deep understanding.
            </p>
            <p className="mt-2">
              Teachers should provide explicit instruction in advanced writing strategies while offering choice and
              voice in topics and formats. The integration of technology enhances students' ability to create, revise,
              and publish their work for authentic audiences.
            </p>
            <p className="mt-2">
              Cultural responsiveness is essential, encouraging students to draw from their own experiences and cultural
              knowledge while also exploring diverse perspectives. Assessment should focus on growth over time, with
              attention to both process and product, and should include opportunities for self-reflection and goal
              setting.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
