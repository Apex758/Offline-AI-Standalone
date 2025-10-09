"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function PatternsRelationshipsPage() {
  return (
    <div className="container mx-auto py-8">
      <Link href="/curriculum/grade1-subjects/mathematics">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Mathematics Curriculum
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Patterns and Relationships</h1>
        <p className="text-gray-600 mb-4">
          Logical patterns exist in and around us in the environment and it is a regular occurrence in many Mathematics
          concepts. Patterns can be recognized, extended and generalizations are formed using words and symbols based on
          observations. The same pattern can be replicated/translated/represented using different formats, using
          numbers, geometric representations as well as physical resources. For learners of grade one, patterning
          activities should involve opportunities for manipulating physical resources. This clearly allows them to
          extend, create patterns and make changes as they engage in the activities with a feeling of accomplishment.
          Moreover, the use of physical items creates a hands-on approach for students and encourages trial and error
          which is an important strategy in Mathematics. Patterns are observed in multiple areas; singing, writing,
          poetry, story-telling, the observed environment. Therefore, opportunities for developing the concept of
          patterns should be presented to students whereby their senses are stimulated and every learner has an
          opportunity to succeed through dance (body movements), singing, piecing physical materials together;
          ultimately catering to students at the concrete level so that full concept formation takes place.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            Essential Learning Outcome P 1.1: Recognizing, Describing and Extending Patterns - Describe, create, extend
            and generalise patterns
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Specific Curriculum Outcomes</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Describe, copy and extend a repeating pattern with 2 to 4 elements (using manipulatives, diagrams,
                    body movements/actions/sounds)
                  </li>
                  <li>
                    Translate a repeating pattern from one representation or modality to another (E.g., a repeating
                    orientation pattern to a repeating sound pattern, etc.)
                  </li>
                  <li>Spot and correct errors in a repeating pattern.</li>
                  <li>Identify and describe repeating patterns in the environment (both man-made and nature)</li>
                  <li>
                    Show appreciation for their peers' creation of patterns and patterns in our environment by
                    identifying and describing the pattern observed around them
                  </li>
                  <li>Identify and enjoy patterns in poems, stories, (folk and modern) within their culture</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Instructional Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Allow learners to listen/view and participate in a pattern song. At the end of the video, pose
                    questions at various cognitive levels to help learners recall, describe/explain, reproduce and
                    extend the pattern that was presented in the video.
                  </li>
                  <li>
                    In pairs, learners use their cut-outs or cars to demonstrate their solutions to questions being
                    asked. Can you use your cut-outs/cars and arrange your cars in the order that they appeared in the
                    video? Which car came in first? Which car came in after the red car? Look at the arrangements of the
                    cars. Which car do you think will come next?
                  </li>
                  <li>
                    Give learners the opportunity to create their own patterns using a variety of materials in different
                    forms and contexts using the ABABAB (2 elements in the core), ABCABCABC (3 elements in the core)
                    formats.
                  </li>
                  <li>
                    Read stories and poems that contain patterns and have students identify and discuss the patterns
                    they observe.
                  </li>
                  <li>
                    Create a pattern gallery where students can display their pattern creations and appreciate each
                    other's work.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Assessment Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Teacher will observe by listening to students as they discuss the contents of the video and engage
                    in reproducing the pattern embedded in the video. The checklist below will record the identified
                    behaviors.
                  </li>
                  <li>
                    Provide opportunities to explore, create and talk about repeating patterns with two, three, and
                    four-element cores progressively.
                  </li>
                  <li>
                    Observe learners as they construct their patterns. Ask questions at various cognitive levels to help
                    learners conceptualize the characteristics of a repeating pattern.
                  </li>
                  <li>Listen to learners as they respond to check for their conceptual understanding.</li>
                  <li>
                    Make use of an observational checklist to check and take note of misconceptions that the learners
                    may have and to assess their conceptual and procedural understanding of repeating patterns.
                  </li>
                  <li>Assess students' ability to identify and describe patterns in cultural stories and poems.</li>
                  <li>Observe how students appreciate and provide feedback on their peers' pattern creations.</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            Essential Learning Outcome P1.2: Learners will recognize, describe, and extend for increasing and decreasing
            patterns
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Specific Curriculum Outcomes</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Interpret, describe and extend a given increasing and decreasing pattern that grows by 1 or 2 each
                    time with no more than 4 elements in the core.
                  </li>
                  <li>
                    Use a variety of tools and models to create, generate and interpret patterns that increase or
                    decrease by 1 or 2 each time
                  </li>
                  <li>Identify missing elements and/or errors in a given increasing and decreasing pattern.</li>
                  <li>
                    Show an appreciation for patterns found in the environment around them by recognizing, talking
                    about, describing and recreating their own examples based on observations.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Instructional Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Learners will listen to a chant by the teacher and demonstrate the body movements to reflect a given
                    increasing pattern by one each time,(ABBABBABB) using physical movements, steps, hand movements or
                    full body movements e.g. up down down, up down down, up down down.
                  </li>
                  <li>
                    The learners will be presented with a sequence made out of blocks, bottle caps or any physical
                    objects to observe a given increasing pattern (ABABBABBB). First a discussion will follow to answer
                    the following: What do you notice? Is there a pattern? Is there anything alike/similar? Do you think
                    you can continue the pattern? What comes next? Why?
                  </li>
                  <li>
                    Learners will listen to a story about Peter's Missing Buttons which reflects increasing patterns by
                    one: Have you ever picked up your school shirt and noticed buttons were missing? Today we will
                    listen to a story about a boy who needed a shirt for school and needed to choose the best shirt to
                    wear.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Assessment Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Learners in pairs will discuss and create their own increasing pattern to reflect body movements and
                    share with the class their creations (e.g. clap, stomp, stomp, clap, stomp, stomp, clap, stomp,
                    stomp,...shake your body, nod your head twice (repeat 3 times). Demonstration of the repeating
                    pattern will be observed by the teacher and recorded for understanding using an observation chart
                    for each pair of students.
                  </li>
                  <li>
                    Engage learners in a discussion on what they are observing in the given sequence using the coloured
                    blocks and/or bottle caps. Behaviours will be recorded using an observation checklist. In pairs,
                    students will then create a sequence of their own reflecting the ABABBABBB pattern and share with
                    their peers when completed. Students' progress will be monitored by the teacher as they engage in
                    the activity.
                  </li>
                  <li>
                    Students' ability to demonstrate their understanding of an increasing or decreasing pattern using
                    objects of their choice such as patterned sponges, leaves or any item found in the environment, will
                    be observed by the teacher and students will use a self assessment to determine how they felt about
                    completing the task.
                  </li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            Essential Learning Outcome P 2.1 Variables and Relationships - Representing Unknowns
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Specific Curriculum Outcomes</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Identify and describe missing quantities in numbers up to 20 by using a variety of concrete
                    materials to represent situations.
                  </li>
                  <li>
                    Represent missing quantities in numbers up to 20 by writing number sentences in semantic and
                    computational forms:
                  </li>
                  <li>using joining, separating, part - part whole and comparing structures/ relationships</li>
                  <li>using the inverse of the given operation</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Instructional Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Have learners represent unknowns using concrete materials such as: connecting cubes to build towers.
                  </li>
                  <li>
                    Provide opportunities for learners to use materials to represent 'Part - Part Whole' relationships
                    and to find unknown quantities. Use Number Frames (Five Frames, Ten Frames) to model unknowns.
                  </li>
                  <li>
                    Allow learners the opportunities to write the number sentences after studying pictorial
                    representations of situations, listening to or reading stories/situations. Provide a variety of
                    situations relating to the join, separate, part - part whole and comparing problem structures.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Assessment Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Observe and check whether learners are able to represent unknown quantities from stories or
                    situations, using concrete materials. Make observations about the math material that the learners
                    use to show the unknown quantities.
                  </li>
                  <li>
                    Have learners read stories/ situations about unknowns. Allow them to work in pairs and discuss
                    representations/ solutions. Allow learners to make presentations using concrete materials or role
                    play situations to represent unknowns.
                  </li>
                  <li>
                    Have learners play games in small groups using "missing part cards". use number frames (5, 10 ...).
                    Each card can have a different number of dots in the frames or a specific number can be the focus.
                  </li>
                  <li>
                    Distribute cards to learners and allow them to write/ complete number sentences to represent
                    unknowns from situations read to them.
                  </li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>
            Essential Learning Outcome P2.2: Variables and Relationships - Understanding and representing equivalence
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Specific Curriculum Outcomes</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Use different number combinations and linear models to create equivalent number values and lengths
                    up to a total of 20.
                  </li>
                  <li>
                    Identify and use equivalent relationships of equal length, number and number sentences adding up to
                    20.
                  </li>
                  <li>Compare lengths, number, and number sentences using the equal sign.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Instructional Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>The learners view a video on number combinations with the sum of ten and they sing along.</li>
                  <li>The same rhythm and melody is applied to other number combinations made for other sums.</li>
                  <li>The learners classify objects based on equal lengths.</li>
                  <li>
                    The learners use objects to create equal lengths. For example, String equal lengths of beads, stack
                    equal lengths of blocks etc.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Assessment Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    In pairs the learners create equal lengths using building blocks for given lengths given to them.
                  </li>
                  <li>They are also given a pair of lengths that they need to make equal to each other.</li>
                  <li>
                    The learners match the equal lengths using the letters assigned to each length on the grid using the
                    equal sign.
                  </li>
                  <li>The learners solve stories/problems involving equal number combinations.</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>
            Essential Learning Outcome P2.3 : Variables and Relationships - Writing Expressions and Equations
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Specific Curriculum Outcomes</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Determine whether given pairs of expressions are equivalence or balance using concrete objects, as
                    well as operations on whole numbers.
                  </li>
                  <li>
                    Interpret the meaning of the equal sign correctly and determine if equations involving addition and
                    subtraction are true or false.
                  </li>
                  <li>
                    Determine the unknown whole number in an addition or subtraction equation with three whole numbers.
                  </li>
                  <li>
                    Formulate number sentences to solve word problems involving addition of two or three whole numbers
                    and subtraction of two whole numbers.
                  </li>
                  <li>Express equalities as different representations of the same quantity (0 to 20).</li>
                  <li>
                    Use addition and subtraction up to 20 to solve one step word problems involving adding to, taking
                    from, putting together and taking apart, with unknowns in all positions.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Instructional Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Using a pan balance or arm balance, learners will understand the concept of a balanced equation and
                    will manipulate coloured counters of equal size to form as many equations as possible. An '=' sign
                    can be stuck in the middle.
                  </li>
                  <li>
                    Use number bonds to develop an understanding of the commutative property of addition (for example,
                    2+ 3 = 3+2), as well as the part-part-whole relationship of numbers.
                  </li>
                  <li>
                    Use stackable blocks of different colours (but same size) to form equations. For example, they can
                    form two stacks with eight blocks each and can manipulate those stacks with different colours to
                    form different equations using fact families.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Assessment Strategies</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Use a simple observation checklist while learners use the pan balance or arm balance to form
                    equations.
                  </li>
                  <li>
                    Have students pull their chairs and/or desks in a physical circle in the classroom. The teacher
                    calls out (or writes) three numbers and students are to formulate a number sentence using all three
                    numbers. The first person to answer gets to hold a ball. This ball will be sent to the next person
                    who answers correctly and so on.
                  </li>
                  <li>
                    Have learners play fishing games in small groups to collect numbers that will make number sentences
                    true. Observe learners as they discuss what is needed to make number sentences true and why.
                  </li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle>Teacher Resources</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="list-disc pl-5 space-y-2">
                <li>Pattern blocks, tangrams, and other manipulatives</li>
                <li>Videos and songs about patterns</li>
                <li>Interactive websites and apps for pattern practice</li>
                <li>Books about patterns and relationships</li>
                <li>Cultural stories and poems containing patterns</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle>Cross-Curricular Connections</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="list-disc pl-5 space-y-2">
                <li>Art: Creating patterns in artwork</li>
                <li>Music: Identifying patterns in rhythm and melody</li>
                <li>Science: Observing patterns in nature</li>
                <li>Language Arts: Identifying patterns in stories and poems</li>
                <li>Social Studies: Exploring patterns in different cultures</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
