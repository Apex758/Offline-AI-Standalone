import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, BarChart3, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function DataProbabilityPage() {
  return (
    <div className="container mx-auto py-8">
      
      <Link href="/curriculum/grade3-subjects/mathematics">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 3 Mathematics
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-indigo-100 to-blue-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-indigo-700 flex items-center">
            <BarChart3 className="mr-2 h-7 w-7 text-indigo-600" />
            Data Handling & Probability
          </h1>
          <p className="text-gray-700">
            In Grade 3, students develop their ability to collect, organize, display, and interpret data, as well as
            understand basic probability concepts. They learn to formulate questions, gather relevant information,
            create various representations of data, and make predictions based on data and probability experiments.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Three Expectations for Data Handling & Probability
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
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 1: Understanding Data Collection, Organization, and Representation
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Formulate questions for data collection and determine appropriate methods</li>
              <li>Collect and organize data using tally charts and frequency tables</li>
              <li>Create pictographs and bar graphs with appropriate scales and labels</li>
              <li>Construct line plots to display measurement data</li>
              <li>Read and interpret data from various representations</li>
              <li>Find the mode and median of a data set</li>
              <li>Draw conclusions and make predictions based on data</li>
            </ul>
          </TabsContent>

          <TabsContent value="probability" className="p-4 border rounded-md mt-2 bg-indigo-50 border-indigo-200">
            <h4 className="font-semibold mb-2">
              Essential Learning Outcome 2: Understanding Probability Concepts and Applications
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                Use appropriate vocabulary to describe the likelihood of events (certain, likely, unlikely, impossible)
              </li>
              <li>Conduct simple probability experiments and record outcomes</li>
              <li>Express the probability of an event as a fraction</li>
              <li>Make predictions based on experimental probability</li>
              <li>Compare experimental results with theoretical probability</li>
              <li>Solve problems involving probability</li>
              <li>Understand the concept of fairness in games and activities</li>
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
            <CardDescription>By the end of Grade Three, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Data Collection and Organization
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Formulate questions that can be addressed with data</li>
                    <li>Collect data through surveys and experiments</li>
                    <li>Organize data using tally charts and frequency tables</li>
                    <li>Sort and classify objects based on multiple attributes</li>
                    <li>Record data using appropriate methods and tools</li>
                    <li>Understand the importance of accurate data collection</li>
                    <li>Identify appropriate sources of data for specific questions</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Data Representation and Analysis
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Create pictographs with appropriate scales, labels, and titles</li>
                    <li>Construct bar graphs with appropriate scales, labels, and titles</li>
                    <li>Create line plots to display measurement data</li>
                    <li>Read and interpret data from various representations</li>
                    <li>Find the mode and median of a data set</li>
                    <li>Compare different representations of the same data</li>
                    <li>Draw conclusions and make predictions based on data</li>
                    <li>Identify patterns and relationships in data</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-indigo-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-indigo-50 px-4 py-2 rounded-md">
                  Probability Concepts and Applications
                </AccordionTrigger>
                <AccordionContent className="bg-indigo-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Describe the likelihood of events using appropriate vocabulary</li>
                    <li>Identify events as certain, likely, unlikely, or impossible</li>
                    <li>Conduct simple probability experiments using spinners, dice, coins, etc.</li>
                    <li>Record and organize the results of probability experiments</li>
                    <li>Express the probability of an event as a fraction</li>
                    <li>Compare experimental results with theoretical probability</li>
                    <li>Make predictions based on experimental probability</li>
                    <li>Understand the concept of fairness in games and activities</li>
                    <li>Solve problems involving probability</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-indigo-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-indigo-50">
              <CardTitle className="text-indigo-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-indigo-700">Observations:</strong> Teacher observations during data
                  collection, graph creation, and probability experiments
                </li>
                <li>
                  <strong className="text-indigo-700">Conversations:</strong> Student explanations of data
                  representations, interpretations, and probability predictions
                </li>
                <li>
                  <strong className="text-indigo-700">Products:</strong> Student work samples, including surveys,
                  graphs, data analysis, and probability experiments
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                <h4 className="font-semibold mb-2 text-indigo-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for data collection and representation skills</li>
                  <li>Rubrics for evaluating student-created graphs and data analysis</li>
                  <li>Performance tasks involving collecting, representing, and interpreting data</li>
                  <li>Exit tickets to assess daily learning objectives</li>
                  <li>Data and probability journals for recording experiments and reflections</li>
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
                  <AccordionTrigger>Data Collection and Organization Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Student-Generated Questions:</strong> Have students generate their own questions for
                        data collection based on their interests and experiences.
                      </li>
                      <li>
                        <strong>Collaborative Surveys:</strong> Engage students in designing and conducting surveys
                        within the class or school community.
                      </li>
                      <li>
                        <strong>Sorting Activities:</strong> Provide opportunities for students to sort and classify
                        objects based on various attributes, recording their results in tally charts or frequency
                        tables.
                      </li>
                      <li>
                        <strong>Real-World Data Collection:</strong> Connect data collection to real-world contexts,
                        such as tracking weather, monitoring plant growth, or surveying food preferences.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Data Representation and Analysis Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Concrete Graph Building:</strong> Use manipulatives, sticky notes, or other concrete
                        materials to create physical graphs before moving to paper or digital formats.
                      </li>
                      <li>
                        <strong>Graph Analysis Activities:</strong> Provide structured activities for students to
                        interpret and analyze various types of graphs, focusing on drawing conclusions and making
                        predictions.
                      </li>
                      <li>
                        <strong>Technology Integration:</strong> Utilize digital tools and spreadsheets to create graphs
                        and analyze data.
                      </li>
                      <li>
                        <strong>Cross-Curricular Connections:</strong> Integrate data representation and analysis with
                        science experiments, social studies surveys, or other subject areas.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Probability Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Probability Language Development:</strong> Use everyday situations to help students
                        understand and use probability vocabulary (certain, likely, unlikely, impossible).
                      </li>
                      <li>
                        <strong>Hands-On Experiments:</strong> Engage students in conducting probability experiments
                        using spinners, dice, coins, and other random generators.
                      </li>
                      <li>
                        <strong>Prediction Activities:</strong> Have students make predictions before conducting
                        probability experiments, then compare their predictions to the actual results.
                      </li>
                      <li>
                        <strong>Probability Games:</strong> Incorporate games that involve probability concepts, such as
                        board games with dice or card games.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Differentiation Strategies</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Visual Supports:</strong> Use visual aids, anchor charts, and graphic organizers to
                        support students' understanding of data and probability concepts.
                      </li>
                      <li>
                        <strong>Tiered Activities:</strong> Adjust the complexity of data sets, representations, and
                        probability experiments based on students' readiness levels.
                      </li>
                      <li>
                        <strong>Multiple Representations:</strong> Provide opportunities for students to demonstrate
                        their understanding through various means (drawing, building, explaining, writing).
                      </li>
                      <li>
                        <strong>Collaborative Learning:</strong> Incorporate partner and small group activities to
                        support peer learning and discussion of data and probability concepts.
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
                <li>Graph paper, chart paper, and sticky notes</li>
                <li>Spinners, dice, coins, and other probability tools</li>
                <li>Data collection templates and survey forms</li>
                <li>Digital graphing tools and spreadsheets</li>
                <li>OECS Grade 3 Mathematics Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Individual graph paper and grid paper</li>
                <li>Data collection sheets and tally charts</li>
                <li>Probability tools (dice, spinners, cards)</li>
                <li>Data and probability vocabulary cards</li>
                <li>Data and probability journals for recording experiments and findings</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              Data Handling and Probability in Grade 3 builds upon students' earlier experiences with sorting,
              classifying, and simple data representation. Students develop more sophisticated skills in collecting,
              organizing, displaying, and interpreting data, as well as a deeper understanding of probability concepts.
              They learn to formulate questions, gather relevant information, create various representations of data
              (including pictographs, bar graphs, and line plots), and make predictions based on data and probability
              experiments. Through hands-on experiences and real-world applications, students develop data literacy and
              an understanding of how data and probability are used in everyday life.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
