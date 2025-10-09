import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  Hash,
  Search,
  MapPin,
  Construction,
  MenuIcon as Restaurant,
  Palette,
  Drama,
  CreditCard,
} from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Grade5MathematicsNumberSenseActivitiesPage() {
  const activities = [
    {
      id: "detective",
      title: "Special Numbers Detective",
      icon: Search,
      difficulty: "Medium",
      time: "45 mins",
      color: "from-blue-500 to-cyan-500",
      description:
        "Students work in teams as 'number detectives' to find and sort square, prime, and composite numbers. They create a 'Special Numbers Museum' display with explanations.",
      materials: "Number cards, magnifying glasses (toy), detective badges, construction paper, markers",
      procedure: [
        "Divide the class into teams of 3-4, assigning each team as 'number detectives.'",
        "Provide each team with a set of number cards (1-100).",
        "Challenge teams to find and sort the following types of numbers:",
        "- Square numbers: Arrange in square arrays using counters or drawings",
        "- Prime numbers: Use factor trees or division tables to identify prime numbers",
        "- Composite numbers: Show multiple factor pairs for each composite number",
        "Have teams create a 'Special Numbers Museum' display with explanations for each type of number.",
        "Teams present their findings to the class, using detective language and explaining their reasoning.",
      ],
    },
    {
      id: "obstacle",
      title: "Skip Counting Obstacle Course",
      icon: MapPin,
      difficulty: "Easy",
      time: "30 mins",
      color: "from-green-500 to-emerald-500",
      description:
        "Students navigate a number line floor mat, skip counting by 2s, 5s, 10s, 100s, and 1000s. This activity combines physical coordination with number patterns.",
      materials: "Number line floor mats, cones, music, stopwatch",
      procedure: [
        "Set up a physical number line from 0-100,000 using floor mats or tape on the floor.",
        "Create stations along the number line for different skip counting patterns:",
        "- Station 1: Skip by 2s (hop on two feet)",
        "- Station 2: Skip by 5s (clap hands)",
        "- Station 3: Skip by 10s (march)",
        "- Station 4: Skip by 100s (jump)",
        "- Station 5: Skip by 1000s (spin)",
        "Students move through the obstacle course, calling out the numbers as they skip count.",
        "Add music and make it a timed challenge to increase engagement.",
      ],
    },
    {
      id: "scavenger",
      title: "Real-World Skip Counting Scavenger Hunt",
      icon: Search,
      difficulty: "Medium",
      time: "40 mins",
      color: "from-purple-500 to-pink-500",
      description:
        "Students search the classroom/school for objects that come in groups, applying skip counting to real situations and documenting their findings.",
      materials: "Clipboards, pencils, calculators, real objects",
      procedure: [
        "Divide students into small groups and provide each group with a clipboard and pencil.",
        "Instruct students to search the classroom/school for objects that come in groups, such as:",
        "- Count by 2s: eyes, hands, shoes",
        "- Count by 5s: fingers on hands, toes on feet",
        "- Count by 10s: ten-frames, base-ten blocks",
        "- Count by 100s: hundreds charts, money (if available)",
        "Have students document their findings with drawings and calculations on their clipboards.",
        "Bring the groups back together to share their discoveries and explain why skip counting was useful in each situation.",
      ],
    },
    {
      id: "construction",
      title: "Number Construction Site",
      icon: Construction,
      difficulty: "Hard",
      time: "60 mins",
      color: "from-orange-500 to-red-500",
      description:
        "Students become 'number builders' using base-10 blocks to construct 5-digit numbers, creating a city of numbers with peer inspections.",
      materials: "Base-10 blocks, hard hats (toy), construction paper, place value charts",
      procedure: [
        "Assign each student a 5-digit number to 'construct.'",
        "Have students use base-10 blocks to represent their assigned number concretely.",
        "Guide students in using a place value chart to organize their blocks and understand the value of each digit.",
        "Instruct students to write their number in expanded form as a 'building blueprint.'",
        "Have students create a city of numbers by arranging their base-10 block constructions on a large table or floor space.",
        "Conduct 'building inspections' where students check each other's constructions for accuracy.",
        "Have students write 'construction reports' explaining their building process and the value of each digit.",
      ],
    },
    {
      id: "restaurant",
      title: "Number Name Restaurant",
      icon: Restaurant,
      difficulty: "Medium",
      time: "45 mins",
      color: "from-yellow-500 to-orange-500",
      description:
        "Students take turns as customers and servers, ordering menu items by saying number names and writing the corresponding numerals.",
      materials: "Menus, order pads, play money, number cards",
      procedure: [
        "Set up a classroom restaurant where 'menu prices' are large numbers (up to 100,000).",
        "Students take turns as customers and servers.",
        "Customers order menu items by saying the number names (e.g., 'I'll have the forty-three thousand, two hundred sixty-seven special').",
        "Servers write the numeral on their order pads.",
        "Include expanded form as 'special ingredients' on the menu.",
        "Rotate roles frequently to give all students a chance to practice.",
      ],
    },
    {
      id: "gallery",
      title: "Expanded Form Art Gallery",
      icon: Palette,
      difficulty: "Medium",
      time: "50 mins",
      color: "from-indigo-500 to-purple-500",
      description:
        "Students create artistic representations of numbers in expanded form, showcasing both mathematical accuracy and creative expression.",
      materials: "Art supplies, large paper, number cards, frames",
      procedure: [
        "Assign each student a number card with a 5-digit number.",
        "Have students create artistic representations of their numbers in expanded form.",
        "Each artwork must show:",
        "- The original number",
        "- Standard expanded form (e.g., 30,000 + 4,000 + 500 + 20 + 7)",
        "- Creative visual representation using shapes, colors, or other artistic elements",
        "Set up an 'Expanded Form Art Gallery' to display the artwork.",
        "Conduct a gallery walk where students guess the original number based on the artwork.",
        "Have artists present statements explaining their creative choices and mathematical representations.",
        "Vote on the most creative and most clear representations.",
      ],
    },
    {
      id: "charades",
      title: "Number Property Charades",
      icon: Drama,
      difficulty: "Easy",
      time: "25 mins",
      color: "from-teal-500 to-blue-500",
      description:
        "Students act out number properties for their classmates to guess, reinforcing understanding through kinesthetic learning.",
      materials:
        "Index cards with number properties (e.g., 'is a prime number,' 'is a square number,' 'is divisible by 5')",
      procedure: [
        "Prepare index cards with different number properties written on them.",
        "Divide the class into teams.",
        "One student from each team picks a card and acts out the number property without speaking.",
        "Their teammates try to guess the number property being acted out.",
        "The team that guesses correctly earns a point.",
        "Rotate roles and continue the game.",
      ],
    },
    {
      id: "cardgame",
      title: "Place Value Card Game",
      icon: CreditCard,
      difficulty: "Medium",
      time: "35 mins",
      color: "from-pink-500 to-rose-500",
      description:
        "Students play a card game to build numbers and identify the value of digits in different place values, enhancing their understanding of place value concepts.",
      materials: "Deck of cards with digits 0-9, place value charts",
      procedure: [
        "Divide the class into small groups.",
        "Each group receives a deck of cards with digits 0-9 and place value charts.",
        "Students take turns drawing cards and building numbers on their place value charts.",
        "They identify the value of digits in different place values (e.g., 'The 3 in 3,456 is worth 3,000').",
        "The student with the highest number at the end of each round wins a point.",
      ],
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Breadcrumb
        items={[
          { label: "Curriculum", href: "/curriculum" },
          { label: "Grade 5 Subjects", href: "/curriculum/grade5-subjects" },
          { label: "Mathematics", href: "/curriculum/grade5-subjects/mathematics" },
          { label: "Activities", href: "/curriculum/grade5-subjects/activities/mathematics" },
          { label: "Number Sense", href: "/curriculum/grade5-subjects/activities/mathematics/number-sense" },
        ]}
      />

      <Link href="/curriculum/grade5-subjects/mathematics/number-sense">
        <Button variant="outline" className="mb-6 hover:bg-gray-50 transition-colors">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Number Sense
        </Button>
      </Link>

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 opacity-90"></div>
        <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <Hash className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">Number Sense Activities</h1>
          <p className="text-xl text-white/90 text-center max-w-3xl mx-auto leading-relaxed">
            Engaging activities designed to enhance understanding of number sequences, place value, and number
            relationships through hands-on learning.
          </p>
        </div>
      </div>

      {/* Activities Accordion */}
      <Card className="border-2 border-emerald-200">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardTitle className="text-2xl text-emerald-700 flex items-center space-x-2">
            <Hash className="h-6 w-6" />
            <span>Interactive Number Sense Activities</span>
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Choose from {activities.length} carefully designed activities to build strong number sense skills
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="space-y-4">
            {activities.map((activity) => {
              const IconComponent = activity.icon
              return (
                <AccordionItem
                  key={activity.id}
                  value={activity.id}
                  className="border-2 border-gray-200 rounded-lg px-4 hover:border-emerald-300 transition-colors"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center space-x-4 w-full">
                      <div className={`p-3 bg-gradient-to-r ${activity.color} rounded-lg text-white shadow-lg`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-lg font-semibold text-gray-800">{activity.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getDifficultyColor(activity.difficulty)}>{activity.difficulty}</Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {activity.time}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6">
                    <div className="space-y-6">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">🎯 Learning Objective</h4>
                        <p className="text-gray-700">{activity.description}</p>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2 flex items-center">🧰 Materials Needed</h4>
                        <p className="text-gray-700">{activity.materials}</p>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                          📋 Step-by-Step Procedure
                        </h4>
                        <ol className="space-y-2 text-gray-700">
                          {activity.procedure.map((step, index) => (
                            <li key={index} className="flex">
                              {step.startsWith("-") ? (
                                <div className="flex">
                                  <span className="mr-3 text-green-600">•</span>
                                  <span>{step.substring(1).trim()}</span>
                                </div>
                              ) : (
                                <div className="flex">
                                  <span className="mr-3 font-semibold text-green-600 min-w-[24px]">
                                    {step.match(/^\d+\./) ? "" : `${index + 1}.`}
                                  </span>
                                  <span>{step}</span>
                                </div>
                              )}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
        <h2 className="text-xl font-bold text-center mb-4 text-purple-700">💡 Teaching Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <span className="text-purple-600">•</span>
            <span>Encourage students to explain their thinking process</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-purple-600">•</span>
            <span>Use visual aids and manipulatives for concrete understanding</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-purple-600">•</span>
            <span>Connect activities to real-world applications</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-purple-600">•</span>
            <span>Allow time for reflection and peer discussion</span>
          </div>
        </div>
      </div>
    </div>
  )
}
