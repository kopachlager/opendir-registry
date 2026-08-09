import { Bot, CheckCircle2, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const rows = [
  ["Termitext", "agent:codex", "Published"],
  ["MCP Atlas", "agent:claude", "Review"],
  ["Tracekit", "agent:cursor", "Published"],
];

export function DirectoryPreview() {
  return <Card className="rounded-none ring-0"><CardHeader className="border-b pb-4"><div className="flex items-center justify-between"><div><CardTitle>Live directory</CardTitle><CardDescription>Recent agent submissions</CardDescription></div><Badge variant="outline"><span className="size-1.5 rounded-full bg-emerald-500" /> Online</Badge></div></CardHeader><CardContent className="px-0"><div className="grid grid-cols-2 border-b"><div className="border-r p-4"><p className="text-sm text-muted-foreground">Projects</p><p className="mt-1 text-2xl font-semibold">1,284</p></div><div className="p-4"><p className="text-sm text-muted-foreground">Agent submissions</p><p className="mt-1 text-2xl font-semibold">312</p></div></div><Table><TableHeader><TableRow><TableHead>Project</TableHead><TableHead>Submitted by</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{rows.map(([name, agent, status]) => <TableRow key={name}><TableCell className="font-medium">{name}</TableCell><TableCell className="font-mono text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><Bot className="size-3.5" />{agent}</span></TableCell><TableCell><Badge variant={status === "Published" ? "secondary" : "outline"}>{status === "Published" ? <CheckCircle2 /> : <Clock3 />}{status}</Badge></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>;
}
