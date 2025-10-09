import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, BarChart, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function DataHandlingPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade2-subjects/mathematics">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 2 Mathematics
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-indigo-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-indigo-700 flex items-center">
            <BarChart className="mr-2 h-7 w-7 text-indigo-600" />
            Data Handling and Probability
          </h1>
          <p className="text-gray-700">
            In Grade 2, students develop their skills in collecting, organizing, representing, and interpreting data.
            They learn to create and analyze various types of graphs and begin to understand basic concepts of
            probability through everyday experiences.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Two Expectations for Data Handling and Probability
        </h3>

        <Tabs defaultValue="data">
          <TabsList className="grid w-full grid-cols-2 bg-indigo-100">
            <TabsTrigger value="data" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              Data Handling
            </TabsTrigger>
            <TabsTrigger
              value="probability"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              Probability
            </TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 1: Developing Statistical Literacy</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Recognize topics for investigation and formulate questions with no more than four option choices</li>
              <li>Collect, organize data with no more than two attributes</li>
              <li>Record and display data in tables as tallies and pictographs</li>
              <li>
                Identify the most frequent count, if any, for various data sets presented in concrete graphs,
                pictographs, bar graphs, and tables
              </li>
              <li>Explain what this measure indicates about the data</li>
              <li>
                Analyze different sets of data presented in various ways, including in logic diagrams, line plots, and
                bar graphs
              </li>
              <li>Ask and answer questions about the data and draw conclusions</li>
              <li>Make convincing arguments and informed decisions based on data</li>
            </ul>
          </TabsContent>

          <TabsContent value="probability" className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome 2: Understanding Probability</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Describe the likelihood that events will happen, and use that information to make predictions</li>
              <li>
                Use mathematical language, including the terms "impossible", "possible", and "certain", to describe the
                likelihood of complementary events happening
              </li>
              <li>Use that likelihood to make predictions and informed decisions</li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-indigo-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-indigo-50">
            <CardTitle className="text-indigo-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade Two, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Formulating Questions
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identify simple topics of collective interest for investigation</li>
                    <li>Match investigative topics to relevant questions</li>
                    <li>
                      Formulate questions that can be answered by gathering information about self, others, and their
                      environment
                    </li>
                    <li>Appreciate the need for the use of appropriate questions in data collection</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Collecting and Organizing Data
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>List questions of interest for investigation</li>
                    <li>
                      Gather and record simple sets of data about self and others through observation and simple
                      interviews
                    </li>
                    <li>Record data as a tally or as drawings (pictographs)</li>
                    <li>Use collected data to answer questions</li>
                    <li>
                      Make the connection that data collection is acquiring information to answer important questions
                    </li>
                    <li>Ask questions to collect data</li>
                    <li>Collect simple sets of data through observation and simple interview</li>
                    <li>Use number statements to record the collected data</li>
                    <li>Collect data using a variety of observation tools</li>
                    <li>Organize, display and communicate data that has been collected</li>
                    <li>Record data information on, bar graph, pictograph and tally chart</li>
                    <li>
                      Create different types of data presentations, including pictograph, and bar graphs to represent
                      data
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">Analyzing Data</AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Identify the most frequent count presented in any data sets (e.g., concrete graphs, pictographs,
                      bar graphs, and tables)
                    </li>
                    <li>Explain in their own words what the most frequent count indicates about the data</li>
                    <li>Collect, group and analyze data</li>
                    <li>Analyze data and make informed decisions using these data</li>
                    <li>Use data to make informed decisions about real life situations</li>
                    <li>Appreciate the importance of identifying the most frequent count of any given data</li>
                    <li>Identify the key elements of pictograph and bar graph</li>
                    <li>Analyze data presented in various ways by asking and answering questions about the data</li>
                    <li>Draw conclusions from the data by making observations and inferences</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">Probability</AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Describe the likelihood that events will happen, and use that information to make predictions
                    </li>
                    <li>
                      Use mathematical language, including the terms "impossible", "possible", and "certain", to
                      describe the likelihood of complementary events happening
                    </li>
                    <li>Use the likelihood that an event will happen to make predictions and informed decisions</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-blue-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-blue-700">Observations:</strong> Teacher observations during data collection,
                  organization, and analysis activities
                </li>
                <li>
                  <strong className="text-blue-700">Conversations:</strong> Student explanations of data collection
                  methods, interpretations of graphs, and predictions based on probability
                </li>
                <li>
                  <strong className="text-blue-700">Products:</strong> Student-created graphs, data collection sheets,
                  and written analyses of data
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <h4 className="font-semibold mb-2 text-blue-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for data collection and organization skills</li>
                  <li>Rubrics for evaluating student-created graphs and data presentations</li>
                  <li>Performance tasks involving collecting, organizing, and analyzing data</li>
                  <li>Exit tickets to assess understanding of probability concepts</li>
                  <li>Data journals for recording observations and analyses</li>
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
                  <AccordionTrigger>Formulating Questions</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Question Brainstorming:</strong> Engage students in brainstorming sessions to generate
                        questions about topics of interest.
                      </li>
                      <li>
                        <strong>Question Sorting:</strong> Provide students with a variety of questions and have them
                        sort them into categories (e.g., questions that can be answered with data, questions that
                        cannot).
                      </li>
                      <li>
                        <strong>Real-Life Connections:</strong> Connect question formulation to real-life situations
                        that are relevant to students' experiences.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Collecting and Organizing Data</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Data Collection Activities:</strong> Engage students in hands-on data collection
                        activities, such as surveys, observations, or experiments.
                      </li>
                      <li>
                        <strong>Tally Marks:</strong> Teach students how to use tally marks to record data efficiently.
                      </li>
                      <li>
                        <strong>Pictograph Creation:</strong> Guide students in creating pictographs to represent data,
                        starting with simple one-to-one correspondence before introducing scales.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Analyzing Data</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Graph Reading:</strong> Provide opportunities for students to read and interpret
                        different types of graphs, focusing on asking and answering questions about the data.
                      </li>
                      <li>
                        <strong>Most Frequent Count:</strong> Teach students how to identify the most frequent count
                        (mode) in a data set and discuss what it tells us about the data.
                      </li>
                      <li>
                        <strong>Data-Based Decision Making:</strong> Engage students in making decisions based on data,
                        such as choosing a class activity based on survey results.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Probability</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Probability Language:</strong> Introduce and reinforce probability language (impossible,
                        possible, certain) through games and activities.
                      </li>
                      <li>
                        <strong>Probability Experiments:</strong> Conduct simple probability experiments, such as
                        spinning spinners or rolling dice, to explore likelihood.
                      </li>
                      <li>
                        <strong>Prediction Activities:</strong> Engage students in making predictions based on
                        probability and then testing their predictions through experiments.
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
              <h3 className="font-semibold mb-2">For Teachers</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Graph paper and chart paper</li>
                <li>Manipulatives for data collection and organization</li>
                <li>Spinners, dice, and other probability tools</li>
                <li>Data collection templates and recording sheets</li>
                <li>OECS Grade 2 Mathematics Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Individual graph paper and recording sheets</li>
                <li>Data journals for recording observations and analyses</li>
                <li>Visual aids for probability concepts</li>
                <li>Manipulatives for creating graphs</li>
                <li>Simple probability tools for experiments</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Data is gathered information - especially facts or numbers- that can be used to find out things or to make
              decisions when examined. Data handling is the process of gathering, recording, and presenting the data or
              information in a way that is meaningful to others. Good questions are an integral part of data collection.
              As well, data collection provides a way to connect mathematics to other subject areas. The data collected
              can then be analysed to make data-driven decisions in the real world. Probability is an essential tool in
              applied mathematics and mathematical modelling. It is also an essential tool in statistics. A probability
              describes mathematically how likely it is that something will happen.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
