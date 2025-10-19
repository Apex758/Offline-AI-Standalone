import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, ListChecks, Users, RotateCcw, CalendarDays } from "lucide-react"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

export default function PatternPlaygroundPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-pink-100 to-rose-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600">
            Pattern Playground
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            An engaging patterns and relationships activity where students explore, create, and extend 
            mathematical patterns through hands-on manipulation and creative expression.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-pink-600" />
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Pattern Playground is an exciting exploration of mathematical patterns that helps students 
                develop pattern recognition, sequencing skills, and logical thinking. Through hands-on 
                activities with manipulatives, art materials, and movement, students discover patterns in 
                numbers, shapes, colors, and sounds. This engaging approach builds a strong foundation for 
                algebraic thinking and problem-solving skills while fostering creativity and mathematical joy.
              </p>

              <div className="relative w-full h-64 mb-6 rounded-md overflow-hidden">
                <img src="/g1math-patterns.png" alt="Pattern Playground Activity" className="w-full h-full object-cover" />
              </div>

              <h3 className="text-lg font-semibold mb-2">Learning Outcomes</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Recognize and identify simple repeating patterns</li>
                <li>Create and extend patterns using various materials</li>
                <li>Understand pattern rules and sequences</li>
                <li>Develop logical thinking and problem-solving skills</li>
                <li>Explore patterns in numbers, shapes, and colors</li>
                <li>Practice pattern vocabulary and communication</li>
                <li>Connect patterns to real-world applications</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Curriculum Connections</h3>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>ELO 7:</strong> Learners will use spatial relationships to solve problems.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>SCO 7.1: Recognize and describe shapes</li>
                  <li>SCO 7.2: Use spatial relationships</li>
                  <li>SCO 7.3: Solve spatial problems</li>
                </ul>
              </div>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>ELO 6:</strong> Learners will use mathematical language and symbols to communicate 
                  mathematical thinking.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>SCO 6.1: Use mathematical language</li>
                  <li>SCO 6.2: Use mathematical symbols</li>
                  <li>SCO 6.3: Communicate mathematical thinking</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-pink-600" />
                Implementation Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-pink-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      1
                    </span>
                    Pattern Introduction (10-15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Introduce the concept of patterns in everyday life</li>
                    <li>Show examples of simple repeating patterns</li>
                    <li>Demonstrate pattern vocabulary: repeat, extend, rule</li>
                    <li>Explore patterns in clothing, nature, and classroom</li>
                    <li>Set up pattern exploration stations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-pink-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      2
                    </span>
                    Pattern Exploration (15-20 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Students explore pattern materials at different stations</li>
                    <li>Use manipulatives to create simple patterns</li>
                    <li>Practice identifying pattern rules and sequences</li>
                    <li>Work with partners to extend each other's patterns</li>
                    <li>Record pattern discoveries in pattern journals</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-pink-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      3
                    </span>
                    Pattern Creation (15-20 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Students design their own unique patterns</li>
                    <li>Use various materials: beads, blocks, paper, colors</li>
                    <li>Create patterns with different rules and sequences</li>
                    <li>Practice extending patterns in multiple directions</li>
                    <li>Share pattern creations with classmates</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-pink-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      4
                    </span>
                    Pattern Games (15-20 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Play "What Comes Next?" pattern guessing games</li>
                    <li>Create pattern chains around the classroom</li>
                    <li>Practice pattern movement and dance activities</li>
                    <li>Solve pattern puzzles and challenges</li>
                    <li>Celebrate creative pattern solutions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-pink-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      5
                    </span>
                    Pattern Gallery (10-15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Display all pattern creations in a classroom gallery</li>
                    <li>Students present their patterns to the class</li>
                    <li>Discuss pattern rules and mathematical thinking</li>
                    <li>Identify patterns in the gallery display</li>
                    <li>Plan future pattern exploration activities</li>
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
                <RotateCcw className="h-5 w-5 text-pink-600" />
                Activity Variations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-pink-50 p-3 rounded-md border border-pink-200">
                  <h3 className="text-md font-semibold mb-1 text-pink-700">Nature Patterns</h3>
                  <p className="text-sm">
                    Explore patterns found in nature: leaves, flowers, shells, and animal markings.
                  </p>
                </div>

                <div className="bg-green-50 p-3 rounded-md border border-green-200">
                  <h3 className="text-md font-semibold mb-1 text-green-700">Sound Patterns</h3>
                  <p className="text-sm">
                    Create and identify patterns using rhythm, clapping, and musical instruments.
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                  <h3 className="text-md font-semibold mb-1 text-blue-700">Movement Patterns</h3>
                  <p className="text-sm">
                    Create physical movement patterns using dance, exercise, and body movements.
                  </p>
                </div>

                <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                  <h3 className="text-md font-semibold mb-1 text-amber-700">Digital Patterns</h3>
                  <p className="text-sm">
                    Use tablets and computers to create and explore digital patterns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-pink-600" />
                Differentiation Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-pink-700">For Students Who Excel</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Create complex patterns with multiple rules</li>
                    <li>Explore growing patterns and sequences</li>
                    <li>Design pattern challenges for classmates</li>
                    <li>Investigate mathematical pattern relationships</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-pink-700">For Students Who Need Support</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Start with simple two-element patterns</li>
                    <li>Use larger, easier-to-handle materials</li>
                    <li>Provide pattern templates and guides</li>
                    <li>Work with a partner for support</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-pink-700">Language Considerations</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use pattern vocabulary in students' home languages</li>
                    <li>Provide visual pattern cards for reference</li>
                    <li>Allow students to describe patterns in their preferred language</li>
                    <li>Use gestures and expressions to support understanding</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-pink-600" />
                Assessment Rubric
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-pink-700">Pattern Recognition</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li><strong>Excellent:</strong> Recognizes complex patterns independently</li>
                    <li><strong>Good:</strong> Recognizes most simple patterns</li>
                    <li><strong>Developing:</strong> Recognizes some simple patterns</li>
                    <li><strong>Beginning:</strong> Struggles with pattern recognition</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-pink-700">Pattern Creation</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li><strong>Excellent:</strong> Creates complex, original patterns</li>
                    <li><strong>Good:</strong> Creates simple patterns with guidance</li>
                    <li><strong>Developing:</strong> Creates basic patterns with support</li>
                    <li><strong>Beginning:</strong> Needs help creating patterns</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-pink-700">Pattern Extension</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li><strong>Excellent:</strong> Extends patterns in multiple directions</li>
                    <li><strong>Good:</strong> Extends patterns in one direction</li>
                    <li><strong>Developing:</strong> Extends patterns with support</li>
                    <li><strong>Beginning:</strong> Struggles to extend patterns</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-pink-50 p-6 rounded-xl shadow-md border border-pink-200 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-pink-800">Materials and Preparation Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-pink-700">Essential Materials</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Pattern blocks and geometric shapes</li>
              <li>Beads, buttons, and small objects</li>
              <li>Colored paper and art supplies</li>
              <li>Pattern cards and templates</li>
              <li>Recording sheets for pattern journals</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-pink-700">Preparation Tips</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Set up pattern exploration stations around the classroom</li>
              <li>Prepare pattern examples and templates</li>
              <li>Organize materials in easy-to-access containers</li>
              <li>Have backup activities ready for different skill levels</li>
              <li>Test pattern activities beforehand</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Link to="/curriculum/grade1-subjects/activities/mathematics">
          <Button variant="outline" className="mr-4 bg-transparent">
            ← Back to Mathematics Activities
          </Button>
        </Link>
        <Link to="/curriculum/grade1-subjects/activities/mathematics/number-detectives">
          <Button className="bg-pink-600 hover:bg-pink-700">Next Activity: Number Detectives</Button>
        </Link>
      </div>
    </div>
  )
}
