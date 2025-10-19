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
  Building,
  Puzzle,
  HelpCircle,
  Heart,
  School,
} from "lucide-react"

export default function BelongingUnit() {
  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-purple-700">Kindergarten: Belonging Unit</h1>
        <p className="text-gray-600 mb-4">A 5-week exploration of identity and belonging</p>
        <div className="bg-purple-50 border border-purple-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-purple-700 flex items-center">
            <Heart className="mr-2 h-6 w-6" /> Unit Overview
          </h2>
          <p className="mb-4">
            This Belonging unit helps children understand themselves, their families, and their communities. They
            explore what makes them unique, how they fit into their families, and how they belong to various groups.
          </p>
          <p>
            Through engaging activities, stories, and discussions, children develop a sense of identity and belonging
            while building foundational literacy, numeracy, and social skills.
          </p>
          
          {/* Lesson Plan Creation and Activities Buttons */}
          <div className="mt-6 text-center">
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Link to="/kindergarten-planner"><Button>
                  <BookOpen className="mr-2 h-5 w-5" />
                  Create Belonging Lesson Plan
                </Button></Link>
              <Link to="/curriculum/kindergarten/activities/belonging-unit"><Button>
                  <Puzzle className="mr-2 h-5 w-5" />
                  View Activities
                </Button></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <img src="/kindergarten-friendship.png" alt="Kindergarten students learning about belonging" className="w-auto h-auto" />
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
                  <span>Is it important to belong?</span>
                </li>
                <li className="flex items-start">
                  <Heart className="h-5 w-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>What makes me special?</span>
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>How is my family special?</span>
                </li>
                <li className="flex items-start">
                  <School className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>How do I belong at school?</span>
                </li>
                <li className="flex items-start">
                  <Building className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>How do I belong in my community?</span>
                </li>
                <li className="flex items-start">
                  <Puzzle className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>How do we belong together?</span>
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
                The Belonging unit is designed to help kindergarten students develop a positive sense of self and
                understand how they belong to various groups including family, school, and community. Through a variety
                of hands-on activities, children will explore what makes them unique, their family structures, their
                school environment, their local community, and how they all belong together.
              </p>

              <h3 className="text-lg font-semibold text-purple-700">Unit Structure</h3>
              <p>This unit is organized into five thematic weeks:</p>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-2">
                {[
                  {
                    week: "Week 1",
                    title: "All About Me",
                    color: "bg-pink-100 text-pink-700 border-pink-200",
                    icon: <Heart className="h-5 w-5" />,
                    description: "Exploring personal identity and uniqueness",
                  },
                  {
                    week: "Week 2",
                    title: "My Family",
                    color: "bg-orange-100 text-orange-700 border-orange-200",
                    icon: <Users className="h-5 w-5" />,
                    description: "Understanding family structures and traditions",
                  },
                  {
                    week: "Week 3",
                    title: "My School",
                    color: "bg-green-100 text-green-700 border-green-200",
                    icon: <School className="h-5 w-5" />,
                    description: "Exploring the school environment and community",
                  },
                  {
                    week: "Week 4",
                    title: "My Community",
                    color: "bg-blue-100 text-blue-700 border-blue-200",
                    icon: <Building className="h-5 w-5" />,
                    description: "Learning about local community and helpers",
                  },
                  {
                    week: "Week 5",
                    title: "Belonging Together",
                    color: "bg-purple-100 text-purple-700 border-purple-200",
                    icon: <Puzzle className="h-5 w-5" />,
                    description: "Celebrating diversity and unity in our classroom",
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
                    <li>Develop a positive sense of self and belonging</li>
                    <li>Recognize similarities and differences between self and others</li>
                    <li>Identify and describe family members and their roles</li>
                    <li>Understand the concept of community and their place in it</li>
                    <li>Learn vocabulary related to self, family, and community</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-purple-700 flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5" /> Skills
                  </h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1">
                    <li>Use descriptive language to talk about self and others</li>
                    <li>Practice counting and basic number concepts</li>
                    <li>Develop fine motor skills through art and writing activities</li>
                    <li>Engage in collaborative activities with peers</li>
                    <li>Follow classroom routines and expectations</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-purple-700 flex items-center">
                    <Clock className="mr-2 h-5 w-5" /> Behaviors & Attitudes
                  </h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1">
                    <li>Show respect for similarities and differences among people</li>
                    <li>Demonstrate kindness and inclusion toward others</li>
                    <li>Take pride in personal and family identity</li>
                    <li>Show enthusiasm for learning about others</li>
                    <li>Develop a sense of responsibility to classroom and community</li>
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
                    <li>Observation of students during activities and discussions</li>
                    <li>Participation in group conversations about identity and belonging</li>
                    <li>Journal entries (drawings and dictated statements)</li>
                    <li>Responses during read-alouds and group discussions</li>
                    <li>Teacher observations during hands-on activities</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-purple-700">Summative Assessment</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1">
                    <li>Self-portrait with descriptive details</li>
                    <li>Family drawing or project</li>
                    <li>School map or classroom role identification</li>
                    <li>Community helper matching activity</li>
                    <li>Class belonging book or project</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-md border border-purple-100">
                  <h4 className="font-medium text-purple-700 flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5" /> Assessment Notes
                  </h4>
                  <p className="mt-2 text-sm">
                    Assessment is ongoing throughout the unit and includes observation, conversations, and work samples.
                    Watch for active participation in discussions and activities, noting children's understanding of key
                    concepts. Take photos and notes to document learning moments and track progress throughout the unit.
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
                  <h4 className="font-medium text-purple-700">Social Studies Standards</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1.5">
                    <li>
                      <span className="font-medium">1.1-1.6:</span> Myself - Identity - Students will develop an
                      awareness of their personal characteristics, abilities, and interests.
                    </li>
                    <li>
                      <span className="font-medium">2.1-2.6:</span> Myself - Family - Students will demonstrate an
                      understanding of family structures and roles.
                    </li>
                    <li>
                      <span className="font-medium">2.7-2.12:</span> Myself - Civic Participation - Students will
                      understand how behavior affects others and recognize responsibilities in groups.
                    </li>
                    <li>
                      <span className="font-medium">3.1-3.6:</span> Spatial Thinking - Students will identify and
                      illustrate natural and built features of the local environment.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-purple-700">Mathematics Standards</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1.5">
                    <li>
                      <span className="font-medium">1.1.1, 1.1.8:</span> Number Sense - Students will count and compare
                      quantities.
                    </li>
                    <li>
                      <span className="font-medium">3.1.1-3.1.5:</span> Pattern and Relationship - Students will create,
                      extend, and copy repeating patterns.
                    </li>
                    <li>
                      <span className="font-medium">6.1.3:</span> Data Management - Students will use counting to
                      determine the number of objects in a group.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-purple-700">Arts Standards</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1.5">
                    <li>
                      <span className="font-medium">1.1-1.4:</span> Visual Arts - Students will create art to express
                      ideas about self, family, and community.
                    </li>
                    <li>
                      <span className="font-medium">2.1-2.3:</span> Music - Students will participate in songs and
                      musical activities related to identity and belonging.
                    </li>
                    <li>
                      <span className="font-medium">3.1-3.3:</span> Drama - Students will engage in dramatic play to
                      explore roles within family and community.
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
          <Link to="/curriculum/kindergarten/belonging/week-1" className="block group">
            <Card className="border-pink-200 hover:border-pink-300 hover:shadow-md transition-all">
              <CardHeader className="bg-pink-50 border-b border-pink-100 group-hover:bg-pink-100 transition-all">
                <CardTitle className="text-pink-700 flex items-center">
                  <Heart className="mr-2 h-5 w-5" /> Week 1: All About Me
                </CardTitle>
                <CardDescription>Exploring personal identity and uniqueness</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Children explore their own identities, including their names, physical characteristics, likes and
                  dislikes, and what makes them special and unique.
                </p>
                <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-100">Self-Identity</Badge>{" "}
                <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-100">Uniqueness</Badge>{" "}
                <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-100">Self-Expression</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/curriculum/kindergarten/belonging/week-2" className="block group">
            <Card className="border-orange-200 hover:border-orange-300 hover:shadow-md transition-all">
              <CardHeader className="bg-orange-50 border-b border-orange-100 group-hover:bg-orange-100 transition-all">
                <CardTitle className="text-orange-700 flex items-center">
                  <Users className="mr-2 h-5 w-5" /> Week 2: My Family
                </CardTitle>
                <CardDescription>Understanding family structures and traditions</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Children learn about different types of families, family members, roles within families, and family
                  traditions and celebrations.
                </p>
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Family Structures</Badge>{" "}
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Traditions</Badge>{" "}
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Family Roles</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/curriculum/kindergarten/belonging/week-3" className="block group">
            <Card className="border-green-200 hover:border-green-300 hover:shadow-md transition-all">
              <CardHeader className="bg-green-50 border-b border-green-100 group-hover:bg-green-100 transition-all">
                <CardTitle className="text-green-700 flex items-center">
                  <School className="mr-2 h-5 w-5" /> Week 3: My School
                </CardTitle>
                <CardDescription>Exploring the school environment and community</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Children explore their school environment, the people who work there, classroom rules and routines,
                  and how to be a good friend and classmate.
                </p>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">School Community</Badge>{" "}
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Classroom Rules</Badge>{" "}
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Friendship</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/curriculum/kindergarten/belonging/week-4" className="block group">
            <Card className="border-blue-200 hover:border-blue-300 hover:shadow-md transition-all">
              <CardHeader className="bg-blue-50 border-b border-blue-100 group-hover:bg-blue-100 transition-all">
                <CardTitle className="text-blue-700 flex items-center">
                  <Building className="mr-2 h-5 w-5" /> Week 4: My Community
                </CardTitle>
                <CardDescription>Learning about local community and helpers</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Children learn about their local community, community helpers, places in the community, and how people
                  in a community work together.
                </p>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Community Helpers</Badge>{" "}
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Neighborhood</Badge>{" "}
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Cooperation</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/curriculum/kindergarten/belonging/week-5" className="block group">
            <Card className="border-purple-200 hover:border-purple-300 hover:shadow-md transition-all">
              <CardHeader className="bg-purple-50 border-b border-purple-100 group-hover:bg-purple-100 transition-all">
                <CardTitle className="text-purple-700 flex items-center">
                  <Puzzle className="mr-2 h-5 w-5" /> Week 5: Belonging Together
                </CardTitle>
                <CardDescription>Celebrating diversity and unity in our classroom</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Children explore how people belong to multiple groups, how we can help others belong, and celebrate
                  the diversity and unity of their classroom community.
                </p>
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Diversity</Badge>{" "}
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Inclusion</Badge>{" "}
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Community Building</Badge>
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
                  <Heart className="h-4 w-4 text-purple-600" />
                </div>
                <span>
                  <span className="font-medium">Create a welcoming environment:</span> Set up a "Belonging Corner" with
                  photos of each child and their families to reference throughout the unit.
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-purple-100 p-1 rounded-full mr-2 mt-0.5">
                  <Heart className="h-4 w-4 text-purple-600" />
                </div>
                <span>
                  <span className="font-medium">Morning meetings:</span> Begin each day with a community circle where
                  children can share and connect with one another.
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-purple-100 p-1 rounded-full mr-2 mt-0.5">
                  <Heart className="h-4 w-4 text-purple-600" />
                </div>
                <span>
                  <span className="font-medium">Family involvement:</span> Invite family members to share traditions,
                  stories, or skills with the class.
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-purple-100 p-1 rounded-full mr-2 mt-0.5">
                  <Heart className="h-4 w-4 text-purple-600" />
                </div>
                <span>
                  <span className="font-medium">Diverse literature:</span> Use books that represent diverse families,
                  cultures, and communities.
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-purple-100 p-1 rounded-full mr-2 mt-0.5">
                  <Heart className="h-4 w-4 text-purple-600" />
                </div>
                <span>
                  <span className="font-medium">Classroom jobs:</span> Assign meaningful roles to help children feel
                  they contribute to the classroom community.
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
                <h3 className="font-medium mb-2">Books for Belonging Unit</h3>
                <ul className="text-sm space-y-1">
                  <li>"All Are Welcome" by Alexandra Penfold</li>
                  <li>"The Day You Begin" by Jacqueline Woodson</li>
                  <li>"Families, Families, Families!" by Suzanne Lang</li>
                  <li>"The Name Jar" by Yangsook Choi</li>
                  <li>"Last Stop on Market Street" by Matt de la Peña</li>
                </ul>
                <Button variant="outline" className="mt-3 w-full border-purple-500 text-purple-700 hover:bg-purple-50">
                  <Download className="mr-2 h-4 w-4" /> Book List PDF
                </Button>
              </div>

              <div>
                <h3 className="font-medium mb-2">Additional Resources</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="border-purple-500 text-purple-700 hover:bg-purple-50">
                    <Download className="mr-2 h-4 w-4" /> Family Letter
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
          <Link to="/curriculum/kindergarten/belonging/week-1">Begin Week 1: All About Me</Link>
        </Button>
        <Button variant="outline" className="border-purple-500 text-purple-700 hover:bg-purple-50" asChild>
          <Link to="/curriculum/kindergarten/belonging/resources">View All Unit Resources</Link>
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
