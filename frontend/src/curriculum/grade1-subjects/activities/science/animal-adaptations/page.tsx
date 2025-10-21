import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Rabbit, ListChecks, Users, RotateCcw, CalendarDays } from "lucide-react"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

export default function AnimalAdaptationsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-emerald-100 to-teal-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
            Animal Adaptations
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            A hands-on life science exploration where students discover how animals are specially adapted to survive in
            their environments through coverings, movement, and behaviors.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rabbit className="h-5 w-5 text-emerald-600" />
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Animal Adaptations introduces students to the fascinating ways animals are specially designed to survive
                in their environments. Through hands-on exploration of animal coverings, movement demonstrations, and
                habitat investigations, students discover how different body parts and behaviors help animals meet their
                basic needs. This engaging activity builds understanding of the relationship between animals and their
                environments while developing scientific observation and reasoning skills.
              </p>

              <div className="relative w-full h-64 mb-6 rounded-md overflow-hidden">
                <img src="./children-examining-animal-pictures-and-samples-of-.png" alt="Animal Adaptations Activity" className="w-full h-full object-cover" />
              </div>

              <h3 className="text-lg font-semibold mb-2">Learning Outcomes</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Identify different types of animal coverings and their purposes</li>
                <li>Understand how animals move and why different movements help survival</li>
                <li>Connect animal characteristics to their habitats</li>
                <li>Recognize that animals have special features to help them survive</li>
                <li>Develop vocabulary related to animal adaptations</li>
                <li>Practice observation and comparison skills</li>
                <li>Build empathy and appreciation for animal diversity</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Curriculum Connections</h3>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>Life Science:</strong> Animals and their environments
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Animal characteristics and adaptations</li>
                  <li>Relationship between animals and their habitats</li>
                  <li>How animals meet their basic needs</li>
                </ul>
              </div>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>Scientific Inquiry:</strong> Observation and comparison
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Making detailed observations of animal features</li>
                  <li>Comparing and contrasting animal characteristics</li>
                  <li>Drawing conclusions about form and function</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-emerald-600" />
                Implementation Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-emerald-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      1
                    </span>
                    Introduction and Animal Coverings (20 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Show students pictures of various animals</li>
                    <li>Ask: "What do you notice about how these animals look?"</li>
                    <li>Introduce animal covering types: fur, feathers, scales, skin</li>
                    <li>Pass around samples of different coverings for students to touch</li>
                    <li>Discuss: "Why might animals have different coverings?"</li>
                    <li>Connect coverings to protection, warmth, and camouflage</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-emerald-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      2
                    </span>
                    Animal Movement Exploration (20 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Show movement cards with different animals</li>
                    <li>Demonstrate animal movements: hop, swim, fly, crawl, run</li>
                    <li>Students practice moving like different animals</li>
                    <li>Discuss: "How does each movement help the animal?"</li>
                    <li>Connect movements to finding food, escaping danger, finding shelter</li>
                    <li>Play "Animal Movement Charades" for reinforcement</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-emerald-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      3
                    </span>
                    Habitat Matching Activity (15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Display habitat posters: forest, ocean, desert, arctic</li>
                    <li>Students work in groups to match animals to their habitats</li>
                    <li>Discuss: "Why does this animal live in this place?"</li>
                    <li>Explore how animal features help them in specific environments</li>
                    <li>Examples: thick fur for cold places, fins for swimming</li>
                    <li>Record findings on habitat charts</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-emerald-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      4
                    </span>
                    Design Your Own Animal (15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Students choose a habitat for their imaginary animal</li>
                    <li>Draw an animal perfectly adapted for that environment</li>
                    <li>Include special coverings, body parts, and features</li>
                    <li>Write or dictate sentences explaining their animal's adaptations</li>
                    <li>Share creations with the class</li>
                    <li>Discuss how their animal would survive in its habitat</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-emerald-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      5
                    </span>
                    Animal Adaptation Role-Play (10 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Students choose an animal to role-play</li>
                    <li>Act out how their animal finds food, stays safe, and moves</li>
                    <li>Use animal masks or simple props if available</li>
                    <li>Audience guesses the animal and its adaptations</li>
                    <li>Discuss what makes each animal special</li>
                    <li>Celebrate the diversity of animal adaptations</li>
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
                <RotateCcw className="h-5 w-5 text-emerald-600" />
                Activity Variations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-emerald-50 p-3 rounded-md border border-emerald-200">
                  <h3 className="text-md font-semibold mb-1 text-emerald-700">Animal Adaptation Museum</h3>
                  <p className="text-sm">
                    Create classroom displays featuring different animals and their special adaptations with
                    student-made information cards.
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                  <h3 className="text-md font-semibold mb-1 text-blue-700">Adaptation Experiments</h3>
                  <p className="text-sm">
                    Test how different "beaks" (tools) work for different "foods" to understand how bird beaks are
                    adapted.
                  </p>
                </div>

                <div className="bg-purple-50 p-3 rounded-md border border-purple-200">
                  <h3 className="text-md font-semibold mb-1 text-purple-700">Animal Stories</h3>
                  <p className="text-sm">
                    Read books about animal adaptations and create stories about animals using their special features.
                  </p>
                </div>

                <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                  <h3 className="text-md font-semibold mb-1 text-amber-700">Local Animal Study</h3>
                  <p className="text-sm">
                    Focus on animals found in your local area and how they're adapted to the regional environment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-600" />
                Differentiation Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-emerald-700">For Advanced Learners</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Research specific animal adaptations in detail</li>
                    <li>Compare similar animals from different environments</li>
                    <li>Explore how climate change affects animal adaptations</li>
                    <li>Create detailed diagrams showing adaptation functions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-emerald-700">For Students Needing Support</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Focus on familiar animals with obvious adaptations</li>
                    <li>Use picture cards to support vocabulary development</li>
                    <li>Provide guided questions for observations</li>
                    <li>Work with a partner for support and collaboration</li>
                    <li>Use simple matching activities instead of complex comparisons</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-emerald-700">Language Support</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Provide animal vocabulary cards with pictures</li>
                    <li>Use gestures and movements to demonstrate concepts</li>
                    <li>Allow drawing to show understanding</li>
                    <li>Connect to animals from students' home countries</li>
                    <li>Use bilingual resources when available</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-emerald-600" />
                Assessment Rubric
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-emerald-700">Adaptation Understanding</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      <strong>Excellent:</strong> Explains how animal features help survival
                    </li>
                    <li>
                      <strong>Good:</strong> Identifies adaptations with some explanation
                    </li>
                    <li>
                      <strong>Developing:</strong> Recognizes basic animal features
                    </li>
                    <li>
                      <strong>Beginning:</strong> Needs support to identify adaptations
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-emerald-700">Habitat Connections</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      <strong>Excellent:</strong> Makes clear connections between animals and habitats
                    </li>
                    <li>
                      <strong>Good:</strong> Makes some habitat connections with guidance
                    </li>
                    <li>
                      <strong>Developing:</strong> Shows basic understanding of animal homes
                    </li>
                    <li>
                      <strong>Beginning:</strong> Needs significant support
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-emerald-700">Scientific Vocabulary</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      <strong>Excellent:</strong> Uses adaptation vocabulary correctly
                    </li>
                    <li>
                      <strong>Good:</strong> Uses some animal terms appropriately
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

      <div className="bg-emerald-50 p-6 rounded-xl shadow-md border border-emerald-200 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-emerald-800">Materials and Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-emerald-700">Essential Materials</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Animal pictures and cards showing various species</li>
              <li>Samples of animal coverings (feathers, fur samples, shells)</li>
              <li>Habitat posters or pictures</li>
              <li>Movement cards with animal actions</li>
              <li>Drawing paper and art supplies</li>
              <li>Optional: animal masks or simple costumes</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-emerald-700">Preparation Tips</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Collect diverse animal images showing clear adaptations</li>
              <li>Ensure covering samples are clean and safe to handle</li>
              <li>Prepare habitat displays in advance</li>
              <li>Have extra materials for creative animal designs</li>
              <li>Consider inviting a local naturalist or zoo educator</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Link to="/curriculum/grade1-subjects/activities/science/shadow-investigators">
          <Button variant="outline" className="mr-4 bg-transparent">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous: Shadow Investigators
          </Button>
        </Link>
        <Link to="/curriculum/grade1-subjects/activities/science/push-pull-playground">
          <Button className="bg-emerald-600 hover:bg-emerald-700">Next Activity: Push and Pull Playground</Button>
        </Link>
      </div>
    </div>
  )
}
