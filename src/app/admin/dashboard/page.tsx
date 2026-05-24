"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { PosterSlide, ProgramBanner, MusicItem, SiteSetting, Member, Podcast } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Music,
  Type,
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
  Headphones,
} from "lucide-react";
import Link from "next/link";
import MediaUploader from "@/components/MediaUploader";

type TabType = "slides" | "music" | "settings" | "program" | "members" | "podcasts";

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

      const { data: adminRows, error: adminError } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("is_active", true)
        .limit(1);

      if (adminError || !adminRows || adminRows.length === 0) {
        await supabase.auth.signOut();
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
      { id: "slides", label: "Background about us", icon: ImageIcon },
  { id: "music", label: "CLBK", icon: Music },
      { id: "settings", label: "Tag Line & SSOTM", icon: Type },
      { id: "program", label: "Program Banners", icon: ImageIcon },
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
            {activeTab === "program" && <ProgramBannersManager />}
            {activeTab === "members" && <MembersManager />}
            {activeTab === "podcasts" && <PodcastsManager />}
          </main>
      </div>
    </div>
  );
}

function SlidesManager() {
  const [slides, setSlides] = useState<PosterSlide[]>([]);
  const [aboutBackgrounds, setAboutBackgrounds] = useState<PosterSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ image_url: "", title: "", link: "" });

  const aboutBackgroundDefinitions = [
    { title: "About Background 1", sort_order: 1 },
    { title: "About Background 2", sort_order: 2 },
    { title: "About Background 3", sort_order: 3 },
    { title: "About Background 4", sort_order: 4 },
    { title: "About Background 5", sort_order: 5 },
  ];

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    const { data } = await supabase.from("poster_slides").select("*").order("sort_order");
    const allSlides = data || [];
    setSlides(allSlides.filter((slide) => !slide.title?.startsWith("About Background")));
    setAboutBackgrounds(allSlides.filter((slide) => slide.title?.startsWith("About Background")));
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

  const upsertAboutBackground = async (title: string, sort_order: number, image_url: string) => {
    const { data: existing } = await supabase
      .from("poster_slides")
      .select("id")
      .eq("title", title)
      .maybeSingle();

    const payload = { image_url, title, link: "", sort_order };

    if (existing?.id) {
      await supabase.from("poster_slides").update(payload).eq("id", existing.id);
    } else {
      await supabase.from("poster_slides").insert(payload);
    }

    fetchSlides();
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="bg-[#121212] rounded-2xl p-6 border border-white/5 space-y-4">
        <div>
          <h3 className="text-white font-bold mb-1">Background about us</h3>
          <p className="text-white/40 text-sm">These 5 images rotate automatically on the About Us hero.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {aboutBackgroundDefinitions.map((definition, index) => {
            const currentBackground = aboutBackgrounds.find((slide) => slide.title === definition.title);

            return (
              <div key={definition.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                <div>
                  <p className="text-white font-semibold">Background {index + 1}</p>
                  <p className="text-white/35 text-xs">Stored in poster_slides as {definition.title}</p>
                </div>
                <MediaUploader
                  initialUrl={currentBackground?.image_url}
                  onUpload={(url) => {
                    void upsertAboutBackground(definition.title, definition.sort_order, url);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

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
  const [formData, setFormData] = useState({ title: "", artist: "", image_url: "" });

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
    setFormData({ title: "", artist: "", image_url: "" });
    fetchMusic();
  };

  const handleDelete = async (id: number) => {
    await supabase.from("music_list").delete().eq("id", id);
    fetchMusic();
  };

  const startEdit = (item: MusicItem) => {
    setEditingId(item.id);
    setFormData({ title: item.title, artist: item.artist || "", image_url: item.image_url || "" });
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="bg-[#121212] rounded-2xl p-6 border border-white/5">
        <h3 className="text-white font-bold mb-4">{editingId ? "Edit CLBK" : "Add New CLBK"}</h3>
        <div className="grid gap-4">
          <input type="text" placeholder="CLBK Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]" />
          <input type="text" placeholder="Artist" value={formData.artist} onChange={(e) => setFormData({ ...formData, artist: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]" />
          <MediaUploader
            initialUrl={formData.image_url}
            onUpload={(url) => setFormData({ ...formData, image_url: url })}
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-[#B21E35] hover:bg-[#8B0000] text-white">
              <Save className="w-4 h-4 mr-2" /> {editingId ? "Update" : "Add"} CLBK
            </Button>
            {editingId && (
              <Button onClick={() => { setEditingId(null); setFormData({ title: "", artist: "", image_url: "" }); }} variant="outline" className="border-white/10 text-white hover:bg-white/5">
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {music.map((item, index) => (
          <div key={item.id} className="bg-[#121212] rounded-2xl p-4 border border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#B21E35] text-white font-black flex items-center justify-center text-sm flex-shrink-0">
              {index + 1}
            </div>
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
        {music.length === 0 && <EmptyState message="No CLBK added yet." />}
      </div>
    </div>
  );
}

function SettingsManager() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [featuredMember, setFeaturedMember] = useState<Member | null>(null);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredForm, setFeaturedForm] = useState({
    name: "",
    country: "",
    photo_url: "",
  });

  const requiredSettings = [
    { key: "what_is_on_tagline", label: "What Is On Section Tagline", multiline: true },
    { key: "what_is_on_date", label: "What Is On Section Date", multiline: false },
  ];

  useEffect(() => {
    fetchSettings();
    fetchFeaturedMember();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*");
    setSettings(data || []);
    setLoading(false);
  };

  const fetchFeaturedMember = async () => {
    const { data } = await supabase
      .from("members")
      .select("*")
      .eq("is_featured", true)
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();

    if (data) {
      setFeaturedMember(data);
      setFeaturedForm({
        name: data.name || "",
        country: data.country || "",
        photo_url: data.photo_url || data.image_url || "",
      });
    }

    setFeaturedLoading(false);
  };

  const handleSave = async (key: string) => {
    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .eq("key", key)
      .maybeSingle();

    if (existing?.id) {
      await supabase.from("site_settings").update({ value: editValue }).eq("id", existing.id);
    } else {
      await supabase.from("site_settings").insert({ key, value: editValue });
    }
    setEditingKey(null);
    fetchSettings();
  };

  const handleSaveFeaturedMember = async () => {
    if (!featuredForm.name) {
      alert("Name is required");
      return;
    }

    await supabase.from("members").update({ is_featured: false }).eq("is_featured", true);

    const payload = {
      name: featuredForm.name,
      country: featuredForm.country || null,
      photo_url: featuredForm.photo_url || null,
      image_url: featuredForm.photo_url || null,
      position: featuredMember?.position || null,
      division: featuredMember?.division || null,
      directorate: featuredMember?.directorate || "technology",
      member_type: featuredMember?.member_type || null,
      role: featuredMember?.role || null,
      quote: featuredMember?.quote || null,
      social_links: featuredMember?.social_links || null,
      is_featured: true,
      is_active: true,
      sort_order: featuredMember?.sort_order || 0,
    };

    if (featuredMember?.id) {
      await supabase.from("members").update(payload).eq("id", featuredMember.id);
    } else {
      await supabase.from("members").insert(payload);
    }

    fetchFeaturedMember();
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

  const mergedSettings = [
    ...requiredSettings.map((required) => {
      const existing = settings.find((setting) => setting.key === required.key);
      return existing || { id: 0, key: required.key, value: "", updated_at: "" };
    }),
    ...settings.filter(
      (setting) => !requiredSettings.some((required) => required.key === setting.key)
    ),
  ];

  if (loading || featuredLoading) return <LoadingState />;

  return (
    <div className="space-y-4">
      <div className="pb-2">
        <h2 className="text-white text-2xl font-black">Tag Line & SSOTM</h2>
      </div>
      <div className="bg-[#121212] rounded-2xl p-6 border border-white/5">
        <h3 className="text-white font-bold mb-1">Sobat Siar of the Month</h3>
        <p className="text-white/40 text-sm mb-4">Manage the featured member shown on the homepage.</p>
        <div className="grid gap-4 md:grid-cols-[160px_1fr] items-start">
          <div className="w-40 h-40 rounded-2xl overflow-hidden bg-white/5 border border-white/10">
            {featuredForm.photo_url ? (
              <img src={featuredForm.photo_url} alt={featuredForm.name || "Sobat Siar"} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/25 text-xs font-medium">No image</div>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Name"
              value={featuredForm.name}
              onChange={(e) => setFeaturedForm({ ...featuredForm, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]"
            />
            <input
              type="text"
              placeholder="Country"
              value={featuredForm.country}
              onChange={(e) => setFeaturedForm({ ...featuredForm, country: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]"
            />
            <div className="md:col-span-2">
              <MediaUploader
                initialUrl={featuredForm.photo_url}
                onUpload={(url) => setFeaturedForm({ ...featuredForm, photo_url: url })}
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button onClick={handleSaveFeaturedMember} className="bg-[#B21E35] hover:bg-[#8B0000] text-white">
                <Save className="w-4 h-4 mr-2" /> Save SSOTM
              </Button>
            </div>
          </div>
        </div>
      </div>

      {mergedSettings.map((setting) => {
        const meta = requiredSettings.find((required) => required.key === setting.key);
        const label = meta ? meta.label : settingLabels[setting.key] || setting.key;
        const multiline = meta?.multiline || false;

        return (
          <div key={setting.key} className="bg-[#121212] rounded-2xl p-6 border border-white/5">
            <label className="block text-white/60 text-sm mb-2">{label}</label>
            {editingKey === setting.key ? (
              <div className="flex gap-2">
                {multiline ? (
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    rows={4}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#B21E35] resize-y"
                  />
                ) : (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#B21E35]"
                  />
                )}
                <Button onClick={() => handleSave(setting.key)} className="bg-[#B21E35] hover:bg-[#8B0000] text-white">
                  <Save className="w-4 h-4" />
                </Button>
                <Button onClick={() => setEditingKey(null)} variant="outline" className="border-white/10 text-white hover:bg-white/5">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <p className="flex-1 text-white">{setting.value || "-"}</p>
                <button onClick={() => { setEditingKey(setting.key); setEditValue(setting.value || ""); }} className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProgramBannersManager() {
  const [banners, setBanners] = useState<ProgramBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    section: "regular",
    image_url: "",
    alt_text: "",
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const { data } = await supabase
      .from("program_banners")
      .select("*")
      .order("section", { ascending: true })
      .order("sort_order", { ascending: true });

    setBanners(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    const payload = {
      section: formData.section,
      image_url: formData.image_url,
      alt_text: formData.alt_text || null,
      sort_order: Number(formData.sort_order) || 0,
      is_active: formData.is_active,
    };

    if (editingId) {
      await supabase.from("program_banners").update(payload).eq("id", editingId);
    } else {
      await supabase.from("program_banners").insert(payload);
    }

    setEditingId(null);
    setFormData({ section: "regular", image_url: "", alt_text: "", sort_order: 0, is_active: true });
    fetchBanners();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("program_banners").delete().eq("id", id);
    fetchBanners();
  };

  const startEdit = (banner: ProgramBanner) => {
    setEditingId(banner.id);
    setFormData({
      section: banner.section,
      image_url: banner.image_url,
      alt_text: banner.alt_text || "",
      sort_order: banner.sort_order,
      is_active: banner.is_active,
    });
  };

  if (loading) return <LoadingState />;

  const sectionLabels: Record<string, string> = {
    regular: "Siaran Reguler",
    special: "Siaran Spesial",
  };

  const groupedBanners = {
    regular: banners.filter((banner) => banner.section === "regular"),
    special: banners.filter((banner) => banner.section === "special"),
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#121212] rounded-2xl p-6 border border-white/5">
        <h3 className="text-white font-bold mb-4">{editingId ? "Edit Program Banner" : "Add Program Banner"}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <select
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#B21E35]"
          >
            <option value="regular" className="bg-[#121212]">Siaran Reguler</option>
            <option value="special" className="bg-[#121212]">Siaran Spesial</option>
          </select>
          <input
            type="number"
            placeholder="Sort Order"
            value={formData.sort_order}
            onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]"
          />
          <div className="md:col-span-2">
            <MediaUploader
              initialUrl={formData.image_url}
              onUpload={(url) => setFormData({ ...formData, image_url: url })}
            />
          </div>
          <input
            type="text"
            placeholder="Alt Text (optional)"
            value={formData.alt_text}
            onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
            className="md:col-span-2 w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]"
          />
          <label className="md:col-span-2 flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 rounded border-white/10 bg-white/5 text-[#B21E35] focus:ring-[#B21E35]"
            />
            <span className="text-white/70">Active</span>
          </label>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={handleSave} className="bg-[#B21E35] hover:bg-[#8B0000] text-white">
            <Save className="w-4 h-4 mr-2" /> {editingId ? "Update" : "Add"} Banner
          </Button>
          {editingId && (
            <Button
              onClick={() => {
                setEditingId(null);
                setFormData({ section: "regular", image_url: "", alt_text: "", sort_order: 0, is_active: true });
              }}
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5"
            >
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
          )}
        </div>
      </div>

      {(["regular", "special"] as const).map((section) => (
        <div key={section} className="space-y-3">
          <h4 className="text-white font-bold text-lg">{sectionLabels[section]}</h4>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {groupedBanners[section].map((banner) => (
              <div key={banner.id} className={`bg-[#121212] rounded-xl p-2 border border-white/5 ${!banner.is_active ? "opacity-50" : ""}`}>
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-white/5">
                  <img src={banner.image_url} alt={banner.alt_text || "Program banner"} className="w-full h-full object-cover" />
                </div>
                <div className="mt-2 flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{banner.alt_text || "Program banner"}</p>
                    <p className="text-white/35 text-[10px]">Sort: {banner.sort_order}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => startEdit(banner)} className="p-1.5 text-white/60 hover:text-white hover:bg-white/5 rounded-md"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(banner.id)} className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
            {groupedBanners[section].length === 0 && <EmptyState message={`No ${sectionLabels[section]} banners yet.`} />}
          </div>
        </div>
      ))}
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

type MemberProfile = Member & {
  bio: string | null;
  instagram_url: string | null;
};

function MembersManager() {
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    position: "",
    directorate: "technology",
    division: "",
    country: "",
    photo_url: "",
    bio: "",
    instagram_url: ""
  });
  const [filterDirectorate, setFilterDirectorate] = useState<string>("all");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data } = await supabase
      .from("members")
      .select("*")
      .neq("is_featured", true)
      .order("directorate")
      .order("division")
      .order("name");
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
      country: formData.country || null,
      photo_url: formData.photo_url || null,
      bio: formData.bio || null,
      instagram_url: formData.instagram_url || null,
      is_featured: false,
      is_active: true,
    };
    
    const { error } = editingId
      ? await supabase.from("members").update(saveData).eq("id", editingId)
      : await supabase.from("members").insert(saveData);

    if (error) {
      alert(`Failed to save member: ${error.message}`);
      return;
    }

    setEditingId(null);
    setFormData({ name: "", position: "", directorate: "technology", division: "", country: "", photo_url: "", bio: "", instagram_url: "" });
    fetchMembers();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    await supabase.from("members").delete().eq("id", id);
    fetchMembers();
  };

  const startEdit = (member: MemberProfile) => {
    setEditingId(Number(member.id));
    setFormData({ 
      name: member.name, 
      position: member.position || "", 
      directorate: member.directorate || "technology",
      division: member.division || "",
      country: member.country || "",
      photo_url: member.photo_url || member.image_url || "",
      bio: member.bio || "",
      instagram_url: member.instagram_url || ""
    });
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
            placeholder="Country" 
            value={formData.country} 
            onChange={(e) => setFormData({ ...formData, country: e.target.value })} 
            className="md:col-span-2 w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]" 
          />
          <div className="md:col-span-2">
            <MediaUploader
              initialUrl={formData.photo_url}
              onUpload={(url) => setFormData({ ...formData, photo_url: url })}
            />
          </div>
          <textarea
            placeholder="Bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="md:col-span-2 min-h-[120px] w-full resize-y bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]"
          />
          <input
            type="url"
            placeholder="Instagram URL"
            value={formData.instagram_url}
            onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
            className="md:col-span-2 w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]"
          />
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={handleSave} className="bg-[#B21E35] hover:bg-[#8B0000] text-white">
            <Save className="w-4 h-4 mr-2" /> {editingId ? "Update" : "Add"} Member
          </Button>
          {editingId && (
            <Button 
              onClick={() => { 
                setEditingId(null); 
                setFormData({ name: "", position: "", directorate: "technology", division: "", country: "", photo_url: "", bio: "", instagram_url: "" }); 
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
              </div>
              <p className="text-white/60 text-sm">{member.position || "Member"}</p>
              {member.bio && <p className="mt-1 text-white/45 text-sm line-clamp-2">{member.bio}</p>}
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs px-2 py-1 bg-[#B21E35]/20 text-[#B21E35] rounded">
                  {directorateOptions.find(d => d.value === member.directorate)?.label.split(' ')[0] || member.directorate}
                </span>
                {member.division && (
                  <span className="text-xs px-2 py-1 bg-white/10 text-white/60 rounded">
                    {member.division}
                  </span>
                )}
                {member.instagram_url && (
                  <a
                    href={member.instagram_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs px-2 py-1 bg-white/10 text-white/70 rounded hover:bg-white/15 hover:text-white transition-colors"
                  >
                    Instagram
                  </a>
                )}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
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
  { value: 'siaran_special_2025', label: 'Siaran Podcast Radio PPI Dunia' },
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
    duration: "" 
  });

  useEffect(() => {
    fetchPodcasts();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadAudioDuration = async () => {
      if (!formData.audio_url) {
        if (!cancelled) {
          setFormData((current) => ({ ...current, duration: "" }));
        }
        return;
      }

      const audio = document.createElement("audio");
      audio.preload = "metadata";
      audio.src = formData.audio_url;

      const cleanup = () => {
        audio.removeAttribute("src");
        audio.load();
      };

      audio.onloadedmetadata = () => {
        if (!cancelled) {
          const totalSeconds = Math.floor(audio.duration || 0);
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          const duration = hours > 0
            ? [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":")
            : [minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");

          setFormData((current) => ({ ...current, duration }));
        }
        cleanup();
      };

      audio.onerror = () => {
        cleanup();
      };
    };

    loadAudioDuration();

    return () => {
      cancelled = true;
    };
  }, [formData.audio_url]);

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
    setFormData({ title: "", subtitle: "", category: "siaran_special_2025", audio_url: "", duration: "" });
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
      duration: podcast.duration || ""
    });
  };

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="bg-[#121212] rounded-2xl p-6 border border-white/5">
        <h3 className="text-white font-bold mb-4">{editingId ? "Edit Podcast" : "Add Podcast"}</h3>
        <div className="grid gap-4">
          <input 
            type="text" 
            placeholder="Title" 
            value={formData.title} 
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]" 
          />
          <input 
            type="text" 
            placeholder="Subtitle" 
            value={formData.subtitle} 
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#B21E35]" 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/70">
              {podcastCategories[0].label}
            </div>
            <div className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/50 text-sm">
              Duration will be detected automatically from the uploaded audio.
            </div>
          </div>
          <MediaUploader
            accept="audio/*"
            folder="podcasts"
            label={formData.audio_url ? "Replace audio" : "Upload audio"}
            initialUrl={formData.audio_url || undefined}
            onUpload={(url) => setFormData({ ...formData, audio_url: url })}
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

      <div className="px-3 py-2 bg-white/5 rounded-full text-white/60 text-sm inline-flex w-fit">
        {podcastCategories[0].label}
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
                    {podcastCategories[0].label}
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
