import React, { useState } from 'react';
import { 
  Settings, 
  Palette, 
  Users, 
  CheckCircle, 
  Gem, 
  Mail, 
  UserCheck, 
  Save, 
  Plus,
  Trash2,
  Lock,
  Compass
} from 'lucide-react';
import { Tenant, User } from '../types';
import { INITIAL_USER_ACCOUNTS } from '../data/mockData';

interface AdminPageProps {
  tenant: Tenant;
  onUpdateTenant: (updated: Tenant) => void;
}

export default function AdminPage({ tenant, onUpdateTenant }: AdminPageProps) {
  const [companyName, setCompanyName] = useState(tenant.companyName);
  const [logoUrl, setLogoUrl] = useState(tenant.logoUrl || "");
  const [primaryColor, setPrimaryColor] = useState(tenant.primaryColor);
  const [plan, setPlan] = useState<'free' | 'pro' | 'enterprise'>(tenant.plan);
  const [slug, setSlug] = useState(tenant.slug);

  // User Accounts
  const [users, setUsers] = useState<any[]>(INITIAL_USER_ACCOUNTS);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("manager");

  const [isSaved, setIsSaved] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTenant({
      ...tenant,
      companyName,
      logoUrl: logoUrl.trim() || undefined,
      primaryColor,
      plan,
      slug
    });
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newName.trim()) return;

    const newUser = {
      id: Date.now(),
      email: newEmail,
      fullName: newName,
      role: newRole
    };

    setUsers([...users, newUser]);
    setNewEmail("");
    setNewName("");
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div id="admin-white-label-container" className="p-8 text-slate-50 space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-sans tracking-tight">🏢 SYSTEM WHITE-LABEL & MULTI-TENANT CONFIG</h1>
        <p className="text-sm text-slate-400 mt-1">
          Cài đặt nhận diện thương hiệu công ty, nhãn màu tổng thể, phân quyền người dùng (Phase 15 Specs)
        </p>
      </div>

      {/* Success notification */}
      {isSaved && (
        <div id="admin-save-success-alert" className="p-4 bg-emerald-950/40 border border-emerald-900 rounded-xl flex items-center space-x-3 text-emerald-400 text-xs font-semibold animate-bounce">
          <CheckCircle size={16} />
          <span>Thay đổi thương hiệu Tenant áp dụng thành công trên toàn bộ hệ thống RevPilot!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Branding & white-label forms (7 spans) */}
        <form onSubmit={handleUpdate} className="lg:col-span-7 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-700/60 pb-3">
            <Palette size={16} className="text-cyan-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#94a3b8]">THƯƠNG HIỆU NHÃN TRẮNG (WHITE-LABEL)</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="col-span-2">
              <label className="block text-slate-400 font-bold mb-1.5 leading-none">Tên Công Ty Sở Hữu</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-950 text-slate-100 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5 leading-none">Slug Định Danh (Alias ID)</label>
              <input
                type="text"
                required
                value={slug}
                disabled
                className="w-full bg-slate-900 text-slate-500 border border-slate-750 rounded px-3 py-2 cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5 leading-none">Gói Đăng Ký (Plan Subscription)</label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value as any)}
                className="w-full bg-slate-950 text-slate-100 border border-slate-700 rounded px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-sans"
              >
                <option value="free">Free Plan (1 Properties)</option>
                <option value="pro">Pro Plan (5 Properties)</option>
                <option value="enterprise">Enterprise Plan (Không giới hạn)</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-slate-400 font-bold mb-1.5 leading-none">Đường Dẫn Link Logo (Để trống dùng nhãn REVPILOT)</label>
              <input
                type="text"
                placeholder="https://example.com/logo.png"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full bg-slate-950 text-slate-100 border border-slate-700 rounded px-3 py-2 font-mono focus:outline-none"
              />
            </div>

            <div className="col-span-2 p-4 bg-slate-950 rounded-lg border border-slate-750 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-slate-300">Nhãn màu chủ đạo (Primary Color Picker)</span>
                <span className="text-[10px] text-slate-500 font-mono">Bảng màu áp dụng tại nút chính, accent và sidebar border</span>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-10 w-12 h-10 bg-slate-900 border border-slate-700 rounded cursor-pointer p-1"
                />
                <span className="font-mono text-xs font-bold text-slate-300 uppercase">{primaryColor}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 rounded text-xs font-black tracking-wider text-slate-950 transition flex items-center space-x-2 shadow cursor-pointer uppercase"
              style={{ backgroundColor: primaryColor }}
            >
              <Save size={14} className="text-slate-950 font-bold" />
              <span>Lưu Cấu Hình Thương Hiệu</span>
            </button>
          </div>

        </form>

        {/* Right: Tenant Users credentials list mapping (5 spans) */}
        <div className="lg:col-span-5 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg space-y-5">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div className="flex items-center space-x-2">
              <Users size={16} className="text-cyan-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#94a3b8]">THẮT CHẶT VÙNG NGƯỜI DÙNG (USERS)</h3>
            </div>
            <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-slate-900/60 border border-slate-750">
              SLOTS: {users.length}/{plan === 'free' ? 1 : plan === 'pro' ? 3 : 'Unlimited'}
            </span>
          </div>

          {/* User management listings list table */}
          <div className="space-y-3.5 max-h-64 overflow-y-auto" id="admin-users-list">
            {users.map((u) => {
              // plan limitations tags
              let roleStr = "Manager";
              if (u.role === 'admin') roleStr = "Administrator";
              if (u.role === 'viewer') roleStr = "Viewer";

              return (
                <div key={u.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs font-sans">
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-[10.5px] font-bold border border-slate-700">
                      {roleStr[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="font-extrabold text-slate-200 truncate leading-tight">{u.fullName}</h5>
                      <span className="text-[10px] text-slate-500 font-mono truncate block mt-0.5">{u.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[9px] uppercase font-bold font-mono rounded border border-slate-700">
                      {roleStr}
                    </span>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="text-slate-500 hover:text-red-400 transition"
                      title="Decommission User Access"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Create User Section Form */}
          <form onSubmit={handleAddUser} className="pt-3.5 border-t border-slate-700/40 space-y-3">
            <h4 className="text-[10.5px] font-mono font-bold text-slate-400 uppercase">ỦY QUYỀN TRUY CẬP MỚI</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Họ và Tên..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-2.5 py-1.5"
                />
              </div>

              <div>
                <input
                  type="email"
                  required
                  placeholder="Email đăng nhập..."
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="col-span-2 flex items-center space-x-2">
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="flex-1 bg-slate-950 text-slate-300 border border-slate-700 rounded px-2.5 py-1.5"
                >
                  <option value="manager">Manager Role (Quản lý khách sạn)</option>
                  <option value="viewer">Viewer Role (Chỉ xem báo cáo)</option>
                </select>

                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded font-bold text-white transition flex items-center space-x-1 font-mono uppercase cursor-pointer py-2 text-xs"
                >
                  <Plus size={14} />
                  <span>Cấp Acc</span>
                </button>
              </div>
            </div>
          </form>

        </div>

      </div>

    </div>
  );
}
