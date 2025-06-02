import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bot, User, Clock, TrendingUp, Users, Home, Shield, Briefcase } from 'lucide-react';

const ChatInterface = () => {
  // Mock data based on your backend response
  const analyticsData = {
    "Executive Summary": [
      "The '/dashboard' page is the most visited, with 31 views, indicating it's a key area for users.",
      "Other popular pages include '/privacy' (26 views), '/about' (25 views), and '/careers' (25 views), suggesting user interest in these topics.",
      "The least visited page is the home page '/' (13 views), which may indicate users are landing directly on deeper pages from external links."
    ],
    "Detailed Analysis": {
      "Top Pages": [
        { "page": "/dashboard", "views": 31 },
        { "page": "/privacy", "views": 26 },
        { "page": "/about", "views": 25 },
        { "page": "/careers", "views": 25 }
      ]
    }
  };

  const [messages] = useState([
    {
      isUser: true,
      content: "Can you analyze our website traffic data?",
      timestamp: "2:34 PM"
    },
    {
      isUser: false,
      content: "I've analyzed your website traffic data. Here are the key insights:",
      timestamp: "2:35 PM",
      hasAnalytics: true,
      analyticsData: analyticsData
    },
    {
      isUser: true,
      content: "What should we focus on first?",
      timestamp: "2:36 PM"
    },
    {
      isUser: false,
      content: "Based on the data, I recommend focusing on the dashboard experience first since it's your most visited page. Then optimize your homepage to better capture and direct traffic.",
      timestamp: "2:36 PM"
    }
  ]);

  const getPageIcon = (page) => {
    switch (page) {
      case '/dashboard': return <TrendingUp className="w-4 h-4" />;
      case '/privacy': return <Shield className="w-4 h-4" />;
      case '/about': return <Users className="w-4 h-4" />;
      case '/careers': return <Briefcase className="w-4 h-4" />;
      case '/': return <Home className="w-4 h-4" />;
      default: return <div className="w-4 h-4 rounded-full bg-muted" />;
    }
  };

  const formatPageName = (page) => {
    if (page === '/') return 'Homepage';
    return page.replace('/', '').charAt(0).toUpperCase() + page.slice(2);
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[600px] border rounded-lg bg-background">
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/api/placeholder/32/32" />
            <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">Analytics Assistant</h3>
            <p className="text-sm text-muted-foreground">AI-powered data insights</p>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4 h-[500px]">
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <Avatar className="w-8 h-8 mt-1">
                <AvatarFallback className={message.isUser ? "bg-primary text-primary-foreground" : "bg-muted"}>
                  {message.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              
              <div className={`flex flex-col gap-2 max-w-[80%] ${message.isUser ? 'items-end' : 'items-start'}`}>
                <Card className={`${message.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted/30'}`}>
                  <CardContent className="p-3">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </CardContent>
                </Card>
                
                {message.hasAnalytics && (
                  <Card className="w-full mt-2 border-l-4 border-l-primary">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <h4 className="font-semibold">Analytics Report</h4>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium mb-2 text-sm">Executive Summary</h5>
                          <div className="space-y-2">
                            {message.analyticsData["Executive Summary"].map((summary, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h5 className="font-medium mb-3 text-sm">Top Performing Pages</h5>
                          <div className="grid gap-2">
                            {message.analyticsData["Detailed Analysis"]["Top Pages"].map((page, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                                <div className="flex items-center gap-2">
                                  {getPageIcon(page.page)}
                                  <span className="text-sm font-medium">{formatPageName(page.page)}</span>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {page.views} views
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{message.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatInterface;