import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Rocket } from "lucide-react";

export default function ComingSoonPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black mesh-gradient p-6 text-center">
            <div className="max-w-md w-full glass border-white/10 p-8 rounded-3xl space-y-8 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-accent-vibrant/20 blur-[60px] rounded-full -z-10" />

                <div className="flex justify-center">
                    <div className="h-20 w-20 rounded-2xl bg-accent-vibrant/10 flex items-center justify-center border border-accent-vibrant/20 shadow-[0_0_30px_rgba(124,58,237,0.2)]">
                        <Rocket className="h-10 w-10 text-accent-vibrant animate-pulse" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">Coming Soon</h1>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        We are working hard to bring you this feature. <br />
                        Stay tuned for updates!
                    </p>
                </div>

                <div className="pt-4">
                    <Link href="/">
                        <Button variant="outline" className="w-full glass border-white/10 hover:bg-white/5 gap-2">
                            <ArrowLeft className="h-4 w-4" /> Return Home
                        </Button>
                    </Link>
                </div>
            </div>

            <p className="mt-8 text-sm text-muted-foreground opacity-50">
                &copy; 2026 Alpha.LMS Platform
            </p>
        </div>
    );
}
