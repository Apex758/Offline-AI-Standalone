import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { BookOpen, Clock, Calendar, Lightbulb, Download, CheckCircle2, Printer, ChevronLeft } from "lucide-react"

import { Link } from "react-router-dom"

// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

import { DailyPlan } from "@/components/daily-plan"
import { WeeklyOverview } from "@/components/weekly-overview"
import { ActivityCard } from "@/components/activity-card"
import { TeacherTip } from "@/components/teacher-tip"



export default function GamesUnitWeek3() {

  return (

    <div className="container mx-auto px-4 py-8">

            <div className="flex items-center gap-2 mb-4">

        <Link to="/curriculum/kindergarten/games">

          <Button variant="outline" className="mb-2">

            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Games Unit

          </Button>

        </Link>

      </div>



      <div className="flex flex-col md:flex-row gap-6 mb-8">

        <div className="flex-1">

          <h1 className="text-3xl font-bold mb-4 text-blue-700">Week 3: Where do I play games?</h1>

          <div className="bg-blue-50 p-4 rounded-lg mb-4">

            <h2 className="text-xl font-semibold mb-2 text-blue-700">Weekly Focus</h2>

            <p>

              Children explore different environments where games are played, distinguishing between indoor and outdoor

              games, and identifying natural and built features of the environment. They develop spatial awareness and

              an appreciation for the wider environment.

            </p>

          </div>

          

          {/* Navigation Buttons */}

          <div className="flex flex-col md:flex-row gap-3 justify-start">

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/games/week-3/week-plan.pdf">

                <Download className="mr-2 h-4 w-4" /> Week Plan PDF

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/games/week-3/materials">

                <Printer className="mr-2 h-4 w-4" /> All Materials

              </Link>

            </Button>

            <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700">

              <Link to="/kindergarten-planner">

                <BookOpen className="mr-2 h-4 w-4" /> Plan Your Lesson

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/games/week-2">

                <ChevronLeft className="mr-2 h-4 w-4" /> Previous Week

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/games/week-4">

                Next Week <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />

              </Link>

            </Button>

          </div>

        </div>

        <div className="md:w-1/3">

          <Card className="border-blue-200 shadow-md">

            <CardHeader className="bg-blue-50 border-b border-blue-100">

              <CardTitle className="flex items-center text-blue-700">

                <Clock className="mr-2 h-5 w-5" /> Week at a Glance

              </CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />

                  <span>Identify indoor and outdoor game locations</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />

                  <span>Distinguish between natural and built environments</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />

                  <span>Develop spatial awareness vocabulary</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />

                  <span>Explore games played in different environments</span>

                </li>

              </ul>

            </CardContent>

          </Card>

        </div>

      </div>







      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="md:col-span-2">

          <img src="/kindergarten-indoor-outdoor.png" alt="Children’s crayon drawing with the words “INDOOR & OUTDOOR GAMES,” showing kids playing, a dog, a ball, trees, sun, and a house to represent natural and built features of different play environments." className="w-auto h-auto" />

        </div>

        <div>

          <WeeklyOverview

            theme="Where do I play games?"

            focusAreas={[

              "Indoor/outdoor spaces",

              "Natural/built environments",

              "Spatial awareness",

              "Environmental appreciation",

            ]}

            vocabulary={[

              "indoor",

              "outdoor",

              "playground",

              "field",

              "gym",

              "classroom",

              "natural",

              "built",

              "environment",

              "location",

            ]}

            color="blue"

          />

        </div>

      </div>



      <TeacherTip

        title="Exploring Game Environments"

        tip="Take advantage of your school's various environments to help children understand where games can be played. Visit the playground, gym, field, and classroom spaces to discuss what makes each location suitable for different types of games. Create a simple map of your school showing these different game locations to reinforce spatial awareness concepts."

        color="blue"

      />



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center py-6">

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

              theme="Indoor vs. Outdoor Games"

              morningActivity="Morning Circle: Discuss where we play games - indoors and outdoors"

              literacyFocus="Read 'Pete the Cat Plays Hide and Seek' by Kimberly and James Dean"

              mathFocus="Create a graph of indoor vs. outdoor games"

              afternoonActivity="Sort game pictures by where they are played (indoor/outdoor)"

              materials={[

                "Pete the Cat book",

                "Game picture cards",

                "Sorting mats",

                "Graphing materials",

                "Chart paper",

              ]}

              assessmentNotes="Observe students' ability to distinguish between indoor and outdoor game environments and their reasoning for classifications."

              color="blue"

            />

          </TabsContent>



          <TabsContent value="tuesday">

            <DailyPlan

              day="Tuesday"

              theme="Natural and Built Environments"

              morningActivity="Morning Circle: Introduce natural vs. built environments"

              literacyFocus="Create a shared writing story about playing games in different places"

              mathFocus="Sort and count shapes found in natural and built environments"

              afternoonActivity="Create a collage of natural and built places where games are played"

              materials={[

                "Nature/built environment pictures",

                "Magazines for collage",

                "Scissors",

                "Glue",

                "Shape sorting materials",

              ]}

              assessmentNotes="Note students' understanding of natural and built features and their ability to identify where different games are played."

              color="blue"

            />

          </TabsContent>



          <TabsContent value="wednesday">

            <DailyPlan

              day="Wednesday"

              theme="Hide and Seek Games"

              morningActivity="Morning Circle: Discuss games that involve hiding and finding"

              literacyFocus="Read 'We're Going on a Bear Hunt' by Michael Rosen"

              mathFocus="Use positional words to describe locations (above, below, beside, etc.)"

              afternoonActivity="Play modified hide and seek games in different locations"

              materials={[

                "We're Going on a Bear Hunt book",

                "Small objects to hide",

                "Positional word cards",

                "School map",

                "Clipboards and pencils",

              ]}

              assessmentNotes="Observe students' use of positional vocabulary and their understanding of how different environments affect game play."

              color="blue"

            />

          </TabsContent>



          <TabsContent value="thursday">

            <DailyPlan

              day="Thursday"

              theme="Playground Games"

              morningActivity="Morning Circle: Discuss games played on the playground"

              literacyFocus="Create a class book about 'Our Favorite Playground Games'"

              mathFocus="Measure distances for various playground games using non-standard units"

              afternoonActivity="Explore and play different playground games"

              materials={[

                "Book-making materials",

                "Drawing supplies",

                "Non-standard measuring tools",

                "Playground equipment",

                "Game instruction cards",

              ]}

              assessmentNotes="Note students' understanding of how playground features are used for different games and their spatial awareness during play."

              color="blue"

            />

          </TabsContent>



          <TabsContent value="friday">

            <DailyPlan

              day="Friday"

              theme="Games Around the School"

              morningActivity="Morning Circle: Review different places in the school where games are played"

              literacyFocus="Read 'The Gym Teacher from the Black Lagoon' by Mike Thaler"

              mathFocus="Create a simple map of the school showing game locations"

              afternoonActivity="Outdoor Games Day - rotate through different game stations"

              materials={[

                "The Gym Teacher book",

                "Simple school map template",

                "Outdoor game equipment",

                "Station signs",

                "Camera to document activities",

              ]}

              assessmentNotes="Evaluate students' understanding of different game environments and their ability to adapt to different play spaces."

              color="blue"

            />

          </TabsContent>

        </Tabs>

      </div>



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center">

          <Lightbulb className="mr-2 h-6 w-6" /> Featured Activities

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <ActivityCard

            title="Environment Scavenger Hunt"

            description="Students work in small groups to find items or features in different environments (classroom, playground, gym) using a picture checklist."

            duration="30 minutes"

            materials={["Picture checklists", "Clipboards", "Pencils", "Digital camera (optional)"]}

            learningAreas={["Environmental Awareness", "Observation Skills", "Teamwork"]}

            color="blue"

          />



          <ActivityCard

            title="Hot and Cold Game"

            description="One student hides an object while another student finds it using directional clues from classmates who say 'hotter' or 'colder' based on proximity."

            duration="20 minutes"

            materials={["Small objects to hide", "Open space", "Optional blindfold"]}

            learningAreas={["Spatial Awareness", "Listening Skills", "Directional Concepts"]}

            color="blue"

          />



          <ActivityCard

            title="Game Location Diorama"

            description="Students create small dioramas showing different environments where games are played (playground, gym, beach, etc.)."

            duration="45 minutes"

            materials={["Shoe boxes", "Construction paper", "Small figures", "Natural materials", "Craft supplies"]}

            learningAreas={["Art", "Spatial Representation", "Environmental Awareness"]}

            color="blue"

          />



          <ActivityCard

            title="Shape Hunt Games"

            description="Students search for specific 2D and 3D shapes in natural and built environments, recording their findings on a chart."

            duration="25 minutes"

            materials={["Shape cards", "Recording sheets", "Clipboards", "Pencils", "Digital camera (optional)"]}

            learningAreas={["Geometry", "Observation Skills", "Classification"]}

            color="blue"

          />

        </div>

      </div>



      <TeacherTip

        title="Outdoor Learning Opportunities"

        tip="Outdoor environments provide rich learning opportunities beyond just physical play. When taking students outside for games, incorporate mini-lessons about natural features, weather conditions, and how these affect game play. Encourage students to notice how the same game might be played differently in various environments. Always have a backup plan for inclement weather."

        color="blue"

      />



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center py-6">

          <BookOpen className="mr-2 h-6 w-6" /> Resources

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card className="border-blue-200">

            <CardHeader className="bg-blue-50 border-b border-blue-100">

              <CardTitle className="text-blue-700">Books</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li>"Pete the Cat Plays Hide and Seek" by Kimberly and James Dean</li>

                <li>"We're Going on a Bear Hunt" by Michael Rosen</li>

                <li>"The Gym Teacher from the Black Lagoon" by Mike Thaler</li>

                <li>"Playground Day!" by Jennifer Merz</li>

                <li>"The Outdoor Book" by Fiona Danks and Jo Schofield</li>

              </ul>

              <Button variant="outline" className="mt-4 w-full border-blue-500 text-blue-700 hover:bg-blue-50">

                <Download className="mr-2 h-4 w-4" /> Book List PDF

              </Button>

            </CardContent>

          </Card>



          <Card className="border-blue-200">

            <CardHeader className="bg-blue-50 border-b border-blue-100">

              <CardTitle className="text-blue-700">Printables</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li>Indoor/outdoor game sorting cards</li>

                <li>Natural/built environment picture cards</li>

                <li>Simple school map template</li>

                <li>Positional word cards</li>

                <li>Environment scavenger hunt sheets</li>

              </ul>

              <Button variant="outline" className="mt-4 w-full border-blue-500 text-blue-700 hover:bg-blue-50">

                <Printer className="mr-2 h-4 w-4" /> Print Materials

              </Button>

            </CardContent>

          </Card>



          <Card className="border-blue-200">

            <CardHeader className="bg-blue-50 border-b border-blue-100">

              <CardTitle className="text-blue-700">Home Connection</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <p className="mb-4">

                Send home an activity sheet encouraging families to play games in different locations around their home

                and neighborhood. Include a simple recording sheet where children can draw or dictate where they played

                games.

              </p>

              <Button variant="outline" className="w-full border-blue-500 text-blue-700 hover:bg-blue-50">

                <Download className="mr-2 h-4 w-4" /> Game Locations Hunt

              </Button>

            </CardContent>

          </Card>

        </div>

      </div>



      <div className="flex justify-between">

        <Button variant="outline" asChild>

          <Link to="/curriculum/kindergarten/games/week-2">Previous Week: Who do I play games with?</Link>

        </Button>

        <Link to="/curriculum/kindergarten/games/week-4"><Button>Next Week: What do I need to play games?</Button></Link>

      </div>

    </div>

  )

}
