import {TeacherTip} from "../../../../components/teacher-tip";
import {ActivityCard} from "../../../../components/activity-card";
import {WeeklyOverview} from "../../../../components/weekly-overview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { Badge } from "@/components/ui/badge"

import { Alert, AlertDescription } from "@/components/ui/alert"

import { BookOpen, Clock, Calendar, Lightbulb, Download, CheckCircle2, Printer, ChevronLeft, Users, Star } from "lucide-react"

import { Link } from "react-router-dom"

// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

import { DailyPlan } from "@/components/daily-plan"



export default function CelebrationsUnitWeek5() {

  return (

    <div className="container mx-auto px-4 py-8">

      <div className="flex items-center gap-2 mb-6">

        <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 border-cyan-200">

          Week 5

        </Badge>

        <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 border-cyan-200">

          Celebrations Unit

        </Badge>

      </div>



      <div className="flex flex-col md:flex-row gap-6 mb-8">

        <div className="flex-1">

          <div className="flex items-center gap-3 mb-4">

            <Star className="h-8 w-8 text-cyan-600" />

            <h1 className="text-3xl font-bold text-cyan-700">Week 5: Community Celebrations</h1>

          </div>

          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg mb-6 border border-cyan-200">

            <h2 className="text-xl font-semibold mb-2 text-cyan-700">Weekly Focus</h2>

            <p className="text-cyan-800">

              Children explore how communities come together to celebrate, including local festivals, school events,

              and neighborhood gatherings that bring people together.

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

            <Link to="/curriculum/kindergarten/celebrations/week-4">

              <Button

                variant="outline"

                className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 flex items-center gap-2 bg-transparent"

              >

                <ChevronLeft className="h-4 w-4" /> Previous Week

              </Button>

            </Link>

            <Button

              variant="outline"

              className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 flex items-center gap-2 bg-transparent"

              disabled

            >

              Next Week <ChevronLeft className="h-4 w-4 rotate-180" />

            </Button>

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

                  <span className="text-sm">Community Celebration Introduction</span>

                </div>

                <div className="flex items-center gap-2">

                  <Badge variant="outline" className="text-xs">

                    Tue

                  </Badge>

                  <span className="text-sm">Local Festival Exploration</span>

                </div>

                <div className="flex items-center gap-2">

                  <Badge variant="outline" className="text-xs">

                    Wed

                  </Badge>

                  <span className="text-sm">School Event Planning</span>

                </div>

                <div className="flex items-center gap-2">

                  <Badge variant="outline" className="text-xs">

                    Thu

                  </Badge>

                  <span className="text-sm">Neighborhood Gatherings</span>

                </div>

                <div className="flex items-center gap-2">

                  <Badge variant="outline" className="text-xs">

                    Fri

                  </Badge>

                  <span className="text-sm">Community Celebration Day</span>

                </div>

              </div>

            </CardContent>

          </Card>

        </div>

      </div>



      <Alert className="mb-8 border-yellow-200 bg-yellow-50">

        <Lightbulb className="h-4 w-4 text-yellow-600" />

        <AlertDescription className="text-yellow-800">

          <strong>Teacher Tip:</strong> Help children understand that communities celebrate together to build connections,

          share traditions, and create a sense of belonging. Focus on how celebrations bring people together regardless

          of their differences.

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

                <span>Identify different types of community celebrations</span>

              </li>

              <li className="flex items-start">

                <CheckCircle2 className="h-4 w-4 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />

                <span>Understand how celebrations bring communities together</span>

              </li>

              <li className="flex items-start">

                <CheckCircle2 className="h-4 w-4 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />

                <span>Recognize the importance of community participation</span>

              </li>

              <li className="flex items-start">

                <CheckCircle2 className="h-4 w-4 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />

                <span>Develop appreciation for local traditions and customs</span>

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

                "community",

                "festival",

                "gathering",

                "neighborhood",

                "local",

                "together",

                "celebration",

                "participation",

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

              <li>• Community celebration photos and videos</li>

              <li>• Local festival information</li>

              <li>• School event planning materials</li>

              <li>• Neighborhood celebration props</li>

              <li>• Art supplies for community projects</li>

              <li>• Music and dance materials</li>

              <li>• Community celebration books</li>

              <li>• Celebration planning templates</li>

            </ul>

          </CardContent>

        </Card>

      </div>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="md:col-span-2">

          <img src="./colorful-celebration-art-collages-and-posters.png" alt="Community celebrations and gatherings" className="w-auto h-auto" />

        </div>

        <div>

          <WeeklyOverview

            theme="Community Celebrations"

            focusAreas={[

              "Community celebration traditions",

              "Local festivals and events",

              "School and neighborhood gatherings",

              "Building community connections",

            ]}

            vocabulary={[

              "community",

              "festival",

              "gathering",

              "neighborhood",

              "local",

              "together",

              "celebration",

              "participation",

              "tradition",

              "connection",

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

              theme="Community Celebration Introduction"

              morningActivity="Morning Circle: Introduce the concept of community celebrations. Discuss what makes a celebration a 'community' event and how it's different from family celebrations."

              literacyFocus="Read books about community celebrations and discuss the vocabulary related to community events."

              mathFocus="Count and sort different types of community celebrations by size (small gatherings vs. large festivals)."

              afternoonActivity="Children draw pictures of community celebrations they have seen or participated in, sharing their experiences with the class."

              materials={[

                "Community celebration books",

                "Photos of local events",

                "Drawing supplies",

                "Chart paper",

                "Community celebration vocabulary cards",

              ]}

              assessmentNotes="Observe children's understanding of community celebrations and their ability to distinguish them from family celebrations."

              color="cyan"

            />

          </TabsContent>



          <TabsContent value="tuesday">

            <DailyPlan

              day="Tuesday"

              theme="Local Festival Exploration"

              morningActivity="Morning Circle: Explore local festivals and celebrations through photos, videos, and stories. Discuss what makes these events special to the community."

              literacyFocus="Create a 'Local Festivals' word wall with pictures and descriptions of community celebrations in your area."

              mathFocus="Create a simple timeline of when different local festivals happen throughout the year."

              afternoonActivity="Children work in small groups to plan a mini-festival for the classroom, choosing themes, activities, and decorations."

              materials={[

                "Local festival photos and videos",

                "Festival planning templates",

                "Art supplies for decorations",

                "Calendar or timeline materials",

                "Festival theme cards",

              ]}

              assessmentNotes="Note children's creativity in festival planning and their understanding of what makes festivals special."

              color="cyan"

            />

          </TabsContent>



          <TabsContent value="wednesday">

            <DailyPlan

              day="Wednesday"

              theme="School Event Planning"

              morningActivity="Morning Circle: Discuss school celebrations and events. Talk about how the whole school community comes together for special occasions."

              literacyFocus="Read stories about school celebrations and discuss the vocabulary related to school events and community building."

              mathFocus="Count and organize materials needed for a school celebration, practicing addition and subtraction."

              afternoonActivity="Children create invitations and decorations for a classroom celebration that they can share with other classes."

              materials={[

                "School celebration stories",

                "Invitation templates",

                "Decoration materials",

                "Counting manipulatives",

                "School celebration photos",

              ]}

              assessmentNotes="Observe children's understanding of school community celebrations and their ability to plan events."

              color="cyan"

            />

          </TabsContent>



          <TabsContent value="thursday">

            <DailyPlan

              day="Thursday"

              theme="Neighborhood Gatherings"

              morningActivity="Morning Circle: Explore neighborhood celebrations and gatherings. Discuss how neighbors come together to celebrate and build community."

              literacyFocus="Create a 'Neighborhood Celebrations' chart with children sharing stories about neighborhood events they've experienced."

              mathFocus="Sort and classify different types of neighborhood gatherings by size, purpose, and frequency."

              afternoonActivity="Children create a neighborhood celebration map showing where different community events happen in their area."

              materials={[

                "Neighborhood celebration stories",

                "Map templates",

                "Drawing supplies",

                "Sorting cards",

                "Community event photos",

              ]}

              assessmentNotes="Note children's understanding of neighborhood celebrations and their ability to identify community gathering places."

              color="cyan"

            />

          </TabsContent>



          <TabsContent value="friday">

            <DailyPlan

              day="Friday"

              theme="Community Celebration Day"

              morningActivity="Morning Circle: Review the week's learning about community celebrations. Discuss how communities celebrate together and why it's important."

              literacyFocus="Children write or dictate sentences about what they learned about community celebrations and how they can participate."

              mathFocus="Create a graph showing children's favorite types of community celebrations from the week."

              afternoonActivity="Hold a classroom community celebration where children showcase their learning through presentations, art, and performances."

              materials={[

                "Presentation materials",

                "Art supplies",

                "Performance props",

                "Graphing materials",

                "Celebration decorations",

              ]}

              assessmentNotes="Observe how children apply their learning about community celebrations and their ability to work together."

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

            title="Community Celebration Planning"

            description="Children work in groups to plan a community celebration, choosing themes, activities, and materials needed."

            duration="45 minutes"

            materials={["Planning templates", "Theme cards", "Art supplies", "Chart paper", "Celebration props"]}

            learningAreas={["Social Studies", "Language", "Collaboration", "Planning"]}

            color="cyan"

          />



          <ActivityCard

            title="Local Festival Exploration"

            description="Children explore local festivals through photos, videos, and stories, learning about community traditions."

            duration="40 minutes"

            materials={["Local festival photos", "Videos", "Festival stories", "Discussion cards", "Cultural materials"]}

            learningAreas={["Cultural Studies", "Social Studies", "Language", "Community Awareness"]}

            color="cyan"

          />



          <ActivityCard

            title="Neighborhood Celebration Map"

            description="Children create maps showing where different community celebrations happen in their neighborhood."

            duration="35 minutes"

            materials={["Map templates", "Drawing supplies", "Community photos", "Stickers", "Colored markers"]}

            learningAreas={["Geography", "Art", "Social Studies", "Spatial Awareness"]}

            color="cyan"

          />



          <ActivityCard

            title="School Community Celebration"

            description="Children plan and participate in a classroom celebration that can be shared with other classes."

            duration="50 minutes"

            materials={["Celebration props", "Art materials", "Music", "Invitations", "Decorations"]}

            learningAreas={["Social-Emotional", "Arts", "Language", "Community Building"]}

            color="cyan"

          />

        </div>

      </div>



      <TeacherTip

        title="Building Community Connections"

        tip="Use this week to help children understand that they are part of multiple communities - their family, their school, their neighborhood, and their city. Help them see how celebrations strengthen these connections and create a sense of belonging."

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

                <li>"Community Celebrations" by various authors</li>

                <li>"Festivals Around the World" by Katy Halford</li>

                <li>"Our Community" by Gail Saunders-Smith</li>

                <li>"Celebrating Together" by various authors</li>

                <li>"Local Festivals and Traditions" by community resources</li>

              </ul>

              <Button

                variant="outline"

                className="mt-4 w-full border-cyan-300 text-cyan-700 hover:bg-cyan-50 bg-transparent"

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

                <li>Community celebration planning templates</li>

                <li>Local festival exploration sheets</li>

                <li>Neighborhood map templates</li>

                <li>School event planning guides</li>

                <li>Community celebration vocabulary cards</li>

              </ul>

              <Button

                variant="outline"

                className="mt-4 w-full border-cyan-300 text-cyan-700 hover:bg-cyan-50 bg-transparent"

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

                Send home a family activity sheet asking families to share information about community celebrations

                they participate in, including local festivals, school events, and neighborhood gatherings.

              </p>

              <Button

                variant="outline"

                className="w-full border-cyan-300 text-cyan-700 hover:bg-cyan-50 bg-transparent"

              >

                <Download className="mr-2 h-4 w-4" /> Family Activity

              </Button>

            </CardContent>

          </Card>

        </div>

      </div>



      <div className="flex justify-between items-center">

        <Button variant="outline" asChild>

          <Link to="/curriculum/kindergarten/celebrations/week-4">Previous Week: What I Like About Celebrations</Link>

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

          <Link to="/curriculum/kindergarten/celebrations"><Button>Back to Celebrations Unit</Button></Link>

        </div>

      </div>

    </div>

  )

}
