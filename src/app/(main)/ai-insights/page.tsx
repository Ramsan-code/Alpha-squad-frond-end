"use client"

import * as React from "react"
import { Zap, Brain, Sparkles, MessageSquare, TrendingUp, Lightbulb, Target, BookOpen, Clock, ArrowRight, RefreshCw, ThumbsUp, ThumbsDown, Send, Bot, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/auth/auth-provider";

const aiInsights = [
    {
        id: 1,
        type: "Skill Gap",
        title: "State Management Patterns",
        description: "Your quiz scores indicate confusion between Context API and global state libraries. We recommend reviewing 'Zustand vs Redux Toolkit' in Module 4.",
        recommendation: "Take the 15-minute micro-lesson on state patterns",
        impact: "High",
        confidence: 94,
        icon: Brain,
        color: "accent-vibrant",
        actionLabel: "Start Lesson"
    },
    {
        id: 2,
        type: "Market Trend",
        title: "Server Components Demand +40%",
        description: "Enterprise job postings requiring React Server Components expertise increased by 40% this quarter. You're 75% through this track.",
        recommendation: "Complete remaining 3 lessons to unlock certificate",
        impact: "High",
        confidence: 89,
        icon: TrendingUp,
        color: "accent-cyan",
        actionLabel: "Continue Path"
    },
    {
        id: 3,
        type: "Learning Style",
        title: "Visual Learning Detected",
        description: "Based on your engagement patterns, you retain 35% more when content includes diagrams. We've curated video-first alternatives for your next module.",
        recommendation: "Switch to Visual Mode for Module 5",
        impact: "Medium",
        confidence: 87,
        icon: Lightbulb,
        color: "amber-500",
        actionLabel: "Enable Visual Mode"
    },
    {
        id: 4,
        type: "Goal Alignment",
        title: "Career Path Progress",
        description: "You're on track to complete 'Senior Frontend Architect' by March 2026. Current pace: +2 weeks ahead of schedule.",
        recommendation: "Maintain 4h/week to stay ahead",
        impact: "Low",
        confidence: 92,
        icon: Target,
        color: "green-500",
        actionLabel: "View Roadmap"
    }
];

const chatMessages = [
    { role: "assistant", content: "Hi Alex! I noticed you spent extra time on the Server Actions lesson. Would you like me to explain the difference between Server Actions and API Routes?" },
    { role: "user", content: "Yes, I'm confused about when to use each one." },
    { role: "assistant", content: "Great question! Server Actions are best for form submissions and mutations that require server-side validation. They're simpler and don't require creating separate API endpoints. API Routes give you more control and are better for complex authentication flows or when you need to expose endpoints to external clients. Should I show you a practical comparison?" },
];

export default function AIInsightsPage() {
    const { user } = useAuth();
    const [inputValue, setInputValue] = React.useState("");
    const [isTyping, setIsTyping] = React.useState(false);

    const handleSend = () => {
        if (inputValue.trim()) {
            setInputValue("");
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 2000);
        }
    };

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 mesh-gradient min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-accent-vibrant via-accent-cyan to-white">
                            AI Learning Assistant
                        </h2>
                        <Badge className="bg-accent-vibrant/10 text-accent-vibrant border-accent-vibrant/20 animate-pulse">
                            <Sparkles className="h-3 w-3 mr-1" /> Live
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">
                        Personalized intelligence powered by your learning patterns, {user?.name?.split(' ')[0] || "Learner"}.
                    </p>
                </div>
                <Button variant="outline" className="glass border-white/10 group">
                    <RefreshCw className="mr-2 h-4 w-4 group-hover:animate-spin" /> Refresh Analysis
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                {[
                    { label: "Insights Generated", value: "24", sub: "This week", icon: Sparkles, color: "text-accent-vibrant" },
                    { label: "Skill Gaps Found", value: "3", sub: "2 resolved", icon: Brain, color: "text-accent-cyan" },
                    { label: "Hours Optimized", value: "8.5h", sub: "vs avg learner", icon: Clock, color: "text-green-500" },
                    { label: "Goal Alignment", value: "94%", sub: "On track", icon: Target, color: "text-amber-500" },
                ].map((stat) => (
                    <Card key={stat.label} className="glass border-none relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <stat.icon className="h-20 w-20" />
                        </div>
                        <CardContent className="pt-6">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{stat.label}</p>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-2xl font-black">{stat.value}</span>
                                <span className="text-[10px] text-muted-foreground">{stat.sub}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Insights Grid */}
            <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-accent-vibrant" /> Active Insights
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                    {aiInsights.map((insight) => (
                        <Card key={insight.id} className="glass border-none group hover:scale-[1.02] transition-all duration-300 overflow-hidden relative">
                            <div className={`absolute top-0 left-0 w-1 h-full bg-${insight.color}`} />
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2.5 rounded-xl bg-${insight.color}/10 shrink-0`}>
                                            <insight.icon className={`h-5 w-5 text-${insight.color}`} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className="text-[9px] text-muted-foreground">{insight.type}</Badge>
                                                <Badge className={`bg-${insight.color}/10 text-${insight.color} border-none text-[8px]`}>
                                                    {insight.impact} IMPACT
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-base">{insight.title}</CardTitle>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className={`text-lg font-black text-${insight.color}`}>{insight.confidence}%</div>
                                        <p className="text-[8px] text-muted-foreground uppercase">Confidence</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Recommendation</p>
                                    <p className="text-xs text-white">{insight.recommendation}</p>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] text-muted-foreground hover:text-green-500">
                                            <ThumbsUp className="h-3 w-3 mr-1" /> Helpful
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] text-muted-foreground hover:text-red-500">
                                            <ThumbsDown className="h-3 w-3 mr-1" /> Not relevant
                                        </Button>
                                    </div>
                                    <Button size="sm" className={`bg-${insight.color}/10 text-${insight.color} hover:bg-${insight.color}/20 text-[10px] h-8`}>
                                        {insight.actionLabel} <ArrowRight className="h-3 w-3 ml-1" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* AI Chat Section */}
            <Card className="glass border-accent-vibrant/20 overflow-hidden relative">
                <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-accent-vibrant/10 blur-[120px] rounded-full" />
                <div className="absolute -left-32 -top-32 w-96 h-96 bg-accent-cyan/10 blur-[120px] rounded-full" />
                <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-accent-vibrant/10">
                                <Bot className="h-5 w-5 text-accent-vibrant" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">AI Tutor Chat</CardTitle>
                                <CardDescription>Ask anything about your courses, career path, or learning strategy.</CardDescription>
                            </div>
                        </div>
                        <Badge className="bg-green-500/10 text-green-500 border-none">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" /> Online
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="relative space-y-4">
                    {/* Chat Messages */}
                    <div className="h-64 overflow-y-auto space-y-4 p-4 rounded-xl bg-black/40 border border-white/5">
                        {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`p-2 rounded-full shrink-0 ${msg.role === 'assistant' ? 'bg-accent-vibrant/10' : 'bg-accent-cyan/10'}`}>
                                    {msg.role === 'assistant' ? (
                                        <Bot className="h-4 w-4 text-accent-vibrant" />
                                    ) : (
                                        <User className="h-4 w-4 text-accent-cyan" />
                                    )}
                                </div>
                                <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'assistant'
                                        ? 'bg-white/5 rounded-tl-sm'
                                        : 'bg-accent-cyan/10 rounded-tr-sm'
                                    }`}>
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-full bg-accent-vibrant/10">
                                    <Bot className="h-4 w-4 text-accent-vibrant" />
                                </div>
                                <div className="bg-white/5 p-3 rounded-2xl rounded-tl-sm">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-accent-vibrant rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-accent-vibrant rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-accent-vibrant rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="flex gap-3">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about your learning journey..."
                            className="flex-1 glass border-white/10 h-12 px-4"
                        />
                        <Button
                            onClick={handleSend}
                            className="bg-accent-vibrant hover:bg-accent-vibrant/90 text-white h-12 px-6 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Quick Prompts */}
                    <div className="flex flex-wrap gap-2">
                        {[
                            "Explain Server Components",
                            "Suggest next course",
                            "Review my progress",
                            "Career advice"
                        ].map((prompt) => (
                            <Button
                                key={prompt}
                                variant="outline"
                                size="sm"
                                className="text-[10px] h-7 glass border-white/10 hover:border-accent-vibrant/50"
                                onClick={() => setInputValue(prompt)}
                            >
                                {prompt}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
