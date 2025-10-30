"use client";

import React, { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "../../components/auth-provider";
import Background3D from "../../components/3d-background";
import { useRouter } from "next/navigation";
import { LogOut, Edit3, Mail, User as UserIcon, Hash, Calendar, Layers, BookOpen, Clock } from "lucide-react"; // Added new icons for detail fields
import { db } from "../../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Type definition for ProfileDetail props
interface ProfileDetailProps {
  icon: React.ElementType;
  label: string;
  value: string | null | undefined;
}

// Helper component for displaying a single profile detail row
function ProfileDetail({ icon: Icon, label, value }: ProfileDetailProps) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-b-0">
      <Icon size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
        <p className="text-base font-medium text-gray-800 break-words">{value}</p>
      </div>
    </div>
  );
}

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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-lg animate-pulse z-10">Loading profile...</p>
      </div>
    );

  if (!user) return null;

  return (
    // NOTE: Keep the main styling (bg-gradient-to-br from-blue-50 via-white to-blue-100) for theme consistency
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden p-6 pt-24"> 
      {/* 3D animated background - Unchanged */}
      <Background3D className="absolute inset-0 z-0" />

      {/* Profile Card - Updated Styling */}
      <div
        className="relative z-10 w-full max-w-lg rounded-3xl bg-white/90 backdrop-blur-md border border-white/60
        shadow-2xl shadow-blue-200/50 p-8 transition-all duration-300"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-8">
          <div
            className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 
            text-white flex items-center justify-center text-4xl font-extrabold shadow-lg shadow-blue-500/50"
          >
            {user.email ? user.email.charAt(0).toUpperCase() : "U"}
          </div>

          <div className="mt-2">
            <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
              {profile?.name || user.displayName || "User"}
            </h2>
            <p className="text-md text-neutral-600 flex items-center justify-center gap-2 mt-1">
              <Mail size={16} className="text-blue-500" /> {user.email}
            </p>
            <p className="text-xs text-neutral-400 flex items-center justify-center gap-1 mt-1">
              <Hash size={14} className="text-gray-400" /> UID: {user.uid}
            </p>
          </div>
        </div>

        {/* Action Buttons or Edit Form */}
        {!isEditing ? (
          <div className="space-y-6">
            
            {/* Profile Details Section */}
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 shadow-inner">
                <ProfileDetail icon={UserIcon} label="Full Name" value={profile?.name} />
                <ProfileDetail icon={Calendar} label="Date of Birth" value={profile?.dob} />
                <ProfileDetail icon={Hash} label="Roll No." value={profile?.rollno} />
                <ProfileDetail icon={Layers} label="Branch" value={profile?.branch} />
                <ProfileDetail icon={BookOpen} label="Semester" value={profile?.semester} />
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl 
                shadow-lg shadow-blue-500/50 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.01]"
              >
                <Edit3 size={18} />
                **Edit Profile**
              </button>

              <button
                onClick={async () => {
                  await signOut();
                  router.push("/");
                }}
                className="w-full bg-gray-100 text-red-600 font-medium py-3 rounded-xl 
                shadow-md hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <EditForm
            initial={profile}
            onCancel={() => setIsEditing(false)}
            onSave={async (data) => {
              if (!user) return;
              try {
                // Also update display name in Firebase Auth if name is edited
                if (user.displayName !== data.name) {
                    // This is a placeholder as Firebase SDK is not imported, 
                    // but you might want to call: updateProfile(user, { displayName: data.name }) here.
                }

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

  // Common input styling for consistency
  const inputStyle = "mt-1 block w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-4 py-2.5 transition-shadow shadow-sm text-gray-700";
  const labelStyle = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        await onSave({ name, dob, rollno, branch, semester });
        setSaving(false);
      }}
      className="space-y-4"
    >
      <div>
        <label className={labelStyle}>Full Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className={inputStyle} placeholder="e.g. Jane Doe" required />
      </div>

      <div>
        <label className={labelStyle}>Date of Birth</label>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={inputStyle} />
      </div>

      <div>
        <label className={labelStyle}>Roll No.</label>
        <input value={rollno} onChange={(e) => setRollno(e.target.value)} className={inputStyle} placeholder="e.g. 21BCA12345" />
      </div>

      <div>
        <label className={labelStyle}>Branch</label>
        <input value={branch} onChange={(e) => setBranch(e.target.value)} className={inputStyle} placeholder="e.g. Computer Science" />
      </div>

      <div>
        <label className={labelStyle}>Semester</label>
        <input value={semester} onChange={(e) => setSemester(e.target.value)} className={inputStyle} placeholder="e.g. 5" />
      </div>

      <div className="flex gap-3 pt-4">
        <button 
          type="submit" 
          disabled={saving} 
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-70"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-neutral-800 font-medium py-3 rounded-xl transition-colors"
        >
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