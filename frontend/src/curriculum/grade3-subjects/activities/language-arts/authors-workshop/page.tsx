import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, PenTool, ListChecks, Users, RotateCcw, CalendarDays } from "lucide-react"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

export default function AuthorsWorkshopPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-green-100 to-teal-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">
            Authors' Workshop
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            A structured approach to writing that guides students through the complete writing process from idea
            generation to publication.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="h-5 w-5 text-green-600" />
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Authors' Workshop is a comprehensive approach to writing instruction that guides students through the
                entire writing process: prewriting, drafting, revising, editing, and publishing. This structured
                framework creates a supportive environment where students develop their writing skills, learn from one
                another, and take pride in their published work. The workshop model emphasizes both the craft of writing
                and the conventions that make writing clear and effective.
              </p>

              <div className="relative w-full h-64 mb-6 rounded-md overflow-hidden">
                <img src="./authors-workshop.png" alt="Authors" className="w-full h-full object-cover" />
              </div>

              <h3 className="text-lg font-semibold mb-2">Learning Outcomes</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>
                  Develop skills in all stages of the writing process: prewriting, drafting, revising, editing, and
                  publishing
                </li>
                <li>Generate and organize ideas effectively for different writing purposes and genres</li>
                <li>Apply revision strategies to improve organization, word choice, and sentence fluency</li>
                <li>Use editing skills to correct spelling, punctuation, grammar, and other conventions</li>
                <li>Give and receive constructive feedback during peer conferences</li>
                <li>Develop pride and ownership in published writing</li>
                <li>Build confidence and independence as writers</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Curriculum Connections</h3>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>ELO 5:</strong> Learners will generate, gather, and organize thoughts to explore, clarify and
                  reflect on thoughts, feelings, and experiences as they create a written or representative draft,
                  independently and collaboratively, for a range of audiences and purposes.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>SCO 5.1-5.7: Generate and gather thoughts and ideas</li>
                  <li>SCO 5.8-5.13: Use organizational strategies</li>
                  <li>SCO 5.14-5.18: Create written drafts</li>
                </ul>
              </div>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>ELO 6:</strong> Learners will revise the organization and language use in drafted writing or
                  representation, collaboratively and independently, for a variety of purposes and audiences.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>SCO 6.1-6.3: Revise organization styles</li>
                  <li>SCO 6.5-6.11: Develop vocabulary in writing</li>
                  <li>SCO 6.12-6.15: Develop grammar and sentence fluency</li>
                </ul>
              </div>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>ELO 7:</strong> Learners will use their knowledge of spoken language, written language and
                  writing conventions to refine the precision and enhance the meaning and clarity of their written work.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>SCO 7.1-7.5: Develop spelling conventions</li>
                  <li>SCO 7.6-7.7: Develop punctuation conventions</li>
                  <li>SCO 7.8-7.10: Develop presentation formats</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-green-600" />
                Implementation Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-green-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      1
                    </span>
                    Workshop Setup (One-time preparation)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Create a writing center with necessary supplies: paper, pencils, dictionaries, thesaurus</li>
                    <li>Set up author folders or digital portfolios for each student</li>
                    <li>Establish writing workshop procedures and expectations</li>
                    <li>Post anchor charts for the writing process and revision/editing checklists</li>
                    <li>Create a publishing center with materials for final presentations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-green-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      2
                    </span>
                    Mini-Lesson (10-15 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Focus on a specific writing skill, strategy, or craft element</li>
                    <li>Use mentor texts to demonstrate the skill in authentic writing</li>
                    <li>Model the strategy through think-alouds and demonstrations</li>
                    <li>Provide guided practice with the focus skill</li>
                    <li>Connect the lesson to students' ongoing writing projects</li>
                  </ul>
                  <p className="mt-2 pl-8 text-sm text-gray-600">
                    <strong>Note:</strong> Mini-lessons should address the current needs of your writers and may focus
                    on any aspect of the writing process or craft.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-green-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      3
                    </span>
                    Independent Writing Time (20-30 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Students work on their writing projects at their own pace</li>
                    <li>Writers engage in different stages of the process simultaneously</li>
                    <li>Teacher conducts individual conferences and small group instruction</li>
                    <li>Provide status-of-the-class check-ins to monitor progress</li>
                    <li>Encourage application of the mini-lesson focus</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-green-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      4
                    </span>
                    Writing Conferences
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>
                      <strong>Teacher-Student Conferences:</strong> Brief (3-5 minute) targeted conversations about
                      writing progress
                    </li>
                    <li>
                      <strong>Peer Conferences:</strong> Structured feedback sessions between student partners
                    </li>
                    <li>
                      <strong>Small Group Conferences:</strong> Targeted instruction for 3-4 students with similar needs
                    </li>
                    <li>Use conference notes to track student progress and plan future instruction</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-green-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      5
                    </span>
                    Sharing Time (5-10 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Selected students share their writing progress or completed pieces</li>
                    <li>Audience provides focused, constructive feedback</li>
                    <li>Teacher highlights effective use of strategies from mini-lessons</li>
                    <li>Celebrate writing achievements and breakthroughs</li>
                    <li>Use this time to build a supportive writing community</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-green-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      6
                    </span>
                    Publishing Celebrations
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Schedule regular publishing events (every 3-4 weeks)</li>
                    <li>Help students prepare final copies of selected works</li>
                    <li>Invite an audience (other classes, parents, community members)</li>
                    <li>Create a special format for sharing published works</li>
                    <li>Display published writing in classroom, school library, or digital platforms</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-green-600" />
                The Writing Process Cycle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 p-3 rounded-md border border-green-200">
                  <h3 className="text-md font-semibold mb-1 text-green-700">1. Prewriting</h3>
                  <p className="text-sm mb-1">Generating and organizing ideas before drafting.</p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Brainstorming and idea generation</li>
                    <li>Graphic organizers and webs</li>
                    <li>Research and note-taking</li>
                    <li>Discussion and exploration</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                  <h3 className="text-md font-semibold mb-1 text-blue-700">2. Drafting</h3>
                  <p className="text-sm mb-1">Getting ideas onto paper without worrying about perfection.</p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Focus on content and ideas</li>
                    <li>Write quickly to capture thoughts</li>
                    <li>Use prewriting as a guide</li>
                    <li>Skip concerns about spelling and grammar</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-3 rounded-md border border-purple-200">
                  <h3 className="text-md font-semibold mb-1 text-purple-700">3. Revising</h3>
                  <p className="text-sm mb-1">Improving the content, organization, and language.</p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Add, delete, or rearrange information</li>
                    <li>Enhance word choice and sentence fluency</li>
                    <li>Ensure clear organization</li>
                    <li>Receive and incorporate feedback</li>
                  </ul>
                </div>

                <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                  <h3 className="text-md font-semibold mb-1 text-amber-700">4. Editing</h3>
                  <p className="text-sm mb-1">Correcting errors in conventions.</p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Check spelling and punctuation</li>
                    <li>Correct grammar and usage</li>
                    <li>Ensure proper formatting</li>
                    <li>Use editing checklists</li>
                  </ul>
                </div>

                <div className="bg-teal-50 p-3 rounded-md border border-teal-200">
                  <h3 className="text-md font-semibold mb-1 text-teal-700">5. Publishing</h3>
                  <p className="text-sm mb-1">Creating a final product to share with an audience.</p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Prepare a clean, final copy</li>
                    <li>Add illustrations or visual elements</li>
                    <li>Create a meaningful presentation format</li>
                    <li>Share with an authentic audience</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Differentiation Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-green-700">For Students Who Excel</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Introduce more complex genres and writing techniques</li>
                    <li>Encourage deeper revision focusing on literary devices and author's craft</li>
                    <li>Provide opportunities for extended research and integration of sources</li>
                    <li>Challenge with more sophisticated publishing formats</li>
                    <li>Allow for leadership roles in peer conferences and sharing sessions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-green-700">For Students Who Need Support</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Provide more structured prewriting graphic organizers</li>
                    <li>Break the writing process into smaller, manageable steps</li>
                    <li>Use dictation or speech-to-text tools for initial drafting</li>
                    <li>Provide frequent, targeted conferences with specific goals</li>
                    <li>Develop individualized editing checklists focusing on priority skills</li>
                    <li>Allow for alternative publishing formats (audio, visual, mixed media)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-green-700">Language Considerations</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Allow initial drafting in Home Language when beneficial</li>
                    <li>Provide bilingual resources such as dictionaries and thesauri</li>
                    <li>Acknowledge the richness of cultural expressions and storytelling traditions</li>
                    <li>Scaffold the transition between Home Language and Standard English</li>
                    <li>Celebrate the unique voice that emerges from diverse language backgrounds</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-green-600" />
                Sample Workshop Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-green-700">Week 1: Narrative Writing</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      <strong>Monday:</strong> Generating story ideas (prewriting)
                    </li>
                    <li>
                      <strong>Tuesday:</strong> Creating strong beginnings
                    </li>
                    <li>
                      <strong>Wednesday:</strong> Developing characters
                    </li>
                    <li>
                      <strong>Thursday:</strong> Adding sensory details
                    </li>
                    <li>
                      <strong>Friday:</strong> Crafting endings with impact
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-green-700">Week 2: Revision Focus</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      <strong>Monday:</strong> Revising for clarity and organization
                    </li>
                    <li>
                      <strong>Tuesday:</strong> Enhancing word choice (strong verbs)
                    </li>
                    <li>
                      <strong>Wednesday:</strong> Varying sentence beginnings
                    </li>
                    <li>
                      <strong>Thursday:</strong> Peer revision conferences
                    </li>
                    <li>
                      <strong>Friday:</strong> Final revisions and editing begins
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-green-700">Week 3: Editing & Publishing</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      <strong>Monday:</strong> Editing for punctuation
                    </li>
                    <li>
                      <strong>Tuesday:</strong> Spelling strategies and checks
                    </li>
                    <li>
                      <strong>Wednesday:</strong> Creating illustrations
                    </li>
                    <li>
                      <strong>Thursday:</strong> Publishing final copies
                    </li>
                    <li>
                      <strong>Friday:</strong> Author's Celebration (sharing published work)
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 bg-green-50 p-3 rounded-md border border-green-200">
                <h3 className="text-md font-semibold mb-1 text-green-700">Mini-Lesson Topics by Writing Trait</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>
                    <strong>Ideas:</strong> Finding meaningful topics, adding details, narrowing focus
                  </li>
                  <li>
                    <strong>Organization:</strong> Beginning/middle/end, paragraph structure, transitions
                  </li>
                  <li>
                    <strong>Voice:</strong> Showing emotion, personal style, audience awareness
                  </li>
                  <li>
                    <strong>Word Choice:</strong> Strong verbs, specific nouns, figurative language
                  </li>
                  <li>
                    <strong>Sentence Fluency:</strong> Varying sentence types, dialogue, rhythm
                  </li>
                  <li>
                    <strong>Conventions:</strong> Punctuation, capitalization, spelling patterns
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-xl shadow-md border border-green-200 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-green-800">Assessment in Authors' Workshop</h2>
        <p className="mb-4">
          Assessment in the Authors' Workshop is ongoing and multifaceted, focusing on both process and product. Rather
          than evaluating only the final published piece, consider the student's growth, application of strategies, and
          improvement over time.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-green-700">Formative Assessment</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Conference notes documenting student progress and goals</li>
              <li>Observations of strategy application during independent writing</li>
              <li>Samples of drafts showing revision and editing</li>
              <li>Self-assessment checklists for each stage of the writing process</li>
              <li>Peer feedback and reflections</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-green-700">Summative Assessment</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Rubrics focusing on specific traits of writing</li>
              <li>Comparison of writing samples over time to show growth</li>
              <li>Published pieces evaluated against grade-level standards</li>
              <li>Writing portfolios with student reflections on learning</li>
              <li>Performance-based assessments focused on specific skills</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Link to="/curriculum/grade3-subjects/activities/language-arts/reading-response-journals">
          <Button variant="outline" className="mr-4">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous Activity
          </Button>
        </Link>
        <Link to="/curriculum/grade3-subjects/activities/language-arts/readers-theater">
          <Button className="bg-green-600 hover:bg-green-700">Next Activity: Reader's Theater</Button>
        </Link>
      </div>
    </div>
  )
}
