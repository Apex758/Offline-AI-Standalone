import { Breadcrumb } from "@/components/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Download, FileText, Video, ChevronLeft, FileImage, Music, Palette } from "lucide-react"
import { Link } from "react-router-dom"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag

export default function CelebrationsResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-2 mb-4">
        <Link to="/curriculum/kindergarten/celebrations">
          <Button variant="outline" className="mb-2">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Celebrations Unit
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-amber-700">Celebrations Unit Resources</h1>
        <p className="text-lg mb-6">
          This page provides comprehensive resources for teaching the Kindergarten Celebrations unit, including books,
          printables, videos, and activity ideas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <img src="/kindergarten-family-celebration.png" alt="Family celebration" className="w-auto h-auto" />
        <img src="/kindergarten-cultural-celebration.png" alt="Cultural celebration" className="w-auto h-auto" />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-amber-700 flex items-center">
          <BookOpen className="mr-2 h-6 w-6" /> Books for the Celebrations Unit
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-amber-200">
            <CardHeader className="bg-amber-50 border-b border-amber-100">
              <CardTitle className="text-amber-700">Religious Celebrations</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                <li>"Binny's Diwali" by Thrity Umrigar</li>
                <li>"The Christmas Story" (various versions)</li>
                <li>"It's Ramadan and Eid Al-Fitr!" by Richard Sebra</li>
                <li>"The Runaway Rice Cake" by Ying Chang Compestine</li>
                <li>"Hanukkah Bear" by Eric A. Kimmel</li>
              </ul>
              <Button variant="outline" className="mt-4 w-full border-amber-500 text-amber-700 hover:bg-amber-50">
                <Download className="mr-2 h-4 w-4" /> Religious Celebrations Book List
              </Button>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader className="bg-amber-50 border-b border-amber-100">
              <CardTitle className="text-amber-700">National Celebrations</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                <li>"Caribbean Carnival" by Jillian Powell</li>
                <li>"To Carnival!: A Celebration in St Lucia" by Baptiste Paul</li>
                <li>"Jump Up! A Story of Carnival" by Ken Wilson-Max</li>
                <li>"Ninny at Carnival" by Grace Hallworth</li>
                <li>"The Chinese New Year Story" (various versions)</li>
              </ul>
              <Button variant="outline" className="mt-4 w-full border-amber-500 text-amber-700 hover:bg-amber-50">
                <Download className="mr-2 h-4 w-4" /> National Celebrations Book List
              </Button>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader className="bg-amber-50 border-b border-amber-100">
              <CardTitle className="text-amber-700">Family Celebrations</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                <li>"Happy Birthday Cupcake" by Terry Border</li>
                <li>"Clifford's Birthday Party" by Norman Bridwell</li>
                <li>"Maisy Goes to a Wedding" by Lucy Cousins</li>
                <li>"The Ring Bearer" by Floyd Cooper</li>
                <li>"Bear Stays Up for Christmas" by Karma Wilson</li>
              </ul>
              <Button variant="outline" className="mt-4 w-full border-amber-500 text-amber-700 hover:bg-amber-50">
                <Download className="mr-2 h-4 w-4" /> Family Celebrations Book List
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-amber-700 flex items-center">
          <FileText className="mr-2 h-6 w-6" /> Printable Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-amber-200">
            <CardHeader className="bg-amber-50 border-b border-amber-100">
              <CardTitle className="text-amber-700">Classroom Materials</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                <li>KWL Chart Template for Celebrations</li>
                <li>Celebration Picture Cards for Sorting</li>
                <li>Religious vs. National Celebrations Sorting Cards</li>
                <li>Celebration Vocabulary Word Cards</li>
                <li>Celebration Pictograph Templates</li>
                <li>Carnival Mask Templates</li>
              </ul>
              <Button variant="outline" className="mt-4 w-full border-amber-500 text-amber-700 hover:bg-amber-50">
                <Download className="mr-2 h-4 w-4" /> Classroom Materials Pack
              </Button>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader className="bg-amber-50 border-b border-amber-100">
              <CardTitle className="text-amber-700">Student Activities</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                <li>My Favorite Celebration Postcard Template</li>
                <li>Celebration Scrapbook Pages</li>
                <li>Diwali Coloring Pages</li>
                <li>Carnival Costume Design Sheets</li>
                <li>Celebration Pattern Activities</li>
                <li>Guest Speaker Response Sheet</li>
              </ul>
              <Button variant="outline" className="mt-4 w-full border-amber-500 text-amber-700 hover:bg-amber-50">
                <Download className="mr-2 h-4 w-4" /> Student Activities Pack
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-amber-700 flex items-center">
          <Video className="mr-2 h-6 w-6" /> Video Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-amber-200">
            <CardHeader className="bg-amber-50 border-b border-amber-100">
              <CardTitle className="text-amber-700">Read-Aloud Videos</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                <li>"Binny's Diwali" Read Aloud</li>
                <li>"Happy Birthday Cupcake" Read Aloud</li>
                <li>"Clifford's Birthday Party" Video</li>
                <li>"Bear Stays Up for Christmas" Read Aloud</li>
                <li>"The Ring Bearer" Read Aloud</li>
                <li>"To Carnival!" Read Aloud</li>
              </ul>
              <Button variant="outline" className="mt-4 w-full border-amber-500 text-amber-700 hover:bg-amber-50">
                <Download className="mr-2 h-4 w-4" /> Read-Aloud Video Links
              </Button>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader className="bg-amber-50 border-b border-amber-100">
              <CardTitle className="text-amber-700">Celebration Videos</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                <li>CarnivalParades</li>
                <li>Diwali Festival of Lights</li>
                <li>Mexican Quinceanera Celebrations</li>
                <li>Chinese New Year Celebrations</li>
                <li>Jab Jab and Short Knee Traditions</li>
                <li>Steel Pan Performances</li>
              </ul>
              <Button variant="outline" className="mt-4 w-full border-amber-500 text-amber-700 hover:bg-amber-50">
                <Download className="mr-2 h-4 w-4" /> Celebration Video Links
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-amber-700 flex items-center">
          <Palette className="mr-2 h-6 w-6" /> Activity Ideas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-amber-200">
            <CardHeader className="bg-amber-50 border-b border-amber-100">
              <CardTitle className="text-amber-700">Art & Craft Activities</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                <li>Diwali Diya Lamps (clay or paper)</li>
                <li>Carnival Masks</li>
                <li>Celebration Pattern Decorations</li>
                <li>Birthday Cards</li>
                <li>Family Celebration Collages</li>
              </ul>
              <Button variant="outline" className="mt-4 w-full border-amber-500 text-amber-700 hover:bg-amber-50">
                <Download className="mr-2 h-4 w-4" /> Art & Craft Instructions
              </Button>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader className="bg-amber-50 border-b border-amber-100">
              <CardTitle className="text-amber-700">Dramatic Play</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                <li>Birthday Party Dramatic Play Center</li>
                <li>Wedding Celebration Role Play</li>
                <li>Carnival Parade Dramatic Play</li>
                <li>Celebration Charades</li>
                <li>Family Celebration Reenactments</li>
              </ul>
              <Button variant="outline" className="mt-4 w-full border-amber-500 text-amber-700 hover:bg-amber-50">
                <Download className="mr-2 h-4 w-4" /> Dramatic Play Setup Guide
              </Button>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader className="bg-amber-50 border-b border-amber-100">
              <CardTitle className="text-amber-700">Learning Centers</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                <li>Celebration Sorting Center</li>
                <li>Celebration Vocabulary Center</li>
                <li>Celebration Counting & Graphing Center</li>
                <li>Celebration Pattern Center</li>
                <li>Celebration Book Corner</li>
              </ul>
              <Button variant="outline" className="mt-4 w-full border-amber-500 text-amber-700 hover:bg-amber-50">
                <Download className="mr-2 h-4 w-4" /> Learning Center Setup Guide
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-amber-700 flex items-center">
          <Music className="mr-2 h-6 w-6" /> Music Resources
        </h2>
        <Card className="border-amber-200">
          <CardHeader className="bg-amber-50 border-b border-amber-100">
            <CardTitle className="text-amber-700">Celebration Songs & Music</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-2">
              <li>Happy Birthday Songs (multiple languages)</li>
              <li>Carnival Music Selections</li>
              <li>Steel Pan Music</li>
              <li>Calypso and Soca Music (child-appropriate)</li>
              <li>Celebration Dance Music from Various Cultures</li>
              <li>Diwali Celebration Songs</li>
            </ul>
            <Button variant="outline" className="mt-4 w-full border-amber-500 text-amber-700 hover:bg-amber-50">
              <Download className="mr-2 h-4 w-4" /> Music Resource List
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-amber-700 flex items-center">
                          <FileImage className="mr-2 h-6 w-6" /> Visual Resources
        </h2>
        <Card className="border-amber-200">
          <CardHeader className="bg-amber-50 border-b border-amber-100">
            <CardTitle className="text-amber-700">Celebration Images</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <img src="/kindergarten-family-celebration.png" alt="Family celebration" className="w-auto h-auto" />
              <img src="/kindergarten-cultural-celebration.png" alt="Cultural celebration" className="w-auto h-auto" />
              <img src="/kindergarten-community-celebration.png" alt="Community celebration" className="w-auto h-auto" />
              <img src="/kindergarten-celebration-together.png" alt="Celebrating together" className="w-auto h-auto" />
            </div>
            <Button variant="outline" className="w-full border-amber-500 text-amber-700 hover:bg-amber-50">
              <Download className="mr-2 h-4 w-4" /> Full Image Collection
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link to="/curriculum/kindergarten/celebrations">Back to Celebrations Unit</Link>
        </Button>
        <Link to="/curriculum/kindergarten/celebrations/week-1"><Button>Start with Week 1</Button></Link>
      </div>
    </div>
  )
}
