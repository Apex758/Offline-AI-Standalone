import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Clock, Users, BookOpen, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/breadcrumb"

export default function ReadingBuddiesPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade2-subjects/activities/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Language Arts Activities
        </Button>
      </Link>

      <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-xl shadow-md mb-8">
        <h1 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Reading Buddies
        </h1>
        <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
          A collaborative activity to develop reading fluency, comprehension, and social learning skills.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <Clock className="h-3.5 w-3.5" /> 30 minutes
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <Users className="h-3.5 w-3.5" /> Pairs
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <BookOpen className="h-3.5 w-3.5" /> Reading & Viewing
                </Badge>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Overview</h2>
              <p className="mb-6">
                "Reading Buddies" is a collaborative activity where students pair up to read books together, taking
                turns reading aloud and discussing the story. This activity creates a supportive environment for
                students to practice reading fluency, develop comprehension strategies, and engage in meaningful
                discussions about texts while building social skills.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Learning Objectives</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Improve reading fluency and expression</li>
                <li>Develop reading comprehension strategies</li>
                <li>Practice active listening while others read</li>
                <li>Engage in meaningful discussions about texts</li>
                <li>Build collaborative learning skills and peer relationships</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Materials Needed</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>A variety of books at appropriate reading levels</li>
                <li>Reading buddy journals or response sheets</li>
                <li>Bookmarks with discussion prompts</li>
                <li>Timer (optional)</li>
                <li>Comfortable reading spaces around the classroom</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Preparation</h2>
              <ol className="list-decimal pl-6 mb-6 space-y-2">
                <li>Select and organize books at various reading levels</li>
                <li>Create reading buddy pairs, considering reading abilities and social dynamics</li>
                <li>Prepare reading buddy journals or response sheets</li>
                <li>Create bookmarks with age-appropriate discussion prompts</li>
                <li>Arrange comfortable reading spaces around the classroom</li>
              </ol>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Activity Steps</h2>
              <ol className="list-decimal pl-6 mb-6 space-y-3">
                <li>
                  <strong>Introduction (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Explain the Reading Buddies activity and its purpose</li>
                    <li>
                      Model how to be a good reading buddy (taking turns, helping with difficult words, asking
                      questions)
                    </li>
                    <li>Review discussion prompts and how to use them</li>
                  </ul>
                </li>
                <li>
                  <strong>Book Selection (3 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Pairs select a book they both agree on</li>
                    <li>Ensure the book is at an appropriate reading level for both students</li>
                    <li>Allow pairs to find their reading spot in the classroom</li>
                  </ul>
                </li>
                <li>
                  <strong>Partner Reading (15 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Partners take turns reading aloud (e.g., page by page or paragraph by paragraph)</li>
                    <li>The listening partner follows along and helps with difficult words if needed</li>
                    <li>
                      Partners pause at natural stopping points to discuss what they've read using prompt bookmarks
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Response Activity (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Partners complete a brief response activity in their reading buddy journals</li>
                    <li>
                      This could include drawing a favorite part, writing a prediction, or answering a question about
                      the story
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Whole Class Sharing (2 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Select 1-2 pairs to briefly share something interesting from their reading</li>
                    <li>Discuss what made the reading buddy experience successful</li>
                  </ul>
                </li>
              </ol>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Differentiation</h2>
              <div className="mb-6">
                <p className="font-semibold mb-2">For students who need additional support:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Provide books with more pictures and less text</li>
                  <li>Use partner reading where the stronger reader reads first, modeling fluency</li>
                  <li>Offer simplified discussion prompts</li>
                  <li>Allow audio support for certain texts</li>
                </ul>

                <p className="font-semibold mb-2">For students who need additional challenge:</p>
                <ul className="list-disc pl-6">
                  <li>Provide more complex texts and advanced discussion prompts</li>
                  <li>Encourage deeper analysis of character motivations and story themes</li>
                  <li>Have students create their own discussion questions</li>
                  <li>Assign roles like "vocabulary finder" or "connection maker" during reading</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Assessment</h2>
              <p className="mb-4">Observe and note students' abilities to:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Read with appropriate fluency, accuracy, and expression</li>
                <li>Engage in meaningful discussions about the text</li>
                <li>Use strategies to decode unfamiliar words</li>
                <li>Demonstrate comprehension through discussions and responses</li>
                <li>Work collaboratively with their reading buddy</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Extensions</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Create reading buddy book recommendations for other pairs</li>
                <li>Have reading buddies perform a favorite scene from their book</li>
                <li>Connect to writing by having pairs write an alternate ending to their story</li>
                <li>Establish cross-grade reading buddies with older or younger students</li>
                <li>Create a class book review board where reading buddies post mini-reviews</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">Discussion Prompt Examples</h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="font-semibold mb-2">Before Reading:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>What do you think this book will be about?</li>
                  <li>What do you already know about this topic?</li>
                  <li>Why did you choose this book?</li>
                </ul>

                <p className="font-semibold mb-2">During Reading:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>What do you think will happen next?</li>
                  <li>How do you think the character feels right now?</li>
                  <li>Does this remind you of anything in your life?</li>
                  <li>What is your favorite part so far?</li>
                </ul>

                <p className="font-semibold mb-2">After Reading:</p>
                <ul className="list-disc pl-6">
                  <li>What was your favorite part of the story?</li>
                  <li>Would you recommend this book to a friend? Why or why not?</li>
                  <li>If you could change the ending, what would you change?</li>
                  <li>What is one thing you learned from this book?</li>
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
                    src="/reading-buddies.png"
                    alt="Students reading together as buddies"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-bold mb-4 text-blue-700">Curriculum Connections</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Reading Fluency: Reading aloud with appropriate speed, accuracy, and expression</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Comprehension: Understanding and discussing text meaning</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Vocabulary Development: Encountering and discussing new words</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Social Skills: Collaborating, taking turns, and providing peer support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4 text-blue-700">Teacher Tips</h3>
                <ul className="space-y-4">
                  <li className="pb-3 border-b border-gray-100">
                    <p className="italic text-gray-600 mb-1">
                      "I rotate reading buddy pairs every few weeks to give students experience working with different
                      peers and reading styles."
                    </p>
                    <p className="text-sm text-right">- Ms. Taylor, Grade 2 Teacher</p>
                  </li>
                  <li className="pb-3 border-b border-gray-100">
                    <p className="italic text-gray-600 mb-1">
                      "I create laminated bookmarks with different types of discussion prompts. Each week we focus on a
                      different reading strategy, like making predictions or connections."
                    </p>
                    <p className="text-sm text-right">- Mr. Jackson, Grade 2 Teacher</p>
                  </li>
                  <li>
                    <p className="italic text-gray-600 mb-1">
                      "I take quick notes on a clipboard during Reading Buddies time, focusing on 3-4 students each
                      session. This gives me valuable assessment data without formal testing."
                    </p>
                    <p className="text-sm text-right">- Mrs. Wilson, Grade 2 Teacher</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Link href="/curriculum/grade2-subjects/activities/language-arts/sound-detectives">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous Activity
          </Button>
        </Link>
        <Link href="/curriculum/grade2-subjects/activities/language-arts/picture-books">
          <Button>
            Next Activity <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
