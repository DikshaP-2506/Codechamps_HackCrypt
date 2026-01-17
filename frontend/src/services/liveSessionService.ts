import axios from "axios";

// Frontend uses NEXT_PUBLIC env for base URL when provided
const RAW_API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL as string) || "";

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

export interface LiveSession {
  id: string;
  sessionName: string;
  sessionUrl: string;
  teacherId?: string;
  teacherName?: string;
  teacherEmail?: string;
  doctorId?: string;
  doctorName?: string;
  doctorEmail?: string;
  createdAt: string;
}

export const createLiveSession = async (payload: {
  sessionName: string;
  sessionUrl: string;
  // accept either teacherId (old) or doctorId (new)
  teacherId?: string;
  teacherName?: string;
  teacherEmail?: string;
  doctorId?: string;
  doctorName?: string;
  doctorEmail?: string;
}): Promise<LiveSession> => {
  // normalize payload for backend which expects doctorId
  const body: any = {
    sessionName: payload.sessionName,
    sessionUrl: payload.sessionUrl,
    doctorId: payload.doctorId || payload.teacherId,
    doctorName: payload.doctorName || payload.teacherName,
    doctorEmail: payload.doctorEmail || payload.teacherEmail,
  };

  const { data } = await api.post("/", body);
  return data.session;
};

export const getDoctorSessions = async (doctorId: string): Promise<LiveSession[]> => {
  const { data } = await api.get("/doctor", { params: { doctorId } });
  return data.sessions || [];
};

export const getPatientSessions = async (patientId: string): Promise<LiveSession[]> => {
  const { data } = await api.get("/patient", { params: { patientId } });
  return data.sessions || [];
};

// Backward compatibility aliases
export const getTeacherSessions = getDoctorSessions;
export const getStudentSessions = getPatientSessions;
