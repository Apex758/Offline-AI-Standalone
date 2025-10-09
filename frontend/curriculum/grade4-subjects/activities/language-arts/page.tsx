import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, BookOpen, MessageSquare, PenTool, Clock, Users, Target } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { FallbackImage } from "@/components/fallback-image"

export default function Grade4LanguageArtsActivitiesPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade4-subjects/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 4 Language Arts
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Grade 4 Language Arts Activities
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            Explore a collection of engaging, standards-aligned activities designed to develop language arts skills in
            Grade 4 students. These activities support the curriculum strands of Listening & Speaking, Reading &
            Viewing, and Writing & Representing.
          </p>
        </div>
      </div>

      <Tabs defaultValue="listening-speaking" className="mb-8">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger
            value="listening-speaking"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Listening & Speaking
          </TabsTrigger>
          <TabsTrigger
            value="reading-viewing"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Reading & Viewing
          </TabsTrigger>
          <TabsTrigger
            value="writing-representing"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <PenTool className="mr-2 h-4 w-4" />
            Writing & Representing
          </TabsTrigger>
        </TabsList>

        {/* Listening & Speaking Activities */}
        <TabsContent value="listening-speaking">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActivityCard
              title="Podcast Production"
              description="Students create their own podcast episodes on topics of interest, developing speaking, listening, and digital literacy skills."
              image="/placeholder-9r9wm.png"
              time="3-4 sessions"
              groupSize="Small groups (3-4)"
              objectives={[
                "Develop clear and coherent oral expression",
                "Practice active listening and responding",
                "Learn basic audio recording and editing skills",
                "Organize information for presentation",
              ]}
              path="/curriculum/grade4-subjects/activities/language-arts/podcast-production"
            />

            <ActivityCard
              title="Debate Club"
              description="Students research, prepare, and participate in structured debates on age-appropriate topics, developing persuasive speaking and critical listening skills."
              image="/placeholder-12wti.png"
              time="2-3 sessions"
              groupSize="Whole class"
              objectives={[
                "Develop persuasive speaking techniques",
                "Practice critical listening and note-taking",
                "Learn to respond respectfully to opposing viewpoints",
                "Research and organize information for debates",
              ]}
              path="/curriculum/grade4-subjects/activities/language-arts/debate-club"
            />

            <ActivityCard
              title="Cultural Storytelling Circle"
              description="Students learn, practice, and share traditional Caribbean stories, developing oral storytelling skills and cultural appreciation."
              image="/caribbean-storytelling-circle.png"
              time="1-2 sessions"
              groupSize="Whole class"
              objectives={[
                "Develop oral storytelling techniques",
                "Appreciate cultural heritage through stories",
                "Practice active listening and comprehension",
                "Build confidence in public speaking",
              ]}
              path="/curriculum/grade4-subjects/activities/language-arts/cultural-storytelling"
            />

            <ActivityCard
              title="Radio Drama"
              description="Students adapt short stories into radio dramas, focusing on vocal expression, sound effects, and collaborative performance."
              image="/placeholder.svg?height=200&width=300&query=children performing radio drama"
              time="3-4 sessions"
              groupSize="Small groups (4-6)"
              objectives={[
                "Develop vocal expression and character voices",
                "Create and perform sound effects",
                "Adapt written text for audio performance",
                "Collaborate on creative productions",
              ]}
              path="/curriculum/grade4-subjects/activities/language-arts/radio-drama"
            />

            <ActivityCard
              title="Interview Project"
              description="Students prepare questions, conduct interviews with community members, and present their findings to the class."
              image="/placeholder.svg?height=200&width=300&query=child interviewing adult"
              time="2-3 sessions"
              groupSize="Individual or pairs"
              objectives={[
                "Develop questioning techniques",
                "Practice active listening and note-taking",
                "Organize and present information orally",
                "Build connections with community members",
              ]}
              path="/curriculum/grade4-subjects/activities/language-arts/interview-project"
            />

            <ActivityCard
              title="Listening Comprehension Challenge"
              description="Students participate in a series of listening activities with increasing complexity, developing critical listening skills."
              image="/placeholder.svg?height=200&width=300&query=students listening activity"
              time="1 session"
              groupSize="Whole class"
              objectives={[
                "Develop active listening strategies",
                "Improve listening comprehension",
                "Practice note-taking from oral sources",
                "Identify main ideas and supporting details",
              ]}
              path="/curriculum/grade4-subjects/activities/language-arts/listening-comprehension"
            />
          </div>
        </TabsContent>

        {/* Reading & Viewing Activities */}
        <TabsContent value="reading-viewing">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActivityCard
              title="Literature Circles"
              description="Students form small reading groups to discuss books, taking on different roles to analyze and respond to texts."
              image="/placeholder.svg?height=200&width=300&query=children literature circle discussion"
              time="Ongoing (4-6 weeks)"
              groupSize="Small groups (4-5)"
              objectives={[
                "Develop reading comprehension strategies",
                "Practice collaborative discussion skills",
                "Analyze literary elements",
                "Respond critically to texts",
              ]}
              path="/curriculum/grade4-subjects/activities/language-arts/literature-circles"
            />

            <ActivityCard
              title="Caribbean Authors Study"
              description="Students explore works by Caribbean authors, analyzing themes, language use, and cultural connections."
              image="/placeholder.svg?height=200&width=300&query=Caribbean children's books"
              time="2-3 weeks"
              groupSize="Whole class and small groups"
              objectives={[
                "Recognize and appreciate Caribbean literature",
                "Analyze cultural themes and perspectives",
                "Compare writing styles across authors",
                "Make text-to-self connections",
              ]}
              path="/curriculum/grade4-subjects/activities/language-arts/caribbean-authors"
            />

            <ActivityCard
              title="Digital Reading Response Journals"
              description="Students create digital journals to respond to their reading through writing, drawing, and multimedia elements."
              image="/placeholder.svg?height=200&width=300&query=digital reading journal tablet"
              time="Ongoing"
              groupSize="Individual"
              objectives={[
                "Develop reading reflection skills",
                "Practice written response to literature",
                "Integrate technology with reading",
                "Express understanding through multiple modes",
              ]}
              path="/curriculum/grade4-subjects/activities/language-arts/digital-reading-journals"
            />

            <ActivityCard
              title="Media Literacy Workshop"
              description="Students analyze various media sources, learning to identify purpose, audience, and techniques used to convey messages."
              image="/placeholder.svg?height=200&width=300&query=children analyzing media"
              time="2-3 sessions"
              groupSize="Whole class and small groups"
              objectives={[
                "Develop critical media literacy skills",
                "Identify purpose and audience in media",
                "Recognize persuasive techniques",
                "Compare information across sources",
              ]}
              path="/curriculum/grade4-subjects/activities/language-arts/media-literacy"
            />

            <ActivityCard
              title="Readers Theater"
              description="Students prepare and perform dramatic readings of texts, focusing on expression, fluency, and interpretation."
              image="/placeholder.svg?height=200&width=300&query=children readers theater"
              time="2-3 sessions"
              groupSize="Small groups (4-6)"
              objectives={[
                "Improve reading fluency and expression",
                "Develop text interpretation skills",
                "Build confidence in oral reading",
                "Collaborate on performances",
              ]}
              path="/curriculum/grade4-subjects/activities/language-arts/readers-theater"
            />

            <ActivityCard
              title="Genre Exploration"
              description="Students explore different literary genres through reading, discussion, and creative response activities."
              image="/placeholder.svg?height=200&width=300&query=books different genres children"
              time="4-6 sessions"
              groupSize="Whole class and individual"
              objectives={[
                "Recognize characteristics of different genres",
                "Compare and contrast genre features",
                "Develop genre preferences",
                "Apply genre knowledge to reading choices",
              ]}
              path="/curriculum/grade4-subjects/activities/language-arts/genre-exploration"
            />
          </div>
        </TabsContent>

        {/* Writing & Representing Activities */}
        <TabsContent value="writing-representing">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActivityCard
              title="Digital Storytelling"
              description="Students create multimedia stories combining text, images, audio, and simple animations."
              image="/placeholder.svg?height=200&width=300&query=children digital storytelling"
              time="3-4 sessions"
              groupSize="Individual or pairs"
              objectives={[
                "Develop narrative writing skills",
                "Integrate technology with writing",
                "Create multimedia presentations",
                "Practice digital literacy skills",
              ]}
              path="/curriculum/grade4-subjects/activities/language-arts/digital-storytelling"
            />

            <ActivityCard
              title="Poetry Workshop"
              description="Students explore various poetic forms and techniques, then create their own poetry collection."
              image="/placeholder.svg?height=200&width=300&query=children writing poetry"
              time="2-3 sessions"
              groupSize="Whole class and individual"
              objectives={[
                "Recognize and use poetic devices",
                "Experiment with different poetry forms",
                "Express ideas through creative language",
                "Develop appreciation for poetry",
              ]}
              path="/curriculum/grade4-subjects/activities/language-arts/poetry-workshop"
            />

            <ActivityCard
              title="Persuasive Writing Campaign"
              description="Students identify school or community issues and create persuasive writing pieces to advocate for change."
              image="/placeholder.svg?height=200&width=300&query=children persuasive writing"
              time="3-4 sessions"
              groupSize="Small groups (3-4)"
              objectives={[
                "Develop persuasive writing techniques",
                "Organize arguments with supporting evidence",
                "Address audience and purpose in writing",
                "Connect writing to real-world issues",
              ]}
              path="/curriculum/grade4-subjects/activities/language-arts/persuasive-campaign"
            />

            <ActivityCard
              title="Author's Craft Study"
              description="Students analyze the writing techniques of favorite authors, then apply these techniques to their own writing."
              image="/placeholder.svg?height=200&width=300&query=children analyzing books writing"
              time="2-3 sessions"
              groupSize="Whole class and individual"
              objectives={[
                "Identify author's craft techniques",
                "Analyze how authors create effects",
                "Apply craft techniques to original writing",
                "Develop personal writing style",
              ]}
              path="/curriculum/grade4-subjects/activities/language-arts/authors-craft"
            />

            <ActivityCard
              title="Collaborative Writing Project"
              description="Students work together to create a class magazine, anthology, or digital publication."
              image="/placeholder.svg?height=200&width=300&query=children collaborative writing"
              time="4-6 sessions"
              groupSize="Small groups and whole class"
              objectives={[
                "Practice collaborative writing",
                "Develop editing and revision skills",
                "Create cohesive multi-author publications",
                "Experience the publishing process",
              ]}
              path="/curriculum/grade4-subjects/activities/language-arts/collaborative-writing"
            />

            <ActivityCard
              title="Research and Report"
              description="Students conduct research on topics of interest and create informational reports using text features."
              image="/placeholder.svg?height=200&width=300&query=children research project"
              time="3-4 sessions"
              groupSize="Individual or pairs"
              objectives={[
                "Develop research skills",
                "Organize information logically",
                "Use text features in informational writing",
                "Create clear explanations for audiences",
              ]}
              path="/curriculum/grade4-subjects/activities/language-arts/research-report"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl shadow-md border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Implementing Language Arts Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-blue-700">Integration Strategies</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Connect activities to current curriculum themes and topics</li>
              <li>Integrate activities across language arts strands for deeper learning</li>
              <li>Incorporate cultural contexts and local references</li>
              <li>Adapt activities to accommodate different learning styles and needs</li>
              <li>Use formative assessment during activities to guide instruction</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-blue-700">Tips for Success</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Establish clear expectations and success criteria for each activity</li>
              <li>Provide models and examples before students begin independent work</li>
              <li>Build in reflection opportunities throughout the learning process</li>
              <li>Create authentic audiences for student work whenever possible</li>
              <li>Celebrate and showcase student achievements</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Cross-Curricular Connections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-700">Social Studies</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                <li>Interview local community members about historical events</li>
                <li>Create informational reports about Caribbean nations</li>
                <li>Develop persuasive writing about community issues</li>
                <li>Research and present on cultural traditions</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-blue-700">Science</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                <li>Write procedural texts for science experiments</li>
                <li>Create informational posters about ecosystems</li>
                <li>Develop podcast episodes explaining scientific concepts</li>
                <li>Read and respond to texts about environmental issues</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-green-700">Mathematics</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                <li>Write explanations of mathematical problem-solving</li>
                <li>Create word problems incorporating narrative elements</li>
                <li>Develop presentations explaining mathematical concepts</li>
                <li>Read and respond to texts about famous mathematicians</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Activity Card Component
function ActivityCard({
  title,
  description,
  image,
  time,
  groupSize,
  objectives,
  path,
}: {
  title: string
  description: string
  image: string
  time: string
  groupSize: string
  objectives: string[]
  path: string
}) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
        <FallbackImage
          src={image}
          alt={title}
          fill
          className="object-cover"
          fallbackSrc="/placeholder.svg?height=200&width=300&query=language arts activity"
        />
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center mb-2">
          <Clock className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-sm text-gray-600">{time}</span>
        </div>
        <div className="flex items-center mb-4">
          <Users className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-sm text-gray-600">{groupSize}</span>
        </div>
        <div className="mb-2">
          <div className="flex items-center">
            <Target className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Learning Objectives:</span>
          </div>
          <ul className="list-disc pl-6 mt-1 space-y-1">
            {objectives.map((objective, index) => (
              <li key={index} className="text-sm text-gray-600">
                {objective}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={path} className="w-full">
          <Button className="w-full">View Activity</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
