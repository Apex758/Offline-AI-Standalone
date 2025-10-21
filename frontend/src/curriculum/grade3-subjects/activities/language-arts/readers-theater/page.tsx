import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, MessageSquare, BookOpen, Users, Mic, FileText } from "lucide-react"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

export default function ReadersTheaterPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600">
            Reader's Theater
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            An engaging performance-based literacy approach that enhances reading fluency, expression, and comprehension
            through dramatic oral reading.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-600" />
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Reader's Theater is a performance-based reading activity where students read aloud from scripts,
                focusing on vocal expression, pacing, and character interpretation without the need for memorization,
                costumes, or props. This approach transforms reading practice into an engaging, purposeful activity that
                builds fluency, comprehension, and confidence while creating an authentic reason for repeated reading.
              </p>

              <div className="relative w-full h-64 mb-6 rounded-md overflow-hidden">
                <img src="./readers-theater-children.png" alt="Reader" className="w-full h-full object-cover" />
              </div>

              <h3 className="text-lg font-semibold mb-2">Learning Outcomes</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Develop reading fluency through purposeful repeated reading</li>
                <li>Enhance expression, phrasing, and prosody in oral reading</li>
                <li>Build comprehension through character analysis and script exploration</li>
                <li>Increase reading confidence and motivation</li>
                <li>Strengthen listening skills and collaborative abilities</li>
                <li>Develop an understanding of dialogue and text structure</li>
                <li>Improve public speaking skills and performance confidence</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Curriculum Connections</h3>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>ELO 1:</strong> Learners will explore, use, and critically apply oral language for pleasure,
                  personal growth, to foster relationships and to develop an appreciation and celebration of culture and
                  oral languages.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    SCO 1.12: Listen attentively and build on others' ideas with increasing confidence in group and
                    class discussions and individual presentations
                  </li>
                  <li>
                    SCO 1.22: Participate in the sharing of culturally relevant songs, raps, drama, and poetry with
                    fluency, rhythm, and pace
                  </li>
                  <li>
                    SCO 1.23: Continue to develop understanding of how and when to adjust volume, projection, facial
                    expressions, gestures, and tone of voice to the speaking occasion
                  </li>
                </ul>
              </div>
              <div className="mb-4">
                <p className="mb-2">
                  <strong>ELO 3:</strong> Learners will interact meaningfully with a variety of genres using background
                  knowledge, comprehension strategies, vocabulary, and graphophonic cues.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>SCO 3.18: Apply knowledge of how reading fluency impacts understanding</li>
                  <li>
                    SCO 3.19: Participate in shared reading opportunities to enhance fluency, guide intonation, convey
                    mood, and demonstrate expression
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-600" />
                Implementation Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-amber-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      1
                    </span>
                    Introduction to Reader's Theater (Day 1, 30 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Introduce the concept of Reader's Theater using a simple teacher demonstration</li>
                    <li>Compare flat reading to expressive, character-based reading</li>
                    <li>Discuss how voice, pacing, and expression affect meaning</li>
                    <li>Show a short video clip of a Reader's Theater performance if available</li>
                    <li>Establish performance expectations and audience etiquette</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-amber-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      2
                    </span>
                    Script Selection and Preparation (Day 1-2)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Select scripts appropriate for grade level and student interests</li>
                    <li>Prepare copies for each student with clear character designations</li>
                    <li>Create mixed-ability performance groups of 3-6 students</li>
                    <li>Assign roles based on reading levels (longer roles for stronger readers, etc.)</li>
                    <li>Allow students to highlight or mark their parts</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-amber-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      3
                    </span>
                    Script Exploration and First Reading (Day 2, 30 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Guide a whole-class reading of the script to build comprehension</li>
                    <li>Discuss characters, setting, and plot to ensure understanding</li>
                    <li>Model expressive reading for different character types</li>
                    <li>Teach specific fluency skills: pacing, pausing at punctuation, intonation</li>
                    <li>Allow groups to do a first read-through, focusing on word accuracy</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-amber-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      4
                    </span>
                    Practice Sessions (Days 3-4, 20-30 minutes daily)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>
                      Provide mini-lessons on specific performance skills (voice volume, character voices, pacing)
                    </li>
                    <li>Guide groups in practiced readings with increasing expression</li>
                    <li>Encourage peer feedback focused on specific aspects (clarity, expression, pace)</li>
                    <li>Circulate to provide targeted guidance and coaching</li>
                    <li>Allow students to practice with partners, focusing on expression</li>
                    <li>Provide time for independent practice and self-evaluation</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-amber-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      5
                    </span>
                    Performance Preparation (Day 5, 30 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Arrange classroom seating for performances (semi-circle, rows, etc.)</li>
                    <li>Establish performer positions and transitions between groups</li>
                    <li>Practice entering/exiting the performance area</li>
                    <li>Conduct final rehearsals with full expression and volume</li>
                    <li>Review audience etiquette and positive feedback guidelines</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-amber-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      6
                    </span>
                    Performance Day (Day 5 or 6, 30-45 minutes)
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Welcome audience members (other classes, parents, etc. if invited)</li>
                    <li>Introduce the activity and each performance group</li>
                    <li>Guide transitions between performances</li>
                    <li>Facilitate brief, positive audience feedback after each performance</li>
                    <li>Celebrate all performers with applause and specific praise</li>
                    <li>Conduct a whole-class reflection on the experience</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <span className="flex items-center justify-center bg-amber-600 text-white rounded-full w-6 h-6 mr-2 text-sm">
                      7
                    </span>
                    Extension Activities
                  </h3>
                  <ul className="list-disc pl-8 space-y-1">
                    <li>Record performances (audio or video) for student self-assessment</li>
                    <li>Adapt scripts from picture books or chapter books as a class activity</li>
                    <li>Create original scripts based on curriculum topics</li>
                    <li>Perform for younger grades or community groups</li>
                    <li>Add simple props, sound effects, or movement to enhance performances</li>
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
                <Mic className="h-5 w-5 text-amber-600" />
                Performance Skills Focus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                  <h3 className="text-md font-semibold mb-1 text-amber-700">Volume</h3>
                  <p className="text-sm">
                    Speaking loud enough for the audience to hear clearly without shouting. Teach students to project
                    their voices by speaking from their diaphragm rather than their throat.
                  </p>
                </div>

                <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                  <h3 className="text-md font-semibold mb-1 text-amber-700">Pacing</h3>
                  <p className="text-sm">
                    Reading at an appropriate speed – not too fast or too slow. Teach students to pause at punctuation
                    marks and vary their speed to match the mood of the text.
                  </p>
                </div>

                <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                  <h3 className="text-md font-semibold mb-1 text-amber-700">Expression</h3>
                  <p className="text-sm">
                    Using voice tone and inflection to convey character emotions and story mood. Practice making voices
                    sound happy, sad, scared, excited, etc. based on the context.
                  </p>
                </div>

                <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                  <h3 className="text-md font-semibold mb-1 text-amber-700">Character Voices</h3>
                  <p className="text-sm">
                    Developing distinct voices for different characters. Encourage subtle differences rather than
                    exaggerated voices that might be difficult to maintain.
                  </p>
                </div>

                <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                  <h3 className="text-md font-semibold mb-1 text-amber-700">Clarity</h3>
                  <p className="text-sm">
                    Pronouncing words clearly and enunciating properly. Practice challenging words and encourage
                    articulation exercises as warm-ups.
                  </p>
                </div>

                <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                  <h3 className="text-md font-semibold mb-1 text-amber-700">Physical Presence</h3>
                  <p className="text-sm">
                    Standing confidently, making appropriate eye contact, and using minimal gestures when helpful. Teach
                    students to look up from their scripts periodically.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-600" />
                Differentiation Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-semibold mb-1 text-amber-700">For Students Who Excel</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Assign more challenging roles with complex dialogue or narration</li>
                    <li>Encourage advanced expressiveness and character development</li>
                    <li>Offer opportunities to direct peer rehearsals or adapt scripts</li>
                    <li>Allow creation of original scripts based on curriculum topics</li>
                    <li>Introduce more advanced performance techniques like dialects or dramatic pauses</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-amber-700">For Students Who Need Support</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Pre-teach vocabulary and difficult phrases before group practice</li>
                    <li>Assign shorter roles with repeated phrases or paired reading parts</li>
                    <li>Provide highlighted scripts with color-coded punctuation cues</li>
                    <li>Record practice sessions for additional home rehearsal</li>
                    <li>Use choral reading for sections where students feel less confident</li>
                    <li>Position struggling readers between confident readers for support</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-1 text-amber-700">Language Considerations</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Select scripts that include culturally diverse characters and settings</li>
                    <li>Create bilingual scripts that incorporate Home Language phrases where appropriate</li>
                    <li>Discuss pronunciation variations across dialects with respect and appreciation</li>
                    <li>Allow students to translate small portions into Home Language when relevant</li>
                    <li>Respect linguistic diversity in character voice development</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-amber-600" />
                Script Resources and Ideas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Where to Find Scripts</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Adapt folktales, fairy tales, and fables from the curriculum</li>
                <li>Convert portions of picture books into reader's theater format</li>
                <li>Find free scripts online from educational websites</li>
                <li>Create original scripts from curriculum content</li>
                <li>Adapt traditional Caribbean stories and local folk tales</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Script Characteristics for Grade 3</h3>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Multiple characters with varied line lengths</li>
                <li>Clear narrative structure with beginning, middle, and end</li>
                <li>Opportunities for expression and character development</li>
                <li>Appropriate reading level with some challenging vocabulary</li>
                <li>5-10 minute performance length</li>
                <li>Cultural relevance to student experiences</li>
              </ul>

              <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                <h3 className="text-lg font-semibold mb-2 text-amber-700">Assessment Ideas</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Fluency rubrics focusing on pace, expression, and accuracy</li>
                  <li>Self-assessment forms for students to reflect on their performance</li>
                  <li>Audio recordings to track improvement over time</li>
                  <li>Observational notes during rehearsals and performances</li>
                  <li>Peer feedback using structured response forms</li>
                  <li>Comprehension checks to ensure understanding of the script content</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-xl shadow-md border border-amber-200 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-amber-800">Cultural Connections and Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-amber-700">Cultural Relevance</h3>
            <p className="mb-3">
              Reader's Theater provides an excellent opportunity to showcase and celebrate the rich oral storytelling
              traditions of the Caribbean. Adapting local folktales, calypso narratives, and cultural stories preserves
              heritage while developing literacy skills.
            </p>
            <p>
              Consider using scripts that feature local settings, expressions, and cultural references. When
              appropriate, incorporate words and phrases from Home Languages to create authentic, culturally responsive
              performances that honor linguistic diversity.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-amber-700">Beyond Fluency: Additional Benefits</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Classroom Community:</strong> Creates shared experiences and mutual support
              </li>
              <li>
                <strong>Character Education:</strong> Develops empathy through character perspective-taking
              </li>
              <li>
                <strong>Language Development:</strong> Enhances vocabulary in meaningful contexts
              </li>
              <li>
                <strong>Performance Confidence:</strong> Builds public speaking skills in a supportive setting
              </li>
              <li>
                <strong>Cross-Curricular Connections:</strong> Can incorporate content from social studies, science, and
                more
              </li>
              <li>
                <strong>Inclusive Participation:</strong> Allows all students to participate successfully regardless of
                reading level
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Link to="/curriculum/grade3-subjects/activities/language-arts/authors-workshop">
          <Button variant="outline" className="mr-4">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous Activity
          </Button>
        </Link>
        <Link to="/curriculum/grade3-subjects/activities/language-arts/vocabulary-detective">
          <Button className="bg-amber-600 hover:bg-amber-700">Next Activity: Vocabulary Detective</Button>
        </Link>
      </div>
    </div>
  )
}
