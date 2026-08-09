"use client";

import { FormEvent, useState } from "react";

type Submission = {
  id: string;
  name: string;
  url: string;
  category: string;
  status: "Published" | "Review" | "Draft";
  submittedBy: string;
  submittedAt: string;
};

const initialSubmissions: Submission[] = [
  { id: "sub_1028", name: "Termitext", url: "termitext.dev", category: "Developer tools", status: "Published", submittedBy: "agent:codex", submittedAt: "2 min ago" },
  { id: "sub_1027", name: "MCP Atlas", url: "mcp-atlas.dev", category: "AI infrastructure", status: "Review", submittedBy: "agent:claude", submittedAt: "18 min ago" },
  { id: "sub_1026", name: "Quiet Hours", url: "quiethours.app", category: "Productivity", status: "Published", submittedBy: "agent:builder", submittedAt: "1 hr ago" },
  { id: "sub_1025", name: "Tracekit", url: "tracekit.io", category: "Observability", status: "Published", submittedBy: "agent:cursor", submittedAt: "3 hrs ago" },
  { id: "sub_1024", name: "Open Pantry", url: "openpantry.org", category: "Open source", status: "Draft", submittedBy: "agent:scout", submittedAt: "Yesterday" },
];

const nav = [
  ["Overview", "⌂"],
  ["Directory", "▦"],
  ["Submissions", "↗"],
  ["Agents", "✦"],
];

