import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, DollarSign, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function EconomicDecisionMakingPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade6-subjects/social-studies">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 6 Social Studies
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-blue-700 flex items-center">
            <DollarSign className="mr-2 h-7 w-7 text-blue-600" />
            Economic Decision Making
          </h1>
          <p className="text-gray-700">
            This strand explores how regional and international movement of goods, people, and services shapes Caribbean
            society. Students examine consumer rights, tourism impacts, international relations, global resources, and
            economic sectors while developing skills for responsible economic decision-making in a globalized world.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Six Expectations for Economic Decision Making
        </h3>

        <Tabs defaultValue="consumer">
          <TabsList className="grid w-full grid-cols-3 bg-blue-100">
            <TabsTrigger value="consumer" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Consumer Rights & Tourism
            </TabsTrigger>
            <TabsTrigger value="relations" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              International Relations
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Resources & Economic Sectors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="consumer" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Consumer Rights and Tourism Impact</h4>
            <p className="mb-3">
              To recognize how regional and international movement shapes Caribbean society through consumer awareness
              and tourism.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Know that consumers have rights and responsibilities</li>
              <li>Plan and develop budgets to guide consumption</li>
              <li>Appreciate the value of making responsible consumer decisions</li>
              <li>State the benefits derived from tourism for the country</li>
              <li>Critically assess tourism opportunities and challenges</li>
              <li>Appreciate positive and negative effects of tourism</li>
            </ul>
          </TabsContent>

          <TabsContent value="relations" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Sustainable Community Development</h4>
            <p className="mb-3">
              To understand the importance of maintaining good relations with the wider world for sustainable
              development.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Recognize the importance of good relations with the wider world</li>
              <li>Investigate negative consequences of poor international relations</li>
              <li>Appreciate the importance of maintaining positive global relations</li>
              <li>Understand how international cooperation addresses global challenges</li>
              <li>Explore cultural exchange and diplomatic relationships</li>
              <li>Analyze the role of international trade and partnerships</li>
            </ul>
          </TabsContent>

          <TabsContent value="resources" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Resources and Economic Sectors</h4>
            <p className="mb-3">
              To understand global resources and economic activities that shape Caribbean participation in the world
              economy.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Classify major world resources and compare with country's resources</li>
              <li>Analyze reasons why some countries have limited resources</li>
              <li>Determine ways to utilize world resources better and fairly</li>
              <li>Identify different types of economic activities and employment</li>
              <li>Compare major world industries with those in the Caribbean</li>
              <li>Appreciate how the Caribbean contributes to world economic activities</li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-t-4 border-green-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-700">Consumer Rights & Responsibilities</CardTitle>
            <CardDescription>Understanding consumer protection and financial literacy</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Students explore consumer rights, budgeting skills, and responsible financial decision-making.
            </p>
            <Button asChild className="w-full">
              <Link href="/curriculum/grade6-subjects/social-studies/economic-decision-making/consumer-rights">
                Explore Activities
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-purple-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-purple-50">
            <CardTitle className="text-purple-700">Tourism</CardTitle>
            <CardDescription>Examining tourism's impact on Caribbean economies</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Students analyze tourism benefits, challenges, and its role in economic development.
            </p>
            <Button asChild className="w-full">
              <Link href="/curriculum/grade6-subjects/social-studies/economic-decision-making/tourism">
                Explore Activities
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-orange-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-orange-50">
            <CardTitle className="text-orange-700">Sustainable Community Development</CardTitle>
            <CardDescription>Building positive international relationships</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Students explore global cooperation, cultural exchange, and peace-building efforts.
            </p>
            <Button asChild className="w-full">
              <Link href="/curriculum/grade6-subjects/social-studies/economic-decision-making/sustainable-development">
                Explore Activities
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-teal-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-teal-50">
            <CardTitle className="text-teal-700">Resources & Economic Sectors</CardTitle>
            <CardDescription>Understanding global resources and economic activities</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Students examine resource distribution, economic sectors, and Caribbean contributions to the world
              economy.
            </p>
            <Button asChild className="w-full">
              <Link href="/curriculum/grade6-subjects/social-studies/economic-decision-making/resources-economic-sectors">
                Explore Activities
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
