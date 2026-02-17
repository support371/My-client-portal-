"use client"

import { useState, useRef, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { PortalHeader } from "@/components/portal-header"
import { GlassCard } from "@/components/glass-card"
import { StatCard } from "@/components/stat-card"
import { cn } from "@/lib/utils"
import { teams } from "@/lib/data"
import { Users, Send, BarChart, Calendar, PieChart, Zap } from "lucide-react"

type TerminalLine = { text: string; isResponse?: boolean }

export default function TeamPage() {
  const [filter, setFilter] = useState<"ALL" | "GEM" | "Alliance">("ALL")
  const [command, setCommand] = useState("")
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    { text: "> AI Overseer Initializing..." },
    { text: "> System status: OPTIMAL" },
    { text: "> Monitoring active agents..." },
  ])
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalLines])

  const filtered = filter === "ALL" ? teams : teams.filter((m) => m.team === filter)

  const sendCommand = () => {
    if (!command.trim()) return
    setTerminalLines((prev) => [
      ...prev,
      { text: `> ${command}` },
      { text: `[AI] Executing: ${command}... Done.`, isResponse: true },
    ])
    setCommand("")
  }

  const filterBtns: Array<"ALL" | "GEM" | "Alliance"> = ["ALL", "GEM", "Alliance"]

  return (
    <AuthGuard requiredRole="team">
      <PortalHeader
        title="Team Portal"
        icon={<Users className="h-5 w-5 text-primary" />}
      />

      <main className="mx-auto max-w-5xl px-4 py-6 md:py-10">
        <div style={{ animation: "fadeIn 0.4s ease-out" }}>
          <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-extrabold text-transparent md:text-3xl">
            Team Workspace
          </h1>
          <p className="mt-1 text-sm text-muted">
            Collaborative Directory & AI Operations Oversight
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <StatCard value={47} label="Total Members" />
          <StatCard value="94%" label="Project Velocity" />
          <StatCard value={8} label="Departments" />
          <StatCard value="24/7" label="Support" />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {/* Terminal */}
          <GlassCard className="md:col-span-2">
            <h3 className="mb-3 text-base font-bold text-foreground">AI Overseer Terminal</h3>
            <div
              ref={terminalRef}
              className="h-52 overflow-y-auto rounded-lg border border-border/50 bg-[#000] p-3 font-mono text-sm md:h-64"
            >
              {terminalLines.map((line, i) => (
                <div key={i} className={line.isResponse ? "text-secondary" : "text-primary"}>
                  {line.text}
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendCommand()}
                placeholder="Enter command..."
                className="h-11 flex-1 rounded-lg border border-glass-border bg-input px-3 text-base text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
              />
              <button
                onClick={sendCommand}
                className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground transition-transform hover:scale-105 active:scale-95"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </GlassCard>

          {/* Department Load - NEW */}
          <GlassCard>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground">Department Load</h3>
              <PieChart className="h-4 w-4 text-secondary" />
            </div>
            <div className="space-y-3">
              {[
                { label: "Engineering", load: 85, color: "bg-primary" },
                { label: "Operations", load: 60, color: "bg-secondary" },
                { label: "Intelligence", load: 92, color: "bg-warning" },
              ].map((d, i) => (
                <div key={i}>
                  <div className="mb-1 flex justify-between text-[10px] uppercase tracking-wider text-muted font-bold">
                    <span>{d.label}</span>
                    <span>{d.load}%</span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-border/20 overflow-hidden">
                    <div className={cn("h-full", d.color)} style={{ width: `${d.load}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-5 w-full rounded-lg border border-glass-border py-2 text-[10px] font-bold uppercase tracking-widest text-primary transition-colors hover:bg-primary/10">
              View Load Balancer
            </button>
          </GlassCard>
        </div>

        {/* Project Timeline - NEW */}
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <GlassCard className="md:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground">Project Timeline</h3>
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div className="relative space-y-4 pl-4 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-glass-border">
              {[
                { date: "Feb 12", title: "Global Security Audit", status: "Upcoming", color: "bg-primary" },
                { date: "Feb 10", title: "Infrastructure Migration", status: "In Progress", color: "bg-secondary" },
                { date: "Feb 05", title: "Q1 Planning Session", status: "Completed", color: "bg-muted" },
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className={cn("absolute -left-[13px] top-1.5 h-2 w-2 rounded-full border-2 border-background", item.color)} />
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-muted uppercase">{item.date}</p>
                      <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                    </div>
                    <span className={cn("rounded px-1.5 py-0.5 text-[9px] font-bold uppercase", item.color === "bg-muted" ? "bg-muted/20 text-muted" : "bg-primary/20 text-primary")}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground">System Velocity</h3>
              <Zap className="h-4 w-4 text-warning" />
            </div>
            <div className="flex flex-col items-center justify-center h-40">
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-glass-border">
                <div className="absolute inset-0 rounded-full border-t-4 border-primary" style={{ transform: "rotate(240deg)" }} />
                <div className="text-center">
                  <p className="text-3xl font-black text-primary">94.2</p>
                  <p className="text-[10px] font-bold uppercase text-muted">V-Score</p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-center text-[10px] text-muted leading-relaxed">System performance is 8.4% above average for this quarter.</p>
          </GlassCard>
        </div>

        {/* Personnel Directory */}
        <GlassCard className="mt-4">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h3 className="text-base font-bold text-foreground">Personnel Directory</h3>
            <div className="flex gap-2">
              {filterBtns.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    filter === f
                      ? "bg-primary text-primary-foreground"
                      : "border border-glass-border text-primary hover:bg-primary/10"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m) => (
              <div
                key={m.id}
                className="rounded-lg border-l-4 border-l-primary bg-surface p-3.5"
              >
                <div className="text-sm font-bold text-primary">{m.name}</div>
                <div className="mt-0.5 text-xs text-muted">{m.role}</div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
                  <span>{m.team}</span>
                  <span>Clearance: {m.clearance}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </main>
    </AuthGuard>
  )
}
