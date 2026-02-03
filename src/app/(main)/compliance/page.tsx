"use client"

import * as React from "react"
import {
    Award,
    Calendar,
    CheckCircle2,
    History,
    ShieldAlert,
    ExternalLink,
    Download,
    Play,
    AlertTriangle,
    Clock,
    FileText,
    Shield,
    RefreshCw,
    Lock
} from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
import { useAuth } from "@/components/auth/auth-provider"

const complianceStats = {
    completed: 8,
    inProgress: 2,
    upcoming: 3,
    overdue: 0,
};

const complianceCourses = [
    {
        id: 1,
        title: "Global Cybersecurity Awareness 2026",
        description: "Annual mandatory training covering phishing, data protection, and security best practices.",
        status: "In Progress",
        deadline: "Feb 15, 2026",
        daysLeft: 12,
        progress: 45,
        critical: true,
        duration: "2h 30m",
        modules: 8,
        completedModules: 4,
        category: "Security",
    },
    {
        id: 2,
        title: "Data Privacy & GDPR Framework",
        description: "Understanding GDPR requirements and data handling procedures.",
        status: "Completed",
        deadline: "Jan 10, 2026",
        progress: 100,
        critical: false,
        completionDate: "Jan 05, 2026",
        duration: "1h 45m",
        modules: 6,
        completedModules: 6,
        category: "Privacy",
        certificateId: "GDPR-2026-0142"
    },
    {
        id: 3,
        title: "Workplace Safety & Ethics",
        description: "Comprehensive guide to maintaining a safe and ethical work environment.",
        status: "Upcoming",
        deadline: "Mar 01, 2026",
        progress: 0,
        critical: false,
        duration: "1h 15m",
        modules: 5,
        completedModules: 0,
        category: "HR",
    },
    {
        id: 4,
        title: "Anti-Money Laundering (AML) Basics",
        description: "Regulatory compliance training for financial transaction awareness.",
        status: "Upcoming",
        deadline: "Mar 15, 2026",
        progress: 0,
        critical: false,
        duration: "2h 00m",
        modules: 7,
        completedModules: 0,
        category: "Finance",
    },
]

const certifications = [
    {
        name: "Certified Cloud Security Professional",
        issuer: "Enterprise Cloud Council",
        expiry: "Jan 2028",
        daysUntilExpiry: 720,
        id: "CERT-9921-X",
        image: "https://images.unsplash.com/photo-1523240715632-d984bc3107d1?w=400&auto=format&fit=crop&q=60",
        status: "Active",
    },
    {
        name: "Advanced React Architect",
        issuer: "Internal L&D",
        expiry: "N/A",
        id: "INT-REACT-01",
        image: "https://images.unsplash.com/photo-1496065187959-7f07b8353c55?w=400&auto=format&fit=crop&q=60",
        status: "Active",
    },
    {
        name: "GDPR Data Protection Officer",
        issuer: "EU Compliance Board",
        expiry: "Jun 2026",
        daysUntilExpiry: 150,
        id: "GDPR-DPO-445",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&auto=format&fit=crop&q=60",
        status: "Expiring Soon",
    }
]

