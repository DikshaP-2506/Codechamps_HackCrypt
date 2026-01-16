import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Lock, Globe, Trash2 } from "lucide-react";

interface Props {
  group: any;
  onJoin: (id: string) => void;
  onDelete?: (id: string) => void;
  onOpen?: (id: string) => void;
  onLeave?: (id: string) => void;
  joining?: boolean;
  isMember?: boolean;
  requestSent?: boolean;
  isCreator?: boolean;
}

const topicColor = (topic: string) => {
  if (!topic) return "from-emerald-500 to-teal-500";
  const s = topic.toLowerCase();
  if (s.includes("cardio") || s.includes("heart")) return "from-teal-500 to-cyan-500";
  if (s.includes("diabetes") || s.includes("metabolic")) return "from-emerald-500 to-teal-500";
  if (s.includes("mental") || s.includes("mind")) return "from-teal-500 to-sky-500";
  if (s.includes("fitness") || s.includes("rehab")) return "from-emerald-400 to-cyan-500";
  return "from-emerald-500 to-teal-500";
};

export default function CommunityCard({
  group,
  onJoin,
  onDelete,
  onOpen,
  onLeave,
  joining,
  isMember,
  requestSent,
  isCreator,
}: Props) {
  const grad = topicColor(group.topic || "");
  const groupId = group._id || group.id;

  return (
    <div
      onClick={() => onOpen?.(groupId)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-300"
    >
      <div className={`relative h-20 bg-gradient-to-br ${grad} p-4`}>
        <div className="relative z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Users className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>

      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate font-semibold text-gray-900">{group.name}</h3>
          {isCreator && <div className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">Creator</div>}
        </div>
        <p className="text-sm text-gray-600">{group.topic}</p>

        <div className="flex items-center justify-between border-t border-gray-200 pt-2">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" /> <span>{group.memberCount ?? '-'} members</span>
            </div>
            <div className="flex items-center gap-1">
              {group.visibility === "public" ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              <span className="text-xs">{group.visibility === "public" ? "Public" : "Private"}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isCreator && (
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(groupId);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}

            {isMember ? (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen?.(groupId);
                  }}
                >
                  Open
                </Button>
                {!isCreator && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLeave?.(groupId);
                    }}
                  >
                    Leave
                  </Button>
                )}
              </div>
            ) : (
              <Button
                size="sm"
                className="bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onJoin(groupId);
                }}
                disabled={joining || requestSent}
              >
                {joining ? "Joining..." : requestSent ? "Requested" : "Join"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
