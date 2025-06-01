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
            size="sm" 
            onClick={() => props.setAiMode(!props.aiMode)}
            className={`fixed bottom-10 right-10 z-50 transition-all ${
              props.aiMode 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg' 
                : 'hover:bg-purple-50 hover:text-purple-600'
            }`}
          >
            <Atom className={`h-20 w-20 mr-1 ${props.aiMode ? 'animate-pulse' : ''}`} />
            AI
          </Button>
  )
}

export default ChatAction