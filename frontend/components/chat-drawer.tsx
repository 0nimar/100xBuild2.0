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
import { ReactNode } from "react"

interface ChatDrawerProps{
    triggerEl:ReactNode;
    open:boolean;
    onOpenchange:(aiMode:boolean)=>void
}

export default function ChatDrawer({props}:{props:ChatDrawerProps}) {
  return (
    <Sheet open={props.open} onOpenChange={props.onOpenchange}>
      <SheetTrigger asChild>
        {props.triggerEl}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Intelligent Insights</SheetTitle>
          <SheetDescription>
            Talk to your insights get Intelligent suggestions for improving your website
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
            
        </div>
        <SheetFooter>
            <Input id="sheet-talk-input" defaultValue="Talk to your data" /><Button type="submit"><Send/></Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
