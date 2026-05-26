import React from 'react';
import { 
  Building2, 
  Radar, 
  Grid3X3, 
  Bot, 
  Calendar, 
  Users, 
  GanttChartSquare, 
  TrendingUp, 
  FileBarChart2, 
  Settings, 
  CreditCard,
  Crown
} from 'lucide-react';
import { Tenant } from '../../types';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  tenant: Tenant;
}

export default function Sidebar({ activeView, onViewChange, tenant }: SidebarProps) {
  // Navigation mapping
  const menuItems = [
    { id: 'properties', label: 'Quản Lý Property', icon: Building2, desc: 'Phase 11: Switch hotels' },
    { id: 'market-radar', label: 'Radar Thị Trường', icon: Radar, desc: 'Phases 1-3: Overview' },
    { id: 'competitor-grid', label: 'Bảng Compset & Top 10', icon: Grid3X3, desc: 'Phases 4-5: Live Grid' },
    { id: 'ai-pricing', label: 'AI Pricing & Crawlers', icon: Bot, desc: 'Phases 6: Recommendations' },
    { id: 'calendar', label: 'Lịch Doanh Thu & Sự Kiện', icon: Calendar, desc: 'Phase 12: Calendar view' },
    { id: 'segments', label: 'Phân Khúc KH & Rules', icon: Users, desc: 'Phase 13: Rules engine' },
    { id: 'tape-chart', label: 'Sơ Đồ Phòng Gantt', icon: GanttChartSquare, desc: 'Phase 7: Room tape' },
    { id: 'traffic', label: 'Traffic & Conversion', icon: TrendingUp, desc: 'Phase 8: Traffic statistics' },
    { id: 'reports', label: 'Báo Cáo Doanh Thu', icon: FileBarChart2, desc: 'Phase 14: PDF & Excel' },
    { id: 'admin', label: 'Nhãn Trắng (Admin)', icon: Settings, desc: 'Phase 15: Config tenant' },
    { id: 'subscription', label: 'Gói Hội Viên', icon: CreditCard, desc: 'Phase 9: Price Tokens' }
  ];

  const primaryColor = tenant.primaryColor;

  return (
    <aside 
      id="main-sidebar"
      className="w-72 bg-slate-900 border-r border-slate-700 flex flex-col justify-between h-screen sticky top-0 text-slate-50 overflow-y-auto"
    >
      <div>
        {/* White-label support Logo */}
        <div className="p-6 border-b border-slate-700 flex items-center space-x-3">
          {tenant.logoUrl ? (
            <img src={tenant.logoUrl} alt={tenant.companyName} className="h-8 max-w-[120px] object-contain rounded" style={{ referrerPolicy: 'no-referrer' }} />
          ) : (
            <div className="flex items-center space-x-2">
              <div 
                className="p-1.5 rounded-full text-slate-900 animate-pulse" 
                style={{ backgroundColor: primaryColor }}
              >
                <Radar size={22} className="stroke-[2.5px]" />
              </div>
              <span className="font-extrabold text-xl tracking-wider select-none font-sans" style={{ color: primaryColor }}>
                REVPILOT
              </span>
            </div>
          )}
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-bold tracking-widest leading-none border border-slate-700">
            {tenant.plan.toUpperCase()}
          </span>
        </div>

        {/* Navigation links */}
        <nav className="p-4 space-y-1.5">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pl-3 mb-2 font-mono">
            Command Center
          </p>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isSelected = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-item-${item.id}`}
                onClick={() => onViewChange(item.id)}
                className={`w-full text-left px-3 py-3 rounded-lg flex items-center space-x-3 transition-all duration-200 group relative ${
                  isSelected 
                    ? 'bg-slate-800 text-white font-medium shadow-md border-l-4' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
                }`}
                style={isSelected ? { borderLeftColor: primaryColor } : {}}
              >
                {/* Active Indicator Hover Effect */}
                <IconComponent 
                  size={18} 
                  className={`transition-colors duration-200 ${
                    isSelected ? '' : 'group-hover:text-slate-200'
                  }`}
                  style={isSelected ? { color: primaryColor } : {}}
                />
                <div className="flex flex-col">
                  <span className="text-sm tracking-tight leading-none">{item.label}</span>
                  <span className="text-[9px] text-slate-500 mt-1 font-mono tracking-normal capitalize leading-none group-hover:text-slate-400">
                    {item.desc}
                  </span>
                </div>

                {isSelected && (
                  <span 
                    className="absolute right-3 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tenant Footer Section */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center space-x-3 p-2 rounded bg-slate-800/30 border border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-300 border border-slate-600 font-mono">
            VT
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-slate-200 truncate">Võ Hữu Trung</h4>
            <p className="text-[10px] text-slate-500 truncate">vohuutrungkn@gmail.com</p>
          </div>
          <div className="p-1 rounded bg-slate-900 text-amber-400 border border-slate-700">
            <Crown size={12} />
          </div>
        </div>
        <p className="text-[9px] text-slate-600 text-center mt-3 font-mono">
          Enterprise ID: #{tenant.slug}
        </p>
      </div>
    </aside>
  );
}
