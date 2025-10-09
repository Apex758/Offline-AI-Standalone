"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function MeasurementPage() {
  return (
    <div className="container mx-auto py-8">
      <Link href="/curriculum/grade1-subjects/mathematics">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Mathematics Curriculum
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Measurement</h1>
        <p className="text-gray-600 mb-4">
          Measurement is a critical strand in mathematics that helps students understand and quantify the world around
          them. In Grade 1, students develop foundational measurement skills by exploring length, mass, capacity, area,
          and time through direct comparison and non-standard units.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            Essential Learning Outcome M1.1: Understanding What and How We Measure - Length
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Specific Curriculum Outcomes</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Compare and order objects by length using direct comparison.</li>
                  <li>Use appropriate language to describe length (longer, shorter, taller, same length).</li>
                  <li>Measure length using non-standard units (e.g., paper clips, hand spans, cubes).</li>
                  <li>Understand the need for consistent units when measuring.</li>
                  <li>Estimate lengths before measuring.</li>
                  <li>Solve simple problems involving length.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Instructional Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Use hands-on activities with manipulatives for direct comparison</li>
                  <li>Create measurement stations with various objects to measure</li>
                  <li>Model proper measuring techniques using non-standard units</li>
                  <li>Use children's literature that incorporates measurement concepts</li>
                  <li>Engage students in estimation activities before measuring</li>
                  <li>Connect measurement to real-world contexts</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Assessment Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Observe students as they compare and order objects by length</li>
                  <li>Listen to students' use of measurement vocabulary</li>
                  <li>Provide performance tasks where students measure objects</li>
                  <li>Use interviews to assess students' understanding of measurement concepts</li>
                  <li>Have students explain their measuring process</li>
                  <li>Use simple recording sheets for students to document measurements</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            Essential Learning Outcome M1.2: Understanding What and How We Measure - Mass and Capacity
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Specific Curriculum Outcomes</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Compare and order objects by mass using a balance scale.</li>
                  <li>Use appropriate language to describe mass (heavier, lighter, same mass).</li>
                  <li>Compare and order containers by capacity through direct comparison.</li>
                  <li>Use appropriate language to describe capacity (holds more, holds less, same capacity).</li>
                  <li>Measure capacity using non-standard units (e.g., cups, spoons).</li>
                  <li>Solve simple problems involving mass and capacity.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Instructional Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Use balance scales for comparing masses</li>
                  <li>Create a water or sand table for capacity exploration</li>
                  <li>Model proper techniques for comparing mass and capacity</li>
                  <li>Use children's literature that incorporates mass and capacity concepts</li>
                  <li>Engage students in estimation activities</li>
                  <li>Connect to cooking and food preparation activities</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Assessment Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Observe students as they compare objects using balance scales</li>
                  <li>Listen to students' use of mass and capacity vocabulary</li>
                  <li>Provide performance tasks where students compare containers</li>
                  <li>Use interviews to assess students' understanding of mass and capacity</li>
                  <li>Have students explain their comparison process</li>
                  <li>Use simple recording sheets for students to document comparisons</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            Essential Learning Outcome M1.3: Understanding What and How We Measure - Area
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Specific Curriculum Outcomes</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Compare and order objects by area through direct comparison.</li>
                  <li>Use appropriate language to describe area (covers more, covers less, same area).</li>
                  <li>Measure area using non-standard units (e.g., tiles, pattern blocks, hand prints).</li>
                  <li>Understand that area represents the amount of surface an object covers.</li>
                  <li>Estimate areas before measuring.</li>
                  <li>Solve simple problems involving area.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Instructional Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Use manipulatives like pattern blocks and tiles for covering surfaces</li>
                  <li>Create activities where students compare the area of different shapes</li>
                  <li>Model how to cover a surface completely without gaps or overlaps</li>
                  <li>Use children's literature that incorporates area concepts</li>
                  <li>Engage students in estimation activities before measuring area</li>
                  <li>Connect area measurement to real-world contexts</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Assessment Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Observe students as they compare and order objects by area</li>
                  <li>Listen to students' use of area vocabulary</li>
                  <li>Provide performance tasks where students measure areas</li>
                  <li>Use interviews to assess students' understanding of area concepts</li>
                  <li>Have students explain their measuring process</li>
                  <li>Use simple recording sheets for students to document area measurements</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>
            Essential Learning Outcome M1.4: Understanding What and How We Measure - Time
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Specific Curriculum Outcomes</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Sequence events using time-related language (before, after, yesterday, today, tomorrow).</li>
                  <li>Read analog and digital clocks to the hour.</li>
                  <li>Relate daily events to specific times of day.</li>
                  <li>Understand the concept of a calendar (days, weeks, months).</li>
                  <li>Use non-standard units to measure elapsed time (e.g., pendulum swings, sand timers).</li>
                  <li>Solve simple problems involving time.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Instructional Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Use daily routines to reinforce time concepts</li>
                  <li>Create a class schedule with visual representations</li>
                  <li>Use manipulative clocks for hands-on practice</li>
                  <li>Incorporate calendar activities into daily routines</li>
                  <li>Use children's literature that incorporates time concepts</li>
                  <li>Create timelines of daily events</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Assessment Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Observe students as they sequence events</li>
                  <li>Listen to students' use of time-related vocabulary</li>
                  <li>Provide performance tasks where students read clocks</li>
                  <li>Use interviews to assess students' understanding of time concepts</li>
                  <li>Have students create personal timelines</li>
                  <li>Use simple recording sheets for students to document time activities</li>
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
                <li>Measurement tools: rulers, balance scales, measuring cups</li>
                <li>Non-standard measurement units: paper clips, cubes, beans</li>
                <li>Children's books about measurement</li>
                <li>Manipulative clocks and calendars</li>
                <li>Digital tools and apps for measurement practice</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle>Cross-Curricular Connections</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="list-disc pl-5 space-y-2">
                <li>Science: Measuring in experiments and observations</li>
                <li>Physical Education: Measuring distances in games and activities</li>
                <li>Art: Creating artwork with specific measurements</li>
                <li>Social Studies: Exploring measurement tools from different cultures</li>
                <li>Language Arts: Using descriptive language for measurement</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
