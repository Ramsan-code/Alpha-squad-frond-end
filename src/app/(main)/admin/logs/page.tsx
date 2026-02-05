"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Shield, AlertTriangle, Info, User, Lock, Download, RefreshCw, FileJson, FileType } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AuditLogs() {
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [logs, setLogs] = useState([
        { id: 1, type: "security", action: "Failed login attempt", user: "unknown", ip: "192.168.1.45", time: "2 mins ago", severity: "high" },
        { id: 2, type: "access", action: "Admin login successful", user: "admin@gmail.com", ip: "182.45.1.12", time: "15 mins ago", severity: "info" },
        { id: 3, type: "config", action: "SMTP settings updated", user: "admin@gmail.com", ip: "182.45.1.12", time: "1 hour ago", severity: "warning" },
        { id: 4, type: "data", action: "User account suspended", user: "admin@gmail.com", target: "mike@student.ai", time: "2 hours ago", severity: "warning" },
        { id: 5, type: "security", action: "API key regenerated", user: "dev_service", ip: "localhost", time: "5 hours ago", severity: "info" },
        { id: 6, type: "system", action: "Cache cleared", user: "system", ip: "internal", time: "1 day ago", severity: "info" },
    ])

    const getSeverityColor = (sev: string) => {
        switch (sev) {
            case "high": return "bg-red-500/10 text-red-500"
            case "warning": return "bg-amber-500/10 text-amber-500"
            default: return "bg-blue-500/10 text-blue-500"
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case "security": return <Lock className="h-4 w-4" />
            case "access": return <Shield className="h-4 w-4" />
            case "config": return <FileText className="h-4 w-4" />
            default: return <Info className="h-4 w-4" />
        }
    }

    const handleRefresh = () => {
        setIsRefreshing(true)
        // Simulate network request
        setTimeout(() => {
            setIsRefreshing(false)
            // Retrieve new mock logs or shuffle existing ones to simulate update
            const newLog = {
                id: Date.now(),
                type: "system",
                action: "System diagnostics run",
                user: "system",
                ip: "internal",
                time: "Just now",
                severity: "info"
            }
            setLogs([newLog, ...logs])
            toast.success("Logs Refreshed", { description: "Latest system events have been retrieved." })
        }, 1500)
    }

    const handleExportJson = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "audit_logs.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        toast.success("Export Successful", { description: "Audit logs downloaded as JSON." })
    }

    const handleExportCsv = () => {
        const headers = ["ID", "Type", "Action", "User", "IP", "Time", "Severity"];
        const rows = logs.map(log => [
            log.id,
            log.type,
            log.action,
            log.user,
            log.ip || "",
            log.time,
            log.severity
        ].join(","));

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "audit_logs.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Export Successful", { description: "Audit logs downloaded as CSV." })
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Audit Logs 📜</h1>
                    <p className="text-muted-foreground">Track all administrative actions and system events</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-white/10 hover:bg-white/5"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                    >
                        <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? "Refreshing..." : "Refresh"}
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
                                <Download className="mr-2 h-4 w-4" /> Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleExportJson}>
                                <FileJson className="mr-2 h-4 w-4" /> Export as JSON
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportCsv}>
                                <FileType className="mr-2 h-4 w-4" /> Export as CSV
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Card className="glass border-white/10 overflow-hidden">
                <CardHeader className="bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-sm font-medium">System Online</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-sm">Collecting Logs</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[600px]">
                        <div className="divide-y divide-white/10">
                            {logs.map((log) => (
                                <div key={log.id} className="p-4 hover:bg-white/5 transition-colors flex flex-col md:flex-row md:items-center gap-4">
                                    <div className={`p-2 rounded-lg ${getSeverityColor(log.severity)}`}>
                                        {getIcon(log.type)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold text-sm">{log.action}</p>
                                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider h-5">
                                                {log.type}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <User className="h-3 w-3" /> {log.user}
                                            </span>
                                            {log.ip && <span>IP: {log.ip}</span>}
                                            {log.target && <span>Target: {log.target}</span>}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">{log.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
