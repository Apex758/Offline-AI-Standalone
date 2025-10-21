import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Leaf, ListChecks, Users, RotateCcw, CalendarDays } from "lucide-react"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

export default function PlantDetectivesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
            Plant Detectives
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            A hands-on life science investigation where students explore plant parts and their functions through
            observation, dissection, and scientific documentation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Plant Detectives transforms students into scientific investigators as they explore the fascinating world
                of plants. Through hands-on observation and gentle dissection, students discover the different parts of
                plants and learn about their important functions. This inquiry-based activity develops scientific
                thinking skills while building foundational knowledge about plant biology and the natural world.
              </p>

              <div className="relative w-full h-64 mb-6 rounded-md overflow-hidden">
                <img src="./children-examining-plants-with-magnifying-glasses-.png" alt="Plant Detectives Activity" className="w-full h-full object-cover" />
              </div>

              <h3 className="text-lg font-semibold mb-2">Learning Outcomes</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Identify and name the basic parts of plants (roots, stem, leaves, flowers)</li>
                <li>Understand the function of each plant part</li>
                <li>Develop observation and investigation skills</li>
                <li>Practice scientific documentation through drawing and writing</li>
                <li>Use scientific tools appropriately (hand lenses, tweezers)</li>
                <li>Build vocabulary related to plant science</li>
                <li>Foster curiosity about the natural world</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Curriculum Connections</h3>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>Life Science:</strong> Living and non-living things
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Characteristics of living things</li>
                  <li>Basic needs of plants</li>
                  <li>Plant parts and their functions</li>
                </ul>
              </div>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>Scientific Inquiry:</strong> Observation and investigation
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Making observations using senses and tools</li>
                  <li>Recording observations through drawings and words</li>
                  <li>Asking questions about the natural world</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-green-600" />
                Implementation Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-green-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      1
                    </span>
                    Preparation (10 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Gather various plants and flowers (different sizes and types)</li>
                    <li>Set up investigation stations with hand lenses and tweezers</li>
                    <li>Prepare paper plates for plant dissection</li>
                    <li>Distribute observation journals or recording sheets</li>
                    <li>Review safety rules for handling plants and tools</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-green-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      2
                    </span>
                    Introduction and Prediction (10 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Show students the plants they will investigate</li>
                    <li>Ask: "What parts do you think we'll find inside these plants?"</li>
                    <li>Record predictions on chart paper</li>
                    <li>Introduce plant part vocabulary: roots, stem, leaves, flowers, seeds</li>
                    <li>Demonstrate proper use of hand lenses and tweezers</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-green-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      3
                    </span>
                    Plant Investigation (20-25 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Students work in pairs to examine whole plants first</li>
                    <li>Use hand lenses to observe details of leaves, stems, and flowers</li>
                    <li>Carefully separate plant parts using tweezers</li>
                    <li>Arrange parts on paper plates for closer examination</li>
                    <li>Look for seeds inside flowers or fruits</li>
                    <li>Draw observations in science journals</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-green-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      4
                    </span>
                    Documentation and Discussion (10-15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Students complete their observation drawings</li>
                    <li>Label plant parts in their journals</li>
                    <li>Write or dictate one sentence about each plant part</li>
                    <li>Share discoveries with the class</li>
                    <li>Compare findings to original predictions</li>
                    <li>Discuss what each plant part does for the plant</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-green-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      5
                    </span>
                    Wrap-up and Extension (5-10 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Review the function of each plant part</li>
                    <li>Connect plant parts to human body parts (roots like feet, stems like backbone)</li>
                    <li>Plan to observe plants in the school yard or at home</li>
                    <li>Clean up materials and wash hands</li>
                    <li>Display student drawings and observations</li>
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
                <RotateCcw className="h-5 w-5 text-green-600" />
                Activity Variations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 p-3 rounded-md border border-green-200">
                  <h3 className="text-md font-semibold mb-1 text-green-700">Outdoor Plant Hunt</h3>
                  <p className="text-sm">
                    Take the investigation outside to examine plants in their natural environment and compare different
                    species.
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                  <h3 className="text-md font-semibold mb-1 text-blue-700">Plant Part Sorting</h3>
                  <p className="text-sm">
                    Create sorting activities where students group different leaves, flowers, or seeds by
                    characteristics.
                  </p>
                </div>

                <div className="bg-purple-50 p-3 rounded-md border border-purple-200">
                  <h3 className="text-md font-semibold mb-1 text-purple-700">Plant Art Creation</h3>
                  <p className="text-sm">
                    Use collected plant parts to create nature art while discussing the function of each part used.
                  </p>
                </div>

                <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                  <h3 className="text-md font-semibold mb-1 text-amber-700">Seed Investigation</h3>
                  <p className="text-sm">
                    Focus specifically on seeds - examine different types, predict what plants they'll grow into.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Differentiation Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-green-700">For Advanced Learners</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Compare plants from different environments (desert, forest, water)</li>
                    <li>Research and draw the life cycle of a flowering plant</li>
                    <li>Create detailed scientific diagrams with measurements</li>
                    <li>Investigate how plant parts are adapted for their functions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-green-700">For Students Needing Support</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Start with larger, simpler plants with obvious parts</li>
                    <li>Provide pre-drawn plant outlines for labeling</li>
                    <li>Use picture cards to match plant parts to their names</li>
                    <li>Work with a partner or adult helper</li>
                    <li>Focus on 2-3 main plant parts instead of all parts</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-green-700">Language Support</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Provide plant part vocabulary cards with pictures</li>
                    <li>Use gestures and actions to demonstrate plant functions</li>
                    <li>Allow drawing with minimal writing requirements</li>
                    <li>Connect to plants from students' home cultures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-green-600" />
                Assessment Rubric
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-green-700">Plant Part Identification</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      <strong>Excellent:</strong> Identifies all plant parts correctly
                    </li>
                    <li>
                      <strong>Good:</strong> Identifies most plant parts with minimal help
                    </li>
                    <li>
                      <strong>Developing:</strong> Identifies some plant parts with support
                    </li>
                    <li>
                      <strong>Beginning:</strong> Needs significant guidance
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-green-700">Scientific Observation</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      <strong>Excellent:</strong> Makes detailed, accurate observations
                    </li>
                    <li>
                      <strong>Good:</strong> Makes clear observations with some details
                    </li>
                    <li>
                      <strong>Developing:</strong> Makes basic observations
                    </li>
                    <li>
                      <strong>Beginning:</strong> Observations need support and guidance
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-green-700">Tool Use and Safety</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      <strong>Excellent:</strong> Uses tools safely and effectively
                    </li>
                    <li>
                      <strong>Good:</strong> Uses tools appropriately with reminders
                    </li>
                    <li>
                      <strong>Developing:</strong> Uses tools with guidance
                    </li>
                    <li>
                      <strong>Beginning:</strong> Needs constant supervision
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-xl shadow-md border border-green-200 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-green-800">Materials and Safety</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-green-700">Essential Materials</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Various plants and flowers (dandelions, daisies, small potted plants)</li>
              <li>Hand lenses (magnifying glasses)</li>
              <li>Tweezers (child-safe)</li>
              <li>Paper plates for dissection</li>
              <li>Observation journals or recording sheets</li>
              <li>Pencils and colored pencils</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-green-700">Safety Considerations</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Check for plant allergies before the activity</li>
              <li>Avoid poisonous or thorny plants</li>
              <li>Supervise use of tweezers and hand lenses</li>
              <li>Wash hands after handling plants</li>
              <li>Dispose of plant materials appropriately</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Link to="/curriculum/grade1-subjects/activities/science">
          <Button variant="outline" className="mr-4 bg-transparent">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Science Activities
          </Button>
        </Link>
        <Link to="/curriculum/grade1-subjects/activities/science/material-sorters">
          <Button className="bg-green-600 hover:bg-green-700">Next Activity: Material Sorters</Button>
        </Link>
      </div>
    </div>
  )
}
