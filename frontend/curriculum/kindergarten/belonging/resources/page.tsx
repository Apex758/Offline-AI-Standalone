import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb } from "@/components/breadcrumb"
import {
  ChevronLeft,
  BookOpen,
  Download,
  FileText,
  Music,
  Lightbulb,
  Search,
  Heart,
  Users,
  School,
  Building,
  Puzzle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export default function BelongingUnitResources() {
  return (
    <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-2 mb-4">
        <Link href="/curriculum/kindergarten/belonging">
          <Button variant="outline" className="mb-2">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Belonging Unit
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4 text-purple-800 flex items-center gap-3">
            <BookOpen className="h-8 w-8" /> Belonging Unit Resources
          </h1>
          <p className="text-lg mb-6 text-gray-700">
            This page provides additional resources to support teaching and learning in the Belonging Unit. These
            resources include book recommendations, printable materials, songs and music, and extension activities.
          </p>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Search className="h-5 w-5 text-purple-700" />
              <h3 className="font-semibold text-purple-800">Resource Finder</h3>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Search resources..."
                className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              />
              <Button className="bg-purple-600 hover:bg-purple-700">Search</Button>
            </div>
          </div>
        </div>
        <div className="md:w-1/3">
          <Card className="border-purple-200 shadow-md overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-400 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=200&width=400&query=kindergarten teaching resources books"
                  alt="Teaching resources"
                  width={400}
                  height={200}
                  className="object-cover"
                />
              </div>
            </div>
            <CardHeader className="bg-white">
              <CardTitle className="text-purple-800">Quick Access</CardTitle>
              <CardDescription>Jump to specific resource types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="border-pink-300 text-pink-700 hover:bg-pink-50 flex items-center justify-start gap-2"
                >
                  <BookOpen className="h-4 w-4" /> Books
                </Button>
                <Button
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50 flex items-center justify-start gap-2"
                >
                  <FileText className="h-4 w-4" /> Printables
                </Button>
                <Button
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center justify-start gap-2"
                >
                  <Music className="h-4 w-4" /> Songs
                </Button>
                <Button
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50 flex items-center justify-start gap-2"
                >
                  <Lightbulb className="h-4 w-4" /> Activities
                </Button>
              </div>
            </CardContent>
            <CardFooter className="bg-purple-50 flex justify-between">
              <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100">
                <Download className="mr-2 h-4 w-4" /> All Resources
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="books" className="mb-8">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="books" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
            <BookOpen className="h-4 w-4 mr-2" /> Books
          </TabsTrigger>
          <TabsTrigger
            value="printables"
            className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
          >
            <FileText className="h-4 w-4 mr-2" /> Printables
          </TabsTrigger>
          <TabsTrigger value="songs" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
            <Music className="h-4 w-4 mr-2" /> Songs & Music
          </TabsTrigger>
          <TabsTrigger
            value="extensions"
            className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
          >
            <Lightbulb className="h-4 w-4 mr-2" /> Extension Activities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="books">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-pink-200 hover:shadow-md transition-shadow">
              <div className="h-40 bg-pink-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=160&width=320&query=kindergarten books about identity"
                    alt="Books about identity"
                    width={320}
                    height={160}
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className="bg-pink-500 flex items-center gap-1">
                    <Heart className="h-3 w-3" /> Week 1
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-pink-700">Week 1: All About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Chrysanthemum</strong> by Kevin Henkes - A story about a mouse who loves her unique name
                    until she starts school and is teased about it.
                  </li>
                  <li>
                    <strong>I Like Myself!</strong> by Karen Beaumont - A celebration of self-appreciation and the
                    importance of loving yourself.
                  </li>
                  <li>
                    <strong>The Colors of Us</strong> by Karen Katz - A celebration of the diversity of skin colors.
                  </li>
                  <li>
                    <strong>It's Okay to Be Different</strong> by Todd Parr - A colorful book that helps children
                    understand and appreciate differences.
                  </li>
                  <li>
                    <strong>The Thing Lou Couldn't Do</strong> by Ashley Spires - A story about trying new things and
                    overcoming fears.
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-pink-300 text-pink-700 hover:bg-pink-50">
                  <Download className="mr-2 h-4 w-4" /> Book List PDF
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-orange-200 hover:shadow-md transition-shadow">
              <div className="h-40 bg-orange-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=160&width=320&query=kindergarten books about family"
                    alt="Books about family"
                    width={320}
                    height={160}
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className="bg-orange-500 flex items-center gap-1">
                    <Users className="h-3 w-3" /> Week 2
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-orange-700">Week 2: My Family</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>The Family Book</strong> by Todd Parr - A celebration of all kinds of families.
                  </li>
                  <li>
                    <strong>Families</strong> by Shelley Rotner and Sheila M. Kelly - A photographic celebration of
                    diverse families.
                  </li>
                  <li>
                    <strong>Froggy's Day with Dad</strong> by Jonathan London - A story about a special day a young frog
                    spends with his father.
                  </li>
                  <li>
                    <strong>Tell Me a Story, Mama</strong> by Angela Johnson - A warm story about family storytelling
                    traditions.
                  </li>
                  <li>
                    <strong>The Kissing Hand</strong> by Audrey Penn - A story about the reassurance of a mother's love
                    when a young raccoon starts school.
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-50">
                  <Download className="mr-2 h-4 w-4" /> Book List PDF
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-green-200 hover:shadow-md transition-shadow">
              <div className="h-40 bg-green-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=160&width=320&query=kindergarten books about school"
                    alt="Books about school"
                    width={320}
                    height={160}
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className="bg-green-500 flex items-center gap-1">
                    <School className="h-3 w-3" /> Week 3
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-green-700">Week 3: My School</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>The Kissing Hand</strong> by Audrey Penn - A story about the reassurance of a mother's love
                    when a young raccoon starts school.
                  </li>
                  <li>
                    <strong>David Goes to School</strong> by David Shannon - A humorous look at school rules and
                    expectations.
                  </li>
                  <li>
                    <strong>Miss Bindergarten Gets Ready for Kindergarten</strong> by Joseph Slate - A story about
                    preparing for the first day of kindergarten.
                  </li>
                  <li>
                    <strong>The Recess Queen</strong> by Alexis O'Neill - A story about playground dynamics and making
                    friends.
                  </li>
                  <li>
                    <strong>A Bad Case of Stripes</strong> by David Shannon - A story about the importance of being true
                    to yourself.
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-50">
                  <Download className="mr-2 h-4 w-4" /> Book List PDF
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-blue-200 hover:shadow-md transition-shadow">
              <div className="h-40 bg-blue-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=160&width=320&query=kindergarten books about community"
                    alt="Books about community"
                    width={320}
                    height={160}
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className="bg-blue-500 flex items-center gap-1">
                    <Building className="h-3 w-3" /> Week 4
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-blue-700">Week 4: My Community</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Career Day</strong> by Anne Rockwell - A story about children sharing what their parents do
                    for work.
                  </li>
                  <li>
                    <strong>Whose Hands Are These?</strong> by Miranda Paul - A guessing game book about community
                    helpers.
                  </li>
                  <li>
                    <strong>Maybe Something Beautiful</strong> by F. Isabel Campoy - A story about how art can transform
                    a community.
                  </li>
                  <li>
                    <strong>The Little House</strong> by Virginia Lee Burton - A story about how communities change over
                    time.
                  </li>
                  <li>
                    <strong>Last Stop on Market Street</strong> by Matt de la Peña - A story about a boy and his
                    grandmother riding the bus through their community.
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
                  <Download className="mr-2 h-4 w-4" /> Book List PDF
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-purple-200 hover:shadow-md transition-shadow">
              <div className="h-40 bg-purple-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=160&width=320&query=kindergarten books about belonging"
                    alt="Books about belonging"
                    width={320}
                    height={160}
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className="bg-purple-500 flex items-center gap-1">
                    <Puzzle className="h-3 w-3" /> Week 5
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-purple-700">Week 5: Belonging Together</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>All Are Welcome</strong> by Alexandra Penfold - A celebration of diversity and inclusion in
                    a school setting.
                  </li>
                  <li>
                    <strong>The Big Umbrella</strong> by Amy June Bates - A story about inclusion and making room for
                    everyone.
                  </li>
                  <li>
                    <strong>Strictly No Elephants</strong> by Lisa Mantchev - A story about friendship and inclusion.
                  </li>
                  <li>
                    <strong>We're All Wonders</strong> by R.J. Palacio - A picture book about kindness and belonging.
                  </li>
                  <li>
                    <strong>You Belong Here</strong> by M.H. Clark - A reassuring story about belonging in the world.
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50">
                  <Download className="mr-2 h-4 w-4" /> Book List PDF
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="printables">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-pink-200 hover:shadow-md transition-shadow">
              <div className="h-40 bg-pink-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=160&width=320&query=kindergarten all about me printables"
                    alt="All About Me printables"
                    width={320}
                    height={160}
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className="bg-pink-500 flex items-center gap-1">
                    <Heart className="h-3 w-3" /> Week 1
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-pink-700">Week 1: All About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>All About Me booklet template</li>
                  <li>Name tracing worksheets</li>
                  <li>Body outline templates</li>
                  <li>Feelings chart</li>
                  <li>I Can... activity sheets</li>
                  <li>Mirror template for self-portrait activity</li>
                  <li>My Favorites recording sheet</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-pink-600 hover:bg-pink-700">
                  <Download className="mr-2 h-4 w-4" /> Download Printables
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-orange-200 hover:shadow-md transition-shadow">
              <div className="h-40 bg-orange-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=160&width=320&query=kindergarten family printables"
                    alt="Family printables"
                    width={320}
                    height={160}
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className="bg-orange-500 flex items-center gap-1">
                    <Users className="h-3 w-3" /> Week 2
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-orange-700">Week 2: My Family</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Family tree template</li>
                  <li>Family portrait frames</li>
                  <li>Family member role cards</li>
                  <li>My Family Traditions recording sheet</li>
                  <li>Family helper badges</li>
                  <li>Family celebration cards</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  <Download className="mr-2 h-4 w-4" /> Download Printables
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-green-200 hover:shadow-md transition-shadow">
              <div className="h-40 bg-green-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=160&width=320&query=kindergarten school printables"
                    alt="School printables"
                    width={320}
                    height={160}
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className="bg-green-500 flex items-center gap-1">
                    <School className="h-3 w-3" /> Week 3
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-green-700">Week 3: My School</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>School scavenger hunt checklist</li>
                  <li>Classroom job chart and badges</li>
                  <li>School community helper cards</li>
                  <li>Classroom rules template</li>
                  <li>My School map template</li>
                  <li>Friendship recipe cards</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Download className="mr-2 h-4 w-4" /> Download Printables
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-blue-200 hover:shadow-md transition-shadow">
              <div className="h-40 bg-blue-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=160&width=320&query=kindergarten community printables"
                    alt="Community printables"
                    width={320}
                    height={160}
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className="bg-blue-500 flex items-center gap-1">
                    <Building className="h-3 w-3" /> Week 4
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-blue-700">Week 4: My Community</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Community helper hats and badges</li>
                  <li>Community building templates</li>
                  <li>Community map template</li>
                  <li>Community helper matching cards</li>
                  <li>Places in my community recording sheet</li>
                  <li>Community helper interview form</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Download className="mr-2 h-4 w-4" /> Download Printables
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-purple-200 hover:shadow-md transition-shadow">
              <div className="h-40 bg-purple-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=160&width=320&query=kindergarten belonging printables"
                    alt="Belonging printables"
                    width={320}
                    height={160}
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className="bg-purple-500 flex items-center gap-1">
                    <Puzzle className="h-3 w-3" /> Week 5
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-purple-700">Week 5: Belonging Together</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>We Belong Together class book template</li>
                  <li>Friendship coupon book</li>
                  <li>Helping hands template</li>
                  <li>Class puzzle piece template</li>
                  <li>Belonging pledge certificate</li>
                  <li>We Are Special Because... recording sheet</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Download className="mr-2 h-4 w-4" /> Download Printables
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-gray-200 hover:shadow-md transition-shadow">
              <div className="h-40 bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/placeholder.svg?height=160&width=320&query=kindergarten assessment printables"
                    alt="Assessment printables"
                    width={320}
                    height={160}
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className="bg-gray-500">Assessment</Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-gray-700">Assessment Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Belonging Unit observation checklist</li>
                  <li>Learning outcomes assessment guide</li>
                  <li>Student self-assessment forms</li>
                  <li>Family feedback form</li>
                  <li>Anecdotal record templates</li>
                  <li>Portfolio collection labels</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-gray-600 hover:bg-gray-700">
                  <Download className="mr-2 h-4 w-4" /> Download Printables
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="songs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-pink-200 hover:shadow-md transition-shadow">
              <CardHeader className="bg-pink-50">
                <CardTitle className="text-pink-700 flex items-center gap-2">
                  <Heart className="h-5 w-5" /> Week 1: All About Me Songs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-4">
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-pink-100">
                      <strong className="text-pink-700">I Am Special</strong> (Tune: "Frère Jacques")
                      <p className="text-sm mt-1 text-gray-700">
                        I am special, I am special
                        <br />
                        Look at me, look at me
                        <br />
                        Someone very special, someone very special
                        <br />
                        That is me, that is me
                      </p>
                      <div className="mt-2 flex justify-end">
                        <Button size="sm" variant="outline" className="border-pink-200 text-pink-700 hover:bg-pink-50">
                          <Music className="mr-2 h-3 w-3" /> Play Tune
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-pink-100">
                      <strong className="text-pink-700">Head, Shoulders, Knees and Toes</strong>
                      <p className="text-sm mt-1 text-gray-700">Traditional song with body parts</p>
                      <div className="mt-2 flex justify-end">
                        <Button size="sm" variant="outline" className="border-pink-200 text-pink-700 hover:bg-pink-50">
                          <Music className="mr-2 h-3 w-3" /> Play Tune
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-pink-100">
                      <strong className="text-pink-700">If You're Happy and You Know It</strong>
                      <p className="text-sm mt-1 text-gray-700">With verses about things children can do</p>
                      <div className="mt-2 flex justify-end">
                        <Button size="sm" variant="outline" className="border-pink-200 text-pink-700 hover:bg-pink-50">
                          <Music className="mr-2 h-3 w-3" /> Play Tune
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-pink-100">
                      <strong className="text-pink-700">This Is Me!</strong> (Tune: "The Wheels on the Bus")
                      <p className="text-sm mt-1 text-gray-700">
                        My name is [child's name], yes that's me
                        <br />
                        That's me, that's me
                        <br />
                        My name is [child's name], yes that's me
                        <br />
                        I'm special as can be!
                      </p>
                      <div className="mt-2 flex justify-end">
                        <Button size="sm" variant="outline" className="border-pink-200 text-pink-700 hover:bg-pink-50">
                          <Music className="mr-2 h-3 w-3" /> Play Tune
                        </Button>
                      </div>
                    </div>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="bg-pink-50">
                <Button variant="outline" className="w-full border-pink-300 text-pink-700 hover:bg-pink-100">
                  <Download className="mr-2 h-4 w-4" /> Download Song Lyrics
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-orange-200 hover:shadow-md transition-shadow">
              <CardHeader className="bg-orange-50">
                <CardTitle className="text-orange-700 flex items-center gap-2">
                  <Users className="h-5 w-5" /> Week 2: My Family Songs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-4">
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-orange-100">
                      <strong className="text-orange-700">The Family Song</strong> (Tune: "The Farmer in the Dell")
                      <p className="text-sm mt-1 text-gray-700">
                        I love my family, I love my family
                        <br />
                        With a hug and a kiss
                        <br />I love my family
                      </p>
                      <div className="mt-2 flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-orange-200 text-orange-700 hover:bg-orange-50"
                        >
                          <Music className="mr-2 h-3 w-3" /> Play Tune
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-orange-100">
                      <strong className="text-orange-700">Finger Family Song</strong>
                      <p className="text-sm mt-1 text-gray-700">Traditional finger play song</p>
                      <div className="mt-2 flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-orange-200 text-orange-700 hover:bg-orange-50"
                        >
                          <Music className="mr-2 h-3 w-3" /> Play Tune
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-orange-100">
                      <strong className="text-orange-700">Where Is Family?</strong> (Tune: "Where Is Thumbkin?")
                      <p className="text-sm mt-1 text-gray-700">
                        Where is [family member]? Where is [family member]?
                        <br />
                        Here I am! Here I am!
                        <br />
                        How are you today, [name]?
                        <br />
                        Very well, I thank you.
                        <br />
                        Run away. Run away.
                      </p>
                      <div className="mt-2 flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-orange-200 text-orange-700 hover:bg-orange-50"
                        >
                          <Music className="mr-2 h-3 w-3" /> Play Tune
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-orange-100">
                      <strong className="text-orange-700">Family Helper</strong> (Tune: "London Bridge")
                      <p className="text-sm mt-1 text-gray-700">
                        I can help my family, family, family
                        <br />I can help my family
                        <br />
                        This is what I'll do...
                      </p>
                      <div className="mt-2 flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-orange-200 text-orange-700 hover:bg-orange-50"
                        >
                          <Music className="mr-2 h-3 w-3" /> Play Tune
                        </Button>
                      </div>
                    </div>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="bg-orange-50">
                <Button variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-100">
                  <Download className="mr-2 h-4 w-4" /> Download Song Lyrics
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-green-200 hover:shadow-md transition-shadow">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <School className="h-5 w-5" /> Week 3: My School Songs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-4">
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-green-100">
                      <strong className="text-green-700">The More We Get Together</strong>
                      <p className="text-sm mt-1 text-gray-700">Traditional song about friendship</p>
                      <div className="mt-2 flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-200 text-green-700 hover:bg-green-50"
                        >
                          <Music className="mr-2 h-3 w-3" /> Play Tune
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-green-100">
                      <strong className="text-green-700">Hello, School Friends</strong> (Tune: "If You're Happy and You
                      Know It")
                      <p className="text-sm mt-1 text-gray-700">
                        Hello, school friends, how are you?
                        <br />
                        Hello, school friends, how are you?
                        <br />
                        We're all here to learn and play
                        <br />
                        And have a happy day
                        <br />
                        Hello, school friends, how are you?
                      </p>
                      <div className="mt-2 flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-200 text-green-700 hover:bg-green-50"
                        >
                          <Music className="mr-2 h-3 w-3" /> Play Tune
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-green-100">
                      <strong className="text-green-700">Clean Up Song</strong>
                      <p className="text-sm mt-1 text-gray-700">Traditional classroom clean-up song</p>
                      <div className="mt-2 flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-200 text-green-700 hover:bg-green-50"
                        >
                          <Music className="mr-2 h-3 w-3" /> Play Tune
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-green-100">
                      <strong className="text-green-700">School Rules</strong> (Tune: "Twinkle, Twinkle, Little Star")
                      <p className="text-sm mt-1 text-gray-700">
                        In our school we follow rules
                        <br />
                        They help us learn and keep us safe
                        <br />
                        We use kind words and helping hands
                        <br />
                        We listen well and understand
                        <br />
                        In our school we follow rules
                        <br />
                        They help us learn and keep us safe
                      </p>
                      <div className="mt-2 flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-200 text-green-700 hover:bg-green-50"
                        >
                          <Music className="mr-2 h-3 w-3" /> Play Tune
                        </Button>
                      </div>
                    </div>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="bg-green-50">
                <Button variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-100">
                  <Download className="mr-2 h-4 w-4" /> Download Song Lyrics
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-blue-200 hover:shadow-md transition-shadow">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-700 flex items-center gap-2">
                  <Puzzle className="h-5 w-5" /> Week 4 & 5: Community and Belonging Songs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-4">
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-blue-100">
                      <strong className="text-blue-700">Community Helpers</strong> (Tune: "The Wheels on the Bus")
                      <p className="text-sm mt-1 text-gray-700">
                        The firefighters on the truck go "whoosh, whoosh, whoosh"
                        <br />
                        "Whoosh, whoosh, whoosh, whoosh, whoosh, whoosh"
                        <br />
                        The firefighters on the truck go "whoosh, whoosh, whoosh"
                        <br />
                        All through the town
                      </p>
                      <p className="text-sm mt-1 text-gray-700">Additional verses for different community helpers</p>
                      <div className="mt-2 flex justify-end">
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                          <Music className="mr-2 h-3 w-3" /> Play Tune
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-blue-100">
                      <strong className="text-blue-700">We All Belong</strong> (Tune: "Row, Row, Row Your Boat")
                      <p className="text-sm mt-1 text-gray-700">
                        We all belong, we all belong
                        <br />
                        In our class today
                        <br />
                        We're all special, we're all friends
                        <br />
                        We all belong today
                      </p>
                      <div className="mt-2 flex justify-end">
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                          <Music className="mr-2 h-3 w-3" /> Play Tune
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-blue-100">
                      <strong className="text-blue-700">Friends, Friends, 1-2-3</strong>
                      <p className="text-sm mt-1 text-gray-700">
                        Friends, friends, 1-2-3
                        <br />
                        All my friends are here with me
                        <br />
                        You're my friend, you're my friend
                        <br />
                        We're all friends, can't you see?
                      </p>
                      <div className="mt-2 flex justify-end">
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                          <Music className="mr-2 h-3 w-3" /> Play Tune
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-blue-100">
                      <strong className="text-blue-700">This Land Is Your Land</strong>
                      <p className="text-sm mt-1 text-gray-700">Simplified version of the traditional song</p>
                      <div className="mt-2 flex justify-end">
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                          <Music className="mr-2 h-3 w-3" /> Play Tune
                        </Button>
                      </div>
                    </div>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="bg-blue-50">
                <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-100">
                  <Download className="mr-2 h-4 w-4" /> Download Song Lyrics
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="extensions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-purple-200 hover:shadow-md transition-shadow">
              <CardHeader className="bg-purple-50">
                <CardTitle className="text-purple-700 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" /> STEM Extensions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-4">
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-purple-100">
                      <strong className="text-purple-700">Body Measurement Investigation</strong>
                      <p className="text-sm mt-1 text-gray-700">
                        Children measure and compare heights, hand spans, foot lengths, etc. Create graphs and discuss
                        findings.
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge className="bg-pink-100 text-pink-800">Week 1</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Download className="mr-2 h-3 w-3" /> Activity Guide
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-purple-100">
                      <strong className="text-purple-700">Family Structure Building Challenge</strong>
                      <p className="text-sm mt-1 text-gray-700">
                        Using building blocks, children create structures representing their families, considering size,
                        shape, and arrangement.
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge className="bg-orange-100 text-orange-800">Week 2</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Download className="mr-2 h-3 w-3" /> Activity Guide
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-purple-100">
                      <strong className="text-purple-700">School Map Creation</strong>
                      <p className="text-sm mt-1 text-gray-700">
                        Children create simple maps of the classroom or school, learning about spatial relationships and
                        mapping skills.
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge className="bg-green-100 text-green-800">Week 3</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Download className="mr-2 h-3 w-3" /> Activity Guide
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-purple-100">
                      <strong className="text-purple-700">Community Building Project</strong>
                      <p className="text-sm mt-1 text-gray-700">
                        Collaborative project to design and build a model community using recycled materials.
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge className="bg-blue-100 text-blue-800">Week 4</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Download className="mr-2 h-3 w-3" /> Activity Guide
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-purple-100">
                      <strong className="text-purple-700">Belonging Patterns</strong>
                      <p className="text-sm mt-1 text-gray-700">
                        Create patterns using symbols that represent different aspects of belonging (family, school,
                        community).
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge className="bg-purple-100 text-purple-800">Week 5</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Download className="mr-2 h-3 w-3" /> Activity Guide
                        </Button>
                      </div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-purple-200 hover:shadow-md transition-shadow">
              <CardHeader className="bg-purple-50">
                <CardTitle className="text-purple-700 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" /> Literacy Extensions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-4">
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-purple-100">
                      <strong className="text-purple-700">Name Stories</strong>
                      <p className="text-sm mt-1 text-gray-700">
                        Children interview family members about how they got their name and create a story about it.
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge className="bg-pink-100 text-pink-800">Week 1</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Download className="mr-2 h-3 w-3" /> Activity Guide
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-purple-100">
                      <strong className="text-purple-700">Family Recipe Book</strong>
                      <p className="text-sm mt-1 text-gray-700">
                        Compile a class book of family recipes with illustrations and simple descriptions.
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge className="bg-orange-100 text-orange-800">Week 2</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Download className="mr-2 h-3 w-3" /> Activity Guide
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-purple-100">
                      <strong className="text-purple-700">School ABC Book</strong>
                      <p className="text-sm mt-1 text-gray-700">
                        Create a class alphabet book with each page featuring something from school (A is for Art Area,
                        etc.).
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge className="bg-green-100 text-green-800">Week 3</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Download className="mr-2 h-3 w-3" /> Activity Guide
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-purple-100">
                      <strong className="text-purple-700">Community Helper Interviews</strong>
                      <p className="text-sm mt-1 text-gray-700">
                        Invite community helpers to visit or conduct virtual interviews. Children prepare questions and
                        record responses.
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge className="bg-blue-100 text-blue-800">Week 4</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Download className="mr-2 h-3 w-3" /> Activity Guide
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-purple-100">
                      <strong className="text-purple-700">Belonging Poetry</strong>
                      <p className="text-sm mt-1 text-gray-700">
                        Create simple acrostic poems using words like BELONG, FAMILY, SCHOOL, or FRIEND.
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge className="bg-purple-100 text-purple-800">Week 5</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Download className="mr-2 h-3 w-3" /> Activity Guide
                        </Button>
                      </div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-purple-200 hover:shadow-md transition-shadow">
              <CardHeader className="bg-purple-50">
                <CardTitle className="text-purple-700 flex items-center gap-2">
                  <Heart className="h-5 w-5" /> Art Extensions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-4">
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-purple-100">
                      <strong className="text-purple-700">Self-Portrait Gallery</strong>
                      <p className="text-sm mt-1 text-gray-700">
                        Create detailed self-portraits using various art media. Display in a classroom gallery with
                        artist statements.
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge className="bg-pink-100 text-pink-800">Week 1</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Download className="mr-2 h-3 w-3" /> Activity Guide
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-purple-100">
                      <strong className="text-purple-700">Family Quilt</strong>
                      <p className="text-sm mt-1 text-gray-700">
                        Each child decorates a paper "quilt square" representing their family. Combine to create a class
                        family quilt.
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge className="bg-orange-100 text-orange-800">Week 2</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Download className="mr-2 h-3 w-3" /> Activity Guide
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-purple-100">
                      <strong className="text-purple-700">School Memory Box</strong>
                      <p className="text-sm mt-1 text-gray-700">
                        Decorate small boxes to hold special memories from school. Add to them throughout the year.
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge className="bg-green-100 text-green-800">Week 3</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Download className="mr-2 h-3 w-3" /> Activity Guide
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-purple-100">
                      <strong className="text-purple-700">Community Mural</strong>
                      <p className="text-sm mt-1 text-gray-700">
                        Create a large collaborative mural depicting the local community with buildings, people, and
                        natural features.
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge className="bg-blue-100 text-blue-800">Week 4</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Download className="mr-2 h-3 w-3" /> Activity Guide
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-purple-100">
                      <strong className="text-purple-700">Friendship Bracelets</strong>
                      <p className="text-sm mt-1 text-gray-700">
                        Make simple friendship bracelets to exchange with classmates as symbols of belonging together.
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge className="bg-purple-100 text-purple-800">Week 5</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Download className="mr-2 h-3 w-3" /> Activity Guide
                        </Button>
                      </div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-purple-200 hover:shadow-md transition-shadow">
              <CardHeader className="bg-purple-50">
                <CardTitle className="text-purple-700 flex items-center gap-2">
                  <Users className="h-5 w-5" /> Social-Emotional Extensions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-4">
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-purple-100">
                      <strong className="text-purple-700">Feelings Check-In Board</strong>
                      <p className="text-sm mt-1 text-gray-700">
                        Create a classroom feelings board where children can indicate how they're feeling each day.
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge className="bg-pink-100 text-pink-800">Week 1</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Download className="mr-2 h-3 w-3" /> Activity Guide
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-purple-100">
                      <strong className="text-purple-700">Family Appreciation Messages</strong>
                      <p className="text-sm mt-1 text-gray-700">
                        Children create thank-you notes or messages for family members expressing appreciation.
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge className="bg-orange-100 text-orange-800">Week 2</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Download className="mr-2 h-3 w-3" /> Activity Guide
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-purple-100">
                      <strong className="text-purple-700">Classroom Kindness Chain</strong>
                      <p className="text-sm mt-1 text-gray-700">
                        Add a link to a paper chain each time someone shows kindness in the classroom.
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge className="bg-green-100 text-green-800">Week 3</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Download className="mr-2 h-3 w-3" /> Activity Guide
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-purple-100">
                      <strong className="text-purple-700">Community Helper Thank You Project</strong>
                      <p className="text-sm mt-1 text-gray-700">
                        Create thank-you cards or a small performance to thank community helpers.
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge className="bg-blue-100 text-blue-800">Week 4</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Download className="mr-2 h-3 w-3" /> Activity Guide
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="bg-white p-3 rounded-lg border border-purple-100">
                      <strong className="text-purple-700">Belonging Circle Discussions</strong>
                      <p className="text-sm mt-1 text-gray-700">
                        Regular circle time discussions focused on belonging, inclusion, and friendship.
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge className="bg-purple-100 text-purple-800">Week 5</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <Download className="mr-2 h-3 w-3" /> Activity Guide
                        </Button>
                      </div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-8">
        <Button variant="outline" asChild className="border-purple-300 text-purple-700 hover:bg-purple-50">
          <Link href="/curriculum/kindergarten/belonging">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Unit Overview
          </Link>
        </Button>
      </div>
    </div>
  )
}
