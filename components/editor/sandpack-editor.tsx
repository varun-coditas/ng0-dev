"use client";
import React, { useState, useEffect } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useActiveCode,
  useSandpack,
} from "@codesandbox/sandpack-react";
import files from "./default-files";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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

export default function SandpackEditor() {
  const [activeView, setActiveView] = useState("editor");
  const [hasRunOnce, setHasRunOnce] = useState(false);

  let customSetup = {
    dependencies: {},
  };

  let generateCode = () => {
    // call OpenAI API based on input
    // get response
    // set files
    // get input prompt
  };

  const toggleView = () => {
    setActiveView(activeView === "editor" ? "preview" : "editor");
    if (activeView === "editor" && !hasRunOnce) {
      setHasRunOnce(true);
    }
  };

  try {
    fetch("http://localhost:5500/get-code", {
      method: "POST",
      body: JSON.stringify({ message: "ecommerce product card" }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        files["/src/app/app.component.html"] = data.code.html;
        files["/src/app/app.component.css"] = data.code.css;
        files["/src/app/app.component.ts"] = data.code.ts;
      });
  } catch (error) {
    console.error(error);
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
