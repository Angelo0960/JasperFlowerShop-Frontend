import SalesTab from "./SalesTab"

const SalesUI = () => {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Sales Dashboard</h1>
                <p className="text-gray-600">Track sales, generate reports, and analyze performance</p>
            </div>

            {/* Sales Tabs */}
            <SalesTab />
        </div>
    )
}

export default SalesUI