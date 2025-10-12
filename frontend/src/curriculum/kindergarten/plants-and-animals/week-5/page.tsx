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



export default function PlantsAndAnimalsWeek5() {

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

          <h1 className="text-3xl font-bold mb-4 text-purple-700">Week 5: Environmental Stewardship</h1>

          <div className="bg-purple-50 p-4 rounded-lg mb-4">

            <h2 className="text-xl font-semibold mb-2 text-purple-700">Weekly Focus</h2>

            <p>

              Children learn how human activities affect the environment and explore ways they can help reduce their

              impact on the land, water, air, and other living things.

            </p>

          </div>

          

          {/* Navigation Buttons */}

          <div className="flex flex-col md:flex-row gap-3 justify-start">

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/plants-and-animals/week-5/week-plan.pdf">

                <Download className="mr-2 h-4 w-4" /> Week Plan PDF

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/plants-and-animals/week-5/materials">

                <Printer className="mr-2 h-4 w-4" /> All Materials

              </Link>

            </Button>

            <Button size="sm" asChild className="bg-purple-600 hover:bg-purple-700">

              <Link to="/kindergarten-planner">

                <BookOpen className="mr-2 h-4 w-4" /> Plan Your Lesson

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/plants-and-animals/week-4">

                <ChevronLeft className="mr-2 h-4 w-4" /> Previous Week

              </Link>

            </Button>

            <Button variant="outline" size="sm" asChild>

              <Link to="/curriculum/kindergarten/plants-and-animals">

                Plants and Animals Unit Complete

              </Link>

            </Button>

          </div>

        </div>

        <div className="md:w-1/3">

          <Card className="border-purple-200 shadow-md">

            <CardHeader className="bg-purple-50 border-b border-purple-100">

              <CardTitle className="flex items-center text-purple-700">

                <Clock className="mr-2 h-5 w-5" /> Week at a Glance

              </CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />

                  <span>Understand how human activities affect the environment</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />

                  <span>Identify ways to reduce human impact</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />

                  <span>Learn about recycling and conservation</span>

                </li>

                <li className="flex items-start">

                  <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />

                  <span>Make personal choices to help the environment</span>

                </li>

              </ul>

            </CardContent>

          </Card>

        </div>

      </div>







      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="md:col-span-2">

          <img src="/kindergarten-environmental-stewardship.png" alt="Children’s crayon drawing with the words “HELP PLANET,” showing a girl pointing to a recycling symbol, a boy holding a flower, Earth, trees, rain, sun, and crossed-out symbols of pollution like cars, trash, and factories to illustrate how human activities affect the environment and ways to help." className="w-auto h-auto" />

        </div>

        <div>

          <WeeklyOverview

            theme="Environmental Stewardship"

            focusAreas={["Human impact", "Conservation", "Recycling", "Personal choices"]}

            vocabulary={[

              "environment",

              "protect",

              "reduce",

              "reuse",

              "recycle",

              "pollution",

              "litter",

              "conservation",

              "stewardship",

              "responsibility",

            ]}

            color="purple"

          />

        </div>

      </div>



      <TeacherTip

        title="Making Environmental Stewardship Concrete"

        tip="For young children, environmental stewardship needs to be made concrete and actionable. Focus on simple actions they can take themselves, like using both sides of paper, turning off lights, picking up litter, and watering plants. Create a class 'Earth Helpers' chart where children can add a sticker or mark each time they do something to help the environment."

        color="purple"

      />



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-purple-700 flex items-center">

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

              theme="How Does Planet Earth Feel?"

              morningActivity="Morning Circle: Introduce puppet 'Earth' who is feeling sad"

              literacyFocus="Discuss why Earth is sad and how humans affect the environment"

              mathFocus="Sort pictures of helpful and harmful human activities"

              afternoonActivity="Draw pictures of ways to make Earth happy"

              materials={[

                "Earth puppet",

                "Pictures of environmental impacts",

                "Sorting mats",

                "Drawing supplies",

                "Chart paper",

              ]}

              assessmentNotes="Observe students' understanding of how human activities can affect the environment both positively and negatively."

              color="purple"

            />

          </TabsContent>



          <TabsContent value="tuesday">

            <DailyPlan

              day="Tuesday"

              theme="We Are Green Champions"

              morningActivity="Morning Circle: Learn 'We Are Green Champions' song"

              literacyFocus="Read 'The Earth Book' by Todd Parr"

              mathFocus="Create a list of ways to help the Earth and count them"

              afternoonActivity="Role-play different ways to help the Earth"

              materials={[

                "The Earth Book",

                "Song chart",

                "Chart paper",

                "Props for role-play",

                "Green champion badges",

              ]}

              assessmentNotes="Note students' ability to identify specific actions they can take to help the environment."

              color="purple"

            />

          </TabsContent>



          <TabsContent value="wednesday">

            <DailyPlan

              day="Wednesday"

              theme="Reduce, Reuse, Recycle"

              morningActivity="Morning Circle: Introduce the concepts of reduce, reuse, recycle"

              literacyFocus="Sort classroom items into reduce, reuse, recycle categories"

              mathFocus="Count and graph recyclable items collected"

              afternoonActivity="Create recycling bins for the classroom"

              materials={[

                "Recyclable items",

                "Sorting bins",

                "Graphing materials",

                "Boxes for recycling bins",

                "Decorating supplies",

              ]}

              assessmentNotes="Observe students' understanding of the concepts of reduce, reuse, and recycle and their ability to sort items appropriately."

              color="purple"

            />

          </TabsContent>



          <TabsContent value="thursday">

            <DailyPlan

              day="Thursday"

              theme="Recycling Class Project"

              morningActivity="Morning Circle: Discuss how to turn trash into treasure"

              literacyFocus="Read sentences about recycling and environmental protection"

              mathFocus="Sort, count, and pattern recyclable materials"

              afternoonActivity="Create art projects using recycled materials"

              materials={["Recycled materials", "Glue", "Scissors", "Paint", "Sentence strips", "Pattern cards"]}

              assessmentNotes="Note students' ability to repurpose materials and their understanding of how this helps the environment."

              color="purple"

            />

          </TabsContent>



          <TabsContent value="friday">

            <DailyPlan

              day="Friday"

              theme="Celebration and Unit Wrap-Up"

              morningActivity="Morning Circle: Create 'Our Promise to Mr. Earth' poster"

              literacyFocus="Share thank you poem from Earth"

              mathFocus="Plant seeds and measure planting materials"

              afternoonActivity="Celebrate learning with visitors and plant display"

              materials={[

                "Large poster paper",

                "Paint for handprints",

                "Seeds",

                "Soil",

                "Cups",

                "Celebration invitations",

              ]}

              assessmentNotes="Evaluate students' overall understanding of the unit concepts and their commitment to environmental stewardship."

              color="purple"

            />

          </TabsContent>

        </Tabs>

      </div>



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-purple-700 flex items-center">

          <Lightbulb className="mr-2 h-6 w-6" /> Featured Activities

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <ActivityCard

            title="Earth Puppet Conversation"

            description="Students interact with an Earth puppet who shares feelings about pollution and environmental damage, then brainstorm ways to help."

            duration="30 minutes"

            materials={["Earth puppet", "Pictures of environmental issues", "Chart paper", "Markers"]}

            learningAreas={["Science", "Social-Emotional Learning", "Communication"]}

            color="purple"

          />



          <ActivityCard

            title="Recycled Bird Feeders"

            description="Students create bird feeders from recycled plastic bottles, learning how to repurpose materials while helping local wildlife."

            duration="45 minutes"

            materials={["Plastic bottles", "String", "Scissors", "Bird seed", "Wooden spoons"]}

            learningAreas={["Science", "Fine Motor Skills", "Environmental Stewardship"]}

            color="purple"

          />



          <ActivityCard

            title="Sorting Recyclables"

            description="Students sort various classroom materials into recyclable and non-recyclable categories, then count and graph their findings."

            duration="35 minutes"

            materials={["Collection of classroom items", "Sorting bins", "Graphing materials", "Labels"]}

            learningAreas={["Math", "Science", "Classification Skills"]}

            color="purple"

          />



          <ActivityCard

            title="Beautiful Junk Art"

            description="Students create art projects using recycled materials, learning how items can be reused instead of thrown away."

            duration="50 minutes"

            materials={["Bottle caps", "Cardboard", "Yarn scraps", "Buttons", "Glue", "Scissors"]}

            learningAreas={["Art", "Creative Thinking", "Environmental Awareness"]}

            color="purple"

          />

        </div>

      </div>



      <TeacherTip

        title="Celebrating Environmental Stewardship"

        tip="End the unit with a celebration that reinforces children's role as environmental stewards. Create certificates for 'Earth Helpers' or 'Plant and Animal Protectors.' Have children share one thing they've learned and one action they plan to take to help the environment. Consider planting a class tree or garden as a lasting reminder of their learning."

        color="purple"

      />



      <div className="mb-8">

        <h2 className="text-2xl font-bold mb-4 text-purple-700 flex items-center">

          <BookOpen className="mr-2 h-6 w-6" /> Resources

        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card className="border-purple-200">

            <CardHeader className="bg-purple-50 border-b border-purple-100">

              <CardTitle className="text-purple-700">Books</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li>"The Earth Book" by Todd Parr</li>

                <li>"Michael Recycle" by Ellie Bethel</li>

                <li>"The Lorax" by Dr. Seuss</li>

                <li>"Compost Stew" by Mary McKenna Siddals</li>

                <li>"Why Should I Recycle?" by Jen Green</li>

              </ul>

              <Button variant="outline" className="mt-4 w-full border-purple-500 text-purple-700 hover:bg-purple-50">

                <Download className="mr-2 h-4 w-4" /> Book List PDF

              </Button>

            </CardContent>

          </Card>



          <Card className="border-purple-200">

            <CardHeader className="bg-purple-50 border-b border-purple-100">

              <CardTitle className="text-purple-700">Printables</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <ul className="space-y-2">

                <li>Environmental impact sorting cards</li>

                <li>Reduce, reuse, recycle posters</li>

                <li>Earth helper pledge cards</li>

                <li>Recycling bin labels</li>

                <li>Environmental stewardship certificates</li>

              </ul>

              <Button variant="outline" className="mt-4 w-full border-purple-500 text-purple-700 hover:bg-purple-50">

                <Printer className="mr-2 h-4 w-4" /> Print Materials

              </Button>

            </CardContent>

          </Card>



          <Card className="border-purple-200">

            <CardHeader className="bg-purple-50 border-b border-purple-100">

              <CardTitle className="text-purple-700">Home Connection</CardTitle>

            </CardHeader>

            <CardContent className="pt-4">

              <p className="mb-4">

                Send home a family activity sheet that encourages parents/caregivers to involve their child in

                environmental stewardship activities at home, such as recycling, conserving water, or planting seeds.

              </p>

              <Button variant="outline" className="w-full border-purple-500 text-purple-700 hover:bg-purple-50">

                <Download className="mr-2 h-4 w-4" /> Family Activity

              </Button>

            </CardContent>

          </Card>

        </div>

      </div>



      <div className="flex justify-between">

        <Button variant="outline" asChild>

          <Link to="/curriculum/kindergarten/plants-and-animals/week-4">Previous Week: Changing Environments</Link>

        </Button>

        <Link to="/curriculum/kindergarten/plants-and-animals"><Button>Back to Plants and Animals Unit</Button></Link>

      </div>

    </div>

  )

}
