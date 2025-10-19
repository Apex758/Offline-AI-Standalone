'use client';

import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  Image as ImageIcon, 
  FileText, 
  Palette, 
  Eye,
  Theater, 
  Blocks, 
  Music, 
  Baby, 
  Calendar, 
  Heart, 
  Image as ImageIcon2, 
  BookOpenCheck, 
  Camera, 
  Building2,
  PartyPopper,
  Scissors,
  Shirt,
  Drum,
  Headphones,
  Utensils,
  Flag,
  Video,
  Cake,
  ChefHat,
  CalendarDays,
  ListOrdered,
  MessageSquare,
  Cloud,
  CloudRain,
  Thermometer,
  Wind,
  Droplets,
  CloudSnow,
  SprayCan,
  Umbrella,
  Music2,
  Flashlight,
  BookOpenText,
  VideoIcon,
  Paintbrush,
  Calendar as CalendarIcon,
  Circle,
  Gamepad2,
  Dice1,
  Hash,
  CircleDot,
  Circle as Circle2,
  BookOpenCheck as BookOpenCheck2,
  Music3,
  Timer,
  Trophy,
  Square,
  ClipboardList,
  FileSpreadsheet,
  Leaf,
  Sprout,
  Flower,
  Image as ImageIcon3,
  Search,
  Bug,
  Sprout as Sprout2,
  Backpack,
  BookOpenCheck as BookOpenCheck3,
  Volume2,
  Table2,
  Pencil,
  Film,
  Gift,
  Container
} from 'lucide-react';

interface Resource {
  name: string;
  description: string;
  url?: string;
  tags?: string[];
}

