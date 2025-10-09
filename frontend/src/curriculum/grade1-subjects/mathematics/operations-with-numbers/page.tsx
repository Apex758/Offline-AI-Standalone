"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function OperationsWithNumbersPage() {
  return (
    <div className="container mx-auto py-8">
      <Link href="/curriculum/grade1-subjects/mathematics">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Mathematics Curriculum
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Operations with Numbers</h1>
        <p className="text-gray-600 mb-4">
          Operations with numbers involve understanding and applying addition, subtraction, multiplication, and
          division. In Grade 1, students develop foundational skills in additive thinking and begin to explore
          multiplicative thinking through equal groups.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            Essential Learning Outcome O1.1: Additive Thinking – Understanding the Meaning of Addition and Subtraction
            and how they Related
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Specific Curriculum Outcomes</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Combine quantities (sets, lengths, etc.) using concrete materials to get the total or find a missing
                    value up to 20.
                  </li>
                  <li>Partition and recombine quantities to relate to addition and subtraction.</li>
                  <li>Explain how addition and subtraction are related.</li>
                  <li>Add and subtract within 20, using a variety of strategies.</li>
                  <li>Determine if equations involving addition and subtraction are true.</li>
                  <li>Separate quantities to find a missing value from a number up to 20.</li>
                  <li>Compare two quantities to find the difference from a number up to 20.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Instructional Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Use manipulatives to model addition and subtraction situations</li>
                  <li>Create story problems that involve joining, separating, and comparing</li>
                  <li>Use number lines to model addition and subtraction</li>
                  <li>Play games that involve adding and subtracting quantities</li>
                  <li>Use part-part-whole models to show the relationship between addition and subtraction</li>
                  <li>Teach various strategies such as counting on, counting back, and using known facts</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Assessment Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Observe students as they model addition and subtraction situations</li>
                  <li>Listen to students' explanations of their solution strategies</li>
                  <li>Provide story problems for students to solve and explain</li>
                  <li>Use true/false equation activities to assess understanding</li>
                  <li>Have students create their own addition and subtraction stories</li>
                  <li>
                    Use interviews to assess students' understanding of the relationship between addition and
                    subtraction
                  </li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            Essential Learning Outcome O1.2: Additive Thinking – Compute Fluently Using Operations (+,-)
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Specific Curriculum Outcomes</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Use symbols for addition (+) and subtraction (-) as a way to record calculations done through
                    stories, building, and drawing.
                  </li>
                  <li>
                    Make reasonable estimation when combining, separating, comparing & partitioning quantities to 20.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Instructional Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Model how to record addition and subtraction using symbols</li>
                  <li>Connect concrete models to symbolic representations</li>
                  <li>Use story problems and have students record the corresponding number sentences</li>
                  <li>Teach estimation strategies such as benchmarking and rounding</li>
                  <li>Play games that involve estimating quantities and sums</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Assessment Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Observe students as they record addition and subtraction using symbols</li>
                  <li>Provide activities where students match stories to number sentences</li>
                  <li>Have students create drawings to represent number sentences</li>
                  <li>Use estimation activities to assess reasonableness of answers</li>
                  <li>Listen to students' explanations of their estimation strategies</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            Essential Learning Outcome O2.1: Multiplicative thinking - Learners will understand the meaning of
            multiplication and division and how they relate
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Specific Curriculum Outcomes</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Model and describe equal collections of objects as ___ groups of ___.</li>
                  <li>Form equal groups of objects and use repeated addition to represent the group.</li>
                  <li>Skip count to find the total number of objects in groups.</li>
                  <li>Write mathematical statements to represent groups of equal objects.</li>
                  <li>Share objects into equal groups and state how many objects are in each group.</li>
                  <li>Write mathematical statements to represent equal groups of objects shared.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Instructional Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Use manipulatives to create equal groups</li>
                  <li>Connect skip counting to equal groups</li>
                  <li>Create story problems involving equal groups</li>
                  <li>Use arrays to model equal groups</li>
                  <li>Play games that involve forming equal groups and sharing equally</li>
                  <li>Use real-world contexts such as sharing snacks or organizing materials</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Assessment Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Observe students as they create and describe equal groups</li>
                  <li>Listen to students' use of language to describe equal groups</li>
                  <li>Provide activities where students use repeated addition to find totals</li>
                  <li>Have students solve simple sharing problems</li>
                  <li>Use interviews to assess students' understanding of equal groups</li>
                  <li>Have students match mathematical statements to equal group situations</li>
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
                <li>Manipulatives: counters, cubes, ten-frames</li>
                <li>Number lines and hundred charts</li>
                <li>Story books that involve addition and subtraction</li>
                <li>Games that reinforce operation concepts</li>
                <li>Digital tools and apps for practicing operations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle>Cross-Curricular Connections</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="list-disc pl-5 space-y-2">
                <li>Language Arts: Writing and solving story problems</li>
                <li>Physical Education: Games involving scoring and grouping</li>
                <li>Art: Creating patterns with equal groups</li>
                <li>Music: Counting beats and forming equal groups of notes</li>
                <li>Science: Sorting and grouping objects by attributes</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
