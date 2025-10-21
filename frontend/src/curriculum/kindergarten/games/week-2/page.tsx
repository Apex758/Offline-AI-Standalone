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



export default function GamesUnitWeek2() {

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

          <h1 className="text-3xl font-bold mb-4 text-orange-700">Week 2: Who do I play games with?</h1>

          <div className="bg-orange-50 p-4 rounded-lg mb-4">

            <h2 className="text-xl font-semibold mb-2 text-orange-700">Weekly Focus</h2>

            <p>

              Children explore the social aspects of games, learning about playing with family, friends, and classmates.

              They develop an understanding of teamwork, cooperation, and how behavior affects others during game play.

            </p>

          </div>

          

          {/* Navigation Buttons */}

          <div className="flex flex-col md:flex-row gap-3 justify-start">

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/games/week-2/week-plan.pdf">

                <Download className="mr-2 h-4 w-4" /> Week Plan PDF

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/games/week-2/materials">

                <Printer className="mr-2 h-4 w-4" /> All Materials

              </Link>

            </Button>

            <Button size="sm" asChild className="bg-orange-600 hover:bg-orange-700">

              <Link to="/kindergarten-planner">

                <BookOpen className="mr-2 h-4 w-4" /> Plan Your Lesson

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/games/week-1">

                <ChevronLeft className="mr-2 h-4 w-4" /> Previous Week

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/games/week-3">

                Next Week <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />

              </Link>

            </Button>

          </div>

        </div>

        <div className="md:w-1/3">

          <Card className="border-orange-200 shadow-md">

            <CardHeader className="bg-orange-50 border-b border-orange-100">

              <CardTitle className="flex items-center text-orange-700">

                <Clock className="mr-2 h-5 w-5" /> Week at a Glance

              </CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />

                  <span>Identify different people to play games with</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />

                  <span>Develop teamwork and cooperation skills</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />

                  <span>Understand how behavior affects others</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />

                  <span>Practice responsible caring behavior in play</span>

                </li>

              </ul>

            </CardContent>

          </Card>

        </div>

      </div>







      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="md:col-span-2">

          <img src="./kindergarten-social-games.png" alt="Children’s crayon drawing with the words “SOCIAL GAMES,” showing kids playing together, a girl holding a ball, children holding hands, puzzle pieces, dice, and a globe, with words like “FAMILY,” “FRIENDS,” “TEAMWORK,” “COOPERATION,” and “CLASSMATES." className="w-auto h-auto" />

        </div>

        <div>

          <WeeklyOverview

            theme="Who do I play games with?"

            focusAreas={["Social interactions", "Teamwork", "Cooperation", "Fair play"]}

            vocabulary={[

              "team",

              "partner",

              "together",

              "share",

              "take turns",

              "cooperate",

              "fair",

              "help",

              "friend",

              "family",

            ]}

            color="orange"

          />

        </div>

      </div>



      <TeacherTip

        title="Fostering Positive Social Interactions"

        tip="Use games as opportunities to teach and reinforce positive social skills. Before playing games, review expectations for behavior such as taking turns, using kind words, and being a good sport. After playing, have students reflect on how well they worked together. Recognize and praise examples of good teamwork and cooperation you observe during game play."

        color="orange"

      />



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-orange-700 flex items-center py-6">

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

              theme="Playing Games with Friends"

              morningActivity="Morning Circle: Discuss who we play games with and create a list"

              literacyFocus="Read 'Play With Me' by Michelle Lee"

              mathFocus="Create a graph showing who students play games with most often"

              afternoonActivity="Partner games: Students practice playing simple games with a partner"

              materials={[

                "Play With Me book",

                "Chart paper",

                "Graphing materials",

                "Simple partner games",

                "Game materials",

              ]}

              assessmentNotes="Observe students' ability to work cooperatively with a partner and take turns during game play."

              color="orange"

            />

          </TabsContent>



          <TabsContent value="tuesday">

            <DailyPlan

              day="Tuesday"

              theme="Team Games"

              morningActivity="Morning Circle: Introduce the concept of teams and teamwork"

              literacyFocus="Create a shared writing story about playing on a team"

              mathFocus="Sort and count team members for different games"

              afternoonActivity="Play simple team games in small groups"

              materials={[

                "Team game materials",

                "Chart paper",

                "Writing materials",

                "Sorting cards with team numbers",

                "Team identification items (colored bands, etc.)",

              ]}

              assessmentNotes="Note students' understanding of teamwork and their ability to work together toward a common goal."

              color="orange"

            />

          </TabsContent>



          <TabsContent value="wednesday">

            <DailyPlan

              day="Wednesday"

              theme="Games with Family"

              morningActivity="Morning Circle: Discuss games students play with family members"

              literacyFocus="Read 'Can I Play Too?' by Mo Willems"

              mathFocus="Create patterns with family member figures (mom, dad, sister, brother)"

              afternoonActivity="Create a 'Family Game Night' poster with favorite family games"

              materials={[

                "Can I Play Too? book",

                "Family figure manipulatives",

                "Poster materials",

                "Drawing supplies",

                "Pictures of family games",

              ]}

              assessmentNotes="Observe students' ability to describe family interactions during game play and their understanding of inclusion."

              color="orange"

            />

          </TabsContent>



          <TabsContent value="thursday">

            <DailyPlan

              day="Thursday"

              theme="Being a Good Sport"

              morningActivity="Morning Circle: Discuss what it means to be a good sport"

              literacyFocus="Create a class book about 'How to Be a Good Sport'"

              mathFocus="Play simple math games that involve winning and losing"

              afternoonActivity="Role-play scenarios showing good and poor sportsmanship"

              materials={[

                "Book-making materials",

                "Math games",

                "Role-play scenario cards",

                "Good sport/poor sport sorting cards",

                "Puppet characters",

              ]}

              assessmentNotes="Note students' understanding of good sportsmanship and their ability to demonstrate appropriate behavior when winning or losing."

              color="orange"

            />

          </TabsContent>



          <TabsContent value="friday">

            <DailyPlan

              day="Friday"

              theme="Games Around the World"

              morningActivity="Morning Circle: Introduce games played by children in different countries"

              literacyFocus="Read 'Children Around the World' by Donata Montanari"

              mathFocus="Count and compare game materials from different cultural games"

              afternoonActivity="Play simple games from different cultures"

              materials={[

                "Children Around the World book",

                "World map",

                "Materials for cultural games",

                "Picture cards of games from different countries",

                "Counting materials",

              ]}

              assessmentNotes="Evaluate students' understanding that children everywhere play games and their ability to respect different cultural traditions."

              color="orange"

            />

          </TabsContent>

        </Tabs>

      </div>



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-orange-700 flex items-center">

          <Lightbulb className="mr-2 h-6 w-6" /> Featured Activities

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <ActivityCard

            title="Cooperative Musical Chairs"

            description="A variation of musical chairs where no one is eliminated. Instead, when the music stops, everyone must find a seat, with children sharing chairs as they are removed."

            duration="20 minutes"

            materials={["Chairs", "Music player", "Open space"]}

            learningAreas={["Cooperation", "Problem Solving", "Listening Skills"]}

            color="orange"

          />



          <ActivityCard

            title="Team Puzzle Challenge"

            description="Students work in small teams to complete a puzzle, practicing communication and cooperation to achieve a shared goal."

            duration="30 minutes"

            materials={["Simple puzzles", "Team identification markers", "Timer (optional)"]}

            learningAreas={["Teamwork", "Spatial Reasoning", "Communication"]}

            color="orange"

          />



          <ActivityCard

            title="Friendship Game Mural"

            description="Students create a large mural depicting themselves playing games with friends, focusing on positive interactions and inclusion."

            duration="45 minutes"

            materials={["Large paper", "Paint", "Markers", "Collage materials", "Photos of students playing together"]}

            learningAreas={["Art", "Social Awareness", "Self-Expression"]}

            color="orange"

          />



          <ActivityCard

            title="Pass the Ball Game"

            description="Students sit in a circle and pass a ball while music plays. When the music stops, the student holding the ball shares something about a game they like to play with friends or family."

            duration="15 minutes"

            materials={["Ball", "Music player", "Open space for circle"]}

            learningAreas={["Speaking Skills", "Listening Skills", "Social Awareness"]}

            color="orange"

          />

        </div>

      </div>



      <TeacherTip

        title="Including All Students"

        tip="Games provide wonderful opportunities for inclusion, but they can also highlight differences in abilities. Be proactive in adapting games to ensure all students can participate successfully. This might mean modifying rules, providing extra support, or creating mixed-ability teams. Emphasize that everyone has different strengths, and games are more fun when everyone can participate."

        color="orange"

      />



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-orange-700 flex items-center py-6">

          <BookOpen className="mr-2 h-6 w-6" /> Resources

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card className="border-orange-200">

            <CardHeader className="bg-orange-50 border-b border-orange-100">

              <CardTitle className="text-orange-700">Books</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li>"Play With Me" by Michelle Lee</li>

                <li>"Can I Play Too?" by Mo Willems</li>

                <li>"Children Around the World" by Donata Montanari</li>

                <li>"Should I Share My Ice Cream?" by Mo Willems</li>

                <li>"A Little Spot of Teamwork" by Diane Alber</li>

              </ul>

              <Button variant="outline" className="mt-4 w-full border-orange-500 text-orange-700 hover:bg-orange-50">

                <Download className="mr-2 h-4 w-4" /> Book List PDF

              </Button>

            </CardContent>

          </Card>



          <Card className="border-orange-200">

            <CardHeader className="bg-orange-50 border-b border-orange-100">

              <CardTitle className="text-orange-700">Printables</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li>Good sportsmanship visual cards</li>

                <li>Team role cards</li>

                <li>"Who I Play With" graphing activity</li>

                <li>Cooperative game instruction cards</li>

                <li>Games from around the world information sheets</li>

              </ul>

              <Button variant="outline" className="mt-4 w-full border-orange-500 text-orange-700 hover:bg-orange-50">

                <Printer className="mr-2 h-4 w-4" /> Print Materials

              </Button>

            </CardContent>

          </Card>



          <Card className="border-orange-200">

            <CardHeader className="bg-orange-50 border-b border-orange-100">

              <CardTitle className="text-orange-700">Home Connection</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <p className="mb-4">

                Send home a family activity sheet that encourages families to share traditional games from their culture

                or family history. Invite family members to visit the classroom to teach a game from their childhood.

              </p>

              <Button variant="outline" className="w-full border-orange-500 text-orange-700 hover:bg-orange-50">

                <Download className="mr-2 h-4 w-4" /> Family Game Traditions

              </Button>

            </CardContent>

          </Card>

        </div>

      </div>



      <div className="flex justify-between">

        <Button variant="outline" asChild>

          <Link to="/curriculum/kindergarten/games/week-1">Previous Week: What games do I like to play?</Link>

        </Button>

        <Link to="/curriculum/kindergarten/games/week-3"><Button>Next Week: Where do I play games?</Button></Link>

      </div>

    </div>

  )

}
