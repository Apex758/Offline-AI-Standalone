import type { Metadata } from "next"
import { Breadcrumb } from "@/components/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "Grade 4 Mathematics - Measurement Activities",
  description: "Activities for Grade 4 Measurement strand",
}

export default function MeasurementActivitiesPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 4", href: "/curriculum/grade4-subjects" },
          { label: "Mathematics", href: "/curriculum/grade4-subjects/mathematics" },
          {
            label: "Measurement Activities",
            href: "/curriculum/grade4-subjects/activities/mathematics/measurement",
          },
        ]}
      />

      <div className="mb-8 mt-6 bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-lg border border-teal-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-3/4">
            <h1 className="text-3xl font-bold mb-2 text-teal-800">Grade 4 Measurement Activities</h1>
            <p className="text-gray-600">
              Engaging activities to help students develop measurement skills through practical activities involving
              perimeter, area, volume, and converting between standard units of measurement.
            </p>
          </div>
          <div className="md:w-1/4 flex justify-center mt-4 md:mt-0">
            <img
              src="/placeholder.svg?height=120&width=120&query=measurement rulers math"
              alt="Measurement tools illustration"
              className="rounded-full border-4 border-white shadow-md"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="length-perimeter">
        <TabsList className="grid w-full grid-cols-5 bg-teal-50">
          <TabsTrigger
            value="length-perimeter"
            className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800"
          >
            Length & Perimeter
          </TabsTrigger>
          <TabsTrigger value="area" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800">
            Area
          </TabsTrigger>
          <TabsTrigger
            value="volume-capacity"
            className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800"
          >
            Volume & Capacity
          </TabsTrigger>
          <TabsTrigger
            value="unit-conversions"
            className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800"
          >
            Unit Conversions
          </TabsTrigger>
          <TabsTrigger
            value="online-resources"
            className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800"
          >
            Online Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="length-perimeter" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Length & Perimeter Activities</h2>
          <div className="flex justify-center mb-6">
            <img
              src="/placeholder.svg?height=200&width=400&query=measuring length perimeter math"
              alt="Measuring length and perimeter"
              className="rounded-lg shadow-md"
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="measuring-length">
              <AccordionTrigger className="text-lg font-medium text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-t-md px-4">
                Measuring Length
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-teal-50 dark:bg-slate-800 rounded-md border border-teal-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Measurement Scavenger Hunt</h3>
                    <p className="mb-2">Students measure objects around the classroom or school.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Rulers (metric and customary)</li>
                      <li>Measuring tapes</li>
                      <li>Scavenger hunt lists</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students work in small groups with a scavenger hunt list</li>
                      <li>They find and measure objects of specified lengths</li>
                      <li>Students record measurements in both metric and customary units</li>
                      <li>They compare their findings with other groups</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Estimation Challenge</h3>
                    <p className="mb-2">Students practice estimating lengths before measuring.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Various objects to measure</li>
                      <li>Rulers and measuring tapes</li>
                      <li>Estimation recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students estimate the length of various objects</li>
                      <li>They record their estimates</li>
                      <li>Students measure the actual lengths</li>
                      <li>They calculate the difference between their estimates and actual measurements</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="perimeter-activities">
              <AccordionTrigger className="text-lg font-medium text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-t-md px-4">
                Perimeter Activities
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-teal-50 dark:bg-slate-800 rounded-md border border-teal-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Perimeter of Polygons</h3>
                    <p className="mb-2">Students calculate the perimeter of various polygons.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Polygon templates</li>
                      <li>Grid paper</li>
                      <li>Rulers</li>
                      <li>String or yarn</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students trace polygons on grid paper</li>
                      <li>They measure the length of each side</li>
                      <li>Students calculate the perimeter by adding all side lengths</li>
                      <li>They verify by measuring with string placed around the shape</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Same Perimeter, Different Shapes</h3>
                    <p className="mb-2">Students create different shapes with the same perimeter.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Geoboards and rubber bands</li>
                      <li>Dot paper</li>
                      <li>Rulers</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students are given a specific perimeter (e.g., 24 cm)</li>
                      <li>They create different shapes with that exact perimeter</li>
                      <li>Students record their shapes on dot paper</li>
                      <li>They compare their shapes and discuss the relationship between perimeter and area</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="area" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Area Activities</h2>
          <div className="flex justify-center mb-6">
            <img
              src="/placeholder.svg?height=200&width=400&query=area measurement math grid"
              alt="Area measurement with grid"
              className="rounded-lg shadow-md"
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="area-measurement">
              <AccordionTrigger className="text-lg font-medium text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-t-md px-4">
                Area Measurement
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-teal-50 dark:bg-slate-800 rounded-md border border-teal-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Area of Rectangles</h3>
                    <p className="mb-2">Students explore the area of rectangles using different methods.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Grid paper</li>
                      <li>Square tiles</li>
                      <li>Rulers</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students draw rectangles with specific dimensions</li>
                      <li>They find the area by counting grid squares</li>
                      <li>Students calculate the area using the formula (length × width)</li>
                      <li>They verify by covering the rectangle with square tiles</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Area of Composite Shapes</h3>
                    <p className="mb-2">Students find the area of composite shapes by decomposing them.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Composite shape templates</li>
                      <li>Grid paper</li>
                      <li>Colored pencils</li>
                      <li>Scissors</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students trace composite shapes onto grid paper</li>
                      <li>They decompose the shapes into rectangles</li>
                      <li>Students find the area of each rectangle</li>
                      <li>They add the areas to find the total area of the composite shape</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="area-relationships">
              <AccordionTrigger className="text-lg font-medium text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-t-md px-4">
                Area Relationships
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-teal-50 dark:bg-slate-800 rounded-md border border-teal-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Same Area, Different Perimeters</h3>
                    <p className="mb-2">Students create shapes with the same area but different perimeters.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Geoboards and rubber bands</li>
                      <li>Dot paper</li>
                      <li>Square tiles</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students are given a specific area (e.g., 36 square units)</li>
                      <li>They create different shapes with that exact area</li>
                      <li>Students calculate the perimeter of each shape</li>
                      <li>They discuss why shapes with the same area can have different perimeters</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Area and Perimeter Puzzles</h3>
                    <p className="mb-2">Students solve puzzles involving area and perimeter relationships.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Puzzle cards</li>
                      <li>Grid paper</li>
                      <li>Rulers</li>
                      <li>Colored pencils</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students solve puzzles with clues about area and perimeter</li>
                      <li>They draw possible shapes that match the given constraints</li>
                      <li>Students verify that their shapes meet the given constraints</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="volume-capacity" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Volume & Capacity Activities</h2>
          <div className="flex justify-center mb-6">
            <img
              src="/placeholder.svg?height=200&width=400&query=volume capacity measurement math"
              alt="Volume and capacity measurement"
              className="rounded-lg shadow-md"
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="volume-measurement">
              <AccordionTrigger className="text-lg font-medium text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-t-md px-4">
                Volume Measurement
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-teal-50 dark:bg-slate-800 rounded-md border border-teal-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Volume of Rectangular Prisms</h3>
                    <p className="mb-2">Students calculate the volume of rectangular prisms using different methods.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Rectangular prism templates</li>
                      <li>Cubes</li>
                      <li>Rulers</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students draw rectangular prisms with specific dimensions</li>
                      <li>They find the volume by counting cubes</li>
                      <li>Students calculate the volume using the formula (length × width × height)</li>
                      <li>They verify by filling the prism with cubes</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Capacity Measurement</h3>
                    <p className="mb-2">Students measure capacity using different units.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Measuring cups (metric and customary)</li>
                      <li>Water</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students measure water using different measuring cups</li>
                      <li>They record measurements in both metric and customary units</li>
                      <li>Students compare their findings with other groups</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="volume-capacity-relationships">
              <AccordionTrigger className="text-lg font-medium text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-t-md px-4">
                Volume & Capacity Relationships
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-teal-50 dark:bg-slate-800 rounded-md border border-teal-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Same Volume, Different Shapes</h3>
                    <p className="mb-2">Students create different shapes with the same volume.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Geoboards and rubber bands</li>
                      <li>Dot paper</li>
                      <li>Cubes</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students are given a specific volume (e.g., 27 cubic units)</li>
                      <li>They create different shapes with that exact volume</li>
                      <li>Students calculate the surface area of each shape</li>
                      <li>They discuss why shapes with the same volume can have different surface areas</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Volume and Capacity Puzzles</h3>
                    <p className="mb-2">Students solve puzzles involving volume and capacity relationships.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Puzzle cards</li>
                      <li>Measuring cups</li>
                      <li>Water</li>
                      <li>Colored pencils</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students solve puzzles with clues about volume and capacity</li>
                      <li>They draw possible shapes that match the given constraints</li>
                      <li>Students verify that their shapes meet the given constraints</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="unit-conversions" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Unit Conversions Activities</h2>
          <div className="flex justify-center mb-6">
            <img
              src="/placeholder.svg?height=200&width=400&query=measurement unit conversion math"
              alt="Measurement unit conversions"
              className="rounded-lg shadow-md"
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="length-conversions">
              <AccordionTrigger className="text-lg font-medium text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-t-md px-4">
                Length Conversions
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-teal-50 dark:bg-slate-800 rounded-md border border-teal-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Metric to Customary Conversion</h3>
                    <p className="mb-2">Students convert lengths from metric to customary units.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Conversion charts</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students are given lengths in metric units</li>
                      <li>They convert these lengths to customary units using conversion charts</li>
                      <li>Students record their conversions</li>
                      <li>They compare their findings with other groups</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Customary to Metric Conversion</h3>
                    <p className="mb-2">Students convert lengths from customary to metric units.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Conversion charts</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students are given lengths in customary units</li>
                      <li>They convert these lengths to metric units using conversion charts</li>
                      <li>Students record their conversions</li>
                      <li>They compare their findings with other groups</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="area-volume-conversions">
              <AccordionTrigger className="text-lg font-medium text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-t-md px-4">
                Area & Volume Conversions
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-teal-50 dark:bg-slate-800 rounded-md border border-teal-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Area Conversion</h3>
                    <p className="mb-2">Students convert areas between different units.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Conversion charts</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students are given areas in one unit</li>
                      <li>They convert these areas to another unit using conversion charts</li>
                      <li>Students record their conversions</li>
                      <li>They compare their findings with other groups</li>
                    </ol>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Volume Conversion</h3>
                    <p className="mb-2">Students convert volumes between different units.</p>
                    <h4 className="font-medium mt-3">Materials:</h4>
                    <ul className="list-disc pl-5 mb-2">
                      <li>Conversion charts</li>
                      <li>Recording sheets</li>
                    </ul>
                    <h4 className="font-medium mt-3">Instructions:</h4>
                    <ol className="list-decimal pl-5">
                      <li>Students are given volumes in one unit</li>
                      <li>They convert these volumes to another unit using conversion charts</li>
                      <li>Students record their conversions</li>
                      <li>They compare their findings with other groups</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="online-resources" className="space-y-4 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Online Resources for Measurement</h2>
          <div className="flex justify-center mb-6">
            <img
              src="/placeholder.svg?height=200&width=400&query=digital measurement resources"
              alt="Digital measurement resources and tools"
              className="rounded-lg shadow-md"
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="interactive-measurement">
              <AccordionTrigger className="text-lg font-medium text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-t-md px-4">
                Interactive Measurement Tools
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-teal-50 dark:bg-slate-800 rounded-md border border-teal-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Length and Perimeter Tools</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://www.mathplayground.com/area_perimeter.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Math Playground: Area and Perimeter
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Interactive tool for exploring perimeter of shapes.
                        </p>
                      </li>
                      <li>
                        <a
                          href="https://www.visnos.com/demos/ruler"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Visnos: Virtual Ruler
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Online ruler for measuring length.</p>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Area and Volume Tools</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://www.nctm.org/Classroom-Resources/Illuminations/Interactives/Area-Explorer/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          NCTM Illuminations: Area Explorer
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Interactive tool for exploring area concepts.
                        </p>
                      </li>
                      <li>
                        <a
                          href="https://www.geogebra.org/m/qvmtc7wu"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          GeoGebra: Volume of Rectangular Prisms
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Interactive demonstration of volume.</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="measurement-games">
              <AccordionTrigger className="text-lg font-medium text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-t-md px-4">
                Measurement Games
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-teal-50 dark:bg-slate-800 rounded-md border border-teal-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Length and Perimeter Games</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://www.splashlearn.com/measurement-games"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          SplashLearn: Measurement Games
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Interactive games for practicing measurement concepts.
                        </p>
                      </li>
                      <li>
                        <a
                          href="https://www.mathgames.com/skill/4.104-perimeter"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Math Games: Perimeter
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Games focused on perimeter concepts.</p>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Area and Volume Games</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://www.mathgames.com/skill/4.97-area"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Math Games: Area
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Games focused on area concepts.</p>
                      </li>
                      <li>
                        <a
                          href="https://www.mathplayground.com/volume_surface_area.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Math Playground: Volume
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Interactive exploration of volume concepts.
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="conversion-resources">
              <AccordionTrigger className="text-lg font-medium text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-t-md px-4">
                Conversion Resources
              </AccordionTrigger>
              <AccordionContent className="p-4 bg-teal-50 dark:bg-slate-800 rounded-md border border-teal-100 dark:border-slate-700">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Metric Conversions</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://www.mathsisfun.com/measure/metric-conversion.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Math is Fun: Metric Conversion
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Interactive tool for metric conversions.
                        </p>
                      </li>
                      <li>
                        <a
                          href="https://www.khanacademy.org/math/cc-fourth-grade-math/cc-4th-measurement-topic"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Khan Academy: Measurement
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Video lessons and practice on measurement conversions.
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Customary Conversions</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://www.mathsisfun.com/measure/us-standard-units-introduction.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Math is Fun: US Standard Units
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Explanation and practice with customary units.
                        </p>
                      </li>
                      <li>
                        <a
                          href="https://www.mathplayground.com/measurement.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Math Playground: Measurement Games
                        </a>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Games for practicing measurement conversions.
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
