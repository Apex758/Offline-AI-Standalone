import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { BookOpen, Clock, Calendar, Lightbulb, Download, CheckCircle2, Printer, ChevronLeft } from "lucide-react"

import { Link } from "react-router-dom"

// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

import { DailyPlan } from "@/components/daily-plan"
import {WeeklyOverview} from "../../../../components/weekly-overview";
import {ActivityCard} from "../../../../components/activity-card";
import {TeacherTip} from "../../../../components/teacher-tip";



export default function GamesUnitWeek4() {

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

          <h1 className="text-3xl font-bold mb-4 text-green-700">Week 4: What do I need to play games?</h1>

          <div className="bg-green-50 p-4 rounded-lg mb-4">

            <h2 className="text-xl font-semibold mb-2 text-green-700">Weekly Focus</h2>

            <p>

              Children explore the materials, rules, and skills needed to play different games. They investigate how

              forces like pushing and pulling are used in games, and develop an understanding of good sportsmanship and

              fair play.

            </p>

          </div>

          

          {/* Navigation Buttons */}

          <div className="flex flex-col md:flex-row gap-3 justify-start">

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/games/week-4/week-plan.pdf">

                <Download className="mr-2 h-4 w-4" /> Week Plan PDF

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/games/week-4/materials">

                <Printer className="mr-2 h-4 w-4" /> All Materials

              </Link>

            </Button>

            <Button size="sm" asChild className="bg-green-600 hover:bg-green-700">

              <Link to="/kindergarten-planner">

                <BookOpen className="mr-2 h-4 w-4" /> Plan Your Lesson

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/games/week-3">

                <ChevronLeft className="mr-2 h-4 w-4" /> Previous Week

              </Link>

            </Button>

            <Button variant="outline" asChild>

              <Link to="/curriculum/kindergarten/games/week-5">

                Next Week <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />

              </Link>

            </Button>

          </div>

        </div>

        <div className="md:w-1/3">

          <Card className="border-green-200 shadow-md">

            <CardHeader className="bg-green-50 border-b border-green-100">

              <CardTitle className="flex items-center text-green-700">

                <Clock className="mr-2 h-5 w-5" /> Week at a Glance

              </CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />

                  <span>Identify materials needed for different games</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />

                  <span>Understand the importance of rules in games</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />

                  <span>Explore forces (pushing and pulling) in games</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />

                  <span>Develop good sportsmanship and fair play</span>

                </li>

              </ul>

            </CardContent>

          </Card>

        </div>

      </div>







      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="md:col-span-2">

          <img src="/kindergarten-week4.png" alt="Children’s crayon drawing with the words “GAMES & SPORTS,” showing kids playing with a soccer ball, basketball, and jump rope. Includes labels like “MATERIALS,” “SKILLS,” “PUSH,” “PULL,” “FAIR PLAY,” and “SPORTSMANSHIP,” with images of children smiling, a trophy, and cooperative play." className="w-auto h-auto" />

        </div>

        <div>

          <WeeklyOverview

            theme="What do I need to play games?"

            focusAreas={["Game materials", "Rules and instructions", "Forces and motion", "Fair play"]}

            vocabulary={[

              "materials",

              "rules",

              "instructions",

              "push",

              "pull",

              "force",

              "fair",

              "equipment",

              "directions",

              "sportsmanship",

            ]}

            color="green"

          />

        </div>

      </div>



      <TeacherTip

        title="Exploring Game Materials"

        tip="Create a 'game materials exploration center' where students can investigate different items used in games (balls, dice, cards, game pieces, etc.). Encourage students to sort, classify, and discuss how these materials are used in different games. This hands-on exploration helps children understand the connection between materials and game play."

        color="green"

      />



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center py-6">

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

              theme="Game Materials"

              morningActivity="Morning Circle: Discuss what materials are needed for different games"

              literacyFocus="Read 'Play Ball' by Nancy Noel Williams"

              mathFocus="Sort and classify different game materials"

              afternoonActivity="Explore a variety of game materials at centers"

              materials={[

                "Play Ball book",

                "Various game materials",

                "Sorting mats",

                "Labels",

                "Game material picture cards",

              ]}

              assessmentNotes="Observe students' ability to identify and categorize materials needed for different types of games."

              color="green"

            />

          </TabsContent>



          <TabsContent value="tuesday">

            <DailyPlan

              day="Tuesday"

              theme="Game Rules"

              morningActivity="Morning Circle: Discuss why games have rules"

              literacyFocus="Create a shared writing story about 'How to Play Tag'"

              mathFocus="Count steps or actions in game instructions"

              afternoonActivity="Play simple games with clear rules, discussing why the rules are important"

              materials={[

                "Chart paper",

                "Writing materials",

                "Simple games with clear rules",

                "Rule cards",

                "Sequence cards for game instructions",

              ]}

              assessmentNotes="Note students' understanding of the importance of rules and their ability to follow simple game instructions."

              color="green"

            />

          </TabsContent>



          <TabsContent value="wednesday">

            <DailyPlan

              day="Wednesday"

              theme="Pushes and Pulls in Games"

              morningActivity="Morning Circle: Introduce the concepts of pushing and pulling in games"

              literacyFocus="Read 'Newton and Me' by Lynne Mayer"

              mathFocus="Measure and compare distances objects travel when pushed or pulled"

              afternoonActivity="Explore games that use pushing and pulling forces"

              materials={[

                "Newton and Me book",

                "Balls",

                "Toy cars",

                "Ramps",

                "Non-standard measuring tools",

                "Recording sheets",

              ]}

              assessmentNotes="Observe students' understanding of how pushing and pulling forces affect the movement of objects in games."

              color="green"

            />

          </TabsContent>



          <TabsContent value="thursday">

            <DailyPlan

              day="Thursday"

              theme="Creating Games"

              morningActivity="Morning Circle: Discuss how to create a simple game"

              literacyFocus="Write and illustrate instructions for a simple game"

              mathFocus="Create game boards with numbered spaces"

              afternoonActivity="Design and create simple games using classroom materials"

              materials={[

                "Game board templates",

                "Various craft materials",

                "Dice",

                "Game pieces",

                "Writing and drawing supplies",

              ]}

              assessmentNotes="Note students' ability to identify necessary materials and create simple rules for their games."

              color="green"

            />

          </TabsContent>



          <TabsContent value="friday">

            <DailyPlan

              day="Friday"

              theme="Game Fair"

              morningActivity="Morning Circle: Review what we've learned about game materials and rules"

              literacyFocus="Read 'Franklin Plays the Game' by Paulette Bourgeois"

              mathFocus="Count and compare materials needed for different games"

              afternoonActivity="Host a 'Game Fair' where students share and play the games they created"

              materials={[

                "Franklin Plays the Game book",

                "Student-created games",

                "Game fair station signs",

                "Feedback forms with smiley faces",

                "Camera to document the fair",

              ]}

              assessmentNotes="Evaluate students' understanding of game materials, rules, and their ability to explain their games to others."

              color="green"

            />

          </TabsContent>

        </Tabs>

      </div>



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center">

          <Lightbulb className="mr-2 h-6 w-6" /> Featured Activities

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <ActivityCard

            title="Ramp and Roll"

            description="Students experiment with different ramps and objects to explore how pushing forces affect movement in games."

            duration="30 minutes"

            materials={["Cardboard ramps", "Blocks for elevation", "Various balls", "Toy cars", "Recording sheets"]}

            learningAreas={["Science", "Force and Motion", "Prediction Skills"]}

            color="green"

          />



          <ActivityCard

            title="Game Materials Mystery Bag"

            description="Students reach into a mystery bag, feel an object used in games, describe it, and guess what it is before revealing it."

            duration="20 minutes"

            materials={["Cloth bags", "Various game materials", "Description cards", "Game matching cards"]}

            learningAreas={["Sensory Exploration", "Descriptive Language", "Critical Thinking"]}

            color="green"

          />



          <ActivityCard

            title="Rules Charades"

            description="Students act out following or breaking game rules while others guess which rule is being demonstrated."

            duration="25 minutes"

            materials={["Rule picture cards", "Simple props", "Open space"]}

            learningAreas={["Social Skills", "Rule Comprehension", "Dramatic Play"]}

            color="green"

          />



          <ActivityCard

            title="Board Game Design"

            description="Students create simple board games with a start, finish, and obstacles, focusing on the materials needed and basic rules."

            duration="45 minutes"

            materials={["Game board templates", "Markers", "Game pieces", "Dice", "Small boxes for storage"]}

            learningAreas={["Creativity", "Spatial Planning", "Rule Creation"]}

            color="green"

          />

        </div>

      </div>



      <TeacherTip

        title="Fostering Positive Social Interactions"

        tip="Use games as opportunities to teach and reinforce positive social skills. Before playing games, review expectations for behavior such as taking turns, using kind words, and being a good sport. After playing, have students reflect on how well they worked together. Recognize and praise examples of good teamwork and cooperation you observe during game play."

        color="green"

      />



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center py-6">

          <BookOpen className="mr-2 h-6 w-6" /> Resources

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card className="border-green-200">

            <CardHeader className="bg-green-50 border-b border-green-100">

              <CardTitle className="text-green-700">Books</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li>"Play Ball" by Nancy Noel Williams</li>

                <li>"Newton and Me" by Lynne Mayer</li>

                <li>"Franklin Plays the Game" by Paulette Bourgeois</li>

                <li>"The Berenstain Bears Play Fair" by Stan and Jan Berenstain</li>

                <li>"Rules of the Game" by Lenny Hort</li>

              </ul>

              <Button variant="outline" className="mt-4 w-full border-green-500 text-green-700 hover:bg-green-50">

                <Download className="mr-2 h-4 w-4" /> Book List PDF

              </Button>

            </CardContent>

          </Card>



          <Card className="border-green-200">

            <CardHeader className="bg-green-50 border-b border-green-100">

              <CardTitle className="text-green-700">Printables</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li>Game materials sorting cards</li>

                <li>Simple game board templates</li>

                <li>Push and pull recording sheets</li>

                <li>Game rules visual cards</li>

                <li>Game creation planning sheets</li>

              </ul>

              <Button variant="outline" className="mt-4 w-full border-green-500 text-green-700 hover:bg-green-50">

                <Printer className="mr-2 h-4 w-4" /> Print Materials

              </Button>

            </CardContent>

          </Card>



          <Card className="border-green-200">

            <CardHeader className="bg-green-50 border-b border-green-100">

              <CardTitle className="text-green-700">Home Connection</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <p className="mb-4">

                Send home a simple game kit with instructions for families to create and play a game together using

                common household materials. Include a reflection sheet for students to share what materials they used

                and rules they created.

              </p>

              <Button variant="outline" className="w-full border-green-500 text-green-700 hover:bg-green-50">

                <Download className="mr-2 h-4 w-4" /> Family Game Creation Kit

              </Button>

            </CardContent>

          </Card>

        </div>

      </div>



      <div className="flex justify-between">

        <Button variant="outline" asChild>

          <Link to="/curriculum/kindergarten/games/week-3">Previous Week: Where do I play games?</Link>

        </Button>

        <Link to="/curriculum/kindergarten/games/week-5"><Button>Next Week: How can I get better at playing games?</Button></Link>

      </div>

    </div>

  )

}
