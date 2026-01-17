"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPatientSessions, LiveSession } from "@/services/liveSessionService";

declare global {
  interface Window {
    JitsiMeetExternalAPI?: any;
  }
}

/* 🔥 ALWAYS-AVAILABLE JITSI ROOM */
const FALLBACK_JITSI_URL =
  "https://8x8.vc/vpaas-magic-cookie-27bbe0bbe7d340799edfdd4b4250ddc6/SampleAppDownstairsReplacementsAdmitQuite";

export default function PatientTeleconsultationPage() {
  const [sessionUrl, setSessionUrl] = useState<string>(FALLBACK_JITSI_URL);

  const jaasContainerRef = useRef<HTMLDivElement | null>(null);
  const jaasApiRef = useRef<any>(null);

  /* =========================
     LOAD SESSION (OPTIONAL)
  ========================= */
  useEffect(() => {
    const load = async () => {
      try {
        const data: LiveSession[] = await getPatientSessions("public");

        // ✅ If session exists → override fallback
        if (data.length > 0 && data[0].sessionUrl) {
          setSessionUrl(data[0].sessionUrl);
        }
      } catch {
        // ❌ Ignore errors → fallback stays
      }
    };

    load();
  }, []);

  /* =========================
     LOAD JITSI ALWAYS
  ========================= */
  useEffect(() => {
    if (!jaasContainerRef.current) return;

    const url = new URL(sessionUrl);
    const domain = url.hostname;
    const roomName = url.pathname.replace(/^\//, "");

    const loadScript = () =>
      new Promise<void>((resolve) => {
        if (window.JitsiMeetExternalAPI) return resolve();

        const script = document.createElement("script");
        script.src =
          "https://8x8.vc/vpaas-magic-cookie-27bbe0bbe7d340799edfdd4b4250ddc6/external_api.js";
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
      });

    loadScript().then(() => {
      if (jaasApiRef.current) jaasApiRef.current.dispose();

      jaasApiRef.current = new window.JitsiMeetExternalAPI(domain, {
        roomName,
        parentNode: jaasContainerRef.current,
      });
    });

    return () => {
      jaasApiRef.current?.dispose();
      jaasApiRef.current = null;
    };
  }, [sessionUrl]);

  /* =========================
     UI
  ========================= */
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Teleconsultation</h1>
      <p className="text-muted-foreground">
        Join the live consultation with your doctor.
      </p>

      <Card className="h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Consultation preview
          </CardTitle>
        </CardHeader>

        <CardContent className="h-[520px]">
          <div className="relative w-full h-full rounded-xl overflow-hidden border bg-black">
            <div ref={jaasContainerRef} className="w-full h-full" />

            <div className="absolute top-3 right-3">
              <Button size="sm" asChild>
                <a href={sessionUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in new tab
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
