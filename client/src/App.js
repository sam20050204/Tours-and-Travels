import React, { useState } from 'react';
import './App.css';
import BusManagement from './components/BusManagement';
import TourManagement from './components/TourManagement';
import PassengerManagement from './components/PassengerManagement';
import PaymentManagement from './components/PaymentManagement';

function App() {
  const [activeTab, setActiveTab] = useState('tour');

  const renderContent = () => {
    switch(activeTab) {
      case 'bus':
        return <BusManagement />;
      case 'tour':
        return <TourManagement />;
      case 'passenger':
        return <PassengerManagement />;
      case 'payment':
        return <PaymentManagement />;
      default:
        return <TourManagement />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚌 Tours & Travels Management System</h1>
        <p>Manage your tours, buses, passengers, and payments efficiently</p>
      </header>

      <nav className="navbar">
        <button 
          className={`nav-link ${activeTab === 'bus' ? 'active' : ''}`}
          onClick={() => setActiveTab('bus')}
        >
          🚍 Bus Management
        </button>
        <button 
          className={`nav-link ${activeTab === 'tour' ? 'active' : ''}`}
          onClick={() => setActiveTab('tour')}
        >
          📅 Tour Schedule
        </button>
        <button 
          className={`nav-link ${activeTab === 'passenger' ? 'active' : ''}`}
          onClick={() => setActiveTab('passenger')}
        >
          👥 Passengers
        </button>
        <button 
          className={`nav-link ${activeTab === 'payment' ? 'active' : ''}`}
          onClick={() => setActiveTab('payment')}
        >
          💰 Payments
        </button>
      </nav>

      <main className="main-content">
        {renderContent()}
      </main>

      <footer className="App-footer">
        <p>&copy; 2026 Tours & Travels Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
