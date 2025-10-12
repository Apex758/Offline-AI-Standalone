import {TeacherTip} from "../../../../components/teacher-tip";
import {ActivityCard} from "../../../../components/activity-card";
import {WeeklyOverview} from "../../../../components/weekly-overview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { BookOpen, Clock, Calendar, Lightbulb, Download, CheckCircle2, Printer, ChevronLeft } from "lucide-react"

import { Link } from "react-router-dom"

// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

import { DailyPlan } from "@/components/daily-plan"



export default function GamesUnitWeek1() {

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

          <h1 className="text-3xl font-bold mb-4 text-pink-700">Week 1: What games do I like to play?</h1>

          <div className="bg-pink-50 p-4 rounded-lg mb-4">

            <h2 className="text-xl font-semibold mb-2 text-pink-700">Weekly Focus</h2>

            <p>

              Children explore different types of games, identify their favorite games, and discuss what makes games

              fun. They'll learn basic game vocabulary and begin to understand that games have rules and objectives.

            </p>

          </div>

          

          {/* Navigation Buttons */}

          <div className="flex flex-col md:flex-row gap-3 justify-start">

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/games/week-1/week-plan.pdf">

                <Download className="mr-2 h-4 w-4" /> Week Plan PDF

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/games/week-1/materials">

                <Printer className="mr-2 h-4 w-4" /> All Materials

              </Link>

            </Button>

            <Button size="sm" asChild className="bg-pink-600 hover:bg-pink-700">

              <Link to="/kindergarten-planner">

                <BookOpen className="mr-2 h-4 w-4" /> Plan Your Lesson

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/games">

                <ChevronLeft className="mr-2 h-4 w-4" /> Previous Week

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/games/week-2">

                Next Week <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />

              </Link>

            </Button>

          </div>

        </div>

        <div className="md:w-1/3">

          <Card className="border-pink-200 shadow-md">

            <CardHeader className="bg-pink-50 border-b border-pink-100">

              <CardTitle className="flex items-center text-pink-700">

                <Clock className="mr-2 h-5 w-5" /> Week at a Glance

              </CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-pink-500 mr-2 mt-0.5" />

                  <span>Identify different types of games</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-pink-500 mr-2 mt-0.5" />

                  <span>Express personal game preferences</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-pink-500 mr-2 mt-0.5" />

                  <span>Learn basic game vocabulary</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-pink-500 mr-2 mt-0.5" />

                  <span>Understand that games have rules</span>

                </li>

              </ul>

            </CardContent>

          </Card>

        </div>

      </div>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="md:col-span-2">

          <img src="/kindergarten-fun-games.png" alt="Children’s crayon drawing with the words “FUN & GAMES,” showing kids, a hopscotch grid, dice, board game pieces, tic-tac-toe, ball, kite, and playful scenes with labels like “RULES,” “OBJECTIVE,” and “PLAY.”" className="w-auto h-auto" />

        </div>

        <div>

          <WeeklyOverview

            theme="What games do I like to play?"

            focusAreas={["Game types", "Game preferences", "Game vocabulary", "Basic rules"]}

            vocabulary={[

              "game",

              "play",

              "rules",

              "turn",

              "win",

              "lose",

              "fair",

              "board game",

              "card game",

              "ball game",

            ]}

            color="pink"

          />

        </div>

      </div>



      <TeacherTip

        title="Creating a Game-Friendly Classroom"

        tip="Set up a dedicated game area in your classroom with a variety of games appropriate for kindergartners. Include simple board games, card games, and materials for physical games. Establish clear rules for using the game area, such as taking turns, sharing materials, and proper cleanup. Rotate games regularly to maintain interest and introduce new challenges."

        color="pink"

      />



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-pink-700 flex items-center py-6">

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

              theme="Introduction to Games"

              morningActivity="Morning Circle: Discuss 'What is a game?' and why we play games"

              literacyFocus="Read 'Join In and Play' by Cheri J. Meiners"

              mathFocus="Count and sort picture cards of different game types"

              afternoonActivity="Create a class chart of games students like to play"

              materials={["Join In and Play book", "Picture cards of games", "Chart paper", "Markers", "Sticky notes"]}

              assessmentNotes="Observe students' prior knowledge about games and their ability to identify different types of games."

              color="pink"

            />

          </TabsContent>



          <TabsContent value="tuesday">

            <DailyPlan

              day="Tuesday"

              theme="Board Games and Card Games"

              morningActivity="Morning Circle: Introduce board games and card games"

              literacyFocus="Create a shared writing story about playing a favorite game"

              mathFocus="Practice counting, matching, and sorting with simple card games"

              afternoonActivity="Explore simple board games and card games in small groups"

              materials={[

                "Simple board games (Candy Land, Hi-Ho Cherry-O)",

                "Card games (Go Fish, Memory)",

                "Chart paper",

                "Writing materials",

                "Game vocabulary cards",

              ]}

              assessmentNotes="Note students' ability to follow simple game rules and take turns during game play."

              color="pink"

            />

          </TabsContent>



          <TabsContent value="wednesday">

            <DailyPlan

              day="Wednesday"

              theme="Physical Games"

              morningActivity="Morning Circle: Discuss games we play with our bodies"

              literacyFocus="Read 'Play With Me' by Michelle Lee"

              mathFocus="Count steps, jumps, or hops during physical games"

              afternoonActivity="Play simple physical games outdoors (tag, hopscotch, follow the leader)"

              materials={["Play With Me book", "Playground equipment", "Balls", "Jump ropes", "Chalk for hopscotch"]}

              assessmentNotes="Observe students' gross motor skills and their understanding of game rules during physical play."

              color="pink"

            />

          </TabsContent>



          <TabsContent value="thursday">

            <DailyPlan

              day="Thursday"

              theme="Video Games and Technology"

              morningActivity="Morning Circle: Talk about games played on computers or tablets"

              literacyFocus="Read 'Bad Kitty Does Not Like Video Games' by Nick Bruel"

              mathFocus="Create a graph of favorite game types (board, card, physical, video)"

              afternoonActivity="Explore educational games on classroom tablets or computers"

              materials={[

                "Bad Kitty book",

                "Classroom tablets or computers",

                "Educational game apps",

                "Graphing materials",

                "Picture cards of different game types",

              ]}

              assessmentNotes="Note students' understanding of appropriate technology use and their ability to identify different types of games."

              color="pink"

            />

          </TabsContent>



          <TabsContent value="friday">

            <DailyPlan

              day="Friday"

              theme="My Favorite Games"

              morningActivity="Morning Circle: Review different types of games learned this week"

              literacyFocus="Create a class book about 'Our Favorite Games'"

              mathFocus="Sort and count game materials (dice, cards, game pieces)"

              afternoonActivity="Game Day: Students rotate through different game stations"

              materials={[

                "Various games from the week",

                "Book-making materials",

                "Drawing supplies",

                "Game pieces for sorting",

                "Camera to document Game Day",

              ]}

              assessmentNotes="Evaluate students' understanding of game types and their ability to express preferences about games they enjoy."

              color="pink"

            />

          </TabsContent>

        </Tabs>

      </div>



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-pink-700 flex items-center">

          <Lightbulb className="mr-2 h-6 w-6" /> Featured Activities

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <ActivityCard

            title="Game Sorting Center"

            description="Students sort picture cards of different games into categories (board games, card games, ball games, etc.) and discuss what makes each type unique."

            duration="30 minutes"

            materials={["Game picture cards", "Sorting mats", "Labels for categories", "Real game examples"]}

            learningAreas={["Classification", "Vocabulary", "Discussion Skills"]}

            color="pink"

          />



          <ActivityCard

            title="Create-a-Game"

            description="Students work in small groups to create a simple game using classroom materials. They must decide on basic rules and how to play."

            duration="45 minutes"

            materials={["Paper", "Markers", "Dice", "Game pieces", "Various classroom materials"]}

            learningAreas={["Creativity", "Collaboration", "Problem Solving"]}

            color="pink"

          />



          <ActivityCard

            title="Game Show and Tell"

            description="Students bring in a favorite game from home (or a picture of it) and share with the class why they like it and how it's played."

            duration="30 minutes (over several days)"

            materials={["Games from home", "Show and Tell schedule", "Discussion prompts"]}

            learningAreas={["Speaking Skills", "Listening Skills", "Game Knowledge"]}

            color="pink"

          />



          <ActivityCard

            title="Roll and Move Math Game"

            description="Students play a simple board game where they roll a die, move that many spaces, and perform a simple math task (count objects, identify numbers, etc.)."

            duration="25 minutes"

            materials={["Game board template", "Dice", "Game pieces", "Math task cards"]}

            learningAreas={["Number Recognition", "Counting", "Turn Taking"]}

            color="pink"

          />

        </div>

      </div>



      <TeacherTip

        title="Supporting All Learners"

        tip="Games naturally differentiate for various ability levels. For students who need extra support, pair them with a peer buddy during game play or simplify rules. For students who need more challenge, introduce variations to games that require more strategic thinking or add additional rules. Remember that the goal is for all students to experience success and enjoyment while playing games."

        color="pink"

      />



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-pink-700 flex items-center py-6">

          <BookOpen className="mr-2 h-6 w-6" /> Resources

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card className="border-pink-200">

            <CardHeader className="bg-pink-50 border-b border-pink-100">

              <CardTitle className="text-pink-700">Books</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li>"Join In and Play" by Cheri J. Meiners</li>

                <li>"Play With Me" by Michelle Lee</li>

                <li>"Bad Kitty Does Not Like Video Games" by Nick Bruel</li>

                <li>"The Recess Queen" by Alexis O'Neill</li>

                <li>"Let's Play!" by Hervé Tullet</li>

              </ul>

              <Button variant="outline" className="mt-4 w-full border-pink-500 text-pink-700 hover:bg-pink-50">

                <Download className="mr-2 h-4 w-4" /> Book List PDF

              </Button>

            </CardContent>

          </Card>



          <Card className="border-pink-200">

            <CardHeader className="bg-pink-50 border-b border-pink-100">

              <CardTitle className="text-pink-700">Printables</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li>Game type sorting cards</li>

                <li>Game vocabulary cards</li>

                <li>Simple game board templates</li>

                <li>"My Favorite Game" writing template</li>

                <li>Game rules visual cards</li>

              </ul>

              <Button variant="outline" className="mt-4 w-full border-pink-500 text-pink-700 hover:bg-pink-50">

                <Printer className="mr-2 h-4 w-4" /> Print Materials

              </Button>

            </CardContent>

          </Card>



          <Card className="border-pink-200">

            <CardHeader className="bg-pink-50 border-b border-pink-100">

              <CardTitle className="text-pink-700">Home Connection</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <p className="mb-4">

                Send home a family activity sheet that encourages families to play a simple game together and discuss

                what makes it fun. Include suggestions for simple games that require minimal materials.

              </p>

              <Button variant="outline" className="w-full border-pink-500 text-pink-700 hover:bg-pink-50">

                <Download className="mr-2 h-4 w-4" /> Family Game Night

              </Button>

            </CardContent>

          </Card>

        </div>

      </div>



      <div className="flex justify-between">

        <Button variant="outline" asChild>

          <Link to="/curriculum/kindergarten/games">Back to Games Unit</Link>

        </Button>

        <Link to="/curriculum/kindergarten/games/week-2"><Button>Next Week: Who do I play games with?</Button></Link>

      </div>

    </div>

  )

}
