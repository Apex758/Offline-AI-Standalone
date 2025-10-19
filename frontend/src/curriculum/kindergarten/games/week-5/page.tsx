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



export default function GamesUnitWeek5() {

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

          <h1 className="text-3xl font-bold mb-4 text-indigo-700">Week 5: How can I get better at playing games?</h1>

          <div className="bg-indigo-50 p-4 rounded-lg mb-4">

            <h2 className="text-xl font-semibold mb-2 text-indigo-700">Weekly Focus</h2>

            <p>

              Children explore ways to improve their game-playing skills through practice, following rules, and

              developing good sportsmanship. They learn about perseverance, teamwork, and the importance of having fun

              while playing games.

            </p>

          </div>

          

          {/* Navigation Buttons */}

          <div className="flex flex-col md:flex-row gap-3 justify-start">

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/games/week-5/week-plan.pdf">

                <Download className="mr-2 h-4 w-4" /> Week Plan PDF

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/games/week-5/materials">

                <Printer className="mr-2 h-4 w-4" /> All Materials

              </Link>

            </Button>

            <Button size="sm" asChild className="bg-indigo-600 hover:bg-indigo-700">

              <Link to="/kindergarten-planner">

                <BookOpen className="mr-2 h-4 w-4" /> Plan Your Lesson

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/games/week-4">

                <ChevronLeft className="mr-2 h-4 w-4" /> Previous Week

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/games">

                Games Unit Complete

              </Link>

            </Button>

          </div>

        </div>

        <div className="md:w-1/3">

          <Card className="border-indigo-200 shadow-md">

            <CardHeader className="bg-indigo-50 border-b border-indigo-100">

              <CardTitle className="flex items-center text-indigo-700">

                <Clock className="mr-2 h-5 w-5" /> Week at a Glance

              </CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" />

                  <span>Understand the importance of practice</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" />

                  <span>Develop perseverance and growth mindset</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" />

                  <span>Demonstrate good sportsmanship</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" />

                  <span>Reflect on personal growth in game skills</span>

                </li>

              </ul>

            </CardContent>

          </Card>

        </div>

      </div>







      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="md:col-span-2">

          <img src="/kindergarten-games-week5.png" alt="Children’s crayon drawing with the words “GAME PRACTICE,” showing kids with a soccer ball, children building a puzzle for teamwork, a trophy, and labels like “PERSEVERANCE,” “FOLLOW RULES,” “SPORTSMANSHIP,” “TEAMWORK,” and “HAVE FUN.”" className="w-auto h-auto" />

        </div>

        <div>

          <WeeklyOverview

            theme="How can I get better at playing games?"

            focusAreas={["Practice", "Perseverance", "Sportsmanship", "Growth mindset"]}

            vocabulary={[

              "practice",

              "improve",

              "persevere",

              "try",

              "effort",

              "patience",

              "teamwork",

              "sportsmanship",

              "skills",

              "growth",

            ]}

            color="purple"

          />

        </div>

      </div>



      <TeacherTip

        title="Fostering a Growth Mindset"

        tip="Use game play as an opportunity to develop a growth mindset in your students. When children struggle with a game, encourage them to use phrases like 'I can't do this yet' instead of 'I can't do this.' Celebrate effort and improvement rather than just winning. Share examples of how practice helps us improve in all areas of life, not just games."

        color="purple"

      />



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-indigo-700 flex items-center py-6">

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

              theme="Practice Makes Progress"

              morningActivity="Morning Circle: Discuss how practice helps us get better at games"

              literacyFocus="Read 'Froggy Plays T-ball' by Jonathan London"

              mathFocus="Graph results of skill practice (e.g., bean bag tosses) over multiple attempts"

              afternoonActivity="Practice simple game skills and track improvement"

              materials={[

                "Froggy Plays T-ball book",

                "Bean bags",

                "Targets",

                "Graphing materials",

                "Skill practice stations",

              ]}

              assessmentNotes="Observe students' understanding of how practice leads to improvement and their persistence when practicing skills."

              color="purple"

            />

          </TabsContent>



          <TabsContent value="tuesday">

            <DailyPlan

              day="Tuesday"

              theme="Perseverance"

              morningActivity="Morning Circle: Introduce the concept of perseverance"

              literacyFocus="Read 'The Little Engine That Could' by Watty Piper"

              mathFocus="Count and compare attempts needed to master a skill"

              afternoonActivity="Try challenging games that require multiple attempts to succeed"

              materials={[

                "The Little Engine That Could book",

                "Challenging games",

                "Recording sheets",

                "Perseverance certificates",

                "Timer",

              ]}

              assessmentNotes="Note students' willingness to persist when faced with challenges and their use of strategies to overcome difficulties."

              color="purple"

            />

          </TabsContent>



          <TabsContent value="wednesday">

            <DailyPlan

              day="Wednesday"

              theme="Good Sportsmanship"

              morningActivity="Morning Circle: Discuss what good sportsmanship looks like"

              literacyFocus="Read 'Strictly No Elephants' by Lisa Mantchev"

              mathFocus="Create a tally chart of observed good sportsmanship behaviors"

              afternoonActivity="Role-play and practice good sportsmanship during game play"

              materials={[

                "Strictly No Elephants book",

                "Sportsmanship scenario cards",

                "Games that involve winning/losing",

                "Tally chart",

                "Good sport badges",

              ]}

              assessmentNotes="Observe students' ability to demonstrate good sportsmanship when winning or losing and their understanding of fair play."

              color="purple"

            />

          </TabsContent>



          <TabsContent value="thursday">

            <DailyPlan

              day="Thursday"

              theme="Learning from Others"

              morningActivity="Morning Circle: Discuss how we can learn from watching others"

              literacyFocus="Read 'Franklin Plays the Game' by Paulette Bourgeois"

              mathFocus="Measure and compare performance before and after coaching"

              afternoonActivity="Peer coaching: Students teach each other game skills"

              materials={[

                "Franklin Plays the Game book",

                "Game equipment",

                "Coaching badges",

                "Observation sheets",

                "Non-standard measuring tools",

              ]}

              assessmentNotes="Note students' ability to learn from others and their willingness to share their own knowledge and skills."

              color="purple"

            />

          </TabsContent>



          <TabsContent value="friday">

            <DailyPlan

              day="Friday"

              theme="Games Celebration"

              morningActivity="Morning Circle: Review what we've learned about improving game skills"

              literacyFocus="Create a class book about 'How We Got Better at Games'"

              mathFocus="Create graphs comparing skills at the beginning and end of the unit"

              afternoonActivity="Games Celebration: Play favorite games and demonstrate improved skills"

              materials={[

                "Book-making materials",

                "Graphing supplies",

                "Various game equipment",

                "Certificates of achievement",

                "Camera to document celebration",

              ]}

              assessmentNotes="Evaluate students' understanding of how practice, perseverance, and good sportsmanship help improve game-playing skills."

              color="purple"

            />

          </TabsContent>

        </Tabs>

      </div>



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-indigo-700 flex items-center">

          <Lightbulb className="mr-2 h-6 w-6" /> Featured Activities

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <ActivityCard

            title="Skill Challenge Stations"

            description="Students rotate through stations practicing different game skills (throwing, catching, balancing, etc.), tracking their progress over multiple attempts."

            duration="40 minutes"

            materials={["Station signs", "Various game equipment", "Recording sheets", "Stickers for achievements"]}

            learningAreas={["Physical Skills", "Perseverance", "Self-Assessment"]}

            color="purple"

          />



          <ActivityCard

            title="Good Sport/Poor Sport Sorting"

            description="Students sort picture cards showing examples of good and poor sportsmanship, discussing why each behavior belongs in that category."

            duration="25 minutes"

            materials={["Behavior picture cards", "Sorting mats", "Discussion prompts", "Role-play props"]}

            learningAreas={["Social Skills", "Critical Thinking", "Character Education"]}

            color="purple"

          />



          <ActivityCard

            title="Growth Mindset Game Challenges"

            description="Students attempt increasingly difficult game challenges, using growth mindset language and strategies when faced with obstacles."

            duration="30 minutes"

            materials={["Challenge cards", "Game equipment", "Growth mindset phrase cards", "Timer"]}

            learningAreas={["Resilience", "Problem Solving", "Positive Self-Talk"]}

            color="purple"

          />



          <ActivityCard

            title="Game Skills Show and Tell"

            description="Students demonstrate a game skill they've improved at, explaining how they practiced and what strategies helped them get better."

            duration="35 minutes"

            materials={["Various game equipment", "Presentation schedule", "Audience feedback forms", "Certificates"]}

            learningAreas={["Communication", "Self-Reflection", "Confidence Building"]}

            color="purple"

          />

        </div>

      </div>



      <TeacherTip

        title="Celebrating All Types of Improvement"

        tip="When celebrating improvement in game skills, be sure to recognize various types of growth beyond just physical skills. Acknowledge improvements in following rules, showing good sportsmanship, helping others, persevering through challenges, and working as a team. This helps children understand that becoming better at games involves many different skills and attitudes."

        color="purple"

      />



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-indigo-700 flex items-center py-6">

          <BookOpen className="mr-2 h-6 w-6" /> Resources

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card className="border-indigo-200">

            <CardHeader className="bg-indigo-50 border-b border-indigo-100">

              <CardTitle className="text-indigo-700">Books</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li>"Froggy Plays T-ball" by Jonathan London</li>

                <li>"The Little Engine That Could" by Watty Piper</li>

                <li>"Strictly No Elephants" by Lisa Mantchev</li>

                <li>"Franklin Plays the Game" by Paulette Bourgeois</li>

                <li>"Perseverance Makes Me Stronger" by Elizabeth Cole</li>

              </ul>

              <Button variant="outline" className="mt-4 w-full border-indigo-500 text-indigo-700 hover:bg-indigo-50">

                <Download className="mr-2 h-4 w-4" /> Book List PDF

              </Button>

            </CardContent>

          </Card>



          <Card className="border-indigo-200">

            <CardHeader className="bg-indigo-50 border-b border-indigo-100">

              <CardTitle className="text-indigo-700">Printables</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li>Skill practice recording sheets</li>

                <li>Growth mindset posters and cards</li>

                <li>Good sportsmanship scenario cards</li>

                <li>Game skills progress tracking forms</li>

                <li>Achievement certificates</li>

              </ul>

              <Button variant="outline" className="mt-4 w-full border-indigo-500 text-indigo-700 hover:bg-indigo-50">

                <Printer className="mr-2 h-4 w-4" /> Print Materials

              </Button>

            </CardContent>

          </Card>



          <Card className="border-indigo-200">

            <CardHeader className="bg-indigo-50 border-b border-indigo-100">

              <CardTitle className="text-indigo-700">Home Connection</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <p className="mb-4">

                Send home a family activity sheet encouraging families to practice a game skill together and celebrate

                improvement. Include a simple chart for tracking progress and reflection questions about perseverance

                and growth.

              </p>

              <Button variant="outline" className="w-full border-indigo-500 text-indigo-700 hover:bg-indigo-50">

                <Download className="mr-2 h-4 w-4" /> Family Practice Challenge

              </Button>

            </CardContent>

          </Card>

        </div>

      </div>



      <div className="flex justify-between">

        <Button variant="outline" asChild>

          <Link to="/curriculum/kindergarten/games/week-4">Previous Week: What do I need to play games?</Link>

        </Button>

        <Link to="/curriculum/kindergarten/games"><Button>Back to Games Unit Overview</Button></Link>

      </div>

    </div>

  )

}
