"use client"

import { useState, useEffect } from "react"
import {
    Users,
    ShieldCheck,
    AlertTriangle,
    RefreshCw,
    Download,
    Server,
    Trash2,
    Save,
    Wifi,
    CheckCircle2,
    XCircle,
    FileText,
    Activity,
    MoreHorizontal,
    Plus,
    Search,
    ChevronRight,
    Database,
    Cpu,
    LogOut,
    TrendingUp
} from "lucide-react"

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts"

import { toast } from "sonner"
import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

// --- Mock Data Generators ---

const generateMockData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
    let totalUsers = 1500;
    return months.map(month => {
        const organic = Math.floor(Math.random() * 300) + 100;
        const referral = Math.floor(Math.random() * 150) + 50;
        totalUsers += (organic + referral);
        return {
            name: month,
            total: totalUsers,
            organic: organic,
            referral: referral,
            active: Math.floor(totalUsers * 0.65)
        }
    })
}

const generatePieData = () => [
    { name: 'Active', value: 400 },
    { name: 'Inactive', value: 300 },
    { name: 'Pending', value: 300 },
    { name: 'Banned', value: 200 },
]

const COLORS = ['#10b981', '#64748b', '#f59e0b', '#ef4444']

const generateUsers = (count: number) => {
    const roles = ['Admin', 'Editor', 'Viewer', 'User']
    const statuses = ['Active', 'Pending', 'Inactive', 'Rejected']

    return Array.from({ length: count }).map((_, i) => ({
        id: `usr_${i + 100}`,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: roles[Math.floor(Math.random() * roles.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        lastLogin: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toLocaleDateString()
    }))
}

const generateLogs = (count: number) => {
    const actions = ['LOGIN_SUCCESS', 'LOGIN_FAILED', 'UPDATE_PROFILE', 'DELETE_RECORD', 'SYSTEM_BACKUP', 'API_ERROR']
    const levels = ['INFO', 'WARNING', 'ERROR', 'SUCCESS']

    return Array.from({ length: count }).map((_, i) => {
        const action = actions[Math.floor(Math.random() * actions.length)]
        let level = 'INFO'
        if (action.includes('FAILED') || action.includes('ERROR')) level = 'ERROR'
        if (action.includes('DELETE')) level = 'WARNING'
        if (action.includes('SUCCESS')) level = 'SUCCESS'

        return {
            id: `log_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(Date.now() - Math.floor(Math.random() * 10000000 * i)).toLocaleString(),
            action,
            user: `admin_${Math.floor(Math.random() * 5)}`,
            details: `Executed ${action} from IP 192.168.1.${Math.floor(Math.random() * 255)}`,
            level
        }
    })
}

// --- Main Component ---

export function InteractiveSystemDashboard() {
    const { logout } = useAuth()
    // State
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    // Data State
    const [users, setUsers] = useState<any[]>([])
    const [logs, setLogs] = useState(generateLogs(8))
    const [metrics, setMetrics] = useState(generateMockData())

    // Metrics for specific charts
    const retentionData = [
        { name: 'Week 1', retention: 100 },
        { name: 'Week 2', retention: 85 },
        { name: 'Week 3', retention: 70 },
        { name: 'Week 4', retention: 65 },
        { name: 'Week 5', retention: 60 },
        { name: 'Week 6', retention: 55 },
    ]

    const categoriesData = [
        { name: 'Development', value: 450 },
        { name: 'Design', value: 300 },
        { name: 'Marketing', value: 200 },
        { name: 'Business', value: 350 },
    ]

    // Modal States
    const [isAddUserOpen, setIsAddUserOpen] = useState(false)
    const [isReviewOpen, setIsReviewOpen] = useState(false)
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
    const [isPurgeConfirmOpen, setIsPurgeConfirmOpen] = useState(false)
    const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false)

    // Selection State
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [rejectionReason, setRejectionReason] = useState("")
    const [userToApprove, setUserToApprove] = useState<any>(null)
    const [searchTerm, setSearchTerm] = useState("")

    // Status States
    const [smtpStatus, setSmtpStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle')
    const [cacheStatus, setCacheStatus] = useState<'idle' | 'clearing' | 'success'>('idle')

    // Initial Load
    useEffect(() => {
        // Ensure we have some pending users for demonstration
        const initialUsers = generateUsers(12)
        // Force at least 2 pending users
        initialUsers[0].status = 'Pending'
        initialUsers[1].status = 'Pending'
        setUsers(initialUsers)
    }, [])

    // Computed
    const pendingUsers = users.filter(u => u.status === 'Pending')
    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // --- Handlers ---

    const handleRefresh = async () => {
        setRefreshing(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        setMetrics(generateMockData())
        setLogs(prev => [{
            id: `log_new_${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            action: 'MANUAL_REFRESH',
            user: 'Admin User',
            details: 'Dashboard data refreshed manually',
            level: 'INFO'
        }, ...prev])
        setRefreshing(false)
        toast.success("Dashboard Refreshed", { description: "All system metrics have been updated." })
    }

    const handleExportJson = () => {
        const data = { users, logs, metrics, generatedAt: new Date().toISOString() }
        downloadFile(JSON.stringify(data, null, 2), `admin_export_${Date.now()}.json`, 'application/json')
        toast.success("Export Complete", { description: "System data downloaded as JSON." })
    }

    const handleExportCsv = () => {
        const headers = ["ID", "Name", "Email", "Role", "Status", "Last Login"]
        const rows = users.map(u => [u.id, u.name, u.email, u.role, u.status, u.lastLogin].join(","))
        const csv = [headers.join(","), ...rows].join("\n")
        downloadFile(csv, `users_export_${Date.now()}.csv`, 'text/csv')
        toast.success("Export Complete", { description: "User list downloaded as CSV." })
    }

    const downloadFile = (content: string, filename: string, type: string) => {
        const blob = new Blob([content], { type })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const handleTestSMTP = async () => {
        setSmtpStatus('checking')
        await new Promise(resolve => setTimeout(resolve, 2000))
        const success = Math.random() > 0.2
        if (success) {
            setSmtpStatus('success')
            toast.success("Connection Verified", { description: "SMTP server is reachable and responding." })
        } else {
            setSmtpStatus('error')
            toast.error("Connection Failed", { description: "Could not reach SMTP server (Simulated)." })
        }
        setTimeout(() => setSmtpStatus('idle'), 5000)
    }

    const handleClearCache = async () => {
        setCacheStatus('clearing')
        await new Promise(resolve => setTimeout(resolve, 1500))
        setCacheStatus('success')
        toast.success("Cache Cleared", { description: "System cache successfully purged." })
        setTimeout(() => setCacheStatus('idle'), 3000)
    }

    const handlePurgeLogs = () => {
        setLogs([])
        setIsPurgeConfirmOpen(false)
        toast.warning("Logs Purged", { description: "Audit logs have been permanently deleted." })
    }

    // User Management
    const initiateApprove = (user: any) => {
        setUserToApprove(user)
        setIsApproveConfirmOpen(true)
    }

    const confirmApprove = () => {
        if (!userToApprove) return
        setUsers(users.map(u => u.id === userToApprove.id ? { ...u, status: 'Active' } : u))
        toast.success("User Approved", { description: `${userToApprove.name} is now active.` })
        setIsApproveConfirmOpen(false)
        setUserToApprove(null)
    }

    const initiateReject = (user: any) => {
        setSelectedUser(user)
        setRejectionReason("")
        setIsRejectDialogOpen(true)
    }

    const confirmReject = () => {
        if (!rejectionReason) {
            toast.error("Reason Required", { description: "Please enter a reason for rejection." })
            return
        }
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: 'Rejected' } : u))
        setIsRejectDialogOpen(false)
        toast.info("User Rejected", { description: `${selectedUser.name} rejected. Reason: ${rejectionReason}` })
    }

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const newUser = {
            id: `usr_${Date.now()}`,
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            role: formData.get('role') as string,
            status: 'Active',
            lastLogin: 'Never'
        }
        setUsers([newUser, ...users])
        setIsAddUserOpen(false)
        toast.success("User Added", { description: `${newUser.name} created successfully.` })
    }

    const handleReview = (user: any) => {
        setSelectedUser(user)
        setIsReviewOpen(true)
    }

    return (
        <div className="space-y-8 w-full pb-8">
            {/* 1. Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">System Control Center �️</h1>
                    <p className="text-muted-foreground">Monitor and manage your system status and users.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh Data
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" /> Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={handleExportJson}>As JSON</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportCsv}>As CSV</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={logout}
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all border border-red-500/20 px-3"
                    >
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                </div>
            </div>

            {/* 2. Pending Approvals Section */}
            {pendingUsers.length > 0 && (
                <Card className="glass border-amber-500/20 bg-amber-500/5">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            <CardTitle>Pending Approvals ({pendingUsers.length})</CardTitle>
                        </div>
                        <CardDescription>Action required for these new account requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {pendingUsers.map(user => (
                                <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-background/50 rounded-lg border border-white/5 gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{user.email} • {user.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => handleReview(user)}>Review</Button>
                                        <Button size="sm" variant="destructive" onClick={() => initiateReject(user)}>Reject</Button>
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => initiateApprove(user)}>Approve</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 3. Platform Analytics */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="glass border-white/10 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-accent-vibrant" />
                            User Growth Trend
                        </CardTitle>
                        <CardDescription>Organic vs Referral growth over the last 8 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={metrics}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1b1e', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ fontSize: '12px' }}
                                />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                                <Area type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                                <Area type="monotone" dataKey="organic" stroke="#06b6d4" strokeWidth={2} fill="transparent" />
                                <Area type="monotone" dataKey="referral" stroke="#10b981" strokeWidth={2} fill="transparent" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="glass border-white/10">
                    <CardHeader>
                        <CardTitle>Popular Categories</CardTitle>
                        <CardDescription>Enrollment distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={categoriesData} layout="vertical">
                                <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} hide />
                                <YAxis dataKey="name" type="category" width={80} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#1a1b1e', borderColor: '#333' }} cursor={{ fill: '#ffffff05' }} />
                                <Bar dataKey="value" fill="#06b6d4" radius={[0, 4, 4, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="glass border-white/10 md:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>User Retention & Engagement</CardTitle>
                            <CardDescription>Weekly retention rates over time</CardDescription>
                        </div>
                        <Badge variant="outline" className="border-accent-cyan text-accent-cyan">Simulated Data</Badge>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={retentionData}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                                <Tooltip contentStyle={{ backgroundColor: '#1a1b1e', borderColor: '#333' }} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                                <Line type="monotone" dataKey="retention" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: '#06b6d4' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* 4. Manage Users Section */}
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 glass border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Manage Users</CardTitle>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search users..."
                                    className="pl-8 w-[200px]"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add User</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New User</DialogTitle>
                                        <DialogDescription>Manually add a user to the system.</DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleAddUser} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Full Name</Label>
                                            <Input name="name" required placeholder="John Doe" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Email</Label>
                                            <Input name="email" type="email" required placeholder="john@example.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Role</Label>
                                            <select name="role" className="w-full h-10 rounded-md border bg-background px-3">
                                                <option>User</option>
                                                <option>Editor</option>
                                                <option>Admin</option>
                                            </select>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit">Create User</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px]">
                            <div className="space-y-1">
                                {filteredUsers.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">No users found.</p>
                                ) : (
                                    filteredUsers.map(user => (
                                        <div key={user.id} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant={
                                                    user.status === 'Active' ? 'default' :
                                                        user.status === 'Pending' ? 'outline' :
                                                            user.status === 'Rejected' ? 'destructive' : 'secondary'
                                                }>
                                                    {user.status}
                                                </Badge>
                                                <Button variant="ghost" size="icon" onClick={() => handleReview(user)}>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* 5. System Settings & Actions */}
                <div className="space-y-6">
                    <Card className="glass border-white/10">
                        <CardHeader>
                            <CardTitle>System Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 border rounded-lg space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium flex gap-2 items-center"><Server className="h-4 w-4" /> SMTP Connection</span>
                                    {smtpStatus === 'checking' && <Badge variant="outline">Checking...</Badge>}
                                    {smtpStatus === 'success' && <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>}
                                    {smtpStatus === 'error' && <Badge variant="destructive">Failed</Badge>}
                                </div>
                                <Button size="sm" variant="secondary" className="w-full" onClick={handleTestSMTP}>Test Connection</Button>
                            </div>

                            <div className="p-3 border rounded-lg space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium flex gap-2 items-center"><Database className="h-4 w-4" /> System Cache</span>
                                </div>
                                <Button size="sm" variant="secondary" className="w-full" onClick={handleClearCache} disabled={cacheStatus === 'clearing'}>
                                    {cacheStatus === 'clearing' ? 'Clearing...' : 'Clear System Cache'}
                                </Button>
                            </div>

                            <div className="p-3 border border-red-900/50 bg-red-900/10 rounded-lg space-y-3">
                                <div className="flex justify-between items-center text-red-500">
                                    <span className="text-sm font-medium flex gap-2 items-center"><AlertTriangle className="h-4 w-4" /> Danger Zone</span>
                                </div>
                                <Button size="sm" variant="destructive" className="w-full" onClick={() => setIsPurgeConfirmOpen(true)}>
                                    Purge Audit Logs
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 6. Audit Logs Preview */}
                    <Card className="glass border-white/10 h-[300px] flex flex-col">
                        <CardHeader>
                            <CardTitle>Recent Logs</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-hidden">
                            <ScrollArea className="h-full pr-4">
                                <div className="space-y-3">
                                    {logs.map(log => (
                                        <div key={log.id} className="text-xs border-b border-white/5 pb-2">
                                            <div className="flex justify-between text-muted-foreground mb-1">
                                                <span>{log.timestamp.split(',')[1]}</span>
                                                <span className={log.level === 'ERROR' ? 'text-red-500' : 'text-green-500'}>{log.level}</span>
                                            </div>
                                            <p className="font-medium truncate">{log.action}</p>
                                            <p className="text-muted-foreground truncate">{log.details}</p>
                                        </div>
                                    ))}
                                    {logs.length === 0 && <p className="text-center text-muted-foreground">Logs cleared.</p>}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Dialogs */}
            <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Details: {selectedUser?.name}</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="text-muted-foreground block">Email</span> {selectedUser.email}</div>
                                <div><span className="text-muted-foreground block">Role</span> {selectedUser.role}</div>
                                <div><span className="text-muted-foreground block">Status</span> {selectedUser.status}</div>
                                <div><span className="text-muted-foreground block">ID</span> {selectedUser.id}</div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setIsReviewOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Reject User</DialogTitle></DialogHeader>
                    <div className="py-4">
                        <Label>Reason for Rejection</Label>
                        <Input
                            value={rejectionReason}
                            onChange={e => setRejectionReason(e.target.value)}
                            placeholder="e.g. Incomplete profile"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmReject}>Confirm Reject</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isApproveConfirmOpen} onOpenChange={setIsApproveConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Approve User?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to approve {userToApprove?.name}? They will gain full access.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmApprove} className="bg-green-600 hover:bg-green-700">Approve</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isPurgeConfirmOpen} onOpenChange={setIsPurgeConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Purge All Logs?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. All audit history will be lost.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handlePurgeLogs} className="bg-red-600">Yes, Purge</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
