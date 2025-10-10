import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Users, BookOpen, Heart, Target, CheckCircle, Star, Users2, Award } from "lucide-react"

export default function MyFamilyTreePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/curriculum/grade1-subjects/activities/social-studies">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Activities
              </Button>
            </Link>
          </div>

          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-2">Historical and Cultural Thinking</Badge>
                <h1 className="text-4xl font-bold">My Family Tree</h1>
              </div>
            </div>
            <p className="text-xl text-pink-100 leading-relaxed">
              Students create a family tree to explore their family history and cultural heritage, fostering
              understanding of family relationships and personal identity.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Activity Overview */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Target className="w-6 h-6 text-pink-600" />
                  Activity Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Learning Outcomes</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                      <span>Identify and describe family members and their relationships</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                      <span>Understand the concept of family heritage and cultural background</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                      <span>Develop appreciation for family diversity and different family structures</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                      <span>Practice organizing information in a visual format</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Curriculum Connections</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <h4 className="font-medium text-pink-800 mb-2">Social Studies</h4>
                      <p className="text-sm text-pink-700">Historical and cultural thinking, identity and belonging</p>
                    </div>
                    <div className="bg-rose-50 p-4 rounded-lg">
                      <h4 className="font-medium text-rose-800 mb-2">Language Arts</h4>
                      <p className="text-sm text-rose-700">Oral communication, vocabulary development</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Implementation Steps */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <BookOpen className="w-6 h-6 text-pink-600" />
                  Implementation Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Introduction to Family Trees</h3>
                      <p className="text-gray-600 mb-3">
                        Begin by explaining what a family tree is and why families are important. Show examples of
                        different family trees, emphasizing that all families are unique and special.
                      </p>
                      <div className="bg-pink-50 p-3 rounded-lg">
                        <p className="text-sm text-pink-800">
                          <strong>Discussion Questions:</strong> "What is a family?" "Who are the people in your
                          family?" "How are family members related to each other?"
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Explore Family Tree Examples</h3>
                      <p className="text-gray-600 mb-3">
                        Show students various examples of family trees, including different family structures (nuclear,
                        extended, blended families). Discuss how families can look different but are all special.
                      </p>
                      <div className="bg-pink-50 p-3 rounded-lg">
                        <p className="text-sm text-pink-800">
                          <strong>Key Point:</strong> Emphasize that families come in many forms and all are valuable.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Distribute Template and Materials</h3>
                      <p className="text-gray-600 mb-3">
                        Give each student a family tree template handout along with colored pencils and other decorating
                        materials. Explain how to fill in the template with family members' names.
                      </p>
                      <div className="bg-pink-50 p-3 rounded-lg">
                        <p className="text-sm text-pink-800">
                          <strong>Support:</strong> Provide assistance for students who may need help with spelling
                          names.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Create Family Trees</h3>
                      <p className="text-gray-600 mb-3">
                        Allow students time to fill in their family members' names and add any additional family members
                        as needed. Encourage them to include pets or other important family figures.
                      </p>
                      <div className="bg-pink-50 p-3 rounded-lg">
                        <p className="text-sm text-pink-800">
                          <strong>Flexibility:</strong> Allow students to adapt the template to fit their unique family
                          structure.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      5
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Decorate and Personalize</h3>
                      <p className="text-gray-600 mb-3">
                        Provide time for students to decorate their family trees with colors, drawings, or family photos
                        if available. Encourage creativity and personal expression.
                      </p>
                      <div className="bg-pink-50 p-3 rounded-lg">
                        <p className="text-sm text-pink-800">
                          <strong>Extension:</strong> Students can add symbols or drawings that represent their family's
                          interests.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      6
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Share and Celebrate</h3>
                      <p className="text-gray-600 mb-3">
                        Have students share their family trees with the class, telling about their family members and
                        any special traditions or stories. Create a classroom display of all family trees.
                      </p>
                      <div className="bg-pink-50 p-3 rounded-lg">
                        <p className="text-sm text-pink-800">
                          <strong>Celebration:</strong> Emphasize the diversity and uniqueness of each family.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activity Details */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-rose-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-pink-600" />
                  Activity Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-pink-600" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm text-gray-600">45 minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-pink-600" />
                  <div>
                    <p className="font-medium">Group Size</p>
                    <p className="text-sm text-gray-600">Individual work</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-pink-600" />
                  <div>
                    <p className="font-medium">Difficulty</p>
                    <p className="text-sm text-gray-600">Beginner</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Materials Needed */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-pink-600" />
                  Materials Needed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                    <span className="text-sm">Paper</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                    <span className="text-sm">Colored pencils</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                    <span className="text-sm">Family photos (optional)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
                    <span className="text-sm">Template handout</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Family Diversity Tips */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users2 className="w-5 h-5 text-pink-600" />
                  Celebrating Family Diversity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-pink-50 p-3 rounded-lg">
                  <h4 className="font-medium text-pink-800 mb-1">Inclusive Approach</h4>
                  <p className="text-sm text-pink-700">
                    Acknowledge different family structures: single parents, grandparents as guardians, blended
                    families, adoptive families, and families with same-gender parents.
                  </p>
                </div>
                <div className="bg-rose-50 p-3 rounded-lg">
                  <h4 className="font-medium text-rose-800 mb-1">Cultural Sensitivity</h4>
                  <p className="text-sm text-rose-700">
                    Be aware that some students may not know information about all family members or may have complex
                    family situations.
                  </p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-1">Support Strategies</h4>
                  <p className="text-sm text-red-700">
                    Provide alternative options like "important people in my life" for students who may not have
                    traditional family structures.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Assessment */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-pink-600" />
                  Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Observation Checklist:</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-pink-600 rounded-full"></div>
                      <span>Identifies family members</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-pink-600 rounded-full"></div>
                      <span>Describes family relationships</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-pink-600 rounded-full"></div>
                      <span>Shows pride in family heritage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-pink-600 rounded-full"></div>
                      <span>Respects family diversity</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
          <Link to="/curriculum/grade1-subjects/activities/social-studies">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
              Back to Social Studies Activities
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button className="bg-pink-600 hover:bg-pink-700">Download Activity Guide</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
