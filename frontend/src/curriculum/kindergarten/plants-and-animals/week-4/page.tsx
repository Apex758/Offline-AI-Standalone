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



export default function PlantsAndAnimalsWeek4() {

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

          <h1 className="text-3xl font-bold mb-4 text-green-700">Week 4: Changing Environments</h1>

          <div className="bg-green-50 p-4 rounded-lg mb-4">

            <h2 className="text-xl font-semibold mb-2 text-green-700">Weekly Focus</h2>

            <p>

              Children discover how plants and animals (including humans) can change their environments to meet their

              needs, and learn to identify evidence of these changes.

            </p>

          </div>

          

          {/* Navigation Buttons */}

          <div className="flex flex-col md:flex-row gap-3 justify-start">

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/plants-and-animals/week-4/week-plan.pdf">

                <Download className="mr-2 h-4 w-4" /> Week Plan PDF

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/plants-and-animals/week-4/materials">

                <Printer className="mr-2 h-4 w-4" /> All Materials

              </Link>

            </Button>

            <Button size="sm" asChild className="bg-green-600 hover:bg-green-700">

              <Link to="/kindergarten-planner">

                <BookOpen className="mr-2 h-4 w-4" /> Plan Your Lesson

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/plants-and-animals/week-3">

                <ChevronLeft className="mr-2 h-4 w-4" /> Previous Week

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/plants-and-animals/week-5">

                Next Week <ChevronLeft className="mr-2 h-4 w-4 rotate-180" />

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

                  <span>Understand how plants can change their environment</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />

                  <span>Explore how animals change their environment</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />

                  <span>Recognize how humans change the environment</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />

                  <span>Identify evidence of environmental changes</span>

                </li>

              </ul>

            </CardContent>

          </Card>

        </div>

      </div>







      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="md:col-span-2">

          <img src="/kindergarten-environments.png" alt="Children’s crayon drawing with the words “CHANGING ENVIRONMENTS,” showing a boy building a house, a beaver cutting a tree, a rabbit digging, an elephant near palm trees, plants growing, and symbols of sun, rain, and shelter to illustrate how living things change their environments." className="w-auto h-auto" />

        </div>

        <div>

          <WeeklyOverview

            theme="Changing Environments"

            focusAreas={["Plant changes", "Animal changes", "Human impact", "Environmental evidence"]}

            vocabulary={[

              "change",

              "environment",

              "roots",

              "burrow",

              "nest",

              "dam",

              "web",

              "tunnel",

              "evidence",

              "impact",

            ]}

            color="green"

          />

        </div>

      </div>



      <TeacherTip

        title="Observing Environmental Changes"

        tip="Take children on a 'detective walk' around the school grounds to look for evidence of how plants and animals have changed the environment. Look for ant hills, bird nests, plant roots breaking through concrete, or vines growing up walls. Take photographs of these examples to create a class book of 'Environmental Detectives' that children can revisit and discuss."

        color="green"

      />



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center">

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

              theme="How Plants Change the Environment"

              morningActivity="Morning Circle: Introduce the concept of environmental changes"

              literacyFocus="Watch video about how plants change their environment"

              mathFocus="Sort and count pictures of plant environmental changes"

              afternoonActivity="Draw a picture showing how a plant changes its environment"

              materials={[

                "Video about plant changes",

                "Picture cards of environmental changes",

                "Drawing supplies",

                "Chart paper",

                "Plant photographs",

              ]}

              assessmentNotes="Observe students' understanding of how plants can change their environment and their ability to identify examples."

              color="green"

            />

          </TabsContent>



          <TabsContent value="tuesday">

            <DailyPlan

              day="Tuesday"

              theme="Plant Hero Adventure"

              morningActivity="Morning Circle: Introduce 'Plant Heroes' that change their environment"

              literacyFocus="Read information cards about different plant heroes"

              mathFocus="Complete plant hero station activities with counting components"

              afternoonActivity="Create echo reading sentences about plant heroes"

              materials={[

                "Plant hero cards",

                "Station materials",

                "Sentence strips",

                "Chart paper",

                "Plant specimens or pictures",

              ]}

              assessmentNotes="Note students' ability to understand and explain how specific plants change their environment."

              color="green"

            />

          </TabsContent>



          <TabsContent value="wednesday">

            <DailyPlan

              day="Wednesday"

              theme="How Animals Change the Environment"

              morningActivity="Morning Circle: Discuss how animals can change their environment"

              literacyFocus="Create a shared writing list of animal environmental changes"

              mathFocus="Sort animal pictures by how they change their environment"

              afternoonActivity="Role-play different animals changing their environment"

              materials={[

                "Animal pictures",

                "Chart paper",

                "Sorting mats",

                "Props for role-play",

                "Video clips of animals",

              ]}

              assessmentNotes="Observe students' understanding of how animals change their environment to meet their needs."

              color="green"

            />

          </TabsContent>



          <TabsContent value="thursday">

            <DailyPlan

              day="Thursday"

              theme="Animals as Environmental Engineers"

              morningActivity="Morning Circle: Watch video about animals changing environments"

              literacyFocus="Discuss and record examples from the video"

              mathFocus="Create a graph of different animal environmental changes"

              afternoonActivity="Create artwork showing an animal changing its environment"

              materials={[

                "Video about animal changes",

                "Graphing materials",

                "Art supplies",

                "Animal pictures",

                "Environmental change cards",

              ]}

              assessmentNotes="Note students' ability to provide specific examples of how animals change their environment and why."

              color="green"

            />

          </TabsContent>



          <TabsContent value="friday">

            <DailyPlan

              day="Friday"

              theme="Environmental Detectives"

              morningActivity="Morning Circle: Prepare for environmental detective walk"

              literacyFocus="Create a list of things to look for on the walk"

              mathFocus="Count and record environmental changes observed"

              afternoonActivity="Nature walk to observe environmental changes and take photographs"

              materials={["Clipboards", "Observation sheets", "Magnifying glasses", "Camera", "Collection bags"]}

              assessmentNotes="Evaluate students' ability to identify evidence of plants and animals changing their environment in a real-world context."

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

            title="Plant Hero Stations"

            description="Students rotate through stations featuring different plants that change their environment, completing activities at each station."

            duration="45 minutes"

            materials={[

              "Plant information cards",

              "Activity sheets",

              "Plant specimens or pictures",

              "Magnifying glasses",

            ]}

            learningAreas={["Science", "Reading", "Fine Motor Skills"]}

            color="green"

          />



          <ActivityCard

            title="Animal Environment Changers"

            description="Students create models of animals changing their environment (e.g., birds building nests, beavers building dams, worms making tunnels)."

            duration="40 minutes"

            materials={["Clay/play dough", "Natural materials", "Animal figures", "Craft sticks", "Cotton balls"]}

            learningAreas={["Science", "Art", "Critical Thinking"]}

            color="green"

          />



          <ActivityCard

            title="Environmental Changes Charades"

            description="Students act out different ways that plants and animals change their environment while classmates guess what they're portraying."

            duration="30 minutes"

            materials={["Picture cards of environmental changes", "Props (optional)", "Timer"]}

            learningAreas={["Physical Development", "Science", "Communication"]}

            color="green"

          />



          <ActivityCard

            title="Before and After Scenes"

            description="Students create before and after drawings showing how a plant or animal changed its environment."

            duration="35 minutes"

            materials={["Paper divided in half", "Drawing supplies", "Before/after example cards", "Scissors", "Glue"]}

            learningAreas={["Science", "Art", "Sequential Thinking"]}

            color="green"

          />

        </div>

      </div>



      <TeacherTip

        title="Connecting to Children's Experiences"

        tip="Help children connect to the concept of changing environments by starting with their own experiences. Ask them how they change their environment at home or school (e.g., rearranging toys, building with blocks, digging in sand). This helps them understand that all living things, including humans, modify their surroundings to meet their needs."

        color="green"

      />



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center">

          <BookOpen className="mr-2 h-6 w-6" /> Resources

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card className="border-green-200">

            <CardHeader className="bg-green-50 border-b border-green-100">

              <CardTitle className="text-green-700">Books</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li>"Beaver Builds a Lodge" by Lisa J. Amstutz</li>

                <li>"A Seed Is Sleepy" by Dianna Hutts Aston</li>

                <li>"Animal Architects" by Amy Shields</li>

                <li>"Bee Builds a Hive" by Pam Scheunemann</li>

                <li>"Plants Can't Sit Still" by Rebecca E. Hirsch</li>

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

                <li>Environmental changes sorting cards</li>

                <li>Plant hero information cards</li>

                <li>Animal environment changers cards</li>

                <li>Environmental detective observation sheets</li>

                <li>Before and after template sheets</li>

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

                Send home a family activity sheet that encourages parents/caregivers to look for evidence of plants and

                animals changing their environment in their neighborhood or local park.

              </p>

              <Button variant="outline" className="w-full border-green-500 text-green-700 hover:bg-green-50">

                <Download className="mr-2 h-4 w-4" /> Family Activity

              </Button>

            </CardContent>

          </Card>

        </div>

      </div>



      <div className="flex justify-between">

        <Button variant="outline" asChild>

          <Link to="/curriculum/kindergarten/plants-and-animals/week-3">Previous Week: Habitats</Link>

        </Button>

        <Link to="/curriculum/kindergarten/plants-and-animals/week-5"><Button>Next Week: Environmental Stewardship</Button></Link>

      </div>

    </div>

  )

}
