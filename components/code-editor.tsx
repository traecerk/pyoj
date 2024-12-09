"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import MonacoEditor from "@monaco-editor/react"; // Ensure you import MonacoEditor correctly

const fetchProblemData = async (problem: string): Promise<string> => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/problems/${problem}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.description;
  } catch (error) {
    console.error("Error fetching problem data:", error);
    return "Error fetching problem data. Please try again later.";
  }
};

const submitCode = (
  selectedProblem: string,
  code: string,
  problem: string,
  setJudgementResult: (result: string) => void
) => {
  const codeData = {
    code,
    problem: selectedProblem,
  };

  fetch(`http://localhost:8000/api/submit/${problem}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(codeData),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Result:", result);
      setJudgementResult(result.result);
    })
    .catch((error) => {
      console.error("Error:", error);
      setJudgementResult("无法评判代码，请稍后再试。");
    });
};

export default function CodeEditor() {
  const [judgementResult, setJudgementResult] = useState<string | null>(null);
  const [language, setLanguage] = useState("python");
  const [selectedProblem, setSelectedProblem] = useState("");
  const [problemContent, setProblemContent] = useState<string | undefined>("");
  const [code, setCode] = useState(`class Solution:
    def solve(self):
        # Write your code here
        pass
`);

  useEffect(() => {
    if (selectedProblem) {
      fetchProblemData(selectedProblem).then((data) => {
        setProblemContent(data || "");
      });
    }
  }, [selectedProblem]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Top Navigation */}
      <header className="border-b flex-shrink-0">
        <div className="w-full px-4 flex items-center justify-between py-2">
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
      <div className="flex-grow grid grid-cols-2 gap-4 overflow-hidden">
        {/* Left Panel */}
        <div className="flex flex-col gap-4 overflow-hidden h-full">
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
          <Card className="flex-grow overflow-hidden h-full">
            <ScrollArea className="h-full p-4">
              {problemContent ? (
                <ReactMarkdown className="prose dark:prose-invert">
                  {problemContent}
                </ReactMarkdown>
              ) : (
                <p className="text-muted-foreground">
                  Please select a problem to view its description.
                </p>
              )}
            </ScrollArea>
          </Card>
        </div>

        {/* Right Panel - Code Editor with Syntax Highlighting */}
        <Card className="overflow-hidden flex-grow h-full">
          <MonacoEditor
            language={language} // 动态设置语言
            theme="vs-dark"
            value={code}
            options={{
              selectOnLineNumbers: true,
              automaticLayout: true,
              colorDecorators: true,
            }}
            onChange={(newValue) => setCode(newValue || "")} // 处理 newValue 可能为 undefined 的情况
            onMount={(editor) => {
              editor.focus();
            }}
            className="h-full"
          />
        </Card>
      </div>

      {/* Bottom Toolbar */}
      <footer className="border-t flex-shrink-0">
        <div className="w-full px-4 flex items-center justify-between py-2">
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                submitCode(
                  selectedProblem,
                  code,
                  selectedProblem,
                  setJudgementResult
                )
              }
            >
              提交
            </Button>

            <div className="text-sm text-muted-foreground">
              <span>评判结果: {judgementResult}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>内存: 256MB</span>
            <span>时间限制: 1s</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
