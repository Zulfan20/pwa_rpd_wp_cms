"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { PosterSlide, MusicItem, SiteSetting, CenterPoster, Information, Member, Podcast } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Music,
  Type,
  FileImage,
  Info,
  Users,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Loader2,
  ChevronLeft,
  Menu,
  Star,
  Headphones,
} from "lucide-react";
import Link from "next/link";

type TabType = "slides" | "music" | "settings" | "poster" | "info" | "members" | "podcasts";

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("slides");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      setUser(session.user);
      setLoading(false);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        router.push("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#B21E35] animate-spin" />
      </div>
    );
  }

const tabs = [
      { id: "slides", label: "Poster Slides", icon: ImageIcon },
      { id: "music", label: "Music List", icon: Music },
      { id: "settings", label: "Site Settings", icon: Type },
      { id: "poster", label: "Center Poster", icon: FileImage },
      { id: "info", label: "Information", icon: Info },
      { id: "members", label: "Members", icon: Users },
      { id: "podcasts", label: "Podcasts", icon: Headphones },
    ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="fixed lg:relative w-[280px] h-screen bg-[#121212] border-r border-white/5 z-50 flex flex-col"
          >
            <div className="p-6 border-b border-white/5">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="20" fill="none" stroke="#B21E35" strokeWidth="8" />
                    <circle cx="50" cy="50" r="8" fill="#B21E35" />
                    <path d="M30,20 Q30,50 30,80" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" />
                    <path d="M70,20 Q70,50 70,80" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Radio PPI Dunia</p>
                  <p className="text-white/40 text-xs">CMS Dashboard</p>
                </div>
              </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? "bg-[#B21E35] text-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-white/5">
              <div className="flex items-center gap-3 px-4 py-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#B21E35] flex items-center justify-center text-white text-sm font-bold">
                  {user?.email?.[0].toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-white text-sm font-medium truncate">{user?.email}</p>
                  <p className="text-white/40 text-xs">Administrator</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center gap-4 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white/60 hover:text-white transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="text-white font-bold text-lg">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h1>
        </header>

        <main className="flex-1 p-6 overflow-auto">
            {activeTab === "slides" && <SlidesManager />}
            {activeTab === "music" && <MusicManager />}
            {activeTab === "settings" && <SettingsManager />}
            {activeTab === "poster" && <PosterManager />}
            {activeTab === "info" && <InfoManager />}
            {activeTab === "members" && <MembersManager />}
            {activeTab === "podcasts" && <PodcastsManager />}
          </main>
      </div>
    </div>
  );
}

