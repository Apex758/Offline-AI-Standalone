import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, DollarSign, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function EconomicDecisionMakingPage() {
  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade4-subjects/social-studies">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 4 Social Studies
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-amber-700 flex items-center">
            <DollarSign className="mr-2 h-7 w-7 text-amber-600" />
            Economic Decision Making
          </h1>
          <p className="text-gray-700">
            This strand helps students see the importance of the natural resources of their island(s) in shaping their
            way of life. Students learn the types of natural resources and the basic economic activities. They explore
            the physical and economic benefits of land use, the blue economy and coastal environment influences on the
            economy, and the way resources can be renewable and non-renewable.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-amber-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Four Expectations for Economic Decision Making
        </h3>

        <Tabs defaultValue="resources">
          <TabsList className="grid w-full grid-cols-3 bg-amber-100">
            <TabsTrigger value="resources" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Natural Resources
            </TabsTrigger>
            <TabsTrigger value="economy" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
              Economic Activities
            </TabsTrigger>
            <TabsTrigger
              value="environment"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
            >
              Environment & Energy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Natural Resources</h4>
            <p className="mb-3">
              To understand how our natural resources play an important role in shaping our way of life.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                Identify how access to resources of our country have shaped country's settlement location over time
              </li>
              <li>
                Compare past and present settlements using charts and maps, focusing on how resource use, technology,
                and environmental changes influence these patterns
              </li>
              <li>Appreciate that our resources impact where we settle</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-amber-100">
              <h5 className="font-medium text-amber-700">Focus Questions:</h5>
              <p>What are the essential resources that people need to survive?</p>
              <p>How did natural resources determine where the indigenous people settled?</p>
              <p>
                What is urbanization, and how does it impact both the growth of cities and the conservation of natural
                resources?
              </p>
              <p>How have the rural and urban areas evolved over time?</p>
              <p>To what extent has technology influenced settlement patterns in the Caribbean region?</p>
              <p>How has technology influenced the way we do commerce today?</p>
              <p>What factors should be considered when planning future land use?</p>
              <p>What factors influence human settlement choices in response to environmental changes?</p>
              <p>What strategies can individuals and communities adopt to address environmental changes?</p>
            </div>
          </TabsContent>

          <TabsContent value="economy" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Economic Activities</h4>
            <p className="mb-3">
              To understand how our natural resources play an important role in shaping our way of life.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Explain the major economic activities in your country and the importance of each to the economy</li>
              <li>Chart the types of jobs associated with various industries and predict future needs for workers</li>
              <li>Appreciate that our economic well-being is dependent on the sustainable use of our resources</li>
              <li>
                Identify major uses of land and their location, such as residential, industrial, agriculture, industry,
                tourism
              </li>
              <li>Map the location and distribution of various land uses in your country</li>
              <li>Appreciate that geographic factors influence how land is used</li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-amber-100">
              <h5 className="font-medium text-amber-700">Focus Questions:</h5>
              <p>What are the agents of the economy?</p>
              <p>What are the four (4) main sectors of the economy?</p>
              <p>What are the jobs associated with the various industries on my island?</p>
              <p>How does mechanization and digital technology impact the production of goods and services?</p>
              <p>What are private and public institutions and the roles they play in economic development?</p>
              <p>What are some uses of the land?</p>
              <p>How do a country's natural resources influence its land use patterns?</p>
              <p>What are some factors which affect land use in a country?</p>
            </div>
          </TabsContent>

          <TabsContent value="environment" className="p-4 border rounded-md mt-2 bg-amber-50 border-amber-200">
            <h4 className="font-semibold mb-2">Essential Learning Outcome: Environment & Energy</h4>
            <p className="mb-3">
              To understand how our natural resources play an important role in shaping our way of life.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                Identify the diverse roles the ocean plays in supporting our country and understand the factors that
                threaten its health and sustainability
              </li>
              <li>
                Explore jobs and sectors in the blue economy, focusing on their impact on marine environments and how
                sustainable practices can reduce negative effects
              </li>
              <li>Appreciate how our economic activities impact the ocean which in turn impacts our economy</li>
              <li>
                Explore how environmental issues (eg. climate change, pollution, weather systems) have a negative impact
                on our economy
              </li>
              <li>Categorize the impacts of environmental issues on our economy</li>
              <li>
                Appreciate the ways that our country is protecting the coastal and marine environment and determine
                additional approaches that would enhance this
              </li>
              <li>
                Describe the ways that our country meets its energy needs for electricity and transportation and explore
                the use of renewable sources
              </li>
              <li>Assess the impact of our current energy sources on our local and global economy and environment</li>
              <li>
                Appreciate the value of renewable sources of energy (such as solar, wind, geothermal and hydroelectric)
                for our economy
              </li>
            </ul>
            <div className="mt-4 bg-white p-3 rounded-md border border-amber-100">
              <h5 className="font-medium text-amber-700">Focus Questions:</h5>
              <p>What are some ways the ocean helps our country?</p>
              <p>How do jobs related to the ocean affect marine life?</p>
              <p>What can harm the ocean's health?</p>
              <p>What is climate change and how does it impact our economy?</p>
              <p>How does how we treat our coastal environment affect our economy?</p>
              <p>How can we contribute to the care and preservation of our environment?</p>
              <p>What are ways our country can meet the energy needs of its citizens?</p>
              <p>How is the use of renewable resources beneficial to humans?</p>
              <p>How does the use of various sources of energy consumption affect the environment?</p>
              <p>How important is the use of renewable energy to consumers and the environment?</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-amber-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-amber-50">
            <CardTitle className="text-amber-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade Four, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Settlement Patterns
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify how access to resources of our country have shaped country's
                      settlement location over time
                    </li>
                    <li>
                      <strong>Skills:</strong> Compare past and present settlements using charts and maps, focusing on
                      how resource use, technology, and environmental changes influence these patterns
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate that our resources impact where we settle
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Economic Activities
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Explain the major economic activities in your country and the
                      importance of each to the economy
                    </li>
                    <li>
                      <strong>Skills:</strong> Chart the types of jobs associated with various industries and predict
                      future needs for workers
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate that our economic well-being is dependent on the sustainable
                      use of our resources
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">Land Use</AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify major uses of land and their location, such as residential,
                      industrial, agriculture, industry, tourism
                    </li>
                    <li>
                      <strong>Skills:</strong> Map the location and distribution of various land uses in your country
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate that geographic factors influence how land is used
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">Blue Economy</AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Identify the diverse roles the ocean plays in supporting our country
                      and understand the factors that threaten its health and sustainability
                    </li>
                    <li>
                      <strong>Skills:</strong> Explore jobs and sectors in the blue economy, focusing on their impact on
                      marine environments and how sustainable practices can reduce negative effects
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate how our economic activities impact the ocean which in turn
                      impacts our economy
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">
                  Environmental Issues
                </AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Explore how environmental issues (eg. climate change, pollution,
                      weather systems) have a negative impact on our economy
                    </li>
                    <li>
                      <strong>Skills:</strong> Categorize the impacts of environmental issues on our economy
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the ways that our country is protecting the coastal and marine
                      environment and determine additional approaches that would enhance this
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border border-amber-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-amber-50 px-4 py-2 rounded-md">Energy Resources</AccordionTrigger>
                <AccordionContent className="bg-amber-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Knowledge:</strong> Describe the ways that our country meets its energy needs for
                      electricity and transportation and explore the use of renewable sources
                    </li>
                    <li>
                      <strong>Skills:</strong> Assess the impact of our current energy sources on our local and global
                      economy and environment
                    </li>
                    <li>
                      <strong>Values:</strong> Appreciate the value of renewable sources of energy (such as solar, wind,
                      geothermal and hydroelectric) for our economy
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-yellow-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-yellow-50">
              <CardTitle className="text-yellow-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-yellow-700">Observations:</strong> Observe students during field trips, group
                  activities, simulations, and presentations
                </li>
                <li>
                  <strong className="text-yellow-700">Conversations:</strong> Class discussions, interviews with
                  community members, debates, think-pair-share activities
                </li>
                <li>
                  <strong className="text-yellow-700">Products:</strong> Maps, charts, models, posters, presentations,
                  reports, journals, infographics
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-100">
                <h4 className="font-semibold mb-2 text-yellow-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Observation checklists for field trips and group work</li>
                  <li>Rubrics for evaluating presentations and projects</li>
                  <li>Self-assessment forms for participation in activities</li>
                  <li>Peer assessment for collaborative projects</li>
                  <li>Exit slips for checking understanding of key concepts</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inclusive Learning Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="strategy-1">
                  <AccordionTrigger>Settlement Patterns & Resources</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Booklet Making:</strong> Students create booklets showing everyday items made from
                        different natural resources
                      </li>
                      <li>
                        <strong>Picture Walk:</strong> Students explore various natural resources through pictures,
                        distinguishing between renewable and non-renewable resources
                      </li>
                      <li>
                        <strong>Model Building:</strong> Students build model settlements and identify natural resources
                        used
                      </li>
                      <li>
                        <strong>Storytelling:</strong> Students learn about historical context and significance of
                        natural resources in early Caribbean settlements
                      </li>
                      <li>
                        <strong>Settlement Maps:</strong> Students create maps depicting distribution of resources and
                        settlement locations over time
                      </li>
                      <li>
                        <strong>Field Trip:</strong> Students observe firsthand the influence of resources on settlement
                        locations
                      </li>
                      <li>
                        <strong>Art and Interpretation:</strong> Students compare before and after photos of local
                        communities
                      </li>
                      <li>
                        <strong>Interactive Maps:</strong> Students explore past and present settlements using digital
                        or printed maps
                      </li>
                      <li>
                        <strong>Family Stories:</strong> Students share family experiences with changes in settlements
                        over time
                      </li>
                      <li>
                        <strong>Storyboard Creation:</strong> Students illustrate settlement evolution over time
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Economic Activities & Land Use</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>KWL Chart:</strong> Students activate prior knowledge about economic concepts
                      </li>
                      <li>
                        <strong>Concept Attainment:</strong> Students list jobs and categorize them into economic
                        activities
                      </li>
                      <li>
                        <strong>Critical Thinking Discussion:</strong> Students discuss economic concepts using prompts
                      </li>
                      <li>
                        <strong>Video Assisted Learning:</strong> Students watch videos about economic concepts
                      </li>
                      <li>
                        <strong>Interview Project:</strong> Students interview elderly family members about economic
                        changes
                      </li>
                      <li>
                        <strong>Carbon Footprint Calculator:</strong> Students calculate their environmental impact
                      </li>
                      <li>
                        <strong>Field Trip:</strong> Students visit economic activities and observe production,
                        consumption, or distribution
                      </li>
                      <li>
                        <strong>Flowchart Creation:</strong> Students create flowcharts showing linkages among
                        industries
                      </li>
                      <li>
                        <strong>Picture Comparison:</strong> Students compare traditional and technological work
                        practices
                      </li>
                      <li>
                        <strong>Land Use Video:</strong> Students watch videos about different land use types
                      </li>
                      <li>
                        <strong>Map Creation:</strong> Students create maps showing land use distribution
                      </li>
                      <li>
                        <strong>Simulation Games:</strong> Students play city-building simulation games
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Blue Economy & Environmental Issues</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Mind Mapping:</strong> Students create mind maps about ocean importance and
                        vulnerabilities
                      </li>
                      <li>
                        <strong>Storytelling:</strong> Students engage with stories about ocean-related industries
                      </li>
                      <li>
                        <strong>Sustainable Beach Day Presentation:</strong> Students create presentations about
                        sustainable beach practices
                      </li>
                      <li>
                        <strong>Video Discussion:</strong> Students watch and discuss videos about marine pollution
                      </li>
                      <li>
                        <strong>Role-Playing:</strong> Students assume roles of various stakeholders in ocean-dependent
                        industries
                      </li>
                      <li>
                        <strong>Ocean Model:</strong> Students build classroom ocean models using recycled materials
                      </li>
                      <li>
                        <strong>Class Centers:</strong> Students explore themed environmental issues through interactive
                        centers
                      </li>
                      <li>
                        <strong>Picture Mural:</strong> Students create murals showing different types of pollution
                      </li>
                      <li>
                        <strong>Graphic Organizers:</strong> Students organize information about environmental impacts
                      </li>
                      <li>
                        <strong>Grandparent Interviews:</strong> Students interview elderly family members about climate
                        changes
                      </li>
                      <li>
                        <strong>Resource Person:</strong> Fisheries personnel and fishermen discuss sustainable
                        practices
                      </li>
                      <li>
                        <strong>Beach Clean-up:</strong> Students participate in cleaning coastal areas
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Energy Resources</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Community Walk:</strong> Students identify resources in their environment
                      </li>
                      <li>
                        <strong>Categorizing Activity:</strong> Students categorize resources as natural or man-made
                      </li>
                      <li>
                        <strong>IT Research:</strong> Students research types of natural resources and their uses
                      </li>
                      <li>
                        <strong>Resource Products Scrapbook:</strong> Students create scrapbooks showing products
                        derived from resources
                      </li>
                      <li>
                        <strong>Conservation Activities:</strong> Students learn about water conservation through
                        experiments
                      </li>
                      <li>
                        <strong>Field Trip:</strong> Students visit renewable energy projects
                      </li>
                      <li>
                        <strong>Compare and Contrast:</strong> Students compare renewable and non-renewable energy
                        sources
                      </li>
                      <li>
                        <strong>Renewable Energy Poster:</strong> Students create posters illustrating benefits of
                        renewable energy
                      </li>
                      <li>
                        <strong>Scavenger Hunt:</strong> Students find renewable energy sources in their community
                      </li>
                      <li>
                        <strong>Class Discussion:</strong> Students discuss benefits of renewable energy sources
                      </li>
                      <li>
                        <strong>Renewable Energy Infographic:</strong> Students create infographics explaining benefits
                        of renewable resources
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Additional Resources and Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Multimedia Resources</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Videos on natural resources and settlement patterns</li>
                <li>Documentaries on economic activities and industries</li>
                <li>Interactive maps showing land use patterns</li>
                <li>Videos on blue economy and marine conservation</li>
                <li>Presentations on environmental issues and climate change</li>
                <li>Documentaries on renewable and non-renewable energy</li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=4vUV9mw3ltA"
                    className="text-amber-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    What are the effects of Climate Change
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=eJBIoclTmyc"
                    className="text-amber-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    What are Nature Reserves?
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=EgdjHzN9ch8"
                    className="text-amber-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Blue Economy 101
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Physical Materials</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Maps and atlases showing settlement patterns</li>
                <li>Art supplies for model building and poster creation</li>
                <li>Materials for conservation experiments</li>
                <li>Field trip observation sheets</li>
                <li>Recycled materials for ocean models</li>
                <li>Charts and graphic organizers</li>
                <li>Simulation game materials</li>
                <li>Materials for renewable energy demonstrations</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p className="mb-2">
              Resources are any materials that people find useful in their environment. Natural resources can be
              renewable (can be used over and over again) or non-renewable (can only be used for a limited time).
              Physical resources include human, capital, and technology resources. Conservation is the care and
              protection of the Earth so it can remain for future generations by using resources responsibly.
            </p>
            <p className="mb-2">
              The economy has four main sectors: primary (extraction of raw materials), secondary (manufacturing and
              construction), tertiary (services), and quaternary (intellectual activities). Economic activities include
              production (creating goods and services), distribution (getting goods and services to consumers), and
              consumption (using goods and services). Public institutions are government-owned and operated, while
              private institutions are owned by individuals or companies.
            </p>
            <p className="mb-2">
              Land use refers to how land is utilized, including residential, commercial, industrial, agricultural,
              recreational, institutional, and green space uses. Geographic factors like climate, topography, and
              natural resources influence land use patterns. The blue economy refers to the sustainable use of ocean
              resources for economic growth, improved livelihoods, and ocean ecosystem health.
            </p>
            <p className="mb-2">
              Climate change is a long-term change in weather patterns, largely caused by human activities releasing
              greenhouse gases. This can lead to problems like melting ice, rising sea levels, and changes in weather
              patterns. Environmental issues like pollution, deforestation, and habitat destruction can negatively
              impact economies through reduced tourism, decreased agricultural productivity, and increased healthcare
              costs.
            </p>
            <p>
              Energy sources can be renewable (solar, wind, hydroelectric, geothermal) or non-renewable (fossil fuels
              like coal, oil, and natural gas). Renewable energy sources have less environmental impact and are
              sustainable in the long term, while non-renewable sources contribute to pollution and climate change but
              are often more established in current infrastructure.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
