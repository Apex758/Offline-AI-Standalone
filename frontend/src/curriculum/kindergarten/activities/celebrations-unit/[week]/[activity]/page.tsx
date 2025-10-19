import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, CheckCircle, Lightbulb, Target } from "lucide-react"
// Removed Next.js notFound - using React Router navigation instead

// Define the activity data structure with proper types
interface ActivityInfo {
  title: string
  duration: string
  type: string
  groupSize: string
  learningObjectives: string[]
  materials: string[]
  preparation: string[]
  instructions: string[]
  assessment: string[]
  teachingTips: string[]
  extensions: string[]
  vocabulary: string[]
}

type WeekKey = "week1" | "week2" | "week3" | "week4"

const activityData: Record<WeekKey, Record<string, ActivityInfo>> = {
  week1: {
    "family-celebration-book": {
      title: "My Family Celebration Book",
      duration: "25 minutes",
      type: "Art & Literacy",
      groupSize: "Individual with teacher support",
      learningObjectives: [
        "Express personal experiences with family celebrations",
        "Practice drawing and simple writing skills",
        "Develop vocabulary about celebrations",
        "Build connection between home and school",
      ],
      materials: [
        "Construction paper (various colors)",
        "Crayons or markers",
        "Family photos (optional)",
        "Stapler",
        "Pencils",
      ],
      preparation: [
        "Prepare booklet templates with 4-6 pages",
        "Set up art station with materials",
        "Have examples of celebration words ready",
        "Create comfortable sharing space",
      ],
      instructions: [
        "Sit in circle and talk about family celebrations (birthdays, holidays, special days)",
        "Show children the booklet template",
        "Help children think of 3-4 family celebrations to draw",
        "Support children in drawing pictures on each page",
        "Help children write or dictate simple words about each celebration",
        "Staple books together when complete",
        "Allow time for children to share their books with friends",
      ],
      assessment: [
        "Child can name at least 2 family celebrations",
        "Child participates in drawing activity",
        "Child attempts to write or dictate words",
        "Child shares appropriately during discussion",
      ],
      teachingTips: [
        "Accept all family celebration types - be inclusive",
        "Help children who may not celebrate certain holidays feel included",
        "Encourage simple drawings - focus on the story, not artistic skill",
        "Support emergent writing attempts",
      ],
      extensions: [
        "Create a class celebration calendar",
        "Invite families to share celebration photos",
        "Read books about different family celebrations",
        "Add celebration vocabulary to word wall",
      ],
      vocabulary: ["celebration", "family", "birthday", "holiday", "special", "tradition"],
    },
    "birthday-party-dramatic-play": {
      title: "Birthday Party Play",
      duration: "20 minutes",
      type: "Dramatic Play",
      groupSize: "Small groups of 4-6 children",
      learningObjectives: [
        "Practice social skills through role-play",
        "Learn about birthday traditions",
        "Develop language through dramatic play",
        "Experience joy and celebration",
      ],
      materials: [
        "Party hats (colorful)",
        "Pretend birthday cake",
        "Caribbean music playlist",
        "Colorful scarves or ribbons",
        "Simple musical instruments",
      ],
      preparation: [
        "Set up dramatic play area as party space",
        "Prepare Caribbean music playlist",
        "Practice simple Caribbean birthday songs",
        "Arrange materials in accessible way",
      ],
      instructions: [
        "Gather children and explain we're having a Caribbean birthday party",
        "Put on party hats and choose roles (birthday child, guests, family)",
        "Sing 'Happy Birthday' in English and practice simple Caribbean version",
        "Dance with scarves to Caribbean music",
        "Pretend to eat cake and celebrate together",
        "Take turns being the birthday child",
        "End with group hug and celebration cheer",
      ],
      assessment: [
        "Child participates in role-play activities",
        "Child shows understanding of celebration concepts",
        "Child interacts positively with peers",
        "Child follows simple dramatic play rules",
      ],
      teachingTips: [
        "Model appropriate party behavior",
        "Include all children in roles",
        "Keep energy positive and inclusive",
        "Use simple Caribbean phrases like 'Happy Birthday, mon!'",
      ],
      extensions: [
        "Learn about birthday traditions from different Caribbean islands",
        "Create birthday crowns with Caribbean colors",
        "Practice counting with birthday candles",
        "Write birthday wishes for classmates",
      ],
      vocabulary: ["birthday", "party", "celebrate", "guests", "cake", "music", "dance"],
    },
    "family-tree-celebration": {
      title: "Family Celebration Tree",
      duration: "30 minutes",
      type: "Art & Social",
      groupSize: "Individual with teacher support",
      learningObjectives: [
        "Understand concept of family celebrations",
        "Practice fine motor skills with cutting and gluing",
        "Develop vocabulary about family and celebrations",
        "Create visual representation of personal experiences",
      ],
      materials: [
        "Brown construction paper (tree trunk)",
        "Green paper (leaves)",
        "Colored paper circles",
        "Glue sticks",
        "Markers or crayons",
        "Safety scissors",
      ],
      preparation: [
        "Pre-cut tree trunk shapes from brown paper",
        "Cut various colored circles for celebrations",
        "Set up art station with all materials",
        "Prepare examples of celebration symbols",
      ],
      instructions: [
        "Show children the tree trunk and explain it represents their family",
        "Help children glue tree trunk to paper",
        "Add green leaves around the tree",
        "Choose colored circles for different celebrations",
        "Help children draw simple pictures on circles (birthday cake, gifts, etc.)",
        "Glue celebration circles onto the tree as 'celebration fruits'",
        "Write celebration names with teacher help",
        "Share trees with classmates",
      ],
      assessment: [
        "Child can identify family celebrations",
        "Child uses materials appropriately",
        "Child creates recognizable celebration symbols",
        "Child shares information about family celebrations",
      ],
      teachingTips: [
        "Be sensitive to different family structures",
        "Help children think of various types of celebrations",
        "Support children who may have fewer celebrations",
        "Focus on any positive family moments",
      ],
      extensions: [
        "Create a class celebration forest",
        "Compare celebration trees between classmates",
        "Add seasonal celebrations to trees",
        "Write stories about favorite family celebrations",
      ],
      vocabulary: ["family", "tree", "celebration", "tradition", "special", "together"],
    },
  },
  week2: {
    "carnival-mask-making": {
      title: "Carnival Masks",
      duration: "30 minutes",
      type: "Art & Culture",
      groupSize: "Individual with teacher support",
      learningObjectives: [
        "Learn about Carnivaltraditions",
        "Develop creativity and artistic expression",
        "Practice fine motor skills",
        "Understand cultural celebrations",
      ],
      materials: [
        "Paper plates",
        "Colorful feathers",
        "Sequins or shiny stickers",
        "Bright tempera paint",
        "Paintbrushes",
        "Elastic string",
        "Hole punch",
        "Glue",
      ],
      preparation: [
        "Cover work area with newspaper",
        "Set up paint stations with bright colors",
        "Pre-punch holes in paper plates for string",
        "Show examples of Carnival Masks",
        "Prepare drying area for masks",
      ],
      instructions: [
        "Talk about Carnival and show mask pictures",
        "Help children choose bright colors to paint their plate",
        "Let paint dry while discussing Carnival traditions",
        "Add feathers, sequins, and decorations with glue",
        "Attach elastic string through holes",
        "Try on masks and practice Carnival movements",
        "Have mini parade around classroom",
      ],
      assessment: [
        "Child participates in mask creation",
        "Child uses materials creatively",
        "Child shows interest in Caribbean culture",
        "Child wears mask comfortably during parade",
      ],
      teachingTips: [
        "Emphasize bright, happy colors of Carnival",
        "Share simple facts about Caribbean Carnival",
        "Encourage creative expression",
        "Make sure masks fit comfortably",
      ],
      extensions: [
        "Learn simple Carnival songs",
        "Research different Caribbean islands' Carnival traditions",
        "Create Carnival costumes",
        "Invite community members to share Carnival experiences",
      ],
      vocabulary: ["carnival", "mask", "parade", "colorful", "celebration", "tradition", "Caribbean"],
    },
    "steel-pan-music-exploration": {
      title: "Steel Pan Music Fun",
      duration: "20 minutes",
      type: "Music & Movement",
      groupSize: "Whole class",
      learningObjectives: [
        "Experience steel pan music",
        "Develop rhythm and musical skills",
        "Learn about Caribbean musical traditions",
        "Practice listening and movement skills",
      ],
      materials: [
        "Metal pans or containers",
        "Wooden spoons or mallets",
        "Steel pan music recordings",
        "Colorful scarves",
        "Simple rhythm instruments",
      ],
      preparation: [
        "Set up listening area with space for movement",
        "Prepare steel pan music playlist",
        "Arrange metal containers as 'steel pans'",
        "Have scarves ready for dancing",
      ],
      instructions: [
        "Sit in circle and listen to steel pan music",
        "Talk about how steel pans are made from oil drums",
        "Let children explore making sounds with metal containers",
        "Practice simple rhythms together",
        "Add scarves for dancing to steel pan music",
        "Take turns being the 'steel pan band leader'",
        "End with group dance to favorite steel pan song",
      ],
      assessment: [
        "Child listens attentively to steel pan music",
        "Child attempts to create rhythms",
        "Child participates in movement activities",
        "Child shows appreciation for Caribbean music",
      ],
      teachingTips: [
        "Keep volume at comfortable level",
        "Encourage all children to participate",
        "Model appropriate use of instruments",
        "Connect to children's own musical experiences",
      ],
      extensions: [
        "Invite steel pan musician to visit class",
        "Learn about Trinidad and Tobago steel pan history",
        "Create simple steel pan instruments",
        "Compare steel pan music to other Caribbean music",
      ],
      vocabulary: ["steel pan", "rhythm", "music", "Caribbean", "drums", "beat", "dance"],
    },
    "independence-day-flags": {
      title: "OECS Independence Flags",
      duration: "25 minutes",
      type: "Art & Geography",
      groupSize: "Individual with teacher support",
      learningObjectives: [
        "Learn about OECS countries and their flags",
        "Develop understanding of independence celebrations",
        "Practice following visual patterns",
        "Build cultural awareness and pride",
      ],
      materials: [
        "Colored construction paper",
        "Glue sticks",
        "Craft sticks",
        "Flag examples from OECS countries",
        "Crayons or markers",
        "Safety scissors",
      ],
      preparation: [
        "Gather flag images from OECS countries",
        "Pre-cut paper shapes for flag designs",
        "Set up art station with materials",
        "Prepare simple map showing OECS countries",
      ],
      instructions: [
        "Show children map of Caribbean and point out OECS countries",
        "Look at different OECS flags together",
        "Choose one flag for each child to recreate",
        "Help children identify colors and shapes in their chosen flag",
        "Support children in gluing pieces to create flag design",
        "Attach craft stick to make flag on pole",
        "Practice waving flags and saying country names",
        "Create classroom display of all OECS flags",
      ],
      assessment: [
        "Child can identify basic flag elements",
        "Child follows visual pattern to create flag",
        "Child shows interest in Caribbean countries",
        "Child participates in flag-making activity",
      ],
      teachingTips: [
        "Keep flag designs simple for kindergarten level",
        "Focus on main colors and basic shapes",
        "Connect to children's family heritage when possible",
        "Celebrate all Caribbean connections",
      ],
      extensions: [
        "Learn independence dates for different countries",
        "Explore traditional foods from OECS countries",
        "Listen to national songs from different islands",
        "Create passport stamps for OECS countries",
      ],
      vocabulary: ["flag", "country", "independence", "Caribbean", "OECS", "colors", "celebrate"],
    },
  },
  week3: {
    "caribbean-feast-pretend-play": {
      title: "Caribbean Feast Cooking",
      duration: "25 minutes",
      type: "Dramatic Play",
      groupSize: "Small groups of 4-6 children",
      learningObjectives: [
        "Learn about traditional Caribbean celebration foods",
        "Practice social skills through cooperative play",
        "Develop vocabulary related to food and cooking",
        "Experience cultural traditions through play",
      ],
      materials: [
        "Play kitchen items",
        "Pretend tropical fruits (mango, coconut, banana)",
        "Mixing bowls and spoons",
        "Colorful aprons",
        "Play food representing Caribbean dishes",
        "Plates and cups",
      ],
      preparation: [
        "Set up dramatic play kitchen area",
        "Arrange pretend Caribbean foods",
        "Prepare simple recipe cards with pictures",
        "Have aprons ready for children",
      ],
      instructions: [
        "Talk about special foods eaten during Caribbean celebrations",
        "Put on aprons and choose cooking roles",
        "Pretend to prepare traditional dishes like rice and peas, plantains",
        "Practice cooking movements (stirring, chopping, mixing)",
        "Set table for Caribbean feast",
        "Pretend to eat together as family",
        "Clean up kitchen together",
        "Share what foods they 'cooked'",
      ],
      assessment: [
        "Child engages in pretend cooking activities",
        "Child uses cooking vocabulary appropriately",
        "Child cooperates well in group play",
        "Child shows interest in Caribbean foods",
      ],
      teachingTips: [
        "Introduce simple Caribbean food names",
        "Model appropriate kitchen safety",
        "Encourage sharing and cooperation",
        "Connect to children's family food traditions",
      ],
      extensions: [
        "Invite families to share Caribbean recipes",
        "Create class cookbook of celebration foods",
        "Taste safe Caribbean fruits if available",
        "Learn about where Caribbean foods come from",
      ],
      vocabulary: ["cooking", "feast", "Caribbean", "rice", "plantain", "mango", "coconut", "family"],
    },
    "coconut-palm-decorations": {
      title: "Coconut Palm Decorations",
      duration: "30 minutes",
      type: "Art & Nature",
      groupSize: "Individual with teacher support",
      learningObjectives: [
        "Create decorations inspired by Caribbean nature",
        "Develop fine motor skills through cutting and gluing",
        "Learn about tropical plants and their importance",
        "Practice following multi-step instructions",
      ],
      materials: [
        "Green construction paper",
        "Brown construction paper",
        "Cotton balls",
        "Glue sticks",
        "Safety scissors",
        "Crayons",
        "Coconut pictures for reference",
      ],
      preparation: [
        "Show pictures of coconut palm trees",
        "Pre-cut some palm frond shapes for children who need support",
        "Set up art station with materials",
        "Prepare examples of finished decorations",
      ],
      instructions: [
        "Look at pictures of coconut palm trees together",
        "Help children cut brown paper for tree trunk",
        "Cut green paper into palm frond shapes",
        "Glue trunk to paper first",
        "Add palm fronds at top of trunk",
        "Use cotton balls for coconuts",
        "Color background with beach or sky colors",
        "Add sun, sand, or water to complete tropical scene",
      ],
      assessment: [
        "Child can identify palm tree parts",
        "Child uses scissors safely with support",
        "Child follows steps to create decoration",
        "Child shows creativity in adding details",
      ],
      teachingTips: [
        "Provide cutting support as needed",
        "Talk about how coconuts are used in Caribbean cooking",
        "Encourage children to add their own creative touches",
        "Display finished decorations prominently",
      ],
      extensions: [
        "Learn about other tropical plants",
        "Explore how coconuts are harvested",
        "Create a classroom tropical garden display",
        "Read books about Caribbean islands",
      ],
      vocabulary: ["coconut", "palm tree", "tropical", "fronds", "trunk", "Caribbean", "decoration"],
    },
    "calypso-rhythm-shakers": {
      title: "Calypso Rhythm Shakers",
      duration: "20 minutes",
      type: "Music & Craft",
      groupSize: "Individual with teacher support",
      learningObjectives: [
        "Create simple musical instruments",
        "Learn about calypso music traditions",
        "Develop rhythm and musical skills",
        "Practice following instructions for craft project",
      ],
      materials: [
        "Small plastic bottles with lids",
        "Rice, beans, or small pebbles",
        "Colorful electrical tape",
        "Stickers",
        "Calypso music recordings",
        "Funnel (for teacher use)",
      ],
      preparation: [
        "Clean plastic bottles thoroughly",
        "Set up stations with decorating materials",
        "Prepare calypso music playlist",
        "Have funnel ready for filling bottles",
      ],
      instructions: [
        "Show children examples of Caribbean shakers and maracas",
        "Help children put rice or beans in bottles (teacher uses funnel)",
        "Secure lids tightly",
        "Decorate bottles with colorful tape and stickers",
        "Test shakers by shaking gently",
        "Listen to calypso music and practice shaking to beat",
        "Form circle and play shakers together",
        "Learn simple calypso rhythm patterns",
      ],
      assessment: [
        "Child creates functional shaker instrument",
        "Child decorates shaker creatively",
        "Child uses shaker appropriately with music",
        "Child attempts to follow rhythm patterns",
      ],
      teachingTips: [
        "Make sure lids are very secure",
        "Start with simple rhythm patterns",
        "Encourage children to feel the beat",
        "Connect to other Caribbean music experiences",
      ],
      extensions: [
        "Learn about other Caribbean instruments",
        "Create a classroom calypso band",
        "Listen to different styles of Caribbean music",
        "Invite musician to demonstrate Caribbean instruments",
      ],
      vocabulary: ["shaker", "rhythm", "calypso", "music", "beat", "instrument", "Caribbean"],
    },
  },
  week4: {
    "classroom-carnival-parade": {
      title: "Mini Carnival Parade",
      duration: "30 minutes",
      type: "Movement & Music",
      groupSize: "Whole class",
      learningObjectives: [
        "Experience joy of Carnivalcelebration",
        "Practice gross motor skills through dancing and marching",
        "Build confidence through performance",
        "Celebrate learning about Caribbean culture",
      ],
      materials: [
        "Carnival masks from Week 2",
        "Colorful scarves and ribbons",
        "Rhythm instruments and shakers",
        "Caribbean music playlist",
        "Streamers",
        "Camera for photos",
      ],
      preparation: [
        "Clear space for parade route",
        "Set up music system",
        "Gather all carnival items made in previous weeks",
        "Invite other classes or families if possible",
      ],
      instructions: [
        "Help children put on carnival masks and gather instruments",
        "Practice parade movements: marching, dancing, waving",
        "Start music and begin parade around classroom or school",
        "Encourage children to wave scarves and play instruments",
        "Take breaks for special carnival dances",
        "End parade with group celebration dance",
        "Take photos to remember the celebration",
        "Reflect on favorite parts of the parade",
      ],
      assessment: [
        "Child participates enthusiastically in parade",
        "Child uses carnival items appropriately",
        "Child shows confidence during performance",
        "Child demonstrates understanding of carnival celebration",
      ],
      teachingTips: [
        "Keep energy positive and inclusive",
        "Help shy children participate at their comfort level",
        "Celebrate all children's participation",
        "Connect to real Carnivaltraditions",
      ],
      extensions: [
        "Invite families to join future carnival celebrations",
        "Learn about Carnival in different Caribbean countries",
        "Create carnival costumes for dramatic play",
        "Plan seasonal classroom celebrations",
      ],
      vocabulary: ["parade", "carnival", "celebrate", "music", "dance", "costume", "performance"],
    },
    "celebration-memory-book": {
      title: "Our Celebration Memories",
      duration: "25 minutes",
      type: "Literacy & Art",
      groupSize: "Whole class collaboration",
      learningObjectives: [
        "Reflect on learning about celebrations",
        "Practice storytelling and memory skills",
        "Contribute to class book creation",
        "Develop appreciation for shared experiences",
      ],
      materials: [
        "Large paper for class book pages",
        "Crayons and markers",
        "Photos from celebration activities",
        "Glue sticks",
        "Binding materials",
        "Chart paper",
      ],
      preparation: [
        "Gather photos from all celebration activities",
        "Prepare large paper for book pages",
        "Set up comfortable area for book creation",
        "Have writing materials ready",
      ],
      instructions: [
        "Sit together and look through photos of celebration activities",
        "Talk about favorite memories from each week",
        "Choose photos for each page of class book",
        "Help children draw pictures to add to photos",
        "Write or dictate sentences about each celebration activity",
        "Work together to arrange pages in order",
        "Create cover for 'Our Celebration Memories' book",
        "Read completed book together as class",
      ],
      assessment: [
        "Child contributes ideas for book content",
        "Child recalls specific celebration activities",
        "Child participates in group book creation",
        "Child shows pride in class accomplishments",
      ],
      teachingTips: [
        "Include every child's voice in the book",
        "Focus on positive memories and experiences",
        "Support children in expressing their thoughts",
        "Make book available for future reading",
      ],
      extensions: [
        "Share book with families and other classes",
        "Create individual celebration memory books",
        "Add book to classroom library",
        "Use book for future discussions about celebrations",
      ],
      vocabulary: ["memory", "book", "celebrate", "remember", "favorite", "together", "class"],
    },
    "unity-friendship-circle": {
      title: "Unity Friendship Circle",
      duration: "15 minutes",
      type: "Social & Emotional",
      groupSize: "Whole class",
      learningObjectives: [
        "Reflect on importance of celebrating together",
        "Practice expressing feelings and thoughts",
        "Build sense of classroom community",
        "Develop appreciation for diversity and friendship",
      ],
      materials: [
        "Soft ball or special talking stick",
        "Comfortable circle time area",
        "Calm background music",
        "Unity friendship poster",
      ],
      preparation: [
        "Create comfortable circle seating",
        "Prepare talking stick or soft ball",
        "Set up calm atmosphere with soft music",
        "Think of guiding questions for discussion",
      ],
      instructions: [
        "Sit in close circle together",
        "Pass talking stick and share one thing we love about celebrating together",
        "Talk about how celebrations bring people together",
        "Share what we learned about different celebrations",
        "Discuss how we can celebrate friendship every day",
        "End with group hug or friendship handshake",
        "Sing simple unity song together",
      ],
      assessment: [
        "Child participates in circle discussion",
        "Child expresses positive thoughts about celebrations",
        "Child shows understanding of community and friendship",
        "Child demonstrates respectful listening",
      ],
      teachingTips: [
        "Keep discussion positive and inclusive",
        "Allow quiet children to pass if needed",
        "Model good listening and sharing",
        "Connect to ongoing classroom community building",
      ],
      extensions: [
        "Create classroom celebration traditions",
        "Plan regular friendship circles",
        "Make friendship celebration cards",
        "Establish classroom unity rituals",
      ],
      vocabulary: ["unity", "friendship", "together", "celebrate", "community", "caring", "respect"],
    },
  },
}

