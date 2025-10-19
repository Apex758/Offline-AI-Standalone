import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
// Removed Next.js notFound - using React Router navigation instead
import { ArrowLeft, Clock, Users, Target, CheckCircle, Lightbulb, Plus } from "lucide-react"

// Define the activity data structure with proper types
interface ActivityInfo {
  title: string
  type: string
  duration: string
  groupSize: string
  objectives: string[]
  materials: string[]
  preparation: string[]
  instructions: string[]
  assessment: string[]
  tips: string[]
  extensions: string[]
}

// Activity data with detailed instructions
const activityData: Record<string, Record<number, Record<string, ActivityInfo>>> = {
  "belonging-unit": {
    1: {
      "self-portrait-gallery": {
        title: "Self-Portrait Gallery",
        type: "Art Activity",
        duration: "45 minutes",
        groupSize: "Individual work, whole group sharing",
        objectives: [
          "Students will observe and describe their physical characteristics",
          "Students will use art materials to create a self-representation",
          "Students will develop fine motor skills through drawing and coloring",
        ],
        materials: [
          "Hand mirrors (one per child)",
          "White drawing paper (8.5x11)",
          "Crayons or colored pencils",
          "Picture frames or construction paper frames",
          "Chart paper for gallery labels",
        ],
        preparation: [
          "Set up mirrors at each workspace",
          "Prepare drawing materials at each seat",
          "Create a designated wall space for the gallery",
          "Prepare name labels for each portrait",
        ],
        instructions: [
          "Begin with a circle time discussion about what makes each person unique",
          "Give each child a mirror and ask them to look carefully at themselves",
          "Guide students to notice details: eye color, hair color, smile, etc.",
          "Demonstrate how to start with basic shapes (circle for head, etc.)",
          "Allow 20-25 minutes for drawing and coloring",
          "Help students add details like clothing, accessories, or favorite colors",
          "Have students write or dictate one thing that makes them special",
          "Create a classroom gallery with all portraits displayed",
        ],
        assessment: [
          "Observe students' ability to identify their own characteristics",
          "Note fine motor skill development in drawing",
          "Listen to students' descriptions of what makes them unique",
          "Document participation in gallery sharing time",
        ],
        tips: [
          "Encourage students to look in the mirror frequently while drawing",
          "Remind students that everyone's portrait will look different and that's wonderful",
          "Take photos of students with their completed portraits",
          "Consider sending portraits home as a special keepsake",
        ],
        extensions: [
          "Create a class book with all self-portraits and descriptions",
          "Have students draw portraits of family members",
          "Compare portraits made at the beginning and end of the year",
          "Use portraits for name recognition and attendance activities",
        ],
      },
      "favorite-things-circle": {
        title: "My Favorite Things Circle",
        type: "Discussion",
        duration: "30 minutes",
        groupSize: "Whole group circle",
        objectives: [
          "Students will practice speaking in front of a group",
          "Students will learn about similarities and differences among classmates",
          "Students will develop listening skills and respect for others' sharing",
        ],
        materials: [
          "Circle time carpet or designated area",
          "Special sharing chair or cushion",
          "Chart paper and markers",
          "Camera for documentation",
        ],
        preparation: [
          "Send home a note asking families to help children choose 3 favorite things to share",
          "Prepare a chart with categories (foods, activities, colors, etc.)",
          "Set up the circle area with clear boundaries",
          "Prepare your own favorite things to model sharing",
        ],
        instructions: [
          "Gather students in a circle and explain the sharing rules",
          "Model by sharing your own three favorite things first",
          "Invite each student to share one favorite thing at a time",
          "Record responses on chart paper by category",
          "Encourage questions and comments from other students",
          "Look for connections between students' favorites",
          "End by celebrating the variety of favorites in the class",
        ],
        assessment: [
          "Note students' comfort level with public speaking",
          "Observe listening behaviors during others' sharing",
          "Document the variety of interests represented",
          "Assess students' ability to ask appropriate questions",
        ],
        tips: [
          "Keep sharing time manageable - consider doing this over several days",
          "Use a talking stick or special object to indicate whose turn it is",
          "Celebrate both similarities and differences you notice",
          "Take photos of students sharing to create a documentation display",
        ],
        extensions: [
          "Create graphs showing class favorites in different categories",
          "Write a class book about 'Our Favorite Things'",
          "Plan activities based on popular class favorites",
          "Invite family members to share their favorite things too",
        ],
      },
      "name-dance-party": {
        title: "Name Dance Party",
        type: "Movement",
        duration: "40 minutes",
        groupSize: "Individual and whole group",
        objectives: [
          "Students will recognize and celebrate their names",
          "Students will create movements to represent letters",
          "Students will develop gross motor skills and rhythm",
        ],
        materials: [
          "Music player and upbeat songs",
          "Name cards for each student",
          "Open space for movement",
          "Scarves or ribbons (optional)",
          "Camera for recording performances",
        ],
        preparation: [
          "Clear a large space for movement",
          "Prepare name cards with large, clear letters",
          "Choose energetic, child-friendly music",
          "Practice some letter movements to demonstrate",
        ],
        instructions: [
          "Start with a warm-up dance to get everyone moving",
          "Show students their name cards and count the letters together",
          "Demonstrate how to make movements for different letters (A = arms up, B = bounce, etc.)",
          "Give students time to practice movements for each letter in their name",
          "Encourage creativity - there's no wrong way to move!",
          "Have each student perform their name dance for the class",
          "End with a whole-class dance party using everyone's movements",
        ],
        assessment: [
          "Observe students' letter recognition in their names",
          "Note creativity and confidence in movement creation",
          "Document participation and encouragement of classmates",
          "Assess gross motor coordination and rhythm",
        ],
        tips: [
          "Start with shorter names and work up to longer ones",
          "Encourage students to help classmates think of movements",
          "Take videos of performances to share with families",
          "Consider making this a regular morning meeting activity",
        ],
        extensions: [
          "Create movements for the whole alphabet",
          "Spell and dance other important words (school name, etc.)",
          "Teach traditional name songs and chants",
          "Have students create dances for family members' names",
        ],
      },
    },
    2: {
      "family-tree-collage": {
        title: "Family Tree Collage",
        type: "Craft",
        duration: "60 minutes (over 2 sessions)",
        groupSize: "Individual work with peer sharing",
        objectives: [
          "Students will identify family members and their relationships",
          "Students will create a visual representation of their family structure",
          "Students will develop fine motor skills through cutting and gluing",
        ],
        materials: [
          "Large brown construction paper (for tree trunk)",
          "Green construction paper (for leaves)",
          "Family photos or drawings",
          "Glue sticks",
          "Child-safe scissors",
          "Crayons and markers",
          "Small paper circles for family member names",
        ],
        preparation: [
          "Send home a note requesting family photos or asking families to help children draw family members",
          "Pre-cut tree trunk shapes for younger students if needed",
          "Set up workstations with all materials",
          "Prepare examples showing different family structures",
        ],
        instructions: [
          "Begin by discussing different types of families and how all families are special",
          "Show students how to arrange their tree trunk and branches on paper",
          "Help students glue down their tree structure",
          "Have students place family photos or drawings on the branches",
          "Add leaves around family members",
          "Help students write or dictate family member names and relationships",
          "Allow time for students to share their family trees with partners",
        ],
        assessment: [
          "Observe students' understanding of family relationships",
          "Note fine motor skill development in cutting and gluing",
          "Listen to students' descriptions of their family members",
          "Document the variety of family structures represented",
        ],
        tips: [
          "Be sensitive to different family structures and living situations",
          "Include pets as family members if children want to",
          "Help students who may not have photos by drawing family members together",
          "Display all family trees to celebrate the diversity of families",
        ],
        extensions: [
          "Create a class book featuring all family trees",
          "Invite family members to visit and share family traditions",
          "Compare family trees to real trees in nature",
          "Research family heritage and cultural backgrounds",
        ],
      },
      "family-tradition-show-tell": {
        title: "Family Tradition Show & Tell",
        type: "Storytelling",
        duration: "45 minutes",
        groupSize: "Individual sharing with whole group",
        objectives: [
          "Students will identify and describe family traditions",
          "Students will practice public speaking and storytelling",
          "Students will learn about diverse cultural traditions",
        ],
        materials: [
          "Items representing family traditions",
          "Special sharing chair",
          "Chart paper for recording traditions",
          "Camera for documentation",
          "World map (optional)",
        ],
        preparation: [
          "Send home a family letter explaining the activity and asking for tradition items",
          "Prepare your own family tradition to share as a model",
          "Set up a special sharing area",
          "Create a chart to categorize different types of traditions",
        ],
        instructions: [
          "Begin by sharing your own family tradition as a model",
          "Explain that traditions are special things families do together",
          "Invite each student to share their tradition and show their item",
          "Ask follow-up questions to help students elaborate",
          "Record traditions on chart paper by category (holidays, food, activities, etc.)",
          "Encourage students to ask respectful questions",
          "Celebrate the diversity of traditions represented",
        ],
        assessment: [
          "Note students' ability to describe family practices",
          "Observe comfort level with public speaking",
          "Document understanding of tradition concepts",
          "Assess respectful listening and questioning skills",
        ],
        tips: [
          "Be inclusive of all types of traditions, big and small",
          "Help students who may struggle to identify traditions",
          "Take photos of students with their tradition items",
          "Consider spreading this activity over several days",
        ],
        extensions: [
          "Create a class tradition book with photos and descriptions",
          "Try some of the shared traditions as class activities",
          "Invite family members to demonstrate traditions",
          "Research the origins of different cultural traditions",
        ],
      },
      "family-photo-scavenger-hunt": {
        title: "Family Photo Scavenger Hunt",
        type: "Photography",
        duration: "50 minutes",
        groupSize: "Small groups of 3-4 students",
        objectives: [
          "Students will identify different family activities and relationships",
          "Students will practice observation and categorization skills",
          "Students will work collaboratively in small groups",
        ],
        materials: [
          "Collection of family photos from all students",
          "Magnifying glasses",
          "Scavenger hunt checklist",
          "Clipboards",
          "Pencils",
          "Sorting trays or containers",
        ],
        preparation: [
          "Collect family photos from all students in advance",
          "Create scavenger hunt lists with items like 'find a photo of someone cooking,' 'find a photo with a pet,' etc.",
          "Set up stations with photos, magnifying glasses, and materials",
          "Prepare answer sheets with pictures for non-readers",
        ],
        instructions: [
          "Explain that students will be detectives looking for different things in family photos",
          "Show students how to use magnifying glasses carefully",
          "Give each group a scavenger hunt list and clipboard",
          "Have groups rotate through photo collections looking for items on their list",
          "Encourage students to discuss what they see and help each other",
          "Gather groups to share interesting discoveries",
          "Sort photos by categories found during the hunt",
        ],
        assessment: [
          "Observe students' ability to identify details in photos",
          "Note collaboration and communication skills",
          "Document understanding of family activity concepts",
          "Assess ability to categorize and sort information",
        ],
        tips: [
          "Include photos showing diverse family structures and activities",
          "Encourage students to share stories about photos they recognize",
          "Be sensitive to students who may not have many family photos",
          "Take photos of students during the activity for documentation",
        ],
        extensions: [
          "Create graphs showing the most common activities found",
          "Write stories inspired by interesting photos discovered",
          "Make a class photo album with categories",
          "Interview family members about the stories behind photos",
        ],
      },
    },
    3: {
      "school-helper-hunt": {
        title: "School Helper Hunt",
        type: "Exploration",
        duration: "90 minutes (including tour)",
        groupSize: "Whole class with adult supervision",
        objectives: [
          "Students will identify different jobs within the school",
          "Students will understand how school helpers contribute to the community",
          "Students will practice interview and observation skills",
        ],
        materials: [
          "Clipboards for each student",
          "School helper hunt checklist",
          "Pencils",
          "Camera",
          "Thank you cards (pre-made)",
          "Name tags for students",
        ],
        preparation: [
          "Contact school staff to arrange brief visits",
          "Create a route map for the school tour",
          "Prepare interview questions appropriate for kindergarten level",
          "Make thank you cards in advance",
          "Arrange for additional adult supervision",
        ],
        instructions: [
          "Begin with a discussion about jobs and helpers in the school",
          "Review tour expectations and safety rules",
          "Visit different areas: office, library, cafeteria, custodial areas, etc.",
          "Have students observe and ask prepared questions",
          "Take photos of students meeting different helpers",
          "Have students check off helpers they meet on their hunt list",
          "Return to classroom to discuss what they learned",
          "Deliver thank you cards to all the helpers visited",
        ],
        assessment: [
          "Observe students' ability to identify different school jobs",
          "Note respectful behavior during visits",
          "Listen to students' questions and observations",
          "Document understanding of how helpers contribute to school community",
        ],
        tips: [
          "Keep visits brief and focused",
          "Prepare school staff for the types of questions students might ask",
          "Take lots of photos to create a documentation display",
          "Follow up with thank you notes from the class",
        ],
        extensions: [
          "Create a school helper book with photos and job descriptions",
          "Invite school helpers to visit the classroom",
          "Set up dramatic play areas representing different school jobs",
          "Write and perform a play about school helpers",
        ],
      },
      "classroom-rules-poster": {
        title: "Classroom Rules Poster",
        type: "Art Activity",
        duration: "75 minutes (over 2 sessions)",
        groupSize: "Small collaborative groups",
        objectives: [
          "Students will identify important classroom expectations",
          "Students will work collaboratively to create visual representations",
          "Students will understand the purpose of rules in a community",
        ],
        materials: [
          "Large poster paper",
          "Markers and crayons",
          "Magazines for cutting pictures",
          "Glue sticks",
          "Stickers and decorative materials",
          "Child-safe scissors",
        ],
        preparation: [
          "Discuss classroom rules and expectations beforehand",
          "Gather magazines with appropriate pictures",
          "Set up workstations for small groups",
          "Prepare examples of rule posters",
        ],
        instructions: [
          "Review classroom rules through discussion and role-play",
          "Divide class into small groups, each focusing on 1-2 rules",
          "Have groups brainstorm how to show their rule visually",
          "Provide magazines and art materials for creating posters",
          "Encourage both drawing and collage techniques",
          "Help groups add words or phrases to their posters",
          "Have each group present their poster to the class",
          "Display all posters prominently in the classroom",
        ],
        assessment: [
          "Observe students' understanding of classroom expectations",
          "Note collaboration and compromise skills",
          "Document creative problem-solving in visual representation",
          "Assess ability to explain rules to others",
        ],
        tips: [
          "Focus on positive rule statements (what TO do rather than what NOT to do)",
          "Encourage students to include themselves in the poster illustrations",
          "Take photos of groups working together",
          "Refer back to posters throughout the year",
        ],
        extensions: [
          "Create rules for other areas (playground, library, etc.)",
          "Make a class book about why rules are important",
          "Role-play scenarios showing rules in action",
          "Design rules for a pretend classroom for stuffed animals",
        ],
      },
      "school-jobs-dramatic-play": {
        title: "School Jobs Dramatic Play",
        type: "Role Play",
        duration: "60 minutes",
        groupSize: "Small groups rotating through stations",
        objectives: [
          "Students will explore different school roles through play",
          "Students will develop empathy and understanding for school workers",
          "Students will practice social skills and cooperation",
        ],
        materials: [
          "Dress-up clothes for different jobs",
          "Props: clipboards, play phones, books, cleaning supplies",
          "Name tags for different roles",
          "Play money and cash register",
          "Pretend food for cafeteria play",
        ],
        preparation: [
          "Set up different stations representing school jobs",
          "Gather costumes and props for each role",
          "Create simple job description cards with pictures",
          "Arrange furniture to create realistic play spaces",
        ],
        instructions: [
          "Introduce each dramatic play station and available roles",
          "Demonstrate how to use props safely and appropriately",
          "Divide students into small groups to rotate through stations",
          "Allow 10-15 minutes at each station",
          "Encourage students to interact with each other in their roles",
          "Take photos of students engaged in different roles",
          "Gather for reflection on what they learned about each job",
        ],
        assessment: [
          "Observe students' understanding of different job responsibilities",
          "Note social interaction and cooperation skills",
          "Document creative problem-solving during play",
          "Listen to conversations about job importance",
        ],
        tips: [
          "Rotate through stations to facilitate and extend play",
          "Encourage students to try roles they might not initially choose",
          "Ask open-ended questions to extend thinking",
          "Connect play experiences back to real school helpers",
        ],
        extensions: [
          "Invite real school workers to visit and share about their jobs",
          "Create a classroom job system based on school roles",
          "Write thank you letters to school workers",
          "Make a video showing students in different school job roles",
        ],
      },
    },
    4: {
      "community-helper-interviews": {
        title: "Community Helper Interviews",
        type: "Field Work",
        duration: "2 hours (including preparation and follow-up)",
        groupSize: "Whole class with small interview groups",
        objectives: [
          "Students will learn about different community jobs",
          "Students will practice asking questions and listening skills",
          "Students will understand how community helpers serve others",
        ],
        materials: [
          "Simple recording device or tablet",
          "Prepared interview questions",
          "Clipboards and pencils",
          "Thank you cards",
          "Camera for photos",
        ],
        preparation: [
          "Arrange visits from 3-4 community helpers",
          "Prepare age-appropriate interview questions",
          "Practice interview skills with students",
          "Set up comfortable interview space",
        ],
        instructions: [
          "Welcome community helpers and introduce them to students",
          "Review interview expectations and manners",
          "Have small groups take turns asking prepared questions",
          "Record responses (with permission) for later review",
          "Take photos of students with community helpers",
          "Have students draw pictures of what they learned",
          "Create a class book featuring all the interviews",
        ],
        assessment: [
          "Observe students' listening and questioning skills",
          "Note understanding of community helper roles",
          "Document respectful interaction with adult visitors",
          "Assess ability to recall and represent information learned",
        ],
        tips: [
          "Prepare helpers for the types of questions kindergarteners might ask",
          "Keep interviews short and engaging",
          "Have backup questions ready",
          "Send thank you notes after visits",
        ],
        extensions: [
          "Visit community helpers at their workplaces",
          "Create dramatic play areas based on community jobs",
          "Write and illustrate books about community helpers",
          "Organize a community helper appreciation event",
        ],
      },
      "our-town-model": {
        title: "Our Town Model",
        type: "Building",
        duration: "90 minutes (over multiple sessions)",
        groupSize: "Collaborative small groups",
        objectives: [
          "Students will identify important places in their community",
          "Students will work together to create a 3D representation",
          "Students will understand spatial relationships and community layout",
        ],
        materials: [
          "Large cardboard base",
          "Various sized boxes and containers",
          "Construction paper",
          "Tape and glue",
          "Markers and crayons",
          "Small toy cars and people",
          "Natural materials (twigs, rocks, etc.)",
        ],
        preparation: [
          "Collect boxes and building materials in advance",
          "Take photos of local community places for reference",
          "Prepare a simple map of the local area",
          "Set up a large workspace for the model",
        ],
        instructions: [
          "Begin by discussing important places in your community",
          "Show photos and maps of local area",
          "Assign different groups to create different community places",
          "Provide boxes and materials for building structures",
          "Help students label their buildings",
          "Work together to arrange buildings on the base",
          "Add roads, parks, and other community features",
          "Use small figures to show people using community spaces",
        ],
        assessment: [
          "Observe students' knowledge of local community places",
          "Note collaboration and problem-solving skills",
          "Document understanding of spatial relationships",
          "Assess ability to represent 3D concepts",
        ],
        tips: [
          "Start with the most familiar places (school, homes, stores)",
          "Encourage creativity in building design",
          "Take progress photos throughout the building process",
          "Display the completed model prominently",
        ],
        extensions: [
          "Take walking tours to see the real places represented",
          "Add seasonal decorations to the model throughout the year",
          "Create stories about characters living in the model town",
          "Compare your town model to other communities",
        ],
      },
      "community-places-walk": {
        title: "Community Places Walk",
        type: "Movement",
        duration: "2 hours (including preparation and follow-up)",
        groupSize: "Whole class with adult supervision",
        objectives: [
          "Students will identify and locate community places",
          "Students will observe details about their neighborhood",
          "Students will practice mapping and directional skills",
        ],
        materials: [
          "Clipboards with simple maps",
          "Pencils and crayons",
          "Camera",
          "Safety vests or bright clothing",
          "First aid kit",
          "Parent volunteer helpers",
        ],
        preparation: [
          "Plan a safe walking route with interesting community places",
          "Recruit parent volunteers for supervision",
          "Prepare simple maps for students to follow",
          "Check weather and dress appropriately",
          "Notify school administration of walking field trip",
        ],
        instructions: [
          "Review walking safety rules and expectations",
          "Give each student a clipboard with map and pencil",
          "Walk to planned community locations",
          "Stop at each place to observe and discuss",
          "Have students mark locations on their maps",
          "Take photos of students at different community places",
          "Encourage students to notice details and ask questions",
          "Return to school to discuss observations and complete maps",
        ],
        assessment: [
          "Observe students' ability to identify community places",
          "Note attention to safety rules during the walk",
          "Document observations and questions about the community",
          "Assess basic mapping and directional understanding",
        ],
        tips: [
          "Keep the walking distance appropriate for kindergarten stamina",
          "Bring water and snacks for longer walks",
          "Have a backup indoor plan in case of weather issues",
          "Take lots of photos to create a documentation display",
        ],
        extensions: [
          "Create a photo book of the community walk",
          "Draw detailed pictures of favorite places visited",
          "Interview community members met during the walk",
          "Plan future walks to explore different areas",
        ],
      },
    },
    5: {
      "belonging-celebration-feast": {
        title: "Belonging Celebration Feast",
        type: "Celebration",
        duration: "2 hours",
        groupSize: "Whole class with family participation",
        objectives: [
          "Students will celebrate cultural diversity in their classroom",
          "Students will share foods and traditions from their families",
          "Students will understand how different cultures contribute to community",
        ],
        materials: [
          "Tables and chairs for feast setup",
          "Plates, cups, napkins, utensils",
          "Decorations representing different cultures",
          "Music from various cultures",
          "Camera for documentation",
          "Thank you cards for families",
        ],
        preparation: [
          "Send invitations to families asking them to bring cultural foods",
          "Coordinate food contributions to ensure variety",
          "Decorate classroom with multicultural decorations",
          "Prepare playlist of music from different cultures",
          "Set up tables for feast-style dining",
        ],
        instructions: [
          "Welcome families and explain the celebration purpose",
          "Have families share briefly about their food contributions",
          "Encourage students to try foods from different cultures",
          "Play music from various cultures during the meal",
          "Take photos of families and students enjoying the feast",
          "Have students share what they learned about different cultures",
          "End with a group song or chant about belonging together",
        ],
        assessment: [
          "Observe students' willingness to try new foods",
          "Note respectful behavior toward different cultural traditions",
          "Document learning about cultural diversity",
          "Assess understanding of how differences make communities stronger",
        ],
        tips: [
          "Be sensitive to food allergies and dietary restrictions",
          "Encourage families who can't bring food to share in other ways",
          "Take lots of photos to create a memory book",
          "Follow up with thank you notes to all participating families",
        ],
        extensions: [
          "Create a class cookbook with family recipes",
          "Learn songs or dances from different cultures",
          "Research the countries represented in your classroom",
          "Plan monthly cultural sharing events",
        ],
      },
      "unity-quilt-project": {
        title: "Unity Quilt Project",
        type: "Collaborative Art",
        duration: "Multiple sessions over 1 week",
        groupSize: "Individual squares, collaborative assembly",
        objectives: [
          "Students will create individual contributions to a group project",
          "Students will understand how individual pieces create something beautiful together",
          "Students will develop fine motor skills through fabric art",
        ],
        materials: [
          "Fabric squares (8x8 inches each)",
          "Fabric markers or crayons",
          "Iron (adult use only)",
          "Needle and thread for assembly",
          "Backing fabric for completed quilt",
          "Display area for finished quilt",
        ],
        preparation: [
          "Cut fabric squares in advance",
          "Set up workstations with fabric markers",
          "Plan design themes for each student's square",
          "Arrange for adult help with sewing assembly",
        ],
        instructions: [
          "Explain how quilts are made from many individual pieces",
          "Give each student a fabric square to decorate",
          "Encourage students to include symbols of what makes them special",
          "Allow multiple sessions for students to complete their squares",
          "Have adults help sew squares together into rows",
          "Assemble rows into completed quilt",
          "Display finished quilt prominently in classroom",
          "Have each student share about their individual square",
        ],
        assessment: [
          "Observe students' creativity in designing their squares",
          "Note understanding of individual contribution to group project",
          "Document fine motor skill development",
          "Assess ability to explain their design choices",
        ],
        tips: [
          "Provide examples of quilt patterns for inspiration",
          "Take photos of each square before assembly",
          "Consider having families help with sewing if possible",
          "Plan a special unveiling ceremony for the completed quilt",
        ],
        extensions: [
          "Research traditional quilting in different cultures",
          "Create smaller quilts for classroom stuffed animals",
          "Learn about the history of quilting bees and community",
          "Display the quilt at school events to share with other classes",
        ],
      },
      "we-belong-together-song": {
        title: "We Belong Together Song",
        type: "Performance",
        duration: "Multiple 30-minute sessions",
        groupSize: "Whole class performance",
        objectives: [
          "Students will learn and perform a song about friendship and belonging",
          "Students will develop musical skills and confidence",
          "Students will express the unit's themes through music",
        ],
        materials: [
          "Song lyrics printed large for display",
          "Simple instruments (shakers, bells, rhythm sticks)",
          "Microphone (optional)",
          "Seating area for audience",
          "Camera for recording performance",
        ],
        preparation: [
          "Choose or write a simple song about belonging and friendship",
          "Create large lyric charts with pictures",
          "Practice the song yourself before teaching",
          "Set up performance area with good acoustics",
        ],
        instructions: [
          "Introduce the song and its message about belonging",
          "Teach the song line by line with actions",
          "Practice singing together multiple times",
          "Add simple instruments for rhythm",
          "Assign solos or small group parts if appropriate",
          "Practice performing for an audience",
          "Invite other classes or families for final performance",
          "Record the performance to share with families",
        ],
        assessment: [
          "Observe students' participation in singing",
          "Note confidence and enthusiasm during performance",
          "Document understanding of song's message about belonging",
          "Assess ability to perform for an audience",
        ],
        tips: [
          "Choose a song with simple, repetitive lyrics",
          "Use hand motions to help students remember words",
          "Practice good singing posture and breathing",
          "Celebrate everyone's participation regardless of singing ability",
        ],
        extensions: [
          "Write additional verses to the song",
          "Create a music video of the performance",
          "Teach the song to other classes",
          "Learn songs about belonging from different cultures",
        ],
      },
    },
  },
}

