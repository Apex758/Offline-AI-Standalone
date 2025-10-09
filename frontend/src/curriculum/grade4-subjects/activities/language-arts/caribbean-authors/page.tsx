import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Clock, Users, Target, CheckSquare, Lightbulb } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { FallbackImage } from "@/components/fallback-image"

export default function CaribbeanAuthorsPage() {
  return (
    <div className="container mx-auto py-8">
      
      <Link href="/curriculum/grade4-subjects/activities/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Language Arts Activities
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-100 to-teal-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-blue-700">Caribbean Authors Study</h1>
          <p className="text-gray-700">
            Students explore works by Caribbean authors, analyzing themes, language use, and cultural connections while
            developing appreciation for regional literature and strengthening their cultural identity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                This activity introduces Grade 4 students to the rich literary heritage of the Caribbean through an
                exploration of local and regional authors. Students will read, analyze, and respond to a variety of
                texts by Caribbean writers, identifying common themes, cultural elements, and language features. The
                study helps students connect literature to their own experiences while developing reading comprehension,
                critical thinking, and cultural awareness.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  <span>
                    <strong>Duration:</strong> 2-3 weeks (multiple sessions)
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  <span>
                    <strong>Group Size:</strong> Whole class and small groups
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  <strong>Learning Objectives:</strong>
                </div>
                <ul className="list-disc pl-8 space-y-1">
                  <li>Recognize and appreciate Caribbean literature and its cultural significance</li>
                  <li>Analyze cultural themes, settings, and perspectives in Caribbean texts</li>
                  <li>Compare writing styles and techniques across different Caribbean authors</li>
                  <li>Make text-to-self connections between literature and personal experiences</li>
                  <li>Identify how language (including Home Language) is used in Caribbean literature</li>
                  <li>Develop pride in Caribbean literary heritage and cultural identity</li>
                </ul>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <CheckSquare className="h-5 w-5 mr-2 text-blue-600" />
                  <strong>Curriculum Connections:</strong>
                </div>
                <ul className="list-disc pl-8 space-y-1">
                  <li>
                    <strong>Reading & Viewing:</strong> Apply comprehension strategies to analyze and respond to a
                    variety of texts
                  </li>
                  <li>
                    <strong>Reading & Viewing:</strong> Make connections between texts and personal experiences
                  </li>
                  <li>
                    <strong>Listening & Speaking:</strong> Discuss texts and share personal responses in group settings
                  </li>
                  <li>
                    <strong>Writing & Representing:</strong> Create written and visual responses to literature
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <Lightbulb className="h-5 w-5 mr-2 text-blue-600" />
                  <strong>Materials Needed:</strong>
                </div>
                <ul className="list-disc pl-8 space-y-1">
                  <li>Collection of books, stories, and poems by Caribbean authors</li>
                  <li>Author information cards or digital profiles</li>
                  <li>Reading response journals</li>
                  <li>Caribbean map for tracking authors' countries of origin</li>
                  <li>Graphic organizers for text analysis</li>
                  <li>Art supplies for creative response activities</li>
                  <li>Digital resources about Caribbean authors and their works</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
              <FallbackImage
                src="/caribbean-childrens-books.png"
                alt="Collection of Caribbean children's books"
                fallbackSrc="/placeholder.svg?height=200&width=400&query=Caribbean+childrens+books"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-600 italic">
                A collection of books by Caribbean authors provides students with authentic regional literature that
                reflects their cultural heritage.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Teacher Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>
                  <strong className="text-blue-700">Build Your Collection:</strong> Gather a diverse range of Caribbean
                  literature representing different islands, themes, and genres.
                </li>
                <li>
                  <strong className="text-blue-700">Author Connections:</strong> If possible, arrange virtual or
                  in-person visits with local authors to make the experience more meaningful.
                </li>
                <li>
                  <strong className="text-blue-700">Cultural Context:</strong> Provide background information about the
                  cultural, historical, and geographical contexts of the literature.
                </li>
                <li>
                  <strong className="text-blue-700">Language Appreciation:</strong> Celebrate the use of Caribbean
                  dialects and Home Language in texts, discussing how they enhance the storytelling.
                </li>
                <li>
                  <strong className="text-blue-700">Community Involvement:</strong> Invite family members to share their
                  favorite Caribbean stories or participate in reading events.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Implementation Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-blue-700">Week 1: Introduction to Caribbean Literature</h3>
              <ol className="list-decimal pl-8 space-y-2">
                <li>
                  <strong>Introduction (1 session):</strong> Present the concept of Caribbean literature and its
                  importance. Show a map of the Caribbean and discuss the diversity of cultures and languages in the
                  region.
                </li>
                <li>
                  <strong>Author Showcase (1 session):</strong> Introduce 5-6 Caribbean authors through brief
                  biographies, photos, and examples of their work. Create an author wall in the classroom.
                </li>
                <li>
                  <strong>Read Aloud (2-3 sessions):</strong> Read selected stories or poems by Caribbean authors to the
                  whole class, discussing themes, settings, characters, and language use.
                </li>
                <li>
                  <strong>Text Exploration (1-2 sessions):</strong> Set up reading stations with different Caribbean
                  texts for students to explore in small groups, using guiding questions to focus their reading.
                </li>
                <li>
                  <strong>Reading Selection:</strong> Students select a Caribbean book or story for independent or
                  partner reading over the next week.
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-blue-700">Week 2: Deep Reading and Analysis</h3>
              <ol className="list-decimal pl-8 space-y-2">
                <li>
                  <strong>Independent/Partner Reading (ongoing):</strong> Students read their selected texts during
                  reading time, completing response activities in their journals.
                </li>
                <li>
                  <strong>Theme Analysis (1 session):</strong> Identify and discuss common themes in Caribbean
                  literature (e.g., family, nature, community, identity, heritage) using examples from texts.
                </li>
                <li>
                  <strong>Language Focus (1 session):</strong> Explore how Caribbean authors use language, including
                  dialect, Home Language expressions, and descriptive language that reflects the region.
                </li>
                <li>
                  <strong>Cultural Connections (1 session):</strong> Discuss cultural elements in the texts (food,
                  celebrations, traditions, values) and how they connect to students' own experiences.
                </li>
                <li>
                  <strong>Author Comparison (1 session):</strong> Compare writing styles, themes, and techniques of
                  different Caribbean authors using a graphic organizer.
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-blue-700">Week 3: Creative Response and Sharing</h3>
              <ol className="list-decimal pl-8 space-y-2">
                <li>
                  <strong>Book Talks (1-2 sessions):</strong> Students share their selected books with the class,
                  discussing what they enjoyed and learned about Caribbean culture.
                </li>
                <li>
                  <strong>Creative Response (2 sessions):</strong> Students create a response project based on their
                  reading (options: illustrated book review, character portrait, setting diorama, poem inspired by the
                  author's style, etc.).
                </li>
                <li>
                  <strong>Author Inspiration (1 session):</strong> Students write their own short stories or poems
                  inspired by Caribbean authors, incorporating elements of their own cultural experiences.
                </li>
                <li>
                  <strong>Caribbean Literature Celebration (1 session):</strong> Host a celebration where students share
                  their creative projects, read excerpts from favorite texts, and enjoy Caribbean-inspired refreshments.
                </li>
                <li>
                  <strong>Reflection (1 session):</strong> Students reflect on what they've learned about Caribbean
                  literature and how it connects to their own lives and cultural identity.
                </li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Assessment Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-blue-700">Formative Assessment</h3>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Observation of student engagement during read-alouds and discussions</li>
                  <li>Review of reading response journal entries</li>
                  <li>Participation in small group discussions about texts</li>
                  <li>Completion of graphic organizers for text analysis</li>
                  <li>Informal reading conferences about selected books</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-blue-700">Summative Assessment</h3>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Book talk presentation about a Caribbean author or text</li>
                  <li>Creative response project demonstrating understanding of the literature</li>
                  <li>Written analysis comparing two Caribbean authors or texts</li>
                  <li>Original writing inspired by Caribbean literature</li>
                  <li>Final reflection on learning about Caribbean literature</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-blue-700">Assessment Criteria</h3>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Identification of themes and cultural elements in Caribbean texts</li>
                  <li>Understanding of how authors use language to convey meaning and culture</li>
                  <li>Ability to make connections between texts and personal experiences</li>
                  <li>Thoughtful response to literature through discussion and creative projects</li>
                  <li>Recognition of the value and importance of Caribbean literary heritage</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Differentiation Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-blue-700">For Students Needing Additional Support</h3>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Provide texts at appropriate reading levels or with audio support</li>
                  <li>Pre-teach vocabulary and cultural references that may be unfamiliar</li>
                  <li>Offer simplified graphic organizers for text analysis</li>
                  <li>Allow for oral responses instead of written when appropriate</li>
                  <li>Provide additional visual supports for understanding cultural contexts</li>
                  <li>Partner with more confident readers for shared reading experiences</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-blue-700">For Students Needing Extension</h3>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Offer more complex texts by Caribbean authors</li>
                  <li>Encourage deeper research into authors' backgrounds and literary significance</li>
                  <li>Assign comparative analysis of multiple texts or authors</li>
                  <li>Challenge students to identify literary devices and advanced writing techniques</li>
                  <li>Facilitate independent author study projects</li>
                  <li>Encourage creation of more sophisticated original writing inspired by Caribbean authors</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-blue-700">Cultural Relevance</h3>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Select texts that reflect the diversity of Caribbean cultures and experiences</li>
                  <li>Highlight connections between literature and local traditions, foods, and celebrations</li>
                  <li>Value and discuss the use of Home Language in Caribbean literature</li>
                  <li>Invite family and community members to share their knowledge of Caribbean stories</li>
                  <li>Connect historical and cultural contexts to help students understand the literature</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Extensions and Variations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-blue-700 mb-2">Cross-Curricular Connections</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Social Studies:</strong> Explore the historical and geographical contexts of Caribbean
                  literature
                </li>
                <li>
                  <strong>Visual Arts:</strong> Create artwork inspired by Caribbean settings and stories
                </li>
                <li>
                  <strong>Music:</strong> Connect Caribbean literature to regional music traditions and songs
                </li>
                <li>
                  <strong>Science:</strong> Investigate natural environments described in Caribbean literature
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-blue-700 mb-2">Activity Variations</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Caribbean Author Festival:</strong> Expand the celebration to include multiple classes or the
                  whole school
                </li>
                <li>
                  <strong>Digital Author Profiles:</strong> Create multimedia presentations about Caribbean authors
                </li>
                <li>
                  <strong>Readers Theater:</strong> Perform dramatic readings of Caribbean stories or poems
                </li>
                <li>
                  <strong>Caribbean Literature Pen Pals:</strong> Connect with another class to share responses to the
                  same Caribbean texts
                </li>
                <li>
                  <strong>Author Interview Project:</strong> Research and create imagined interviews with Caribbean
                  authors
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Recommended Caribbean Authors and Books</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">Picture Books and Short Stories</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>"The Cay"</strong> by Theodore Taylor - Adventure story set in the Caribbean during World War II
              </li>
              <li>
                <strong>"Escape from Silk Cotton Forest"</strong> by Francis Keane - Caribbean folklore and adventure
              </li>
              <li>
                <strong>"Island Princess in Brooklyn"</strong> by Diane Browne - Story about cultural identity and
                adaptation
              </li>
              <li>
                <strong>"The Secret of Blackrock Cove"</strong> by Joanne Siewcharran - Mystery set in Trinidad
              </li>
              <li>
                <strong>"All the Way to Morning"</strong> by Denise Laidler - Collection of Caribbean stories
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">Poetry and Folk Tales</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>"A Caribbean Dozen"</strong> edited by John Agard and Grace Nichols - Poetry collection
              </li>
              <li>
                <strong>"The Turtle and the Island"</strong> by Barbara Ker Wilson - Folk tale from Papua New Guinea
              </li>
              <li>
                <strong>"Anancy and the Christmas 'Bimmer'"</strong> by Ladoo Chetram - Modern Anancy story
              </li>
              <li>
                <strong>"Caribbean Alphabet"</strong> by Frane Lessac - Illustrated alphabet book featuring Caribbean
                culture
              </li>
              <li>
                <strong>"The Singing Chef"</strong> by Pamela Mordecai - Collection of food-themed poems
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">Notable Caribbean Authors</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Olive Senior</strong> - Jamaican poet and short story writer
              </li>
              <li>
                <strong>Lynn Joseph</strong> - Trinidad-born author of children's books
              </li>
              <li>
                <strong>Diane Browne</strong> - Jamaican children's author
              </li>
              <li>
                <strong>James Berry</strong> - Jamaican poet
              </li>
              <li>
                <strong>Grace Nichols</strong> - Guyanese poet
              </li>
              <li>
                <strong>John Agard</strong> - Guyanese poet and playwright
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">Resources for Teachers</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Caribbean Literature Digital Library (online resource)</li>
              <li>Teaching Caribbean Literature in Elementary Classrooms (teacher guide)</li>
              <li>Caribbean Children's Literature Database</li>
              <li>Author websites and social media pages</li>
              <li>Local libraries with Caribbean literature collections</li>
              <li>Caribbean cultural centers and organizations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
