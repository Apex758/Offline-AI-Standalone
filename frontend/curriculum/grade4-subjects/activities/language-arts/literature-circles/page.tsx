import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Clock, Users, Target, CheckSquare, Lightbulb } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { FallbackImage } from "@/components/fallback-image"

export default function LiteratureCirclesPage() {
  return (
    <div className="container mx-auto py-8">
      
      <Link href="/curriculum/grade4-subjects/activities/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Language Arts Activities
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-100 to-teal-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-blue-700">Literature Circles</h1>
          <p className="text-gray-700">
            Students form small reading groups to discuss books, taking on different roles to analyze and respond to
            texts while developing reading comprehension, critical thinking, and discussion skills.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Literature Circles are student-led reading groups where members read the same book and meet regularly to
                discuss it. Each student takes on a specific role that guides their reading focus and contribution to
                discussions. This approach promotes deeper engagement with texts, develops critical reading skills, and
                encourages collaborative learning through meaningful peer discussions.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  <span>
                    <strong>Duration:</strong> Ongoing (4-6 weeks, with 2-3 sessions per week)
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  <span>
                    <strong>Group Size:</strong> Small groups (4-5 students)
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  <strong>Learning Objectives:</strong>
                </div>
                <ul className="list-disc pl-8 space-y-1">
                  <li>Develop reading comprehension strategies through focused discussion</li>
                  <li>Analyze literary elements such as character, setting, plot, and theme</li>
                  <li>Practice collaborative discussion skills and respectful exchange of ideas</li>
                  <li>Respond critically to texts with evidence-based reasoning</li>
                  <li>Build reading fluency and vocabulary through regular reading practice</li>
                  <li>Develop independence and responsibility in the reading process</li>
                </ul>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <CheckSquare className="h-5 w-5 mr-2 text-blue-600" />
                  <strong>Curriculum Connections:</strong>
                </div>
                <ul className="list-disc pl-8 space-y-1">
                  <li>
                    <strong>Reading & Viewing:</strong> Apply comprehension strategies during reading: determining main
                    idea, making connections, predicting, visualizing, inferring, analyzing, synthesizing
                  </li>
                  <li>
                    <strong>Reading & Viewing:</strong> Describe how characters' actions contribute to the sequence of
                    events
                  </li>
                  <li>
                    <strong>Listening & Speaking:</strong> Participate effectively in collaborative discussions
                  </li>
                  <li>
                    <strong>Writing & Representing:</strong> Write responses to literature that demonstrate
                    understanding and personal connection
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <Lightbulb className="h-5 w-5 mr-2 text-blue-600" />
                  <strong>Materials Needed:</strong>
                </div>
                <ul className="list-disc pl-8 space-y-1">
                  <li>Multiple copies of selected books (4-5 copies of each title)</li>
                  <li>Role sheets for each literature circle role</li>
                  <li>Reading journals or response logs</li>
                  <li>Discussion guidelines poster</li>
                  <li>Schedule template for reading assignments and meeting dates</li>
                  <li>Self-evaluation forms</li>
                  <li>Sticky notes for marking interesting passages</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
              <FallbackImage
                src="/placeholder-bbn15.png"
                alt="Students in a literature circle discussion"
                fallbackSrc="/placeholder.svg?height=200&width=400&query=literature+circles"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-600 italic">
                Students engage in a literature circle discussion, sharing insights based on their assigned roles.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Teacher Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <strong className="text-blue-700">Book Selection:</strong> Choose high-quality books with rich
                  characters, engaging plots, and themes that connect to students' lives or curriculum topics.
                </li>
                <li>
                  <strong className="text-blue-700">Group Formation:</strong> Consider reading levels, interests, and
                  social dynamics when forming groups.
                </li>
                <li>
                  <strong className="text-blue-700">Modeling:</strong> Demonstrate effective discussions and role
                  fulfillment before students begin independent circles.
                </li>
                <li>
                  <strong className="text-blue-700">Observation:</strong> Rotate among groups during discussions,
                  observing without dominating the conversation.
                </li>
                <li>
                  <strong className="text-blue-700">Accountability:</strong> Establish clear expectations for
                  preparation and participation.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Literature Circle Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-blue-700">Core Roles</h3>
              <ul className="space-y-3">
                <li>
                  <strong className="text-blue-700">Discussion Director:</strong> Develops open-ended questions to lead
                  the group discussion, focusing on big ideas and themes in the reading.
                </li>
                <li>
                  <strong className="text-blue-700">Passage Picker:</strong> Selects important, interesting, or powerful
                  passages from the text to share and discuss with the group.
                </li>
                <li>
                  <strong className="text-blue-700">Character Connector:</strong> Analyzes the main characters' actions,
                  motivations, and development throughout the story.
                </li>
                <li>
                  <strong className="text-blue-700">Word Wizard:</strong> Identifies unfamiliar, interesting, or
                  important words from the reading and explores their meanings and significance.
                </li>
                <li>
                  <strong className="text-blue-700">Summarizer:</strong> Prepares a brief summary of the key events and
                  important points from the assigned reading.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-blue-700">Optional Additional Roles</h3>
              <ul className="space-y-3">
                <li>
                  <strong className="text-blue-700">Connector:</strong> Makes connections between the text and personal
                  experiences, other books, or world events.
                </li>
                <li>
                  <strong className="text-blue-700">Illustrator:</strong> Creates a drawing, diagram, or other visual
                  representation related to the reading.
                </li>
                <li>
                  <strong className="text-blue-700">Researcher:</strong> Gathers background information about the
                  setting, author, or topics mentioned in the book.
                </li>
                <li>
                  <strong className="text-blue-700">Prediction Maker:</strong> Makes and justifies predictions about
                  what might happen next in the story.
                </li>
                <li>
                  <strong className="text-blue-700">Travel Tracer:</strong> Tracks where the action takes place and
                  describes the importance of the setting.
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Implementation Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-blue-700">Preparation Phase</h3>
              <ol className="list-decimal pl-8 space-y-2">
                <li>
                  <strong>Book Selection (1 session):</strong> Present 4-5 book options to the class. Allow students to
                  preview books and indicate their preferences.
                </li>
                <li>
                  <strong>Group Formation (1 session):</strong> Form groups of 4-5 students based on book preferences
                  and reading levels. Ensure each group has a mix of abilities.
                </li>
                <li>
                  <strong>Introduction to Literature Circles (1 session):</strong> Explain the purpose, process, and
                  roles. Model a literature circle discussion with a short text.
                </li>
                <li>
                  <strong>Role Training (2-3 sessions):</strong> Teach each role separately, allowing students to
                  practice with short text excerpts before beginning their books.
                </li>
                <li>
                  <strong>Schedule Creation:</strong> Work with groups to create a reading schedule, dividing the book
                  into manageable sections and setting discussion dates.
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-blue-700">Implementation Phase (4-6 weeks)</h3>
              <ol className="list-decimal pl-8 space-y-2">
                <li>
                  <strong>Independent Reading:</strong> Students read the assigned section independently, either during
                  class reading time or as homework.
                </li>
                <li>
                  <strong>Role Preparation:</strong> Students complete their role assignments in preparation for the
                  discussion.
                </li>
                <li>
                  <strong>Literature Circle Meetings (2-3 times per week):</strong> Groups meet for 20-30 minutes to
                  discuss the reading, with each member contributing based on their role.
                </li>
                <li>
                  <strong>Role Rotation:</strong> After each discussion, students rotate roles so they experience
                  different perspectives throughout the book.
                </li>
                <li>
                  <strong>Teacher Facilitation:</strong> Teacher circulates among groups, observing discussions,
                  providing guidance when needed, and taking notes for assessment.
                </li>
                <li>
                  <strong>Reading Response:</strong> After discussions, students write reflections in their reading
                  journals about insights gained from the conversation.
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-blue-700">Culmination Phase</h3>
              <ol className="list-decimal pl-8 space-y-2">
                <li>
                  <strong>Final Project (2-3 sessions):</strong> Groups create a culminating project to demonstrate
                  their understanding of the book (e.g., dramatic presentation, book trailer, alternative ending).
                </li>
                <li>
                  <strong>Presentations (1-2 sessions):</strong> Groups share their projects with the class, explaining
                  key insights about their book.
                </li>
                <li>
                  <strong>Reflection (1 session):</strong> Students complete individual reflections on their literature
                  circle experience, assessing their contributions and growth as readers.
                </li>
                <li>
                  <strong>Book Recommendations:</strong> Students create book recommendations for future readers,
                  explaining why others might enjoy their book.
                </li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Assessment Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-blue-700">Formative Assessment</h3>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Observation of group discussions using a checklist of targeted behaviors</li>
                  <li>Review of role sheets and reading journals</li>
                  <li>Individual conferences about book understanding and group participation</li>
                  <li>Self-assessment forms completed after each discussion</li>
                  <li>Peer feedback on contribution to group discussions</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-blue-700">Summative Assessment</h3>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Portfolio of completed role sheets and reading responses</li>
                  <li>Final project demonstrating comprehension of the book</li>
                  <li>Written reflection on the literature circle experience</li>
                  <li>Individual assessment of reading comprehension through written response or conference</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-blue-700">Assessment Criteria</h3>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Quality and depth of text analysis in discussions and written work</li>
                  <li>Evidence of comprehension strategies application</li>
                  <li>Preparation and fulfillment of assigned roles</li>
                  <li>Participation and contribution to group discussions</li>
                  <li>Growth in reading fluency and comprehension</li>
                  <li>Collaboration and respectful interaction with peers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Differentiation Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-blue-700">For Students Needing Additional Support</h3>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Provide books at appropriate reading levels or audio versions to support reading</li>
                  <li>Offer simplified role sheets with more structure and scaffolding</li>
                  <li>Pre-teach vocabulary from the text</li>
                  <li>Provide question stems or sentence starters for discussions</li>
                  <li>Allow for drawing or visual representations instead of written responses</li>
                  <li>Assign roles that match students' strengths initially</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-blue-700">For Students Needing Extension</h3>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Offer more challenging books with complex themes and literary devices</li>
                  <li>Encourage deeper analysis through additional research about the author or context</li>
                  <li>Create more complex or combined roles that require higher-order thinking</li>
                  <li>Assign leadership responsibilities within the group</li>
                  <li>Encourage connections to other texts and broader literary analysis</li>
                  <li>Develop additional projects that extend beyond the book</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-blue-700">Cultural Relevance</h3>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Include books by Caribbean authors and with Caribbean settings and characters</li>
                  <li>Encourage connections between texts and local cultural experiences</li>
                  <li>Allow for discussion of cultural elements and perspectives in the texts</li>
                  <li>Incorporate books that reflect diverse experiences and viewpoints</li>
                  <li>
                    Create opportunities for students to share cultural knowledge that enhances understanding of the
                    text
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Extensions and Variations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-blue-700 mb-2">Cross-Curricular Connections</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Social Studies:</strong> Select historical fiction or biographies related to current social
                  studies topics
                </li>
                <li>
                  <strong>Science:</strong> Include informational texts or science fiction related to science concepts
                  being studied
                </li>
                <li>
                  <strong>Mathematics:</strong> Explore books that incorporate mathematical concepts or problem-solving
                </li>
                <li>
                  <strong>Arts:</strong> Add artistic response options to literature circle roles and projects
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-blue-700 mb-2">Activity Variations</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Digital Literature Circles:</strong> Use online platforms for discussions and role sharing
                  when in-person meetings aren't possible
                </li>
                <li>
                  <strong>Mixed-Text Circles:</strong> Have groups read different texts on the same theme, then compare
                  and contrast
                </li>
                <li>
                  <strong>Author Study:</strong> Focus literature circles on books by the same author to analyze style
                  and themes
                </li>
                <li>
                  <strong>Genre Study:</strong> Organize literature circles around different examples of the same genre
                </li>
                <li>
                  <strong>Book vs. Film:</strong> After completing the book, watch a film adaptation and analyze the
                  differences
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Recommended Books for Grade 4 Literature Circles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">Caribbean Literature</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>"The Jumbie Bird"</strong> by Ismith Khan - A coming-of-age story set in Trinidad
              </li>
              <li>
                <strong>"The Cay"</strong> by Theodore Taylor - Set in the Caribbean during World War II
              </li>
              <li>
                <strong>"Escape from Silk Cotton Forest"</strong> by Francis Keane - A Caribbean adventure story
              </li>
              <li>
                <strong>"Island Princess in Brooklyn"</strong> by Diane Browne - About a Jamaican girl adjusting to life
                in New York
              </li>
              <li>
                <strong>"The Secret of Blackrock Cove"</strong> by Joanne Siewcharran - Mystery set in Trinidad
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">Other Recommended Titles</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>"Tales from the Odyssey"</strong> by Mary Pope Osborne - Accessible retelling of the classic
                epic
              </li>
              <li>
                <strong>"Because of Winn-Dixie"</strong> by Kate DiCamillo - A heartwarming story about friendship
              </li>
              <li>
                <strong>"The One and Only Ivan"</strong> by Katherine Applegate - Based on a true story about a gorilla
              </li>
              <li>
                <strong>"Number the Stars"</strong> by Lois Lowry - Historical fiction set during World War II
              </li>
              <li>
                <strong>"The Wild Robot"</strong> by Peter Brown - Adventure story with themes of adaptation and
                belonging
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
