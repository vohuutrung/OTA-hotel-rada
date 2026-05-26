import React, { useState } from 'react';
import { 
  FileBarChart2, 
  Download, 
  Calendar, 
  CheckCircle, 
  Loader2, 
  Sparkles, 
  FileSpreadsheet, 
  FileText,
  Clock,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Tenant, Property } from '../types';

interface ReportsPageProps {
  tenant: Tenant;
  activeProperty: Property;
}

export default function ReportsPage({ tenant, activeProperty }: ReportsPageProps) {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [startDate, setStartDate] = useState("2026-04-20");
  const [endDate, setEndDate] = useState("2026-04-24");
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<string | null>(null);

  const primaryColor = tenant.primaryColor;

  const mockInsights = {
    daily: [
      "Giá bán trung bình hôm nay thấp hơn hôm qua 2%, trùng hợp với mức giảm chung của tệp Comps.",
      "Xu hướng thị trường Phú Quốc đang đi ngang, sụt giảm nhẹ trước thềm cao điểm Tết Dương Lịch.",
      "Đối thủ có định giá cao nhất hôm nay là Tramonto Phu Quoc Hotel (1.089.000đ).",
      "Khuyến nghị đề xuất: Duy trì mức giá phòng Balcony Room 🏔️ ở mức 1.077.000đ để bảo toàn lượng booking trong ngày."
    ],
    weekly: [
      "Doanh thu RevPAR trung bình tuần đạt 1.450.000đ, tăng 8.5% so với chu kỳ tuần trước.",
      "Tỉ suất lấp đầy phòng trung tuần (Occupancy) cán mốc 78%, bám đuổi sát nút Top 2 đối thủ.",
      "Định giá Premium đang được duy trì hiệu quả tại 112% Market Index mà không có xung đột lấp phòng.",
      "Khuyến nghị: Xem xét cài đặt Last-minute deal (+20%) cho các đêm thứ 4 và thứ 5 trống phòng."
    ],
    monthly: [
      "Tổng doanh thu tháng đạt 324.500.000đ, vượt mục tiêu đề ra tối thiểu 11%.",
      "Kênh trực tiếp (Direct Booking) tăng trưởng 14%, tiết kiệm chi phí hoa hồng hoa lợi cho OTA.",
      "Mức độ thâm nhập (Penetration strategy) hoạt động hiệu quả cho tệp Family Duplex.",
      "Khuyến nghị: Chuẩn bị nạp lịch sự kiện tháng tiếp theo để AI Price Engine đồng bộ sớm."
    ]
  };

  const handleExport = (type: 'pdf' | 'excel') => {
    setIsExporting(type);
    setIsSuccess(null);
    
    setTimeout(() => {
      setIsExporting(null);
      setIsSuccess(`Xuất thành công báo cáo dưới dạng file ${type.toUpperCase()}! Thống kê đã được lưu tự động.`);
    }, 1800);
  };

  return (
    <div id="reports-view-container" className="p-8 text-slate-50 space-y-6">
      
      {/* Header title */}
      <div>
        <h1 className="text-2xl font-bold font-sans tracking-tight">📊 BÁO CÁO DOANH THU & EXPORTS</h1>
        <p className="text-xs text-slate-400 mt-1 uppercase font-mono" style={{ color: primaryColor }}>
          Xuất Báo Cáo Định Kỳ • AI Insight Generator Core (Phase 14 Specs)
        </p>
      </div>

      {/* Tabs list with active class highlight */}
      <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-1 w-full max-w-md select-none" id="reports-tabs">
        {[
          { id: 'daily', label: 'HÀNG NGÀY' },
          { id: 'weekly', label: 'HÀNG TUẦN' },
          { id: 'monthly', label: 'HÀNG THÁNG' }
        ].map((tab) => (
          <button
            key={tab.id}
            id={`report-tab-btn-${tab.id}`}
            onClick={() => {
              setActiveTab(tab.id as any);
              setIsSuccess(null);
            }}
            className={`flex-1 text-center py-2 text-xs font-bold font-mono tracking-wider rounded transition-all cursor-pointer ${
              activeTab === tab.id 
                ? 'bg-cyan-600 text-white' 
                : 'text-slate-400 hover:text-slate-100'
            }`}
            style={activeTab === tab.id ? { backgroundColor: primaryColor, color: '#0f172a' } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Date Pickers & Download Export Command Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-800 p-5 rounded-xl border border-slate-700 items-end" id="reports-date-selectors">
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase font-mono">Từ Ngày</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase font-mono">Đến Ngày</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="flex items-center space-x-3">
          {/* PDF button Red */}
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting !== null}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow h-[34px]"
          >
            {isExporting === 'pdf' ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <FileText size={14} />
            )}
            <span>📥 XUẤT PDF</span>
          </button>

          {/* EXCEL button Green */}
          <button
            onClick={() => handleExport('excel')}
            disabled={isExporting !== null}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow h-[34px]"
          >
            {isExporting === 'excel' ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <FileSpreadsheet size={14} />
            )}
            <span>📥 XUẤT EXCEL</span>
          </button>
        </div>
      </div>

      {/* Export notification */}
      {isSuccess && (
        <div id="export-success-alert" className="p-4 bg-emerald-950/40 border border-emerald-900 rounded-xl flex items-center space-x-3 text-emerald-400 text-xs font-semibold animate-pulse">
          <CheckCircle size={16} />
          <span>{isSuccess}</span>
        </div>
      )}

      {/* PANEL: Preview (Xem trước báo cáo) with Cyan Header, Slate body (Phase 14 styling rules specs) */}
      <div className="border border-slate-700 rounded-xl overflow-hidden shadow-lg bg-slate-800" id="report-preview-panel">
        <div className="px-6 py-4 bg-cyan-700 text-slate-950 font-bold text-xs uppercase tracking-widest flex items-center justify-between" style={{ backgroundColor: primaryColor }}>
          <span className="flex items-center">
            <FileBarChart2 size={16} className="mr-2" />
            Bản Xem Trước Chỉ Số Báo Cáo ({activeTab.toUpperCase()})
          </span>
          <span className="font-mono text-[10px]">PREVIEW ONLY</span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-slate-900 rounded-lg border border-slate-750 text-center space-y-1">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wide block">Giá TB Thị Trường</span>
            <span className="text-xl font-mono font-extrabold text-white">1.036.737 đ</span>
          </div>

          <div className="p-4 bg-slate-900 rounded-lg border border-slate-750 text-center space-y-1">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wide block">Tỉ Lệ Lấp Phòng (Occupancy)</span>
            <span className="text-xl font-mono font-extrabold text-[#22c55e]">72.5%</span>
          </div>

          <div className="p-4 bg-slate-900 rounded-lg border border-slate-750 text-center space-y-1">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wide block">RevPAR Trung Bình</span>
            <span className="text-xl font-mono font-extrabold text-cyan-400">756.220 đ</span>
          </div>
        </div>
      </div>

      {/* AI Insights summaries */}
      <div className="bg-slate-850 p-6 rounded-xl border border-slate-750 space-y-4" id="ai-insights-notes">
        <div className="flex items-center space-x-2 border-b border-slate-750 pb-3">
          <Sparkles size={16} className="text-purple-400 fill-purple-400 animate-pulse animate-spin duration-[4s]" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#a855f7] font-mono leading-none">
            💡 AI INSIGHT GENERATED BULLET INSIGHTS
          </h3>
        </div>

        <div className="space-y-3 pl-1">
          {mockInsights[activeTab].map((ins, idx) => (
            <div key={idx} className="flex items-start space-x-3 text-xs leading-normal">
              <ChevronRight size={14} className="text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-slate-300 font-sans font-medium">{ins}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
