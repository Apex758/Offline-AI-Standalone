import type { Metadata } from "next"
import { Breadcrumb } from "@/components/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Grade 4 Mathematics - Number Sense Activities",
  description: "Activities for Grade 4 Number Sense strand",
}

export default function NumberSenseActivitiesPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 4", href: "/curriculum/grade4-subjects" },
          { label: "Mathematics", href: "/curriculum/grade4-subjects/mathematics" },
          {
            label: "Number Sense Activities",
            href: "/curriculum/grade4-subjects/activities/mathematics/number-sense",
          },
        ]}
      />

      <div className="mb-8 mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-3/4">
            <h1 className="text-3xl font-bold mb-2 text-blue-800">Grade 4 Number Sense Activities</h1>
            <p className="text-gray-600">
              Engaging activities to help students develop number sense, understand place value, and work with fractions
              and decimals.
            </p>
          </div>
          <div className="md:w-1/4 flex justify-center mt-4 md:mt-0">
            <img
              src="/math-numbers-fractions.png"
              alt="Number sense illustration"
              className="rounded-full border-4 border-white shadow-md"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="place-value">
        <TabsList className="grid w-full grid-cols-4 bg-blue-50">
          <TabsTrigger
            value="place-value"
            className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
          >
            Place Value
          </TabsTrigger>
          <TabsTrigger value="fractions" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
            Fractions
          </TabsTrigger>
          <TabsTrigger value="decimals" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
            Decimals
          </TabsTrigger>
          <TabsTrigger
            value="online-resources"
            className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
          >
            Online Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="place-value" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Place Value Activities</h2>
          <div className="flex justify-center mb-6">
            <img
              src="/place-value-blocks.png"
              alt="Place value blocks and activities"
              className="rounded-lg shadow-md"
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="place-value-games">
              <AccordionTrigger className="text-lg font-medium text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-t-md px-4">
                Place Value Games
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-blue-50 dark:bg-slate-800 rounded-md border border-blue-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Place Value Bingo</h3>
                    <p className="mb-2">Students play bingo using place value concepts.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Bingo cards with numbers</li>
                      <li>Place value cards (ones, tens, hundreds, thousands)</li>
                      <li>Counters or markers</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Each student gets a bingo card with various numbers</li>
                      <li>Teacher calls out place value clues (e.g., "5 in the hundreds place")</li>
                      <li>Students mark numbers that match the description</li>
                      <li>First student to complete a row, column, or diagonal wins</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Place Value Trading Game</h3>
                    <p className="mb-2">Students practice regrouping using place value blocks.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Base-10 blocks or place value disks</li>
                      <li>Dice</li>
                      <li>Place value mats</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students roll dice and collect that many unit blocks</li>
                      <li>When they have 10 of any value, they trade for the next place value</li>
                      <li>First player to get a specified number (e.g., 1 thousand) wins</li>
                      <li>Students record their trades using place value charts</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="place-value-activities">
              <AccordionTrigger className="text-lg font-medium text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-t-md px-4">
                Place Value Challenges
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-blue-50 dark:bg-slate-800 rounded-md border border-blue-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Number Detective</h3>
                    <p className="mb-2">Students use place value clues to identify mystery numbers.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Clue cards</li>
                      <li>Number cards</li>
                      <li>Whiteboards and markers</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Teacher provides clues about a mystery number</li>
                      <li>Students use place value knowledge to narrow down possibilities</li>
                      <li>They record their thinking on whiteboards</li>
                      <li>Students explain their reasoning when they identify the number</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Expanded Form Challenge</h3>
                    <p className="mb-2">Students convert between standard and expanded form.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Number cards</li>
                      <li>Expanded form cards</li>
                      <li>Timer</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students work in pairs or small groups</li>
                      <li>They match standard form numbers with their expanded form</li>
                      <li>For a challenge, they race against the timer</li>
                      <li>Students create their own expanded form cards for others to solve</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="fractions" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Fraction Activities</h2>
          <div className="flex justify-center mb-6">
            <img
              src="/fraction-circles-math.png"
              alt="Fraction circles and manipulatives"
              className="rounded-lg shadow-md"
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="fraction-concepts">
              <AccordionTrigger className="text-lg font-medium text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-t-md px-4">
                Fraction Concepts
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-blue-50 dark:bg-slate-800 rounded-md border border-blue-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Fraction Art</h3>
                    <p className="mb-2">Students create art projects using fraction concepts.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Colored paper</li>
                      <li>Scissors</li>
                      <li>Glue</li>
                      <li>Rulers</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students divide paper into equal parts using different fractions</li>
                      <li>They color or decorate each fraction in different ways</li>
                      <li>Students label each fraction in their artwork</li>
                      <li>They explain their artwork to the class, using fraction vocabulary</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Fraction Scavenger Hunt</h3>
                    <p className="mb-2">Students find real-world examples of fractions.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Scavenger hunt lists</li>
                      <li>Cameras or drawing materials</li>
                      <li>Clipboards</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students search for real-world examples of fractions</li>
                      <li>They document their findings with photos or drawings</li>
                      <li>Students explain how each example represents a fraction</li>
                      <li>They create a display of their fraction findings</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="equivalent-fractions">
              <AccordionTrigger className="text-lg font-medium text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-t-md px-4">
                Equivalent Fractions
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-blue-50 dark:bg-slate-800 rounded-md border border-blue-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Fraction Families</h3>
                    <p className="mb-2">Students identify and create equivalent fraction families.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Fraction strips or circles</li>
                      <li>Index cards</li>
                      <li>Colored markers</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students create fraction cards with different fractions</li>
                      <li>They sort the cards into "families" of equivalent fractions</li>
                      <li>Students use fraction models to verify equivalence</li>
                      <li>They explain how they know fractions are equivalent</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Equivalent Fraction Memory</h3>
                    <p className="mb-2">Students play a memory game matching equivalent fractions.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Cards with fractions in different forms</li>
                      <li>Cards with fraction models</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Cards are placed face down in rows</li>
                      <li>Students take turns flipping two cards</li>
                      <li>If the cards show equivalent fractions, they keep the pair</li>
                      <li>The player with the most pairs wins</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="decimals" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Decimal Activities</h2>
          <div className="flex justify-center mb-6">
            <img
              src="/placeholder.svg?height=200&width=400&query=decimal number line math"
              alt="Decimal number line and activities"
              className="rounded-lg shadow-md"
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="decimal-concepts">
              <AccordionTrigger className="text-lg font-medium text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-t-md px-4">
                Decimal Concepts
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-blue-50 dark:bg-slate-800 rounded-md border border-blue-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Decimal Models</h3>
                    <p className="mb-2">Students create models to represent decimals.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Base-10 blocks or grid paper</li>
                      <li>Colored pencils</li>
                      <li>Decimal cards</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students draw or use manipulatives to model decimals</li>
                      <li>They label the place value of each digit</li>
                      <li>Students explain their models to partners</li>
                      <li>They create a decimal dictionary with models and explanations</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Decimal Number Line</h3>
                    <p className="mb-2">Students place decimals on a number line.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Number line templates</li>
                      <li>Decimal cards</li>
                      <li>Clothespins or sticky notes</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students create a number line with whole numbers</li>
                      <li>They mark and label tenths and hundredths</li>
                      <li>Students place decimal cards on the correct positions</li>
                      <li>They explain their reasoning for decimal placement</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="decimal-comparison">
              <AccordionTrigger className="text-lg font-medium text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-t-md px-4">
                Decimal Comparison
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-blue-50 dark:bg-slate-800 rounded-md border border-blue-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Decimal War</h3>
                    <p className="mb-2">Students compare decimals in a card game.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Decimal cards (0.1 to 9.9)</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students play in pairs with a deck of decimal cards</li>
                      <li>Each player turns over a card</li>
                      <li>The player with the greater decimal takes both cards</li>
                      <li>The player with the most cards at the end wins</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Decimal Sort</h3>
                    <p className="mb-2">Students sort and order decimal numbers.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Decimal cards</li>
                      <li>Sorting mats</li>
                      <li>Number lines</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students are given a set of decimal cards</li>
                      <li>They sort the decimals in ascending or descending order</li>
                      <li>Students place the decimals on a number line</li>
                      <li>They explain their sorting strategy to the class</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="online-resources" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Online Resources for Number Sense</h2>
          <div className="flex justify-center mb-6">
            <img
              src="/placeholder.svg?height=200&width=400&query=digital math resources"
              alt="Digital math resources and tools"
              className="rounded-lg shadow-md"
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="interactive-games">
              <AccordionTrigger className="text-lg font-medium text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-t-md px-4">
                Interactive Games
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-blue-50 dark:bg-slate-800 rounded-md border border-blue-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Place Value Games</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://www.mathplayground.com/place_value.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Math Playground: Place Value
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Interactive games to practice place value concepts.
                        </p>
                      </li>
                      <li>
                        <a
                          href="https://www.abcya.com/games/place_value_hockey"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          ABCya: Place Value Hockey
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          A fun hockey-themed game to practice place value.
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Fraction and Decimal Resources</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://www.fractions.org.uk/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Visual Fractions
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Interactive tools for visualizing and working with fractions.
                        </p>
                      </li>
                      <li>
                        <a
                          href="https://www.splashlearn.com/decimal-games"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          SplashLearn: Decimal Games
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Games and activities for understanding decimals.
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="video-lessons">
              <AccordionTrigger className="text-lg font-medium text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-t-md px-4">
                Video Lessons
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-blue-50 dark:bg-slate-800 rounded-md border border-blue-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Place Value Videos</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://www.khanacademy.org/math/cc-fourth-grade-math/imp-place-value-and-rounding-2"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Khan Academy: Place Value
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Video lessons on place value for Grade 4 students.
                        </p>
                      </li>
                      <li>
                        <a
                          href="https://www.youtube.com/watch?v=T5Qf0qSYyfA"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Math Antics: Place Value
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Engaging video explaining place value concepts.
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Fraction and Decimal Videos</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://www.khanacademy.org/math/cc-fourth-grade-math/cc-4th-fractions-topic"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Khan Academy: Fractions
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Comprehensive video lessons on fractions.
                        </p>
                      </li>
                      <li>
                        <a
                          href="https://www.youtube.com/watch?v=KEmCZGbd4R8"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Math Antics: Decimal Place Value
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Clear explanation of decimal place value.
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="printable-resources">
              <AccordionTrigger className="text-lg font-medium text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-t-md px-4">
                Printable Resources
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-blue-50 dark:bg-slate-800 rounded-md border border-blue-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Worksheets and Activities</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://www.mathworksheets4kids.com/place-value.php"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Math Worksheets 4 Kids: Place Value
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Printable worksheets for place value practice.
                        </p>
                      </li>
                      <li>
                        <a
                          href="https://www.mathworksheets4kids.com/fractions.php"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Math Worksheets 4 Kids: Fractions
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Printable worksheets for fraction practice.
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Assessment Resources</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://www.k5learning.com/free-math-worksheets/fourth-grade-4"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          K5 Learning: Grade 4 Math
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Free printable math worksheets for Grade 4.
                        </p>
                      </li>
                      <li>
                        <a
                          href="https://www.commoncoresheets.com/SortedByGrade.php?Sorted=4th"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Common Core Sheets: Grade 4
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Standards-aligned worksheets for assessment.
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  )
}
