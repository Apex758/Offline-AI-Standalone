import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, BarChart3, Database, PieChart, Dice6, TrendingUp, AlertTriangle } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Grade5MathematicsDataProbabilityActivitiesPage() {
  const activities = [
    {
      id: "collection",
      title: "Data Collection Investigation",
      icon: Database,
      difficulty: "Medium",
      time: "50 mins",
      color: "from-blue-500 to-cyan-500",
      description:
        "Data collection and analysis projects, graph creation and interpretation tasks, and statistical reasoning problem solving.",
      materials: "Survey forms, clipboards, computers, graphing tools, presentation boards",
      procedure: [
        "Have students brainstorm research questions that can be answered using data.",
        "Guide students in designing surveys or experiments to collect relevant data.",
        "Provide students with tools to organize and analyze the collected data.",
        "Have students create graphs and charts to visually represent their findings.",
        "Encourage students to draw conclusions and make recommendations based on their data analysis.",
      ],
    },
    {
      id: "display",
      title: "Data Display Mastery",
      icon: PieChart,
      difficulty: "Hard",
      time: "60 mins",
      color: "from-green-500 to-emerald-500",
      description:
        "Probability experiment design and execution, real-world data investigation projects, and peer presentation of data findings.",
      materials: "Probability tools (dice, cards, spinners), data recording sheets, presentation materials",
      procedure: [
        "Have students design and conduct probability experiments using dice, cards, or spinners.",
        "Instruct students to record the outcomes of their experiments and organize the data.",
        "Provide students with real-world data sets to investigate and analyze.",
        "Have students present their findings to the class, explaining their data collection and analysis methods.",
      ],
    },
    {
      id: "statistics",
      title: "Statistical Reasoning Workshop",
      icon: TrendingUp,
      difficulty: "Hard",
      time: "55 mins",
      color: "from-purple-500 to-indigo-500",
      description:
        "Data collection and analysis projects, graph creation and interpretation tasks, and statistical reasoning problem solving.",
      materials: "Data sets, calculators, graphing tools, statistical software",
      procedure: [
        "Provide students with data sets from various sources (e.g., sports statistics, weather data, survey results).",
        "Have students calculate measures of central tendency (mean, median, mode) and variability (range, standard deviation).",
        "Instruct students to create graphs and charts to visualize the data and identify patterns.",
        "Have students use statistical reasoning to draw conclusions and make predictions based on the data.",
      ],
    },
    {
      id: "probability",
      title: "Probability Experiments Lab",
      icon: Dice6,
      difficulty: "Medium",
      time: "45 mins",
      color: "from-orange-500 to-red-500",
      description:
        "Probability experiment design and execution, real-world data investigation projects, and peer presentation of data findings.",
      materials: "Probability tools (dice, cards, spinners), data recording sheets, presentation materials",
      procedure: [
        "Have students design and conduct probability experiments using dice, cards, or spinners.",
        "Instruct students to record the outcomes of their experiments and calculate the probabilities of different events.",
        "Provide students with real-world data sets to investigate and analyze.",
        "Have students present their findings to the class, explaining their data collection and analysis methods.",
      ],
    },
    {
      id: "decision",
      title: "Data-Driven Decision Making",
      icon: BarChart3,
      difficulty: "Hard",
      time: "65 mins",
      color: "from-pink-500 to-rose-500",
      description:
        "Students analyze data to make informed decisions in real-world scenarios, such as resource allocation or policy recommendations.",
      materials: "Data sets, decision-making templates, presentation tools",
      procedure: [
        "Present students with real-world scenarios that require data-driven decision making (e.g., allocating resources for a school project, recommending policies for a community issue).",
        "Have students analyze the available data and identify key trends and patterns.",
        "Instruct students to use the data to make informed decisions and justify their recommendations.",
        "Have students present their decision-making process and the rationale behind their choices.",
      ],
    },
    {
      id: "misleading",
      title: "Misleading Graphs Investigation",
      icon: AlertTriangle,
      difficulty: "Medium",
      time: "40 mins",
      color: "from-teal-500 to-blue-500",
      description:
        "Students analyze misleading graphs and identify techniques used to distort data, promoting critical thinking and data literacy.",
      materials: "Examples of misleading graphs, analysis worksheets, presentation tools",
      procedure: [
        "Provide students with examples of misleading graphs from various sources (e.g., newspapers, magazines, websites).",
        "Have students analyze the graphs and identify techniques used to distort the data (e.g., manipulated scales, cherry-picked data).",
        "Instruct students to create corrected versions of the graphs that accurately represent the data.",
        "Have students present their findings and explain the techniques used to mislead viewers.",
      ],
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 5 Subjects", href: "/curriculum/grade5-subjects" },
          { label: "Mathematics", href: "/curriculum/grade5-subjects/mathematics" },
          { label: "Activities", href: "/curriculum/grade5-subjects/activities/mathematics" },
          { label: "Data & Probability", href: "/curriculum/grade5-subjects/activities/mathematics/data-probability" },
        ]}
      />

      <Link href="/curriculum/grade5-subjects/mathematics/data-probability">
        <Button variant="outline" className="mb-6 hover:bg-gray-50 transition-colors">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Data & Probability
        </Button>
      </Link>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 opacity-90"></div>
        <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <BarChart3 className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">Data Handling & Probability Activities</h1>
          <p className="text-xl text-white/90 text-center max-w-3xl mx-auto leading-relaxed">
            Engaging activities designed to enhance skills in collecting, organizing, interpreting data, and
            understanding probability concepts.
          </p>
        </div>
      </div>

      {/* Activities Accordion */}
      <Card className="border-2 border-cyan-200">
        <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
          <CardTitle className="text-2xl text-cyan-700 flex items-center space-x-2">
            <BarChart3 className="h-6 w-6" />
            <span>Data Analysis & Probability Activities</span>
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Develop data literacy through {activities.length} interactive and analytical activities
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="space-y-4">
            {activities.map((activity) => {
              const IconComponent = activity.icon
              return (
                <AccordionItem
                  key={activity.id}
                  value={activity.id}
                  className="border-2 border-gray-200 rounded-lg px-4 hover:border-cyan-300 transition-colors"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center space-x-4 w-full">
                      <div className={`p-3 bg-gradient-to-r ${activity.color} rounded-lg text-white shadow-lg`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-lg font-semibold text-gray-800">{activity.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getDifficultyColor(activity.difficulty)}>{activity.difficulty}</Badge>
                        <Badge variant="outline" className="bg-cyan-50 text-cyan-700">
                          {activity.time}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6">
                    <div className="space-y-6">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">🎯 Learning Objective</h4>
                        <p className="text-gray-700">{activity.description}</p>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2 flex items-center">🧰 Materials Needed</h4>
                        <p className="text-gray-700">{activity.materials}</p>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                          📋 Step-by-Step Procedure
                        </h4>
                        <ol className="space-y-2 text-gray-700">
                          {activity.procedure.map((step, index) => (
                            <li key={index} className="flex">
                              <span className="mr-3 font-semibold text-green-600 min-w-[24px]">{index + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </CardContent>
      </Card>

      {/* Data Skills Summary */}
      <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-200">
        <h2 className="text-xl font-bold text-center mb-4 text-indigo-700">📈 Essential Data Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center text-sm">
          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold text-indigo-700">Data Collection</div>
            <div className="text-gray-600 text-xs mt-1">Gathering and organizing information</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <div className="text-2xl mb-2">📈</div>
            <div className="font-semibold text-indigo-700">Data Analysis</div>
            <div className="text-gray-600 text-xs mt-1">Finding patterns and trends</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <div className="text-2xl mb-2">🎲</div>
            <div className="font-semibold text-indigo-700">Probability</div>
            <div className="text-gray-600 text-xs mt-1">Understanding chance and likelihood</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <div className="text-2xl mb-2">💭</div>
            <div className="font-semibold text-indigo-700">Critical Thinking</div>
            <div className="text-gray-600 text-xs mt-1">Evaluating data quality and bias</div>
          </div>
        </div>
      </div>
    </div>
  )
}
