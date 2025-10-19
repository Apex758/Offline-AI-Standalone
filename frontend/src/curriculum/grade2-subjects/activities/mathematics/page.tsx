import { Link } from "react-router-dom"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb } from "@/components/breadcrumb"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Grade2MathematicsActivitiesPage() {
  const activities = [
    {
      id: "place-value-partners",
      title: "Place Value Partners",
      description: "Students work in pairs to represent two-digit numbers using base-10 blocks and place value charts.",
      time: "30 minutes",
      difficulty: "Medium",
      image: "/colorful-math-blocks.png",
    },
    {
      id: "growing-patterns",
      title: "Growing Patterns",
      description: "Students identify, extend, and create growing patterns using manipulatives and drawings.",
      time: "25 minutes",
      difficulty: "Medium",
      image: "/math-patterns.png",
    },
    {
      id: "measurement-olympics",
      title: "Measurement Olympics",
      description:
        "Students measure various objects using standard and non-standard units in a fun, competitive format.",
      time: "45 minutes",
      difficulty: "Easy",
      image: "/measuring-tape.png",
    },
    {
      id: "probability-games",
      title: "Probability Games",
      description:
        "Students explore concepts of certain, possible, and impossible through simple games and experiments.",
      time: "35 minutes",
      difficulty: "Medium",
      image: "/dice-and-spinner.png",
    },
    {
      id: "addition-subtraction-stories",
      title: "Addition & Subtraction Stories",
      description: "Students create and solve real-world story problems involving addition and subtraction within 100.",
      time: "30 minutes",
      difficulty: "Medium",
      image: "/addsub.webp",
    },
    {
      id: "shape-detectives",
      title: "Shape Detectives",
      description: "Students identify and classify 2D and 3D shapes in their environment and create shape-based art.",
      time: "40 minutes",
      difficulty: "Easy",
      image: "/shapes.webp",
    },
    {
      id: "data-collectors",
      title: "Data Collectors",
      description: "Students collect, organize, and represent data using pictographs and bar graphs.",
      time: "45 minutes",
      difficulty: "Medium",
      image: "/data.webp",
    },
    {
      id: "fraction-fun",
      title: "Fraction Fun",
      description:
        "Students explore basic fractions through hands-on activities with food, paper folding, and drawings.",
      time: "35 minutes",
      difficulty: "Medium",
      image: "/fractions.webp",
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Curriculum", href: "/curriculum" },
            { label: "Grade 2 Subjects", href: "/curriculum/grade2-subjects" },
            { label: "Mathematics", href: "/curriculum/grade2-subjects/mathematics" },
            { label: "Activities", href: "/curriculum/grade2-subjects/activities/mathematics" },
          ]}
        />
        <ThemeToggle />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Grade 2 Mathematics Activities</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Engaging activities to develop mathematical understanding and skills for Grade 2 students.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <Link to={`/curriculum/grade2-subjects/activities/mathematics/${activity.id}`} key={activity.id}>
            <Card className="h-full transition-transform hover:scale-105 hover:shadow-lg">
              <CardHeader className="p-4">
                <CardTitle className="text-xl">{activity.title}</CardTitle>
                <CardDescription>{activity.description}</CardDescription>
              </CardHeader>
              <div className="px-4">
                <img
                  src={activity.image || "/placeholder.svg"}
                  alt={activity.title}
                  className="w-full h-40 object-cover rounded-md"
                />
              </div>
              <CardFooter className="flex justify-between p-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">Time: {activity.time}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Difficulty: {activity.difficulty}</div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
