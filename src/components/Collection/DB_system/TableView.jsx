import React, { useState } from 'react';
import '../../../styles/components/tableView.css';
import { useTableFeatures } from './hooks';

/**
 * A generic table view component loosely modeled after Notion's list view.
 * Supports table and gallery layouts with search, sort, and filter.
 */
export const TableView = ({
    data,
    columns,
    onRowClick,
    title,
    views = [],
    activeView,
    onViewChange,
    onAddView,
    layout = 'table',
    onLayoutChange,
    renderGalleryItem
}) => {
    const {
        searchTerm,
        setSearchTerm,
        isSearchOpen,
        toggleSearch,
        sortConfig,
        handleSort,
        filters,
        setFilter,
        clearFilters,
        isFilterOpen,
        setIsFilterOpen,
        activeFilterColumn,
        setActiveFilterColumn,
        getUniqueValues,
        processedData,
        hasActiveFilters
    } = useTableFeatures(data, columns);

    const [showAddViewInput, setShowAddViewInput] = useState(false);
    const [newViewName, setNewViewName] = useState('');

    const handleAddView = () => {
        if (newViewName.trim() && onAddView) {
            onAddView(newViewName.trim());
            setNewViewName('');
            setShowAddViewInput(false);
        }
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey || sortConfig.direction === 'none') return null;
        return sortConfig.direction === 'asc' ? '▲' : '▼';
    };

    return (
        <div className="table-view-container">
            <div className="table-view-header-bar">
                {title && <h3 className="table-view-title">{title}</h3>}

                <div className="table-tool-bar">
                    {/* Filter Button */}
                    <div className="tool-dropdown-wrapper">
                        <button
                            className={`tool-btn ${isFilterOpen ? 'active' : ''}`}
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <span>Filter</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                            </svg>
                        </button>
                        {isFilterOpen && (
                            <div className="tool-dropdown filter-dropdown">
                                <div className="dropdown-header">Filter by Column</div>
                                {columns.map(col => (
                                    <div key={col.key} className="filter-column-item">
                                        <button
                                            className="filter-column-btn"
                                            onClick={() => setActiveFilterColumn(activeFilterColumn === col.key ? null : col.key)}
                                        >
                                            {col.label}
                                            {filters[col.key] && <span className="filter-badge">{filters[col.key].length}</span>}
                                        </button>
                                        {activeFilterColumn === col.key && (
                                            <div className="filter-values">
                                                {getUniqueValues(col.key).map(value => (
                                                    <label key={value} className="filter-value-item">
                                                        <input
                                                            type="checkbox"
                                                            checked={filters[col.key]?.includes(value) || false}
                                                            onChange={(e) => {
                                                                const current = filters[col.key] || [];
                                                                if (e.target.checked) {
                                                                    setFilter(col.key, [...current, value]);
                                                                } else {
                                                                    setFilter(col.key, current.filter(v => v !== value));
                                                                }
                                                            }}
                                                        />
                                                        <span>{value}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {hasActiveFilters && (
                                    <button className="clear-filters-btn" onClick={clearFilters}>
                                        Clear All Filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sort Button - Now shows in header, actual sort is on column click */}
                    <button className="tool-btn" title="Click column headers to sort">
                        <span>Sort</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <polyline points="19 12 12 19 5 12"></polyline>
                        </svg>
                    </button>

                    {/* Search Button */}
                    <button
                        className={`tool-btn icon-only ${isSearchOpen ? 'active' : ''}`}
                        onClick={toggleSearch}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </div>

                {/* Layout Switcher */}
                <div className="layout-switcher">
                    <button
                        className={`layout-btn ${layout === 'table' ? 'active' : ''}`}
                        title="Table View"
                        onClick={() => onLayoutChange && onLayoutChange('table')}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="8" y1="6" x2="21" y2="6"></line>
                            <line x1="8" y1="12" x2="21" y2="12"></line>
                            <line x1="8" y1="18" x2="21" y2="18"></line>
                            <line x1="3" y1="6" x2="3.01" y2="6"></line>
                            <line x1="3" y1="12" x2="3.01" y2="12"></line>
                            <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                    </button>
                    <button
                        className={`layout-btn ${layout === 'gallery' ? 'active' : ''}`}
                        title="Gallery View"
                        onClick={() => onLayoutChange && onLayoutChange('gallery')}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                    </button>
                    <button className="layout-btn" title="Kanban View" disabled style={{ opacity: 0.3 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="9" y1="3" x2="9" y2="21"></line>
                            <line x1="15" y1="3" x2="15" y2="21"></line>
                        </svg>
                    </button>
                </div>
            </div>

            {/* View Tabs */}
            {views.length > 0 && (
                <div className="table-view-tabs">
                    {views.map(view => (
                        <button
                            key={view}
                            className={`view-tab-btn ${activeView === view ? 'active' : ''}`}
                            onClick={() => onViewChange && onViewChange(view)}
                        >
                            {view}
                        </button>
                    ))}
                    {showAddViewInput ? (
                        <div className="add-view-input-wrapper">
                            <input
                                type="text"
                                value={newViewName}
                                onChange={(e) => setNewViewName(e.target.value)}
                                placeholder="New view name..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddView();
                                    if (e.key === 'Escape') setShowAddViewInput(false);
                                }}
                                autoFocus
                            />
                            <button onClick={handleAddView}>✓</button>
                            <button onClick={() => setShowAddViewInput(false)}>✕</button>
                        </div>
                    ) : (
                        <button
                            className="view-add-btn"
                            onClick={() => setShowAddViewInput(true)}
                        >
                            +
                        </button>
                    )}
                </div>
            )}

            {/* Search Bar */}
            {isSearchOpen && (
                <div className="search-bar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        autoFocus
                    />
                    {searchTerm && (
                        <button className="clear-search" onClick={() => setSearchTerm('')}>✕</button>
                    )}
                </div>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="active-filters-bar">
                    <span className="active-filters-label">Filters:</span>
                    {Object.entries(filters).map(([key, values]) => (
                        <span key={key} className="active-filter-tag">
                            {columns.find(c => c.key === key)?.label}: {values.join(', ')}
                            <button onClick={() => setFilter(key, [])}>✕</button>
                        </span>
                    ))}
                    {searchTerm && (
                        <span className="active-filter-tag">
                            Search: "{searchTerm}"
                            <button onClick={() => setSearchTerm('')}>✕</button>
                        </span>
                    )}
                    <button className="clear-all-btn" onClick={clearFilters}>Clear All</button>
                </div>
            )}

            {layout === 'gallery' ? (
                <div className="gallery-view-grid">
                    {processedData.map((row) => (
                        <div
                            key={row.id}
                            className="gallery-item-wrapper"
                            onClick={() => onRowClick && onRowClick(row)}
                        >
                            {renderGalleryItem ? renderGalleryItem(row) : (
                                <div className="default-gallery-card">
                                    <div className="card-title">{row.name || row.id}</div>
                                </div>
                            )}
                        </div>
                    ))}
                    {processedData.length === 0 && (
                        <div className="empty-state">No items found</div>
                    )}
                </div>
            ) : (
                <>
                    <div className="table-header">
                        {columns.map(col => (
                            <div
                                key={col.key}
                                className="table-cell header-cell sortable"
                                style={{ width: col.width || '1fr', flex: col.width ? 'none' : 1 }}
                                onClick={() => handleSort(col.key)}
                            >
                                {col.label}
                                <span className="sort-indicator">{getSortIcon(col.key)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="table-body">
                        {processedData.map((row) => (
                            <div
                                key={row.id}
                                className="table-row"
                                onClick={() => onRowClick && onRowClick(row)}
                            >
                                {columns.map(col => (
                                    <div
                                        key={`${row.id}-${col.key}`}
                                        className="table-cell"
                                        style={{ width: col.width || '1fr', flex: col.width ? 'none' : 1 }}
                                    >
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </div>
                                ))}
                            </div>
                        ))}
                        {processedData.length === 0 && (
                            <div className="table-row empty-row">
                                <div className="table-cell">No data available</div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
