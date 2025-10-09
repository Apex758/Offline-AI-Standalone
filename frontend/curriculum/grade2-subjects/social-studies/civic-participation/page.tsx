import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Users, ClipboardCheck, BookOpen } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function CivicParticipationPage() {
  return (
    <div className="container mx-auto py-8">
      
      <Link href="/curriculum/grade2-subjects/social-studies">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 2 Social Studies
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-100 to-sky-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-blue-700 flex items-center">
            <Users className="mr-2 h-7 w-7 text-blue-600" />
            Civic Participation
          </h1>
          <p className="text-gray-700">
            In Grade 2, students develop an understanding of how rights and responsibilities are important for building
            strong communities. They explore community safety and health, conflict resolution, community governance,
            accident prevention, and safety procedures. This knowledge helps students understand their role as active
            citizens in creating and maintaining harmonious communities.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Two Expectations for Civic Participation
        </h3>

        <Tabs defaultValue="safety">
          <TabsList className="grid w-full grid-cols-3 bg-blue-100">
            <TabsTrigger value="safety" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Community Safety
            </TabsTrigger>
            <TabsTrigger value="conflict" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Resolving Conflict
            </TabsTrigger>
            <TabsTrigger value="governance" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Community Governance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="safety" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 1: Community Safety</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Describe actions that children can take to make their neighborhoods safe and healthy</li>
              <li>Engage in actions to improve one's community</li>
              <li>Appreciate the positive benefits of helping others who are in need in your neighborhood</li>
              <li>List possible causes of accidents and injuries at home and in our community</li>
              <li>Investigate how community workers help keep families and children safe</li>
              <li>Appreciate the importance of following safety procedures</li>
              <li>Recognize that children have the right to be safe in their community</li>
            </ul>
          </TabsContent>

          <TabsContent value="conflict" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 2: Resolving Conflict</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify examples of conflict in our communities and neighborhoods</li>
              <li>Role play ways to resolve differences and arguments</li>
              <li>Appreciate the role of police and other community helpers in dealing with conflict</li>
              <li>Describe ways that communities help ensure that members are safe</li>
              <li>
                Appreciate that family and community members are responsible for helping children feel safe and cared
                for
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="governance" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 3: Community Governance</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Describe how our local community is governed</li>
              <li>Gather information about different local services that are organized at our community level</li>
              <li>Appreciate the advantages of local community involvement to assist families to meet their needs</li>
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
                  Keeping Our Neighborhoods Safe and Healthy
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify features that make a community unsafe and healthy
                    </li>
                    <li>
                      <strong>Skills:</strong> Engage in actions to improve one's community
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the positive benefits of helping to keep their communities
                      safe and healthy
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Resolving Conflict in our Communities
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify examples of conflict in our communities and neighborhoods
                    </li>
                    <li>
                      <strong>Skills:</strong> Role play ways to resolve differences and arguments
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the role of police and other community helpers in dealing with
                      conflict
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Governing the Community
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Describe how our local community is governed
                    </li>
                    <li>
                      <strong>Skills:</strong> Gather information about different local services that are organized at
                      our community level
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the advantages of local community involvement to assist
                      families to meet their needs
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Accidents at Home and in the Community
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> List possible causes of accidents and injuries at home and in our
                      community
                    </li>
                    <li>
                      <strong>Skills:</strong> Investigate how community workers help keep families and children safe
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the importance of following safety procedures
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Safety in the Community
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Recognize that children have the right to be safe in their community
                    </li>
                    <li>
                      <strong>Skills:</strong> Describe ways that their community helps ensure that its members are safe
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate that family and community members are responsible for helping
                      children feel safe and cared for
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
                  <strong className="text-sky-700">Observations:</strong> Observing student participation in role plays,
                  mock celebrations, field trips, and community projects
                </li>
                <li>
                  <strong className="text-sky-700">Conversations:</strong> Critical thinking questions, picture
                  inferencing, stand or sit trivia, guided discussions
                </li>
                <li>
                  <strong className="text-sky-700">Products:</strong> Maps with safe/unsafe locations, community service
                  projects, journals, artwork, posters
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg border border-sky-100">
                <h4 className="font-semibold mb-2 text-sky-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Checklists for conflict resolution skills</li>
                  <li>Self-assessment reflection forms</li>
                  <li>Role play observation rubrics</li>
                  <li>Community service project documentation</li>
                  <li>Peer assessment tools for collaborative work</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-blue-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-700 flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Inclusive Learning Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Strategies to support diverse learners:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-blue-700">Community Connections:</strong> Field trips to local government
                  offices, visits from community helpers, service learning projects
                </li>
                <li>
                  <strong className="text-blue-700">Experiential Learning:</strong> Role playing conflict resolution
                  scenarios, creating safety maps, mock community meetings
                </li>
                <li>
                  <strong className="text-blue-700">Visual Supports:</strong> Picture cards of community helpers, safety
                  signs, visual schedules for community projects
                </li>
                <li>
                  <strong className="text-blue-700">Collaborative Work:</strong> Small group safety campaigns, partner
                  interviews about community roles, team problem-solving activities
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg border border-blue-100">
                <h4 className="font-semibold mb-2 text-blue-700">Focus Questions:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>How can we make our neighborhoods safe and healthy?</li>
                  <li>What can we do when we have a disagreement with someone?</li>
                  <li>Who helps make decisions in our community?</li>
                  <li>How can we prevent accidents at home and in our community?</li>
                  <li>What rights do children have to be safe in their community?</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Link href="/curriculum/grade2-subjects/social-studies/spatial-thinking">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Spatial Thinking
          </Button>
        </Link>
        <Link href="/curriculum/grade2-subjects/social-studies/economic-decision-making">
          <Button variant="outline">
            Economic Decision Making <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
