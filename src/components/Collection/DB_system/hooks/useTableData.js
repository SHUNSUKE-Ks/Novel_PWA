import { useState } from 'react';

/**
 * Custom hook for managing table data state including filtering and layout.
 * Reusable across different database views.
 * 
 * @param {Array} data - The full data array
 * @param {Object} options - Configuration options
 * @param {string} options.defaultView - Default view filter (e.g., 'All')
 * @param {string} options.defaultLayout - Default layout ('table' or 'gallery')
 * @param {string} options.filterKey - The key to filter data by (e.g., 'category')
 * @returns {Object} State and handlers for table data management
 */
export const useTableData = (data, options = {}) => {
    const {
        defaultView = 'All',
        defaultLayout = 'table',
        filterKey = 'category'
    } = options;

    const [activeView, setActiveView] = useState(defaultView);
    const [layout, setLayout] = useState(defaultLayout);

    const getFilteredData = () => {
        if (activeView === 'All') return data;
        return data.filter(item => item[filterKey] === activeView);
    };

    return {
        activeView,
        setActiveView,
        layout,
        setLayout,
        filteredData: getFilteredData(),
        getFilteredData
    };
};
