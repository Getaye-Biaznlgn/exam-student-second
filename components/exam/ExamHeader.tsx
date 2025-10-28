// components/exam/ExamHeader.tsx
import { Button } from "@/components/ui/button";
import { ExamTimer } from "@/components/exam-timer";
import { List, X } from "lucide-react";

interface Props {
  profile: any;
  user: any;
  title: string;
  duration: number;
  showSidebarMobile: boolean;
  toggleSidebar: () => void;
  onTimeUp: () => void;
}

export function ExamHeader({
  profile,
  user,
  title,
  duration,
  showSidebarMobile,
  toggleSidebar,
  onTimeUp,
}: Props) {
  return (
    <header className="border-b p-3 sticky top-0 bg-white z-20 flex justify-between items-center shadow-md">
      {/* Desktop info */}
      <div className="hidden sm:flex flex-col text-xs text-gray-700 space-y-1">
        <div className="flex gap-3 items-center">
          <span className="font-semibold w-28">Full Name:</span>
          <span>
            {profile
              ? `${profile.first_name || ""} ${
                  profile.last_name || ""
                }`.toUpperCase()
              : user.name?.toUpperCase() || "..."}
          </span>
        </div>
        <div className="flex gap-3 items-center">
          <span className="font-semibold w-28">Stream:</span>
          <span>{profile?.stream || "..."}</span>
        </div>
        <div className="flex gap-3 items-center">
          <span className="font-semibold w-28">Student ID:</span>
          <span>{profile?.student_id || "..."}</span>
        </div>
      </div>

      {/* Timer + Title + Mobile toggle */}
      <div className="flex items-center justify-between w-full sm:w-auto">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden mr-4"
        >
          {showSidebarMobile ? (
            <X className="h-5 w-5" />
          ) : (
            <List className="h-5 w-5" />
          )}
        </Button>
        <div className="text-right">
          <div className="text-lg font-semibold text-red-600">
            <ExamTimer durationMinutes={duration} onTimeUp={onTimeUp} />
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            {title}
          </div>
        </div>
      </div>
    </header>
  );
}
