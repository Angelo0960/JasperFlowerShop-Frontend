const OrderCards = () => {
    return (
            <div className="grid grid-cols-3 gap-5 justify-center">
<div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg ">

  <div className="p-4">
    <h6 className="mb-2 text-slate-800 text-xl font-semibold">
      Total Revenue
    </h6>
    <p className="text-slate-600 leading-normal font-light">

    </p> 
    <h6>
        Today
    </h6> 
  
  </div>
  
</div>    
<div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg ">

  <div className="p-4">
    <h6 className="mb-2 text-slate-800 text-xl font-semibold">
      Total Orders
    </h6>
    <p className="text-slate-600 leading-normal font-light">

    </p>
    <h6>
        Today
    </h6>
  </div>
  
</div>    
<div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg ">

  <div className="p-4">
    <h6 className="mb-2 text-slate-800 text-xl font-semibold">
      Items Sold
    </h6>
    <p className="text-slate-600 leading-normal font-light">

    </p>
    <h6>
        Today
    </h6>
  </div>
  
</div>
</div>
    );
};

export default OrderCards;