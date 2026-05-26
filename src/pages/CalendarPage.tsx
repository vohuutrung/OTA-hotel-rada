import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  X, 
  AlertCircle, 
  Trash2, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Tag,
  DollarSign
} from 'lucide-react';
import { Tenant, Property, Event } from '../types';
import { INITIAL_EVENTS } from '../data/mockData';

interface CalendarPageProps {
  tenant: Tenant;
  activeProperty: Property;
}

export default function CalendarPage({ tenant, activeProperty }: CalendarPageProps) {
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [selectedDay, setSelectedDay] = useState<number | null>(29); // Default clicked day is 29 (Lễ 30/4)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Event Form
  const [name, setName] = useState("");
  const [dateStart, setDateStart] = useState("2026-05-01");
  const [dateEnd, setDateEnd] = useState("2026-05-02");
  const [type, setType] = useState("holiday");
  const [impactScore, setImpactScore] = useState(4);
  const [description, setDescription] = useState("");

  const primaryColor = tenant.primaryColor;

  // Render bespoke visual grid for May 2026 check-ins
  const daysInMonth = 31;
  const startDayOffset = 4; // May 1st starts on Friday

  // Base price target
  const basePriceVal = activeProperty.currentPrice;

  // Determine events belonging to a day index
  const getEventForDay = (day: number) => {
    // Treat as May 2026
    const paddedDay = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `2026-05-${paddedDay}`;
    
    // Also support April dates for Lễ 30/4
    if (day === 29 || day === 30) {
      return events.find(e => e.dateStart.includes(`-04-${day}`) || e.dateEnd.includes(`-04-${day}`));
    }
    
    return events.find(e => {
      const eStart = parseInt(e.dateStart.split('-')[2]);
      const eEnd = parseInt(e.dateEnd.split('-')[2]);
      return day >= eStart && day <= eEnd;
    });
  };

  // Color code based on impact score
  const getEventColorStyle = (score: number) => {
    if (score >= 4) return { bg: 'bg-red-950/80 hover:bg-red-900/60 text-red-100 border-red-500', hex: '#dc2626' };
    if (score >= 2) return { bg: 'bg-orange-950/80 hover:bg-orange-900/60 text-orange-100 border-orange-500', hex: '#ea580c' };
    if (score > 0) return { bg: 'bg-yellow-950/80 hover:bg-yellow-900/60 text-yellow-100 border-yellow-500', hex: '#ca8a04' };
    if (score <= -2) return { bg: 'bg-cyan-950/80 hover:bg-cyan-900/60 text-cyan-100 border-cyan-500', hex: '#0891b2' };
    return { bg: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-600', hex: '#334155' };
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newEvent: Event = {
      id: Date.now(),
      propertyId: activeProperty.id,
      name,
      dateStart,
      dateEnd,
      type,
      impactScore,
      description
    };

    setEvents([...events, newEvent]);
    setName("");
    setDescription("");
    setIsAddModalOpen(false);
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(e => e.id !== id));
  };

  // Day Selection Pricing simulation
  const currentSelectedEvent = selectedDay ? getEventForDay(selectedDay) : null;
  const currentImpact = currentSelectedEvent ? currentSelectedEvent.impactScore : 0;
  
  // Calculate pricing adjustment: delta is 5% per point of impact score
  const suggestedPrice = Math.round(basePriceVal * (1 + (currentImpact * 0.05)));
  const strategyLabel = currentImpact > 2 ? "TĂNG GIÁ CẠNH TRANH" : currentImpact < -2 ? "GIẢM GIÁ/KÍCH CẦU ÉP GIÁ" : "GIỮ GIÁ ỔN ĐỊNH";

  return (
    <div id="revenue-calendar-container" className="p-8 text-slate-50 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight">📅 LỊCH DOANH THU & SỰ KIỆN</h1>
          <p className="text-xs font-mono text-slate-400 mt-1 uppercase" style={{ color: primaryColor }}>
            HỆ THỐNG PHÂN PHỐI LƯỢC SỰ KIỆN BIẾN THÀNH ĐỒNG GIÁ • {activeProperty.name}
          </p>
        </div>
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow"
          style={{ backgroundColor: primaryColor, color: '#0f172a' }}
        >
          <Plus size={16} className="text-slate-950" />
          <span>THÊM SỰ KIỆN LỄ HỘI</span>
        </button>
      </div>

      {/* Calendar Grid Representation (May 2026) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Calendar structure */}
        <div className="lg:col-span-8 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4 border-b border-slate-700/60 pb-3">
            <span className="text-sm font-bold font-sans">THÁNG 05 NĂM 2026</span>
            <div className="flex items-center space-x-4 text-[10px] font-mono text-slate-400">
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-red-600 mr-1" /> holiday</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-orange-600 mr-1" /> festival</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-cyan-600 mr-1" /> low season</span>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-2.5 text-center text-xs font-bold font-mono text-slate-400 uppercase py-2 bg-slate-900/60 rounded border border-slate-750 mb-3">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2.5" id="monthly-days-grid">
            {/* Pad offset for starting Friday */}
            {Array.from({ length: startDayOffset }).map((_, idx) => (
              <div key={`pad-${idx}`} className="h-20 bg-slate-800/10 border border-slate-800/20 rounded-lg" />
            ))}

            {/* Render 31 days with internal event block markers */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const eventInfo = getEventForDay(day);
              const isSelected = selectedDay === day;
              
              const styles = eventInfo ? getEventColorStyle(eventInfo.impactScore) : null;

              return (
                <div
                  key={`day-${day}`}
                  id={`calendar-day-cell-${day}`}
                  onClick={() => setSelectedDay(day)}
                  className={`h-22 p-2 rounded-lg border transition-all duration-200 cursor-pointer flex flex-col justify-between tracking-tight relative ${
                    isSelected 
                      ? 'bg-slate-700 border-white ring-2 ring-cyan-400' 
                      : 'bg-slate-900/50 border-slate-750 hover:bg-slate-755'
                  }`}
                >
                  <span className="text-xs font-mono font-extrabold text-slate-400 block">{day}</span>
                  
                  {eventInfo && (
                    <div 
                      className={`text-[9.5px] p-1 rounded font-bold truncate leading-tight border ${styles?.bg}`}
                      title={`${eventInfo.name} (Chênh lệch: ${eventInfo.impactScore > 0 ? `+` : ''}${eventInfo.impactScore * 5}%)`}
                    >
                      {eventInfo.name} ({eventInfo.impactScore > 0 ? `+` : ''}{eventInfo.impactScore})
                    </div>
                  )}
                  
                  {!eventInfo && (
                    <span className="text-[8.5px] text-slate-600 font-mono italic block tracking-wider text-right uppercase">
                      ổn định
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Click panel for suggestions / day insights (Phases 12 Spec) */}
        <div className="lg:col-span-4 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg space-y-6" id="calendar-insights-sidebar">
          <div className="border-b border-slate-700 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">BẢNG HIỆU PHÁT CHI TIẾT NGÀY</h3>
            <p className="text-xs text-slate-400 mt-1">Chọn ngày bất kỳ trong bảng để AI xem qua gợi ý điều chỉnh</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-900 p-3.5 rounded-lg border border-slate-750 font-mono text-xs">
              <span className="text-slate-400">Ngày Đang Xem (Selected):</span>
              <span className="font-extrabold text-[#f1f5f9] text-sm">May {selectedDay || 1}, 2026</span>
            </div>

            {currentSelectedEvent ? (
              <div id="active-event-details-box" className="p-4 rounded-lg bg-slate-900 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-red-950 text-red-400 border border-red-900 px-2 py-0.5 rounded font-mono font-bold uppercase">
                    {currentSelectedEvent.type.toUpperCase()} ALERT
                  </span>
                  <span className="text-yellow-400 font-mono text-xs font-bold">
                    Impact: {currentSelectedEvent.impactScore > 0 ? `+` : ''}{currentSelectedEvent.impactScore} Score
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-tight">{currentSelectedEvent.name}</h4>
                <p className="text-[10.5px] text-slate-400 leading-relaxed leading-normal mb-2">
                  {currentSelectedEvent.description || 'Chưa cung cấp miêu tả chi tiết cho sự kiện này.'}
                </p>
                <button
                  onClick={() => handleDeleteEvent(currentSelectedEvent.id)}
                  className="text-red-400 hover:text-red-300 font-mono text-[10px] flex items-center space-x-1 cursor-pointer"
                >
                  <Trash2 size={12} />
                  <span>Xóa Sự Kiện Này</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <span className="text-xs text-slate-500 font-mono italic">
                  Không ghi nhận sự kiện văn hóa/lễ hội trong ngày này.
                </span>
              </div>
            )}

            {/* Suggested calculations Grid panel (Phase 12 spec) */}
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-750 space-y-4">
              <h4 className="text-[10px] font-bold uppercase font-mono tracking-widest text-[#94a3b8] flex items-center">
                <Sparkles size={11} className="mr-1.5 text-cyan-400" />
                AI EVENT-PRICING ENGINE DECISIONS
              </h4>

              <div className="grid grid-cols-2 gap-3.5 text-xs pt-1">
                <div className="p-2 bg-slate-800 rounded border border-slate-750">
                  <span className="text-[9px] text-[#475569] uppercase font-bold block leading-none mb-1">Giá Cơ Bản Ota</span>
                  <span className="font-extrabold text-slate-300">{basePriceVal.toLocaleString('vi-VN')} đ</span>
                </div>

                <div className="p-2 bg-slate-850 rounded border border-slate-750">
                  <span className="text-[9px] text-emerald-400 uppercase font-bold block leading-none mb-1">AI Đề Xuất (+{(currentImpact*5)}%)</span>
                  <span className="font-extrabold text-cyan-400">{suggestedPrice.toLocaleString('vi-VN')} đ</span>
                </div>

                <div className="p-2 bg-slate-850 rounded border border-slate-750">
                  <span className="text-[9px] text-[#475569] uppercase font-bold block leading-none mb-1">Target Occupancy</span>
                  <span className="font-extrabold text-amber-500 font-mono">{currentImpact > 0 ? "85%-90%" : "60% Phổ Thông"}</span>
                </div>

                <div className="p-2 bg-slate-800 rounded border border-slate-750">
                  <span className="text-[9px] text-[#475569] uppercase font-bold block leading-none mb-1">Strategy</span>
                  <span className="font-extrabold text-white block truncate">{strategyLabel}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Bespoke Create Modal window */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full overflow-hidden shadow-2xl">
            
            <form onSubmit={handleAddEvent}>
              <div className="px-6 py-4 bg-slate-900 border-b border-slate-700 flex items-center justify-between">
                <h3 className="font-bold text-xs font-mono uppercase tracking-widest text-cyan-400 flex items-center">
                  <Calendar size={14} className="mr-1.5" />
                  THÊM SỰ KIỆN COMSCOPE
                </h3>
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Tên Sự Kiện / Lễ Hội *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Concert Hoà Nhạc Phú Quốc 2026"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Ngày Bắt Đầu</label>
                    <input
                      type="date"
                      value={dateStart}
                      onChange={(e) => setDateStart(e.target.value)}
                      className="w-full bg-slate-950 text-slate-250 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Ngày Kết Thúc</label>
                    <input
                      type="date"
                      value={dateEnd}
                      onChange={(e) => setDateEnd(e.target.value)}
                      className="w-full bg-slate-950 text-slate-250 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Phân Loại</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="holiday">Holiday (Lễ Quốc Gia)</option>
                      <option value="festival">Festival (Lễ Hội Khu Vực)</option>
                      <option value="concert">Concert Ca Nhạc</option>
                      <option value="sports">Thể Thao & Esports</option>
                      <option value="local_event">Mùa Thấp Điểm / Mưa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Impact Score ({impactScore})</label>
                    <select
                      value={impactScore}
                      onChange={(e) => setImpactScore(parseInt(e.target.value))}
                      className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                    >
                      <option value="5">+5 (Lễ Lớn - Đột Biến)</option>
                      <option value="3">+3 (Lễ Hội/Sự Kiện Đáng Kể)</option>
                      <option value="1">+1 (Sự Kiện Địa Phương Nhẹ)</option>
                      <option value="-3">-3 (Thấp Điểm Mưa Lạnh)</option>
                      <option value="-5">-5 (Bão / Thiên Tai - Ngừng Trở)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Mô Tả Tiết Lộ</label>
                  <textarea
                    rows={2}
                    placeholder="VD: Hoạt động biểu diễn có sự tham gia của dàn khách mời thần tượng..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-900 border-t border-slate-750 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded text-slate-950 transition"
                  style={{ backgroundColor: primaryColor }}
                >
                  Tạo Sự Kiện
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
