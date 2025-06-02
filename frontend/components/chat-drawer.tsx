"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Send } from "lucide-react"
import { ReactNode, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface Message {
    content: string;
    isUser: boolean;
}

const formatMessage = (content: string) => {
    // Split content into lines
    const lines = content.split('\n');
    
    return lines.map((line, index) => {
        // Handle bold text
        let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Handle italic text
        formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Handle bullet points
        if (line.trim().startsWith('* ')) {
            formattedLine = `<li>${formattedLine.substring(2)}</li>`;
        }
        
        // Handle headers
        if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
            formattedLine = `<h3 class="font-bold text-lg mb-2">${line.replace(/\*\*/g, '')}</h3>`;
        }
        
        return <div key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
    });
};

interface ChatDrawerProps {
    triggerEl: ReactNode;
    open: boolean;
    onOpenchange: (aiMode: boolean) => void
}

export default function ChatDrawer({ props }: { props: ChatDrawerProps }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const [error, setError] = useState<string | null>(null)
    const fetchChatHistory = async () => {
    try {
      setError(null)
      const response = await fetch('https://one00xbuild2-0.onrender.com/api/v1/chat/history')
      if (!response.ok) {
        throw new Error('Failed to fetch domains')
      }
      const responseData = await response.json()
      if (responseData.data){
        setMessages(responseData.data)
      }
       else {
        console.error("Invalid response format:", responseData)
        setError("Invalid response format from server")
      }
    } catch (error) {
      console.error("Failed to fetch domains:", error)
      setError("Failed to fetch domains. Please try again.")
    }
  }
useEffect(() => {
    fetchChatHistory()
  }, [])
    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { content: userMessage, isUser: true }]);
        setIsLoading(true);

        try {
            const response = await fetch('https://one00xbuild2-0.onrender.com/api/v1/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: userMessage }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Failed to get response');
            }

            setMessages(prev => [...prev, { content: data.data, isUser: false }]);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to get response from AI",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Sheet open={props.open} onOpenChange={props.onOpenchange} >
            <SheetTrigger asChild>
                {props.triggerEl}
            </SheetTrigger>
            <SheetContent className="flex flex-col !max-w-[50%]">
                <SheetHeader>
                    <SheetTitle>Intelligent Insights</SheetTitle>
                    <SheetDescription>
                        Talk to your insights get Intelligent suggestions for improving your website
                    </SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg p-3 ${
                                    message.isUser
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                }`}
                            >
                                {message.isUser ? message.content : formatMessage(message.content)}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-muted rounded-lg p-3">
                                Thinking...
                            </div>
                        </div>
                    )}
                </div>
                <SheetFooter className="mt-4">
                    <div className="flex w-full gap-2">
                        <Input
                            id="sheet-talk-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask about your data..."
                            disabled={isLoading}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
