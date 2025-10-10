import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function ScientificInquiry() {
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Scientific Inquiry</h1>
        <Link to="/curriculum/grade1-subjects/science"><Button>Back to Science</Button></Link>
      </div>

      <div className="grid gap-6 space-y-2">
        <Card>
          <CardContent className="pt-6 px-4 sm:px-6">
            <p className="mb-4 leading-relaxed">
              Scientific inquiry forms the foundation of all science learning. Students develop the skills and processes
              of scientific investigation through hands-on experiences that encourage questioning, predicting,
              observing, and communicating findings.
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="skills">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
            <TabsTrigger value="skills" className="text-xs sm:text-sm">
              Inquiry Skills
            </TabsTrigger>
            <TabsTrigger value="process" className="text-xs sm:text-sm">
              Scientific Process
            </TabsTrigger>
            <TabsTrigger value="activities" className="text-xs sm:text-sm">
              Activities
            </TabsTrigger>
            <TabsTrigger value="assessment" className="text-xs sm:text-sm">
              Assessment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-6 pt-6">
            <h2 className="text-2xl font-semibold mb-4">Essential Inquiry Skills</h2>
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="secondary">Skill 1</Badge>
                    Asking Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <p className="mb-3 leading-relaxed">
                    Students learn to ask meaningful questions about the world around them.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Students will:</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                      <li>Ask "what," "why," and "how" questions about natural phenomena</li>
                      <li>Distinguish between questions that can be answered through investigation</li>
                      <li>Generate questions based on observations</li>
                      <li>Use question words appropriately in scientific contexts</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="secondary">Skill 2</Badge>
                    Making Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <p className="mb-3 leading-relaxed">
                    Students develop the ability to make educated guesses about what might happen.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Students will:</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                      <li>Make predictions based on prior knowledge and observations</li>
                      <li>Use "I think..." statements to express predictions</li>
                      <li>Explain reasoning behind predictions</li>
                      <li>Compare predictions with actual results</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="secondary">Skill 3</Badge>
                    Observing
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <p className="mb-3 leading-relaxed">
                    Students use their senses to gather information about the natural world.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Students will:</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                      <li>Use all appropriate senses to make observations</li>
                      <li>Distinguish between observations and inferences</li>
                      <li>Record observations through drawings and simple words</li>
                      <li>Use tools like magnifiers to enhance observations</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="secondary">Skill 4</Badge>
                    Classifying and Sorting
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <p className="mb-3 leading-relaxed">
                    Students organize objects and information based on observable properties.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Students will:</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                      <li>Group objects by similar characteristics</li>
                      <li>Create simple classification systems</li>
                      <li>Explain the reasoning behind groupings</li>
                      <li>Recognize that objects can be classified in multiple ways</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="secondary">Skill 5</Badge>
                    Communicating
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <p className="mb-3 leading-relaxed">
                    Students share their findings and ideas with others in various ways.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Students will:</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                      <li>Describe observations using appropriate vocabulary</li>
                      <li>Share findings through drawings, words, and demonstrations</li>
                      <li>Listen to and discuss others' ideas respectfully</li>
                      <li>Use simple charts and graphs to display information</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="process" className="space-y-6 pt-6">
            <h2 className="text-2xl font-semibold mb-4">The Scientific Process</h2>
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Grade 1 Scientific Method</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <div className="space-y-4 sm:space-y-4">
                    <div className="flex items-start gap-3 sm:gap-3 p-3 sm:p-0">
                      <Badge className="mt-1 text-xs">1</Badge>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm sm:text-base">Wonder & Question</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Students notice something interesting and ask questions about it.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 sm:gap-3 p-3 sm:p-0">
                      <Badge className="mt-1 text-xs">2</Badge>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm sm:text-base">Predict</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Students make educated guesses about what might happen.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 sm:gap-3 p-3 sm:p-0">
                      <Badge className="mt-1 text-xs">3</Badge>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm sm:text-base">Investigate</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Students conduct simple experiments or make careful observations.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 sm:gap-3 p-3 sm:p-0">
                      <Badge className="mt-1 text-xs">4</Badge>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm sm:text-base">Observe & Record</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Students document what they see, hear, feel, or discover.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 sm:gap-3 p-3 sm:p-0">
                      <Badge className="mt-1 text-xs">5</Badge>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm sm:text-base">Share & Discuss</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Students communicate their findings and compare with predictions.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Scientific Attitudes & Values</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Curiosity</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                        <li>Asking "what if" questions</li>
                        <li>Showing interest in natural phenomena</li>
                        <li>Wanting to explore and discover</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Respect</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                        <li>Caring for living things</li>
                        <li>Using materials responsibly</li>
                        <li>Listening to others' ideas</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Persistence</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                        <li>Trying again when experiments don't work</li>
                        <li>Making careful observations</li>
                        <li>Not giving up easily</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Open-mindedness</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                        <li>Considering different possibilities</li>
                        <li>Changing ideas based on evidence</li>
                        <li>Learning from mistakes</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6 pt-6">
            <h2 className="text-2xl font-semibold mb-4">Inquiry-Based Activities</h2>
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Observation Activities</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                    <li>Nature walks with observation journals</li>
                    <li>Mystery box investigations using senses</li>
                    <li>Plant and animal observation over time</li>
                    <li>Weather pattern tracking</li>
                    <li>Magnifier explorations of small objects</li>
                    <li>Texture, smell, and sound identification games</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Classification Activities</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                    <li>Sorting collections of natural objects</li>
                    <li>Living vs. non-living classification</li>
                    <li>Material property sorting (hard/soft, rough/smooth)</li>
                    <li>Animal grouping by characteristics</li>
                    <li>Sound classification (loud/soft, high/low)</li>
                    <li>Light source categorization (natural/artificial)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Simple Experiments</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                    <li>Sink or float predictions and testing</li>
                    <li>Plant growth experiments with different conditions</li>
                    <li>Sound vibration investigations</li>
                    <li>Light and shadow explorations</li>
                    <li>Magnet attraction testing</li>
                    <li>Dissolving experiments with different materials</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Communication Activities</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                    <li>Science journals with drawings and words</li>
                    <li>Show-and-tell presentations of findings</li>
                    <li>Simple data charts and graphs</li>
                    <li>Collaborative group discussions</li>
                    <li>Role-playing scientific discoveries</li>
                    <li>Creating posters about investigations</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assessment" className="space-y-6 pt-6">
            <h2 className="text-2xl font-semibold mb-4">Assessment Strategies</h2>
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Formative Assessment</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                    <li>Observation checklists during investigations</li>
                    <li>Exit tickets with one thing learned</li>
                    <li>Quick drawings to show understanding</li>
                    <li>Thumbs up/down for comprehension checks</li>
                    <li>Think-pair-share discussions</li>
                    <li>Science journal entries</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Summative Assessment</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                    <li>Portfolio collections of science work</li>
                    <li>Performance tasks demonstrating inquiry skills</li>
                    <li>Simple science fair projects</li>
                    <li>Oral presentations of investigations</li>
                    <li>Before/after concept drawings</li>
                    <li>Group project presentations</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assessment Rubric Example</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
                    <div className="min-w-full inline-block align-middle">
                      <table className="w-full text-xs sm:text-sm border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 p-2 sm:p-3 text-left font-semibold">Skill</th>
                            <th className="border border-gray-300 p-2 sm:p-3 text-left font-semibold">Beginning</th>
                            <th className="border border-gray-300 p-2 sm:p-3 text-left font-semibold">Developing</th>
                            <th className="border border-gray-300 p-2 sm:p-3 text-left font-semibold">Proficient</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 p-2 sm:p-3 font-semibold">Asking Questions</td>
                            <td className="border border-gray-300 p-2 sm:p-3">Asks simple questions with help</td>
                            <td className="border border-gray-300 p-2 sm:p-3">Asks questions about observations</td>
                            <td className="border border-gray-300 p-2 sm:p-3">Asks testable questions independently</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2 sm:p-3 font-semibold">Making Predictions</td>
                            <td className="border border-gray-300 p-2 sm:p-3">Makes random guesses</td>
                            <td className="border border-gray-300 p-2 sm:p-3">Makes predictions with some reasoning</td>
                            <td className="border border-gray-300 p-2 sm:p-3">
                              Makes logical predictions based on evidence
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2 sm:p-3 font-semibold">Observing</td>
                            <td className="border border-gray-300 p-2 sm:p-3">Makes basic observations</td>
                            <td className="border border-gray-300 p-2 sm:p-3">Uses multiple senses to observe</td>
                            <td className="border border-gray-300 p-2 sm:p-3">Makes detailed, accurate observations</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2 sm:p-3 font-semibold">Communicating</td>
                            <td className="border border-gray-300 p-2 sm:p-3">Shares ideas with help</td>
                            <td className="border border-gray-300 p-2 sm:p-3">Describes findings using simple words</td>
                            <td className="border border-gray-300 p-2 sm:p-3">
                              Clearly explains findings with details
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Documentation Tools</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">For Teachers:</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                        <li>Observation checklists</li>
                        <li>Anecdotal record forms</li>
                        <li>Photo documentation</li>
                        <li>Video recordings of investigations</li>
                        <li>Student work samples</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">For Students:</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                        <li>Science journals</li>
                        <li>Investigation recording sheets</li>
                        <li>Drawing templates</li>
                        <li>Simple data collection charts</li>
                        <li>Reflection prompts</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
