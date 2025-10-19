import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/breadcrumb"
import { Clock, Users, Target, Lightbulb, Rocket, Leaf, Globe, Zap, Beaker, Search } from "lucide-react"
import { Link } from "react-router-dom"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

const crossStrandProjects = [
  {
    id: "hurricane-preparedness-system",
    title: "Hurricane Preparedness Engineering Challenge",
    description:
      "Design and build hurricane-resistant structures while studying weather patterns, materials, and energy transfer",
    strands: ["Earth Systems", "Engineering Design", "Structure & Properties of Matter"],
    duration: "3-4 weeks",
    participants: "3-4 students",
    difficulty: "Advanced",
    objectives: [
      "Analyze hurricane formation and Earth system interactions",
      "Test material properties for wind and water resistance",
      "Design and iterate structural solutions",
      "Understand energy transfer in weather systems",
    ],
    materials: [
      "Building materials (cardboard, wood sticks, tape)",
      "Fan for wind simulation",
      "Water spray bottles",
      "Weather tracking tools",
      "Design journals",
    ],
    activities: [
      "Research Caribbean hurricane patterns and impacts",
      "Test material strength and water resistance",
      "Design hurricane-resistant house models",
      "Simulate hurricane conditions and test designs",
      "Analyze energy transfer during storms",
      "Present solutions to community panel",
    ],
    assessment: "Design portfolio, prototype testing results, presentation to community members",
    extensions: [
      "Interview local emergency management officials",
      "Create community preparedness guide",
      "Design early warning systems",
    ],
    image: "/hurricane-engineering-challenge.png",
  },
  {
    id: "coral-reef-restoration-lab",
    title: "Coral Reef Restoration Laboratory",
    description: "Investigate coral bleaching, design restoration solutions, and study ecosystem interactions",
    strands: ["Matter & Energy in Ecosystems", "Structure & Properties of Matter", "Engineering Design"],
    duration: "4-5 weeks",
    participants: "2-3 students",
    difficulty: "Advanced",
    objectives: [
      "Understand coral-algae symbiotic relationships",
      "Investigate chemical properties affecting coral health",
      "Design artificial reef structures",
      "Analyze energy flow in reef ecosystems",
    ],
    materials: [
      "pH testing kits",
      "Temperature sensors",
      "Microscopes",
      "Modeling clay and materials",
      "Aquarium setup (if available)",
      "Research materials on Caribbean reefs",
    ],
    activities: [
      "Study coral biology and symbiosis",
      "Test water chemistry effects on coral models",
      "Design artificial reef structures",
      "Model energy flow in reef ecosystems",
      "Create restoration action plan",
      "Present findings to marine biologists",
    ],
    assessment: "Scientific report, prototype design, ecosystem model, expert presentation",
    extensions: [
      "Partner with local marine conservation groups",
      "Create public awareness campaign",
      "Design underwater monitoring systems",
    ],
    image: "/coral-reef-restoration.png",
  },
  {
    id: "space-agriculture-mission",
    title: "Caribbean Space Agriculture Mission",
    description: "Design sustainable food systems for space missions using Caribbean crops and solar energy",
    strands: ["Space Systems", "Matter & Energy in Ecosystems", "Engineering Design"],
    duration: "3-4 weeks",
    participants: "4-5 students",
    difficulty: "Advanced",
    objectives: [
      "Understand plant growth requirements and photosynthesis",
      "Analyze solar energy patterns and efficiency",
      "Design closed-loop agricultural systems",
      "Study space environment challenges",
    ],
    materials: [
      "Seeds of Caribbean crops (beans, peppers, herbs)",
      "LED grow lights",
      "Hydroponic materials",
      "Solar panels (small)",
      "pH and nutrient testing kits",
      "Growth measurement tools",
    ],
    activities: [
      "Research space agriculture challenges",
      "Test Caribbean crop growth under different light conditions",
      "Design solar-powered growing systems",
      "Create closed-loop nutrient cycles",
      "Monitor plant growth and energy efficiency",
      'Present mission proposal to "space agency"',
    ],
    assessment: "Mission proposal, system design, growth data analysis, presentation",
    extensions: [
      "Connect with space agencies or universities",
      "Design life support systems",
      "Create space nutrition plans",
    ],
    image: "/space-agriculture-mission.png",
  },
  {
    id: "renewable-energy-island",
    title: "Sustainable Island Energy Grid",
    description: "Design renewable energy systems for Caribbean islands using multiple energy sources",
    strands: ["Earth Systems", "Engineering Design", "Structure & Properties of Matter"],
    duration: "4-5 weeks",
    participants: "3-4 students",
    difficulty: "Advanced",
    objectives: [
      "Analyze renewable energy sources available in Caribbean",
      "Understand energy storage and distribution",
      "Design integrated energy systems",
      "Study material properties for energy applications",
    ],
    materials: [
      "Small solar panels",
      "Wind turbine kits",
      "Batteries and LED lights",
      "Voltmeters and ammeters",
      "Building materials for models",
      "Island maps and weather data",
    ],
    activities: [
      "Research Caribbean energy challenges and resources",
      "Test efficiency of different renewable sources",
      "Design hybrid energy systems",
      "Build scale model of island energy grid",
      "Analyze energy storage solutions",
      "Present to local energy officials",
    ],
    assessment: "System design, efficiency testing, cost-benefit analysis, policy presentation",
    extensions: [
      "Partner with local utility companies",
      "Create energy conservation campaigns",
      "Design smart grid technologies",
    ],
    image: "/renewable-energy-island.png",
  },
  {
    id: "climate-monitoring-network",
    title: "Caribbean Climate Monitoring Network",
    description: "Build weather monitoring stations and analyze climate patterns using space and Earth data",
    strands: ["Earth Systems", "Space Systems", "Engineering Design"],
    duration: "5-6 weeks",
    participants: "2-4 students",
    difficulty: "Expert",
    objectives: [
      "Understand climate vs. weather patterns",
      "Analyze satellite data and ground observations",
      "Design automated monitoring systems",
      "Study long-term climate trends",
    ],
    materials: [
      "Weather sensors (temperature, humidity, pressure)",
      "Data loggers or microcontrollers",
      "Satellite imagery access",
      "Graphing and analysis software",
      "Weather station housing materials",
    ],
    activities: [
      "Study Caribbean climate patterns and changes",
      "Build automated weather monitoring stations",
      "Collect and analyze local weather data",
      "Compare ground data with satellite observations",
      "Create climate trend reports",
      "Present findings to meteorologists",
    ],
    assessment: "Data collection system, trend analysis, scientific report, expert presentation",
    extensions: [
      "Connect with national weather services",
      "Create climate change awareness materials",
      "Design early warning systems",
    ],
    image: "/climate-monitoring-network.png",
  },
  {
    id: "biodegradable-plastics-lab",
    title: "Caribbean Biodegradable Plastics Laboratory",
    description: "Create biodegradable plastics from local materials and test their environmental impact",
    strands: ["Structure & Properties of Matter", "Matter & Energy in Ecosystems", "Engineering Design"],
    duration: "3-4 weeks",
    participants: "2-3 students",
    difficulty: "Advanced",
    objectives: [
      "Understand polymer chemistry and biodegradation",
      "Investigate environmental impact of plastics",
      "Design sustainable material alternatives",
      "Test material properties and decomposition",
    ],
    materials: [
      "Natural polymers (starch, gelatin, agar)",
      "Local plant materials (banana peels, coconut fiber)",
      "pH indicators and testing materials",
      "Compost bins for decomposition testing",
      "Strength testing equipment",
    ],
    activities: [
      "Research plastic pollution in Caribbean waters",
      "Extract natural polymers from local plants",
      "Create biodegradable plastic formulations",
      "Test material strength and flexibility",
      "Monitor decomposition in different environments",
      "Present solutions to environmental groups",
    ],
    assessment: "Material testing results, environmental impact analysis, prototype development",
    extensions: [
      "Partner with environmental organizations",
      "Create business plan for sustainable materials",
      "Design waste reduction campaigns",
    ],
    image: "/biodegradable-plastics-lab.png",
  },
]