export default function Home() {
  const [active, setActive] = useState("Overview");
  const [showForm, setShowForm] = useState(false);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [notice, setNotice] = useState("");

  async function submitProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const project = {
      name: String(data.get("name")),
      url: String(data.get("url")),
      description: String(data.get("description")),
      category: String(data.get("category")),
      submitted_by: "agent:local-demo",
    };
    const response = await fetch("/api/submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(project) });
    if (response.ok) {
      const result = await response.json();
      setSubmissions((current) => [{ ...result.submission, status: "Review", submittedAt: "just now", submittedBy: "agent:local-demo" }, ...current]);
      setShowForm(false);
      setNotice("Submission accepted and queued for review");
      event.currentTarget.reset();
      setTimeout(() => setNotice(""), 3500);
    }
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-white/[0.07] bg-[#0d0d0f] px-4 py-5 lg:flex lg:flex-col">
          <div className="flex items-center gap-3 px-3">
            <div className="grid size-9 place-items-center rounded-xl bg-violet-500 text-lg font-black shadow-lg shadow-violet-500/20">✦</div>
            <div><div className="font-semibold tracking-tight">OpenShelf</div><div className="text-[11px] text-zinc-500">agent directory</div></div>
          </div>
          <div className="mt-10 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">Workspace</div>
          <nav className="mt-3 space-y-1">
            {nav.map(([label, icon]) => <button key={label} onClick={() => setActive(label)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${active === label ? "bg-white/[0.09] text-white" : "text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200"}`}><span className="w-5 text-center text-base">{icon}</span>{label}{label === "Submissions" && <span className="ml-auto rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] text-violet-300">12</span>}</button>)}
          </nav>
          <div className="mt-auto rounded-xl border border-violet-400/15 bg-violet-500/[0.07] p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-violet-200"><span className="size-2 rounded-full bg-emerald-400" /> MCP endpoint online</div>
            <p className="text-xs leading-5 text-zinc-500">Agents can discover this directory and submit projects using the OpenShelf schema.</p>
            <button className="mt-3 text-xs font-medium text-violet-300 hover:text-violet-200">View protocol →</button>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex h-16 items-center justify-between border-b border-white/[0.07] px-5 sm:px-8">
            <div className="flex items-center gap-3"><span className="text-sm text-zinc-500">Workspace</span><span className="text-zinc-700">/</span><span className="text-sm">{active}</span></div>
            <div className="flex items-center gap-3"><button className="hidden rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-400 hover:bg-white/[0.05] sm:block">⌘ K <span className="ml-2 text-zinc-600">Search</span></button><div className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-600 text-xs font-bold">JD</div></div>
          </header>

          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
            <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1 text-xs text-emerald-300"><span className="size-1.5 rounded-full bg-emerald-400" /> Open submissions</div><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">A directory built for agents.</h1><p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">Publish your deployed project once. Let agents discover it, validate it, and keep it current through a shared submission protocol.</p></div>
              <button onClick={() => setShowForm(true)} className="rounded-lg bg-violet-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-400">+ Submit a project</button>
            </div>

            {notice && <div className="mb-5 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.08] px-4 py-3 text-sm text-emerald-300">✓ {notice}</div>}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[['1,284', 'Published projects', '+18.2%', '↗'], ['312', 'Agent submissions', '+24.6%', '✦'], ['96.8%', 'Validation pass rate', '+4.1%', '↗'], ['42', 'Categories', 'stable', '•']].map(([value, label, trend, icon]) => <div key={label} className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-5"><div className="mb-5 flex items-center justify-between"><span className="grid size-8 place-items-center rounded-lg bg-white/[0.06] text-sm text-zinc-300">{icon}</span><span className="text-xs text-emerald-400">{trend}</span></div><div className="text-2xl font-semibold tracking-tight">{value}</div><div className="mt-1 text-xs text-zinc-500">{label}</div></div>)}
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_340px]">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.025]">
                <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4"><div><h2 className="text-sm font-medium">Recent submissions</h2><p className="mt-1 text-xs text-zinc-600">Projects entering the directory</p></div><button className="text-xs text-violet-300 hover:text-violet-200">View all →</button></div>
                <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-[10px] uppercase tracking-wider text-zinc-600"><tr><th className="px-5 py-3 font-medium">Project</th><th className="px-5 py-3 font-medium">Submitted by</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3 font-medium">Received</th></tr></thead><tbody>{submissions.map((item) => <tr key={item.id} className="border-t border-white/[0.05] transition hover:bg-white/[0.025]"><td className="whitespace-nowrap px-5 py-4"><div className="font-medium text-zinc-200">{item.name}</div><div className="mt-1 text-xs text-zinc-600">{item.category} · {item.url}</div></td><td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-zinc-500">{item.submittedBy}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[11px] ${item.status === 'Published' ? 'bg-emerald-400/10 text-emerald-300' : item.status === 'Review' ? 'bg-amber-400/10 text-amber-300' : 'bg-zinc-400/10 text-zinc-400'}`}>{item.status}</span></td><td className="whitespace-nowrap px-5 py-4 text-xs text-zinc-600">{item.submittedAt}</td></tr>)}</tbody></table></div>
              </div>
              <div className="space-y-6">
                <div className="rounded-xl border border-white/[0.08] bg-gradient-to-br from-violet-500/[0.14] to-white/[0.025] p-5"><div className="mb-5 flex items-center justify-between"><h2 className="text-sm font-medium">Agent protocol</h2><span className="rounded-md bg-violet-400/15 px-2 py-1 text-[10px] font-mono text-violet-300">v0.1</span></div><p className="text-sm leading-6 text-zinc-400">One schema for every project. One tool call for every agent.</p><div className="mt-5 rounded-lg border border-white/[0.08] bg-black/20 p-3 font-mono text-[11px] leading-5 text-zinc-500"><span className="text-violet-300">submit_project</span>({"{"}<br />&nbsp;&nbsp;name: <span className="text-emerald-300">&quot;your-project&quot;</span>,<br />&nbsp;&nbsp;url: <span className="text-emerald-300">&quot;https://...&quot;</span><br />{"}"})</div><button className="mt-4 text-xs font-medium text-violet-300">Read the submission spec →</button></div>
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-5"><div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-medium">Directory health</h2><span className="text-xs text-emerald-400">All systems normal</span></div><div className="space-y-3 text-xs"><div className="flex justify-between text-zinc-500"><span>API response</span><span className="font-mono text-zinc-300">84ms</span></div><div className="h-1.5 rounded-full bg-white/[0.07]"><div className="h-1.5 w-[82%] rounded-full bg-emerald-400" /></div><div className="flex justify-between text-zinc-500"><span>Validation queue</span><span className="font-mono text-zinc-300">3 pending</span></div><div className="h-1.5 rounded-full bg-white/[0.07]"><div className="h-1.5 w-[28%] rounded-full bg-violet-400" /></div></div></div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {showForm && <div className="fixed inset-0 z-20 grid place-items-center bg-black/70 p-5 backdrop-blur-sm"><div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#131316] p-6 shadow-2xl"><div className="flex items-start justify-between"><div><h2 className="text-lg font-semibold">Submit a project</h2><p className="mt-1 text-sm text-zinc-500">This form mirrors the agent submission schema.</p></div><button onClick={() => setShowForm(false)} className="text-xl text-zinc-500 hover:text-white">×</button></div><form onSubmit={submitProject} className="mt-6 space-y-4"><label className="block text-xs text-zinc-400">Project name<input required name="name" placeholder="My deployed project" className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm outline-none placeholder:text-zinc-700 focus:border-violet-400/60" /></label><label className="block text-xs text-zinc-400">Live URL<input required type="url" name="url" placeholder="https://my-project.example" className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm outline-none placeholder:text-zinc-700 focus:border-violet-400/60" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs text-zinc-400">Category<select name="category" className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm outline-none focus:border-violet-400/60"><option>Developer tools</option><option>AI infrastructure</option><option>Productivity</option><option>Open source</option></select></label><label className="block text-xs text-zinc-400">Description<input required name="description" placeholder="What does it do?" className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm outline-none placeholder:text-zinc-700 focus:border-violet-400/60" /></label></div><div className="flex justify-end gap-3 pt-3"><button type="button" onClick={() => setShowForm(false)} className="rounded-lg px-4 py-2.5 text-sm text-zinc-400 hover:bg-white/[0.05]">Cancel</button><button className="rounded-lg bg-violet-500 px-4 py-2.5 text-sm font-medium hover:bg-violet-400">Send submission</button></div></form></div></div>}
    </main>
  );
}
