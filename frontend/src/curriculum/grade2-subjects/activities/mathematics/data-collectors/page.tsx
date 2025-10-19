import { Breadcrumb } from "@/components/breadcrumb"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Printer } from "lucide-react"

export default function DataCollectorsActivity() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Curriculum", href: "/curriculum" },
            { label: "Grade 2 Subjects", href: "/curriculum/grade2-subjects" },
            { label: "Mathematics", href: "/curriculum/grade2-subjects/mathematics" },
            { label: "Activities", href: "/curriculum/grade2-subjects/activities/mathematics" },
            {
              label: "Data Collectors",
              href: "/curriculum/grade2-subjects/activities/mathematics/data-collectors",
            },
          ]}
        />
        <ThemeToggle />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Data Collectors</h1>
        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
          <span className="mr-4">Time: 45 minutes</span>
          <span>Difficulty: Medium</span>
        </div>
        <img
          src="/placeholder.svg?height=300&width=800"
          alt="Data Collectors Activity"
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="mb-4">
                In this activity, students collect, organize, and represent data using pictographs and bar graphs. They
                will conduct surveys, tally responses, and create visual representations of their findings. Students
                learn to interpret data and draw conclusions from their graphs.
              </p>
              <p>
                Students will work as data collectors, gathering information about their classmates' preferences,
                organizing the data systematically, and presenting their findings through various graphical
                representations. This activity develops statistical literacy and analytical thinking skills.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Learning Objectives</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Collect data through surveys and observations</li>
                <li>Organize data using tally marks and frequency tables</li>
                <li>Create pictographs using symbols to represent data</li>
                <li>Construct simple bar graphs with appropriate labels</li>
                <li>Interpret data from graphs and answer questions</li>
                <li>Compare quantities using graph data (most, least, more than, fewer than)</li>
                <li>Draw conclusions and make predictions based on data</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Materials</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Survey question cards with age-appropriate topics</li>
                <li>Data collection recording sheets</li>
                <li>Clipboards and pencils</li>
                <li>Large grid paper or chart paper</li>
                <li>Colored sticky notes</li>
                <li>Markers, crayons, and colored pencils</li>
                <li>Small stickers or stamps for pictographs</li>
                <li>Rulers for creating neat graphs</li>
                <li>Digital timer</li>
                <li>Graph paper templates</li>
                <li>Real objects for concrete graphing (blocks, counters)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Preparation</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Prepare survey question cards with 3-4 answer choices each</li>
                <li>Create data collection templates for student use</li>
                <li>Set up graphing stations with chart paper and supplies</li>
                <li>Prepare example graphs to show different representation methods</li>
                <li>Organize materials for easy distribution and cleanup</li>
                <li>Create anchor charts showing parts of a graph (title, labels, data)</li>
                <li>Plan survey topics that connect to student interests and experiences</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Steps</h2>
              <ol className="list-decimal pl-6 space-y-4">
                <li>
                  <strong>Introduction to Data Collection (8 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Discuss what data means and why we collect information</li>
                    <li>Show examples of graphs from newspapers, magazines, or online</li>
                    <li>Introduce survey vocabulary: data, survey, tally, graph, pictograph, bar graph</li>
                    <li>Demonstrate how to ask survey questions and record responses</li>
                    <li>Model using tally marks to organize data efficiently</li>
                  </ul>
                </li>
                <li>
                  <strong>Data Collection Phase (12 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Students work in pairs, each choosing a different survey question</li>
                    <li>
                      Sample questions: "What's your favorite season?" "How do you get to school?" "What's your favorite
                      subject?"
                    </li>
                    <li>Students survey classmates and record responses using tally marks</li>
                    <li>Encourage systematic data collection (survey each person only once)</li>
                    <li>Teacher circulates to support data collection process</li>
                    <li>Students count tallies and create frequency tables</li>
                  </ul>
                </li>
                <li>
                  <strong>Graph Creation (15 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Students choose to create either a pictograph or bar graph</li>
                    <li>For pictographs: use stickers or drawings to represent each response</li>
                    <li>For bar graphs: color in grid squares to show quantities</li>
                    <li>Ensure graphs include title, labels, and clear representation of data</li>
                    <li>Students work at graphing stations with appropriate materials</li>
                    <li>Teacher provides individual support for graph construction</li>
                  </ul>
                </li>
                <li>
                  <strong>Data Analysis and Sharing (10 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Pairs present their graphs to the class</li>
                    <li>Students describe their findings: "Most students chose..." "The least popular was..."</li>
                    <li>Class asks questions about each graph: "How many more students chose X than Y?"</li>
                    <li>Discuss what the data tells us about the class</li>
                    <li>Make predictions: "If we surveyed another class, what might happen?"</li>
                  </ul>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Differentiation</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">For Students Who Need Support:</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Use concrete objects (blocks, counters) to create physical graphs first</li>
                    <li>Provide pre-made graph templates with clear guidelines</li>
                    <li>Focus on simple survey questions with 2-3 answer choices</li>
                    <li>Work with a partner or adult volunteer for support</li>
                    <li>Use picture symbols instead of abstract representations</li>
                    <li>Allow verbal presentation instead of written analysis</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">For Students Who Need Challenge:</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Create both pictographs and bar graphs for the same data</li>
                    <li>Survey multiple classes and compare results</li>
                    <li>Include more complex survey questions with 5-6 answer choices</li>
                    <li>Calculate differences between categories mathematically</li>
                    <li>Create digital graphs using simple graphing software</li>
                    <li>Design follow-up surveys based on initial findings</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Assessment</h2>
              <p className="mb-4">Observe students during the activity and look for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Systematic and accurate data collection techniques</li>
                <li>Proper use of tally marks and frequency tables</li>
                <li>Clear and accurate graph construction with appropriate labels</li>
                <li>Correct interpretation of data from graphs</li>
                <li>Appropriate use of comparison vocabulary (more, less, most, least)</li>
                <li>Ability to draw reasonable conclusions from data</li>
                <li>Collaborative skills during data collection and presentation</li>
              </ul>
              <p className="mt-4">
                Collect student graphs and data collection sheets to assess understanding. Use exit tickets asking
                students to interpret a simple graph or explain what they learned from their data.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Extensions</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create a class data wall displaying graphs from different surveys throughout the year</li>
                <li>Conduct longitudinal studies tracking changes in preferences over time</li>
                <li>Connect to science by collecting and graphing weather data or plant growth measurements</li>
                <li>Survey families and compare home data with classroom data</li>
                <li>Use technology tools to create digital graphs and presentations</li>
                <li>Explore data from school-wide surveys (favorite lunch, transportation methods)</li>
                <li>Create data stories explaining what graphs reveal about the class community</li>
                <li>Design surveys for other classes and teach younger students about graphing</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Survey Question Cards
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Data Collection Sheets
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Graph Templates
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Assessment Rubric
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Curriculum Connections</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium">Data Analysis and Probability:</h3>
                    <p className="text-sm">Collecting, organizing, and interpreting data</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Number Sense:</h3>
                    <p className="text-sm">Counting, comparing, and analyzing quantities</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Social Studies:</h3>
                    <p className="text-sm">Understanding community preferences and demographics</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Teacher Tips</h2>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>Choose survey topics that genuinely interest students</li>
                  <li>Model proper survey etiquette and respectful data collection</li>
                  <li>Create anchor charts showing the parts of effective graphs</li>
                  <li>Use real-world examples to show how data influences decisions</li>
                  <li>Take photos of student graphs for portfolio documentation</li>
                  <li>Connect data collection to current events or seasonal topics</li>
                </ul>
              </CardContent>
            </Card>

            <div className="flex justify-between mt-6">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <ChevronLeft size={16} />
                Previous Activity
              </Button>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                Next Activity
                <ChevronRight size={16} />
              </Button>
            </div>

            <Button variant="outline" className="w-full mt-4 flex items-center justify-center gap-2 bg-transparent">
              <Printer size={16} />
              Print Activity
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
