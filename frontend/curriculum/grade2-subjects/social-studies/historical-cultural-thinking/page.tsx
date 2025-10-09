import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, BookOpen, ClipboardCheck } from 'lucide-react'
import { Breadcrumb } from "@/components/breadcrumb"

export default function HistoricalCulturalThinkingPage() {
  return (
    <div className="container mx-auto py-8">
      
      <Link href="/curriculum/grade2-subjects/social-studies">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 2 Social Studies
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-teal-100 to-green-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-teal-700 flex items-center">
            <BookOpen className="mr-2 h-7 w-7 text-teal-600" />
            Historical and Cultural Thinking
          </h1>
          <p className="text-gray-700">
            In Grade 2, students develop an appreciation for how our past and present shape our identity. 
            They explore the roots of their identity as Caribbean people through family relationships, 
            festivals and celebrations, and historical sites. This knowledge helps students understand 
            and appreciate the rich cultural heritage that forms their identity.
          </p>
        </div>
      </div>

      <div className="bg-teal-50 p-6 rounded-lg border border-teal-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-teal-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Two Expectations for Historical and Cultural Thinking
        </h3>

        <Tabs defaultValue="ancestors">
          <TabsList className="grid w-full grid-cols-3 bg-teal-100">
            <TabsTrigger value="ancestors" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              Our Ancestors
            </TabsTrigger>
            <TabsTrigger
              value="families"
              className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
            >
              Our Families
            </TabsTrigger>
            <TabsTrigger
              value="festivals"
              className="data-[state=active]:bg-teal-600 data-[state=active]:text-white"
            >
              Festivals & Sites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ancestors" className="p-4 border rounded-md mt-2 bg-teal-50 border-teal-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 1: Our Ancestors</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>State where the early settlers came from</li>
              <li>Explain how and why the early settlers came to the Caribbean</li>
              <li>Discuss why our community is made up of diverse ethnic groups</li>
              <li>Identify the early groups of people who settled in our community</li>
              <li>Identify on a map the locations from which the early people settled in our community came</li>
              <li>Recognize that the community is made up of families of different ethnic origins</li>
            </ul>
          </TabsContent>

          <TabsContent value="families" className="p-4 border rounded-md mt-2 bg-teal-50 border-teal-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 2: Our Families</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Describe their relationship to other family members</li>
              <li>Represent family relations using a family tree</li>
              <li>Know that family relationships can be represented on a family tree</li>
              <li>Represent relationships of families on a simple family tree</li>
              <li>Appreciate that our family tree is made up of a diverse range of people who share a common heritage</li>
              <li>State ways in which family members interact and the reasons for doing so</li>
              <li>Investigate how families in various communities fulfill their need for interaction</li>
              <li>Appreciate that there are diverse ways that people fulfill their need for human interaction</li>
            </ul>
          </TabsContent>

          <TabsContent value="festivals" className="p-4 border rounded-md mt-2 bg-teal-50 border-teal-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 3: Festivals and Historical Sites</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify occasions when families come together and the significance of doing so</li>
              <li>Describe occasions when people in the community come together to share</li>
              <li>Practice caring for one another in families, classrooms, and communities</li>
              <li>Know the festivals that are celebrated in their communities</li>
              <li>State examples of festivals celebrated in their country</li>
              <li>Discuss the reasons for celebrating various festivals in their country</li>
              <li>Name historical sites in their community and state their importance to cultural identity</li>
              <li>List examples of the oldest historical sites in our community</li>
              <li>Investigate the location, the age, and significance of these historical sites</li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-teal-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-teal-50">
            <CardTitle className="text-teal-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade Two, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-teal-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-teal-50 px-4 py-2 rounded-md">
                  Our Ancestors
                </AccordionTrigger>
                <AccordionContent className="bg-teal-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Knowledge:</strong> Identify the early groups of people who settled in our community and explain why and how they came</li>
                    <li><strong>Skills:</strong> Identify on a map the locations from which the early people that settled in our community came</li>
                    <li><strong>Values:</strong> Recognize that the community is made up of families of different ethnic origins</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-teal-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-teal-50 px-4 py-2 rounded-md">
                  Our Families
                </AccordionTrigger>
                <AccordionContent className="bg-teal-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Knowledge:</strong> Know that family relationships can be represented on a family tree</li>
                    <li><strong>Skills:</strong> Represent relationships of families on a simple family tree</li>
                    <li><strong>Values:</strong> Appreciate that our family tree is made up of a diverse range of people who share a common heritage</li>
                    <li><strong>Knowledge:</strong> State the ways individuals and families share positive human interactions with others</li>
                    <li><strong>Skills:</strong> Investigate how families in various communities fulfill their need for interaction</li>
                    <li><strong>Values:</strong> Appreciate that there are diverse ways that people fulfil their need for human interaction</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-teal-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-teal-50 px-4 py-2 rounded-md">
                  Family Occasions
                </AccordionTrigger>
                <AccordionContent className="bg-teal-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Knowledge:</strong> Describe occasions when people in the community come together to share</li>
                    <li><strong>Skills:</strong> Practice caring for one another in families, classrooms, and communities</li>
                    <li><strong>Values:</strong> Appreciate the value of community members supporting one another in times of celebrations, grief, and need</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-teal-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-teal-50 px-4 py-2 rounded-md">
                  Our Festivals
                </AccordionTrigger>
                <AccordionContent className="bg-teal-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Knowledge:</strong> State examples of festivals celebrated in their country</li>
                    <li><strong>Skills:</strong> Discuss the reasons for celebrating various festivals in their country</li>
                    <li><strong>Values:</strong> Appreciate that festivals can be an important way to build community, national cohesion and pride</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-teal-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-teal-50 px-4 py-2 rounded-md">
                  Historical Sites
                </AccordionTrigger>
                <AccordionContent className="bg-teal-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Knowledge:</strong> List examples of the oldest historical sites in our community</li>
                    <li><strong>Skills:</strong> Investigate the location, the age, significance of these historical sites</li>
                    <li><strong>Values:</strong> Appreciate that historical sites can help us understand our identity</li>
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
                  <strong className="text-green-700">Observations:</strong> Observe students during activities like Four Corners, role plays, and community service projects
                </li>
                <li>
                  <strong className="text-green-700">Conversations:</strong> Video/picture inferencing, guided discussions, oral inquiries, student reflections
                </li>
                <li>
                  <strong className="text-green-700">Products:</strong> Map work, discussions and analysis of data, model building, poster collages, scrapbooks
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-100">
                <h4 className="font-semibold mb-2 text-green-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Peer assessment checklists for community representations</li>
                  <li>Reflective exit forms after field trips</li>
                  <li>Map location activities to identify origins of ancestors</li>
                  <li>Family tree labeling activities</li>
                  <li>Scenario-based activities to identify positive interactions</li>
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
                  <AccordionTrigger>Exploring Our Ancestors</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Video/Picture Inferencing:</strong> Students view images of people from different ethnic backgrounds and identify physical features.
                      </li>
                      <li>
                        <strong>Map Work:</strong> Students identify regions where ancestors were located and color these regions on a world map.
                      </li>
                      <li>
                        <strong>Oral Inquiry:</strong> Students ask family members about the origin of their ancestors and share findings with the class.
                      </li>
                      <li>
                        <strong>Games:</strong> "Take Me Home" using paper boats on a map and "Four Corners" to identify geographic origins.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Understanding Our Families</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Guided Research:</strong> Students construct interview prompts to gather information about family relationships.
                      </li>
                      <li>
                        <strong>Scrapbook Creation:</strong> Students create a "My Family Album" scrapbook using pictures or drawings of family members.
                      </li>
                      <li>
                        <strong>Family Tree Activities:</strong> Students learn about and create family trees showing three generations.
                      </li>
                      <li>
                        <strong>Family Bracelets:</strong> Students make personalized bracelets with letter beads for family members.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Family Interactions</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Guided Discussion:</strong> Students share experiences of times they enjoyed with family members.
                      </li>
                      <li>
                        <strong>Storytelling and Role Play:</strong> Students role-play different aspects of family life that highlight positive interactions.
                      </li>
                      <li>
                        <strong>Interactive Puzzles:</strong> Students complete puzzles depicting positive human interactions in different cultures.
                      </li>
                      <li>
                        <strong>Traditional Games:</strong> Students engage in traditional games that foster positive human interaction.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Festivals and Historical Sites</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Field Trips:</strong> Students tour historical sites in their community and collect images or drawings.
                      </li>
                      <li>
                        <strong>Map Work:</strong> Students locate historical sites on virtual maps and place markers or pictures in the correct locations.
                      </li>
                      <li>
                        <strong>Cultural Expo:</strong> Students bring items representing different festivals for a classroom display.
                      </li>
                      <li>
                        <strong>Poster Collage:</strong> Students create a poster promoting the historical sites in their community.
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
                <li>World maps and country maps</li>
                <li>Historical and modern photographs of the community</li>
                <li>Books and videos about ancestors, family relationships, and festivals</li>
                <li>Art supplies for family trees and model building</li>
                <li>OECS Grade 2 Social Studies Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Culturally diverse pictures and books</li>
                <li>Family photographs for creating family trees</li>
                <li>Materials for creating models and drawings</li>
                <li>Digital devices for virtual exploration of maps and historical sites</li>
                <li>Journal for recording observations and reflections</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p className="mb-2">
              Our ancestors came from different parts of the world for various reasons and at different times. The main groups and their locations are:
            </p>
            <ol className="list-decimal pl-5 space-y-1 mb-4">
              <li>Amerindians - South America</li>
              <li>Europeans - Europe</li>
              <li>Africans - West Africa</li>
              <li>Asians - Asia</li>
            </ol>
            <p className="mb-2">
              The family is made up of a group of persons related by blood, marriage, and adoption. Relationships include grandparents, parents, and children. A family tree shows how persons in a family are related to each other.
            </p>
            <p>
              Countries celebrate different festivals for varied reasons, such as Christmas, Easter, Carnival, Divali, Independence, Creole, and La Rose. Festivals are important because they help us celebrate our ancestors/past, continue our traditions, unite persons in our communities, and earn money for families.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
