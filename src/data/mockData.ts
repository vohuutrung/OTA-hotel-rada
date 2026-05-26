import { Property, Hotel, Booking, Alert, GuestSegment, PricingRule, Event, Tenant, User } from '../types';

// Let's seed initial variables that represent our local storage or local state database:

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 1,
    name: "Sunset Bay Retreat Phú Quốc",
    location: "Phú Quốc",
    otaAgodaId: "agoda_pq_sbay",
    otaBookingId: "booking_pq_sbay",
    isActive: true,
    rating: 4.5,
    reviews: 120,
    currentPrice: 902467
  },
  {
    id: 2,
    name: "Elite Sofea Sài Gòn",
    location: "Hồ Chí Minh",
    otaAgodaId: "agoda_sg_elite",
    otaBookingId: "booking_sg_elite",
    isActive: false,
    rating: 4.7,
    reviews: 184,
    currentPrice: 1150000
  },
  {
    id: 3,
    name: "Mường Thanh Luxury Đà Nẵng",
    location: "Đà Nẵng",
    otaAgodaId: "agoda_dn_mt",
    otaBookingId: "booking_dn_mt",
    isActive: false,
    rating: 4.4,
    reviews: 310,
    currentPrice: 850000
  }
];

export const INITIAL_HOTELS: Record<number, Hotel[]> = {
  1: [ // Phú Quốc Compset
    { id: 101, name: "Sunset Bay Retreat Phú Quốc", isTarget: true, rating: 4.5, reviewCount: 120, locationScore: 4.2, address: "Dương Đông, Phú Quốc", price: 902467 },
    { id: 102, name: "Luna Sol Sunset & Firework Signature", isTarget: false, rating: 4.6, reviewCount: 82, locationScore: 4.5, address: "Sunset Town, Phú Quốc", price: 1079744 },
    { id: 103, name: "Novus Sol Hotel & Apartment", isTarget: false, rating: 4.8, reviewCount: 36, locationScore: 4.7, address: "Sunset Town, Phú Quốc", price: 835552 },
    { id: 104, name: "SOLÉA Hotels & Apartments Sunset Town", isTarget: false, rating: 4.5, reviewCount: 76, locationScore: 4.4, address: "Sunset Town, Phú Quốc", price: 889888 },
    { id: 105, name: "Capella Apartment Fireworks", isTarget: false, rating: 1.6, reviewCount: 14, locationScore: 3.2, address: "Bãi Trường, Phú Quốc", price: 691904 },
    { id: 106, name: "Lotus Home & Cafe", isTarget: false, rating: 4.6, reviewCount: 95, locationScore: 4.3, address: "Dương Đông, Phú Quốc", price: 1213120 },
    { id: 107, name: "Cybele Sunset Hotel Phú Quốc", isTarget: false, rating: 4.7, reviewCount: 58, locationScore: 4.6, address: "An Thới, Phú Quốc", price: 834624 },
    { id: 108, name: "Cá Chép Tea - Cake", isTarget: false, rating: 4.0, reviewCount: 41, locationScore: 3.9, address: "Dương Đông, Phú Quốc", price: 586176 },
    { id: 109, name: "De Stefano Hotel Coffee", isTarget: false, rating: 4.5, reviewCount: 67, locationScore: 4.1, address: "Sunset Town, Phú Quốc", price: 1209882 },
    { id: 110, name: "Tramonto Phu Quoc Hotel", isTarget: false, rating: 5.0, reviewCount: 29, locationScore: 4.8, address: "Bãi Kem, Phú Quốc", price: 983121 }
  ],
  2: [ // Sài Gòn Compset
    { id: 201, name: "Elite Sofea Sài Gòn", isTarget: true, rating: 4.7, reviewCount: 184, locationScore: 4.8, address: "Quận 1, TP. HCM", price: 1150000 },
    { id: 202, name: "Dimsum Dorms & Dinner", isTarget: false, rating: 2.0, reviewCount: 26, locationScore: 3.5, address: "Quận 3, TP. HCM", price: 745000 },
    { id: 203, name: "Khách Sạn Aluna Bến Thành", isTarget: false, rating: 4.4, reviewCount: 885, locationScore: 4.6, address: "Bến Thành, Quận 1", price: 780000 },
    { id: 204, name: "SAZI BEN THANH HOTEL", isTarget: false, rating: 4.0, reviewCount: 225, locationScore: 4.5, address: "Bến Thành, Quận 1", price: 680000 },
    { id: 205, name: "Nicecy Boutique Hotel", isTarget: false, rating: 3.7, reviewCount: 529, locationScore: 4.2, address: "Phú Nhuận, TP. HCM", price: 890000 }
  ],
  3: [ // Đà Nẵng Compset
    { id: 301, name: "Mường Thanh Luxury Đà Nẵng", isTarget: true, rating: 4.4, reviewCount: 310, locationScore: 4.5, address: "Võ Nguyên Giáp, Đà Nẵng", price: 850000 },
    { id: 302, name: "Grand Tourane Hotel", isTarget: false, rating: 4.6, reviewCount: 112, locationScore: 4.6, address: "Mỹ Khê, Đà Nẵng", price: 920000 },
    { id: 303, name: "Sala Danang Beach Hotel", isTarget: false, rating: 4.5, reviewCount: 440, locationScore: 4.5, address: "Mỹ Khê, Đà Nẵng", price: 810000 },
    { id: 304, name: "Danang Golden Bay", isTarget: false, rating: 4.3, reviewCount: 955, locationScore: 4.1, address: "Sơn Trà, Đà Nẵng", price: 1050000 }
  ]
};

