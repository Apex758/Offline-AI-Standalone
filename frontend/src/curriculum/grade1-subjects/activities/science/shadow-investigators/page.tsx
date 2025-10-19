import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Sun, ListChecks, Users, RotateCcw, CalendarDays } from "lucide-react"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

export default function ShadowInvestigatorsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-yellow-100 to-amber-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-amber-600">
            Shadow Investigators
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            A hands-on physical science exploration where students investigate how shadows are formed, how they change,
            and what affects their size and shape.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-yellow-600" />
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Shadow Investigators engages students in exploring the fascinating world of light and shadows through
                hands-on experimentation. Students discover how shadows are created when light is blocked by objects,
                investigate how shadows change throughout the day, and experiment with ways to alter shadow size and
                shape. This inquiry-based activity develops understanding of light behavior while encouraging scientific
                thinking and observation skills.
              </p>

              <div className="relative w-full h-64 mb-6 rounded-md overflow-hidden">
                <img src="/children-playing-with-shadows-and-flashlights-crea.png" alt="Shadow Investigators Activity" className="w-full h-full object-cover" />
              </div>

              <h3 className="text-lg font-semibold mb-2">Learning Outcomes</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Understand how shadows are formed when light is blocked</li>
                <li>Observe how shadows change throughout the day</li>
                <li>Investigate factors that affect shadow size and shape</li>
                <li>Predict and test shadow changes</li>
                <li>Develop vocabulary related to light and shadows</li>
                <li>Practice scientific observation and recording skills</li>
                <li>Connect shadow phenomena to everyday experiences</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Curriculum Connections</h3>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>Physical Science:</strong> Light and shadows
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Properties of light</li>
                  <li>How shadows are formed</li>
                  <li>Factors affecting shadow characteristics</li>
                </ul>
              </div>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>Scientific Inquiry:</strong> Prediction and experimentation
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Making predictions about natural phenomena</li>
                  <li>Testing ideas through experimentation</li>
                  <li>Observing and recording changes over time</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-yellow-600" />
                Implementation Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-yellow-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      1
                    </span>
                    Introduction and Shadow Hunt (15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Begin by asking students what they know about shadows</li>
                    <li>Take a shadow walk around the classroom or outside</li>
                    <li>Have students find and point out different shadows</li>
                    <li>Discuss when and where they see shadows in daily life</li>
                    <li>Introduce key vocabulary: shadow, light, block, dark</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-yellow-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      2
                    </span>
                    Shadow Creation Exploration (20 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Provide flashlights and various objects for each group</li>
                    <li>Students experiment with creating shadows on white paper</li>
                    <li>Try different objects: blocks, toys, hands, pencils</li>
                    <li>Observe what happens when light shines on objects</li>
                    <li>Discuss: "What do you need to make a shadow?"</li>
                    <li>Record observations through drawings</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-yellow-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      3
                    </span>
                    Shadow Size Investigation (15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Students predict: "How can we make shadows bigger or smaller?"</li>
                    <li>Test predictions by moving flashlight closer and farther</li>
                    <li>Move objects closer to and farther from the light</li>
                    <li>Trace shadow outlines to compare sizes</li>
                    <li>Discuss findings: What makes shadows change size?</li>
                    <li>Record discoveries in science journals</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-yellow-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      4
                    </span>
                    Shadow Shape Experiments (15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Explore how shadow shapes change with object position</li>
                    <li>Rotate objects to see different shadow shapes</li>
                    <li>Use shadow puppet templates for creative exploration</li>
                    <li>Try making hand shadows on the wall</li>
                    <li>Discuss: "Why do shadows have different shapes?"</li>
                    <li>Create shadow art by tracing interesting shapes</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-yellow-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      5
                    </span>
                    Outdoor Shadow Tracking (Optional - 20 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>If possible, go outside on a sunny day</li>
                    <li>Have students stand in the same spot and trace their shadows</li>
                    <li>Return later in the day to trace shadows again</li>
                    <li>Compare morning and afternoon shadow positions</li>
                    <li>Discuss why shadows move throughout the day</li>
                    <li>Connect to the sun's movement across the sky</li>
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
                <RotateCcw className="h-5 w-5 text-yellow-600" />
                Activity Variations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                  <h3 className="text-md font-semibold mb-1 text-yellow-700">Shadow Theater</h3>
                  <p className="text-sm">
                    Create a shadow puppet theater where students tell stories using shadow puppets and explore
                    narrative through shadows.
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                  <h3 className="text-md font-semibold mb-1 text-blue-700">Shadow Art Gallery</h3>
                  <p className="text-sm">
                    Set up stations where students create shadow art by arranging objects and tracing their shadows.
                  </p>
                </div>

                <div className="bg-purple-50 p-3 rounded-md border border-purple-200">
                  <h3 className="text-md font-semibold mb-1 text-purple-700">Shadow Measurement</h3>
                  <p className="text-sm">
                    Use non-standard units to measure shadow lengths and compare shadows of different objects.
                  </p>
                </div>

                <div className="bg-green-50 p-3 rounded-md border border-green-200">
                  <h3 className="text-md font-semibold mb-1 text-green-700">Multiple Light Sources</h3>
                  <p className="text-sm">
                    Experiment with multiple flashlights to create overlapping shadows and explore how multiple light
                    sources affect shadows.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-yellow-600" />
                Differentiation Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-yellow-700">For Advanced Learners</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Investigate shadows created by transparent and translucent materials</li>
                    <li>Explore how colored lights affect shadow appearance</li>
                    <li>Research sundials and how they use shadows to tell time</li>
                    <li>Create detailed diagrams showing light, object, and shadow relationships</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-yellow-700">For Students Needing Support</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Start with large, simple objects that create clear shadows</li>
                    <li>Focus on basic concept: light + object = shadow</li>
                    <li>Use guided questioning to help make observations</li>
                    <li>Work with a partner for support and collaboration</li>
                    <li>Provide sentence starters for describing observations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-yellow-700">Language Support</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Provide vocabulary cards with pictures and words</li>
                    <li>Use gestures and demonstrations for shadow concepts</li>
                    <li>Allow drawing to show understanding instead of writing</li>
                    <li>Connect to shadow games from students' cultures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-yellow-600" />
                Assessment Rubric
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-yellow-700">Shadow Understanding</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      <strong>Excellent:</strong> Explains how shadows form and what affects them
                    </li>
                    <li>
                      <strong>Good:</strong> Understands basic shadow formation
                    </li>
                    <li>
                      <strong>Developing:</strong> Shows some understanding with support
                    </li>
                    <li>
                      <strong>Beginning:</strong> Needs significant guidance
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-yellow-700">Prediction and Testing</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      <strong>Excellent:</strong> Makes logical predictions and tests them systematically
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
                  <h3 className="text-md font-semibold mb-1 text-yellow-700">Scientific Vocabulary</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      <strong>Excellent:</strong> Uses shadow vocabulary correctly and confidently
                    </li>
                    <li>
                      <strong>Good:</strong> Uses some shadow terms appropriately
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

      <div className="bg-yellow-50 p-6 rounded-xl shadow-md border border-yellow-200 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-yellow-800">Materials and Safety</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-yellow-700">Essential Materials</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Flashlights (one per small group)</li>
              <li>Various objects for creating shadows</li>
              <li>White paper or wall space for shadow projection</li>
              <li>Chalk for outdoor shadow tracing</li>
              <li>Shadow puppet templates (optional)</li>
              <li>Science journals and pencils</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-yellow-700">Safety and Setup</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ensure flashlights have working batteries</li>
              <li>Supervise flashlight use to prevent shining in eyes</li>
              <li>Create clear workspace boundaries for each group</li>
              <li>Have extra batteries available</li>
              <li>Darken room partially for better shadow visibility</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Link to="/curriculum/grade1-subjects/activities/science/weather-watchers">
          <Button variant="outline" className="mr-4 bg-transparent">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous: Weather Watchers
          </Button>
        </Link>
        <Link to="/curriculum/grade1-subjects/activities/science/animal-adaptations">
          <Button className="bg-yellow-600 hover:bg-yellow-700">Next Activity: Animal Adaptations</Button>
        </Link>
      </div>
    </div>
  )
}