const unitResources: Record<string, Resource[]> = {
  belonging: [
    {
      name: 'Storybooks',
      description: 'Age-appropriate picture books that introduce and explore key concepts related to the unit theme. They help build vocabulary, comprehension, and curiosity while connecting real-world ideas to classroom discussions.',
      tags: ['literacy', 'diversity', 'identity']
    },
    {
      name: 'Puppets',
      description: 'Soft or hand-held puppets used in storytelling, social-emotional learning, and role-playing. Puppets support expressive language, build confidence, and help children explore different perspectives.',
      tags: ['dramatic play', 'literacy']
    },
    {
      name: 'Family Photos',
      description: 'Photographs brought from home or provided by teachers to represent children\'s families. They foster a sense of identity, belonging, and open discussions about family diversity.',
      tags: ['family', 'discussion']
    },
    {
      name: 'Name Cards',
      description: 'Personalized cards with each student\'s name, used during literacy centers and group activities to support name recognition, early reading, and classroom routines.',
      tags: ['literacy', 'identity']
    },
    {
      name: 'Art Materials',
      description: 'Used in weather-themed crafts like making cloud collages or rain paintings. Encourages creativity and thematic expression.',
      tags: ['art', 'creativity']
    },
    {
      name: 'Mirrors',
      description: 'Small handheld or wall mirrors used for self-reflection activities, such as drawing self-portraits or observing facial expressions during emotional learning sessions.',
      tags: ['self-awareness']
    },
    {
      name: 'Dramatic Play Materials',
      description: 'Props like toy kitchen sets, costumes, or household items that allow children to act out scenarios. Supports creativity, role-play, and social learning.',
      tags: ['dramatic play', 'social skills']
    },
    {
      name: 'Blocks and Construction Sets',
      description: 'Wooden or plastic interlocking pieces used to build structures. Reinforces spatial awareness, problem-solving, and collaborative skills during themed projects.',
      tags: ['construction', 'spatial awareness']
    },
    {
      name: 'Music and Instruments',
      description: 'Classroom-friendly instruments (tambourines, shakers, drums) used to explore rhythm, celebrate cultural traditions, or enhance movement activities.',
      tags: ['music', 'movement']
    },
    {
      name: 'Multicultural Dolls',
      description: 'Diverse dolls representing various ethnic backgrounds to promote inclusion, respect, and cultural awareness during play and social activities.',
      tags: ['diversity', 'social skills']
    },
    {
      name: 'Visual Schedule',
      description: 'A pictorial representation of the daily classroom routine. Helps young learners understand time, expectations, and transitions throughout the school day.',
      tags: ['organization', 'routines']
    },
    {
      name: 'Emotion Cards',
      description: 'Visual prompts showing different facial expressions and feelings. Used in SEL lessons to help students identify, name, and talk about emotions.',
      tags: ['social-emotional', 'discussion']
    },
    {
      name: 'Charts and Posters',
      description: 'Visual aids such as family trees, classroom rules, or unit-themed displays that reinforce key concepts and structure classroom learning.',
      tags: ['visual aids']
    },
    {
      name: 'Digital Camera or Tablet',
      description: 'Used to document student learning, take pictures of activities, and display visual records to strengthen identity and recall of past learning.',
      tags: ['technology', 'documentation']
    },
    {
      name: 'Books on Community Helpers',
      description: 'Books that introduce children to occupations and roles within their community. Supports understanding of interdependence and civic awareness.',
      tags: ['literacy', 'community']
    }
  ],
  celebrations: [
    {
      name: 'Storybooks',
      description: 'Age-appropriate picture books that introduce and explore key concepts related to the unit theme. They help build vocabulary, comprehension, and curiosity while connecting real-world ideas to classroom discussions.',
      tags: ['literacy', 'traditions']
    },
    {
      name: 'Photographs of Family Celebrations',
      description: 'Photos of students\' family events or cultural traditions. Encourages sharing, storytelling, and appreciation of diversity in celebrations.',
      tags: ['family', 'discussion']
    },
    {
      name: 'Art Supplies',
      description: 'Expanded materials including glitter, stickers, and stencils for more decorative or expressive artwork related to celebration themes.',
      tags: ['art', 'creativity']
    },
    {
      name: 'Birthday Party Materials',
      description: 'Decorative items like hats, candles (fake), and streamers to support role-playing and learning about birthday customs.',
      tags: ['dramatic play']
    },
    {
      name: 'Dress-Up Clothes',
      description: 'Costumes representing various cultures or celebration roles (e.g., chef, bride, dancer) used in pretend play and cultural exploration.',
      tags: ['dramatic play']
    },
    {
      name: 'Musical Instruments',
      description: 'Percussion or rhythm instruments used to explore celebration music from different cultures and enhance movement activities.',
      tags: ['music', 'culture']
    },
    {
      name: 'Audio Recordings',
      description: 'Pre-recorded songs or sounds linked to celebrations or traditions around the world. Used to introduce culture-specific soundscapes.',
      tags: ['music', 'culture']
    },
    {
      name: 'Photos of Traditional Foods',
      description: 'Images of celebration meals from different cultures, used to compare traditions and inspire discussions or dramatic play.',
      tags: ['culture', 'discussion']
    },
    {
      name: 'Flags/Symbols',
      description: 'Printed or physical items representing cultural heritage or countries. Helps build cultural literacy and promote identity awareness.',
      tags: ['culture', 'diversity']
    },
    {
      name: 'Video Clips of Celebrations',
      description: 'Short videos showing how different people celebrate special occasions. Used to visually connect classroom lessons to real-life traditions.',
      tags: ['culture', 'visual aids']
    },
    {
      name: 'Birthday Chart',
      description: 'Class display tracking each child\'s birthday. Builds a sense of community and makes every child feel valued and included.',
      tags: ['organization']
    },
    {
      name: 'Recipe Cards or Props',
      description: 'Role-play or printed materials that simulate cooking activities and support vocabulary development and sequencing.',
      tags: ['dramatic play']
    },
    {
      name: 'Calendar',
      description: 'Used daily to reinforce time concepts and track holidays, celebrations, and weather changes relevant to unit themes.',
      tags: ['time', 'organization']
    },
    {
      name: 'Story Sequence Cards',
      description: 'Illustrated cards representing steps in a process or story. Helps children build narrative skills and understand sequencing.',
      tags: ['literacy', 'sequencing']
    },
    {
      name: 'Greeting Cards',
      description: 'Cards children make or explore to learn about writing messages, giving, and communication during special occasions.',
      tags: ['literacy', 'social skills']
    }
  ],
  weather: [
    {
      name: 'Storybooks',
      description: 'Age-appropriate picture books that introduce and explore key concepts related to the unit theme. They help build vocabulary, comprehension, and curiosity while connecting real-world ideas to classroom discussions.',
      tags: ['literacy', 'science']
    },
    {
      name: 'Weather Chart',
      description: 'A chart where students track daily weather, supporting science observation, graphing, and pattern recognition.',
      tags: ['science', 'observation']
    },
    {
      name: 'Weather Symbols',
      description: 'Icons for sunny, rainy, cloudy, etc., used with the weather chart or sorting games to help children identify and categorize weather conditions.',
      tags: ['visual aids']
    },
    {
      name: 'Thermometer',
      description: 'A real or toy thermometer used to explore temperature and observe weather-related changes.',
      tags: ['science', 'measurement']
    },
    {
      name: 'Windsock or Pinwheel',
      description: 'Lightweight objects that move with the wind, used to observe wind speed and direction outdoors.',
      tags: ['science', 'observation']
    },
    {
      name: 'Rain Gauge',
      description: 'A container to collect rain, used to introduce measurement and observation in a real-world weather context.',
      tags: ['science', 'measurement']
    },
    {
      name: 'Cotton Balls',
      description: 'Used in sensory bins or crafts to represent clouds or snow, encouraging creativity and texture exploration.',
      tags: ['art', 'science']
    },
    {
      name: 'Spray Bottle',
      description: 'Filled with water to simulate rainfall during experiments or art projects. Enhances sensory and science learning.',
      tags: ['science', 'simulation']
    },
    {
      name: 'Umbrella, Raincoat, Boots',
      description: 'Props for dressing up in weather-related clothing, reinforcing weather vocabulary and personal preparedness.',
      tags: ['dramatic play']
    },
    {
      name: 'Weather Songs',
      description: 'Songs with lyrics and movements that describe weather conditions, promoting language and kinesthetic learning.',
      tags: ['music', 'science']
    },
    {
      name: 'Flashlight',
      description: 'Used in activities to simulate sunlight or explore shadows during weather and light-related lessons.',
      tags: ['science', 'simulation']
    },
    {
      name: 'Science Journals',
      description: 'Simple notebooks or booklets where students draw and write about observations, experiments, or outdoor weather studies.',
      tags: ['science', 'documentation']
    },
    {
      name: 'Videos/Animations',
      description: 'Visual resources that explain weather concepts in an age-appropriate, engaging way.',
      tags: ['science', 'visual aids']
    },
    {
      name: 'Art Materials',
      description: 'Used in weather-themed crafts like making cloud collages or rain paintings. Encourages creativity and thematic expression.',
      tags: ['art', 'creativity']
    },
    {
      name: 'Calendar',
      description: 'Used daily to reinforce time concepts and track holidays, celebrations, and weather changes relevant to unit themes.',
      tags: ['science', 'organization']
    }
  ],
  games: [
    {
      name: 'Outdoor Play Equipment',
      description: 'Includes balls, ropes, cones, and other tools for physical games that promote gross motor development and teamwork.',
      tags: ['physical', 'outdoor']
    },
    {
      name: 'Board Games',
      description: 'Games like Candy Land or Snakes and Ladders that teach rule-following, number recognition, and social interaction.',
      tags: ['games', 'math']
    },
    {
      name: 'Dice and Spinners',
      description: 'Used to teach counting, probability, and turn-taking in both physical and table-top games.',
      tags: ['math', 'games']
    },
    {
      name: 'Number Cards',
      description: 'Cards with printed numerals used in matching, ordering, and simple math games.',
      tags: ['math', 'games']
    },
    {
      name: 'Beanbags',
      description: 'Used in tossing or balancing games to develop hand-eye coordination and muscle control.',
      tags: ['physical', 'games']
    },
    {
      name: 'Hula Hoops',
      description: 'Used in movement and group games to develop spatial awareness and physical coordination.',
      tags: ['physical', 'games']
    },
    {
      name: 'Storybooks on Games',
      description: 'Books about children playing games or learning cooperation, used to introduce the concept of play in literature.',
      tags: ['literacy', 'games']
    },
    {
      name: 'Music/Songs for Movement',
      description: 'Songs with actions that encourage children to follow directions, move rhythmically, and build body awareness.',
      tags: ['music', 'movement']
    },
    {
      name: 'Timer or Stopwatch',
      description: 'Used to measure time in games, introducing early concepts of duration, fairness, and turn-taking.',
      tags: ['time', 'games']
    },
    {
      name: 'Dramatic Play Props',
      description: 'Items like medals, jerseys, or sports gear for imaginative play around competition and teamwork.',
      tags: ['dramatic play']
    },
    {
      name: 'Mats or Floor Markings',
      description: 'Used to define game spaces and ensure safety during indoor or outdoor play activities.',
      tags: ['organization']
    },
    {
      name: 'Chart Paper or Whiteboard',
      description: 'Used to co-create game rules with children or track scores and reflect on teamwork.',
      tags: ['organization']
    },
    {
      name: 'Printable Game Templates',
      description: 'Blank or example formats for board games that children can help create, personalizing learning through play.',
      tags: ['games', 'creativity']
    }
  ],
  plantsAndAnimals: [
    {
      name: 'Storybooks',
      description: 'Age-appropriate picture books that introduce and explore key concepts related to the unit theme. They help build vocabulary, comprehension, and curiosity while connecting real-world ideas to classroom discussions.',
      tags: ['literacy', 'science']
    },
    {
      name: 'Real Plants and Seeds',
      description: 'Living materials used for planting and growing experiments, teaching responsibility and observation skills.',
      tags: ['science', 'hands-on']
    },
    {
      name: 'Soil, Pots, Gardening Tools',
      description: 'Hands-on tools for planting and nurturing classroom plants, reinforcing care routines and scientific exploration.',
      tags: ['science', 'hands-on']
    },
    {
      name: 'Pictures of Plants and Animals',
      description: 'Visuals used for sorting, classification, and discussions about biodiversity.',
      tags: ['science', 'classification']
    },
    {
      name: 'Magnifying Glasses',
      description: 'Tools to observe insects, leaves, and small objects closely. Develops attention to detail and curiosity.',
      tags: ['science', 'observation']
    },
    {
      name: 'Insect or Animal Models',
      description: 'Plastic figures used for sorting, role-play, and storytelling related to animal traits or habitats.',
      tags: ['science', 'play']
    },
    {
      name: 'Watering Cans or Bottles',
      description: 'Used to care for class plants or simulate weather in dramatic play. Teaches responsibility and observation.',
      tags: ['science', 'care']
    },
    {
      name: 'Nature Walk Collection Bags',
      description: 'Small containers for gathering leaves, twigs, or rocks during outdoor learning walks.',
      tags: ['science', 'outdoor']
    },
    {
      name: 'Books on Animal Habitats',
      description: 'Nonfiction or storybooks introducing where animals live and how they survive. Supports vocabulary and environmental awareness.',
      tags: ['literacy', 'science']
    },
    {
      name: 'Animal Sounds Recordings',
      description: 'Audio clips used to identify animals by sound and engage listening skills.',
      tags: ['science', 'games']
    },
    {
      name: 'Charts and Sorting Mats',
      description: 'Tools for organizing and grouping objects or images by attribute during science or math centers.',
      tags: ['science', 'classification']
    },
    {
      name: 'Drawing and Writing Tools',
      description: 'Used for recording science observations, expressing understanding, or drawing life cycles and habitats.',
      tags: ['science', 'documentation']
    },
    {
      name: 'Videos on Growth/Behavior',
      description: 'Clips showing time-lapse plant growth or animal behavior in the wild. Supports inquiry-based learning.',
      tags: ['science', 'visual aids']
    },
    {
      name: 'Puppets or Soft Toys',
      description: 'Animal puppets used to tell stories or act out life cycle and habitat scenarios.',
      tags: ['science', 'interactive']
    },
    {
      name: 'Sensory Bins',
      description: 'Themed containers with materials like leaves, seeds, and soil for tactile and exploratory play.',
      tags: ['science', 'sensory']
    }
  ]
};

