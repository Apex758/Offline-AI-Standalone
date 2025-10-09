import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Users, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function CivicParticipationPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade4-subjects/social-studies">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 4 Social Studies
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-100 to-violet-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-purple-700 flex items-center">
            <Users className="mr-2 h-7 w-7 text-purple-600" />
            Civic Participation
          </h1>
          <p className="text-gray-700">
            This strand includes communication technology and how it impacts our role in society. It explores factors
            that led to the development of the nation, including major political events that shaped the nation and
            helped develop the political system. Students learn about government systems, responsibilities, and
            purposes, and how this relates to local constituency representatives. The unit examines what role each
            person can play in being a responsible citizen.
          </p>
        </div>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Four Expectations for Civic Participation
        </h3>

        <Tabs defaultValue="communication">
          <TabsList className="grid w-full grid-cols-3 bg-purple-100">
            <TabsTrigger
              value="communication"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Communication & Transportation
            </TabsTrigger>
            <TabsTrigger
              value="nationhood"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Path to Nationhood
            </TabsTrigger>
            <TabsTrigger
              value="citizenship"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Democracy & Citizenship
            </TabsTrigger>
          </TabsList>

          <TabsContent value="communication" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Communication & Transportation</h4>
            <p className="mb-3">
              To determine that how we communicate with one another shapes our health, safety, and progress.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Identify examples of communication technology in the past and their uses</li>
              <li>Describe how communication technology has evolved over time</li>
              <li>
                Appreciate that improvements in technology have significantly impacted how people communicate with each
                other
              </li>
              <li>Identify the various forms of transportation past and present</li>
              <li>Discuss the challenges faced in local transportation and predict solutions to these issues</li>
              <li>
                Recognize the positive and negative impact of transportation on our economy, environment and health
              </li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-purple-100">
              <h5 className="font-medium text-purple-700">Focus Questions:</h5>
              <p>What changes in communication technologies have influenced our way of life the most?</p>
              <p>How has transportation technology evolved overtime?</p>
              <p>What are the reasons for the changes in transportation technology?</p>
              <p>How has transportation technology affected our way of life?</p>
            </div>
          </TabsContent>

          <TabsContent value="nationhood" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Path to Nationhood</h4>
            <p className="mb-3">To appreciate how our island(s) followed a unique path to nationhood.</p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>List some of the major events in the political evolution of your country-territory</li>
              <li>
                Show the sequence of political milestones on a timeline from colony to independence/semi-independence
              </li>
              <li>
                Appreciate the importance of patriotism and the role of national leaders in achieving political change
              </li>
              <li>Describe the type of government system in your country</li>
              <li>Investigate and outline the various purposes and responsibilities of your government</li>
              <li>
                Appreciate that the government system and structure in the country is influenced by the history of
                colonization
              </li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-purple-100">
              <h5 className="font-medium text-purple-700">Focus Questions:</h5>
              <p>What are the main political events that have help to shape a country/territory?</p>
              <p>What is the role of national leaders in achieving political change?</p>
              <p>What is the type of system used to govern one's country?</p>
              <p>What is the main purpose and responsibilities of the government?</p>
              <p>How has colonization impacted the country's government system and structure?</p>
            </div>
          </TabsContent>

          <TabsContent value="citizenship" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Democracy & Citizenship</h4>
            <p className="mb-3">To appreciate how our island(s) followed a unique path to nationhood.</p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Explain what democracy is and share some examples</li>
              <li>Demonstrate ways in which we can actively participate in our democracy</li>
              <li>Appreciate the value of democracy for protecting our individual rights and freedom</li>
              <li>Identify that there are political constituencies in our country</li>
              <li>Locate the boundaries of the political constituency to which you belong</li>
              <li>Appreciate the importance of these constituencies for ensuring local representation</li>
              <li>Identify key figures who have made significant contributions to our national development</li>
              <li>Develop criteria to justify determining who is a national hero/heroine</li>
              <li>Appreciate the contribution of key figures to our national development</li>
              <li>Explain our responsibilities to contribute to the development of the country</li>
              <li>Display proper respectful behavior towards others in the country</li>
              <li>Appreciate that everyone has a responsibility to help develop the country</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-purple-100">
              <h5 className="font-medium text-purple-700">Focus Questions:</h5>
              <p>What is democracy?</p>
              <p>How can we demonstrate our democracy?</p>
              <p>What can be done to protect our individual rights and freedom?</p>
              <p>What are political constituencies?</p>
              <p>To which constituency do you belong?</p>
              <p>Why do we have constituencies?</p>
              <p>Who do you think is a key figure or a national hero/heroine?</p>
              <p>How can a person be considered a national hero/heroine or a key figure?</p>
              <p>Should a country recognize people as national heroes/heroines or key figures?</p>
              <p>What is meant by developing the country?</p>
              <p>Who is responsible for developing the country?</p>
              <p>In what ways can you contribute to developing the country?</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-purple-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-purple-50">
            <CardTitle className="text-purple-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade Four, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Communication Technology
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify ways in which communication technology has evolved over time
                    </li>
                    <li>
                      <strong>Skills:</strong> Create a timeline of changes in communications technology
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate that improvements in technology have significantly impacted
                      how people communicate with each other
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Transportation Technology
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Compare current forms of transportation used in our country to those
                      used in the past
                    </li>
                    <li>
                      <strong>Skills:</strong> Investigate challenges in local transportation and predict possible
                      future solutions to the transportation issues
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate that efficient transportation has both positive and negative
                      implications for our economy, environment, and health
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Political Evolution
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> List some of the major events in the political evolution of your
                      country-territory
                    </li>
                    <li>
                      <strong>Skills:</strong> Show the sequence of political milestones on a timeline from colony to
                      independence/semi-independence
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the importance of patriotism and the role of national leaders
                      in achieving political change
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Government Systems
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Describe the type of government system in your country
                    </li>
                    <li>
                      <strong>Skills:</strong> Investigate and outline the various purposes and responsibilities of your
                      government
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate that the government system and structure in the country is
                      influenced by the history of colonization
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">Democracy</AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Explain what democracy is and share some examples
                    </li>
                    <li>
                      <strong>Skills:</strong> Demonstrate ways in which we can actively participate in our democracy
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the value of democracy for protecting our individual rights
                      and freedom
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Political Constituencies
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify that there are political constituencies in our country
                    </li>
                    <li>
                      <strong>Skills:</strong> Locate the boundaries of the political constituency to which you belong
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the importance of these constituencies for ensuring local
                      representation
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">National Heroes</AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify key figures who have made significant contributions to our
                      national development
                    </li>
                    <li>
                      <strong>Skills:</strong> Develop criteria to justify determining who is a national hero/heroine
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the contribution of key figures to our national development
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="border border-purple-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                  Responsible Citizenship
                </AccordionTrigger>
                <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Explain our responsibilities to contribute to the development of the
                      country
                    </li>
                    <li>
                      <strong>Skills:</strong> Display proper respectful behavior towards others in the country
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate that everyone has a responsibility to help develop the country
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-violet-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-violet-50">
              <CardTitle className="text-violet-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-violet-700">Observations:</strong> Observe students during role plays,
                  demonstrations, group work, and presentations
                </li>
                <li>
                  <strong className="text-violet-700">Conversations:</strong> Class discussions, think-pair-share
                  activities, debates, interviews
                </li>
                <li>
                  <strong className="text-violet-700">Products:</strong> Timelines, posters, journals, maps,
                  presentations, letters, profiles of national heroes
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-100">
                <h4 className="font-semibold mb-2 text-violet-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for role plays and group activities</li>
                  <li>Rubrics for evaluating presentations and written work</li>
                  <li>Self-assessment forms for participation in democratic activities</li>
                  <li>Peer assessment for collaborative projects</li>
                  <li>Exit slips for checking understanding of key concepts</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inclusive Learning Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="strategy-1">
                  <AccordionTrigger>Communication & Transportation Technology</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Concept Building:</strong> Students create paper cup phones to understand communication
                        technology
                      </li>
                      <li>
                        <strong>Guided Discussion:</strong> Students discuss scenarios about communication with distant
                        family members
                      </li>
                      <li>
                        <strong>Brainstorming:</strong> Students list communication technologies of ancient times and
                        present day
                      </li>
                      <li>
                        <strong>Mini Research:</strong> Students research the evolution of communication technology
                      </li>
                      <li>
                        <strong>Sequencing Activity:</strong> Students arrange communication technologies in order of
                        invention
                      </li>
                      <li>
                        <strong>Timeline Creation:</strong> Students create timelines of key advancements in
                        communication technology
                      </li>
                      <li>
                        <strong>Dramatization:</strong> Students role-play communication methods from different time
                        periods
                      </li>
                      <li>
                        <strong>Jigsaw Puzzle:</strong> Students complete puzzles depicting different forms of
                        transportation
                      </li>
                      <li>
                        <strong>Think-Pair-Share:</strong> Students identify different forms of transportation from
                        clues
                      </li>
                      <li>
                        <strong>Storytelling:</strong> Students listen to stories about transportation evolution
                      </li>
                      <li>
                        <strong>Guided Research:</strong> Students collect data on transportation challenges through
                        interviews
                      </li>
                      <li>
                        <strong>Guest Speaker:</strong> Transportation professionals discuss challenges and benefits
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Political Evolution & Government</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Class Discussion:</strong> Students view slideshows of various political events
                      </li>
                      <li>
                        <strong>Timeline Creation:</strong> Students record political events on a timeline
                      </li>
                      <li>
                        <strong>Group Work:</strong> Students research major political events and create timeline
                        entries
                      </li>
                      <li>
                        <strong>Role Play:</strong> Students present as though in parliament or before a student body
                      </li>
                      <li>
                        <strong>Artwork:</strong> Students design scrolls to document major events
                      </li>
                      <li>
                        <strong>Music Analysis:</strong> Students identify songs about political events
                      </li>
                      <li>
                        <strong>Decision-Making Table:</strong> Students explore different decision-making methods
                      </li>
                      <li>
                        <strong>Poster Design:</strong> Students create posters showing government systems
                      </li>
                      <li>
                        <strong>Debate:</strong> Students debate government responsibilities
                      </li>
                      <li>
                        <strong>Video Creation:</strong> Students make videos about government purposes
                      </li>
                      <li>
                        <strong>Cause and Effect Chart:</strong> Students analyze colonization's influence on government
                      </li>
                      <li>
                        <strong>Poem Creation:</strong> Students write poems about colonization's impact
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Democracy & Political Constituencies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Role-Play:</strong> Students role-play different decision-making scenarios
                      </li>
                      <li>
                        <strong>Group Discussion:</strong> Students read and discuss democracy concepts
                      </li>
                      <li>
                        <strong>Group Work:</strong> Students form political parties and run mock campaigns
                      </li>
                      <li>
                        <strong>Election Simulation:</strong> Students vote for political parties
                      </li>
                      <li>
                        <strong>Journal Writing:</strong> Students reflect on democratic processes
                      </li>
                      <li>
                        <strong>Poster Creation:</strong> Students create posters about rights and freedoms
                      </li>
                      <li>
                        <strong>Political Representative Visit:</strong> Local representatives discuss their roles
                      </li>
                      <li>
                        <strong>Election Poster Analysis:</strong> Students examine posters from past elections
                      </li>
                      <li>
                        <strong>Map Work:</strong> Students label constituencies on maps
                      </li>
                      <li>
                        <strong>Boundary Identification:</strong> Students identify villages bordering their
                        constituency
                      </li>
                      <li>
                        <strong>Discussion:</strong> Students discuss the importance of local representation
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>National Heroes & Responsible Citizenship</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Introduction Activity:</strong> Students share about people they admire
                      </li>
                      <li>
                        <strong>Slideshow Presentation:</strong> Students view and discuss key national figures
                      </li>
                      <li>
                        <strong>Definition Development:</strong> Students define what makes a national hero
                      </li>
                      <li>
                        <strong>Investigation:</strong> Students compare superhero qualities to national hero qualities
                      </li>
                      <li>
                        <strong>Group Research:</strong> Students study biographies of national heroes
                      </li>
                      <li>
                        <strong>Criteria Compilation:</strong> Students develop criteria for national heroes
                      </li>
                      <li>
                        <strong>Game Format:</strong> Students determine who qualifies as a national hero
                      </li>
                      <li>
                        <strong>Oral Presentations:</strong> Students present on potential national heroes
                      </li>
                      <li>
                        <strong>Field Trips:</strong> Students visit historical sites related to national heroes
                      </li>
                      <li>
                        <strong>Creative Projects:</strong> Students express appreciation through art, poems, or stories
                      </li>
                      <li>
                        <strong>Community Service:</strong> Students engage in helping activities
                      </li>
                      <li>
                        <strong>Pledge Creation:</strong> Students create class pledges about responsibility
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Additional Resources and Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Multimedia Resources</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Videos on communication technology evolution</li>
                <li>Documentaries on transportation development</li>
                <li>Presentations on political history</li>
                <li>Videos about government systems and democracy</li>
                <li>Profiles of national heroes</li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=d0ySC2tzlZI"
                    className="text-purple-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Forms of Transportation
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.tvokids.com/school-age/tvok-news-big-picture/videos/tvok-news-what-democracy"
                    className="text-purple-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    What is Democracy?
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=U0mpJ3rv64U"
                    className="text-purple-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    National Heroes Video
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Physical Materials</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Paper cups and string for communication demonstrations</li>
                <li>Timeline templates and materials</li>
                <li>Maps of constituencies</li>
                <li>Election posters and materials</li>
                <li>Art supplies for creative projects</li>
                <li>Biographies of national heroes</li>
                <li>Government structure charts</li>
                <li>Democracy simulation materials</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p className="mb-2">
              Communication technology refers to tools and symbols used to send and receive messages or information,
              including telephones, letters, radios, computers, the internet, speech, signs, and sign language.
              Traditional communication has evolved to include more advanced methods such as telegraphs, telephones,
              smartphones, and social media platforms.
            </p>
            <p className="mb-2">
              Transportation refers to the movement of people, goods, or animals from one place to another. In the
              Caribbean, transportation has evolved from traditional forms such as canoes and animals to modern forms
              like cars, airplanes, cruise ships, and drones. This evolution has brought both positive impacts and
              negative impacts like higher levels of air pollution, climate change, health risks, increased costs,
              deforestation, and habitat destruction.
            </p>
            <p className="mb-2">
              Political events shaped the future of our countries. These events socialize and educate citizens and
              involve the creation of political parties, accomplishments that shaped the country's future, election
              processes, famous speeches, and contributions by candidates. Major political events include Independence
              Day, Emancipation Day, Election Day, naming/renaming to mark significant accomplishments, Labour Day, and
              conflicts arising from political influence.
            </p>
            <p className="mb-2">
              Government systems include Parliamentary Systems, Constitutional Monarchies, Republics, and Dependent
              Territories. The structure typically includes executive, legislative, and judiciary branches. The purpose
              and responsibility of government include making and maintaining law and order, protecting citizens, and
              providing public services like health, education, and infrastructure.
            </p>
            <p>
              Democracy means that governments are accountable to the people and can be voted out of power. In
              democracies, people have rights and freedoms protected by laws, such as freedom of speech and the right to
              worship. A national hero is a person admired and acknowledged for their courage, outstanding achievements,
              and noble qualities, who has made significant, positive contributions to the growth and development of
              society.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
