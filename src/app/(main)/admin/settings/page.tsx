"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Shield, Bell, Globe, Save, Lock, Database, Mail, RefreshCw, Trash2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SystemSettings() {
    const [isSaving, setIsSaving] = useState(false)
    const [isTestingSmtp, setIsTestingSmtp] = useState(false)
    const [isClearingCache, setIsClearingCache] = useState(false)

    const handleSaveChanges = () => {
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            toast.success("Settings Saved", { description: "Your system configuration has been updated." })
        }, 1500)
    }

    const handleTestSmtp = () => {
        setIsTestingSmtp(true)
        toast.info("Testing Connection", { description: "Attempting to reach SMTP server..." })
        setTimeout(() => {
            setIsTestingSmtp(false)
            const success = Math.random() > 0.2
            if (success) {
                toast.success("Connection Successful", { description: "SMTP server is reachable and responding." })
            } else {
                toast.error("Connection Failed", { description: "Could not connect to SMTP host. Check credentials." })
            }
        }, 2000)
    }

    const handleClearCache = () => {
        setIsClearingCache(true)
        toast.loading("Clearing System Cache...")
        setTimeout(() => {
            setIsClearingCache(false)
            toast.dismiss()
            toast.success("Cache Cleared", { description: "System cache has been successfully purged." })
        }, 2000)
    }

    const handlePurgeLogs = () => {
        toast.error("Logs Purged", { description: "All audit logs have been permanently deleted." })
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">System Settings ⚙️</h1>
                <p className="text-muted-foreground">Configure your platform preferences and security</p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="bg-white/5 border border-white/10 p-1">
                    <TabsTrigger value="general" className="data-[state=active]:bg-accent-vibrant">General</TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-accent-vibrant">Security</TabsTrigger>
                    <TabsTrigger value="notifications" className="data-[state=active]:bg-accent-vibrant">Notifications</TabsTrigger>
                    <TabsTrigger value="system" className="data-[state=active]:bg-accent-vibrant">System</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                    <Card className="glass border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-accent-cyan" /> Platform Identity
                            </CardTitle>
                            <CardDescription>Update your platform name and branding</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="site-name">Platform Name</Label>
                                <Input id="site-name" defaultValue="Alpha.LMS" className="bg-white/5 border-white/10" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="site-url">Landing Resource URL</Label>
                                <Input id="site-url" defaultValue="https://alpha-lms.ai" className="bg-white/5 border-white/10" />
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <div className="space-y-0.5">
                                    <Label>Public Registration</Label>
                                    <p className="text-sm text-muted-foreground">Allow anyone to create an account</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Button
                                className="bg-accent-vibrant hover:bg-accent-vibrant/90"
                                onClick={handleSaveChanges}
                                disabled={isSaving}
                            >
                                {isSaving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="glass border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5 text-accent-cyan" /> Email Configuration
                            </CardTitle>
                            <CardDescription>Setup SMTP and automated emails</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="smtp-server">SMTP Server</Label>
                                <Input id="smtp-server" placeholder="smtp.provider.com" className="bg-white/5 border-white/10" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="support-email">Support Email</Label>
                                <Input id="support-email" defaultValue="support@alpha-lms.ai" className="bg-white/5 border-white/10" />
                            </div>
                            <Button
                                variant="outline"
                                className="border-white/10 hover:bg-white/5"
                                onClick={handleTestSmtp}
                                disabled={isTestingSmtp}
                            >
                                {isTestingSmtp ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                                {isTestingSmtp ? "Testing..." : "Test SMTP Connection"}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                    <Card className="glass border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5 text-amber-500" /> Authentication Strategy
                            </CardTitle>
                            <CardDescription>Manage how users authenticate</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">Force 2FA for all admin accounts</p>
                                </div>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Session Timeout</Label>
                                    <p className="text-sm text-muted-foreground">Auto logout after 30 minutes of inactivity</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="grid gap-2">
                                <Label>Password Complexity</Label>
                                <div className="pt-2 flex flex-wrap gap-2">
                                    <Badge variant="outline" className="text-green-500 border-green-500/50">Required: Uppercase</Badge>
                                    <Badge variant="outline" className="text-green-500 border-green-500/50">Required: Number</Badge>
                                    <Badge variant="outline" className="text-green-500 border-green-500/50">Required: Symbol</Badge>
                                    <Badge variant="outline" className="text-muted-foreground opacity-50">Min Length: 8</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="system" className="space-y-6">
                    <Card className="glass border-white/10 bg-red-500/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-500">
                                <Database className="h-5 w-5" /> Maintenance & Danger Zone
                            </CardTitle>
                            <CardDescription>Critical system operations</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between py-2">
                                <div className="space-y-0.5">
                                    <Label>Maintenance Mode</Label>
                                    <p className="text-sm text-muted-foreground">Put the Entire platform in offline mode</p>
                                </div>
                                <Switch />
                            </div>
                            <div className="pt-4 flex gap-4">
                                <Button
                                    variant="destructive"
                                    onClick={handleClearCache}
                                    disabled={isClearingCache}
                                >
                                    {isClearingCache ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                    {isClearingCache ? "Clearing..." : "Clear System Cache"}
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive">
                                            <AlertTriangle className="mr-2 h-4 w-4" /> Purge Audit Logs
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete all system audit logs from the database.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handlePurgeLogs} className="bg-red-600 hover:bg-red-700">
                                                Yes, Purge Logs
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
