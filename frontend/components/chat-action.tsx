"use client"
import { Atom } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
interface AiModeProps{
    aiMode:boolean;
    setAiMode:(aiMode:boolean)=>void
}
function ChatAction({props}:{props:AiModeProps}) {
    
  return (
 <Button 
            variant={props.aiMode ? "default" : "ghost"} 
            size="lg" 
            onClick={() => props.setAiMode(!props.aiMode)}
            className={`fixed bottom-10 right-10 z-50 transition-all ${
              props.aiMode 
                ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg' 
                : 'bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-indigo-200'
            }`}
          >
            <Atom className={`h-8 w-8 mr-2 ${props.aiMode ? 'animate-pulse' : ''}`} />
            <span className="text-lg font-semibold">AI Assistant</span>
          </Button>
  )
}

export default ChatAction