// Seeding 30 days of dynamic price history values for Recharts
export const generatePriceTrendHistory = (propertyId: number) => {
  const compset = INITIAL_HOTELS[propertyId] || INITIAL_HOTELS[1];
  const target = compset.find(h => h.isTarget) || compset[0];
  const competitors = compset.filter(h => !h.isTarget);
  
  const dates = [
    "19/04", "20/04", "21/04", "22/04", "23/04", "24/04", "25/04", "26/04", "27/04", "28/04", "29/04"
  ];

  return dates.map((date, idx) => {
    // stable algorithm with sine noise
    const noise = Math.sin(idx * 0.7) * 40000;
    const marketAvgNoise = Math.cos(idx * 0.5) * 25000;

    const yourPrice = Math.round((target.price + noise) / 1000) * 1000;
    
    const sumComps = competitors.reduce((acc, c) => acc + c.price, 0);
    const avgCompetitorRaw = sumComps / competitors.length;
    const marketAvg = Math.round((avgCompetitorRaw + marketAvgNoise) / 1000) * 1000;
    const sweetSpot = Math.round(((marketAvg * 0.94) + Math.sin(idx * 0.4) * 15000) / 1000) * 1000;

    return {
      date,
      yourPrice,
      marketAvg,
      sweetSpot
    };
  });
};

export const INITIAL_BOOKINGS: Booking[] = [
  { id: 1, roomNumber: "201_Sea", roomType: "Sea View 🌊", guestName: "Nguyễn Anh Tuấn", checkinDate: "30", checkoutDate: "02", bookingSource: "DIRECT", price: 1359136, status: "CHECKIN" },
  { id: 2, roomNumber: "202_DeluxeCity", roomType: "Deluxe City 🏙️", guestName: "Phạm Minh Hoàng", checkinDate: "30", checkoutDate: "03", bookingSource: "OTA", price: 1361134, status: "CHECKIN" },
  { id: 3, roomNumber: "203_Sea_ICAL", roomType: "Sea View ICAL 📡", guestName: "Jessica Alba", checkinDate: "01", checkoutDate: "05", bookingSource: "CORP", price: 1280000, status: "STAYING" },
  { id: 4, roomNumber: "204_DeluxeCity_ICAL", roomType: "Deluxe City ICAL 📡", guestName: "Trần Thế Vinh", checkinDate: "02", checkoutDate: "04", bookingSource: "OTA", price: 945600, status: "CHECKOUT" },
  { id: 5, roomNumber: "205_Balcony", roomType: "Balcony Room 🏔️", guestName: "Michael Chang", checkinDate: "03", checkoutDate: "07", bookingSource: "GROUP", price: 1077000, status: "CONFIRMED" },
  { id: 6, roomNumber: "206_SeaPO", roomType: "Sea PO Panoramic 🌅", guestName: "Lê Quốc Khánh", checkinDate: "04", checkoutDate: "08", bookingSource: "COMP", price: 1427000, status: "CONFIRMED" },
  { id: 7, roomNumber: "207_Family", roomType: "Family Duplex 👨‍👩‍👧‍👦", guestName: "Nguyễn Thị Mai Chi", checkinDate: "05", checkoutDate: "09", bookingSource: "OTA", price: 1298000, status: "STAYING" },
  { id: 8, roomNumber: "208_Suite", roomType: "Executive Suite 👑", guestName: "Đoàn Nguyên Đức", checkinDate: "06", checkoutDate: "10", bookingSource: "DIRECT", price: 3200000, status: "CONFIRMED" }
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 1,
    type: "PRICE_LEAK",
    title: "CẢNH BÁO RÒ RỈ DOANH THU",
    message: "Ngày 29/04/2026, giá bán (761.479đ) đang rẻ hơn thị trường -24%. Hãy tăng giá ngay!",
    severity: "high",
    date: "29/04/2026",
    isRead: false
  },
  {
    id: 2,
    type: "COMPETITOR_SHIFT",
    title: "ĐỐI THỦ HẠ GIÁ KÍCH CẦU",
    message: "Khách Sạn Aluna Bến Thành đột ngột giảm giá -15% cho phòng Deluxe cuối tuần.",
    severity: "medium",
    date: "28/04/2026",
    isRead: false
  },
  {
    id: 3,
    type: "RATING_DROP",
    title: "ĐIỂM YẾU COMPSET",
    message: "Capella Apartment Fireworks bộc lộ rủi ro VỊ TRÍ, hãy tối ưu SOP để đón khách hàng từ tệp này.",
    severity: "low",
    date: "27/04/2026",
    isRead: true
  }
];

