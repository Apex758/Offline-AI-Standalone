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
  Leaf,
  Download,
  Lightbulb,
  Flower,
  Bug,
  TreesIcon as Tree,
  Recycle,
  Home,
} from "lucide-react"

export default function PlantsAndAnimalsUnit() {
  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-emerald-700">Kindergarten: Plants and Animals Unit</h1>
        <p className="text-gray-600 mb-4">
          A 5-week exploration of how plants and animals make a difference to our world
        </p>
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-emerald-700 flex items-center">
            <Leaf className="mr-2 h-6 w-6" /> Unit Overview
          </h2>
          <p className="mb-4">
            This Plants and Animals unit introduces kindergarten students to the fascinating world of living things and
            their importance in our lives. Through hands-on activities, observations, and explorations, students will
            develop an understanding of different plants and animals, their needs for survival, their habitats, and how
            they can change their environments.
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
                  Create Plants & Animals Lesson Plan
                </Button></Link>
              <Link to="/curriculum/kindergarten/activities/plants-animals-unit"><Button>
                  <Leaf className="mr-2 h-5 w-5" />
                  View Activities
                </Button></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <img src="./plants_animals.png" alt="Kindergarten students exploring plants and animals" className="w-auto h-auto" />
        </div>
        <div>
          <Card className="border-emerald-200 h-full shadow-md">
            <CardHeader className="bg-emerald-50 border-b border-emerald-100">
              <CardTitle className="text-emerald-700">Essential Questions</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Flower className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>How do plants and animals make a difference to me?</span>
                </li>
                <li className="flex items-start">
                  <Bug className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>What do plants and animals need to survive?</span>
                </li>
                <li className="flex items-start">
                  <Home className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Where do plants and animals live and why do they live there?</span>
                </li>
                <li className="flex items-start">
                  <Tree className="h-5 w-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Can plants and animals change the place where they live?</span>
                </li>
                <li className="flex items-start">
                  <Recycle className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Can we do some things so the environment is not changed so much by humans?</span>
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
              <h3 className="text-lg font-semibold text-emerald-700">Unit Description</h3>
              <p>
                The Plants and Animals unit is designed to engage kindergarten students in observing, describing, and
                understanding the living things around them. Through a variety of hands-on activities, children will
                explore different types of plants and animals, their needs for survival, their habitats, and how they
                interact with their environments.
              </p>

              <h3 className="text-lg font-semibold text-emerald-700">Unit Structure</h3>
              <p>This unit is organized into five thematic weeks:</p>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-2">
                {[
                  {
                    week: "Week 1",
                    title: "Plants and Animals in Our Lives",
                    color: "bg-pink-100 text-pink-700 border-pink-200",
                    icon: <Flower className="h-5 w-5" />,
                    description: "How plants and animals make a difference to me",
                  },
                  {
                    week: "Week 2",
                    title: "Survival Needs",
                    color: "bg-amber-100 text-amber-700 border-amber-200",
                    icon: <Bug className="h-5 w-5" />,
                    description: "What plants and animals need to survive",
                  },
                  {
                    week: "Week 3",
                    title: "Habitats",
                    color: "bg-blue-100 text-blue-700 border-blue-200",
                    icon: <Home className="h-5 w-5" />,
                    description: "Where plants and animals live and why",
                  },
                  {
                    week: "Week 4",
                    title: "Changing Environments",
                    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
                    icon: <Tree className="h-5 w-5" />,
                    description: "How plants and animals change their environments",
                  },
                  {
                    week: "Week 5",
                    title: "Environmental Stewardship",
                    color: "bg-purple-100 text-purple-700 border-purple-200",
                    icon: <Recycle className="h-5 w-5" />,
                    description: "Reducing human impact on the environment",
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
              <h3 className="text-lg font-semibold text-emerald-700 mb-4">Learning Objectives</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-emerald-700 flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" /> Knowledge
                  </h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1">
                    <li>Understand the difference between living and non-living things</li>
                    <li>Identify which living things are plants and which are animals</li>
                    <li>Recognize that humans are animals</li>
                    <li>Understand what plants and animals need to survive</li>
                    <li>Learn why different plants and animals live in different places</li>
                    <li>Understand how plants and animals can change their environment</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-emerald-700 flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5" /> Skills
                  </h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1">
                    <li>Observe and describe characteristics of plants and animals</li>
                    <li>Compare and contrast different types of plants and animals</li>
                    <li>Use descriptive language to talk about living things</li>
                    <li>Create models to show plant and animal habitats</li>
                    <li>Identify ways to help protect the environment</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-emerald-700 flex items-center">
                    <Clock className="mr-2 h-5 w-5" /> Behaviors & Attitudes
                  </h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1">
                    <li>Develop curiosity about plants and animals</li>
                    <li>Appreciate how plants and animals contribute to our lives</li>
                    <li>Demonstrate care and respect for living things</li>
                    <li>Show enthusiasm for outdoor observations</li>
                    <li>Develop confidence in making choices that help the environment</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-emerald-700 mb-4">Assessment Strategies</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-emerald-700">Formative Assessment</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1">
                    <li>Daily observations and discussions</li>
                    <li>Participation in plant and animal-related activities</li>
                    <li>Journal entries (drawings and dictated statements)</li>
                    <li>Responses during read-alouds and group discussions</li>
                    <li>Teacher observations during hands-on activities</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-emerald-700">Summative Assessment</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1">
                    <li>Living/non-living sorting activities</li>
                    <li>Plant and animal needs identification</li>
                    <li>Creation of habitat models</li>
                    <li>Environmental stewardship project</li>
                    <li>Individual or class plant and animal book</li>
                  </ul>
                </div>

                <div className="bg-emerald-50 p-4 rounded-md border border-emerald-100">
                  <h4 className="font-medium text-emerald-700 flex items-center">
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
              <h3 className="text-lg font-semibold text-emerald-700 mb-4">Alignment to Standards</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-emerald-700">Science Standards</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1.5">
                    <li>
                      <span className="font-medium">2.1:</span> Use observations to describe patterns of what plants and
                      animals (including humans) need to survive.
                    </li>
                    <li>
                      <span className="font-medium">2.2:</span> Construct an argument supported by evidence for how
                      plants and animals (including humans) can change the environment to meet their needs.
                    </li>
                    <li>
                      <span className="font-medium">2.3:</span> Use a model to represent the relationship between the
                      needs of different plants or animals (including humans) and the places they live.
                    </li>
                    <li>
                      <span className="font-medium">2.4:</span> Communicate solutions that will reduce the impact of
                      humans on the land, water, air, and/or other living things in the local environment.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-emerald-700">Language Arts Standards</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1.5">
                    <li>
                      <span className="font-medium">1.2:</span> Demonstrate interest, curiosity, engagement in sharing
                      the experiences of others and with oral stories and information sharing.
                    </li>
                    <li>
                      <span className="font-medium">2.3:</span> Connect background knowledge to the titles and pictures
                      of fiction and nonfiction passages to build a foundation of understanding.
                    </li>
                    <li>
                      <span className="font-medium">3.2:</span> Assign meaning to experimental drawing and writing.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-emerald-700">Mathematics Standards</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1.5">
                    <li>
                      <span className="font-medium">1.1.1:</span> Say the number sequence to 10 by 1s.
                    </li>
                    <li>
                      <span className="font-medium">5.1.1:</span> Classify objects according to selected attributes,
                      e.g., size, color, shape, texture, sound, etc.
                    </li>
                    <li>
                      <span className="font-medium">6.1.3:</span> Use counting to determine the number of objects in a
                      group.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-emerald-700">Social Studies Standards</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1.5">
                    <li>
                      <span className="font-medium">3.4:</span> Identify natural and built features of the local
                      environment.
                    </li>
                    <li>
                      <span className="font-medium">3.5:</span> Illustrate natural and built features of the local
                      environment.
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-emerald-700 flex items-center">
          <Calendar className="mr-2 h-6 w-6" /> Weekly Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
          <Link to="/curriculum/kindergarten/plants-and-animals/week-1" className="block group">
            <Card className="border-pink-200 hover:border-pink-300 hover:shadow-md transition-all">
              <CardHeader className="bg-pink-50 border-b border-pink-100 group-hover:bg-pink-100 transition-all">
                <CardTitle className="text-pink-700 flex items-center">
                  <Flower className="mr-2 h-5 w-5" /> Week 1: Plants and Animals in Our Lives
                </CardTitle>
                <CardDescription>How plants and animals make a difference to me</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Students begin their exploration by learning about the importance of plants and animals in their daily
                  lives, distinguishing between living and non-living things, and understanding that humans are animals
                  too.
                </p>
                <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-100">Living vs. Non-living</Badge>{" "}
                <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-100">Plants vs. Animals</Badge>{" "}
                <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-100">Food Sources</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/curriculum/kindergarten/plants-and-animals/week-2" className="block group">
            <Card className="border-amber-200 hover:border-amber-300 hover:shadow-md transition-all">
              <CardHeader className="bg-amber-50 border-b border-amber-100 group-hover:bg-amber-100 transition-all">
                <CardTitle className="text-amber-700 flex items-center">
                  <Bug className="mr-2 h-5 w-5" /> Week 2: Survival Needs
                </CardTitle>
                <CardDescription>What plants and animals need to survive</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Students explore what it means to survive and investigate the basic needs of plants and animals,
                  including water, light, food, and shelter through hands-on experiments and activities.
                </p>
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Plant Needs</Badge>{" "}
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Animal Needs</Badge>{" "}
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Survival Experiments</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/curriculum/kindergarten/plants-and-animals/week-3" className="block group">
            <Card className="border-blue-200 hover:border-blue-300 hover:shadow-md transition-all">
              <CardHeader className="bg-blue-50 border-b border-blue-100 group-hover:bg-blue-100 transition-all">
                <CardTitle className="text-blue-700 flex items-center">
                  <Home className="mr-2 h-5 w-5" /> Week 3: Habitats
                </CardTitle>
                <CardDescription>Where plants and animals live and why</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Students learn about different habitats and why specific plants and animals live in certain places,
                  exploring how plants and animals depend on each other and their environment.
                </p>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Habitat Types</Badge>{" "}
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Interdependence</Badge>{" "}
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Habitat Models</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/curriculum/kindergarten/plants-and-animals/week-4" className="block group">
            <Card className="border-emerald-200 hover:border-emerald-300 hover:shadow-md transition-all">
              <CardHeader className="bg-emerald-50 border-b border-emerald-100 group-hover:bg-emerald-100 transition-all">
                <CardTitle className="text-emerald-700 flex items-center">
                  <Tree className="mr-2 h-5 w-5" /> Week 4: Changing Environments
                </CardTitle>
                <CardDescription>How plants and animals change their environments</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Students discover how plants and animals (including humans) can change their environments to meet
                  their needs, and learn to identify evidence of these changes.
                </p>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Environmental Changes</Badge>{" "}
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Animal Adaptations</Badge>{" "}
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Human Impact</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/curriculum/kindergarten/plants-and-animals/week-5" className="block group">
            <Card className="border-purple-200 hover:border-purple-300 hover:shadow-md transition-all">
              <CardHeader className="bg-purple-50 border-b border-purple-100 group-hover:bg-purple-100 transition-all">
                <CardTitle className="text-purple-700 flex items-center">
                  <Recycle className="mr-2 h-5 w-5" /> Week 5: Environmental Stewardship
                </CardTitle>
                <CardDescription>Reducing human impact on the environment</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Students learn how human activities affect the environment and explore ways they can help reduce their
                  impact on the land, water, air, and other living things.
                </p>
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Recycling</Badge>{" "}
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Conservation</Badge>{" "}
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Earth Helpers</Badge>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-emerald-200">
          <CardHeader className="bg-emerald-50 border-b border-emerald-100">
            <CardTitle className="text-emerald-700 flex items-center">
              <Lightbulb className="mr-2 h-5 w-5" /> Teaching Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-emerald-100 p-1 rounded-full mr-2 mt-0.5">
                  <Leaf className="h-4 w-4 text-emerald-600" />
                </div>
                <span>
                  <span className="font-medium">Create a nature corner:</span> Designate an area in your classroom for
                  plant and animal specimens, books, and observation tools.
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-emerald-100 p-1 rounded-full mr-2 mt-0.5">
                  <Leaf className="h-4 w-4 text-emerald-600" />
                </div>
                <span>
                  <span className="font-medium">Plant helpers:</span> Assign daily helpers who assist with watering
                  classroom plants and recording observations.
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-emerald-100 p-1 rounded-full mr-2 mt-0.5">
                  <Leaf className="h-4 w-4 text-emerald-600" />
                </div>
                <span>
                  <span className="font-medium">Movement breaks:</span> Incorporate plant and animal-themed movements
                  (growing like a plant, moving like different animals) for transitions.
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-emerald-100 p-1 rounded-full mr-2 mt-0.5">
                  <Leaf className="h-4 w-4 text-emerald-600" />
                </div>
                <span>
                  <span className="font-medium">Connect to literature:</span> Use a variety of plant and animal-themed
                  books to reinforce concepts across the curriculum.
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-emerald-100 p-1 rounded-full mr-2 mt-0.5">
                  <Leaf className="h-4 w-4 text-emerald-600" />
                </div>
                <span>
                  <span className="font-medium">Family connections:</span> Send home plant and animal observation
                  activities for families to do together.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="bg-emerald-50 border-b border-emerald-100">
            <CardTitle className="text-emerald-700 flex items-center">
              <BookOpen className="mr-2 h-5 w-5" /> Resource Library
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Books for Plants and Animals Unit</h3>
                <ul className="text-sm space-y-1">
                  <li>"The Tiny Seed" by Eric Carle</li>
                  <li>"From Seed to Plant" by Gail Gibbons</li>
                  <li>"The Very Hungry Caterpillar" by Eric Carle</li>
                  <li>"Animals and Their Homes" by Pamela Hickman</li>
                  <li>"The Earth Book" by Todd Parr</li>
                </ul>
                <Button
                  variant="outline"
                  className="mt-3 w-full border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                >
                  <Download className="mr-2 h-4 w-4" /> Book List PDF
                </Button>
              </div>

              <div>
                <h3 className="font-medium mb-2">Additional Resources</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="border-emerald-500 text-emerald-700 hover:bg-emerald-50">
                    <Download className="mr-2 h-4 w-4" /> Plant & Animal Cards
                  </Button>
                  <Button variant="outline" className="border-emerald-500 text-emerald-700 hover:bg-emerald-50">
                    <Download className="mr-2 h-4 w-4" /> Activity Pack
                  </Button>
                  <Button variant="outline" className="border-emerald-500 text-emerald-700 hover:bg-emerald-50">
                    <Download className="mr-2 h-4 w-4" /> Vocabulary Cards
                  </Button>
                  <Button variant="outline" className="border-emerald-500 text-emerald-700 hover:bg-emerald-50">
                    <Download className="mr-2 h-4 w-4" /> Assessment Tools
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
        <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
          <Link to="/curriculum/kindergarten/plants-and-animals/week-1">
            Begin Week 1: Plants and Animals in Our Lives
          </Link>
        </Button>
        <Button variant="outline" className="border-emerald-500 text-emerald-700 hover:bg-emerald-50" asChild>
          <Link to="/curriculum/kindergarten/plants-and-animals/resources">View All Unit Resources</Link>
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
