import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, PanelSection, Input, Button } from '../ui';
import { useEditorState } from '../hooks/useEditorState';
import { useElementActions } from '../hooks/useElementActions';
import InspectorPanel from './InspectorPanel';
import {
    FaCube, FaColumns, FaHeading, FaParagraph, FaImage, FaLink,
    FaCode, FaRegSquare, FaList, FaSearch, FaPaintBrush, FaEdit, FaPlus
} from 'react-icons/fa';

// Redefine DraggableItem to use the hook directly since it's inside the Provider context
const DraggableItem = ({ type, label, icon, tagName }) => {
    const { addElement } = useElementActions();

    // Forward to internal structure
    return (
        <DraggableItemInternal
            type={type}
            label={label}
            icon={icon}
            tagName={tagName}
            addElement={addElement}
        />
    );
};

// ... Wait, let's rewrite the component structure clearly.

const DraggableItemInternal = ({ type, label, icon, tagName, addElement }) => {
    // const { addElement } = useElementActions(); // Logic moved up

    const handleDragStart = (e) => {
        e.dataTransfer.setData('type', type);
        e.dataTransfer.setData('tagName', tagName || type);
        e.effectAllowed = 'copy';
    };

    const handleClick = () => {
        addElement(type, null, { tagName });
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onClick={handleClick}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 6px',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: 'rgba(255,255,255,0.02)',
                transition: 'background 0.2s, border-color 0.2s',
                gap: '8px'
            }}
            className="codera-element-item"
        >
            <div style={{ fontSize: '18px', color: 'var(--text-muted)' }}>{icon}</div>
            <div style={{ fontSize: '11px', color: 'var(--text)' }}>{label}</div>
            <style jsx>{`
                .codera-element-item:hover {
                    background: rgba(255,255,255,0.05) !important;
                    border-color: var(--primary) !important;
                }
                .codera-element-item:hover div {
                    color: var(--primary) !important;
                }
            `}</style>
        </div>
    );
};

const ElementGrid = ({ children }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {children}
    </div>
);

const Sidebar = () => {
    const { state } = useEditorState();
    const [activeTab, setActiveTab] = useState('add'); // 'add', 'content', 'style'
    const [searchTerm, setSearchTerm] = useState('');

    // Switch tabs based on selection
    useEffect(() => {
        if (state.selectedElementId) {
            setActiveTab('content');
        } else {
            setActiveTab('add');
        }
    }, [state.selectedElementId]);

    const tabs = [
        { id: 'add', icon: <FaPlus />, label: 'Add' },
        { id: 'content', icon: <FaEdit />, label: 'Content', disabled: !state.selectedElementId },
        { id: 'style', icon: <FaPaintBrush />, label: 'Style', disabled: !state.selectedElementId },
    ];

    return (
        <Panel>
            {/* Tab Header */}
            <div style={{
                display: 'flex',
                borderBottom: '1px solid var(--border)',
                backgroundColor: 'var(--panel-header)'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => !tab.disabled && setActiveTab(tab.id)}
                        disabled={tab.disabled}
                        style={{
                            flex: 1,
                            padding: '12px',
                            background: activeTab === tab.id ? 'var(--bg)' : 'transparent',
                            border: 'none',
                            borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                            color: activeTab === tab.id ? 'var(--primary)' : (tab.disabled ? 'var(--text-disabled)' : 'var(--text-muted)'),
                            cursor: tab.disabled ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            outline: 'none',
                            opacity: tab.disabled ? 0.3 : 1
                        }}
                        title={tab.label}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                {/* ADD MODE */}
                {activeTab === 'add' && (
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <div style={{ padding: '12px', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ position: 'relative' }}>
                                <FaSearch style={{ position: 'absolute', left: '8px', top: '8px', color: 'var(--text-muted)', fontSize: '12px' }} />
                                <input
                                    type="text"
                                    placeholder="Search elements..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: 'rgba(0,0,0,0.2)',
                                        border: '1px solid var(--border)',
                                        padding: '6px 8px 6px 28px',
                                        borderRadius: '4px',
                                        color: 'var(--text)',
                                        fontSize: '12px',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ paddingBottom: '20px' }}>
                            <PanelSection title="Layout" defaultOpen={true}>
                                <ElementGrid>
                                    <DraggableItem type="container" tagName="section" label="Section" icon={<FaColumns />} />
                                    <DraggableItem type="container" tagName="div" label="Div" icon={<FaRegSquare />} />
                                </ElementGrid>
                            </PanelSection>

                            <PanelSection title="Basic" defaultOpen={true}>
                                <ElementGrid>
                                    <DraggableItem type="text" tagName="h2" label="Heading" icon={<FaHeading />} />
                                    <DraggableItem type="text" tagName="p" label="Paragraph" icon={<FaParagraph />} />
                                    <DraggableItem type="button" label="Button" icon={<FaLink />} />
                                    <DraggableItem type="image" label="Image" icon={<FaImage />} />
                                    <DraggableItem type="html" label="HTML" icon={<FaCode />} />
                                </ElementGrid>
                            </PanelSection>
                        </div>
                    </div>
                )}

                {/* EDIT MODES */}
                {(activeTab === 'content' || activeTab === 'style') && (
                    <InspectorPanel activeTab={activeTab} />
                )}

            </div>
        </Panel>
    );
};

export default Sidebar;
