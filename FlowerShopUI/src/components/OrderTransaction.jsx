
import OrderCatalog from './OrderCatalog.jsx';

const OrderTransaction = () => {
    return (
        <div className="p-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Order</h1>
                <p className="text-gray-600">Browse products and add them to cart</p>
            </div>
            
            <div className="mb-6">
   
            </div>
            
            <OrderCatalog />
        </div>
    )
}

export default OrderTransaction;