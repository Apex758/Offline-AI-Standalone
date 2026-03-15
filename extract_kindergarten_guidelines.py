"""
Extract subject-organized curriculum outcomes from the OHPC Kindergarten Guidelines PDF.
Creates a JSON file that rebuild_curriculum_index.py can use to add subject-based
kindergarten index entries alongside the existing unit-based entries.
"""
import json
import sys
import io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

OUTPUT_DIR = Path(__file__).parent / "output - Copy"

result = {
    "metadata": {
        "filename": "OHPC Kindergarten Guidelines 14November2024_curriculum.json",
        "curriculum": "OHPC Kindergarten Curriculum Guide",
        "grade": "Kindergarten",
        "subject": "Guidelines"
    },
    "strands": []
}

# ── LANGUAGE ARTS ─────────────────────────────────────────────────────────────
la_strands = [
    {
        "strand_name": "Listening and Speaking",
        "essential_learning_outcomes": [{
            "elo_code": "ELO 1.1",
            "elo_description": "The learner will explore, use, and critically apply oral language for pleasure, personal growth, to foster relationships and to develop an appreciation and celebration of culture and of oral languages.",
            "specific_curriculum_outcomes": [
                "1.1 listen to music, conversation and environmental sounds for personal enjoyment",
                "1.2 demonstrate interest, curiosity, engagement in sharing the experiences of others and with oral stories and information sharing",
                "1.3 use social listening and speaking skills to interact with a variety of audiences with sensitivity and respect",
                "1.4 interact and collaborate with the teacher and children who have diverse interests, backgrounds and languages",
                "1.5 become aware of how effective listening enhances understanding",
                "1.6 observe how tone, fluency and intonation impact meaning and mood",
                "1.7 use Home Language(s) and, as Standard English develops, share their thoughts, feelings and questions about engaging events, stories and conversations with increasing confidence",
                "1.8 develop increasing clarity and focus when sharing stories or experiences",
                "1.9 engage in active phonological awareness activities and word play to discriminate between various sounds in their environment, letters of the alphabet, rhyme and meaningful sound patterns",
                "1.10 develop and apply vocabulary and language structures to enhance their understanding of how to communicate ideas with purpose and focus",
            ]
        }]
    },
    {
        "strand_name": "Reading and Viewing",
        "essential_learning_outcomes": [
            {
                "elo_code": "ELO 2.1",
                "elo_description": "Learners will demonstrate a variety of ways to use background knowledge and interests to select and engage critically with a range of culturally diverse paper based, visual, and digital texts for pleasure and personal growth.",
                "specific_curriculum_outcomes": []
            },
            {
                "elo_code": "ELO 2.2",
                "elo_description": "Learners will interact with understanding and critical thought to a variety of genres and text forms using vocabulary, comprehension strategies and graphophonic cues.",
                "specific_curriculum_outcomes": []
            },
            {
                "elo_code": "ELO 2.3",
                "elo_description": "Learners will develop their understanding of how an author's choice of vocabulary, language, genre, text form, text features and style influence the meaning of text and define the author's craft.",
                "specific_curriculum_outcomes": []
            }
        ]
    },
    {
        "strand_name": "Writing and Representing",
        "essential_learning_outcomes": [
            {
                "elo_code": "ELO 3.1",
                "elo_description": "Learners will generate, gather and organize thoughts to explore, clarify and reflect on thoughts, feelings and experiences as they create a written or representative draft, independently and collaboratively, for a range of audiences and purposes.",
                "specific_curriculum_outcomes": []
            },
            {
                "elo_code": "ELO 3.2",
                "elo_description": "Learners will revise the organization and language use in drafted writing or representation, collaboratively and independently, for a variety of purposes and audiences.",
                "specific_curriculum_outcomes": []
            },
            {
                "elo_code": "ELO 3.3",
                "elo_description": "Learners will use their knowledge of spoken language, written language and writing conventions to refine the precision and enhance the meaning and clarity of their written work.",
                "specific_curriculum_outcomes": []
            }
        ]
    }
]

