import React, { useState } from 'react';
import { 
  Flame, 
  HelpCircle, 
  Star, 
  Trophy, 
  Sparkles, 
  ChevronRight, 
  ThumbsUp, 
  ThumbsDown, 
  Calendar,
  Layers,
  MapPin,
  Maximize2
} from 'lucide-react';
import { Hotel, Property, Tenant } from '../types';
import { HOVER_EVALUATIONS_DUMMY } from '../data/mockData';

interface CompetitorGridProps {
  compsetHotels: Hotel[];
  activeProperty: Property;
  tenant: Tenant;
}

export default function CompetitorGrid({ compsetHotels, activeProperty, tenant }: CompetitorGridProps) {
  const [selectedSegment, setSelectedSegment] = useState("all");
  const [selectedDate, setSelectedDate] = useState("2026-04-29");
  
  // Grid dates mapping (5 columns)
  const columnsDates = [
    { date: "29/04/2026", isHot: true, label: "Lễ 30/4 🔥" },
    { date: "30/04/2026", isHot: true, label: "Quốc Tế LĐ 🔥" },
    { date: "01/05/2026", isHot: false, label: "Dịp Thường" },
    { date: "02/05/2026", isHot: false, label: "Cuối Tuần" },
    { date: "03/05/2026", isHot: false, label: "Chủ Nhật" }
  ];

  // Hover state simulation targeting individual hotels
  const [hoveredHotelId, setHoveredHotelId] = useState<number | null>(null);
  
  const primaryColor = tenant.primaryColor;

  // Segment Selector pricing recalculator
  // Leisure FIT (0%), Corporate (-10%), Last Minute (+20%)
  const getAdjustedPrice = (basePrice: number) => {
    if (selectedSegment === "corporate") {
      return Math.round(basePrice * 0.9);
    }
    if (selectedSegment === "lastminute") {
      return Math.round(basePrice * 1.2);
    }
    if (selectedSegment === "vip") {
      return Math.round(basePrice * 0.95);
    }
    return basePrice;
  };

  // Sort hotels mapping for TOP 10 AVR calculation
  const sortedHotels = [...compsetHotels].sort((a, b) => b.price - a.price);

  // Compute average of Top 10 listed
  const top10Avg = Math.round(
    sortedHotels.slice(0, 10).reduce((sum, h) => sum + getAdjustedPrice(h.price), 0) / 10
  );

  // Target hotel position
  const targetIndex = sortedHotels.findIndex(h => h.isTarget);
  const targetPositionText = targetIndex !== -1 ? `#${targetIndex + 1}` : "Nằm ngoài Top 20 🚨";

  return (
    <div id="competitor-grid-container" className="p-8 text-slate-50 space-y-8">
      
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/60 p-4 border border-slate-700 rounded-xl" id="grid-controls">
        <div>
          <h1 className="text-xl font-bold font-sans flex items-center space-x-2">
            <Flame size={18} className="text-orange-500 fill-orange-500 animate-bounce" />
            <span>COMPETITOR REALTIME GRID</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi phân cấp giá so sánh trực tiếp 5 ngày check-in nóng bỏng khác nhau
          </p>
        </div>

        {/* Dynamic Segment adjustment dropdown (Phase 13 requirement) */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-mono font-medium">Bản Đồ Phân Khúc KH:</span>
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="bg-slate-950 text-slate-100 border border-slate-700 rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Leisure FIT / Giá Cơ Bản (0%)</option>
              <option value="corporate">Corporate Partner (-10%)</option>
              <option value="lastminute">Last Minute Deals (+20%)</option>
              <option value="vip">Member / VIP Guest (-5%)</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-mono font-medium font-sans">Ngày Check-in:</span>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-950 text-slate-100 border border-slate-700 rounded px-2.5 py-1 text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* 5-Column Grid with hover Tooltips logic */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pl-1">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-cyan-400">
            MA TRẬN BINH CHỦNG: 5 NGÀY THỊ TRƯỜNG CAO ĐIỂM
          </h3>
          <span className="text-[10.5px] text-slate-500 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            *Hover Card để xem bảng đánh giá cơ sở và vị trí OTA
          </span>
        </div>

        {/* Column headings */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {columnsDates.map((col, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-850 p-2 text-center rounded-lg relative overflow-hidden">
              <span className="font-mono text-xs font-bold text-slate-100 block">{col.date}</span>
              <span className={`text-[9.5px] font-extrabold uppercase mt-1 inline-block px-2 py-0.5 rounded font-mono ${
                col.isHot ? 'bg-red-950 text-red-400 border border-red-900' : 'bg-slate-800 text-slate-400'
              }`}>
                {col.label}
              </span>
            </div>
          ))}
        </div>

        {/* Grid pricing rows */}
        <div className="space-y-4 pt-1">
          {compsetHotels.map((hotel) => {
            return (
              <div key={hotel.id} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {columnsDates.map((col, cIdx) => {
                  let adjustedBase = hotel.price;
                  // add slight variance per column to make prices unique
                  if (cIdx === 0) adjustedBase += 52000;
                  if (cIdx === 1) adjustedBase += 36000;
                  if (cIdx === 2) adjustedBase -= 48000;
                  if (cIdx === 4) adjustedBase -= 92000;

                  const price = getAdjustedPrice(adjustedBase);

                  // Color criteria: highest price (#1) is yellow-400, medium rank (#2-3) is cyan-400, others are pink-400 or slate-400
                  let priceColor = 'text-slate-300';
                  let rank = "#4+";
                  if (hotel.id === 102 || hotel.id === 106) {
                    priceColor = 'text-yellow-400';
                    rank = "#1";
                  } else if (hotel.id === 101 || hotel.id === 109 || hotel.id === 110) {
                    priceColor = 'text-cyan-400';
                    rank = "#2";
                  } else {
                    priceColor = 'text-pink-400';
                    rank = "#3";
                  }

                  const showTooltip = hoveredHotelId === hotel.id;

                  return (
                    <div 
                      key={cIdx}
                      id={`hotel-card-${hotel.id}-col-${cIdx}`}
                      onMouseEnter={() => setHoveredHotelId(hotel.id)}
                      onMouseLeave={() => setHoveredHotelId(null)}
                      className={`bg-slate-800 rounded-xl p-4.5 border transition-all duration-300 relative flex flex-col justify-between h-32 hover:bg-slate-750 cursor-help ${
                        hotel.isTarget 
                          ? 'border-cyan-500 bg-slate-800/90 shadow shadow-cyan-900/30' 
                          : 'border-slate-700'
                      }`}
                    >
                      {/* Top Rank Badge */}
                      {rank === "#1" && (
                        <span className="absolute top-2.5 right-2 text-xs text-yellow-500">🏆</span>
                      )}

                      <div>
                        {/* Name */}
                        <h4 className="font-bold text-xs truncate max-w-[130px] text-white">
                          {hotel.name}
                        </h4>
                        
                        {/* Star Rating Info */}
                        <div className="flex items-center space-x-1.5 mt-1">
                          <Star size={10} className="fill-amber-400 stroke-amber-400" />
                          <span className="text-[10px] text-slate-400">
                            {hotel.rating} ({hotel.reviewCount} reviews)
                          </span>
                        </div>
                      </div>

                      {/* Pricing block */}
                      <div className="mt-3">
                        <span className={`block font-extrabold text-[15px] ${priceColor} tracking-tight`}>
                          {price.toLocaleString('vi-VN')}đ
                        </span>
                        <span className="absolute bottom-2 right-3 text-[10px] font-mono text-slate-500 font-bold">
                          {rank}
                        </span>
                      </div>

                      {/* HOVER TOOLTIP ELEMENT OVERLAY (Phases 4 hover spec) */}
                      {showTooltip && (
                        <div id={`hover-tooltip-hotel-${hotel.id}`} className="absolute top-[-10px] left-[105%] z-50 bg-slate-900 text-slate-100 border border-slate-600 rounded-lg shadow-2xl p-5 w-80 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                          
                          <div className="space-y-1.5 pb-2 border-b border-slate-700/60">
                            <h5 className="font-extrabold text-sm text-cyan-400 font-sans flex items-center space-x-1">
                              <span>🏨</span>
                              <span>{hotel.name}</span>
                            </h5>
                            <div className="flex items-center space-x-2 text-xs text-slate-300">
                              <Star size={12} className="fill-amber-400 stroke-amber-400" />
                              <span className="font-bold">{hotel.rating}</span>
                              <span className="text-slate-400 font-mono">({hotel.reviewCount} reviews)</span>
                            </div>
                            <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                              <MapPin size={10} />
                              <span>Vĩ Tuyến Địa Giới: Bãi Trường, Phú Quốc</span>
                            </div>
                          </div>

                          <div className="py-2.5 border-b border-slate-700/60 font-mono text-xs">
                            <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">🌍 GIÁ OTA BÌNH QUÂN</span>
                            <span className="text-white font-extrabold mt-0.5 block pl-1.5 text-sm">
                              • Mặc định: {price.toLocaleString('vi-VN')} đ
                            </span>
                          </div>

                          <div className="pt-2.5">
                            <span className="block text-[10px] text-slate-500 font-extrabold uppercase font-mono tracking-wider mb-2">
                              📊 ĐÁNH GIÁ PHÂN LOẠI KHÁCH HÀNG
                            </span>
                            <div className="space-y-1.5 max-h-40 overflow-y-auto">
                              {HOVER_EVALUATIONS_DUMMY.reviewsBreakdown.map((rev, idx) => (
                                <div key={idx} className="flex justify-between items-center text-[10.5px] font-mono">
                                  <span className="text-slate-300">{rev.category}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-emerald-400 font-bold">{rev.positive} tốt</span>
                                    <span className="text-red-400 font-bold">{rev.negative} xấu</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* TOP 10 AVG RANKING SECTION (Phase 5 Spec) */}
      <div className="border border-slate-700 rounded-xl overflow-hidden shadow-lg bg-slate-800" id="top10-ranking-table">
        
        {/* check-in banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2.5">
            <Calendar size={18} />
            <h3 className="font-extrabold text-sm uppercase tracking-wider font-sans leading-none">
              🗓️ NGÀY CHECK-IN THỰC TẾ: {columnsDates[0].date}
            </h3>
          </div>
          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-blue-950/40 text-slate-200 border border-blue-900/50">
            AVERAGE TOP 10 RETAIL DATA
          </span>
        </div>

        {/* Summary Bar */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-700 text-xs">
          <div className="flex items-center space-x-8">
            <div>
              <span className="block text-slate-500 text-[10px] font-bold font-mono tracking-wider">TOP 10 AVR (KHOẢNG GIÁ)</span>
              <span className="text-lg font-extrabold text-white mt-1 block">
                {top10Avg.toLocaleString('vi-VN')} vnđ
              </span>
            </div>
            <div>
              <span className="block text-slate-500 text-[10px] font-bold font-mono tracking-wider">CHÊNH LỆCH ĐỐI THỦ</span>
              <span className="text-lg font-extrabold text-red-500 mt-1 block font-mono">
                +{Math.round(((getAdjustedPrice(activeProperty.currentPrice) - top10Avg) / top10Avg) * 100)}%
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="block text-slate-500 text-[10px] font-bold font-mono tracking-wider">VỊ TRÍ KHÁCH SẠN CỦA BẠN</span>
            <span className={`text-sm font-extrabold flex items-center space-x-1.5 justify-end mt-1 ${
              targetPositionText.includes("🚨") ? 'text-red-500' : 'text-emerald-400'
            }`}>
              <span>{targetPositionText}</span>
              {targetPositionText.includes("🚨") ? <span>🚨</span> : <span>🏆</span>}
            </span>
          </div>
        </div>

        {/* Listing content with Medals for Top 1, 2, 3 */}
        <div className="divide-y divide-slate-750">
          {sortedHotels.slice(0, 10).map((hotel, index) => {
            const adjustedPrice = getAdjustedPrice(hotel.price);
            
            // Medal markers
            let medal: React.ReactNode = `#${index + 1}`;
            if (index === 0) medal = <span className="text-xl">🥇</span>;
            if (index === 1) medal = <span className="text-xl">🥈</span>;
            if (index === 2) medal = <span className="text-xl">🥉</span>;

            return (
              <div 
                key={hotel.id}
                className={`p-4 px-6 flex items-center justify-between hover:bg-slate-750/30 transition-colors ${
                  hotel.isTarget ? 'bg-cyan-950/20' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  {/* Rank identifier */}
                  <div className="w-8 font-mono text-slate-400 font-bold text-center">
                    {medal}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-50 flex items-center space-x-2">
                      <span>{hotel.name}</span>
                      {hotel.isTarget && (
                        <span className="px-1.5 py-0.5 bg-cyan-900 border border-cyan-700 text-[8.5px] rounded text-cyan-300 font-mono tracking-widest font-black uppercase">
                          YOUR PROPERTY
                        </span>
                      )}
                    </h5>
                    <div className="flex items-center space-x-2 text-[10.5px] text-slate-400 mt-1">
                      <Star size={10} className="fill-amber-400 stroke-amber-400" />
                      <span className="font-semibold text-slate-200">{hotel.rating}</span>
                      <span>({hotel.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-xs font-black text-red-400 font-mono">
                    {adjustedPrice.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