export default async function ActivityInstructionsPage({
  params,
}: {
  params: Promise<{ unitId: string; week: string; activity: string }>
}) {
  const { unitId, week, activity: activityName } = await params
  const unit = activityData[unitId]
  const weekNum = Number.parseInt(week)
  const activity = unit?.[weekNum]?.[activityName]

  if (!activity) {
    navigate("/404")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link to={`/curriculum/kindergarten/activities/${unitId}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Activities
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <Badge variant="outline">{activity.type}</Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {activity.duration}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {activity.groupSize}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">{activity.title}</h1>
          <p className="text-lg text-gray-600">Week {week} Activity - Detailed Instructions</p>
        </div>

        {/* Learning Objectives */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Learning Objectives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {activity.objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{objective}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Materials & Preparation */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Materials Needed</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {activity.materials.map((material, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                    {material}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preparation Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {activity.preparation.map((step, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="bg-purple-100 text-purple-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Step-by-Step Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Step-by-Step Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activity.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-4">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{instruction}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Assessment & Tips */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {activity.assessment.map((item, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Teaching Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {activity.tips.map((tip, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Extensions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5 text-purple-600" />
              Extension Activities
            </CardTitle>
            <CardDescription>Additional ways to extend and enrich this learning experience</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {activity.extensions.map((extension, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="bg-purple-100 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-sm">{extension}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" asChild>
            <Link to={`/curriculum/kindergarten/activities/${unitId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Activities
            </Link>
          </Button>

          <Button asChild>
            <Link to={`/curriculum/kindergarten/activities/${unitId}`}>View All Activities</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
