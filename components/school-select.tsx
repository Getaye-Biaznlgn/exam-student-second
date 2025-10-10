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

interface SchoolSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function SchoolSelect({ value, onValueChange, disabled = false }: SchoolSelectProps) {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadSchools = async () => {
      try {
        setLoading(true);
        const response = await fetchSchools();
        
        if (response.success && response.data) {
          setSchools(response.data);
        } else {
          toast({
            title: "Error loading schools",
            description: response.message || "Failed to fetch schools",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
        toast({
          title: "Error loading schools",
          description: "Failed to fetch schools. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSchools();
  }, [toast]);

  if (loading) {
    return (
      <div className="space-y-2">
        <Label htmlFor="school-select">School</Label>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Loading schools..." />
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="school-select">School</Label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id="school-select">
          <SelectValue placeholder="Select your school" />
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
