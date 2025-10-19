import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import {

  BookOpen,

  Calendar,

  ChevronLeft,

  Download,

  Heart,

  Lightbulb,

  Music,

  Pencil,

  Users,

  Home,

  Star,

  Palette,

  FileText,

  LinkIcon,

} from "lucide-react"

// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

import { Link } from "react-router-dom"



export default function Week2Page() {

  return (

    <div className="container mx-auto px-4 py-8">

      <div className="flex flex-col md:flex-row gap-6 mb-8">

        <div className="flex-1">

          <div className="flex items-center gap-3 mb-2">

            <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 px-3 py-1 text-sm">Week 2</Badge>

            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 px-3 py-1 text-sm">

              Belonging Unit

            </Badge>

          </div>

          <h1 className="text-4xl font-bold mb-4 text-orange-700 flex items-center gap-3">

            <Home className="h-8 w-8" /> Week 2: My Family

          </h1>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg mb-6 border border-orange-100 shadow-sm">

            <h2 className="text-xl font-semibold mb-2 text-orange-700">Weekly Focus</h2>

            <p className="text-lg">

              Children explore their family relationships, roles, and traditions while learning how families care for

              each other and help meet basic needs.

            </p>

          </div>



          <div className="flex flex-wrap gap-3 mb-6">

            <Button

              variant="outline"

              className="border-orange-300 text-orange-700 hover:bg-orange-50 flex items-center gap-2 bg-transparent"

            >

              <Calendar className="h-4 w-4" /> Week Plan PDF

            </Button>

            <Button

              variant="outline"

              className="border-orange-300 text-orange-700 hover:bg-orange-50 flex items-center gap-2 bg-transparent"

            >

              <Download className="h-4 w-4" /> All Materials

            </Button>

            <Link to="/kindergarten-planner">

              <Button

                variant="outline"

                className="border-orange-300 text-orange-700 hover:bg-orange-50 flex items-center gap-2 bg-transparent"

              >

                <Calendar className="h-4 w-4" /> Plan your Lesson

              </Button>

            </Link>

            <Link to="/curriculum/kindergarten/belonging/week-1">

              <Button

                variant="outline"

                className="border-orange-300 text-orange-700 hover:bg-orange-50 flex items-center gap-2 bg-transparent"

              >

                <ChevronLeft className="h-4 w-4" /> Previous Week

              </Button>

            </Link>

            <Link to="/curriculum/kindergarten/belonging/week-3">

              <Button

                variant="outline"

                className="border-orange-300 text-orange-700 hover:bg-orange-50 flex items-center gap-2 bg-transparent"

              >

                Next Week <ChevronLeft className="h-4 w-4 rotate-180" />

              </Button>

            </Link>

          </div>

        </div>

        <div className="md:w-1/3">

          <Card className="border-orange-200 shadow-md overflow-hidden">

          <div className="h-48 bg-gradient-to-r from-pink-400 to-purple-400 relative">

              <div className="absolute inset-0 flex items-center justify-center p-2">

                <img src="/kindergarten-self-portraits.png" alt="Children creating self portraits" className="w-full h-full object-cover" />

              </div>

            </div>

            <CardHeader className="bg-white">

              <CardTitle className="text-orange-700">Week at a Glance</CardTitle>

              <CardDescription>Daily themes for Week 2</CardDescription>

            </CardHeader>

            <CardContent>

              <ul className="space-y-2">

                <li className="flex items-center gap-2 text-orange-800">

                  <Badge className="bg-orange-100 text-orange-800">Monday</Badge>

                  <span>Who Is In My Family?</span>

                </li>

                <li className="flex items-center gap-2 text-orange-800">

                  <Badge className="bg-orange-100 text-orange-800">Tuesday</Badge>

                  <span>Family Roles and Responsibilities</span>

                </li>

                <li className="flex items-center gap-2 text-orange-800">

                  <Badge className="bg-orange-100 text-orange-800">Wednesday</Badge>

                  <span>Family Traditions</span>

                </li>

                <li className="flex items-center gap-2 text-orange-800">

                  <Badge className="bg-orange-100 text-orange-800">Thursday</Badge>

                  <span>Family Stories</span>

                </li>

                <li className="flex items-center gap-2 text-orange-800">

                  <Badge className="bg-orange-100 text-orange-800">Friday</Badge>

                  <span>Families Help Each Other</span>

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

          Before beginning this week, send a note home asking families to share a family photo and one special tradition

          or story. Be sensitive to diverse family structures and celebrate all types of families.

        </AlertDescription>

      </Alert>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <Card className="border-orange-200 shadow-sm hover:shadow-md transition-shadow">

          <CardHeader className="bg-orange-50">

            <CardTitle className="text-orange-700 flex items-center gap-2">

              <BookOpen className="h-5 w-5" /> Learning Objectives

            </CardTitle>

          </CardHeader>

          <CardContent>

            <ul className="list-disc pl-5 space-y-1 mt-2">

              <li>Identify and name family members</li>

              <li>Understand different family roles and responsibilities</li>

              <li>Recognize how families care for each other</li>

              <li>Appreciate family traditions and stories</li>

              <li>Practice counting family members (numbers 1-10)</li>

              <li>Develop vocabulary related to family relationships</li>

            </ul>

          </CardContent>

        </Card>



        <Card className="border-orange-200 shadow-sm hover:shadow-md transition-shadow">

          <CardHeader className="bg-orange-50">

            <CardTitle className="text-orange-700 flex items-center gap-2">

              <Pencil className="h-5 w-5" /> Key Vocabulary

            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="grid grid-cols-2 gap-2 mt-2">

              <div className="bg-white p-2 rounded border border-orange-100">

                <span className="font-medium text-orange-700">Family</span>

              </div>

              <div className="bg-white p-2 rounded border border-orange-100">

                <span className="font-medium text-orange-700">Mother/Father</span>

              </div>

              <div className="bg-white p-2 rounded border border-orange-100">

                <span className="font-medium text-orange-700">Sister/Brother</span>

              </div>

              <div className="bg-white p-2 rounded border border-orange-100">

                <span className="font-medium text-orange-700">Grandparents</span>

              </div>

              <div className="bg-white p-2 rounded border border-orange-100">

                <span className="font-medium text-orange-700">Care/Help</span>

              </div>

              <div className="bg-white p-2 rounded border border-orange-100">

                <span className="font-medium text-orange-700">Tradition</span>

              </div>

              <div className="bg-white p-2 rounded border border-orange-100">

                <span className="font-medium text-orange-700">Responsibility</span>

              </div>

              <div className="bg-white p-2 rounded border border-orange-100">

                <span className="font-medium text-orange-700">Love</span>

              </div>

            </div>

          </CardContent>

        </Card>



        <Card className="border-orange-200 shadow-sm hover:shadow-md transition-shadow">

          <CardHeader className="bg-orange-50">

            <CardTitle className="text-orange-700 flex items-center gap-2">

              <Music className="h-5 w-5" /> Materials Needed

            </CardTitle>

          </CardHeader>

          <CardContent>

            <ul className="list-disc pl-5 space-y-1 mt-2">

              <li>Family photos from home</li>

              <li>Chart paper and markers</li>

              <li>Art supplies (crayons, paper, scissors, glue)</li>

              <li>Books about families</li>

              <li>Finger puppets or family dolls</li>

              <li>Camera for documentation</li>

              <li>Magazines for family pictures</li>

              <li>Construction paper for family trees</li>

            </ul>

          </CardContent>

        </Card>

      </div>



      <Tabs defaultValue="monday" className="mb-8">

      <h2 className="text-2xl font-bold mb-4 text-orange-700 flex items-center">

          <Calendar className="mr-2 h-6 w-6" /> Daily Plans

        </h2>

        <TabsList className="grid grid-cols-5 mb-4">

          <TabsTrigger value="monday" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800">

            Monday

          </TabsTrigger>

          <TabsTrigger

            value="tuesday"

            className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800"

          >

            Tuesday

          </TabsTrigger>

          <TabsTrigger

            value="wednesday"

            className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800"

          >

            Wednesday

          </TabsTrigger>

          <TabsTrigger

            value="thursday"

            className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800"

          >

            Thursday

          </TabsTrigger>

          <TabsTrigger value="friday" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800">

            Friday

          </TabsTrigger>

        </TabsList>



        <TabsContent value="monday">

          <Card className="border-orange-200 shadow-md">

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-t-lg">

              <div className="flex justify-between items-center">

                <h3 className="text-xl font-bold">Monday: Who Is In My Family?</h3>

                <Badge className="bg-white text-orange-700">Day 1</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">

                  <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-orange-700 text-lg italic">Who are the people in my family?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"Families Are Different and Alike" by Bobbie Kalman</li>

                    <li>"The Family Book" by Todd Parr</li>

                    <li>"So Much" by Trish Cooke</li>

                  </ul>

                </div>

              </div>



              <div className="space-y-6">

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      1

                    </div>

                    <h4 className="font-semibold text-orange-800">Morning Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Introduce the family theme by reading "So Much" by Trish Cooke. Discuss different family members

                      and how families can be different sizes and structures.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Be inclusive of all family types - single parents, grandparents as

                        caregivers, adoptive families, etc. Emphasize that love makes a family.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-orange-800">Literacy Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Family vocabulary development. Learn words for family members in English and encourage children to

                      share family words in their home languages. Create finger puppets for family members.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Finger puppets

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Family word cards

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Chart paper

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Markers

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-orange-800">Math Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Count family members. Children count how many people are in their families and compare family

                      sizes. Create a class graph showing different family sizes.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Use terms like "more than," "less than," and "equal to" when

                        comparing family sizes. Practice number recognition 1-10.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-orange-800">Art Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Family portrait drawing. Children draw pictures of their families, including all the people who

                      live with them or are important to them. Encourage details and storytelling.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-family-drawings.png" alt="Family drawings example" className="w-auto h-auto" />

                      <img src="/kindergarten-caribbean-family-portrait.png" alt="Caribbean family portrait example" className="w-auto h-auto" />

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      5

                    </div>

                    <h4 className="font-semibold text-orange-800">Closing Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Share family drawings and discuss the different types of families represented in the classroom.

                      Sing a family song that celebrates diversity.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>Who are the special people in your family?</li>

                        <li>What makes your family special?</li>

                        <li>How are families the same and different?</li>

                      </ul>

                    </div>

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

        </TabsContent>



        <TabsContent value="tuesday">

          <Card className="border-orange-200 shadow-md">

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-t-lg">

              <div className="flex justify-between items-center">

                <h3 className="text-xl font-bold">Tuesday: Family Roles and Responsibilities</h3>

                <Badge className="bg-white text-orange-700">Day 2</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">

                  <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-orange-700 text-lg italic">What jobs do family members have?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"Oonga Boonga" by Frieda Wishinsky</li>

                    <li>"Helping at Home" by Various Authors</li>

                    <li>"Jobs Around the House" by Cari Meister</li>

                  </ul>

                </div>

              </div>



              <div className="space-y-6">

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      1

                    </div>

                    <h4 className="font-semibold text-orange-800">Morning Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Read "Oonga Boonga" and discuss how different family members tried to help the baby. Talk about

                      jobs that parents, children, and other family members do at home.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Include both traditional and non-traditional family roles. Discuss

                        how family members work together as a team.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-orange-800">Social Studies Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Create a family helper chart. Children identify ways they help at home and ways family members

                      help them. Role-play different family responsibilities.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Activity:</strong> Cooking

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Activity:</strong> Cleaning

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Activity:</strong> Caring

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Activity:</strong> Playing

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-orange-800">Math Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Count and sort family responsibilities. Create graphs showing how many children help with

                      different chores. Practice using numbers 1-5 to represent quantities.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Create a weekly helper chart with children's names and rotate

                        responsibilities using number patterns.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-orange-800">Art Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Create "I Can Help" coupon books. Children draw pictures of ways they can help their families and

                      create coupon books to give as gifts to family members.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-caribbean-family-helping.png" alt="Family helping activities" className="w-auto h-auto" />

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      5

                    </div>

                    <h4 className="font-semibold text-orange-800">Closing Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Share coupon books and discuss how helping makes families stronger. Practice saying "please,"

                      "thank you," and "you're welcome" when asking for and offering help.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>How do you help your family at home?</li>

                        <li>How does your family help you?</li>

                        <li>Why is it important for families to work together?</li>

                      </ul>

                    </div>

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

        </TabsContent>



        <TabsContent value="wednesday">

          <Card className="border-orange-200 shadow-md">

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-t-lg">

              <div className="flex justify-between items-center">

                <h3 className="text-xl font-bold">Wednesday: Family Traditions</h3>

                <Badge className="bg-white text-orange-700">Day 3</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">

                  <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-orange-700 text-lg italic">What special things does my family do together?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"The Family Book" by Todd Parr</li>

                    <li>"Our Family Traditions" by Various Authors</li>

                    <li>"Celebrating Families" by Rosmarie Hausherr</li>

                  </ul>

                </div>

              </div>



              <div className="space-y-6">

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      1

                    </div>

                    <h4 className="font-semibold text-orange-800">Morning Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Discuss family traditions and special activities. Children share traditions from their families,

                      including Caribbean cultural celebrations, holiday customs, and special family activities.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Include diverse cultural traditions and emphasize that all family

                        traditions are special and important.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-orange-800">Cultural Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Explore Caribbean family traditions. Learn about special foods, music, dances, and celebrations

                      that Caribbean families enjoy together. Practice simple Caribbean songs or dances.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Tradition:</strong> Cooking together

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Tradition:</strong> Music & dance

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Tradition:</strong> Storytelling

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Tradition:</strong> Celebrations

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-orange-800">Math Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Count and compare family traditions. Create a class graph showing different types of family

                      traditions and count how many families share similar traditions.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Use a calendar to show when different family celebrations happen

                        throughout the year.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-orange-800">Art Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Create family tradition collages. Children cut out pictures or draw images representing their

                      family's special traditions and create colorful collages to share.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-caribbean-family-traditions.png" alt="Caribbean family traditions" className="w-auto h-auto" />

                      <img src="/kindergarten-caribbean-family-celebration.png" alt="Family celebration" className="w-auto h-auto" />

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      5

                    </div>

                    <h4 className="font-semibold text-orange-800">Closing Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Share tradition collages and celebrate the diversity of family customs. Discuss how traditions

                      help families feel connected and special.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What is your favorite family tradition?</li>

                        <li>How do traditions make your family special?</li>

                        <li>What new tradition would you like to start with your family?</li>

                      </ul>

                    </div>

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

        </TabsContent>



        <TabsContent value="thursday">

          <Card className="border-orange-200 shadow-md">

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-t-lg">

              <div className="flex justify-between items-center">

                <h3 className="text-xl font-bold">Thursday: Family Stories</h3>

                <Badge className="bg-white text-orange-700">Day 4</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">

                  <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-orange-700 text-lg italic">What stories do families share?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"Tell Me Again About the Night I Was Born" by Jamie Lee Curtis</li>

                    <li>"The Relatives Came" by Cynthia Rylant</li>

                    <li>"Family Pictures" by Carmen Lomas Garza</li>

                  </ul>

                </div>

              </div>



              <div className="space-y-6">

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      1

                    </div>

                    <h4 className="font-semibold text-orange-800">Morning Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Share family stories and memories. Children tell stories about special family moments, trips, or

                      funny things that happened. Discuss how stories help families remember important times.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Encourage children to share both big and small family moments.

                        Help them understand that all family stories are valuable.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-orange-800">Literacy Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Story sequencing with family photos. Children arrange family photos in order and tell the story of

                      what happened. Practice using words like "first," "next," "then," and "last."

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Word:</strong> First

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Word:</strong> Next

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Word:</strong> Then

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Word:</strong> Last

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-orange-800">Math Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Timeline creation using family events. Children create simple timelines showing important family

                      events in order. Practice counting and ordering numbers 1-5.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Compare ages of family members and practice using "older than" and

                        "younger than" concepts.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-orange-800">Art Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Create family story books. Children draw pictures and dictate stories about special family

                      memories. Bind the pages together to create personal family story books.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-caribbean-family-storytelling.png" alt="Family storytelling scene" className="w-auto h-auto" />

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      5

                    </div>

                    <h4 className="font-semibold text-orange-800">Closing Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Share family story books and celebrate the unique stories each family has. Discuss how stories

                      help us remember and connect with our families.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What is your favorite family story?</li>

                        <li>Why do families tell stories to each other?</li>

                        <li>What story would you like to remember forever?</li>

                      </ul>

                    </div>

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

        </TabsContent>



        <TabsContent value="friday">

          <Card className="border-orange-200 shadow-md">

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-t-lg">

              <div className="flex justify-between items-center">

                <h3 className="text-xl font-bold">Friday: Families Help Each Other</h3>

                <Badge className="bg-white text-orange-700">Day 5</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">

                  <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-orange-700 text-lg italic">How do families care for and support each other?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"Love You Forever" by Robert Munsch</li>

                    <li>"Families Help Each Other" by Various Authors</li>

                    <li>"We Are Family" by Various Authors</li>

                  </ul>

                </div>

              </div>



              <div className="space-y-6">

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      1

                    </div>

                    <h4 className="font-semibold text-orange-800">Morning Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Review the week's learning about families. Read "Love You Forever" and discuss how families show

                      love and care for each other in different ways throughout life.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Connect back to activities from earlier in the week. Help children

                        see how family members, roles, traditions, and stories all show family love and support.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-orange-800">Social Studies Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Discuss how families meet basic needs. Learn about how families provide food, shelter, clothing,

                      and love. Create a chart showing different ways families care for each other.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Need:</strong> Food

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Need:</strong> Shelter

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Need:</strong> Clothing

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Need:</strong> Love

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-orange-800">Math Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Count acts of kindness. Children count and record different ways their families show love and

                      care. Create a class graph showing various caring behaviors.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Set a goal for the class to perform a certain number of kind acts

                        for their families during the weekend.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-orange-800">Culminating Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Create a class "Family Tree" display. Each child contributes a leaf with their family's name and

                      one special thing about their family. Arrange all leaves on a large tree to show how all families

                      belong in the classroom community.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-caribbean-extended-family.png" alt="Extended family representation" className="w-auto h-auto" />

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      5

                    </div>

                    <h4 className="font-semibold text-orange-800">Closing Celebration</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Week reflection and family appreciation. Review all the wonderful things learned about families

                      during the week. Write thank you notes to families and celebrate the diversity of family

                      structures and traditions in the classroom.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What did you learn about families this week?</li>

                        <li>How does your family show they love you?</li>

                        <li>What makes all families special?</li>

                        <li>How can you show love to your family?</li>

                      </ul>

                    </div>

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

        </TabsContent>

      </Tabs>



      <div className="mb-8">

        <h2 className="text-2xl font-bold text-orange-700 mb-6 flex items-center gap-2">

          <Star className="h-6 w-6" /> Featured Activities

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700 flex items-center gap-2">

                <Home className="h-5 w-5" /> Family Tree Creation

              </CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-gray-700 mb-3">

                Children create visual family trees showing their family members and relationships, celebrating diverse

                family structures.

              </p>

              <div className="space-y-2 mb-4">

                <div className="flex items-center gap-2">

                  <span className="text-sm font-medium text-gray-600">Materials:</span>

                  <span className="text-sm text-gray-700">Construction paper, family photos, glue, markers</span>

                </div>

                <div className="flex items-center gap-2">

                  <span className="text-sm font-medium text-gray-600">Time:</span>

                  <span className="text-sm text-gray-700">45 minutes</span>

                </div>

              </div>

              <div className="flex flex-wrap gap-2">

                <Badge className="bg-orange-100 text-orange-800">Social Studies</Badge>

                <Badge className="bg-blue-100 text-blue-800">Art</Badge>

                <Badge className="bg-purple-100 text-purple-800">Math</Badge>

              </div>

            </CardContent>

          </Card>



          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700 flex items-center gap-2">

                <Users className="h-5 w-5" /> Family Traditions Show & Tell

              </CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-gray-700 mb-3">

                Interactive presentation where children share their family's special traditions, foods, and celebrations

                with the class.

              </p>

              <div className="space-y-2 mb-4">

                <div className="flex items-center gap-2">

                  <span className="text-sm font-medium text-gray-600">Materials:</span>

                  <span className="text-sm text-gray-700">Family artifacts, photos, traditional items</span>

                </div>

                <div className="flex items-center gap-2">

                  <span className="text-sm font-medium text-gray-600">Time:</span>

                  <span className="text-sm text-gray-700">30 minutes</span>

                </div>

              </div>

              <div className="flex flex-wrap gap-2">

                <Badge className="bg-orange-100 text-orange-800">Social Studies</Badge>

                <Badge className="bg-green-100 text-green-800">Language Arts</Badge>

                <Badge className="bg-yellow-100 text-yellow-800">Cultural Studies</Badge>

              </div>

            </CardContent>

          </Card>



          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700 flex items-center gap-2">

                <Heart className="h-5 w-5" /> Family Helper Chart

              </CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-gray-700 mb-3">

                Collaborative chart-making activity where children identify and organize different ways family members

                help each other at home.

              </p>

              <div className="space-y-2 mb-4">

                <div className="flex items-center gap-2">

                  <span className="text-sm font-medium text-gray-600">Materials:</span>

                  <span className="text-sm text-gray-700">Chart paper, markers, picture cards, stickers</span>

                </div>

                <div className="flex items-center gap-2">

                  <span className="text-sm font-medium text-gray-600">Time:</span>

                  <span className="text-sm text-gray-700">40 minutes</span>

                </div>

              </div>

              <div className="flex flex-wrap gap-2">

                <Badge className="bg-orange-100 text-orange-800">Social Studies</Badge>

                <Badge className="bg-purple-100 text-purple-800">Math</Badge>

                <Badge className="bg-pink-100 text-pink-800">Life Skills</Badge>

              </div>

            </CardContent>

          </Card>



          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700 flex items-center gap-2">

                <BookOpen className="h-5 w-5" /> Family Story Book

              </CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-gray-700 mb-3">

                Children create personalized books featuring their family stories, memories, and special moments through

                drawings and dictated text.

              </p>

              <div className="space-y-2 mb-4">

                <div className="flex items-center gap-2">

                  <span className="text-sm font-medium text-gray-600">Materials:</span>

                  <span className="text-sm text-gray-700">Paper, crayons, binding materials, family photos</span>

                </div>

                <div className="flex items-center gap-2">

                  <span className="text-sm font-medium text-gray-600">Time:</span>

                  <span className="text-sm text-gray-700">50 minutes</span>

                </div>

              </div>

              <div className="flex flex-wrap gap-2">

                <Badge className="bg-green-100 text-green-800">Language Arts</Badge>

                <Badge className="bg-blue-100 text-blue-800">Art</Badge>

                <Badge className="bg-orange-100 text-orange-800">Social Studies</Badge>

              </div>

            </CardContent>

          </Card>

        </div>

      </div>



      <div className="mb-8">

        <h2 className="text-2xl font-bold text-orange-700 mb-6 flex items-center gap-2">

          <FileText className="h-6 w-6" /> Resources

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card className="border-blue-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-blue-50">

              <CardTitle className="text-blue-700 flex items-center gap-2">

                <BookOpen className="h-5 w-5" /> Books

              </CardTitle>

            </CardHeader>

            <CardContent>

              <ul className="space-y-2 text-sm text-gray-700">

                <li>• "So Much" by Trish Cooke</li>

                <li>• "The Family Book" by Todd Parr</li>

                <li>• "Oonga Boonga" by Frieda Wishinsky</li>

                <li>• "Love You Forever" by Robert Munsch</li>

                <li>• "Families Are Different and Alike" by Bobbie Kalman</li>

                <li>• "Tell Me Again About the Night I Was Born" by Jamie Lee Curtis</li>

                <li>• "The Relatives Came" by Cynthia Rylant</li>

                <li>• "Family Pictures" by Carmen Lomas Garza</li>

              </ul>

              <Button

                variant="outline"

                className="border-blue-300 text-blue-700 hover:bg-blue-50 w-full mt-4 bg-transparent"

              >

                <Download className="mr-2 h-4 w-4" /> Reading List PDF

              </Button>

            </CardContent>

          </Card>



          <Card className="border-purple-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-purple-50">

              <CardTitle className="text-purple-700 flex items-center gap-2">

                <Palette className="h-5 w-5" /> Printables

              </CardTitle>

            </CardHeader>

            <CardContent>

              <ul className="space-y-2 text-sm text-gray-700">

                <li>• Family tree templates</li>

                <li>• Family member vocabulary cards</li>

                <li>• "I Can Help" coupon book template</li>

                <li>• Family traditions worksheet</li>

                <li>• Family story book pages</li>

                <li>• Family helper chart template</li>

                <li>• Family counting worksheets</li>

                <li>• Family photo frames</li>

              </ul>

              <Button

                variant="outline"

                className="border-purple-300 text-purple-700 hover:bg-purple-50 w-full mt-4 bg-transparent"

              >

                <Download className="mr-2 h-4 w-4" /> Download All

              </Button>

            </CardContent>

          </Card>



          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700 flex items-center gap-2">

                <LinkIcon className="h-5 w-5" /> Home Connection

              </CardTitle>

            </CardHeader>

            <CardContent>

              <ul className="space-y-2 text-sm text-gray-700">

                <li>• Family interview questions</li>

                <li>• Family tradition sharing guide</li>

                <li>• Family photo collection tips</li>

                <li>• Home helper activities</li>

                <li>• Family story prompts</li>

                <li>• Weekend family activities</li>

                <li>• Family vocabulary practice</li>

                <li>• Cultural celebration ideas</li>

              </ul>

              <Button

                variant="outline"

                className="border-green-300 text-green-700 hover:bg-green-50 w-full mt-4 bg-transparent"

              >

                <Download className="mr-2 h-4 w-4" /> Family Pack

              </Button>

            </CardContent>

          </Card>

        </div>

      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        <Card className="border-orange-200 shadow-sm hover:shadow-md transition-shadow">

          <CardHeader className="bg-orange-50">

            <CardTitle className="text-orange-700">Assessment Strategies</CardTitle>

          </CardHeader>

          <CardContent>

            <div className="space-y-3 mt-2">

              <div className="flex items-start gap-2">

                <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">

                  1

                </div>

                <div>

                  <p className="font-medium text-orange-800">Family Drawings</p>

                  <p className="text-gray-700">

                    Collect and analyze children's family drawings to assess understanding of family structures.

                  </p>

                </div>

              </div>

              <div className="flex items-start gap-2">

                <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">

                  2

                </div>

                <div>

                  <p className="font-medium text-orange-800">Vocabulary Assessment</p>

                  <p className="text-gray-700">

                    Document children's use of family-related vocabulary during discussions and activities.

                  </p>

                </div>

              </div>

              <div className="flex items-start gap-2">

                <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">

                  3

                </div>

                <div>

                  <p className="font-medium text-orange-800">Story Retelling</p>

                  <p className="text-gray-700">

                    Observe children's ability to sequence and retell family stories using appropriate vocabulary.

                  </p>

                </div>

              </div>

              <div className="flex items-start gap-2">

                <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">

                  4

                </div>

                <div>

                  <p className="font-medium text-orange-800">Counting Skills</p>

                  <p className="text-gray-700">

                    Assess children's ability to count family members and compare family sizes using math vocabulary.

                  </p>

                </div>

              </div>

              <div className="flex items-start gap-2">

                <div className="bg-orange-100 text-orange-800 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">

                  5

                </div>

                <div>

                  <p className="font-medium text-orange-800">Social Understanding</p>

                  <p className="text-gray-700">

                    Document children's understanding of family roles, responsibilities, and caring behaviors.

                  </p>

                </div>

              </div>

            </div>

            <div className="mt-4">

              <Button

                variant="outline"

                className="border-orange-300 text-orange-700 hover:bg-orange-50 w-full bg-transparent"

              >

                <Download className="mr-2 h-4 w-4" /> Assessment Rubric PDF

              </Button>

            </div>

          </CardContent>

        </Card>



        <Card className="border-orange-200 shadow-sm hover:shadow-md transition-shadow">

          <CardHeader className="bg-orange-50">

            <CardTitle className="text-orange-700">Home Connection</CardTitle>

          </CardHeader>

          <CardContent>

            <div className="bg-white p-4 rounded-lg border border-orange-100 mb-4">

              <h4 className="font-semibold text-orange-800 mb-2">Family Engagement Ideas</h4>

              <p className="text-gray-700 mb-3">

                Send home activities that encourage families to share their stories and traditions:

              </p>

              <ul className="list-disc pl-5 space-y-2 text-gray-700">

                <li>Create a family photo album together</li>

                <li>Share stories about family traditions and celebrations</li>

                <li>Cook a special family recipe together</li>

                <li>Interview grandparents or older family members</li>

                <li>Practice family helper activities at home</li>

              </ul>

            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">

              <h4 className="font-semibold text-yellow-800 mb-2">Cultural Sensitivity</h4>

              <ul className="list-disc pl-5 space-y-1 text-yellow-700">

                <li>Celebrate all types of family structures</li>

                <li>Include diverse cultural traditions and celebrations</li>

                <li>Provide materials in multiple languages when possible</li>

                <li>Be sensitive to children who may not have traditional family photos</li>

                <li>Focus on love and care rather than family structure</li>

              </ul>

            </div>

            <div className="mt-4">

              <Button

                variant="outline"

                className="border-orange-300 text-orange-700 hover:bg-orange-50 w-full bg-transparent"

              >

                <Download className="mr-2 h-4 w-4" /> Family Activity Pack

              </Button>

            </div>

          </CardContent>

        </Card>

      </div>

    </div>

  )

}
