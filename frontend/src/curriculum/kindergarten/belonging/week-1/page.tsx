import { Link } from "react-router-dom"

// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

import { Button } from "@/components/ui/button"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ChevronLeft, Heart, Calendar, Download, Lightbulb, BookOpen, Pencil, Music, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"



export default function BelongingUnitWeek1() {

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

            <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-100 px-3 py-1 text-sm">Week 1</Badge>

            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 px-3 py-1 text-sm">

              Belonging Unit

            </Badge>

          </div>

          <h1 className="text-4xl font-bold mb-4 text-pink-700 flex items-center gap-3">

            <Heart className="h-8 w-8" /> Week 1: All About Me

          </h1>

          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg mb-6 border border-pink-100 shadow-sm">

            <h2 className="text-xl font-semibold mb-2 text-pink-700">Weekly Focus</h2>

            <p className="text-lg">

              Children explore their own identities, including their names, physical characteristics, likes and

              dislikes, and what makes them special and unique.

            </p>

          </div>



          <div className="flex flex-wrap gap-3 mb-6">

            <Button

              variant="outline"

              className="border-pink-300 text-pink-700 hover:bg-pink-50 flex items-center gap-2 bg-transparent"

            >

              <Calendar className="h-4 w-4" /> Week Plan PDF

            </Button>

            <Button

              variant="outline"

              className="border-pink-300 text-pink-700 hover:bg-pink-50 flex items-center gap-2 bg-transparent"

            >

              <Download className="h-4 w-4" /> All Materials

            </Button>

            <Link to="/kindergarten-planner">

              <Button

                variant="outline"

                className="border-pink-300 text-pink-700 hover:bg-pink-50 flex items-center gap-2 bg-transparent"

              >

                <Calendar className="h-4 w-4" /> Plan your Lesson

              </Button>

            </Link>

            <Link to="/curriculum/kindergarten/belonging/week-2">

              <Button

                variant="outline"

                className="border-pink-300 text-pink-700 hover:bg-pink-50 flex items-center gap-2 bg-transparent"

              >

                Next Week <ChevronLeft className="h-4 w-4 rotate-180" />

              </Button>

            </Link>

          </div>

        </div>

        <div className="md:w-1/3">

          <Card className="border-pink-200 shadow-md overflow-hidden">

            <div className="h-48 bg-gradient-to-r from-pink-400 to-purple-400 relative">

              <div className="absolute inset-0 flex items-center justify-center p-2">

                <img src="/kindergarten-self-portraits.png" alt="Children creating self portraits" className="w-full h-full object-cover" />

              </div>

            </div>

            <CardHeader className="bg-white">

              <CardTitle className="text-pink-700">Week at a Glance</CardTitle>

              <CardDescription>Daily themes for Week 1</CardDescription>

            </CardHeader>

            <CardContent>

              <ul className="space-y-2">

                <li className="flex items-center gap-2 text-pink-800">

                  <Badge className="bg-pink-100 text-pink-800">Monday</Badge>

                  <span>My Name is Special</span>

                </li>

                <li className="flex items-center gap-2 text-pink-800">

                  <Badge className="bg-pink-100 text-pink-800">Tuesday</Badge>

                  <span>What I Look Like</span>

                </li>

                <li className="flex items-center gap-2 text-pink-800">

                  <Badge className="bg-pink-100 text-pink-800">Wednesday</Badge>

                  <span>Things I Like</span>

                </li>

                <li className="flex items-center gap-2 text-pink-800">

                  <Badge className="bg-pink-100 text-pink-800">Thursday</Badge>

                  <span>Things I Can Do</span>

                </li>

                <li className="flex items-center gap-2 text-pink-800">

                  <Badge className="bg-pink-100 text-pink-800">Friday</Badge>

                  <span>I Am Special</span>

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

          Before beginning this week, gather photos of each child (if possible) and create a display area for "All About

          Me" projects. Consider sending a note home asking families to share something special about their child's name

          or identity.

        </AlertDescription>

      </Alert>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <Card className="border-pink-200 shadow-sm hover:shadow-md transition-shadow">

          <CardHeader className="bg-pink-50">

            <CardTitle className="text-pink-700 flex items-center gap-2">

              <BookOpen className="h-5 w-5" /> Learning Objectives

            </CardTitle>

          </CardHeader>

          <CardContent>

            <ul className="list-disc pl-5 space-y-1 mt-2">

              <li>Recognize and write their own name</li>

              <li>Identify and describe physical characteristics</li>

              <li>Express likes and dislikes</li>

              <li>Understand that everyone is unique and special</li>

              <li>Practice counting and number recognition 1-5</li>

              <li>Develop vocabulary related to self-identity</li>

            </ul>

          </CardContent>

        </Card>



        <Card className="border-pink-200 shadow-sm hover:shadow-md transition-shadow">

          <CardHeader className="bg-pink-50">

            <CardTitle className="text-pink-700 flex items-center gap-2">

              <Pencil className="h-5 w-5" /> Key Vocabulary

            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="grid grid-cols-2 gap-2 mt-2">

              <div className="bg-white p-2 rounded border border-pink-100">

                <span className="font-medium text-pink-700">Name</span>

              </div>

              <div className="bg-white p-2 rounded border border-pink-100">

                <span className="font-medium text-pink-700">Special</span>

              </div>

              <div className="bg-white p-2 rounded border border-pink-100">

                <span className="font-medium text-pink-700">Unique</span>

              </div>

              <div className="bg-white p-2 rounded border border-pink-100">

                <span className="font-medium text-pink-700">Like/Dislike</span>

              </div>

              <div className="bg-white p-2 rounded border border-pink-100">

                <span className="font-medium text-pink-700">Characteristics</span>

              </div>

              <div className="bg-white p-2 rounded border border-pink-100">

                <span className="font-medium text-pink-700">Identity</span>

              </div>

              <div className="bg-white p-2 rounded border border-pink-100">

                <span className="font-medium text-pink-700">Self</span>

              </div>

              <div className="bg-white p-2 rounded border border-pink-100">

                <span className="font-medium text-pink-700">Similar/Different</span>

              </div>

            </div>

          </CardContent>

        </Card>



        <Card className="border-pink-200 shadow-sm hover:shadow-md transition-shadow">

          <CardHeader className="bg-pink-50">

            <CardTitle className="text-pink-700 flex items-center gap-2">

              <Music className="h-5 w-5" /> Materials Needed

            </CardTitle>

          </CardHeader>

          <CardContent>

            <ul className="list-disc pl-5 space-y-1 mt-2">

              <li>Chart paper and markers</li>

              <li>Mirrors</li>

              <li>Art supplies (crayons, paper, scissors, glue)</li>

              <li>Name cards for each child</li>

              <li>Camera for documentation</li>

              <li>Books about self-identity</li>

              <li>Measuring tape/scale</li>

              <li>Paper plates, yarn, buttons (for face crafts)</li>

            </ul>

          </CardContent>

        </Card>

      </div>



      <Tabs defaultValue="monday" className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-pink-700 flex items-center">

          <Calendar className="mr-2 h-6 w-6" /> Daily Plans

        </h2>

        <TabsList className="grid grid-cols-5 mb-4">

          <TabsTrigger value="monday" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800">

            Monday

          </TabsTrigger>

          <TabsTrigger value="tuesday" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800">

            Tuesday

          </TabsTrigger>

          <TabsTrigger value="wednesday" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800">

            Wednesday

          </TabsTrigger>

          <TabsTrigger value="thursday" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800">

            Thursday

          </TabsTrigger>

          <TabsTrigger value="friday" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800">

            Friday

          </TabsTrigger>

        </TabsList>



        <TabsContent value="monday">

          <Card className="border-pink-200 shadow-md">

            <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 rounded-t-lg">

              <div className="flex justify-between items-center">

                <h3 className="text-xl font-bold">Monday: My Name is Special</h3>

                <Badge className="bg-white text-pink-700">Day 1</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">

                  <h4 className="font-semibold text-pink-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-pink-700 text-lg italic">What makes my name special?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"Chrysanthemum" by Kevin Henkes</li>

                    <li>"The Name Jar" by Yangsook Choi</li>

                    <li>"My Name Is Yoon" by Helen Recorvits</li>

                  </ul>

                </div>

              </div>



              <div className="space-y-6">

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      1

                    </div>

                    <h4 className="font-semibold text-pink-800">Morning Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Introduce the theme "All About Me." Discuss how everyone has a special name. Read the book

                      "Chrysanthemum" by Kevin Henkes or a similar book about names.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> As you read, pause to ask children how Chrysanthemum feels at

                        different points in the story. Connect to how children feel about their own names.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-pink-800">Literacy Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Name recognition and writing practice. Children identify their name cards and practice writing

                      their names using various materials (markers, crayons, finger paint, etc.).

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Name cards

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Markers/crayons

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Finger paint

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Writing paper

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-pink-800">Math Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Count the letters in each child's name. Create a graph showing how many letters are in each

                      child's name. Identify which names have the most/least letters.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> For advanced students, calculate the average number of letters in

                        the class names, or sort names by first letter and create a bar graph.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-pink-800">Art Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Name art: Children decorate their names using various art materials. They can use fingerprints,

                      stickers, or drawings that represent things they like.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-name-art-example.png" alt="Name art example" className="w-auto h-auto" />

                      <img src="/kindergarten-decorated-name.png" alt="Decorated name example" className="w-auto h-auto" />

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      5

                    </div>

                    <h4 className="font-semibold text-pink-800">Closing Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Share name art and discuss what makes each name special. Sing a name song that incorporates each

                      child's name.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What did you learn about your name today?</li>

                        <li>How does your name make you special?</li>

                        <li>What did you notice about other children's names?</li>

                      </ul>

                    </div>

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

        </TabsContent>



        <TabsContent value="tuesday">

          <Card className="border-pink-200 shadow-md">

            <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 rounded-t-lg">

              <div className="flex justify-between items-center">

                <h3 className="text-xl font-bold">Tuesday: What I Look Like</h3>

                <Badge className="bg-white text-pink-700">Day 2</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">

                  <h4 className="font-semibold text-pink-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-pink-700 text-lg italic">What makes me unique on the outside?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"The Colors of Us" by Karen Katz</li>

                    <li>"All the Colors We Are" by Katie Kissinger</li>

                    <li>"I'm Like You, You're Like Me" by Cindy Gainer</li>

                  </ul>

                </div>

              </div>



              <div className="space-y-6">

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      1

                    </div>

                    <h4 className="font-semibold text-pink-800">Morning Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Discuss physical characteristics (hair color, eye color, height, etc.). Read "The Colors of Us" by

                      Karen Katz or a similar book about physical characteristics.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Use inclusive language that celebrates diversity. Emphasize that

                        our differences make us special and that everyone is beautiful in their own way.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-pink-800">Science Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Using mirrors, children observe and describe their physical features. Measure and record each

                      child's height and discuss how everyone grows.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Hand mirrors

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Measuring tape

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Chart paper

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Growth chart

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-pink-800">Math Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Create a class graph of eye colors or hair colors. Count how many children have each color and

                      compare which has the most/least.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-eye-color-graph.png" alt="Eye color graph example" className="w-auto h-auto" />

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-pink-800">Art Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Self-portrait: Children create self-portraits using paper plates, yarn, buttons, and other

                      materials. Encourage them to include details that make them unique.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Provide a variety of skin-colored materials (paint, paper, crayons)

                        in diverse shades so children can accurately represent themselves.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      5

                    </div>

                    <h4 className="font-semibold text-pink-800">Closing Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Share self-portraits and discuss how everyone looks different and that's what makes us special.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What did you notice about yourself in the mirror?</li>

                        <li>How are you similar to or different from your friends?</li>

                        <li>What is your favorite thing about how you look?</li>

                      </ul>

                    </div>

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

        </TabsContent>



        <TabsContent value="wednesday">

          <Card className="border-pink-200 shadow-md">

            <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 rounded-t-lg">

              <div className="flex justify-between items-center">

                <h3 className="text-xl font-bold">Wednesday: Things I Like</h3>

                <Badge className="bg-white text-pink-700">Day 3</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">

                  <h4 className="font-semibold text-pink-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-pink-700 text-lg italic">What are my favorite things?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"My Favorite Things" by Gyo Fujikawa</li>

                    <li>"The Important Book" by Margaret Wise Brown</li>

                    <li>"I Like Me!" by Nancy Carlson</li>

                  </ul>

                </div>

              </div>



              <div className="space-y-6">

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      1

                    </div>

                    <h4 className="font-semibold text-pink-800">Morning Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Discuss favorite things (foods, colors, activities, toys). Read "My Favorite Things" or sing the

                      song. Create a class chart of favorite things.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Encourage children to think beyond toys - include favorite foods,

                        places, people, activities, and experiences.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-pink-800">Literacy Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      "All About Me" collage: Children cut out pictures from magazines or draw pictures of their

                      favorite things. Practice writing simple words like "I like..."

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Magazines

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Scissors

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Glue sticks

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Material:</strong> Construction paper

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-pink-800">Math Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Sorting and graphing favorite colors. Create a class graph showing which colors are most/least

                      popular. Count and compare results.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Use colored blocks or manipulatives to create 3D graphs. Discuss

                        concepts of more, less, and equal.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-pink-800">Creative Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      "My Favorite Things" book: Children create a simple book with drawings and words about their

                      favorite things. Include favorite food, color, toy, and activity.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-favorite-things-book.png" alt="Favorite things book example" className="w-auto h-auto" />

                      <img src="/kindergarten-likes-collage.png" alt="Likes collage example" className="w-auto h-auto" />

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      5

                    </div>

                    <h4 className="font-semibold text-pink-800">Closing Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Share favorite things books and discuss similarities and differences in preferences. Celebrate

                      that everyone has different favorites.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What is your most favorite thing and why?</li>

                        <li>Did you discover any new favorites today?</li>

                        <li>How are your favorites similar to or different from your friends'?</li>

                      </ul>

                    </div>

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

        </TabsContent>



        <TabsContent value="thursday">

          <Card className="border-pink-200 shadow-md">

            <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 rounded-t-lg">

              <div className="flex justify-between items-center">

                <h3 className="text-xl font-bold">Thursday: Things I Can Do</h3>

                <Badge className="bg-white text-pink-700">Day 4</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">

                  <h4 className="font-semibold text-pink-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-pink-700 text-lg italic">What special abilities do I have?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"I Can Do It Too!" by Karen Baicker</li>

                    <li>"The Little Engine That Could" by Watty Piper</li>

                    <li>"Giraffes Can't Dance" by Giles Andreae</li>

                  </ul>

                </div>

              </div>



              <div className="space-y-6">

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      1

                    </div>

                    <h4 className="font-semibold text-pink-800">Morning Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Discuss different abilities and skills. Read "I Can Do It Too!" and talk about things children can

                      do now that they couldn't do when they were babies.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> Focus on growth mindset - emphasize that everyone is learning and

                        getting better at different things. Include both physical and academic abilities.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-pink-800">Physical Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      "I Can" movement activities: Children demonstrate physical abilities like hopping, skipping,

                      balancing, clapping patterns, and fine motor skills.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Activity:</strong> Balance beam

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Activity:</strong> Hopping course

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Activity:</strong> Clapping patterns

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Activity:</strong> Fine motor tasks

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-pink-800">Math Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Counting abilities: Count how many jumping jacks, hops, or claps each child can do. Create simple

                      tally charts and compare numbers.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Introduce concepts of estimation - have children guess how many they

                        can do before counting, then compare estimates to actual results.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-pink-800">Literacy Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      "I Can" booklet: Children create a booklet with drawings and simple sentences about things they

                      can do. Include both current abilities and goals for learning.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-i-can-booklet.png" alt="I can booklet example" className="w-auto h-auto" />

                      <img src="/kindergarten-abilities-chart.png" alt="Abilities chart example" className="w-auto h-auto" />

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      5

                    </div>

                    <h4 className="font-semibold text-pink-800">Closing Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Share "I Can" booklets and celebrate each child's unique abilities. Discuss how everyone has

                      different strengths and that's wonderful.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What is something new you learned you could do today?</li>

                        <li>What would you like to learn to do better?</li>

                        <li>How did it feel to share your abilities with friends?</li>

                      </ul>

                    </div>

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

        </TabsContent>



        <TabsContent value="friday">

          <Card className="border-pink-200 shadow-md">

            <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 rounded-t-lg">

              <div className="flex justify-between items-center">

                <h3 className="text-xl font-bold">Friday: I Am Special</h3>

                <Badge className="bg-white text-pink-700">Day 5</Badge>

              </div>

            </div>

            <CardContent className="pt-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">

                  <h4 className="font-semibold text-pink-800 mb-2 flex items-center gap-2">

                    <Users className="h-4 w-4" /> Focus Question

                  </h4>

                  <p className="text-pink-700 text-lg italic">What makes me special and unique?</p>

                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">

                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">

                    <BookOpen className="h-4 w-4" /> Suggested Books

                  </h4>

                  <ul className="text-blue-700 space-y-1">

                    <li>"The Way I Feel" by Janan Cain</li>

                    <li>"Stand Tall, Molly Lou Melon" by Patty Lovell</li>

                    <li>"Amazing You!" by Gail Saltz</li>

                  </ul>

                </div>

              </div>



              <div className="space-y-6">

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      1

                    </div>

                    <h4 className="font-semibold text-pink-800">Morning Circle</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Review the week's learning about self-identity. Read "Stand Tall, Molly Lou Melon" and discuss how

                      being different makes us special.

                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-3 mt-2">

                      <p className="text-sm text-yellow-800">

                        <strong>Teacher Tip:</strong> This is a perfect time to reinforce positive self-image and

                        celebrate diversity. Help children see that their unique qualities are strengths.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      2

                    </div>

                    <h4 className="font-semibold text-pink-800">Culminating Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      "All About Me" presentation: Children share their work from the week (name art, self-portraits,

                      favorite things, abilities) with the class.

                    </p>

                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Display:</strong> Name art

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Display:</strong> Self-portraits

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Display:</strong> Favorite things

                      </div>

                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-200">

                        <strong>Display:</strong> I Can booklets

                      </div>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      3

                    </div>

                    <h4 className="font-semibold text-pink-800">Social-Emotional Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      "Compliment Circle": Children sit in a circle and give each other genuine compliments about what

                      makes them special. Teacher models appropriate compliments.

                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-300 p-3 mt-2">

                      <p className="text-sm text-blue-800">

                        <strong>Extension:</strong> Create a "Special Qualities" chart for the classroom where children

                        can add positive observations about their classmates throughout the year.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      4

                    </div>

                    <h4 className="font-semibold text-pink-800">Creative Activity</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      "I Am Special" crown or badge: Children create and decorate a crown or special badge that

                      represents their uniqueness. Include their name and special qualities.

                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <img src="/kindergarten-special-crown-craft.png" alt="Special crown example" className="w-auto h-auto" />

                      <img src="/kindergarten-i-am-special-badge.png" alt="Special badge example" className="w-auto h-auto" />

                    </div>

                  </div>

                </div>



                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">

                  <div className="flex items-center gap-2 mb-2">

                    <div className="bg-pink-100 text-pink-800 w-8 h-8 rounded-full flex items-center justify-center font-bold">

                      5

                    </div>

                    <h4 className="font-semibold text-pink-800">Closing Celebration</h4>

                  </div>

                  <div className="pl-10">

                    <p>

                      Week 1 celebration: Children wear their special crowns/badges and share one thing they learned

                      about themselves this week. Sing "I Am Special" song together.

                    </p>

                    <div className="bg-purple-50 border-l-4 border-purple-300 p-3 mt-2">

                      <p className="text-sm text-purple-800">

                        <strong>Reflection Questions:</strong>

                      </p>

                      <ul className="text-sm text-purple-800 list-disc pl-5 mt-1">

                        <li>What is the most important thing you learned about yourself this week?</li>

                        <li>How do you feel about being unique and special?</li>

                        <li>What are you excited to learn about your family next week?</li>

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

        <h2 className="text-2xl font-bold mb-6 text-pink-700 flex items-center gap-3">

          <Heart className="h-6 w-6" /> Featured Activities

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700 flex items-center gap-2">

                <Users className="h-5 w-5" /> All About Me Collage

              </CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-gray-700 mb-3">

                Children create a personal collage using magazine cutouts, drawings, and photos that represent their

                interests, family, and favorite things.

              </p>

              <div className="mb-3">

                <p className="font-medium text-green-800 mb-1">Materials:</p>

                <p className="text-sm text-gray-600">

                  Magazines, scissors, glue, construction paper, crayons, family photos

                </p>

              </div>

              <div className="flex flex-wrap gap-1">

                <Badge className="bg-blue-100 text-blue-800 text-xs">Art</Badge>

                <Badge className="bg-purple-100 text-purple-800 text-xs">Language</Badge>

                <Badge className="bg-orange-100 text-orange-800 text-xs">Social Studies</Badge>

              </div>

            </CardContent>

          </Card>



          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700 flex items-center gap-2">

                <BookOpen className="h-5 w-5" /> Name Detective Game

              </CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-gray-700 mb-3">

                Interactive game where children find their names among others, count letters, and identify beginning

                sounds while learning about name origins.

              </p>

              <div className="mb-3">

                <p className="font-medium text-green-800 mb-1">Materials:</p>

                <p className="text-sm text-gray-600">Name cards, magnifying glasses, letter tiles, clipboards</p>

              </div>

              <div className="flex flex-wrap gap-1">

                <Badge className="bg-red-100 text-red-800 text-xs">Literacy</Badge>

                <Badge className="bg-yellow-100 text-yellow-800 text-xs">Math</Badge>

                <Badge className="bg-green-100 text-green-800 text-xs">Investigation</Badge>

              </div>

            </CardContent>

          </Card>



          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700 flex items-center gap-2">

                <Music className="h-5 w-5" /> "I Can" Talent Show

              </CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-gray-700 mb-3">

                Children demonstrate their special abilities and talents in a supportive classroom setting, building

                confidence and celebrating diversity.

              </p>

              <div className="mb-3">

                <p className="font-medium text-green-800 mb-1">Materials:</p>

                <p className="text-sm text-gray-600">

                  Simple props, music player, "I Can" certificates, camera for documentation

                </p>

              </div>

              <div className="flex flex-wrap gap-1">

                <Badge className="bg-pink-100 text-pink-800 text-xs">Performance</Badge>

                <Badge className="bg-blue-100 text-blue-800 text-xs">Confidence</Badge>

                <Badge className="bg-purple-100 text-purple-800 text-xs">Social Skills</Badge>

              </div>

            </CardContent>

          </Card>



          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700 flex items-center gap-2">

                <Pencil className="h-5 w-5" /> Fingerprint Art Gallery

              </CardTitle>

            </CardHeader>

            <CardContent>

              <p className="text-gray-700 mb-3">

                Explore uniqueness through fingerprint art, creating characters and designs while learning that

                everyone's fingerprints are different and special.

              </p>

              <div className="mb-3">

                <p className="font-medium text-green-800 mb-1">Materials:</p>

                <p className="text-sm text-gray-600">

                  Ink pads, paper, fine-tip markers, magnifying glasses, wet wipes

                </p>

              </div>

              <div className="flex flex-wrap gap-1">

                <Badge className="bg-orange-100 text-orange-800 text-xs">Science</Badge>

                <Badge className="bg-blue-100 text-blue-800 text-xs">Art</Badge>

                <Badge className="bg-green-100 text-green-800 text-xs">Discovery</Badge>

              </div>

            </CardContent>

          </Card>

        </div>

      </div>



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-6 text-pink-700 flex items-center gap-3">

          <BookOpen className="h-6 w-6" /> Resources

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card className="border-blue-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-blue-50">

              <CardTitle className="text-blue-700 flex items-center gap-2">

                <BookOpen className="h-5 w-5" /> Books

              </CardTitle>

            </CardHeader>

            <CardContent>

              <ul className="space-y-2 text-sm">

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>"The Name Jar" by Yangsook Choi</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>"I Like Myself!" by Karen Beaumont</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>"The Way I Am" by Lynda Barry</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>"All About Me" by Catherine Bruzzone</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>"My Name is Not Isabella" by Jennifer Fosberry</span>

                </li>

              </ul>

              <Button

                variant="outline"

                className="border-blue-300 text-blue-700 hover:bg-blue-50 w-full mt-4 bg-transparent"

              >

                <Download className="mr-2 h-4 w-4" /> Book List PDF

              </Button>

            </CardContent>

          </Card>



          <Card className="border-purple-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-purple-50">

              <CardTitle className="text-purple-700 flex items-center gap-2">

                <Pencil className="h-5 w-5" /> Printables

              </CardTitle>

            </CardHeader>

            <CardContent>

              <ul className="space-y-2 text-sm">

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Name tracing worksheets</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>"All About Me" booklet template</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Self-portrait drawing frames</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>"I Can" achievement certificates</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Favorite things sorting mats</span>

                </li>

              </ul>

              <Button

                variant="outline"

                className="border-purple-300 text-purple-700 hover:bg-purple-50 w-full mt-4 bg-transparent"

              >

                <Download className="mr-2 h-4 w-4" /> Download All

              </Button>

            </CardContent>

          </Card>



          <Card className="border-orange-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-orange-50">

              <CardTitle className="text-orange-700 flex items-center gap-2">

                <Users className="h-5 w-5" /> Home Connection

              </CardTitle>

            </CardHeader>

            <CardContent>

              <ul className="space-y-2 text-sm">

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Family interview questions</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Name story sharing template</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Photo sharing guidelines</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Weekly vocabulary cards</span>

                </li>

                <li className="flex items-start gap-2">

                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>

                  <span>Extension activity suggestions</span>

                </li>

              </ul>

              <Button

                variant="outline"

                className="border-orange-300 text-orange-700 hover:bg-orange-50 w-full mt-4 bg-transparent"

              >

                <Download className="mr-2 h-4 w-4" /> Family Pack

              </Button>

            </CardContent>

          </Card>

        </div>

      </div>

    </div>

  )

}
