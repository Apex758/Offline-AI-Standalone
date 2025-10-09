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
  
  standards.forEach(standard => {
    const subjectKey = standard.subject
    const gradeKey = standard.grade_level
    const strandKey = standard.strand
    
    if (!grouped[subjectKey]) {
      grouped[subjectKey] = {}
    }
    if (!grouped[subjectKey][gradeKey]) {
      grouped[subjectKey][gradeKey] = {}
    }
    if (!grouped[subjectKey][gradeKey][strandKey]) {
      grouped[subjectKey][gradeKey][strandKey] = []
    }
    
    grouped[subjectKey][gradeKey][strandKey].push(standard)
  })
  
  return grouped
}

function getUnique(arr: string[]) {
  return Array.from(new Set(arr)).sort()
}

function AccordionItem({ children, isOpen, onToggle, title, level = 1 }: {
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
  title: React.ReactNode
  level?: number
}) {
  const paddingLeft = level * 16
  
  return (
    <div className="border-b border-green-200">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors flex items-center justify-between"
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        <span className="font-medium text-green-800">{title}</span>
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {isOpen && (
        <div className="bg-green-50/30">
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
        console.log("Fetching standards from database...")
        const allStandards = await getAllCurriculumStandards()
        console.log(`Found ${allStandards.length} standards`)
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
  }, [search, subject, grade, strand, standards])

  const grouped = useMemo(() => groupStandards(filtered), [filtered])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8 text-center text-green-700">Curriculum Outcomes Database</h1>
          <div className="text-lg text-gray-600">Loading curriculum standards...</div>
        </div>
      </div>
    )
  }

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

  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'mathematics':
        return <Calculator className="h-5 w-5" />
      case 'science':
        return <Atom className="h-5 w-5" />
      case 'social studies':
        return <Globe className="h-5 w-5" />
      case 'language arts':
        return <BookOpen className="h-5 w-5" />
      default:
        return <BookOpen className="h-5 w-5" />
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-green-700">Curriculum Outcomes Database</h1>
      
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
        <div className="w-full md:w-48">
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
        <button
          onClick={() => {
            setSearch("")
            setSubject("")
            setGrade("")
            setStrand("")
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center gap-2"
        >
          <XCircle className="h-4 w-4" />
          Clear
        </button>
      </div>

      {/* Results Summary */}
      <div className="mb-6 text-center">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-green-700">{filtered.length}</span> outcomes
          {search && ` matching "${search}"`}
          {subject && ` in ${subject}`}
          {grade && ` for Grade ${grade}`}
          {strand && ` in ${strand}`}
        </p>
      </div>

      {/* Standards Display */}
      <div className="bg-white rounded-lg shadow-sm border border-green-200 overflow-hidden">
        {Object.keys(grouped).length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No curriculum standards found matching your criteria.</p>
            <p className="text-sm mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([subjectKey, grades]) => (
            <AccordionItem
              key={subjectKey}
              isOpen={openSubjects.has(subjectKey)}
              onToggle={() => toggleSubject(subjectKey)}
              title={
                <div className="flex items-center gap-3">
                  {getSubjectIcon(subjectKey)}
                  <span>{subjectKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </div>
              }
            >
              {Object.entries(grades).map(([gradeKey, strands]) => (
                <AccordionItem
                  key={`${subjectKey}-${gradeKey}`}
                  isOpen={openGrades.has(`${subjectKey}-${gradeKey}`)}
                  onToggle={() => toggleGrade(`${subjectKey}-${gradeKey}`)}
                  title={`Grade ${gradeKey}`}
                  level={2}
                >
                  {Object.entries(strands).map(([strandKey, standards]) => (
                    <AccordionItem
                      key={`${subjectKey}-${gradeKey}-${strandKey}`}
                      isOpen={openStrands.has(`${subjectKey}-${gradeKey}-${strandKey}`)}
                      onToggle={() => toggleStrand(`${subjectKey}-${gradeKey}-${strandKey}`)}
                      title={strandKey}
                      level={3}
                    >
                      <div className="space-y-3 p-4">
                        {standards.map((standard, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 border border-green-100 shadow-sm">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-green-800">{standard.code}</h4>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                {standard.subject} • Grade {standard.grade_level}
                              </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{standard.description}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionItem>
                  ))}
                </AccordionItem>
              ))}
            </AccordionItem>
          ))
        )}
      </div>
    </div>
  )
} 