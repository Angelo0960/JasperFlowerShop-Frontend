import SalesUi from './components/SalesUi.jsx'
import OrdersUi from './components/OrdersUI.jsx'
import Tabs from './components/Tab.jsx'
import ProductManagement from './components/ProductManagement.jsx' // Add this import
import './App.css'
import { useState } from 'react'

// Placeholder icons (Replaced with SVG icons for Cart and Statistics)
// SVG for Shopping Cart (Used for Order Management)
const OrderIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
);

// SVG for Bar Chart/Statistics (Used for Sales Dashboard)
const DashboardIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <line x1="12" y1="20" x2="12" y2="10"></line>
        <line x1="18" y1="20" x2="18" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="16"></line>
        <line x1="3" y1="20" x2="21" y2="20"></line>
    </svg>
);

// Product Icon - Using a package icon
const ProductIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
        <line x1="7" y1="7" x2="7.01" y2="7"></line>
    </svg>
);

const InitialTab = "orders";


function App() {
  
  // State is managed in App.jsx to control the content area
  const [activeSideNav, setActiveSideNav] = useState(InitialTab);

  // Define the structure for the Side Navigation and its corresponding content
  const navConfiguration = [
    {
      key: "orders",
      label: "Order Management",
      icon: OrderIcon, // <-- Now uses Cart SVG
      content: <OrdersUi /> 
    },
    {
      key: "sales",
      label: "Sales Dashboard",
      icon: DashboardIcon, // <-- Now uses Statistics SVG
      content: <SalesUi /> 
    },
    {
      key: "products",
      label: "Product Management",
      icon: ProductIcon,
      content: <ProductManagement /> // Updated to use the new component
    }
  ];

  // Find the content component to render based on the active state
  const ActiveContentComponent = navConfiguration.find(nav => nav.key === activeSideNav)?.content;

  return (
    // Main container for the layout: flex to place the nav and content side-by-side
    <div className="flex h-screen bg-[#fdfbf7]">
      
      {/* 1. SIDE NAVIGATION (Left Column) */}
      <Tabs
        initialActiveTab={activeSideNav}
        tabs={navConfiguration}
        // Handler to update the state when a nav link is clicked
        onTabChange={setActiveSideNav} 
      />
      
      {/* 2. MAIN CONTENT AREA (Right Column) */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        
        {/* Placeholder for the header matching the image: Shop name, POS tabs, Admin */}
        <header className="mb-5 p-6 pb-2 bg-pink-50 -m-8 border-b border-b-pink-800/20 items-center sticky -top-10 z-10">
             <h1 className="text-4xl font-rallomy text-pink-800/45 ">Sir Jasper's Flower Shop</h1>
             <p className="text-lg font-serif text-pink-800/45">Flower Management System</p>
             
        </header>

        {/* Render the Active Content (which will contain the OrdersUi/SalesUi components) */}
        {ActiveContentComponent}
        
      </main>

    </div>
  )
}

export default App