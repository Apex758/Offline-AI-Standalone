import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Zap, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function EnergyPage() {
  return (
    <div className="container mx-auto py-8">
      
      <Link href="/curriculum/grade4-subjects/science">
        <Button variant="outline" className="mb-6 border-green-300 text-green-700 hover:bg-green-50">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 4 Science
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-8 rounded-xl shadow-md border border-green-200">
          <h1 className="text-3xl font-bold mb-4 text-green-800 flex items-center">
            <Zap className="mr-3 h-8 w-8 text-green-600" />
            Energy: Forms and Transformations
          </h1>
          <p className="text-green-700 text-lg leading-relaxed">
            Understanding energy and its effects on objects
          </p>
          <p className="text-gray-700 mt-3">
            In Grade 4, students explore different forms of energy and how it is transferred. They investigate potential and kinetic
            energy, and learn how energy is transformed. Students also design solutions to problems involving energy.
          </p>
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-green-800 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5 text-green-600" />
          Grade Four Expectations for Energy
        </h3>

        <Tabs defaultValue="forms">
          <TabsList className="grid w-full grid-cols-2 bg-green-100 border border-green-300">
            <TabsTrigger value="forms" className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-green-800 font-medium">
              Energy Forms & Transfer
            </TabsTrigger>
            <TabsTrigger value="conversion" className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-green-800 font-medium">
              Energy Conversion & Conservation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forms" className="p-4 border-2 rounded-md mt-2 bg-green-50 border-green-300">
            <h4 className="font-semibold mb-2 text-green-800">
              Essential Learning Outcome 1: Use evidence to construct an explanation relating the speed of an object to
              the energy of that object
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4 text-gray-700">
              <li>Identify different forms of energy (kinetic, potential, thermal, electrical, light, sound)</li>
              <li>Demonstrate how energy can be transferred from one object to another</li>
              <li>Investigate the relationship between speed and energy in moving objects</li>
              <li>Design and conduct experiments to show how energy changes form</li>
              <li>Collect and analyze data on energy transfer in simple systems</li>
            </ul>
          </TabsContent>

          <TabsContent value="conversion" className="p-4 border-2 rounded-md mt-2 bg-green-50 border-green-300">
            <h4 className="font-semibold mb-2 text-green-800">
              Essential Learning Outcome 2: Make observations to provide evidence that energy can be transferred from
              place to place by sound, light, heat, and electric currents
            </h4>
            <ul className="list-disc pl-5 space-y-2 mt-4 text-gray-700">
              <li>
                Apply scientific ideas to design, test, and refine a device that converts energy from one form to
                another
              </li>
              <li>Investigate how energy is conserved in a closed system</li>
              <li>Observe and explain how energy can be converted to meet human needs</li>
              <li>Compare and contrast renewable and non-renewable energy sources</li>
              <li>Communicate experimental results through models and diagrams</li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-green-500 shadow-md hover:shadow-lg transition-all duration-300 border border-green-200">
          <CardHeader className="bg-green-50 border-b border-green-200">
            <CardTitle className="text-green-800 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5 text-green-600" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription className="text-green-700">By the end of Grade Four, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-2 border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md text-green-800 font-medium">
                  Understanding Energy Forms and Transfer
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md border-t border-green-200">
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>
                      Identify the main forms of energy: kinetic, potential, thermal, electrical, light, and sound
                    </li>
                    <li>Explain how energy can be transferred from one object or system to another</li>
                    <li>Demonstrate the relationship between the speed of an object and its energy</li>
                    <li>Recognize that energy can be stored in different ways and released when needed</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-2 border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md text-green-800 font-medium">
                  Energy Conversion and Applications
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md border-t border-green-200">
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Demonstrate how energy can be converted from one form to another</li>
                    <li>Design and build simple devices that convert energy between forms</li>
                    <li>Explain how humans use energy conversions to meet their needs</li>
                    <li>Measure different materials when making models of devices used in the production of energy</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-2 border-green-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-green-50 px-4 py-2 rounded-md text-green-800 font-medium">
                  Energy Resources and Conservation
                </AccordionTrigger>
                <AccordionContent className="bg-green-50 px-4 py-2 rounded-b-md border-t border-green-200">
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Distinguish between renewable and non-renewable energy sources</li>
                    <li>Explain the importance of energy conservation and efficiency</li>
                    <li>Describe how human activities can impact energy resources and the environment</li>
                    <li>Propose solutions for reducing energy waste in school and at home</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-green-500 shadow-md hover:shadow-lg transition-all duration-300 border border-green-200">
            <CardHeader className="bg-green-50 border-b border-green-200">
              <CardTitle className="text-green-800 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5 text-green-600" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-700">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>
                  <strong className="text-green-800">Observations:</strong> Teacher observations during energy
                  experiments, device construction, and energy conversion demonstrations
                </li>
                <li>
                  <strong className="text-green-800">Conversations:</strong> Student explanations of energy forms,
                  transfers, and applications in daily life
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                <h4 className="font-semibold mb-2 text-green-800">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Performance tasks involving energy transfer and transformation concepts</li>
                  <li>Energy conversion device design and testing rubrics</li>
                  <li>Science journals for recording observations, data, and reflections</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-green-200">
            <CardHeader className="bg-green-50 border-b border-green-200">
              <CardTitle className="text-green-800">Inclusive Learning Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="strategy-1" className="border-green-200">
                  <AccordionTrigger className="text-green-800 hover:bg-green-50 px-2 rounded">Understanding Energy Forms</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>Use visual demonstrations of different energy forms in action</li>
                      <li>Relate energy concepts to everyday experiences students can recognize</li>
                      <li>Create hands-on stations where students can explore different energy forms</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2" className="border-green-200">
                  <AccordionTrigger className="text-green-800 hover:bg-green-50 px-2 rounded">Energy Transfer and Conversion</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>Guide students to build simple devices that demonstrate energy conversion</li>
                      <li>Create activities that engage students in testing different energy transfer methods</li>
                      <li>Use role-play activities where students act as energy particles moving through systems</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border border-green-200">
        <CardHeader className="bg-green-50 border-b border-green-200">
          <CardTitle className="text-green-800">Additional Resources and Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-green-800">For Teachers</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Materials for creating energy conversion demonstrations</li>
                <li>Charts and diagrams showing energy transformations</li>
                <li>Renewable and non-renewable energy information and case studies</li>
                <li>Videos and images of energy forms and conversions</li>
                <li>OECS Grade 4 Science Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-green-800">For Students</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Science journals for recording observations and reflections</li>
                <li>Materials for creating energy conversion devices</li>
                <li>Energy vocabulary cards and concept maps</li>
                <li>Visual aids and reference materials</li>
                <li>Simple circuit components and materials for energy experiments</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <h3 className="font-semibold mb-2 text-green-800">Teacher Content Knowledge</h3>
            <p className="text-gray-700">
              Energy in Grade 4 enables students to develop a deeper understanding of how energy exists in different
              forms, transfers between objects and systems, and can be converted from one form to another. Students
              learn about energy sources, conservation principles, and practical applications that affect their daily
              lives and future sustainability.
            </p>
          </div>

          
        </CardContent>
      </Card>
    </div>
  )
}