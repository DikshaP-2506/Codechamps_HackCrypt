"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, Loader2, Play, Video, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { getStudentSessions, LiveSession } from "@/services/liveSessionService";

export default function PatientTeleconsultationPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) || sessions[0],
    [sessions, activeSessionId]
  );

  useEffect(() => {
    if (!user?.uid) return;

    const load = async () => {
      setLoading(true);
      try {
        // patientId passed here
        const data = await getStudentSessions(user.uid);
        setSessions(data);
        if (data.length) {
          setActiveSessionId((prev) => prev ?? data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch teleconsultations", error);
        toast({
          title: "Error",
          description: "Could not load teleconsultations",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.uid, toast]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold">
            Teleconsultation
          </h1>
          <p className="text-muted-foreground mt-1">
            Join Jitsi consultation rooms shared by your doctors.
          </p>
        </div>
        <Badge variant="secondary">Your doctors only</Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* LEFT – VIDEO PREVIEW */}
        <Card className="lg:col-span-2 h-[480px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" /> Consultation preview
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            {loading && (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Loading teleconsultations...
              </div>
            )}

            {!loading && !activeSession && (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No teleconsultations available yet.
              </div>
            )}

            {!loading && activeSession && (
              <div className="relative h-full rounded-xl overflow-hidden border bg-black">
                <iframe
                  key={activeSession.id}
                  src={activeSession.sessionUrl}
                  title={activeSession.sessionName}
                  allow="camera; microphone; fullscreen; display-capture; autoplay"
                  className="w-full h-full"
                />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-background/90 rounded-lg px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold">
                      {activeSession.sessionName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Doctor: {activeSession.teacherName || "Assigned doctor"}
                    </p>
                  </div>
                  <Button size="sm" asChild>
                    <a
                      href={activeSession.sessionUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Join
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* RIGHT – SESSION LIST */}
        <Card className="h-[480px]">
          <CardHeader>
            <CardTitle>All teleconsultations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 overflow-y-auto max-h-[400px] pr-1">
            {loading && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Loading...
              </div>
            )}

            {!loading && sessions.length === 0 && (
              <div className="text-sm text-muted-foreground">
                Your doctor has not shared any teleconsultation links yet.
              </div>
            )}

            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setActiveSessionId(session.id)}
                className={`w-full text-left p-3 rounded-lg border hover:border-primary hover:bg-primary/5 transition ${
                  activeSession?.id === session.id
                    ? "border-primary bg-primary/10"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src="/placeholder.svg"
                      alt={session.teacherName || ""}
                    />
                    <AvatarFallback>
                      {(session.teacherName || "DR")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {session.sessionName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.teacherName || "Doctor"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {new Date(session.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <Users className="w-3 h-3" /> Live
                  </Badge>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
