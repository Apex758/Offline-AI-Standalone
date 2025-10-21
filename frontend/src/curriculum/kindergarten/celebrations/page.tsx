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
  PartyPopper,
  Download,
  Lightbulb,
  Heart,
  Gift,
  Music,
  Users,
  Cake,
} from "lucide-react"

export default function CelebrationsUnit() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-cyan-700">Kindergarten: Celebrations Unit</h1>
        <p className="text-gray-600 mb-4">A 5-week exploration of family, cultural, and community celebrations</p>
        <div className="bg-cyan-50 border border-cyan-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-cyan-700 flex items-center">
            <PartyPopper className="mr-2 h-6 w-6" /> Unit Overview
          </h2>
          <p className="mb-4">
            This Celebrations unit introduces kindergarten students to the rich diversity of celebrations in families,
            cultures, and communities. Through hands-on activities, storytelling, and creative expression, students will
            develop an understanding of traditions, customs, and the importance of celebrations in bringing people
            together.
          </p>
          <p>
            The unit integrates social studies, language arts, mathematics, art, and social-emotional learning while
            building cultural awareness, empathy, and appreciation for diversity in our world.
          </p>

          {/* Lesson Plan Creation and Activities Buttons */}
          <div className="mt-6 text-center">
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Link to="/kindergarten-planner"><Button>
                  <BookOpen className="mr-2 h-5 w-5" />
                  Create Celebrations Lesson Plan
                </Button></Link>
              <Link to="/curriculum/kindergarten/activities/celebrations-unit"><Button>
                  <PartyPopper className="mr-2 h-5 w-5" />
                  View Activities
                </Button></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <img src="./kindergarten-celebrations.png" alt="Kindergarten students exploring different celebrations" className="w-auto h-auto" />
        </div>
        <div>
          <Card className="border-cyan-200 h-full shadow-md">
            <CardHeader className="bg-cyan-50 border-b border-cyan-100">
              <CardTitle className="text-cyan-700">Essential Questions</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Heart className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>What are celebrations and why are they important?</span>
                </li>
                <li className="flex items-start">
                  <Gift className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>How do different families celebrate special occasions?</span>
                </li>
                <li className="flex items-start">
                  <Music className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>What makes celebrations special and meaningful?</span>
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>How do communities come together to celebrate?</span>
                </li>
                <li className="flex items-start">
                  <Cake className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>What traditions and customs are part of celebrations?</span>
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
              <h3 className="text-lg font-semibold text-cyan-700">Unit Description</h3>
              <p>
                The Celebrations unit is designed to engage kindergarten students in exploring the rich tapestry of
                celebrations that occur in families, cultures, and communities. Through storytelling, art, music, and
                dramatic play, children will discover how celebrations bring people together and create lasting
                memories.
              </p>

              <h3 className="text-lg font-semibold text-cyan-700">Unit Structure</h3>
              <p>This unit is organized into five thematic weeks:</p>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-2">
                {[
                  {
                    week: "Week 1",
                    title: "Family Celebrations",
                    color: "bg-red-100 text-red-700 border-red-200",
                    icon: <Heart className="h-5 w-5" />,
                    description: "Exploring celebrations within families",
                  },
                  {
                    week: "Week 2",
                    title: "Cultural Celebrations",
                    color: "bg-purple-100 text-purple-700 border-purple-200",
                    icon: <Gift className="h-5 w-5" />,
                    description: "Learning about diverse cultural traditions",
                  },
                  {
                    week: "Week 3",
                    title: "Special Foods & Decorations",
                    color: "bg-green-100 text-green-700 border-green-200",
                    icon: <Cake className="h-5 w-5" />,
                    description: "Discovering elements that make celebrations special",
                  },
                  {
                    week: "Week 4",
                    title: "What I Like About Celebrations",
                    color: "bg-amber-100 text-amber-700 border-amber-200",
                    icon: <PartyPopper className="h-5 w-5" />,
                    description: "Reflecting on personal celebration experiences",
                  },
                  {
                    week: "Week 5",
                    title: "Community Celebrations",
                    color: "bg-blue-100 text-blue-700 border-blue-200",
                    icon: <Users className="h-5 w-5" />,
                    description: "Understanding how communities celebrate together",
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
                cross-curricular connections to provide a comprehensive learning experience that celebrates diversity
                and builds cultural understanding.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="objectives">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-cyan-700 mb-4">Learning Objectives</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-cyan-700 flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" /> Knowledge
                  </h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1">
                    <li>Identify different types of celebrations (family, cultural, community, religious)</li>
                    <li>Recognize that families celebrate in different ways</li>
                    <li>Understand the concepts of tradition, custom, and culture</li>
                    <li>Learn vocabulary related to celebrations and traditions</li>
                    <li>Identify elements that make celebrations special (food, decorations, music, activities)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-cyan-700 flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5" /> Skills
                  </h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1">
                    <li>Compare and contrast different celebration traditions</li>
                    <li>Sequence events in celebrations and describe celebration activities</li>
                    <li>Use descriptive language to talk about celebrations and traditions</li>
                    <li>Create art, crafts, and presentations related to celebrations</li>
                    <li>Participate respectfully in discussions about diverse traditions</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-cyan-700 flex items-center">
                    <Clock className="mr-2 h-5 w-5" /> Behaviors & Attitudes
                  </h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1">
                    <li>Develop appreciation for cultural diversity and different traditions</li>
                    <li>Show respect for family and cultural differences</li>
                    <li>Demonstrate curiosity about celebrations from other cultures</li>
                    <li>Express pride in their own family traditions</li>
                    <li>Develop empathy and understanding for others' experiences</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-cyan-700 mb-4">Assessment Strategies</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-cyan-700">Formative Assessment</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1">
                    <li>Daily discussions about family and cultural celebrations</li>
                    <li>Participation in celebration-themed activities and role-play</li>
                    <li>Celebration journals with drawings and dictated stories</li>
                    <li>Responses during read-alouds and group sharing</li>
                    <li>Teacher observations during hands-on cultural activities</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-cyan-700">Summative Assessment</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1">
                    <li>Celebration vocabulary assessment (matching pictures to celebration terms)</li>
                    <li>Family tradition presentation or show-and-tell</li>
                    <li>Creation of a class celebration book with individual contributions</li>
                    <li>Dramatic play performance of different celebration traditions</li>
                    <li>Art portfolio showcasing celebration-themed projects</li>
                  </ul>
                </div>

                <div className="bg-cyan-50 p-4 rounded-md border border-cyan-100">
                  <h4 className="font-medium text-cyan-700 flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5" /> Assessment Notes
                  </h4>
                  <p className="mt-2 text-sm">
                    Assessments should be culturally sensitive and inclusive, allowing all students to share their
                    family traditions without judgment. Focus on oral responses, creative expression, and participation
                    rather than written assignments. Encourage family involvement in sharing traditions and
                    celebrations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="standards">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-cyan-700 mb-4">Alignment to Standards</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-cyan-700">Social Studies Standards</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1.5">
                    <li>
                      <span className="font-medium">NCSS.D2.Civ.1.K-2:</span> Describe roles and responsibilities of
                      people in authority in families and communities.
                    </li>
                    <li>
                      <span className="font-medium">NCSS.D2.Civ.3.K-2:</span> Explain how a community works to
                      accomplish common tasks, establish responsibilities, and fulfill roles.
                    </li>
                    <li>
                      <span className="font-medium">NCSS.D2.Civ.4.K-2:</span> Explain how groups of people make rules to
                      accomplish tasks and establish responsibilities.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-cyan-700">Language Arts Standards</h4>
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
                      <span className="font-medium">SL.K.4:</span> Describe familiar people, places, things, and events
                      and, with prompting and support, provide additional detail.
                    </li>
                    <li>
                      <span className="font-medium">SL.K.5:</span> Add drawings or other visual displays to descriptions
                      to provide additional detail.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-cyan-700">Mathematics Standards</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1.5">
                    <li>
                      <span className="font-medium">K.MD.A.1:</span> Describe measurable attributes of objects, such as
                      length or weight (celebration decorations, foods).
                    </li>
                    <li>
                      <span className="font-medium">K.MD.B.3:</span> Classify objects into given categories; count the
                      numbers of objects in each category (types of celebrations, traditions).
                    </li>
                    <li>
                      <span className="font-medium">K.CC.5:</span> Count to answer "how many?" questions about
                      celebration elements and activities.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-cyan-700">Arts Standards</h4>
                  <ul className="list-disc pl-10 mt-2 space-y-1.5">
                    <li>Create art inspired by different cultural celebrations and traditions.</li>
                    <li>Explore music and dance from various cultures and celebrations.</li>
                    <li>Use dramatic play to represent different celebration scenarios.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-cyan-700 flex items-center">
          <Calendar className="mr-2 h-6 w-6" /> Weekly Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
          <Link to="/curriculum/kindergarten/celebrations/week-1" className="block group">
            <Card className="border-red-200 hover:border-red-300 hover:shadow-md transition-all">
              <CardHeader className="bg-red-50 border-b border-red-100 group-hover:bg-red-100 transition-all">
                <CardTitle className="text-red-700 flex items-center">
                  <Heart className="mr-2 h-5 w-5" /> Week 1: Family Celebrations
                </CardTitle>
                <CardDescription>Exploring celebrations within families and personal traditions</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Students explore celebrations that happen within families, such as birthdays, anniversaries, and
                  family reunions, while sharing their own family celebration traditions and creating family celebration
                  books.
                </p>
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Family Traditions</Badge>{" "}
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Personal Stories</Badge>{" "}
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Family Trees</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/curriculum/kindergarten/celebrations/week-2" className="block group">
            <Card className="border-purple-200 hover:border-purple-300 hover:shadow-md transition-all">
              <CardHeader className="bg-purple-50 border-b border-purple-100 group-hover:bg-purple-100 transition-all">
                <CardTitle className="text-purple-700 flex items-center">
                  <Gift className="mr-2 h-5 w-5" /> Week 2: Cultural Celebrations
                </CardTitle>
                <CardDescription>Learning about diverse cultural traditions and holidays</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Students learn about cultural celebrations from around the world, including holidays, festivals, and
                  traditions that reflect different cultural backgrounds, exploring similarities and differences.
                </p>
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">World Cultures</Badge>{" "}
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Cultural Diversity</Badge>{" "}
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Global Traditions</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/curriculum/kindergarten/celebrations/week-3" className="block group">
            <Card className="border-green-200 hover:border-green-300 hover:shadow-md transition-all">
              <CardHeader className="bg-green-50 border-b border-green-100 group-hover:bg-green-100 transition-all">
                <CardTitle className="text-green-700 flex items-center">
                  <Cake className="mr-2 h-5 w-5" /> Week 3: Special Foods & Decorations
                </CardTitle>
                <CardDescription>Discovering elements that make celebrations meaningful</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Students explore the special foods, decorations, music, and events that are part of different
                  celebrations and how these elements make celebrations meaningful and memorable.
                </p>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Special Foods</Badge>{" "}
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Decorations</Badge>{" "}
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Celebration Elements</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/curriculum/kindergarten/celebrations/week-4" className="block group">
            <Card className="border-amber-200 hover:border-amber-300 hover:shadow-md transition-all">
              <CardHeader className="bg-amber-50 border-b border-amber-100 group-hover:bg-amber-100 transition-all">
                <CardTitle className="text-amber-700 flex items-center">
                  <PartyPopper className="mr-2 h-5 w-5" /> Week 4: What I Like About Celebrations
                </CardTitle>
                <CardDescription>Reflecting on personal celebration experiences and preferences</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Students reflect on what they enjoy most about celebrations with their families, express their
                  feelings about different traditions, and plan a classroom celebration incorporating their favorite
                  elements.
                </p>
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Personal Reflection</Badge>{" "}
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Favorite Traditions</Badge>{" "}
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Celebration Planning</Badge>
              </CardContent>
            </Card>
          </Link>

          <Link to="/curriculum/kindergarten/celebrations/week-5" className="block group">
            <Card className="border-blue-200 hover:border-blue-300 hover:shadow-md transition-all">
              <CardHeader className="bg-blue-50 border-b border-blue-100 group-hover:bg-blue-100 transition-all">
                <CardTitle className="text-blue-700 flex items-center">
                  <Users className="mr-2 h-5 w-5" /> Week 5: Community Celebrations
                </CardTitle>
                <CardDescription>Understanding how communities celebrate together</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="mb-3">
                  Students explore how communities come together to celebrate, including local festivals, school events,
                  and neighborhood gatherings that bring people together and strengthen community bonds.
                </p>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Community Events</Badge>{" "}
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Local Festivals</Badge>{" "}
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Togetherness</Badge>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-cyan-200">
          <CardHeader className="bg-cyan-50 border-b border-cyan-100">
            <CardTitle className="text-cyan-700 flex items-center">
              <Lightbulb className="mr-2 h-5 w-5" /> Teaching Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-cyan-100 p-1 rounded-full mr-2 mt-0.5">
                  <PartyPopper className="h-4 w-4 text-cyan-600" />
                </div>
                <span>
                  <span className="font-medium">Create a celebration wall:</span> Display photos and artifacts from
                  different family celebrations shared by students throughout the unit.
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-cyan-100 p-1 rounded-full mr-2 mt-0.5">
                  <PartyPopper className="h-4 w-4 text-cyan-600" />
                </div>
                <span>
                  <span className="font-medium">Invite family members:</span> Ask families to share their traditions
                  through virtual or in-person presentations, bringing authentic cultural experiences to the classroom.
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-cyan-100 p-1 rounded-full mr-2 mt-0.5">
                  <PartyPopper className="h-4 w-4 text-cyan-600" />
                </div>
                <span>
                  <span className="font-medium">Celebration dramatic play:</span> Set up a dramatic play area with props
                  from different celebrations for students to explore and role-play.
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-cyan-100 p-1 rounded-full mr-2 mt-0.5">
                  <PartyPopper className="h-4 w-4 text-cyan-600" />
                </div>
                <span>
                  <span className="font-medium">Cultural sensitivity:</span> Approach all traditions with respect and
                  curiosity, ensuring no celebration is presented as "better" or "worse" than others.
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-cyan-100 p-1 rounded-full mr-2 mt-0.5">
                  <PartyPopper className="h-4 w-4 text-cyan-600" />
                </div>
                <span>
                  <span className="font-medium">Document learning:</span> Create a class celebration journal with
                  photos, drawings, and stories from each week's explorations.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-cyan-200">
          <CardHeader className="bg-cyan-50 border-b border-cyan-100">
            <CardTitle className="text-cyan-700 flex items-center">
              <BookOpen className="mr-2 h-5 w-5" /> Resource Library
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Books for Celebrations Unit</h3>
                <ul className="text-sm space-y-1">
                  <li>"Celebrate!" by Joe Rhatigan</li>
                  <li>"Families Are Different" by Nina Pellegrini</li>
                  <li>"The Name Jar" by Yangsook Choi</li>
                  <li>"Last Stop on Market Street" by Matt de la Peña</li>
                  <li>"All Are Welcome" by Alexandra Penfold</li>
                </ul>
                <Button
                  variant="outline"
                  className="mt-3 w-full border-cyan-500 text-cyan-700 hover:bg-cyan-50 bg-transparent"
                >
                  <Download className="mr-2 h-4 w-4" /> Book List PDF
                </Button>
              </div>

              <div>
                <h3 className="font-medium mb-2">Additional Resources</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="border-cyan-500 text-cyan-700 hover:bg-cyan-50 bg-transparent">
                    <Download className="mr-2 h-4 w-4" /> Family Survey
                  </Button>
                  <Button variant="outline" className="border-cyan-500 text-cyan-700 hover:bg-cyan-50 bg-transparent">
                    <Download className="mr-2 h-4 w-4" /> Activity Pack
                  </Button>
                  <Button variant="outline" className="border-cyan-500 text-cyan-700 hover:bg-cyan-50 bg-transparent">
                    <Download className="mr-2 h-4 w-4" /> Vocabulary Cards
                  </Button>
                  <Button variant="outline" className="border-cyan-500 text-cyan-700 hover:bg-cyan-50 bg-transparent">
                    <Download className="mr-2 h-4 w-4" /> Assessment Tools
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
        <Button className="bg-cyan-600 hover:bg-cyan-700" asChild>
          <Link to="/curriculum/kindergarten/celebrations/week-1">Begin Week 1: Family Celebrations</Link>
        </Button>
        <Button variant="outline" className="border-cyan-500 text-cyan-700 hover:bg-cyan-50 bg-transparent" asChild>
          <Link to="/curriculum/kindergarten/celebrations/resources">View All Unit Resources</Link>
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
