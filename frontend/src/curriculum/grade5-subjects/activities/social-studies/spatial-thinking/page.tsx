"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Breadcrumb } from "@/components/breadcrumb"
import { ArrowLeft, Globe, Target, BookOpen, Lightbulb, Play, Map, Mountain, Landmark, CloudRain } from "lucide-react"
import Link from "next/link"

export default function SpatialThinkingActivitiesPage() {
  const activityCategories = [
    {
      id: "island-classification",
      title: "Caribbean Geography and Regional Classifications",
      icon: Map,
      activities: [
        {
          title: "Interactive Island Classification System",
          duration: "120 minutes",
          learningOutcomes: [
            "Describe various classifications of the Caribbean region such as Bahamas, Greater and Lesser Antilles, Windward and Leeward Islands, and Caribbean coastal areas",
            "Plot on a map linguistic, political, and economic information for each classification of the Caribbean",
            "Appreciate that the location of different islands/territories brought about differing positive and negative consequences for their people",
          ],
          materials: [
            "Large physical Caribbean map or digital interactive map",
            "Island silhouette cutouts (laminated)",
            "Colored markers/pencils (4 different colors)",
            "Research devices (tablets/computers)",
            "Bristol board and art supplies",
            "Flag printouts or digital images",
            "Coordinate reference sheets",
          ],
          procedure: [
            "Phase 1: Human Grouping Introduction Activity (20 minutes)",
            "Phase 2: Caribbean Island Observation and Initial Grouping (25 minutes)",
            "Phase 3: Official Geographic Classifications (35 minutes)",
            "Phase 4: Detailed Windward and Leeward Investigation (20 minutes)",
            "Phase 5: Hands-On Mapping and Flag Activity (30 minutes)",
            "Phase 6: Language and Political Analysis (25 minutes)",
            "Phase 7: Strategic Location Analysis (20 minutes)",
            "Phase 8: Synthesis and Evaluation (15 minutes)",
          ],
          assessment: [
            "Accurately identifies and maps all four Caribbean classification systems",
            "Demonstrates understanding of geographic advantages and challenges",
            "Shows sophisticated spatial thinking and location analysis",
            "Participates actively in classification discussions",
          ],
        },
      ],
    },
    {
      id: "island-formation",
      title: "Volcanic vs. Coral Island Formation",
      icon: Mountain,
      activities: [
        {
          title: "Volcanic vs. Coral Island Formation Investigation",
          duration: "155 minutes",
          learningOutcomes: [
            "Describe the geographic differences between coral and volcanic island formations",
            "Explain the impact of different island types on the economy and people's way of life",
            "Appreciate that both volcanic and coral islands hold environmental and economic benefits and pose challenges",
          ],
          materials: [
            "Digital devices for virtual tours",
            "3D modeling materials (clay, foam, cardboard)",
            "Art supplies for island models",
            "Science investigation worksheets",
            "Economic data sheets",
            "Craft materials for home design project",
            'Video access: "Geo\'s Island Adventure"',
          ],
          procedure: [
            "Phase 1: Virtual Discovery and Comparison (30 minutes)",
            "Phase 2: Island Formation Science Investigation (35 minutes)",
            "Phase 3: Hands-On Island Model Creation (45 minutes)",
            "Phase 4: Economic and Lifestyle Impact Analysis (40 minutes)",
            "Phase 5: Island Home Design Challenge (35 minutes)",
            "Phase 6: Environmental Benefits and Challenges Synthesis (25 minutes)",
            "Phase 7: Island Adventure Board Game Creation (Optional Extension - 60 minutes)",
          ],
          assessment: [
            "Accurately explains formation processes and geological differences",
            "Shows sophisticated understanding of how geology affects economy and lifestyle",
            "Demonstrates creative, practical solutions addressing island-specific challenges",
            "Makes thorough comparisons highlighting advantages and challenges of both island types",
          ],
        },
      ],
    },
    {
      id: "landmarks-discovery",
      title: "Caribbean Landmarks Discovery and Mapping",
      icon: Landmark,
      activities: [
        {
          title: "Caribbean Landmarks Discovery and Mapping",
          duration: "175 minutes",
          learningOutcomes: [
            "Identify popular/major landmarks (natural and built) in the region",
            "Map the location of important landmarks in the region",
            "Appreciate the value (economic, cultural, historical) of familiar landmarks to the development of the region",
          ],
          materials: [
            "Digital devices for virtual tours and research",
            "Craft materials (paper, cardboard, paint, recyclables)",
            "Large Caribbean maps for coordinate plotting",
            "Travel brochure templates",
            "Landmark information sheets",
            "Kahoot/Quizlet accounts for interactive quizzes",
          ],
          procedure: [
            "Phase 1: Interactive Landmark Discovery (35 minutes)",
            "Phase 2: Coordinate Mapping Challenge (30 minutes)",
            "Phase 3: Landmark Craft Creation Project (45 minutes)",
            "Phase 4: Travel Brochure Creation (40 minutes)",
            "Phase 5: Economic Impact Analysis Workshop (35 minutes)",
            "Phase 6: Sustainable Development Solutions (45 minutes)",
            "Phase 7: Synthesis and Gallery Walk Exhibition (25 minutes)",
          ],
          assessment: [
            "Conducts thorough, accurate research with multiple reliable sources",
            "Accurately uses coordinates and creates detailed maps",
            "Shows sophisticated analysis of landmark value and impact",
            "Demonstrates innovative, practical solutions addressing real challenges",
          ],
        },
      ],
    },
    {
      id: "climate-cooperation",
      title: "Climate Analysis and Regional Cooperation",
      icon: CloudRain,
      activities: [
        {
          title: "Climate Analysis and Regional Cooperation",
          duration: "190 minutes",
          learningOutcomes: [
            "Describe climatic differences across the Caribbean",
            "Plot the coordinates of various islands and display differences in temperature and rainfall",
            "Appreciate the importance of climate and climate changes for shaping the economy, society, and policy decisions of various areas of the Caribbean",
          ],
          materials: [
            "Graph paper and coordinate plotting materials",
            "Climate data sheets for various Caribbean islands",
            "Digital devices for research and presentation creation",
            "Art supplies for island creation project",
            "Large Caribbean maps",
            "Temperature and rainfall data sets",
          ],
          procedure: [
            "Phase 1: Island Coordinate Plotting Challenge (25 minutes)",
            "Phase 2: Climate Data Mining and Analysis (35 minutes)",
            "Phase 3: Regional Climate Comparison Presentations (30 minutes)",
            "Phase 4: Climate Impact on Decision-Making (40 minutes)",
            "Phase 5: Climate Change Impact Analysis (35 minutes)",
            "Phase 6: Regional Cooperation Investigation (40 minutes)",
            "Phase 7: Creative Island Design Project (45 minutes)",
            "Phase 8: Assessment and Reflection (20 minutes)",
          ],
          assessment: [
            "Demonstrates sophisticated understanding of Caribbean climate patterns and variations",
            "Accurately creates and interprets climate graphs and maps",
            "Makes sophisticated connections between location and climate",
            "Clearly explains how climate affects government decisions and cooperation",
          ],
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Curriculum", href: "/curriculum" },
            { label: "Grade 5 Subjects", href: "/curriculum/grade5-subjects" },
            { label: "Social Studies Activities", href: "/curriculum/grade5-subjects/activities/social-studies" },
            {
              label: "Spatial Thinking",
              href: "/curriculum/grade5-subjects/activities/social-studies/spatial-thinking",
            },
          ]}
        />

        <div className="mb-8">
          <Link href="/curriculum/grade5-subjects/activities/social-studies">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Social Studies Activities
            </Button>
          </Link>

          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-lg p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <Globe className="h-12 w-12" />
              <div>
                <h1 className="text-4xl font-bold">Spatial Thinking Activities</h1>
                <p className="text-xl text-emerald-100">
                  Investigate Caribbean geography, island formations, landmarks, and climate through hands-on mapping
                  and analysis
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <BookOpen className="mr-1 h-4 w-4" />4 Comprehensive Activities
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Target className="mr-1 h-4 w-4" />
                Geographic Skills Focus
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Lightbulb className="mr-1 h-4 w-4" />
                Hands-On Learning
              </Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="island-classification" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="island-classification">Island Classification</TabsTrigger>
            <TabsTrigger value="island-formation">Island Formation</TabsTrigger>
            <TabsTrigger value="landmarks-discovery">Landmarks</TabsTrigger>
            <TabsTrigger value="climate-cooperation">Climate & Cooperation</TabsTrigger>
          </TabsList>

          {activityCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <category.icon className="h-8 w-8 text-emerald-600" />
                    <div>
                      <CardTitle className="text-2xl">{category.title}</CardTitle>
                      <CardDescription>
                        Detailed activities with learning outcomes, materials, and procedures
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.activities.map((activity, index) => (
                      <AccordionItem key={index} value={`activity-${index}`} className="border rounded-lg">
                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-4">
                              <Play className="h-5 w-5 text-emerald-600" />
                              <div className="text-left">
                                <h3 className="font-semibold text-lg">{activity.title}</h3>
                                <p className="text-sm text-gray-600">Duration: {activity.duration}</p>
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <div className="grid gap-6">
                            {/* Learning Outcomes */}
                            <div>
                              <h4 className="font-semibold text-lg mb-3 text-emerald-700">Learning Outcomes</h4>
                              <ul className="space-y-2">
                                {activity.learningOutcomes.map((outcome, outcomeIndex) => (
                                  <li key={outcomeIndex} className="flex items-start gap-2">
                                    <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">{outcome}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Materials */}
                            <div>
                              <h4 className="font-semibold text-lg mb-3 text-emerald-700">Materials Needed</h4>
                              <ul className="space-y-2">
                                {activity.materials.map((material, materialIndex) => (
                                  <li key={materialIndex} className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                                    <span className="text-sm">{material}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Procedure */}
                            <div>
                              <h4 className="font-semibold text-lg mb-3 text-emerald-700">Procedure</h4>
                              <ol className="space-y-2">
                                {activity.procedure.map((step, stepIndex) => (
                                  <li key={stepIndex} className="flex items-start gap-3">
                                    <span className="bg-emerald-100 text-emerald-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                                      {stepIndex + 1}
                                    </span>
                                    <span className="text-sm">{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>

                            {/* Assessment */}
                            <div>
                              <h4 className="font-semibold text-lg mb-3 text-emerald-700">Assessment Criteria</h4>
                              <ul className="space-y-2">
                                {activity.assessment.map((criterion, criterionIndex) => (
                                  <li key={criterionIndex} className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                    <span className="text-sm">{criterion}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Additional Resources */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">Additional Resources</CardTitle>
            <CardDescription>Supplementary materials and cross-curricular connections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-lg mb-3">Cross-Curricular Connections</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">
                      Science: Geological processes, ecosystem preservation, climate impact
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">
                      Mathematics: Calculate distances, analyze tourism statistics, budget planning
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">
                      Art: Visual design, 3D modeling, color theory, cultural representation
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">
                      Technology: Digital research, GPS coordinate systems, presentation software
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-3">Key Skills Developed</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">Geographic reasoning and spatial thinking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">Map reading and coordinate plotting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">Data analysis and interpretation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">Environmental awareness and sustainability thinking</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
