import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Eye, 
  FileText, 
  CheckCircle, 
  Percent, 
  Clock,
  HelpCircle
} from 'lucide-react';
import { Tenant, Property } from '../types';
import { INITIAL_TRAFFIC } from '../data/mockData';

interface TrafficTrendProps {
  tenant: Tenant;
  activeProperty: Property;
}

export default function TrafficTrend({ tenant, activeProperty }: TrafficTrendProps) {
  const primaryColor = tenant.primaryColor;

  return (
    <div id="traffic-trends-container" className="p-8 text-slate-50 space-y-6">
      
      {/* Header section with last update timestamp badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight">📈 TRAFFIC TRENDS</h1>
          <p className="text-sm text-slate-400 mt-1 pl-0.5 font-sans leading-none">
            Phân tích lưu lượng tìm kiếm và tỉ lệ chuyển đổi kênh OTA so sánh với ComSet dồn toa
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[10.5px] font-mono text-slate-400 flex items-center space-x-1.5 shadow-inner">
          <Clock size={12} className="text-cyan-400" />
          <span>Last updated at 06:04, May 15, 2026 UTC</span>
        </div>
      </div>

      {/* 4 Metric cards matching mockup specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="traffic-metric-cards">
        
        {/* Search result views */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg relative flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide font-sans">Search result views</span>
            <div className="p-1.5 rounded bg-slate-900 border border-slate-700 text-cyan-400">
              <Eye size={14} />
            </div>
          </div>
          <div className="my-4">
            <h3 className="text-2xl font-black font-sans text-white">46,108</h3>
          </div>
          <div className="border-t border-slate-700/50 pt-2.5 flex justify-between items-center text-[10.5px] font-mono">
            <span className="text-slate-500">Competitive set:</span>
            <span className="text-emerald-400 font-bold">+862.00% (4,792)</span>
          </div>
        </div>

        {/* Property page views */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg relative flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide font-sans">Property page views</span>
            <div className="p-1.5 rounded bg-slate-900 border border-slate-700 text-purple-400">
              <FileText size={14} />
            </div>
          </div>
          <div className="my-4">
            <h3 className="text-2xl font-black font-sans text-white">14,181</h3>
          </div>
          <div className="border-t border-slate-700/50 pt-2.5 flex justify-between items-center text-[10.5px] font-mono">
            <span className="text-slate-500">Competitive set:</span>
            <span className="text-emerald-400 font-bold">+1,257% (1,045)</span>
          </div>
        </div>

        {/* Reservations */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg relative flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide font-sans">Reservations</span>
            <div className="p-1.5 rounded bg-slate-900 border border-slate-700 text-emerald-400">
              <CheckCircle size={14} />
            </div>
          </div>
          <div className="my-4">
            <h3 className="text-2xl font-black font-sans text-white">92</h3>
          </div>
          <div className="border-t border-slate-700/50 pt-2.5 flex justify-between items-center text-[10.5px] font-mono">
            <span className="text-slate-500">Competitive set:</span>
            <span className="text-emerald-400 font-bold">+1,123% (7.52)</span>
          </div>
        </div>

        {/* Gross conversion rate */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg relative flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide font-sans">Gross conversion rate</span>
            <div className="p-1.5 rounded bg-slate-900 border border-slate-700 text-yellow-400">
              <Percent size={14} />
            </div>
          </div>
          <div className="my-4">
            <h3 className="text-2xl font-black font-sans text-white">0.20%</h3>
          </div>
          <div className="border-t border-slate-700/50 pt-2.5 flex justify-between items-center text-[10.5px] font-mono">
            <span className="text-slate-500">Competitive set:</span>
            <span className="text-emerald-400 font-bold">+420% (0.04%)</span>
          </div>
        </div>

      </div>

      {/* Grouped Bar Chart comparing your property vs compset */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              BIỂU ĐỒ ĐỐI CHIẾU LƯỢT TIẾP CẬN TRÊN AGODA / BOOKING
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Biểu đồ so sánh lượng lướt xem thực tế của bạn vs Compset trung bình</p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="flex items-center">
              <span className="w-2.5 h-2.5 rounded mr-1.5" style={{ backgroundColor: primaryColor }} />
              Khách sạn của bạn
            </span>
            <span className="flex items-center">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded mr-1.5" />
              Trung bình Compset
            </span>
          </div>
        </div>

        {/* Recharts Bar Component */}
        <div className="h-80 w-full" id="traffic-trends-bar-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={INITIAL_TRAFFIC} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis 
                dataKey="name" 
                stroke="#475569" 
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} 
              />
              <YAxis 
                stroke="#475569" 
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                itemStyle={{ fontSize: 11 }}
              />
              <Legend verticalAlign="none" />
              <Bar name="Your Page Views" dataKey="browserViews" fill={primaryColor} radius={[4, 4, 0, 0]} />
              <Bar name="Competitors AVG" dataKey="compViews" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}
