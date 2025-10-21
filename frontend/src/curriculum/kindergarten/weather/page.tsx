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
  CloudSun,
  Download,
  Lightbulb,
  CloudRain,
  Sun,
  Wind,
  CloudSnow,
  Thermometer,
} from "lucide-react"

export default function WeatherUnit() {
  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-sky-700">Kindergarten: Weather Unit</h1>
        <p className="text-gray-600 mb-4">A 5-week exploration of weather and its impacts on our world</p>
        <div className="bg-sky-50 border border-sky-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-sky-700 flex items-center">
            <CloudSun className="mr-2 h-6 w-6" /> Unit Overview
          </h2>
          <p className="mb-4">
            This Weather unit introduces kindergarten students to the basics of weather, weather patterns, and how
            weather affects our daily lives. Through hands-on activities, observations, and explorations, students will
            develop an understanding of different types of weather, the four seasons, and basic concepts of the water
            cycle.
          </p>
          <p>
            The unit integrates science, language arts, mathematics, art, and social-emotional learning while building
            critical thinking skills and curiosity about the natural world.
          </p>
          
          {/* Lesson Plan Creation and Activities Buttons */}
          <div className="mt-6 text-center">
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Link to="/kindergarten-planner"><Button>
                  <BookOpen className="mr-2 h-5 w-5" />
                  Create Weather Lesson Plan
                </Button></Link>
              <Link to="/curriculum/kindergarten/activities/weather-unit"><Button>
                  <CloudSun className="mr-2 h-5 w-5" />
                  View Activities
                </Button></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <img src="./kindergarten-weather-exploration.png" alt="Kindergarten students exploring weather concepts" className="w-auto h-auto" />
        </div>
        <div>
          <Card className="border-sky-200 h-full shadow-md">
            <CardHeader className="bg-sky-50 border-b border-sky-100">
              <CardTitle className="text-sky-700">Essential Questions</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Sun className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>What is weather and how can we observe it?</span>
                </li>
                <li className="flex items-start">
                  <CloudRain className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>How do different types of weather look, feel, and sound?</span>
                </li>
                <li className="flex items-start">
                  <Wind className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>How does weather change throughout the seasons?</span>
                </li>
                <li className="flex items-start">
                  <CloudSnow className="h-5 w-5 text-sky-300 mr-2 mt-0.5 flex-shrink-0" />
                  <span>How does weather affect what we do and wear?</span>
                </li>
                <li className="flex items-start">
                  <Thermometer className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>How can we predict and prepare for different weather?</span>
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
              <h3 className="text-lg font-semibold text-sky-700">Unit Description</h3>
              <p>
                The Weather unit is designed to engage kindergarten students in observing, describing, and predicting
                weather. Through a variety of hands-on activities, children will explore different types of weather, how
                weather changes across seasons, and how it affects our daily lives and the world around us.
              </p>

              <h3 className="text-lg font-semibold text-sky-700">Unit Structure</h3>
              <p>This unit is organized into five thematic weeks:</p>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-2">
                {[
                  {
                    week: "Week 1",
                    title: "Is the Weather Important?",
                    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
                    icon: <CloudSun className="h-5 w-5" />,
                    description: "Introduction to weather observation and vocabulary",
                  },
                  {
                    week: "Week 2",
                    title: "Types of Weather",
                    color: "bg-blue-100 text-blue-700 border-blue-200",
                    icon: <CloudRain className="h-5 w-5" />,
                    description: "Exploring different weather conditions",
                  },
                  {
                    week: "Week 3",
                    title: "Weather and Seasons",
                    color: "bg-green-100 text-green-700 border-green-200",
                    icon: <Calendar className="h-5 w-5" />,
                    description: "How weather changes across the four seasons",
                  },
                  {
                    week: "Week 4",
                    title: "Weather and Our Lives",
                    color: "bg-amber-100 text-amber-700 border-amber-200",
                    icon: <Sun className="h-5 w-5" />,
                    description: "How weather affects what we do, wear, and feel",
                  },
                  {
                    week: "Week 5",
                    title: "Weather Watchers",
                    color: "bg-purple-100 text-purple-700 border-purple-200",
                    icon: <Thermometer className="h-5 w-5" />,
                    description: "Observing, measuring, and predicting weather",
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
              <h3 className="text-lg font-semibold text-sky-700 mb-4">Learning Objectives</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-sky-700 flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" /> Knowledge
                  </h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1">
                    <li>Identify and describe different types of weather (sunny, rainy, cloudy, windy, snowy)</li>
                    <li>Recognize appropriate clothing for different weather conditions</li>
                    <li>Identify the four seasons and their typical weather patterns</li>
                    <li>Understand that weather can change from day to day</li>
                    <li>Learn basic weather vocabulary and concepts</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-sky-700 flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5" /> Skills
                  </h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1">
                    <li>Observe and record daily weather using simple charts and graphs</li>
                    <li>Compare different types of weather and their characteristics</li>
                    <li>Use descriptive language to talk about weather observations</li>
                    <li>Make connections between weather and appropriate clothing/activities</li>
                    <li>Use simple weather tools (thermometer, wind sock, rain gauge)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-sky-700 flex items-center">
                    <Clock className="mr-2 h-5 w-5" /> Behaviors & Attitudes
                  </h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1">
                    <li>Develop curiosity about weather phenomena</li>
                    <li>Appreciate how weather affects plants, animals, and human activities</li>
                    <li>Demonstrate an awareness of weather safety</li>
                    <li>Show enthusiasm for outdoor observations</li>
                    <li>Develop confidence in making predictions based on observations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-sky-700 mb-4">Assessment Strategies</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-sky-700">Formative Assessment</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1">
                    <li>Daily weather observations and discussions</li>
                    <li>Participation in weather-related activities</li>
                    <li>Weather journal entries (drawings and dictated statements)</li>
                    <li>Responses during read-alouds and group discussions</li>
                    <li>Teacher observations during hands-on activities</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-sky-700">Summative Assessment</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1">
                    <li>Weather vocabulary assessment (matching pictures to weather terms)</li>
                    <li>Weather dress-up activity (selecting appropriate clothing for weather conditions)</li>
                    <li>Creation of a seasons wheel showing understanding of seasonal changes</li>
                    <li>Final weather chart and graph interpretation</li>
                    <li>Individual or class weather book</li>
                  </ul>
                </div>

                <div className="bg-sky-50 p-4 rounded-md border border-sky-100">
                  <h4 className="font-medium text-sky-700 flex items-center">
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
              <h3 className="text-lg font-semibold text-sky-700 mb-4">Alignment to Standards</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-sky-700">Science Standards</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1.5">
                    <li>
                      <span className="font-medium">K-ESS2-1:</span> Use and share observations of local weather
                      conditions to describe patterns over time.
                    </li>
                    <li>
                      <span className="font-medium">K-ESS3-2:</span> Ask questions to obtain information about the
                      purpose of weather forecasting to prepare for, and respond to, severe weather.
                    </li>
                    <li>
                      <span className="font-medium">K-PS3-1:</span> Make observations to determine the effect of
                      sunlight on Earth's surface.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-sky-700">Language Arts Standards</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1.5">
                    <li>
                      <span className="font-medium">RI.K.1:</span> With prompting and support, ask and answer questions
                      about key details in a text.
                    </li>
                    <li>
                      <span className="font-medium">RI.K.7:</span> With prompting and support, describe the relationship
                      between illustrations and the text.
                    </li>
                    <li>
                      <span className="font-medium">SL.K.5:</span> Add drawings or other visual displays to descriptions
                      to provide additional detail.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-sky-700">Mathematics Standards</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1.5">
                    <li>
                      <span className="font-medium">K.MD.A.1:</span> Describe measurable attributes of objects, such as
                      length or weight.
                    </li>
                    <li>
                      <span className="font-medium">K.MD.B.3:</span> Classify objects into given categories; count the
                      numbers of objects in each category.
                    </li>
                    <li>
                      <span className="font-medium">K.CC.5:</span> Count to answer "how many?" questions about as many
                      as 20 things.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-sky-700">Social Studies Standards</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1.5">
                    <li>Understand how weather affects people's daily activities and choices.</li>
                    <li>Recognize that different regions experience different weather patterns.</li>
                    <li>Describe how weather influences cultural practices and traditions.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-sky-700 flex items-center">
          <Calendar className="mr-2 h-6 w-6" /> Weekly Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
          <Link to="/curriculum/kindergarten/weather/week-1" className="block group">
            <Card className="border-cyan-200 hover:border-cyan-300 hover:shadow-md transition-all">
              <CardHeader className="bg-cyan-50 border-b border-cyan-100 group-hover:bg-cyan-100 transition-all">
                <CardTitle className="text-cyan-700 flex items-center">
                  <CloudSun className="mr-2 h-5 w-5" /> Week 1: Is the Weather Important?
                </CardTitle>
                <CardDescription>Introduction to weather concepts and observations</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Students begin their weather exploration by learning basic weather vocabulary, making daily
                  observations, and understanding why weather is important.
                </p>
                <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-100">Weather Vocabulary</Badge>{" "}
                <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-100">Observation Skills</Badge>{" "}
                <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-100">Weather Charts</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/curriculum/kindergarten/weather/week-2" className="block group">
            <Card className="border-blue-200 hover:border-blue-300 hover:shadow-md transition-all">
              <CardHeader className="bg-blue-50 border-b border-blue-100 group-hover:bg-blue-100 transition-all">
                <CardTitle className="text-blue-700 flex items-center">
                  <CloudRain className="mr-2 h-5 w-5" /> Week 2: Types of Weather
                </CardTitle>
                <CardDescription>Exploring different weather conditions</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Students explore different types of weather including sunny, rainy, cloudy, windy, and snowy days
                  through hands-on activities and experiments.
                </p>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Weather Types</Badge>{" "}
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Science Experiments</Badge>{" "}
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Weather Sounds</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/curriculum/kindergarten/weather/week-3" className="block group">
            <Card className="border-green-200 hover:border-green-300 hover:shadow-md transition-all">
              <CardHeader className="bg-green-50 border-b border-green-100 group-hover:bg-green-100 transition-all">
                <CardTitle className="text-green-700 flex items-center">
                  <Calendar className="mr-2 h-5 w-5" /> Week 3: Weather and Seasons
                </CardTitle>
                <CardDescription>How weather changes throughout the year</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Students learn about the four seasons and how weather patterns change throughout the year, exploring
                  seasonal activities and clothing.
                </p>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Four Seasons</Badge>{" "}
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Seasonal Changes</Badge>{" "}
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Nature Connections</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/curriculum/kindergarten/weather/week-4" className="block group">
            <Card className="border-amber-200 hover:border-amber-300 hover:shadow-md transition-all">
              <CardHeader className="bg-amber-50 border-b border-amber-100 group-hover:bg-amber-100 transition-all">
                <CardTitle className="text-amber-700 flex items-center">
                  <Sun className="mr-2 h-5 w-5" /> Week 4: Weather and Our Lives
                </CardTitle>
                <CardDescription>How weather affects activities and clothing</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Students discover how weather impacts our daily choices, including clothing, activities, and feelings,
                  making real-world connections.
                </p>
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Weather Clothing</Badge>{" "}
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Daily Activities</Badge>{" "}
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Weather Emotions</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/curriculum/kindergarten/weather/week-5" className="block group">
            <Card className="border-purple-200 hover:border-purple-300 hover:shadow-md transition-all">
              <CardHeader className="bg-purple-50 border-b border-purple-100 group-hover:bg-purple-100 transition-all">
                <CardTitle className="text-purple-700 flex items-center">
                  <Thermometer className="mr-2 h-5 w-5" /> Week 5: Weather Watchers
                </CardTitle>
                <CardDescription>Observing, measuring, and predicting weather</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Students learn to observe weather patterns, use simple weather tools, and make predictions about
                  tomorrow's weather.
                </p>
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Weather Tools</Badge>{" "}
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Predictions</Badge>{" "}
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Weather Reporting</Badge>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-sky-200">
          <CardHeader className="bg-sky-50 border-b border-sky-100">
            <CardTitle className="text-sky-700 flex items-center">
              <Lightbulb className="mr-2 h-5 w-5" /> Teaching Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-sky-100 p-1 rounded-full mr-2 mt-0.5">
                  <CloudSun className="h-4 w-4 text-sky-600" />
                </div>
                <span>
                  <span className="font-medium">Create a weather station:</span> Designate an area in your classroom for
                  daily weather observations and recordings.
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-sky-100 p-1 rounded-full mr-2 mt-0.5">
                  <CloudSun className="h-4 w-4 text-sky-600" />
                </div>
                <span>
                  <span className="font-medium">Weather helpers:</span> Assign daily "meteorologists" who help observe
                  and report the weather to the class.
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-sky-100 p-1 rounded-full mr-2 mt-0.5">
                  <CloudSun className="h-4 w-4 text-sky-600" />
                </div>
                <span>
                  <span className="font-medium">Movement breaks:</span> Incorporate weather-themed movements (falling
                  like raindrops, blowing like wind) for transitions.
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-sky-100 p-1 rounded-full mr-2 mt-0.5">
                  <CloudSun className="h-4 w-4 text-sky-600" />
                </div>
                <span>
                  <span className="font-medium">Connect to literature:</span> Use a variety of weather-themed books to
                  reinforce concepts across the curriculum.
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-sky-100 p-1 rounded-full mr-2 mt-0.5">
                  <CloudSun className="h-4 w-4 text-sky-600" />
                </div>
                <span>
                  <span className="font-medium">Family connections:</span> Send home weather observation activities for
                  families to do together.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-sky-200">
          <CardHeader className="bg-sky-50 border-b border-sky-100">
            <CardTitle className="text-sky-700 flex items-center">
              <BookOpen className="mr-2 h-5 w-5" /> Resource Library
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Books for Weather Unit</h3>
                <ul className="text-sm space-y-1">
                  <li>"Weather Words and What They Mean" by Gail Gibbons</li>
                  <li>"The Cloud Book" by Tomie dePaola</li>
                  <li>"Rain" by Robert Kalan</li>
                  <li>"The Snowy Day" by Ezra Jack Keats</li>
                  <li>"One Windy Wednesday" by Phyllis Root</li>
                </ul>
                <Button variant="outline" className="mt-3 w-full border-sky-500 text-sky-700 hover:bg-sky-50">
                  <Download className="mr-2 h-4 w-4" /> Book List PDF
                </Button>
              </div>

              <div>
                <h3 className="font-medium mb-2">Additional Resources</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="border-sky-500 text-sky-700 hover:bg-sky-50">
                    <Download className="mr-2 h-4 w-4" /> Weather Charts
                  </Button>
                  <Button variant="outline" className="border-sky-500 text-sky-700 hover:bg-sky-50">
                    <Download className="mr-2 h-4 w-4" /> Activity Pack
                  </Button>
                  <Button variant="outline" className="border-sky-500 text-sky-700 hover:bg-sky-50">
                    <Download className="mr-2 h-4 w-4" /> Vocabulary Cards
                  </Button>
                  <Button variant="outline" className="border-sky-500 text-sky-700 hover:bg-sky-50">
                    <Download className="mr-2 h-4 w-4" /> Assessment Tools
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
        <Button className="bg-sky-600 hover:bg-sky-700" asChild>
          <Link to="/curriculum/kindergarten/weather/week-1">Begin Week 1: Is the Weather Important?</Link>
        </Button>
        <Button variant="outline" className="border-sky-500 text-sky-700 hover:bg-sky-50" asChild>
          <Link to="/curriculum/kindergarten/activities/weather-unit">View All Unit Activities</Link>
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