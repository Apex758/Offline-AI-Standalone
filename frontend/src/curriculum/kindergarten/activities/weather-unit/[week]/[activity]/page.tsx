import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"
// Removed Next.js notFound - using React Router navigation instead
import {
  Calendar,
  Palette,
  MessageCircle,
  Users,
  Music,
  Scissors,
  Eye,
  Clock,
  Users2,
  Target,
  CheckCircle,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CloudRain,
} from "lucide-react"

// Define the activity data structure with proper types
interface ActivityInfo {
  title: string
  type: string
  duration: string
  icon: React.ReactElement
  description: string
  materials: string[]
  objectives: string[]
  preparation: string[]
  instructions: string[]
  assessment: string[]
  extensions: string[]
  tips: string[]
  color: string
}

type WeekKey = "week1" | "week2" | "week3" | "week4" | "week5"

const activityData: Record<WeekKey, Record<string, ActivityInfo>> = {
  "week1": {
    "weather-observation-station": {
      title: "Weather Observation Station",
      type: "Science",
      duration: "20 minutes", // reduced duration for kindergarten attention span
      icon: <Eye className="h-5 w-5" />,
      description: "Set up a classroom weather station and practice daily weather observations using all five senses.",
      materials: [
        "Simple outdoor thermometer",
        "Colorful windsock",
        "Clear rain gauge with large numbers",
        "Weather chart with pictures",
        "Child-safe magnifying glasses",
        "Clipboards for each student",
      ],
      objectives: [
        "Students will use their five senses to observe weather",
        "Students will learn to use simple weather tools safely",
        "Students will record weather observations using pictures and symbols",
        "Students will develop daily weather observation routines",
      ],
      preparation: [
        "Set up weather station in easily accessible outdoor area",
        "Prepare weather chart with clear picture symbols",
        "Test all tools to ensure they work properly and are safe",
        "Create simple observation sheets with pictures, not just words", // emphasized picture-based sheets
      ],
      instructions: [
        "Gather students near the weather station and show them each tool",
        "Demonstrate how to look at the thermometer numbers (focus on 'hot' or 'cold')", // simplified thermometer reading
        "Take students outside for 10 minutes to observe current weather using all five senses",
        "Guide students to describe what they see, hear, feel, and smell about today's weather",
        "Return inside and help students record observations using pictures and simple words", // emphasized pictures over complex writing
        "Assign daily 'weather helpers' who will assist with future observations",
        "Discuss what we might notice if we observe weather every day",
      ],
      assessment: [
        "Students can identify at least 2 weather characteristics using their senses", // reduced from 3 to 2 for more realistic kindergarten expectations
        "Students participate in recording weather observations with teacher help",
        "Students use simple weather words during discussions",
        "Students show enthusiasm for daily weather observation routine",
      ],
      extensions: [
        "Continue daily weather observations throughout the unit",
        "Create weather journals for students to record observations",
        "Compare weather observations with weather forecasts",
        "Invite families to participate in weather observations at home",
      ],
      tips: [
        "Keep weather observations short and engaging for kindergarten attention spans",
        "Use picture symbols on observation sheets for non-readers",
        "Celebrate each student's unique observations and descriptions",
        "Connect weather observations to daily classroom routines",
      ],
      color: "cyan",
    },
    "weather-word-wall": {
      title: "Weather Word Wall Creation",
      type: "Language Arts",
      duration: "25 minutes",
      icon: <MessageCircle className="h-5 w-5" />,
      description: "Build a collaborative weather vocabulary wall with pictures and student-generated descriptions.",
      objectives: [
        "Build weather vocabulary through visual and verbal connections",
        "Practice describing weather using descriptive language",
        "Create a classroom reference tool for weather words",
        "Develop print awareness and letter recognition",
      ],
      materials: [
        "Large poster paper or bulletin board space",
        "Weather picture cards or magazines",
        "Colorful markers and crayons",
        "Tape or stapler",
        "Student photos in different weather",
        "Index cards for word labels",
      ],
      preparation: [
        "Prepare bulletin board space or large poster paper",
        "Gather weather pictures from magazines or print weather cards",
        "Have cameras ready to take student photos during activity",
        "Prepare blank word cards for student dictation",
      ],
      instructions: [
        "Show students the weather picture cards and discuss what they see",
        "Take students outside to photograph them in current weather conditions",
        "Help students describe the weather using simple words and phrases",
        "Create word cards with student descriptions and teacher writing",
        "Add weather pictures and student photos to the word wall",
        "Practice reading and pointing to weather words together",
        "Use word wall for daily weather discussions and activities",
        "Add new weather words as students discover them throughout the unit",
      ],
      assessment: [
        "Students contribute weather descriptions using appropriate vocabulary",
        "Students can identify weather words on the word wall",
        "Students use word wall as reference during weather discussions",
        "Students show interest in adding new weather words",
      ],
      extensions: [
        "Create individual weather word books for students",
        "Add weather words in multiple languages if applicable",
        "Use word wall for weather writing activities",
        "Create weather word games and matching activities",
      ],
      tips: [
        "Keep word wall at student eye level for easy access",
        "Use large, clear print for weather words",
        "Include pictures with every word for visual learners",
        "Update word wall regularly as weather changes",
      ],
      color: "blue",
    },
    "weather-feelings-dance": {
      title: "Weather Feelings Dance",
      type: "Movement",
      duration: "15 minutes",
      icon: <Music className="h-5 w-5" />,
      description:
        "Express different weather conditions through simple movements and discuss how weather makes us feel.",
      objectives: [
        "Express weather through creative movement and dance",
        "Connect weather conditions to emotional responses",
        "Practice following movement directions and patterns",
        "Develop body awareness and coordination",
      ],
      materials: [
        "Weather music playlist or nature sounds",
        "Soft scarves or ribbons",
        "Open space for movement",
        "Weather picture cards",
        "Simple percussion instruments",
        "Weather sound recordings",
      ],
      preparation: [
        "Create playlist with different weather sounds and music",
        "Set up open space free of obstacles",
        "Prepare weather picture cards for movement prompts",
        "Test audio equipment and have backup options",
      ],
      instructions: [
        "Show weather picture cards and discuss how each makes students feel",
        "Demonstrate simple movements for different weather types",
        "Play weather music and guide students through weather dances",
        "Use scarves to represent wind, rain, and snow movements",
        "Create group weather dances where students work together",
        "Encourage students to express their weather feelings through movement",
        "Practice moving like different weather conditions",
        "End with a calming weather movement to transition to next activity",
      ],
      assessment: [
        "Students participate in weather movement activities",
        "Students can demonstrate different weather movements",
        "Students express weather feelings through dance",
        "Students work cooperatively in group weather dances",
      ],
      extensions: [
        "Create weather movement stories with beginning, middle, and end",
        "Add weather sound effects with percussion instruments",
        "Create weather dance performances for families",
        "Connect weather movements to seasonal celebrations",
      ],
      tips: [
        "Keep movements simple and accessible for all students",
        "Use clear verbal cues along with movement demonstrations",
        "Allow students to interpret weather movements creatively",
        "Include calming movements for students who need breaks",
      ],
      color: "purple",
    },
  },
  "week2": {
    "weather-in-a-bottle": {
      title: "Weather in a Bottle",
      type: "Science Experiment",
      duration: "25 minutes",
      icon: <CloudRain className="h-5 w-5" />,
      description:
        "Create mini weather systems in bottles to observe clouds and water drops (teacher-led demonstration).",
      objectives: [
        "Observe how clouds form in a controlled environment",
        "Understand the water cycle in simple terms",
        "Practice scientific observation and description",
        "Develop curiosity about weather science",
      ],
      materials: [
        "Clear plastic bottles with lids",
        "Warm water",
        "Ice cubes",
        "Food coloring (optional)",
        "Whipped cream or shaving cream",
        "Small funnels",
        "Paper towels for cleanup",
      ],
      preparation: [
        "Test the experiment beforehand to ensure it works properly",
        "Prepare clear bottles with secure lids",
        "Have warm water ready at appropriate temperature",
        "Set up demonstration area with good visibility",
      ],
      instructions: [
        "Show students the clear bottle and explain we'll make weather inside",
        "Add warm water to the bottle (about 1/3 full)",
        "Add a few drops of food coloring if desired for visibility",
        "Place ice cubes on top of the bottle lid",
        "Observe as water vapor rises and condenses on the cold lid",
        "Discuss what students see happening in the bottle",
        "Explain that this is like how clouds form in the sky",
        "Let students take turns observing the bottle up close",
        "Clean up materials and discuss what we learned about weather",
      ],
      assessment: [
        "Students can describe what they observe in the bottle",
        "Students make connections between bottle weather and real weather",
        "Students ask questions about the weather experiment",
        "Students show curiosity about weather science",
      ],
      extensions: [
        "Try different temperatures to see how they affect cloud formation",
        "Create multiple bottles to compare different conditions",
        "Draw pictures of what students observe in the bottles",
        "Connect to real weather observations outside",
      ],
      tips: [
        "Keep the experiment simple and focused on observation",
        "Use clear language to explain what's happening",
        "Allow plenty of time for students to observe and ask questions",
        "Connect the experiment to students' weather experiences",
      ],
      color: "blue",
    },
    "weather-sound-matching": {
      title: "Weather Sound Matching Game",
      duration: "20 minutes",
      icon: <Music className="h-5 w-5" />,
      type: "Listening",
      description: "Match weather sounds to pictures and create our own safe weather sound effects.",
      objectives: [
        "Identify different weather sounds",
        "Match sounds to weather conditions",
        "Create safe weather sound effects",
        "Develop listening and auditory discrimination skills",
      ],
      materials: [
        "Weather sound recordings",
        "Weather picture cards",
        "Rice in containers for rain sounds",
        "Soft shakers for wind sounds",
        "Paper for thunder sounds",
        "Audio player or device",
        "Blindfold or scarf for sound games",
      ],
      preparation: [
        "Test all audio equipment and have backup options",
        "Prepare weather picture cards that match sound recordings",
        "Set up sound-making materials in accessible containers",
        "Create simple sound effect instructions",
      ],
      instructions: [
        "Play different weather sounds and discuss what students hear",
        "Show weather picture cards and match them to sounds",
        "Let students create their own weather sound effects",
        "Play sound matching games where students identify weather by sound",
        "Create a weather sound story using different effects",
        "Practice making weather sounds together as a group",
        "Use sound effects during weather dramatic play",
        "Discuss how different weather sounds make us feel",
      ],
      assessment: [
        "Students can identify common weather sounds",
        "Students match sounds to appropriate weather pictures",
        "Students create weather sound effects safely",
        "Students participate in sound matching games",
      ],
      extensions: [
        "Create weather sound books with recorded sounds",
        "Add weather sounds to dramatic play centers",
        "Create weather sound patterns and sequences",
        "Connect weather sounds to music and rhythm activities",
      ],
      tips: [
        "Keep sound levels appropriate for classroom environment",
        "Use clear, recognizable weather sounds",
        "Allow students to explore sound-making materials safely",
        "Connect sounds to students' weather experiences",
      ],
      color: "green",
    },
    "rainbow-after-rain": {
      title: "Rainbow After the Rain Art",
      duration: "25 minutes",
      icon: <Palette className="h-5 w-5" />,
      type: "Art",
      description: "Create beautiful rainbow art while learning about what happens after rainstorms.",
      objectives: [
        "Create rainbow art using different materials and techniques",
        "Understand that rainbows appear after rain",
        "Practice color recognition and sequencing",
        "Develop fine motor skills through art activities",
      ],
      materials: [
        "Washable watercolors",
        "Large paper or canvas",
        "Spray bottles with water",
        "Cotton balls",
        "Prisms or rainbow materials",
        "Paintbrushes",
        "Paper towels",
        "Rainbow color reference",
      ],
      preparation: [
        "Set up art stations with all materials easily accessible",
        "Prepare rainbow color references for students",
        "Test spray bottles to ensure they work properly",
        "Cover work surfaces for easy cleanup",
      ],
      instructions: [
        "Show students a real rainbow or rainbow pictures",
        "Discuss how rainbows appear after rain and sunshine",
        "Demonstrate rainbow color order: red, orange, yellow, green, blue, purple",
        "Let students choose their preferred art method",
        "Guide students in creating rainbow patterns and designs",
        "Use spray bottles to create rain effects on artwork",
        "Add cotton ball clouds to complete the weather scene",
        "Display rainbow artwork and discuss what students created",
        "Connect artwork to real weather observations",
      ],
      assessment: [
        "Students create rainbow artwork with multiple colors",
        "Students can identify rainbow colors in order",
        "Students understand the connection between rain and rainbows",
        "Students show creativity in their weather artwork",
      ],
      extensions: [
        "Create rainbow mobiles to hang in the classroom",
        "Make rainbow weather journals",
        "Use rainbow colors for other weather art projects",
        "Create weather stories",
      ],
      tips: [
        "Emphasize the joy and beauty of rainbows after rain",
        "Allow students to be creative with their rainbow designs",
        "Use washable materials for easy cleanup",
        "Connect art to real weather experiences",
      ],
      color: "yellow",
    },
  },
  "week3": {
    "weather-clothing-sort": {
      title: "Weather Clothing Sort",
      duration: "20 minutes",
      icon: <Users className="h-5 w-5" />,
      type: "Social Studies",
      description: "Sort clothing items for different weather conditions and discuss appropriate choices.",
      objectives: [
        "Identify appropriate clothing for different weather",
        "Sort clothing by weather conditions",
        "Understand how weather affects clothing choices",
        "Develop decision-making and categorization skills",
      ],
      materials: [
        "Various clothing items for different weather",
        "Weather picture cards",
        "Sorting bins or containers",
        "Dress-up dolls or mannequins",
        "Weather symbols",
        "Clothing catalogs or magazines",
      ],
      preparation: [
        "Gather clothing items representing different weather conditions",
        "Create weather sorting bins with clear labels",
        "Prepare weather picture cards for reference",
        "Set up sorting stations around the classroom",
      ],
      instructions: [
        "Show students different weather conditions and discuss clothing needs",
        "Demonstrate sorting clothing by weather type",
        "Let students work in groups to sort clothing items",
        "Use dress-up dolls to show appropriate weather clothing",
        "Discuss why certain clothing works better in specific weather",
        "Create weather clothing charts for classroom reference",
        "Practice dressing for different weather scenarios",
        "Connect clothing choices to real weather conditions",
      ],
      assessment: [
        "Students can sort clothing by weather conditions",
        "Students understand appropriate clothing for different weather",
        "Students participate in group sorting activities",
        "Students can explain clothing choices for weather",
      ],
      extensions: [
        "Create weather clothing books with photos from the activity",
        "Set up ongoing dramatic play area with weather clothing",
        "Invite families to share clothing from different climates",
        "Connect to community helpers who work in different weather",
      ],
      tips: [
        "Include clothing for extreme weather to extend thinking",
        "Encourage students to think about layering for changing weather",
        "Use real weather forecasts to make scenarios more authentic",
        "Celebrate creative and thoughtful clothing combinations",
      ],
      color: "amber",
    },
    "weather-activities-chart": {
      title: "Weather Activities Planning Chart",
      duration: "25 minutes",
      icon: <Calendar className="h-5 w-5" />,
      type: "Social Studies",
      description: "Plan fun activities for different types of weather and discuss indoor vs. outdoor choices.",
      objectives: [
        "Connect weather conditions to appropriate activities",
        "Understand the difference between indoor and outdoor activities",
        "Practice planning and decision-making skills",
        "Develop flexibility in activity choices based on weather",
      ],
      materials: [
        "Large chart paper",
        "Activity picture cards",
        "Markers and crayons",
        "Stickers for voting",
        "Weather symbols",
        "Magazines for cutting pictures",
      ],
      preparation: [
        "Create large chart with weather types across the top",
        "Gather activity picture cards or magazines",
        "Prepare weather symbols for chart headers",
        "Set up workspace for collaborative chart creation",
      ],
      instructions: [
        "Show students the chart with different weather types across the top",
        "Brainstorm activities students like to do, writing or drawing them on cards",
        "Work together to sort activities under appropriate weather conditions",
        "Discuss why certain activities work better in specific weather",
        "Add indoor alternatives for outdoor activities that require good weather",
        "Let students vote on their favorite activities for each type of weather",
        "Create a 'rainy day' list of special indoor activities",
        "Display chart for future reference when planning class activities",
      ],
      assessment: [
        "Students contribute appropriate activity ideas for different weather",
        "Students understand the relationship between weather and activity choices",
        "Students can suggest indoor alternatives for outdoor activities",
        "Students participate in collaborative chart creation",
      ],
      extensions: [
        "Use chart to plan actual class activities based on daily weather",
        "Create individual activity books for different weather",
        "Survey families about their favorite weather activities",
        "Connect to seasonal activities and celebrations",
      ],
      tips: [
        "Include activities that work in multiple weather conditions",
        "Encourage students to think about safety in different weather",
        "Use chart as a reference for indoor recess planning",
        "Connect to students' personal experiences and preferences",
      ],
      color: "amber",
    },
    "weather-mood-journal": {
      title: "Weather and Mood Journal",
      duration: "20 minutes",
      icon: <MessageCircle className="h-5 w-5" />,
      type: "Social-Emotional",
      description: "Explore how different weather makes us feel and create a personal weather mood journal.",
      objectives: [
        "Recognize connections between weather and emotions",
        "Develop emotional vocabulary and self-awareness",
        "Practice expressing feelings through words and pictures",
        "Understand that different people may feel differently about the same weather",
      ],
      materials: [
        "Small journals or booklets",
        "Emotion face stickers",
        "Crayons and colored pencils",
        "Weather stickers",
        "Small mirrors",
        "Feeling words chart",
      ],
      preparation: [
        "Prepare small journals with weather and mood pages",
        "Set up emotion face stickers and feeling words chart",
        "Create sample journal entry to show students",
        "Arrange mirrors for self-reflection activities",
      ],
      instructions: [
        "Begin by discussing how weather can affect how we feel",
        "Show students different weather pictures and ask how each makes them feel",
        "Introduce feeling words: happy, sad, excited, cozy, energetic, calm, worried",
        "Give each student a weather mood journal",
        "Help students create their first journal entry about current weather",
        "Use emotion stickers and drawings to express weather feelings",
        "Discuss how the same weather might make different people feel differently",
        "Practice using feeling words to describe weather responses",
        "Plan to continue journaling throughout the weather unit",
      ],
      assessment: [
        "Students can identify how weather affects their feelings",
        "Students use feeling words to describe weather responses",
        "Students create weather mood journal entries",
        "Students understand that people may feel differently about weather",
      ],
      extensions: [
        "Continue daily weather mood journaling",
        "Create class weather mood charts",
        "Connect weather moods to art and music activities",
        "Share weather mood experiences with families",
      ],
      tips: [
        "Validate all weather feelings as normal and acceptable",
        "Use simple feeling words appropriate for kindergarten",
        "Encourage students to express feelings through multiple modalities",
        "Connect weather moods to self-care and coping strategies",
      ],
      color: "pink",
    },
  },
  "week4": {
    "weather-tool-construction": {
      title: "Weather Tool Construction",
      duration: "30 minutes",
      icon: <Scissors className="h-5 w-5" />,
      type: "Engineering",
      description:
        "Build simple weather tools like rain gauges, wind vanes, and thermometers using everyday materials.",
      objectives: [
        "Construct simple weather measurement tools",
        "Understand the purpose of different weather tools",
        "Practice following construction directions",
        "Develop engineering and problem-solving skills",
      ],
      materials: [
        "Clear plastic bottles",
        "Cardboard and paper",
        "Straws and flexible tubing",
        "Cardboard and poster board",
        "Tape and glue",
        "Markers and labels",
        "String and beads",
        "Aluminum pie pans",
      ],
      preparation: [
        "Pre-cut some materials for students who need support",
        "Set up construction stations with different tools",
        "Prepare instruction cards with pictures",
        "Test tool construction beforehand",
      ],
      instructions: [
        "Explain that students will build weather tools like real meteorologists use",
        "Set up stations for different tools: rain gauge, wind vane, weather vane, thermometer holder",
        "Demonstrate construction of rain gauge using clear bottle with measurement marks",
        "Guide students through building wind vanes using cardboard and straws",
        "Create weather vanes with arrows to show wind direction",
        "Build thermometer holders to protect outdoor thermometers",
        "Test all tools and make adjustments as needed",
        "Set up permanent weather station area using student-made tools",
        "Plan daily weather monitoring routine using the new station",
      ],
      assessment: [
        "Students follow directions to construct weather tools",
        "Students understand the purpose of each weather tool",
        "Students work cooperatively during construction activities",
        "Students show pride in their engineering accomplishments",
      ],
      extensions: [
        "Use weather station tools for daily observations throughout the year",
        "Compare readings from student tools with professional weather reports",
        "Improve and modify tools based on how well they work",
        "Share weather station with other classes",
      ],
      tips: [
        "Focus on function over perfection in tool construction",
        "Encourage problem-solving when tools don't work as expected",
        "Connect to real weather stations and meteorologist tools",
        "Document the building process with photos for portfolios",
      ],
      color: "purple",
    },
    "weather-reporter-newscast": {
      title: "Weather Reporter Newscast",
      duration: "30 minutes",
      icon: <MessageCircle className="h-5 w-5" />,
      type: "Communication",
      description: "Practice being weather reporters and present daily weather forecasts to the class.",
      objectives: [
        "Practice public speaking and presentation skills",
        "Apply weather vocabulary in authentic context",
        "Understand the role of weather reporters",
        "Build confidence in communication",
      ],
      materials: [
        "Microphone prop or real microphone",
        "Weather map or poster",
        "Pointer stick",
        "Reporter badges or name tags",
        "Camera prop or tablet",
        "Weather forecast scripts",
      ],
      preparation: [
        "Set up 'news station' area with weather map",
        "Prepare simple weather report scripts as examples",
        "Create reporter badges for students",
        "Practice weather report format with students",
      ],
      instructions: [
        "Show students real weather reports and discuss what weather reporters do",
        "Introduce weather report format: greeting, current weather, forecast, clothing advice",
        "Let students practice using weather vocabulary and pointing to weather map",
        "Give each student a chance to be the weather reporter",
        "Encourage reporters to use current weather observations and predictions",
        "Have 'audience' ask questions about the weather forecast",
        "Record weather reports to share with families or other classes",
        "Celebrate each student's weather reporting skills",
      ],
      assessment: [
        "Students use weather vocabulary appropriately during reports",
        "Students speak clearly and confidently during presentations",
        "Students include key elements of weather reports",
        "Students show understanding of weather reporter role",
      ],
      extensions: [
        "Create daily weather reports as part of morning routine",
        "Invite real meteorologist to visit and demonstrate weather reporting",
        "Make weather report videos to share with families",
        "Set up weather reporting as ongoing dramatic play center",
      ],
      tips: [
        "Encourage creativity and personality in weather reports",
        "Provide sentence starters for students who need support",
        "Focus on communication over perfection",
        "Connect to real weather conditions and forecasts",
      ],
      color: "purple",
    },
  },
  "week5": {
    "weather-patterns-art": {
      title: "Weather Patterns Art",
      duration: "25 minutes",
      icon: <Palette className="h-5 w-5" />,
      type: "Art",
      description: "Create artwork representing different weather patterns and seasonal changes.",
      objectives: [
        "Represent weather patterns through art",
        "Understand seasonal weather changes",
        "Practice pattern creation and repetition",
        "Develop artistic expression and creativity",
      ],
      materials: [
        "Large paper or canvas",
        "Tempera paints",
        "Sponges and brushes",
        "Weather pattern stencils",
        "Natural materials (leaves, twigs)",
        "Glue and scissors",
        "Weather pattern examples",
      ],
      preparation: [
        "Prepare weather pattern examples and stencils",
        "Set up art stations with all materials accessible",
        "Create sample weather pattern artwork",
        "Cover work surfaces for easy cleanup",
      ],
      instructions: [
        "Show students examples of weather patterns in art",
        "Discuss how weather patterns repeat and change",
        "Demonstrate creating weather patterns using different techniques",
        "Let students choose weather patterns to represent",
        "Guide students in creating pattern-based weather artwork",
        "Use natural materials to add texture to weather patterns",
        "Create seasonal weather pattern displays",
        "Discuss how weather patterns help us predict weather",
        "Display weather pattern artwork in classroom",
      ],
      assessment: [
        "Students create artwork representing weather patterns",
        "Students understand seasonal weather changes",
        "Students use pattern techniques in their artwork",
        "Students show creativity in weather pattern representation",
      ],
      extensions: [
        "Create weather pattern books with student artwork",
        "Use weather patterns for classroom decorations",
        "Create weather pattern games and activities",
        "Connect weather patterns to music and movement",
      ],
      tips: [
        "Focus on the beauty and rhythm of weather patterns",
        "Allow students to interpret patterns creatively",
        "Use simple pattern techniques appropriate for kindergarten",
        "Connect patterns to real weather observations",
      ],
      color: "indigo",
    },
    "weather-celebration": {
      title: "Weather Celebration Day",
      duration: "35 minutes",
      icon: <Calendar className="h-5 w-5" />,
      type: "Celebration",
      description: "Celebrate learning about weather with a fun weather-themed party and activities.",
      objectives: [
        "Celebrate weather learning achievements",
        "Review key weather concepts and vocabulary",
        "Share weather projects and artwork",
        "Develop appreciation for weather and nature",
      ],
      materials: [
        "Weather decorations and balloons",
        "Student weather projects and artwork",
        "Weather-themed snacks and treats",
        "Weather music and games",
        "Certificates or awards",
        "Camera for documenting celebration",
        "Weather costumes or props",
      ],
      preparation: [
        "Decorate classroom with weather theme",
        "Display student weather projects prominently",
        "Prepare weather-themed snacks and activities",
        "Create simple certificates or recognition items",
      ],
      instructions: [
        "Begin with a weather parade showing student projects",
        "Play weather-themed games and activities",
        "Share favorite weather learning moments",
        "Present weather certificates or recognition",
        "Enjoy weather-themed snacks and treats",
        "Take photos of weather celebration",
        "Create weather memory books",
        "Plan future weather learning adventures",
        "End with weather appreciation circle",
      ],
      assessment: [
        "Students participate in weather celebration activities",
        "Students can share weather learning experiences",
        "Students show pride in weather accomplishments",
        "Students demonstrate weather knowledge and vocabulary",
      ],
      extensions: [
        "Invite families to weather celebration",
        "Create weather learning portfolios",
        "Plan weather field trips or outdoor activities",
        "Continue weather learning throughout the year",
      ],
      tips: [
        "Make celebration inclusive for all students",
        "Focus on learning achievements and growth",
        "Use celebration to reinforce weather concepts",
        "Create positive memories of weather learning",
      ],
      color: "indigo",
    },
  },
}

