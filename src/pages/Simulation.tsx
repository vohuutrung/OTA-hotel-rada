import React, { useState } from 'react';
import { 
  Plus, 
  Settings, 
  Cpu, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle, 
  Zap, 
  Bot, 
  Flame, 
  Table, 
  Clock,
  Sparkles
} from 'lucide-react';
import { Tenant, Property } from '../types';
import { AI_SUGGESTIONS_DUMMY } from '../data/mockData';

interface SimulationProps {
  tenant: Tenant;
  activeProperty: Property;
}

export default function Simulation({ tenant, activeProperty }: SimulationProps) {
  const [activeTab, setActiveTab] = useState<'ota_calc' | 'base_price' | 'ai_analysis' | 'settings'>('ai_analysis');
  const primaryColor = tenant.primaryColor;

  // Overview Matrix Room Rows Mapping (Phase 6 mockup specs)
  const roomTypes = [
    { name: "Balcony Room 🏔️", base: 1077000 },
    { name: "City View Suite 🏙️", base: 956000 },
    { name: "SeaBalcony Premium 🏝️", base: 1498000 },
    { name: "Sea View Panoramic 🌅", base: 1359000 }
  ];

  const columnsDays = [
    { min: "30/03", isSpecial: false },
    { min: "31/03", isSpecial: false },
    { min: "01/04", isSpecial: false },
    { min: "02/04", isSpecial: false },
    { min: "03/04", isSpecial: false },
    { min: "04/04", isSpecial: false },
    { min: "05/04", isSpecial: true  }, // Day 05 has special holiday bullet
    { min: "06/04", isSpecial: false },
    { min: "07/04", isSpecial: false },
    { min: "08/04", isSpecial: false }
  ];

  return (
    <div id="ai-simulation-container" className="p-8 text-slate-50 space-y-6">
      
      {/* Tab headings resembling screenshot specs */}
      <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-1 w-full max-w-2xl select-none" id="sim-tabs-header">
        {[
          { id: 'ota_calc', label: 'OTA CALC' },
          { id: 'base_price', label: 'BASE PRICE' },
          { id: 'ai_analysis', label: 'AI ANALYSIS' },
          { id: 'settings', label: 'SETTINGS' }
        ].map((tab) => (
          <button
            key={tab.id}
            id={`sim-tab-btn-${tab.id}`}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 text-center py-2 text-xs font-bold font-mono tracking-wider rounded transition-all cursor-pointer ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow' 
                : 'text-slate-400 hover:text-slate-100'
            }`}
            style={activeTab === tab.id ? { backgroundColor: '#1d4ed8' } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* AI SIMULATION INSIGHTS */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg space-y-6" id="ai-insights-block">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-700/60 pb-4 gap-4">
          <div>
            <h2 className="text-base font-bold font-sans flex items-center space-x-1.5 uppercase leading-none">
              <Bot size={18} className="text-purple-400 animate-pulse" />
              <span>🤖 AI SIMULATION INSIGHTS</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              DỮ LIỆU PHÂN TÍCH DỰA TRÊN DÒNG CHẢY BIẾN ĐỘNG THỊ TRƯỜNG THỰC TẾ
            </p>
          </div>
          
          <div className="bg-slate-950 px-4 py-2 border border-slate-750 rounded-lg flex items-center space-x-2 text-xs font-bold">
            <span className="text-slate-400 font-mono">🔮 TÂM LÝ THỊ TRƯỜNG:</span>
            <span className="text-orange-500 font-black tracking-wider flex items-center space-x-1 font-mono">
              <Flame size={12} className="fill-orange-500 text-orange-500 shrink-0" />
              <span>BULLISH (SỨC MUA CỰC NÓNG)</span>
            </span>
          </div>
        </div>

        {/* AI SMART Cards theo ngày representation container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* Card Left: Lợi nhuận chiến lược */}
          <div className="p-5 bg-slate-900 border border-slate-750 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-1.5 font-mono text-xs">
                <span>🗓️</span>
                <span className="font-extrabold text-slate-100">CHECK-IN: 30/03/2026</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-900 font-bold font-mono">
                LỢI NHUẬN CHIẾN LƯỢC: +249K / ĐÊM
              </span>
            </div>

            {/* Simulated Room rate increments mapping */}
            <div className="space-y-3 font-mono text-xs">
              {roomTypes.map((room, idx) => {
                const incPercent = idx === 1 ? "3.0%" : "5.0%";
                const oldPrice = room.base;
                const newPrice = Math.round((oldPrice * (idx === 1 ? 1.03 : 1.05)) / 1000) * 1000;
                
                return (
                  <div key={idx} className="bg-slate-950 p-2.5 rounded border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="font-sans block text-[11px] font-bold text-slate-300">{room.name}</span>
                      <span className="text-emerald-400 font-black text-[10px] flex items-center mt-0.5">
                        <span className="mr-0.5">▲</span>
                        <span>Tăng {incPercent}</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 line-through text-[10px] mr-1">
                        {oldPrice.toLocaleString('vi-VN')}
                      </span>
                      <span className="text-emerald-400 font-extrabold">
                        → {newPrice.toLocaleString('vi-VN')} đ
                      </span>
                      <span className="text-emerald-500 ml-1">✓</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Card: Recommendation logic explain summary widget */}
          <div className="bg-slate-900/40 rounded-xl p-5 border border-slate-750/80 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">AI AUTO-CATCHUP RULES RUNNING</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Công cụ AI Pricing Engine tự động phân tích độ giãn nở cung cầu (elasticity score) từng giờ. Do đây là kỳ nghỉ giáp Tết Phú Quốc, hành hành động kích giá mang lại thêm tối thiểu <strong>14.5% RevPAR</strong> mà không gây sụt giảm phòng lấp.
            </p>

            <div className="p-3 bg-indigo-950/20 border border-indigo-900/60 rounded-lg flex items-start space-x-2.5">
              <Sparkles size={14} className="text-purple-400 fill-purple-400 mt-0.5 shrink-0" />
              <div className="text-[10px] text-slate-300 leading-normal font-sans">
                <strong>Hành động tự động:</strong> Thay đổi giá phòng Sea View Panoramic tăng thêm 5.0% đã được ghi nhận và nạp sẵn trong trigger đẩy về OTA.
              </div>
            </div>

            <p className="text-[10.5px] text-slate-500 font-mono italic">
              *Hệ thống an toàn tự ngắt (circuit breaker) bảo lưu min-max quy đổi trong mục Phân Khúc KH.
            </p>
          </div>

        </div>

        {/* OVERVIEW MATRIX (MOCKUP PRICE TABLE) */}
        <div className="pt-2">
          <div className="flex items-center space-x-2 mb-3">
            <Table size={16} className="text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#94a3b8] font-mono pl-1">
              BẢNG LỚN OVERVIEW MATRIX ROOM TYPES
            </h3>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-700" id="overview-matrix-grid">
            <table className="w-full text-left border-collapse bg-slate-900/40 text-xs">
              <thead>
                <tr className="bg-slate-900 font-mono text-[10px] uppercase font-bold text-slate-400 border-b border-slate-700">
                  <th className="p-3">LOẠI PHÒNG (ROOM TYPE)</th>
                  {columnsDays.map((col, idx) => (
                    <th key={idx} className="p-3 text-center border-l border-slate-700/60">
                      <div className="flex items-center justify-center space-x-0.5">
                        <span>{col.min}</span>
                        {col.isSpecial && <span className="text-yellow-400">⭐</span>}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {roomTypes.map((room, rIdx) => {
                  return (
                    <tr key={rIdx} className="hover:bg-slate-800/10 transition-colors">
                      <td className="p-3 font-semibold text-white font-sans truncate max-w-[140px]">
                        {room.name}
                      </td>
                      {columnsDays.map((col, dIdx) => {
                        const noiseAmount = Math.sin(rIdx * dIdx) * 35000;
                        const finalCellPrice = Math.round((room.base + noiseAmount) / 1000) * 1000;
                        const changeAmount = Math.round(noiseAmount / 1000) * 1000;

                        return (
                          <td key={dIdx} className="p-3 text-center border-l border-slate-800 font-mono">
                            <span className="font-extrabold text-[#f8fafc] block">
                              {(finalCellPrice / 1000).toLocaleString('vi-VN')}k
                            </span>
                            {changeAmount !== 0 ? (
                              <span className={`text-[9px] block mt-0.5 ${changeAmount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {changeAmount > 0 ? `▲+${(changeAmount/1000)}k` : `▼${(changeAmount/1000)}k`}
                              </span>
                            ) : (
                              <span className="text-[9px] text-[#475569] block mt-0.5">- ổn định</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI PRICING TABLE (Phase 6 mockup spec indicator block) */}
        <div className="pt-2">
          <div className="flex items-center justify-between pb-3 pl-1 border-b border-slate-700/30">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest font-mono">
              BẮT CẶP ĐỐI CHIẾU AI AUTO-PRICING DIRECTORIES
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center">
              <CheckCircle size={12} className="mr-1" />
              *Giá tự động đã được lưu vào RevPilot DB, sẽ đẩy lên OTA trong vài phút nữa.
            </span>
          </div>

          <div className="divide-y divide-slate-750/60 mt-2" id="ai-pricing-logs-list">
            {AI_SUGGESTIONS_DUMMY.map((item, idx) => {
              const isInc = item.strategy.includes("AI SMART");
              return (
                <div key={idx} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
                  <div className="flex items-start space-x-3">
                    <div className="font-mono text-slate-500 font-bold shrink-0 pt-0.5">
                      {item.date}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100 flex items-center space-x-2">
                        <span>{item.roomType}</span>
                        <span className={`px-2 py-0.5 rounded text-[8.5px] font-black font-mono leading-none border ${
                          isInc 
                            ? 'bg-purple-950 text-purple-300 border-purple-800' 
                            : 'bg-red-950 text-red-300 border-red-800'
                        }`}>
                          {item.strategy}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 pl-0.5 leading-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 pl-8 md:pl-0 font-mono shrink-0">
                    <div className="text-right">
                      <span className="block text-[9px] text-slate-500">Giá Cũ</span>
                      <span className="line-through text-slate-400">{item.oldPrice.toLocaleString('vi-VN')} đ</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[9px] text-slate-500">Giá Mới Đơn Lập</span>
                      <span className={`font-bold ${isInc ? 'text-emerald-400' : 'text-red-400'}`}>
                        {item.newPrice.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
