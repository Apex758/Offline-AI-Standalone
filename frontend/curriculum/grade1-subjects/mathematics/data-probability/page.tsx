"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function DataProbabilityPage() {
  return (
    <div className="container mx-auto py-8">
      <Link href="/curriculum/grade1-subjects/mathematics">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Mathematics Curriculum
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Data Handling & Probability</h1>
        <p className="text-gray-600 mb-4">
          Data handling and probability help students make sense of information and understand uncertainty. In Grade 1,
          students learn to collect, organize, and interpret data using simple representations, and explore basic
          concepts of chance and likelihood.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            Essential Learning Outcome D1.1: Collecting, Organizing, and Analyzing Data - Collecting and Organizing Data
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Specific Curriculum Outcomes</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Sort and classify objects by one attribute (e.g., color, size, shape).</li>
                  <li>Collect data through observations, surveys, and experiments.</li>
                  <li>Organize data using concrete objects, pictures, and simple graphs.</li>
                  <li>Create pictographs where one picture represents one data point.</li>
                  <li>Create simple bar graphs with teacher support.</li>
                  <li>Answer questions about the data collected.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Instructional Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Use sorting activities with classroom objects</li>
                  <li>Create simple surveys about student preferences</li>
                  <li>Model how to organize data using concrete objects</li>
                  <li>Use children's literature that incorporates data concepts</li>
                  <li>Create class graphs about daily activities</li>
                  <li>Use interactive technology to create simple graphs</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Assessment Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Observe students as they sort and classify objects</li>
                  <li>Listen to students' explanations of their sorting criteria</li>
                  <li>Provide performance tasks where students collect and organize data</li>
                  <li>Use interviews to assess students' understanding of data organization</li>
                  <li>Have students explain their graphs</li>
                  <li>Use simple recording sheets for students to document data collection</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            Essential Learning Outcome D1.2: Collecting, Organizing, and Analyzing Data - Interpreting Data
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Specific Curriculum Outcomes</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Read and interpret information from concrete graphs, pictographs, and simple bar graphs.</li>
                  <li>Compare data using appropriate language (more, fewer, same).</li>
                  <li>Draw conclusions from collected data.</li>
                  <li>Answer questions about the data represented in graphs.</li>
                  <li>Make predictions based on the data.</li>
                  <li>Communicate findings orally and through pictures.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Instructional Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Model how to read and interpret graphs</li>
                  <li>Ask questions that require students to compare data</li>
                  <li>Create discussion opportunities about what the data shows</li>
                  <li>Use think-alouds to demonstrate drawing conclusions</li>
                  <li>Provide opportunities for students to share their interpretations</li>
                  <li>Connect data interpretation to real-world contexts</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Assessment Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Observe students as they interpret graphs</li>
                  <li>Listen to students' comparisons of data</li>
                  <li>Provide performance tasks where students answer questions about graphs</li>
                  <li>Use interviews to assess students' understanding of data interpretation</li>
                  <li>Have students explain their conclusions</li>
                  <li>Use simple worksheets with graph interpretation questions</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            Essential Learning Outcome D2.1: Understanding Basic Concepts of Probability - Exploring Chance
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Specific Curriculum Outcomes</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Use appropriate language to describe the likelihood of events (impossible, unlikely, likely,
                    certain).
                  </li>
                  <li>Classify events as impossible, unlikely, likely, or certain.</li>
                  <li>Conduct simple probability experiments (e.g., spinning spinners, rolling dice).</li>
                  <li>Make predictions about the outcomes of simple probability experiments.</li>
                  <li>Compare predictions with actual results.</li>
                  <li>Discuss why outcomes may be different from predictions.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Instructional Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Use children's literature that incorporates probability concepts</li>
                  <li>Create simple spinners and dice for probability experiments</li>
                  <li>Model appropriate probability language</li>
                  <li>Engage students in making predictions before experiments</li>
                  <li>Create charts to compare predictions with results</li>
                  <li>Use games that involve chance</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Assessment Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Observe students as they participate in probability experiments</li>
                  <li>Listen to students' use of probability vocabulary</li>
                  <li>Provide performance tasks where students classify events by likelihood</li>
                  <li>Use interviews to assess students' understanding of chance</li>
                  <li>Have students explain their predictions</li>
                  <li>Use simple recording sheets for students to document experiments</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle>Teacher Resources</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="list-disc pl-5 space-y-2">
                <li>Manipulatives for sorting and classifying</li>
                <li>Graph templates and chart paper</li>
                <li>Spinners, dice, and other probability tools</li>
                <li>Children's books about data and probability</li>
                <li>Digital tools and apps for creating graphs</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle>Cross-Curricular Connections</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="list-disc pl-5 space-y-2">
                <li>Science: Collecting and recording data from experiments</li>
                <li>Social Studies: Gathering data about communities</li>
                <li>Language Arts: Using descriptive language for data and probability</li>
                <li>Physical Education: Collecting data on physical activities</li>
                <li>Art: Creating visual representations of data</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
