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
import { ReactNode, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface ChatDrawerProps {
    triggerEl: ReactNode;
    open: boolean;
    onOpenchange: (aiMode: boolean) => void
}

interface Message {
    content: string;
    isUser: boolean;
}

export default function ChatDrawer({ props }: { props: ChatDrawerProps }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { content: userMessage, isUser: true }]);
        setIsLoading(true);

        try {
            const response = await fetch('https://e5a9-27-7-148-160.ngrok-free.app/api/v1/send', {
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
            <SheetContent className="flex flex-col h-full w-[600px] sm:w-[800px]">
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
                                {message.content}
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
