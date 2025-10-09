import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HistoricalCulturalThinking() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Historical and Cultural Thinking</h1>
        <Button asChild variant="outline">
          <Link href="/curriculum/grade1-subjects/social-studies">Back to Grade 1 Social Studies</Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold mb-2">Essential Learning Outcome</h2>
          <p className="text-lg">To understand that our celebrations help us build pride in our identity</p>
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
                This strand focuses on helping students understand how celebrations and cultural practices contribute to
                their sense of identity and pride. Students will explore various celebrations in families, cultural
                aspects such as food, music, and dance, and learn about national symbols and their significance.
              </p>

              <h3 className="text-xl font-semibold mb-2">Grade Level Expectations and Focus Questions</h3>
              <ol className="list-decimal pl-6 space-y-2 mb-4">
                <li>What are celebrations?</li>
                <li>What are examples of celebrations in families?</li>
                <li>Why and when do we have celebrations in families?</li>
                <li>What is meant by the terms pride and identity?</li>
                <li>How do these celebrations help to build pride in our identity in our families?</li>
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
                  <h4 className="font-medium">
                    State different forms of celebrations that are practiced in families to build pride and identity
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will identify various celebrations such as birthdays, weddings, christenings/baptisms,
                    wakes, Christmas, and Easter that are practiced in families.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">
                    Identify aspects of culture such as food, music, dance that are relevant to celebrations in families
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will recognize cultural elements like traditional foods, musical instruments, and dances
                    that are part of family celebrations.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">List religious and national festivals celebrated by the family</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will identify religious festivals like Christmas and Easter, and national festivals like
                    Independence Day, Carnival, and other local celebrations.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">Identify the national symbols of their country</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will recognize national symbols including the flag, anthem, pledge, national bird, national
                    dish, and national drink.
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
                  <h4 className="font-medium">
                    Demonstrate different forms of celebration in the family and explain the importance of preserving
                    local culture
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will role-play aspects of celebrations and create pop-up books about family celebrations,
                    including vocabulary and images about foods, dance, and music.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">
                    Investigate and report how the family, school and nation celebrate various religious and national
                    festivals
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will interview family members about cultural practices, play matching games connecting
                    aspects of culture with seasons, and design posters on specific religious or national events.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">
                    Describe the national symbols through drawing, painting and/or other expressions
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will create models of national symbols, draw or color the national flag, create
                    hand-stamped T-shirts using national colors, and participate in National Colors Day activities.
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
                  <h4 className="font-medium">Appreciate their cultural heritage</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will participate in gallery walks to observe and share family cultural celebrations and
                    journal about their likes and dislikes regarding celebrations.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">
                    Respect that families celebrate religious and national festivals in different ways
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will reflect on ways to show respect to people who celebrate differently than they do
                    through journaling or video journals.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">
                    Appreciate that their national symbols are unique and special to their country and should be
                    respected
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will observe and practice showing respect for national symbols, such as standing correctly
                    during the national anthem and caring for the flag.
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
                  <h4 className="font-medium">Printed Materials</h4>
                  <ul className="list-disc pl-6 space-y-1 mb-4">
                    <li>Pictures</li>
                    <li>Textbooks</li>
                    <li>Newspapers</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Internet Resources</h4>
                  <p className="mb-2">Folk Songs:</p>
                  <ul className="list-disc pl-6 space-y-1 mb-4">
                    <li>
                      St. Vincent folk songs:{" "}
                      <a
                        href="http://tourism.gov.vc/tourism/index.php/svg-festivals/folk-songs"
                        className="text-blue-600 hover:underline"
                      >
                        Link
                      </a>
                    </li>
                    <li>
                      St. Lucian Folk Music:{" "}
                      <a
                        href="https://music.apple.com/us/album/traditional-st-lucia-folk-music-vol-3/1024228633"
                        className="text-blue-600 hover:underline"
                      >
                        Link
                      </a>
                    </li>
                    <li>
                      Dominican Folk songs:{" "}
                      <a href="https://www.youtube.com/watch?v=9w1atvkVQnE" className="text-blue-600 hover:underline">
                        Link
                      </a>
                    </li>
                    <li>
                      Grenada Folk songs:{" "}
                      <a
                        href="https://www.youtube.com/playlist?list=PL2kGl4P_Kr9kXQu2wB13jkiaZQDT78159"
                        className="text-blue-600 hover:underline"
                      >
                        Link
                      </a>
                    </li>
                  </ul>

                  <p className="mb-2">National Anthems:</p>
                  <ul className="list-disc pl-6 space-y-1 mb-4">
                    <li>
                      St. Vincent and the Grenadines:{" "}
                      <a href="https://www.youtube.com/watch?v=j-fV1oaP-yU" className="text-blue-600 hover:underline">
                        Link
                      </a>
                    </li>
                    <li>
                      St. Lucia:{" "}
                      <a href="https://www.youtube.com/watch?v=JFtM4xZYa78" className="text-blue-600 hover:underline">
                        Link
                      </a>
                    </li>
                    <li>
                      Commonwealth of Dominica:{" "}
                      <a href="https://www.youtube.com/watch?v=GmylDJ9Ad8U" className="text-blue-600 hover:underline">
                        Link
                      </a>
                    </li>
                    <li>
                      Grenada:{" "}
                      <a href="https://www.youtube.com/watch?v=rcsktFQs-Qw" className="text-blue-600 hover:underline">
                        Link
                      </a>
                    </li>
                  </ul>

                  <p className="mb-2">National Symbols:</p>
                  <ul className="list-disc pl-6 space-y-1 mb-4">
                    <li>
                      St. Lucia National Symbols:{" "}
                      <a
                        href="https://www.liveworksheets.com/worksheets/en/Social_Studies/National_Symbols/St._Lucia_National_Symbols_on1566653px"
                        className="text-blue-600 hover:underline"
                      >
                        Link
                      </a>
                    </li>
                    <li>
                      St. Lucia National Symbols by Miss Melisamcjh:{" "}
                      <a
                        href="https://www.youtube.com/watch?v=iqUCVOp0IM0&list=PL1H0vRnM-9lhJmNdmtB23cNFT0kGHsCyM"
                        className="text-blue-600 hover:underline"
                      >
                        Link
                      </a>
                    </li>
                    <li>
                      St. Vincent and the Grenadines national symbol:{" "}
                      <a
                        href="http://foreign.gov.vc/foreign/index.php/the-national-flag"
                        className="text-blue-600 hover:underline"
                      >
                        Link
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Additional Resources</h4>
                  <ul className="list-disc pl-6 space-y-1 mb-4">
                    <li>
                      "I am Special because!" Educational Cartoons:{" "}
                      <a href="https://www.youtube.com/watch?v=dAmABKdj51w" className="text-blue-600 hover:underline">
                        Link
                      </a>
                    </li>
                    <li>
                      Nursery Rhymes I am Special Songs:{" "}
                      <a href="https://www.youtube.com/watch?v=jc0m7bxZ0QA" className="text-blue-600 hover:underline">
                        Link
                      </a>
                    </li>
                    <li>
                      How to make Kids Hand Printed T-Shirt Design:{" "}
                      <a href="https://www.youtube.com/watch?v=oKZPGnngU3c" className="text-blue-600 hover:underline">
                        Link
                      </a>
                    </li>
                    <li>
                      Live worksheets:{" "}
                      <a href="https://www.liveworksheets.com" className="text-blue-600 hover:underline">
                        Link
                      </a>
                    </li>
                    <li>
                      "My Two Grandads" story:{" "}
                      <a href="https://www.youtube.com/watch?v=GsTG_iutfEs" className="text-blue-600 hover:underline">
                        Link
                      </a>
                    </li>
                    <li>"How I became a Ducana" by Mrs. Avelyn Gittens Theobalds (2020)</li>
                    <li>
                      "St. Vincent and the Grenadines National Symbols" by Khaleil McInnis and Damian Ballantyne (2020)
                    </li>
                    <li>
                      "Faces of St. Vincent and the Grenadines" by Anna Warrican, Pearlina Carrington and Gaylene
                      Wickham (2020)
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
