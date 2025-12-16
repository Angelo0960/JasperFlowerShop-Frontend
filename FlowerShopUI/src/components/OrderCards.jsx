const OrderCards = () => {
    return (
        <div className="grid grid-cols-3 gap-6">
            {/* Card 1 - Total Revenue */}
            <div className="relative flex flex-col bg-white shadow-md border border-slate-200 rounded-xl overflow-hidden h-full">
                <div className="p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h6 className="text-slate-800 text-lg font-semibold mb-1">
                                Total Revenue
                            </h6>
                            <p className="text-slate-500 text-sm">
                                Today
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    
                    <div className="mb-5">
                        <div className="text-2xl font-bold text-slate-800 mb-1">
                            ₱0.00
                        </div>
                        <p className="text-slate-500 text-xs">
                            Revenue generated from all orders
                        </p>
                    </div>
                    
                    <div className="mt-auto">
                        <button className="w-full py-2.5 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg text-sm font-medium transition-colors border border-pink-200 flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            View Details
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Card 2 - Total Orders */}
            <div className="relative flex flex-col bg-white shadow-md border border-slate-200 rounded-xl overflow-hidden h-full">
                <div className="p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h6 className="text-slate-800 text-lg font-semibold mb-1">
                                Total Orders
                            </h6>
                            <p className="text-slate-500 text-sm">
                                Today
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>
                    
                    <div className="mb-5">
                        <div className="text-2xl font-bold text-slate-800 mb-1">
                            0
                        </div>
                        <p className="text-slate-500 text-xs">
                            Number of orders placed
                        </p>
                    </div>
                    
                    <div className="mt-auto">
                        <button className="w-full py-2.5 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg text-sm font-medium transition-colors border border-pink-200 flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            View Details
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Card 3 - Items Sold */}
            <div className="relative flex flex-col bg-white shadow-md border border-slate-200 rounded-xl overflow-hidden h-full">
                <div className="p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h6 className="text-slate-800 text-lg font-semibold mb-1">
                                Items Sold
                            </h6>
                            <p className="text-slate-500 text-sm">
                                Today
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                    </div>
                    
                    <div className="mb-5">
                        <div className="text-2xl font-bold text-slate-800 mb-1">
                            0
                        </div>
                        <p className="text-slate-500 text-xs">
                            Total products sold
                        </p>
                    </div>
                    
                    <div className="mt-auto">
                        <button className="w-full py-2.5 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg text-sm font-medium transition-colors border border-pink-200 flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderCards;