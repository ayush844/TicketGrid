"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, notFound } from "next/navigation";
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

export default function EditEventPage() {
    const router = useRouter();
    const { id } = useParams();
    const {data:session, status} = useSession();

    const isOrganizer = session?.user?.role == ROLES.ORGANIZER;

    if(status != "loading" && !isOrganizer) {
        router.push("/events");
    }


    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [form, setForm] = useState<any>(null);

    const states = State.getStatesOfCountry("IN");

    const selectedState = states.find(
        (s) => s.name === form?.location?.state
    );

    const cities = selectedState
        ? City.getCitiesOfState("IN", selectedState.isoCode)
        : [];

    useEffect(() => {
        const fetchEvent = async () => {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();

        const event = data.event;

        if(!event){
          notFound();
        }

        setForm({
            title: event.title,
            description: event.description,
            startTime: event.startTime.slice(0, 16),
            endTime: event.endTime.slice(0, 16),
            capacity: event.capacity,
            price: event.price,
            tags: event.tags,
            location: event.location,
        });

        setPreview(event.imageUrl);
        };

        fetchEvent();
    }, [id]);

    const handleFileChange = (file: File | null) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
        toast.error("Only image allowed");
        return;
        }

        setFile(file);
        setPreview(URL.createObjectURL(file));
    };

if (!form) {
  return (
    <main className="min-h-screen bg-slate-950 px-4 pt-28 flex justify-center">
      <div className="w-full max-w-3xl space-y-6 animate-pulse">

        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-800 rounded"></div>
          <div className="h-4 w-64 bg-slate-800 rounded"></div>
        </div>

        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4"
          >
            <div className="h-5 w-32 bg-slate-800 rounded"></div>

            <div className="space-y-2">
              <div className="h-4 w-24 bg-slate-800 rounded"></div>
              <div className="h-10 w-full bg-slate-800 rounded-xl"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-slate-800 rounded-xl"></div>
              <div className="h-10 bg-slate-800 rounded-xl"></div>
            </div>
          </div>
        ))}

        <div className="h-12 w-full bg-slate-800 rounded-xl"></div>
      </div>
    </main>
  );
}



  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      const cleanedForm = {
        ...form,
        location: {
            ...form.location,
            state: form.location.state || undefined,
            city: form.location.city || undefined,
            addressLine: form.location.addressLine || undefined,
        },
    };

      const updateRes = await fetch(`/api/events/${id}`, {
        method: "PUT",
        body: JSON.stringify(cleanedForm),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const updated = await updateRes.json();

      if (!updateRes.ok) {
        throw new Error(updated.message);
      }

      if (file) {
        const presignRes = await fetch("/api/uploads/presigned-url", {
          method: "POST",
          body: JSON.stringify({
            eventId: id,
            fileType: file.type,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const { uploadUrl, fileUrl } = await presignRes.json();

        await fetch(uploadUrl, {
          method: "PUT",
          body: file,
        });

        await fetch(`/api/events/${id}`, {
          method: "PUT",
          body: JSON.stringify({ imageUrl: fileUrl }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      toast.success("Event updated successfully");
      router.push("/organizer");

    } catch (err: any) {
      toast.error(err.message || "Failed to update event");
    } finally {
      setLoading(false);
    }
  };

return (
  <main className="min-h-screen bg-slate-950 text-white pt-28 pb-16 flex items-start justify-center px-4 sm:px-6">
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl space-y-6"
    >
    <fieldset disabled={loading} className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Edit Event</h1>
        <p className="text-slate-400 text-sm">
          Update your event details
        </p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Basic Info</h2>

        <div className="space-y-2">
          <label className="text-sm text-slate-400">Event Title</label>
          <input
            value={form.title}
            placeholder="e.g. Tech Meetup 2026"
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-400">Description</label>
          <textarea
            rows={4}
            value={form.description}
            placeholder="Tell people what your event is about..."
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Date & Pricing</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Start Time</label>
            <input
              type="datetime-local"
              value={form.startTime}
              className="w-full px-3 py-2 rounded-lg text-white bg-slate-950 border border-slate-800 focus:border-cyan-500 outline-none [color-scheme:dark]"
              onChange={(e) =>
                setForm({ ...form, startTime: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-500">End Time</label>
            <input
              type="datetime-local"
              value={form.endTime}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 outline-none [color-scheme:dark]"
              onChange={(e) =>
                setForm({ ...form, endTime: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            value={form.capacity}
            placeholder="Capacity"
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 outline-none"
            onChange={(e) =>
              setForm({
                ...form,
                capacity: Number(e.target.value),
              })
            }
          />

          <input
            type="number"
            value={form.price}
            placeholder="Price (₹)"
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 outline-none"
            onChange={(e) =>
              setForm({
                ...form,
                price: Number(e.target.value),
              })
            }
          />
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Tags</h2>

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
                      tags: form.tags.filter(
                        (t: string) => t !== tag
                      ),
                    });
                  } else {
                    if (form.tags.length >= 3) return;
                    setForm({
                      ...form,
                      tags: [...form.tags, tag],
                    });
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

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Location</h2>

        <input
          value="India"
          disabled
          className="w-full px-4 py-3 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed"
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            value={form.location.state}
            className="w-full px-3 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 outline-none"
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
            value={form.location.city}
            className="w-full px-3 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 outline-none"
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

        <input
          value={form.location.addressLine}
          placeholder="Full Address"
          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 outline-none"
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
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Event Banner</h2>

        {preview && (
          <img
            src={preview}
            className="w-full h-52 object-cover rounded-2xl border border-slate-800 shadow-lg"
          />
        )}

        <input
          type="file"
          accept="image/*"
          className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:text-black hover:file:bg-cyan-400"
          onChange={(e) =>
            handleFileChange(e.target.files?.[0] || null)
          }
        />
      </div>

      <button
        disabled={loading}
        className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
            loading
            ? "bg-slate-700 cursor-not-allowed opacity-70"
            : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-[1.02] hover:shadow-cyan-500/20"
        }`}
        >
        {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        )}
        {loading ? "Updating Event..." : "Update Event"}
        </button>
    </fieldset>
    </form>
  </main>
);
}