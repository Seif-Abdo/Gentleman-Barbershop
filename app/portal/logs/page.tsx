"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { PortalNav } from "@/components/portal/PortalNav";
import { DEFAULT_BRANCHES, Branch } from "@/config/branches";
import { AuditLog, AuditLogAction, AuditLogCategory } from "@/lib/types";
import {
  History,
  Search,
  Download,
  RefreshCw,
  Trash2,
  Filter,
  User,
  ShieldCheck,
  Building2,
  Scissors,
  Send,
  Settings,
  LogIn,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
  Calendar,
  Layers,
  CheckCircle,
  X,
  FileSpreadsheet,
} from "lucide-react";

export default function AuditLogsPage() {
  const { locale } = useLanguage();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [branches, setBranches] = useState<Branch[]>(DEFAULT_BRANCHES);
  const [selectedBranchNav, setSelectedBranchNav] = useState<string>("all");

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAction, setSelectedAction] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  // 1. Auth Check & Branches
  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((authData) => {
        if (!authData.isAuthenticated) {
          router.push("/portal/login");
        } else if (authData.user.role !== "master_admin") {
          // Strictly Master Admin only!
          router.push("/portal");
        } else {
          setCurrentUser(authData.user);
        }
      })
      .catch(() => router.push("/portal/login"));

    fetch("/api/branches")
      .then((res) => res.json())
      .then((bList) => {
        if (Array.isArray(bList) && bList.length > 0) {
          setBranches(bList);
        }
      })
      .catch(() => {});
  }, [router]);

  // 2. Fetch Logs
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedAction !== "all") params.append("action", selectedAction);
      if (searchTerm) params.append("search", searchTerm);
      params.append("_t", Date.now().toString());

      const res = await fetch(`/api/audit-logs?${params.toString()}`, { cache: "no-store" });
      if (res.status === 403) {
        router.push("/portal");
        return;
      }
      const data = await res.json();
      if (Array.isArray(data.logs)) {
        setLogs(data.logs);
      }
    } catch (err: any) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "master_admin") {
      fetchLogs();
    }
  }, [currentUser, selectedCategory, selectedAction]);

  // Handle Search submit / debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentUser?.role === "master_admin") {
        fetchLogs();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Clear all logs (Master Admin action)
  const handleClearLogs = async () => {
    const confirmPrompt =
      locale === "ar"
        ? "هل أنت متأكد من تفريغ ومسح سجل العمليات بالكامل؟ لا يمكن التراجع عن هذه الخطوة."
        : "Are you sure you want to permanently clear all audit logs? This action cannot be undone.";

    if (!window.confirm(confirmPrompt)) return;

    setIsClearing(true);
    try {
      const res = await fetch("/api/audit-logs", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to clear logs");

      setStatusMsg({
        text: locale === "ar" ? "تم تفريغ سجل العمليات بنجاح" : "Audit logs cleared successfully",
        type: "success",
      });
      setLogs([]);
    } catch (err: any) {
      setStatusMsg({ text: err.message, type: "error" });
    } finally {
      setIsClearing(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (logs.length === 0) return;

    const headers = [
      "ID",
      "Timestamp",
      "Date",
      "Time",
      "Username",
      "Admin Name",
      "Role",
      "Branch",
      "Category",
      "Action",
      "Title (Ar)",
      "Title (En)",
      "Details (Ar)",
      "Details (En)",
    ];

    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      l.dateDisplay,
      l.timeDisplay,
      `"${l.username}"`,
      `"${(l.userName || "").replace(/"/g, '""')}"`,
      l.userRole,
      l.branchId || "all",
      l.category,
      l.action,
      `"${(l.titleAr || "").replace(/"/g, '""')}"`,
      `"${(l.titleEn || "").replace(/"/g, '""')}"`,
      `"${(l.detailsAr || "").replace(/"/g, '""')}"`,
      `"${(l.detailsEn || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `gentleman_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter in memory for specific user dropdown
  const filteredLogs = logs.filter((l) => {
    if (selectedUser !== "all" && l.username !== selectedUser) return false;
    return true;
  });

  // Unique list of admins from logs
  const adminUsersList = Array.from(
    new Map(logs.map((l) => [l.username, { username: l.username, name: l.userName }])).values()
  );

  // Statistics
  const totalCount = logs.length;
  const deleteCount = logs.filter((l) => l.action === "DELETE" || l.action === "CLEANUP").length;
  const updateCount = logs.filter((l) => l.action === "UPDATE" || l.action === "STATUS_CHANGE").length;
  const loginCount = logs.filter((l) => l.action === "LOGIN").length;

  if (!currentUser) return null;

  // Category display helper
  const getCategoryBadge = (category: AuditLogCategory) => {
    switch (category) {
      case "feedback":
        return {
          label: locale === "ar" ? "آراء العملاء" : "Feedback",
          icon: Scissors,
          bg: "bg-amber-950/30 text-amber-400 border-amber-500/30",
        };
      case "barbers":
        return {
          label: locale === "ar" ? "فريق الحلاقين" : "Barbers",
          icon: Scissors,
          bg: "bg-blue-950/30 text-blue-400 border-blue-500/30",
        };
      case "branches":
        return {
          label: locale === "ar" ? "الفروع" : "Branches",
          icon: Building2,
          bg: "bg-emerald-950/30 text-emerald-400 border-emerald-500/30",
        };
      case "admins":
        return {
          label: locale === "ar" ? "المشرفين" : "Admins",
          icon: ShieldCheck,
          bg: "bg-purple-950/30 text-purple-400 border-purple-500/30",
        };
      case "campaigns":
        return {
          label: locale === "ar" ? "حملات الواتساب" : "Campaigns",
          icon: Send,
          bg: "bg-pink-950/30 text-pink-400 border-pink-500/30",
        };
      case "settings":
        return {
          label: locale === "ar" ? "الإعدادات" : "Settings",
          icon: Settings,
          bg: "bg-cyan-950/30 text-cyan-400 border-cyan-500/30",
        };
      case "auth":
        return {
          label: locale === "ar" ? "تسجيل دخول" : "Login",
          icon: LogIn,
          bg: "bg-yellow-950/30 text-yellow-400 border-yellow-500/30",
        };
      default:
        return {
          label: category,
          icon: Layers,
          bg: "bg-surface-2 text-ivory-muted border-border",
        };
    }
  };

  // Action badge helper
  const getActionBadge = (action: AuditLogAction) => {
    switch (action) {
      case "DELETE":
      case "CLEANUP":
        return {
          label: action === "CLEANUP" ? (locale === "ar" ? "تنظيف" : "CLEANUP") : (locale === "ar" ? "حذف" : "DELETE"),
          cls: "bg-red-950/40 text-red-400 border-red-500/40",
        };
      case "CREATE":
        return {
          label: locale === "ar" ? "إنشاء" : "CREATE",
          cls: "bg-emerald-950/40 text-emerald-400 border-emerald-500/40",
        };
      case "UPDATE":
      case "STATUS_CHANGE":
        return {
          label: locale === "ar" ? "تعديل" : "UPDATE",
          cls: "bg-blue-950/40 text-blue-400 border-blue-500/40",
        };
      case "LOGIN":
        return {
          label: locale === "ar" ? "دخول" : "LOGIN",
          cls: "bg-amber-950/40 text-amber-400 border-amber-500/40",
        };
      default:
        return { label: action, cls: "bg-surface-2 text-ivory-muted border-border" };
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-ivory">
      {/* Portal Navigation */}
      <PortalNav
        user={currentUser}
        branches={branches}
        selectedBranch={selectedBranchNav}
        onSelectBranch={(b) => setSelectedBranchNav(b)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6 text-start">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shadow-gold-glow">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-ivory flex items-center gap-2">
                  <span>{locale === "ar" ? "سجل العمليات والرقابة الإدارية" : "Admin Audit & Activity Logs"}</span>
                  <span className="text-[10px] bg-red-950/40 text-red-400 border border-red-500/40 px-2 py-0.5 rounded-full font-sans font-bold">
                    {locale === "ar" ? "خاص بالمدير العام فقط" : "Master Admin Only"}
                  </span>
                </h1>
                <p className="text-xs text-ivory-muted">
                  {locale === "ar"
                    ? "تسجيل ومتابعة تفصيلية وفورية لكل التعديلات والإجراءات وعمليات الحذف التي يقوم بها المشرفون في النظام"
                    : "Real-time audit registry tracking all administrative changes, deletions, and logins"}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={fetchLogs}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-2 hover:bg-surface border border-border hover:border-gold/40 text-ivory transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>{locale === "ar" ? "تحديث" : "Refresh"}</span>
            </button>

            <button
              onClick={handleExportCSV}
              disabled={filteredLogs.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gold/15 hover:bg-gold/25 text-gold border border-gold/40 transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{locale === "ar" ? "تصدير Excel/CSV" : "Export CSV"}</span>
            </button>

            <button
              onClick={handleClearLogs}
              disabled={isClearing || logs.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-500/30 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{locale === "ar" ? "مسح السجل" : "Clear Logs"}</span>
            </button>
          </div>
        </div>

        {/* Status Notification */}
        {statusMsg && (
          <div
            className={`p-3.5 rounded-2xl text-xs flex items-center justify-between gap-2 ${
              statusMsg.type === "success"
                ? "bg-emerald-950/40 border border-emerald-500/40 text-emerald-300"
                : "bg-red-950/40 border border-red-500/40 text-red-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{statusMsg.text}</span>
            </div>
            <button onClick={() => setStatusMsg(null)} className="opacity-70 hover:opacity-100">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Quick KPI Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-start">
          <div className="gold-card p-4 sm:p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] text-ivory-muted block">
                {locale === "ar" ? "إجمالي العمليات المسجلة" : "Total Actions Logged"}
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-ivory">{totalCount}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
              <History className="w-4 h-4" />
            </div>
          </div>

          <div className="gold-card p-4 sm:p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] text-ivory-muted block">
                {locale === "ar" ? "عمليات الحذف والتنظيف" : "Deletions & Cleanups"}
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-red-400">{deleteCount}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-red-950/30 border border-red-500/30 flex items-center justify-center text-red-400">
              <Trash2 className="w-4 h-4" />
            </div>
          </div>

          <div className="gold-card p-4 sm:p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] text-ivory-muted block">
                {locale === "ar" ? "تعديلات البيانات والفروع" : "Updates & Modifications"}
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-blue-400">{updateCount}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Settings className="w-4 h-4" />
            </div>
          </div>

          <div className="gold-card p-4 sm:p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] text-ivory-muted block">
                {locale === "ar" ? "تسجيلات دخول المشرفين" : "Admin Logins"}
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-amber-400">{loginCount}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <LogIn className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="gold-card p-4 sm:p-5 rounded-3xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-start">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={locale === "ar" ? "بحث في العمليات أو المشرفين..." : "Search action or admin..."}
                className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2.5 rounded-xl bg-surface-2 border border-border text-xs text-ivory focus:border-gold focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-ivory-muted absolute top-3.5 left-3 rtl:left-auto rtl:right-3 pointer-events-none" />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-2 border border-border text-xs text-ivory focus:border-gold focus:outline-none"
              >
                <option value="all">{locale === "ar" ? "جميع الأقسام" : "All Categories"}</option>
                <option value="feedback">{locale === "ar" ? "آراء وتقييمات العملاء" : "Customer Feedback"}</option>
                <option value="barbers">{locale === "ar" ? "فريق الحلاقين" : "Barbers & Staff"}</option>
                <option value="branches">{locale === "ar" ? "الفروع" : "Branches"}</option>
                <option value="admins">{locale === "ar" ? "حسابات المشرفين" : "Admin Accounts"}</option>
                <option value="campaigns">{locale === "ar" ? "حملات الواتساب" : "WhatsApp Campaigns"}</option>
                <option value="settings">{locale === "ar" ? "الإعدادات والربط" : "Settings"}</option>
                <option value="auth">{locale === "ar" ? "تسجيلات الدخول" : "Logins"}</option>
              </select>
            </div>

            {/* Action Type Filter */}
            <div>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-2 border border-border text-xs text-ivory focus:border-gold focus:outline-none"
              >
                <option value="all">{locale === "ar" ? "جميع أنواع العمليات" : "All Action Types"}</option>
                <option value="DELETE">{locale === "ar" ? "عمليات الحذف (DELETE)" : "DELETE"}</option>
                <option value="CLEANUP">{locale === "ar" ? "عمليات التنظيف (CLEANUP)" : "CLEANUP"}</option>
                <option value="CREATE">{locale === "ar" ? "عمليات الإضافة (CREATE)" : "CREATE"}</option>
                <option value="UPDATE">{locale === "ar" ? "عمليات التعديل (UPDATE)" : "UPDATE"}</option>
                <option value="LOGIN">{locale === "ar" ? "تسجيل الدخول (LOGIN)" : "LOGIN"}</option>
              </select>
            </div>

            {/* Admin Filter */}
            <div>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-2 border border-border text-xs text-ivory focus:border-gold focus:outline-none"
              >
                <option value="all">{locale === "ar" ? "جميع المشرفين" : "All Admins"}</option>
                {adminUsersList.map((a) => (
                  <option key={a.username} value={a.username}>
                    {a.name} ({a.username})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Chips / Counters */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50 text-xs text-ivory-muted">
            <span className="font-medium">
              {locale === "ar"
                ? `عرض ${filteredLogs.length} من إجمالي ${totalCount} عملية مسجلة`
                : `Showing ${filteredLogs.length} of ${totalCount} total actions`}
            </span>

            {(selectedCategory !== "all" || selectedAction !== "all" || selectedUser !== "all" || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedAction("all");
                  setSelectedUser("all");
                  setSearchTerm("");
                }}
                className="text-gold hover:underline text-xs"
              >
                {locale === "ar" ? "إعادة تعيين الفلاتر" : "Reset Filters"}
              </button>
            )}
          </div>
        </div>

        {/* Logs Feed / Timeline List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-16 space-y-3">
              <RefreshCw className="w-6 h-6 text-gold animate-spin mx-auto" />
              <p className="text-xs text-ivory-muted">
                {locale === "ar" ? "جارِ تحميل سجل العمليات..." : "Loading audit logs..."}
              </p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="gold-card p-12 text-center rounded-3xl space-y-3">
              <History className="w-10 h-10 text-ivory-muted/40 mx-auto" />
              <h3 className="text-base font-bold text-ivory">
                {locale === "ar" ? "لا توجد عمليات مسجلة مطابقة" : "No logs match criteria"}
              </h3>
              <p className="text-xs text-ivory-muted max-w-sm mx-auto">
                {locale === "ar"
                  ? "لم يتم العثور على أي إجراءات مسجلة تطابق الفلاتر المحددة حالياً."
                  : "No administrative activities recorded matching your selected filters."}
              </p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const catBadge = getCategoryBadge(log.category);
              const actBadge = getActionBadge(log.action);
              const isExpanded = expandedLogId === log.id;

              return (
                <div
                  key={log.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                    log.action === "DELETE" || log.action === "CLEANUP"
                      ? "bg-red-950/10 border-red-500/25 hover:border-red-500/40"
                      : "bg-surface-2 border-border hover:border-gold/30"
                  }`}
                >
                  {/* Top Bar: Timestamp, Badges, Admin details */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/50 text-start">
                    {/* Admin Identity */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold font-bold text-xs shrink-0">
                        {log.userName ? log.userName.charAt(0) : "A"}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-bold text-ivory">{log.userName || log.username}</span>
                        <span className="text-[10px] text-ivory-muted font-mono">@{log.username}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
                            log.userRole === "master_admin"
                              ? "bg-gold/10 text-gold border-gold/30"
                              : "bg-surface text-ivory-muted border-border"
                          }`}
                        >
                          {log.userRole === "master_admin"
                            ? locale === "ar" ? "👑 المدير العام" : "Master Admin"
                            : locale === "ar" ? "👤 مدير فرع" : "Branch Admin"}
                        </span>
                      </div>
                    </div>

                    {/* Badges & Date/Time */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {/* Category Badge */}
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-medium ${catBadge.bg}`}>
                        <catBadge.icon className="w-3 h-3" />
                        <span>{catBadge.label}</span>
                      </span>

                      {/* Action Badge */}
                      <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${actBadge.cls}`}>
                        {actBadge.label}
                      </span>

                      {/* Time */}
                      <span className="text-ivory-muted text-[11px] font-mono flex items-center gap-1 bg-[#141414] px-2.5 py-0.5 rounded-lg border border-border">
                        <Clock className="w-3 h-3 text-gold" />
                        <span>{log.dateDisplay} {log.timeDisplay}</span>
                      </span>
                    </div>
                  </div>

                  {/* Log Content Description */}
                  <div className="space-y-1.5 text-start">
                    <h4 className="text-sm font-bold text-ivory flex items-center gap-2">
                      <span>{locale === "ar" ? log.titleAr : log.titleEn}</span>
                      {log.branchId && log.branchId !== "all" && (
                        <span className="text-[10px] text-gold font-normal bg-gold/10 px-2 py-0.5 rounded-md border border-gold/20">
                          {branches.find((b) => b.id === log.branchId)?.nameAr || log.branchId}
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-ivory-muted leading-relaxed">
                      {locale === "ar" ? log.detailsAr : log.detailsEn}
                    </p>
                  </div>

                  {/* Metadata preview (if present) */}
                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className="inline-flex items-center gap-1 text-[11px] text-gold/80 hover:text-gold transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        <span>{isExpanded ? (locale === "ar" ? "إخفاء التفاصيل الفنية" : "Hide Details") : (locale === "ar" ? "عرض التفاصيل الفنية (JSON)" : "Show Technical Details")}</span>
                      </button>

                      {isExpanded && (
                        <pre className="mt-2 p-3 rounded-xl bg-[#0A0A0A] border border-border text-[11px] font-mono text-gold-light overflow-x-auto text-left" dir="ltr">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
