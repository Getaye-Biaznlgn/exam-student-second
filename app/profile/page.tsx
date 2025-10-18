// src/components/profile.tsx
"use client";

import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "@/lib/api"; // adjust path if needed
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState<any>({});
  const [message, setMessage] = useState("");

  // Fetch user profile on mount
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const res = await getUserProfile();
      if (res.success && res.data) {
        const field =
          res.data.stream?.charAt(0).toUpperCase() +
            res.data.stream?.slice(1).toLowerCase() || "";

        setProfile({
          ...res.data,
          stream: field === "Natural" || field === "Social" ? field : "",
        });
      } else {
        setMessage(res.message || "Failed to fetch profile.");
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  // Handle update
  const handleUpdate = async () => {
    setUpdating(true);
    const res = await updateUserProfile(profile);
    setMessage(res.message);
    setUpdating(false);
  };

  if (loading) return <p className="text-center mt-6">Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card className="p-4">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {message && (
            <p
              className={`text-sm ${
                message.includes("success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <div className="space-y-3">
            <Input
              name="username"
              value={profile.username || ""}
              onChange={handleChange}
              placeholder="Username"
            />
            <Input
              name="email"
              value={profile.email || ""}
              onChange={handleChange}
              placeholder="Email"
            />
            <Input
              name="phone_number"
              value={profile.phone_number || ""}
              onChange={handleChange}
              placeholder="Phone Number"
            />
            <Input
              name="first_name"
              value={profile.first_name || ""}
              onChange={handleChange}
              placeholder="First Name"
            />
            <Input
              name="last_name"
              value={profile.last_name || ""}
              onChange={handleChange}
              placeholder="Last Name"
            />
            <Input
              name="student_id"
              value={profile.student_id || ""}
              onChange={handleChange}
              placeholder="Student ID"
            />
            <Input
              type="date"
              name="date_of_birth"
              value={profile.date_of_birth || ""}
              onChange={handleChange}
            />
            <select
              name="stream"
              value={profile.stream || ""}
              onChange={handleChange}
              className="border rounded-md p-2 w-full"
            >
              <option value="">Select Field Type</option>
              <option value="Natural">Natural</option>
              <option value="Social">Social</option>
            </select>
          </div>

          <Button
            onClick={handleUpdate}
            disabled={updating}
            className="w-full mt-4"
          >
            {updating ? "Updating..." : "Update Profile"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
