import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Users,
  Clock,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Search,
  CloudRain,
  Gamepad2,
  Dice6,
} from "lucide-react"
import Link from "next/link"
import { Breadcrumb } from "@/components/breadcrumb"

export default function Grade6DataProbabilityActivitiesPage() {
  const activities = [
    {
      id: "school-survey-investigation",
      title: "School Survey Statistical Investigation",
      outcome: "D1.1 - Formulating Questions",
      duration: "Multiple sessions (3-4 days)",
      difficulty: "Advanced",
      groupSize: "Small Groups (4-5)",
      icon: Search,
      description:
        "Students conduct a complete statistical investigation from question formulation to data presentation and analysis.",
      materials: [
        "Survey forms and clipboards",
        "Graphing materials (paper, digital tools)",
        "Calculators",
        "Statistical analysis templates",
        "Presentation materials",
        "Access to different grade levels",
      ],
      instructions: [
        {
          step: 1,
          title: "Question Brainstorming",
          description:
            "Brainstorm statistical questions about school community. Focus on questions that anticipate variability in responses.",
        },
        {
          step: 2,
          title: "Survey Design",
          description:
            "Design survey with both qualitative and quantitative questions. Consider sample size and data collection methods.",
        },
        {
          step: 3,
          title: "Data Collection",
          description:
            "Collect data from different grade levels using systematic sampling. Record responses carefully and completely.",
        },
        {
          step: 4,
          title: "Data Organization",
          description:
            "Organize data using appropriate graphs (bar, line, histogram). Calculate measures of central tendency.",
        },
        {
          step: 5,
          title: "Presentation and Recommendations",
          description:
            "Present findings to school administration with data-supported recommendations for school improvement.",
        },
      ],
      assessment: {
        formative: [
          "Monitor question formulation quality",
          "Observe data collection techniques",
          "Check graph construction accuracy",
        ],
        summative: [
          "Quality of statistical questions and survey design",
          "Accuracy of data analysis and calculations",
          "Effectiveness of presentation and recommendations",
        ],
      },
      extensions: [
        "Compare findings with previous years' data",
        "Conduct follow-up surveys to test recommendations",
        "Share findings with local newspaper or website",
        "Create interactive digital dashboard of results",
      ],
      realWorldConnections: [
        "Market research and consumer surveys",
        "Political polling and opinion research",
        "Educational assessment and improvement",
        "Community planning and development",
      ],
    },
    {
      id: "weather-pattern-analysis",
      title: "Weather Pattern Analysis",
      outcome: "D2.1 - Describing Data Sets",
      duration: "75-90 minutes",
      difficulty: "Intermediate",
      groupSize: "Pairs",
      icon: CloudRain,
      description:
        "Students analyze local weather data to identify patterns, calculate statistics, and make predictions about climate trends.",
      materials: [
        "Local weather data (temperature, rainfall)",
        "Graphing software or materials",
        "Calculators",
        "Climate comparison charts",
        "Historical weather records",
        "Computers/tablets for research",
      ],
      instructions: [
        {
          step: 1,
          title: "Data Collection Setup",
          description:
            "Collect local weather data for one month from reliable sources. Include temperature, rainfall, and other relevant measures.",
        },
        {
          step: 2,
          title: "Multiple Representations",
          description:
            "Create multiple data representations (line graphs for temperature trends, histograms for rainfall distribution).",
        },
        {
          step: 3,
          title: "Statistical Analysis",
          description:
            "Calculate mean, median, mode, and range for temperature and rainfall. Identify outliers and discuss their significance.",
        },
        {
          step: 4,
          title: "Historical Comparison",
          description: "Compare current month's data to historical averages. Discuss variations and potential causes.",
        },
        {
          step: 5,
          title: "Prediction and Discussion",
          description:
            "Make predictions about future weather patterns. Discuss difference between climate and weather, data reliability.",
        },
      ],
      assessment: {
        formative: [
          "Check data organization and graph accuracy",
          "Monitor statistical calculation processes",
          "Observe pattern recognition and analysis",
        ],
        summative: [
          "Quality of data representations and analysis",
          "Accuracy of statistical measures and calculations",
          "Understanding of climate vs. weather concepts",
        ],
      },
      extensions: [
        "Compare weather patterns across different regions",
        "Investigate climate change data and trends",
        "Create weather forecasting models",
        "Study extreme weather events and their statistics",
      ],
      realWorldConnections: [
        "Meteorology and weather forecasting",
        "Climate science and environmental studies",
        "Agriculture and farming decisions",
        "Emergency planning and disaster preparedness",
      ],
    },
    {
      id: "carnival-game-design",
      title: "Carnival Game Design",
      outcome: "D4.1 - Predicting Likelihood",
      duration: "90-120 minutes",
      difficulty: "Advanced",
      groupSize: "Small Groups (3-4)",
      icon: Gamepad2,
      description:
        "Students design carnival games while exploring probability concepts, fairness, and the relationship between theoretical and experimental probability.",
      materials: [
        "Various game materials (spinners, dice, balls)",
        "Cardboard and craft supplies",
        "Probability calculation sheets",
        "Experiment recording templates",
        "Calculators",
        "Game prize ideas",
      ],
      instructions: [
        {
          step: 1,
          title: "Game Concept Development",
          description:
            "Design carnival games with different probability outcomes. Consider game rules, winning conditions, and prize structures.",
        },
        {
          step: 2,
          title: "Theoretical Probability",
          description:
            "Calculate theoretical probabilities for each game outcome. Determine expected win rates and fairness.",
        },
        {
          step: 3,
          title: "Game Construction",
          description:
            "Build physical games using available materials. Ensure games can be tested multiple times reliably.",
        },
        {
          step: 4,
          title: "Experimental Testing",
          description:
            "Test games with multiple trials to find experimental probabilities. Record results systematically.",
        },
        {
          step: 5,
          title: "Analysis and Presentation",
          description:
            "Compare theoretical vs. experimental results. Present games to other classes and discuss probability concepts.",
        },
      ],
      assessment: {
        formative: [
          "Monitor probability calculation accuracy",
          "Observe game design and construction process",
          "Check experimental data collection methods",
        ],
        summative: [
          "Accuracy of theoretical probability calculations",
          "Quality of experimental design and data collection",
          "Understanding of probability concepts demonstrated",
        ],
      },
      extensions: [
        "Adjust games to make them mathematically 'fair'",
        "Calculate expected profits for carnival operators",
        "Research real casino games and their probability",
        "Design probability-based board games",
      ],
      realWorldConnections: [
        "Gaming industry and casino mathematics",
        "Business probability and risk assessment",
        "Insurance actuarial calculations",
        "Sports betting and odds calculations",
      ],
    },
    {
      id: "two-step-probability-experiments",
      title: "Two-Step Probability Experiments",
      outcome: "D4.2 - Calculating Probabilities",
      duration: "60-75 minutes",
      difficulty: "Advanced",
      groupSize: "Pairs",
      icon: Dice6,
      description:
        "Students explore compound probability through systematic experiments involving multiple steps and create visual representations of outcomes.",
      materials: [
        "Coins, dice, colored balls",
        "Tree diagram templates",
        "Recording sheets",
        "Containers for drawing experiments",
        "Calculators",
        "Chart paper for displays",
      ],
      instructions: [
        {
          step: 1,
          title: "Experiment Design",
          description:
            "Design experiments with two steps (e.g., flip coin then roll die, draw two balls). Define all possible outcomes.",
        },
        {
          step: 2,
          title: "Tree Diagram Creation",
          description:
            "Create tree diagrams showing all possible outcomes systematically. Label branches with probabilities.",
        },
        {
          step: 3,
          title: "Theoretical Calculations",
          description:
            "Calculate theoretical probabilities for compound events using multiplication rule and tree diagrams.",
        },
        {
          step: 4,
          title: "Experimental Trials",
          description:
            "Conduct experiments recording actual results. Use systematic listing to ensure all outcomes are captured.",
        },
        {
          step: 5,
          title: "Comparison and Analysis",
          description:
            "Compare theoretical and experimental probabilities. Discuss why experimental approaches theoretical with more trials.",
        },
      ],
      assessment: {
        formative: [
          "Check tree diagram accuracy and completeness",
          "Monitor systematic outcome listing",
          "Observe probability calculation methods",
        ],
        summative: [
          "Accuracy of tree diagrams and probability calculations",
          "Quality of experimental design and data collection",
          "Understanding of compound probability concepts",
        ],
      },
      extensions: [
        "Explore three-step probability experiments",
        "Investigate conditional probability scenarios",
        "Create probability simulations using technology",
        "Design probability puzzles for other students",
      ],
      realWorldConnections: [
        "Medical testing and diagnostic accuracy",
        "Quality control in manufacturing",
        "Weather prediction and forecasting",
        "Genetics and heredity probabilities",
      ],
    },
  ]

  const learningOutcomes = [
    "Recognize statistical questions that anticipate variability in data",
    "Collect, organize, and display data using appropriate graphs and charts",
    "Determine whether data should be represented by line graphs or point plots",
    "Read, explain patterns, and make predictions from data representations",
    "Calculate and interpret measures of central tendency (mean, median, mode)",
    "Explore events involving two or more steps using systematic methods",
    "Represent compound probability data using charts and tree diagrams",
    "Compare theoretical and experimental probability results",
  ]

  const dataTypes = [
    {
      type: "Categorical Data",
      description: "Data that can be divided into categories",
      examples: ["Favorite colors", "Types of pets", "Survey responses"],
      bestGraphs: ["Bar graph", "Pie chart", "Pictograph"],
    },
    {
      type: "Numerical Data (Discrete)",
      description: "Data that can be counted in whole numbers",
      examples: ["Number of siblings", "Books read", "Test scores"],
      bestGraphs: ["Bar graph", "Line plot", "Histogram"],
    },
    {
      type: "Numerical Data (Continuous)",
      description: "Data that can be measured and includes decimals",
      examples: ["Height", "Weight", "Temperature", "Time"],
      bestGraphs: ["Line graph", "Histogram", "Scatter plot"],
    },
    {
      type: "Time Series Data",
      description: "Data collected over time periods",
      examples: ["Daily temperatures", "Monthly rainfall", "Population growth"],
      bestGraphs: ["Line graph", "Multiple line graph"],
    },
  ]

  const probabilityVocabulary = [
    { term: "Theoretical Probability", definition: "The expected probability based on mathematical analysis" },
    { term: "Experimental Probability", definition: "The actual probability observed through trials and experiments" },
    { term: "Compound Event", definition: "An event that consists of two or more simple events" },
    { term: "Tree Diagram", definition: "A visual representation showing all possible outcomes of compound events" },
    { term: "Sample Space", definition: "The set of all possible outcomes in a probability experiment" },
    { term: "Favorable Outcomes", definition: "The outcomes that satisfy the conditions of an event" },
    { term: "Fair Game", definition: "A game where all players have equal probability of winning" },
    { term: "Bias", definition: "A systematic error that affects the fairness or accuracy of data collection" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Curriculum", href: "/curriculum" },
            { label: "Grade 6 Subjects", href: "/curriculum/grade6-subjects" },
            { label: "Mathematics Activities", href: "/curriculum/grade6-subjects/activities/mathematics" },
            {
              label: "Data & Probability",
              href: "/curriculum/grade6-subjects/activities/mathematics/data-probability",
            },
          ]}
        />

        <Link href="/curriculum/grade6-subjects/activities/mathematics">
          <Button variant="outline" className="mb-6">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Mathematics Activities
          </Button>
        </Link>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Data Handling & Probability Activities</h1>
              <p className="text-xl text-gray-600">Grade 6 Mathematics</p>
            </div>
          </div>

          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Develop statistical literacy and probabilistic reasoning through authentic data investigations and hands-on
            probability experiments. Students learn to collect, analyze, and interpret data while exploring chance and
            uncertainty.
          </p>
        </div>

        {/* Learning Outcomes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-teal-600" />
              Learning Outcomes
            </CardTitle>
            <CardDescription>By the end of these activities, students will be able to:</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {learningOutcomes.map((outcome, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{outcome}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Data Types Reference */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              Types of Data and Appropriate Graphs
            </CardTitle>
            <CardDescription>
              Understanding different data types helps students choose appropriate representations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dataTypes.map((dataType, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{dataType.type}</h4>
                  <p className="text-sm text-gray-600 mb-3">{dataType.description}</p>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-gray-500">Examples:</span>
                      <ul className="text-xs text-gray-600 mt-1">
                        {dataType.examples.map((example, exIndex) => (
                          <li key={exIndex}>• {example}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">Best Graphs:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {dataType.bestGraphs.map((graph, graphIndex) => (
                          <Badge key={graphIndex} variant="outline" className="text-xs">
                            {graph}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activities */}
        <div className="space-y-8 mb-12">
          {activities.map((activity) => {
            const IconComponent = activity.icon
            return (
              <Card key={activity.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-teal-50 to-blue-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900">{activity.title}</CardTitle>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline">{activity.outcome}</Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {activity.duration}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            {activity.groupSize}
                          </div>
                          <Badge
                            variant={
                              activity.difficulty === "Advanced"
                                ? "destructive"
                                : activity.difficulty === "Intermediate"
                                  ? "secondary"
                                  : "default"
                            }
                          >
                            {activity.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-base mt-4">{activity.description}</CardDescription>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Materials */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          Materials Needed
                        </h4>
                        <ul className="space-y-1">
                          {activity.materials.map((material, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                              {material}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Assessment */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Assessment Strategies
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-1">Formative Assessment:</h5>
                            <ul className="space-y-1">
                              {activity.assessment.formative.map((item, index) => (
                                <li key={index} className="text-sm text-gray-600">
                                  • {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-1">Summative Assessment:</h5>
                            <ul className="space-y-1">
                              {activity.assessment.summative.map((item, index) => (
                                <li key={index} className="text-sm text-gray-600">
                                  • {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Instructions */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Step-by-Step Instructions
                        </h4>
                        <div className="space-y-3">
                          {activity.instructions.map((instruction, index) => (
                            <div key={index} className="border-l-4 border-teal-200 pl-4">
                              <h5 className="font-medium text-gray-900 text-sm">
                                Step {instruction.step}: {instruction.title}
                              </h5>
                              <p className="text-sm text-gray-600 mt-1">{instruction.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Real-World Connections */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          Real-World Connections
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {activity.realWorldConnections.map((connection, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {connection}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Extensions */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Extension Activities</h4>
                        <ul className="space-y-1">
                          {activity.extensions.map((extension, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              {extension}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Probability Vocabulary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dice6 className="w-6 h-6 text-purple-600" />
              Key Probability Vocabulary
            </CardTitle>
            <CardDescription>Essential terms students should understand and use correctly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {probabilityVocabulary.map((vocab, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <h4 className="font-semibold text-gray-900 text-sm">{vocab.term}</h4>
                  <p className="text-xs text-gray-600 mt-1">{vocab.definition}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statistical Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-6 h-6 text-green-600" />
              The Statistical Investigation Process
            </CardTitle>
            <CardDescription>A systematic approach to conducting statistical investigations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Formulate Questions</h4>
                <p className="text-sm text-gray-600">
                  Ask statistical questions that anticipate variability in the data
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Collect Data</h4>
                <p className="text-sm text-gray-600">Gather data systematically using appropriate methods and tools</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Analyze Data</h4>
                <p className="text-sm text-gray-600">Create graphs, calculate statistics, and identify patterns</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-orange-600 font-bold">4</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Interpret Results</h4>
                <p className="text-sm text-gray-600">Draw conclusions and make predictions based on the data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-center">
          <Button asChild size="lg">
            <Link href="/curriculum/grade6-subjects/activities/mathematics">
              Return to Mathematics Activities Overview
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
