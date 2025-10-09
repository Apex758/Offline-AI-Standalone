"use client"
import { useState, useMemo, useEffect } from "react"
import { BookOpen, Calculator, Atom, Globe, XCircle, ChevronDown, ChevronRight } from "lucide-react"
import { getAllCurriculumStandards } from "@/app/actions/curriculum-standards"

export const dynamic = "force-dynamic"

interface CurriculumStandard {
  subject: string
  grade_level: string
  strand: string
  code: string
  description: string
}



function groupStandards(standards: CurriculumStandard[]) {
  const grouped: Record<string, Record<string, Record<string, CurriculumStandard[]>>> = {}
  for (const s of standards) {
    if (!grouped[s.subject]) grouped[s.subject] = {}
    if (!grouped[s.subject][s.grade_level]) grouped[s.subject][s.grade_level] = {}
    if (!grouped[s.subject][s.grade_level][s.strand]) grouped[s.subject][s.grade_level][s.strand] = []
    grouped[s.subject][s.grade_level][s.strand].push(s)
  }
  return grouped
}

const subjectIcons: Record<string, React.ReactNode> = {
  "language-arts": <BookOpen className="inline-block mr-2 text-pink-600" size={20} />,
  "mathematics": <Calculator className="inline-block mr-2 text-blue-600" size={20} />,
  "science": <Atom className="inline-block mr-2 text-green-600" size={20} />,
  "social-studies": <Globe className="inline-block mr-2 text-yellow-600" size={20} />,
}

function getUnique(arr: string[]) {
  return Array.from(new Set(arr)).sort()
}

