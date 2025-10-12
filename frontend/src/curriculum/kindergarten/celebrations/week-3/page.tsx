import {TeacherTip} from "../../../../components/teacher-tip";
import {ActivityCard} from "../../../../components/activity-card";
import {WeeklyOverview} from "../../../../components/weekly-overview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { Badge } from "@/components/ui/badge"

import { Alert, AlertDescription } from "@/components/ui/alert"

import {

  BookOpen,

  Clock,

  Calendar,

  Lightbulb,

  Download,

  CheckCircle2,

  Printer,

  ChevronLeft,

  Utensils,

} from "lucide-react"

import { Link } from "react-router-dom"

// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

import { DailyPlan } from "@/components/daily-plan"



export default function CelebrationsUnitWeek3() {

  return (

    <div className="container mx-auto px-4 py-8">





      <div className="flex items-center gap-2 mb-6">

        <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 border-cyan-200">

          Week 3

        </Badge>

        <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 border-cyan-200">

          Celebrations Unit

        </Badge>

      </div>



      <div className="flex flex-col md:flex-row gap-6 mb-8">

        <div className="flex-1">

          <div className="flex items-center gap-3 mb-4">

            <Utensils className="h-8 w-8 text-cyan-600" />

            <h1 className="text-3xl font-bold text-cyan-700">Week 3: Special Foods & Decorations</h1>

          </div>

          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg mb-6 border border-cyan-200">

            <h2 className="text-xl font-semibold mb-2 text-cyan-700">Weekly Focus</h2>

            <p className="text-cyan-800">

              Children explore the special foods, decorations, and events that are part of different celebrations and

              how these elements make celebrations meaningful.

            </p>

          </div>



          <div className="flex flex-wrap gap-3 mb-6">

            <Button

              variant="outline"

              className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 flex items-center gap-2 bg-transparent"

            >

              <Calendar className="h-4 w-4" /> Week Plan PDF

            </Button>

            <Button

              variant="outline"

              className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 flex items-center gap-2 bg-transparent"

            >

              <Download className="h-4 w-4" /> All Materials

            </Button>

            <Link to="/kindergarten-planner">

              <Button

                variant="outline"

                className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 flex items-center gap-2 bg-transparent"

              >

                <Calendar className="h-4 w-4" /> Plan your Lesson

              </Button>

            </Link>

            <Link to="/curriculum/kindergarten/celebrations/week-2">

              <Button

                variant="outline"

                className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 flex items-center gap-2 bg-transparent"

              >

                <ChevronLeft className="h-4 w-4" /> Previous Week

              </Button>

            </Link>

            <Link to="/curriculum/kindergarten/celebrations/week-4">

              <Button

                variant="outline"

                className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 flex items-center gap-2 bg-transparent"

              >

                Next Week <ChevronLeft className="h-4 w-4 rotate-180" />

              </Button>

            </Link>

          </div>

        </div>

        <div className="md:w-1/3">

          <Card className="border-cyan-200 shadow-md">

            <CardHeader className="bg-cyan-50 border-b border-cyan-100">

              <CardTitle className="flex items-center text-cyan-700">

                <Clock className="mr-2 h-5 w-5" /> Week at a Glance

              </CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <div className="space-y-3">

                <div className="flex items-center gap-2">

                  <Badge variant="outline" className="text-xs">

                    Mon

                  </Badge>

                  <span className="text-sm">Celebration Foods</span>

                </div>

                <div className="flex items-center gap-2">

                  <Badge variant="outline" className="text-xs">

                    Tue

                  </Badge>

                  <span className="text-sm">Wedding Celebrations</span>

                </div>

                <div className="flex items-center gap-2">

                  <Badge variant="outline" className="text-xs">

                    Wed

                  </Badge>

                  <span className="text-sm">Celebration Decorations</span>

                </div>

                <div className="flex items-center gap-2">

                  <Badge variant="outline" className="text-xs">

                    Thu

                  </Badge>

                  <span className="text-sm">Diwali Celebration</span>

                </div>

                <div className="flex items-center gap-2">

                  <Badge variant="outline" className="text-xs">

                    Fri

                  </Badge>

                  <span className="text-sm">Celebration Showcase</span>

                </div>

              </div>

            </CardContent>

          </Card>

        </div>

      </div>



      <Alert className="mb-8 border-yellow-200 bg-yellow-50">

        <Lightbulb className="h-4 w-4 text-yellow-600" />

        <AlertDescription className="text-yellow-800">

          <strong>Teacher Tip:</strong> Be mindful of food allergies and dietary restrictions when planning celebration

          food activities. Consider non-food alternatives or ensure all children can participate safely.

        </AlertDescription>

      </Alert>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <Card className="border-cyan-200">

          <CardHeader className="bg-cyan-50 border-b border-cyan-100">

            <CardTitle className="text-cyan-700 flex items-center">

              <CheckCircle2 className="mr-2 h-5 w-5" />

              Learning Objectives

            </CardTitle>

          </CardHeader>

          <CardContent className="pt-4">

            <ul className="space-y-2 text-sm">

              <li className="flex items-start">

                <CheckCircle2 className="h-4 w-4 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />

                <span>Identify special foods associated with celebrations</span>

              </li>

              <li className="flex items-start">

                <CheckCircle2 className="h-4 w-4 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />

                <span>Explore decorations used in different celebrations</span>

              </li>

              <li className="flex items-start">

                <CheckCircle2 className="h-4 w-4 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />

                <span>Learn about special events and activities in celebrations</span>

              </li>

              <li className="flex items-start">

                <CheckCircle2 className="h-4 w-4 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />

                <span>Compare and contrast celebration elements across cultures</span>

              </li>

            </ul>

          </CardContent>

        </Card>



        <Card className="border-cyan-200">

          <CardHeader className="bg-cyan-50 border-b border-cyan-100">

            <CardTitle className="text-cyan-700 flex items-center">

              <BookOpen className="mr-2 h-5 w-5" />

              Key Vocabulary

            </CardTitle>

          </CardHeader>

          <CardContent className="pt-4">

            <div className="flex flex-wrap gap-2">

              {[

                "feast",

                "decorate",

                "pattern",

                "tradition",

                "special",

                "prepare",

                "share",

                "symbol",

                "ceremony",

                "custom",

              ].map((word) => (

                <Badge key={word} variant="outline" className="text-xs border-cyan-300 text-cyan-700">

                  {word}

                </Badge>

              ))}

            </div>

          </CardContent>

        </Card>



        <Card className="border-cyan-200">

          <CardHeader className="bg-cyan-50 border-b border-cyan-100">

            <CardTitle className="text-cyan-700 flex items-center">

              <Calendar className="mr-2 h-5 w-5" />

              Materials Needed

            </CardTitle>

          </CardHeader>

          <CardContent className="pt-4">

            <ul className="space-y-1 text-sm">

              <li>• Pictures of celebration foods</li>

              <li>• Wedding-related props</li>

              <li>• Decorative materials</li>

              <li>• Clay for diya lamps</li>

              <li>• Colored sand for rangoli</li>

              <li>• Pattern templates</li>

              <li>• Sorting trays</li>

              <li>• Cultural celebration books</li>

            </ul>

          </CardContent>

        </Card>

      </div>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="md:col-span-2">

          <img src="/children-celebrations.png" alt="Children’s crayon drawing with the word “CELEBRATION,” showing balloons, cake with candles, presents, a party hat, bunting, confetti, and smiling children, highlighting festive foods, decorations, and events." className="w-auto h-auto" />

        </div>

        <div>

          <WeeklyOverview

            theme="Special Foods & Decorations"

            focusAreas={[

              "Celebration foods",

              "Celebration decorations",

              "Special events and activities",

              "Cultural traditions",

            ]}

            vocabulary={[

              "feast",

              "decorate",

              "pattern",

              "tradition",

              "special",

              "prepare",

              "share",

              "symbol",

              "ceremony",

              "custom",

            ]}

            color="cyan"

          />

        </div>

      </div>



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-cyan-700 flex items-center">

          <Calendar className="mr-2 h-6 w-6" /> Daily Plans

        </h2>

        <Tabs defaultValue="monday" className="w-full">

          <TabsList className="grid grid-cols-5 mb-4">

            <TabsTrigger value="monday">Monday</TabsTrigger>

            <TabsTrigger value="tuesday">Tuesday</TabsTrigger>

            <TabsTrigger value="wednesday">Wednesday</TabsTrigger>

            <TabsTrigger value="thursday">Thursday</TabsTrigger>

            <TabsTrigger value="friday">Friday</TabsTrigger>

          </TabsList>



          <TabsContent value="monday">

            <DailyPlan

              day="Monday"

              theme="Celebration Foods"

              morningActivity="Morning Circle: Discuss how food is an important part of celebrations. Read 'Everybody Cooks Rice' by Norah Dooley or a similar book about foods from different cultures."

              literacyFocus="Create a class book about favorite celebration foods, with each child contributing a page."

              mathFocus="Sort and classify pictures of celebration foods from different cultures."

              afternoonActivity="Visit a family home (pre-arranged) or invite a resource person to showcase special foods from a cultural celebration."

              materials={[

                "Everybody Cooks Rice book",

                "Pictures of celebration foods",

                "Book-making materials",

                "Sorting trays",

                "Chart paper",

              ]}

              assessmentNotes="Observe students' prior knowledge about celebration foods and their ability to identify foods from different cultures."

              color="cyan"

            />

          </TabsContent>



          <TabsContent value="tuesday">

            <DailyPlan

              day="Tuesday"

              theme="Wedding Celebrations"

              morningActivity="Morning Circle: Focus on wedding celebrations. Read 'Maisy Goes to a Wedding' by Lucy Cousins or a similar book. Discuss how weddings are celebrated in different cultures."

              literacyFocus="Learn and practice vocabulary related to weddings. Create a word web with 'wedding' at the center."

              mathFocus="Create and identify patterns in wedding decorations."

              afternoonActivity="Role-play a wedding celebration with costumes, decorations, and pretend food."

              materials={[

                "Maisy Goes to a Wedding book",

                "Wedding-related props",

                "Dress-up clothes",

                "Decorative materials",

                "Chart paper",

              ]}

              assessmentNotes="Note students' understanding of wedding traditions and their ability to identify similarities and differences in how weddings are celebrated."

              color="cyan"

            />

          </TabsContent>



          <TabsContent value="wednesday">

            <DailyPlan

              day="Wednesday"

              theme="Celebration Decorations"

              morningActivity="Morning Circle: Focus on decorations used in celebrations. Read 'The Ring Bearer' by Floyd Cooper or a similar book. Discuss the importance of decorations in making celebrations special."

              literacyFocus="Create labels for different types of celebration decorations."

              mathFocus="Create patterns with celebration decorations (e.g., ABAB patterns with paper triangles for bunting)."

              afternoonActivity="Create celebration decorations using different shapes and patterns."

              materials={[

                "The Ring Bearer book",

                "Various decorative materials",

                "Colored paper",

                "Scissors",

                "Glue",

                "String",

              ]}

              assessmentNotes="Observe students' understanding of patterns and their ability to create decorations with patterns."

              color="cyan"

            />

          </TabsContent>



          <TabsContent value="thursday">

            <DailyPlan

              day="Thursday"

              theme="Diwali Celebration"

              morningActivity="Morning Circle: Focus on Diwali celebrations. Read 'Binny's Diwali' by Thrity Umrigar or a similar book. Discuss the special foods, decorations, and activities associated with Diwali."

              literacyFocus="Create a poster about Diwali with labels for foods, decorations, and activities."

              mathFocus="Create and identify geometric patterns in rangoli designs."

              afternoonActivity="Create diya lamps from clay and decorate the classroom with Diwali-inspired decorations."

              materials={[

                "Binny's Diwali book",

                "Clay for diya lamps",

                "Colored sand or chalk for rangoli",

                "LED tea lights",

                "Poster-making materials",

              ]}

              assessmentNotes="Note students' understanding of Diwali traditions and their ability to identify and create patterns in rangoli designs."

              color="cyan"

            />

          </TabsContent>



          <TabsContent value="friday">

            <DailyPlan

              day="Friday"

              theme="Celebration Showcase"

              morningActivity="Morning Circle: Review the week's learning about special foods, decorations, and events in celebrations. Read 'Let's Have a Celebration' by Gyo Fujikawa or a similar book."

              literacyFocus="Create an 'All About Celebrations' chart with sections for foods, decorations, and activities."

              mathFocus="Create a graph showing children's favorite celebration foods or decorations."

              afternoonActivity="Host a family celebration event where families show and tell about celebration foods, decorations, and activities from their traditions."

              materials={[

                "Let's Have a Celebration book",

                "Display tables for family items",

                "Chart paper",

                "Graphing materials",

                "Camera for documentation",

              ]}

              assessmentNotes="Evaluate students' understanding of the role of special foods, decorations, and events in celebrations."

              color="cyan"

            />

          </TabsContent>

        </Tabs>

      </div>



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-cyan-700 flex items-center">

          <Lightbulb className="mr-2 h-6 w-6" /> Featured Activities

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <ActivityCard

            title="Celebration Food Collage"

            description="Children create collages depicting special foods from different celebrations using pictures from magazines or drawings."

            duration="30 minutes"

            materials={["Construction paper", "Magazines", "Scissors", "Glue", "Drawing supplies"]}

            learningAreas={["Art", "Cultural Studies", "Fine Motor Skills", "Language"]}

            color="cyan"

          />



          <ActivityCard

            title="Pattern Decorations"

            description="Children create celebration decorations using repeating patterns with different shapes and colors."

            duration="35 minutes"

            materials={["Colored paper shapes", "String", "Glue", "Scissors", "Pattern cards"]}

            learningAreas={["Math", "Art", "Fine Motor Skills", "Pattern Recognition"]}

            color="cyan"

          />



          <ActivityCard

            title="Mystery Box Game"

            description="Children identify celebration items from a mystery box and match them to the appropriate celebration."

            duration="25 minutes"

            materials={["Box with lid", "Various celebration items", "Picture cards of celebrations", "Sorting mats"]}

            learningAreas={["Social Studies", "Language", "Critical Thinking", "Cultural Awareness"]}

            color="cyan"

          />



          <ActivityCard

            title="Celebration Role Play Centers"

            description="Set up centers for children to role play different celebrations with appropriate props, decorations, and pretend foods."

            duration="Ongoing centers"

            materials={["Celebration props", "Dress-up clothes", "Pretend foods", "Decorations", "Center signs"]}

            learningAreas={["Dramatic Play", "Social-Emotional", "Language", "Cultural Studies"]}

            color="cyan"

          />

        </div>

      </div>



      <TeacherTip

        title="Documentation"

        tip="Document the children's exploration of celebration foods, decorations, and events through photos and work samples. Create a display that shows the diversity of celebration elements and helps children make connections between different cultural traditions."

        color="blue"

      />



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-cyan-700 flex items-center py-6">

          <BookOpen className="mr-2 h-6 w-6" /> Resources

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card className="border-cyan-200">

            <CardHeader className="bg-cyan-50 border-b border-cyan-100">

              <CardTitle className="text-cyan-700">Books</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li>"Everybody Cooks Rice" by Norah Dooley</li>

                <li>"Maisy Goes to a Wedding" by Lucy Cousins</li>

                <li>"The Ring Bearer" by Floyd Cooper</li>

                <li>"Binny's Diwali" by Thrity Umrigar</li>

                <li>"Let's Have a Celebration" by Gyo Fujikawa</li>

              </ul>

              <Button

                variant="outline"

                className="mt-4 w-full border-cyan-500 text-cyan-700 hover:bg-cyan-50 bg-transparent"

              >

                <Download className="mr-2 h-4 w-4" /> Book List PDF

              </Button>

            </CardContent>

          </Card>



          <Card className="border-cyan-200">

            <CardHeader className="bg-cyan-50 border-b border-cyan-100">

              <CardTitle className="text-cyan-700">Printables</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li>Celebration food sorting cards</li>

                <li>Pattern templates for decorations</li>

                <li>Celebration vocabulary cards</li>

                <li>Diwali activity sheets</li>

                <li>Wedding celebration coloring pages</li>

              </ul>

              <Button

                variant="outline"

                className="mt-4 w-full border-cyan-500 text-cyan-700 hover:bg-cyan-50 bg-transparent"

              >

                <Printer className="mr-2 h-4 w-4" /> Print Materials

              </Button>

            </CardContent>

          </Card>



          <Card className="border-cyan-200">

            <CardHeader className="bg-cyan-50 border-b border-cyan-100">

              <CardTitle className="text-cyan-700">Home Connection</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <p className="mb-4">

                Send home a family activity sheet asking families to share photos or stories about special foods and

                decorations from their cultural celebrations.

              </p>

              <Button

                variant="outline"

                className="w-full border-cyan-500 text-cyan-700 hover:bg-cyan-50 bg-transparent"

              >

                <Download className="mr-2 h-4 w-4" /> Family Activity

              </Button>

            </CardContent>

          </Card>

        </div>

      </div>



      <div className="flex justify-between items-center">

        <Button variant="outline" asChild>

          <Link to="/curriculum/kindergarten/celebrations/week-2">Previous Week: Cultural Celebrations</Link>

        </Button>

        <div className="flex gap-2">

          <Link to="/kindergarten-planner">

            <Button

              variant="outline"

              className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 bg-transparent"

            >

              <Calendar className="h-4 w-4 mr-2" /> Plan your Lesson

            </Button>

          </Link>

          <Link to="/curriculum/kindergarten/celebrations/week-4"><Button>Next Week: What I Like About Celebrations</Button></Link>

        </div>

      </div>

    </div>

  )

}


