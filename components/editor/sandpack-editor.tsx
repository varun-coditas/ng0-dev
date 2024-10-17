"use client";
import React, { useState, useEffect, useContext } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
  SandpackFileExplorer,
  useActiveCode,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SandpackContext } from '@/contexts/SandpackContext';

// Custom hook to manage preview state
function usePreviewState() {
  const { sandpack } = useSandpack();
  const { code } = useActiveCode();
  const [lastRunCode, setLastRunCode] = useState(code);

  useEffect(() => {
    if (sandpack.status === "running") {
      setLastRunCode(code);
    }
  }, [sandpack.status, code]);

  return { lastRunCode, setLastRunCode };
}

interface SandpackEditorProps {
  code: Record<string, string>;
}

export default function SandpackEditor({ code }: SandpackEditorProps) {
  const [activeView, setActiveView] = useState("editor");
  const [hasRunOnce, setHasRunOnce] = useState(false);
  const { files, updateSandpackFiles } = useContext(SandpackContext);

  useEffect(() => {
    updateSandpackFiles(code);
  }, [code, updateSandpackFiles]);

  let customSetup = {
    dependencies: {},
  };

  const toggleView = () => {
    setActiveView(activeView === "editor" ? "preview" : "editor");
    if (activeView === "editor" && !hasRunOnce) {
      setHasRunOnce(true);
    }
  };

  // Get all visible files dynamically. DO NOT include app.component.ts, app.component.html, or app.component.css in the visible files.
  const visibleFiles = Object.keys(files).filter(file => 
    file.startsWith('/src/app/') && 
    (file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.ts'))
  ).filter(file => !file.endsWith('app.component.ts') && !file.endsWith('app.component.css'));
  console.log(visibleFiles);
  if(visibleFiles.length === 1) {
    visibleFiles.push('/src/app/app.component.ts');
    visibleFiles.push('/src/app/app.component.css');
  }

  return (
    <div className="w-full h-full flex flex-col">
      <SandpackProvider
        template="angular"
        files={files}
        theme="dark"
        customSetup={customSetup}
        options={{
          showLineNumbers: true,
          autoReload: true,
          visibleFiles: visibleFiles,
        }}
      >
        <div className="p-2 flex items-center space-x-2">
          <Label htmlFor="view-toggle" className="text-sm font-medium">
            {activeView === "editor" ? "Editor" : "Preview"}
          </Label>
          <Switch
            id="view-toggle"
            checked={activeView === "preview"}
            onCheckedChange={toggleView}
          />
        </div>
        <div className="flex-grow relative overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out h-full"
            style={{
              transform: `translateX(${
                activeView === "editor" ? "0%" : "-50%"
              })`,
              width: "200%",
            }}
          >
            <div className="w-1/2">
            {/* <SandpackFileExplorer/> */}
              <SandpackCodeEditor
                readOnly
                showLineNumbers={true}
                style={{ height: "100%" }}
              />
            </div>
            <div className="w-1/2">
              <SandpackLayout style={{ height: "100%" }}>
                <SandpackPreview
                  style={{ height: "100%" }}
                />
              </SandpackLayout>
            </div>
          </div>
        </div>
      </SandpackProvider>
    </div>
  );
}
