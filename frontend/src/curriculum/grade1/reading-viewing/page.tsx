import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, BookOpen, Eye, BookMarked } from "lucide-react"

export default function ReadingViewingPage() {
  return (
    <div className="container mx-auto py-8">
      <Link href="/curriculum/grade1">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 1 Curriculum
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Reading and Viewing</h1>
        <p className="text-gray-600">
          Reading and viewing are meaning-making, problem solving activities that provide opportunities to interact with
          a wide range of written and visual text for a variety of purposes. Readers learn to integrate a variety of
          meaning, structure, vocabulary, and word solving strategies and skills as they develop thoughtful and critical
          understanding and insight into written or visual representations of text.
        </p>
      </div>

      <Tabs defaultValue="elo2" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="elo2" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            ELO 2: Selection & Engagement
          </TabsTrigger>
          <TabsTrigger value="elo3" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            ELO 3: Comprehension Strategies
          </TabsTrigger>
          <TabsTrigger value="elo4" className="flex items-center gap-2">
            <BookMarked className="h-4 w-4" />
            ELO 4: Author's Purpose & Style
          </TabsTrigger>
        </TabsList>

        <TabsContent value="elo2" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Essential Learning Outcome 2</CardTitle>
              <CardDescription>
                The learner will demonstrate a variety of ways to use background knowledge and interests to select and
                engage critically with a range of culturally diverse paper-based, visual, and digital texts for pleasure
                and personal growth.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-4">Grade One Expectations</h3>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="background">
                  <AccordionTrigger>Use Background knowledge and interests</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Connect background knowledge of common events, well known stories, poems, and songs to establish
                        a foundation of understanding, titles, pictures and some words and phrases.
                      </li>
                      <li>Make imaginative and real-life connections to their own experiences.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="select">
                  <AccordionTrigger>Select and engage critically with a range of texts for pleasure</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Choose books of interest for browsing and gathering meaning through illustrations.</li>
                      <li>Assist understanding by connecting text to background knowledge.</li>
                      <li>
                        Read independently, share, and explain reactions to texts by commenting on meaning and message.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="engage">
                  <AccordionTrigger>Engage critically with a range of texts for personal growth</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Further develop Concepts of Print and apply their functions.</li>
                      <li>
                        Interact with a variety of Emergent and, for some learners, Early Stage genres and text forms to
                        engage with and respond to increasingly varied text.
                      </li>
                      <li>Respond to reading using oral, visual, hands on or simple written responses.</li>
                      <li>
                        Reflect on and identify their strengths as readers, areas for improvement and the strategies
                        they found useful before, during and after reading.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 className="font-semibold mb-2">Specific Curriculum Outcomes</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      2.1 Reflect on and connect interests and background knowledge before, during and after reading.
                    </li>
                    <li>2.2 Apply Concepts About Print to navigate Emergent/Early level text.</li>
                    <li>2.3 Connect background knowledge to new learning.</li>
                    <li>2.4 Regard reading/viewing as sources of interest, enjoyment, and information.</li>
                    <li>
                      2.5 Engage in reading or reading-like behaviour to experience a variety of text and text forms.
                    </li>
                    <li>2.6 Participate in opportunities to share favourite texts with peers.</li>
                    <li>
                      2.7 Re-read, retell and act out selections of familiar stories, poems, and nonfiction texts.
                    </li>
                    <li>2.8-2.13 Select and engage critically with texts for personal growth.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Learning Strategies</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Practicing what I've learned about reading:</strong> Design reading corners with access to
                      paper-based and digital texts.
                    </li>
                    <li>
                      <strong>Read Around the room:</strong> Create a literate classroom environment with
                      learner-created wall prints.
                    </li>
                    <li>
                      <strong>Sharing what I read:</strong> Provide opportunities to share texts through retelling,
                      drawings, and role playing.
                    </li>
                    <li>
                      <strong>Searching for books to become a better reader:</strong> Model the Five Finger Rule for
                      choosing "just right" books.
                    </li>
                    <li>
                      <strong>Pictures and words work together:</strong> Use Book Walks to demonstrate how illustrations
                      support stories.
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="elo3" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Essential Learning Outcome 3</CardTitle>
              <CardDescription>
                The learner will interact with understanding and critical thought to a variety of genres and text forms
                using comprehension strategies, vocabulary, language structures, and graphophonic cues.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-4">Grade One Expectations</h3>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="interact">
                  <AccordionTrigger>Interact with understanding and critical thought</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Further develop and apply Concepts of Print to engage with Emergent/Early to Early Stage text.
                      </li>
                      <li>
                        Use comprehension strategies before reading, during reading and after reading to establish the
                        meaning of the passage.
                      </li>
                      <li>Respond to reading using oral, visual, hands on or written responses.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="vocabulary">
                  <AccordionTrigger>Develop vocabulary</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Notice and respond to new vocabulary in a passage as an opportunity to learn.</li>
                      <li>
                        Identify an increasing number of words with automaticity so attention is directed to the meaning
                        of the text.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="language">
                  <AccordionTrigger>Recognise and use language structures</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Become more aware of how to use meaningful and fluent phrasing to assist comprehension.</li>
                      <li>Develop understanding of meaningful word order in Home Languages and Standard English.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="graphophonic">
                  <AccordionTrigger>Interact with and apply graphophonic cues</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Notice and apply some Emergent/Early to Early Stage single and multi-sound symbol relationships
                        to decode unknown words with increasing automaticity.
                      </li>
                      <li>
                        Begin to notice reading errors and use graphophonic elements meaningfully and structurally to
                        self-correct.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 className="font-semibold mb-2">Key Learning Strategies</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Reading is understanding:</strong> Introduce and review comprehension strategies with
                      explicit instruction.
                    </li>
                    <li>
                      <strong>Many ways to show I understand:</strong> Provide a range of opportunities to demonstrate
                      understanding through discussion, retelling, drawing, and role play.
                    </li>
                    <li>
                      <strong>What does this mean?:</strong> Assist learners in identifying new words using context
                      clues and illustrations.
                    </li>
                    <li>
                      <strong>Close the Cloze:</strong> Use morning messages for students to learn how to use sentence
                      meaning to fill in missing words.
                    </li>
                    <li>
                      <strong>The clue is in the punctuation:</strong> Use role playing to demonstrate how punctuation
                      impacts how a sentence is read.
                    </li>
                    <li>
                      <strong>Using environmental text to learn phonics:</strong> Connect phonics lessons with vowels
                      from known anchor texts.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Assessment Approaches</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Running Records (oral reading records) to determine reading level and strategies.</li>
                    <li>Teacher-Learner After Reading interviews about text comprehension.</li>
                    <li>Book Club observations of peer discussions.</li>
                    <li>TWHL charts (Think, Want to know, How to find out, Learned).</li>
                    <li>Phonemic Awareness checklists to monitor progress.</li>
                    <li>Observation of word solving strategies during reading.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="elo4" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Essential Learning Outcome 4</CardTitle>
              <CardDescription>
                Students will develop their understanding of how an author's purpose and style, genre, text form, text
                features and choice of vocabulary, language, influence the meaning of text and define the author's
                craft.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-4">Grade One Expectations</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Specific Curriculum Outcomes</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>4.1-4.4 Develop understanding of how author's purpose and style influence meaning.</li>
                    <li>
                      4.5-4.9 Develop understanding and recognise use of genres and text features influence meaning.
                    </li>
                    <li>
                      4.10-4.15 Develop understanding of how vocabulary and language use influence the meaning and mood
                      of the text.
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Learning Strategies</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Time to explore books:</strong> Expose students to a range of texts and authors to note
                      similarities and differences.
                    </li>
                    <li>
                      <strong>I like this author!:</strong> Read aloud several books by the same author and discuss
                      style elements.
                    </li>
                    <li>
                      <strong>Making the author's style visible:</strong> Demonstrate how punctuation, large print, and
                      bold print engage readers.
                    </li>
                    <li>
                      <strong>Titles, pictures, and lists help us understand:</strong> Highlight text features in
                      nonfiction texts.
                    </li>
                    <li>
                      <strong>I read it and I made it:</strong> Create a "Maker Space" with instructions for learners to
                      follow and create.
                    </li>
                    <li>
                      <strong>I say, you say, we say:</strong> Explore local phrases/slang and convert to Standard
                      English.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Teacher Content Knowledge</h4>
                <p className="mb-2">
                  <strong>Author's Style:</strong> Refers to the unique way a piece of writing is written, including
                  sound devices, word choice, sentence structure, dialogue, sensory details, tone, and use of culture.
                </p>
                <p className="mb-2">
                  <strong>Genre:</strong> Refers to the style, form, and content of the text. Types encountered in Grade
                  1 include pictures, poems, stories, fantasy stories, and informational texts.
                </p>
                <p>
                  <strong>Text Features:</strong> Provide additional information about the book or passage, such as
                  illustrations, captions, bold print, index, glossary, and chapter headings.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Additional Resources and Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Books and Digital Resources</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>School libraries: Hands Across the Seas books</li>
                <li>Early Learner Programme Student Resources</li>
                <li>Global Digital Library (digitallibrary.io)</li>
                <li>Bloom Library (bloomlibrary.org)</li>
                <li>Let's Read Asia Foundation (letsreadasia.org)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Teacher Resources</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>International Literacy Association resources</li>
                <li>Edutopia Topic Index</li>
                <li>Running Records assessment guides</li>
                <li>Phonological awareness development charts</li>
                <li>Word identification strategies</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Components of Reading and Viewing Instruction</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Teacher Read Aloud:</strong> A systematic method of reading aloud to scaffold children's
                understanding.
              </li>
              <li>
                <strong>Shared Reading:</strong> An interactive reading experience where students join in the reading
                while guided by a teacher.
              </li>
              <li>
                <strong>Guided Reading:</strong> Teacher works with small groups who have similar reading needs.
              </li>
              <li>
                <strong>Independent Reading:</strong> Students read on their own for their own purposes.
              </li>
              <li>
                <strong>Buddy Reading:</strong> Students support each other while reading.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
