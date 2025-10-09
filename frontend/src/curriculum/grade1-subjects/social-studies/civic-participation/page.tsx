import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CivicParticipation() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Civic Participation</h1>
        <Button asChild variant="outline">
          <Link href="/curriculum/grade1-subjects/social-studies">Back to Grade 1 Social Studies</Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold mb-2">Essential Learning Outcome</h2>
          <p className="text-lg">
            To understand that we have roles and responsibilities in our families, school, and community
          </p>
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
                This strand introduces children to the broad notion of civic participation and how their actions at home
                and school are helpful forms of responsibility. Students will explore roles and responsibilities in
                their families, schools, and communities, developing an understanding of leadership, cooperation, and
                respect.
              </p>

              <h3 className="text-xl font-semibold mb-2">Focusing Questions</h3>
              <ol className="list-decimal pl-6 space-y-2 mb-4">
                <li>What are our roles and responsibilities in our family, school and community?</li>
                <li>What can we do to keep our class clean?</li>
                <li>Why should we keep our environment clean and tidy?</li>
                <li>Where should we put our garbage?</li>
                <li>How do you feel when your environment is untidy?</li>
                <li>Who are the people you can turn to when you need help?</li>
                <li>How do you know when you feel unsafe?</li>
                <li>What can you do when you feel unsafe?</li>
                <li>Who is a leader?</li>
                <li>What do leaders do?</li>
                <li>Why do we need leaders?</li>
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
                    Understand the importance of keeping their home, school, and community tidy and clean
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will identify ways to maintain cleanliness in different environments and understand why
                    this is important.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">
                    Recognize that when everyone in our family shares and helps one another we all benefit
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will understand the concept of sharing and helping within a family unit and how this
                    contributes to collective well-being.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">Identify persons to turn to when they need help</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will recognize trusted individuals in their home, school, and community who can provide
                    assistance when needed.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">Understand what a leader is</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will define leadership and identify leaders in various contexts including home, school,
                    church, community, and nation.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">
                    Recognize the appropriate manners and behaviors towards adults in positions of authority
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will identify respectful ways to interact with adults, particularly those in positions of
                    authority.
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
                  <h4 className="font-medium">Practice putting garbage and litter in trash cans at school and home</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will demonstrate proper waste disposal habits and participate in clean-up campaigns.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">
                    List the ways that our siblings, parents, grandparents, and other relatives help us and vice versa
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will identify and describe various ways family members support each other through sharing
                    and helping.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">Communicate ways to express when they feel unsafe</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will demonstrate effective communication strategies to express feelings of discomfort or
                    danger.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">Identify leaders in their home, school, church, community, and nation</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will recognize various leaders and understand their roles in different contexts.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">Practice using proper manners when interacting with adults</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will demonstrate appropriate manners and behaviors when interacting with adults, including
                    saying "please," "thank you," and showing respect.
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
                  <h4 className="font-medium">
                    Observe and appreciate places in their environment that are kept clean and tidy
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will develop an appreciation for clean and tidy environments and recognize their role in
                    maintaining them.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">
                    Appreciate that helping other family members is important for our collective wellbeing
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will value the importance of sharing and helping within the family unit.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">Appreciate feeling safe in their environment</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will recognize the importance of safety and develop strategies to maintain personal safety.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">Appreciate that leaders are an important part of our well-being</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will value the role of leaders in solving problems and supporting community well-being.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">Respect persons in authority</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will demonstrate respect for persons in authority through appropriate behaviors and
                    manners.
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
                  <h4 className="font-medium">Videos</h4>
                  <ul className="list-disc pl-6 space-y-1 mb-4">
                    <li>Cleanliness At Home | Now You Know Book C | Periwinkle</li>
                    <li>Cleanliness At School | Now You Know Book C | Periwinkle</li>
                    <li>CLEANLINESS IN SCHOOL | KIDS KNOWLEDGE | ENGLISH</li>
                    <li>Storyline Online - The Rainbow Fish</li>
                    <li>
                      Song for Teaching children the importance of Sharing:{" "}
                      <a href="https://youtu.be/gKv9KniC4uk" className="text-blue-600 hover:underline">
                        Link
                      </a>
                    </li>
                    <li>Protect Yourself Rules - Bullying</li>
                    <li>The Manners Song (tune of Twinkle Twinkle Little Star)</li>
                    <li>
                      Showing Respect video:{" "}
                      <a href="https://youtu.be/GOzrAK4gOSo" className="text-blue-600 hover:underline">
                        Link
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Activities</h4>
                  <ul className="list-disc pl-6 space-y-1 mb-4">
                    <li>Role Play Activities: Clean-up campaigns, family sharing scenarios, safety situations</li>
                    <li>Four Corners Activity: For exploring celebrations and preferences</li>
                    <li>Think-Pair-Share: For discussing family helpers and safety strategies</li>
                    <li>Games: "Pass the Ball" and "Matching Game" for learning about leaders and celebrations</li>
                    <li>Drawing and Art Activities: Creating posters, mobiles with manners words</li>
                    <li>Journaling: Writing or drawing about feelings related to safety and respect</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Worksheets and Assessments</h4>
                  <ul className="list-disc pl-6 space-y-1 mb-4">
                    <li>Good Manners Checklist</li>
                    <li>Showing Respect Scenarios</li>
                    <li>Safety Situation Cards</li>
                    <li>Leadership Qualities Graphic Organizer</li>
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
