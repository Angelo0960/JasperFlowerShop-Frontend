import { useState, useEffect } from 'react';

const ExportButton = ({ activePeriod, salesData = [], onMonthChange, selectedMonth }) => {
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [localSelectedMonth, setLocalSelectedMonth] = useState(selectedMonth || new Date().getMonth() + 1);

  
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  
  useEffect(() => {
    if (selectedMonth !== undefined) {
      setLocalSelectedMonth(selectedMonth);
    }
  }, [selectedMonth]);

  const handleMonthChange = (e) => {
    const month = parseInt(e.target.value);
    setLocalSelectedMonth(month);
    if (onMonthChange) {
      onMonthChange(month);
    }
  };

  const exportToCSV = () => {
    if (!salesData || salesData.length === 0) {
      alert('No sales data available to export');
      return;
    }

    try {
      
      let headers = [];
      if (salesData.length > 0) {
        
        headers = Object.keys(salesData[0]);
        
        
        if (headers.length === 0 && typeof salesData[0] === 'object') {
          
          headers = [
            'sale_code', 'sale_date', 'sale_time', 'customer_name', 
            'staff_name', 'items_count', 'total_amount', 'payment_method', 
            'order_id', 'status'
          ];
        }
      }
      
      if (headers.length === 0) {
        headers = ['Date', 'Customer', 'Items', 'Amount', 'Payment Method'];
      }

      
      const csvRows = [
        
        headers.join(','),
        
        ...salesData.map(row => {
          return headers.map(header => {
            let value = '';
            
            if (row[header] !== undefined) {
              value = row[header];
            } else if (row[header.toLowerCase()] !== undefined) {
              value = row[header.toLowerCase()];
            } else if (header === 'Date' && (row.sale_date || row.formatted_date)) {
              value = row.sale_date || row.formatted_date;
            } else if (header === 'Customer' && row.customer_name) {
              value = row.customer_name;
            } else if (header === 'Items' && (row.items_count || row.items)) {
              value = row.items_count || row.items;
            } else if (header === 'Amount' && (row.total_amount || row.amount)) {
              value = row.total_amount || row.amount;
            } else if (header === 'Payment Method' && row.payment_method) {
              value = row.payment_method;
            }
            
            
            if (value === null || value === undefined) return '';
            const stringValue = String(value);
            
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          }).join(',')
        })
      ];
      
      const csvContent = csvRows.join('\n');
      const monthName = getMonthName(localSelectedMonth);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${monthName}_sales_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const handleExport = () => {
    if (exporting) return;
    
    setExporting(true);
    
    try {
      exportToCSV();
    } catch (error) {
      console.error('Error during export:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const getExportButtonText = () => {
    if (exporting) return 'Exporting...';
    return `Export Data (${exportFormat.toUpperCase()})`;
  };

  const getMonthName = (monthNumber) => {
    return months.find(m => m.value === monthNumber)?.label || 'Month';
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
      <div className="flex items-center gap-4">
        {}
        <div className="flex flex-col">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="bg-white border border-pink-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-pink-800"
            disabled={exporting}
          >
            <option value="csv">CSV (.csv)</option>
          </select>
          <div className="text-xs text-pink-600/70 mt-1 text-center">Format</div>
        </div>

        {}
        <div className="flex flex-col">
          <select
            value={localSelectedMonth}
            onChange={handleMonthChange}
            className="border border-pink-300 rounded-lg px-3 py-2 text-pink-800 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm w-48"
            disabled={exporting}
          >
            {months.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <div className="text-xs text-pink-600/70 mt-1 text-center">Month</div>
        </div>
      </div>

      {}
      <div>
        <button
          onClick={handleExport}
          disabled={exporting || salesData.length === 0}
          className={`flex items-center bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 justify-center ${
            exporting ? 'opacity-50 cursor-not-allowed' : 
            salesData.length === 0 ? 'opacity-50 cursor-not-allowed hover:from-pink-600 hover:to-pink-700' : 
            'hover:shadow-lg hover:scale-105'
          }`}
        >
          {exporting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Exporting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {getExportButtonText()}
            </>
          )}
        </button>
        <div className="text-xs text-pink-600/70 mt-1 text-center">
          Export {getMonthName(localSelectedMonth)} Sales
        </div>
      </div>
    </div>
  );
};

export default ExportButton;
