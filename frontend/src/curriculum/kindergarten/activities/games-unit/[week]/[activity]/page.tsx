import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"
// Removed Next.js notFound - using React Router navigation instead
import {
  Clock,
  Users,
  BookOpen,
  Target,
  CheckCircle,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  Gamepad2,
  Heart,
  AlertCircle,
} from "lucide-react"

const activityData = {
  week1: {
    "favourite-game-show-tell": {
      title: "My Favourite Game Show & Tell",
      duration: "25 minutes",
      type: "Discussion",
      participants: "Whole Class",
      materials: ["Chart paper", "Markers", "Children's favourite games (brought from home)", "Camera (optional)"],
      objectives: [
        "Share personal experiences with games",
        "Practice speaking and listening skills",
        "Recognize variety in game preferences",
        "Build classroom community through sharing",
      ],
      preparation: [
        "Send home note asking families to help children choose a favourite game to share",
        "Prepare chart paper with title 'Our Favourite Games'",
        "Set up sharing circle area",
        "Have markers ready for simple drawings",
      ],
      instructions: [
        "Gather children in sharing circle",
        "Explain that everyone will share their favourite game",
        "Model by sharing your own favourite childhood game first",
        "Invite each child to share: What game? How do you play? Who do you play with? Why do you like it?",
        "Draw simple pictures on chart paper for each game mentioned",
        "Ask follow-up questions: 'Has anyone else played this game?'",
        "Celebrate the variety of games our class enjoys",
        "Display chart in classroom for reference throughout unit",
      ],
      assessment: [
        "Child participates in sharing circle",
        "Child describes their favourite game clearly",
        "Child listens respectfully to others",
        "Child shows interest in classmates' games",
      ],
      extensions: [
        "Create a class book of favourite games with drawings",
        "Invite families to teach their games to the class",
        "Start a 'Game of the Day' routine",
        "Make connections between similar games shared",
      ],
      tips: [
        "Some children may be shy - offer to help them share",
        "Include traditional Caribbean games like marbles, skipping, 'Zoot Zoot'",
        "Take photos of children sharing for documentation",
        "Connect games to different cultures represented in your class",
      ],
      vocabulary: ["game", "favourite", "share", "play", "fun", "rules", "together"],
      safety: ["Ensure all children have opportunity to share", "Create supportive, non-judgmental environment"],
    },
    "classroom-game-corner": {
      title: "Classroom Game Corner Setup",
      duration: "30 minutes",
      type: "Exploration",
      participants: "Small Groups (4-5 children)",
      materials: [
        "Local board games",
        "Dominoes",
        "Simple card games",
        "Puzzles",
        "Marbles",
        "Bottle caps",
        "Small baskets for organization",
      ],
      objectives: [
        "Explore different types of games",
        "Practice taking turns and sharing",
        "Develop fine motor skills",
        "Learn to follow simple game rules",
      ],
      preparation: [
        "Set up 4-5 game stations around the classroom",
        "Include mix of board games, card games, and traditional games",
        "Prepare simple visual instructions for each game",
        "Organize materials in labeled baskets",
      ],
      instructions: [
        "Introduce the new Game Corner to the class",
        "Show each type of game available",
        "Demonstrate how to care for game materials",
        "Divide class into small groups",
        "Rotate groups through stations every 6-7 minutes",
        "Encourage children to try games they haven't played before",
        "Support children in learning new games",
        "End with cleanup and reflection on what they discovered",
      ],
      assessment: [
        "Child explores different types of games",
        "Child handles materials carefully",
        "Child attempts to follow game rules",
        "Child cooperates with group members",
      ],
      extensions: [
        "Add new games weekly based on children's interests",
        "Create student 'game experts' to help teach others",
        "Make simple games using local materials",
        "Document favourite games through photos",
      ],
      tips: [
        "Start with familiar games and add complexity gradually",
        "Include games that don't require reading",
        "Use visual cues and demonstrations",
        "Celebrate effort over winning",
      ],
      vocabulary: ["explore", "station", "turn", "share", "careful", "rules", "together"],
      safety: [
        "Supervise small game pieces with young children",
        "Ensure games are age-appropriate",
        "Check for broken pieces regularly",
      ],
    },
    "drawing-my-game": {
      title: "Drawing My Game",
      duration: "20 minutes",
      type: "Art",
      participants: "Individual",
      materials: ["Drawing paper", "Crayons", "Colored pencils", "Markers", "Pencils"],
      objectives: [
        "Express ideas through art",
        "Include details in drawings",
        "Connect personal experiences to art",
        "Practice fine motor skills",
      ],
      preparation: [
        "Prepare drawing materials at tables",
        "Have examples of detailed drawings ready",
        "Set up quiet drawing space",
        "Prepare sharing area for completed drawings",
      ],
      instructions: [
        "Review favourite games shared earlier",
        "Ask children to choose one game to draw",
        "Encourage them to include: themselves playing, where they play, what they use, who plays with them",
        "Model drawing details: 'I'll draw myself with a big smile because I'm having fun'",
        "Circulate and ask questions about their drawings",
        "Encourage adding details: 'Tell me about this part of your drawing'",
        "Allow children to share their drawings with a partner",
        "Display drawings in classroom",
      ],
      assessment: [
        "Child includes themselves in the drawing",
        "Child adds relevant details to the drawing",
        "Child can explain their drawing to others",
        "Child shows engagement with the activity",
      ],
      extensions: [
        "Write or dictate stories about their drawings",
        "Create a class gallery of game drawings",
        "Compare drawings of the same game by different children",
        "Use drawings to discuss different ways to play games",
      ],
      tips: [
        "Focus on effort and details rather than artistic skill",
        "Ask open-ended questions about their drawings",
        "Encourage children to tell stories about their art",
        "Include drawings in portfolios",
      ],
      vocabulary: ["draw", "details", "picture", "show", "explain", "art", "create"],
      safety: ["Supervise use of art materials", "Ensure proper ventilation if using markers"],
    },
    "song-movement-game": {
      title: "Song & Movement Game",
      duration: "15 minutes",
      type: "Movement",
      participants: "Whole Class",
      materials: ["Open space", "Optional: simple musical instruments", "Song lyrics written on chart paper"],
      objectives: [
        "Learn traditional songs and games",
        "Develop gross motor skills",
        "Practice following directions",
        "Experience joy in group activities",
      ],
      preparation: [
        "Clear space for movement",
        "Learn traditional song like 'Ring-a-Ring o' Roses' or local variation",
        "Write song lyrics on chart paper",
        "Practice movements beforehand",
      ],
      instructions: [
        "Gather children in circle",
        "Introduce the song and explain it's a game too",
        "Teach the song line by line",
        "Add simple movements gradually",
        "Practice slowly first, then at normal speed",
        "Play the game several times",
        "Discuss how songs can be part of games",
        "Ask children if they know other singing games",
      ],
      assessment: [
        "Child participates in singing",
        "Child follows movement directions",
        "Child shows enjoyment in group activity",
        "Child can connect songs to games",
      ],
      extensions: [
        "Learn songs in different languages represented in class",
        "Create new verses to familiar songs",
        "Add simple instruments to songs",
        "Invite families to share traditional singing games",
      ],
      tips: [
        "Keep movements simple and safe",
        "Include children who may be hesitant to sing",
        "Use songs throughout the day for transitions",
        "Connect to cultural traditions in your community",
      ],
      vocabulary: ["song", "sing", "move", "circle", "together", "rhythm", "dance"],
      safety: ["Ensure adequate space for movement", "Check that all children can participate safely"],
    },
  },
  week2: {
    "simon-says-local": {
      title: "Simon Says (Local Twist)",
      duration: "20 minutes",
      type: "Movement",
      participants: "Whole Class",
      materials: ["Open space", "List of local action ideas"],
      objectives: [
        "Practice listening skills",
        "Follow directions carefully",
        "Learn about local nature and culture",
        "Develop self-control and attention",
      ],
      preparation: [
        "Clear large space for movement",
        "Prepare list of local actions: 'sway like a banana tree', 'hop like a grasshopper', 'swim like a fish in the sea'",
        "Practice being the leader",
        "Set clear boundaries for play area",
      ],
      instructions: [
        "Explain the rules: only move when you hear 'Simon says'",
        "Start with simple actions everyone knows",
        "Add local nature actions: 'Simon says flutter like a hummingbird'",
        "Include cultural actions: 'Simon says dance like at Carnival'",
        "Give some commands without 'Simon says' to test listening",
        "Let children take turns being Simon",
        "Celebrate good listening rather than elimination",
        "End with everyone doing a favourite action together",
      ],
      assessment: [
        "Child listens carefully to instructions",
        "Child follows directions appropriately",
        "Child shows self-control when not supposed to move",
        "Child enjoys local cultural references",
      ],
      extensions: [
        "Create 'Maria says' or use local names",
        "Add actions in different languages",
        "Include actions related to local jobs or activities",
        "Let children suggest new actions",
      ],
      tips: [
        "Keep game positive - focus on listening rather than elimination",
        "Include actions that all children can do",
        "Use local animals, plants, and cultural references",
        "Model good sportsmanship",
      ],
      vocabulary: ["listen", "follow", "directions", "Simon says", "move", "stop", "careful"],
      safety: ["Ensure safe movement space", "Check that actions are safe for all children", "Monitor energy levels"],
    },
    "hopscotch-chalk": {
      title: "Hopscotch (Drawn with Chalk)",
      duration: "25 minutes",
      type: "Physical",
      participants: "Small Groups (3-4 children)",
      materials: ["Sidewalk chalk", "Shells or bottle caps for markers", "Safe outdoor space"],
      objectives: [
        "Develop balance and coordination",
        "Practice taking turns",
        "Learn traditional game rules",
        "Use recycled materials creatively",
      ],
      preparation: [
        "Find safe outdoor area with smooth surface",
        "Collect shells or clean bottle caps as markers",
        "Draw hopscotch grid with chalk",
        "Practice the game yourself",
      ],
      instructions: [
        "Show children the hopscotch grid",
        "Demonstrate how to play: throw marker, hop on one foot, pick up marker",
        "Start with simple version - just hopping to end and back",
        "Add throwing marker when children are comfortable",
        "Emphasize taking turns and cheering for others",
        "Let children help draw new grids",
        "Adapt rules for different skill levels",
        "Celebrate everyone's efforts",
      ],
      assessment: [
        "Child attempts hopping movements",
        "Child takes turns appropriately",
        "Child follows basic game sequence",
        "Child shows good sportsmanship",
      ],
      extensions: [
        "Create different shaped hopscotch grids",
        "Add numbers or letters to squares",
        "Use different hopping patterns",
        "Create class hopscotch tournament",
      ],
      tips: [
        "Start with easier version and build complexity",
        "Focus on fun rather than perfect technique",
        "Include children who may need modifications",
        "Use local materials for markers",
      ],
      vocabulary: ["hop", "jump", "throw", "marker", "turn", "balance", "grid"],
      safety: ["Check surface for hazards", "Ensure adequate space between players", "Monitor for fatigue"],
    },
    "passing-ball-game": {
      title: "Passing the Ball Game",
      duration: "15 minutes",
      type: "Circle Time",
      participants: "Whole Class",
      materials: ["Soft ball", "Music player", "Upbeat Caribbean music"],
      objectives: [
        "Practice sharing and cooperation",
        "Develop listening skills",
        "Build confidence in speaking",
        "Experience Caribbean music and rhythm",
      ],
      preparation: [
        "Arrange chairs or spots in circle",
        "Choose soft, safe ball",
        "Select lively Caribbean music",
        "Prepare questions about games",
      ],
      instructions: [
        "Sit in circle with children",
        "Explain: pass ball while music plays, share when music stops",
        "Start music and begin passing ball around circle",
        "Stop music randomly - child with ball shares something about games",
        "Prompts: 'What makes games fun?' 'Who do you like to play with?'",
        "Continue for several rounds",
        "End with everyone saying something they learned",
        "Celebrate all sharing",
      ],
      assessment: [
        "Child passes ball appropriately",
        "Child shares when holding ball",
        "Child listens to others' sharing",
        "Child shows positive attitude",
      ],
      extensions: [
        "Use different types of music",
        "Change sharing topics",
        "Let children suggest questions",
        "Add movement while passing",
      ],
      tips: [
        "Keep sharing prompts simple and open-ended",
        "Support shy children with encouragement",
        "Use music from children's cultures",
        "Make it feel like celebration, not test",
      ],
      vocabulary: ["pass", "share", "listen", "music", "stop", "turn", "together"],
      safety: ["Use soft ball only", "Ensure circle has enough space", "Monitor volume of music"],
    },
    "rules-play-discussion": {
      title: "Rules of Play Discussion",
      duration: "20 minutes",
      type: "Discussion",
      participants: "Whole Class",
      materials: ["Pictures of children playing fairly and unfairly", "Chart paper", "Markers"],
      objectives: [
        "Understand importance of rules in games",
        "Recognize fair and unfair play",
        "Develop moral reasoning skills",
        "Practice expressing opinions",
      ],
      preparation: [
        "Collect or draw pictures showing fair/unfair play",
        "Prepare chart paper with 'Fair Play' and 'Unfair Play' columns",
        "Think of simple scenarios to discuss",
        "Set up comfortable discussion area",
      ],
      instructions: [
        "Show pictures of children playing games",
        "Ask: 'What do you see happening in this picture?'",
        "Discuss: 'Is this fair or unfair? Why?'",
        "Record responses on chart paper",
        "Ask: 'How do you feel when someone doesn't play fairly?'",
        "Discuss: 'Why do games have rules?'",
        "Create class rules for fair play",
        "Practice scenarios: 'What if someone doesn't take turns?'",
        "End with commitment to fair play",
      ],
      assessment: [
        "Child identifies fair vs unfair behavior",
        "Child explains reasoning for opinions",
        "Child participates in discussion",
        "Child shows understanding of rules' importance",
      ],
      extensions: [
        "Role-play fair and unfair scenarios",
        "Create class fair play poster",
        "Practice problem-solving for game conflicts",
        "Connect to classroom rules",
      ],
      tips: [
        "Use concrete examples children can relate to",
        "Encourage all children to share opinions",
        "Connect to real classroom situations",
        "Focus on positive solutions",
      ],
      vocabulary: ["fair", "unfair", "rules", "kind", "share", "turn", "respect"],
      safety: ["Create safe space for sharing feelings", "Address any real conflicts sensitively"],
    },
  },
  week3: {
    "family-game-stories": {
      title: "Family Game Time Stories",
      duration: "25 minutes",
      type: "Sharing",
      participants: "Whole Class",
      materials: ["Family photos (optional)", "Chart paper", "Markers", "Comfortable seating area"],
      objectives: [
        "Share family experiences and traditions",
        "Recognize similarities and differences in families",
        "Practice storytelling skills",
        "Build connections between home and school",
      ],
      preparation: [
        "Send note home asking families to share game stories with children",
        "Prepare chart paper for recording games",
        "Set up cozy sharing area",
        "Have your own family game story ready to share",
      ],
      instructions: [
        "Gather in sharing circle",
        "Share your own family game story first",
        "Invite children to share games they play with family members",
        "Ask questions: 'Who taught you this game?' 'When do you play it?'",
        "Record different family games on chart paper",
        "Notice similarities: 'Three families play dominoes!'",
        "Celebrate differences: 'What interesting games our families play!'",
        "Thank children for sharing their family stories",
      ],
      assessment: [
        "Child shares family game experience",
        "Child listens respectfully to others",
        "Child shows interest in different family traditions",
        "Child makes connections between families",
      ],
      extensions: [
        "Invite family members to demonstrate games",
        "Create family game book with photos and stories",
        "Learn games from different families",
        "Map where different games come from",
      ],
      tips: [
        "Be sensitive to different family structures",
        "Include all types of family games",
        "Help children who may be shy about sharing",
        "Connect games to cultural backgrounds",
      ],
      vocabulary: ["family", "tradition", "story", "share", "different", "same", "special"],
      safety: ["Respect family privacy", "Create inclusive environment for all family types"],
    },
    "grandparents-game-demo": {
      title: "Grandparents' Game Demonstration",
      duration: "35 minutes",
      type: "Cultural",
      participants: "Whole Class",
      materials: [
        "Materials for traditional game (marbles, rope, etc.)",
        "Chairs for elder",
        "Camera for documentation",
      ],
      objectives: [
        "Learn traditional Saint Lucian games",
        "Respect and learn from elders",
        "Connect past and present",
        "Experience cultural heritage",
      ],
      preparation: [
        "Invite grandparent or community elder",
        "Discuss which traditional game to demonstrate",
        "Prepare materials needed for the game",
        "Set up comfortable space for elder and children",
      ],
      instructions: [
        "Welcome elder warmly to classroom",
        "Have children introduce themselves",
        "Ask elder to share about games from their childhood",
        "Watch demonstration of traditional game",
        "Ask questions: 'How did you learn this game?' 'Who did you play with?'",
        "Let children try the game with elder's guidance",
        "Thank elder for sharing their knowledge",
        "Discuss what they learned about games in the past",
      ],
      assessment: [
        "Child shows respect for elder",
        "Child listens attentively to stories",
        "Child attempts to play traditional game",
        "Child asks appropriate questions",
      ],
      extensions: [
        "Invite multiple elders to share different games",
        "Create book of traditional games",
        "Teach traditional games to other classes",
        "Connect to social studies about past and present",
      ],
      tips: [
        "Prepare elder for kindergarten attention spans",
        "Have backup plan if elder can't come",
        "Document experience with photos/video",
        "Follow up with thank you note from class",
      ],
      vocabulary: ["elder", "traditional", "past", "history", "respect", "learn", "culture"],
      safety: ["Ensure elder is comfortable", "Adapt games for safety", "Supervise children's interactions"],
    },
    "animal-imitation-tag": {
      title: "Animal Imitation Tag",
      duration: "20 minutes",
      type: "Movement",
      participants: "Whole Class",
      materials: ["Open outdoor space", "Animal picture cards (optional)", "Boundary markers"],
      objectives: [
        "Develop gross motor skills",
        "Learn about local animals",
        "Practice following rules in active games",
        "Experience joy in movement",
      ],
      preparation: [
        "Choose safe outdoor area with clear boundaries",
        "Select local animals for imitation",
        "Practice animal movements yourself",
        "Set clear game boundaries",
      ],
      instructions: [
        "Gather children in play area",
        "Explain tag rules: taggers move like chosen animal",
        "Demonstrate animal movements: crab walking, hopping like grasshopper",
        "Choose first animal and select taggers",
        "Play for 2-3 minutes, then change animal and taggers",
        "Include local animals: iguana crawling, bird flying, fish swimming motions",
        "Ensure everyone gets chance to be tagger",
        "End with slow animal movements to calm down",
      ],
      assessment: [
        "Child attempts animal movements",
        "Child follows tag game rules",
        "Child shows good sportsmanship",
        "Child participates safely in active play",
      ],
      extensions: [
        "Learn about habitats of animals imitated",
        "Add sounds animals make",
        "Create animal movement dance",
        "Connect to science study of local animals",
      ],
      tips: [
        "Keep games short to maintain engagement",
        "Include animals all children can imitate",
        "Focus on fun rather than perfect imitation",
        "Have quiet signal to stop game",
      ],
      vocabulary: ["animal", "imitate", "move", "tag", "hop", "crawl", "fly"],
      safety: ["Check play area for hazards", "Monitor for overexertion", "Ensure inclusive participation"],
    },
    "who-plays-where-chart": {
      title: "Who Plays Where? Chart",
      duration: "20 minutes",
      type: "Sorting",
      participants: "Whole Class",
      materials: ["Large chart paper", "Pictures of people and games", "Glue sticks", "Markers"],
      objectives: [
        "Categorize games by who typically plays them",
        "Recognize that people of all ages play games",
        "Practice sorting and classification skills",
        "Discuss stereotypes and exceptions",
      ],
      preparation: [
        "Create chart with columns: Children, Adults, Everyone",
        "Collect pictures of different games and people playing",
        "Prepare glue sticks and markers",
        "Think about discussion questions",
      ],
      instructions: [
        "Show chart and explain categories",
        "Hold up pictures of different games",
        "Ask: 'Who usually plays this game?'",
        "Let children decide where to place each picture",
        "Discuss: 'Can adults play this game too?'",
        "Notice games that everyone can play",
        "Talk about exceptions: 'My grandma plays video games!'",
        "Celebrate that games bring all ages together",
      ],
      assessment: [
        "Child participates in sorting activity",
        "Child explains reasoning for placement",
        "Child recognizes that games can cross age groups",
        "Child shows flexible thinking about categories",
      ],
      extensions: [
        "Survey families about who plays what games",
        "Create graphs of game preferences by age",
        "Invite different age groups to play together",
        "Discuss how games change over time",
      ],
      tips: [
        "Encourage discussion about exceptions to categories",
        "Include diverse representation in pictures",
        "Help children see beyond stereotypes",
        "Connect to their own family experiences",
      ],
      vocabulary: ["sort", "category", "children", "adults", "everyone", "usually", "sometimes"],
      safety: ["Use child-safe glue sticks", "Supervise cutting if needed"],
    },
  },
  week4: {
    "schoolyard-safety-walk": {
      title: "Schoolyard Safety Walk",
      duration: "30 minutes",
      type: "Exploration",
      participants: "Whole Class",
      materials: ["Clipboards", "Paper", "Pencils", "Safety checklist", "First aid kit"],
      objectives: [
        "Identify safe and unsafe play areas",
        "Develop safety awareness",
        "Practice observation skills",
        "Learn about school environment",
      ],
      preparation: [
        "Plan safe route around schoolyard",
        "Create simple safety checklist with pictures",
        "Prepare clipboards for children",
        "Check with administration about areas to avoid",
      ],
      instructions: [
        "Gather class and explain safety walk purpose",
        "Review safety rules for walking together",
        "Visit different areas of schoolyard",
        "At each area ask: 'Is this safe for games? Why or why not?'",
        "Point out safe features: soft grass, shade, open space",
        "Identify hazards: broken equipment, rough surfaces, busy areas",
        "Let children mark safe/unsafe on their checklists",
        "Return to classroom and discuss findings",
      ],
      assessment: [
        "Child identifies obvious safety hazards",
        "Child follows safety rules during walk",
        "Child participates in discussions",
        "Child shows awareness of safe play spaces",
      ],
      extensions: [
        "Create map of safe play areas",
        "Write letters to principal about safety concerns",
        "Design ideal playground",
        "Practice safety rules in different areas",
      ],
      tips: [
        "Keep group together and supervised",
        "Use positive language about safety",
        "Include children in decision-making",
        "Follow up on any real safety concerns",
      ],
      vocabulary: ["safe", "unsafe", "hazard", "careful", "observe", "area", "space"],
      safety: ["Maintain close supervision", "Avoid actually unsafe areas", "Have first aid kit available"],
    },
    "indoor-games-rotation": {
      title: "Indoor Games Rotation",
      duration: "35 minutes",
      type: "Game Play",
      participants: "Small Groups (4-5 children)",
      materials: ["Memory Match cards", "Ludo board", "Snakes and Ladders", "Simple puzzles", "Dominoes"],
      objectives: [
        "Experience variety of indoor games",
        "Practice turn-taking and patience",
        "Develop strategic thinking",
        "Learn new game rules",
      ],
      preparation: [
        "Set up 5 game stations around classroom",
        "Prepare simple visual instructions for each game",
        "Organize materials in baskets",
        "Plan rotation schedule",
      ],
      instructions: [
        "Introduce each game station briefly",
        "Divide class into 5 groups",
        "Explain rotation system: 7 minutes per station",
        "Start groups at different stations",
        "Circulate to support and teach rules",
        "Give 2-minute warning before rotation",
        "Help groups transition smoothly",
        "End with reflection on favourite games",
      ],
      assessment: [
        "Child attempts to learn new games",
        "Child takes turns appropriately",
        "Child handles materials carefully",
        "Child shows patience with game rules",
      ],
      extensions: [
        "Create tournament brackets for favourite games",
        "Let children teach games to other classes",
        "Make simple versions of games",
        "Connect games to math and literacy skills",
      ],
      tips: [
        "Start with simpler games and add complexity",
        "Have older students or volunteers help teach",
        "Focus on fun and learning, not winning",
        "Adapt rules for kindergarten level",
      ],
      vocabulary: ["rotation", "station", "rules", "strategy", "patience", "turn", "game"],
      safety: ["Supervise small game pieces", "Ensure games are age-appropriate", "Monitor group dynamics"],
    },
    "drawing-playground": {
      title: "Drawing Our Playground",
      duration: "25 minutes",
      type: "Art",
      participants: "Individual",
      materials: ["Large drawing paper", "Crayons", "Colored pencils", "Rulers (optional)", "Playground photos"],
      objectives: [
        "Represent spatial relationships in drawings",
        "Include details and labels in artwork",
        "Connect art to real experiences",
        "Practice map-making skills",
      ],
      preparation: [
        "Take photos of school playground areas",
        "Prepare large drawing paper",
        "Set up art materials",
        "Have examples of simple maps ready",
      ],
      instructions: [
        "Review safety walk and safe play areas",
        "Show photos of different playground areas",
        "Explain they'll draw map of their favourite play area",
        "Encourage including: equipment, trees, buildings, pathways",
        "Model adding details: 'I'll draw the swings here and the slide there'",
        "Circulate and ask about their drawings",
        "Help children add labels if they want",
        "Share drawings with classmates",
      ],
      assessment: [
        "Child includes recognizable playground features",
        "Child shows spatial relationships in drawing",
        "Child adds appropriate details",
        "Child can explain their drawing",
      ],
      extensions: [
        "Create class playground map",
        "Compare drawings of same areas",
        "Add safety symbols to maps",
        "Use maps for playground games",
      ],
      tips: [
        "Focus on their perspective and experience",
        "Encourage creativity in representation",
        "Help with spelling for labels",
        "Display maps in classroom",
      ],
      vocabulary: ["map", "area", "space", "draw", "details", "playground", "favourite"],
      safety: ["Supervise art materials", "Ensure inclusive representation of play areas"],
    },
    "movement-obstacle-course": {
      title: "Movement Obstacle Course",
      duration: "30 minutes",
      type: "Physical",
      participants: "Small Groups (3-4 children)",
      materials: ["Cones", "Hoops", "Ropes", "Soft mats", "Bean bags", "Chalk for marking"],
      objectives: [
        "Develop gross motor skills",
        "Practice following sequences",
        "Learn to take turns patiently",
        "Experience physical challenges safely",
      ],
      preparation: [
        "Set up obstacle course with 5-6 stations",
        "Test course for safety and appropriate difficulty",
        "Mark start and finish lines",
        "Prepare demonstration of each obstacle",
      ],
      instructions: [
        "Gather children to see obstacle course",
        "Demonstrate each station: hop through hoops, crawl under rope, etc.",
        "Explain taking turns and cheering for others",
        "Start with one group while others watch",
        "Encourage effort and celebrate completion",
        "Let each child go through 2-3 times",
        "Modify obstacles for different abilities",
        "End with group celebration of everyone's efforts",
      ],
      assessment: [
        "Child attempts each obstacle",
        "Child takes turns appropriately",
        "Child shows good sportsmanship",
        "Child demonstrates improved coordination",
      ],
      extensions: [
        "Let children design new obstacles",
        "Time runs for personal improvement",
        "Create team obstacle challenges",
        "Connect to health and fitness discussions",
      ],
      tips: [
        "Focus on participation, not competition",
        "Modify for children with different abilities",
        "Ensure adequate rest between turns",
        "Celebrate all efforts enthusiastically",
      ],
      vocabulary: ["obstacle", "course", "hop", "crawl", "balance", "turn", "challenge"],
      safety: [
        "Check all equipment before use",
        "Supervise closely",
        "Have first aid available",
        "Ensure soft landing areas",
      ],
    },
  },
  week5: {
    "faces-game-activity": {
      title: "Faces of the Game Activity",
      duration: "20 minutes",
      type: "Discussion",
      participants: "Whole Class",
      materials: ["Emotion face cards", "Game scenario pictures", "Chart paper", "Markers"],
      objectives: [
        "Identify different emotions in games",
        "Connect feelings to game experiences",
        "Develop emotional vocabulary",
        "Practice empathy and understanding",
      ],
      preparation: [
        "Prepare emotion face cards: happy, excited, sad, frustrated, proud",
        "Create or find pictures of game scenarios",
        "Set up comfortable discussion area",
        "Prepare chart paper for recording responses",
      ],
      instructions: [
        "Show different emotion faces and name them together",
        "Show picture of game scenario (winning, losing, waiting)",
        "Ask: 'How might this person feel? Why?'",
        "Let children match emotion faces to scenarios",
        "Discuss: 'When have you felt this way in a game?'",
        "Record different feelings on chart paper",
        "Talk about how all feelings are normal",
        "Discuss ways to handle different feelings",
      ],
      assessment: [
        "Child identifies basic emotions",
        "Child connects emotions to game experiences",
        "Child shares personal experiences appropriately",
        "Child shows empathy for others' feelings",
      ],
      extensions: [
        "Create emotion journals for game experiences",
        "Role-play handling different emotions",
        "Read books about feelings and games",
        "Practice calming strategies for frustration",
      ],
      tips: [
        "Validate all emotions as normal",
        "Share your own game emotion experiences",
        "Help children find words for feelings",
        "Connect to social-emotional learning goals",
      ],
      vocabulary: ["feelings", "emotions", "happy", "sad", "excited", "frustrated", "proud"],
      safety: ["Create safe space for sharing feelings", "Be sensitive to children's experiences"],
    },
    "feelings-role-play": {
      title: "Feelings Role-Play",
      duration: "25 minutes",
      type: "Drama",
      participants: "Whole Class",
      materials: ["Simple props (ribbons for winners, etc.)", "Scenario cards", "Comfortable space for acting"],
      objectives: [
        "Practice handling different game emotions",
        "Develop problem-solving skills",
        "Build empathy through role-play",
        "Learn appropriate responses to feelings",
      ],
      preparation: [
        "Prepare simple scenario cards: winning, losing, waiting for turn",
        "Set up acting area",
        "Think through appropriate responses to model",
        "Have calming strategies ready to teach",
      ],
      instructions: [
        "Explain role-play: acting out situations to practice",
        "Start with winning scenario - how do we act when we win?",
        "Model good winner behavior: 'Good game everyone!'",
        "Try losing scenario - practice saying 'Good game' when losing",
        "Role-play waiting for turn - practice patience",
        "Let children suggest other scenarios",
        "Practice calming strategies for frustration",
        "End with positive game interaction role-play",
      ],
      assessment: [
        "Child participates in role-play activities",
        "Child demonstrates appropriate responses",
        "Child shows understanding of good sportsmanship",
        "Child practices calming strategies",
      ],
      extensions: [
        "Create class book of good sportsmanship",
        "Practice scenarios during real games",
        "Invite older students to model good behavior",
        "Connect to conflict resolution skills",
      ],
      tips: [
        "Keep scenarios simple and relatable",
        "Model positive responses enthusiastically",
        "Practice strategies multiple times",
        "Celebrate good sportsmanship when you see it",
      ],
      vocabulary: ["role-play", "practice", "winner", "loser", "patience", "calm", "sportsmanship"],
      safety: ["Keep role-play positive and supportive", "Address any real conflicts sensitively"],
    },
    "parachute-play": {
      title: "Cooperative Game: Parachute Play",
      duration: "20 minutes",
      type: "Cooperative",
      participants: "Whole Class",
      materials: ["Large parachute or sheet", "Soft balls", "Upbeat music (optional)"],
      objectives: [
        "Experience cooperative play",
        "Work together toward common goal",
        "Develop gross motor skills",
        "Celebrate teamwork success",
      ],
      preparation: [
        "Find large parachute or sheet",
        "Choose open space for activity",
        "Have soft balls ready",
        "Select energetic music if desired",
      ],
      instructions: [
        "Have everyone hold edge of parachute",
        "Practice gentle up and down movements together",
        "Add soft ball - try to keep it bouncing on parachute",
        "Celebrate when everyone works together",
        "Try different movements: fast, slow, high, low",
        "Add more balls for extra challenge",
        "End with everyone under parachute for 'mushroom'",
        "Discuss how teamwork made the activity fun",
      ],
      assessment: [
        "Child participates in cooperative activity",
        "Child works with others toward common goal",
        "Child shows excitement about teamwork",
        "Child follows group movements",
      ],
      extensions: [
        "Try parachute games with different objectives",
        "Use parachute for other cooperative activities",
        "Discuss other times we work as team",
        "Create class teamwork goals",
      ],
      tips: [
        "Emphasize cooperation over competition",
        "Celebrate group successes enthusiastically",
        "Include all children in holding parachute",
        "Keep energy positive and fun",
      ],
      vocabulary: ["cooperate", "teamwork", "together", "parachute", "bounce", "team", "success"],
      safety: ["Ensure all children can hold parachute safely", "Use only soft balls", "Monitor for overexcitement"],
    },
    "thankfulness-circle": {
      title: "Game Thankfulness Circle",
      duration: "15 minutes",
      type: "Circle Time",
      participants: "Whole Class",
      materials: ["Comfortable seating area", "Optional: gratitude stone or special object"],
      objectives: [
        "Express gratitude for play experiences",
        "Recognize positive interactions with others",
        "Build classroom community",
        "Reflect on learning about games",
      ],
      preparation: [
        "Arrange comfortable circle seating",
        "Prepare gratitude stone or special object",
        "Think of your own gratitude to share",
        "Create calm, reflective atmosphere",
      ],
      instructions: [
        "Gather in circle and explain gratitude sharing",
        "Pass gratitude stone around circle",
        "Each child thanks a classmate for playing with them",
        "Encourage specific examples: 'Thank you Maria for helping me learn dominoes'",
        "Model gratitude: 'Thank you all for being such good game partners'",
        "Let children share what they learned about games",
        "End with group appreciation for fun week of games",
        "Celebrate the community they've built through play",
      ],
      assessment: [
        "Child expresses gratitude to classmate",
        "Child reflects on positive game experiences",
        "Child participates in community building",
        "Child shows appreciation for others",
      ],
      extensions: [
        "Write thank you notes to game partners",
        "Create gratitude journal for game experiences",
        "Continue gratitude practice in other activities",
        "Invite families to share what they're grateful for",
      ],
      tips: [
        "Model specific, genuine gratitude",
        "Help shy children find words",
        "Keep atmosphere warm and supportive",
        "Connect gratitude to friendship building",
      ],
      vocabulary: ["thankful", "grateful", "appreciate", "friend", "kind", "helpful", "community"],
      safety: ["Create emotionally safe environment", "Ensure all children are included in gratitude"],
    },
  },
}

