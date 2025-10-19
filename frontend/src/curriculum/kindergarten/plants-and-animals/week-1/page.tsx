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



export default function PlantsAndAnimalsWeek1() {

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

          <h1 className="text-3xl font-bold mb-4 text-pink-700">Week 1: Plants and Animals in Our Lives</h1>

          <div className="bg-pink-50 p-4 rounded-lg mb-4">

            <h2 className="text-xl font-semibold mb-2 text-pink-700">Weekly Focus</h2>

            <p>

              Children develop awareness of how plants and animals make a difference in their daily lives, learn to

              distinguish between living and non-living things, and understand that humans are animals too.

            </p>

          </div>

          

          {/* Navigation Buttons */}

          <div className="flex flex-col md:flex-row gap-3 justify-start">

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/plants-and-animals/week-1/week-plan.pdf">

                <Download className="mr-2 h-4 w-4" /> Week Plan PDF

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/plants-and-animals/week-1/materials">

                <Printer className="mr-2 h-4 w-4" /> All Materials

              </Link>

            </Button>

            <Button size="sm" asChild className="bg-pink-600 hover:bg-pink-700">

              <Link to="/kindergarten-planner">

                <BookOpen className="mr-2 h-4 w-4" /> Plan Your Lesson

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/plants-and-animals">

                <ChevronLeft className="mr-2 h-4 w-4" /> Previous Week

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/plants-and-animals/week-2">

                Next Week <ChevronLeft className="mr-2 h-4 w-4 rotate-180" />

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

                  <span>Identify the difference between living and non-living things</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-pink-500 mr-2 mt-0.5" />

                  <span>Distinguish between plants and animals</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-pink-500 mr-2 mt-0.5" />

                  <span>Understand that humans are animals</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-pink-500 mr-2 mt-0.5" />

                  <span>Recognize how plants and animals provide food and other resources</span>

                </li>

              </ul>

            </CardContent>

          </Card>

        </div>

      </div>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="md:col-span-2">

          <img src="/kindergarten-living-things.png" alt="Children’s crayon drawing with the title “LIVING & NON-LIVING,” showing kids, a dog, plants, butterfly, cloud, house, and rock to illustrate living and non-living things, and that humans are animals too." className="w-auto h-auto" />

        </div>

        <div>

          <WeeklyOverview

            theme="Plants and Animals in Our Lives"

            focusAreas={["Living vs. non-living", "Plants vs. animals", "Humans as animals", "Food sources"]}

            vocabulary={[

              "living",

              "non-living",

              "plant",

              "animal",

              "human",

              "survive",

              "food",

              "roots",

              "leaves",

              "habitat",

            ]}

            color="pink"

          />

        </div>

      </div>



      <TeacherTip

        title="Introducing Living and Non-living Things"

        tip="When teaching the difference between living and non-living things, use concrete examples that children can observe directly. Bring in a variety of items for children to sort, including plants, toy animals, rocks, and classroom objects. Emphasize that living things grow, need food/water, and can reproduce, while non-living things cannot."

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

              theme="Introduction to Plants and Animals"

              morningActivity="Morning Circle: Discuss what children like to eat and where food comes from"

              literacyFocus="Sing 'Old MacDonald Had a Farm' with local plants and animals"

              mathFocus="Count and sort picture cards of different foods by plant or animal source"

              afternoonActivity="Create a chart with the question 'How do plants and animals make a difference to me and my world?'"

              materials={[

                "Pictures of local foods",

                "Picture cards of plants and animals",

                "Chart paper",

                "Art supplies",

                "Food photographs",

              ]}

              assessmentNotes="Observe students' prior knowledge about plants and animals and their understanding of where food comes from."

              color="pink"

            />

          </TabsContent>



          <TabsContent value="tuesday">

            <DailyPlan

              day="Tuesday"

              theme="Living and Non-living Things"

              morningActivity="Morning Circle: Introduce the concept of living and non-living things"

              literacyFocus="Watch video about living and non-living things"

              mathFocus="Sort and count classroom items into living and non-living categories"

              afternoonActivity="Nature walk to observe and identify living and non-living things"

              materials={[

                "Video about living/non-living things",

                "Collection of classroom items",

                "Sorting circles",

                "Clipboards",

                "Observation sheets",

              ]}

              assessmentNotes="Note students' ability to distinguish between living and non-living things and their understanding of characteristics of living things."

              color="pink"

            />

          </TabsContent>



          <TabsContent value="wednesday">

            <DailyPlan

              day="Wednesday"

              theme="Plants vs. Animals"

              morningActivity="Morning Circle: Discuss differences between plants and animals"

              literacyFocus="Nature walk to collect leaves and observe small animals"

              mathFocus="Create and use simple tally marks for plant and animal observations"

              afternoonActivity="Create play dough models of plants and animals"

              materials={[

                "Pictures of plants and animals",

                "Magnifying glasses",

                "Collection containers",

                "Play dough",

                "Plant and animal specimens",

              ]}

              assessmentNotes="Observe students' ability to identify differences between plants and animals and their understanding of basic characteristics."

              color="pink"

            />

          </TabsContent>



          <TabsContent value="thursday">

            <DailyPlan

              day="Thursday"

              theme="Humans Are Animals"

              morningActivity="Morning Circle: Discuss similarities between humans and other animals"

              literacyFocus="Sing 'Head, Shoulders, Knees and Toes' and compare to animal body parts"

              mathFocus="Count and compare body parts between humans and animals"

              afternoonActivity="Create a Venn diagram comparing humans and other animals"

              materials={[

                "Pictures of animals",

                "Body part cards",

                "Chart paper for Venn diagram",

                "Drawing supplies",

                "Animal puzzles",

              ]}

              assessmentNotes="Note students' understanding that humans are animals and their ability to identify similarities and differences."

              color="pink"

            />

          </TabsContent>



          <TabsContent value="friday">

            <DailyPlan

              day="Friday"

              theme="Plants and Animals Make a Difference"

              morningActivity="Morning Circle: Review the week's learning about plants and animals"

              literacyFocus="Read 'The Very Hungry Caterpillar' by Eric Carle"

              mathFocus="Count and graph foods eaten by the caterpillar by day of the week"

              afternoonActivity="Show and tell: Students share about their favorite plant or animal"

              materials={[

                "The Very Hungry Caterpillar book",

                "Graphing materials",

                "Pictures of students' favorite plants/animals",

                "Art supplies",

                "Mystery bags with plant/animal items",

              ]}

              assessmentNotes="Evaluate students' understanding of how plants and animals make a difference in their lives and their ability to share information about plants and animals."

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

            title="Living/Non-living Scrapbook"

            description="Students create a class or individual scrapbooks with pictures sorted into living and non-living categories, labeling items with beginning letter sounds."

            duration="45 minutes"

            materials={["Construction paper", "Glue", "Scissors", "Magazine pictures", "Markers"]}

            learningAreas={["Science", "Literacy", "Fine Motor"]}

            color="pink"

          />



          <ActivityCard

            title="Mystery Bag Exploration"

            description="Students explore mystery bags containing items related to plants and animals (leaves, feathers, fruits, etc.) and discuss how these items make a difference in their lives."

            duration="30 minutes"

            materials={["Paper bags", "Plant and animal items", "Magnifying glasses", "Recording sheets"]}

            learningAreas={["Science", "Language Development", "Critical Thinking"]}

            color="pink"

          />



          <ActivityCard

            title="Plant and Animal Charades"

            description="Students take turns acting out different plants and animals while classmates guess what they are portraying."

            duration="25 minutes"

            materials={["Picture cards of plants and animals", "Timer", "Props (optional)"]}

            learningAreas={["Physical Development", "Science", "Social Skills"]}

            color="pink"

          />



          <ActivityCard

            title="Food Source Sorting"

            description="Students sort food pictures based on whether they come from plants or animals, creating a visual display of food sources."

            duration="35 minutes"

            materials={["Food pictures", "Sorting mats", "Glue", "Chart paper", "Markers"]}

            learningAreas={["Science", "Nutrition", "Classification Skills"]}

            color="pink"

          />

        </div>

      </div>



      <TeacherTip

        title="Connecting to Children's Lives"

        tip="Make the learning relevant by connecting to children's everyday experiences with plants and animals. Ask children to share stories about pets they have at home, plants they've seen growing, or foods they enjoy. These personal connections help children understand the importance of plants and animals in their lives and build a foundation for environmental stewardship."

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

                <li>"The Very Hungry Caterpillar" by Eric Carle</li>

                <li>"From Farm to Table" by Ali Mitgutsch</li>

                <li>"Is It Alive?" by Marcia S. Freeman</li>

                <li>"What's Alive?" by Kathleen Weidner Zoehfeld</li>

                <li>"Animals and Their Homes" by Pamela Hickman</li>

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

                <li>Living/non-living sorting cards</li>

                <li>Plant and animal picture cards</li>

                <li>Food source classification sheets</li>

                <li>Human-animal comparison worksheet</li>

                <li>Letter Z, W, Y, X practice sheets</li>

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

                Send home a family activity sheet that encourages parents/caregivers to talk with their child about

                plants and animals they encounter daily and how these living things help us.

              </p>

              <Button variant="outline" className="w-full border-pink-500 text-pink-700 hover:bg-pink-50">

                <Download className="mr-2 h-4 w-4" /> Family Activity

              </Button>

            </CardContent>

          </Card>

        </div>

      </div>



      <div className="flex justify-between">

        <Button variant="outline" asChild>

          <Link to="/curriculum/kindergarten/plants-and-animals">Back to Plants and Animals Unit</Link>

        </Button>

        <Link to="/curriculum/kindergarten/plants-and-animals/week-2"><Button>Next Week: Survival Needs</Button></Link>

      </div>

    </div>

  )

}
