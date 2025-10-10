import type { Metadata } from "next"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Grade 3 Mathematics - Number Sense Activities",
  description: "Activities for Grade 3 Number Sense strand",
}

export default function NumberSenseActivitiesPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 mt-6">
        <h1 className="text-3xl font-bold mb-2">Grade 3 Number Sense Activities</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Engaging activities to help students develop number sense, understand place value, and work with fractions.
        </p>
      </div>

      <Tabs defaultValue="counting">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="counting">Counting & Place Value</TabsTrigger>
          <TabsTrigger value="comparing">Comparing Numbers</TabsTrigger>
          <TabsTrigger value="fractions">Fractions</TabsTrigger>
          <TabsTrigger value="decimals">Decimals</TabsTrigger>
        </TabsList>

        <TabsContent value="counting" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Counting and Place Value Activities</h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="skip-counting">
              <AccordionTrigger className="text-lg font-medium">Skip Counting Games</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Counting Ball Toss</h3>
                    <p className="mb-2">
                      Students toss a ball in a circle while skip counting by 2s, 5s, 10s, or 100s.
                    </p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Soft ball or bean bag</li>
                      <li>Number charts (optional)</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students stand in a circle</li>
                      <li>Teacher selects a skip counting sequence (by 2s, 5s, 10s, or 100s)</li>
                      <li>First student says the first number and tosses the ball to another student</li>
                      <li>Next student says the next number in the sequence and tosses the ball</li>
                      <li>Continue until reaching a predetermined target number</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Number Line Hop</h3>
                    <p className="mb-2">Students physically hop along a number line while skip counting.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Masking tape or chalk</li>
                      <li>Number cards (0-1000)</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Create a number line on the floor with tape or chalk</li>
                      <li>Mark intervals for skip counting (by 2s, 5s, 10s, or 100s)</li>
                      <li>Students take turns hopping along the number line</li>
                      <li>As they hop, they call out the numbers in the sequence</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="place-value">
              <AccordionTrigger className="text-lg font-medium">Place Value Activities</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Place Value Discs</h3>
                    <p className="mb-2">Students use colored discs to represent numbers in different place values.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Place value discs or colored counters</li>
                      <li>Place value mats</li>
                      <li>Number cards (0-1000)</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Give each student or group a place value mat and discs</li>
                      <li>Teacher calls out a number or shows a number card</li>
                      <li>Students represent the number using place value discs</li>
                      <li>Students explain the value of each digit in the number</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Trading Game</h3>
                    <p className="mb-2">
                      Students practice regrouping by trading units for tens and tens for hundreds.
                    </p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Base-ten blocks or place value cards</li>
                      <li>Dice</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students roll a die and collect that many unit blocks</li>
                      <li>When they have 10 units, they trade for 1 ten</li>
                      <li>When they have 10 tens, they trade for 1 hundred</li>
                      <li>First player to reach a predetermined value (e.g., 500) wins</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="comparing" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Comparing Numbers Activities</h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="comparing-numbers">
              <AccordionTrigger className="text-lg font-medium">Comparing and Ordering Numbers</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Greater Than, Less Than</h3>
                    <p className="mb-2">Students use comparison symbols to compare numbers.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Number cards (0-1000)</li>
                      <li>Greater than, less than, and equal to symbols</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students draw two number cards</li>
                      <li>They place the correct comparison symbol between the numbers</li>
                      <li>Students explain their reasoning</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Number Line Placement</h3>
                    <p className="mb-2">Students place numbers on a number line to compare their values.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Large number line</li>
                      <li>Number cards</li>
                      <li>Clothespins or sticky notes</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Create a large number line on the board or floor</li>
                      <li>Students draw number cards</li>
                      <li>They place their numbers on the number line</li>
                      <li>Class discusses the order of the numbers</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="rounding">
              <AccordionTrigger className="text-lg font-medium">Rounding Numbers</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Rounding Relay</h3>
                    <p className="mb-2">Teams compete to round numbers to the nearest 10 or 100.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Number cards (0-1000)</li>
                      <li>Whiteboards and markers</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Divide class into teams</li>
                      <li>Teacher shows a number card</li>
                      <li>First student in each team rounds to nearest 10 or 100</li>
                      <li>Teams earn points for correct answers</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Rounding Scavenger Hunt</h3>
                    <p className="mb-2">Students find numbers around the classroom and round them.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Number cards hidden around the classroom</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Hide number cards around the classroom</li>
                      <li>Students find the cards and record the numbers</li>
                      <li>They round each number to the nearest 10 and 100</li>
                      <li>Class checks answers together</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="fractions" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Fraction Activities</h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="fraction-concepts">
              <AccordionTrigger className="text-lg font-medium">Understanding Fractions</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Fraction Pizza</h3>
                    <p className="mb-2">Students create paper pizzas and divide them into equal parts.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Paper plates</li>
                      <li>Colored paper</li>
                      <li>Scissors and glue</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students create paper pizzas using paper plates</li>
                      <li>They divide their pizzas into equal parts (halves, thirds, fourths)</li>
                      <li>Students label each part with the appropriate fraction</li>
                      <li>They can "order" fractions of pizzas from each other</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Fraction Strips</h3>
                    <p className="mb-2">Students create fraction strips to compare fractions.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Colored paper strips</li>
                      <li>Scissors and rulers</li>
                      <li>Markers</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students create equal-sized paper strips</li>
                      <li>They fold and mark each strip into different fractions</li>
                      <li>Students label each part with the appropriate fraction</li>
                      <li>They use the strips to compare fractions</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="fraction-number-line">
              <AccordionTrigger className="text-lg font-medium">Fractions on a Number Line</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Fraction Jump</h3>
                    <p className="mb-2">Students physically jump along a number line to represent fractions.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Masking tape or chalk</li>
                      <li>Fraction cards</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Create a number line from 0 to 1 on the floor</li>
                      <li>Mark equal intervals for fractions</li>
                      <li>Students draw fraction cards</li>
                      <li>They jump to the corresponding position on the number line</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Fraction Clothesline</h3>
                    <p className="mb-2">Students place fractions in order on a clothesline number line.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>String or clothesline</li>
                      <li>Clothespins</li>
                      <li>Fraction cards</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Hang a string across the classroom</li>
                      <li>Mark 0 and 1 at the ends</li>
                      <li>Students place fraction cards in the correct position</li>
                      <li>Class discusses the order of the fractions</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="decimals" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Decimal Activities</h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="decimal-concepts">
              <AccordionTrigger className="text-lg font-medium">Understanding Decimals</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Decimal Models</h3>
                    <p className="mb-2">Students use base-ten blocks to represent decimals.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Base-ten blocks</li>
                      <li>Decimal place value mats</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Establish that a flat represents 1 whole</li>
                      <li>A rod represents 0.1 (one-tenth)</li>
                      <li>A small cube represents 0.01 (one-hundredth)</li>
                      <li>Students represent various decimals using the blocks</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Money Decimals</h3>
                    <p className="mb-2">Students use money to understand decimal concepts.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Play money (dollars and cents)</li>
                      <li>Price tags</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Set up a classroom store with price tags</li>
                      <li>Students practice reading prices as decimals</li>
                      <li>They make purchases and give correct change</li>
                      <li>Students record transactions using decimal notation</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="decimal-conversion">
              <AccordionTrigger className="text-lg font-medium">
                Converting Between Fractions and Decimals
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Fraction-Decimal Match</h3>
                    <p className="mb-2">Students match fraction cards with their decimal equivalents.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Fraction cards (½, ¼, ¾, etc.)</li>
                      <li>Decimal cards (0.5, 0.25, 0.75, etc.)</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Shuffle the cards and place them face down</li>
                      <li>Students take turns flipping two cards</li>
                      <li>If they find a matching fraction and decimal, they keep the pair</li>
                      <li>Player with the most pairs wins</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Decimal Number Line</h3>
                    <p className="mb-2">Students place decimals on a number line.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Number line (0 to 1)</li>
                      <li>Decimal cards</li>
                      <li>Fraction cards</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Create a number line from 0 to 1</li>
                      <li>Mark tenths and hundredths</li>
                      <li>Students place decimal and fraction cards on the line</li>
                      <li>They identify equivalent fractions and decimals</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Online Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Games</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Link to="https://www.splashlearn.com/math-skills/third-grade/number-sense"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    SplashLearn Number Sense Games
                  </Link>
                </li>
                <li>
                  <Link to="https://www.mathplayground.com/grade_3_games.html"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Math Playground Grade 3 Games
                  </Link>
                </li>
                <li>
                  <Link to="https://www.abcya.com/grades/3/numbers"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    ABCya Number Games
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Printable Worksheets</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Link to="https://www.k5learning.com/free-math-worksheets/third-grade-3/place-value-rounding"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    K5 Learning Place Value Worksheets
                  </Link>
                </li>
                <li>
                  <Link to="https://www.mathworksheets4kids.com/grade3.php"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Math Worksheets 4 Kids
                  </Link>
                </li>
                <li>
                  <Link to="https://www.math-drills.com/numbersense.php"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Math Drills Number Sense
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Video Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <Link to="https://www.khanacademy.org/math/cc-third-grade-math/imp-numbers-and-place-value-3"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Khan Academy Place Value
                  </Link>
                </li>
                <li>
                  <Link to="https://www.youtube.com/playlist?list=PLQlHzK9o1Hd8MtT7UT8f6EHsFZF4RQfzL"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Math Antics Number Sense Videos
                  </Link>
                </li>
                <li>
                  <Link to="https://www.brainpop.com/math/numbersandoperations/"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    BrainPOP Math Videos
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
