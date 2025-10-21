import {TeacherTip} from "../../../../components/teacher-tip";
import {ActivityCard} from "../../../../components/activity-card";
import {WeeklyOverview} from "../../../../components/weekly-overview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { Badge } from "@/components/ui/badge"

import { Alert, AlertDescription } from "@/components/ui/alert"

import { BookOpen, Clock, Calendar, Lightbulb, Download, CheckCircle2, Printer, ChevronLeft, Heart } from "lucide-react"

import { Link } from "react-router-dom"

// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

import { DailyPlan } from "@/components/daily-plan"



export default function CelebrationsUnitWeek4() {

  return (

    <div className="container mx-auto px-4 py-8">





      <div className="flex items-center gap-2 mb-6">

        <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 border-cyan-200">

          Week 4

        </Badge>

        <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 border-cyan-200">

          Celebrations Unit

        </Badge>

      </div>



      <div className="flex flex-col md:flex-row gap-6 mb-8">

        <div className="flex-1">

          <div className="flex items-center gap-3 mb-4">

            <Heart className="h-8 w-8 text-cyan-600" />

            <h1 className="text-3xl font-bold text-cyan-700">Week 4: What I Like About Celebrations</h1>

          </div>

          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg mb-6 border border-cyan-200">

            <h2 className="text-xl font-semibold mb-2 text-cyan-700">Weekly Focus</h2>

            <p className="text-cyan-800">

              Children reflect on their favorite aspects of celebrations and festivals, share personal experiences, and

              develop appreciation for the diversity of celebration customs across different families and cultures.

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

            <Link to="/curriculum/kindergarten/celebrations/week-3">

              <Button

                variant="outline"

                className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 flex items-center gap-2 bg-transparent"

              >

                <ChevronLeft className="h-4 w-4" /> Previous Week

              </Button>

            </Link>

            <Link to="/curriculum/kindergarten/celebrations/week-5">

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

              <ul className="space-y-2">

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-cyan-500 mr-2 mt-0.5" />

                  <span>Reflect on favorite celebration experiences</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-cyan-500 mr-2 mt-0.5" />

                  <span>Share personal celebration stories</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-cyan-500 mr-2 mt-0.5" />

                  <span>Explore carnival traditions and celebrations</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-cyan-500 mr-2 mt-0.5" />

                  <span>Create celebration-themed art and crafts</span>

                </li>

              </ul>

            </CardContent>

          </Card>

        </div>

      </div>



      <Alert className="mb-8 border-yellow-200 bg-yellow-50">

        <Lightbulb className="h-4 w-4 text-yellow-600" />

        <AlertDescription className="text-yellow-800">

          <strong>Teacher Tip:</strong> When children share what they like about celebrations, emphasize that everyone's

          preferences are valid and important. This is a great opportunity to reinforce that families celebrate

          differently.

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

                <span>Reflect on favorite celebration experiences</span>

              </li>

              <li className="flex items-start">

                <CheckCircle2 className="h-4 w-4 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />

                <span>Share personal celebration stories</span>

              </li>

              <li className="flex items-start">

                <CheckCircle2 className="h-4 w-4 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />

                <span>Explore carnival traditions and celebrations</span>

              </li>

              <li className="flex items-start">

                <CheckCircle2 className="h-4 w-4 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />

                <span>Create celebration-themed art and crafts</span>

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

                "favorite",

                "enjoy",

                "special",

                "tradition",

                "carnival",

                "parade",

                "costume",

                "music",

                "dance",

                "together",

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

              <li>• Postcard templates</li>

              <li>• Carnival videos and music</li>

              <li>• Costume pieces and props</li>

              <li>• Craft materials for masks</li>

              <li>• Graphing materials</li>

              <li>• KWL chart</li>

              <li>• Camera for documentation</li>

              <li>• Celebration foods (optional)</li>

            </ul>

          </CardContent>

        </Card>

      </div>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="md:col-span-2">

          <img src="./celebrations-world-festival.png" alt="Children’s crayon drawing with the words “FAVORITE CELEBRATIONS,” showing kids, a globe, balloons, presents, a cake, bunting, and confetti, highlighting festivals, diversity, and joyful family traditions." className="w-auto h-auto" />

        </div>

        <div>

          <WeeklyOverview

            theme="What I Like About Celebrations"

            focusAreas={[

              "Personal preferences",

              "Sharing experiences",

              "Cultural appreciation",

              "Celebration traditions",

            ]}

            vocabulary={[

              "favorite",

              "enjoy",

              "special",

              "tradition",

              "carnival",

              "parade",

              "costume",

              "music",

              "dance",

              "together",

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

              theme="My Favorite Celebrations"

              morningActivity="Morning Circle: Think-Pair-Share about what children like about celebrations with their families"

              literacyFocus="Create postcards with drawings and simple sentences about favorite celebration aspects"

              mathFocus="Collect and graph data about classmates' favorite parts of celebrations"

              afternoonActivity="Create a class chart showing what everyone likes best about celebrations"

              materials={[

                "Postcard templates",

                "Art supplies",

                "Chart paper",

                "Graphing materials",

                "Thinking caps (optional)",

              ]}

              assessmentNotes="Observe children's ability to express preferences and reasons for enjoying specific celebration aspects."

              color="cyan"

            />

          </TabsContent>



          <TabsContent value="tuesday">

            <DailyPlan

              day="Tuesday"

              theme="Carnival Celebrations"

              morningActivity="Morning Circle: Watch videos of carnival parades and discuss what they observe"

              literacyFocus="Read 'Ninny at Carnival' and discuss the preparations, decorations, and costumes"

              mathFocus="Count and categorize different types of carnival costumes seen in videos"

              afternoonActivity="Dance to carnival music and practice following movement patterns"

              materials={[

                "Carnival videos",

                "'Ninny at Carnival' book",

                "Carnival music recordings",

                "Movement space",

                "Costume pictures for sorting",

              ]}

              assessmentNotes="Note children's understanding of carnival as a celebration and their ability to describe costumes and music."

              color="cyan"

            />

          </TabsContent>



          <TabsContent value="wednesday">

            <DailyPlan

              day="Wednesday"

              theme="Carnival Showcase"

              morningActivity="Morning Circle: Explore a carnival booth with costumes, instruments, and decorations"

              literacyFocus="Solve 'Who am I?' riddles about carnival characters and costumes"

              mathFocus="Create a pictograph showing favorite aspects of carnival celebrations"

              afternoonActivity="Role play different carnival characters in pairs using props and materials"

              materials={[

                "Carnival booth materials",

                "Costume pieces",

                "Pictograph templates",

                "Smiley face cut-outs",

                "Riddle cards",

              ]}

              assessmentNotes="Observe children's engagement with carnival traditions and their ability to identify different aspects of the celebration."

              color="cyan"

            />

          </TabsContent>



          <TabsContent value="thursday">

            <DailyPlan

              day="Thursday"

              theme="Carnival Costumes"

              morningActivity="Morning Circle: Read 'To Carnival!' and discuss the story elements"

              literacyFocus="Watch videos of different carnival characters and discuss their features"

              mathFocus="Sort and classify different types of carnival costumes by color, pattern, and style"

              afternoonActivity="Create simple carnival costume elements using provided materials"

              materials={[

                "'To Carnival!' book",

                "Carnival character videos",

                "Craft materials for costumes",

                "Colored paper",

                "Mask templates",

              ]}

              assessmentNotes="Note children's creativity in costume design and their understanding of carnival character types."

              color="cyan"

            />

          </TabsContent>



          <TabsContent value="friday">

            <DailyPlan

              day="Friday"

              theme="Celebration Finale"

              morningActivity="Morning Circle: Review the KWL chart about celebrations and complete the 'Learned' section"

              literacyFocus="Create a class language experience story about our favorite celebrations"

              mathFocus="Review and interpret our class data about favorite celebration aspects"

              afternoonActivity="Kiddies Carnival Frolic - parade in costumes with music in the schoolyard"

              materials={[

                "KWL chart",

                "Carnival costumes",

                "Music equipment",

                "Celebration foods (optional)",

                "Camera for documentation",

              ]}

              assessmentNotes="Evaluate children's overall understanding of celebrations and their ability to express what they enjoy about them."

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

            title="Celebration Postcard"

            description="Children create postcards with drawings and simple sentences about what they like best about celebrations with their families."

            duration="30 minutes"

            materials={["Postcard templates", "Crayons/markers", "Stickers", "Glue", "Magazine cutouts"]}

            learningAreas={["Literacy", "Art", "Social Studies"]}

            color="cyan"

          />



          <ActivityCard

            title="Carnival Charades"

            description="Children take turns acting out different aspects of celebrations using gestures and movements while others guess what celebration they're depicting."

            duration="25 minutes"

            materials={["Picture cards of celebrations", "Open space", "Timer", "Celebration props (optional)"]}

            learningAreas={["Drama", "Physical Movement", "Social Studies"]}

            color="cyan"

          />



          <ActivityCard

            title="Celebration Scrapbook"

            description="In small groups, children create scrapbooks about various celebrations explored during the unit using drawings, cutouts, and simple writing."

            duration="45 minutes"

            materials={[

              "Construction paper",

              "Glue",

              "Scissors",

              "Markers",

              "Magazine cutouts",

              "Photos from class activities",

            ]}

            learningAreas={["Literacy", "Art", "Social Studies", "Collaboration"]}

            color="cyan"

          />



          <ActivityCard

            title="Carnival Mask Making"

            description="Children design and create their own carnival masks using templates and various decorative materials."

            duration="40 minutes"

            materials={["Mask templates", "Craft sticks", "Sequins", "Feathers", "Glitter", "Colored paper"]}

            learningAreas={["Art", "Fine Motor Skills", "Cultural Studies"]}

            color="cyan"

          />

        </div>

      </div>



      <TeacherTip

        title="Connecting Home and School"

        tip="Send home a family reflection sheet asking parents to discuss with their child what the family enjoys most about their celebrations. This creates a meaningful connection between home and school learning, and helps children see that their family traditions are valued in the classroom."

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

                <li>"Ninny at Carnival" by Grace Hallworth</li>

                <li>"To Carnival!: A Celebration in St Lucia" by Baptiste Paul</li>

                <li>"Jump Up! A Story of Carnival" by Ken Wilson-Max</li>

                <li>"Caribbean Carnival" by Jillian Powell</li>

                <li>"Let's Celebrate" by Kate DePalma</li>

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

              <CardTitle className="text-cyan-700">Videos</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li>Carnival Parades</li>

                <li>Jab Jab and Short Knee Traditions</li>

                <li>Steel Pan Performances</li>

                <li>Children's Carnival Celebrations</li>

                <li>Carnival Costume Making</li>

              </ul>

              <Button

                variant="outline"

                className="mt-4 w-full border-cyan-500 text-cyan-700 hover:bg-cyan-50 bg-transparent"

              >

                <Download className="mr-2 h-4 w-4" /> Video Links

              </Button>

            </CardContent>

          </Card>



          <Card className="border-cyan-200">

            <CardHeader className="bg-cyan-50 border-b border-cyan-100">

              <CardTitle className="text-cyan-700">Home Connection</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <p className="mb-4">

                Send home a family reflection sheet asking families to share what they enjoy most about their

                celebrations and traditions.

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

          <Link to="/curriculum/kindergarten/celebrations/week-3">Previous Week: Special Foods and Decorations</Link>

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

          <Link to="/curriculum/kindergarten/celebrations/week-5"><Button>Next Week: Community Celebrations</Button></Link>

        </div>

      </div>

    </div>

  )

}
