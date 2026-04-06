"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useFinanceStore } from "@/store/useFinanceStore";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { User, LogOut, Sun, Moon } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, fetchProfile, updateProfile } = useFinanceStore();
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
    }
    // Get email from auth
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setEmail(data.user.email || "");
    });
  }, [profile]);

  const handleSaveName = async () => {
    setSaving(true);
    await updateProfile({ full_name: fullName });
    setSaving(false);
  };

  const handleToggleTheme = async () => {
    const newTheme = profile?.theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    await updateProfile({ theme: newTheme });
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const initials = (profile?.full_name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-text-primary">
        Profile
      </h1>

      {/* Avatar + info */}
      <Card className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-accent/15 flex items-center justify-center text-accent font-display text-xl font-bold shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-lg font-semibold text-text-primary truncate">
            {profile?.full_name || "User"}
          </p>
          <p className="text-sm text-text-muted truncate">{email}</p>
        </div>
      </Card>

      {/* Edit name */}
      <Card>
        <h3 className="font-display text-sm font-semibold text-text-primary mb-4">
          Edit Name
        </h3>
        <div className="flex gap-3">
          <Input
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleSaveName}
            loading={saving}
            disabled={fullName === profile?.full_name}
          >
            Save
          </Button>
        </div>
      </Card>

      {/* Theme toggle */}
      <Card className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-sm font-semibold text-text-primary">
            Appearance
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            {profile?.theme === "dark" ? "Dark mode" : "Light mode"}
          </p>
        </div>
        <button
          onClick={handleToggleTheme}
          className="p-3 rounded-xl bg-bg-tertiary hover:bg-accent/10 transition-colors"
        >
          {profile?.theme === "dark" ? (
            <Sun className="h-5 w-5 text-amber-400" />
          ) : (
            <Moon className="h-5 w-5 text-blue-400" />
          )}
        </button>
      </Card>

      {/* Sign out */}
      <Button variant="danger" onClick={handleSignOut} className="w-full">
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
}
