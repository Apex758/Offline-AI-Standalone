import type { Metadata } from "next"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Grade 3 Mathematics - Measurement Activities",
  description: "Activities for Grade 3 Measurement strand",
}

export default function MeasurementActivitiesPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 mt-6">
        <h1 className="text-3xl font-bold mb-2">Grade 3 Measurement Activities</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Engaging activities to help students understand and apply measurement concepts including length, area,
          perimeter, and time.
        </p>
      </div>

      <Tabs defaultValue="length">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="length">Length</TabsTrigger>
          <TabsTrigger value="area-perimeter">Area & Perimeter</TabsTrigger>
          <TabsTrigger value="mass-capacity">Mass & Capacity</TabsTrigger>
          <TabsTrigger value="time-money">Time & Money</TabsTrigger>
        </TabsList>

        <TabsContent value="length" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Length Measurement Activities</h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="non-standard-units">
              <AccordionTrigger className="text-lg font-medium">Non-Standard Units of Measurement</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Measuring with Body Parts</h3>
                    <p className="mb-2">Students use their hands, feet, and arms to measure objects.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Recording sheets</li>
                      <li>Various classroom objects</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students measure objects using handspans, foot spans, or arm lengths</li>
                      <li>They record their measurements</li>
                      <li>Students compare their measurements with classmates</li>
                      <li>Discuss why measurements might differ and the need for standard units</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Measuring with Objects</h3>
                    <p className="mb-2">Students use classroom objects as non-standard units of measurement.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Paper clips, pencils, erasers</li>
                      <li>Recording sheets</li>
                      <li>Various classroom objects to measure</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students select a non-standard unit (paper clips, pencils, etc.)</li>
                      <li>They measure various objects using their chosen unit</li>
                      <li>Students record their measurements</li>
                      <li>Class discusses the advantages and limitations of non-standard units</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="standard-units">
              <AccordionTrigger className="text-lg font-medium">Standard Units of Measurement</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Centimeter and Meter Hunt</h3>
                    <p className="mb-2">Students find objects that measure approximately 1 cm, 10 cm, and 1 m.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Rulers and meter sticks</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students search for objects that measure approximately 1 cm, 10 cm, and 1 m</li>
                      <li>They verify measurements using rulers and meter sticks</li>
                      <li>Students record their findings</li>
                      <li>Class creates a display of objects sorted by length</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Estimation Station</h3>
                    <p className="mb-2">Students estimate lengths before measuring with standard units.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Various objects to measure</li>
                      <li>Rulers and meter sticks</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Set up stations with different objects</li>
                      <li>Students estimate the length of each object in cm or m</li>
                      <li>They measure the actual length using rulers or meter sticks</li>
                      <li>Students compare their estimates to the actual measurements</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="area-perimeter" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Area and Perimeter Activities</h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="perimeter-activities">
              <AccordionTrigger className="text-lg font-medium">Perimeter Activities</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Perimeter Walk</h3>
                    <p className="mb-2">Students physically walk the perimeter of shapes and spaces.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Masking tape or chalk</li>
                      <li>Measuring tools</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Create large shapes on the floor or playground using tape or chalk</li>
                      <li>Students walk around the perimeter of each shape</li>
                      <li>They count their steps or measure the distance</li>
                      <li>Students calculate the perimeter of each shape</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">String Perimeters</h3>
                    <p className="mb-2">Students use string to measure the perimeter of irregular shapes.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>String or yarn</li>
                      <li>Rulers</li>
                      <li>Irregular shape templates</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Provide students with irregular shape templates</li>
                      <li>They place string around the perimeter of each shape</li>
                      <li>Students measure the length of string used</li>
                      <li>They record the perimeter of each shape</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="area-activities">
              <AccordionTrigger className="text-lg font-medium">Area Activities</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Covering Shapes</h3>
                    <p className="mb-2">Students cover shapes with unit squares to find area.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Unit squares (1 cm² or 1 inch²)</li>
                      <li>Shape templates</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Provide students with various shape templates</li>
                      <li>They cover each shape with unit squares</li>
                      <li>Students count the squares to find the area</li>
                      <li>They record the area of each shape in square units</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Grid Paper Areas</h3>
                    <p className="mb-2">Students draw shapes on grid paper and calculate their areas.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Grid paper (1 cm or 1 inch squares)</li>
                      <li>Colored pencils</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students draw rectangles and other shapes on grid paper</li>
                      <li>They count the squares to find the area</li>
                      <li>For partial squares, students decide whether to count them or not</li>
                      <li>They compare areas of different shapes</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="area-perimeter-relationship">
              <AccordionTrigger className="text-lg font-medium">
                Relationship Between Area and Perimeter
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Same Area, Different Perimeter</h3>
                    <p className="mb-2">Students create shapes with the same area but different perimeters.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Grid paper</li>
                      <li>Colored pencils</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students create shapes with a specific area (e.g., 16 square units)</li>
                      <li>They calculate the perimeter of each shape</li>
                      <li>Students compare the perimeters of shapes with the same area</li>
                      <li>Class discusses why shapes with the same area can have different perimeters</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Same Perimeter, Different Area</h3>
                    <p className="mb-2">Students create shapes with the same perimeter but different areas.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Grid paper</li>
                      <li>Colored pencils</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students create shapes with a specific perimeter (e.g., 16 units)</li>
                      <li>They calculate the area of each shape</li>
                      <li>Students compare the areas of shapes with the same perimeter</li>
                      <li>Class discusses why shapes with the same perimeter can have different areas</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="mass-capacity" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Mass and Capacity Activities</h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="mass-activities">
              <AccordionTrigger className="text-lg font-medium">Mass Measurement Activities</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Balance Scale Explorations</h3>
                    <p className="mb-2">Students use balance scales to compare the mass of objects.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Balance scales</li>
                      <li>Various classroom objects</li>
                      <li>Standard weights (if available)</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students place objects on either side of a balance scale</li>
                      <li>They determine which object is heavier or lighter</li>
                      <li>Students order objects from lightest to heaviest</li>
                      <li>If standard weights are available, they measure the mass of objects</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Estimation Station: Mass</h3>
                    <p className="mb-2">Students estimate the mass of objects before measuring.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Various objects with different masses</li>
                      <li>Balance scales or digital scales</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Set up stations with different objects</li>
                      <li>Students hold each object and estimate its mass</li>
                      <li>They measure the actual mass using scales</li>
                      <li>Students compare their estimates to the actual measurements</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="capacity-activities">
              <AccordionTrigger className="text-lg font-medium">Capacity Measurement Activities</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Container Comparisons</h3>
                    <p className="mb-2">Students compare the capacity of different containers.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Various containers (cups, bottles, jars)</li>
                      <li>Water or rice</li>
                      <li>Measuring cups</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students fill one container with water or rice</li>
                      <li>They pour the contents into another container</li>
                      <li>Students determine which container holds more or less</li>
                      <li>They order containers from smallest to largest capacity</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Estimation Station: Capacity</h3>
                    <p className="mb-2">Students estimate the capacity of containers before measuring.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Various containers</li>
                      <li>Water or rice</li>
                      <li>Measuring cups or graduated cylinders</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Set up stations with different containers</li>
                      <li>Students estimate the capacity of each container</li>
                      <li>They measure the actual capacity using measuring cups</li>
                      <li>Students compare their estimates to the actual measurements</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="time-money" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Time and Money Activities</h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="time-activities">
              <AccordionTrigger className="text-lg font-medium">Time Measurement Activities</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Clock Bingo</h3>
                    <p className="mb-2">Students play bingo with analog and digital time.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Bingo cards with analog or digital times</li>
                      <li>Calling cards with corresponding times</li>
                      <li>Markers or counters</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Give each student a bingo card with times</li>
                      <li>Teacher shows an analog or digital time</li>
                      <li>Students mark the corresponding time on their card</li>
                      <li>First student to get a row, column, or diagonal wins</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Daily Schedule</h3>
                    <p className="mb-2">Students create a daily schedule with analog and digital times.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Schedule templates</li>
                      <li>Clock stamps or stickers</li>
                      <li>Colored pencils</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students create a schedule of their daily activities</li>
                      <li>They draw analog clocks showing the time of each activity</li>
                      <li>Students also write the digital time</li>
                      <li>They calculate elapsed time between activities</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="money-activities">
              <AccordionTrigger className="text-lg font-medium">Money Activities</AccordionTrigger>
              <AccordionContent className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Classroom Store</h3>
                    <p className="mb-2">Students practice making purchases and giving change.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Play money</li>
                      <li>Items with price tags</li>
                      <li>Cash register (optional)</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Set up a store with priced items</li>
                      <li>Students take turns being customers and cashiers</li>
                      <li>Customers make purchases and count out money</li>
                      <li>Cashiers verify amounts and give correct change</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Money Combinations</h3>
                    <p className="mb-2">Students find different ways to make the same amount of money.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Play money (coins and bills)</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Give students a target amount (e.g., $1.25)</li>
                      <li>They find different combinations of coins and bills to make that amount</li>
                      <li>Students record each combination</li>
                      <li>Class discusses which combination uses the fewest coins/bills</li>
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
                  <Link to="https://www.splashlearn.com/math-skills/third-grade/measurements"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    SplashLearn Measurement Games
                  </Link>
                </li>
                <li>
                  <Link to="https://www.mathplayground.com/grade_3_games.html"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Math Playground Measurement Games
                  </Link>
                </li>
                <li>
                  <Link to="https://www.abcya.com/grades/3/skill/measurement"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    ABCya Measurement Games
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
                  <Link to="https://www.k5learning.com/free-math-worksheets/third-grade-3/measurement"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    K5 Learning Measurement Worksheets
                  </Link>
                </li>
                <li>
                  <Link to="https://www.mathworksheets4kids.com/measurement.php"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Math Worksheets 4 Kids Measurement
                  </Link>
                </li>
                <li>
                  <Link to="https://www.math-salamanders.com/3rd-grade-measurement-worksheets.html"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Math Salamanders Measurement Worksheets
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
                  <Link to="https://www.khanacademy.org/math/cc-third-grade-math/3rd-measure-data"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Khan Academy Measurement
                  </Link>
                </li>
                <li>
                  <Link to="https://www.youtube.com/playlist?list=PLQlHzK9o1Hd8MtT7UT8f6EHsFZF4RQfzL"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Math Antics Measurement Videos
                  </Link>
                </li>
                <li>
                  <Link to="https://www.brainpop.com/math/geometryandmeasurement/"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    BrainPOP Measurement Videos
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