export const INITIAL_SEGMENTS: GuestSegment[] = [
  { id: 1, propertyId: 1, name: "Leisure / FIT", criteria: "Khách lẻ du lịch tự do", priceAdjustment: 0, isDefault: true },
  { id: 2, propertyId: 1, name: "Corporate Partner", criteria: "Khách doanh nghiệp liên kết", priceAdjustment: -10, isDefault: false },
  { id: 3, propertyId: 1, name: "Group Tour / Agent", criteria: "Đoàn lữ hành & Đại lý du lịch", priceAdjustment: -15, isDefault: false },
  { id: 4, propertyId: 1, name: "Last Minute Deals", criteria: "Đặt sát giờ bay (trong 24h)", priceAdjustment: 20, isDefault: false },
  { id: 5, propertyId: 1, name: "Early Bird Booker", criteria: "Đặt sớm hơn 30 ngày", priceAdjustment: -15, isDefault: false },
  { id: 6, propertyId: 1, name: "Member / VIP Guest", criteria: "Thành viên hạng Titan/Golden", priceAdjustment: -5, isDefault: false }
];

export const INITIAL_PRICING_RULES: PricingRule[] = [
  { id: 1, propertyId: 1, segmentId: 2, roomType: "Balcony Room 🏔️", dateStart: "2026-05-01", dateEnd: "2026-05-31", minPrice: 850000, maxPrice: 1500000, strategy: 'competitor_parity' },
  { id: 2, propertyId: 1, segmentId: 4, roomType: "Executive Suite 👑", dateStart: "2026-05-15", dateEnd: "2026-05-20", minPrice: 2500000, maxPrice: 4000000, strategy: 'dynamic' }
];

export const INITIAL_EVENTS: Event[] = [
  { id: 1, propertyId: 1, name: "Lễ Quốc Tế Lao Động 30/4 - 1/5", dateStart: "2026-04-29", dateEnd: "2026-05-02", type: "holiday", impactScore: 5, description: "Kỳ nghỉ lễ quốc gia dài ngày, nhu cầu Phú Quốc bùng nổ cực lớn" },
  { id: 2, propertyId: 1, name: "Phú Quốc Food Festival 2026", dateStart: "2026-05-10", dateEnd: "2026-05-12", type: "festival", impactScore: 3, description: "Lễ hội ẩm thực đường phố, thu hút tệp khách sành ăn" },
  { id: 3, propertyId: 1, name: "Low Season Depressed", dateStart: "2026-05-20", dateEnd: "2026-05-25", type: "local_event", impactScore: -3, description: "Mùa mưa trùng thấp điểm, lượng đón sụt giảm mạnh" }
];

export const INITIAL_TRAFFIC: Record<string, number | string>[] = [
  { name: "Apr 15", browserViews: 12000, compViews: 8500, reservations: 42, conversion: 0.18 },
  { name: "Apr 20", browserViews: 18000, compViews: 12000, reservations: 68, conversion: 0.22 },
  { name: "Apr 25", browserViews: 24000, compViews: 14000, reservations: 88, conversion: 0.25 },
  { name: "May 01", browserViews: 32000, compViews: 16000, reservations: 110, conversion: 0.29 },
  { name: "May 08", browserViews: 41000, compViews: 19000, reservations: 145, conversion: 0.32 },
  { name: "May 15", browserViews: 46108, compViews: 22000, reservations: 180, conversion: 0.36 }
];