// Custom Accordion Components
function AccordionItem({ children, isOpen, onToggle, title, level = 1 }: {
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
  title: React.ReactNode
  level?: number
}) {
  const bgColors = ["bg-white", "bg-gray-50", "bg-gray-100"]
  const textSizes = ["text-2xl", "text-xl", "text-lg"]
  const fontWeights = ["font-bold", "font-semibold", "font-medium"]
  
  return (
    <div className={`border border-gray-200 rounded-lg ${bgColors[level - 1] || "bg-white"}`}>
      <button
        onClick={onToggle}
        className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${textSizes[level - 1] || "text-lg"} ${fontWeights[level - 1] || "font-medium"} text-green-700`}
      >
        <span>{title}</span>
        {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  )
}

export default function AllCurriculumStandardsPage() {
  const [search, setSearch] = useState("")
  const [subject, setSubject] = useState("")
  const [grade, setGrade] = useState("")
  const [strand, setStrand] = useState("")
  const [standards, setStandards] = useState<CurriculumStandard[]>([])
  const [loading, setLoading] = useState(true)
  
  // State for accordion management
  const [openSubjects, setOpenSubjects] = useState<Set<string>>(new Set())
  const [openGrades, setOpenGrades] = useState<Set<string>>(new Set())
  const [openStrands, setOpenStrands] = useState<Set<string>>(new Set())

  // Fetch standards from database
  useEffect(() => {
    async function fetchStandards() {
      try {
        const allStandards = await getAllCurriculumStandards()
        setStandards(allStandards)
      } catch (error) {
        console.error('Error fetching standards:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStandards()
  }, [])

  const subjects = useMemo(() => getUnique(standards.map(s => s.subject)), [standards])
  const grades = useMemo(() => getUnique(standards.map(s => s.grade_level)), [standards])
  const strands = useMemo(() => getUnique(standards.map(s => s.strand)), [standards])

  const filtered = useMemo(() => {
    return standards.filter(s => {
      const matchesSearch =
        !search ||
        s.code.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()) ||
        s.strand.toLowerCase().includes(search.toLowerCase())
      const matchesSubject = !subject || s.subject === subject
      const matchesGrade = !grade || s.grade_level === grade
      const matchesStrand = !strand || s.strand === strand
      return matchesSearch && matchesSubject && matchesGrade && matchesStrand
    })
  }, [search, subject, grade, strand])

  const grouped = useMemo(() => groupStandards(filtered), [filtered])

  const toggleSubject = (subjectKey: string) => {
    const newOpen = new Set(openSubjects)
    if (newOpen.has(subjectKey)) {
      newOpen.delete(subjectKey)
    } else {
      newOpen.add(subjectKey)
    }
    setOpenSubjects(newOpen)
  }

  const toggleGrade = (gradeKey: string) => {
    const newOpen = new Set(openGrades)
    if (newOpen.has(gradeKey)) {
      newOpen.delete(gradeKey)
    } else {
      newOpen.add(gradeKey)
    }
    setOpenGrades(newOpen)
  }

  const toggleStrand = (strandKey: string) => {
    const newOpen = new Set(openStrands)
    if (newOpen.has(strandKey)) {
      newOpen.delete(strandKey)
    } else {
      newOpen.add(strandKey)
    }
    setOpenStrands(newOpen)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8 text-center text-green-700">Specific Curriculum Outcomes Database</h1>
          <div className="text-lg text-gray-600">Loading curriculum standards...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-green-700">Specific Curriculum Outcomes Database</h1>
      
      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-8 bg-green-50 rounded-lg p-6 shadow-sm border border-green-200">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2 text-green-700">Search Outcomes</label>
          <input
            type="text"
            placeholder="Search by code, description, or strand..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="w-full md:w-48">
          <label className="block text-sm font-medium mb-2 text-green-700">Subject</label>
          <select 
            value={subject || "all"} 
            onChange={e => setSubject(e.target.value === "all" ? "" : e.target.value)}
            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subj => (
              <option key={subj} value={subj}>
                {subj.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-32">
          <label className="block text-sm font-medium mb-2 text-green-700">Grade</label>
          <select 
            value={grade || "all"} 
            onChange={e => setGrade(e.target.value === "all" ? "" : e.target.value)}
            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Grades</option>
            {grades.map(g => (
              <option key={g} value={g}>Grade {g}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-56">
          <label className="block text-sm font-medium mb-2 text-green-700">Strand</label>
          <select 
            value={strand || "all"} 
            onChange={e => setStrand(e.target.value === "all" ? "" : e.target.value)}
            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Strands</option>
            {strands.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            className="h-10 px-4 py-2 mt-6 text-green-700 border border-green-300 rounded-md hover:bg-green-100 transition-colors flex items-center"
            onClick={() => { setSearch(""); setSubject(""); setGrade(""); setStrand(""); }}
          >
            <XCircle className="mr-2" size={16} /> Clear
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6 text-center">
        <p className="text-lg text-gray-600">
          Showing <span className="font-bold text-green-700">{filtered.length}</span> outcomes across{" "}
          <span className="font-bold text-green-700">{Object.keys(grouped).length}</span> subjects
        </p>
      </div>

      {/* Standards Display */}
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center text-gray-500 mt-16 py-12 bg-gray-50 rounded-lg">
          <p className="text-xl">No standards found matching your criteria.</p>
          <p className="text-sm mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([subjectKey, grades]) => (
            <AccordionItem
              key={subjectKey}
              isOpen={openSubjects.has(subjectKey)}
              onToggle={() => toggleSubject(subjectKey)}
              title={
                <span className="flex items-center">
                  {subjectIcons[subjectKey] || null}
                  {subjectKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    ({Object.values(grades).flatMap(strands => Object.values(strands).flat()).length} standards)
                  </span>
                </span>
              }
              level={1}
            >
              <div className="space-y-3">
                {Object.entries(grades).map(([gradeKey, strands]) => (
                  <AccordionItem
                    key={`${subjectKey}-${gradeKey}`}
                    isOpen={openGrades.has(`${subjectKey}-${gradeKey}`)}
                    onToggle={() => toggleGrade(`${subjectKey}-${gradeKey}`)}
                    title={
                      <span>
                        Grade {gradeKey}
                        <span className="ml-2 text-sm font-normal text-gray-600">
                          ({Object.values(strands).flat().length} standards)
                        </span>
                      </span>
                    }
                    level={2}
                  >
                    <div className="space-y-2">
                      {Object.entries(strands).map(([strandKey, standardsList]) => (
                        <AccordionItem
                          key={`${subjectKey}-${gradeKey}-${strandKey}`}
                          isOpen={openStrands.has(`${subjectKey}-${gradeKey}-${strandKey}`)}
                          onToggle={() => toggleStrand(`${subjectKey}-${gradeKey}-${strandKey}`)}
                          title={
                            <span>
                              {strandKey}
                              <span className="ml-2 text-sm font-normal text-gray-600">
                                ({standardsList.length} standards)
                              </span>
                            </span>
                          }
                          level={3}
                        >
                          <div className="space-y-3">
                            {standardsList.map((standard) => (
                              <div key={standard.code} className="p-3 bg-white rounded border border-gray-200 hover:bg-green-50 transition-colors">
                                <div className="flex items-start gap-3">
                                  <span className="inline-block px-2 py-1 text-xs font-mono bg-gray-100 text-gray-700 rounded">
                                    {standard.code}
                                  </span>
                                  <div className="flex-1">
                                    <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                                      {standard.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionItem>
                      ))}
                    </div>
                  </AccordionItem>
                ))}
              </div>
            </AccordionItem>
          ))}
        </div>
      )}
    </div>
  )
}