# ── MATHEMATICS ────────────────────────────────────────────────────────────────
math_strands = [
    {
        "strand_name": "Number Sense",
        "essential_learning_outcomes": [
            {"elo_code": "ELO 1.1", "elo_description": "Whole Number - Saying Number Sequence, Meaningful Counting and Skip Counting", "specific_curriculum_outcomes": [
                "1.1.1 Say the number sequence to 10 by 1s",
                "1.1.2 Count backwards from 10 by 1s",
                "1.1.3 Identify an error in counting sequence",
                "1.1.4 Say the number that comes after a given number",
                "1.1.5 Say the number that comes before a given number",
                "1.1.6 Use a number line to support counting",
                "1.1.7 Recite number names from a given number to a given number - i.e. start at a given number and go backwards down to 1 or start at a given number and go up to 10",
                "1.1.8 Count with meaning to 10, by building quantities",
                "1.1.9 Count with meaning to 10, by matching quantity and numeral",
            ]},
            {"elo_code": "ELO 1.2", "elo_description": "Whole Number - Representing and Partitioning Quantities", "specific_curriculum_outcomes": [
                "1.2.1 Represent a given number up to 10 using a variety of concrete models, including 5 and 10 frames",
                "1.2.2 Answer the question, How many are in the set? using the last number counted in a set",
                "1.2.3 In a fixed arrangement, starting in different locations, can show that the count of the number of objects in a set does not change",
                "1.2.4 Count the number of objects in a given set, rearrange the objects, predict the new count, and recount to verify the prediction",
            ]},
            {"elo_code": "ELO 1.3", "elo_description": "Whole Number - Comparing and Ordering Quantities", "specific_curriculum_outcomes": [
                "1.3.1 Look briefly at a given familiar arrangement of one to five objects or dots and identify the number represented without counting",
                "1.3.2 Look briefly at a given familiar arrangement of one to five objects or dots and identify the number represented by a given dot",
                "1.3.3 Compare the number of objects in two sets of up to 10 objects, using phrases such as same number as, equal to, more than, and less than",
                "1.3.4 Make a set that has the same number of objects as a given set",
                "1.3.5 Make a set that has one more object than a given set",
            ]},
        ]
    },
    {
        "strand_name": "Operations with Numbers",
        "essential_learning_outcomes": [{
            "elo_code": "ELO 2.1",
            "elo_description": "Additive Thinking - Understanding the meaning of addition and subtraction and how they relate",
            "specific_curriculum_outcomes": [
                "2.1.1 Compose and decompose numbers up to 9 in a variety of ways using manipulatives, fingers and pictures (e.g. seven fingers held up, fold down two fingers, how many are left? Or, two blocks and two more blocks, how many altogether?). Symbolic representation (writing equations for composing and decomposing numbers) is an emerging outcome for end of Kindergarten.",
            ]
        }]
    },
    {
        "strand_name": "Pattern and Relationship",
        "essential_learning_outcomes": [{
            "elo_code": "ELO 3.1",
            "elo_description": "Recognizing, Describing and Extending Patterns - Describe, create, extend and generalise patterns",
            "specific_curriculum_outcomes": [
                "3.1.1 Create simple repeating patterns (2 elements)",
                "3.1.2 Extend simple repeating patterns (2 elements)",
                "3.1.3 Copy a given repeating pattern",
            ]
        }]
    },
    {
        "strand_name": "Geometric Thinking",
        "essential_learning_outcomes": [
            {"elo_code": "ELO 4.1", "elo_description": "Analysing and describing 3D shapes", "specific_curriculum_outcomes": [
                "4.1.1 Build and describe 3-D objects",
                "4.1.2 Create a representation of a given 3-D object using building blocks, and compare the representation to the original 3-D object",
                "4.1.3 Describe a given 3-D object using words such as big, little, round, like a box or a can",
            ]},
            {"elo_code": "ELO 4.2", "elo_description": "Recognize, Name and Describe Shapes - 2D and 3D", "specific_curriculum_outcomes": []}
        ]
    },
    {
        "strand_name": "Measurement",
        "essential_learning_outcomes": [
            {"elo_code": "ELO 5.1", "elo_description": "Understanding What and How We Measure", "specific_curriculum_outcomes": [
                "5.1.3 Describe several measurable attributes of a single object",
            ]},
            {"elo_code": "ELO 5.2", "elo_description": "Developing and applying non-standard and standard units of measurement", "specific_curriculum_outcomes": [
                "5.2.1 Use non-standard units to measure attributes, e.g. uses blocks, hands span, toy cars, etc. to measure",
            ]}
        ]
    },
    {
        "strand_name": "Data Management and Probability",
        "essential_learning_outcomes": [{
            "elo_code": "ELO 6.1",
            "elo_description": "Collecting, organizing, displaying and communicating data",
            "specific_curriculum_outcomes": []
        }]
    }
]

