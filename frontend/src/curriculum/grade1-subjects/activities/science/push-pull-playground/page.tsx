import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Zap, ListChecks, Users, RotateCcw, CalendarDays } from "lucide-react"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

export default function PushPullPlaygroundPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-red-100 to-pink-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-600">
            Push and Pull Playground
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            A hands-on physical science exploration where students investigate forces by experimenting with how objects
            move when pushed or pulled in different ways.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-red-600" />
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Push and Pull Playground engages students in exploring the fundamental concept of forces through
                hands-on experimentation with everyday objects. Students investigate how different strengths and
                directions of pushes and pulls affect object movement, explore how surface materials change motion, and
                discover that forces are all around us in daily life. This playful yet scientific approach builds
                foundational understanding of physics concepts while developing observation and prediction skills.
              </p>

              <div className="relative w-full h-64 mb-6 rounded-md overflow-hidden">
                <img src="/children-playing-with-toy-cars-on-ramps-and-differ.png" alt="Push and Pull Playground Activity" className="w-full h-full object-cover" />
              </div>

              <h3 className="text-lg font-semibold mb-2">Learning Outcomes</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Understand that pushes and pulls are forces that make objects move</li>
                <li>Investigate how the strength of a force affects object movement</li>
                <li>Explore how different surfaces affect how objects move</li>
                <li>Predict and test how objects will move when forces are applied</li>
                <li>Recognize forces in everyday activities and play</li>
                <li>Develop vocabulary related to forces and motion</li>
                <li>Practice scientific observation and recording skills</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Curriculum Connections</h3>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>Physical Science:</strong> Forces and motion
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Understanding pushes and pulls as forces</li>
                  <li>How forces affect object movement</li>
                  <li>Factors that influence motion</li>
                </ul>
              </div>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>Scientific Inquiry:</strong> Experimentation and prediction
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Making predictions about object movement</li>
                  <li>Testing ideas through hands-on experimentation</li>
                  <li>Observing and recording results</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-red-600" />
                Implementation Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-red-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      1
                    </span>
                    Introduction and Force Discovery (15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Begin by asking students to show different ways to move objects</li>
                    <li>Demonstrate pushing and pulling with classroom objects</li>
                    <li>Introduce vocabulary: push, pull, force, move, stop</li>
                    <li>Have students identify pushes and pulls in their daily activities</li>
                    <li>Discuss: "What happens when you push or pull something?"</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-red-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      2
                    </span>
                    Toy Car Investigations (20 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Provide toy cars and flat surfaces for each group</li>
                    <li>Students experiment with gentle and strong pushes</li>
                    <li>Observe: "What happens with a gentle push vs. a strong push?"</li>
                    <li>Try pulling cars with string - compare to pushing</li>
                    <li>Record observations: How far did the car travel?</li>
                    <li>Discuss findings about force strength and distance</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-red-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      3
                    </span>
                    Surface Testing Experiments (20 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Set up stations with different surface materials</li>
                    <li>Test how cars move on carpet, wood, sandpaper, and smooth surfaces</li>
                    <li>Students predict: "Which surface will the car travel farthest on?"</li>
                    <li>Test predictions using the same push strength</li>
                    <li>Compare results and discuss why surfaces make a difference</li>
                    <li>Introduce concept of friction in simple terms</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-red-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      4
                    </span>
                    Ramp and Ball Exploration (15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Set up ramps at different angles</li>
                    <li>Roll balls of different sizes down the ramps</li>
                    <li>Observe how ramp steepness affects ball speed</li>
                    <li>Try different ball sizes and weights</li>
                    <li>Discuss: "What force makes the ball roll down?"</li>
                    <li>Connect to playground slides and rolling objects</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-red-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      5
                    </span>
                    Force Hunt and Reflection (10 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Students look around the classroom for examples of pushes and pulls</li>
                    <li>Share findings: doors, drawers, books, pencils</li>
                    <li>Act out different forces they use during the school day</li>
                    <li>Record favorite discoveries in science journals</li>
                    <li>Discuss how forces help us in daily life</li>
                    <li>Plan to notice forces at home and report back</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-red-600" />
                Activity Variations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-red-50 p-3 rounded-md border border-red-200">
                  <h3 className="text-md font-semibold mb-1 text-red-700">Force Olympics</h3>
                  <p className="text-sm">
                    Create stations where students compete in force challenges: farthest push, strongest pull, most
                    accurate aim.
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                  <h3 className="text-md font-semibold mb-1 text-blue-700">Magnetic Forces</h3>
                  <p className="text-sm">
                    Explore magnetic pushes and pulls using magnets and various objects to test magnetic attraction and
                    repulsion.
                  </p>
                </div>

                <div className="bg-purple-50 p-3 rounded-md border border-purple-200">
                  <h3 className="text-md font-semibold mb-1 text-purple-700">Force Art</h3>
                  <p className="text-sm">
                    Create art using forces - paint by rolling balls through paint, or make prints by pushing objects
                    into clay.
                  </p>
                </div>

                <div className="bg-green-50 p-3 rounded-md border border-green-200">
                  <h3 className="text-md font-semibold mb-1 text-green-700">Playground Forces</h3>
                  <p className="text-sm">
                    Take the investigation outside to explore forces on playground equipment: swings, slides, seesaws.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-red-600" />
                Differentiation Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-red-700">For Advanced Learners</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Measure distances traveled and create simple graphs</li>
                    <li>Explore how object weight affects force needed to move it</li>
                    <li>Investigate forces in simple machines like levers and pulleys</li>
                    <li>Design experiments to test specific force questions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-red-700">For Students Needing Support</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Focus on basic push vs. pull identification</li>
                    <li>Use larger, easier-to-handle objects</li>
                    <li>Provide guided questions for observations</li>
                    <li>Work with a partner for support and collaboration</li>
                    <li>Use picture cards to show force concepts</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-red-700">Language Support</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Provide force vocabulary cards with pictures and actions</li>
                    <li>Use gestures and demonstrations for force words</li>
                    <li>Allow drawing to show understanding of forces</li>
                    <li>Connect to force words in students' home languages</li>
                    <li>Use simple sentence frames for describing observations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-red-600" />
                Assessment Rubric
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-red-700">Force Understanding</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      <strong>Excellent:</strong> Explains how pushes and pulls make objects move
                    </li>
                    <li>
                      <strong>Good:</strong> Identifies pushes and pulls in various situations
                    </li>
                    <li>
                      <strong>Developing:</strong> Recognizes basic force actions with support
                    </li>
                    <li>
                      <strong>Beginning:</strong> Needs significant guidance
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-red-700">Prediction and Testing</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      <strong>Excellent:</strong> Makes logical predictions and tests systematically
                    </li>
                    <li>
                      <strong>Good:</strong> Makes some predictions and tests with guidance
                    </li>
                    <li>
                      <strong>Developing:</strong> Makes basic predictions with support
                    </li>
                    <li>
                      <strong>Beginning:</strong> Needs help making and testing predictions
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-red-700">Scientific Vocabulary</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      <strong>Excellent:</strong> Uses force vocabulary correctly and confidently
                    </li>
                    <li>
                      <strong>Good:</strong> Uses some force terms appropriately
                    </li>
                    <li>
                      <strong>Developing:</strong> Uses basic vocabulary with prompts
                    </li>
                    <li>
                      <strong>Beginning:</strong> Limited use of scientific terms
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-red-50 p-6 rounded-xl shadow-md border border-red-200 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-red-800">Materials and Safety</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-red-700">Essential Materials</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Toy cars (various sizes)</li>
              <li>Balls of different sizes and weights</li>
              <li>Ramps (books, boards, or commercial ramps)</li>
              <li>Surface materials: carpet, wood, sandpaper, smooth plastic</li>
              <li>String for pulling experiments</li>
              <li>Recording sheets and pencils</li>
              <li>Optional: spring scales for measuring force</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-red-700">Safety and Setup</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ensure clear pathways for moving objects</li>
              <li>Supervise ramp activities to prevent falls</li>
              <li>Use soft balls to prevent injury</li>
              <li>Create boundaries for each group's workspace</li>
              <li>Have students sit while testing to avoid collisions</li>
              <li>Check that all materials are in good condition</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Link to="/curriculum/grade1-subjects/activities/science/animal-adaptations">
          <Button variant="outline" className="mr-4 bg-transparent">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous: Animal Adaptations
          </Button>
        </Link>
        <Link to="/curriculum/grade1-subjects/activities/science">
          <Button className="bg-red-600 hover:bg-red-700">Back to Science Activities</Button>
        </Link>
      </div>
    </div>
  )
}