export default function CompliancePage() {
    const { user } = useAuth();

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed": return "text-green-500 bg-green-500/10 border-green-500/20";
            case "In Progress": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
            case "Upcoming": return "text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20";
            case "Overdue": return "text-red-500 bg-red-500/10 border-red-500/20";
            default: return "text-muted-foreground bg-white/5 border-white/10";
        }
    };

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 mesh-gradient min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-amber-500 to-accent-vibrant">
                        Compliance & Certifications
                    </h2>
                    <p className="text-muted-foreground">
                        Manage mandatory training and professional credentials, {user?.name?.split(' ')[0] || "Learner"}.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="glass border-white/10">
                        <History className="mr-2 h-4 w-4" /> Training History
                    </Button>
                    <Button className="bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                        <ShieldAlert className="mr-2 h-4 w-4" /> View Audit Log
                    </Button>
                </div>
            </div>

            {/* Critical Alert */}
            <Alert className="bg-red-500/10 border-red-500/30 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-500/10 blur-[60px] rounded-full" />
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <AlertTitle className="text-red-500 font-bold">Action Required</AlertTitle>
                <AlertDescription className="text-red-400/80">
                    You have <strong className="text-red-500">1 critical</strong> compliance deadline approaching in 12 days.
                    Failure to complete may affect your enterprise access privileges.
                </AlertDescription>
            </Alert>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                {[
                    { label: "Completed", value: complianceStats.completed, icon: CheckCircle2, color: "text-green-500" },
                    { label: "In Progress", value: complianceStats.inProgress, icon: Clock, color: "text-amber-500" },
                    { label: "Upcoming", value: complianceStats.upcoming, icon: Calendar, color: "text-accent-cyan" },
                    { label: "Overdue", value: complianceStats.overdue, icon: AlertTriangle, color: complianceStats.overdue > 0 ? "text-red-500" : "text-green-500" },
                ].map((stat) => (
                    <Card key={stat.label} className="glass border-none">
                        <CardContent className="pt-6 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{stat.label}</p>
                                <p className="text-3xl font-black mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Compliance Courses */}
            <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-accent-vibrant" /> Mandatory Training
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                    {complianceCourses.map((course) => (
                        <Card key={course.id} className={`glass border-none relative overflow-hidden group ${course.critical ? 'ring-1 ring-red-500/30' : ''}`}>
                            {course.critical && (
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-amber-500" />
                            )}
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <Badge variant="outline" className="text-[9px]">{course.category}</Badge>
                                            <Badge className={getStatusColor(course.status)}>
                                                {course.status}
                                            </Badge>
                                            {course.critical && (
                                                <Badge className="bg-red-500/20 text-red-500 border-none text-[9px]">
                                                    <AlertTriangle className="h-2.5 w-2.5 mr-1" /> Critical
                                                </Badge>
                                            )}
                                        </div>
                                        <CardTitle className="text-base">{course.title}</CardTitle>
                                        <CardDescription className="text-xs mt-1 line-clamp-2">{course.description}</CardDescription>
                                    </div>
                                    {course.daysLeft && (
                                        <div className="text-right shrink-0">
                                            <div className={`text-2xl font-black ${course.daysLeft <= 14 ? 'text-red-500' : 'text-amber-500'}`}>
                                                {course.daysLeft}
                                            </div>
                                            <p className="text-[9px] text-muted-foreground uppercase">days left</p>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.duration}</span>
                                    <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {course.completedModules}/{course.modules} modules</span>
                                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Due: {course.deadline}</span>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-muted-foreground">Progress</span>
                                        <span className="font-bold">{course.progress}%</span>
                                    </div>
                                    <Progress value={course.progress} className="h-2 bg-white/5">
                                        <div
                                            className={`h-full rounded-full transition-all ${course.status === 'Completed' ? 'bg-green-500' :
                                                course.critical ? 'bg-gradient-to-r from-red-500 to-amber-500' : 'bg-accent-vibrant'
                                                }`}
                                            style={{ width: `${course.progress}%` }}
                                        />
                                    </Progress>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    {course.status === 'Completed' ? (
                                        <>
                                            <div className="text-[10px] text-muted-foreground">
                                                Completed: {course.completionDate}
                                            </div>
                                            <Button size="sm" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 text-[10px] h-8">
                                                <Award className="h-3 w-3 mr-1" /> View Certificate
                                            </Button>
                                        </>
                                    ) : course.status === 'Upcoming' ? (
                                        <>
                                            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                <Lock className="h-3 w-3" /> Available soon
                                            </div>
                                            <Button size="sm" variant="outline" className="text-[10px] h-8 border-white/10" disabled>
                                                Start Training
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-[10px] text-muted-foreground">
                                                ~{Math.ceil((100 - course.progress) / 20 * 30)}min remaining
                                            </div>
                                            <Button size="sm" className={`text-[10px] h-8 ${course.critical ? 'bg-red-500 hover:bg-red-600' : 'bg-accent-vibrant hover:bg-accent-vibrant/90'}`}>
                                                <Play className="h-3 w-3 mr-1 fill-current" /> Resume Training
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Professional Certifications */}
            <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-500" /> Professional Wallet
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                    {certifications.map((cert) => (
                        <Card key={cert.id} className="glass border-none overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                            <div className="relative h-28 overflow-hidden">
                                <Image
                                    src={cert.image}
                                    alt={cert.name}
                                    fill
                                    className="object-cover opacity-40 group-hover:opacity-60 transition-opacity group-hover:scale-110 duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                <div className="absolute bottom-3 left-3 right-3">
                                    <Badge className={cert.status === 'Expiring Soon' ? 'bg-amber-500/20 text-amber-500' : 'bg-green-500/20 text-green-500'}>
                                        {cert.status}
                                    </Badge>
                                </div>
                                <div className="absolute top-3 right-3">
                                    <Badge variant="outline" className="text-[8px] bg-black/50 backdrop-blur-sm border-white/20">
                                        {cert.id}
                                    </Badge>
                                </div>
                            </div>
                            <CardHeader className="pb-2 pt-4">
                                <CardTitle className="text-sm font-bold leading-tight">{cert.name}</CardTitle>
                                <CardDescription className="text-[11px]">{cert.issuer}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between text-[10px]">
                                    <span className="text-muted-foreground">Expires</span>
                                    <span className={`font-bold ${cert.status === 'Expiring Soon' ? 'text-amber-500' : 'text-white'}`}>
                                        {cert.expiry}
                                    </span>
                                </div>
                                {cert.status === 'Expiring Soon' && (
                                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                        <p className="text-[9px] text-amber-500 flex items-center gap-1">
                                            <RefreshCw className="h-3 w-3" /> Renewal recommended within {cert.daysUntilExpiry} days
                                        </p>
                                    </div>
                                )}
                                <div className="flex gap-2 pt-1">
                                    <Button variant="outline" size="sm" className="flex-1 text-[10px] h-8 border-white/10">
                                        <Download className="h-3 w-3 mr-1" /> PDF
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1 text-[10px] h-8 border-white/10 text-accent-cyan">
                                        <ExternalLink className="h-3 w-3 mr-1" /> Verify
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
