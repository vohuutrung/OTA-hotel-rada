import React, { useState } from 'react';
import { 
  CreditCard, 
  AlertTriangle, 
  HelpCircle, 
  Check, 
  MessageSquare,
  Sparkles,
  Award
} from 'lucide-react';
import { Tenant } from '../types';

interface SubscriptionPageProps {
  tenant: Tenant;
}

export default function SubscriptionPage({ tenant }: SubscriptionPageProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<number>(1);
  const primaryColor = tenant.primaryColor;

  const subscriptionPlans = [
    {
      id: 1,
      tokens: "2 Tokens / Tháng (Thấp điểm)",
      desc: "USD 10/month (plus taxes)",
      notes: "USD 5/token nạp thêm sau hạn mức",
      tier: "LITE PILOT"
    },
    {
      id: 2,
      tokens: "15 Tokens / Tháng (Doanh nghiệp)",
      desc: "USD 45/month (plus taxes)",
      notes: "USD 3/token nạp thêm sau hạn mức",
      tier: "PRO BUSINESS"
    },
    {
      id: 3,
      tokens: "50 Tokens / Tháng (Tập đoàn)",
      desc: "USD 125/month (plus taxes)",
      notes: "USD 2.5/token nạp thêm sau hạn mục",
      tier: "ENTERPRISE MAX"
    }
  ];

  return (
    <div id="subscription-view-container" className="p-8 text-slate-50 space-y-6 relative min-h-screen pb-24">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-sans tracking-tight">CHOOSE YOUR SUBSCRIPTION PLAN</h1>
        <p className="text-xs font-mono text-slate-400 mt-1 uppercase" style={{ color: primaryColor }}>
          Lựa Chọn Định Mức Token Quét Lượt (Phase 9 Mobile Subscription Specs)
        </p>
      </div>

      {/* Warning missing payment card */}
      <div id="missing-billing-warning" className="p-4 bg-red-950/40 border border-red-500 rounded-xl flex items-start space-x-3 text-red-200">
        <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5 animate-pulse" />
        <div className="text-xs space-y-1">
          <h4 className="font-extrabold uppercase tracking-wide">⚠️ Payment method missing</h4>
          <p className="text-[11px] text-slate-300 leading-normal pl-0.5">
            Không tìm thấy phương thức thanh toán hợp lệ trong hệ thống. Hãy cập nhật thông tại trang <strong>Billing Settings</strong> để duy trì hạn mức quét tự động không bị gián đoạn.
          </p>
        </div>
      </div>

      {/* Grid listing plans cards stack */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="billing-plans-grid">
        {subscriptionPlans.map((plan) => {
          const isSelected = plan.id === selectedPlanId;
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`bg-slate-850 p-6 rounded-2xl border transition-all duration-300 relative cursor-pointer hover:translate-y-[-2px] hover:border-slate-500 flex flex-col justify-between h-72 ${
                isSelected 
                  ? 'border-pink-500 shadow-lg shadow-pink-900/10' 
                  : 'border-slate-800'
              }`}
            >
              
              {/* Selected Bullet icon */}
              <div className="absolute top-5 right-5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                  isSelected ? 'border-pink-500 bg-pink-500/20' : 'border-slate-600'
                }`}>
                  {isSelected && <span className="w-2.5 h-2.5 bg-pink-500 rounded-full" />}
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-[#94a3b8] block">
                  {plan.tier}
                </span>

                <h3 className="text-sm font-bold text-white font-sans mt-1">
                  {plan.tokens}
                </h3>
              </div>

              {/* pricing */}
              <div className="mt-8 border-t border-slate-850 pt-5 space-y-3">
                <div className="text-xs leading-normal">
                  <span className="block text-slate-100 font-extrabold font-mono">• {plan.desc}</span>
                  <span className="block text-slate-400 mt-1 font-mono">• {plan.notes}</span>
                </div>
                <span className="text-[10.5px] italic text-slate-500 font-sans block pl-0.5">
                  *Thêm thuế giá trị gia tăng gia hạn theo chu kỳ
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {/* FLOATING FAB CHAT BUTTON bottom-right with cyan/primaryColor styling */}
      <button 
        id="fab-cyan-chat-button"
        onClick={() => alert("Hỗ trợ trợ lý RevPilot trực tuyến. Bạn có thể gửi câu hỏi qua email: support@revpilotlabs.com")}
        className="fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition hover:scale-105 active:scale-95 cursor-pointer z-50 flex items-center justify-center border border-slate-950/25"
        style={{ backgroundColor: primaryColor }}
        title="Liên Hệ Hỗ Trợ 24/7"
      >
        <MessageSquare size={22} className="text-slate-900 fill-slate-900" />
      </button>

    </div>
  );
}
