// components/exam/QuestionExplanations.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface AIExplanation {
  content: string;
  steps?: string[];
  why_correct?: string;
  why_wrong?: string;
  key_concepts?: string[];
  tips?: string;
}

interface Props {
  staticExplanation: string | null;
  aiExplanation: AIExplanation | null;
  isFetchingAI: boolean;
  aiError: string | null;
  onFetchAI: () => void;
}

function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

export function QuestionExplanations({
  staticExplanation,
  aiExplanation,
  isFetchingAI,
  aiError,
  onFetchAI,
}: Props) {
  const [showStatic, setShowStatic] = useState(false);
  const [showAI, setShowAI] = useState(false);

  return (
    <div className="mt-6 space-y-4">
      {/* === Static Explanation === */}
      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowStatic((v) => !v)}
          className="w-full sm:w-auto"
        >
          {showStatic ? "Hide" : "Show"} Explanation
        </Button>

        {showStatic && staticExplanation && (
          <Card className="mt-2 p-4 bg-muted/10 border border-primary/20">
            <h4 className="font-semibold text-primary mb-2">Explanation</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {stripHtml(staticExplanation)}
            </p>
          </Card>
        )}
      </div>

      {/* === AI Explanation === */}
      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setShowAI((v) => !v);
            if (!aiExplanation && !isFetchingAI) onFetchAI();
          }}
          disabled={isFetchingAI}
          className="w-full sm:w-auto"
        >
          {showAI ? "Hide" : "Show"} AI Explanation
          {isFetchingAI && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </Button>

        {showAI && (
          <div className="mt-2">
            {isFetchingAI && (
              <div className="flex items-center text-muted-foreground p-3">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating AI Explanation...
              </div>
            )}

            {aiError && !isFetchingAI && (
              <p className="text-red-500 text-sm p-2">{aiError}</p>
            )}

            {aiExplanation && !isFetchingAI && (
              <Card className="p-4 bg-muted/10 border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">
                  AI Explanation
                </h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {stripHtml(aiExplanation.content)}
                </p>
                {/* Optional: render other AI fields */}
                {aiExplanation.steps && aiExplanation.steps.length > 0 && (
                  <div className="mt-3">
                    <h5 className="font-medium text-sm">Steps:</h5>
                    <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 mt-1">
                      {aiExplanation.steps.map((step, i) => (
                        <li key={i}>{stripHtml(step)}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
