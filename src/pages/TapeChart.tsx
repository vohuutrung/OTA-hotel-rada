import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Calendar, 
  TrendingUp, 
  UserCheck, 
  Inbox, 
  Award,
  CircleDot,
  CheckCircle,
  HelpCircle,
  DoorOpen,
  Filter
} from 'lucide-react';
import { Tenant, Property, Booking } from '../types';
import { INITIAL_BOOKINGS } from '../data/mockData';

interface TapeChartProps {
  tenant: Tenant;
  activeProperty: Property;
}

export default function TapeChart({ tenant, activeProperty }: TapeChartProps) {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [searchQuery, setSearchQuery] = useState("");
  const primaryColor = tenant.primaryColor;

  // Custom Gantt Day columns headers mapping (30, 31, 01, 02, 03, 04, 05, 06, 07, 08, 09)
  const columns = [
    { num: "30", label: "Mã 30/03", occ: 75, adr: 1350000 },
    { num: "31", label: "Mã 31/03", occ: 62, adr: 1290000 },
    { num: "01", label: "Mã 01/04", occ: 80, adr: 1420000 },
    { num: "02", label: "Mã 02/04", occ: 55, adr: 1120000 },
    { num: "03", label: "Mã 03/04", occ: 42, adr: 980000 },
    { num: "04", label: "Mã 04/04", occ: 65, adr: 1310000 },
    { num: "05", label: "Mã 05/04", occ: 85, adr: 1540000 },
    { num: "06", label: "Mã 06/04", occ: 50, adr: 1100000 },
    { num: "07", label: "Mã 07/04", occ: 40, adr: 890000 },
    { num: "08", label: "Mã 08/04", occ: 70, adr: 1380000 },
    { num: "09", label: "Mã 09/04", occ: 48, adr: 920000 }
  ];

  // Room listings rows mapping
  const roomRows = [
    { num: "201_Sea", type: "Sea Room" },
    { num: "202_DeluxeCity", type: "Deluxe City" },
    { num: "203_Sea_ICAL", type: "Sea ICAL" },
    { num: "204_DeluxeCity_ICAL", type: "Deluxe ICAL" },
    { num: "205_Balcony", type: "Balcony Room" },
    { num: "206_SeaPO", type: "Panoramic PO" },
    { num: "207_Family", type: "Family Duplex" },
    { num: "208_Suite", type: "Luxury Suite" }
  ];

  const handleBookingCreate = () => {
    // Adding dummy simulation booking to state
    const newB: Booking = {
      id: Date.now(),
      roomNumber: "205_Balcony",
      roomType: "Balcony Room 🏔️",
      guestName: "Trần Bảo Lâm",
      checkinDate: "03",
      checkoutDate: "06",
      bookingSource: "DIRECT",
      price: 1145000,
      status: "CHECKIN"
    };

    setBookings([newB, ...bookings]);
  };

  // Occupancy color thresholds strictly matching mockup
  // xanh lá if >70%, cam 50-70%, đỏ <50%
  const getOccupancyColor = (occ: number) => {
    if (occ >= 70) return 'text-[#22c55e]';
    if (occ >= 50) return 'text-[#f97316]';
    return 'text-[#ef4444]';
  };

  const getSourceBadgeStyle = (src: string) => {
    switch (src) {
      case 'DIRECT': return 'bg-blue-950 text-blue-300 border border-blue-900';
      case 'CORP': return 'bg-orange-950 text-orange-300 border border-orange-900';
      case 'OTA': return 'bg-cyan-950 text-cyan-300 border-cyan-800';
      default: return 'bg-purple-950 text-purple-300 border-purple-900';
    }
  };

  const getStatusColorBlock = (status: string) => {
    switch (status) {
      case 'CHECKIN': return 'bg-purple-600 border-l-[6px] border-purple-900 text-purple-50';
      case 'STAYING': return 'bg-orange-500 border-l-[6px] border-orange-850 text-orange-50';
      default: return 'bg-blue-500 border-r-[6px] border-blue-900 text-blue-50';
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="room-tape-chart-container" className="p-8 text-slate-50 space-y-6">
      
      {/* Search and control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/80 p-5 border border-slate-700 rounded-xl" id="tape-header-controls">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-700">
            <Calendar size={20} style={{ color: primaryColor }} />
          </div>
          <div>
            <h1 className="text-lg font-bold font-sans">ROOM TAPE CHART</h1>
            <div className="flex items-center space-x-3 mt-1 text-[11px] font-mono text-slate-400">
              <span className="flex items-center"><CircleDot size={10} className="mr-1 text-emerald-400" /> OCC: 55%</span>
              <span className="flex items-center"><CircleDot size={10} className="mr-1 text-cyan-400" /> ADR: 1.4M đ</span>
            </div>
          </div>
        </div>

        {/* Searching logic */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Tìm tên khách/Mã phòng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 text-slate-200 border border-slate-700 pl-8 pr-3 py-1.5 rounded text-xs w-48 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button 
            type="button"
            className="px-3.5 py-1.5 rounded bg-blue-900 hover:bg-blue-950 text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
          >
            <Filter size={12} />
            <span>GUEST LIST</span>
          </button>

          <button 
            type="button"
            onClick={handleBookingCreate}
            className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-xs font-bold transition flex items-center space-x-1.5 text-slate-950 cursor-pointer shadow"
            style={{ backgroundColor: primaryColor }}
          >
            <Plus size={14} className="text-slate-950" />
            <span>NEW BOOKING</span>
          </button>
        </div>
      </div>

      {/* TOP SUMMARY BAR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="tape-stats-banner">
        <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-750 flex items-center justify-between">
          <span className="text-slate-400 text-xs font-bold">ARRIVALS:</span>
          <span className="text-xs font-mono font-extrabold text-cyan-400">4 CHECKINS</span>
        </div>
        <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-750 flex items-center justify-between">
          <span className="text-slate-400 text-xs font-bold">CHECKED-IN / OUT:</span>
          <span className="text-xs font-mono font-extrabold text-purple-400">0 ACTIVE / 1</span>
        </div>
        <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-750 flex items-center justify-between">
          <span className="text-slate-400 text-xs font-bold">DOANH THU BIÊN ĐỘ:</span>
          <span className="text-xs font-mono font-extrabold text-[#22c55e]">10.277.886đ</span>
        </div>
        <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-750 flex items-center justify-between">
          <span className="text-slate-400 text-xs font-bold">THANH TOÁN ICAL:</span>
          <span className="text-xs font-mono font-extrabold text-yellow-400">475.857.835đ</span>
        </div>
      </div>

      {/* GANTT TIMELINE SCHEDULE CONTAINER GRID */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg" id="gantt-chart-table">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse select-none min-w-[900px]">
            {/* Headers row */}
            <thead>
              <tr className="bg-slate-900 font-mono text-[10px] uppercase font-bold text-slate-400 border-b border-slate-700">
                <th className="p-4 w-44 sticky left-0 bg-slate-900 z-10">Số Phòng</th>
                {columns.map((col, idx) => (
                  <th key={idx} className="p-3 text-center border-l border-slate-700/60 min-w-[70px]">
                    <span className="block text-slate-100 font-extrabold text-[11px]">{col.num}</span>
                    <span className={`block text-[8.5px] font-black mt-1 ${getOccupancyColor(col.occ)}`}>
                      {col.occ}% Occ
                    </span>
                    <span className="block text-[8.5px] text-slate-500 mt-0.5 mt-0.5">{(col.adr / 1000).toLocaleString()}k</span>
                  </th>
                ))}
              </tr>
            </thead>
            
            {/* Rows list of rooms and overlaid booking blocks */}
            <tbody className="divide-y divide-slate-800">
              {roomRows.map((room) => {
                return (
                  <tr key={room.num} className="hover:bg-slate-800/20 group">
                    {/* Room metadata columns */}
                    <td className="p-3.5 font-mono text-xs font-bold text-[#f8fafc] sticky left-0 bg-slate-800 border-r border-slate-700 z-10 group-hover:bg-slate-750/30 flex items-center space-x-2">
                      <DoorOpen size={12} className="text-slate-400" />
                      <span>{room.num}</span>
                    </td>

                    {/* Day blocks slots */}
                    {columns.map((col, colIdx) => {
                      
                      // Check if a filtered booking matches room and date range
                      const matchedB = filteredBookings.find(b => 
                        b.roomNumber === room.num &&
                        b.checkinDate === col.num
                      );

                      if (matchedB) {
                        // calculate span width based on checkout diff
                        const checkinVal = parseInt(matchedB.checkinDate);
                        const checkoutVal = parseInt(matchedB.checkoutDate);
                        const spanDays = checkoutVal > checkinVal ? (checkoutVal - checkinVal) : 1;

                        return (
                          <td 
                            key={colIdx} 
                            colSpan={spanDays} 
                            className="p-1 border-l border-slate-800 z-0 relative"
                          >
                            <div className={`p-2 rounded shadow-md text-[10.5px] transition-all flex justify-between items-center h-14 ${getStatusColorBlock(matchedB.status)}`}>
                              <div>
                                <span className="font-sans block font-extrabold truncate max-w-[100px] leading-tight">
                                  {matchedB.guestName}
                                </span>
                                <span className={`text-[8px] font-black leading-none uppercase mt-1 px-1 py-0.5 rounded ${getSourceBadgeStyle(matchedB.bookingSource)}`}>
                                  {matchedB.bookingSource}
                                </span>
                              </div>

                              <div className="text-right font-mono text-[9px] font-bold">
                                <span>{(matchedB.price / 1000).toLocaleString()}k</span>
                                <span className="block mt-1 text-[8.5px] underline cursor-pointer leading-none hover:text-white uppercase">
                                  edit
                                </span>
                              </div>
                            </div>
                          </td>
                        );
                      }

                      // Check if this cell is spanned by previous matched column element to avoid overlap
                      const isSpanned = filteredBookings.some(b => {
                        if (b.roomNumber !== room.num) return false;
                        const start = parseInt(b.checkinDate);
                        const end = parseInt(b.checkoutDate);
                        const current = parseInt(col.num);
                        return current > start && current < end;
                      });

                      if (isSpanned) return null; // let table span skip this day block slot

                      return (
                        <td 
                          key={colIdx} 
                          className="p-1 text-center border-l border-slate-800/80 h-16 min-h-[50px] transition-colors hover:bg-slate-900/40 relative group"
                        >
                          <button 
                            type="button"
                            onClick={handleBookingCreate}
                            className="absolute inset-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 text-[9.5px] font-bold text-slate-400 bg-slate-950/60 uppercase font-mono tracking-wider transition-opacity cursor-pointer border border-cyan-500/30"
                          >
                            + BOOK
                          </button>
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

    </div>
  );
}
