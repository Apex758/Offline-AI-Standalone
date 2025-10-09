import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Grade1SocialStudies() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Grade 1 Social Studies Curriculum</h1>
        <Button asChild variant="outline">
          <Link href="/curriculum/grade1-subjects">Back to Grade 1 Curriculum</Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardContent className="pt-6">
            <p className="mb-4">
              The Grade 1 Social Studies curriculum introduces students to fundamental concepts about their identity,
              community, environment, and economic awareness. Through engaging activities and explorations, students
              develop an understanding of their place in the world and how they can contribute positively to their
              communities.
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="strands">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="strands">Curriculum Strands</TabsTrigger>
            <TabsTrigger value="approach">Teaching Approach</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="strands" className="space-y-4 pt-4">
            <h2 className="text-2xl font-semibold mb-4">Social Studies Strands</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">Historical and Cultural Thinking</h3>
                  <p className="mb-4">
                    Students explore how celebrations help build pride in their identity, learning about cultural
                    heritage, national symbols, and traditions.
                  </p>
                  <Button asChild>
                    <Link href="/curriculum/grade1-subjects/social-studies/historical-cultural-thinking">
                      View Strand
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">Civic Participation</h3>
                  <p className="mb-4">
                    Students learn about roles and responsibilities in families, schools, and communities, developing an
                    understanding of leadership, cooperation, and respect.
                  </p>
                  <Button asChild>
                    <Link href="/curriculum/grade1-subjects/social-studies/civic-participation">View Strand</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">Spatial Thinking</h3>
                  <p className="mb-4">
                    Students explore how we shape the local environment and how the local environment shapes who we are
                    and how we live, learning about neighborhoods and directions.
                  </p>
                  <Button asChild>
                    <Link href="/curriculum/grade1-subjects/social-studies/spatial-thinking">View Strand</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">Economic Decision Making</h3>
                  <p className="mb-4">
                    Students develop awareness that we all have things we need and things we want, learning about goods,
                    services, resources, and transportation.
                  </p>
                  <Button asChild>
                    <Link href="/curriculum/grade1-subjects/social-studies/economic-decision-making">View Strand</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="approach" className="space-y-4 pt-4">
            <h2 className="text-2xl font-semibold mb-4">Teaching Approach</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  The Grade 1 Social Studies curriculum employs a student-centered approach that encourages active
                  learning through:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Inquiry-based learning that promotes questioning and exploration</li>
                  <li>Hands-on activities that connect concepts to real-life experiences</li>
                  <li>Collaborative projects that develop social skills and teamwork</li>
                  <li>
                    Integration with other subjects including Language Arts, Mathematics, Science, and Creative Arts
                  </li>
                  <li>Culturally responsive teaching that values diverse perspectives and experiences</li>
                </ul>
                <p>
                  Assessment is ongoing and includes observations, conversations, and student products that demonstrate
                  understanding of key concepts and development of essential skills.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4 pt-4">
            <h2 className="text-2xl font-semibold mb-4">Teacher Resources</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  The following resources support the implementation of the Grade 1 Social Studies curriculum:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Picture books and stories related to cultural celebrations, community helpers, and environmental
                    awareness
                  </li>
                  <li>Maps, globes, and visual aids for spatial thinking activities</li>
                  <li>Videos and multimedia resources that showcase diverse communities and environments</li>
                  <li>Local community resources including museums, historical sites, and cultural centers</li>
                  <li>Guest speakers from the community who can share their expertise and experiences</li>
                  <li>Manipulatives and props for role-playing activities and simulations</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div className="mt-8 flex justify-center">
        <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
          <Link href="/curriculum/grade1-subjects/activities/social-studies">View Social Studies Activities</Link>
        </Button>
      </div>
    </div>
  )
}
