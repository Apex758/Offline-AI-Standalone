import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shapes,
  RotateCcw,
  Eye,
  Calculator,
  Compass,
  Triangle,
  Square,
  Hexagon,
  Clock,
  Users,
  Target,
  BookOpen,
  Camera,
  Palette,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { Breadcrumb } from "@/components/breadcrumb"

export default function GeometricalThinkingActivitiesPage() {
  const curriculumOutcomes = [
    {
      id: "G1.1",
      title: "Developing Spatial Sense",
      description: "Exploring geometric shapes, relationships, and spatial visualization",
      activities: ["Quadrilateral Property Detective", "3D Orthographic Drawing", "Symmetry Scavenger Hunt"],
    },
    {
      id: "G1.2",
      title: "Sorting, Patterning, and Building",
      description: "Representing 3D shapes, constructing angles, and analyzing properties",
      activities: ["3D Shape Construction Lab", "Angle Art Studio", "3D Shape Attribute Sorting"],
    },
    {
      id: "G2.1",
      title: "Analyzing and Describing Shapes",
      description: "Understanding angle relationships and polygon properties",
      activities: ["Angle Relationship Investigation", "Polygon Interior Angle Explorer"],
    },
    {
      id: "G2.2",
      title: "Naming 2D & 3D Shapes",
      description: "Recognizing, classifying, and naming geometric shapes",
      activities: ["Angle Classification Olympics", "3D Shape Museum"],
    },
    {
      id: "G2.3",
      title: "Comparing and Adding Angles",
      description: "Calculating unknown angles and understanding relationships",
      activities: ["Angle Arithmetic Adventure", "Parallel Lines Workshop"],
    },
    {
      id: "G3.1",
      title: "Combining Shapes",
      description: "Plotting coordinates and constructing precise angles",
      activities: ["Coordinate Plane Navigation", "Angle Construction Workshop"],
    },
    {
      id: "G3.2",
      title: "Deconstructing Shapes",
      description: "Identifying angles within complex shapes",
      activities: ["Shape Dissection Laboratory"],
    },
    {
      id: "G3.3",
      title: "Transforming Shapes",
      description: "Creating tessellations and performing transformations",
      activities: ["Tessellation Design Studio", "Transformation Theater", "Symmetry Detective"],
    },
  ]

  const featuredActivities = [
    {
      id: "quadrilateral-detective",
      title: "Quadrilateral Property Detective",
      outcome: "G1.1",
      duration: "60-75 minutes",
      difficulty: "Intermediate",
      description:
        "Investigate properties of quadrilaterals through hands-on measurement and analysis, discovering hierarchical relationships between different types.",
      materials: [
        "Various quadrilateral cut-outs",
        "Property recording sheets",
        "Rulers and protractors",
        "Venn diagram templates",
      ],
      keySkills: [
        "Measuring side lengths and angles",
        "Identifying diagonal properties",
        "Understanding shape hierarchies",
        "Creating mathematical arguments",
      ],
      realWorldConnections: ["Architecture and building design", "Engineering blueprints", "Art and pattern design"],
      icon: Square,
      color: "bg-blue-500",
    },
    {
      id: "3d-orthographic",
      title: "3D Orthographic Drawing Challenge",
      outcome: "G1.1",
      duration: "45-60 minutes",
      difficulty: "Advanced",
      description:
        "Build 3D structures and create technical drawings showing multiple views, developing spatial visualization skills.",
      materials: [
        "Interlocking cubes",
        "Isometric dot paper",
        "Orthographic drawing sheets",
        "Digital tools (optional)",
      ],
      keySkills: [
        "Spatial visualization",
        "Technical drawing skills",
        "3D to 2D representation",
        "Perspective understanding",
      ],
      realWorldConnections: ["Engineering design", "Architecture", "3D modeling and animation", "Manufacturing"],
      icon: Eye,
      color: "bg-green-500",
    },
    {
      id: "tessellation-studio",
      title: "Tessellation Design Studio",
      outcome: "G3.3",
      duration: "90-120 minutes",
      difficulty: "Advanced",
      description:
        "Create mathematical art through tessellation patterns, understanding angle requirements and transformation properties.",
      materials: ["Pattern blocks", "Grid paper", "Colored pencils", "Polygon templates", "Tracing paper"],
      keySkills: [
        "Angle calculations (360° around vertices)",
        "Pattern recognition",
        "Transformation understanding",
        "Creative mathematical thinking",
      ],
      realWorldConnections: [
        "Islamic geometric art",
        "M.C. Escher artwork",
        "Tile and flooring design",
        "Textile patterns",
      ],
      icon: Hexagon,
      color: "bg-purple-500",
    },
    {
      id: "angle-relationships",
      title: "Angle Relationship Investigation",
      outcome: "G2.1",
      duration: "50-65 minutes",
      difficulty: "Intermediate",
      description:
        "Discover angle relationships formed by parallel lines and transversals through measurement and real-world applications.",
      materials: [
        "Parallel line diagrams",
        "Protractors",
        "Colored pencils",
        "Architecture photographs",
        "Calculators",
      ],
      keySkills: [
        "Identifying corresponding angles",
        "Understanding alternate angles",
        "Calculating co-interior angles",
        "Applying angle relationships",
      ],
      realWorldConnections: ["Building construction", "Bridge engineering", "Railroad track design", "Urban planning"],
      icon: Triangle,
      color: "bg-orange-500",
    },
    {
      id: "coordinate-navigation",
      title: "Coordinate Plane Navigation",
      outcome: "G3.1",
      duration: "45-60 minutes",
      difficulty: "Beginner",
      description:
        "Master coordinate plotting through games and geometric art creation, building foundation for advanced mathematics.",
      materials: ["Large coordinate grids", "Coordinate cards", "Measuring tools", "Graphing calculators (optional)"],
      keySkills: [
        "Plotting coordinate pairs",
        "Understanding quadrants",
        "Calculating distances",
        "Creating geometric shapes",
      ],
      realWorldConnections: ["GPS navigation", "Computer graphics", "Map reading", "Video game design"],
      icon: Compass,
      color: "bg-teal-500",
    },
    {
      id: "transformation-theater",
      title: "Transformation Theater",
      outcome: "G3.3",
      duration: "60-75 minutes",
      difficulty: "Intermediate",
      description:
        "Act out geometric transformations through physical movement and coordinate manipulation, making abstract concepts concrete.",
      materials: ["Coordinate grids", "Tracing paper", "Transformation cards", "Large floor diagrams", "Colored tape"],
      keySkills: [
        "Performing translations",
        "Understanding rotations",
        "Creating reflections",
        "Combining transformations",
      ],
      realWorldConnections: [
        "Computer animation",
        "Robotics programming",
        "Dance choreography",
        "Architectural design",
      ],
      icon: RotateCcw,
      color: "bg-red-500",
    },
  ]

  const assessmentStrategies = [
    {
      type: "Formative Assessment",
      icon: BookOpen,
      methods: [
        "Geometric thinking journals with reflection prompts",
        "Peer teaching and explanation sessions",
        "Exit tickets with spatial reasoning questions",
        "Self-assessment rubrics for spatial skills",
        "Process observation during hands-on activities",
      ],
    },
    {
      type: "Summative Assessment",
      icon: Target,
      methods: [
        "Geometric design portfolio with mathematical explanations",
        "3D model presentation with analysis",
        "Real-world geometry investigation report",
        "Transformation art project with mathematical justification",
        "Comprehensive shape and angle assessment",
      ],
    },
    {
      type: "Authentic Assessment",
      icon: Camera,
      methods: [
        "Architecture photography project with geometric analysis",
        "Design challenge solving real-world problems",
        "Peer tutoring demonstration of geometric concepts",
        "Community geometry scavenger hunt documentation",
        "Mathematical art exhibition with artist statements",
      ],
    },
  ]

  const differentiationStrategies = [
    {
      learnerType: "Visual Learners",
      color: "bg-blue-100 text-blue-800",
      strategies: [
        "Color-coded angle relationships",
        "Detailed geometric drawings and diagrams",
        "Visual pattern recognition activities",
        "Graphic organizers for shape properties",
        "Digital geometry software exploration",
      ],
    },
    {
      learnerType: "Kinesthetic Learners",
      color: "bg-green-100 text-green-800",
      strategies: [
        "Physical manipulation of 3D objects",
        "Body movement to demonstrate transformations",
        "Building and construction activities",
        "Large-scale floor coordinate activities",
        "Hands-on measurement and construction",
      ],
    },
    {
      learnerType: "Advanced Learners",
      color: "bg-purple-100 text-purple-800",
      strategies: [
        "Complex multi-step geometric proofs",
        "Independent investigation projects",
        "Advanced tessellation and fractal exploration",
        "Peer tutoring and teaching opportunities",
        "Connection to higher-level mathematics",
      ],
    },
    {
      learnerType: "Struggling Learners",
      color: "bg-orange-100 text-orange-800",
      strategies: [
        "Concrete manipulatives and models",
        "Step-by-step guided instruction",
        "Collaborative group work support",
        "Multiple representation of concepts",
        "Frequent check-ins and feedback",
      ],
    },
  ]

  const technologyIntegration = [
    {
      tool: "GeoGebra",
      applications: ["Dynamic angle exploration", "Transformation visualization", "Coordinate graphing"],
      icon: Calculator,
    },
    {
      tool: "Tinkercad",
      applications: ["3D modeling and design", "Orthographic view creation", "Spatial visualization"],
      icon: Eye,
    },
    {
      tool: "Graphing Calculators",
      applications: ["Coordinate plotting", "Angle calculations", "Pattern analysis"],
      icon: Compass,
    },
    {
      tool: "Digital Cameras",
      applications: ["Geometry photography", "Symmetry documentation", "Real-world angle hunting"],
      icon: Camera,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Curriculum", href: "/curriculum" },
            { label: "Grade 6 Subjects", href: "/curriculum/grade6-subjects" },
            { label: "Mathematics Activities", href: "/curriculum/grade6-subjects/activities/mathematics" },
            {
              label: "Geometrical Thinking",
              href: "/curriculum/grade6-subjects/activities/mathematics/geometrical-thinking",
            },
          ]}
        />

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Shapes className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Geometrical Thinking Activities</h1>
              <p className="text-xl text-gray-600">Grade 6 Mathematics • Spatial Reasoning & Shape Analysis</p>
            </div>
          </div>

          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Develop spatial reasoning and geometric understanding through hands-on exploration of shapes, angles,
            transformations, and coordinate geometry. These activities connect abstract mathematical concepts to
            real-world applications in art, architecture, and design.
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Shapes className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">18</div>
              <div className="text-sm text-gray-600">Core Activities</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">8</div>
              <div className="text-sm text-gray-600">Curriculum Outcomes</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">45-120</div>
              <div className="text-sm text-gray-600">Minutes Per Activity</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">Individual & Group</div>
              <div className="text-sm text-gray-600">Learning Formats</div>
            </CardContent>
          </Card>
        </div>

        {/* Curriculum Outcomes Overview */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              Curriculum Outcomes & Activities
            </CardTitle>
            <CardDescription>
              Comprehensive coverage of Grade 6 Geometrical Thinking outcomes through engaging activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {curriculumOutcomes.map((outcome) => (
                <div key={outcome.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="font-mono">
                      {outcome.id}
                    </Badge>
                    <h3 className="font-semibold text-gray-900">{outcome.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{outcome.description}</p>
                  <div className="space-y-1">
                    {outcome.activities.map((activity, index) => (
                      <div key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        {activity}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Featured Activities */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Featured Activities</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredActivities.map((activity) => {
              const IconComponent = activity.icon
              return (
                <Card key={activity.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${activity.color} rounded-xl flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{activity.title}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {activity.outcome}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm">{activity.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Activity Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{activity.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-gray-500" />
                        <span>{activity.difficulty}</span>
                      </div>
                    </div>

                    {/* Materials */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Materials Needed</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {activity.materials.slice(0, 4).map((material, index) => (
                          <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                            {material}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Skills */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Skills Developed</h4>
                      <ul className="space-y-1">
                        {activity.keySkills.slice(0, 3).map((skill, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Real-World Connections */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Real-World Connections</h4>
                      <div className="flex flex-wrap gap-1">
                        {activity.realWorldConnections.slice(0, 3).map((connection, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {connection}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <Button asChild className="w-full" size="sm">
                        <Link
                          href={`/curriculum/grade6-subjects/activities/mathematics/geometrical-thinking/${activity.id}`}
                        >
                          View Full Activity
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Assessment & Differentiation Tabs */}
        <Tabs defaultValue="assessment" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assessment">Assessment Strategies</TabsTrigger>
            <TabsTrigger value="differentiation">Differentiation</TabsTrigger>
            <TabsTrigger value="technology">Technology Integration</TabsTrigger>
          </TabsList>

          <TabsContent value="assessment" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {assessmentStrategies.map((strategy, index) => {
                const IconComponent = strategy.icon
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <IconComponent className="w-5 h-5 text-indigo-600" />
                        {strategy.type}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {strategy.methods.map((method, methodIndex) => (
                          <li key={methodIndex} className="text-sm text-gray-600 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                            {method}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="differentiation" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {differentiationStrategies.map((strategy, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge className={strategy.color}>{strategy.learnerType}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {strategy.strategies.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm text-gray-600 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="technology" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {technologyIntegration.map((tech, index) => {
                const IconComponent = tech.icon
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                        {tech.tool}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tech.applications.map((app, appIndex) => (
                          <li key={appIndex} className="text-sm text-gray-600 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            {app}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Cross-Curricular Connections */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-6 h-6 text-purple-600" />
              Cross-Curricular Integration
            </CardTitle>
            <CardDescription>
              Connect geometric thinking to other subjects for authentic, meaningful learning experiences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Art & Design</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Islamic geometric patterns</li>
                  <li>• M.C. Escher tessellations</li>
                  <li>• Architectural photography</li>
                  <li>• Symmetry in nature art</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Science & Technology</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Crystalline structures</li>
                  <li>• 3D modeling and printing</li>
                  <li>• Engineering design process</li>
                  <li>• Computer graphics programming</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Social Studies</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Cultural geometric traditions</li>
                  <li>• Historical architecture analysis</li>
                  <li>• Map reading and navigation</li>
                  <li>• Urban planning concepts</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/curriculum/grade6-subjects/activities/mathematics">← Back to Mathematics Activities</Link>
            </Button>
            <Button asChild size="lg">
              <Link href="/curriculum/grade6-subjects/mathematics/geometrical-thinking">View Curriculum Standards</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
