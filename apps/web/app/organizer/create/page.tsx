"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { State, City } from "country-state-city";
import { useSession } from "next-auth/react";
import { ROLES } from "@/lib/constants";
import { toast } from "sonner";

const EVENT_TAGS = [
  "MUSIC",
  "TECH",
  "SPORTS",
  "WORKSHOP",
  "BUSINESS",
  "ART",
  "COMMUNITY",
  "OTHERS",
];

export default function CreateEventPage() {
  const router = useRouter();
  const {data:session, status} = useSession();

  const isOrganizer = session?.user?.role == ROLES.ORGANIZER;

  if(status != "loading" && !isOrganizer) {
    router.push("/events");
  }

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    capacity: 100,
    price: 0,
    tags: ["TECH"],
    location: {
      country: "India",
      state: "",
      city: "",
      addressLine: "",
      postalCode: ""
    },
  });

  const states = State.getStatesOfCountry("IN");

  const selectedState = states.find(
    (s) => s.name === form.location.state
  );

    const handleFileChange = (file: File | null) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Only image files are allowed");
            return;
        }

        // Optional: size check (e.g. 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be less than 5MB");
            return;
        }
        setFile(file);
        setPreview(URL.createObjectURL(file));
    };

  const cities = selectedState
    ? City.getCitiesOfState("IN", selectedState.isoCode)
    : [];

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (form.title.length < 3) {
        toast.error("Title must be at least 3 characters");
        return;
    }

    if (form.description.length < 10) {
        toast.error("Description must be at least 10 characters");
        return;
    }

    if (!form.location.state || !form.location.city) {
        toast.error("Please select state and city");
        return;
    }

    if (loading) return;

    try {
      setLoading(true);

      const createRes = await fetch("/api/events", {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const createdEvent = await createRes.json();

      if (!createRes.ok) {
        throw new Error(createdEvent.message);
      }

      const eventId = createdEvent.id;

      if (file) {
        const presignRes = await fetch("/api/uploads/presigned-url", {
          method: "POST",
          body: JSON.stringify({
            eventId,
            fileType: file.type,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const { uploadUrl, fileUrl } = await presignRes.json();

        await fetch(uploadUrl, {
          method: "PUT",
          body: file
        });
        console.log("File uploaded to storage", fileUrl);
        const updateRes = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        body: JSON.stringify({
            imageUrl: fileUrl,
        }),
        headers: {
            "Content-Type": "application/json",
        },
        });

        const updateData = await updateRes.json();
        console.log("UPDATE RESPONSE:", updateData);

        if (!updateRes.ok) {
        throw new Error(updateData.message || "Failed to update image");
        }
      }
      toast.success("Event created successfully");
      router.push("/organizer");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white pt-28 pb-16 flex items-center justify-center px-4 py-12 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-10 space-y-8"
      >
      <fieldset disabled={loading} className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Create Event</h1>
          <p className="text-slate-400 text-sm">
            Fill in details to host your event
          </p>
        </div>

        {/* Section Wrapper */}
        <div className="grid gap-6">

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Event Title</label>
            <input
              type="text"
              placeholder="e.g. Tech Meetup 2026"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none transition"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Description</label>
            <textarea
              rows={4}
              required
              placeholder="Tell people what your event is about..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 outline-none transition"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Start Time</label>
              <input
                required
                type="datetime-local"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-cyan-500 outline-none"
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">End Time</label>
              <input
                required
                type="datetime-local"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-cyan-500 outline-none"
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              />
            </div>
          </div>

          {/* Capacity & Price */}
          <div className="grid grid-cols-2 gap-4">
            <input
              required
              type="number"
              placeholder="Capacity"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-500 outline-none"
              onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
            />
            <input
                required
              type="number"
              placeholder="Price (₹)"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-500 outline-none"
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <label className="text-sm text-slate-300">Tags (max 3)</label>
            <div className="flex flex-wrap gap-2">
              {EVENT_TAGS.map((tag) => {
                const isSelected = form.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setForm({
                          ...form,
                          tags: form.tags.filter((t) => t !== tag),
                        });
                      } else {
                        if (form.tags.length >= 3) return;
                        setForm({ ...form, tags: [...form.tags, tag] });
                      }
                    }}
                    className={`px-4 py-1.5 rounded-full text-sm transition border ${
                      isSelected
                        ? "bg-cyan-500 text-black border-cyan-400"
                        : "bg-slate-800 border-slate-700 hover:border-cyan-500"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Section */}
          <div className="border-t border-white/10 pt-6 space-y-4">
            <h2 className="text-lg font-semibold">Location</h2>

            {/* Country */}
            <div className="space-y-1">
              <input
                value="India"
                disabled
                className="w-full px-4 py-3 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500">
                Currently operational only in India
              </p>
            </div>

            {/* State & City */}
            <div className="grid grid-cols-2 gap-4">
              <select
                required
                className="w-full px-3 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-500 outline-none"
                value={form.location.state}
                onChange={(e) =>
                  setForm({
                    ...form,
                    location: {
                      ...form.location,
                      state: e.target.value,
                      city: "",
                    },
                  })
                }
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.isoCode} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>

              <select
                required
                className="w-full px-3 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-500 outline-none"
                value={form.location.city}
                onChange={(e) =>
                  setForm({
                    ...form,
                    location: {
                      ...form.location,
                      city: e.target.value,
                    },
                  })
                }
              >
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Address */}
            <input
              required
              placeholder="Full Address"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-500 outline-none"
              onChange={(e) =>
                setForm({
                  ...form,
                  location: {
                    ...form.location,
                    addressLine: e.target.value,
                  },
                })
              }
            />


            {/* Postal Code */}
            <input
                required
                type="text"
                placeholder="Pincode"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-500 outline-none"
                onChange={(e) =>
                setForm({
                    ...form,
                    location: {
                    ...form.location,
                    postalCode: e.target.value,
                    },
                })
                }
            />
          </div>
            {preview && (
            <div className=" relative">
              <img
                  src={preview}
                  className="w-full h-48 object-cover rounded-xl border border-slate-700"
              />
              <button type="button" onClick={() => {setFile(null); setPreview(null);}} className=" absolute top-2 right-2 bg-black/60 text-white px-2 py-1 text-xs rounded hover:cursor-pointer">Remove</button>
            </div>
            )}
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Event Banner</label>
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:text-black hover:file:bg-cyan-400"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            className={`w-full py-3 rounded-xl font-medium transition shadow-lg ${
                loading
                ? "bg-slate-700 cursor-not-allowed opacity-60"
                : "bg-cyan-600 hover:opacity-90"
            }`}
          >
            {loading ? "Creating Event..." : "Create Event"}
          </button>
        </div>
        </fieldset>
      </form>
    </main>
  );
}








