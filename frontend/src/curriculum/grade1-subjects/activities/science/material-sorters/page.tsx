import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Boxes, ListChecks, Users, RotateCcw, CalendarDays } from "lucide-react"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

export default function MaterialSortersPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-orange-100 to-red-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
            Material Sorters
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            A hands-on physical science exploration where students investigate and classify materials based on their
            observable properties and characteristics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Boxes className="h-5 w-5 text-orange-600" />
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Material Sorters engages students in scientific investigation as they explore the properties of
                different materials through hands-on sorting and testing activities. Students develop observation skills
                while learning to classify objects based on characteristics such as texture, flexibility, transparency,
                and buoyancy. This inquiry-based approach builds foundational understanding of material properties and
                scientific classification.
              </p>

              <div className="relative w-full h-64 mb-6 rounded-md overflow-hidden">
                <img src="/children-sorting-various-materials-and-objects-int.png" alt="Material Sorters Activity" className="w-full h-full object-cover" />
              </div>

              <h3 className="text-lg font-semibold mb-2">Learning Outcomes</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Identify and describe properties of different materials</li>
                <li>Sort and classify objects based on observable characteristics</li>
                <li>Understand concepts of texture, flexibility, and transparency</li>
                <li>Investigate which materials sink or float</li>
                <li>Develop scientific vocabulary related to material properties</li>
                <li>Practice making predictions and testing hypotheses</li>
                <li>Record observations using simple charts and drawings</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Curriculum Connections</h3>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>Physical Science:</strong> Properties of materials
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observable properties of objects and materials</li>
                  <li>Sorting and classifying based on properties</li>
                  <li>Understanding material characteristics</li>
                </ul>
              </div>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>Scientific Inquiry:</strong> Investigation and classification
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Making observations and predictions</li>
                  <li>Testing ideas through experimentation</li>
                  <li>Recording and communicating findings</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-orange-600" />
                Implementation Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-orange-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      1
                    </span>
                    Material Collection and Setup (10 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Gather diverse collection of materials and objects</li>
                    <li>Set up sorting stations with hoops or containers</li>
                    <li>Prepare property cards with pictures and words</li>
                    <li>Fill water tubs for sink/float testing</li>
                    <li>Distribute recording sheets and pencils</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-orange-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      2
                    </span>
                    Introduction and Exploration (15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Show students the collection of materials</li>
                    <li>Introduce property vocabulary: rough, smooth, hard, soft, flexible, rigid</li>
                    <li>Demonstrate safe ways to test materials</li>
                    <li>Allow free exploration time to touch and examine objects</li>
                    <li>Encourage students to describe what they feel and observe</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-orange-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      3
                    </span>
                    Texture and Flexibility Sorting (15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Students work in small groups to sort by texture</li>
                    <li>Create categories: rough/smooth, hard/soft</li>
                    <li>Test flexibility by gently bending materials</li>
                    <li>Sort into flexible and rigid categories</li>
                    <li>Discuss findings and compare group results</li>
                    <li>Record observations on data sheets</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-orange-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      4
                    </span>
                    Sink or Float Investigation (15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Students predict which materials will sink or float</li>
                    <li>Test predictions by placing objects in water</li>
                    <li>Sort materials into "sink" and "float" categories</li>
                    <li>Discuss why some materials float while others sink</li>
                    <li>Look for patterns in the results</li>
                    <li>Record findings on observation charts</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-orange-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      5
                    </span>
                    Sharing and Reflection (10 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Groups share their sorting results with the class</li>
                    <li>Compare different ways materials were classified</li>
                    <li>Discuss which properties were most useful for sorting</li>
                    <li>Connect findings to everyday objects and materials</li>
                    <li>Clean up materials and wash hands</li>
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
                <RotateCcw className="h-5 w-5 text-orange-600" />
                Activity Variations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-orange-50 p-3 rounded-md border border-orange-200">
                  <h3 className="text-md font-semibold mb-1 text-orange-700">Mystery Box Sorting</h3>
                  <p className="text-sm">
                    Students reach into boxes to identify materials by touch alone, then sort based on what they felt.
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                  <h3 className="text-md font-semibold mb-1 text-blue-700">Transparency Test</h3>
                  <p className="text-sm">
                    Add transparency testing by shining flashlights through materials to sort transparent, translucent,
                    and opaque.
                  </p>
                </div>

                <div className="bg-purple-50 p-3 rounded-md border border-purple-200">
                  <h3 className="text-md font-semibold mb-1 text-purple-700">Magnetic Properties</h3>
                  <p className="text-sm">
                    Use magnets to test which materials are magnetic and sort into magnetic and non-magnetic categories.
                  </p>
                </div>

                <div className="bg-green-50 p-3 rounded-md border border-green-200">
                  <h3 className="text-md font-semibold mb-1 text-green-700">Material Hunt</h3>
                  <p className="text-sm">
                    Send students on a classroom or school hunt to find materials with specific properties.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                Differentiation Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-orange-700">For Advanced Learners</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Create more complex sorting criteria with multiple properties</li>
                    <li>Research why materials have different properties</li>
                    <li>Design their own sorting challenges for classmates</li>
                    <li>Connect material properties to their uses in everyday life</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-orange-700">For Students Needing Support</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Start with fewer materials and simpler categories</li>
                    <li>Use very distinct materials with obvious differences</li>
                    <li>Provide picture cards showing property examples</li>
                    <li>Work with a partner or adult helper</li>
                    <li>Focus on one property at a time</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-orange-700">Language Support</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Provide vocabulary cards with pictures and words</li>
                    <li>Use gestures and demonstrations for property words</li>
                    <li>Allow sorting without requiring written descriptions</li>
                    <li>Encourage use of home language to describe properties</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-orange-600" />
                Assessment Rubric
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-orange-700">Property Identification</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      <strong>Excellent:</strong> Identifies multiple properties accurately
                    </li>
                    <li>
                      <strong>Good:</strong> Identifies most properties with some help
                    </li>
                    <li>
                      <strong>Developing:</strong> Identifies basic properties with support
                    </li>
                    <li>
                      <strong>Beginning:</strong> Needs significant guidance
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-orange-700">Sorting Accuracy</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      <strong>Excellent:</strong> Sorts materials correctly and consistently
                    </li>
                    <li>
                      <strong>Good:</strong> Sorts most materials appropriately
                    </li>
                    <li>
                      <strong>Developing:</strong> Sorts with some errors or inconsistencies
                    </li>
                    <li>
                      <strong>Beginning:</strong> Sorting needs significant support
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-orange-700">Scientific Vocabulary</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      <strong>Excellent:</strong> Uses property words correctly and confidently
                    </li>
                    <li>
                      <strong>Good:</strong> Uses some property words appropriately
                    </li>
                    <li>
                      <strong>Developing:</strong> Uses basic property words with prompts
                    </li>
                    <li>
                      <strong>Beginning:</strong> Limited use of scientific vocabulary
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-orange-50 p-6 rounded-xl shadow-md border border-orange-200 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-orange-800">Materials and Setup</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-orange-700">Essential Materials</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Variety of materials: fabric, metal, plastic, wood, paper, rubber</li>
              <li>Sorting hoops or containers</li>
              <li>Property cards with pictures and words</li>
              <li>Water tubs for sink/float testing</li>
              <li>Towels for cleanup</li>
              <li>Recording sheets and pencils</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-orange-700">Setup Tips</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Choose materials with distinct, obvious properties</li>
              <li>Ensure all materials are safe for student handling</li>
              <li>Have towels ready for water activities</li>
              <li>Create clear workspace boundaries for each group</li>
              <li>Prepare extra materials in case of loss or damage</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Link to="/curriculum/grade1-subjects/activities/science/plant-detectives">
          <Button variant="outline" className="mr-4 bg-transparent">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous: Plant Detectives
          </Button>
        </Link>
        <Link to="/curriculum/grade1-subjects/activities/science/weather-watchers">
          <Button className="bg-orange-600 hover:bg-orange-700">Next Activity: Weather Watchers</Button>
        </Link>
      </div>
    </div>
  )
}
