import { useState, useMemo, useCallback } from 'react';

/**
 * Custom hook for managing table features: search, sort, and filter.
 * 
 * @param {Array} data - The raw data array
 * @param {Array} columns - Column definitions with 'key' property
 * @returns {Object} State and handlers for table features
 */
export const useTableFeatures = (data, columns = []) => {
    // Search state
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Sort state
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });

    // Filter state
    const [filters, setFilters] = useState({});
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilterColumn, setActiveFilterColumn] = useState(null);

    // Toggle search visibility
    const toggleSearch = useCallback(() => {
        setIsSearchOpen(prev => !prev);
        if (isSearchOpen) {
            setSearchTerm('');
        }
    }, [isSearchOpen]);

    // Handle sort
    const handleSort = useCallback((columnKey) => {
        setSortConfig(prev => {
            if (prev.key === columnKey) {
                // Cycle: none -> asc -> desc -> none
                const directions = ['none', 'asc', 'desc'];
                const currentIndex = directions.indexOf(prev.direction);
                const nextIndex = (currentIndex + 1) % 3;
                return { key: columnKey, direction: directions[nextIndex] };
            }
            return { key: columnKey, direction: 'asc' };
        });
    }, []);

    // Handle filter
    const setFilter = useCallback((columnKey, values) => {
        setFilters(prev => {
            if (!values || values.length === 0) {
                const { [columnKey]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [columnKey]: values };
        });
    }, []);

    // Clear all filters
    const clearFilters = useCallback(() => {
        setFilters({});
        setSearchTerm('');
        setSortConfig({ key: null, direction: 'none' });
    }, []);

    // Get unique values for a column (for filter dropdown)
    const getUniqueValues = useCallback((columnKey) => {
        const values = new Set();
        data.forEach(row => {
            const value = row[columnKey];
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach(v => values.add(String(v)));
                } else {
                    values.add(String(value));
                }
            }
        });
        return Array.from(values).sort();
    }, [data]);

    // Process data with search, filter, and sort
    const processedData = useMemo(() => {
        let result = [...data];

        // Apply search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(row => {
                return columns.some(col => {
                    const value = row[col.key];
                    if (value === null || value === undefined) return false;
                    if (Array.isArray(value)) {
                        return value.some(v => String(v).toLowerCase().includes(term));
                    }
                    return String(value).toLowerCase().includes(term);
                });
            });
        }

        // Apply filters
        Object.entries(filters).forEach(([key, values]) => {
            if (values && values.length > 0) {
                result = result.filter(row => {
                    const rowValue = row[key];
                    if (Array.isArray(rowValue)) {
                        return rowValue.some(v => values.includes(String(v)));
                    }
                    return values.includes(String(rowValue));
                });
            }
        });

        // Apply sort
        if (sortConfig.key && sortConfig.direction !== 'none') {
            result.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];

                if (aVal === bVal) return 0;
                if (aVal === null || aVal === undefined) return 1;
                if (bVal === null || bVal === undefined) return -1;

                const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
                return sortConfig.direction === 'asc' ? comparison : -comparison;
            });
        }

        return result;
    }, [data, searchTerm, filters, sortConfig, columns]);

    return {
        // Search
        searchTerm,
        setSearchTerm,
        isSearchOpen,
        toggleSearch,

        // Sort
        sortConfig,
        handleSort,

        // Filter
        filters,
        setFilter,
        clearFilters,
        isFilterOpen,
        setIsFilterOpen,
        activeFilterColumn,
        setActiveFilterColumn,
        getUniqueValues,

        // Processed data
        processedData,
        hasActiveFilters: Object.keys(filters).length > 0 || searchTerm.length > 0
    };
};
