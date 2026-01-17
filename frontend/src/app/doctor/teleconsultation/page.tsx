"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Loader2, Plus, Video, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  createLiveSession,
  getTeacherSessions,
  LiveSession,
} from "@/services/liveSessionService";
import { cn } from "@/lib/utils";

const SAMPLE_JAAS_URL =
  "https://8x8.vc/vpaas-magic-cookie-27bbe0bbe7d340799edfdd4b4250ddc6/SampleAppDownstairsReplacementsAdmitQuite";

declare global {
  interface Window {
    JitsiMeetExternalAPI?: any;
  }
}

export default function DoctorTeleconsultationPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // sessionName now represents Patient Name
  const [sessionName, setSessionName] = useState("");
  const [sessionUrl, setSessionUrl] = useState("");
  const [quickUrl, setQuickUrl] = useState("");

  const jaasContainerRef = useRef<HTMLDivElement | null>(null);
  const jaasApiRef = useRef<any>(null);

  const selectedSession = useMemo(
    () => sessions.find((s) => s.id === selectedId) || sessions[0],
    [sessions, selectedId]
  );

  const activeSession = useMemo(() => {
    if (selectedSession) return selectedSession;
    if (quickUrl.trim()) {
      return {
        id: "__quick__",
        sessionName: "Quick join",
        sessionUrl: quickUrl.trim(),
        teacherId: user?.uid || "",
        createdAt: new Date().toISOString(),
      } as LiveSession;
    }
    return undefined;
  }, [quickUrl, selectedSession, user?.uid]);

  const loadSampleRoom = () => {
    setQuickUrl(SAMPLE_JAAS_URL);
    setSelectedId(null);
  };

  const jaasInfo = useMemo(() => {
    if (!activeSession) return { isJaas: false, domain: "", roomName: "" };
    try {
      const url = new URL(activeSession.sessionUrl);
      const isJaas = url.hostname === "8x8.vc" || url.pathname.includes("vpaas-magic-cookie");
      const roomName = url.pathname.replace(/^\//, "");
      return { isJaas, domain: url.hostname, roomName };
    } catch {
      return { isJaas: false, domain: "", roomName: "" };
    }
  }, [activeSession]);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const data = await getTeacherSessions(user.uid); // doctorId
        setSessions(data);
        if (data.length) {
          setSelectedId((prev) => prev ?? data[0].id);
        }
      } catch (error) {
        console.error("Failed to load teleconsultation sessions", error);
        toast({
          title: "Error",
          description: "Could not load teleconsultation sessions",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.uid, toast]);

  useEffect(() => {
    if (!jaasInfo.isJaas || !jaasContainerRef.current) {
      if (jaasApiRef.current) {
        jaasApiRef.current.dispose?.();
        jaasApiRef.current = null;
      }
      return;
    }

    const ensureScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve();
          return;
        }

        const existing = document.querySelector(
          'script[src^="https://8x8.vc/"][src$="external_api.js"]'
        ) as HTMLScriptElement | null;

        if (existing) {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener("error", () => reject(new Error("Jitsi script failed")), {
            once: true,
          });
          return;
        }

        const script = document.createElement("script");
        script.src =
          "https://8x8.vc/vpaas-magic-cookie-27bbe0bbe7d340799edfdd4b4250ddc6/external_api.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Jitsi script failed"));
        document.body.appendChild(script);
      });
    };

    ensureScript()
      .then(() => {
        if (!jaasContainerRef.current || !window.JitsiMeetExternalAPI) return;
        if (jaasApiRef.current) {
          jaasApiRef.current.dispose?.();
        }
        jaasApiRef.current = new window.JitsiMeetExternalAPI(jaasInfo.domain, {
          roomName: jaasInfo.roomName,
          parentNode: jaasContainerRef.current,
        });
      })
      .catch((err) => console.error("Jitsi script load failed", err));

    return () => {
      if (jaasApiRef.current) {
        jaasApiRef.current.dispose?.();
        jaasApiRef.current = null;
      }
    };
  }, [jaasInfo.domain, jaasInfo.isJaas, jaasInfo.roomName]);

  const resetForm = () => {
    setSessionName("");
    setSessionUrl("");
  };

  const handleCreate = async () => {
    if (!sessionName.trim() || !sessionUrl.trim()) {
      toast({
        title: "Missing info",
        description: "Add patient name and Jitsi meeting link",
        variant: "destructive",
      });
      return;
    }

    const normalizedUrl = sessionUrl.startsWith("http")
      ? sessionUrl.trim()
      : `https://${sessionUrl.trim()}`;

    setCreating(true);
    try {
      // Call backend to persist session
      const saved = await createLiveSession({
        sessionName: sessionName.trim(),
        sessionUrl: normalizedUrl,
        teacherId: user?.uid,
        teacherName: user?.displayName || user?.fullName,
        teacherEmail: user?.email,
      });

      setSessions((prev) => [saved, ...(prev || [])]);
      setSelectedId(saved.id);
      toast({ title: "Teleconsultation created", description: "Share this link with the patient" });
      setDialogOpen(false);
      resetForm();
      setLoading(false);
    } catch (error) {
      console.error("Create teleconsultation failed, saving locally", error);
      // fallback: create locally so UX remains responsive
      const newSession = {
        id: String(Date.now()) + Math.random().toString(36).slice(2),
        sessionName: sessionName.trim(),
        sessionUrl: normalizedUrl,
        teacherId: user?.uid || "local",
        teacherName: user?.displayName || user?.fullName || "Doctor",
        teacherEmail: user?.email || "",
        createdAt: new Date().toISOString(),
      } as LiveSession;
      setSessions((prev) => [newSession, ...(prev || [])]);
      setSelectedId(newSession.id);
      toast({ title: "Teleconsultation created (offline)", description: "Saved locally" });
      setDialogOpen(false);
      resetForm();
      setLoading(false);
    } finally {
      setCreating(false);
    }
  };

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast({ title: "Link copied", description: "Share it with the patient" });
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };

  const renderIframe = () => {
    if (!activeSession) {
      return (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          Choose a teleconsultation to preview
        </div>
      );
    }

    return (
      <div className="relative w-full h-full rounded-xl overflow-hidden border bg-black">
        {jaasInfo.isJaas ? (
          <div ref={jaasContainerRef} className="w-full h-full" />
        ) : (
          <iframe
            key={activeSession.id}
            src={activeSession.sessionUrl}
            title={activeSession.sessionName}
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            className="w-full h-full"
          />
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleCopyLink(activeSession.sessionUrl)}
          >
            <Copy className="w-4 h-4 mr-2" />Copy link
          </Button>
          <Button size="sm" asChild>
            <a href={activeSession.sessionUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />Open in new tab
            </a>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Teleconsultation</h1>
          <p className="text-muted-foreground text-sm">
            Create a Jitsi consultation session and share it with your patient.
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />Create teleconsultation
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 h-[560px]">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" /> Jitsi room
            </CardTitle>
            <div className="grid gap-2 md:grid-cols-[1fr_auto_auto] items-center">
              <Input
                placeholder="Paste Jitsi / 8x8 URL to preview"
                value={quickUrl}
                onChange={(e) => setQuickUrl(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={() => quickUrl && setSelectedId(null)}
                disabled={!quickUrl.trim()}
              >
                Load URL
              </Button>
              {activeSession && (
                <Button asChild>
                  <a href={activeSession.sessionUrl} target="_blank" rel="noreferrer">
                    Open / Join
                  </a>
                </Button>
              )}
              <Button variant="ghost" onClick={loadSampleRoom}>
                Load sample room
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-[460px]">
            {loading && !activeSession ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading sessions...
              </div>
            ) : (
              renderIframe()
            )}
          </CardContent>
        </Card>

        <Card className="h-[560px]">
          <CardHeader>
            <CardTitle>My teleconsultations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 overflow-y-auto max-h-[480px] pr-1">
            {loading && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading...
              </div>
            )}

            {!loading && sessions.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No teleconsultations yet. Create one to get a sharable Jitsi link.
              </div>
            )}

            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setSelectedId(session.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg border hover:border-primary hover:bg-primary/5 transition",
                  selectedSession?.id === session.id && "border-primary bg-primary/10"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{session.sessionName}</p>
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(session.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline">Jitsi</Badge>
                </div>
                <p className="text-xs text-primary truncate mt-2">
                  {session.sessionUrl}
                </p>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create teleconsultation</DialogTitle>
            <DialogDescription>
              Enter the patient name and paste the Jitsi meeting link.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session-name">Patient name</Label>
              <Input
                id="session-name"
                placeholder="Enter patient name"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="session-url">Jitsi meeting URL</Label>
              <Input
                id="session-url"
                placeholder="https://8x8.vc/..."
                value={sessionUrl}
                onChange={(e) => setSessionUrl(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={creating}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
