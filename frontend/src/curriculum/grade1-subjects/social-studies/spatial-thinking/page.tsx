import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SpatialThinking() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Spatial Thinking</h1>
        <Button asChild variant="outline">
          <Link href="/curriculum/grade1-subjects/social-studies">Back to Grade 1 Social Studies</Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold mb-2">Essential Learning Outcome</h2>
          <p className="text-lg">
            To understand how we shape the local environment and the local environment shapes who we are and how we live
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
                This strand introduces students to experiences that help them begin to understand basic aspects of
                location and other elements of their local environment. Students will explore how they interact with and
                describe their environment, developing an understanding of neighborhoods, relative location, cardinal
                directions, and environmental safety.
              </p>

              <h3 className="text-xl font-semibold mb-2">Focusing Questions</h3>
              <ol className="list-decimal pl-6 space-y-2 mb-4">
                <li>What does it mean to live in a neighbourhood?</li>
                <li>How would you describe where you live?</li>
                <li>How can we give directions to a place if we do not have the exact/absolute location?</li>
                <li>How does where we live impact the activities that our families engage in?</li>
                <li>What is cardinal direction?</li>
                <li>How is cardinal direction useful in our lives?</li>
                <li>
                  How do we shape the local environment and how does the local environment shape who we are and how we
                  live?
                </li>
                <li>What are the natural hazards or risks to my family because of where I live?</li>
                <li>How can my family stay safe in my neighborhood?</li>
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
                  <h4 className="font-medium">Identify where your family lives</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will be able to state their address and describe their home and immediate surroundings.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">
                    Understand basic terms for relative location in your local environment
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will understand concepts such as near and far, next to, opposite, in front, and behind to
                    describe locations.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">Name and illustrate the four cardinal directions</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will identify and label the four cardinal directions (North, South, East, West) and
                    understand their use in navigation.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">
                    List the activities that you and your family are able to engage in because of where you live
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will identify various activities that take place in their neighborhood and how location
                    influences these activities.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">
                    Identify natural hazards which may pose a threat to your family because of where you live
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will recognize potential natural hazards such as hurricanes, tsunamis, volcanic eruptions,
                    and earthquakes that could affect their area.
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
                  <h4 className="font-medium">Locate your home in relation to your closest neighbours</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will draw pictures of their home and neighbors' homes, identifying their relative
                    positions.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">
                    Distinguish between and show near and far in your immediate environment
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will identify objects, people, and places that are near or far in relation to each other
                    and create maps showing these relationships.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">Use relative location to describe places in their neighbourhood</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will use directional terms to describe the location of places in their neighborhood
                    relative to other landmarks.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">
                    Describe the location of your home using cardinal directions in relation to natural and built
                    features
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will use cardinal directions to describe the location of their home and other important
                    places in their community.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">
                    Classify family activities as having a positive or negative impact on the neighbourhood
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will evaluate various activities and determine whether they have a positive or negative
                    effect on their community.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">Demonstrate how to follow evacuation procedures in your school</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will practice emergency evacuation procedures and create maps showing evacuation routes.
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
                  <h4 className="font-medium">Appreciate that your family lives in a neighbourhood</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will recognize the importance of their neighborhood and the people who live there.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">Recognize the importance of being able to describe relative location</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will value the ability to use relative location terms for finding things and navigating
                    their environment.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">
                    Appreciate that relative location can influence activities that families engage in
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will understand how proximity to certain features affects the activities available to
                    families.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">
                    Appreciate the value of directions for finding your way from one location to another
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will value the practical application of cardinal directions in navigation and wayfinding.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">
                    Recognize that where we live influences how our families live and that the things we do have an
                    impact on our neighbourhood
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will develop awareness of the reciprocal relationship between people and their environment.
                  </p>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium">Respect the dangers posed by natural disasters</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Students will develop an appropriate respect for natural hazards and the importance of safety
                    procedures.
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
                    <li>
                      Introduction to neighborhoods:{" "}
                      <a href="https://www.youtube.com/watch?v=cNYQUl3vxv0" className="text-blue-600 hover:underline">
                        Link
                      </a>
                    </li>
                    <li>
                      "Who are the people in your neighbourhood?" song:{" "}
                      <a href="https://www.youtube.com/watch?v=jwDq32MtOQU" className="text-blue-600 hover:underline">
                        Link
                      </a>
                    </li>
                    <li>
                      Video on relative location:{" "}
                      <a href="https://www.youtube.com/watch?v=RcPP15JaW1w8" className="text-blue-600 hover:underline">
                        Link
                      </a>
                    </li>
                    <li>NATURAL DISASTERS for kids - EARTHQUAKE, VOLCANO, TSUNAMI, HURRICANE, TORNADO, WILDFIRE</li>
                    <li>Natural Disasters and Our Caribbean Environment</li>
                    <li>Disaster Dodgers: Introduction to Emergency Planning</li>
                    <li>Tips to prepare your home and family for natural disasters</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Activities</h4>
                  <ul className="list-disc pl-6 space-y-1 mb-4">
                    <li>Neighborhood mapping activities</li>
                    <li>Cardinal direction games: "North-South-East-West! Choose the one you love the best"</li>
                    <li>Creating simple compass roses</li>
                    <li>Nature walks to observe the local environment</li>
                    <li>Role-playing activities related to neighborhood interactions</li>
                    <li>Emergency evacuation drills and route mapping</li>
                    <li>Creating cause-and-effect charts for environmental impacts</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Materials</h4>
                  <ul className="list-disc pl-6 space-y-1 mb-4">
                    <li>Maps of the local area</li>
                    <li>Pictures of different neighborhoods</li>
                    <li>Compass or compass rose templates</li>
                    <li>Art supplies for creating maps and models</li>
                    <li>Pictures of natural hazards</li>
                    <li>Emergency evacuation route maps</li>
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
