"use client";

import React, { useState, useEffect } from "react";
import { School } from "@/lib/types";
import { fetchSchools } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/lib/locale-context";

interface SchoolSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function SchoolSelect({ value, onValueChange, disabled = false }: SchoolSelectProps) {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLocale();

  useEffect(() => {
    const loadSchools = async () => {
      try {
        setLoading(true);
        const response = await fetchSchools();
        
        if (response.success && response.data) {
          setSchools(response.data);
        } else {
          toast({
            title: t("schoolSelect.errorTitle"),
            description: response.message || t("schoolSelect.errorDefault"),
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
        toast({
          title: t("schoolSelect.errorTitle"),
          description: t("schoolSelect.errorRetry"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSchools();
  }, [toast, t]);

  if (loading) {
    return (
      <div className="space-y-2">
        <Label htmlFor="school-select">{t("schoolSelect.label")}</Label>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder={t("schoolSelect.loading")} />
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="school-select">{t("schoolSelect.label")}</Label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id="school-select">
          <SelectValue placeholder={t("schoolSelect.placeholder")} />
        </SelectTrigger>
        <SelectContent>
          {schools.map((school) => (
            <SelectItem key={school.id} value={school.id}>
              <div className="flex flex-col">
                <span className="font-medium">{school.name}</span>
                <span className="text-sm text-muted-foreground">
                  {school.address_name}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
