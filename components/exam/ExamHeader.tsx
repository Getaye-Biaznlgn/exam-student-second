"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ExamTimer } from "@/components/exam-timer";
import { List, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

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
  const router = useRouter();
  const [showExitModal, setShowExitModal] = useState(false);

  const handleExitConfirm = () => {
    setShowExitModal(false);
    router.push("/dashboard");
  };

  const fullName = profile
    ? `${profile.first_name || ""} ${profile.last_name || ""}`.toUpperCase()
    : user.name?.toUpperCase() || "...";

  return (
    <header className="border-b p-3 sticky top-0 bg-white z-20 flex justify-between items-center shadow-md">
      {/* Desktop info – horizontal layout */}
      <div className="hidden sm:flex items-center gap-6 text-xs text-gray-700">
        <div className="flex items-center gap-2">
          <span className="font-semibold w-20">Full Name:</span>
          <span className="truncate max-w-40">{fullName}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold w-14">Stream:</span>
          <span>{profile?.stream || "..."}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold w-20">Student ID:</span>
          <span>{profile?.student_id || "..."}</span>
        </div>
      </div>

      {/* Timer + Title + Exit button */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
        {/* Sidebar toggle for mobile */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          {showSidebarMobile ? (
            <X className="h-5 w-5" />
          ) : (
            <List className="h-5 w-5" />
          )}
        </Button>

        {/* Title */}
        <div className="text-right flex-1 sm:flex-none">
          <div className="text-xs sm:text-sm text-muted-foreground">
            {title}
          </div>
        </div>

        {/* Exit Exam Button */}
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowExitModal(true)}
          className="ml-2"
        >
          Exit Exam
        </Button>
      </div>

      {/* Exit Confirmation Modal */}
      <Dialog open={showExitModal} onOpenChange={setShowExitModal}>
        <DialogContent className="max-w-sm rounded-lg">
          <DialogHeader>
            <DialogTitle>Exit Exam?</DialogTitle>
            <DialogDescription>
              Are you sure you want to exit the exam? Your current progress will
              not be saved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowExitModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleExitConfirm}>
              Yes, Exit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
