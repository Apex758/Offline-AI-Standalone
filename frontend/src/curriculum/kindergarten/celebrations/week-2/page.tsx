import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { Badge } from "@/components/ui/badge"

import { Alert, AlertDescription } from "@/components/ui/alert"

import { BookOpen, Clock, Calendar, Lightbulb, Download, CheckCircle2, Printer, ChevronLeft, Globe } from "lucide-react"

import { Link } from "react-router-dom"

// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

import { DailyPlan } from "@/components/daily-plan"
import { WeeklyOverview } from "@/components/weekly-overview"
import { ActivityCard } from "@/components/activity-card"
import { TeacherTip } from "@/components/teacher-tip"



export default function CelebrationsUnitWeek2() {

  return (

    <div className="container mx-auto px-4 py-8">





      <div className="flex items-center gap-2 mb-6">

        <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 border-cyan-200">

          Week 2

        </Badge>

        <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 border-cyan-200">

          Celebrations Unit

        </Badge>

      </div>



      <div className="flex flex-col md:flex-row gap-6 mb-8">

        <div className="flex-1">

          <div className="flex items-center gap-3 mb-4">

            <Globe className="h-8 w-8 text-cyan-600" />

            <h1 className="text-3xl font-bold text-cyan-700">Week 2: Cultural Celebrations</h1>

          </div>

          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg mb-6 border border-cyan-200">

            <h2 className="text-xl font-semibold mb-2 text-cyan-700">Weekly Focus</h2>

            <p className="text-cyan-800">

              Children learn about cultural celebrations from around the world, including holidays, festivals, and

              traditions that reflect different cultural backgrounds.

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

            <Link to="/curriculum/kindergarten/celebrations/week-1">

              <Button

                variant="outline"

                className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 flex items-center gap-2 bg-transparent"

              >

                <ChevronLeft className="h-4 w-4" /> Previous Week

              </Button>

            </Link>

            <Link to="/curriculum/kindergarten/celebrations/week-3">

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

                  <span className="text-sm">Celebrations Around the World</span>

                </div>

                <div className="flex items-center gap-2">

                  <Badge variant="outline" className="text-xs">

                    Tue

                  </Badge>

                  <span className="text-sm">Light Festivals</span>

                </div>

                <div className="flex items-center gap-2">

                  <Badge variant="outline" className="text-xs">

                    Wed

                  </Badge>

                  <span className="text-sm">Harvest Celebrations</span>

                </div>

                <div className="flex items-center gap-2">

                  <Badge variant="outline" className="text-xs">

                    Thu

                  </Badge>

                  <span className="text-sm">New Year Celebrations</span>

                </div>

                <div className="flex items-center gap-2">

                  <Badge variant="outline" className="text-xs">

                    Fri

                  </Badge>

                  <span className="text-sm">Cultural Celebration Day</span>

                </div>

              </div>

            </CardContent>

          </Card>

        </div>

      </div>



      <Alert className="mb-8 border-yellow-200 bg-yellow-50">

        <Lightbulb className="h-4 w-4 text-yellow-600" />

        <AlertDescription className="text-yellow-800">

          <strong>Teacher Tip:</strong> Focus on the meaning and purpose behind cultural celebrations rather than just

          the external elements. Help children understand why these celebrations are important to different groups of

          people.

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

                <span>Recognize that different cultures have unique celebrations</span>

              </li>

              <li className="flex items-start">

                <CheckCircle2 className="h-4 w-4 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />

                <span>Identify common elements across cultural celebrations</span>

              </li>

              <li className="flex items-start">

                <CheckCircle2 className="h-4 w-4 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />

                <span>Develop respect and appreciation for cultural diversity</span>

              </li>

              <li className="flex items-start">

                <CheckCircle2 className="h-4 w-4 text-cyan-500 mr-2 mt-0.5 flex-shrink-0" />

                <span>Learn about traditions from various cultural backgrounds</span>

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

                "culture",

                "tradition",

                "festival",

                "holiday",

                "celebration",

                "custom",

                "heritage",

                "diversity",

                "respect",

                "global",

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

              <li>• World map or globe</li>

              <li>• Celebration symbols/stickers</li>

              <li>• Books about cultural celebrations</li>

              <li>• Colored paper and craft supplies</li>

              <li>• LED tea lights</li>

              <li>• Clay for diya lamps</li>

              <li>• Cultural music recordings</li>

              <li>• Various fruits and vegetables</li>

            </ul>

          </CardContent>

        </Card>

      </div>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="md:col-span-2">

          <img src="/children-singing-and-dancing-to-celebration-music.png" alt="Cultural celebrations around the world" className="w-auto h-auto" />

        </div>

        <div>

          <WeeklyOverview

            theme="Cultural Celebrations"

            focusAreas={[

              "Different cultural celebrations",

              "Global awareness",

              "Diversity appreciation",

              "Cultural traditions",

            ]}

            vocabulary={[

              "culture",

              "tradition",

              "festival",

              "holiday",

              "celebration",

              "custom",

              "heritage",

              "diversity",

              "respect",

              "global",

            ]}

            color="blue"

          />

        </div>

      </div>



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center">

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

              theme="Celebrations Around the World"

              morningActivity="Morning Circle: Introduce the concept of cultural celebrations. Read 'Celebrations Around the World' by Katy Halford or a similar book. Discuss how different cultures celebrate special occasions."

              literacyFocus="Create a 'Celebrations Around the World' chart listing different cultural celebrations, where they originate, and key elements of each celebration."

              mathFocus="Sort and classify pictures of celebrations from different cultures."

              afternoonActivity="Introduce a world map or globe. Identify different countries and regions where various cultural celebrations take place. Place celebration symbols on the map."

              materials={[

                "Celebrations Around the World book",

                "World map or globe",

                "Celebration symbols or stickers",

                "Chart paper",

                "Pictures of cultural celebrations",

              ]}

              assessmentNotes="Observe students' prior knowledge about cultural celebrations and their ability to identify different cultures on a map."

              color="cyan"

            />

          </TabsContent>



          <TabsContent value="tuesday">

            <DailyPlan

              day="Tuesday"

              theme="Light Festivals"

              morningActivity="Morning Circle: Focus on celebrations involving light. Read 'Lighting a Lamp' by Jonny Zucker or 'Diwali' by Hannah Eliot. Discuss how light is used in celebrations like Diwali, Hanukkah, St. Lucia Day, etc."

              literacyFocus="Learn and practice vocabulary related to light festivals. Create a word web with 'light' at the center."

              mathFocus="Create and identify patterns in light festival decorations."

              afternoonActivity="Create simple paper lanterns, luminaries, or candle holders inspired by different cultural traditions. Decorate with cultural patterns and symbols."

              materials={[

                "Books about light festivals",

                "Colored paper",

                "Scissors",

                "Glue",

                "String",

                "LED tea lights",

              ]}

              assessmentNotes="Note students' understanding of the symbolism of light in different cultural celebrations."

              color="cyan"

            />

          </TabsContent>



          <TabsContent value="wednesday">

            <DailyPlan

              day="Wednesday"

              theme="Harvest Celebrations"

              morningActivity="Morning Circle: Focus on harvest celebrations. Read 'Harvest' by Lizzy Rockwell or a similar book. Discuss harvest festivals like Thanksgiving, Sukkot, Mid-Autumn Festival, etc."

              literacyFocus="Create a vocabulary list of harvest-related words. Practice using these words in sentences."

              mathFocus="Sort and count different fruits, vegetables, and grains that are harvested and used in celebrations."

              afternoonActivity="Prepare a simple harvest-related food (cornbread, apple sauce, etc.). Discuss how food brings people together during celebrations."

              materials={[

                "Harvest book",

                "Various fruits and vegetables",

                "Simple cooking supplies",

                "Chart paper",

                "Sorting trays",

              ]}

              assessmentNotes="Observe students' understanding of how harvests are celebrated in different cultures and their ability to sort and classify harvest items."

              color="cyan"

            />

          </TabsContent>



          <TabsContent value="thursday">

            <DailyPlan

              day="Thursday"

              theme="New Year Celebrations"

              morningActivity="Morning Circle: Focus on New Year celebrations. Read 'Shanté Keys and the New Year's Peas' by Gail Piernas-Davenport or 'Dragon Dance: A Chinese New Year' by Joan Holub. Discuss how different cultures celebrate new beginnings."

              literacyFocus="Compare and contrast different New Year celebrations using a Venn diagram."

              mathFocus="Practice counting backward from 10 to 1 (like a New Year countdown)."

              afternoonActivity="Create New Year crafts from different cultures, such as paper dragons for Lunar New Year, noisemakers for January 1st celebrations, or decorated eggs for Nowruz."

              materials={[

                "Books about New Year celebrations",

                "Craft materials for various New Year crafts",

                "Venn diagram template",

                "Number cards 1-10",

              ]}

              assessmentNotes="Note students' understanding of similarities and differences between New Year celebrations from different cultures."

              color="cyan"

            />

          </TabsContent>



          <TabsContent value="friday">

            <DailyPlan

              day="Friday"

              theme="Cultural Celebration Day"

              morningActivity="Morning Circle: Review the week's learning about cultural celebrations. Read 'Let's Celebrate: Special Days Around the World' by Kate DePalma or a similar book. Discuss the importance of respecting and appreciating different cultural traditions."

              literacyFocus="Create a class book about cultural celebrations with each child contributing a page about a celebration they learned about."

              mathFocus="Create a graph showing children's favorite cultural celebrations from the week."

              afternoonActivity="Hold a mini cultural festival with stations representing different celebrations. Include simple foods, crafts, music, and activities from various cultural traditions."

              materials={[

                "Let's Celebrate book",

                "Book-making materials",

                "Cultural celebration foods and crafts",

                "Music from different cultures",

                "Graphing materials",

              ]}

              assessmentNotes="Evaluate students' understanding of cultural celebrations and their ability to show respect for diverse traditions."

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

            title="World Celebration Map"

            description="Create an interactive world map showing where different cultural celebrations originate, helping children develop global awareness."

            duration="45 minutes"

            materials={[

              "Large world map or globe",

              "Celebration symbols or stickers",

              "Information cards about each celebration",

              "Pins or tape",

            ]}

            learningAreas={["Social Studies", "Geography", "Cultural Awareness", "Language"]}

            color="cyan"

          />



          <ActivityCard

            title="Festival of Lights Lanterns"

            description="Children create paper lanterns inspired by light festivals from around the world, exploring the symbolism of light in celebrations."

            duration="30 minutes"

            materials={["Colored paper", "Scissors", "Glue", "String", "Decorative materials", "LED tea lights"]}

            learningAreas={["Art", "Cultural Studies", "Fine Motor Skills", "Science"]}

            color="cyan"

          />



          <ActivityCard

            title="New Year Dragon Dance"

            description="Children learn about and perform a simplified version of the Lunar New Year dragon dance, exploring movement and cultural traditions."

            duration="35 minutes"

            materials={[

              "Dragon puppet or costume pieces",

              "Drums or percussion instruments",

              "Red and gold decorations",

              "Music from Lunar New Year celebrations",

            ]}

            learningAreas={["Music", "Movement", "Cultural Studies", "Cooperation"]}

            color="cyan"

          />



          <ActivityCard

            title="Diwali Exploration"

            description="Children learn about the Festival of Lights through stories, art, and sensory experiences."

            duration="40 minutes"

            materials={[

              "Diwali storybook",

              "Clay for making diya lamps",

              "Colored sand for rangoli patterns",

              "Battery tea lights",

            ]}

            learningAreas={["Cultural Studies", "Art", "Sensory Exploration", "Language"]}

            color="cyan"

          />

        </div>

      </div>



      <TeacherTip

        title="Community Connections"

        tip="Invite family members or community volunteers to share their cultural celebration traditions with the class if possible. This provides children with authentic experiences and helps them connect with real people who celebrate these traditions."

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

                <li>"Celebrations Around the World" by Katy Halford</li>

                <li>"Lighting a Lamp: A Diwali Story" by Jonny Zucker</li>

                <li>"Dragon Dance: A Chinese New Year" by Joan Holub</li>

                <li>"Harvest" by Lizzy Rockwell</li>

                <li>"Let's Celebrate: Special Days Around the World" by Kate DePalma</li>

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

                <li>World map celebration markers</li>

                <li>Cultural celebration matching cards</li>

                <li>Festival symbols coloring pages</li>

                <li>Venn diagram templates</li>

                <li>Cultural celebration vocabulary cards</li>

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

                Send home a family activity sheet asking families to share information about a cultural celebration that

                is important to them. Include space for drawing or attaching a photo.

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

          <Link to="/curriculum/kindergarten/celebrations/week-1">Previous Week: Family Celebrations</Link>

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

          <Link to="/curriculum/kindergarten/celebrations/week-3"><Button>Next Week: Special Foods & Decorations</Button></Link>

        </div>

      </div>

    </div>

  )

}


