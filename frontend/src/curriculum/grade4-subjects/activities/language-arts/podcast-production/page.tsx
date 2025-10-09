import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Clock, Users, Target, CheckSquare, Lightbulb } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { FallbackImage } from "@/components/fallback-image"

export default function PodcastProductionPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade4-subjects/activities/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Language Arts Activities
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-purple-700">Podcast Production</h1>
          <p className="text-gray-700">
            Students create their own podcast episodes on topics of interest, developing speaking, listening, and
            digital literacy skills through the process of planning, recording, and sharing audio content.
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
                In this activity, students will work in small groups to create their own podcast episodes. They will
                learn about the podcast format, plan their content, practice speaking skills, record their episodes, and
                share their finished products with an audience. This project integrates listening, speaking, research,
                writing, and digital literacy skills in an engaging, authentic context.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-purple-600" />
                  <span>
                    <strong>Duration:</strong> 3-4 sessions (45-60 minutes each)
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-600" />
                  <span>
                    <strong>Group Size:</strong> Small groups (3-4 students)
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <Target className="h-5 w-5 mr-2 text-purple-600" />
                  <strong>Learning Objectives:</strong>
                </div>
                <ul className="list-disc pl-8 space-y-1">
                  <li>Develop clear and coherent oral expression for a specific audience and purpose</li>
                  <li>Practice active listening and responding to others' ideas</li>
                  <li>Learn basic audio recording and editing skills</li>
                  <li>Organize information logically for oral presentation</li>
                  <li>Collaborate effectively in small groups</li>
                  <li>Develop research skills on self-selected topics</li>
                </ul>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <CheckSquare className="h-5 w-5 mr-2 text-purple-600" />
                  <strong>Curriculum Connections:</strong>
                </div>
                <ul className="list-disc pl-8 space-y-1">
                  <li>
                    <strong>Listening & Speaking:</strong> Speak fluently and confidently in a range of contexts and
                    with a range of audiences
                  </li>
                  <li>
                    <strong>Listening & Speaking:</strong> Present ideas in a logical, appropriate sequence in an oral
                    presentation
                  </li>
                  <li>
                    <strong>Reading & Viewing:</strong> Use different sources to find information for research purposes
                  </li>
                  <li>
                    <strong>Writing & Representing:</strong> Generate, gather, and organize ideas and information for
                    intended purposes and audiences
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <Lightbulb className="h-5 w-5 mr-2 text-purple-600" />
                  <strong>Materials Needed:</strong>
                </div>
                <ul className="list-disc pl-8 space-y-1">
                  <li>Digital recording devices (tablets, smartphones, computers with microphones)</li>
                  <li>Simple audio editing software or apps (e.g., Audacity, GarageBand, or online tools)</li>
                  <li>Headphones</li>
                  <li>Planning templates for podcast episodes</li>
                  <li>Sample podcast episodes appropriate for Grade 4 students</li>
                  <li>Research materials on student-selected topics</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
              <FallbackImage
                src="/placeholder-9r9wm.png"
                alt="Students recording a podcast"
                fallbackSrc="/placeholder.svg?height=200&width=400&query=podcast+production"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-600 italic">
                Students collaborate to record their podcast episode, practicing clear speaking and active listening
                skills.
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
                  <strong className="text-purple-700">Start Simple:</strong> Begin with short podcast episodes (3-5
                  minutes) to make the project manageable.
                </li>
                <li>
                  <strong className="text-purple-700">Provide Models:</strong> Share age-appropriate podcasts as
                  examples before students begin planning.
                </li>
                <li>
                  <strong className="text-purple-700">Tech Support:</strong> Test recording equipment and software
                  before the activity begins.
                </li>
                <li>
                  <strong className="text-purple-700">Group Roles:</strong> Assign specific roles within each group
                  (host, researcher, sound technician, editor).
                </li>
                <li>
                  <strong className="text-purple-700">Authentic Audience:</strong> Share finished podcasts with other
                  classes or on a school platform to provide a real audience.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Implementation Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-purple-700">Session 1: Introduction and Planning</h3>
              <ol className="list-decimal pl-8 space-y-2">
                <li>
                  <strong>Introduction to Podcasts (15 minutes):</strong> Explain what podcasts are and listen to
                  excerpts from age-appropriate examples. Discuss the features of effective podcasts.
                </li>
                <li>
                  <strong>Form Groups and Select Topics (15 minutes):</strong> Organize students into small groups and
                  guide them in selecting topics of interest (e.g., local history, science discoveries, book reviews,
                  school events).
                </li>
                <li>
                  <strong>Planning Template (20 minutes):</strong> Provide planning templates for students to outline
                  their podcast episodes, including introduction, main content sections, and conclusion.
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-purple-700">Session 2: Research and Script Development</h3>
              <ol className="list-decimal pl-8 space-y-2">
                <li>
                  <strong>Research (20 minutes):</strong> Students gather information on their topics using classroom
                  resources, books, and approved online sources.
                </li>
                <li>
                  <strong>Script Writing (25 minutes):</strong> Groups develop scripts for their podcasts, including
                  dialogue, questions, and transitions between speakers.
                </li>
                <li>
                  <strong>Practice (15 minutes):</strong> Students practice reading their scripts aloud, focusing on
                  clarity, expression, and timing.
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-purple-700">Session 3: Recording and Editing</h3>
              <ol className="list-decimal pl-8 space-y-2">
                <li>
                  <strong>Recording Demonstration (10 minutes):</strong> Demonstrate how to use the recording equipment
                  and basic techniques for clear audio.
                </li>
                <li>
                  <strong>Recording Time (30 minutes):</strong> Groups record their podcast episodes, with teacher
                  circulating to provide support.
                </li>
                <li>
                  <strong>Basic Editing (20 minutes):</strong> Introduce simple editing techniques (trimming, adding
                  intro/outro music) and allow groups to begin editing their recordings.
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-purple-700">Session 4: Finalization and Sharing</h3>
              <ol className="list-decimal pl-8 space-y-2">
                <li>
                  <strong>Finalize Editing (20 minutes):</strong> Groups complete the editing of their podcast episodes.
                </li>
                <li>
                  <strong>Listening Party (25 minutes):</strong> Class listens to each group's podcast and provides
                  positive feedback.
                </li>
                <li>
                  <strong>Reflection (15 minutes):</strong> Students complete reflection forms about what they learned
                  and how they could improve their podcasts in the future.
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
                <h3 className="font-semibold text-purple-700">Formative Assessment</h3>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Observation of group planning and collaboration</li>
                  <li>Review of planning templates and scripts</li>
                  <li>Feedback during practice sessions</li>
                  <li>Check-ins during the recording process</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-purple-700">Summative Assessment</h3>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>
                    Completed podcast episodes (assessed for content, organization, speaking clarity, and collaboration)
                  </li>
                  <li>Self and peer evaluations</li>
                  <li>Written reflections on the process and learning</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-purple-700">Assessment Criteria</h3>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Content accuracy and relevance</li>
                  <li>Organization and logical flow</li>
                  <li>Speaking clarity, expression, and pacing</li>
                  <li>Effective collaboration and role fulfillment</li>
                  <li>Technical quality of recording</li>
                  <li>Creativity and engagement</li>
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
                <h3 className="font-semibold text-purple-700">For Students Needing Additional Support</h3>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Provide more structured planning templates</li>
                  <li>Offer pre-written script sections that can be modified</li>
                  <li>Allow for shorter podcast episodes</li>
                  <li>Assign specific, manageable roles within groups</li>
                  <li>Provide additional practice time before recording</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-purple-700">For Students Needing Extension</h3>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Encourage more complex podcast formats (e.g., interviews, debates)</li>
                  <li>Add sound effects and music transitions</li>
                  <li>Create a series of connected podcast episodes</li>
                  <li>Research and implement more advanced editing techniques</li>
                  <li>Mentor other groups in technical aspects</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-purple-700">Cultural Relevance</h3>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Encourage topics related to local culture and community</li>
                  <li>Incorporate traditional storytelling techniques into podcast formats</li>
                  <li>Allow for code-switching between Standard English and Home Language where appropriate</li>
                  <li>Feature diverse voices in example podcasts</li>
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
              <h3 className="font-semibold text-purple-700 mb-2">Cross-Curricular Connections</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Social Studies:</strong> Create podcasts about local history, cultural traditions, or
                  community issues
                </li>
                <li>
                  <strong>Science:</strong> Develop "Science Explained" podcasts about natural phenomena or scientific
                  concepts
                </li>
                <li>
                  <strong>Mathematics:</strong> Record "Math Mysteries" podcasts explaining problem-solving strategies
                </li>
                <li>
                  <strong>Arts:</strong> Incorporate music, sound effects, and creative expression into podcast
                  production
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-purple-700 mb-2">Activity Variations</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Podcast Series:</strong> Extend the project to create multiple episodes on related topics
                </li>
                <li>
                  <strong>Interview Format:</strong> Students interview community members, teachers, or other students
                </li>
                <li>
                  <strong>News Show:</strong> Create a school news podcast with regular updates and features
                </li>
                <li>
                  <strong>Book Talk:</strong> Develop podcasts reviewing and discussing favorite books
                </li>
                <li>
                  <strong>Bilingual Podcasts:</strong> Create podcasts that incorporate both Standard English and Home
                  Language
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
