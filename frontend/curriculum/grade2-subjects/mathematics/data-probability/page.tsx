import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Breadcrumb } from "@/components/breadcrumb"

export default function DataProbability() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 2 Subjects", href: "/curriculum/grade2-subjects" },
          { label: "Mathematics", href: "/curriculum/grade2-subjects/mathematics" },
          { label: "Data Handling and Probability", href: "/curriculum/grade2-subjects/mathematics/data-probability" },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Data Handling and Probability</h1>
        <p className="text-lg mb-4">
          In Grade 2, students develop their skills in collecting, organizing, representing, and interpreting data. They
          learn to create and analyze various types of graphs and begin to understand basic concepts of probability
          through everyday experiences.
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Learning Objectives</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Generate measurement data by measuring lengths of several objects to the nearest whole unit</li>
            <li>
              Show the measurements by making a line plot, where the horizontal scale is marked off in whole-number
              units
            </li>
            <li>Draw a picture graph and a bar graph to represent data with up to four categories</li>
            <li>
              Solve simple put-together, take-apart, and compare problems using information presented in a bar graph
            </li>
            <li>Collect and organize data using tally marks, tables, and charts</li>
            <li>Describe the likelihood of events using words such as certain, likely, unlikely, and impossible</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Key Concepts</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Data collection and organization</li>
            <li>Picture graphs and bar graphs</li>
            <li>Line plots for measurement data</li>
            <li>Data interpretation and analysis</li>
            <li>Basic probability concepts</li>
            <li>Problem-solving with data</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Curriculum Connections</h2>
          <p className="mb-4">
            Data handling and probability connect to many real-world applications and other subject areas:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Science: Collecting and recording data from experiments and observations</li>
            <li>Social Studies: Analyzing data about communities and populations</li>
            <li>Language Arts: Reading and interpreting information from graphs in informational texts</li>
            <li>Health: Tracking and graphing health-related data such as exercise or food choices</li>
            <li>Art: Creating visual representations of data</li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-8">
        <Link href="/curriculum/grade2-subjects/mathematics/measurement" passHref>
          <Button variant="outline">← Measurement</Button>
        </Link>
        <Link href="/curriculum/grade2-subjects/mathematics" passHref>
          <Button variant="outline">Back to Mathematics</Button>
        </Link>
      </div>

      <div className="mt-8">
        <Link href="/curriculum/grade2-subjects/activities/mathematics" passHref>
          <Button className="w-full">View Grade 2 Mathematics Activities</Button>
        </Link>
      </div>
    </div>
  )
}