const getResourceIcon = (name: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'Storybooks': <BookOpen className="h-6 w-6" />,
    'Puppets': <Gift className="h-6 w-6" />,
    'Family Photos': <ImageIcon className="h-6 w-6" />,
    'Name Cards': <FileText className="h-6 w-6" />,
    'Art Materials': <Palette className="h-6 w-6" />,
    'Mirrors': <Eye className="h-6 w-6" />,
    'Dramatic Play Materials': <Theater className="h-6 w-6" />,
    'Blocks and Construction Sets': <Blocks className="h-6 w-6" />,
    'Music and Instruments': <Music className="h-6 w-6" />,
    'Multicultural Dolls': <Baby className="h-6 w-6" />,
    'Visual Schedule': <Calendar className="h-6 w-6" />,
    'Emotion Cards': <Heart className="h-6 w-6" />,
    'Charts and Posters': <ImageIcon2 className="h-6 w-6" />,
    'Digital Camera or Tablet': <Camera className="h-6 w-6" />,
    'Books on Community Helpers': <Building2 className="h-6 w-6" />,
    'Photographs of Family Celebrations': <PartyPopper className="h-6 w-6" />,
    'Art Supplies': <Scissors className="h-6 w-6" />,
    'Birthday Party Materials': <Cake className="h-6 w-6" />,
    'Dress-Up Clothes': <Shirt className="h-6 w-6" />,
    'Musical Instruments': <Drum className="h-6 w-6" />,
    'Audio Recordings': <Headphones className="h-6 w-6" />,
    'Photos of Traditional Foods': <Utensils className="h-6 w-6" />,
    'Flags/Symbols': <Flag className="h-6 w-6" />,
    'Video Clips of Celebrations': <Video className="h-6 w-6" />,
    'Birthday Chart': <CalendarDays className="h-6 w-6" />,
    'Recipe Cards or Props': <ChefHat className="h-6 w-6" />,
    'Calendar': <CalendarIcon className="h-6 w-6" />,
    'Story Sequence Cards': <ListOrdered className="h-6 w-6" />,
    'Greeting Cards': <MessageSquare className="h-6 w-6" />,
    'Weather Chart': <Cloud className="h-6 w-6" />,
    'Weather Symbols': <CloudRain className="h-6 w-6" />,
    'Thermometer': <Thermometer className="h-6 w-6" />,
    'Windsock or Pinwheel': <Wind className="h-6 w-6" />,
    'Rain Gauge': <Droplets className="h-6 w-6" />,
    'Cotton Balls': <CloudSnow className="h-6 w-6" />,
    'Spray Bottle': <SprayCan className="h-6 w-6" />,
    'Umbrella, Raincoat, Boots': <Umbrella className="h-6 w-6" />,
    'Weather Songs': <Music2 className="h-6 w-6" />,
    'Flashlight': <Flashlight className="h-6 w-6" />,
    'Science Journals': <BookOpenText className="h-6 w-6" />,
    'Videos/Animations': <VideoIcon className="h-6 w-6" />,
    'Outdoor Play Equipment': <Circle className="h-6 w-6" />,
    'Board Games': <Gamepad2 className="h-6 w-6" />,
    'Dice and Spinners': <Dice1 className="h-6 w-6" />,
    'Number Cards': <Hash className="h-6 w-6" />,
    'Beanbags': <CircleDot className="h-6 w-6" />,
    'Hula Hoops': <Circle2 className="h-6 w-6" />,
    'Storybooks on Games': <BookOpenCheck2 className="h-6 w-6" />,
    'Music/Songs for Movement': <Music3 className="h-6 w-6" />,
    'Timer or Stopwatch': <Timer className="h-6 w-6" />,
    'Dramatic Play Props': <Trophy className="h-6 w-6" />,
    'Mats or Floor Markings': <Square className="h-6 w-6" />,
    'Chart Paper or Whiteboard': <ClipboardList className="h-6 w-6" />,
    'Printable Game Templates': <FileSpreadsheet className="h-6 w-6" />,
    'Real Plants and Seeds': <Sprout className="h-6 w-6" />,
    'Soil, Pots, Gardening Tools': <Flower className="h-6 w-6" />,
    'Pictures of Plants and Animals': <ImageIcon3 className="h-6 w-6" />,
    'Magnifying Glasses': <Search className="h-6 w-6" />,
    'Insect or Animal Models': <Bug className="h-6 w-6" />,
    'Watering Cans or Bottles': <Sprout2 className="h-6 w-6" />,
    'Nature Walk Collection Bags': <Backpack className="h-6 w-6" />,
    'Books on Animal Habitats': <BookOpenCheck3 className="h-6 w-6" />,
    'Animal Sounds Recordings': <Volume2 className="h-6 w-6" />,
    'Charts and Sorting Mats': <Table2 className="h-6 w-6" />,
    'Drawing and Writing Tools': <Pencil className="h-6 w-6" />,
    'Videos on Growth/Behavior': <Film className="h-6 w-6" />,
    'Puppets or Soft Toys': <Gift className="h-6 w-6" />,
    'Sensory Bins': <Container className="h-6 w-6" />
  };
  return iconMap[name] || <BookOpen className="h-6 w-6" />;
};

