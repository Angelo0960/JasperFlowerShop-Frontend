const OrderCards = () => {
    return (
        <div className="grid grid-cols-3 gap-5 justify-center">
            {/* Card 1 - Total Revenue */}
            <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg">
                <div className="p-4 flex flex-col h-full">
                    <h6 className="mb-2 text-slate-800 text-xl font-semibold">
                        Total Revenue
                    </h6>
                    <p className="text-slate-600 leading-normal font-light text-sm mb-4">
                        Revenue generated from all orders
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                        <div>
                            <h6 className="text-slate-800 font-bold text-lg">
                                ₱0.00
                            </h6>
                            <span className="text-slate-500 text-sm">
                                Today
                            </span>
                        </div>
                        <button className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg text-sm font-medium transition-colors border border-pink-200 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            View
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Card 2 - Total Orders */}
            <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg">
                <div className="p-4 flex flex-col h-full">
                    <h6 className="mb-2 text-slate-800 text-xl font-semibold">
                        Total Orders
                    </h6>
                    <p className="text-slate-600 leading-normal font-light text-sm mb-4">
                        Number of orders placed
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                        <div>
                            <h6 className="text-slate-800 font-bold text-lg">
                                0
                            </h6>
                            <span className="text-slate-500 text-sm">
                                Today
                            </span>
                        </div>
                        <button className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg text-sm font-medium transition-colors border border-pink-200 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            View
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Card 3 - Items Sold */}
            <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg">
                <div className="p-4 flex flex-col h-full">
                    <h6 className="mb-2 text-slate-800 text-xl font-semibold">
                        Items Sold
                    </h6>
                    <p className="text-slate-600 leading-normal font-light text-sm mb-4">
                        Total products sold
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                        <div>
                            <h6 className="text-slate-800 font-bold text-lg">
                                0
                            </h6>
                            <span className="text-slate-500 text-sm">
                                Today
                            </span>
                        </div>
                        <button className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg text-sm font-medium transition-colors border border-pink-200 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderCards;