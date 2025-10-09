import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ClipboardCheck, BookOpen, Users, Lightbulb, Target, Star } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function SpaceSystemsStarsSolarSystemPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade5-subjects/science">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 5 Science
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-purple-700 flex items-center">
            <Star className="mr-2 h-7 w-7 text-purple-600" />
            Space Systems: Stars and the Solar System
          </h1>
          <p className="text-gray-700 text-lg">
            Explore gravitational forces, investigate star brightness and distances, understand Earth's place in the
            solar system, and discover how space phenomena affect life in the Caribbean.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary">Gravity</Badge>
            <Badge variant="secondary">Stars & Distance</Badge>
            <Badge variant="secondary">Solar System</Badge>
            <Badge variant="secondary">Earth's Motion</Badge>
            <Badge variant="secondary">Navigation</Badge>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center">
          <Target className="mr-2 h-5 w-5" />
          Essential Learning Outcomes & Cosmic Connections
        </h3>

        <Tabs defaultValue="gravitational-force">
          <TabsList className="grid w-full grid-cols-3 bg-purple-100">
            <TabsTrigger
              value="gravitational-force"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Gravitational Force
            </TabsTrigger>
            <TabsTrigger
              value="star-brightness"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Stars & Distance
            </TabsTrigger>
            <TabsTrigger
              value="caribbean-astronomy"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Caribbean Astronomy
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="gravitational-force"
            className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200"
          >
            <h4 className="font-semibold mb-3 text-purple-800">
              Essential Learning Outcome 1: Support an argument that the gravitational force exerted by Earth on objects
              is directed down.
            </h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-md border border-purple-200">
                <h5 className="font-medium text-purple-700 mb-2">Gravity Concepts:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Gravity pulls all objects toward Earth's center</li>
                  <li>Gravitational force affects all objects regardless of mass</li>
                  <li>Air resistance can affect falling motion</li>
                  <li>Weight is the measure of gravitational force on an object</li>
                  <li>Gravity keeps objects from floating away into space</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-md border border-purple-200">
                <h5 className="font-medium text-purple-700 mb-2">Investigation Activities:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Drop test experiments with different objects</li>
                  <li>Investigate effects of air resistance on falling</li>
                  <li>Model how gravity affects satellite orbits</li>
                  <li>Explore weight vs. mass concepts</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="star-brightness" className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-3 text-purple-800">
              Essential Learning Outcome 2: Support an argument that differences in apparent brightness of the sun
              compared to other stars is due to their relative distances from Earth.
            </h4>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-md border border-purple-200">
                <h5 className="font-medium text-purple-700 mb-2">Star Brightness and Distance:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>The sun is a medium-sized star that appears bright due to proximity</li>
                  <li>Other stars are much farther away, making them appear dimmer</li>
                  <li>Light year is a unit of distance, not time</li>
                  <li>Proxima Centauri is the nearest star to our solar system</li>
                  <li>Star brightness depends on both actual brightness and distance</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-md border border-purple-200">
                <h5 className="font-medium text-purple-700 mb-2">Scale and Distance Activities:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Model the relationship between distance and apparent brightness</li>
                  <li>Create scale models of the solar system</li>
                  <li>Investigate how light intensity decreases with distance</li>
                  <li>Compare star magnitudes and distances</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="caribbean-astronomy"
            className="p-4 border rounded-md mt-2 bg-purple-50 border-purple-200"
          >
            <h4 className="font-semibold mb-3 text-purple-800">Caribbean Astronomy & Cultural Connections</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-md border border-purple-200">
                <h5 className="font-medium text-purple-700 mb-2">Navigation and Astronomy:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Traditional Caribbean navigation using stars</li>
                  <li>Southern Cross constellation visibility</li>
                  <li>Seasonal star patterns in tropical latitudes</li>
                  <li>Hurricane season and astronomical events</li>
                  <li>Tidal patterns and lunar cycles</li>
                </ul>
              </div>
              <div className="bg-white p-3 rounded-md border border-purple-200">
                <h5 className="font-medium text-purple-700 mb-2">Cultural Astronomy:</h5>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Indigenous astronomical knowledge</li>
                  <li>African astronomical traditions</li>
                  <li>European navigation techniques</li>
                  <li>Modern space observation in the Caribbean</li>
                  <li>Dark sky preservation efforts</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="border-t-4 border-purple-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-purple-700 flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Detailed Curriculum Outcomes
              </CardTitle>
              <CardDescription>Comprehensive space systems learning expectations</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border border-purple-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                    Gravitational Force Understanding
                  </AccordionTrigger>
                  <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Students will understand:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Gravity is a force that pulls objects toward Earth's center</li>
                          <li>All objects fall at the same rate in a vacuum</li>
                          <li>Air resistance affects the motion of falling objects</li>
                          <li>Weight is the gravitational force acting on an object</li>
                          <li>Gravity keeps the atmosphere and oceans attached to Earth</li>
                          <li>Satellites orbit Earth due to gravitational force</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Investigation Skills:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Design controlled experiments to test gravity effects</li>
                          <li>Measure and compare falling times of different objects</li>
                          <li>Investigate variables that affect falling motion</li>
                          <li>Use evidence to support arguments about gravity</li>
                          <li>Create models to demonstrate gravitational effects</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Key Vocabulary:</h5>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            gravity
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            weight
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            mass
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            air resistance
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            orbit
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border border-purple-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                    Star Brightness and Distance Relationships
                  </AccordionTrigger>
                  <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Stellar Concepts:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>The sun is a star that appears bright because it's close to Earth</li>
                          <li>Other stars appear dimmer because they're much farther away</li>
                          <li>Light year measures distance, not time (about 6 trillion miles)</li>
                          <li>Proxima Centauri is the nearest star at 4.2 light years away</li>
                          <li>Star brightness depends on both luminosity and distance</li>
                          <li>Constellations are patterns of stars at different distances</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Scale and Modeling Activities:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Use flashlights to model distance and brightness relationship</li>
                          <li>Create scale models showing relative distances to stars</li>
                          <li>Compare apparent vs. actual brightness of light sources</li>
                          <li>Map constellation patterns visible from the Caribbean</li>
                          <li>Calculate travel times to nearby stars</li>
                        </ul>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <h6 className="font-medium text-xs mb-1">Nearest Stars:</h6>
                          <ul className="text-xs space-y-1">
                            <li>• Sun: 8 light-minutes</li>
                            <li>• Proxima Centauri: 4.2 ly</li>
                            <li>• Alpha Centauri: 4.4 ly</li>
                          </ul>
                        </div>
                        <div>
                          <h6 className="font-medium text-xs mb-1">Bright Stars:</h6>
                          <ul className="text-xs space-y-1">
                            <li>• Sirius: 8.6 ly</li>
                            <li>• Vega: 25 ly</li>
                            <li>• Arcturus: 37 ly</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border border-purple-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                    Earth's Motion and Patterns
                  </AccordionTrigger>
                  <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Daily and Seasonal Patterns:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Earth's rotation causes day and night cycles</li>
                          <li>Earth's orbit around the sun creates seasonal changes</li>
                          <li>Tilt of Earth's axis affects seasonal patterns</li>
                          <li>Star positions change throughout the night and year</li>
                          <li>Moon phases follow a predictable 29.5-day cycle</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Caribbean-Specific Observations:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Tropical latitude effects on star visibility</li>
                          <li>Seasonal hurricane patterns and astronomical timing</li>
                          <li>Tidal variations and lunar influence</li>
                          <li>Solar angle changes throughout the year</li>
                          <li>Navigation using Southern Cross and North Star</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Observation and Recording Skills:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Track daily sun position and shadow changes</li>
                          <li>Record moon phase observations over time</li>
                          <li>Map constellation positions throughout the year</li>
                          <li>Document seasonal daylight hour variations</li>
                          <li>Use star charts and astronomy apps</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border border-purple-200 rounded-md mb-2">
                  <AccordionTrigger className="hover:bg-purple-50 px-4 py-2 rounded-md">
                    Solar System Structure and Scale
                  </AccordionTrigger>
                  <AccordionContent className="bg-purple-50 px-4 py-2 rounded-b-md">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-2">Solar System Components:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Eight planets with distinct characteristics</li>
                          <li>Asteroid belt between Mars and Jupiter</li>
                          <li>Kuiper Belt and dwarf planets like Pluto</li>
                          <li>Comets from the outer solar system</li>
                          <li>Moons orbiting planets due to gravity</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Scale Understanding:</h5>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Vast distances between planets</li>
                          <li>Relative sizes of planets compared to Earth</li>
                          <li>Time for light to travel across the solar system</li>
                          <li>Orbital periods and distances from the sun</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-t-4 border-purple-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-purple-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-purple-700">Observational Assessment:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Astronomy observation journals</li>
                    <li>Moon phase tracking over one month</li>
                    <li>Shadow length measurements throughout day</li>
                    <li>Star chart creation and annotation</li>
                    <li>Gravity experiment documentation</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-purple-700">Model-Based Assessment:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Solar system scale model construction</li>
                    <li>Earth-moon-sun relationship demonstrations</li>
                    <li>Gravity and orbital motion simulations</li>
                    <li>Star brightness and distance models</li>
                    <li>Constellation pattern recreation</li>
                  </ul>
                </div>

                <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
                  <h4 className="font-semibold mb-2 text-purple-700">Performance Tasks:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>Design a mission to another planet</li>
                    <li>Create a Caribbean stargazing guide</li>
                    <li>Explain tides using moon-Earth model</li>
                    <li>Plan observations for upcoming eclipses</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Inclusive Learning Approaches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="visual-learners">
                  <AccordionTrigger>Visual and Spatial Learners</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Interactive planetarium software</li>
                      <li>3D solar system models and manipulatives</li>
                      <li>Star chart creation and interpretation</li>
                      <li>Time-lapse videos of celestial motion</li>
                      <li>Infographic design projects</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="hands-on">
                  <AccordionTrigger>Kinesthetic Learners</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Human solar system role-playing</li>
                      <li>Gravity drop experiments</li>
                      <li>Telescope construction and use</li>
                      <li>Shadow tracking activities</li>
                      <li>Moon phase demonstration with balls and lights</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="mathematical">
                  <AccordionTrigger>Mathematical Learners</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Scale calculations for solar system models</li>
                      <li>Light travel time computations</li>
                      <li>Orbital period and distance relationships</li>
                      <li>Gravity force calculations</li>
                      <li>Statistical analysis of astronomical data</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="cultural">
                  <AccordionTrigger>Cultural Connections</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Indigenous Caribbean astronomical knowledge</li>
                      <li>African navigation and star traditions</li>
                      <li>Historical European exploration methods</li>
                      <li>Modern Caribbean space initiatives</li>
                      <li>Multilingual astronomy vocabulary</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="mr-2 h-5 w-5" />
              Technology and Digital Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Astronomy Software and Apps:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Stellarium planetarium software</li>
                  <li>NASA's Eyes on the Solar System</li>
                  <li>SkySafari mobile astronomy app</li>
                  <li>Google Earth for space exploration</li>
                  <li>Virtual telescope interfaces</li>
                  <li>International Space Station tracker</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Observation Equipment:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Binoculars for moon and planet viewing</li>
                  <li>Simple telescopes for school use</li>
                  <li>Solar viewing filters and eclipse glasses</li>
                  <li>Digital cameras for astrophotography</li>
                  <li>Compass and star charts</li>
                  <li>Red flashlights for night observations</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Data Collection and Analysis:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Digital timers for gravity experiments</li>
                  <li>Measuring tools for shadow tracking</li>
                  <li>Graphing software for data analysis</li>
                  <li>Weather monitoring for observation planning</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cross-Curricular Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-blue-600">Mathematics:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Scale and proportion in solar system models</li>
                  <li>Geometric patterns in orbital motion</li>
                  <li>Time calculations and unit conversions</li>
                  <li>Graphing astronomical data and patterns</li>
                  <li>Distance, speed, and time relationships</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-green-600">Language Arts:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Science fiction writing inspired by space</li>
                  <li>Research reports on space exploration</li>
                  <li>Vocabulary development (astronomical terms)</li>
                  <li>Reading comprehension with space texts</li>
                  <li>Oral presentations of observations</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-purple-600">Social Studies:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>History of space exploration</li>
                  <li>Cultural astronomy and navigation</li>
                  <li>Economic impacts of space technology</li>
                  <li>International cooperation in space</li>
                  <li>Caribbean contributions to astronomy</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-red-600">Arts:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Astronomical art and constellation drawing</li>
                  <li>Photography of celestial objects</li>
                  <li>Music inspired by space themes</li>
                  <li>Drama depicting space exploration</li>
                  <li>Creative writing about space travel</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comprehensive Resources and Community Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-purple-700">Observation Equipment</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Classroom telescope (6-8 inch reflector)</li>
                <li>Binoculars (7x35 or 10x50)</li>
                <li>Solar filters and eclipse viewing glasses</li>
                <li>Star charts and planispheres</li>
                <li>Red flashlights for night vision</li>
                <li>Digital cameras for astrophotography</li>
                <li>Compass and GPS devices</li>
                <li>Measuring tools and timers</li>
                <li>Gravity experiment materials</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-purple-700">Community Partners</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Local astronomy clubs and societies</li>
                <li>University physics and astronomy departments</li>
                <li>Planetariums and science museums</li>
                <li>Amateur radio operators (satellite tracking)</li>
                <li>Maritime navigation experts</li>
                <li>Traditional knowledge keepers</li>
                <li>Weather service meteorologists</li>
                <li>International Space Station educators</li>
                <li>Dark sky preservation groups</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-purple-700">Professional Development</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Basic astronomy content knowledge</li>
                <li>Telescope operation and maintenance</li>
                <li>Night sky observation safety</li>
                <li>Planetarium software training</li>
                <li>Inquiry-based astronomy education</li>
                <li>Cultural astronomy integration</li>
                <li>Assessment of spatial reasoning</li>
                <li>Community partnership development</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge and Preparation</h3>
            <p className="text-sm mb-3">
              Teachers should develop basic understanding of astronomical concepts, familiarity with night sky
              observations, and knowledge of cultural astronomy traditions. Emphasis should be placed on connecting
              space science to students' daily experiences and Caribbean cultural heritage.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Essential Astronomy Knowledge:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Basic solar system structure and scale</li>
                  <li>Earth's rotation and orbital motion</li>
                  <li>Moon phases and tidal relationships</li>
                  <li>Star life cycles and stellar distances</li>
                  <li>Gravity and orbital mechanics basics</li>
                  <li>Seasonal sky changes and constellation patterns</li>
                  <li>Light pollution and dark sky preservation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Teaching Strategies:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Scale model construction and interpretation</li>
                  <li>Safe solar and lunar observation techniques</li>
                  <li>Technology integration for virtual exploration</li>
                  <li>Connecting astronomy to navigation and timekeeping</li>
                  <li>Incorporating cultural and historical perspectives</li>
                  <li>Facilitating wonder and curiosity about space</li>
                  <li>Managing outdoor observation activities</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-semibold mb-2 text-purple-700">Caribbean Astronomy Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Unique Observing Opportunities:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Southern Cross constellation visibility</li>
                  <li>Tropical latitude advantages for planet viewing</li>
                  <li>Minimal light pollution in rural areas</li>
                  <li>Year-round outdoor observation possibilities</li>
                  <li>International Space Station frequent passes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Cultural Connections:</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Traditional navigation by stars</li>
                  <li>Agricultural timing using lunar cycles</li>
                  <li>Hurricane season astronomical markers</li>
                  <li>Fishing and tidal pattern knowledge</li>
                  <li>Storytelling traditions about constellations</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
