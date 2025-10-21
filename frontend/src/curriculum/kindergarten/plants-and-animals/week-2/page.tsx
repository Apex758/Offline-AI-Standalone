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



export default function PlantsAndAnimalsWeek2() {

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

          <h1 className="text-3xl font-bold mb-4 text-amber-700">Week 2: Survival Needs</h1>

          <div className="bg-amber-50 p-4 rounded-lg mb-4">

            <h2 className="text-xl font-semibold mb-2 text-amber-700">Weekly Focus</h2>

            <p>

              Children explore what it means to survive and investigate the basic needs of plants and animals, including

              water, light, food, and shelter through hands-on experiments and activities.

            </p>

          </div>

          

          {/* Navigation Buttons */}

          <div className="flex flex-col md:flex-row gap-3 justify-start">

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/plants-and-animals/week-2/week-plan.pdf">

                <Download className="mr-2 h-4 w-4" /> Week Plan PDF

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/plants-and-animals/week-2/materials">

                <Printer className="mr-2 h-4 w-4" /> All Materials

              </Link>

            </Button>

            <Button size="sm" asChild className="bg-amber-600 hover:bg-amber-700">

              <Link to="/kindergarten-planner">

                <BookOpen className="mr-2 h-4 w-4" /> Plan Your Lesson

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/plants-and-animals/week-1">

                <ChevronLeft className="mr-2 h-4 w-4" /> Previous Week

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/plants-and-animals/week-3">

                Next Week <ChevronLeft className="mr-2 h-4 w-4 rotate-180" />

              </Link>

            </Button>

          </div>

        </div>

        <div className="md:w-1/3">

          <Card className="border-amber-200 shadow-md">

            <CardHeader className="bg-amber-50 border-b border-amber-100">

              <CardTitle className="flex items-center text-amber-700">

                <Clock className="mr-2 h-5 w-5" /> Week at a Glance

              </CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />

                  <span>Understand what "survive" means</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />

                  <span>Recognize that all living things need water</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />

                  <span>Learn that plants need light to live and grow</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />

                  <span>Understand that animals need food to survive</span>

                </li>

              </ul>

            </CardContent>

          </Card>

        </div>

      </div>







      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="md:col-span-2">

          <img src="./kindergarten-needs.png" alt="Children’s crayon drawing with the words “NEEDS FOR SURVIVAL,” showing a sun, rain cloud, plant, deer, apple, house, and children, labeled with “LIGHT,” “WATER,” “FOOD,” and “SHELTER” to illustrate basic needs of plants and animals." className="w-auto h-auto" />

        </div>

        <div>

          <WeeklyOverview

            theme="Survival Needs"

            focusAreas={["Survival basics", "Plant needs", "Animal needs", "Food chains"]}

            vocabulary={[

              "survive",

              "water",

              "light",

              "food",

              "shelter",

              "air",

              "soil",

              "sunlight",

              "nutrients",

              "growth",

            ]}

            color="orange"

          />

        </div>

      </div>



      <TeacherTip

        title="Plant Experiments"

        tip="When conducting plant experiments, use clear plastic cups so children can observe root development. Label each plant with the variable being tested (e.g., 'No Water,' 'No Light'). Take photos every few days to document changes over time, and create a class book of observations. This helps children visualize the effects of different conditions on plant growth."

        color="orange"

      />



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-amber-700 flex items-center py-6">

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

              theme="What Does It Mean to Survive?"

              morningActivity="Morning Circle: Introduce the concept of survival through scenarios"

              literacyFocus="Watch video about survival needs of living things"

              mathFocus="Count and sort picture cards of survival needs"

              afternoonActivity="Create a class chart about what it means to survive"

              materials={[

                "Video about survival",

                "Picture cards of survival needs",

                "Chart paper",

                "Art supplies",

                "Scenario cards",

              ]}

              assessmentNotes="Observe students' understanding of the concept of survival and their ability to identify basic survival needs."

              color="orange"

            />

          </TabsContent>



          <TabsContent value="tuesday">

            <DailyPlan

              day="Tuesday"

              theme="Plants Need Water and Light"

              morningActivity="Morning Circle: Set up plant experiment with two cups - one with water and light, one without"

              literacyFocus="Read poem about plant needs"

              mathFocus="Create observation chart for plant experiment"

              afternoonActivity="Observe and record initial plant conditions"

              materials={[

                "Plant seeds",

                "Clear plastic cups",

                "Soil",

                "Water",

                "Observation charts",

                "Magnifying glasses",

              ]}

              assessmentNotes="Note students' predictions about plant needs and their observation skills."

              color="orange"

            />

          </TabsContent>



          <TabsContent value="wednesday">

            <DailyPlan

              day="Wednesday"

              theme="Plants Don't Move Around"

              morningActivity="Morning Circle: Discuss how plants make their own food"

              literacyFocus="Learn and perform poem about plants with actions"

              mathFocus="Complete plant obstacle course with counting stations"

              afternoonActivity="Create artwork showing how plants get what they need"

              materials={[

                "Plant poem chart",

                "Obstacle course materials",

                "Art supplies",

                "Plant diagrams",

                "Pictures of plants",

              ]}

              assessmentNotes="Observe students' understanding that plants make their own food and don't need to move around."

              color="orange"

            />

          </TabsContent>



          <TabsContent value="thursday">

            <DailyPlan

              day="Thursday"

              theme="Animals Need Food"

              morningActivity="Morning Circle: Revisit 'The Very Hungry Caterpillar' focusing on food needs"

              literacyFocus="Create a class book about what different animals eat"

              mathFocus="Sort and count animal food pictures by type"

              afternoonActivity="Role-play different animals finding food"

              materials={[

                "The Very Hungry Caterpillar book",

                "Animal food pictures",

                "Book-making materials",

                "Sorting mats",

                "Animal masks/props",

              ]}

              assessmentNotes="Note students' understanding that animals need food to survive and different animals eat different foods."

              color="orange"

            />

          </TabsContent>



          <TabsContent value="friday">

            <DailyPlan

              day="Friday"

              theme="Weird and Wonderful Pets"

              morningActivity="Morning Circle: Check plant experiment results and discuss"

              literacyFocus="Share stories about pet care and needs"

              mathFocus="Create a graph of class pets and their needs"

              afternoonActivity="Draw and describe a 'weird and wonderful pet' and its survival needs"

              materials={[

                "Plant experiment cups",

                "Graphing materials",

                "Drawing supplies",

                "Pet care books",

                "Pet pictures",

              ]}

              assessmentNotes="Evaluate students' understanding of plant and animal needs and their ability to apply this knowledge to a creative context."

              color="orange"

            />

          </TabsContent>

        </Tabs>

      </div>



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-amber-700 flex items-center">

          <Lightbulb className="mr-2 h-6 w-6" /> Featured Activities

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <ActivityCard

            title="Plant Survival Experiment"

            description="Students set up an experiment with multiple plants in different conditions (with/without water, with/without light) and observe the results over several days."

            duration="Initial setup: 30 minutes, Daily observations: 10 minutes"

            materials={["Small plants or seeds", "Clear cups", "Soil", "Water", "Observation journals", "Markers"]}

            learningAreas={["Science", "Observation Skills", "Recording Data"]}

            color="orange"

          />



          <ActivityCard

            title="Plant Shop Dramatic Play"

            description="Students explore different plant needs through a dramatic play plant shop, where they 'purchase' items plants need to survive like sunlight, water, and soil."

            duration="Ongoing center"

            materials={["Play money", "Plant pictures", "Price tags", "Shop signs", "Plant care cards"]}

            learningAreas={["Dramatic Play", "Science", "Math"]}

            color="orange"

          />



          <ActivityCard

            title="Animal Food Sorting"

            description="Students sort pictures of animals based on what they eat (plants, other animals, or both) and create a collaborative chart."

            duration="35 minutes"

            materials={["Animal pictures", "Food pictures", "Sorting mats", "Chart paper", "Glue"]}

            learningAreas={["Science", "Classification", "Collaboration"]}

            color="orange"

          />



          <ActivityCard

            title="Survival Obstacle Course"

            description="Students move through an obstacle course that simulates how plants get what they need (reaching for sunlight, finding water) and how animals find food and shelter."

            duration="45 minutes"

            materials={["Tunnels", "Cones", "Toy sun", "Water jugs", "Animal masks"]}

            learningAreas={["Physical Development", "Science", "Role Play"]}

            color="orange"

          />

        </div>

      </div>



      <TeacherTip

        title="Making Abstract Concepts Concrete"

        tip="The concept of 'survival' can be abstract for young children. Make it concrete by relating it to their daily experiences: 'Just like you need food when you're hungry and water when you're thirsty, plants and animals need certain things to stay alive and healthy.' Use simple analogies that connect to children's lives, such as comparing a plant's need for water to their own need for water when they're thirsty."

        color="orange"

      />



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-amber-700 flex items-center py-6">

          <BookOpen className="mr-2 h-6 w-6" /> Resources

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card className="border-amber-200">

            <CardHeader className="bg-amber-50 border-b border-amber-100">

              <CardTitle className="text-amber-700">Books</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li>"The Tiny Seed" by Eric Carle</li>

                <li>"From Seed to Plant" by Gail Gibbons</li>

                <li>"The Very Hungry Caterpillar" by Eric Carle</li>

                <li>"What Do Living Things Need?" by Elizabeth Austen</li>

                <li>"I Can't Live Here" by Pamela Hickman</li>

              </ul>

              <Button variant="outline" className="mt-4 w-full border-amber-500 text-amber-700 hover:bg-amber-50">

                <Download className="mr-2 h-4 w-4" /> Book List PDF

              </Button>

            </CardContent>

          </Card>



          <Card className="border-amber-200">

            <CardHeader className="bg-amber-50 border-b border-amber-100">

              <CardTitle className="text-amber-700">Printables</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li>Plant needs observation sheets</li>

                <li>Animal food sorting cards</li>

                <li>Plant and animal needs comparison chart</li>

                <li>Survival needs checklist</li>

                <li>Plant growth recording sheets</li>

              </ul>

              <Button variant="outline" className="mt-4 w-full border-amber-500 text-amber-700 hover:bg-amber-50">

                <Printer className="mr-2 h-4 w-4" /> Print Materials

              </Button>

            </CardContent>

          </Card>



          <Card className="border-amber-200">

            <CardHeader className="bg-amber-50 border-b border-amber-100">

              <CardTitle className="text-amber-700">Home Connection</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <p className="mb-4">

                Send home a family activity sheet that encourages parents/caregivers to help their child identify and

                care for living things at home, focusing on what plants and pets need to survive.

              </p>

              <Button variant="outline" className="w-full border-amber-500 text-amber-700 hover:bg-amber-50">

                <Download className="mr-2 h-4 w-4" /> Family Activity

              </Button>

            </CardContent>

          </Card>

        </div>

      </div>



      <div className="flex justify-between">

        <Button variant="outline" asChild>

          <Link to="/curriculum/kindergarten/plants-and-animals/week-1">

            Previous Week: Plants and Animals in Our Lives

          </Link>

        </Button>

        <Link to="/curriculum/kindergarten/plants-and-animals/week-3"><Button>Next Week: Habitats</Button></Link>

      </div>

    </div>

  )

}
