import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function SpaceSystems() {
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Space Systems: Patterns and Cycles</h1>
        <Link to="/curriculum/grade1-subjects/science"><Button>Back to Science</Button></Link>
      </div>

      <div className="grid gap-6 space-y-2">
        <Card>
          <CardContent className="pt-6 px-4 sm:px-6">
            <p className="mb-4 leading-relaxed">
              Students explore patterns in the sky by observing the sun, moon, and stars. They learn about day and night
              cycles, track the moon's changing shapes, and discover how celestial objects follow predictable patterns
              that help us understand time and seasons.
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
            <h2 className="text-2xl font-semibold mb-4">Essential Learning Outcomes</h2>
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="secondary">ELO-1</Badge>
                    Sky Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <p className="mb-3 leading-relaxed">
                    Use observations of the sun, moon, and stars to describe patterns that can be predicted.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Students will:</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                      <li>
                        Define terms: day, night, pattern, path, full moon, crescent moon, half moon, constellation
                      </li>
                      <li>Understand that clocks help us track day and night patterns</li>
                      <li>Identify objects found in day sky and night sky</li>
                      <li>Compare the position of the sun at different times of day</li>
                      <li>Describe different shapes of the moon throughout a month</li>
                      <li>Observe and track celestial patterns in a simple journal</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="secondary">ELO-2</Badge>
                    Daylight Variations
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <p className="mb-3 leading-relaxed">
                    Make observations at different times of the year to relate the amount of daylight to the time of
                    year.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Students will:</h4>
                    <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                      <li>Recognize that daylight hours can vary throughout the year</li>
                      <li>Understand that Earth's tilt affects seasonal changes</li>
                      <li>Compare daylight differences in Caribbean vs. northern/southern regions</li>
                      <li>Appreciate how location affects seasonal temperature variations</li>
                    </ul>
                  </div>
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs sm:text-sm text-blue-800">
                      <strong>Note:</strong> This outcome is covered briefly to introduce the concept, as Caribbean
                      regions have minimal seasonal daylight variation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6 pt-6">
            <h2 className="text-2xl font-semibold mb-4">Key Learning Activities</h2>
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Day and Night Observations</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                    <li>Drawing day sky vs. night sky objects</li>
                    <li>Clock pattern recognition (7 AM vs. 7 PM)</li>
                    <li>Sorting activities: day vs. night activities</li>
                    <li>Sun position tracking throughout the school day</li>
                    <li>Shadow observations at different times</li>
                    <li>Creating models of day/night using available materials</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Moon Phase Tracking</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                    <li>Monthly moon observation journals</li>
                    <li>Drawing different moon shapes (full, crescent, half)</li>
                    <li>Moon phase calendar creation</li>
                    <li>Understanding moon as reflecting sunlight</li>
                    <li>Comparing moon visibility day vs. night</li>
                    <li>Oreo cookie moon phase demonstrations</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sun Path Investigations</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                    <li>Morning vs. afternoon sun position drawings</li>
                    <li>School building shadow tracking</li>
                    <li>Simple sundial construction</li>
                    <li>Understanding sun's daily arc across sky</li>
                    <li>Connecting sun position to time of day</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Star and Constellation Exploration</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                    <li>Connect-the-dots constellation activities</li>
                    <li>Learning about the Big Dipper and other patterns</li>
                    <li>Understanding why stars are visible at night</li>
                    <li>Exploring the role of astronomers</li>
                    <li>Creating star pattern artwork</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Earth's Rotation Demonstrations</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
                    <li>Globe and flashlight demonstrations</li>
                    <li>Understanding day/night as Earth rotates</li>
                    <li>Modeling Earth's tilt and seasonal effects</li>
                    <li>Comparing Caribbean location to other regions</li>
                    <li>Simple explanations of why seasons vary by location</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vocabulary" className="space-y-6 pt-6">
            <h2 className="text-2xl font-semibold mb-4">Key Vocabulary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Time & Patterns</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="space-y-1 text-sm">
                    <li>
                      <strong>Day:</strong> When the sun shines and it's light
                    </li>
                    <li>
                      <strong>Night:</strong> When it's dark and we see stars
                    </li>
                    <li>
                      <strong>Pattern:</strong> Something that repeats over and over
                    </li>
                    <li>
                      <strong>Path:</strong> The route the sun takes across the sky
                    </li>
                    <li>
                      <strong>Clock:</strong> A tool that helps us track time patterns
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Moon Phases</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="space-y-1 text-sm">
                    <li>
                      <strong>Full moon:</strong> When we see the whole round moon
                    </li>
                    <li>
                      <strong>Crescent moon:</strong> When the moon looks like a thin curve
                    </li>
                    <li>
                      <strong>Half moon:</strong> When we see half of the moon
                    </li>
                    <li>
                      <strong>Reflect:</strong> How the moon bounces sunlight to us
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sky Objects</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="space-y-1 text-sm">
                    <li>
                      <strong>Sun:</strong> The star that gives us light and warmth
                    </li>
                    <li>
                      <strong>Moon:</strong> The object that orbits Earth
                    </li>
                    <li>
                      <strong>Stars:</strong> Distant suns we see at night
                    </li>
                    <li>
                      <strong>Constellation:</strong> A pattern made by connecting stars
                    </li>
                    <li>
                      <strong>Astronomer:</strong> A person who studies space
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6 pt-6">
            <h2 className="text-2xl font-semibold mb-4">Teaching Resources</h2>
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Materials Needed</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Observation Tools:</h4>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Globe and flashlight for demonstrations</li>
                        <li>Chart paper for tracking observations</li>
                        <li>Clipboards for outdoor activities</li>
                        <li>Colored pencils and markers</li>
                        <li>Simple journals or notebooks</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Activity Materials:</h4>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Construction paper and cotton for sky models</li>
                        <li>Star stickers or cut-outs</li>
                        <li>Oreo cookies for moon phases</li>
                        <li>Cardboard and sticks for sundials</li>
                        <li>Modeling clay or playdough</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Digital Resources</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Earth rotation and day/night videos</li>
                    <li>Moon phase time-lapse videos</li>
                    <li>Interactive constellation maps</li>
                    <li>Virtual planetarium experiences</li>
                    <li>Sun position tracking apps (teacher use)</li>
                    <li>Weather and astronomy websites</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assessment Ideas</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Daily observation journals</li>
                    <li>Before/after drawings of sky objects</li>
                    <li>Moon phase tracking charts</li>
                    <li>Sun position documentation</li>
                    <li>Oral explanations of patterns observed</li>
                    <li>Creative sky pattern artwork</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Safety & Practical Tips</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>
                      <strong>Never look directly at the sun</strong> - use shadows instead
                    </li>
                    <li>Use sunscreen during outdoor observations</li>
                    <li>Plan moon observations for safe evening times</li>
                    <li>Have backup indoor activities for cloudy days</li>
                    <li>Consider sending home observation sheets for family involvement</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Local Cultural Connections</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 py-4">
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Traditional uses of sun position for telling time</li>
                    <li>Local fishing and farming practices based on moon phases</li>
                    <li>Caribbean folklore about sun, moon, and stars</li>
                    <li>Traditional navigation using star patterns</li>
                    <li>Seasonal celebrations and their connection to daylight</li>
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
