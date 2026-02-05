import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";

export default function LandingPage() {
  const roles = [
    {
      title: "Students",
      icon: GraduationCap,
      description: "Personalized learning paths driven by AI to help you master skills faster.",
      link: "/dashboard",
      color: "text-accent-vibrant",
      bg: "bg-accent-vibrant/10"
    },
    {
      title: "Instructors",
      icon: Users,
      description: "Powerful tools to create, manage, and monetize your courses globally.",
      link: "/instructor",
      color: "text-accent-cyan",
      bg: "bg-accent-cyan/10"
    },
    {
      title: "Enterprise Admins",
      icon: ShieldCheck,
      description: "Robust analytics and compliance tracking for large-scale organizations.",
      link: "/compliance",
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-accent-vibrant selection:text-white">
      <Navbar />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 mesh-gradient overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-accent-vibrant/20 blur-[120px] rounded-full opacity-50 -z-10" />

        <div className="max-w-6xl mx-auto text-center space-y-8">
          <Badge variant="outline" className="border-accent-vibrant/50 text-accent-vibrant px-4 py-1 rounded-full animate-fade-in">
            Next-Gen E-Learning Platform
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-extrabold tracking-tighter leading-tight drop-shadow-2xl">
            Master the Future with <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-vibrant via-accent-cyan to-white">
              AI-Driven Learning
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
            The world&apos;s most advanced LMS for enterprise training, compliance, and individual upskilling. Scalable, personal, and profoundly effective.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="h-14 w-full sm:w-auto px-8 bg-accent-vibrant hover:bg-accent-vibrant/90 text-white rounded-full text-lg font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo/classroom" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="h-14 w-full sm:w-auto px-8 glass border-white/20 rounded-full text-lg font-medium hover:bg-white/5 transition-all">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Roles / Features Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold">Tailored Experiences for Every User</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Whether you&apos;re a lifelong learner or a global enterprise admin, we have the tools you need.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roles.map((role) => (
            <Card key={role.title} className="glass border-white/10 hover:border-accent-vibrant/50 transition-all group cursor-pointer hover:-translate-y-2">
              <CardHeader>
                <div className={`w-12 h-12 rounded-2xl ${role.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <role.icon className={`h-6 w-6 ${role.color}`} />
                </div>
                <CardTitle className="text-2xl">{role.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{role.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={role.link}>
                  <Button variant="link" className={`p-0 h-auto font-bold group-hover:translate-x-1 transition-transform ${role.color}`}>
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust / Stats Section */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Active Learners", value: "2M+" },
            { label: "Course Content", value: "50k+" },
            { label: "Global Enterprises", value: "1.2k" },
            { label: "Satisfaction Rate", value: "99.9%" },
          ].map((stat) => (
            <div key={stat.label} className="space-y-1">
              <div className="text-4xl font-black text-white">{stat.value}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto glass p-12 md:p-20 rounded-[40px] text-center space-y-8 relative overflow-hidden border-accent-vibrant/20 shadow-2xl">
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent-vibrant/30 blur-[100px] rounded-full" />
          <h2 className="text-4xl md:text-5xl font-bold">Ready to transform your <br /> learning strategy?</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto italic">&quot;The most intelligent LMS implementation we&apos;ve ever seen. It changed our compliance culture overnight.&quot; — CTO, TechCorp</p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard">
              <Button className="bg-white text-black hover:bg-zinc-200 h-14 px-10 rounded-full font-bold text-lg">
                Join Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
    </div>
  );
}