function SlidesManager() {
  const [slides, setSlides] = useState<PosterSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ image_url: "", title: "", link: "" });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    const { data } = await supabase.from("poster_slides").select("*").order("sort_order");
    setSlides(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (editingId) {
      await supabase.from("poster_slides").update(formData).eq("id", editingId);
    } else {
      await supabase.from("poster_slides").insert(formData);
    }
    setEditingId(null);
    setFormData({ image_url: "", title: "", link: "" });
    fetchSlides();
  };

  const handleDelete = async (id: number) => {
    await supabase.from("poster_slides").delete().eq("id", id);
    fetchSlides();
  };

  const startEdit = (slide: PosterSlide) => {
    setEditingId(slide.id);
    setFormData({ image_url: slide.image_url, title: slide.title || "", link: slide.link || "" });
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="bg-[#121212] rounded-2xl p-6 border border-white/5">
        <h3 className="text-white font-bold mb-4">{editingId ? "Edit Slide" : "Add New Slide"}</h3>
        <div className="grid gap-4">
          <input
            type="text"
            placeholder="Image URL"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]"
          />
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]"
          />
          <input
            type="text"
            placeholder="Link (optional)"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]"
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-[#B21E35] hover:bg-[#8B0000] text-white">
              <Save className="w-4 h-4 mr-2" />
              {editingId ? "Update" : "Add"} Slide
            </Button>
            {editingId && (
              <Button onClick={() => { setEditingId(null); setFormData({ image_url: "", title: "", link: "" }); }} variant="outline" className="border-white/10 text-white hover:bg-white/5">
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {slides.map((slide) => (
          <div key={slide.id} className="bg-[#121212] rounded-2xl p-4 border border-white/5 flex items-center gap-4">
            <div className="w-24 h-16 bg-white/5 rounded-lg overflow-hidden">
              {slide.image_url && <img src={slide.image_url} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{slide.title || "Untitled"}</p>
              <p className="text-white/40 text-xs truncate">{slide.image_url}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(slide)} className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(slide.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {slides.length === 0 && <EmptyState message="No slides yet. Add your first slide above." />}
      </div>
    </div>
  );
}

function MusicManager() {
  const [music, setMusic] = useState<MusicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: "", artist: "", image_url: "", spotify_url: "" });

  useEffect(() => {
    fetchMusic();
  }, []);

  const fetchMusic = async () => {
    const { data } = await supabase.from("music_list").select("*").order("sort_order");
    setMusic(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (editingId) {
      await supabase.from("music_list").update(formData).eq("id", editingId);
    } else {
      await supabase.from("music_list").insert(formData);
    }
    setEditingId(null);
    setFormData({ title: "", artist: "", image_url: "", spotify_url: "" });
    fetchMusic();
  };

  const handleDelete = async (id: number) => {
    await supabase.from("music_list").delete().eq("id", id);
    fetchMusic();
  };

  const startEdit = (item: MusicItem) => {
    setEditingId(item.id);
    setFormData({ title: item.title, artist: item.artist || "", image_url: item.image_url || "", spotify_url: item.spotify_url || "" });
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="bg-[#121212] rounded-2xl p-6 border border-white/5">
        <h3 className="text-white font-bold mb-4">{editingId ? "Edit Music" : "Add New Music"}</h3>
        <div className="grid gap-4">
          <input type="text" placeholder="Song Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]" />
          <input type="text" placeholder="Artist" value={formData.artist} onChange={(e) => setFormData({ ...formData, artist: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]" />
          <input type="text" placeholder="Cover Image URL" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]" />
          <input type="text" placeholder="Spotify URL" value={formData.spotify_url} onChange={(e) => setFormData({ ...formData, spotify_url: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]" />
          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-[#B21E35] hover:bg-[#8B0000] text-white">
              <Save className="w-4 h-4 mr-2" /> {editingId ? "Update" : "Add"} Music
            </Button>
            {editingId && (
              <Button onClick={() => { setEditingId(null); setFormData({ title: "", artist: "", image_url: "", spotify_url: "" }); }} variant="outline" className="border-white/10 text-white hover:bg-white/5">
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {music.map((item) => (
          <div key={item.id} className="bg-[#121212] rounded-2xl p-4 border border-white/5 flex items-center gap-4">
            <div className="w-16 h-16 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center">
              {item.image_url ? <img src={item.image_url} alt="" className="w-full h-full object-cover" /> : <Music className="w-6 h-6 text-white/20" />}
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{item.title}</p>
              <p className="text-white/40 text-sm">{item.artist || "Unknown Artist"}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(item)} className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {music.length === 0 && <EmptyState message="No music added yet." />}
      </div>
    </div>
  );
}

function SettingsManager() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*");
    setSettings(data || []);
    setLoading(false);
  };

  const handleSave = async (key: string) => {
    await supabase.from("site_settings").update({ value: editValue }).eq("key", key);
    setEditingKey(null);
    fetchSettings();
  };

  const settingLabels: Record<string, string> = {
    tagline: "Main Tagline",
    hero_title_1: "Hero Title Line 1",
    hero_title_2: "Hero Title Line 2",
    hero_title_3: "Hero Title Line 3",
    description_24h: "24 Hour Description",
    what_is_on_tagline: "What Is On Section Tagline",
    what_is_on_date: "What Is On Section Date",
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-4">
      {settings.map((setting) => (
        <div key={setting.key} className="bg-[#121212] rounded-2xl p-6 border border-white/5">
          <label className="block text-white/60 text-sm mb-2">{settingLabels[setting.key] || setting.key}</label>
          {editingKey === setting.key ? (
            <div className="flex gap-2">
              <input type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#B21E35]" />
              <Button onClick={() => handleSave(setting.key)} className="bg-[#B21E35] hover:bg-[#8B0000] text-white"><Save className="w-4 h-4" /></Button>
              <Button onClick={() => setEditingKey(null)} variant="outline" className="border-white/10 text-white hover:bg-white/5"><X className="w-4 h-4" /></Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <p className="flex-1 text-white">{setting.value || "-"}</p>
              <button onClick={() => { setEditingKey(setting.key); setEditValue(setting.value || ""); }} className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg"><Edit2 className="w-4 h-4" /></button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PosterManager() {
  const [posters, setPosters] = useState<CenterPoster[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ image_url: "", alt_text: "", link: "" });

  useEffect(() => {
    fetchPosters();
  }, []);

  const fetchPosters = async () => {
    const { data } = await supabase.from("center_poster").select("*");
    setPosters(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (editingId) {
      await supabase.from("center_poster").update(formData).eq("id", editingId);
    } else {
      await supabase.from("center_poster").insert(formData);
    }
    setEditingId(null);
    setFormData({ image_url: "", alt_text: "", link: "" });
    fetchPosters();
  };

  const handleDelete = async (id: number) => {
    await supabase.from("center_poster").delete().eq("id", id);
    fetchPosters();
  };

  const startEdit = (poster: CenterPoster) => {
    setEditingId(poster.id);
    setFormData({ image_url: poster.image_url, alt_text: poster.alt_text || "", link: poster.link || "" });
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="bg-[#121212] rounded-2xl p-6 border border-white/5">
        <h3 className="text-white font-bold mb-4">{editingId ? "Edit Poster" : "Add Center Poster"}</h3>
        <div className="grid gap-4">
          <input type="text" placeholder="Image URL" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]" />
          <input type="text" placeholder="Alt Text" value={formData.alt_text} onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]" />
          <input type="text" placeholder="Link (optional)" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]" />
          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-[#B21E35] hover:bg-[#8B0000] text-white"><Save className="w-4 h-4 mr-2" /> {editingId ? "Update" : "Add"} Poster</Button>
            {editingId && <Button onClick={() => { setEditingId(null); setFormData({ image_url: "", alt_text: "", link: "" }); }} variant="outline" className="border-white/10 text-white hover:bg-white/5"><X className="w-4 h-4 mr-2" /> Cancel</Button>}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {posters.map((poster) => (
          <div key={poster.id} className="bg-[#121212] rounded-2xl p-4 border border-white/5 flex items-center gap-4">
            <div className="w-32 h-24 bg-white/5 rounded-lg overflow-hidden">{poster.image_url && <img src={poster.image_url} alt="" className="w-full h-full object-cover" />}</div>
            <div className="flex-1"><p className="text-white font-medium">{poster.alt_text || "Center Poster"}</p><p className="text-white/40 text-xs truncate">{poster.image_url}</p></div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(poster)} className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(poster.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {posters.length === 0 && <EmptyState message="No center poster set." />}
      </div>
    </div>
  );
}

function InfoManager() {
  const [info, setInfo] = useState<Information[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: "", content: "", image_url: "" });

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    const { data } = await supabase.from("information").select("*");
    setInfo(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (editingId) {
      await supabase.from("information").update(formData).eq("id", editingId);
    } else {
      await supabase.from("information").insert(formData);
    }
    setEditingId(null);
    setFormData({ title: "", content: "", image_url: "" });
    fetchInfo();
  };

  const handleDelete = async (id: number) => {
    await supabase.from("information").delete().eq("id", id);
    fetchInfo();
  };

  const startEdit = (item: Information) => {
    setEditingId(item.id);
    setFormData({ title: item.title, content: item.content || "", image_url: item.image_url || "" });
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="bg-[#121212] rounded-2xl p-6 border border-white/5">
        <h3 className="text-white font-bold mb-4">{editingId ? "Edit Information" : "Add Information"}</h3>
        <div className="grid gap-4">
          <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]" />
          <textarea placeholder="Content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35] resize-none" />
          <input type="text" placeholder="Image URL (optional)" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]" />
          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-[#B21E35] hover:bg-[#8B0000] text-white"><Save className="w-4 h-4 mr-2" /> {editingId ? "Update" : "Add"} Info</Button>
            {editingId && <Button onClick={() => { setEditingId(null); setFormData({ title: "", content: "", image_url: "" }); }} variant="outline" className="border-white/10 text-white hover:bg-white/5"><X className="w-4 h-4 mr-2" /> Cancel</Button>}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {info.map((item) => (
          <div key={item.id} className="bg-[#121212] rounded-2xl p-4 border border-white/5">
            <div className="flex items-start gap-4">
              {item.image_url && <div className="w-20 h-20 bg-white/5 rounded-lg overflow-hidden flex-shrink-0"><img src={item.image_url} alt="" className="w-full h-full object-cover" /></div>}
              <div className="flex-1">
                <p className="text-white font-medium">{item.title}</p>
                <p className="text-white/40 text-sm mt-1 line-clamp-2">{item.content}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(item)} className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {info.length === 0 && <EmptyState message="No information entries yet." />}
      </div>
    </div>
  );
}

const directorateOptions = [
  { value: 'bod', label: 'BOD (Board of Directors)' },
  { value: 'sobat_siar', label: 'Sobat Siar' },
  { value: 'operational', label: 'Operational' },
  { value: 'technology', label: 'Technology' },
  { value: 'komunikasi', label: 'Komunikasi' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'produksi', label: 'Produksi' },
];

const divisionsByDirectorate: Record<string, string[]> = {
  operational: ['HRD', 'Program', 'Broadcast'],
  technology: ['Mobile & Web Development', 'Technical Division', 'Music Division'],
  komunikasi: ['Public Relation', 'Community Relations', 'Research'],
  marketing: ['Social Media', 'Sales & Partnership'],
  produksi: ['Visual Design', 'Audio', 'Video', 'Event'],
};

function MembersManager() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    position: "",
    directorate: "technology",
    division: "",
    photo_url: "",
    is_featured: false 
  });
  const [filterDirectorate, setFilterDirectorate] = useState<string>("all");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data } = await supabase.from("members").select("*").order("directorate").order("division").order("name");
    setMembers(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.directorate) {
      alert("Name and Directorate are required");
      return;
    }
    
    const saveData = {
      name: formData.name,
      position: formData.position || null,
      directorate: formData.directorate,
      division: formData.division || null,
      photo_url: formData.photo_url || null,
      is_featured: formData.is_featured,
    };
    
    if (editingId) {
      await supabase.from("members").update(saveData).eq("id", editingId);
    } else {
      await supabase.from("members").insert(saveData);
    }
    setEditingId(null);
    setFormData({ name: "", position: "", directorate: "technology", division: "", photo_url: "", is_featured: false });
    fetchMembers();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    await supabase.from("members").delete().eq("id", id);
    fetchMembers();
  };

  const startEdit = (member: Member) => {
    setEditingId(Number(member.id));
    setFormData({ 
      name: member.name, 
      position: member.position || "", 
      directorate: member.directorate || "technology",
      division: member.division || "",
      photo_url: member.photo_url || member.image_url || "",
      is_featured: member.is_featured 
    });
  };

  const toggleFeatured = async (member: Member) => {
    await supabase.from("members").update({ is_featured: !member.is_featured }).eq("id", member.id);
    fetchMembers();
  };

  const availableDivisions = formData.directorate ? divisionsByDirectorate[formData.directorate] || [] : [];
  
  const filteredMembers = filterDirectorate === "all" 
    ? members 
    : members.filter(m => m.directorate === filterDirectorate);

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      <div className="bg-[#121212] rounded-2xl p-6 border border-white/5">
        <h3 className="text-white font-bold mb-4">{editingId ? "Edit Member" : "Add New Member"}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <input 
            type="text" 
            placeholder="Name *" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]" 
          />
          <input 
            type="text" 
            placeholder="Position (e.g., Staff, Head, Co-Head)" 
            value={formData.position} 
            onChange={(e) => setFormData({ ...formData, position: e.target.value })} 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]" 
          />
          <select 
            value={formData.directorate} 
            onChange={(e) => setFormData({ ...formData, directorate: e.target.value, division: "" })} 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#B21E35]"
          >
            {directorateOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#121212]">{opt.label}</option>
            ))}
          </select>
          {availableDivisions.length > 0 ? (
            <select 
              value={formData.division} 
              onChange={(e) => setFormData({ ...formData, division: e.target.value })} 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#B21E35]"
            >
              <option value="" className="bg-[#121212]">Select Division</option>
              {availableDivisions.map((div) => (
                <option key={div} value={div} className="bg-[#121212]">{div}</option>
              ))}
            </select>
          ) : (
            <div className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white/30">
              No divisions for this directorate
            </div>
          )}
          <input 
            type="text" 
            placeholder="Photo URL" 
            value={formData.photo_url} 
            onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })} 
            className="md:col-span-2 w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]" 
          />
          <label className="md:col-span-2 flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.is_featured} 
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} 
              className="w-5 h-5 rounded border-white/10 bg-white/5 text-[#B21E35] focus:ring-[#B21E35]" 
            />
            <span className="text-white/70">Featured (Sobat Siar of the Month)</span>
          </label>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={handleSave} className="bg-[#B21E35] hover:bg-[#8B0000] text-white">
            <Save className="w-4 h-4 mr-2" /> {editingId ? "Update" : "Add"} Member
          </Button>
          {editingId && (
            <Button 
              onClick={() => { 
                setEditingId(null); 
                setFormData({ name: "", position: "", directorate: "technology", division: "", photo_url: "", is_featured: false }); 
              }} 
              variant="outline" 
              className="border-white/10 text-white hover:bg-white/5"
            >
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Filter by Directorate */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterDirectorate("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filterDirectorate === "all" 
              ? "bg-[#B21E35] text-white" 
              : "bg-white/5 text-white/60 hover:bg-white/10"
          }`}
        >
          All ({members.length})
        </button>
        {directorateOptions.map((opt) => {
          const count = members.filter(m => m.directorate === opt.value).length;
          return (
            <button
              key={opt.value}
              onClick={() => setFilterDirectorate(opt.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterDirectorate === opt.value 
                  ? "bg-[#B21E35] text-white" 
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {opt.label.split(' ')[0]} ({count})
            </button>
          );
        })}
      </div>

      {/* Members List */}
      <div className="grid gap-4">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-[#121212] rounded-2xl p-4 border border-white/5 flex items-center gap-4">
            <div className="w-16 h-16 bg-white/5 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
              {(member.photo_url || member.image_url) ? (
                <img src={member.photo_url || member.image_url || ""} alt="" className="w-full h-full object-cover" />
              ) : (
                <Users className="w-6 h-6 text-white/20" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-white font-medium">{member.name}</p>
                {member.is_featured && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
              </div>
              <p className="text-white/60 text-sm">{member.position || "Member"}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs px-2 py-1 bg-[#B21E35]/20 text-[#B21E35] rounded">
                  {directorateOptions.find(d => d.value === member.directorate)?.label.split(' ')[0] || member.directorate}
                </span>
                {member.division && (
                  <span className="text-xs px-2 py-1 bg-white/10 text-white/60 rounded">
                    {member.division}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button 
                onClick={() => toggleFeatured(member)} 
                className={`p-2 rounded-lg ${member.is_featured ? "text-yellow-400 hover:bg-yellow-500/10" : "text-white/60 hover:text-white hover:bg-white/5"}`}
              >
                <Star className="w-4 h-4" />
              </button>
              <button onClick={() => startEdit(member)} className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(Number(member.id))} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {filteredMembers.length === 0 && <EmptyState message="No members found." />}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-[#B21E35] animate-spin" />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-[#121212] rounded-2xl p-12 border border-white/5 text-center">
      <p className="text-white/40">{message}</p>
    </div>
  );
}

const podcastCategories = [
  { value: 'siaran_special_2025', label: 'Siaran Special 2025' },
  { value: 'siaran_special_2024', label: 'Siaran Special 2024' },
  { value: 'siaran_special_hut', label: 'Siaran Special HUT & Drama' },
  { value: 'archived_2024', label: 'Archived Podcast 2024' },
];

function PodcastsManager() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    title: "", 
    subtitle: "", 
    category: "siaran_special_2025", 
    audio_url: "", 
    duration: "00:00:00" 
  });

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    const { data } = await supabase.from("podcasts").select("*").order("created_at", { ascending: false });
    setPodcasts(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (editingId) {
      await supabase.from("podcasts").update(formData).eq("id", editingId);
    } else {
      await supabase.from("podcasts").insert(formData);
    }
    setEditingId(null);
    setFormData({ title: "", subtitle: "", category: "siaran_special_2025", audio_url: "", duration: "00:00:00" });
    fetchPodcasts();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("podcasts").delete().eq("id", id);
    fetchPodcasts();
  };

  const startEdit = (podcast: Podcast) => {
    setEditingId(podcast.id);
    setFormData({ 
      title: podcast.title, 
      subtitle: podcast.subtitle || "", 
      category: podcast.category, 
      audio_url: podcast.audio_url || "", 
      duration: podcast.duration || "00:00:00"
    });
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="bg-[#121212] rounded-2xl p-6 border border-white/5">
        <h3 className="text-white font-bold mb-4">{editingId ? "Edit Podcast" : "Add New Podcast"}</h3>
        <div className="grid gap-4">
          <input 
            type="text" 
            placeholder="Title (e.g., SSK Faiz - Mesir, SK Davina - Turki || SKSD)" 
            value={formData.title} 
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]" 
          />
          <input 
            type="text" 
            placeholder="Subtitle (e.g., (Saling Kenal Saling Deket): Old But Gold)" 
            value={formData.subtitle} 
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]" 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select 
              value={formData.category} 
              onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#B21E35]"
            >
              {podcastCategories.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-[#121212]">{cat.label}</option>
              ))}
            </select>
            <input 
              type="text" 
              placeholder="Duration (e.g., 02:05:17)" 
              value={formData.duration} 
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })} 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]" 
            />
          </div>
          <input 
            type="text" 
            placeholder="Audio URL (e.g., https://example.com/audio.mp3)" 
            value={formData.audio_url} 
            onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })} 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]" 
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-[#B21E35] hover:bg-[#8B0000] text-white">
              <Save className="w-4 h-4 mr-2" /> {editingId ? "Update" : "Add"} Podcast
            </Button>
            {editingId && (
              <Button 
                onClick={() => { 
                  setEditingId(null); 
                  setFormData({ title: "", subtitle: "", category: "siaran_special_2025", audio_url: "", duration: "00:00:00" }); 
                }} 
                variant="outline" 
                className="border-white/10 text-white hover:bg-white/5"
              >
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filter by category */}
      <div className="flex flex-wrap gap-2">
        {podcastCategories.map((cat) => {
          const count = podcasts.filter(p => p.category === cat.value).length;
          return (
            <span key={cat.value} className="px-3 py-1 bg-white/5 rounded-full text-white/60 text-sm">
              {cat.label} ({count})
            </span>
          );
        })}
      </div>

      <div className="grid gap-4">
        {podcasts.map((podcast) => (
          <div key={podcast.id} className="bg-[#121212] rounded-2xl p-4 border border-white/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#B21E35]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Headphones className="w-6 h-6 text-[#B21E35]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{podcast.title}</p>
                <p className="text-white/40 text-sm truncate">{podcast.subtitle}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs px-2 py-1 bg-[#B21E35]/20 text-[#B21E35] rounded">
                    {podcastCategories.find(c => c.value === podcast.category)?.label}
                  </span>
                  <span className="text-white/30 text-xs">{podcast.duration}</span>
                  {podcast.audio_url && <span className="text-green-400 text-xs">Audio attached</span>}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startEdit(podcast)} className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(podcast.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {podcasts.length === 0 && <EmptyState message="No podcasts added yet." />}
      </div>
    </div>
  );
}
