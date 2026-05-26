"use client";

import React, { useState, useTransition } from "react";
import { User, Building2, Clock, Shield, CheckCircle2, AlertCircle, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  updateAdminProfile,
  updateAdminPassword,
  updateSalonInfo,
  updateBookingRules,
} from "./actions";

type AdminUser = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
};

type SalonSettingsData = {
  salonName: string;
  tagline: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  phone: string | null;
  email: string | null;
  bio: string | null;
  openTime: string;
  closeTime: string;
  slotInterval: number;
  cancelHours: number;
};

// Shared input styles so every field looks consistent.
const inputClass =
  "w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-colors bg-white text-gray-900";
const labelClass =
  "block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2";

function Alert({ type, message }: { type: "success" | "error"; message: string }) {
  if (!message) return null;
  const isSuccess = type === "success";
  return (
    <div
      className={`flex items-center gap-2 text-sm py-2 px-3 rounded-md mb-4 ${
        isSuccess ? "text-green-700 bg-green-50" : "text-red-600 bg-red-50"
      }`}
      role="alert"
    >
      {isSuccess ? (
        <CheckCircle2 className="w-4 h-4 shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 shrink-0" />
      )}
      {message}
    </div>
  );
}

function SectionIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
      <Icon className="w-5 h-5 text-[var(--color-primary)]" />
    </div>
  );
}

