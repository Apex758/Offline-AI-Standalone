import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, MapPin, Globe, Thermometer, Home, CloudRain } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function SpatialThinkingActivitiesPage() {
  const activitySections = [
    {
      title: "Human Adaptation and Lifestyle in Diverse Climatic Regions",
      icon: <Globe className="h-6 w-6" />,
      color: "blue",
      activities: [
        {
          title: "Earth from Space Drawing and Analysis",
          description: "Students draw Earth from space perspective and compare with real imagery",
          duration: "50 minutes",
          href: "/curriculum/grade6-subjects/social-studies/spatial-thinking/activities/earth-from-space",
        },
        {
          title: "Continents Discovery with Interactive Globe",
          description: "Hands-on exploration of continents using inflatable globes and mapping",
          duration: "60 minutes",
          href: "/curriculum/grade6-subjects/social-studies/spatial-thinking/activities/continents-discovery",
        },
        {
          title: "Oceans Learning with Musical Memory",
          description: "Learn about oceans through songs and memory techniques",
          duration: "45 minutes",
          href: "/curriculum/grade6-subjects/social-studies/spatial-thinking/activities/oceans-musical-memory",
        },
        {
          title: "Continents and Oceans Interactive Game",
          description: "Interactive mapping game to reinforce geographical knowledge",
          duration: "40 minutes",
          href: "/curriculum/grade6-subjects/social-studies/spatial-thinking/activities/interactive-geography-game",
        },
      ],
    },
    {
      title: "Climatic Regions",
      icon: <Thermometer className="h-6 w-6" />,
      color: "green",
      activities: [
        {
          title: "Digital Climatic Zone Exploration",
          description: "Use digital tools to explore and map world climatic zones",
          duration: "75 minutes",
          href: "/curriculum/grade6-subjects/social-studies/spatial-thinking/activities/digital-climatic-zones",
        },
        {
          title: "Climatic Zone Presentation Project",
          description: "Research and present on different climatic zones with creative elements",
          duration: "90 minutes",
          href: "/curriculum/grade6-subjects/social-studies/spatial-thinking/activities/climatic-zone-presentations",
        },
        {
          title: "Regional Comparison and Analysis",
          description: "Compare and classify countries by climatic zones",
          duration: "50 minutes",
          href: "/curriculum/grade6-subjects/social-studies/spatial-thinking/activities/regional-comparison",
        },
      ],
    },
    {
      title: "Adaptation and Lifestyle",
      icon: <Home className="h-6 w-6" />,
      color: "orange",
      activities: [
        {
          title: "Virtual Field Trip and Cultural Exploration",
          description: "Explore how people adapt to different climates through virtual tours",
          duration: "90 minutes",
          href: "/curriculum/grade6-subjects/social-studies/spatial-thinking/activities/virtual-field-trip",
        },
        {
          title: "STEM House Design Challenge",
          description: "Design and build climate-appropriate housing models",
          duration: "120 minutes",
          href: "/curriculum/grade6-subjects/social-studies/spatial-thinking/activities/stem-house-design",
        },
        {
          title: "Economic Impact Analysis of Landmarks",
          description: "Analyze the economic impact of Caribbean landmarks",
          duration: "75 minutes",
          href: "/curriculum/grade6-subjects/social-studies/spatial-thinking/activities/economic-impact-analysis",
        },
      ],
    },
    {
      title: "Extreme Climatic Conditions",
      icon: <CloudRain className="h-6 w-6" />,
      color: "red",
      activities: [
        {
          title: "Weather News Report Analysis and Creation",
          description: "Analyze weather reports and create original extreme weather broadcasts",
          duration: "60 minutes",
          href: "/curriculum/grade6-subjects/social-studies/spatial-thinking/activities/weather-news-reports",
        },
        {
          title: "Jigsaw Research on Managing Extreme Conditions",
          description: "Collaborative research on managing different extreme weather conditions",
          duration: "90 minutes",
          href: "/curriculum/grade6-subjects/social-studies/spatial-thinking/activities/jigsaw-extreme-weather",
        },
        {
          title: "Case Study Analysis and Problem-Solving",
          description: "Analyze real extreme weather cases and develop solutions",
          duration: "75 minutes",
          href: "/curriculum/grade6-subjects/social-studies/spatial-thinking/activities/case-study-analysis",
        },
      ],
    },
  ]

  return (
    <div className="container mx-auto py-8">
            <Link href="/curriculum/grade6-subjects/social-studies/spatial-thinking">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Spatial Thinking
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-100 to-green-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-blue-700 flex items-center">
            <MapPin className="mr-2 h-7 w-7 text-blue-600" />
            Spatial Thinking Activities
          </h1>
          <p className="text-gray-700">
            Explore diverse geography, climatic regions, human adaptation, and extreme weather through engaging,
            hands-on activities that help students understand how geography shapes human life and culture.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {activitySections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <div className={`bg-${section.color}-50 p-4 rounded-lg border border-${section.color}-200 mb-4`}>
              <h2 className={`text-xl font-bold text-${section.color}-700 flex items-center mb-2`}>
                {section.icon}
                <span className="ml-2">{section.title}</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.activities.map((activity, activityIndex) => (
                <Card
                  key={activityIndex}
                  className={`border-t-4 border-${section.color}-500 shadow-md hover:shadow-lg transition-all duration-300`}
                >
                  <CardHeader className={`bg-${section.color}-50`}>
                    <CardTitle className={`text-${section.color}-700 text-lg`}>{activity.title}</CardTitle>
                    <CardDescription className="text-sm">Duration: {activity.duration}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-gray-600 mb-4 text-sm">{activity.description}</p>
                    <Link href={activity.href}>
                      <Button className={`w-full bg-${section.color}-600 hover:bg-${section.color}-700`}>
                        View Activity Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Activity Overview</h3>
        <p className="text-gray-700 mb-4">
          These 13 comprehensive activities guide students through understanding Earth's geography, climate zones, human
          adaptation strategies, and extreme weather management. Each activity incorporates multiple learning styles and
          assessment strategies to ensure all students can engage meaningfully with spatial thinking concepts.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Key Learning Outcomes:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Understanding Earth's physical features from space perspective</li>
              <li>Identifying and locating continents and oceans</li>
              <li>Recognizing global climatic zones and their characteristics</li>
              <li>Analyzing human adaptation to different environments</li>
              <li>Developing strategies for managing extreme weather</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Assessment Strategies:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Drawing comparisons and revisions</li>
              <li>Interactive mapping accuracy</li>
              <li>Presentation rubrics and peer assessment</li>
              <li>STEM design challenges</li>
              <li>Case study analysis and problem-solving</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
