import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function WavesLightsSounds() {
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Waves, Lights and Sounds</h1>
        <Link to="/curriculum/grade1-subjects/science"><Button>Back to Science</Button></Link>
      </div>

      <div className="grid gap-6 space-y-2">
        <Card>
          <CardContent className="pt-6 px-4 sm:px-6">
            <p className="mb-4 text-sm sm:text-base leading-relaxed">
              Students explore the fascinating world of sound vibrations, light sources, and communication through
              hands-on investigations. They learn how vibrating materials make sound, how we see objects when
              illuminated, and how light and sound can be used to communicate over distances.
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="outcomes">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
            <TabsTrigger value="outcomes" className="text-xs sm:text-sm">
              Learning Outcomes
            </TabsTrigger>
            <TabsTrigger value="activities" className="text-xs sm:text-sm">
              Key Activities
            </TabsTrigger>
            <TabsTrigger value="vocabulary" className="text-xs sm:text-sm">
              Vocabulary
            </TabsTrigger>
            <TabsTrigger value="resources" className="text-xs sm:text-sm">
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="outcomes" className="space-y-6 pt-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Essential Learning Outcomes</h2>
            <div className="grid gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="secondary">ELO-1</Badge>
                    Sound and Vibrations
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <p className="mb-3 text-sm sm:text-base leading-relaxed">
                    Plan and conduct investigations to provide evidence that vibrating materials can make sound and that
                    sound can make materials vibrate.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Students will:</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                      <li>Define terms: sounds, vibrate, waves, loud, soft, sign language</li>
                      <li>Demonstrate understanding of how to produce sounds</li>
                      <li>Compare and describe sounds as loud, soft, pleasant, unpleasant</li>
                      <li>Show that sound is a wave-like water</li>
                      <li>Investigate how sounds are produced and their effects on objects</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="secondary">ELO-2</Badge>
                    Light and Vision
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <p className="mb-3 text-sm sm:text-base leading-relaxed">
                    Make observations to construct an evidence-based account that objects can be seen only when
                    illuminated.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Students will:</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                      <li>Define terms: light/darkness, artificial, natural, reflect</li>
                      <li>Give examples of light sources in and out of the classroom</li>
                      <li>Describe why objects can be seen when illuminated</li>
                      <li>Understand that the sun is a natural source of light</li>
                      <li>Classify light according to source (natural, artificial)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="secondary">ELO-3</Badge>
                    Materials and Light
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <p className="mb-3 text-sm sm:text-base leading-relaxed">
                    Plan and conduct investigations to determine the effect of placing objects made with different
                    materials in the path of a beam of light.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Students will:</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                      <li>Define terms: glass, transparent, translucent, reflective, opaque</li>
                      <li>Demonstrate understanding that objects can block varying amounts of light</li>
                      <li>Classify objects as transparent, translucent, reflective, or opaque</li>
                      <li>Predict which types of materials are best suited for different applications</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="secondary">ELO-4</Badge>
                    Communication with Light and Sound
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <p className="mb-3 text-sm sm:text-base leading-relaxed">
                    Use tools and materials to design and build a device that uses light or sound to solve the problem
                    of communicating over a distance.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Students will:</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                      <li>Define terms: warning, communicating, siren, emergency vehicle, traffic lights</li>
                      <li>Give examples of communicating with sound and light</li>
                      <li>Construct simple sound communication devices (cup phones)</li>
                      <li>Recognize that communication technologies have varied over time</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6 pt-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Key Learning Activities</h2>
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sound Vibration Experiments</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                    <li>Drum demonstration with sand to show vibrations</li>
                    <li>Making sounds with rulers, rubber bands, and various materials</li>
                    <li>Paper strips near speakers to visualize sound waves</li>
                    <li>Creating musical instruments from everyday materials</li>
                    <li>Exploring loud vs. soft sounds through clapping and instruments</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Light Source Investigations</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                    <li>Peep box experiments to show we need light to see objects</li>
                    <li>Sorting activities: natural vs. artificial light sources</li>
                    <li>Mirror reflection demonstrations</li>
                    <li>Exploring how light reflects off objects to reach our eyes</li>
                    <li>Understanding moon as reflecting sunlight</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Material Properties with Light</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                    <li>Testing transparent materials (clear glass, plastic)</li>
                    <li>Exploring translucent materials (wax paper, frosted glass)</li>
                    <li>Investigating opaque materials (cardboard, wood)</li>
                    <li>Shadow-making activities</li>
                    <li>Comparing smooth vs. rough glass surfaces</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Communication Devices</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                    <li>Making cup-and-string telephones</li>
                    <li>Creating simple signal systems with bells or lights</li>
                    <li>Exploring Morse code patterns</li>
                    <li>Identifying warning sounds and lights in the community</li>
                    <li>Understanding traffic lights and emergency vehicle signals</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vocabulary" className="space-y-6 pt-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Key Vocabulary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sound Terms</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="space-y-2 text-sm leading-relaxed">
                    <li>
                      <strong>Vibrate:</strong> To move back and forth quickly
                    </li>
                    <li>
                      <strong>Sound:</strong> What we hear when something vibrates
                    </li>
                    <li>
                      <strong>Waves:</strong> How sound travels through air
                    </li>
                    <li>
                      <strong>Loud:</strong> A big vibration making a strong sound
                    </li>
                    <li>
                      <strong>Soft:</strong> A small vibration making a quiet sound
                    </li>
                    <li>
                      <strong>Sign language:</strong> Using hands to communicate
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Light Terms</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="space-y-2 text-sm leading-relaxed">
                    <li>
                      <strong>Light:</strong> What helps us see objects
                    </li>
                    <li>
                      <strong>Natural:</strong> Light from nature (sun, stars)
                    </li>
                    <li>
                      <strong>Artificial:</strong> Light made by humans
                    </li>
                    <li>
                      <strong>Reflect:</strong> When light bounces off something
                    </li>
                    <li>
                      <strong>Transparent:</strong> Light passes through clearly
                    </li>
                    <li>
                      <strong>Translucent:</strong> Some light passes through
                    </li>
                    <li>
                      <strong>Opaque:</strong> No light passes through
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Communication Terms</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="space-y-2 text-sm leading-relaxed">
                    <li>
                      <strong>Communicate:</strong> To send messages
                    </li>
                    <li>
                      <strong>Warning:</strong> A signal about danger
                    </li>
                    <li>
                      <strong>Siren:</strong> A loud warning sound
                    </li>
                    <li>
                      <strong>Emergency vehicle:</strong> Police, fire, ambulance
                    </li>
                    <li>
                      <strong>Traffic lights:</strong> Signals for safe driving
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6 pt-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Teaching Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Materials Needed</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Sound Activities:</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                        <li>Drums, rubber bands, rulers</li>
                        <li>Bottles with different water levels</li>
                        <li>Tuning forks</li>
                        <li>Paper strips</li>
                        <li>Various containers and materials</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Light Activities:</h4>
                      <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                        <li>Flashlights/torches</li>
                        <li>Mirrors</li>
                        <li>Clear glass or plastic</li>
                        <li>Wax paper</li>
                        <li>Cardboard</li>
                        <li>Shoe boxes for peep boxes</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Books</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                    <li>"Vibrations Make Sound" by Jennifer Boothroyd</li>
                    <li>"What are Sound Waves" by Robin Johnson</li>
                    <li>"Sound: Loud, Soft, High and Low" by Natalie Rosinsky</li>
                    <li>"Sound All Around" illustrated by Holly Keller</li>
                    <li>"All About Light" by Lisa Trumbauer</li>
                    <li>"All About Light" by Angela Royston</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Safety Considerations</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                    <li>Never look directly at the sun</li>
                    <li>Use appropriate volume levels to protect hearing</li>
                    <li>Handle glass materials carefully</li>
                    <li>Supervise use of small objects</li>
                    <li>Ensure proper lighting when using flashlights</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
