import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export const Pattern2Table = ({ jsonData, onSave, searchQuery }) => {
    const [editedData, setEditedData] = useState(JSON.parse(JSON.stringify(jsonData)));

    useEffect(() => {
        setEditedData(JSON.parse(JSON.stringify(jsonData)));
    }, [jsonData]);

    const flattenJSON = (obj, prefix = '') => {
        let result = [];
        for (let key in obj) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            const value = obj[key];
            if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                result = result.concat(flattenJSON(value, fullKey));
            } else {
                result.push({
                    path: fullKey,
                    key: key,
                    value: value,
                    type: Array.isArray(value) ? 'array' : typeof value
                });
            }
        }
        return result;
    };

    const updateValue = (path, newValue) => {
        const keys = path.split('.');
        const newData = JSON.parse(JSON.stringify(editedData));
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        const lastKey = keys[keys.length - 1];

        if (typeof current[lastKey] === 'number') {
            current[lastKey] = parseFloat(newValue) || 0;
        } else if (typeof current[lastKey] === 'boolean') {
            current[lastKey] = newValue === 'true';
        } else {
            current[lastKey] = newValue;
        }
        setEditedData(newData);
    };

    const flatData = flattenJSON(editedData);
    const filteredData = searchQuery
        ? flatData.filter(item =>
            item.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
            String(item.value).toLowerCase().includes(searchQuery.toLowerCase())
        )
        : flatData;

    return (
        <div className="table-editor">
            <div className="textarea-header">
                <div className="flex items-center gap-sm">
                    <h3 className="editor-title" style={{ color: '#333' }}>テーブルエディター</h3>
                    {searchQuery && (
                        <span style={{ color: '#666', fontSize: '12px' }}>
                            {filteredData.length} / {flatData.length} 件表示
                        </span>
                    )}
                </div>
                <button onClick={() => onSave(editedData)} className="save-btn">
                    <Save size={16} /> 保存
                </button>
            </div>

            <div className="table-container">
                <table className="editor-table">
                    <thead>
                        <tr>
                            <th>パス</th>
                            <th>キー</th>
                            <th>値</th>
                            <th>型</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={index}>
                                <td className="path-cell">{item.path}</td>
                                <td style={{ fontWeight: 'bold' }}>{item.key}</td>
                                <td>
                                    {item.type === 'array' ? (
                                        <textarea
                                            value={JSON.stringify(item.value, null, 2)}
                                            onChange={(e) => {
                                                try {
                                                    const parsed = JSON.parse(e.target.value);
                                                    updateValue(item.path, parsed);
                                                } catch (e) { }
                                            }}
                                            className="value-input"
                                            rows="3"
                                            style={{ fontFamily: 'monospace', fontSize: '11px' }}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={item.value}
                                            onChange={(e) => updateValue(item.path, e.target.value)}
                                            className="value-input"
                                        />
                                    )}
                                </td>
                                <td style={{ fontSize: '11px', color: '#888' }}>{item.type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