const getUnitColor = (unit: string) => {
  const colorMap: Record<string, { from: string; to: string; text: string }> = {
    belonging: { from: 'from-blue-100', to: 'to-blue-50', text: 'text-blue-700' },
    celebrations: { from: 'from-purple-100', to: 'to-purple-50', text: 'text-purple-700' },
    weather: { from: 'from-cyan-100', to: 'to-cyan-50', text: 'text-cyan-700' },
    games: { from: 'from-amber-100', to: 'to-amber-50', text: 'text-amber-700' },
    plantsAndAnimals: { from: 'from-green-100', to: 'to-green-50', text: 'text-green-700' }
  };
  return colorMap[unit] || { from: 'from-gray-100', to: 'to-gray-50', text: 'text-gray-700' };
};

export default function KindergartenResourcesPage() {
  const [activeTab, setActiveTab] = useState('belonging');

  return (
    <div className="container mx-auto py-8">
      <Link to="/curriculum/kindergarten">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Kindergarten Curriculum
        </Button>
      </Link>

      <div className="w-full min-w-full max-w-[100vw] mb-8">
        <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-6 rounded-xl shadow-md">
          <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-yellow-600">
            Kindergarten Resources
          </h1>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
            A comprehensive collection of resources organized by thematic units to support teaching and learning in the kindergarten classroom.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-xl shadow-md border border-orange-100 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Resources Organization</h2>
        <p className="mb-4 text-gray-700">
          Each unit includes a dedicated resources section with teaching materials, books and media, activity templates,
          and parent resources to support comprehensive implementation of the curriculum.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-orange-700 mb-2">Teaching Materials</h3>
            <p className="text-sm">Lesson guides, printables, and assessment tools</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-orange-700 mb-2">Books and Media</h3>
            <p className="text-sm">Recommended literature and videos</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-orange-700 mb-2">Activity Templates</h3>
            <p className="text-sm">Frameworks for hands-on learning experiences</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-orange-700 mb-2">Parent Resources</h3>
            <p className="text-sm">Materials to extend learning at home</p>
          </div>
        </div>
        
        {/* Lesson Plan Creation Button */}
        <div className="mt-8 text-center">
          <Link to="/kindergarten-planner"><Button>
              <BookOpen className="mr-2 h-5 w-5" />
              Create Lesson Plan
            </Button></Link>
        </div>
      </div>

      <Tabs defaultValue="belonging" className="w-full mt-8">
        <TabsList className="grid w-full grid-cols-5 p-1 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl shadow-sm">
          <TabsTrigger 
            value="belonging" 
            className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm rounded-lg transition-all duration-200 hover:bg-blue-50"
          >
            <Users className="h-4 w-4 mr-2" />
            Belonging
          </TabsTrigger>
          <TabsTrigger 
            value="weather" 
            className="data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-700 data-[state=active]:shadow-sm rounded-lg transition-all duration-200 hover:bg-cyan-50"
          >
            <Cloud className="h-4 w-4 mr-2" />
            Weather
          </TabsTrigger>
          <TabsTrigger 
            value="celebrations" 
            className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:shadow-sm rounded-lg transition-all duration-200 hover:bg-purple-50"
          >
            <PartyPopper className="h-4 w-4 mr-2" />
            Celebrations
          </TabsTrigger>
          <TabsTrigger 
            value="plantsAndAnimals" 
            className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 data-[state=active]:shadow-sm rounded-lg transition-all duration-200 hover:bg-green-50"
          >
            <Leaf className="h-4 w-4 mr-2" />
            Plants & Animals
          </TabsTrigger>
          <TabsTrigger 
            value="games" 
            className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 data-[state=active]:shadow-sm rounded-lg transition-all duration-200 hover:bg-amber-50"
          >
            <Gamepad2 className="h-4 w-4 mr-2" />
            Games
          </TabsTrigger>
        </TabsList>

        {Object.entries(unitResources).map(([unit, resources]) => (
          <TabsContent key={unit} value={unit} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, index) => {
                const colors = getUnitColor(unit);
                return (
                  <Card 
                    key={index} 
                    className={`hover:shadow-lg transition-all duration-300 border-t-4 border-${colors.text.split('-')[1]}-500 hover:-translate-y-1`}
                  >
                    <CardHeader className={`bg-gradient-to-br ${colors.from} ${colors.to} pb-2`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-white/80 ${colors.text}`}>
                          {getResourceIcon(resource.name)}
                        </div>
                        <div>
                          <CardTitle className={colors.text}>{resource.name}</CardTitle>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {resource.tags?.map((tag, tagIndex) => (
                              <Badge 
                                key={tagIndex} 
                                variant="secondary"
                                className={`bg-white/80 ${colors.text}`}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <CardDescription className="text-gray-600">{resource.description}</CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 