// Color scheme for different activity types
const colors = {
  button: "bg-sky-600 hover:bg-sky-700 text-white",
  header: "text-sky-700",
  card: "border-sky-200",
}

// Main component function
export default async function WeatherActivityPage({
  params,
}: {
  params: Promise<{ week: string; activity: string }>
}) {
  const { week, activity } = await params

  // Convert week parameter to week key format
  const weekKey = week as WeekKey

  const weekData = activityData[weekKey]
  if (!weekData) {
    navigate("/404")
  }

  const activityInfo = weekData[activity]
  if (!activityInfo) {
    navigate("/404")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/curriculum/kindergarten/activities/weather-unit">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Weather Activities
            </Link>
          </Button>

        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-lg bg-${activityInfo.color}-100`}>{activityInfo.icon}</div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{activityInfo.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {activityInfo.duration}
              </span>
              <Badge variant="secondary">{activityInfo.type}</Badge>
            </div>
          </div>
        </div>

        <p className="text-lg text-gray-700 max-w-4xl">{activityInfo.description}</p>
      </div>

      {/* Objectives Section */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sky-700">
              <Target className="h-5 w-5" />
              Learning Objectives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {activityInfo.objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Instructions Section */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sky-700">
              <BookOpen className="h-5 w-5" />
              Activity Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {activityInfo.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Assessment Section */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sky-700">
              <CheckCircle className="h-5 w-5" />
              Assessment Criteria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {activityInfo.assessment.map((criterion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-sky-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{criterion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Materials, Preparation, Tips, and Extensions */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="h-5 w-5" />
              Materials Needed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {activityInfo.materials.map((material, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span>{material}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users2 className="h-5 w-5" />
              Preparation Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {activityInfo.preparation.map((step, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Teaching Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {activityInfo.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Extension Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {activityInfo.extensions.map((extension, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{extension}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <Button variant="outline" asChild>
          <Link to="/curriculum/kindergarten/activities/weather-unit">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Weather Activities
          </Link>
        </Button>

        <Button className={colors.button} asChild>
          <Link to="/curriculum/kindergarten/weather">
            View Weather Unit Overview
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
