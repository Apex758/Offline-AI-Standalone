import { Breadcrumb } from "@/components/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag
import { Link } from "react-router-dom"
import {
  BookOpen,
  Clock,
  Calendar,
  Download,
  Lightbulb,
  Users,
  MapPin,
  Briefcase,
  TrendingUp,
  HelpCircle,
  Gamepad2,
} from "lucide-react"

export default function GamesUnit() {
  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-purple-700">Kindergarten: Games Unit</h1>
        <p className="text-gray-600 mb-4">A 5-week exploration of games and their role in our lives</p>
        <div className="bg-purple-50 border border-purple-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-purple-700 flex items-center">
            <Gamepad2 className="mr-2 h-6 w-6" /> Unit Overview
          </h2>
          <p className="mb-4">
            This Games unit introduces kindergarten students to different types of games, who we play with, where we
            play, what we need to play games, and how we can improve our game-playing skills. Through hands-on
            activities, observations, and explorations, students will develop an understanding of games as social
            activities that require skills, rules, and often specific materials.
          </p>
          <p>
            The unit integrates language arts, mathematics, science, and social studies while building social skills,
            physical coordination, and an understanding of rules and fair play.
          </p>
          
          {/* Lesson Plan Creation and Activities Buttons */}
          <div className="mt-6 text-center">
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Link to="/kindergarten-planner"><Button>
                  <BookOpen className="mr-2 h-5 w-5" />
                  Create Games Lesson Plan
                </Button></Link>
              <Link to="/curriculum/kindergarten/activities/games-unit"><Button>
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  View Activities
                </Button></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <img src="./games.png" alt="Kindergarten students playing games together" className="w-auto h-auto" />
        </div>
        <div>
          <Card className="border-purple-200 h-full shadow-md">
            <CardHeader className="bg-purple-50 border-b border-purple-100">
              <CardTitle className="text-purple-700">Essential Questions</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <HelpCircle className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Are all games fun?</span>
                </li>
                <li className="flex items-start">
                  <Gamepad2 className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>What games do I like to play?</span>
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Who do I play games with?</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Where do I play games?</span>
                </li>
                <li className="flex items-start">
                  <Briefcase className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>What do I need to play games?</span>
                </li>
                <li className="flex items-start">
                  <TrendingUp className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>How can I get better at playing games?</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Unit Overview</TabsTrigger>
          <TabsTrigger value="objectives">Learning Objectives</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="standards">Standards</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-purple-700">Unit Description</h3>
              <p>
                The Games unit is designed to engage kindergarten students in exploring different types of games,
                understanding the social aspects of game play, and developing skills needed for various games. Through a
                variety of hands-on activities, children will explore games they enjoy, who they play with, where games
                are played, what is needed to play games, and how they can improve their game-playing skills.
              </p>

              <h3 className="text-lg font-semibold text-purple-700">Unit Structure</h3>
              <p>This unit is organized into five thematic weeks:</p>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-2">
                {[
                  {
                    week: "Week 1",
                    title: "What games do I like to play?",
                    color: "bg-pink-100 text-pink-700 border-pink-200",
                    icon: <Gamepad2 className="h-5 w-5" />,
                    description: "Exploring favorite games and game preferences",
                  },
                  {
                    week: "Week 2",
                    title: "Who do I play games with?",
                    color: "bg-amber-100 text-amber-700 border-amber-200",
                    icon: <Users className="h-5 w-5" />,
                    description: "Understanding the social aspects of games",
                  },
                  {
                    week: "Week 3",
                    title: "Where do I play games?",
                    color: "bg-blue-100 text-blue-700 border-blue-200",
                    icon: <MapPin className="h-5 w-5" />,
                    description: "Exploring different environments for games",
                  },
                  {
                    week: "Week 4",
                    title: "What do I need to play games?",
                    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
                    icon: <Briefcase className="h-5 w-5" />,
                    description: "Identifying materials, rules, and skills for games",
                  },
                  {
                    week: "Week 5",
                    title: "How can I get better at playing games?",
                    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
                    icon: <TrendingUp className="h-5 w-5" />,
                    description: "Developing skills and practicing good sportsmanship",
                  },
                ].map((week, index) => (
                  <Card
                    key={index}
                    className={`border-2 ${week.color.split(" ")[2]} hover:shadow-md transition-shadow`}
                  >
                    <CardHeader className={`${week.color.split(" ")[0]} py-3 px-4`}>
                      <CardTitle className={`text-sm flex items-center ${week.color.split(" ")[1]}`}>
                        {week.icon}
                        <span className="ml-1.5">{week.week}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-3 px-4">
                      <h4 className="font-medium">{week.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{week.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <p className="mt-4">
                Each week includes daily lesson plans, featured activities, recommended children's literature, and
                cross-curricular connections to provide a comprehensive learning experience.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="objectives">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-purple-700 mb-4">Learning Objectives</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-purple-700 flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" /> Knowledge
                  </h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1">
                    <li>Identify different types of games (board games, physical games, video games)</li>
                    <li>Recognize that games have rules and objectives</li>
                    <li>Understand that games can be played with different people and in different places</li>
                    <li>Identify materials needed for various games</li>
                    <li>Learn basic game vocabulary and concepts</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-purple-700 flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5" /> Skills
                  </h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1">
                    <li>Follow simple rules and take turns in games</li>
                    <li>Develop fine and gross motor skills through game play</li>
                    <li>Use descriptive language to talk about games</li>
                    <li>Count, sort, and match objects used in games</li>
                    <li>Collaborate with others during game play</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-purple-700 flex items-center">
                    <Clock className="mr-2 h-5 w-5" /> Behaviors & Attitudes
                  </h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1">
                    <li>Demonstrate good sportsmanship and fair play</li>
                    <li>Show respect for others during game play</li>
                    <li>Develop perseverance when learning new games</li>
                    <li>Show enthusiasm for trying different types of games</li>
                    <li>Understand the importance of safety during physical games</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-purple-700 mb-4">Assessment Strategies</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-purple-700">Formative Assessment</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1">
                    <li>Observation of students during game play</li>
                    <li>Participation in discussions about games</li>
                    <li>Game journal entries (drawings and dictated statements)</li>
                    <li>Responses during read-alouds and group discussions</li>
                    <li>Teacher observations during hands-on activities</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-purple-700">Summative Assessment</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1">
                    <li>Game vocabulary assessment (matching pictures to game terms)</li>
                    <li>Creation of a game with simple rules</li>
                    <li>Demonstration of appropriate game behaviors</li>
                    <li>Sorting games by type, location, or materials needed</li>
                    <li>Individual or class game book</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-md border border-purple-100">
                  <h4 className="font-medium text-purple-700 flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5" /> Assessment Notes
                  </h4>
                  <p className="mt-2 text-sm">
                    Assessments should be developmentally appropriate for kindergarten students, focusing on oral
                    responses, participation, and hands-on demonstrations rather than written assignments. Use a
                    combination of whole-group, small-group, and individual assessments to gather accurate information
                    about student understanding.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="standards">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-purple-700 mb-4">Alignment to Standards</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-purple-700">Language Arts Standards</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1.5">
                    <li>
                      <span className="font-medium">1.1-1.10:</span> Listening and Speaking - Students will develop
                      skills in listening, speaking, and sharing experiences.
                    </li>
                    <li>
                      <span className="font-medium">2.1-2.15:</span> Reading and Viewing - Students will interact with
                      texts, develop comprehension strategies, and recognize high-frequency words.
                    </li>
                    <li>
                      <span className="font-medium">3.1-3.8:</span> Writing and Representing - Students will use writing
                      and drawing to express ideas and develop phonological awareness.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-purple-700">Mathematics Standards</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1.5">
                    <li>
                      <span className="font-medium">1.1.1, 1.1.8, 1.2.4, 1.3.1-1.3.3:</span> Number Sense - Students
                      will count, compare quantities, and recognize number arrangements.
                    </li>
                    <li>
                      <span className="font-medium">2.1.1:</span> Operations with Numbers - Students will compose and
                      decompose numbers up to 9.
                    </li>
                    <li>
                      <span className="font-medium">3.1.1-3.1.5:</span> Pattern and Relationship - Students will create,
                      extend, and copy repeating patterns.
                    </li>
                    <li>
                      <span className="font-medium">4.2.1-4.2.3:</span> Geometrical Thinking - Students will identify
                      and describe 2D and 3D shapes and their positions.
                    </li>
                    <li>
                      <span className="font-medium">6.1.3:</span> Data Management and Probability - Students will use
                      counting to determine the number of objects in a group.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-purple-700">Science Standards</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1.5">
                    <li>
                      <span className="font-medium">1.1.1-1.1.4:</span> Forces and Interactions: Pushes and Pulls -
                      Students will understand that pushes and pulls have different strengths and directions.
                    </li>
                    <li>
                      <span className="font-medium">1.2.1-1.2.2:</span> Forces and Interactions - Students will
                      demonstrate how objects interact and change motion when they collide.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-purple-700">Social Studies Standards</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1.5">
                    <li>
                      <span className="font-medium">2.7-2.12, 2.16, 2.18:</span> Myself - Civic Participation - Students
                      will understand how behavior affects others, recognize responsibilities in groups, and demonstrate
                      safe and respectful behavior.
                    </li>
                    <li>
                      <span className="font-medium">3.4-3.6:</span> Spatial Thinking - Students will identify and
                      illustrate natural and built features of the local environment.
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-purple-700 flex items-center">
          <Calendar className="mr-2 h-6 w-6" /> Weekly Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
          <Link to="/curriculum/kindergarten/games/week-1" className="block group">
            <Card className="border-pink-200 hover:border-pink-300 hover:shadow-md transition-all">
              <CardHeader className="bg-pink-50 border-b border-pink-100 group-hover:bg-pink-100 transition-all">
                <CardTitle className="text-pink-700 flex items-center">
                  <Gamepad2 className="mr-2 h-5 w-5" /> Week 1: What games do I like to play?
                </CardTitle>
                <CardDescription>Exploring favorite games and game preferences</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Students begin their games exploration by identifying games they enjoy, discussing what makes games
                  fun, and sharing their favorite games with classmates.
                </p>
                <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-100">Game Types</Badge>{" "}
                <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-100">Personal Preferences</Badge>{" "}
                <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-100">Game Vocabulary</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/curriculum/kindergarten/games/week-2" className="block group">
            <Card className="border-amber-200 hover:border-amber-300 hover:shadow-md transition-all">
              <CardHeader className="bg-amber-50 border-b border-amber-100 group-hover:bg-amber-100 transition-all">
                <CardTitle className="text-amber-700 flex items-center">
                  <Users className="mr-2 h-5 w-5" /> Week 2: Who do I play games with?
                </CardTitle>
                <CardDescription>Understanding the social aspects of games</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Students explore the social aspects of games, including playing with family, friends, and classmates,
                  and learn about teamwork and cooperation.
                </p>
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Social Skills</Badge>{" "}
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Teamwork</Badge>{" "}
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Cooperation</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/curriculum/kindergarten/games/week-3" className="block group">
            <Card className="border-blue-200 hover:border-blue-300 hover:shadow-md transition-all">
              <CardHeader className="bg-blue-50 border-b border-blue-100 group-hover:bg-blue-100 transition-all">
                <CardTitle className="text-blue-700 flex items-center">
                  <MapPin className="mr-2 h-5 w-5" /> Week 3: Where do I play games?
                </CardTitle>
                <CardDescription>Exploring different environments for games</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Students learn about different places where games are played, including indoor and outdoor
                  environments, and natural versus built features.
                </p>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Indoor/Outdoor</Badge>{" "}
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Natural/Built Environments</Badge>{" "}
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Spatial Awareness</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/curriculum/kindergarten/games/week-4" className="block group">
            <Card className="border-emerald-200 hover:border-emerald-300 hover:shadow-md transition-all">
              <CardHeader className="bg-emerald-50 border-b border-emerald-100 group-hover:bg-emerald-100 transition-all">
                <CardTitle className="text-emerald-700 flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" /> Week 4: What do I need to play games?
                </CardTitle>
                <CardDescription>Identifying materials, rules, and skills for games</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Students discover what is needed to play different games, including materials, rules, and basic
                  skills, and explore how forces like pushing and pulling are used in games.
                </p>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Game Materials</Badge>{" "}
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Rules</Badge>{" "}
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Forces and Motion</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/curriculum/kindergarten/games/week-5" className="block group">
            <Card className="border-indigo-200 hover:border-indigo-300 hover:shadow-md transition-all">
              <CardHeader className="bg-indigo-50 border-b border-indigo-100 group-hover:bg-indigo-100 transition-all">
                <CardTitle className="text-indigo-700 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" /> Week 5: How can I get better at playing games?
                </CardTitle>
                <CardDescription>Developing skills and practicing good sportsmanship</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Students learn how to improve their game-playing skills through practice, following rules, and
                  demonstrating good sportsmanship and fair play.
                </p>
                <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Skill Development</Badge>{" "}
                <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Sportsmanship</Badge>{" "}
                <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Perseverance</Badge>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-purple-200">
          <CardHeader className="bg-purple-50 border-b border-purple-100">
            <CardTitle className="text-purple-700 flex items-center">
              <Lightbulb className="mr-2 h-5 w-5" /> Teaching Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-purple-100 p-1 rounded-full mr-2 mt-0.5">
                  <Gamepad2 className="h-4 w-4 text-purple-600" />
                </div>
                <span>
                  <span className="font-medium">Create a game center:</span> Designate an area in your classroom for
                  different types of games that students can explore during free choice time.
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-purple-100 p-1 rounded-full mr-2 mt-0.5">
                  <Gamepad2 className="h-4 w-4 text-purple-600" />
                </div>
                <span>
                  <span className="font-medium">Game helpers:</span> Assign students to be "game experts" who can help
                  explain rules and assist classmates with different games.
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-purple-100 p-1 rounded-full mr-2 mt-0.5">
                  <Gamepad2 className="h-4 w-4 text-purple-600" />
                </div>
                <span>
                  <span className="font-medium">Movement breaks:</span> Use simple games like Simon Says or Follow the
                  Leader for transitions between activities.
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-purple-100 p-1 rounded-full mr-2 mt-0.5">
                  <Gamepad2 className="h-4 w-4 text-purple-600" />
                </div>
                <span>
                  <span className="font-medium">Connect to literature:</span> Use a variety of game-themed books to
                  reinforce concepts across the curriculum.
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-purple-100 p-1 rounded-full mr-2 mt-0.5">
                  <Gamepad2 className="h-4 w-4 text-purple-600" />
                </div>
                <span>
                  <span className="font-medium">Family connections:</span> Invite families to share traditional games
                  from their cultures or favorite family games.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader className="bg-purple-50 border-b border-purple-100">
            <CardTitle className="text-purple-700 flex items-center">
              <BookOpen className="mr-2 h-5 w-5" /> Resource Library
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Books for Games Unit</h3>
                <ul className="text-sm space-y-1">
                  <li>"Join In and Play" by Cheri J. Meiners</li>
                  <li>"Play With Me" by Michelle Lee</li>
                  <li>"Bad Kitty Does Not Like Video Games" by Nick Bruel</li>
                  <li>"Can I Play Too?" by Mo Willems</li>
                  <li>"Froggy Plays T-ball" by Jonathan London</li>
                </ul>
                <Button variant="outline" className="mt-3 w-full border-purple-500 text-purple-700 hover:bg-purple-50">
                  <Download className="mr-2 h-4 w-4" /> Book List PDF
                </Button>
              </div>

              <div>
                <h3 className="font-medium mb-2">Additional Resources</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="border-purple-500 text-purple-700 hover:bg-purple-50">
                    <Download className="mr-2 h-4 w-4" /> Game Rules
                  </Button>
                  <Button variant="outline" className="border-purple-500 text-purple-700 hover:bg-purple-50">
                    <Download className="mr-2 h-4 w-4" /> Activity Pack
                  </Button>
                  <Button variant="outline" className="border-purple-500 text-purple-700 hover:bg-purple-50">
                    <Download className="mr-2 h-4 w-4" /> Vocabulary Cards
                  </Button>
                  <Button variant="outline" className="border-purple-500 text-purple-700 hover:bg-purple-50">
                    <Download className="mr-2 h-4 w-4" /> Assessment Tools
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
        <Button className="bg-purple-600 hover:bg-purple-700" asChild>
          <Link to="/curriculum/kindergarten/games/week-1">Begin Week 1: What games do I like to play?</Link>
        </Button>
        <Button variant="outline" className="border-purple-500 text-purple-700 hover:bg-purple-50" asChild>
          <Link to="/curriculum/kindergarten/games/resources">View All Unit Resources</Link>
        </Button>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link to="/curriculum/kindergarten">Back to Kindergarten Overview</Link>
        </Button>
      </div>
    </div>
  )
}
