
import React from 'react';



export const JsonEditor = ({ value, onChange }) => {
    return (
        <div className="ag-json-editor">
            <div className="ag-json-header">
                <span>Order List (JSON)</span>
                <span style={{ color: '#facc15' }}>Validated</span>
            </div>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                spellCheck={false}
                className="ag-json-textarea"
            />
        </div>
    );
};
