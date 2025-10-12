import { Link } from "react-router-dom"

// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

import { Button } from "@/components/ui/button"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Badge } from "@/components/ui/badge"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

import { ChevronLeft, Download, Calendar, BookOpen, Lightbulb, Pencil, Music, Globe, Users } from "lucide-react"



export default function BelongingUnitWeek5() {

  return (

    <div className="container mx-auto px-4 py-8">

      <div className="flex items-center gap-2 mb-4">

        <Link to="/curriculum/kindergarten/belonging">

          <Button variant="outline" className="mb-2 bg-transparent">

            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Belonging Unit

          </Button>

        </Link>

      </div>



      <div className="flex flex-col md:flex-row gap-6 mb-8">

        <div className="flex-1">

          <div className="flex items-center gap-3 mb-2">

            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 px-3 py-1 text-sm">Week 5</Badge>

            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 px-3 py-1 text-sm">Belonging Unit</Badge>

          </div>

          <h1 className="text-4xl font-bold mb-4 text-blue-700 flex items-center gap-3">

            <Globe className="h-8 w-8" /> Week 5: Global Belonging & Community

          </h1>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg mb-6 border border-blue-100 shadow-sm">

            <h2 className="text-xl font-semibold mb-2 text-blue-700">Weekly Focus</h2>

            <p className="text-lg">

              Children explore how we belong to the global community and celebrate diversity around the world.

            </p>

          </div>



          <div className="flex flex-wrap gap-3 mb-6">

            <Button

              variant="outline"

              className="border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center gap-2 bg-transparent"

            >

              <Calendar className="h-4 w-4" /> Week Plan PDF

            </Button>

            <Button

              variant="outline"

              className="border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center gap-2 bg-transparent"

            >

              <Download className="h-4 w-4" /> All Materials

            </Button>

            <Link to="/kindergarten-planner">

              <Button

                variant="outline"

                className="border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center gap-2 bg-transparent"

              >

                <Calendar className="h-4 w-4" /> Plan your Lesson

              </Button>

            </Link>

            <Link to="/curriculum/kindergarten/belonging/week-4">

              <Button

                variant="outline"

                className="border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center gap-2 bg-transparent"

              >

                <ChevronLeft className="h-4 w-4" /> Previous Week

              </Button>

            </Link>

          </div>

        </div>

        <div className="md:w-1/3">

          <Card className="border-blue-200 shadow-md overflow-hidden">

            <div className="h-48 bg-gradient-to-r from-blue-400 to-indigo-400 relative">

              <div className="absolute inset-0 flex items-center justify-center p-2">

                <img src="/kindergarten-global-diversity.png" alt="Children’s crayon drawings with the words “GLOBAL DIVERSITY,” showing kids of different ethnicities holding hands, a globe, and the words “WORLD” and “TOGETHER,” celebrating unity and diversity." className="w-full h-full object-cover" />

              </div>

            </div>

            <CardHeader className="bg-white">

              <CardTitle className="text-blue-700">Week at a Glance</CardTitle>

              <CardDescription>Daily themes for Week 5</CardDescription>

            </CardHeader>

            <CardContent>

              <ul className="space-y-2">

                <li className="flex items-center gap-2 text-blue-800">

                  <Badge className="bg-blue-100 text-blue-800">Monday</Badge>

                  <span>Global Families</span>

                </li>

                <li className="flex items-center gap-2 text-blue-800">

                  <Badge className="bg-blue-100 text-blue-800">Tuesday</Badge>

                  <span>World Languages</span>

                </li>

                <li className="flex items-center gap-2 text-blue-800">

                  <Badge className="bg-blue-100 text-blue-800">Wednesday</Badge>

                  <span>Cultural Celebrations</span>

                </li>

                <li className="flex items-center gap-2 text-blue-800">

                  <Badge className="bg-blue-100 text-blue-800">Thursday</Badge>

                  <span>Global Friends</span>

                </li>

                <li className="flex items-center gap-2 text-blue-800">

                  <Badge className="bg-blue-100 text-blue-800">Friday</Badge>

                  <span>Unity in Diversity</span>

                </li>

              </ul>

            </CardContent>

          </Card>

        </div>

      </div>



      <Alert className="bg-yellow-50 border-yellow-200 mb-8">

        <Lightbulb className="h-4 w-4 text-yellow-600" />

        <AlertTitle className="text-yellow-800">Teacher Tip</AlertTitle>

        <AlertDescription className="text-yellow-700">

          Use maps, globes, and cultural artifacts to make global concepts tangible for young learners. Encourage

          children to share their own cultural backgrounds and traditions.

        </AlertDescription>

      </Alert>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <Card className="border-blue-200 shadow-sm hover:shadow-md transition-shadow">

          <CardHeader className="bg-blue-50">

            <CardTitle className="text-blue-700 flex items-center gap-2">

              <BookOpen className="h-5 w-5" /> Learning Objectives

            </CardTitle>

          </CardHeader>

          <CardContent>

            <ul className="list-disc pl-5 space-y-1 mt-2">

              <li>Understand that we belong to a global community</li>

              <li>Appreciate cultural diversity and traditions</li>

              <li>Develop empathy for people from different backgrounds</li>

              <li>Recognize similarities across cultures</li>

              <li>Celebrate unity in diversity</li>

            </ul>

          </CardContent>

        </Card>



        <Card className="border-blue-200 shadow-sm hover:shadow-md transition-shadow">

          <CardHeader className="bg-blue-50">

            <CardTitle className="text-blue-700 flex items-center gap-2">

              <Pencil className="h-5 w-5" /> Key Vocabulary

            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="grid grid-cols-2 gap-2 mt-2">

              <div className="bg-white p-2 rounded border border-blue-100">

                <span className="font-medium text-blue-700">Global</span>

              </div>

              <div className="bg-white p-2 rounded border border-blue-100">

                <span className="font-medium text-blue-700">Community</span>

              </div>

              <div className="bg-white p-2 rounded border border-blue-100">

                <span className="font-medium text-blue-700">Culture</span>

              </div>

              <div className="bg-white p-2 rounded border border-blue-100">

                <span className="font-medium text-blue-700">Diversity</span>

              </div>

              <div className="bg-white p-2 rounded border border-blue-100">

                <span className="font-medium text-blue-700">Traditions</span>

              </div>

              <div className="bg-white p-2 rounded border border-blue-100">

                <span className="font-medium text-blue-700">Unity</span>

              </div>

              <div className="bg-white p-2 rounded border border-blue-100">

                <span className="font-medium text-blue-700">Celebrate</span>

              </div>

              <div className="bg-white p-2 rounded border border-blue-100">

                <span className="font-medium text-blue-700">Respect</span>

              </div>

            </div>

          </CardContent>

        </Card>



        <Card className="border-blue-200 shadow-sm hover:shadow-md transition-shadow">

          <CardHeader className="bg-blue-50">

            <CardTitle className="text-blue-700 flex items-center gap-2">

              <Music className="h-5 w-5" /> Materials Needed

            </CardTitle>

          </CardHeader>

          <CardContent>

            <ul className="list-disc pl-5 space-y-1 mt-2">

              <li>World map and globe</li>

              <li>Cultural artifacts and materials</li>

              <li>Diverse books and stories</li>

              <li>Art supplies for cultural crafts</li>

              <li>Music from different cultures</li>

              <li>Photos of diverse families</li>

              <li>Chart paper and markers</li>

              <li>Materials for unity projects</li>

            </ul>

          </CardContent>

        </Card>

      </div>



      <Tabs defaultValue="monday" className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center">

          <Calendar className="mr-2 h-6 w-6" /> Daily Plans

        </h2>

        <TabsList className="grid grid-cols-5 mb-4">

          <TabsTrigger value="monday" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">

            Monday

          </TabsTrigger>

          <TabsTrigger value="tuesday" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">

            Tuesday

          </TabsTrigger>

          <TabsTrigger value="wednesday" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">

            Wednesday

          </TabsTrigger>

          <TabsTrigger value="thursday" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">

            Thursday

          </TabsTrigger>

          <TabsTrigger value="friday" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">

            Friday

          </TabsTrigger>

        </TabsList>



        <TabsContent value="monday">

          <Card className="border-blue-200 shadow-md">

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg">

              <div className="flex items-center justify-between">

                <h3 className="text-xl font-bold">Monday</h3>

                <Badge className="bg-blue-300 text-blue-900">Day 1</Badge>

              </div>

              <p className="text-blue-100 mt-1">We Belong to Many Groups</p>

            </div>

            <CardContent className="p-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div>

                  <h4 className="font-semibold text-blue-800 mb-2">Focus Question</h4>

                  <p className="text-gray-700">How do we show that everyone belongs in our classroom?</p>

                </div>

                <div>

                  <h4 className="font-semibold text-blue-800 mb-2">Suggested Books</h4>

                  <p className="text-gray-700">"All Are Welcome" by Alexandra Penfold</p>

                </div>

              </div>



              <div className="mb-6">

                <h4 className="font-semibold text-blue-800 mb-3">Activities</h4>

                <ol className="space-y-3">

                  <li className="flex items-start">

                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">

                      1

                    </span>

                    <div>

                      <p className="font-medium">

                        Morning Circle: Introduce the concept that people belong to many different groups

                      </p>

                      <p className="text-sm text-gray-600 mt-1">

                        Discuss families, friends, school, and community groups

                      </p>

                    </div>

                  </li>

                  <li className="flex items-start">

                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">

                      2

                    </span>

                    <div>

                      <p className="font-medium">Literacy Focus: Read 'All Are Welcome' by Alexandra Penfold</p>

                      <p className="text-sm text-gray-600 mt-1">Discuss the message of inclusion and belonging</p>

                    </div>

                  </li>

                  <li className="flex items-start">

                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">

                      3

                    </span>

                    <div>

                      <p className="font-medium">Math Focus: Sort and classify groups we belong to</p>

                      <p className="text-sm text-gray-600 mt-1">Create Venn diagrams showing overlapping groups</p>

                    </div>

                  </li>

                  <li className="flex items-start">

                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">

                      4

                    </span>

                    <div>

                      <p className="font-medium">Afternoon Activity: Create 'Groups I Belong To' web diagrams</p>

                      <p className="text-sm text-gray-600 mt-1">

                        Students draw themselves in the center with connected groups

                      </p>

                    </div>

                  </li>

                </ol>

              </div>



              <Alert className="mb-4 border-yellow-200 bg-yellow-50">

                <Lightbulb className="h-4 w-4 text-yellow-600" />

                <AlertTitle className="text-yellow-800 text-sm">Teacher Tip</AlertTitle>

                <AlertDescription className="text-yellow-700 text-sm">

                  Use real examples from your classroom to help children understand group membership.

                </AlertDescription>

              </Alert>



              <div>

                <h4 className="font-semibold text-blue-800 mb-2">Materials</h4>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">

                  <div className="bg-gray-50 p-2 rounded text-sm">All Are Welcome book</div>

                  <div className="bg-gray-50 p-2 rounded text-sm">Chart paper</div>

                  <div className="bg-gray-50 p-2 rounded text-sm">Markers</div>

                  <div className="bg-gray-50 p-2 rounded text-sm">Web diagram templates</div>

                  <div className="bg-gray-50 p-2 rounded text-sm">Magazine pictures</div>

                </div>

              </div>

            </CardContent>

          </Card>

        </TabsContent>



        <TabsContent value="tuesday">

          <Card className="border-indigo-200 shadow-md">

            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-t-lg">

              <div className="flex items-center justify-between">

                <h3 className="text-xl font-bold">Tuesday</h3>

                <Badge className="bg-indigo-300 text-indigo-900">Day 2</Badge>

              </div>

              <p className="text-indigo-100 mt-1">Same and Different</p>

            </div>

            <CardContent className="p-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div>

                  <h4 className="font-semibold text-indigo-800 mb-2">Focus Question</h4>

                  <p className="text-gray-700">What makes each of us special and unique?</p>

                </div>

                <div>

                  <h4 className="font-semibold text-indigo-800 mb-2">Suggested Books</h4>

                  <p className="text-gray-700">"We're All Wonders" by R.J. Palacio</p>

                </div>

              </div>



              <div className="mb-6">

                <h4 className="font-semibold text-indigo-800 mb-3">Activities</h4>

                <ol className="space-y-3">

                  <li className="flex items-start">

                    <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">

                      1

                    </span>

                    <div>

                      <p className="font-medium">Morning Circle: Discuss similarities and differences among people</p>

                      <p className="text-sm text-gray-600 mt-1">Focus on positive aspects of diversity</p>

                    </div>

                  </li>

                  <li className="flex items-start">

                    <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">

                      2

                    </span>

                    <div>

                      <p className="font-medium">Literacy Focus: Read 'We're All Wonders' by R.J. Palacio</p>

                      <p className="text-sm text-gray-600 mt-1">Discuss kindness and acceptance</p>

                    </div>

                  </li>

                  <li className="flex items-start">

                    <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">

                      3

                    </span>

                    <div>

                      <p className="font-medium">

                        Math Focus: Create Venn diagrams comparing similarities and differences

                      </p>

                      <p className="text-sm text-gray-600 mt-1">Use pictures and words to categorize</p>

                    </div>

                  </li>

                  <li className="flex items-start">

                    <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">

                      4

                    </span>

                    <div>

                      <p className="font-medium">Afternoon Activity: Self-portrait art project celebrating diversity</p>

                      <p className="text-sm text-gray-600 mt-1">Use multicultural art supplies</p>

                    </div>

                  </li>

                </ol>

              </div>



              <Alert className="mb-4 border-yellow-200 bg-yellow-50">

                <Lightbulb className="h-4 w-4 text-yellow-600" />

                <AlertTitle className="text-yellow-800 text-sm">Teacher Tip</AlertTitle>

                <AlertDescription className="text-yellow-700 text-sm">

                  Emphasize that differences make us special and should be celebrated.

                </AlertDescription>

              </Alert>



              <div>

                <h4 className="font-semibold text-indigo-800 mb-2">Materials</h4>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">

                  <div className="bg-gray-50 p-2 rounded text-sm">We're All Wonders book</div>

                  <div className="bg-gray-50 p-2 rounded text-sm">Venn diagram templates</div>

                  <div className="bg-gray-50 p-2 rounded text-sm">Multicultural art supplies</div>

                  <div className="bg-gray-50 p-2 rounded text-sm">Mirror</div>

                  <div className="bg-gray-50 p-2 rounded text-sm">Self-portrait templates</div>

                </div>

              </div>

            </CardContent>

          </Card>

        </TabsContent>



        <TabsContent value="wednesday">

          <Card className="border-green-200 shadow-md">

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-lg">

              <div className="flex items-center justify-between">

                <h3 className="text-xl font-bold">Wednesday</h3>

                <Badge className="bg-green-300 text-green-900">Day 3</Badge>

              </div>

              <p className="text-green-100 mt-1">Helping Others Belong</p>

            </div>

            <CardContent className="p-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div>

                  <h4 className="font-semibold text-green-800 mb-2">Focus Question</h4>

                  <p className="text-gray-700">How can we help others feel like they belong?</p>

                </div>

                <div>

                  <h4 className="font-semibold text-green-800 mb-2">Suggested Books</h4>

                  <p className="text-gray-700">"Strictly No Elephants" by Lisa Mantchev</p>

                </div>

              </div>



              <div className="mb-6">

                <h4 className="font-semibold text-green-800 mb-3">Activities</h4>

                <ol className="space-y-3">

                  <li className="flex items-start">

                    <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">

                      1

                    </span>

                    <div>

                      <p className="font-medium">

                        Morning Circle: Discuss how we can help others feel like they belong

                      </p>

                      <p className="text-sm text-gray-600 mt-1">Share examples of inclusion</p>

                    </div>

                  </li>

                  <li className="flex items-start">

                    <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">

                      2

                    </span>

                    <div>

                      <p className="font-medium">Literacy Focus: Read 'Strictly No Elephants' by Lisa Mantchev</p>

                      <p className="text-sm text-gray-600 mt-1">Discuss the importance of including everyone</p>

                    </div>

                  </li>

                  <li className="flex items-start">

                    <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">

                      3

                    </span>

                    <div>

                      <p className="font-medium">Math Focus: Graph ways we can help others belong</p>

                      <p className="text-sm text-gray-600 mt-1">Create a class chart of inclusion strategies</p>

                    </div>

                  </li>

                  <li className="flex items-start">

                    <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">

                      4

                    </span>

                    <div>

                      <p className="font-medium">Afternoon Activity: Role-play inclusion scenarios</p>

                      <p className="text-sm text-gray-600 mt-1">Use puppets and scenario cards</p>

                    </div>

                  </li>

                </ol>

              </div>



              <Alert className="mb-4 border-yellow-200 bg-yellow-50">

                <Lightbulb className="h-4 w-4 text-yellow-600" />

                <AlertTitle className="text-yellow-800 text-sm">Teacher Tip</AlertTitle>

                <AlertDescription className="text-yellow-700 text-sm">

                  Praise children when they demonstrate inclusive behavior.

                </AlertDescription>

              </Alert>



              <div>

                <h4 className="font-semibold text-green-800 mb-2">Materials</h4>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">

                  <div className="bg-gray-50 p-2 rounded text-sm">Strictly No Elephants book</div>

                  <div className="bg-gray-50 p-2 rounded text-sm">Chart paper for graph</div>

                  <div className="bg-gray-50 p-2 rounded text-sm">Scenario cards</div>

                  <div className="bg-gray-50 p-2 rounded text-sm">Puppets</div>

                  <div className="bg-gray-50 p-2 rounded text-sm">Friendship bracelet materials</div>

                </div>

              </div>

            </CardContent>

          </Card>

        </TabsContent>



        <TabsContent value="thursday">

          <Card className="border-purple-200 shadow-md">

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-t-lg">

              <div className="flex items-center justify-between">

                <h3 className="text-xl font-bold">Thursday</h3>

                <Badge className="bg-purple-300 text-purple-900">Day 4</Badge>

              </div>

              <p className="text-purple-100 mt-1">Our Classroom Community</p>

            </div>

            <CardContent className="p-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div>

                  <h4 className="font-semibold text-purple-800 mb-2">Focus Question</h4>

                  <p className="text-gray-700">How has our class become a community?</p>

                </div>

                <div>

                  <h4 className="font-semibold text-purple-800 mb-2">Suggested Books</h4>

                  <p className="text-gray-700">"You Belong Here" by M.H. Clark</p>

                </div>

              </div>



              <div className="mb-6">

                <h4 className="font-semibold text-purple-800 mb-3">Activities</h4>

                <ol className="space-y-3">

                  <li className="flex items-start">

                    <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">

                      1

                    </span>

                    <div>

                      <p className="font-medium">Morning Circle: Reflect on how the class has become a community</p>

                      <p className="text-sm text-gray-600 mt-1">Share memories and experiences</p>

                    </div>

                  </li>

                  <li className="flex items-start">

                    <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">

                      2

                    </span>

                    <div>

                      <p className="font-medium">Literacy Focus: Read 'You Belong Here' by M.H. Clark</p>

                      <p className="text-sm text-gray-600 mt-1">Discuss belonging and acceptance</p>

                    </div>

                  </li>

                  <li className="flex items-start">

                    <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">

                      3

                    </span>

                    <div>

                      <p className="font-medium">

                        Math Focus: Create a class puzzle where each piece represents a student

                      </p>

                      <p className="text-sm text-gray-600 mt-1">Show how we all fit together</p>

                    </div>

                  </li>

                  <li className="flex items-start">

                    <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">

                      4

                    </span>

                    <div>

                      <p className="font-medium">

                        Afternoon Activity: Collaborative art project - 'Our Classroom Family'

                      </p>

                      <p className="text-sm text-gray-600 mt-1">Create a mural together</p>

                    </div>

                  </li>

                </ol>

              </div>



              <Alert className="mb-4 border-yellow-200 bg-yellow-50">

                <Lightbulb className="h-4 w-4 text-yellow-600" />

                <AlertTitle className="text-yellow-800 text-sm">Teacher Tip</AlertTitle>

                <AlertDescription className="text-yellow-700 text-sm">

                  Take photos of the collaborative process to document community building.

                </AlertDescription>

              </Alert>



              <div>

                <h4 className="font-semibold text-purple-800 mb-2">Materials</h4>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">

                  <div className="bg-gray-50 p-2 rounded text-sm">You Belong Here book</div>

                  <div className="bg-gray-50 p-2 rounded text-sm">Puzzle pieces (one per child)</div>

                  <div className="bg-gray-50 p-2 rounded text-sm">Art supplies</div>

                  <div className="bg-gray-50 p-2 rounded text-sm">Large paper or canvas</div>

                  <div className="bg-gray-50 p-2 rounded text-sm">Class photos</div>

                </div>

              </div>

            </CardContent>

          </Card>

        </TabsContent>



        <TabsContent value="friday">

          <Card className="border-pink-200 shadow-md">

            <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 rounded-t-lg">

              <div className="flex items-center justify-between">

                <h3 className="text-xl font-bold">Friday</h3>

                <Badge className="bg-pink-300 text-pink-900">Day 5</Badge>

              </div>

              <p className="text-pink-100 mt-1">Unity in Diversity</p>

            </div>

            <CardContent className="p-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div>

                  <h4 className="font-semibold text-pink-800 mb-2">Focus Question</h4>

                  <p className="text-gray-700">How do we celebrate our differences while staying united?</p>

                </div>

                <div>

                  <h4 className="font-semibold text-pink-800 mb-2">Suggested Books</h4>

                  <p className="text-gray-700">"The Colors of Us" by Karen Katz</p>

                </div>

              </div>



              <div className="mb-6">

                <h4 className="font-semibold text-pink-800 mb-3">Activities</h4>

                <ol className="space-y-3">

                  <li className="flex items-start">

                    <span className="bg-pink-100 text-pink-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">

                      1

                    </span>

                    <div>

                      <p className="font-medium">Morning Circle: Discuss unity and diversity</p>

                      <p className="text-sm text-gray-600 mt-1">Talk about how differences make us stronger</p>

                    </div>

                  </li>

                  <li className="flex items-start">

                    <span className="bg-pink-100 text-pink-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">

                      2

                    </span>

                    <div>

                      <p className="font-medium">Literacy Focus: Read 'The Colors of Us' by Karen Katz</p>

                      <p className="text-sm text-gray-600 mt-1">Celebrate skin color diversity</p>

                    </div>

                  </li>

                  <li className="flex items-start">

                    <span className="bg-pink-100 text-pink-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">

                      3

                    </span>

                    <div>

                      <p className="font-medium">Math Focus: Create a class diversity chart</p>

                      <p className="text-sm text-gray-600 mt-1">Count and categorize different characteristics</p>

                    </div>

                  </li>

                  <li className="flex items-start">

                    <span className="bg-pink-100 text-pink-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">

                      4

                    </span>

                    <div>

                      <p className="font-medium">Afternoon Activity: Unity handprint project</p>

                      <p className="text-sm text-gray-600 mt-1">Create a collaborative artwork</p>

                    </div>

                  </li>

                </ol>

              </div>



              <Alert className="mb-4 border-yellow-200 bg-yellow-50">

                <Lightbulb className="h-4 w-4 text-yellow-600" />

                <AlertTitle className="text-yellow-800 text-sm">Teacher Tip</AlertTitle>

                <AlertDescription className="text-yellow-700 text-sm">

                  Display the unity project prominently to reinforce the sense of community.

                </AlertDescription>

              </Alert>



              <div>

                <h4 className="font-semibold text-pink-800 mb-2">Materials</h4>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">

                  <div className="bg-gray-50 p-2 rounded text-sm">The Colors of Us book</div>

                  <div className="bg-gray-50 p-2 rounded text-sm">Chart paper</div>

                  <div className="bg-gray-50 p-2 rounded text-sm">Paint and brushes</div>

                  <div className="bg-gray-50 p-2 rounded text-sm">Large paper or canvas</div>

                  <div className="bg-gray-50 p-2 rounded text-sm">Markers and crayons</div>

                </div>

              </div>

            </CardContent>

          </Card>

        </TabsContent>

      </Tabs>



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center">

          <Lightbulb className="mr-2 h-6 w-6" /> Featured Activities

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Card className="border-blue-200 shadow-md hover:shadow-lg transition-shadow">

            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">

              <div className="flex items-center justify-between">

                <CardTitle className="text-blue-800 flex items-center gap-2">

                  <Globe className="h-5 w-5" />

                  Global Family Tree

                </CardTitle>

                <Badge className="bg-blue-200 text-blue-800">Art & Social Studies</Badge>

              </div>

            </CardHeader>

            <CardContent className="p-4">

              <p className="text-gray-700 mb-3">

                Create a collaborative family tree showing the diverse backgrounds of all students in the class,

                celebrating the global connections within the classroom community.

              </p>

              <div className="mb-3">

                <h4 className="font-semibold text-blue-800 mb-2">Materials Needed:</h4>

                <div className="flex flex-wrap gap-2">

                  <Badge variant="outline" className="text-xs">

                    Large tree template

                  </Badge>

                  <Badge variant="outline" className="text-xs">

                    Family photos

                  </Badge>

                  <Badge variant="outline" className="text-xs">

                    World map

                  </Badge>

                  <Badge variant="outline" className="text-xs">

                    Colored paper

                  </Badge>

                </div>

              </div>

              <div className="text-sm text-gray-600">

                <strong>Learning Areas:</strong> Geography, Cultural Awareness, Family Heritage

              </div>

            </CardContent>

          </Card>



          <Card className="border-blue-200 shadow-md hover:shadow-lg transition-shadow">

            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">

              <div className="flex items-center justify-between">

                <CardTitle className="text-blue-800 flex items-center gap-2">

                  <Music className="h-5 w-5" />

                  Around the World Music Journey

                </CardTitle>

                <Badge className="bg-blue-200 text-blue-800">Music & Movement</Badge>

              </div>

            </CardHeader>

            <CardContent className="p-4">

              <p className="text-gray-700 mb-3">

                Take a musical journey around the world, learning simple songs and dances from different cultures while

                exploring how music brings people together globally.

              </p>

              <div className="mb-3">

                <h4 className="font-semibold text-blue-800 mb-2">Materials Needed:</h4>

                <div className="flex flex-wrap gap-2">

                  <Badge variant="outline" className="text-xs">

                    World music playlist

                  </Badge>

                  <Badge variant="outline" className="text-xs">

                    Simple instruments

                  </Badge>

                  <Badge variant="outline" className="text-xs">

                    Movement scarves

                  </Badge>

                  <Badge variant="outline" className="text-xs">

                    Cultural pictures

                  </Badge>

                </div>

              </div>

              <div className="text-sm text-gray-600">

                <strong>Learning Areas:</strong> Music, Cultural Studies, Physical Development

              </div>

            </CardContent>

          </Card>



          <Card className="border-blue-200 shadow-md hover:shadow-lg transition-shadow">

            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">

              <div className="flex items-center justify-between">

                <CardTitle className="text-blue-800 flex items-center gap-2">

                  <Users className="h-5 w-5" />

                  Unity Quilt Project

                </CardTitle>

                <Badge className="bg-blue-200 text-blue-800">Art & Community</Badge>

              </div>

            </CardHeader>

            <CardContent className="p-4">

              <p className="text-gray-700 mb-3">

                Each child creates a unique quilt square representing their heritage or interests, then combine all

                squares into a classroom unity quilt celebrating diversity.

              </p>

              <div className="mb-3">

                <h4 className="font-semibold text-blue-800 mb-2">Materials Needed:</h4>

                <div className="flex flex-wrap gap-2">

                  <Badge variant="outline" className="text-xs">

                    Fabric squares

                  </Badge>

                  <Badge variant="outline" className="text-xs">

                    Fabric markers

                  </Badge>

                  <Badge variant="outline" className="text-xs">

                    Decorative materials

                  </Badge>

                  <Badge variant="outline" className="text-xs">

                    Binding materials

                  </Badge>

                </div>

              </div>

              <div className="text-sm text-gray-600">

                <strong>Learning Areas:</strong> Fine Motor Skills, Cultural Expression, Collaboration

              </div>

            </CardContent>

          </Card>



          <Card className="border-blue-200 shadow-md hover:shadow-lg transition-shadow">

            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">

              <div className="flex items-center justify-between">

                <CardTitle className="text-blue-800 flex items-center gap-2">

                  <BookOpen className="h-5 w-5" />

                  Global Pen Pal Letters

                </CardTitle>

                <Badge className="bg-blue-200 text-blue-800">Literacy & Communication</Badge>

              </div>

            </CardHeader>

            <CardContent className="p-4">

              <p className="text-gray-700 mb-3">

                Write and illustrate letters to imaginary pen pals from different countries, learning about global

                communication and cultural exchange.

              </p>

              <div className="mb-3">

                <h4 className="font-semibold text-blue-800 mb-2">Materials Needed:</h4>

                <div className="flex flex-wrap gap-2">

                  <Badge variant="outline" className="text-xs">

                    Letter templates

                  </Badge>

                  <Badge variant="outline" className="text-xs">

                    World postcards

                  </Badge>

                  <Badge variant="outline" className="text-xs">

                    Art supplies

                  </Badge>

                  <Badge variant="outline" className="text-xs">

                    Envelopes

                  </Badge>

                </div>

              </div>

              <div className="text-sm text-gray-600">

                <strong>Learning Areas:</strong> Writing, Cultural Awareness, Communication Skills

              </div>

            </CardContent>

          </Card>

        </div>

      </div>



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center">

          <BookOpen className="mr-2 h-6 w-6" /> Resources

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card className="border-blue-200 shadow-md hover:shadow-lg transition-shadow">

            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">

              <CardTitle className="text-blue-800 flex items-center gap-2">

                <BookOpen className="h-5 w-5" />

                Books

              </CardTitle>

            </CardHeader>

            <CardContent className="p-4">

              <ul className="space-y-2 text-sm">

                <li className="flex items-center gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>

                  "All Are Welcome" by Alexandra Penfold

                </li>

                <li className="flex items-center gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>

                  "We're All Wonders" by R.J. Palacio

                </li>

                <li className="flex items-center gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>

                  "The Colors of Us" by Karen Katz

                </li>

                <li className="flex items-center gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>

                  "Strictly No Elephants" by Lisa Mantchev

                </li>

                <li className="flex items-center gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>

                  "You Belong Here" by M.H. Clark

                </li>

                <li className="flex items-center gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>

                  "Children Around the World" by Donata Montanari

                </li>

              </ul>

              <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">

                <Download className="mr-2 h-4 w-4" />

                Book List PDF

              </Button>

            </CardContent>

          </Card>



          <Card className="border-blue-200 shadow-md hover:shadow-lg transition-shadow">

            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">

              <CardTitle className="text-blue-800 flex items-center gap-2">

                <Pencil className="h-5 w-5" />

                Printables

              </CardTitle>

            </CardHeader>

            <CardContent className="p-4">

              <ul className="space-y-2 text-sm">

                <li className="flex items-center gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>

                  Global Family Tree Template

                </li>

                <li className="flex items-center gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>

                  Unity Quilt Square Patterns

                </li>

                <li className="flex items-center gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>

                  Pen Pal Letter Templates

                </li>

                <li className="flex items-center gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>

                  Cultural Celebration Cards

                </li>

                <li className="flex items-center gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>

                  Diversity Sorting Activities

                </li>

                <li className="flex items-center gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>

                  Global Community Coloring Pages

                </li>

              </ul>

              <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">

                <Download className="mr-2 h-4 w-4" />

                Download All

              </Button>

            </CardContent>

          </Card>



          <Card className="border-blue-200 shadow-md hover:shadow-lg transition-shadow">

            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">

              <CardTitle className="text-blue-800 flex items-center gap-2">

                <Users className="h-5 w-5" />

                Home Connection

              </CardTitle>

            </CardHeader>

            <CardContent className="p-4">

              <ul className="space-y-2 text-sm">

                <li className="flex items-center gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>

                  Family Heritage Interview Questions

                </li>

                <li className="flex items-center gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>

                  Cultural Sharing Invitation

                </li>

                <li className="flex items-center gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>

                  Global Community Discussion Starters

                </li>

                <li className="flex items-center gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>

                  Unity Project Ideas for Families

                </li>

                <li className="flex items-center gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>

                  Multicultural Recipe Collection

                </li>

                <li className="flex items-center gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>

                  Global Belonging Reflection Sheet

                </li>

              </ul>

              <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">

                <Download className="mr-2 h-4 w-4" />

                Family Pack

              </Button>

            </CardContent>

          </Card>

        </div>

      </div>



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center">

          <BookOpen className="mr-2 h-6 w-6" /> Additional Resources

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          <Card className="border-blue-200 hover:shadow-lg transition-shadow">

            <CardContent className="p-4">

              <h3 className="font-semibold text-blue-800 mb-2">Cultural Celebration Videos</h3>

              <p className="text-sm text-gray-600 mb-3">

                Short videos showing different cultural celebrations around the world

              </p>

              <Button variant="outline" size="sm" className="w-full bg-transparent">

                View Resources

              </Button>

            </CardContent>

          </Card>



          <Card className="border-blue-200 hover:shadow-lg transition-shadow">

            <CardContent className="p-4">

              <h3 className="font-semibold text-blue-800 mb-2">Global Music Collection</h3>

              <p className="text-sm text-gray-600 mb-3">Traditional music from different cultures and countries</p>

              <Button variant="outline" size="sm" className="w-full bg-transparent">

                Listen Now

              </Button>

            </CardContent>

          </Card>



          <Card className="border-blue-200 hover:shadow-lg transition-shadow">

            <CardContent className="p-4">

              <h3 className="font-semibold text-blue-800 mb-2">Diversity Activities</h3>

              <p className="text-sm text-gray-600 mb-3">Hands-on activities to explore cultural diversity</p>

              <Button variant="outline" size="sm" className="w-full bg-transparent">

                Explore Activities

              </Button>

            </CardContent>

          </Card>

        </div>

      </div>



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center">

          <Users className="mr-2 h-6 w-6" /> Unit Reflection

        </h2>

        <Card className="border-blue-200 shadow-md">

          <CardContent className="p-6">

            <p className="text-gray-700 mb-4">

              As we conclude our Belonging unit, take time to reflect on how your students have grown in their

              understanding of belonging, inclusion, and community. Consider the following questions:

            </p>

            <ul className="space-y-2 text-gray-700 mb-4">

              <li>• How have students demonstrated empathy and inclusion?</li>

              <li>• What strategies have been most effective in building community?</li>

              <li>• How can we continue to reinforce these concepts throughout the year?</li>

              <li>• What cultural connections have students made?</li>

            </ul>

            <p className="text-gray-700">

              Celebrate the progress made and continue to nurture the sense of belonging in your classroom community.

            </p>

          </CardContent>

        </Card>

      </div>

    </div>

  )

}
