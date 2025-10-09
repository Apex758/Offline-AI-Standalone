import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Clock, Users, Target, CheckSquare, Lightbulb } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { FallbackImage } from "@/components/fallback-image"

export default function DebateClubPage() {
  return (
    <div className="container mx-auto py-8">
      
      <Link href="/curriculum/grade4-subjects/activities/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Language Arts Activities
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-purple-700">Debate Club</h1>
          <p className="text-gray-700">
            Students research, prepare, and participate in structured debates on age-appropriate topics, developing
            persuasive speaking, critical listening, and logical reasoning skills while learning to respectfully engage
            with different viewpoints.
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
                Debate Club introduces Grade 4 students to the fundamentals of formal debate in an engaging, supportive
                environment. Students learn to research topics, organize arguments, use persuasive language, and respond
                respectfully to opposing viewpoints. Through structured debate activities, students develop critical
                thinking, public speaking confidence, and active listening skills while exploring topics relevant to
                their lives and curriculum.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-purple-600" />
                  <span>
                    <strong>Duration:</strong> 2-3 sessions per debate topic (45-60 minutes each)
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-600" />
                  <span>
                    <strong>Group Size:</strong> Whole class, divided into debate teams
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <Target className="h-5 w-5 mr-2 text-purple-600" />
                  <strong>Learning Objectives:</strong>
                </div>
                <ul className="list-disc pl-8 space-y-1">
                  <li>Develop persuasive speaking techniques and confidence in public speaking</li>
                  <li>Practice critical listening and note-taking during others' presentations</li>
                  <li>Learn to respond respectfully to opposing viewpoints</li>
                  <li>Research and organize information to support arguments</li>
                  <li>Distinguish between facts and opinions</li>
                  <li>Develop logical reasoning and evidence-based argumentation</li>
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
                    <strong>Listening & Speaking:</strong> Listen attentively and build on others' ideas in discussions
                  </li>
                  <li>
                    <strong>Reading & Viewing:</strong> Use different sources to find information for research purposes
                  </li>
                  <li>
                    <strong>Writing & Representing:</strong> Organize ideas and information to write for an intended
                    purpose and audience
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <Lightbulb className="h-5 w-5 mr-2 text-purple-600" />
                  <strong>Materials Needed:</strong>
                </div>
                <ul className="list-disc pl-8 space-y-1">
                  <li>Debate topic cards with age-appropriate questions</li>
                  <li>Research materials (books, articles, approved websites)</li>
                  <li>Argument planning templates</li>
                  <li>Note-taking sheets for listeners</li>
                  <li>Timer or stopwatch</li>
                  <li>Visual aids for debate structure and rules</li>
                  <li>Feedback forms for peer and self-assessment</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
              <FallbackImage
                src="/placeholder-12wti.png"
                alt="Students participating in a classroom debate"
                fallbackSrc="/placeholder.svg?height=200&width=400&query=debate+club"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-600 italic">
                Students engage in a structured debate, practicing persuasive speaking and respectful listening skills.
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
                  <strong className="text-purple-700">Start Simple:</strong> Begin with straightforward, familiar topics
                  that have clear opposing viewpoints.
                </li>
                <li>
                  <strong className="text-purple-700">Create Safety:</strong> Establish clear guidelines for respectful
                  communication and separate ideas from individuals.
                </li>
                <li>
                  <strong className="text-purple-700">Scaffold Arguments:</strong> Provide templates and sentence
                  starters to help students structure their arguments.
                </li>
                <li>
                  <strong className="text-purple-700">Assign Positions:</strong> Have students debate positions they
                  might not personally agree with to develop perspective-taking.
                </li>
                <li>
                  <strong className="text-purple-700">Celebrate Effort:</strong> Recognize courage, improvement, and
                  respectful engagement rather than just "winning" debates.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Debate Format for Grade 4</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This simplified debate format is designed for Grade 4 students, providing structure while being accessible
            for beginning debaters. Each side has equal time to present their arguments and respond to the opposing
            team.
          </p>

          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-700 mb-2">Opening Statements (2 minutes each side)</h3>
              <p>
                Each team presents their position on the topic, explaining their main arguments and why they believe
                their side is correct.
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-700 mb-2">Supporting Arguments (3 minutes each side)</h3>
              <p>
                Teams provide evidence, examples, and reasons to support their position. Each team member should
                contribute at least one point.
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-700 mb-2">Rebuttal Preparation (2 minutes)</h3>
              <p>Teams work together to prepare responses to the opposing team's arguments.</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-700 mb-2">Rebuttals (2 minutes each side)</h3>
              <p>
                Teams respond to the opposing arguments, explaining why they disagree or why their position is stronger.
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-700 mb-2">Closing Statements (1 minute each side)</h3>
              <p>
                Teams summarize their position and main points, explaining why the audience should agree with their
                side.
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-700 mb-2">Audience Questions (5 minutes)</h3>
              <p>
                Audience members (other students) ask questions to either team, and teams respond briefly to clarify
                their positions.
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-700 mb-2">Reflection (5 minutes)</h3>
              <p>
                All participants discuss what they learned from the debate, regardless of which side they were on or
                which arguments they found most convincing.
              </p>
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
              <h3 className="text-lg font-semibold mb-2 text-purple-700">Session 1: Introduction to Debate</h3>
              <ol className="list-decimal pl-8 space-y-2">
                <li>
                  <strong>Introduction (10 minutes):</strong> Explain what a debate is and why it's valuable. Show a
                  short video clip of an age-appropriate debate or model a mini-debate with another teacher.
                </li>
                <li>
                  <strong>Debate Rules and Format (15 minutes):</strong> Introduce the simplified debate format and
                  establish ground rules for respectful communication.
                </li>
                <li>
                  <strong>Topic Selection (10 minutes):</strong> Present 2-3 age-appropriate debate topics and have the
                  class vote on which one to debate first.
                </li>
                <li>
                  <strong>Team Formation (10 minutes):</strong> Divide the class into teams, assigning positions (for or
                  against) regardless of personal opinions.
                </li>
                <li>
                  <strong>Initial Brainstorming (15 minutes):</strong> Teams begin brainstorming arguments for their
                  assigned position using a graphic organizer.
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-purple-700">Session 2: Research and Preparation</h3>
              <ol className="list-decimal pl-8 space-y-2">
                <li>
                  <strong>Research Time (20 minutes):</strong> Teams use classroom resources to find facts and
                  information that support their position.
                </li>
                <li>
                  <strong>Argument Development (15 minutes):</strong> Teams organize their arguments using the provided
                  templates, deciding which points are strongest.
                </li>
                <li>
                  <strong>Role Assignment (10 minutes):</strong> Teams decide who will present each part of the debate
                  (opening statement, specific arguments, rebuttal, closing).
                </li>
                <li>
                  <strong>Practice Time (15 minutes):</strong> Teams practice delivering their arguments, giving each
                  other feedback on clarity and persuasiveness.
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-purple-700">Session 3: Debate Day</h3>
              <ol className="list-decimal pl-8 space-y-2">
                <li>
                  <strong>Setup (5 minutes):</strong> Arrange the classroom for the debate, with teams facing each other
                  and the audience in between or around them.
                </li>
                <li>
                  <strong>Review Rules (5 minutes):</strong> Remind everyone of the debate format and expectations for
                  respectful behavior.
                </li>
                <li>
                  <strong>Conduct Debate (25-30 minutes):</strong> Facilitate the debate following the format outlined
                  above, keeping strict time limits.
                </li>
                <li>
                  <strong>Audience Participation (10 minutes):</strong> Non-debating students take notes during the
                  debate and prepare questions for the question period.
                </li>
                <li>
                  <strong>Reflection (10 minutes):</strong> Lead a whole-class discussion about what was learned from
                  the debate, focusing on content and skills rather than "winners."
                </li>
                <li>
                  <strong>Self-Assessment (5 minutes):</strong> Students complete a simple self-assessment form about
                  their participation and what they would improve next time.
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
                  <li>Observation of team preparation and collaboration</li>
                  <li>Review of research notes and argument planning templates</li>
                  <li>Feedback during practice sessions</li>
                  <li>Monitoring of respectful communication during the debate</li>
                  <li>Analysis of questions asked by the audience</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-purple-700">Summative Assessment</h3>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Debate performance rubric assessing speaking skills, argument quality, and teamwork</li>
                  <li>Written reflection on the debate experience</li>
                  <li>Research notes and argument organization</li>
                  <li>Peer and self-evaluation forms</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-purple-700">Assessment Criteria</h3>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Quality and organization of arguments</li>
                  <li>Use of evidence and examples to support claims</li>
                  <li>Speaking clarity, volume, and expression</li>
                  <li>Listening and responding to opposing arguments</li>
                  <li>Respectful communication and teamwork</li>
                  <li>Preparation and research effort</li>
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
                  <li>Provide sentence starters for different parts of the debate</li>
                  <li>Allow for written notes or scripts during the debate</li>
                  <li>Assign specific, manageable roles within the team</li>
                  <li>Pre-teach key vocabulary related to the debate topic</li>
                  <li>Provide simplified research materials with highlighted key points</li>
                  <li>Allow for shorter speaking times or partner presentations</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-purple-700">For Students Needing Extension</h3>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Encourage research from multiple sources with more complex information</li>
                  <li>Assign leadership roles in organizing the team's approach</li>
                  <li>Challenge students to anticipate and prepare for counter-arguments</li>
                  <li>Introduce more complex debate formats with additional components</li>
                  <li>Encourage the use of rhetorical devices and persuasive techniques</li>
                  <li>Assign more challenging debate topics with nuanced positions</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-purple-700">Cultural Relevance</h3>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Include debate topics relevant to local community issues and interests</li>
                  <li>Acknowledge and value different cultural perspectives on debate topics</li>
                  <li>Recognize various cultural styles of argumentation and persuasion</li>
                  <li>Allow for code-switching between Standard English and Home Language where appropriate</li>
                  <li>Connect to traditional forms of community discussion and decision-making</li>
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
                  <strong>Social Studies:</strong> Debate historical decisions, community issues, or environmental
                  policies
                </li>
                <li>
                  <strong>Science:</strong> Debate scientific topics like conservation efforts or technology use
                </li>
                <li>
                  <strong>Mathematics:</strong> Debate different problem-solving approaches or real-world applications
                  of math
                </li>
                <li>
                  <strong>Health:</strong> Debate topics related to healthy habits, screen time, or food choices
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-purple-700 mb-2">Activity Variations</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Four Corners Debate:</strong> Students move to different corners of the room representing
                  strongly agree, somewhat agree, somewhat disagree, or strongly disagree
                </li>
                <li>
                  <strong>Fishbowl Debate:</strong> A small group debates while others observe and take notes, then
                  switch roles
                </li>
                <li>
                  <strong>Role-Play Debate:</strong> Students debate from the perspective of different characters or
                  historical figures
                </li>
                <li>
                  <strong>Progressive Debate:</strong> Students begin on one side but must switch to the opposing side
                  halfway through
                </li>
                <li>
                  <strong>Mini-Debates:</strong> Several short debates on simple topics in a single session to build
                  confidence
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 bg-purple-50 p-6 rounded-lg border border-purple-200">
        <h2 className="text-xl font-bold mb-4 text-purple-700">Suggested Debate Topics for Grade 4</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-purple-700 mb-2">School and Education</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Should students have homework every day?</li>
              <li>Should school uniforms be required?</li>
              <li>Is it better to have longer school days but shorter school weeks?</li>
              <li>Should students be allowed to use tablets/computers for all schoolwork?</li>
              <li>Should recess time be increased?</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-purple-700 mb-2">Community and Environment</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Should plastic bags be banned in our community?</li>
              <li>Should children be required to help with community service?</li>
              <li>Is tourism good or bad for our local environment?</li>
              <li>Should there be more parks instead of shopping centers?</li>
              <li>Should our school grow a garden to provide food for lunches?</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-purple-700 mb-2">Technology and Media</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Should children have limits on screen time?</li>
              <li>Are e-books better than paper books?</li>
              <li>Should children under 13 be allowed to use social media?</li>
              <li>Is it better to play sports outside or video games inside?</li>
              <li>Should all students learn computer coding?</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-purple-700 mb-2">Ethics and Values</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Is it ever okay to tell a lie?</li>
              <li>Should children be paid for doing chores at home?</li>
              <li>Is it better to save money or spend it on things you enjoy?</li>
              <li>Should all children be required to learn a second language?</li>
              <li>Is it more important to be kind or to be honest?</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