# ── SCIENCE ────────────────────────────────────────────────────────────────────
science_strands = [
    {
        "strand_name": "Forces and Interactions",
        "essential_learning_outcomes": [
            {"elo_code": "ELO 1.1", "elo_description": "Plan and conduct an investigation to compare the effects of different strengths or different directions of pushes and pulls on the motion of an object.", "specific_curriculum_outcomes": [
                "1.1.1 Demonstrate that pushes can have different strengths and directions",
                "1.1.2 Demonstrate that pulls can have different strengths and directions",
            ]},
            {"elo_code": "ELO 1.2", "elo_description": "Analyse data to determine if a design solution works as intended to change the speed or direction of an object with a push or a pull.", "specific_curriculum_outcomes": []}
        ]
    },
    {
        "strand_name": "Interdependent Relationships in Ecosystems",
        "essential_learning_outcomes": [{
            "elo_code": "ELO 2.1",
            "elo_description": "Animals, Plants, and Their Environment - understanding interdependent relationships in ecosystems",
            "specific_curriculum_outcomes": []
        }]
    },
    {
        "strand_name": "Weather and Climate",
        "essential_learning_outcomes": [{
            "elo_code": "ELO 3.1",
            "elo_description": "Weather and Climate observations and patterns",
            "specific_curriculum_outcomes": []
        }]
    }
]

