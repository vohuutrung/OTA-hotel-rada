import React, { useState } from 'react';
import { Building2, MapPin, Eye, Settings, Plus, Wifi, Star, CheckCircle2 } from 'lucide-react';
import { Property, Tenant } from '../types';

interface PropertiesPageProps {
  properties: Property[];
  activeProperty: Property;
  onPropertyChange: (p: Property) => void;
  onAddProperty: (name: string, location: string, agoda: string, booking: string) => void;
  onViewChange: (view: string) => void;
  tenant: Tenant;
}

export default function PropertiesPage({ 
  properties, 
  activeProperty, 
  onPropertyChange, 
  onAddProperty,
  onViewChange,
  tenant 
}: PropertiesPageProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("Phú Quốc");
  const [agoda, setAgoda] = useState("");
  const [booking, setBooking] = useState("");

  const primaryColor = tenant.primaryColor;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddProperty(name, location, agoda, booking);
    setName("");
    setAgoda("");
    setBooking("");
    setShowAddForm(false);
  };

  return (
    <div id="properties-view-container" className="p-8 text-slate-50 space-y-6">
      
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight">🏨 DANH SÁCH PROPERTIES PHÂN QUYỀN</h1>
          <p className="text-sm text-slate-400 mt-1">
            Quản lý tệp khách sạn, đồng bộ OTA và kết nối compset tùy chỉnh (Phân quyền: Admin & Manager)
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 cursor-pointer shadow"
          style={{ backgroundColor: primaryColor, color: '#0f172a' }}
        >
          <Plus size={16} className="text-slate-950" />
          <span>THÊM PROPERTY MỚI</span>
        </button>
      </div>

      {/* Add Form Option */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-6 bg-slate-800 border border-slate-700 rounded-xl space-y-4 max-w-2xl animate-in slide-in-from-top-3 duration-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">TẠO KHÁCH SẠN QUẢN LÝ MỚI</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-400 mb-1">Tên Khách Sạn *</label>
              <input
                type="text"
                required
                placeholder="VD: Novotel Resort Phu Quoc"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Khu Vực Địa Lý</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="Phú Quốc">Phú Quốc</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Nha Trang">Nha Trang</option>
                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Thứ Hạng Khách Sạn (Sao)</label>
              <div className="flex items-center space-x-1.5 p-2 bg-slate-950 rounded border border-slate-700 py-1.5">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-slate-300 font-mono">4.5 Sao Tiêu Chuẩn</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Mã Agoda ID (Nếu có)</label>
              <input
                type="text"
                placeholder="VD: agoda_pq_novo"
                value={agoda}
                onChange={(e) => setAgoda(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Mã Booking.com ID (Nếu có)</label>
              <input
                type="text"
                placeholder="VD: booking_pq_novo"
                value={booking}
                onChange={(e) => setBooking(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-700/50">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-semibold rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded text-slate-950 transition"
              style={{ backgroundColor: primaryColor }}
            >
              Lưu Khách Sạn
            </button>
          </div>
        </form>
      )}

      {/* Grid of properties */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((p) => {
          const isSelected = p.id === activeProperty.id;
          return (
            <div
              key={p.id}
              onClick={() => onPropertyChange(p)}
              className={`bg-slate-800 border rounded-xl overflow-hidden shadow-lg p-5 flex flex-col justify-between transition-all duration-300 relative cursor-pointer hover:border-slate-500 hover:translate-y-[-2px] ${
                isSelected ? 'border-l-4 border-cyan-500' : 'border-slate-700'
              }`}
              style={isSelected ? { borderLeftColor: primaryColor, borderLeftWidth: '4px' } : {}}
            >
              
              {/* Highlight badge for active properties */}
              {isSelected && (
                <span className="absolute top-4 right-4 bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded text-[9px] font-mono font-bold animate-pulse">
                  ĐANG QUÁT
                </span>
              )}

              {/* Card top */}
              <div className="space-y-3">
                <div className="flex items-start space-x-2.5">
                  <div className="p-2 rounded bg-slate-900 border border-slate-700">
                    <Building2 size={18} style={{ color: p.id === activeProperty.id ? primaryColor : '#94a3b8' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-tight text-white leading-tight font-sans">
                      {p.name}
                    </h3>
                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 font-medium mt-1">
                      <MapPin size={12} className="text-slate-500" />
                      <span>{p.location}</span>
                    </div>
                  </div>
                </div>

                {/* Rating details & code info */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-900/60 rounded-lg border border-slate-750 text-[11px] font-mono">
                  <div>
                    <span className="block text-slate-500 text-[9px] uppercase font-bold leading-normal">Xếp Hạng Đánh Giá</span>
                    <span className="text-yellow-400 font-bold flex items-center space-x-1 mt-0.5">
                      <Star size={10} className="fill-yellow-400" />
                      <span>{p.rating} ({p.reviews} reviews)</span>
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-[9px] uppercase font-bold leading-normal">Trung bình Market</span>
                    <span className="text-slate-300 font-bold mt-0.5 block font-sans">
                      {p.currentPrice.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>

                {/* OTA accounts details indicators */}
                <div className="flex items-center space-x-4 pt-1 text-[11px]">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-400 font-mono">Agoda Connection</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-400 font-mono">Booking Sync</span>
                  </div>
                </div>
              </div>

              {/* Action commands */}
              <div className="flex items-center space-x-2 mt-5 pt-4 border-t border-slate-700/40">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPropertyChange(p);
                    onViewChange('market-radar');
                  }}
                  className={`flex-1 py-1.5 rounded text-[11px] font-bold transition flex items-center justify-center space-x-1 ${
                    isSelected 
                      ? 'bg-slate-750 hover:bg-slate-700 text-white border border-slate-700' 
                      : 'bg-slate-900 hover:bg-slate-950 text-slate-300'
                  }`}
                >
                  <Eye size={12} />
                  <span>XEM DASHBOARD</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPropertyChange(p);
                    onViewChange('admin');
                  }}
                  className="px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-950 border border-slate-750 text-slate-400 hover:text-slate-200 transition"
                >
                  <Settings size={12} />
                </button>
              </div>

            </div>
          );
        })}

        {/* Add property placeholder block dashed */}
        <div 
          onClick={() => setShowAddForm(true)}
          className="border-2 border-dashed border-slate-700 hover:border-slate-500 hover:bg-slate-800/20 bg-slate-900/10 rounded-xl p-8 flex flex-col items-center justify-center space-y-3 cursor-pointer transition-all h-full min-h-[220px]"
        >
          <div className="p-3 rounded-full bg-slate-850 text-slate-500 border border-slate-850">
            <Plus size={24} />
          </div>
          <div className="text-center">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">TẠO KHÁCH SẠN QUẢN LÝ MỚI</h4>
            <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] leading-relaxed">
              Thêm tài nguyên để cấu hình Compset theo dõi giá đối thủ trực quan.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
