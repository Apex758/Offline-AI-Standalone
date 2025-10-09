import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EconomicDecisionMaking() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Economic Decision Making</h1>
        <Button asChild variant="outline">
          <Link href="/curriculum/grade1-subjects/social-studies">Back to Grade 1 Social Studies</Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold mb-2">Essential Learning Outcome</h2>
          <p className="text-lg">To be aware that we all have things we need and things we want</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="values">Values</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Introduction</h3>
              <p className="mb-4">
                This strand helps students develop an understanding of basic economic concepts, including needs and
                wants, goods and services, resources, and transportation. Students will learn to distinguish between
                necessities and desires, understand how goods and services meet our needs, explore how we use
                environmental resources, and recognize the importance of transportation safety.
              </p>

              <h3 className="text-xl font-semibold mb-2">Focusing Questions</h3>
              <ol className="list-decimal pl-6 space-y-2 mb-4">
                <li>What are needs and wants?</li>
                <li>Does everyone have the same needs?</li>
                <li>What are goods and services?</li>
                <li>Who provides us with goods and services?</li>
                <li>What are resources?</li>
                <li>What is the environment?</li>
                <li>What are natural resources?</li>
                <li>What are man-made resources?</li>
                <li>How does the use of resources meet our needs and wants?</li>
                <li>How can we use resources wisely?</li>
                <li>How do we get from place to place?</li>
                <li>Why is it important to be careful when traveling about?</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Knowledge Outcomes</h3>
              <p className="mb-4">Students will be able to:</p>

              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">Identify basic human needs</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will recognize essential needs such as food, water, shelter, and clothing that are
                    necessary for survival.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">
                    Understand that we meet most of our needs and wants through goods and services
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will comprehend that goods are tangible items we can buy and hold, while services are
                    actions that people do to help others.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">Identify things in the environment that we use</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will recognize natural and man-made resources in their environment and understand how these
                    are used.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">
                    Understand the various forms of transportation in your local environment
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will identify different modes of transportation used for moving people and goods from one
                    place to another.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Skills Outcomes</h3>
              <p className="mb-4">Students will be able to:</p>

              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">Distinguish between our basic needs and our wants</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will categorize items as needs (essential for survival) or wants (desired but not necessary
                    for survival).
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">Categorise our needs and wants as goods or services</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will classify various needs and wants as either tangible goods or intangible services.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">Discuss how we use things in the environment</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will explain how natural resources like water, wood, and soil are used to meet human needs
                    and wants.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">
                    Distinguish different forms of transportation and their benefits and limitations
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will compare various modes of transportation (land, water, air) and identify their
                    appropriate uses.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="values" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Values/Attitudes Outcomes</h3>
              <p className="mb-4">Students will:</p>

              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">Appreciate the difference between needs and wants</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will value the importance of prioritizing needs over wants and understand that not all
                    desires are necessities.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">
                    Appreciate that goods and services are necessary to meet our needs and wants
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will recognize the value of both goods and services in satisfying human needs and wants.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">
                    Appreciate that the environment can be used to provide our needs and wants
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will develop an understanding of how environmental resources contribute to human well-being
                    and the importance of using these resources responsibly.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">Appreciate the importance of exercising safety around transportation</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will value safety practices when using or being around various forms of transportation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Teacher Resources</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Books and Stories</h4>
                  <ul className="list-disc pl-6 space-y-1 mb-4">
                    <li>"Lily Learns about Wants and Needs" (Read Aloud)</li>
                    <li>"The Lorax" by Dr. Seuss (Audiobook)</li>
                    <li>"Hooray For Garbage Collector" by Tessa Kenan</li>
                    <li>"Garbage Collectors" (Abdo Kids)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Videos</h4>
                  <ul className="list-disc pl-6 space-y-1 mb-4">
                    <li>The Natural Resources SONG | Science for Kids | Grades K-2</li>
                    <li>1st Grade Natural Resources</li>
                    <li>Environment Short Story for Children: Drip-Drop-Drip</li>
                    <li>Environment Cleanliness Kids | Short Story | Rooney's Adventures: The Friendly Octopus</li>
                    <li>"Sam The Garbage Man" Music Video | Songs for Kids | TheBeatBuds</li>
                    <li>Transportation videos for children</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Activities</h4>
                  <ul className="list-disc pl-6 space-y-1 mb-4">
                    <li>Role Play Activities: Class shop, taking care of dolls/teddy bears</li>
                    <li>Sorting activities: Categorizing needs vs. wants, goods vs. services</li>
                    <li>Creating posters and collages about goods, services, and resources</li>
                    <li>Matching games connecting everyday items with natural resources</li>
                    <li>Conservation activities demonstrating wise use of resources</li>
                    <li>Transportation-themed art projects and mobiles</li>
                    <li>Field trips to observe different forms of transportation</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Worksheets and Assessments</h4>
                  <ul className="list-disc pl-6 space-y-1 mb-4">
                    <li>
                      Needs and wants interactive worksheets:{" "}
                      <a href="https://www.liveworksheets.com" className="text-blue-600 hover:underline">
                        Link
                      </a>
                    </li>
                    <li>
                      Natural and Manmade Resources Drag and Drop:{" "}
                      <a
                        href="https://www.liveworksheets.com/worksheets/en/Science/Natural_Resources/Natural_and_Manmade_Resources_Drag_and_Drop_mv1853879jo"
                        className="text-blue-600 hover:underline"
                      >
                        Link
                      </a>
                    </li>
                    <li>
                      Identifying Goods and Services worksheet:{" "}
                      <a
                        href="https://mathworksheets4kids.com/identifying.pdf"
                        className="text-blue-600 hover:underline"
                      >
                        Link
                      </a>
                    </li>
                    <li>
                      Natural Resources Quiz:{" "}
                      <a
                        href="https://docs.google.com/forms/d/1fqFD_EflrRYLo7I44Ur_KdjeviE3A0HI-wImc33W978/edit"
                        className="text-blue-600 hover:underline"
                      >
                        Link
                      </a>
                    </li>
                    <li>
                      Natural Resources Worksheet:{" "}
                      <a
                        href="https://www.generationgenius.com/wp-content/uploads/2019/06/Natural-Resources-Worksheet-GG.pdf"
                        className="text-blue-600 hover:underline"
                      >
                        Link
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
