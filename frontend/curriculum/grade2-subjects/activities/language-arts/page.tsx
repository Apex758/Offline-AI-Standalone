import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Clock, BarChart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade2LanguageArtsActivitiesPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade2-subjects/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Language Arts
        </Button>
      </Link>

      <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl shadow-md mb-8">
        <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          Grade 2 Language Arts Activities
        </h1>
        <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
          Explore engaging activities designed to develop Grade 2 students' language skills across listening, speaking,
          reading, viewing, writing, and representing. These activities support the curriculum outcomes while making
          learning fun and interactive.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <Button variant="outline" className="bg-purple-100 hover:bg-purple-200 border-purple-300">
          All Activities
        </Button>
        <Button variant="outline" className="hover:bg-purple-100 border-purple-300">
          Listening & Speaking
        </Button>
        <Button variant="outline" className="hover:bg-blue-100 border-blue-300">
          Reading & Viewing
        </Button>
        <Button variant="outline" className="hover:bg-green-100 border-green-300">
          Writing & Representing
        </Button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-purple-700">Listening and Speaking Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300">
            <div className="relative h-48 w-full">
              <Image
                src="/storytelling-circle.png"
                alt="Storytelling Circle"
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
            <CardHeader>
              <CardTitle>Storytelling Circle</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> 30 min
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <BarChart className="h-3 w-3" /> Beginner
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Students take turns sharing stories from their own experiences or retelling stories they've heard. This
                activity develops speaking skills, active listening, and narrative structure understanding.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/curriculum/grade2-subjects/activities/language-arts/storytelling-circle" className="w-full">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">View Activity</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <div className="relative h-48 w-full">
              <Image
                src="/children-following-directions.png"
                alt="Follow the Leader"
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
            <CardHeader>
              <CardTitle>Follow the Leader</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> 20 min
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <BarChart className="h-3 w-3" /> Intermediate
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Students practice following multi-step oral instructions to complete a task or find hidden objects. This
                activity develops listening comprehension and sequential processing skills.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/curriculum/grade2-subjects/activities/language-arts/follow-the-leader" className="w-full">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">View Activity</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <div className="relative h-48 w-full">
              <Image
                src="/children-sound-identification.png"
                alt="Sound Detectives"
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
            <CardHeader>
              <CardTitle>Sound Detectives</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> 25 min
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <BarChart className="h-3 w-3" /> Beginner
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Students listen to recordings of various sounds and identify what's making each sound. This activity
                develops active listening skills, auditory discrimination, and vocabulary.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/curriculum/grade2-subjects/activities/language-arts/sound-detectives" className="w-full">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">View Activity</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Reading and Viewing Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300">
            <div className="relative h-48 w-full">
              <Image src="/reading-buddies.png" alt="Reading Buddies" fill className="object-cover rounded-t-lg" />
            </div>
            <CardHeader>
              <CardTitle>Reading Buddies</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> 30 min
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <BarChart className="h-3 w-3" /> Intermediate
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Students work in pairs to read books and discuss their content. This activity enhances reading
                comprehension, vocabulary, and communication skills.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/curriculum/grade2-subjects/activities/language-arts/reading-buddies" className="w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">View Activity</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <div className="relative h-48 w-full">
              <Image src="/picture-books.png" alt="Picture Books" fill className="object-cover rounded-t-lg" />
            </div>
            <CardHeader>
              <CardTitle>Picture Books</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> 25 min
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <BarChart className="h-3 w-3" /> Beginner
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Students look at picture books and describe what they see, fostering descriptive language skills and
                visual literacy.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/curriculum/grade2-subjects/activities/language-arts/picture-books" className="w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">View Activity</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <div className="relative h-48 w-full">
              <Image src="/video-clips.png" alt="Video Clips" fill className="object-cover rounded-t-lg" />
            </div>
            <CardHeader>
              <CardTitle>Video Clips</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> 20 min
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <BarChart className="h-3 w-3" /> Intermediate
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Students watch short video clips and discuss the content, improving their viewing skills and
                comprehension.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/curriculum/grade2-subjects/activities/language-arts/video-clips" className="w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">View Activity</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-green-700">Writing and Representing Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300">
            <div className="relative h-48 w-full">
              <Image src="/drawing-stories.png" alt="Drawing Stories" fill className="object-cover rounded-t-lg" />
            </div>
            <CardHeader>
              <CardTitle>Drawing Stories</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> 30 min
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <BarChart className="h-3 w-3" /> Beginner
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Students draw pictures based on stories they have read or heard, helping them to visualize narratives
                and improve their writing skills.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/curriculum/grade2-subjects/activities/language-arts/drawing-stories" className="w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700">View Activity</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <div className="relative h-48 w-full">
              <Image src="/writing-journal.png" alt="Writing Journal" fill className="object-cover rounded-t-lg" />
            </div>
            <CardHeader>
              <CardTitle>Writing Journal</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> 25 min
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <BarChart className="h-3 w-3" /> Intermediate
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Students maintain a writing journal where they record their thoughts, experiences, and ideas, promoting
                regular writing practice and creativity.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/curriculum/grade2-subjects/activities/language-arts/writing-journal" className="w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700">View Activity</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <div className="relative h-48 w-full">
              <Image
                src="/acting-out-stories.png"
                alt="Acting Out Stories"
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
            <CardHeader>
              <CardTitle>Acting Out Stories</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> 20 min
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <BarChart className="h-3 w-3" /> Beginner
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Students act out scenes from stories, enhancing their understanding of narrative elements and improving
                their public speaking skills.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/curriculum/grade2-subjects/activities/language-arts/acting-out-stories" className="w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700">View Activity</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