export default function CrossStrandIntegrationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 5", href: "/curriculum/grade5-subjects" },
          { label: "Science Activities", href: "/curriculum/grade5-subjects/activities/science" },
          {
            label: "Cross-Strand Integration",
            href: "/curriculum/grade5-subjects/activities/science/cross-strand-integration",
          },
        ]}
      />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Rocket className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cross-Strand Integration Projects</h1>
            <p className="text-gray-600">Advanced multi-disciplinary science investigations</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Integration Focus Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Environmental Systems</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium">Energy & Technology</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Sustainability Solutions</span>
            </div>
            <div className="flex items-center gap-2">
                              <Search className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Space & Earth Connections</span>
            </div>
            <div className="flex items-center gap-2">
              <Beaker className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">Materials Innovation</span>
            </div>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">Engineering Design</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {crossStrandProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-xl text-gray-900">{project.title}</CardTitle>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {project.difficulty}
                </Badge>
              </div>
              <CardDescription className="text-gray-600">{project.description}</CardDescription>

              <div className="flex flex-wrap gap-2 mt-3">
                {project.strands.map((strand) => (
                  <Badge key={strand} variant="outline" className="text-xs">
                    {strand}
                  </Badge>
                ))}
              </div>
            </CardHeader>

            <CardContent>
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                <img src="" alt="" className="w-full h-full object-cover" />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{project.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{project.participants}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Multi-strand</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Learning Objectives</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {project.objectives.slice(0, 3).map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Key Activities</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {project.activities.slice(0, 3).map((activity, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Assessment</h4>
                  <p className="text-sm text-gray-600">{project.assessment}</p>
                </div>

                {project.extensions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Extension Opportunities</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {project.extensions.map((extension, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          {extension}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-6">
                <Button asChild className="flex-1">
                  <Link to={`/planner?activity=${project.id}&subject=science&grade=5`}>
                    Create Lesson Plan
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to={`/curriculum/grade5-subjects/activities/science/cross-strand-integration/${project.id}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Implementation Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <h4 className="font-medium mb-2">Project Management</h4>
            <ul className="space-y-1">
              <li>• Allow 3-6 weeks for complete projects</li>
              <li>• Schedule regular check-ins and milestones</li>
              <li>• Encourage peer collaboration and feedback</li>
              <li>• Document process and iterations</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Assessment Strategies</h4>
            <ul className="space-y-1">
              <li>• Use rubrics for multi-strand evaluation</li>
              <li>• Include self and peer assessments</li>
              <li>• Emphasize process over final product</li>
              <li>• Connect to real-world applications</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <Button variant="outline" asChild>
          <Link to="/curriculum/grade5-subjects/activities/science">← Back to Science Activities</Link>
        </Button>
        <Link to="/curriculum/grade5-subjects/activities/science/engineering-design"><Button>
            Engineering Design Activities →
          </Button></Link>
      </div>
    </div>
  )
}