export default async function GamesActivityPage({ params }: { params: Promise<{ week: string; activity: string }> }) {
  const { week, activity: activitySlug } = await params
  const weekData = activityData[week as keyof typeof activityData]
  if (!weekData) navigate("/404")

  const activity = weekData[activitySlug as keyof typeof weekData]
  if (!activity) navigate("/404")

  // Type assertion to help TypeScript understand the structure
  const typedActivity = activity as {
    title: string
    duration: string
    type: string
    participants: string
    materials: string[]
    objectives: string[]
    preparation: string[]
    instructions: string[]
    assessment: string[]
    extensions: string[]
    tips: string[]
    vocabulary: string[]
    safety: string[]
  }

  const weekNumber = week.replace("week", "")
  const weekColors = {
    "1": "pink",
    "2": "amber",
    "3": "blue",
    "4": "emerald",
    "5": "indigo",
  }
  const color = weekColors[weekNumber as keyof typeof weekColors] || "purple"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" asChild className="mb-4 bg-transparent">
          <Link to="/curriculum/kindergarten/activities/games-unit">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Games Unit Activities
          </Link>
        </Button>

        <div className={`bg-${color}-50 border border-${color}-200 p-4 rounded-lg mb-6`}>
          <h1 className={`text-3xl font-bold text-${color}-700 mb-2`}>{typedActivity.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{typedActivity.duration}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{typedActivity.participants}</span>
            </div>
            <Badge className={`bg-${color}-100 text-${color}-700`}>{typedActivity.type}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {typedActivity.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className={`h-4 w-4 mr-2 mt-0.5 text-${color}-500 flex-shrink-0`} />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                Preparation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {typedActivity.preparation.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className={`w-2 h-2 rounded-full bg-${color}-400 mr-3 mt-2 flex-shrink-0`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Step-by-Step Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {typedActivity.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start">
                    <div
                      className={`w-6 h-6 rounded-full bg-${color}-100 text-${color}-700 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0 mt-0.5`}
                    >
                      {index + 1}
                    </div>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Materials Needed</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {typedActivity.materials.map((material, index) => (
                  <li key={index} className="flex items-center">
                    <div className={`w-2 h-2 rounded-full bg-${color}-400 mr-3`} />
                    <span>{material}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {typedActivity.assessment.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className={`h-4 w-4 mr-2 mt-0.5 text-${color}-500 flex-shrink-0`} />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Vocabulary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {typedActivity.vocabulary.map((word, index) => (
                  <Badge key={index} variant="outline" className={`text-${color}-700 border-${color}-300`}>
                    {word}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {typedActivity.safety && typedActivity.safety.length > 0 && (
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-700">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Safety Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {typedActivity.safety.map((note, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-orange-400 mr-3 mt-2 flex-shrink-0" />
                      <span className="text-sm">{note}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Separator className="my-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              Teaching Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {typedActivity.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <div className={`bg-${color}-100 p-1 rounded-full mr-2 mt-0.5`}>
                    <Gamepad2 className={`h-3 w-3 text-${color}-600`} />
                  </div>
                  <span className="text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ArrowRight className="h-5 w-5 mr-2" />
              Extensions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {typedActivity.extensions.map((extension, index) => (
                <li key={index} className="flex items-start">
                  <div className={`bg-${color}-100 p-1 rounded-full mr-2 mt-0.5`}>
                    <Heart className={`h-3 w-3 text-${color}-600`} />
                  </div>
                  <span className="text-sm">{extension}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" asChild>
          <Link to="/curriculum/kindergarten/activities/games-unit">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Activities
          </Link>
        </Button>
        <Button className={`bg-${color}-600 hover:bg-${color}-700`} asChild>
          <Link to="/curriculum/kindergarten/activities/games-unit">
            <ArrowRight className="h-4 w-4 ml-2" />
            Next Activity
          </Link>
        </Button>
      </div>
    </div>
  )
}
