'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import ReactMarkdown from 'react-markdown'
import dynamic from 'next/dynamic'
import MonacoEditor, { monaco } from 'react-monaco-editor'

// Mock function to simulate fetching problem data from a backend
const fetchProblemData = async (problem: string): Promise<string> => {
  try {
    const response = await fetch(`http://localhost:8000/api/problems/${problem}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.description;
  } catch (error) {
    console.error('Error fetching problem data:', error);
    return 'Error fetching problem data. Please try again later.';
  }
}
// const executeCode = () => {
//   alert('执行代码');
// };

const submitCode = (selectedProblem: string, code: string, problem: string) => {
  const codeData = {
    code,
    problem: selectedProblem,
  };

  fetch(`http://localhost:8000/api/submit/${problem}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(codeData),
  })
   .then(response => response.json())
   .then(result => {
      // Handle the result here, e.g., display it to the user
      console.log('Result:', result);
      // Update the judgementResult state
      setJudgeResult(result.result);
    })
   .catch(error => {
      console.error('Error:', error);
    });
};

export default function CodeEditor() {
  const [judgementResult, setJudgeResult] = useState(null);
  const [language, setLanguage] = useState('python3')
  const [selectedProblem, setSelectedProblem] = useState('')
  const [problemContent, setProblemContent] = useState('')
  const [code, setCode] = useState(`class Solution:
    def solve(self):
        # Write your code here
        pass
`)
  useEffect(() => {
    

   
    if (selectedProblem) {
      fetchProblemData(selectedProblem).then(setProblemContent)
    }
  }, [selectedProblem])
  
  return (
    <div className="h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="border-b">
        <div className="container flex items-center justify-between py-2">
          <h1 className="text-lg font-semibold">PYOJ</h1>
          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="python3">Python3</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="java">Java</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container py-4 grid grid-cols-2 gap-4">
        {/* Left Panel */}
        <div className="flex flex-col gap-4">
          <Select value={selectedProblem} onValueChange={setSelectedProblem}>
            <SelectTrigger>
              <SelectValue placeholder="选择题目" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Problem A</SelectItem>
              <SelectItem value="B">Problem B</SelectItem>
              <SelectItem value="C">Problem C</SelectItem>
              <SelectItem value="D">Problem D</SelectItem>
              <SelectItem value="E">Problem E</SelectItem>
              <SelectItem value="F">Problem F</SelectItem>
            </SelectContent>
          </Select>
          <Card className="flex-1 overflow-hidden">
            <ScrollArea className="h-[calc(100vh-200px)] p-4">
              {problemContent ? (
                <ReactMarkdown className="prose dark:prose-invert">
                  {problemContent}
                </ReactMarkdown>
              ) : (
                <p className="text-muted-foreground">Please select a problem to view its description.</p>
              )}
            </ScrollArea>
          </Card>
        </div>

        {/* Right Panel - Code Editor with Syntax Highlighting */}
        <Card className="relative overflow-hidden flex-1">

            <MonacoEditor
              language="python"
              theme="vs-dark"
              value={code}

              options={{
                selectOnLineNumbers: true,
                automaticLayout: true,
                colorDecorators: true,
              }}
              onChange={(newValue) => setCode(newValue)}
              editorDidMount={(editor) => {
                editor.focus();
              }}
            />

        </Card>
      </div>

      {/* Bottom Toolbar */}
      <footer className="border-t">
        <div className="container py-2 flex justify-between items-center">
          <div className="flex gap-2">
            {/* <Button variant="outline" size="sm" onClick={() => executeCode}>执行代码</Button> */}
            <Button variant="outline" size="sm" onClick={() => submitCode(selectedProblem, code, selectedProblem)}>提交</Button>
            
              <div className="flex-1 flex justify-center items-center">
                <div className="text-sm text-muted-foreground">
                <span>评判结果: {judgementResult}</span>
                </div>
              </div>
            
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>内存: 256MB</span>
            <span>时间限制: 1s</span>
          </div>
        </div>
      </footer>
    </div>
  )
}


