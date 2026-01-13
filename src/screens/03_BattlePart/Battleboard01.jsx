import React, { useState, useEffect, useRef } from 'react';
import '../../styles/screens/battleBoard01.css';
import { resolveEnemyUrl } from '../../utils/assetUtils';

// --- MOCK DATA ---
const INITIAL_party = [
    { id: 'remi', name: 'レミ', hp: 100, maxHp: 100, mp: 50, maxMp: 50, spd: 10 },
    { id: 'latelle', name: 'ラテル', hp: 150, maxHp: 150, mp: 20, maxMp: 20, spd: 8 }
];

const INITIAL_ENEMIES = [
    { id: 'wolf1', name: 'シャドウウルフ', hp: 85, maxHp: 85, image: 'Monster_01.png', atk: 20 }
];

const MAGIC_LIST = [
    { id: 'fire', name: 'ファイア', mp: 5, power: 30, type: 'magic' },
    { id: 'heal', name: 'ヒール', mp: 8, power: -50, type: 'heal' }
];

const ITEM_LIST = [
    { id: 'potion', name: '薬草', count: 3, power: -30, type: 'heal' },
    { id: 'bomb', name: '火炎瓶', count: 1, power: 40, type: 'item' }
];

export const Battleboard01 = ({ onBattleEnd }) => {
    // --- State ---
    const [party, setParty] = useState(INITIAL_party);
    const [enemies, setEnemies] = useState(INITIAL_ENEMIES);
    const [activeCharIndex, setActiveCharIndex] = useState(0);

    // Phases: 'COMMAND' | 'MAGIC_SELECT' | 'ITEM_SELECT' | 'TARGET_SELECT' | 'ANIMATION' | 'ENEMY_TURN' | 'RESULT'
    const [phase, setPhase] = useState('COMMAND');
    const [selectedAction, setSelectedAction] = useState(null);
    const [message, setMessage] = useState("シャドウウルフ が あらわれた！");
    const [battleLog, setBattleLog] = useState([]);

    // --- REFS for Logic Safety (Prevent Stale Closures) ---
    const enemiesRef = useRef(enemies);
    const partyRef = useRef(party);
    const phaseRef = useRef(phase);

    // Sync Refs
    useEffect(() => { enemiesRef.current = enemies; }, [enemies]);
    useEffect(() => { partyRef.current = party; }, [party]);
    useEffect(() => { phaseRef.current = phase; }, [phase]);

    // Derived Display Data
    const activeChar = party[activeCharIndex];
    // We don't rely purely on this for logic to avoid loop issues

    // --- Helpers ---
    const log = (msg) => {
        setMessage(msg);
        setBattleLog(prev => [...prev, msg]);
        console.log("BattleLog:", msg);
    };

    // --- Player Inputs ---
    const handleAttackCommand = () => {
        setSelectedAction({ type: 'ATTACK' });
        setPhase('TARGET_SELECT');
        log("こうげき の ターゲットをえらんでください");
    };

    const handleMagicCommand = () => {
        setPhase('MAGIC_SELECT');
        log("じゅもん を えらんでください");
    };

    const handleItemCommand = () => {
        setPhase('ITEM_SELECT');
        log("どうぐ を えらんでください");
    };

    const handleSelectMagic = (magic) => {
        if (activeChar.mp < magic.mp) {
            log("MPが たりない！");
            return;
        }
        setSelectedAction({ type: 'MAGIC', data: magic });
        if (magic.type === 'heal') {
            executeAction(null, magic);
        } else {
            setPhase('TARGET_SELECT');
            log(`${magic.name} の ターゲットをえらんでください`);
        }
    };

    const handleSelectItem = (item) => {
        if (item.count <= 0) return;
        setSelectedAction({ type: 'ITEM', data: item });
        if (item.type === 'heal') {
            executeAction(null, item);
        } else {
            setPhase('TARGET_SELECT');
            log(`${item.name} の ターゲットをえらんでください`);
        }
    };

    // --- Core Interaction Logic ---
    const executeAction = (targetEnemyIndex, actionData = null) => {
        const data = actionData || selectedAction?.data;

        setPhase('ANIMATION');

        setTimeout(() => {
            // Use REFS to get latest state inside Timeout
            let currentEnemies = [...enemiesRef.current];
            let currentParty = [...partyRef.current];
            const target = targetEnemyIndex !== null ? currentEnemies[targetEnemyIndex] : null;

            // ATTACK
            if (selectedAction?.type === 'ATTACK') {
                const damage = Math.floor(Math.random() * 20) + 15;
                log(`${currentParty[activeCharIndex].name} の こうげき！ ${target.name} に ${damage} のダメージ！`);
                if (target) target.hp = Math.max(0, target.hp - damage);
                setEnemies([...currentEnemies]);
            }
            // MAGIC
            else if (selectedAction?.type === 'MAGIC') {
                const caster = currentParty[activeCharIndex];
                caster.mp -= data.mp;
                setParty([...currentParty]);

                if (data.type === 'heal') {
                    const healAmount = Math.abs(data.power);
                    log(`${caster.name} は ${data.name} をとなえた！ HPが ${healAmount} かいふくした！`);
                    caster.hp = Math.min(caster.maxHp, caster.hp + healAmount);
                    setParty([...currentParty]);
                } else {
                    const damage = data.power;
                    log(`${caster.name} は ${data.name} をとなえた！ ${target.name} に ${damage} のダメージ！`);
                    if (target) target.hp = Math.max(0, target.hp - damage);
                    setEnemies([...currentEnemies]);
                }
            }
            // ITEM
            else if (selectedAction?.type === 'ITEM') {
                const user = currentParty[activeCharIndex];
                if (data.type === 'heal') {
                    const healAmount = Math.abs(data.power);
                    log(`${user.name} は ${data.name} をつかった！ HPが ${healAmount} かいふくした！`);
                    user.hp = Math.min(user.maxHp, user.hp + healAmount);
                    setParty([...currentParty]);
                } else {
                    const damage = data.power;
                    log(`${user.name} は ${data.name} をなげつけた！ ${target.name} に ${damage} のダメージ！`);
                    if (target) target.hp = Math.max(0, target.hp - damage);
                    setEnemies([...currentEnemies]);
                }
            }

            // Post Turn Check
            setTimeout(() => {
                checkWinConditionOrNextTurn();
            }, 1000);

        }, 500);
    };

    const checkWinConditionOrNextTurn = () => {
        // Safe check using Ref
        const allEnemiesDead = enemiesRef.current.every(e => e.hp <= 0);

        if (allEnemiesDead) {
            setPhase('RESULT');
            log("敵をたおした！ 勝利！");
            return;
        }

        const allPartyDead = partyRef.current.every(p => p.hp <= 0);
        if (allPartyDead) {
            log("全滅した...");
            return;
        }

        nextTurn();
    };

    // Auto-Exit Logic
    useEffect(() => {
        if (phase === 'RESULT') {
            const timer = setTimeout(() => {
                // Return to Novel Part
                if (onBattleEnd) onBattleEnd();
            }, 3000); // 3 sec wait to read results
            return () => clearTimeout(timer);
        }
    }, [phase, onBattleEnd]);

    const nextTurn = () => {
        // Double check phase to prevent loops
        if (phaseRef.current === 'RESULT') return;

        if (activeCharIndex < party.length - 1) {
            setActiveCharIndex(prev => prev + 1);
            setPhase('COMMAND');
        } else {
            setPhase('ENEMY_TURN');
            setTimeout(enemyTurn, 1000);
        }
    };

    const enemyTurn = () => {
        // Check refs again to be safe
        const livingEnemies = enemiesRef.current.filter(e => e.hp > 0);
        if (livingEnemies.length === 0 || phaseRef.current === 'RESULT') {
            return;
        }

        const attacker = livingEnemies[0];
        const targetIndex = Math.floor(Math.random() * partyRef.current.length);
        const damage = Math.floor(Math.random() * 10) + 10;
        const targetName = partyRef.current[targetIndex].name;

        log(`${attacker.name} の こうげき！ ${targetName} に ${damage} のダメージ！`);

        let currentParty = [...partyRef.current];
        currentParty[targetIndex].hp = Math.max(0, currentParty[targetIndex].hp - damage);
        setParty([...currentParty]);

        setTimeout(() => {
            setActiveCharIndex(0);
            setPhase('COMMAND');
            setMessage("コマンド？");
        }, 1500);
    };

    // --- RENDER ---
    return (
        <div className="battle-board-01">
            {/* 1. Enemy Area */}
            <div className="battle-enemy-area">
                {enemies.map((e, idx) => (
                    e.hp > 0 && (
                        <div
                            key={e.id}
                            style={{ textAlign: 'center', cursor: phase === 'TARGET_SELECT' ? 'crosshair' : 'default' }}
                            onClick={() => phase === 'TARGET_SELECT' && executeAction(idx)}
                        >
                            <img
                                src={resolveEnemyUrl(e.image)}
                                alt={e.name}
                                className={`enemy-sprite ${phase === 'TARGET_SELECT' ? 'target-pulse' : ''}`}
                            />
                            <div style={{ marginTop: '10px', color: '#ffaaaa' }}>{e.name}</div>
                        </div>
                    )
                ))}
            </div>

            {/* 2. Message Window */}
            <div className="battle-message-window">
                <div style={{ whiteSpace: 'pre-line' }}>
                    {phase === 'RESULT' ? (
                        <>
                            <div style={{ color: '#ffff00' }}>WIN!</div>
                            {message}
                            <div>獲得経験値: 50 EXP</div>
                            <div>獲得ゴールド: 100 G</div>
                        </>
                    ) : message}
                </div>
            </div>

            {/* 3. Bottom UI */}
            <div className="battle-bottom-ui">

                {/* 3a. Status */}
                <div className="battle-status-window">
                    <div className="status-row status-header">
                        <span>NAME</span>
                        <span>HP</span>
                        <span>MP</span>
                    </div>
                    {party.map((p, idx) => (
                        <div key={p.id} className={`status-row ${idx === activeCharIndex ? 'active-char' : ''}`}>
                            <span>{p.name}</span>
                            <span>{p.hp}/{p.maxHp}</span>
                            <span>{p.mp}/{p.maxMp}</span>
                        </div>
                    ))}
                </div>

                {/* 3b. Command */}
                <div className="battle-command-window">
                    {(phase === 'COMMAND' || phase === 'TARGET_SELECT') && (
                        <>
                            <div style={{ marginBottom: '5px', color: '#aaa' }}>{activeChar.name}の行動</div>
                            <button className="command-btn" onClick={handleAttackCommand}>たたかう</button>
                            <button className="command-btn" onClick={handleMagicCommand}>じゅもん</button>
                            <button className="command-btn" onClick={handleItemCommand}>どうぐ</button>
                            <button className="command-btn" onClick={() => log("逃げられない！")}>にげる</button>
                            {phase === 'TARGET_SELECT' && <div style={{ fontSize: '0.8rem', color: '#ff0' }}>※対象を選択してください</div>}
                        </>
                    )}

                    {phase === 'MAGIC_SELECT' && (
                        <>
                            <button className="command-btn back-btn" onClick={() => setPhase('COMMAND')}>戻る</button>
                            {MAGIC_LIST.map(m => (
                                <button key={m.id} className="command-btn" onClick={() => handleSelectMagic(m)}>
                                    {m.name} <span style={{ fontSize: '0.8em', color: '#aaa' }}>{m.mp}MP</span>
                                </button>
                            ))}
                        </>
                    )}

                    {phase === 'ITEM_SELECT' && (
                        <>
                            <button className="command-btn back-btn" onClick={() => setPhase('COMMAND')}>戻る</button>
                            {ITEM_LIST.map(it => (
                                <button key={it.id} className="command-btn" onClick={() => handleSelectItem(it)}>
                                    {it.name} x{it.count}
                                </button>
                            ))}
                        </>
                    )}

                    {(phase === 'ANIMATION' || phase === 'ENEMY_TURN') && (
                        <div style={{ padding: '10px', textAlign: 'center', color: '#888' }}>
                            Action...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
