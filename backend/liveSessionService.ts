import axios from "axios";

// Use same-origin proxy in dev/preview (Vite config proxies /api → backend)
// For production builds, set VITE_API_BASE_URL to your backend base.
const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const buildLiveSessionsBase = (raw: string) => {
  const trimmed = raw.replace(/\/+$/, "");
  if (!trimmed) return "/api/live-sessions";
  if (trimmed === "/api") return "/api/live-sessions";
  if (trimmed.endsWith("/api")) return `${trimmed}/live-sessions`;
  return `${trimmed}/api/live-sessions`;
};

const api = axios.create({
  baseURL: buildLiveSessionsBase(String(RAW_API_BASE)),
  headers: { "Content-Type": "application/json" },
});

/* =========================
   TYPES
========================= */

export interface LiveSession {
  id: string;
  sessionName: string;   // patient name
  sessionUrl: string;    // Jitsi URL
  doctorId: string;
  doctorName?: string;
  doctorEmail?: string;
  createdAt: string;
}

/* =========================
   CREATE SESSION
========================= */

export const createLiveSession = async (payload: {
  sessionName: string;
  sessionUrl: string;
  doctorId: string;
  doctorName?: string;
  doctorEmail?: string;
}): Promise<LiveSession> => {
  const { data } = await api.post("/", payload);
  return data.session;
};

/* =========================
   NEW (DOCTOR / PATIENT)
========================= */

export const getDoctorSessions = async (
  doctorId: string
): Promise<LiveSession[]> => {
  const { data } = await api.get("/doctor", { params: { doctorId } });
  return data.sessions || [];
};

export const getPatientSessions = async (
  patientId: string
): Promise<LiveSession[]> => {
  const { data } = await api.get("/patient", { params: { patientId } });
  return data.sessions || [];
};

/* =========================
   BACKWARD COMPATIBILITY
   (DO NOT REMOVE)
========================= */

// OLD NAMES → mapped to new APIs
// This ensures existing pages DO NOT BREAK

export const getTeacherSessions = getDoctorSessions;
export const getStudentSessions = getPatientSessions;
