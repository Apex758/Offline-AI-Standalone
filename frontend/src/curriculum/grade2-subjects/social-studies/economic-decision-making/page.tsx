import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, DollarSign, ClipboardCheck, BookOpen } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function EconomicDecisionMakingPage() {
  return (
    <div className="container mx-auto py-8">
      
      <Link href="/curriculum/grade2-subjects/social-studies">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 2 Social Studies
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-green-700 flex items-center">
            <DollarSign className="mr-2 h-7 w-7 text-green-600" />
            Economic Decision Making
          </h1>
          <p className="text-gray-700">
            In Grade 2, students develop an understanding of economic concepts related to goods and services, needs and
            wants, and the role of work in our communities. They explore how people earn money, how communities provide
            goods and services, and how economic decisions affect daily life. This knowledge helps students understand
            basic economic principles and their role as consumers.
          </p>
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Two Expectations for Economic Decision Making
        </h3>

        <Tabs defaultValue="goods">
          <TabsList className="grid w-full grid-cols-3 bg-green-100">
            <TabsTrigger value="goods" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Goods and Services
            </TabsTrigger>
            <TabsTrigger value="needs" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Needs and Wants
            </TabsTrigger>
            <TabsTrigger value="work" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Work in Communities
            </TabsTrigger>
          </TabsList>

          <TabsContent value="goods" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 1: Goods and Services</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify goods and services provided in their community</li>
              <li>Explain how communities meet people's needs through goods and services</li>
              <li>Appreciate the interdependence of people in providing goods and services</li>
              <li>Describe how goods are transported to communities</li>
              <li>
                Identify the difference between goods that are produced locally and those that come from other places
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="needs" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 2: Needs and Wants</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Distinguish between needs and wants</li>
              <li>Explain how economic decisions are made based on needs and wants</li>
              <li>Appreciate that people have different needs and wants</li>
              <li>Recognize that some needs and wants cannot be met with available resources</li>
              <li>Identify ways that people save for future needs and wants</li>
            </ul>
          </TabsContent>

          <TabsContent value="work" className="p-4 border rounded-md mt-2 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 3: Work in Communities</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify different types of work that people do in their community</li>
              <li>Explain how work provides income to purchase goods and services</li>
              <li>Appreciate the importance of all types of work in a community</li>
              <li>Describe how technology has changed the way people work</li>
              <li>Recognize that people develop skills to do different kinds of work</li>
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
            <CardDescription>By the end of Grade Two, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Community Goods and Services
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify goods and services provided in their community
                    </li>
                    <li>
                      <strong>Skills:</strong> Explain how communities meet people's needs through goods and services
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the interdependence of people in providing goods and services
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Transportation of Goods
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Describe how goods are transported to communities
                    </li>
                    <li>
                      <strong>Skills:</strong> Identify the difference between goods that are produced locally and those
                      that come from other places
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the work involved in transporting goods to communities
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">Needs and Wants</AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Distinguish between needs and wants
                    </li>
                    <li>
                      <strong>Skills:</strong> Explain how economic decisions are made based on needs and wants
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate that people have different needs and wants
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Resource Limitations
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Recognize that some needs and wants cannot be met with available
                      resources
                    </li>
                    <li>
                      <strong>Skills:</strong> Identify ways that people save for future needs and wants
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the importance of making responsible economic choices
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">Work and Income</AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify different types of work that people do in their community
                    </li>
                    <li>
                      <strong>Skills:</strong> Explain how work provides income to purchase goods and services
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the importance of all types of work in a community
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md">
                  Technology and Work
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Describe how technology has changed the way people work
                    </li>
                    <li>
                      <strong>Skills:</strong> Recognize that people develop skills to do different kinds of work
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate how technology can help people in their work
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-green-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-green-700">Observations:</strong> Observing student participation in role
                  plays, market simulations, field trips to local businesses
                </li>
                <li>
                  <strong className="text-green-700">Conversations:</strong> Critical thinking questions, picture
                  sorting activities, guided discussions about economic choices
                </li>
                <li>
                  <strong className="text-green-700">Products:</strong> Goods and services charts, needs vs. wants
                  collages, community worker profiles, simple budgets
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
                <h4 className="font-semibold mb-2 text-green-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Checklists for identifying goods and services</li>
                  <li>Needs and wants sorting activities</li>
                  <li>Community worker interview forms</li>
                  <li>Simple budget planning worksheets</li>
                  <li>Transportation of goods mapping activities</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-green-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-700 flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Inclusive Learning Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Strategies to support diverse learners:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-green-700">Community Connections:</strong> Field trips to local businesses,
                  visits from community workers, classroom store simulations
                </li>
                <li>
                  <strong className="text-green-700">Experiential Learning:</strong> Role playing different jobs,
                  creating goods to sell at a class market, tracking classroom resources
                </li>
                <li>
                  <strong className="text-green-700">Visual Supports:</strong> Picture cards of goods and services,
                  visual needs vs. wants sorting activities, job picture dictionaries
                </li>
                <li>
                  <strong className="text-green-700">Collaborative Work:</strong> Small group business planning, partner
                  interviews about jobs, team budget activities
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
                <h4 className="font-semibold mb-2 text-green-700">Focus Questions:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>What goods and services do we use in our community?</li>
                  <li>How do goods get to our community?</li>
                  <li>What is the difference between things we need and things we want?</li>
                  <li>Why can't we always get everything we want?</li>
                  <li>What kinds of jobs do people do in our community?</li>
                  <li>How has technology changed the way people work?</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Link href="/curriculum/grade2-subjects/social-studies/civic-participation">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Civic Participation
          </Button>
        </Link>
        <Link href="/curriculum/grade2-subjects/social-studies">
          <Button variant="outline">
            Back to Social Studies <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
