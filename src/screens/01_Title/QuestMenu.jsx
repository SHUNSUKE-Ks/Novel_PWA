import React, { useState } from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import eventsDataJson from '../../assets/data/events.json';

export const QuestMenu = ({ onClose }) => {
    const { episodes, startEvent } = useGameStore();
    const [activeTab, setActiveTab] = useState('event'); // Default to 'event' as per user interest in Quest 03

    // Tab Styles
    const tabStyle = (id) => ({
        padding: '10px 20px',
        cursor: 'pointer',
        borderBottom: activeTab === id ? '2px solid #fff' : '2px solid transparent',
        color: activeTab === id ? '#fff' : '#888',
        fontWeight: activeTab === id ? 'bold' : 'normal',
        transition: 'all 0.3s'
    });

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            color: '#fff',
            fontFamily: 'sans-serif'
        }}>
            {/* Header */}
            <div style={{
                padding: '20px',
                borderBottom: '1px solid #333',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h2 style={{ margin: 0 }}>クエスト選択</h2>
                <button
                    onClick={onClose}
                    style={{
                        background: 'transparent',
                        border: '1px solid #666',
                        color: '#fff',
                        padding: '5px 15px',
                        cursor: 'pointer',
                        borderRadius: '4px'
                    }}
                >
                    閉じる
                </button>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                padding: '0 20px',
                background: '#111',
                borderBottom: '1px solid #333'
            }}>
                <div onClick={() => setActiveTab('main')} style={tabStyle('main')}>メインストーリー</div>
                <div onClick={() => setActiveTab('event')} style={tabStyle('event')}>イベントクエスト</div>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>

                {/* Main Story List */}
                {activeTab === 'main' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(50, 50, 60, 0.9)' }}>
                                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #333' }}>イベント</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #333' }}>場所</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #333' }}>Episode</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #333' }}>Chapter</th>
                                <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #333' }}>アクション</th>
                            </tr>
                        </thead>
                        <tbody>
                            {episodes?.flatMap(ep =>
                                ep.chapters.flatMap(ch =>
                                    ch.events.map(event => {
                                        const loc = (episodes?.[0]?.locations || []).find(l => l.id === event.location);
                                        return (
                                            <tr key={event.id} style={{ borderBottom: '1px solid #222' }}>
                                                <td style={{ padding: '0.75rem' }}>
                                                    <div style={{ fontWeight: 'bold' }}>{event.title}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{event.description}</div>
                                                </td>
                                                <td style={{ padding: '0.75rem' }}>
                                                    {loc && <span style={{ color: loc.color }}>📍 {loc.label}</span>}
                                                </td>
                                                <td style={{ padding: '0.75rem', color: '#aaa' }}>{ep.title}</td>
                                                <td style={{ padding: '0.75rem', color: '#aaa' }}>{ch.title}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                    <button
                                                        onClick={() => startEvent(event.id, event.startStoryID)}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            background: '#ffd700',
                                                            color: '#000',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >読む</button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )
                            )}
                        </tbody>
                    </table>
                )}

                {/* Event Quest List */}
                {activeTab === 'event' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                        {eventsDataJson.events.map(event => {
                            const eventType = eventsDataJson.types?.find(t => t.id === event.type);
                            const loc = (episodes?.[0]?.locations || []).find(l => l.id === event.location);
                            return (
                                <div key={event.id} style={{
                                    background: 'rgba(40, 40, 50, 0.9)',
                                    borderRadius: '12px',
                                    border: `1px solid ${eventType?.color || '#333'}44`,
                                    padding: '1rem',
                                    borderLeft: `4px solid ${eventType?.color || '#333'}`
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '2px 8px',
                                            background: `${eventType?.color || '#333'}22`,
                                            border: `1px solid ${eventType?.color || '#333'}`,
                                            borderRadius: '4px',
                                            color: eventType?.color || '#888'
                                        }}>{eventType?.label || event.type}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#888' }}>
                                            難易度: {'★'.repeat(event.difficulty)}{'☆'.repeat(3 - event.difficulty)}
                                        </span>
                                    </div>
                                    <h3 style={{ margin: '0.5rem 0', color: '#fff' }}>{event.title}</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '0.75rem' }}>{event.description}</p>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                        {loc && (
                                            <span style={{
                                                fontSize: '0.7rem',
                                                padding: '2px 6px',
                                                background: `${loc.color}22`,
                                                border: `1px solid ${loc.color}`,
                                                borderRadius: '4px',
                                                color: loc.color
                                            }}>📍 {loc.label}</span>
                                        )}
                                        <span style={{
                                            fontSize: '0.7rem',
                                            padding: '2px 6px',
                                            background: 'rgba(59, 130, 246, 0.2)',
                                            border: '1px solid #3b82f6',
                                            borderRadius: '4px',
                                            color: '#93c5fd'
                                        }}>{event.episode} / {event.chapter}</span>
                                    </div>
                                    <div style={{
                                        padding: '0.5rem',
                                        background: 'rgba(34, 197, 94, 0.1)',
                                        borderRadius: '6px',
                                        fontSize: '0.8rem',
                                        color: '#22c55e'
                                    }}>
                                        💰 報酬: {event.reward}
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (event.startStoryID) {
                                                startEvent(event.id, event.startStoryID);
                                            } else {
                                                alert("このイベントは現在プレイできません");
                                            }
                                        }}
                                        style={{
                                            marginTop: '0.75rem',
                                            width: '100%',
                                            padding: '0.5rem',
                                            background: event.startStoryID ? '#ffd700' : '#444',
                                            color: event.startStoryID ? '#000' : '#888',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontWeight: 'bold',
                                            cursor: event.startStoryID ? 'pointer' : 'not-allowed'
                                        }}
                                    >
                                        {event.startStoryID ? 'イベントを開始' : '準備中'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
