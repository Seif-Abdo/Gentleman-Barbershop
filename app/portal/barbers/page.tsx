"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { PortalNav } from "@/components/portal/PortalNav";
import { DEFAULT_BRANCHES, Branch } from "@/config/branches";
import { Barber } from "@/config/barbers";
import {
  Users2,
  Plus,
  Edit2,
  Trash2,
  Scissors,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  Sparkles,
  MapPin,
  Award,
} from "lucide-react";

export default function BarbersManagementPage() {
  const { locale } = useLanguage();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [branches, setBranches] = useState<Branch[]>(DEFAULT_BRANCHES);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBranchNav, setSelectedBranchNav] = useState<string>("all");
  const [filterBranch, setFilterBranch] = useState<string>("all");

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Barber>>({});
  const [isNew, setIsNew] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((authData) => {
        if (!authData.isAuthenticated) {
          router.push("/portal/login");
        } else if (authData.user.role !== "master_admin") {
          router.push("/portal");
        } else {
          setCurrentUser(authData.user);
        }
      })
      .catch(() => router.push("/portal/login"));

    loadBranches();
    loadBarbers();
  }, [router]);

  const loadBranches = () => {
    fetch("/api/branches")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBranches(data);
      })
      .catch(() => {});
  };

  const loadBarbers = () => {
    fetch("/api/barbers")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBarbers(data);
      })
      .catch(() => {});
  };

  const handleEdit = (b: Barber) => {
    setEditForm({ ...b });
    setIsNew(false);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    const defaultBranchId = branches.length > 0 ? branches[0].id : "zahraa-maadi";
    setEditForm({
      id: `barber-${Date.now()}`,
      branchId: filterBranch !== "all" ? filterBranch : defaultBranchId,
      nameAr: "",
      nameEn: "",
      titleAr: "خبير قص وتصفيف",
      titleEn: "Senior Barber & Stylist",
      experienceYears: 5,
      specialtyAr: "القصات العصرية وتحديد اللحية الملكي",
      specialtyEn: "Modern styling & royal beard care",
      isActive: true,
    });
    setIsNew(true);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/barbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isNew ? "add" : "update",
          barber: editForm,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg(
          locale === "ar"
            ? "تم حفظ بيانات الحلاق بنجاح!"
            : "Barber saved successfully!"
        );
        setIsEditing(false);
        loadBarbers();
      } else {
        setStatusMsg(data.error || "Failed to save barber.");
      }
    } catch {
      setStatusMsg("Error connecting to server.");
    }
  };

  const handleDelete = async (barber: Barber) => {
    if (
      !confirm(
        locale === "ar"
          ? `هل أنت متأكد من حذف الحلاق "${barber.nameAr}" من النظام؟`
          : `Are you sure you want to delete barber "${barber.nameEn || barber.nameAr}"?`
      )
    )
      return;

    try {
      const res = await fetch("/api/barbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          barber: { id: barber.id },
        }),
      });
      if (res.ok) {
        setStatusMsg(
          locale === "ar" ? "تم حذف الحلاق بنجاح." : "Barber deleted successfully."
        );
        loadBarbers();
      }
    } catch {
      setStatusMsg("Error deleting barber.");
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center text-gold">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  const displayedBarbers =
    filterBranch === "all"
      ? barbers
      : barbers.filter((b) => b.branchId === filterBranch);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-ivory">
      <PortalNav
        user={currentUser}
        branches={branches}
        selectedBranch={selectedBranchNav}
        onSelectBranch={(b) => setSelectedBranchNav(b)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-gold/10 text-gold border border-gold/30">
                <Users2 className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ivory">
                  {locale === "ar"
                    ? "إدارة فريق الحلاقين والموظفين"
                    : "Barbers & Staff Management"}
                </h1>
                <p className="text-sm text-ivory-muted">
                  {locale === "ar"
                    ? "إضافة وتعديل طاقم العمل وتوزيعهم على الفروع الثلاثة وتحديث التخصصات"
                    : "Add, edit, and assign barber staff across branches and manage specialties"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAddNew}
              className="px-5 py-2.5 bg-gold hover:bg-gold-light text-[#0B0B0B] font-bold text-sm rounded-xl shadow-gold-glow hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#0B0B0B]" />
              <span>{locale === "ar" ? "إضافة حلاق جديد" : "Add New Barber"}</span>
            </button>
          </div>
        </div>

        {/* Branch Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-ivory-muted mr-2">
            {locale === "ar" ? "تصفية حسب الفرع:" : "Filter by Branch:"}
          </span>
          <button
            onClick={() => setFilterBranch("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              filterBranch === "all"
                ? "bg-gold text-surface-dark border-gold font-bold shadow-gold-glow"
                : "bg-surface-elevated text-ivory-muted border-border hover:border-gold/40"
            }`}
          >
            {locale === "ar"
              ? `جميع الفروع (${barbers.length})`
              : `All Branches (${barbers.length})`}
          </button>
          {branches.map((b) => {
            const count = barbers.filter((bar) => bar.branchId === b.id).length;
            return (
              <button
                key={b.id}
                onClick={() => setFilterBranch(b.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  filterBranch === b.id
                    ? "bg-gold text-surface-dark border-gold font-bold shadow-gold-glow"
                    : "bg-surface-elevated text-ivory-muted border-border hover:border-gold/40"
                }`}
              >
                {locale === "ar" ? b.nameAr : b.nameEn} ({count})
              </button>
            );
          })}
        </div>

        {statusMsg && (
          <div className="p-4 rounded-xl bg-surface-elevated border border-gold/40 flex items-center justify-between text-sm text-gold">
            <span>{statusMsg}</span>
            <button onClick={() => setStatusMsg(null)} className="text-ivory-muted hover:text-ivory">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Barbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedBarbers.map((barber) => {
            const branch = branches.find((b) => b.id === barber.branchId);
            return (
              <div
                key={barber.id}
                className={`bg-surface-elevated border rounded-2xl p-6 transition-all relative ${
                  barber.isActive
                    ? "border-border hover:border-gold/50 shadow-card"
                    : "border-red-500/30 opacity-70"
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold font-serif text-lg font-bold shadow-gold-glow">
                      {barber.nameAr.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-ivory">
                        {locale === "ar" ? barber.nameAr : barber.nameEn || barber.nameAr}
                      </h3>
                      <p className="text-xs text-gold font-medium">
                        {locale === "ar" ? barber.titleAr : barber.titleEn}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      barber.isActive
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-red-500/15 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {barber.isActive
                      ? locale === "ar"
                        ? "نشط"
                        : "Active"
                      : locale === "ar"
                      ? "معطل"
                      : "Inactive"}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-ivory-muted border-t border-border/50 pt-4 mb-5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gold" />
                      <span>{locale === "ar" ? "الفرع:" : "Branch:"}</span>
                    </span>
                    <span className="font-semibold text-ivory">
                      {branch ? (locale === "ar" ? branch.nameAr : branch.nameEn) : barber.branchId}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-gold" />
                      <span>{locale === "ar" ? "الخبرة:" : "Experience:"}</span>
                    </span>
                    <span className="font-semibold text-ivory">
                      {barber.experienceYears} {locale === "ar" ? "سنوات" : "Years"}
                    </span>
                  </div>

                  <div className="pt-2">
                    <span className="text-[11px] text-ivory-subtle block mb-1">
                      {locale === "ar" ? "التخصص والمهارة:" : "Specialty:"}
                    </span>
                    <p className="text-xs text-ivory/90 bg-surface-dark p-2.5 rounded-lg border border-border/50">
                      {locale === "ar" ? barber.specialtyAr : barber.specialtyEn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-border/40 pt-4">
                  <button
                    onClick={() => handleEdit(barber)}
                    className="p-2 rounded-lg bg-surface-dark border border-border hover:border-gold text-ivory hover:text-gold transition-all text-xs flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>{locale === "ar" ? "تعديل" : "Edit"}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(barber)}
                    className="p-2 rounded-lg bg-surface-dark border border-border hover:border-red-500 text-ivory hover:text-red-400 transition-all text-xs flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{locale === "ar" ? "حذف" : "Delete"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Edit / Add Form */}
        {isEditing && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#141414] border border-gold/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 my-8 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <Scissors className="w-5 h-5 text-gold" />
                  <h2 className="text-xl font-serif font-bold text-ivory">
                    {isNew
                      ? locale === "ar"
                        ? "إضافة حلاق جديد إلى الفريق"
                        : "Add New Barber to Staff"
                      : locale === "ar"
                      ? `تعديل بيانات الحلاق: ${editForm.nameAr}`
                      : `Edit Barber: ${editForm.nameEn || editForm.nameAr}`}
                  </h2>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1 rounded-lg text-ivory-muted hover:text-ivory"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-ivory-muted mb-1">
                      {locale === "ar" ? "معرّف الحلاق (ID)" : "Barber ID / Slug"}
                    </label>
                    <input
                      type="text"
                      disabled={!isNew}
                      value={editForm.id || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, id: e.target.value.toLowerCase().trim() })
                      }
                      className="w-full bg-[#181818] border border-border/80 rounded-xl px-4 py-2.5 text-sm text-ivory focus:border-gold outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ivory-muted mb-1">
                      {locale === "ar" ? "الفرع التابع له" : "Assigned Branch"}
                    </label>
                    <select
                      value={editForm.branchId || ""}
                      onChange={(e) => setEditForm({ ...editForm, branchId: e.target.value })}
                      className="w-full bg-[#181818] border border-border/80 rounded-xl px-4 py-2.5 text-sm text-ivory focus:border-gold outline-none cursor-pointer"
                      required
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.id} className="bg-[#181818] text-ivory py-1">
                          {locale === "ar" ? b.nameAr : b.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-ivory-muted mb-1">
                      {locale === "ar" ? "الاسم (بالعربية)" : "Arabic Name"}
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={editForm.nameAr || ""}
                      onChange={(e) => setEditForm({ ...editForm, nameAr: e.target.value })}
                      className="w-full bg-[#181818] border border-border/80 rounded-xl px-4 py-2.5 text-sm text-ivory focus:border-gold outline-none"
                      placeholder="مثال: محمد رفاعي"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ivory-muted mb-1">
                      {locale === "ar" ? "الاسم (بالإنجليزية)" : "English Name"}
                    </label>
                    <input
                      type="text"
                      value={editForm.nameEn || ""}
                      onChange={(e) => setEditForm({ ...editForm, nameEn: e.target.value })}
                      className="w-full bg-[#181818] border border-border/80 rounded-xl px-4 py-2.5 text-sm text-ivory focus:border-gold outline-none"
                      placeholder="e.g. Mohamed Refaie"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-ivory-muted mb-1">
                      {locale === "ar" ? "المسمى الوظيفي (بالعربية)" : "Arabic Title"}
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={editForm.titleAr || ""}
                      onChange={(e) => setEditForm({ ...editForm, titleAr: e.target.value })}
                      className="w-full bg-[#181818] border border-border/80 rounded-xl px-4 py-2.5 text-sm text-ivory focus:border-gold outline-none"
                      placeholder="مثال: كبير الحلاقين"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ivory-muted mb-1">
                      {locale === "ar" ? "المسمى الوظيفي (بالإنجليزية)" : "English Title"}
                    </label>
                    <input
                      type="text"
                      value={editForm.titleEn || ""}
                      onChange={(e) => setEditForm({ ...editForm, titleEn: e.target.value })}
                      className="w-full bg-[#181818] border border-border/80 rounded-xl px-4 py-2.5 text-sm text-ivory focus:border-gold outline-none"
                      placeholder="e.g. Master Barber"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-ivory-muted mb-1">
                    {locale === "ar" ? "سنوات الخبرة" : "Years of Experience"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={editForm.experienceYears || 5}
                    onChange={(e) =>
                      setEditForm({ ...editForm, experienceYears: parseInt(e.target.value) || 1 })
                    }
                    className="w-full bg-[#181818] border border-border/80 rounded-xl px-4 py-2.5 text-sm text-ivory focus:border-gold outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-ivory-muted mb-1">
                      {locale === "ar" ? "التخصص والمهارة (بالعربية)" : "Arabic Specialty"}
                    </label>
                    <textarea
                      rows={2}
                      dir="rtl"
                      value={editForm.specialtyAr || ""}
                      onChange={(e) => setEditForm({ ...editForm, specialtyAr: e.target.value })}
                      className="w-full bg-[#181818] border border-border/80 rounded-xl px-4 py-2.5 text-sm text-ivory focus:border-gold outline-none"
                      placeholder="مثال: تدريج الفيد والقصات الكلاسيكية"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ivory-muted mb-1">
                      {locale === "ar" ? "التخصص والمهارة (بالإنجليزية)" : "English Specialty"}
                    </label>
                    <textarea
                      rows={2}
                      value={editForm.specialtyEn || ""}
                      onChange={(e) => setEditForm({ ...editForm, specialtyEn: e.target.value })}
                      className="w-full bg-[#181818] border border-border/80 rounded-xl px-4 py-2.5 text-sm text-ivory focus:border-gold outline-none"
                      placeholder="e.g. Skin fade & classic beard styling"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editForm.isActive ?? true}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-gold focus:ring-gold border-border bg-surface-dark"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-ivory cursor-pointer">
                    {locale === "ar"
                      ? "الحلاق نشط ومتاح في قائمة الحلاقين والتقييم"
                      : "Barber is active and available for client selection"}
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-border pt-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-lg border border-border text-ivory-muted hover:text-ivory text-sm"
                  >
                    {locale === "ar" ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gold hover:bg-gold-light text-[#0B0B0B] font-bold text-sm shadow-gold-glow flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Save className="w-4 h-4 text-[#0B0B0B]" />
                    <span>{locale === "ar" ? "حفظ التغييرات" : "Save Changes"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
