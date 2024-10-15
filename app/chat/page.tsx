'use client';
import React from 'react';
// import dynamic from 'next/dynamic';
import code from '@/components/editor/default-files';

import ChatBoxComponent from '@/components/chat-box';
import SandpackEditor from '@/components/editor/sandpack-editor';

import Split from 'react-split';
import { SandpackProvider } from '@/contexts/SandpackContext';

// const DynamicSplit = dynamic(() => import('react-split'), { ssr: false });

export default function ChatPage() {
  return (
    <SandpackProvider>
      <div className="h-[calc(100vh-64px)]"> {/* Assuming header height is 64px */}
        <Split
          sizes={[40, 60]}
          minSize={[200, 300]}
          expandToMin={false}
          gutterSize={10}
          gutterAlign="center"
          snapOffset={30}
          dragInterval={1}
          direction="horizontal"
          cursor="col-resize"
          className="flex h-full split-pane"
        >
          <div className="px-4 py-2 overflow-auto">
            <ChatBoxComponent />
          </div>
          <div className="p-4 overflow-auto">          
            <SandpackEditor code={code} />
          </div>
        </Split>
      </div>
    </SandpackProvider>
  );
}
