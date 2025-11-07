// components/exam/QuestionExplanations.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { sanitize } from "isomorphic-dompurify";

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

function SafeHtml({ html }: { html: string }) {
  const clean = sanitize(html, {
    ADD_TAGS: ["b", "i", "u", "strong", "em", "ul", "ol", "li", "p", "br"],
    ADD_ATTR: [],
  });
  return (
    <div
      dangerouslySetInnerHTML={{ __html: clean }}
      className="prose prose-sm max-w-none"
    />
  );
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
    <div className=" space-y-6">
      {/* === Buttons Row (Horizontal) === */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Static Explanation Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowStatic((v) => !v)}
          className="w-full sm:w-auto"
        >
          {showStatic ? "Hide" : "Show"} Explanation
        </Button>

        {/* AI Explanation Button */}
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
      </div>

      {/* === Static Explanation Content === */}
      {showStatic && staticExplanation && (
        <Card className="p-4 bg-muted/10 border border-primary/20">
          <h4 className="font-semibold text-primary mb-3">Explanation</h4>
          <SafeHtml html={staticExplanation} />
        </Card>
      )}

      {/* === AI Explanation Content === */}
      {showAI && (
        <div className="space-y-3">
          {isFetchingAI && (
            <div className="flex items-center text-muted-foreground p-3">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating AI Explanation...
            </div>
          )}

          {aiError && !isFetchingAI && (
            <p className="text-red-500 text-sm p-2 bg-red-50 rounded">
              {aiError}
            </p>
          )}

          {aiExplanation && !isFetchingAI && (
            <Card className="p-5 bg-muted/10 border border-primary/20">
              <h4 className="font-semibold text-primary mb-4">
                AI Explanation
              </h4>

              {/* Main Content */}
              {aiExplanation.content && (
                <div className="mb-4">
                  <SafeHtml html={aiExplanation.content} />
                </div>
              )}

              {/* Steps */}
              {aiExplanation.steps && aiExplanation.steps.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium text-sm text-primary mb-2">
                    Step-by-step:
                  </h5>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    {aiExplanation.steps.map((step, i) => (
                      <li key={i}>
                        <SafeHtml html={step} />
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Why Correct */}
              {aiExplanation.why_correct && (
                <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
                  <p className="font-medium text-green-800 text-sm">
                    Why this answer is correct:
                  </p>
                  <div className="text-sm text-green-700 mt-1">
                    <SafeHtml html={aiExplanation.why_correct} />
                  </div>
                </div>
              )}

              {/* Key Concepts */}
              {aiExplanation.key_concepts &&
                aiExplanation.key_concepts.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium text-sm text-primary mb-2">
                      Key Concepts:
                    </h5>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {aiExplanation.key_concepts.map((kc, i) => (
                        <li key={i}>
                          <SafeHtml html={kc} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Tips */}
              {aiExplanation.tips && (
                <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                  <p className="font-medium text-blue-800 text-sm">Exam Tip:</p>
                  <p className="text-sm text-blue-700 mt-1">
                    <SafeHtml html={aiExplanation.tips} />
                  </p>
                </div>
              )}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
