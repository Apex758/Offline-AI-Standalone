import { Link } from "react-router-dom"

// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

import { Button } from "@/components/ui/button"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Badge } from "@/components/ui/badge"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import {

  ChevronLeft,

  Download,

  Calendar,

  Users,

  BookOpen,

  Lightbulb,

  Star,

  CheckCircle2,

  School,

  Pencil,

  Music,

} from "lucide-react"



export default function BelongingUnitWeek3() {

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

            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1 text-sm">Week 3</Badge>

            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1 text-sm">Belonging Unit</Badge>

          </div>

          <h1 className="text-4xl font-bold mb-4 text-green-700 flex items-center gap-3">

            <School className="h-8 w-8" /> Week 3: My School

          </h1>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg mb-6 border border-green-100 shadow-sm">

            <h2 className="text-xl font-semibold mb-2 text-green-700">Weekly Focus</h2>

            <p className="text-lg">

              Children explore their school environment, the people who work there, classroom rules and routines, and

              how to be a good friend and classmate.

            </p>

          </div>



          <div className="flex flex-wrap gap-3 mb-6">

            <Button

              variant="outline"

              className="border-green-300 text-green-700 hover:bg-green-50 flex items-center gap-2 bg-transparent"

            >

              <Calendar className="h-4 w-4" /> Week Plan PDF

            </Button>

            <Button

              variant="outline"

              className="border-green-300 text-green-700 hover:bg-green-50 flex items-center gap-2 bg-transparent"

            >

              <Download className="h-4 w-4" /> All Materials

            </Button>

            <Link to="/kindergarten-planner">

              <Button

                variant="outline"

                className="border-green-300 text-green-700 hover:bg-green-50 flex items-center gap-2 bg-transparent"

              >

                <Calendar className="h-4 w-4" /> Plan your Lesson

              </Button>

            </Link>

            <Link to="/curriculum/kindergarten/belonging/week-2">

              <Button

                variant="outline"

                className="border-green-300 text-green-700 hover:bg-green-50 flex items-center gap-2 bg-transparent"

              >

                <ChevronLeft className="h-4 w-4" /> Previous Week

              </Button>

            </Link>

            <Link to="/curriculum/kindergarten/belonging/week-4">

              <Button

                variant="outline"

                className="border-green-300 text-green-700 hover:bg-green-50 flex items-center gap-2 bg-transparent"

              >

                Next Week <ChevronLeft className="h-4 w-4 rotate-180" />

              </Button>

            </Link>

          </div>

        </div>

        <div className="md:w-1/3">

          <Card className="border-green-200 shadow-md overflow-hidden">

            <div className="h-48 bg-gradient-to-r from-pink-400 to-purple-400 relative">

              <div className="absolute inset-0 flex items-center justify-center p-2">

                <img src="./kindergarten-my-school.png" alt="Children’s crayon drawings around the words “WEEKLY FOCUS,” showing school scenes, classmates, teachers, rules, and friendship." className="w-full h-full object-cover" />

              </div>

            </div>

            <CardHeader className="bg-white">

              <CardTitle className="text-green-700">Week at a Glance</CardTitle>

              <CardDescription>Daily themes for Week 3</CardDescription>

            </CardHeader>

            <CardContent>

              <ul className="space-y-2">

                <li className="flex items-center gap-2 text-green-800">

                  <Badge className="bg-green-100 text-green-800">Monday</Badge>

                  <span>My School Building</span>

                </li>

                <li className="flex items-center gap-2 text-green-800">

                  <Badge className="bg-green-100 text-green-800">Tuesday</Badge>

                  <span>School People</span>

                </li>

                <li className="flex items-center gap-2 text-green-800">

                  <Badge className="bg-green-100 text-green-800">Wednesday</Badge>

                  <span>Classroom Rules</span>

                </li>

                <li className="flex items-center gap-2 text-green-800">

                  <Badge className="bg-green-100 text-green-800">Thursday</Badge>

                  <span>Being a Good Friend</span>

                </li>

                <li className="flex items-center gap-2 text-green-800">

                  <Badge className="bg-green-100 text-green-800">Friday</Badge>

                  <span>School Routines</span>

                </li>

              </ul>

            </CardContent>

          </Card>

        </div>

      </div>



      <Alert className="bg-blue-50 border-blue-200 mb-8">

        <Lightbulb className="h-4 w-4 text-blue-600" />

        <AlertTitle className="text-blue-700">Teacher Tip</AlertTitle>

        <AlertDescription className="text-blue-700">

          Before beginning this week, arrange a school tour for the children to visit different areas and meet staff

          members. Create a visual schedule of daily routines and display it prominently in your classroom.

        </AlertDescription>

      </Alert>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

          <CardHeader className="bg-green-50">

            <CardTitle className="text-green-700 flex items-center gap-2">

              <BookOpen className="h-5 w-5" /> Learning Objectives

            </CardTitle>

          </CardHeader>

          <CardContent>

            <ul className="list-disc pl-5 space-y-1 mt-2">

              <li>Identify important places and people in the school</li>

              <li>Understand and follow classroom rules and routines</li>

              <li>Develop friendship skills and conflict resolution strategies</li>

              <li>Recognize the roles of different school staff members</li>

              <li>Practice cooperation and sharing in group activities</li>

              <li>Develop vocabulary related to school and friendship</li>

            </ul>

          </CardContent>

        </Card>



        <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

          <CardHeader className="bg-green-50">

            <CardTitle className="text-green-700 flex items-center gap-2">

              <Pencil className="h-5 w-5" /> Key Vocabulary

            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="grid grid-cols-2 gap-2 mt-2">

              <div className="bg-white p-2 rounded border border-green-100">

                <span className="font-medium text-green-700">School</span>

              </div>

              <div className="bg-white p-2 rounded border border-green-100">

                <span className="font-medium text-green-700">Classroom</span>

              </div>

              <div className="bg-white p-2 rounded border border-green-100">

                <span className="font-medium text-green-700">Teacher</span>

              </div>

              <div className="bg-white p-2 rounded border border-green-100">

                <span className="font-medium text-green-700">Principal</span>

              </div>

              <div className="bg-white p-2 rounded border border-green-100">

                <span className="font-medium text-green-700">Rules</span>

              </div>

              <div className="bg-white p-2 rounded border border-green-100">

                <span className="font-medium text-green-700">Routine</span>

              </div>

              <div className="bg-white p-2 rounded border border-green-100">

                <span className="font-medium text-green-700">Friend</span>

              </div>

              <div className="bg-white p-2 rounded border border-green-100">

                <span className="font-medium text-green-700">Share</span>

              </div>

            </div>

          </CardContent>

        </Card>



        <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

          <CardHeader className="bg-green-50">

            <CardTitle className="text-green-700 flex items-center gap-2">

              <Music className="h-5 w-5" /> Materials Needed

            </CardTitle>

          </CardHeader>

          <CardContent>

            <ul className="list-disc pl-5 space-y-1 mt-2">

              <li>School map or floor plan</li>

              <li>Photos of school staff members</li>

              <li>Visual schedule cards</li>

              <li>Art supplies for school crafts</li>

              <li>Books about school and friendship</li>

              <li>Dramatic play props (school supplies, uniforms)</li>

              <li>Chart paper and markers</li>

              <li>Friendship bracelets materials</li>

            </ul>

          </CardContent>

        </Card>

      </div>



      <Tabs defaultValue="monday" className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center">

          <Calendar className="mr-2 h-6 w-6" /> Daily Plans

        </h2>

        <TabsList className="grid grid-cols-5 mb-4">

          <TabsTrigger value="monday" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">

            Monday

          </TabsTrigger>

          <TabsTrigger value="tuesday" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">

            Tuesday

          </TabsTrigger>

          <TabsTrigger

            value="wednesday"

            className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700"

          >

            Wednesday

          </TabsTrigger>

          <TabsTrigger value="thursday" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">

            Thursday

          </TabsTrigger>

          <TabsTrigger value="friday" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">

            Friday

          </TabsTrigger>

        </TabsList>



        <TabsContent value="monday">

          <Card>

            <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b border-green-100">

              <div className="flex items-center gap-2">

                <Calendar className="h-5 w-5 text-green-500" />

                <CardTitle>Monday: Our School Community</CardTitle>

              </div>

            </CardHeader>

            <CardContent className="pt-6">

              <div className="space-y-6">

                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    1

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">Morning Circle</h3>

                    <p className="mt-1">

                      Introduce the theme "My School." Read "The Kissing Hand" by Audrey Penn or "Miss Bindergarten Gets

                      Ready for Kindergarten" by Joseph Slate. Discuss what makes school a special place.

                    </p>

                    <div className="mt-2 p-3 bg-white rounded border border-green-200">

                      <p className="text-sm font-medium text-green-700">Book Options:</p>

                      <ul className="text-sm list-disc pl-5 space-y-1">

                        <li>"The Kissing Hand" by Audrey Penn</li>

                        <li>"Miss Bindergarten Gets Ready for Kindergarten" by Joseph Slate</li>

                        <li>"First Day Jitters" by Julie Danneberg</li>

                        <li>"The Pigeon HAS to Go to School!" by Mo Willems</li>

                      </ul>

                    </div>

                  </div>

                </div>



                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    2

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">Literacy Activity</h3>

                    <p className="mt-1">

                      Create a language experience chart about "What We Like About Our School." Children contribute

                      ideas and the teacher writes them down.

                    </p>

                  </div>

                </div>



                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    3

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">School Tour</h3>

                    <p className="mt-1">

                      Take a walking tour of the school, visiting important places (office, library, cafeteria, gym,

                      playground). Create a simple map afterward.

                    </p>

                    <Button variant="link" className="p-0 h-auto mt-2 text-green-600">

                      <Download className="mr-1 h-4 w-4" /> Download School Tour Checklist

                    </Button>

                  </div>

                </div>



                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    4

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">Art Activity</h3>

                    <p className="mt-1">

                      Children draw pictures of their favorite place in the school and dictate or write why they like

                      it.

                    </p>

                    <div className="mt-2 p-3 bg-white rounded border border-green-200">

                      <p className="text-sm font-medium text-green-700">Extension Idea:</p>

                      <p className="text-sm">

                        Create a classroom book titled "Our Favorite Places at School" with children's drawings and

                        dictations.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    5

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">Closing Circle</h3>

                    <p className="mt-1">

                      Share artwork and discuss what children learned about their school. Create a list of questions

                      about the school to investigate during the week.

                    </p>

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

        </TabsContent>



        <TabsContent value="tuesday">

          <Card>

            <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b border-green-100">

              <div className="flex items-center gap-2">

                <Calendar className="h-5 w-5 text-green-500" />

                <CardTitle>Tuesday: People Who Help Us at School</CardTitle>

              </div>

            </CardHeader>

            <CardContent className="pt-6">

              <div className="space-y-6">

                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    1

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">Morning Circle</h3>

                    <p className="mt-1">

                      Discuss the different people who work at school. Read "Career Day" by Anne Rockwell or a similar

                      book about school staff.

                    </p>

                  </div>

                </div>



                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    2

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">Literacy Activity</h3>

                    <p className="mt-1">

                      Create a class book titled "People Who Help Us at School" where each child contributes a page

                      about a different school staff member.

                    </p>

                    <Button variant="link" className="p-0 h-auto mt-2 text-green-600">

                      <Download className="mr-1 h-4 w-4" /> Download Book Template

                    </Button>

                  </div>

                </div>



                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    3

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">Special Visitor</h3>

                    <p className="mt-1">

                      Invite a school staff member (principal, librarian, custodian, etc.) to visit the class and talk

                      about their job. Children prepare questions in advance.

                    </p>

                    <div className="mt-2 p-3 bg-white rounded border border-green-200">

                      <p className="text-sm font-medium text-green-700">Preparation:</p>

                      <p className="text-sm">

                        Before the visit, help children brainstorm 3-5 questions to ask the visitor. Write these on

                        chart paper so children can refer to them.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    4

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">Dramatic Play</h3>

                    <p className="mt-1">

                      Set up a "School Office" dramatic play area where children can role-play different school jobs.

                    </p>

                  </div>

                </div>



                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    5

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">Closing Circle</h3>

                    <p className="mt-1">

                      Discuss what children learned about school helpers. Create thank-you notes for school staff

                      members.

                    </p>

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

        </TabsContent>



        <TabsContent value="wednesday">

          <Card>

            <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b border-green-100">

              <div className="flex items-center gap-2">

                <Calendar className="h-5 w-5 text-green-500" />

                <CardTitle>Wednesday: Classroom Rules and Routines</CardTitle>

              </div>

            </CardHeader>

            <CardContent className="pt-6">

              <div className="space-y-6">

                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    1

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">Morning Circle</h3>

                    <p className="mt-1">

                      Discuss the importance of rules and routines. Read "David Goes to School" by David Shannon or a

                      similar book about classroom behavior.

                    </p>

                  </div>

                </div>



                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    2

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">Collaborative Activity</h3>

                    <p className="mt-1">

                      Create a classroom rules chart with children's input. Focus on positive statements (what to do

                      rather than what not to do). Children illustrate the rules.

                    </p>

                    <div className="mt-2 p-3 bg-white rounded border border-green-200">

                      <p className="text-sm font-medium text-green-700">Positive Rule Examples:</p>

                      <ul className="text-sm list-disc pl-5 space-y-1">

                        <li>Use walking feet inside</li>

                        <li>Use kind words</li>

                        <li>Keep hands to yourself</li>

                        <li>Listen when others are speaking</li>

                        <li>Take care of our classroom</li>

                      </ul>

                    </div>

                  </div>

                </div>



                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    3

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">Music and Movement</h3>

                    <p className="mt-1">

                      Learn songs that help with classroom transitions and routines (clean-up song, line-up song, etc.).

                    </p>

                    <Button variant="link" className="p-0 h-auto mt-2 text-green-600">

                      <Download className="mr-1 h-4 w-4" /> Download Song Lyrics

                    </Button>

                  </div>

                </div>



                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    4

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">Dramatic Play</h3>

                    <p className="mt-1">

                      Use puppets to role-play scenarios involving classroom rules and routines. Children practice

                      problem-solving when rules aren't followed.

                    </p>

                  </div>

                </div>



                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    5

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">Closing Circle</h3>

                    <p className="mt-1">

                      Review the classroom rules chart. Discuss how rules help everyone learn and stay safe. Introduce

                      the concept of classroom jobs.

                    </p>

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

        </TabsContent>



        <TabsContent value="thursday">

          <Card>

            <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b border-green-100">

              <div className="flex items-center gap-2">

                <Calendar className="h-5 w-5 text-green-500" />

                <CardTitle>Thursday: Making Friends at School</CardTitle>

              </div>

            </CardHeader>

            <CardContent className="pt-6">

              <div className="space-y-6">

                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    1

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">Morning Circle</h3>

                    <p className="mt-1">

                      Discuss friendship and what makes a good friend. Read "The Recess Queen" by Alexis O'Neill or

                      "Strictly No Elephants" by Lisa Mantchev.

                    </p>

                  </div>

                </div>



                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    2

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">Literacy Activity</h3>

                    <p className="mt-1">

                      Create a "Friendship Recipe" chart, listing ingredients for being a good friend (kindness,

                      sharing, listening, etc.). Children dictate ideas.

                    </p>

                    <div className="mt-2 p-3 bg-white rounded border border-green-200">

                      <p className="text-sm font-medium text-green-700">Visual Support:</p>

                      <p className="text-sm">

                        Draw a large mixing bowl on chart paper. Write each "ingredient" on a paper cutout (e.g., heart

                        for kindness, ear for listening) and add them to the bowl as children suggest them.

                      </p>

                    </div>

                  </div>

                </div>



                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    3

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">Art Activity</h3>

                    <p className="mt-1">

                      Make friendship bracelets or cards to exchange with classmates. Discuss how giving gifts can show

                      friendship.

                    </p>

                    <Button variant="link" className="p-0 h-auto mt-2 text-green-600">

                      <Download className="mr-1 h-4 w-4" /> Download Bracelet Instructions

                    </Button>

                  </div>

                </div>



                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    4

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">Cooperative Games</h3>

                    <p className="mt-1">

                      Play games that require cooperation and teamwork, such as parachute games, partner activities, or

                      group challenges.

                    </p>

                  </div>

                </div>



                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    5

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">Closing Circle</h3>

                    <p className="mt-1">

                      Discuss strategies for making new friends and resolving conflicts. Role-play scenarios like asking

                      to join a game or sharing toys.

                    </p>

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

        </TabsContent>



        <TabsContent value="friday">

          <Card>

            <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b border-green-100">

              <div className="flex items-center gap-2">

                <Calendar className="h-5 w-5 text-green-500" />

                <CardTitle>Friday: Review and Celebrate</CardTitle>

              </div>

            </CardHeader>

            <CardContent className="pt-6">

              <div className="space-y-6">

                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    1

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">Morning Circle</h3>

                    <p className="mt-1">

                      Review the week's activities and what children have learned about their school, classroom rules,

                      and making friends.

                    </p>

                  </div>

                </div>



                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    2

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">Show and Tell</h3>

                    <p className="mt-1">

                      Have children share their friendship bracelets or cards they made during the week. Discuss how

                      these gifts show friendship.

                    </p>

                  </div>

                </div>



                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    3

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">Classroom Jobs</h3>

                    <p className="mt-1">

                      Assign classroom jobs based on the rules children helped create. Discuss how these jobs help the

                      classroom run smoothly.

                    </p>

                  </div>

                </div>



                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    4

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">Celebration</h3>

                    <p className="mt-1">

                      Celebrate the end of the week with a special treat or activity that reinforces the week's theme.

                    </p>

                  </div>

                </div>



                <div className="flex gap-4 items-start p-4 rounded-lg bg-green-50 border border-green-100">

                  <div className="bg-green-100 text-green-700 p-2 rounded-full h-8 w-8 flex items-center justify-center font-bold">

                    5

                  </div>

                  <div>

                    <h3 className="font-semibold text-green-800">Closing Circle</h3>

                    <p className="mt-1">

                      Reflect on the week's activities. Discuss how children can continue to apply what they've learned

                      about school and friendship in their daily lives.

                    </p>

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

        </TabsContent>

      </Tabs>



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-6 text-green-700 flex items-center gap-2">

          <Star className="h-6 w-6" /> Featured Activities

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <div className="flex items-center gap-2">

                <School className="h-5 w-5 text-green-600" />

                <CardTitle className="text-green-700">School Map Adventure</CardTitle>

              </div>

            </CardHeader>

            <CardContent>

              <p className="mb-3">

                Children create a detailed map of their school, marking important locations and the people who work

                there.

              </p>

              <div className="mb-3">

                <p className="text-sm font-medium text-green-700 mb-1">Materials Needed:</p>

                <p className="text-sm">Large paper, crayons, stickers, photos of school areas</p>

              </div>

              <div className="flex flex-wrap gap-1 mb-3">

                <Badge className="bg-green-100 text-green-800 text-xs">Geography</Badge>

                <Badge className="bg-blue-100 text-blue-800 text-xs">Art</Badge>

                <Badge className="bg-purple-100 text-purple-800 text-xs">Social Studies</Badge>

              </div>

              <Button

                variant="outline"

                size="sm"

                className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"

              >

                <Download className="mr-1 h-3 w-3" /> Activity Guide

              </Button>

            </CardContent>

          </Card>



          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <div className="flex items-center gap-2">

                <Users className="h-5 w-5 text-green-600" />

                <CardTitle className="text-green-700">School Helper Interviews</CardTitle>

              </div>

            </CardHeader>

            <CardContent>

              <p className="mb-3">

                Children interview different school staff members and create a "School Helpers" book with photos and

                quotes.

              </p>

              <div className="mb-3">

                <p className="text-sm font-medium text-green-700 mb-1">Materials Needed:</p>

                <p className="text-sm">Interview questions, camera/tablet, paper, markers</p>

              </div>

              <div className="flex flex-wrap gap-1 mb-3">

                <Badge className="bg-green-100 text-green-800 text-xs">Language Arts</Badge>

                <Badge className="bg-orange-100 text-orange-800 text-xs">Social Skills</Badge>

                <Badge className="bg-blue-100 text-blue-800 text-xs">Technology</Badge>

              </div>

              <Button

                variant="outline"

                size="sm"

                className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"

              >

                <Download className="mr-1 h-3 w-3" /> Interview Template

              </Button>

            </CardContent>

          </Card>



          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <div className="flex items-center gap-2">

                <CheckCircle2 className="h-5 w-5 text-green-600" />

                <CardTitle className="text-green-700">Classroom Rules Theater</CardTitle>

              </div>

            </CardHeader>

            <CardContent>

              <p className="mb-3">

                Children create and perform short skits demonstrating positive classroom behaviors and problem-solving

                strategies.

              </p>

              <div className="mb-3">

                <p className="text-sm font-medium text-green-700 mb-1">Materials Needed:</p>

                <p className="text-sm">Simple props, costumes, scenario cards</p>

              </div>

              <div className="flex flex-wrap gap-1 mb-3">

                <Badge className="bg-green-100 text-green-800 text-xs">Drama</Badge>

                <Badge className="bg-purple-100 text-purple-800 text-xs">Social Skills</Badge>

                <Badge className="bg-orange-100 text-orange-800 text-xs">Character Ed</Badge>

              </div>

              <Button

                variant="outline"

                size="sm"

                className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"

              >

                <Download className="mr-1 h-3 w-3" /> Scenario Cards

              </Button>

            </CardContent>

          </Card>



          <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow">

            <CardHeader className="bg-green-50">

              <div className="flex items-center gap-2">

                <Lightbulb className="h-5 w-5 text-green-600" />

                <CardTitle className="text-green-700">Friendship Garden</CardTitle>

              </div>

            </CardHeader>

            <CardContent>

              <p className="mb-3">

                Children plant seeds in small pots and care for them together, learning about friendship, cooperation,

                and responsibility.

              </p>

              <div className="mb-3">

                <p className="text-sm font-medium text-green-700 mb-1">Materials Needed:</p>

                <p className="text-sm">Small pots, soil, seeds, watering cans, plant markers</p>

              </div>

              <div className="flex flex-wrap gap-1 mb-3">

                <Badge className="bg-green-100 text-green-800 text-xs">Science</Badge>

                <Badge className="bg-blue-100 text-blue-800 text-xs">Nature</Badge>

                <Badge className="bg-purple-100 text-purple-800 text-xs">Responsibility</Badge>

              </div>

              <Button

                variant="outline"

                size="sm"

                className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent"

              >

                <Download className="mr-1 h-3 w-3" /> Planting Guide

              </Button>

            </CardContent>

          </Card>

        </div>

      </div>



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-6 text-green-700 flex items-center gap-2">

          <BookOpen className="h-6 w-6" /> Resources

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card className="border-green-200 shadow-sm">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700 flex items-center gap-2">

                <BookOpen className="h-5 w-5" /> Books

              </CardTitle>

            </CardHeader>

            <CardContent>

              <ul className="space-y-2 text-sm">

                <li>• "The Kissing Hand" by Audrey Penn</li>

                <li>• "Miss Bindergarten Gets Ready for Kindergarten" by Joseph Slate</li>

                <li>• "David Goes to School" by David Shannon</li>

                <li>• "The Recess Queen" by Alexis O'Neill</li>

                <li>• "Strictly No Elephants" by Lisa Mantchev</li>

                <li>• "First Day Jitters" by Julie Danneberg</li>

                <li>• "The Pigeon HAS to Go to School!" by Mo Willems</li>

                <li>• "Career Day" by Anne Rockwell</li>

              </ul>

              <Button

                variant="outline"

                size="sm"

                className="mt-3 border-green-300 text-green-700 hover:bg-green-50 bg-transparent"

              >

                <Download className="mr-1 h-3 w-3" /> Reading List PDF

              </Button>

            </CardContent>

          </Card>



          <Card className="border-green-200 shadow-sm">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700 flex items-center gap-2">

                <Pencil className="h-5 w-5" /> Printables

              </CardTitle>

            </CardHeader>

            <CardContent>

              <ul className="space-y-2 text-sm">

                <li>• School tour checklist</li>

                <li>• "People Who Help Us" book template</li>

                <li>• Classroom rules chart template</li>

                <li>• Friendship recipe worksheet</li>

                <li>• School map template</li>

                <li>• Interview question cards</li>

                <li>• Friendship bracelet instructions</li>

                <li>• Thank you note templates</li>

              </ul>

              <Button

                variant="outline"

                size="sm"

                className="mt-3 border-green-300 text-green-700 hover:bg-green-50 bg-transparent"

              >

                <Download className="mr-1 h-3 w-3" /> Download All

              </Button>

            </CardContent>

          </Card>



          <Card className="border-green-200 shadow-sm">

            <CardHeader className="bg-green-50">

              <CardTitle className="text-green-700 flex items-center gap-2">

                <Users className="h-5 w-5" /> Home Connection

              </CardTitle>

            </CardHeader>

            <CardContent>

              <ul className="space-y-2 text-sm">

                <li>• Family school tour invitation</li>

                <li>• "Our School Rules at Home" activity</li>

                <li>• Friendship skills practice guide</li>

                <li>• School helper career exploration</li>

                <li>• Weekly reflection questions</li>

                <li>• School vocabulary flashcards</li>

                <li>• Parent volunteer opportunities</li>

                <li>• School community newsletter</li>

              </ul>

              <Button

                variant="outline"

                size="sm"

                className="mt-3 border-green-300 text-green-700 hover:bg-green-50 bg-transparent"

              >

                <Download className="mr-1 h-3 w-3" /> Family Pack

              </Button>

            </CardContent>

          </Card>

        </div>

      </div>

    </div>

  )

}
