import { InteractiveSystemDashboard } from "@/components/admin/system-dashboard"

export default function SystemControlPage() {
    return (
        <div className="container mx-auto p-6 h-full flex-1 flex-col space-y-8 md:flex">
            <InteractiveSystemDashboard />
        </div>
    )
}
