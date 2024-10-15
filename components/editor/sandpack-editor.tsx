"use client";
import React, { useState, useEffect, useContext } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
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

  return (
    <div className="w-full h-full flex flex-col">
      <SandpackProvider
        template="angular"
        files={files}
        theme="dark"
        customSetup={customSetup}
        options={{
          showLineNumbers: true,
          autoReload: false, // Disable auto-reload
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
            <div className="w-1/2 h-full">
              <SandpackLayout className="h-full">
                <SandpackCodeEditor
                  className="h-full"
                  readOnly
                  showLineNumbers={true}
                  style={{ height: "100%" }}
                />
              </SandpackLayout>
            </div>
            <div className="w-1/2 h-full">
              <SandpackLayout className="h-full">
                <SandpackPreview
                  className="h-full"
                />
              </SandpackLayout>
            </div>
          </div>
        </div>
      </SandpackProvider>
    </div>
  );
}
