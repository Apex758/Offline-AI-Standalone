import { Link } from "react-router-dom"
// // // import Image from "next/image" - replaced with img tag - replaced with img tag - replaced with img tag
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { HugeiconsIcon } from '@hugeicons/react';
import ArrowLeft01IconData from '@hugeicons/core-free-icons/ArrowLeft01Icon';
import HashtagIconData from '@hugeicons/core-free-icons/HashtagIcon';
import ArrowRight01IconData from '@hugeicons/core-free-icons/ArrowRight01Icon';
import CheckmarkCircle01IconData from '@hugeicons/core-free-icons/CheckmarkCircle01Icon';
import BookOpen01IconData from '@hugeicons/core-free-icons/BookOpen01Icon';
import PenTool01IconData from '@hugeicons/core-free-icons/PenTool01Icon';
import PrinterIconData from '@hugeicons/core-free-icons/PrinterIcon';
import Download01IconData from '@hugeicons/core-free-icons/Download01Icon';
import PlayIconData from '@hugeicons/core-free-icons/PlayIcon';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const ChevronLeft: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowLeft01IconData} {...p} />;
const Hash: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={HashtagIconData} {...p} />;
const ArrowRight: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowRight01IconData} {...p} />;
const CheckCircle2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={CheckmarkCircle01IconData} {...p} />;
const BookOpen: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={BookOpen01IconData} {...p} />;
const PenTool: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PenTool01IconData} {...p} />;
const Printer: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PrinterIconData} {...p} />;
const Download: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Download01IconData} {...p} />;
const Play: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PlayIconData} {...p} />;
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion } from "@/components/ui/accordion"

export default function NumberSensePage() {
  const [resourceFilter, setResourceFilter] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render until client-side
  if (!isClient) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/curriculum/grade1-subjects/mathematics" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Mathematics
        </Link>
      </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Number Sense</h1>
          <p className="text-lg text-gray-600">
            Understanding numbers, their relationships, and how to work with them effectively.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-gray-700 mb-4">
            Number sense is the foundation of mathematical thinking. Students develop an intuitive understanding of numbers, their relationships, and how to work with them effectively.
            </p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-blue-600" />
                Counting
                </CardTitle>
              </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Learn to count accurately and understand number sequences.
              </p>
                  </CardContent>
                </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                Number Relationships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Explore how numbers relate to each other and patterns.
              </p>
                  </CardContent>
                </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Mental Math
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Develop mental calculation strategies and number fluency.
              </p>
                  </CardContent>
                </Card>
        </div>
      </div>
    </div>
  )
}
