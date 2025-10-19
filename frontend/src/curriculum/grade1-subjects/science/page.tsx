import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Grade1Science() {
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Grade 1 Science Curriculum</h1>
        <Link to="/curriculum/grade1-subjects"><Button>Back to Grade 1 Curriculum</Button></Link>
      </div>

      <div className="grid gap-6 space-y-2">
        <Card>
          <CardContent className="pt-6 px-4 sm:px-6">
            <p className="mb-4 leading-relaxed">
              The Grade 1 Science curriculum nurtures students' natural curiosity about the world around them. Through
              hands-on investigations and guided inquiry, students develop scientific thinking skills as they explore
              living things, materials, energy, and Earth systems.
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="strands">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
            <TabsTrigger value="strands">Curriculum Strands</TabsTrigger>
            <TabsTrigger value="approach">Teaching Approach</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="strands" className="space-y-8 pt-8 mt-12">
            <h4 className="text-xl font-semibold mb-4">Science Strands</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 px-4 sm:px-6">
                  <h3 className="text-xl font-semibold mb-3">Waves, Lights and Sounds</h3>
                  <p className="mb-4 leading-relaxed">
                    Students explore sound vibrations, light sources, and communication through hands-on investigations.
                    They learn how vibrating materials make sound, how we see objects when illuminated, and how light
                    and sound can be used to communicate over distances.
                  </p>
                  <Link to="/curriculum/grade1-subjects/science/waves-lights-sounds"><Button>View Strand</Button></Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 px-4 sm:px-6">
                  <h3 className="text-xl font-semibold mb-3">Structure, Function, and Information Processing</h3>
                  <p className="mb-4 leading-relaxed">
                    Students explore how plants and animals use their external parts to survive, grow, and meet their
                    needs. They learn about parent-offspring relationships and discover how humans can mimic nature to
                    solve problems.
                  </p>
                  <Link to="/curriculum/grade1-subjects/science/structure-function-processing"><Button>View Strand</Button></Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 px-4 sm:px-6">
                  <h3 className="text-xl font-semibold mb-3">Space Systems: Patterns and Cycles</h3>
                  <p className="mb-4 leading-relaxed">
                    Students explore patterns in the sky by observing the sun, moon, and stars. They learn about day and
                    night cycles, track the moon's changing shapes, and discover how celestial objects follow
                    predictable patterns.
                  </p>
                  <Link to="/curriculum/grade1-subjects/science/space-systems"><Button>View Strand</Button></Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 px-4 sm:px-6">
                  <h3 className="text-xl font-semibold mb-3">Scientific Inquiry</h3>
                  <p className="mb-4 leading-relaxed">
                    Students develop the skills and processes of scientific investigation. They learn to ask questions,
                    make predictions, conduct simple experiments, make observations, and communicate their findings.
                  </p>
                  <Link to="/curriculum/grade1-subjects/science/scientific-inquiry"><Button>View Strand</Button></Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="approach" className="space-y-8 pt-8 mt-12">
            <h4 className="text-xl font-semibold mb-4">Teaching Approach</h4>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  The Grade 1 Science curriculum employs an inquiry-based approach that encourages active learning
                  through:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Hands-on investigations that allow students to explore scientific phenomena</li>
                  <li>Guided inquiry that develops scientific thinking and reasoning</li>
                  <li>Observation and documentation of the natural world</li>
                  <li>Integration with other subjects, particularly mathematics and language arts</li>
                  <li>Connections to students' everyday experiences and the local environment</li>
                </ul>
                <p>
                  Assessment focuses on students' understanding of scientific concepts, development of inquiry skills,
                  and ability to communicate their ideas and findings.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-8 pt-8 mt-12">
            <h4 className="text-xl font-semibold mb-4">Teacher Resources</h4>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  The following resources support the implementation of the Grade 1 Science curriculum:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Science kits with materials for hands-on investigations</li>
                  <li>Picture books and non-fiction texts about scientific topics</li>
                  <li>Field guides appropriate for young learners</li>
                  <li>Digital resources including videos, simulations, and interactive activities</li>
                  <li>Local environmental resources and natural areas for field studies</li>
                  <li>Simple scientific tools such as magnifiers, balance scales, and measuring cups</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div className="mt-8 flex justify-center px-4 sm:px-0">
        <Link to="/curriculum/grade1-subjects/activities/science"><Button>View Science Activities</Button></Link>
      </div>
    </div>
  )
}
