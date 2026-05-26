import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// View pages
import PropertiesPage from './pages/PropertiesPage';
import MarketRadar from './pages/MarketRadar';
import CompetitorGrid from './pages/CompetitorGrid';
import Simulation from './pages/Simulation';
import CalendarPage from './pages/CalendarPage';
import SegmentsPage from './pages/SegmentsPage';
import TapeChart from './pages/TapeChart';
import TrafficTrend from './pages/TrafficTrend';
import ReportsPage from './pages/ReportsPage';
import AdminPage from './pages/AdminPage';
import SubscriptionPage from './pages/SubscriptionPage';

import { Property, Hotel, Alert, Tenant } from './types';
import { 
  INITIAL_PROPERTIES, 
  INITIAL_HOTELS, 
  INITIAL_ALERTS, 
  WHITE_LABEL_INITIAL 
} from './data/mockData';

export default function App() {
  const [activeProperty, setActiveProperty] = useState<Property>(INITIAL_PROPERTIES[0]);
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [compsetHotels, setCompsetHotels] = useState<Hotel[]>(INITIAL_HOTELS[1]);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [tenant, setTenant] = useState<Tenant>(WHITE_LABEL_INITIAL);
  const [activeView, setActiveView] = useState<string>('market-radar');

  // Multi-property loading effects
  useEffect(() => {
    // Dynamically retrieve associated competitors dataset for the active property
    const compset = INITIAL_HOTELS[activeProperty.id] || INITIAL_HOTELS[1];
    setCompsetHotels(compset);
  }, [activeProperty]);

  const handleMarkAlertRead = (id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const handlePropertyChange = (prop: Property) => {
    setActiveProperty(prop);
  };

  const handleAddProperty = (name: string, location: string, agoda: string, booking: string) => {
    const newProp: Property = {
      id: Date.now(),
      name,
      location,
      otaAgodaId: agoda || undefined,
      otaBookingId: booking || undefined,
      isActive: false,
      rating: 4.5,
      reviews: 40,
      currentPrice: 850000
    };

    setProperties(prev => [...prev, newProp]);
    setActiveProperty(newProp);
  };

  // White-Label configuration updating
  const handleUpdateTenant = (updated: Tenant) => {
    setTenant(updated);
  };

  // Handler for successful OTA pricing crawl simulation
  const handleCrawlerSuccess = (crawledPrice: number, scrapedHotelName: string, otaSelected: string) => {
    // 1. Update target pricing of the active property
    setActiveProperty(prev => ({
      ...prev,
      currentPrice: crawledPrice
    }));

    setProperties(prev => prev.map(p => p.id === activeProperty.id ? { ...p, currentPrice: crawledPrice } : p));

    // 2. Also inject the price value to Target Hotel inside competitor mapping
    setCompsetHotels(prev => prev.map(hotel => {
      if (hotel.isTarget) {
        return {
          ...hotel,
          price: crawledPrice
        };
      }
      return hotel;
    }));

    // 3. Inject new high alert letting know details are fetched successfully
    const newAlert: Alert = {
      id: Date.now(),
      type: "LIVE_CRAWL",
      title: "QUÉT GIÁ REALTIME THÀNH CÔNG",
      message: `Quét thành công bằng Playwright giá trị phòng mới nhất: ${crawledPrice.toLocaleString('vi-VN')} đ tại khách sạn "${scrapedHotelName}" kênh ${otaSelected.toUpperCase()}.`,
      severity: "medium",
      date: "Hôm nay",
      isRead: false
    };

    setAlerts(prev => [newAlert, ...prev]);
  };

  return (
    <div id="fullstack-app-layout" className="flex min-h-screen bg-slate-950 text-slate-50 font-sans">
      
      {/* Dynamic Brand Sidebar */}
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
        tenant={tenant}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Dynamic header and fast command triggers */}
        <Header 
          properties={properties}
          activeProperty={activeProperty}
          onPropertyChange={handlePropertyChange}
          onViewChange={setActiveView}
          tenant={tenant}
          onCrawlerSuccess={handleCrawlerSuccess}
        />

        {/* Dynamic Pages Views mapping */}
        <main className="flex-1 overflow-y-auto">
          {activeView === 'properties' && (
            <PropertiesPage 
              properties={properties}
              activeProperty={activeProperty}
              onPropertyChange={handlePropertyChange}
              onAddProperty={handleAddProperty}
              onViewChange={setActiveView}
              tenant={tenant}
            />
          )}

          {activeView === 'market-radar' && (
            <MarketRadar 
              activeProperty={activeProperty}
              compsetHotels={compsetHotels}
              alerts={alerts}
              onMarkAlertRead={handleMarkAlertRead}
              tenant={tenant}
            />
          )}

          {activeView === 'competitor-grid' && (
            <CompetitorGrid 
              compsetHotels={compsetHotels}
              activeProperty={activeProperty}
              tenant={tenant}
            />
          )}

          {activeView === 'ai-pricing' && (
            <Simulation 
              tenant={tenant}
              activeProperty={activeProperty}
            />
          )}

          {activeView === 'calendar' && (
            <CalendarPage 
              tenant={tenant}
              activeProperty={activeProperty}
            />
          )}

          {activeView === 'segments' && (
            <SegmentsPage 
              tenant={tenant}
              activeProperty={activeProperty}
            />
          )}

          {activeView === 'tape-chart' && (
            <TapeChart 
              tenant={tenant}
              activeProperty={activeProperty}
            />
          )}

          {activeView === 'traffic' && (
            <TrafficTrend 
              tenant={tenant}
              activeProperty={activeProperty}
            />
          )}

          {activeView === 'reports' && (
            <ReportsPage 
              tenant={tenant}
              activeProperty={activeProperty}
            />
          )}

          {activeView === 'admin' && (
            <AdminPage 
              tenant={tenant}
              onUpdateTenant={handleUpdateTenant}
            />
          )}

          {activeView === 'subscription' && (
            <SubscriptionPage 
              tenant={tenant}
            />
          )}
        </main>

      </div>

    </div>
  );
}
