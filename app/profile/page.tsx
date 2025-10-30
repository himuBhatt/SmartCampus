"use client";

import React, { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "../../components/auth-provider";
import Background3D from "../../components/3d-background";
import { useRouter } from "next/navigation";
import { LogOut, Edit3, Mail, User as UserIcon, Hash } from "lucide-react";
import { db } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function ProfileContent() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [loading, user, router]);

  const [profile, setProfile] = useState<{
    name?: string;
    dob?: string;
    rollno?: string;
    branch?: string;
    semester?: string;
  } | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProfile(snap.data() as any);
        }
      } catch (e) {
        console.error("Failed to fetch profile", e);
      }
    }
    fetchProfile();
  }, [user]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg animate-pulse">Loading profile...</p>
      </div>
    );

  if (!user) return null;

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      {/* 3D animated background */}
      <Background3D className="absolute inset-0 z-0" />

      {/* Profile Card */}
      <div
        className="relative z-20 w-full max-w-lg rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50
        shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]"
      >
        {/* Header */}
        <div className="flex items-center gap-5 mb-6">
          <div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 
            text-white flex items-center justify-center text-3xl font-semibold shadow-md"
          >
            {user.email ? user.email.charAt(0).toUpperCase() : "U"}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <UserIcon size={20} className="text-blue-500" />
              {user.displayName ?? "User"}
            </h2>
            <p className="text-sm text-neutral-600 flex items-center gap-1">
              <Mail size={16} className="text-gray-400" /> {user.email}
            </p>
            <p className="text-xs text-neutral-400 flex items-center gap-1 mt-1">
              <Hash size={14} className="text-gray-400" /> UID: {user.uid}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-6" />
        {/* Action Buttons or Edit Form */}
        {!isEditing ? (
          <div className="flex gap-3">
            <button
              onClick={async () => {
                await signOut();
                router.push("/");
              }}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white font-medium py-2 rounded-md 
            shadow-md hover:shadow-lg hover:from-red-700 hover:to-red-600 transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Sign out
            </button>

            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-md 
            shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Edit3 size={18} />
              Edit profile
            </button>
          </div>
        ) : (
          <EditForm
            initial={profile}
            onCancel={() => setIsEditing(false)}
            onSave={async (data) => {
              if (!user) return;
              try {
                await setDoc(doc(db, "users", user.uid), data, { merge: true });
                setProfile(data);
                setIsEditing(false);
              } catch (e) {
                console.error("Failed to save profile", e);
              }
            }}
          />
        )}
      </div>
    </main>
  );
}

function EditForm({
  initial,
  onCancel,
  onSave,
}: {
  initial?: any | null;
  onCancel: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [dob, setDob] = useState(initial?.dob ?? "");
  const [rollno, setRollno] = useState(initial?.rollno ?? "");
  const [branch, setBranch] = useState(initial?.branch ?? "");
  const [semester, setSemester] = useState(initial?.semester ?? "");
  const [saving, setSaving] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        await onSave({ name, dob, rollno, branch, semester });
        setSaving(false);
      }}
      className="space-y-3"
    >
      <div>
        <label className="block text-sm font-medium">Full name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Date of birth</label>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Roll No.</label>
        <input value={rollno} onChange={(e) => setRollno(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Branch</label>
        <input value={branch} onChange={(e) => setBranch(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Semester</label>
        <input value={semester} onChange={(e) => setSemester(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
      </div>

      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={saving} className="flex-1 bg-blue-600 text-white py-2 rounded-md">
          {saving ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-100 text-neutral-800 py-2 rounded-md">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <ProfileContent />
    </AuthProvider>
  );
}
