import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Clock, Users, BookOpen, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/breadcrumb"

export default function WritingJournalPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade2-subjects/activities/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Language Arts Activities
        </Button>
      </Link>

      <div className="bg-gradient-to-r from-green-100 to-teal-100 p-6 rounded-xl shadow-md mb-8">
        <h1 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">
          Writing Journal
        </h1>
        <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
          An engaging activity to develop writing fluency, self-expression, and reflection through regular journal
          writing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <Clock className="h-3.5 w-3.5" /> 25 minutes
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <Users className="h-3.5 w-3.5" /> Individual
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <BookOpen className="h-3.5 w-3.5" /> Writing & Representing
                </Badge>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Overview</h2>
              <p className="mb-6">
                The Writing Journal activity establishes a regular practice where students record their thoughts,
                experiences, and ideas in a personal journal. This ongoing activity promotes writing fluency,
                self-expression, and reflection while providing students with a low-pressure space to practice writing
                skills. Writing journals help students develop their unique voice, build writing stamina, and make
                connections between writing and their personal lives.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Learning Objectives</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Develop writing fluency through regular practice</li>
                <li>Express thoughts, feelings, and ideas in written form</li>
                <li>Build writing stamina and confidence</li>
                <li>Practice using descriptive language and details</li>
                <li>Reflect on personal experiences and learning</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Materials Needed</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Individual journals or notebooks for each student</li>
                <li>Writing tools (pencils, colored pencils, markers)</li>
                <li>Journal prompts (displayed on board or printed)</li>
                <li>Timer or clock</li>
                <li>Examples of journal entries (teacher-created or from literature)</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Preparation</h2>
              <ol className="list-decimal pl-6 mb-6 space-y-2">
                <li>Create or purchase journals for each student</li>
                <li>Prepare a list of age-appropriate journal prompts</li>
                <li>Establish a consistent time for journal writing in the daily schedule</li>
                <li>Create a comfortable writing environment</li>
                <li>Develop guidelines for journal writing and sharing</li>
              </ol>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Activity Steps</h2>
              <ol className="list-decimal pl-6 mb-6 space-y-3">
                <li>
                  <strong>Introduction (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Gather students in a comfortable area</li>
                    <li>Explain the purpose of journal writing</li>
                    <li>Share the day's writing prompt or topic</li>
                    <li>Model a brief journal entry related to the prompt</li>
                  </ul>
                </li>
                <li>
                  <strong>Writing Time (15 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Students return to their seats with their journals</li>
                    <li>Set a timer for the writing period</li>
                    <li>Encourage continuous writing without worrying about spelling or grammar</li>
                    <li>Circulate to provide support and encouragement</li>
                  </ul>
                </li>
                <li>
                  <strong>Sharing (Optional, 5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Invite volunteers to share portions of their journal entries</li>
                    <li>Establish a respectful listening environment</li>
                    <li>Provide positive feedback on content rather than mechanics</li>
                  </ul>
                </li>
                <li>
                  <strong>Reflection (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Discuss how the writing process felt today</li>
                    <li>Highlight interesting ideas or approaches shared</li>
                    <li>Preview the next journal writing session</li>
                  </ul>
                </li>
              </ol>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Differentiation</h2>
              <div className="mb-6">
                <p className="font-semibold mb-2">For students who need additional support:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Provide sentence starters or frames</li>
                  <li>Allow drawing as part of the journal entry</li>
                  <li>Offer the option to dictate ideas to a scribe</li>
                  <li>Reduce the expected writing time or amount</li>
                </ul>

                <p className="font-semibold mb-2">For students who need additional challenge:</p>
                <ul className="list-disc pl-6">
                  <li>Suggest more complex prompts or open-ended questions</li>
                  <li>Encourage the use of dialogue, descriptive language, or figurative language</li>
                  <li>Invite them to experiment with different writing styles or formats</li>
                  <li>Extend the writing time for those who want to continue</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Assessment</h2>
              <p className="mb-4">Observe and note students' abilities to:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Engage in sustained writing for the allotted time</li>
                <li>Express ideas clearly and with increasing detail</li>
                <li>Demonstrate growth in writing fluency over time</li>
                <li>Apply newly learned vocabulary and language structures</li>
                <li>Show evidence of personal voice and style</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Extensions</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Create special themed journal entries tied to curriculum topics</li>
                <li>Compile selected journal entries into a class book</li>
                <li>Use journal entries as seeds for more developed writing pieces</li>
                <li>Incorporate different writing genres into journal prompts</li>
                <li>Create digital journals using appropriate technology</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Sample Journal Prompts</h2>
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <p className="font-semibold mb-2">Personal Experience Prompts:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Write about something that made you laugh recently.</li>
                  <li>Describe your favorite place to go with your family.</li>
                  <li>What was the best part of your weekend?</li>
                  <li>Write about a time when you helped someone.</li>
                  <li>Describe something you're really good at doing.</li>
                </ul>

                <p className="font-semibold mb-2">Imaginative Prompts:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>If you could be any animal for a day, what would you be and why?</li>
                  <li>Write about what might happen if it rained candy instead of water.</li>
                  <li>Imagine you found a magic key. What would it open?</li>
                  <li>If you could invent something new, what would it be?</li>
                  <li>Write a story about a talking tree.</li>
                </ul>

                <p className="font-semibold mb-2">Reflective Prompts:</p>
                <ul className="list-disc pl-6">
                  <li>What is something new you learned this week?</li>
                  <li>Write about a mistake you made and what you learned from it.</li>
                  <li>What are three things you're thankful for today?</li>
                  <li>What is something you want to get better at? How can you practice?</li>
                  <li>Write about a goal you have for this month.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="relative h-48 w-full mb-4">
                  <Image
                    src="/writing-journal.png"
                    alt="Student writing in journal"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-bold mb-4 text-green-700">Curriculum Connections</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Writing Fluency: Building stamina and comfort with writing</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Self-Expression: Developing personal voice and style</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Vocabulary Development: Applying new words in meaningful contexts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Reflection: Thinking about experiences and learning</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4 text-green-700">Teacher Tips</h3>
                <ul className="space-y-4">
                  <li className="pb-3 border-b border-gray-100">
                    <p className="italic text-gray-600 mb-1">
                      "I keep a teacher journal and write alongside my students. This not only models the process but
                      also shows them that writing is valuable for everyone, not just a school assignment."
                    </p>
                    <p className="text-sm text-right">- Ms. Rodriguez, Grade 2 Teacher</p>
                  </li>
                  <li className="pb-3 border-b border-gray-100">
                    <p className="italic text-gray-600 mb-1">
                      "I offer three prompt options each day, plus a 'free choice' option. This gives students some
                      structure but also honors their need for autonomy and personal connection to their writing."
                    </p>
                    <p className="text-sm text-right">- Mr. Jackson, Grade 2 Teacher</p>
                  </li>
                  <li>
                    <p className="italic text-gray-600 mb-1">
                      "Journal sharing in my class is always voluntary. This creates a safe space where students can
                      write honestly without worrying about having to share personal thoughts."
                    </p>
                    <p className="text-sm text-right">- Mrs. Thompson, Grade 2 Teacher</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Link href="/curriculum/grade2-subjects/activities/language-arts/drawing-stories">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous Activity
          </Button>
        </Link>
        <Link href="/curriculum/grade2-subjects/activities/language-arts/acting-out-stories">
          <Button>
            Next Activity <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
