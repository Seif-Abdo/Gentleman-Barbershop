"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { PortalNav } from "@/components/portal/PortalNav";
import { DEFAULT_BRANCHES, Branch } from "@/config/branches";
import { AdminRole } from "@/lib/types";
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Key,
  UserCheck,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  Lock,
  User,
} from "lucide-react";

interface AdminRecord {
  id: string;
  username: string;
  name: string;
  role: AdminRole;
  branchId?: string;
  createdAt: string;
}

export default function AdminsManagementPage() {
  const { locale } = useLanguage();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [branches, setBranches] = useState<Branch[]>(DEFAULT_BRANCHES);
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [selectedBranchNav, setSelectedBranchNav] = useState<string>("all");

  const [isEditing, setIsEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [editForm, setEditForm] = useState<{
    id?: string;
    username: string;
    name: string;
    password?: string;
    role: AdminRole;
    branchId: string;
  }>({
    username: "",
    name: "",
    password: "",
    role: "branch_admin",
    branchId: "zahraa-maadi",
  });
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
    loadAdmins();
  }, [router]);

  const loadBranches = () => {
    fetch("/api/branches")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBranches(data);
      })
      .catch(() => {});
  };

  const loadAdmins = () => {
    fetch("/api/admins")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAdmins(data);
      })
      .catch(() => {});
  };

  const handleAddNew = () => {
    setEditForm({
      username: "",
      name: "",
      password: "",
      role: "branch_admin",
      branchId: branches[0]?.id || "zahraa-maadi",
    });
    setIsNew(true);
    setIsEditing(true);
  };

  const handleEdit = (a: AdminRecord) => {
    setEditForm({
      id: a.id,
      username: a.username,
      name: a.name,
      password: "", // Leave blank if not changing
      role: a.role,
      branchId: a.branchId || branches[0]?.id || "zahraa-maadi",
    });
    setIsNew(false);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        action: isNew ? "add" : "update",
        admin: {
          id: editForm.id,
          username: editForm.username,
          name: editForm.name,
          role: editForm.role,
          branchId: editForm.role === "branch_admin" ? editForm.branchId : undefined,
        },
      };

      if (editForm.password && editForm.password.trim().length > 0) {
        payload.admin.password = editForm.password.trim();
      }

      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMsg(
          locale === "ar"
            ? "تم حفظ حساب المدير بنجاح!"
            : "Admin account saved successfully!"
        );
        setIsEditing(false);
        loadAdmins();
      } else {
        setStatusMsg(data.error || "Failed to save admin.");
      }
    } catch {
      setStatusMsg("Error connecting to server.");
    }
  };

  const handleDelete = async (admin: AdminRecord) => {
    if (admin.id === "admin-master") {
      alert(
        locale === "ar"
          ? "لا يمكن حذف حساب المدير العام الافتراضي."
          : "Cannot delete the default Master Admin account."
      );
      return;
    }

    if (
      !confirm(
        locale === "ar"
          ? `هل أنت متأكد من حذف الحساب "${admin.username}" (${admin.name})؟`
          : `Are you sure you want to delete admin account "${admin.username}"?`
      )
    )
      return;

    try {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          admin: { id: admin.id },
        }),
      });
      if (res.ok) {
        setStatusMsg(
          locale === "ar"
            ? "تم حذف الحساب بنجاح."
            : "Admin account deleted successfully."
        );
        loadAdmins();
      }
    } catch {
      setStatusMsg("Error deleting admin.");
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center text-gold">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

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
                <ShieldCheck className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ivory">
                  {locale === "ar"
                    ? "إدارة حسابات وصلاحيات المديرين"
                    : "Admin Accounts & Access Control"}
                </h1>
                <p className="text-sm text-ivory-muted">
                  {locale === "ar"
                    ? "إضافة مديري الفروع والتحكم في صلاحيات الوصول للبيانات لكل فرع"
                    : "Manage branch managers, roles, and branch-specific access permissions"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAddNew}
              className="px-5 py-2.5 bg-gradient-gold text-surface-dark font-bold text-sm rounded-lg hover:shadow-gold transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{locale === "ar" ? "إنشاء حساب مدير جديد" : "Create New Admin"}</span>
            </button>
          </div>
        </div>

        {statusMsg && (
          <div className="p-4 rounded-xl bg-surface-elevated border border-gold/40 flex items-center justify-between text-sm text-gold">
            <span>{statusMsg}</span>
            <button onClick={() => setStatusMsg(null)} className="text-ivory-muted hover:text-ivory">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Info Box */}
        <div className="p-4 rounded-xl bg-gold/5 border border-gold/20 flex items-start gap-3 text-xs text-ivory-muted">
          <Key className="w-5 h-5 text-gold shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-ivory mb-1">
              {locale === "ar" ? "قواعد الصلاحيات في النظام:" : "System Access Rules:"}
            </p>
            <p>
              {locale === "ar"
                ? "• المدير العام (Master Admin): يمتلك صلاحية كاملة على جميع الفروع، حملات الواتساب، وإدارة الفروع والحلاقين والمديرين."
                : "• Master Admin: Full unrestricted access to all branches, WhatsApp campaigns, staff, and account management."}
            </p>
            <p>
              {locale === "ar"
                ? "• مدير الفرع (Branch Admin): مقيد بحصر الصلاحيات على الفرع المخصص له فقط؛ لا يستطيع الوصول لباقي الفروع أو إرسال حملات الواتساب."
                : "• Branch Admin: Strictly restricted to their assigned branch data only; cannot view other branches or manage campaigns."}
            </p>
          </div>
        </div>

        {/* Admins Table / Cards */}
        <div className="bg-surface-elevated border border-border rounded-2xl overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-dark border-b border-border text-[11px] uppercase tracking-wider text-ivory-muted">
                  <th className="py-4 px-6 font-semibold">
                    {locale === "ar" ? "اسم المدير" : "Admin Name"}
                  </th>
                  <th className="py-4 px-6 font-semibold">
                    {locale === "ar" ? "اسم المستخدم (Username)" : "Username"}
                  </th>
                  <th className="py-4 px-6 font-semibold">
                    {locale === "ar" ? "نوع الصلاحية" : "Role"}
                  </th>
                  <th className="py-4 px-6 font-semibold">
                    {locale === "ar" ? "الفرع المخصص" : "Assigned Branch"}
                  </th>
                  <th className="py-4 px-6 font-semibold text-right">
                    {locale === "ar" ? "الإجراءات" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-sm">
                {admins.map((adm) => {
                  const branch = branches.find((b) => b.id === adm.branchId);
                  const isCurrent = currentUser.username === adm.username;
                  return (
                    <tr key={adm.id} className="hover:bg-surface-dark/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-gold font-bold">
                            {adm.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold text-ivory flex items-center gap-2">
                              {adm.name}
                              {isCurrent && (
                                <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded-full font-bold">
                                  {locale === "ar" ? "أنت" : "You"}
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-ivory-subtle block">
                              ID: {adm.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-mono text-xs text-gold">
                        @{adm.username}
                      </td>

                      <td className="py-4 px-6">
                        {adm.role === "master_admin" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gold/15 text-gold border border-gold/40 shadow-gold-glow">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{locale === "ar" ? "مدير عام (Master)" : "Master Admin"}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-surface-dark text-ivory-muted border border-border">
                            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                            <span>{locale === "ar" ? "مدير فرع" : "Branch Admin"}</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        {adm.role === "master_admin" ? (
                          <span className="text-xs text-ivory-muted italic">
                            {locale === "ar" ? "جميع الفروع (شامل)" : "All Branches (Global)"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-ivory">
                            <MapPin className="w-3.5 h-3.5 text-gold" />
                            <span>{branch ? (locale === "ar" ? branch.nameAr : branch.nameEn) : adm.branchId}</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(adm)}
                            className="p-2 rounded-lg bg-surface-dark border border-border hover:border-gold text-ivory hover:text-gold transition-all text-xs flex items-center gap-1.5"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{locale === "ar" ? "تعديل" : "Edit"}</span>
                          </button>
                          {adm.id !== "admin-master" && (
                            <button
                              onClick={() => handleDelete(adm)}
                              className="p-2 rounded-lg bg-surface-dark border border-border hover:border-red-500 text-ivory hover:text-red-400 transition-all text-xs flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">{locale === "ar" ? "حذف" : "Delete"}</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit / Add Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#141414] border border-gold/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 my-8 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-gold" />
                  <h2 className="text-xl font-serif font-bold text-ivory">
                    {isNew
                      ? locale === "ar"
                        ? "إنشاء حساب مدير جديد"
                        : "Create New Admin Account"
                      : locale === "ar"
                      ? `تعديل بيانات الحساب: @${editForm.username}`
                      : `Edit Admin: @${editForm.username}`}
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
                <div>
                  <label className="block text-xs font-medium text-ivory-muted mb-1">
                    {locale === "ar" ? "اسم المدير (الاسم الكامل)" : "Full Display Name"}
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-surface-dark border border-border rounded-lg px-3 py-2 text-sm text-ivory focus:border-gold outline-none"
                    placeholder="e.g. سيف أحمد / Seif Ahmed"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ivory-muted mb-1">
                    {locale === "ar" ? "اسم المستخدم (Username)" : "Username"}
                  </label>
                  <input
                    type="text"
                    disabled={!isNew}
                    value={editForm.username}
                    onChange={(e) =>
                      setEditForm({ ...editForm, username: e.target.value.toLowerCase().trim() })
                    }
                    className="w-full bg-surface-dark border border-border rounded-lg px-3 py-2 text-sm text-ivory focus:border-gold outline-none font-mono"
                    placeholder="e.g. admin_nasr"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ivory-muted mb-1">
                    {isNew
                      ? locale === "ar"
                        ? "كلمة المرور"
                        : "Password"
                      : locale === "ar"
                      ? "كلمة المرور الجديدة (اتركها فارغة للإبقاء على الحالية)"
                      : "New Password (leave empty to keep existing)"}
                  </label>
                  <input
                    type="password"
                    value={editForm.password || ""}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    className="w-full bg-surface-dark border border-border rounded-lg px-3 py-2 text-sm text-ivory focus:border-gold outline-none font-mono"
                    placeholder="••••••••"
                    required={isNew}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-ivory-muted mb-1">
                    {locale === "ar" ? "نوع الصلاحية (Role)" : "Role"}
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value as AdminRole })}
                    className="w-full bg-surface-dark border border-border rounded-lg px-3 py-2 text-sm text-ivory focus:border-gold outline-none"
                  >
                    <option value="branch_admin">
                      {locale === "ar" ? "مدير فرع (Branch Admin)" : "Branch Admin"}
                    </option>
                    <option value="master_admin">
                      {locale === "ar" ? "مدير عام (Master Admin)" : "Master Admin"}
                    </option>
                  </select>
                </div>

                {editForm.role === "branch_admin" && (
                  <div>
                    <label className="block text-xs font-medium text-ivory-muted mb-1">
                      {locale === "ar" ? "الفرع المخصص للمدير" : "Assigned Branch"}
                    </label>
                    <select
                      value={editForm.branchId}
                      onChange={(e) => setEditForm({ ...editForm, branchId: e.target.value })}
                      className="w-full bg-surface-dark border border-border rounded-lg px-3 py-2 text-sm text-ivory focus:border-gold outline-none"
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {locale === "ar" ? b.nameAr : b.nameEn}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-ivory-subtle mt-1">
                      {locale === "ar"
                        ? "سيكون هذا المدير قادرًا فقط على استعراض تقارير وبيانات هذا الفرع."
                        : "This admin will strictly be restricted to this branch's analytics & submissions."}
                    </p>
                  </div>
                )}

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
                    className="px-5 py-2 rounded-lg bg-gradient-gold text-surface-dark font-bold text-sm hover:shadow-gold flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{locale === "ar" ? "حفظ الحساب" : "Save Account"}</span>
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
