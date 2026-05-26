import React from 'react';
import { 
  Legend, 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  HelpCircle, 
  Star, 
  BadgeAlert,
  ArrowRightLeft,
  Sparkles,
  Zap,
  Tag,
  ThumbsUp,
  Sliders
} from 'lucide-react';
import { Property, Hotel, Alert, Tenant } from '../types';
import { calculatePropertyMetrics, generatePriceTrendHistory, INITIAL_ALERTS } from '../data/mockData';

interface MarketRadarProps {
  activeProperty: Property;
  compsetHotels: Hotel[];
  alerts: Alert[];
  onMarkAlertRead: (id: number) => void;
  tenant: Tenant;
}

export default function MarketRadar({
  activeProperty,
  compsetHotels,
  alerts,
  onMarkAlertRead,
  tenant
}: MarketRadarProps) {
  
  // Calculate dynamic data based on active prop selections
  const trendData = generatePriceTrendHistory(activeProperty.id);
  const metrics = calculatePropertyMetrics(activeProperty.id, compsetHotels);
  const primaryColor = tenant.primaryColor;

  const targetHotel = compsetHotels.find(h => h.isTarget) || compsetHotels[0];
  const competitors = compsetHotels.filter(h => !h.isTarget);

  // Filter unread high alerts
  const highAlert = alerts.find(a => !a.isRead && a.severity === 'high') || alerts[0];

  return (
    <div id="market-radar-container" className="p-8 text-slate-50 space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight">🎯 MARKET RADAR</h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            SECURED INTELLIGENCE FEED • REALTIME OTA REVENUE REPORT
          </p>
        </div>
        <div className="px-3.5 py-1 text-[11px] font-bold font-mono tracking-wider rounded-full border border-slate-700 bg-slate-800 flex items-center space-x-1.5 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>LIVE TRACKING RECONCILIATION</span>
        </div>
      </div>

      {/* Main Grid: LEFT (trends + comparison) vs RIGHT (positioning metrics + command) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANEL: 8 columns (Chart and comparison) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Price Trends Chart */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold font-sans">Dự Báo & Biến Động Giá Các Ngày Tới</h2>
                <p className="text-xs text-slate-400 mt-0.5">Biểu đồ so sánh giá trực quan của bạn và trung bình đối thủ trong CompSet</p>
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-slate-500 font-bold uppercase font-mono pl-3 mb-0.5">Giá Hiện Tại Của Bạn</span>
                <span className="text-xl font-extrabold tracking-tight" style={{ color: primaryColor }}>
                  {metrics.targetPrice.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>

            {/* Recharts Container */}
            <div className="h-80 w-full" id="trends-line-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#475569" 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} 
                  />
                  <YAxis 
                    stroke="#475569" 
                    tickFormatter={(val) => `${(val / 1000).toLocaleString()}k`} 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#f8fafc', fontWeight: 'bold', fontSize: 12 }}
                    itemStyle={{ fontSize: 11 }}
                    formatter={(value: number) => [`${value.toLocaleString('vi-VN')} đ`]}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                  />
                  <Line 
                    type="monotone" 
                    name="Giá Của Bạn (Your Property)" 
                    dataKey="yourPrice" 
                    stroke={primaryColor} 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: primaryColor }} 
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="monotone" 
                    name="AVG Compset Thị Trường" 
                    dataKey="marketAvg" 
                    stroke="#a855f7" 
                    strokeWidth={2} 
                    dot={{ r: 3, fill: '#a855f7' }} 
                  />
                  <Line 
                    type="monotone" 
                    name="Vùng Giá Đề Xuất (Sweet Spot)" 
                    dataKey="sweetSpot" 
                    stroke="#22c55e" 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* BELOW CHART: Core Compset sliders (Phase 3 spec) */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 pl-1 font-sans">
                  COMPSET CỐT LÕI VÀ KHOẢNG ĐỊNH VỊ (TOP 5)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Xác định vị trí tương đối của bạn so với biên độ giá của các đối thủ trực tiếp</p>
              </div>
              <Sliders size={16} className="text-slate-400" />
            </div>

            <div className="space-y-4" id="compset-slider-list">
              {competitors.slice(0, 5).map((comp, idx) => {
                // Determine mock position percentage for slider based on relative pricing
                const minPrice = comp.price * 0.8;
                const maxPrice = comp.price * 1.3;
                const percent = Math.min(100, Math.max(0, ((comp.price - minPrice) / (maxPrice - minPrice)) * 100));

                return (
                  <div key={comp.id} className="flex items-center justify-between text-xs py-2 border-b border-slate-700/20 last:border-0">
                    <div className="w-1/3 min-w-0 pr-4">
                      <h4 className="font-semibold text-white truncate text-xs leading-none">{comp.name}</h4>
                      <div className="flex items-center space-x-1 text-[10px] text-slate-400 mt-1">
                        <Star size={10} className="fill-amber-400 stroke-amber-400" />
                        <span>{comp.rating} ({comp.reviewCount || 40} đánh giá)</span>
                      </div>
                    </div>

                    {/* Horizontal slider bar matching mockup specifications */}
                    <div className="flex-1 px-4 relative flex items-center h-4">
                      <div className="w-full bg-slate-700 h-1.5 rounded-full relative">
                        {/* Orange dot marker indicating competitor average price point */}
                        <div 
                          className="absolute w-3 h-3 bg-orange-500 rounded-full border border-white -top-[3px] shadow transition-all duration-300 transform -translate-x-1/2" 
                          style={{ left: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-right w-1/4 font-mono">
                      <span className="block text-slate-400 text-[10px]">Khoảng Giá</span>
                      <span className="font-bold text-slate-200">
                        {Math.round(minPrice / 1000).toLocaleString()}k – {Math.round(maxPrice / 1000).toLocaleString()}k
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* RIGHT PANEL: 4 columns (Metrics and positioning command summaries) */}
        <div className="lg:col-span-4 space-y-6">

          {/* AI REVENUE COMMAND SIDEBAR (Phases 1-3 spec) */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
            <div className="px-5 py-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-[#22c55e] flex items-center font-mono">
                <Zap size={14} className="mr-1.5 fill-cyan-400 stroke-cyan-400" />
                ⚡ AI REVENUE COMMAND
              </span>
            </div>

            {/* Metrics Grid Cards Block */}
            <div className="grid grid-cols-3 gap-2 px-4 pt-4" id="revenue-command-metrics">
              
              {/* MARKET INDEX */}
              <div className="bg-slate-900/60 p-3 rounded border-t-2 border-cyan-500 flex flex-col justify-between text-center relative overflow-hidden group">
                <span className="text-[9px] text-slate-400 font-bold uppercase font-mono leading-none block">MARKET INDEX</span>
                <span className="text-xl font-extrabold text-cyan-400 block tracking-tight my-2 font-mono">{metrics.marketIndex}%</span>
                <p className="text-[8px] text-slate-500 font-medium">So với mặt bằng chung</p>
              </div>

              {/* PRICE GAP */}
              <div className="bg-slate-900/60 p-3 rounded border-t-2 border-red-500 flex flex-col justify-between text-center relative overflow-hidden group">
                <span className="text-[9px] text-slate-400 font-bold uppercase font-mono leading-none block">PRICE GAP</span>
                <span className={`text-xl font-extrabold block tracking-tight my-2 font-mono ${metrics.priceGap >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {metrics.priceGap >= 0 ? `+${metrics.priceGap}` : metrics.priceGap}%
                </span>
                <p className="text-[8px] text-slate-500 font-medium">{metrics.priceGap >= 0 ? 'Đắt hơn đối thủ' : 'Rẻ hơn đối thủ'}</p>
              </div>

              {/* RATING GAP */}
              <div className="bg-slate-900/60 p-3 rounded border-t-2 border-emerald-500 flex flex-col justify-between text-center relative overflow-hidden group">
                <span className="text-[9px] text-slate-400 font-bold uppercase font-mono leading-none block">RATING GAP</span>
                <span className={`text-xl font-extrabold block tracking-tight my-2 font-mono ${metrics.ratingGap >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {metrics.ratingGap >= 0 ? `+${metrics.ratingGap}` : metrics.ratingGap}
                </span>
                <p className="text-[8px] text-slate-500 font-medium">So với sao Compset</p>
              </div>

            </div>

            {/* Cảnh Báo Rò Rỉ Doanh Thu Section */}
            {highAlert && (
              <div className="p-4" id="high-severity-alert-box">
                <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-[10px] font-extrabold uppercase text-red-400 font-mono">
                      <AlertTriangle size={12} className="mr-1.5 fill-red-500 stroke-slate-950" />
                      ⚠️ CẢNH BÁO RÒ RỈ DOANH THU
                    </span>
                    <span className="text-[9px] bg-red-650 px-2 py-0.5 rounded font-bold font-sans text-xs">
                      {highAlert.date}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-200 leading-relaxed font-sans font-medium">
                    {highAlert.message}
                  </p>
                  <button
                    onClick={() => onMarkAlertRead(highAlert.id)}
                    className="text-[10px] font-bold text-cyan-400 pl-1 hover:underline cursor-pointer block select-none"
                  >
                    Đăng Ký Đã Đọc ✓
                  </button>
                </div>
              </div>
            )}

            {/* Analysis Segment Strategy Badge Section */}
            <div className="px-4 pb-4">
              <div className="bg-slate-900/40 rounded-lg p-4 border border-slate-700/60 space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase font-mono pl-1">Phân Tích AI Strategy</span>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase font-mono tracking-wider ${
                    metrics.marketIndex > 110 
                      ? 'bg-red-950 text-red-400 border border-red-800' 
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}>
                    {metrics.marketIndex > 110 ? 'ANALYSIS: HỐT VÀNG (SKIMMING)' : 'ANALYSIS: XUYÊN THẤU (PENETRATION)'}
                  </span>
                </div>

                <div className="space-y-3.5 pt-2 border-t border-slate-700/30">
                  <div className="flex items-start space-x-2.5">
                    <div className="p-1 px-1.5 bg-cyan-950 text-cyan-400 font-black border border-cyan-800 text-[10px] rounded uppercase font-mono mt-0.5">
                      PRICE EDGE
                    </div>
                    <p className="text-xs text-slate-300 leading-normal pl-1">
                      Đang định vị {metrics.marketIndex > 110 ? 'Premium (Phân khúc Thượng Lưu)' : 'Kích Cầu (Price Edge)'} (Chênh lệch {metrics.priceGap}%). Cần theo dõi chặt chẽ Pickup Rate; sẵn sàng giảm nhẹ nếu tốc độ lấp phòng kém hơn 10% thị trường.
                    </p>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <div className="p-1 px-1.5 bg-amber-950 text-amber-400 font-black border border-amber-800 text-[10px] rounded uppercase font-mono mt-0.5">
                      WEAK SPOT
                    </div>
                    <p className="text-xs text-slate-300 leading-normal pl-1">
                      Đối thủ Lotus Home & Cafe bộc lộ mức rủi ro về VỊ TRÍ và CHẤT LƯỢNG dịch vụ. Hãy bảo đảm quy trình SOP phục vụ đạt mức tốt nhất để chiếm tệp tảng này trên Agoda.
                    </p>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <div className="p-1 px-1.5 bg-purple-950 text-purple-400 font-black border border-purple-800 text-[10px] rounded uppercase font-mono mt-0.5">
                      INSIGHT
                    </div>
                    <p className="text-xs text-slate-300 leading-normal pl-1">
                      Khách Sạn Novus Sol đang áp dụng tặng kèm dịch vụ ăn tối lãng mạn. Đề nghị bộ phận Sales nghiên cứu ưu đãi tương ứng để duy trì cán cân cạnh tranh.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
