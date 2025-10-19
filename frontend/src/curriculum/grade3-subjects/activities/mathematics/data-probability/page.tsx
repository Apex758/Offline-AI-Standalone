import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Grade 3 Mathematics - Data Handling & Probability Activities",
  description: "Activities for Grade 3 Data Handling and Probability strand",
}

export default function DataProbabilityActivitiesPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 mt-6">
        <h1 className="text-3xl font-bold mb-2">Grade 3 Data Handling & Probability Activities</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Engaging activities to help students collect, organize, and analyze data, as well as understand basic
          probability concepts.
        </p>
      </div>

      <Tabs defaultValue="data-collection">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="data-collection">Data Collection</TabsTrigger>
          <TabsTrigger value="data-representation">Data Representation</TabsTrigger>
          <TabsTrigger value="data-analysis">Data Analysis</TabsTrigger>
          <TabsTrigger value="probability">Probability</TabsTrigger>
        </TabsList>

        <TabsContent value="data-collection" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Data Collection Activities</h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="survey-activities">
              <AccordionTrigger className="text-lg font-medium">Survey Activities</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Classroom Survey</h3>
                    <p className="mb-2">Students create and conduct surveys on topics of interest.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Survey templates</li>
                      <li>Clipboards</li>
                      <li>Pencils</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students brainstorm survey questions on topics of interest</li>
                      <li>They create survey forms with clear questions and response options</li>
                      <li>Students collect data from classmates</li>
                      <li>They organize and record the data collected</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Data Collection Methods</h3>
                    <p className="mb-2">Students explore different methods of collecting data.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Observation checklists</li>
                      <li>Interview templates</li>
                      <li>Tally sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Discuss different methods of collecting data (surveys, observations, interviews)</li>
                      <li>Students choose a question to investigate</li>
                      <li>They collect data using different methods</li>
                      <li>Students compare the effectiveness of each method</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="observation-activities">
              <AccordionTrigger className="text-lg font-medium">Observation Activities</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Nature Observation</h3>
                    <p className="mb-2">Students collect data through observation of natural phenomena.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Observation logs</li>
                      <li>Magnifying glasses</li>
                      <li>Tally sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students observe natural phenomena (weather, plants, insects)</li>
                      <li>They record their observations using tally marks or notes</li>
                      <li>Students organize their data in tables</li>
                      <li>They share their findings with the class</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Traffic Count</h3>
                    <p className="mb-2">Students collect data by counting different types of vehicles.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Tally sheets</li>
                      <li>Clipboards</li>
                      <li>Pencils</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students observe traffic from a safe location</li>
                      <li>They count different types of vehicles (cars, trucks, buses)</li>
                      <li>Students record their data using tally marks</li>
                      <li>They organize their data in tables</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="data-representation" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Data Representation Activities</h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="pictograph-activities">
              <AccordionTrigger className="text-lg font-medium">Pictograph Activities</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Creating Pictographs</h3>
                    <p className="mb-2">Students create pictographs to represent data.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Graph paper or templates</li>
                      <li>Stickers or stamps</li>
                      <li>Colored pencils</li>
                      <li>Data sets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Provide students with data sets or have them use their survey data</li>
                      <li>They create pictographs using stickers or drawings to represent the data</li>
                      <li>Students include a title, labels, and a key</li>
                      <li>They explain what their pictograph shows</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Interpreting Pictographs</h3>
                    <p className="mb-2">Students answer questions based on pictographs.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Pictograph examples</li>
                      <li>Question sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Provide students with pictographs</li>
                      <li>They answer questions about the data represented</li>
                      <li>Students explain how they found their answers</li>
                      <li>They create their own questions based on the pictographs</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="bar-graph-activities">
              <AccordionTrigger className="text-lg font-medium">Bar Graph Activities</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Creating Bar Graphs</h3>
                    <p className="mb-2">Students create bar graphs to represent data.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Graph paper or templates</li>
                      <li>Rulers</li>
                      <li>Colored pencils</li>
                      <li>Data sets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Provide students with data sets or have them use their survey data</li>
                      <li>They create bar graphs to represent the data</li>
                      <li>Students include a title, labels, and a scale</li>
                      <li>They explain what their bar graph shows</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Interpreting Bar Graphs</h3>
                    <p className="mb-2">Students answer questions based on bar graphs.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Bar graph examples</li>
                      <li>Question sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Provide students with bar graphs</li>
                      <li>They answer questions about the data represented</li>
                      <li>Students explain how they found their answers</li>
                      <li>They create their own questions based on the bar graphs</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="table-activities">
              <AccordionTrigger className="text-lg font-medium">Table and Chart Activities</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Creating Frequency Tables</h3>
                    <p className="mb-2">Students create frequency tables to organize data.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Table templates</li>
                      <li>Data sets</li>
                      <li>Pencils</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Provide students with data sets or have them use their survey data</li>
                      <li>They organize the data in frequency tables</li>
                      <li>Students include categories and counts</li>
                      <li>They explain what their frequency table shows</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Converting Between Representations</h3>
                    <p className="mb-2">Students convert data between different representations.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Data sets in various formats</li>
                      <li>Graph paper or templates</li>
                      <li>Colored pencils</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Provide students with data in one format (table, pictograph, or bar graph)</li>
                      <li>They convert the data to another format</li>
                      <li>Students compare the different representations</li>
                      <li>They discuss which format best represents the data and why</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="data-analysis" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Data Analysis Activities</h2>

          <Accordion type="single" collapsible className="w-full">
            {/* Additional data analysis activities can be added here */}
          </Accordion>
        </TabsContent>

        <TabsContent value="probability" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Probability Activities</h2>

          <Accordion type="single" collapsible className="w-full">
            {/* Additional probability activities can be added here */}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  )
}