export const WHITE_LABEL_INITIAL: Tenant = {
  id: 1,
  companyName: "REVPILOT MULTI-TENANT",
  slug: "revpilot-global",
  primaryColor: "#06b6d4", // Default RevPilot Cyan
  isActive: true,
  plan: "pro", // free / pro / enterprise
  maxProperties: 5,
  createdAt: "2026-01-10"
};

export const INITIAL_USER_ACCOUNTS = [
  { id: 1, email: "vohuutrungkn@gmail.com", fullName: "Võ Hữu Trung", role: "admin" },
  { id: 2, email: "manager@sunsettown.vn", fullName: "Trần Anh Khoa", role: "manager" },
  { id: 3, email: "reception@revpilot.com", fullName: "Lê Khánh Ly", role: "viewer" }
];

// Helper to calculate pricing and metrics dynamically
export const calculatePropertyMetrics = (propertyId: number, currentCompset: Hotel[]) => {
  const target = currentCompset.find(h => h.isTarget) || currentCompset[0];
  const competitors = currentCompset.filter(h => !h.isTarget);
  
  const targetPrice = target.price;
  const avgCompetitors = competitors.reduce((sum, comp) => sum + comp.price, 0) / (competitors.length || 1);
  const marketIndex = Math.round((targetPrice / (avgCompetitors || 1)) * 100);
  
  const priceGap = Math.round(((targetPrice - avgCompetitors) / (avgCompetitors || 1)) * 100);
  const ratingGap = parseFloat((target.rating - (competitors.reduce((sum, comp) => sum + comp.rating, 0) / (competitors.length || 1))).toFixed(1));

  return {
    marketIndex,
    priceGap,
    ratingGap,
    targetPrice,
    avgPrice: Math.round(avgCompetitors)
  };
};

export const AI_SUGGESTIONS_DUMMY = [
  { date: "15/05", roomType: "Deluxe Sea PP", oldPrice: 929000, newPrice: 994000, strategy: "[🧠 AI SMART]", description: "Công suất cao, bám sát Top 3 để tối ưu RevPAR, tăng doanh thu phòng Sea View." },
  { date: "15/05", roomType: "Deluxe PP", oldPrice: 753000, oldPriceFormatted: "753K", newPrice: 806000, strategy: "[🧠 AI SMART]", description: "Mức cầu cao dịp Festival Ẩm thực, tăng nhẹ biên lợi phòng tiêu chuẩn." },
  { date: "15/05", roomType: "Family PP", oldPrice: 1200000, newPrice: 1300000, strategy: "[🧠 AI SMART]", description: "Phòng gia đình đang khan hiếm cực độ trên Agoda/Booking. Nâng biên độ giá tối ưu." },
  { date: "15/05", roomType: "Suite PP", oldPrice: 3000000, newPrice: 3200000, strategy: "[🧠 AI SMART]", description: "Tệp khách ngoại quốc VIP chuộng Suite cao cấp. Market Index lý tưởng 112%." },
  { date: "16/05", roomType: "Deluxe Sea PP", oldPrice: 808000, newPrice: 784000, strategy: "[📉 KÍCH CẦU ÉP GIÁ]", description: "Công suất thấp, giá cao hơn so với thị trường. Giảm giá kích cầu khách hàng tự túc. [Auto-Catchup: Đã ép giảm thêm 5% vì giá dự kiến vẫn đắt hơn AVG Top 20]" }
];

export const HOVER_EVALUATIONS_DUMMY = {
  locationRating: 4.8,
  reviewsBreakdown: [
    { category: "🍹 Quầy Bar", positive: 130, negative: 4 },
    { category: "🍳 Món Ăn Sáng", positive: 106, negative: 4 },
    { category: "🛎️ Dịch Vụ Phục Vụ", positive: 106, negative: 13 },
    { category: "🛁 Cơ Sở Vật Chất", positive: 26, negative: 6 },
    { category: "🍽️ Nhà Hàng", positive: 8, negative: 0 },
    { category: "✨ Tình Trạng Vệ Sinh", positive: 14, negative: 2 }
  ]
};

// Simulated Agoda/Booking reviews category mapping
export const CUSTOMERS_REVIEWS = [
  { hotelId: 102, reviewCount: "518 đánh giá", text: "Khách khen đồ ăn ngon tuyệt vời, view Hoàng hôn nhìn rõ pháo hoa" },
  { hotelId: 103, reviewCount: "220 đánh giá", text: "Vị trí đắc địa, quầy lễ tân tận tình chu đáo nhưng hồ bơi hơi nhỏ" }
];
