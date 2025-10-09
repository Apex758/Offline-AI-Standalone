"use client"

import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, MessageSquare, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function ListeningSpeakingPage() {
  return (
    <div className="container mx-auto py-8">
      
      <Link href="/curriculum/grade6-subjects/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 6 Language Arts
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-purple-700 flex items-center">
            <MessageSquare className="mr-2 h-7 w-7 text-purple-600" />
            Listening and Speaking
          </h1>
          <p className="text-gray-700">
            In Grade 6, students develop sophisticated listening and speaking skills to engage in complex discourse and
            express themselves effectively across various contexts. They learn to analyze persuasive techniques, adapt
            their language to different audiences, and demonstrate deep appreciation for linguistic diversity.
          </p>
        </div>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Six Expectations for Listening and Speaking
        </h3>

        <Tabs defaultValue="pleasure">
          <TabsList className="grid w-full grid-cols-3 bg-purple-100">
            <TabsTrigger value="pleasure" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              For Pleasure & Personal Growth
            </TabsTrigger>
            <TabsTrigger
              value="relationships"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              To Form & Foster Relationships
            </TabsTrigger>
            <TabsTrigger value="cognitive" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              As Cognitive Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pleasure" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">For Pleasure and Personal Growth</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                Listen to and appreciate increasingly complex and diverse genres of music, stories, and information
              </li>
              <li>
                Demonstrate sustained interest and responsive engagement in sharing experiences and oral presentations
              </li>
              <li>
                Develop sophisticated awareness of how purposeful oral language serves as a venue for emotional
                expression
              </li>
              <li>
                Reflect critically on personal communication strengths, areas for growth, and effective strategies
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="relationships" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">To Form and Foster Relationships</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Demonstrate advanced conversational skills with empathy, clarity, and cultural sensitivity</li>
              <li>Listen actively and build meaningfully on others' ideas while expressing personal perspectives</li>
              <li>
                Use sophisticated speaking strategies to communicate effectively across diverse audiences and purposes
              </li>
              <li>
                Demonstrate nuanced understanding of when to use Home Language(s) versus Standard English appropriately
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="cognitive" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">To Develop and Serve as Cognitive Tools</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Analyze and manipulate tone, fluency, and intonation to create specific effects and meanings</li>
              <li>Apply complex listening comprehension strategies independently and strategically</li>
              <li>Develop and use sophisticated vocabulary with precision and creativity</li>
              <li>Create compelling narratives with attention to genre conventions, audience, and purpose</li>
              <li>Demonstrate mastery of phoneme manipulation and morphological awareness in oral language</li>
              <li>Design and deliver sophisticated presentations with strategic word choice and rhetorical devices</li>
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
            <CardDescription>By the end of Grade Six, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Listen and Speak for Pleasure and Personal Growth
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Articulate and defend opinions with evidence and logical reasoning</li>
                    <li>Use sophisticated intonation, tone, and expression to convey complex ideas and emotions</li>
                    <li>Engage in substantive discussions about current events and complex topics</li>
                    <li>Conduct comprehensive self-assessment of communication skills and set goals for improvement</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Listen and Speak to Form and Foster Relationships
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Lead and facilitate group discussions with skill and sensitivity</li>
                    <li>Deliver well-organized presentations using multimedia and visual aids effectively</li>
                    <li>Establish and maintain productive discussion protocols and roles</li>
                    <li>Adapt communication style appropriately for various formal and informal contexts</li>
                    <li>Use nonverbal communication strategically to enhance message delivery</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Listen and Speak to Develop Appreciation of Culture and Languages
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Present sophisticated arguments using advanced persuasive techniques</li>
                    <li>Create and participate in formal debates using research-based evidence</li>
                    <li>Analyze and critique speakers' use of evidence and reasoning</li>
                    <li>Follow and give complex multi-step instructions with precision</li>
                    <li>Critically analyze persuasive techniques in various media forms</li>
                    <li>Engage in collaborative learning with advanced critical thinking skills</li>
                    <li>Demonstrate sophisticated language register awareness and code-switching abilities</li>
                    <li>Evaluate oral presentations using established criteria and provide constructive feedback</li>
                    <li>Make inclusive language choices that demonstrate cultural competence</li>
                    <li>Listen strategically to understand multiple perspectives and respond thoughtfully</li>
                    <li>Synthesize information from discussions to draw well-supported conclusions</li>
                    <li>Engage in sophisticated peer and self-reflection on communication effectiveness</li>
                    <li>Ask probing questions that extend thinking and deepen understanding</li>
                    <li>Request and provide clarification using advanced communication strategies</li>
                    <li>Speak with confidence using varied sentence structures and sophisticated vocabulary</li>
                    <li>Create complex media messages with attention to audience, purpose, and effectiveness</li>
                    <li>Collaborate effectively across cultural contexts with advanced sensitivity</li>
                    <li>Explain complex ideas with detailed support and respond to challenging questions</li>
                    <li>Use advanced vocal techniques and gestures to enhance meaning and engagement</li>
                    <li>Analyze and discuss differences between Standard English and Caribbean varieties</li>
                    <li>Incorporate sophisticated vocabulary and stylistic devices in oral presentations</li>
                    <li>Use figurative language creatively and effectively in speaking</li>
                    <li>Interpret complex meanings and nuances in various contexts</li>
                    <li>Paraphrase and synthesize information from multiple sources and formats</li>
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
                  <strong className="text-blue-700">Observations:</strong> Systematic observations during complex
                  listening and speaking activities, noting critical thinking, leadership, and cultural sensitivity
                </li>
                <li>
                  <strong className="text-blue-700">Conversations:</strong> In-depth discussions about communication
                  goals, strategies, and self-reflection on growth
                </li>
                <li>
                  <strong className="text-blue-700">Products:</strong> Sophisticated presentations, debates, multimedia
                  projects, and collaborative discussions
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <h4 className="font-semibold mb-2 text-blue-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Advanced rubrics for evaluating complex oral presentations</li>
                  <li>Self-assessment portfolios with reflection components</li>
                  <li>Peer evaluation forms for collaborative speaking activities</li>
                  <li>Digital portfolios of speaking development over time</li>
                  <li>Analytical tools for assessing debate and argumentation skills</li>
                  <li>Cultural competency checklists for inclusive communication</li>
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
                  <AccordionTrigger>Advanced Listening Skills</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Critical Listening Labs:</strong> Analyze complex audio texts including speeches,
                        debates, and multimedia presentations for bias, perspective, and effectiveness.
                      </li>
                      <li>
                        <strong>Metacognitive Strategies:</strong> Teach students to monitor their listening
                        comprehension and adjust strategies based on purpose and text complexity.
                      </li>
                      <li>
                        <strong>Cultural Immersion:</strong> Engage with diverse cultural performances and media to
                        develop appreciation for linguistic and cultural diversity.
                      </li>
                      <li>
                        <strong>Media Literacy:</strong> Critically analyze news, advertisements, and social media for
                        persuasive techniques, credibility, and hidden messages.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Sophisticated Oral Expression</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Parliamentary Debates:</strong> Conduct formal debates using parliamentary procedures
                        where students research complex issues and present evidence-based arguments.
                      </li>
                      <li>
                        <strong>TED-Style Talks:</strong> Guide students in creating and delivering compelling
                        presentations on topics they're passionate about, focusing on storytelling and persuasion.
                      </li>
                      <li>
                        <strong>Multimedia Storytelling:</strong> Create digital stories that combine narration, music,
                        and visuals to convey complex themes and messages.
                      </li>
                      <li>
                        <strong>Expert Panels:</strong> Organize student-led expert panels where they research and
                        present on specialized topics, fielding questions from the audience.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Advanced Communication Skills</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Socratic Seminars:</strong> Facilitate student-led discussions where participants ask
                        probing questions and build on each other's ideas to explore complex texts and topics.
                      </li>
                      <li>
                        <strong>Diplomatic Simulations:</strong> Role-play international negotiations and diplomatic
                        scenarios that require sophisticated communication and cultural sensitivity.
                      </li>
                      <li>
                        <strong>Peer Coaching:</strong> Train students to provide constructive feedback and coaching to
                        peers on presentation skills and communication effectiveness.
                      </li>
                      <li>
                        <strong>Cross-Cultural Exchanges:</strong> Facilitate virtual or in-person exchanges with
                        students from different cultural backgrounds to practice inclusive communication.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Cultural and Linguistic Appreciation</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Linguistic Research Projects:</strong> Investigate the history and features of Caribbean
                        languages and dialects, presenting findings to authentic audiences.
                      </li>
                      <li>
                        <strong>Cultural Documentation:</strong> Interview community elders and cultural practitioners
                        to document and preserve local traditions, stories, and language practices.
                      </li>
                      <li>
                        <strong>Multilingual Performances:</strong> Create performances that showcase the beauty and
                        richness of multiple languages and cultural expressions.
                      </li>
                      <li>
                        <strong>Social Justice Advocacy:</strong> Research and present on social issues affecting the
                        Caribbean region, developing advocacy campaigns and presentations.
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
                <li>Complex audio and video resources for critical analysis</li>
                <li>Debate and discussion protocols and frameworks</li>
                <li>Multimedia presentation tools and software</li>
                <li>Cultural artifacts and primary source materials</li>
                <li>OECS Grade 6 Language Arts Curriculum Guide</li>
                <li>Professional development resources on inclusive pedagogy</li>
                <li>Assessment rubrics for complex oral communication tasks</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Digital portfolios for tracking communication growth</li>
                <li>Research tools and databases for project preparation</li>
                <li>Presentation software and multimedia creation tools</li>
                <li>Recording equipment for self-assessment and reflection</li>
                <li>Cultural resources and community connections</li>
                <li>Advanced graphic organizers for complex presentations</li>
                <li>Peer feedback protocols and self-assessment tools</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              At Grade 6, listening and speaking become sophisticated tools for critical thinking, cultural
              appreciation, and social engagement. Students are capable of engaging with complex ideas, analyzing
              multiple perspectives, and expressing themselves with nuance and precision. Teachers should provide
              opportunities for authentic communication experiences that connect to real-world issues and cultural
              contexts.
            </p>
            <p className="mt-2">
              The integration of technology and multimedia enhances students' ability to create compelling presentations
              and engage with diverse audiences. Teachers should model and teach advanced communication strategies while
              maintaining high expectations for respectful, inclusive dialogue that values linguistic and cultural
              diversity.
            </p>
            <p className="mt-2">
              Assessment at this level should focus on students' ability to think critically, communicate effectively
              across contexts, and demonstrate cultural competence. Providing opportunities for student choice and voice
              in topics and formats helps maintain engagement while developing sophisticated communication skills.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
