import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, BookOpen, ClipboardCheck } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"

export default function ReadingViewingPage() {
  return (
    <div className="container mx-auto py-8">
      
      <Link href="/curriculum/grade3-subjects/language-arts">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Grade 3 Language Arts
        </Button>
      </Link>

      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-100 to-teal-100 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-blue-700 flex items-center">
            <BookOpen className="mr-2 h-7 w-7 text-blue-600" />
            Reading and Viewing
          </h1>
          <p className="text-gray-700">
            In Grade 3, students develop their reading and viewing skills to interact meaningfully with a variety of
            texts. They learn to apply comprehension strategies, develop vocabulary, and recognize how authors craft
            texts to convey meaning. Students read for pleasure, personal growth, and to gather information.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          Grade Three Expectations for Reading and Viewing
        </h3>

        <Tabs defaultValue="pleasure">
          <TabsList className="grid w-full grid-cols-4 bg-blue-100">
            <TabsTrigger value="pleasure" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              For Pleasure & Growth
            </TabsTrigger>
            <TabsTrigger value="background" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Using Background Knowledge
            </TabsTrigger>
            <TabsTrigger value="vocabulary" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Developing Vocabulary
            </TabsTrigger>
            <TabsTrigger value="structures" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Language Structures
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pleasure" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Read for Pleasure and Personal Growth</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Select and read a variety of materials with fluency at the early to transitional levels</li>
              <li>
                Participate in independent reading with a book chosen to provide just the right amount of challenge
              </li>
              <li>Explore texts of interest that may be difficult, but still informative</li>
              <li>
                Reflect on and identify their strengths as readers, areas for improvement, and the strategies they found
                most helpful before, during and after reading
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="background" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Use Background Knowledge</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Further develop a connection to a range of favourite authors</li>
              <li>
                Use knowledge of the author's craft, topic, or genre as a foundation to predict and confirm the purpose
                and meaning of new readings
              </li>
              <li>Interact meaningfully with a wide range of genres and text forms</li>
              <li>
                Read and demonstrate an understanding of a variety of Early to Transitional-level literary, graphic, and
                informational texts using a wide range of strategies to construct meaning
              </li>
              <li>Use different sources to find information e.g., reference texts, encyclopedias, the internet</li>
              <li>Identify significant elements and meaningful details to construct meaning</li>
              <li>Respond to what is read with critical thought in a variety of ways</li>
            </ul>
          </TabsContent>

          <TabsContent value="vocabulary" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Develop Vocabulary</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Continue to notice and apply new vocabulary gathered while reading a wide range of genres</li>
              <li>
                Predict the meaning of unfamiliar words with more strategic use of background knowledge, context, text
                and word work
              </li>
              <li>Make connections between the vocabulary of Home Language(s) and Standard English</li>
              <li>Become increasingly aware of the history and roots of local language(s)</li>
            </ul>
          </TabsContent>

          <TabsContent value="structures" className="p-4 border rounded-md mt-2 bg-blue-50 border-blue-200">
            <h4 className="font-semibold mb-2">Recognize and Use Language Structures</h4>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                Recognize a variety of text forms, text features, and stylistic elements and demonstrate an
                understanding of how they help communicate meaning
              </li>
              <li>Notice the similarities between paper-based and digital language and organizational structures</li>
              <li>
                Use existing knowledge of words and meaningful word-solving strategies to read with automaticity and
                fluency
              </li>
              <li>Use reading as a resource for building knowledge of writing conventions</li>
            </ul>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-blue-500 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-700 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Specific Curriculum Outcomes
            </CardTitle>
            <CardDescription>By the end of Grade Three, the learner will be expected to:</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Independent Reading
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Continue to choose and engage with a range of literary, visual, graphic, and informational texts
                      for independent reading
                    </li>
                    <li>
                      Apply knowledge of fiction, poetry, and nonfiction genres to guide independent understanding of
                      visual and text-based information
                    </li>
                    <li>
                      Apply comprehension strategies during independent reading: determining the main idea, making
                      connections, predicting, visualizing, inferring, analyzing, synthesizing
                    </li>
                    <li>
                      Demonstrate understanding of texts read independently through a variety of oral, written, visual
                      responses
                    </li>
                    <li>
                      Continue to respond critically to texts by asking and formulating responses to questions such as:
                      what if? is it possible that...? what else? what was the author trying to tell us? do I agree /
                      why?
                    </li>
                    <li>
                      Describe how the sequence of events and setting of fiction and nonfiction genres impacts the plot
                      or the event described
                    </li>
                    <li>
                      Apply knowledge of characterization by describing attributes, using evidence from the text,
                      comparing characters, and explaining how characters' actions contribute to the story
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Vocabulary Development
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Continue to make connections between the vocabulary of Home Language(s) and Standard English
                    </li>
                    <li>
                      Become increasingly aware of how local texts use the history and roots of the local language(s)
                    </li>
                    <li>
                      Continue to develop reading vocabulary through reading a range of genres, authors, and topics
                    </li>
                    <li>
                      Extend reading vocabulary with increasing independence through the application of antonyms,
                      synonyms, homophones, homographs
                    </li>
                    <li>Use a paper based or digital dictionary and thesaurus with increasing independence</li>
                    <li>
                      Continue to independently apply common prefixes and suffixes to determine meaning of new
                      vocabulary
                    </li>
                    <li>
                      Apply cross-curricular vocabulary to enhance understanding of texts read during independent
                      reading
                    </li>
                    <li>
                      Apply knowledge of the change in tense (-ed), number (-s), and degree (-er and –est) signified by
                      inflected endings to decode words
                    </li>
                    <li>Identify and apply figurative language to enhance understanding of a text</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">
                  Language Structures
                </AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Continue to demonstrate understanding of how word order impacts meaning</li>
                    <li>Apply knowledge of how personal reading fluency impacts understanding</li>
                    <li>
                      Develop an awareness of how word choice, phrasing and punctuation may be used in positive or
                      negative ways
                    </li>
                    <li>
                      Recognize a variety of text forms, text features and stylistic elements and how they help
                      communicate meaning
                    </li>
                    <li>
                      Refer to parts of stories, dramas and poems when writing or speaking about text using terms such
                      as chapter, scene, and stanza
                    </li>
                    <li>
                      Refine use of a variety of text features to locate information (table of contents, glossary,
                      index, charts, titles, and subtitles, etc.)
                    </li>
                    <li>
                      Generate questions to guide research, locate appropriate information, organize information, and
                      share information
                    </li>
                    <li>
                      Use charts, diagrams, and other graphic information in an expository selection as an aid to
                      understanding the text
                    </li>
                    <li>Evaluate the contribution of graphic information to an expository selection</li>
                    <li>
                      Use information gained from illustrations – e.g., maps, photographs, and the words in a text to
                      demonstrate understanding of the text
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-blue-200 rounded-md mb-2">
                <AccordionTrigger className="hover:bg-blue-50 px-4 py-2 rounded-md">Author's Craft</AccordionTrigger>
                <AccordionContent className="bg-blue-50 px-4 py-2 rounded-b-md">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Continue to notice and compare the purpose and style of a variety of authors and illustrators
                    </li>
                    <li>
                      Develop understanding of the basic features of the plots of fables, folk tales, fairy tales,
                      adventure stories etc.
                    </li>
                    <li>
                      Discuss the purpose of particular images or media texts e.g., to inform, entertain, and persuade
                    </li>
                    <li>Begin to develop an understanding of the component of author's style</li>
                    <li>
                      Continue to develop understanding of how illustrations, fonts, vocabulary and language structures
                      are designed to engage the reader
                    </li>
                    <li>
                      Continue to provide examples of author's use of interesting words, phrases, and sentences to evoke
                      emotions, describe, create humour, etc.
                    </li>
                    <li>
                      Explain how specific aspects of a text's illustrations contribute to what is being conveyed by
                      words in the text, e.g., create mood and emphasize setting
                    </li>
                    <li>
                      Compare and contrast the effectiveness, cultural relevance and possible hidden messages of
                      advertisements, social media posts, etc.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-teal-500 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-teal-50">
              <CardTitle className="text-teal-700 flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                Inclusive Assessment Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assessment strategies that provide information about learning:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-teal-700">Observations:</strong> Teacher observations during independent
                  reading, noting student engagement, strategy use, and comprehension
                </li>
                <li>
                  <strong className="text-teal-700">Conversations:</strong> One-on-one reading conferences to discuss
                  book choices, comprehension, and reading strategies
                </li>
                <li>
                  <strong className="text-teal-700">Products:</strong> Reading response journals, graphic organizers,
                  and visual representations of texts
                </li>
              </ul>

              <div className="mt-4 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-100">
                <h4 className="font-semibold mb-2 text-teal-700">Sample Assessment Tools:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Running records to assess reading accuracy, fluency, and comprehension</li>
                  <li>Reading response rubrics for evaluating understanding and critical thinking</li>
                  <li>Self-assessment tools for students to reflect on their reading habits and strategies</li>
                  <li>Character analysis charts to assess understanding of characterization</li>
                  <li>Vocabulary journals to track new word acquisition and understanding</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inclusive Learning Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="strategy-1">
                  <AccordionTrigger>Independent Reading</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Reading Comprehension Strategies:</strong> Begin each independent reading lesson with a
                        brief reminder about using reading comprehension strategies (determining main idea, making
                        connections, predicting, visualizing, inferring, analyzing, synthesizing).
                      </li>
                      <li>
                        <strong>Think While Reading:</strong> Use Teacher Read Aloud/Think Aloud to demonstrate how to
                        think beyond the words on the page, pausing occasionally to share thoughts and questions.
                      </li>
                      <li>
                        <strong>Local Language Storytelling:</strong> Ensure that books, images, poetry, lyrics,
                        posters, or videos from the local culture and language are available for independent reading
                        time.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-2">
                  <AccordionTrigger>Vocabulary Development</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Language Contrasts:</strong> Explore similarities and differences between Home
                        Language(s) and Standard English by comparing words and phrases.
                      </li>
                      <li>
                        <strong>Vocabulary Mapping:</strong> Create word maps with central English words and related
                        words/phrases in Home Language(s) to explore connections.
                      </li>
                      <li>
                        <strong>Synonym Chains:</strong> Generate chains of synonyms or similar words for nouns, verbs,
                        and adjectives from texts.
                      </li>
                      <li>
                        <strong>Online Thesaurus Exploration:</strong> Assign words from various subject areas and teach
                        students how to use online dictionaries or thesauri to learn meanings and word origins.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-3">
                  <AccordionTrigger>Text Features and Structures</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Genre Exploration:</strong> Create a reading chart with various genres and subgenres,
                        adding titles as students experience different types of texts.
                      </li>
                      <li>
                        <strong>Text Features as Maps:</strong> Engage students in discussions about how text features
                        (cover images, table of contents, chapter titles, glossaries, captions) help readers navigate
                        and understand texts.
                      </li>
                      <li>
                        <strong>Sentence Strips:</strong> Review the importance of word order by cutting sentences into
                        individual words or phrases and having students reconstruct them in meaningful ways.
                      </li>
                      <li>
                        <strong>Partner Reading:</strong> Pair students to take turns reading selections from their
                        books, focusing on fluency, phrasing, expression, and appropriate reading rate.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategy-4">
                  <AccordionTrigger>Author's Craft</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Reading for Word Meaning:</strong> Share nonfiction texts and think aloud the process of
                        finding the meaning of new words using context clues in sentences.
                      </li>
                      <li>
                        <strong>Emotional Responses:</strong> Provide students with emoji sticks to indicate how
                        different parts of a text make them feel, discussing how the author's words or illustrations
                        evoked those emotions.
                      </li>
                      <li>
                        <strong>Analyzing Advertisements:</strong> Examine advertisements to discuss their purpose,
                        style, and messages (including hidden messages), contrasting the advertised image with reality.
                      </li>
                      <li>
                        <strong>Book Clubs:</strong> Organize small groups to read books by different authors or
                        illustrators, discussing observations about purpose and style.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Additional Resources and Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">For Teachers</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Diverse classroom library with books, magazines, pamphlets in various genres</li>
                <li>Digital reading resources and platforms</li>
                <li>Graphic organizers for reading comprehension</li>
                <li>Text feature posters and reference materials</li>
                <li>OECS Grade 3 Language Arts Curriculum Guide</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">For Students</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Reading response journals</li>
                <li>Bookmarks with reading strategy reminders</li>
                <li>Personal dictionaries for new vocabulary</li>
                <li>Character analysis templates</li>
                <li>Text feature scavenger hunt sheets</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Teacher Content Knowledge</h3>
            <p>
              The purpose of Reading and Viewing instruction is for pleasure and personal growth and to develop readers
              who enjoy and interact meaningfully with a wide range of genres and text forms. Meaningful interaction
              with texts is developed through learning how to access and build on background knowledge and use the
              information provided by various sources for meaning, developing vocabulary, recognizing and using language
              structures, and meaningful application of graphophonic elements of the text.
            </p>
            <p className="mt-2">
              Teachers should be aware that reading comprehension strategies are similar to listening comprehension
              strategies. These include determining the main idea, making connections, predicting, visualizing,
              inferring, analyzing, and synthesizing. Regular opportunities for students to practice these strategies
              with texts at their independent reading level will help them develop as confident, strategic readers.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
