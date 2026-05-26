import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Sparkles, 
  RefreshCcw, 
  Globe2, 
  Plus, 
  X,
  Play,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ChevronDown
} from 'lucide-react';
import { Property, Tenant } from '../../types';

interface HeaderProps {
  properties: Property[];
  activeProperty: Property;
  onPropertyChange: (property: Property) => void;
  onViewChange: (view: string) => void;
  tenant: Tenant;
  onCrawlerSuccess: (crawledPrice: number, scrapedHotelName: string, otaSelected: string) => void;
}

export default function Header({ 
  properties, 
  activeProperty, 
  onPropertyChange, 
  onViewChange,
  tenant,
  onCrawlerSuccess
}: HeaderProps) {
  const [isPropListOpen, setIsPropListOpen] = useState(false);
  const [isCrawlModalOpen, setIsCrawlModalOpen] = useState(false);
  
  // Crawler Modal states
  const [hotelName, setHotelName] = useState("Sunset Bay Retreat Phú Quốc");
  const [city, setCity] = useState("Phú Quốc");
  const [ota, setOta] = useState("agoda");
  const [checkin, setCheckin] = useState("2026-05-30");
  const [checkout, setCheckout] = useState("2026-05-31");
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlLogs, setCrawlLogs] = useState<string[]>([]);
  const [crawlProgress, setCrawlProgress] = useState(0);

  const primaryColor = tenant.primaryColor;

  const runCrawlerSimulation = () => {
    setIsCrawling(true);
    setCrawlProgress(10);
    setCrawlLogs([`[INFO] Khởi tạo Playwright Headless Browser trên server local...`]);
    
    setTimeout(() => {
      setCrawlLogs(prev => [...prev, `[INFO] Xoay vòng User-Agent ngẫu nhiên nhằm vượt rào bảo mật.`, `[INFO] Sử dụng proxy định vị IP tại ${city}...`]);
      setCrawlProgress(30);
    }, 600);

    setTimeout(() => {
      setCrawlLogs(prev => [...prev, `[INFO] Mở trang chủ chính thức của OTA: ${ota.toUpperCase()}...`, `[INFO] Thực hiện điền form: Tìm kiếm "${hotelName}" tại khu vực "${city}"...`]);
      setCrawlProgress(50);
    }, 1200);

    setTimeout(() => {
      setCrawlLogs(prev => [...prev, `[INFO] Đã phát hiện thẻ div có thuộc tính '[data-selenium="hotel-item"]' khớp chính xác!`, `[PARSER] Trích xuất giá phòng tiêu chuẩn Deluxe Double Room...`]);
      setCrawlProgress(75);
    }, 1900);

    setTimeout(() => {
      // Simulate random reasonable crawled price based on the hotel range
      let finalPrice = 902467;
      if (hotelName.toLowerCase().includes("muong thanh")) finalPrice = 850000;
      else if (hotelName.toLowerCase().includes("sofea")) finalPrice = 1150000;
      else {
        finalPrice = 800000 + Math.floor(Math.random() * 350000);
      }

      setCrawlLogs(prev => [
        ...prev, 
        `[SUCCESS] Quét giá realtime thành công mạng lưới OTA ${ota.toUpperCase()}!`,
        `[RESULT] Tên Khách Sạn: ${hotelName}`,
        `[RESULT] Giá Realtime trích xuất: ${finalPrice.toLocaleString('vi-VN')} đ`,
        `[RESULT] Xếp Hạng Đánh Giá: 4.6⭐ (812 reviews)`,
        `[DATABASE] Tự động cập nhật thành công dữ liệu giá trị của phòng vào RevPilot DB!`
      ]);
      setCrawlProgress(100);
      setIsCrawling(false);
      
      // Dispatch success details up to state
      onCrawlerSuccess(finalPrice, hotelName, ota);
    }, 2800);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-700 h-20 sticky top-0 z-40 px-6 flex items-center justify-between text-slate-100">
      
      {/* Target Property Switcher */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button 
            id="property-switcher-btn"
            onClick={() => setIsPropListOpen(!isPropListOpen)}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 hover:bg-slate-750 transition-colors cursor-pointer text-sm font-semibold shadow-inner"
          >
            <Building2 size={16} style={{ color: primaryColor }} />
            <span>{activeProperty.name}</span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isPropListOpen ? 'rotate-180' : ''}`} />
          </button>

          {isPropListOpen && (
            <div className="absolute left-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1">
              <p className="text-[10px] text-slate-400 font-bold px-4 py-1.5 uppercase font-mono tracking-wider border-b border-slate-700/50">
                Lựa Chọn Khách Sạn
              </p>
              <div className="max-h-60 overflow-y-auto">
                {properties.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onPropertyChange(p);
                      setIsPropListOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 hover:bg-slate-700 transition-colors flex items-center justify-between text-xs ${
                      p.id === activeProperty.id ? 'text-white font-bold bg-slate-700/40' : 'text-slate-300'
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                      {p.location}
                    </span>
                  </button>
                ))}
              </div>
              
              <div className="border-t border-slate-700/80 p-2 mt-1">
                <button
                  onClick={() => {
                    onViewChange('properties');
                    setIsPropListOpen(false);
                  }}
                  className="w-full py-1.5 rounded bg-slate-900 hover:bg-slate-950 flex items-center justify-center space-x-1.5 text-xs font-semibold text-slate-200 transition-colors cursor-pointer border border-slate-700/50"
                >
                  <Plus size={14} style={{ color: primaryColor }} />
                  <span>Quản Lý Danh Sách</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search and Commands */}
      <div className="flex items-center space-x-6 flex-1 justify-end max-w-4xl">
        {/* Search Input Bar mimicking the screenshot */}
        <div className="relative w-80">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Khu vực (VD: Phú Quốc)..."
            defaultValue="sunset town phu quoc"
            className="w-full bg-slate-950/70 text-slate-200 pl-9 pr-4 py-2 rounded-lg text-xs font-mono border border-slate-700 focus:outline-none focus:border-cyan-500 placeholder-slate-500 transition-colors shadow-inner"
          />
        </div>

        {/* Action Triggers */}
        <div className="flex items-center space-x-2">
          <button 
            id="ai-suggestions-quick-btn"
            onClick={() => onViewChange('ai-pricing')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-indigo-950/50 border border-indigo-800 text-indigo-200 hover:bg-indigo-950 text-xs font-semibold transition-all cursor-pointer shadow-indigo-900/10 shadow"
          >
            <Sparkles size={14} className="text-purple-400 fill-purple-400" />
            <span>AI GỢI Ý (PURPLE)</span>
          </button>

          <button 
            id="trigger-live-crawl-btn"
            onClick={() => {
              setHotelName(activeProperty.name);
              setCity(activeProperty.location);
              setCrawlLogs([]);
              setCrawlProgress(0);
              setIsCrawlModalOpen(true);
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-blue-950/40 border border-blue-700 text-blue-200 hover:bg-blue-950 text-xs font-semibold transition-all cursor-pointer shadow-blue-900/20 shadow animate-pulse hover:animate-none"
          >
            <RefreshCcw size={14} className="text-blue-400" />
            <span>QUÉT MỚI (BLUE)</span>
          </button>
        </div>

        {/* Global actions */}
        <div className="flex items-center space-x-3 pl-4 border-l border-slate-800">
          {/* EN toggle */}
          <div className="flex items-center space-x-1 px-2.5 py-1.5 rounded bg-slate-800/80 border border-slate-700 text-[11px] font-bold text-slate-300 font-mono select-none">
            <Globe2 size={12} className="text-slate-400" />
            <span>EN</span>
          </div>

          {/* FREE ANALYSIS Button with cyan gradient */}
          <button 
            onClick={() => onViewChange('subscription')}
            className="px-4 py-2 rounded-lg text-xs font-extrabold tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md hover:brightness-110 active:scale-95 transition-all text-center select-none font-sans"
            style={{ backgroundImage: `linear-gradient(135deg, ${primaryColor} 0%, #1d4ed8 100%)` }}
          >
            FREE ANALYSIS
          </button>
        </div>
      </div>

      {/* Crawl "Quét OTA" Interactive Modal */}
      {isCrawlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in scale-in">
            
            {/* Modal Title */}
            <div className="px-6 py-4 bg-slate-900 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded">
                  <Search size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-50 uppercase tracking-wide">🔍 QUÉT GIÁ OTA DIRECT</h3>
                  <p className="text-[10px] text-slate-400">Playwright Realtime Headless Browser Simulator (Chapter 12-15)</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCrawlModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Input fields */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase font-mono">Tên Khách Sạn (Fuzzy match)</label>
                  <input 
                    type="text" 
                    value={hotelName} 
                    onChange={(e) => setHotelName(e.target.value)}
                    placeholder="VD: Vinpearl Luxury Phú Quốc"
                    className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase font-mono">Thành Phố / Tỉnh</label>
                  <input 
                    type="text" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="VD: Phú Quốc"
                    className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase font-mono font-sans">Chọn Kênh OTA</label>
                  <select 
                    value={ota} 
                    onChange={(e) => setOta(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 font-sans"
                  >
                    <option value="agoda">Agoda (Realtime Target)</option>
                    <option value="booking">Booking.com</option>
                    <option value="expedia">Expedia.com</option>
                    <option value="traveloka">Traveloka</option>
                    <option value="trip">Trip.com</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase font-mono">Ngày Check-in</label>
                  <input 
                    type="date" 
                    value={checkin} 
                    onChange={(e) => setCheckin(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase font-mono font-sans">Ngày Check-out</label>
                  <input 
                    type="date" 
                    value={checkout} 
                    onChange={(e) => setCheckout(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              {/* Progress Bar / Sim logs */}
              {crawlLogs.length > 0 && (
                <div id="simulated-crawler-logs" className="border border-slate-700 bg-slate-955 rounded-lg p-4 font-mono text-[10px] space-y-1.5 shadow-inner select-all overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center text-xs font-bold text-cyan-400">
                      <Terminal size={12} className="mr-1.5" />
                      TERMINAL REALTIME:
                    </span>
                    <span className="text-slate-400 font-bold">{crawlProgress}% dọn dòng</span>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
                    <div 
                      className="bg-cyan-500 h-full transition-all duration-300" 
                      style={{ width: `${crawlProgress}%`, backgroundColor: primaryColor }}
                    />
                  </div>

                  <div className="max-h-36 overflow-y-auto space-y-1 text-slate-300">
                    {crawlLogs.map((log, index) => {
                      let color = "text-slate-300";
                      if (log.includes("[SUCCESS]")) color = "text-green-400 font-bold";
                      if (log.includes("[RESULT]")) color = "text-yellow-400 font-semibold";
                      if (log.includes("[ERROR]")) color = "text-red-400";
                      return (
                        <div key={index} className={`${color} leading-relaxed`}>{log}</div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Warning on limits */}
              <div className="p-3 bg-indigo-900/10 border border-indigo-800/40 rounded-lg flex items-start space-x-2">
                <AlertTriangle size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-300 leading-normal">
                  Chức năng quét OTA local dùng tài nguyên hệ thống sandbox ẩn danh để tránh bị khóa IP. Tránh gửi quá 10 yêu cầu/phút của cùng khu vực để duy trì tốc độ hoạt động ổn định nhất.
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="px-6 py-4 bg-slate-900 border-t border-slate-700/50 flex justify-end space-x-3">
              <button 
                onClick={() => setIsCrawlModalOpen(false)}
                className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-slate-300 transition"
              >
                Đóng
              </button>
              <button 
                onClick={runCrawlerSimulation}
                disabled={isCrawling}
                className="px-5 py-2 rounded text-xs font-bold transition flex items-center space-x-1.5 shadow"
                style={{ backgroundColor: primaryColor, color: '#0f172a' }}
              >
                {isCrawling ? (
                  <>
                    <RefreshCcw size={14} className="animate-spin text-slate-950" />
                    <span>Đang quét OTA...</span>
                  </>
                ) : (
                  <>
                    <Play size={12} className="text-slate-950 fill-slate-950" />
                    <span>Bắt Đầu Quét Thật</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </header>
  );
}
