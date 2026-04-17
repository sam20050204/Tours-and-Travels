import React from 'react';

const GettingStarted = () => {
  return (
    <div className="getting-started" style={{
      padding: '40px',
      maxWidth: '900px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h1>🎯 Getting Started with Tours & Travels Management System</h1>
      
      <section style={{ marginTop: '30px' }}>
        <h2>📋 Table of Contents</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li><a href="#features">✅ Features</a></li>
          <li><a href="#setup">🔧 Setup Instructions</a></li>
          <li><a href="#workflow">📱 Workflow</a></li>
          <li><a href="#tips">💡 Tips & Tricks</a></li>
        </ul>
      </section>

      <section id="features" style={{ marginTop: '40px' }}>
        <h2>✅ Key Features</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f0f7ff', 
            borderRadius: '8px',
            borderLeft: '4px solid #667eea'
          }}>
            <h3>🚍 Bus Management</h3>
            <p>Store and manage all your bus details including owner info and contact</p>
          </div>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f0fff4', 
            borderRadius: '8px',
            borderLeft: '4px solid #48bb78'
          }}>
            <h3>📅 Tour Scheduling</h3>
            <p>Create and manage tours with specific routes and pricing</p>
          </div>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#fff5f0', 
            borderRadius: '8px',
            borderLeft: '4px solid #f56565'
          }}>
            <h3>👥 Passengers</h3>
            <p>Add complete passenger information with ID verification</p>
          </div>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#fef5e7', 
            borderRadius: '8px',
            borderLeft: '4px solid #f6ad55'
          }}>
            <h3>🪑 Seat Chart</h3>
            <p>Visual seating layout with real-time seat assignment</p>
          </div>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f3e8ff', 
            borderRadius: '8px',
            borderLeft: '4px solid #a78bfa'
          }}>
            <h3>💰 Payments</h3>
            <p>Track payments with detailed reports and history</p>
          </div>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#ecf0f1', 
            borderRadius: '8px',
            borderLeft: '4px solid #95a5a6'
          }}>
            <h3>📊 Reports</h3>
            <p>Generate and download detailed payment reports</p>
          </div>
        </div>
      </section>

      <section id="setup" style={{ marginTop: '40px' }}>
        <h2>🔧 Quick Setup</h2>
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h3>Prerequisites:</h3>
          <ul>
            <li>Node.js (v14+)</li>
            <li>MongoDB (local or Atlas)</li>
            <li>Git (optional)</li>
          </ul>

          <h3 style={{ marginTop: '20px' }}>Installation Steps:</h3>
          <ol style={{ lineHeight: '2' }}>
            <li><strong>Install Backend:</strong> <code style={{ 
              backgroundColor: '#e8e8e8', 
              padding: '2px 6px', 
              borderRadius: '3px'
            }}>npm install</code></li>
            <li><strong>Install Frontend:</strong> <code style={{ 
              backgroundColor: '#e8e8e8', 
              padding: '2px 6px', 
              borderRadius: '3px'
            }}>cd client && npm install && cd ..</code></li>
            <li><strong>Start MongoDB:</strong> <code style={{ 
              backgroundColor: '#e8e8e8', 
              padding: '2px 6px', 
              borderRadius: '3px'
            }}>mongod</code></li>
            <li><strong>Start Backend:</strong> <code style={{ 
              backgroundColor: '#e8e8e8', 
              padding: '2px 6px', 
              borderRadius: '3px'
            }}>npm start</code></li>
            <li><strong>Start Frontend:</strong> <code style={{ 
              backgroundColor: '#e8e8e8', 
              padding: '2px 6px', 
              borderRadius: '3px'
            }}>cd client && npm start</code></li>
          </ol>
        </div>
      </section>

      <section id="workflow" style={{ marginTop: '40px' }}>
        <h2>📱 Complete Workflow</h2>
        
        <div style={{ marginTop: '20px' }}>
          <h3>Step 1️⃣: Create Bus Profile</h3>
          <div style={{ 
            backgroundColor: '#f0f7ff', 
            padding: '15px', 
            borderRadius: '6px',
            marginTop: '10px'
          }}>
            <p>✦ Go to <strong>Bus Management</strong> tab</p>
            <p>✦ Click <strong>"Add New Bus"</strong></p>
            <p>✦ Fill in details: Number, Name, Type (2x1/2x2/3x2/2x3), Owner, Contact</p>
            <p>✦ Click <strong>"Save Bus"</strong></p>
            <p><em>💡 Bus profiles are saved for reuse in multiple tours</em></p>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>Step 2️⃣: Schedule a Tour</h3>
          <div style={{ 
            backgroundColor: '#f0fff4', 
            padding: '15px', 
            borderRadius: '6px',
            marginTop: '10px'
          }}>
            <p>✦ Go to <strong>Tour Schedule</strong> tab</p>
            <p>✦ Click <strong>"Create New Tour"</strong></p>
            <p>✦ Fill in: Tour Name, Start/End Dates, Select Bus, Locations, Price/Seat</p>
            <p>✦ Click <strong>"Create Tour"</strong></p>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>Step 3️⃣: Add Passengers</h3>
          <div style={{ 
            backgroundColor: '#fff5f0', 
            padding: '15px', 
            borderRadius: '6px',
            marginTop: '10px'
          }}>
            <p>✦ Go to <strong>Passengers</strong> tab</p>
            <p>✦ <strong>Select Tour</strong> from dropdown</p>
            <p>✦ Click <strong>"Add Passenger"</strong></p>
            <p>✦ Enter: Name, Email, Phone, Address, ID Type & Number, Age</p>
            <p>✦ Click <strong>"Add Passenger"</strong></p>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>Step 4️⃣: Assign Seats</h3>
          <div style={{ 
            backgroundColor: '#fef5e7', 
            padding: '15px', 
            borderRadius: '6px',
            marginTop: '10px'
          }}>
            <p>✦ In <strong>Passengers</strong> section, click <strong>"View Seat Chart"</strong></p>
            <p>✦ Interactive bus layout appears</p>
            <p>✦ Click any <span style={{ 
              display: 'inline-block',
              width: '20px',
              height: '20px',
              backgroundColor: '#c8e6c9',
              borderRadius: '3px',
              verticalAlign: 'middle',
              marginRight: '5px'
            }}></span> seat (green = available)</p>
            <p>✦ Select passenger from the list</p>
            <p>✦ Click <strong>"Assign to [Seat]"</strong></p>
            <p><em>✓ Seat turns red (occupied)</em></p>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>Step 5️⃣: Record Payments</h3>
          <div style={{ 
            backgroundColor: '#f3e8ff', 
            padding: '15px', 
            borderRadius: '6px',
            marginTop: '10px'
          }}>
            <p>✦ Go to <strong>Payments</strong> tab</p>
            <p>✦ <strong>Select Tour</strong></p>
            <p>✦ Click <strong>"Record Payment"</strong></p>
            <p>✦ Select Passenger, Enter Amount, Choose Payment Method</p>
            <p>✦ (Optional) Add Transaction ID and Notes</p>
            <p>✦ Click <strong>"Record Payment"</strong></p>
            <p><em>✓ Payment status auto-updates (Pending → Partial → Completed)</em></p>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>Step 6️⃣: View Reports</h3>
          <div style={{ 
            backgroundColor: '#ecf0f1', 
            padding: '15px', 
            borderRadius: '6px',
            marginTop: '10px'
          }}>
            <p>✦ In <strong>Payments</strong>, scroll to <strong>"Payment Summary"</strong></p>
            <p>✦ View collection stats, remaining amounts, payment percentages</p>
            <p>✦ Check <strong>"Payment History"</strong> for all transactions</p>
            <p>✦ Click <strong>"Download Payment Report"</strong> to export as CSV</p>
          </div>
        </div>
      </section>

      <section id="tips" style={{ marginTop: '40px' }}>
        <h2>💡 Helpful Tips</h2>
        <div style={{
          display: 'grid',
          gap: '15px',
          marginTop: '20px'
        }}>
          <div style={{
            padding: '15px',
            backgroundColor: '#e3f2fd',
            borderRadius: '6px',
            borderLeft: '4px solid #2196f3'
          }}>
            <p><strong>💾 Reuse Bus Profiles</strong></p>
            <p>Create bus profiles once and use them for multiple tours. This saves time and ensures consistency.</p>
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: '#e8f5e9',
            borderRadius: '6px',
            borderLeft: '4px solid #4caf50'
          }}>
            <p><strong>🪑 Seat Chart Colors</strong></p>
            <p>🟩 Green = Available | 🟥 Red = Occupied | 🟦 Blue = Selected. Click a green seat to select it before assigning.</p>
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: '#fff3e0',
            borderRadius: '6px',
            borderLeft: '4px solid #ff9800'
          }}>
            <p><strong>💰 Payment Status Tracking</strong></p>
            <p>Payments are auto-calculated. When total payment reaches tour price, status changes to "Completed".</p>
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: '#f3e5f5',
            borderRadius: '6px',
            borderLeft: '4px solid #9c27b0'
          }}>
            <p><strong>📊 Generate Reports</strong></p>
            <p>Always download reports before tour departure. CSV format can be opened in Excel or any spreadsheet app.</p>
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: '#fce4ec',
            borderRadius: '6px',
            borderLeft: '4px solid #e91e63'
          }}>
            <p><strong>🔄 Update Passenger Info</strong></p>
            <p>You can edit passenger details anytime. Just click "Edit" next to the passenger name in the list.</p>
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: '#eceff1',
            borderRadius: '6px',
            borderLeft: '4px solid #607d8b'
          }}>
            <p><strong>🚨 Special Requirements</strong></p>
            <p>Don't forget to add special requirements for passengers (wheelchair access, vegetarian meals, etc.).</p>
          </div>
        </div>
      </section>

      <section style={{ 
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h3>🎉 You're All Set!</h3>
        <p style={{ fontSize: '16px', marginTop: '10px' }}>
          Start by creating a bus profile in the <strong>Bus Management</strong> section.
        </p>
        <p style={{ color: '#666', marginTop: '10px' }}>
          For detailed documentation, check the <strong>README.md</strong> file
        </p>
      </section>
    </div>
  );
};

export default GettingStarted;
