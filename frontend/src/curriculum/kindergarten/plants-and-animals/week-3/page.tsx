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



export default function PlantsAndAnimalsWeek3() {

  return (

    <div className="container mx-auto px-4 py-8">

            <div className="flex items-center gap-2 mb-4">

        <Link to="/curriculum/kindergarten/plants-and-animals">

          <Button variant="outline" className="mb-2">

            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Plants and Animals Unit

          </Button>

        </Link>

      </div>



      <div className="flex flex-col md:flex-row gap-6 mb-8">

        <div className="flex-1">

          <h1 className="text-3xl font-bold mb-4 text-blue-700">Week 3: Habitats</h1>

          <div className="bg-blue-50 p-4 rounded-lg mb-4">

            <h2 className="text-xl font-semibold mb-2 text-blue-700">Weekly Focus</h2>

            <p>

              Children learn about different habitats and why specific plants and animals live in certain places,

              exploring how plants and animals depend on each other and their environment.

            </p>

          </div>

          

          {/* Navigation Buttons */}

          <div className="flex flex-col md:flex-row gap-3 justify-start">

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/plants-and-animals/week-3/week-plan.pdf">

                <Download className="mr-2 h-4 w-4" /> Week Plan PDF

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/plants-and-animals/week-3/materials">

                <Printer className="mr-2 h-4 w-4" /> All Materials

              </Link>

            </Button>

            <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700">

              <Link to="/kindergarten-planner">

                <BookOpen className="mr-2 h-4 w-4" /> Plan Your Lesson

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/plants-and-animals/week-2">

                <ChevronLeft className="mr-2 h-4 w-4" /> Previous Week

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/plants-and-animals/week-4">

                Next Week <ChevronLeft className="mr-2 h-4 w-4 rotate-180" />

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

                  <span>Understand why plants and animals live where they do</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />

                  <span>Explore different types of habitats</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />

                  <span>Create models of habitats</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />

                  <span>Recognize how plants and animals depend on each other</span>

                </li>

              </ul>

            </CardContent>

          </Card>

        </div>

      </div>







      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="md:col-span-2">

          <img src="/kindergarten-habitats.png" alt="Children’s crayon drawing with the word “HABITATS,” showing Arctic with a polar bear, Ocean with dolphins and fish, Desert with cactus and camel, and Forest with trees, fox, and a child, illustrating how plants and animals live in different environments." className="w-auto h-auto" />

        </div>

        <div>

          <WeeklyOverview

            theme="Habitats"

            focusAreas={["Habitat types", "Habitat needs", "Interdependence", "Habitat models"]}

            vocabulary={[

              "habitat",

              "forest",

              "ocean",

              "desert",

              "pond",

              "grassland",

              "depend",

              "environment",

              "adapt",

              "ecosystem",

            ]}

            color="blue"

          />

        </div>

      </div>



      <TeacherTip

        title="Creating Habitat Models"

        tip="When creating habitat models with young children, provide a variety of natural and recycled materials. Encourage children to think about what the plants and animals in their habitat need to survive. Take photos of the completed models and create a class book where children can dictate or write about their habitats. This extends the learning and creates a lasting record of their understanding."

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

              theme="What is a Habitat?"

              morningActivity="Morning Circle: Introduce the concept of habitats using the poem 'At My Home'"

              literacyFocus="Discuss where humans live and why"

              mathFocus="Count and sort pictures of different habitats"

              afternoonActivity="Play 'Skip to My Lou' with habitat-themed verses"

              materials={[

                "Habitat poem chart",

                "Pictures of different habitats",

                "Sorting mats",

                "Music for game",

                "Habitat photographs",

              ]}

              assessmentNotes="Observe students' prior knowledge about habitats and their understanding of why living things live in specific places."

              color="blue"

            />

          </TabsContent>



          <TabsContent value="tuesday">

            <DailyPlan

              day="Tuesday"

              theme="Exploring Habitats"

              morningActivity="Morning Circle: Watch video about different habitats"

              literacyFocus="Create a chart of habitats and the plants/animals that live there"

              mathFocus="Count and graph the number of animals in each habitat"

              afternoonActivity="Create a large class mural of habitats"

              materials={[

                "Habitat video",

                "Chart paper",

                "Graphing materials",

                "Large paper for mural",

                "Art supplies",

              ]}

              assessmentNotes="Note students' ability to match animals to appropriate habitats and their understanding of habitat characteristics."

              color="blue"

            />

          </TabsContent>



          <TabsContent value="wednesday">

            <DailyPlan

              day="Wednesday"

              theme="Where Can I Live?"

              morningActivity="Morning Circle: Read 'I Can't Live Here' story"

              literacyFocus="Discuss why certain animals can't live in certain habitats"

              mathFocus="Match animals to their habitats using a sorting activity"

              afternoonActivity="Draw a picture of an animal in a habitat where it couldn't survive"

              materials={[

                "I Can't Live Here book/video",

                "Animal habitat matching cards",

                "Drawing supplies",

                "Habitat background sheets",

                "Animal pictures",

              ]}

              assessmentNotes="Observe students' understanding of why animals need specific habitats to meet their survival needs."

              color="blue"

            />

          </TabsContent>



          <TabsContent value="thursday">

            <DailyPlan

              day="Thursday"

              theme="Plants and Animals Depend on Each Other"

              morningActivity="Morning Circle: Sing 'The Green Grass Grows All Around'"

              literacyFocus="Discuss how plants and animals in the song depend on each other"

              mathFocus="Create a web of connections between plants and animals"

              afternoonActivity="Play 'Web of Life' game with plant and animal cards"

              materials={[

                "Song lyrics chart",

                "Plant and animal cards",

                "String for web connections",

                "Chart paper",

                "Game materials",

              ]}

              assessmentNotes="Note students' understanding of interdependence between plants and animals in a habitat."

              color="blue"

            />

          </TabsContent>



          <TabsContent value="friday">

            <DailyPlan

              day="Friday"

              theme="Creating Habitat Models"

              morningActivity="Morning Circle: Review what makes a good habitat"

              literacyFocus="Plan habitat models with partners"

              mathFocus="Collect and count materials needed for habitat models"

              afternoonActivity="Create habitat models and present to visitors"

              materials={[

                "Cardboard bases",

                "Natural materials",

                "Recycled materials",

                "Clay/play dough",

                "Small animal figures",

              ]}

              assessmentNotes="Evaluate students' ability to create a model that shows understanding of habitat components and needs."

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

            title="Habitat Matching Game"

            description="Students match animal cards to their correct habitat mats, discussing why each animal belongs in that habitat."

            duration="30 minutes"

            materials={["Habitat mats", "Animal cards", "Sorting trays", "Habitat fact cards"]}

            learningAreas={["Science", "Critical Thinking", "Vocabulary Development"]}

            color="blue"

          />



          <ActivityCard

            title="Habitat Dioramas"

            description="Students create shoebox dioramas of different habitats, including appropriate plants and animals made from various materials."

            duration="60 minutes (may be spread over multiple sessions)"

            materials={["Shoeboxes", "Construction paper", "Natural materials", "Clay", "Small animal figures"]}

            learningAreas={["Science", "Art", "Fine Motor Skills"]}

            color="blue"

          />



          <ActivityCard

            title="Interdependence Diagrams"

            description="Students create simple diagrams showing connections between plants and animals in a habitat using pictures and arrows."

            duration="35 minutes"

            materials={["Plant and animal pictures", "Arrow cards", "Chart paper", "Glue", "Markers"]}

            learningAreas={["Science", "Systems Thinking", "Visual Representation"]}

            color="blue"

          />



          <ActivityCard

            title="Habitat Dramatic Play"

            description="Students role-play being different animals in their habitats, acting out how they find food, water, and shelter."

            duration="40 minutes"

            materials={["Animal masks/headbands", "Habitat backdrop", "Props for food/water/shelter", "Music"]}

            learningAreas={["Dramatic Play", "Science", "Physical Development"]}

            color="blue"

          />

        </div>

      </div>



      <TeacherTip

        title="Connecting to Local Habitats"

        tip="Make learning about habitats relevant by focusing on local environments that children may have experienced. Take a nature walk around the school to identify mini-habitats like a tree, a flower bed, or even a puddle after rain. Help children observe the plants and small animals that live in these spaces and discuss how these living things' needs are met in these habitats."

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

                <li>"Who Lives Here?" by Nicola Davies</li>

                <li>"A House Is a House for Me" by Mary Ann Hoberman</li>

                <li>"I Can't Live Here" by Pamela Hickman</li>

                <li>"Animal Homes" by Jennifer Boothroyd</li>

                <li>"The Great Kapok Tree" by Lynne Cherry</li>

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

                <li>Habitat sorting cards</li>

                <li>Animal-habitat matching worksheets</li>

                <li>Habitat characteristics charts</li>

                <li>Interdependence diagram templates</li>

                <li>Habitat model planning sheets</li>

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

                Send home a family activity sheet that encourages parents/caregivers to explore different habitats in

                their neighborhood with their child and discuss what plants and animals live there and why.

              </p>

              <Button variant="outline" className="w-full border-blue-500 text-blue-700 hover:bg-blue-50">

                <Download className="mr-2 h-4 w-4" /> Family Activity

              </Button>

            </CardContent>

          </Card>

        </div>

      </div>



      <div className="flex justify-between">

        <Button variant="outline" asChild>

          <Link to="/curriculum/kindergarten/plants-and-animals/week-2">Previous Week: Survival Needs</Link>

        </Button>

        <Link to="/curriculum/kindergarten/plants-and-animals/week-4"><Button>Next Week: Changing Environments</Button></Link>

      </div>

    </div>

  )

}
