import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Clock, Users, BookOpen, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/breadcrumb"

export default function ActingOutStoriesPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade2-subjects/activities/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Language Arts Activities
        </Button>
      </Link>

      <div className="bg-gradient-to-r from-green-100 to-teal-100 p-6 rounded-xl shadow-md mb-8">
        <h1 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">
          Acting Out Stories
        </h1>
        <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
          An engaging activity to enhance comprehension, expression, and confidence through dramatic representation of
          stories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <Clock className="h-3.5 w-3.5" /> 20 minutes
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <Users className="h-3.5 w-3.5" /> Small groups
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-sm">
                  <BookOpen className="h-3.5 w-3.5" /> Writing & Representing
                </Badge>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Overview</h2>
              <p className="mb-6">
                The Acting Out Stories activity engages students in dramatizing scenes from stories they have read or
                heard. Through role-playing characters and events, students deepen their understanding of narrative
                elements, develop expressive language skills, and build confidence in public speaking. This activity
                brings literature to life, helping students connect emotionally with texts while reinforcing
                comprehension in a fun, interactive way.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Learning Objectives</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Enhance comprehension of story elements through dramatic representation</li>
                <li>Develop expressive language and non-verbal communication skills</li>
                <li>Build confidence in speaking and performing before peers</li>
                <li>Demonstrate understanding of character traits, motivations, and emotions</li>
                <li>Collaborate effectively with peers in a creative process</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Materials Needed</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Age-appropriate stories with clear characters and plot</li>
                <li>Simple props or costume pieces (optional)</li>
                <li>Open space for movement and performance</li>
                <li>Story sequence cards or outlines (optional)</li>
                <li>Character name tags (optional)</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Preparation</h2>
              <ol className="list-decimal pl-6 mb-6 space-y-2">
                <li>Select stories that have engaging dialogue and action</li>
                <li>Create a performance space in the classroom</li>
                <li>Gather simple props or costume pieces if using them</li>
                <li>Prepare story sequence cards for groups that need additional support</li>
                <li>Consider how to divide students into appropriate groups</li>
              </ol>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Activity Steps</h2>
              <ol className="list-decimal pl-6 mb-6 space-y-3">
                <li>
                  <strong>Introduction (3 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Explain that students will be acting out scenes from a story</li>
                    <li>
                      Discuss how actors use their bodies, voices, and faces to show character feelings and actions
                    </li>
                    <li>Model a simple example of how to dramatize a character's actions or emotions</li>
                  </ul>
                </li>
                <li>
                  <strong>Story Presentation (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Read a story aloud or review a previously read story</li>
                    <li>Discuss the main characters, setting, and key events</li>
                    <li>Identify scenes that would be good to act out</li>
                  </ul>
                </li>
                <li>
                  <strong>Group Planning (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Divide students into small groups (3-5 students)</li>
                    <li>Assign or have groups choose a scene to dramatize</li>
                    <li>Allow time for groups to decide on roles and plan their performance</li>
                    <li>Circulate to provide support and guidance</li>
                  </ul>
                </li>
                <li>
                  <strong>Performances (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Have each group perform their scene for the class</li>
                    <li>Encourage audience members to be respectful and attentive</li>
                    <li>After each performance, briefly discuss what the actors did well</li>
                  </ul>
                </li>
                <li>
                  <strong>Reflection (2 minutes):</strong>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Discuss how acting out the story helped students understand it better</li>
                    <li>Talk about what students learned about the characters through dramatization</li>
                    <li>Consider how different groups interpreted the same scene (if applicable)</li>
                  </ul>
                </li>
              </ol>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Differentiation</h2>
              <div className="mb-6">
                <p className="font-semibold mb-2">For students who need additional support:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Assign simpler roles with fewer lines</li>
                  <li>Provide script outlines or sentence starters</li>
                  <li>Allow students to be narrators rather than characters if preferred</li>
                  <li>Pair with supportive peers who can help guide the process</li>
                </ul>

                <p className="font-semibold mb-2">For students who need additional challenge:</p>
                <ul className="list-disc pl-6">
                  <li>Encourage them to add appropriate dialogue not explicitly stated in the text</li>
                  <li>Assign roles that require portraying complex emotions or character development</li>
                  <li>Have them direct their group's performance</li>
                  <li>Challenge them to perform the same scene from different characters' perspectives</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Assessment</h2>
              <p className="mb-4">Observe and note students' abilities to:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Demonstrate understanding of the story through their performance</li>
                <li>Portray character traits and emotions appropriately</li>
                <li>Use expressive language and non-verbal communication</li>
                <li>Collaborate effectively with group members</li>
                <li>Engage actively in the planning and performance process</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Extensions</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Create simple props or costume pieces to enhance performances</li>
                <li>Record performances to share with parents or other classes</li>
                <li>Have students write their own scripts based on familiar stories</li>
                <li>Create a class play by combining scenes from a longer story</li>
                <li>Perform for younger students or at a school assembly</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-green-700">Variations</h2>
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <p className="font-semibold mb-2">Different Approaches to Acting Out Stories:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    <strong>Readers' Theater:</strong> Students read from scripts with expression but minimal movement
                  </li>
                  <li>
                    <strong>Puppet Shows:</strong> Use simple puppets to act out stories
                  </li>
                  <li>
                    <strong>Tableau:</strong> Create frozen "pictures" of key moments in the story
                  </li>
                  <li>
                    <strong>Story Circle:</strong> Students sit in a circle and act out a story as it's being read
                  </li>
                  <li>
                    <strong>Role on the Wall:</strong> Create life-size outlines of characters and act out their
                    thoughts and feelings
                  </li>
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
                    src="/acting-out-stories.png"
                    alt="Students acting out a story"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-bold mb-4 text-green-700">Curriculum Connections</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Reading Comprehension: Demonstrating understanding through performance</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Oral Language: Developing expressive speaking and listening skills</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Character Analysis: Understanding traits, motivations, and emotions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span>Collaboration: Working together to create a cohesive performance</span>
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
                      "I keep a 'prop box' with simple items like hats, scarves, and puppets that students can use
                      during their performances. These minimal props help shy students feel more comfortable taking on a
                      role."
                    </p>
                    <p className="text-sm text-right">- Ms. Martinez, Grade 2 Teacher</p>
                  </li>
                  <li className="pb-3 border-b border-gray-100">
                    <p className="italic text-gray-600 mb-1">
                      "Before we start acting out stories, we practice using our bodies and voices to show different
                      emotions. This helps students develop the expressive skills they'll need for their performances."
                    </p>
                    <p className="text-sm text-right">- Mr. Wilson, Grade 2 Teacher</p>
                  </li>
                  <li>
                    <p className="italic text-gray-600 mb-1">
                      "I take photos of students acting out different scenes and create a story sequence display.
                      Students love seeing themselves as characters, and it creates a visual reminder of the story
                      structure."
                    </p>
                    <p className="text-sm text-right">- Mrs. Nguyen, Grade 2 Teacher</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Link href="/curriculum/grade2-subjects/activities/language-arts/writing-journal">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous Activity
          </Button>
        </Link>
        <Link href="/curriculum/grade2-subjects/activities/language-arts">
          <Button>
            All Activities <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
