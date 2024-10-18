'use client'

import React, { useState, useRef, useEffect, useContext } from 'react'
import { Paperclip, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SandpackContext } from '@/contexts/SandpackContext'

type Message = {
  id: number
  text: string
  sender: 'user' | 'ai'
  attachment?: File
}

export default function ChatBoxComponent() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [attachment, setAttachment] = useState<File | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { updateSandpackFiles, addNewComponent } = useContext(SandpackContext)

  const handleSendMessage = async () => {
    if (inputText.trim() || attachment) {
      const newMessage: Message = {
        id: Date.now(),
        text: inputText.trim(),
        sender: 'user',
        attachment: attachment || undefined,
      }
      setMessages([...messages, newMessage])
      setInputText('')
      setAttachment(null)
      
      try {
        const requestBody: { message: string; session_id?: string } = {
          message: inputText.trim(),
        }
        
        if (sessionId) {
          requestBody.session_id = sessionId
        }
        
        const response = await fetch("http://127.0.0.1:5500/get-code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch code');
        }
        
        const data = await response.json();

        // Store the session_id if it's returned and we don't have one yet
        if (data.session_id && !sessionId) {
          setSessionId(data.session_id);
        }

        const componentName = data.metadata.componentName;
        const componentSelector = data.metadata.componentSelector;
        const exampleUsage = data.metadata.exampleUsage;
        const kebabCaseName = componentName.replace(/Component$/, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        
        const htmlContent = data.code.html;
        const cssContent = data.code.css;
        const tsContent = data.code.ts;

        const newComponentFiles = {
          [`/src/app/${kebabCaseName}/${kebabCaseName}.component.html`]: htmlContent,
          [`/src/app/${kebabCaseName}/${kebabCaseName}.component.css`]: cssContent,
          [`/src/app/${kebabCaseName}/${kebabCaseName}.component.ts`]: tsContent,
        };
        
        // Add new component files and update app component
        addNewComponent(componentName, componentSelector, exampleUsage, newComponentFiles);

        // Simulate AI response
        const aiResponse: Message = {
          id: Date.now(),
          text: data.responseMessage,
          sender: 'ai',
        }
        setMessages(prevMessages => [...prevMessages, aiResponse])
      } catch (error) {
        console.error('Error fetching code:', error);
        // Add error message to chat
        const errorMessage: Message = {
          id: Date.now(),
          text: "Sorry, there was an error processing your request.",
          sender: 'ai',
        }
        setMessages(prevMessages => [...prevMessages, errorMessage])
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0])
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [inputText])

  return (
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-grow overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                <span className="font-bold">{message.sender === 'user' ? 'You: ' : 'AI: '}</span>
                {message.text}
                {message.attachment && (
                  <div className="mt-2 text-sm">
                    Attachment: {message.attachment.name}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <Textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          placeholder="Ask ng0.dev anything..."
          className="w-full min-h-[60px] resize-none rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
        />
        <div className="flex justify-between mt-2">
          <div className="flex items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              aria-label="Attach file"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach file"
            >
              <Paperclip className="h-4 w-4 mr-2" />
              Attach
            </Button>
            {attachment && (
              <span className="ml-2 text-sm text-muted-foreground">
                {attachment.name}
              </span>
            )}
          </div>
          <Button onClick={handleSendMessage} size="sm">
            <Send className="h-4 w-4 mr-2" />
            Ask
          </Button>
        </div>
      </div>
      <p className="text-xs text-center text-muted-foreground pb-2">
        ng0.dev may make mistakes. Please use with discretion.
      </p>
    </div>
  )
}
