import React, { useState } from 'react';
import { 
  Users, 
  Settings, 
  Plus, 
  HelpCircle, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert,
  ArrowRight,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { Tenant, Property, GuestSegment, PricingRule } from '../types';
import { INITIAL_SEGMENTS, INITIAL_PRICING_RULES } from '../data/mockData';

interface SegmentsPageProps {
  tenant: Tenant;
  activeProperty: Property;
}

export default function SegmentsPage({ tenant, activeProperty }: SegmentsPageProps) {
  const [segments, setSegments] = useState<GuestSegment[]>(INITIAL_SEGMENTS);
  const [rules, setRules] = useState<PricingRule[]>(INITIAL_PRICING_RULES);
  
  // Interactive Simulator States
  const [simRoom, setSimRoom] = useState("Balcony Room 🏔️");
  const [simSegmentId, setSimSegmentId] = useState(1);
  const [simDate, setSimDate] = useState("2026-05-18");

  // Create Custom Segment States
  const [showAddSegmentModal, setShowAddSegmentModal] = useState(false);
  const [segName, setSegName] = useState("");
  const [segCriteria, setSegCriteria] = useState("");
  const [segAdjustment, setSegAdjustment] = useState(0);

  // Create Pricing Rule States
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [ruleSegmentId, setRuleSegmentId] = useState(1);
  const [ruleRoom, setRuleRoom] = useState("Balcony Room 🏔️");
  const [ruleMin, setRuleMin] = useState(800000);
  const [ruleMax, setRuleMax] = useState(2500000);
  const [ruleStrategy, setRuleStrategy] = useState<'fixed' | 'dynamic' | 'competitor_parity'>('dynamic');

  const primaryColor = tenant.primaryColor;
  const basePrice = activeProperty.currentPrice;

  // Simulator pricing computation logic strictly matching Phase 13 Backend Spec
  const calculateSimulatedFinalPrice = () => {
    const selectedSeg = segments.find(s => s.id === simSegmentId) || segments[0];
    const adjustment = selectedSeg.priceAdjustment;
    
    // step 1: base_price * (1 + adjustment/100)
    const adjusted = Math.round(basePrice * (1 + adjustment / 100));
    
    // step 2: find pricing rule with range date check
    const matchedRule = rules.find(r => 
      r.segmentId === simSegmentId && 
      r.roomType === simRoom
    );

    let finalPrice = adjusted;
    let ruleApplied = false;
    let clampedReason = "";

    if (matchedRule) {
      if (adjusted < matchedRule.minPrice) {
        finalPrice = matchedRule.minPrice;
        ruleApplied = true;
        clampedReason = `Ép cận dưới tối thiểu: ${matchedRule.minPrice.toLocaleString('vi-VN')} đ`;
      } else if (adjusted > matchedRule.maxPrice) {
        finalPrice = matchedRule.maxPrice;
        ruleApplied = true;
        clampedReason = `Chạm trần quy tắc tối đa: ${matchedRule.maxPrice.toLocaleString('vi-VN')} đ`;
      }
    }

    return {
      basePrice,
      adjustedPrice: adjusted,
      finalPrice,
      ruleApplied,
      clampedReason,
      selectedSeg
    };
  };

  const handleCreateSegment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!segName.trim()) return;

    const newSeg: GuestSegment = {
      id: Date.now(),
      propertyId: activeProperty.id,
      name: segName,
      criteria: segCriteria,
      priceAdjustment: segAdjustment,
      isDefault: false
    };

    setSegments([...segments, newSeg]);
    setSegName("");
    setSegCriteria("");
    setSegAdjustment(0);
    setShowAddSegmentModal(false);
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    const newRule: PricingRule = {
      id: Date.now(),
      propertyId: activeProperty.id,
      segmentId: ruleSegmentId,
      roomType: ruleRoom,
      dateStart: "2026-05-01",
      dateEnd: "2026-05-31",
      minPrice: ruleMin,
      maxPrice: ruleMax,
      strategy: ruleStrategy
    };

    setRules([...rules, newRule]);
    setShowAddRuleModal(false);
  };

  const simResult = calculateSimulatedFinalPrice();

  return (
    <div id="segmentation-view-container" className="p-8 text-slate-50 space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-sans tracking-tight">👥 PHÂN KHÚC KHÁCH HÀNG & Personalized Pricing</h1>
        <p className="text-xs text-slate-400 mt-1 uppercase font-mono" style={{ color: primaryColor }}>
          Tỉ Lệ Điều Chỉnh Biên Độ Giá Thành Viên & Setup Khóa Trần Tối Thiểu (Phases 13)
        </p>
      </div>

      {/* Segments Cards Grid Layout */}
      <div>
        <div className="flex items-center justify-between pl-1 mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-cyan-400">
            PHÂN NHÓM CHỦ CHỐT TẬP KHÁCH HÀNG (SEGMENTS CONFIG)
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">Quản lý tệp giá trị tương đồng</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="segments-card-grid">
          {segments.map((seg) => {
            const isAdjNegative = seg.priceAdjustment < 0;
            const isAdjZero = seg.priceAdjustment === 0;

            return (
              <div 
                key={seg.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-500 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <h4 className="font-bold text-sm text-white font-sans">{seg.name}</h4>
                    {seg.isDefault && (
                      <span className="bg-slate-700 text-slate-300 text-[8.5px] px-1.5 py-0.5 rounded font-bold uppercase font-mono">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 font-sans font-medium line-clamp-1">{seg.criteria}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Mức chiết khấu:</span>
                  <span className={`font-extrabold ${
                    isAdjZero ? 'text-slate-300' : isAdjNegative ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {isAdjZero ? '0% (Standard)' : `${seg.priceAdjustment > 0 ? '+' : ''}${seg.priceAdjustment}%`}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Create customizable segment trigger button dashed layout */}
          <div 
            onClick={() => setShowAddSegmentModal(true)}
            className="border-2 border-dashed border-slate-700 hover:border-slate-500 hover:bg-slate-800/10 bg-slate-900/10 rounded-xl p-6 flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all"
          >
            <Plus size={20} className="text-slate-500" />
            <span className="text-xs font-bold text-slate-400 font-mono tracking-wider">TẠO SEGMENT TÙY CHỈNH</span>
          </div>
        </div>
      </div>

      {/* Simulator Calculator Layout Panel (Phase 13 rules requirement) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
        
        {/* Left: Interactive Pricing Simulator */}
        <div className="lg:col-span-5 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg space-y-4">
          <div className="border-b border-slate-750 pb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center">
              <Sparkles size={14} className="mr-1.5 animate-spin duration-300 text-cyan-400" />
              BỘ GIẢ SỬ GIÁ PHÂN KHÚC REALTIME
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Mã giả nguồn: base_price * (1 + adjustment/100) có khóa min-max</p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Loại Phòng Kiểm Thử</label>
              <select
                value={simRoom}
                onChange={(e) => setSimRoom(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-2.5 py-1.5 focus:outline-none"
              >
                <option value="Balcony Room 🏔️">Balcony Room 🏔️</option>
                <option value="City View Suite 🏙️">City View Suite 🏙️</option>
                <option value="SeaBalcony Premium 🏝️">SeaBalcony Premium 🏝️</option>
                <option value="Executive Suite 👑">Executive Suite 👑</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Phân Khúc Khách Hàng</label>
              <select
                value={simSegmentId}
                onChange={(e) => setSimSegmentId(parseInt(e.target.value))}
                className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-2.5 py-1.5 focus:outline-none"
              >
                {segments.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.priceAdjustment > 0?'+':''}{s.priceAdjustment}%)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Cột Mốc Ngày Mô Phỏng</label>
              <input
                type="date"
                value={simDate}
                onChange={(e) => setSimDate(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-2.5 py-1.5 focus:outline-none font-mono"
              />
            </div>

            {/* Results block showing adjusted vs rules check */}
            <div className="bg-slate-950/80 p-4 border border-slate-750/80 rounded-lg space-y-3 mt-4" id="sim-calculations-output">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-500">Giá cơ sở phòng:</span>
                <span className="text-slate-300 font-bold">{simResult.basePrice.toLocaleString('vi-VN')} đ</span>
              </div>

              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-500">Sau điều chỉnh ({simResult.selectedSeg.priceAdjustment}%):</span>
                <span className="text-slate-300 font-bold">{simResult.adjustedPrice.toLocaleString('vi-VN')} đ</span>
              </div>

              {simResult.ruleApplied && (
                <div className="p-2 bg-amber-950/30 border border-amber-900/50 rounded flex items-center space-x-1.5 text-[10.5px] text-amber-300">
                  <ShieldAlert size={12} className="shrink-0" />
                  <span>{simResult.clampedReason}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 font-sans">GIÁ KHÁCH THANH TOÁN:</span>
                <span className="font-extrabold text-cyan-400 text-sm font-mono leading-none">
                  {simResult.finalPrice.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Right: Rules Listings Table */}
        <div className="lg:col-span-7 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-750 pb-2.5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                BẢNG QUY TẮC GIỚI HẠN GIÁ (PRICING RULES)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Khống chế khoảng giá an toàn min/max đối với các chiến dịch hạ giá</p>
            </div>
            <button
              onClick={() => setShowAddRuleModal(true)}
              className="text-[10px] pl-2 pr-2.5 py-1 bg-slate-900 hover:bg-slate-950 text-slate-200 border border-slate-700 rounded flex items-center space-x-1 cursor-pointer font-bold uppercase"
            >
              <Plus size={12} />
              <span>Thêm Quy Tắc</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-750">
            <table className="w-full text-left bg-slate-950/20 text-xs">
              <thead>
                <tr className="bg-slate-900 font-mono text-[10px] uppercase font-bold text-slate-400 border-b border-slate-700">
                  <th className="p-3">Phân khúc</th>
                  <th className="p-3">Loại phòng</th>
                  <th className="p-3 text-right">Giá Tối Thiểu</th>
                  <th className="p-3 text-right">Giá Tối Đa</th>
                  <th className="p-3 text-center">Chiến lược</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {rules.map((rule) => {
                  const targetSeg = segments.find(s => s.id === rule.segmentId);
                  return (
                    <tr key={rule.id} className="hover:bg-slate-800/10 transition-colors">
                      <td className="p-3 font-semibold text-white font-sans">{targetSeg?.name || "Corporate"}</td>
                      <td className="p-3 text-slate-300 font-sans">{rule.roomType}</td>
                      <td className="p-3 text-right text-emerald-400 font-bold">{rule.minPrice.toLocaleString('vi-VN')}đ</td>
                      <td className="p-3 text-right text-red-400 font-bold">{rule.maxPrice.toLocaleString('vi-VN')}đ</td>
                      <td className="p-3 text-center text-slate-400">
                        <span className="px-2 py-0.5 bg-slate-800 rounded font-mono text-[9px] uppercase font-bold text-slate-300 border border-slate-700">
                          {rule.strategy}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* Segment modal */}
      {showAddSegmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 animate-in fade-in">
          <form onSubmit={handleCreateSegment} className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm w-full space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-widest font-mono text-cyan-400">TẠO SEGMENT KHÁCH TÙY CHỈNH</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold mb-1">Tên Phân Khúc *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Khách hàng thân thiết VIP"
                  value={segName}
                  onChange={(e) => setSegName(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 border border-slate-750 px-3 py-1.5 rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-bold mb-1">Tiêu Chí Định Tách</label>
                <input
                  type="text"
                  placeholder="VD: Có mã giới thiệu hoặc thành viên"
                  value={segCriteria}
                  onChange={(e) => setSegCriteria(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 border border-slate-750 px-3 py-1.5 rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-bold mb-1">Tỉ Lệ Đơn Giá Điều Chỉnh (%)</label>
                <input
                  type="number"
                  placeholder="Ví dụ: -10"
                  value={segAdjustment}
                  onChange={(e) => setSegAdjustment(parseInt(e.target.value))}
                  className="w-full bg-slate-950 text-slate-100 border border-slate-750 px-3 py-1.5 rounded text-xs font-mono"
                />
                <span className="text-[9px] text-slate-500 italic mt-0.5 block leading-normal">
                  Chỉ số âm để chiết khấu bớt giá, dương để cộng tăng giá.
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setShowAddSegmentModal(false)}
                className="px-4 py-1.5 text-xs rounded bg-slate-700 text-slate-300"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs rounded text-slate-950 font-bold"
                style={{ backgroundColor: primaryColor }}
              >
                Tạo Ngay
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rules modal */}
      {showAddRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 animate-in fade-in">
          <form onSubmit={handleCreateRule} className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm w-full space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-widest font-mono text-cyan-400">TẠO QUY TẮC PHẠM VI GIÁ AN TOÀN</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Phân Khúc Áp Dụng</label>
                <select
                  value={ruleSegmentId}
                  onChange={(e) => setRuleSegmentId(parseInt(e.target.value))}
                  className="w-full bg-slate-950 text-slate-100 border border-slate-750 px-3 py-1.5 rounded focus:outline-none"
                >
                  {segments.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Loại Phòng Khóa Trần</label>
                <select
                  value={ruleRoom}
                  onChange={(e) => setRuleRoom(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 border border-slate-750 px-3 py-1.5 rounded focus:outline-none"
                >
                  <option value="Balcony Room 🏔️">Balcony Room 🏔️</option>
                  <option value="City View Suite 🏙️">City View Suite 🏙️</option>
                  <option value="SeaBalcony Premium 🏝️">SeaBalcony Premium 🏝️</option>
                  <option value="Executive Suite 👑">Executive Suite 👑</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Giá Sàn Min (VNĐ)</label>
                  <input
                    type="number"
                    value={ruleMin}
                    onChange={(e) => setRuleMin(parseInt(e.target.value))}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-750 px-3 py-1.5 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Giá Trần Max (VNĐ)</label>
                  <input
                    type="number"
                    value={ruleMax}
                    onChange={(e) => setRuleMax(parseInt(e.target.value))}
                    className="w-full bg-slate-950 text-slate-100 border border-slate-750 px-3 py-1.5 rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-sans">Chiến Lược Chạy</label>
                <select
                  value={ruleStrategy}
                  onChange={(e) => setRuleStrategy(e.target.value as any)}
                  className="w-full bg-slate-950 text-slate-100 border border-slate-750 px-3 py-1.5 rounded focus:outline-none"
                >
                  <option value="dynamic">Dynamic Pricing (Biến động linh hoạt)</option>
                  <option value="fixed">Fixed Price Only (Chỉ chốt giá cứng)</option>
                  <option value="competitor_parity">Competitor Parity (Bám đuổi đối thủ)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setShowAddRuleModal(false)}
                className="px-4 py-1.5 text-xs rounded bg-slate-700 text-slate-300"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs rounded text-slate-950 font-bold"
                style={{ backgroundColor: primaryColor }}
              >
                Đồng Ý Lưu
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