export default function SettingsClient({
  admin,
  settings,
}: {
  admin: AdminUser;
  settings: SalonSettingsData;
}) {
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [salonMsg, setSalonMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [bookingMsg, setBookingMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const initials =
    admin.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "EM";

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-gray-900 uppercase">
          Settings
        </h1>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Manage your account, salon details, and booking preferences.
        </p>
      </div>

      {/* ── Profile ── */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3 sm:gap-4 pb-4">
          <SectionIcon icon={User} />
          <div className="min-w-0">
            <CardTitle className="text-base sm:text-lg uppercase tracking-wider text-gray-800">
              Your Profile
            </CardTitle>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Admin account details</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xl font-light tracking-wider">
              {initials}
            </div>
            <div>
              <p className="font-medium text-gray-900">{admin.name}</p>
              <p className="text-sm text-gray-500">{admin.email}</p>
              <span className="inline-block mt-1 text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                Admin
              </span>
            </div>
          </div>

          {profileMsg && <Alert type={profileMsg.type} message={profileMsg.text} />}

          <form
            action={(fd) => {
              startTransition(async () => {
                const res = await updateAdminProfile(fd);
                setProfileMsg(
                  res.ok
                    ? { type: "success", text: res.message }
                    : { type: "error", text: res.error }
                );
              });
            }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={admin.name ?? ""}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={admin.email ?? ""}
                  className={inputClass}
                  required
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                type="tel"
                name="phone"
                defaultValue={admin.phone ?? ""}
                className={inputClass}
                placeholder="(804) 537-0525"
              />
            </div>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ── Password ── */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3 sm:gap-4 pb-4">
          <SectionIcon icon={Shield} />
          <div className="min-w-0">
            <CardTitle className="text-base sm:text-lg uppercase tracking-wider text-gray-800">
              Security
            </CardTitle>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Change your login password</p>
          </div>
        </CardHeader>
        <CardContent>
          {passwordMsg && <Alert type={passwordMsg.type} message={passwordMsg.text} />}

          <form
            action={(fd) => {
              startTransition(async () => {
                const res = await updateAdminPassword(fd);
                setPasswordMsg(
                  res.ok
                    ? { type: "success", text: res.message }
                    : { type: "error", text: res.error }
                );
              });
            }}
            className="space-y-5"
          >
            <div>
              <label className={labelClass}>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                className={inputClass}
                required
                autoComplete="current-password"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  className={inputClass}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className={labelClass}>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className={inputClass}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
            </div>
            <Button type="submit" variant="outline" disabled={pending}>
              {pending ? "Updating…" : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ── Business Info ── */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3 sm:gap-4 pb-4">
          <SectionIcon icon={Building2} />
          <div className="min-w-0">
            <CardTitle className="text-base sm:text-lg uppercase tracking-wider text-gray-800">
              Business Info
            </CardTitle>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Salon details shown on your website and booking confirmations
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {salonMsg && <Alert type={salonMsg.type} message={salonMsg.text} />}

          <form
            action={(fd) => {
              startTransition(async () => {
                const res = await updateSalonInfo(fd);
                setSalonMsg(
                  res.ok
                    ? { type: "success", text: res.message }
                    : { type: "error", text: res.error }
                );
              });
            }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Salon Name</label>
                <input
                  type="text"
                  name="salonName"
                  defaultValue={settings.salonName}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Tagline / Motto</label>
                <input
                  type="text"
                  name="tagline"
                  defaultValue={settings.tagline ?? ""}
                  className={inputClass}
                  placeholder="Imagine. Inspire. Invigorate."
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Street Address</label>
              <input
                type="text"
                name="address"
                defaultValue={settings.address ?? ""}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div className="col-span-2 md:col-span-2">
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  name="city"
                  defaultValue={settings.city ?? ""}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input
                  type="text"
                  name="state"
                  defaultValue={settings.state ?? ""}
                  className={inputClass}
                  maxLength={2}
                />
              </div>
              <div>
                <label className={labelClass}>ZIP</label>
                <input
                  type="text"
                  name="zip"
                  defaultValue={settings.zip ?? ""}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Business Phone</label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={settings.phone ?? ""}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Business Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={settings.email ?? ""}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>About / Bio</label>
              <textarea
                name="bio"
                defaultValue={settings.bio ?? ""}
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="A short description of your salon…"
              />
            </div>

            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save Business Info"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ── Booking Rules ── */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3 sm:gap-4 pb-4">
          <SectionIcon icon={Clock} />
          <div className="min-w-0">
            <CardTitle className="text-base sm:text-lg uppercase tracking-wider text-gray-800">
              Hours & Booking
            </CardTitle>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Controls which time slots clients can book online
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {bookingMsg && <Alert type={bookingMsg.type} message={bookingMsg.text} />}

          <form
            action={(fd) => {
              startTransition(async () => {
                const res = await updateBookingRules(fd);
                setBookingMsg(
                  res.ok
                    ? { type: "success", text: res.message }
                    : { type: "error", text: res.error }
                );
              });
            }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Opens At</label>
                <input
                  type="time"
                  name="openTime"
                  defaultValue={settings.openTime}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Closes At</label>
                <input
                  type="time"
                  name="closeTime"
                  defaultValue={settings.closeTime}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Time Slot Interval (minutes)</label>
                <select
                  name="slotInterval"
                  defaultValue={settings.slotInterval}
                  className={inputClass}
                >
                  <option value={15}>Every 15 minutes</option>
                  <option value={30}>Every 30 minutes</option>
                  <option value={45}>Every 45 minutes</option>
                  <option value={60}>Every 60 minutes</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  How often appointment slots appear on the calendar.
                </p>
              </div>
              <div>
                <label className={labelClass}>Cancellation Window (hours)</label>
                <input
                  type="number"
                  name="cancelHours"
                  defaultValue={settings.cancelHours}
                  min={1}
                  max={168}
                  className={inputClass}
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Clients must cancel at least this many hours before their appointment.
                </p>
              </div>
            </div>

            {/* Live preview of current hours */}
            <div className="rounded-lg bg-gray-50 border border-gray-100 p-4 text-sm text-gray-600">
              <p className="font-medium text-gray-800 mb-1">Current booking window preview</p>
              <p>
                Clients can book between{" "}
                <strong>{formatTime(settings.openTime)}</strong> and{" "}
                <strong>{formatTime(settings.closeTime)}</strong>, with slots every{" "}
                <strong>{settings.slotInterval} min</strong>.
              </p>
            </div>

            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save Booking Rules"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Convert 24h "HH:mm" to friendly "9:00 AM" for the preview box.
function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}
