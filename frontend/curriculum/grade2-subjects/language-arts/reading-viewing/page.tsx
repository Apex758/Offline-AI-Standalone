import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, BookOpen, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade2ReadingViewingPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade2-subjects/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Language Arts
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-blue-800 flex items-center">
            <BookOpen className="mr-2 h-7 w-7 text-blue-600" />
            Grade 2 Reading and Viewing
          </h1>
          <p className="text-gray-700">
            Reading and Viewing are meaning-making, problem-solving activities that provide opportunities to interact
            with a wide range of written and visual text for a variety of purposes. Readers learn to integrate
            strategies and skills as they develop thoughtful and critical understanding of text.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Two Expectations for Reading and Viewing
        </h3>

        <Tabs defaultValue="pleasure">
          <TabsList className="grid w-full grid-cols-3 bg-blue-100">
            <TabsTrigger value="pleasure" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Pleasure & Growth
            </TabsTrigger>
            <TabsTrigger value="background" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Background Knowledge
            </TabsTrigger>
            <TabsTrigger value="genres" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Genres & Text Forms
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pleasure" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Read for pleasure and personal growth</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Read familiar Early Level texts independently and with confidence</li>
              <li>Continue to browse books of interest in a wide range of genres</li>
              <li>Continue to make imaginative and real-life connections to their own experiences</li>
            </ul>
          </TabsContent>

          <TabsContent value="background" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Use background knowledge</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Use prior knowledge and background experience to construct meaning in a text</li>
              <li>Notice a favourite author’s writing style</li>
            </ul>
          </TabsContent>

          <TabsContent value="genres" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Interact meaningfully with a wide range of genres and text forms</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Participate in shared reading with a partner, a small group or whole class</li>
              <li>Develop fluency to foster understanding of what they have read</li>
              <li>Identify and describe why passages are described as fiction, nonfiction, and poetry</li>
              <li>
                Use various reading strategies to monitor their own understanding of texts and repair misunderstandings
              </li>
              <li>Make inferences about ideas, events and information presented in texts that they read</li>
              <li>Draw conclusions about texts they read and those read to them</li>
              <li>Express a personal response to texts they have read</li>
              <li>Use charts and diagrams to interpret and clarify meaning of an expository text</li>
              <li>
                Participate in small group discussions about text and represent their understanding and critical
                reflection in a variety of ways
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
            <CardDescription>By the end of Grade Two, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Use background knowledge and interests to select books
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Continue to make engaging and ‘just right’ book choices for Independent Reading based on:
                      interests, various cultures (theirs and others), difficulty level, genre
                    </li>
                    <li>
                      Reflect on various sources of background knowledge to predict and make connections before, during
                      and after reading a piece of: fiction, nonfiction, poetry
                    </li>
                    <li>Increase time (build stamina) while engaged in Independent Reading</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Engage critically with a range of texts for pleasure
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Demonstrate understanding and application of reading strategies while reading Early level texts
                    </li>
                    <li>
                      Ask critical questions of fiction, nonfiction and poetry (Why, what if, is it possible, etc.)
                    </li>
                    <li>
                      Make connections between wellbeing and information texts on topics such as: physical activity,
                      health, emotions
                    </li>
                    <li>Recognize different points of view of the author of print and/or digital text</li>
                    <li>Continue to develop an understanding and respect for diversity in text and illustrations</li>
                    <li>
                      Use illustrations and details in a text to describe and interpret characters, setting, and events
                    </li>
                    <li>
                      Reflect on the purpose of different types of texts e.g., local newspaper articles, local stories,
                      poems, ads, e-texts, etc.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-sky-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-sky-50">
              <CardTitle className="text-sky-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-sky-700">Conversations:</strong> Teacher-learner interviews, book club
                  discussions
                </li>
                <li>
                  <strong className="text-sky-700">Observations:</strong> Monitoring reading fluency, engagement, and
                  application of reading strategies
                </li>
                <li>
                  <strong className="text-sky-700">Products:</strong> Student-created illustrations, graphic organizers,
                  and written responses to texts
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg border border-sky-100">
                <h4 className="font-semibold mb-2 text-sky-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Concepts About Print Assessment</li>
                  <li>Oral Reading Record (Running Record)</li>
                  <li>Checklists for monitoring comprehension and fluency</li>
                  <li>Rubrics for evaluating student-created projects</li>
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
                  <AccordionTrigger>Use background knowledge and interests to select books</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Enjoying and learning from the class library: Provide a variety of books, articles, poems,
                        lyrics and images of different topics and genres and levels in the class library
                      </li>
                      <li>
                        Choosing a book for Independent Writing: Review lessons learned in Grade One about choosing a
                        book of interest that provides just the right amount of challenge
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Engage critically with a range of texts for pleasure</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Setting the stage for Independent Reading: Using a section of an anchor text that represents the
                        concept being taught
                      </li>
                      <li>
                        Let’s Compare: Provide opportunities for learners to focus on the images and words in text
                      </li>
                      <li>
                        Let’s share!: Plan reading responses that encourage learners to share the pleasures of reading
                      </li>
                      <li>Dramatising Poetry: Visit sites such as Ken Nesbiit’s</li>
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
                <li>Concepts About Print Assessment</li>
                <li>Oral Reading Record (Running Record)</li>
                <li>OECS Grade 2 Language Arts Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Variety of books, magazines, and digital texts</li>
                <li>Materials for creating visual representations</li>
                <li>Props for storytelling and dramatization</li>
                <li>Personal dictionaries and word banks</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Reading and Viewing are meaning-making, problem-solving activities that provide opportunities to interact
              with a wide range of written and visual text for a variety of purposes. Readers learn to integrate
              strategies and skills as they develop thoughtful and critical understanding of text.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
