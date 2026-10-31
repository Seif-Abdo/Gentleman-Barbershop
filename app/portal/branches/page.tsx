"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { PortalNav } from "@/components/portal/PortalNav";
import { DEFAULT_BRANCHES, Branch } from "@/config/branches";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
} from "lucide-react";

export default function BranchesManagementPage() {
  const { locale } = useLanguage();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [branches, setBranches] = useState<Branch[]>(DEFAULT_BRANCHES);
  const [selectedBranchNav, setSelectedBranchNav] = useState<string>("all");

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Branch>>({});
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
  }, [router]);

  const loadBranches = () => {
    fetch("/api/branches")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBranches(data);
      })
      .catch(() => {});
  };

  const handleEdit = (b: Branch) => {
    setEditForm({ ...b });
    setIsNew(false);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setEditForm({
      id: "",
      nameAr: "",
      nameEn: "",
      taglineAr: "",
      taglineEn: "",
      addressAr: "",
      addressEn: "",
      phone: "+201000000000",
      phoneDisplay: "0100 000 0000",
      whatsapp: "201000000000",
      hoursAr: "يومياً من 11:00 صباحاً حتى 12:00 منتصف الليل",
      hoursEn: "Daily 11:00 AM – 12:00 Midnight",
      googleMapsUrl: "https://maps.google.com",
      mapEmbedUrl: "",
      isActive: true,
    });
    setIsNew(true);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isNew ? "add" : "update",
          branch: editForm,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsEditing(false);
        setStatusMsg("تم حفظ بيانات الفرع بنجاح.");
        loadBranches();
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (branchId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الفرع؟")) return;
    try {
      const res = await fetch("/api/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", branch: { id: branchId } }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg("تم حذف الفرع.");
        loadBranches();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!currentUser || currentUser.role !== "master_admin") return null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-ivory">
      <PortalNav
        user={currentUser}
        branches={branches}
        selectedBranch={selectedBranchNav}
        onSelectBranch={(b) => setSelectedBranchNav(b)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
              <span className="text-xs font-bold text-gold uppercase tracking-wider">
                Modular Branch Architecture
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ivory mt-1">
              إدارة وتوسيع فروع صالون جنتل مان
            </h1>
            <p className="text-xs text-ivory-muted mt-1">
              إضافة فروع جديدة وتعديل العناوين، أوقات العمل، وأرقام هواتف كل فرع.
            </p>
          </div>

          <button
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gold hover:bg-gold-light text-bg text-xs font-bold shadow-gold-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة فرع جديد</span>
          </button>
        </div>

        {statusMsg && (
          <div className="p-3.5 rounded-xl bg-green-950/30 border border-green-500/40 text-green-300 text-xs flex justify-between items-center">
            <span>{statusMsg}</span>
            <button onClick={() => setStatusMsg(null)} className="underline text-xs">
              إغلاق
            </button>
          </div>
        )}

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {branches.map((b) => (
            <div key={b.id} className="gold-card rounded-3xl p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-gold/15 text-gold border border-gold/30">
                    slug: /{b.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(b)}
                      className="p-1.5 rounded-lg border border-border hover:border-gold text-ivory-muted hover:text-gold"
                      title="تعديل"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {branches.length > 1 && (
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="p-1.5 rounded-lg border border-red-500/30 hover:border-red-500 text-red-400"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-ivory">{b.nameAr}</h3>
                  <span className="text-xs text-gold">{b.nameEn}</span>
                </div>

                <p className="text-xs text-ivory-muted leading-relaxed">{b.taglineAr}</p>

                <div className="space-y-2 text-xs text-ivory-muted pt-2 border-t border-border">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                    <span>{b.addressAr}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span dir="ltr">{b.phoneDisplay}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{b.hoursAr}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex justify-between items-center text-xs">
                <a
                  href={`/${b.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gold hover:underline font-semibold"
                >
                  معاينة صفحة الفرع ↗
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Edit / Create Modal */}
        {isEditing && (
          <div
            onClick={() => setIsEditing(false)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-xl w-full bg-surface border border-gold/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-gold-glow max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h3 className="text-lg font-bold text-ivory flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-gold" />
                  <span>{isNew ? "إضافة فرع جديد" : `تعديل فرع: ${editForm.nameAr}`}</span>
                </h3>
                <button onClick={() => setIsEditing(false)} className="text-ivory-muted hover:text-gold">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-ivory-muted">معرف الفرع (Slug بالإنجليزية)</label>
                    <input
                      type="text"
                      required
                      disabled={!isNew}
                      value={editForm.id || ""}
                      onChange={(e) => setEditForm({ ...editForm, id: e.target.value.toLowerCase().trim() })}
                      placeholder="e.g. tagamoa"
                      className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-xs text-ivory font-mono focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-ivory-muted">اسم الفرع (بالعربية)</label>
                    <input
                      type="text"
                      required
                      value={editForm.nameAr || ""}
                      onChange={(e) => setEditForm({ ...editForm, nameAr: e.target.value })}
                      placeholder="زهراء المعادي"
                      className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-xs text-ivory focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-ivory-muted">اسم الفرع (بالإنجليزية)</label>
                  <input
                    type="text"
                    required
                    value={editForm.nameEn || ""}
                    onChange={(e) => setEditForm({ ...editForm, nameEn: e.target.value })}
                    placeholder="Zahraa El Maadi"
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-ivory-muted">العنوان التفصيلي</label>
                  <input
                    type="text"
                    required
                    value={editForm.addressAr || ""}
                    onChange={(e) => setEditForm({ ...editForm, addressAr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-ivory-muted">رقم الهاتف الظاهر</label>
                    <input
                      type="text"
                      required
                      value={editForm.phoneDisplay || ""}
                      onChange={(e) => setEditForm({ ...editForm, phoneDisplay: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-xs text-ivory focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-ivory-muted">رقم الواتساب (بدون أصفار أو +)</label>
                    <input
                      type="text"
                      required
                      value={editForm.whatsapp || ""}
                      onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                      placeholder="201001234567"
                      className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-xs text-ivory font-mono focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-ivory-muted">مواعيد وساعات العمل</label>
                  <input
                    type="text"
                    required
                    value={editForm.hoursAr || ""}
                    onChange={(e) => setEditForm({ ...editForm, hoursAr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gold text-bg font-bold text-xs shadow-gold-glow flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ الفرع</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-3 rounded-xl bg-surface-2 border border-border text-xs text-ivory-muted"
                  >
                    إلغاء
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
