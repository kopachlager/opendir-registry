"use client";

import { FormEvent, useState } from "react";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AdminLogin({ configured }: { configured: boolean }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: form.get("token") }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Login failed.");
      setLoading(false);
      return;
    }
    window.location.reload();
  }

  return (
    <Card className="mx-auto max-w-md rounded-none">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2"><KeyRound className="size-4" /> Reviewer access</CardTitle>
        <CardDescription>Enter the private OpenDir administrator token.</CardDescription>
      </CardHeader>
      <CardContent>
        {configured ? (
          <form onSubmit={login} className="space-y-4">
            <Input name="token" type="password" required autoComplete="current-password" placeholder="Admin token" />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button className="w-full" disabled={loading}>{loading ? "Signing in…" : "Open review queue"}</Button>
          </form>
        ) : (
          <p className="text-sm text-muted-foreground">Set <code>ADMIN_TOKEN</code> on the app service to enable moderation.</p>
        )}
      </CardContent>
    </Card>
  );
}