# ── SOCIAL STUDIES ─────────────────────────────────────────────────────────────
ss_strands = [
    {
        "strand_name": "Historical and Cultural Thinking",
        "essential_learning_outcomes": [
            {"elo_code": "ELO 1.1", "elo_description": "Recognize that all children are special as they all have people who love them, they have their own physical characteristics, aptitudes and mannerisms.", "specific_curriculum_outcomes": [
                "1.1.1 Demonstrate an understanding of 'me' as a unique child (K)",
                "1.1.2 Distinguish personal characteristics that make each child unique (physical traits, mannerisms) (S)",
                "1.1.3 Appreciate that everyone has unique and special characteristics (V)",
                "1.1.4 Express appreciation of the child's own personal attributes, one's name (V)",
                "1.1.5 Name family members (K)",
                "1.1.6 Represent family members using pictures/images (S)",
                "1.1.7 Compare their physical features with those of their family members; categorize similarities and differences of self and other family members (S)",
                "1.1.8 Understand that we inherit characteristics from our families (K)",
                "1.1.9 Appreciate the uniqueness of families; respect that the composition of families takes many forms (V)",
                "1.1.10 Understand that respect for self includes proper cleanliness, language and behaviour (K, V)",
                "1.1.11 Categorize similarities and differences of self and others in families",
                "1.1.12 Recognize that their own physical characteristics, preferences, and mannerisms may be inherited from their families",
            ]},
            {"elo_code": "ELO 1.2", "elo_description": "To understand how our celebrations help us build pride in our identity", "specific_curriculum_outcomes": [
                "1.2.1 Name one religious and one national festival celebrated in their country (K)",
                "1.2.2 Understand the significance and importance of religious and national festivals (S)",
                "1.2.3 Appreciate that their country has different celebrations and traditions (V)",
                "1.2.4 Identify customs (food, music, dance language) associated with these celebrations (K)",
                "1.2.5 Make presentations on customs associated with these celebrations (S)",
                "1.2.6 Appreciate the diversity of customs and take pride in this (V)",
            ]}
        ]
    },
    {
        "strand_name": "Civic Participation",
        "essential_learning_outcomes": [{
            "elo_code": "ELO 2",
            "elo_description": "To understand that we have rights and responsibilities as individuals.",
            "specific_curriculum_outcomes": [
                "2.1 Describe how family members care for one another (K)",
                "2.2 Appreciate that family members love and care for one another (V)",
                "2.3 Describe roles of various family members (K)",
                "2.4 Chart the daily routines or activities in which family members care for one another",
                "2.5 Appreciate that the way family members love and care for one another helps them meet their basic needs (V)",
                "2.6 Identify groups to which I belong (K)",
                "2.7 Express how my behaviour in groups and the behaviour of others affects me and others (S)",
                "2.8 Appreciate that members of groups to which I belong have responsibilities (V)",
                "2.9 Recognize that all children have the right to be safe from harm (K)",
                "2.10 List examples of what helps children feel safe (S)",
                "2.11 Appreciate that being safe from harm also means that they must learn to play safely (V)",
                "2.12 Demonstrate responsible caring behaviour towards others in play (S)",
                "2.13 Identify national symbols and emblems such as the national flag, anthem, pledge, bird and flower (K)",
                "2.14 Demonstrate appropriate behaviour when national anthem is being played, pledge is being said (S)",
                "2.15 Appreciate and respect the importance of national symbols (V)",
                "2.16 Know why we have rules in groups to which I belong (e.g. family, class at school) (K)",
                "2.17 Apply groups' rules in daily life (S)",
                "2.18 Demonstrate examples of responsible and polite behaviour in groups to which I belong (V)",
                "2.19 Describe safe practices while travelling to school (K)",
                "2.20 Role play the use of safe practices when travelling to school (S)",
                "2.21 Appreciate the value and benefits of practicing safety when travelling to school (V)",
            ]
        }]
    },
    {
        "strand_name": "Spatial Thinking",
        "essential_learning_outcomes": [{
            "elo_code": "ELO 3",
            "elo_description": "To understand that we belong to a wider environment",
            "specific_curriculum_outcomes": [
                "3.1 State the name and address of their home and school (K)",
                "3.2 Express themselves clearly when stating their address (S)",
                "3.3 Feel a sense of belonging in their surroundings (V)",
                "3.4 Identify natural and built features of the local environment (K)",
                "3.5 Illustrate natural and built features of the local environment (S)",
                "3.6 Appreciate that they are part of a wider environment (A)",
                "3.7 Describe various weather conditions (K)",
                "3.8 Observe and record different weather conditions (S)",
                "3.9 Appreciate the importance of taking safety precautions in some weather conditions (V)",
            ]
        }]
    }
]

result["strands"] = la_strands + math_strands + science_strands + ss_strands

out_path = OUTPUT_DIR / "OHPC Kindergarten Guidelines 14November2024_curriculum.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(result, f, indent=2, ensure_ascii=False)

total_scos = sum(
    len(e["specific_curriculum_outcomes"])
    for s in result["strands"]
    for e in s["essential_learning_outcomes"]
)
print(f"Wrote: {out_path}")
print(f"Strands: {len(result['strands'])}, Total SCOs: {total_scos}")
