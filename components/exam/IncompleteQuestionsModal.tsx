"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  count: number;
  onClose: () => void;
}

export function IncompleteQuestionsModal({ open, count, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Incomplete Exam</DialogTitle>
          <DialogDescription>
            You still have <strong>{count}</strong> unanswered and unflagged
            question
            {count > 1 ? "s" : ""}. Please answer or flag all questions before
            submitting your exam.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
