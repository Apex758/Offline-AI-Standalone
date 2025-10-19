import { Breadcrumb } from "@/components/breadcrumb"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Printer } from "lucide-react"

export default function ProbabilityGamesActivity() {
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
              label: "Probability Games",
              href: "/curriculum/grade2-subjects/activities/mathematics/probability-games",
            },
          ]}
        />
        <ThemeToggle />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Probability Games</h1>
        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
          <span className="mr-4">Time: 35 minutes</span>
          <span>Difficulty: Medium</span>
        </div>
        <img
          src="/placeholder.svg?height=300&width=800&query=probability+games+for+children"
          alt="Probability Games Activity"
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="mb-4">
                In this activity, students explore basic probability concepts through engaging games and experiments.
                They will learn to describe events as "certain," "possible," or "impossible" and begin to develop an
                understanding of likelihood through hands-on experiences.
              </p>
              <p>
                Students will participate in various probability games, make predictions, collect data, and discuss
                outcomes. This foundational work with probability helps students develop critical thinking skills and
                introduces them to important mathematical language for describing chance events.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Learning Objectives</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Describe events as "certain," "possible," or "impossible"</li>
                <li>Use probability vocabulary to describe the likelihood of events</li>
                <li>Make predictions based on probability concepts</li>
                <li>Conduct simple probability experiments and record results</li>
                <li>Compare experimental results with predictions</li>
                <li>Recognize that some events are more likely to occur than others</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Materials</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Spinners with different colored sections</li>
                <li>Number cubes (dice)</li>
                <li>Colored counters or cubes</li>
                <li>Paper bags</li>
                <li>Coins for flipping</li>
                <li>Student recording sheets</li>
                <li>Chart paper for class data collection</li>
                <li>Probability vocabulary cards (certain, possible, impossible, likely, unlikely)</li>
                <li>Pencils and colored markers</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Preparation</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Create or gather spinners with different colored sections</li>
                <li>Prepare paper bags with different colored counters or cubes</li>
                <li>Print student recording sheets for each probability game</li>
                <li>Create a probability vocabulary anchor chart</li>
                <li>Set up probability game stations around the classroom</li>
                <li>Prepare demonstration materials for whole-class introduction</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Steps</h2>
              <ol className="list-decimal pl-6 space-y-4">
                <li>
                  <strong>Introduction (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Introduce the concept of probability using everyday examples</li>
                    <li>Discuss events that are "certain," "possible," or "impossible"</li>
                    <li>Introduce vocabulary: likely, unlikely, equally likely</li>
                    <li>Show examples of probability tools (spinners, dice, colored counters)</li>
                    <li>Explain that probability helps us predict what might happen</li>
                  </ul>
                </li>
                <li>
                  <strong>Whole-Class Demonstration (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Show a spinner with equal red and blue sections</li>
                    <li>Ask students to predict: Is it possible to spin red? Is it certain? Is it impossible?</li>
                    <li>Spin the spinner several times and record results</li>
                    <li>Discuss how the results compare to predictions</li>
                    <li>Introduce the recording sheet and how to track results</li>
                  </ul>
                </li>
                <li>
                  <strong>Probability Game Rotations (20 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>
                      <strong>Game 1: Spinner Challenge</strong> - Students use spinners with different colored sections
                      to make predictions and test outcomes
                    </li>
                    <li>
                      <strong>Game 2: Grab Bag</strong> - Without looking, students grab colored counters from a bag,
                      predict colors, and record results
                    </li>
                    <li>
                      <strong>Game 3: Roll and Record</strong> - Students roll number cubes, predict outcomes, and track
                      which numbers appear most often
                    </li>
                    <li>
                      <strong>Game 4: Coin Flip</strong> - Students flip coins, predict heads or tails, and record
                      results to see patterns
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Class Discussion (5 minutes):</strong>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Gather students to share observations from each game</li>
                    <li>Create a class chart showing results from different games</li>
                    <li>Discuss why some events happened more often than others</li>
                    <li>Review probability vocabulary in context of the games played</li>
                    <li>Connect probability concepts to real-life situations</li>
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
                    <li>Focus on basic concepts of "certain," "possible," and "impossible"</li>
                    <li>Use simplified recording sheets with visual supports</li>
                    <li>Provide sentence frames for discussing probability</li>
                    <li>Use spinners with only two colors initially</li>
                    <li>Work with a partner for support during games</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">For Students Who Need Challenge:</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Introduce more complex probability language (equally likely, more likely, less likely)</li>
                    <li>Use spinners or bags with unequal sections or quantities</li>
                    <li>Create probability experiments with multiple steps or conditions</li>
                    <li>Compare theoretical probability with experimental results</li>
                    <li>Design their own probability games with specific conditions</li>
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
                <li>Appropriate use of probability vocabulary</li>
                <li>Accurate predictions based on probability concepts</li>
                <li>Proper recording of experimental results</li>
                <li>Ability to compare predictions with actual outcomes</li>
                <li>Understanding of why some events are more likely than others</li>
                <li>Application of probability concepts to new situations</li>
              </ul>
              <p className="mt-4">
                Collect and review student recording sheets to assess understanding and identify any misconceptions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Extensions</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create a probability book with examples of certain, possible, and impossible events</li>
                <li>
                  Design and conduct a class survey about favorite colors, foods, or activities and discuss probability
                </li>
                <li>Explore probability in board games that use spinners or dice</li>
                <li>Investigate weather forecasts and how probability is used to predict weather</li>
                <li>Create a probability line showing events from impossible to certain</li>
                <li>Design fair and unfair games and discuss what makes them fair or unfair</li>
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
                      Printable Game Instructions
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Student Recording Sheets
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Probability Vocabulary Cards
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                      Assessment Checklist
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
                    <h3 className="font-medium">Data Handling and Probability:</h3>
                    <p className="text-sm">Understanding likelihood and chance events</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Number Sense:</h3>
                    <p className="text-sm">Counting and comparing frequencies of events</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Language Arts:</h3>
                    <p className="text-sm">Using precise vocabulary to describe probability</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Teacher Tips</h2>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>Use consistent language when discussing probability concepts</li>
                  <li>Create a visual probability scale from impossible to certain</li>
                  <li>Connect probability to everyday decisions and events</li>
                  <li>Allow plenty of trials for each experiment to see patterns emerge</li>
                  <li>Take photos of probability experiments for documentation</li>
                </ul>
              </CardContent>
            </Card>

            <div className="flex justify-between mt-6">
              <Button variant="outline" className="flex items-center gap-2">
                <ChevronLeft size={16} />
                Previous Activity
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                Next Activity
                <ChevronRight size={16} />
              </Button>
            </div>

            <Button variant="outline" className="w-full mt-4 flex items-center justify-center gap-2">
              <Printer size={16} />
              Print Activity
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