interface PageProps {
  params: Promise<{
    week: string
    activity: string
  }>
}

export default async function ActivityInstructionPage({ params }: PageProps) {
  const { week, activity } = await params

  const weekData = activityData[week as WeekKey]
  if (!weekData) {
    navigate("/404")
  }

  const activityInfo = weekData[activity]
  if (!activityInfo) {
    navigate("/404")
  }

  const weekTitles = {
    week1: "Family Celebrations",
    week2: "Cultural Celebrations",
    week3: "Special Foods & Decorations",
    week4: "Celebrating Together",
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <Link to="/curriculum/kindergarten" className="hover:text-cyan-600">
            Kindergarten
          </Link>
          <span>→</span>
          <Link to="/curriculum/kindergarten/activities/celebrations-unit" className="hover:text-cyan-600">
            Celebrations Activities
          </Link>
          <span>→</span>
          <span className="text-cyan-600">{activityInfo.title}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h1 className="text-3xl font-bold text-cyan-700 mb-2 md:mb-0">{activityInfo.title}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-cyan-100 text-cyan-800 border-cyan-200">
              {weekTitles[week as keyof typeof weekTitles]}
            </Badge>
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              {activityInfo.duration}
            </Badge>
            <Badge variant="outline">
              <Users className="h-3 w-3 mr-1" />
              {activityInfo.groupSize}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-cyan-100">
            <CardHeader className="bg-cyan-50 border-b border-cyan-100">
              <CardTitle className="flex items-center text-cyan-700">
                <Target className="mr-2 h-5 w-5" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                {activityInfo.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-cyan-100">
            <CardHeader className="bg-cyan-50 border-b border-cyan-100">
              <CardTitle className="text-cyan-700">Step-by-Step Instructions</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ol className="space-y-3">
                {activityInfo.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-cyan-100 text-cyan-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="border-cyan-100">
            <CardHeader className="bg-cyan-50 border-b border-cyan-100">
              <CardTitle className="flex items-center text-cyan-700">
                <CheckCircle className="mr-2 h-5 w-5" />
                Assessment Criteria
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                {activityInfo.assessment.map((criteria, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{criteria}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-cyan-100">
            <CardHeader className="bg-cyan-50 border-b border-cyan-100">
              <CardTitle className="text-cyan-700">Materials Needed</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-1">
                {activityInfo.materials.map((material, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                    {material}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-cyan-100">
            <CardHeader className="bg-cyan-50 border-b border-cyan-100">
              <CardTitle className="text-cyan-700">Preparation</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                {activityInfo.preparation.map((prep, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-cyan-500 mr-2">•</span>
                    <span className="text-sm">{prep}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-yellow-100 bg-yellow-50">
            <CardHeader className="border-b border-yellow-200">
              <CardTitle className="flex items-center text-yellow-700">
                <Lightbulb className="mr-2 h-5 w-5" />
                Teaching Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                {activityInfo.teachingTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-yellow-600 mr-2">💡</span>
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-green-100 bg-green-50">
            <CardHeader className="border-b border-green-200">
              <CardTitle className="text-green-700">Extension Activities</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                {activityInfo.extensions.map((extension, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">+</span>
                    <span className="text-sm">{extension}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-purple-100 bg-purple-50">
            <CardHeader className="border-b border-purple-200">
              <CardTitle className="text-purple-700">Key Vocabulary</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-2">
                {activityInfo.vocabulary.map((word, index) => (
                  <Badge key={index} variant="outline" className="text-purple-600 border-purple-300">
                    {word}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" asChild>
          <Link to="/curriculum/kindergarten/activities/celebrations-unit">Back to Activities</Link>
        </Button>
        <Link to="/curriculum/kindergarten/activities/celebrations-unit"><Button>View All Activities</Button></Link>
      </div>
    </div>
  )
}
