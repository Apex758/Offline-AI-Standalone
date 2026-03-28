import { Link } from "react-router-dom"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from '@hugeicons/react';
import ArrowLeft01IconData from '@hugeicons/core-free-icons/ArrowLeft01Icon';
import Search01IconData from '@hugeicons/core-free-icons/Search01Icon';
import BookOpen01IconData from '@hugeicons/core-free-icons/BookOpen01Icon';
import MapsIconData from '@hugeicons/core-free-icons/MapsIcon';
import UserGroupIconData from '@hugeicons/core-free-icons/UserGroupIcon';
import Dollar01IconData from '@hugeicons/core-free-icons/Dollar01Icon';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const ChevronLeft: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowLeft01IconData} {...p} />;
const Search: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Search01IconData} {...p} />;
const BookOpen: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={BookOpen01IconData} {...p} />;
const Map: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={MapsIconData} {...p} />;
const Users: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={UserGroupIconData} {...p} />;
const DollarSign: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Dollar01IconData} {...p} />;
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

const socialStudiesStrands = [
  {
    id: "historical-cultural-thinking",
    title: "Historical and Cultural Thinking",
    description:
      "Explore Indigenous peoples of the Caribbean, European colonization, and the evolution of Indigenous culture in modern times.",
    icon: <BookOpen className="h-10 w-10 text-blue-500" />,
    image: "/placeholder-nm2ja.png",
    color: "bg-blue-50 hover:bg-blue-100",
    borderColor: "border-blue-200",
    activities: 8,
    difficulty: "Medium",
    tags: ["indigenous", "colonization", "culture", "history"],
  },
  {
    id: "spatial-thinking",
    title: "Spatial Thinking",
    description:
      "Discover geographic features, climate patterns, land use, and environmental vulnerabilities that shape our island.",
    icon: <Map className="h-10 w-10 text-green-500" />,
    image: "/placeholder-p641o.png",
    color: "bg-green-50 hover:bg-green-100",
    borderColor: "border-green-200",
    activities: 7,
    difficulty: "Medium",
    tags: ["geography", "climate", "environment", "parklands"],
  },
  {
    id: "civic-participation",
    title: "Civic Participation",
    description:
      "Learn about communication technology, transportation, political evolution, government systems, and democracy.",
    icon: <Users className="h-10 w-10 text-purple-500" />,
    image: "/placeholder-4y8sj.png",
    color: "bg-purple-50 hover:bg-purple-100",
    borderColor: "border-purple-200",
    activities: 6,
    difficulty: "Medium",
    tags: ["government", "democracy", "communication", "citizenship"],
  },
  {
    id: "economic-decision-making",
    title: "Economic Decision Making",
    description: "Understand how natural resources, economic activities, and environmental issues shape our economy.",
    icon: <DollarSign className="h-10 w-10 text-amber-500" />,
    image: "/children-economy-resources.png",
    color: "bg-amber-50 hover:bg-amber-100",
    borderColor: "border-amber-200",
    activities: 6,
    difficulty: "Medium",
    tags: ["economy", "resources", "environment", "energy"],
  },
]

export default function Grade4SocialStudiesActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("")

  const filteredStrands = socialStudiesStrands.filter((strand) => {
    const matchesSearch =
      strand.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strand.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = selectedTag === "" || strand.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const allTags = Array.from(new Set(socialStudiesStrands.flatMap((strand) => strand.tags)))


  return (
    <div className="container mx-auto py-8 px-4">
      <Link to="/curriculum/grade4-subjects/social-studies">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 4 Social Studies
        </Button>
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-purple-600 text-transparent bg-clip-text">
          Grade 4 Social Studies Activities
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore engaging activities that help students understand Indigenous peoples, geographic features, civic
          responsibilities, and economic foundations. Choose a strand below to get started!
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search activities..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedTag === "" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedTag("")}
          >
            All
          </Badge>
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 animate-[fadeIn_0.3s_ease-out]">
        {filteredStrands.map((strand) => (
          <div key={strand.id}>
            <Link to={`/curriculum/grade4-subjects/activities/social-studies/${strand.id}`}>
              <Card
                className={`h-full transition-all duration-300 hover:shadow-lg ${strand.color} border-2 ${strand.borderColor} overflow-hidden`}
              >
                <div className="relative h-48 w-full">
                  <img loading="lazy" src="" alt="" className="w-full h-full object-cover" />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{strand.title}</CardTitle>
                    {strand.icon}
                  </div>
                  <CardDescription className="text-gray-700">{strand.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {strand.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-gray-600">{strand.activities} activities</div>
                  <Badge
                    variant={
                      strand.difficulty === "Easy"
                        ? "default"
                        : strand.difficulty === "Medium"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {strand.difficulty}
                  </Badge>
                </CardFooter>
              </Card>
            </Link>
          </div>
        ))}
      </div>

      {filteredStrands.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600">No activities found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      )}

      <div className="mt-12 p-6 bg-amber-50 rounded-lg border border-amber-200">
        <h2 className="text-2xl font-bold mb-4">Teacher Resources</h2>
        <p className="mb-4">
          Looking for additional resources to enhance your social studies lessons? Check out these helpful links:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => window.open("https://www.oecs.org/en/our-work/knowledge/library/education", "_blank")}
          >
            OECS Education Resources
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => window.open("https://www.nationalgeographic.org/education/classroom-resources/", "_blank")}
          >
            National Geographic Education
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => window.open("https://www.unicef.org/easterncaribbean/", "_blank")}
          >
            UNICEF Eastern Caribbean
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() =>
              window.open("https://www.globalcitizen.org/en/content/caribbean-history-resources-for-kids/", "_blank")
            }
          >
            Caribbean History Resources
          </Button>
        </div>
      </div>
    </div>
  )
}
