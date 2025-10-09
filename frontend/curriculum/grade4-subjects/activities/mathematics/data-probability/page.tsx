import type { Metadata } from "next"
import { Breadcrumb } from "@/components/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Grade 4 Mathematics - Data Handling & Probability Activities",
  description: "Activities for Grade 4 Data Handling and Probability strand",
}

export default function DataProbabilityActivitiesPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 4", href: "/curriculum/grade4-subjects" },
          { label: "Mathematics", href: "/curriculum/grade4-subjects/mathematics" },
          {
            label: "Data & Probability Activities",
            href: "/curriculum/grade4-subjects/activities/mathematics/data-probability",
          },
        ]}
      />

      <div className="mb-8 mt-6 bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-lg border border-rose-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-3/4">
            <h1 className="text-3xl font-bold mb-2 text-rose-800">Grade 4 Data Handling & Probability Activities</h1>
            <p className="text-gray-600">
              Engaging activities to help students collect, organize, and analyze data, as well as understand
              probability concepts.
            </p>
          </div>
          <div className="md:w-1/4 flex justify-center mt-4 md:mt-0">
            <img
              src="/placeholder.svg?height=120&width=120&query=data charts graphs probability"
              alt="Data and probability illustration"
              className="rounded-full border-4 border-white shadow-md"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="data-collection">
        <TabsList className="grid w-full grid-cols-5 bg-rose-50">
          <TabsTrigger
            value="data-collection"
            className="data-[state=active]:bg-rose-100 data-[state=active]:text-rose-800"
          >
            Data Collection
          </TabsTrigger>
          <TabsTrigger
            value="data-representation"
            className="data-[state=active]:bg-rose-100 data-[state=active]:text-rose-800"
          >
            Data Representation
          </TabsTrigger>
          <TabsTrigger
            value="data-analysis"
            className="data-[state=active]:bg-rose-100 data-[state=active]:text-rose-800"
          >
            Data Analysis
          </TabsTrigger>
          <TabsTrigger
            value="probability"
            className="data-[state=active]:bg-rose-100 data-[state=active]:text-rose-800"
          >
            Probability
          </TabsTrigger>
          <TabsTrigger
            value="online-resources"
            className="data-[state=active]:bg-rose-100 data-[state=active]:text-rose-800"
          >
            Online Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="data-collection" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Data Collection Activities</h2>
          <div className="flex justify-center mb-6">
            <img
              src="/placeholder.svg?height=200&width=400&query=data collection survey math"
              alt="Data collection and surveys"
              className="rounded-lg shadow-md"
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="survey-activities">
              <AccordionTrigger className="text-lg font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-t-md px-4">
                Survey Activities
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-rose-50 dark:bg-slate-800 rounded-md border border-rose-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">School Survey Project</h3>
                    <p className="mb-2">Students design and conduct surveys on topics of interest within the school.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Survey templates</li>
                      <li>Clipboards</li>
                      <li>Pencils</li>
                      <li>Data collection sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students work in small groups to choose a research question</li>
                      <li>They design a survey with clear questions and response options</li>
                      <li>Students collect data from other classes or grade levels</li>
                      <li>They organize and record the data collected for later analysis</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Data Collection Methods</h3>
                    <p className="mb-2">Students explore and compare different methods of collecting data.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Observation checklists</li>
                      <li>Interview templates</li>
                      <li>Survey forms</li>
                      <li>Tally sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Discuss different methods of collecting data (surveys, observations, interviews)</li>
                      <li>Students choose a question to investigate using multiple methods</li>
                      <li>They collect data using at least two different methods</li>
                      <li>Students compare the effectiveness and results of each method</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="observation-activities">
              <AccordionTrigger className="text-lg font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-t-md px-4">
                Observation Activities
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-rose-50 dark:bg-slate-800 rounded-md border border-rose-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Environmental Observation</h3>
                    <p className="mb-2">Students collect data through observation of environmental factors.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Observation logs</li>
                      <li>Thermometers</li>
                      <li>Rain gauges</li>
                      <li>Tally sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students observe and record environmental data (temperature, rainfall, cloud cover)</li>
                      <li>They collect data over a period of time (daily for a week or month)</li>
                      <li>Students organize their data in tables</li>
                      <li>They prepare their data for representation and analysis</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Traffic Study</h3>
                    <p className="mb-2">Students collect and categorize data about traffic patterns.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Tally sheets with categories</li>
                      <li>Clipboards</li>
                      <li>Stopwatches</li>
                      <li>Pencils</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students observe traffic from a safe location during different time periods</li>
                      <li>They count and categorize vehicles (cars, trucks, buses, bicycles)</li>
                      <li>Students record their data using tally marks</li>
                      <li>They organize their data in frequency tables for later analysis</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="data-representation" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Data Representation Activities</h2>
          <div className="flex justify-center mb-6">
            <img
              src="/placeholder.svg?height=200&width=400&query=data graphs charts representation"
              alt="Data representation with graphs and charts"
              className="rounded-lg shadow-md"
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="graph-activities">
              <AccordionTrigger className="text-lg font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-t-md px-4">
                Graph Activities
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-rose-50 dark:bg-slate-800 rounded-md border border-rose-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Creating Bar Graphs</h3>
                    <p className="mb-2">Students create bar graphs to represent collected data.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Graph paper or templates</li>
                      <li>Rulers</li>
                      <li>Colored pencils or markers</li>
                      <li>Data sets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students use data they've collected or provided data sets</li>
                      <li>They create bar graphs with appropriate scales and labels</li>
                      <li>Students include a title, axis labels, and a key if needed</li>
                      <li>They explain what their bar graph shows and why they chose this representation</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Line Plot Creation</h3>
                    <p className="mb-2">Students create line plots to display measurement data.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Line plot templates</li>
                      <li>Rulers</li>
                      <li>Stickers or markers</li>
                      <li>Measurement data</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students collect measurement data (e.g., lengths of objects, heights of plants)</li>
                      <li>They create a number line with appropriate scale</li>
                      <li>Students place an X or sticker above each data point</li>
                      <li>They interpret the line plot and identify patterns in the data</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="chart-activities">
              <AccordionTrigger className="text-lg font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-t-md px-4">
                Chart Activities
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-rose-50 dark:bg-slate-800 rounded-md border border-rose-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Creating Pictographs</h3>
                    <p className="mb-2">Students create pictographs to represent data.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Pictograph templates</li>
                      <li>Stickers or stamps</li>
                      <li>Colored pencils or markers</li>
                      <li>Data sets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students use data they've collected or provided data sets</li>
                      <li>They create pictographs using symbols to represent the data</li>
                      <li>Students include a title, labels, and a key showing what each symbol represents</li>
                      <li>They explain what their pictograph shows and discuss the scale they chose</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Digital Data Representation</h3>
                    <p className="mb-2">Students use digital tools to create various data representations.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Computers or tablets</li>
                      <li>Spreadsheet software or graphing tools</li>
                      <li>Data sets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students input data into a spreadsheet</li>
                      <li>They create different types of graphs (bar graphs, line graphs, pictographs)</li>
                      <li>Students compare the different representations of the same data</li>
                      <li>They discuss which representation best shows the data and why</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="data-analysis" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Data Analysis Activities</h2>
          <div className="flex justify-center mb-6">
            <img
              src="/placeholder.svg?height=200&width=400&query=data analysis statistics math"
              alt="Data analysis and statistics"
              className="rounded-lg shadow-md"
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="interpretation-activities">
              <AccordionTrigger className="text-lg font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-t-md px-4">
                Interpretation Activities
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-rose-50 dark:bg-slate-800 rounded-md border border-rose-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Graph Detective</h3>
                    <p className="mb-2">Students analyze graphs to answer questions and draw conclusions.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Various graphs and charts</li>
                      <li>Question cards</li>
                      <li>Analysis worksheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students work in pairs or small groups</li>
                      <li>They analyze graphs to answer specific questions</li>
                      <li>Students identify patterns, trends, and outliers in the data</li>
                      <li>They draw conclusions based on the data and explain their reasoning</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Data Comparison</h3>
                    <p className="mb-2">Students compare and contrast data from different sources or time periods.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Multiple data sets on related topics</li>
                      <li>Venn diagrams or comparison charts</li>
                      <li>Colored pencils or markers</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students examine multiple data sets on related topics</li>
                      <li>They identify similarities and differences between the data sets</li>
                      <li>Students create visual comparisons using charts or diagrams</li>
                      <li>They present their findings and explain what the comparisons reveal</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="statistical-activities">
              <AccordionTrigger className="text-lg font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-t-md px-4">
                Statistical Activities
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-rose-50 dark:bg-slate-800 rounded-md border border-rose-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Finding the Mean, Median, and Mode</h3>
                    <p className="mb-2">Students calculate and interpret measures of central tendency.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Data sets</li>
                      <li>Calculators</li>
                      <li>Number lines</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students work with various data sets</li>
                      <li>They calculate the mean, median, and mode for each data set</li>
                      <li>Students compare the different measures and discuss what each reveals</li>
                      <li>They determine which measure best represents the data and explain why</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Range and Outliers</h3>
                    <p className="mb-2">Students explore the range of data sets and identify outliers.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Data sets with and without outliers</li>
                      <li>Line plots or dot plots</li>
                      <li>Colored markers</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students calculate the range for various data sets</li>
                      <li>They identify potential outliers in the data</li>
                      <li>Students discuss how outliers affect the mean, median, and range</li>
                      <li>They consider whether outliers should be included or excluded and why</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="probability" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Probability Activities</h2>
          <div className="flex justify-center mb-6">
            <img
              src="/placeholder.svg?height=200&width=400&query=probability dice spinner math"
              alt="Probability with dice and spinners"
              className="rounded-lg shadow-md"
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="probability-experiments">
              <AccordionTrigger className="text-lg font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-t-md px-4">
                Probability Experiments
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-rose-50 dark:bg-slate-800 rounded-md border border-rose-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Coin and Dice Experiments</h3>
                    <p className="mb-2">Students conduct experiments with coins and dice to explore probability.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Coins</li>
                      <li>Dice</li>
                      <li>Recording sheets</li>
                      <li>Graph paper</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students predict outcomes for coin flips and dice rolls</li>
                      <li>They conduct multiple trials and record the results</li>
                      <li>Students calculate the experimental probability</li>
                      <li>They compare experimental results with theoretical probability</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Spinner Investigations</h3>
                    <p className="mb-2">Students design and test spinners with different probability outcomes.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Spinner templates</li>
                      <li>Paper clips</li>
                      <li>Colored pencils or markers</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students design spinners with different section sizes</li>
                      <li>They predict the probability of landing on each section</li>
                      <li>Students conduct trials and record the results</li>
                      <li>They compare their predictions with the experimental results</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="probability-games">
              <AccordionTrigger className="text-lg font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-t-md px-4">
                Probability Games
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-rose-50 dark:bg-slate-800 rounded-md border border-rose-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Probability Race</h3>
                    <p className="mb-2">Students play a game that demonstrates probability concepts.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Game boards with numbered tracks</li>
                      <li>Dice</li>
                      <li>Game pieces</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students roll two dice and add the numbers</li>
                      <li>They move a marker on the corresponding number on their game board</li>
                      <li>The first number to reach the end of its track wins</li>
                      <li>Students analyze which numbers won most often and discuss why</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Probability Card Games</h3>
                    <p className="mb-2">Students play card games that involve probability.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Playing cards</li>
                      <li>Probability recording sheets</li>
                      <li>Calculators</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students play simple card games involving probability</li>
                      <li>Before drawing cards, they predict the probability of specific outcomes</li>
                      <li>Students record the actual outcomes over multiple games</li>
                      <li>They compare theoretical and experimental probability</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
        <TabsContent value="online-resources" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Online Resources for Data & Probability</h2>
          <div className="flex justify-center mb-6">
            <img
              src="/placeholder.svg?height=200&width=400&query=digital data probability resources"
              alt="Digital data and probability resources"
              className="rounded-lg shadow-md"
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="data-tools">
              <AccordionTrigger className="text-lg font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-t-md px-4">
                Data Tools
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-rose-50 dark:bg-slate-800 rounded-md border border-rose-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Data Collection Tools</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://www.nctm.org/Classroom-Resources/Illuminations/Interactives/Data-Grapher/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          NCTM Illuminations: Data Grapher
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Tool for collecting and graphing data.
                        </p>
                      </li>
                      <li>
                        <a
                          href="https://www.mathplayground.com/data_pronto.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Math Playground: Data Pronto
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Interactive tool for creating graphs from data.
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Data Representation Tools</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://www.mathsisfun.com/data/data-graph.php"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Math is Fun: Data Graphs
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Interactive tool for creating different types of graphs.
                        </p>
                      </li>
                      <li>
                        <a
                          href="https://www.khanacademy.org/math/cc-fourth-grade-math/cc-4th-data-measurement"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Khan Academy: Data and Measurement
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Video lessons and practice on data representation.
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="probability-resources">
              <AccordionTrigger className="text-lg font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-t-md px-4">
                Probability Resources
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-rose-50 dark:bg-slate-800 rounded-md border border-rose-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Probability Simulators</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://www.mathsisfun.com/data/probability.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Math is Fun: Probability
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Interactive probability simulations and explanations.
                        </p>
                      </li>
                      <li>
                        <a
                          href="https://www.nctm.org/Classroom-Resources/Illuminations/Interactives/Adjustable-Spinner/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          NCTM Illuminations: Adjustable Spinner
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Interactive spinner for probability experiments.
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Probability Games</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://www.mathplayground.com/probability.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Math Playground: Probability Games
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Interactive games for exploring probability concepts.
                        </p>
                      </li>
                      <li>
                        <a
                          href="https://www.splashlearn.com/probability-games"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          SplashLearn: Probability Games
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Games for practicing probability concepts.
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="printable-resources">
              <AccordionTrigger className="text-lg font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-t-md px-4">
                Printable Resources
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-rose-50 dark:bg-slate-800 rounded-md border border-rose-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Data Worksheets</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://www.mathworksheets4kids.com/data-graphs.php"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Math Worksheets 4 Kids: Data and Graphs
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Printable worksheets for data representation and analysis.
                        </p>
                      </li>
                      <li>
                        <a
                          href="https://www.k5learning.com/free-math-worksheets/fourth-grade-4/data-and-graphing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          K5 Learning: Data and Graphing
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Grade 4 worksheets for data and graphing.
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Probability Worksheets</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://www.mathworksheets4kids.com/probability.php"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Math Worksheets 4 Kids: Probability
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Printable worksheets for probability concepts.
                        </p>
                      </li>
                      <li>
                        <a
                          href="https://www.commoncoresheets.com/SortedByGrade.php?Sorted=4th#sort=4.md.4"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Common Core Sheets: Probability
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Standards-aligned worksheets for probability.
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  )
}
