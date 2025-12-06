import React, { useState, useEffect } from 'react';
import { useEditorState } from '../hooks/useEditorState';
import { useElementActions } from '../hooks/useElementActions';
import ElementControls from './ElementControls';
import { Icon, plus, settings, layout } from '@wordpress/icons';

const DraggableItem = ({ type, label, icon }) => {
    const onDragStart = (e) => {
        e.dataTransfer.setData('type', type);
    };

    return (
        <div
            draggable
            onDragStart={onDragStart}
            style={styles.draggableItem}
        >
            <div style={{ marginRight: '10px' }}>{icon}</div>
            {label}
        </div>
    );
};

const Sidebar = () => {
    const { state } = useEditorState();
    const { saveLayout } = useElementActions();
    const [activeTab, setActiveTab] = useState('add'); // 'add' or 'settings'

    // Automatically switch to 'settings' tab when an element is selected
    useEffect(() => {
        if (state.selectedElementId) {
            setActiveTab('settings');
        }
    }, [state.selectedElementId]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Tabs */}
            <div className="codera-tabs">
                <div
                    className={`codera-tab ${activeTab === 'add' ? 'active' : ''}`}
                    onClick={() => handleTabClick('add')}
                >
                    <Icon icon={plus} style={{ marginRight: '5px' }} />
                    Add
                </div>
                <div
                    className={`codera-tab ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => handleTabClick('settings')}
                >
                    <Icon icon={settings} style={{ marginRight: '5px' }} />
                    Settings
                </div>
            </div>

            {/* Content */}
            <div className="codera-panel-content">
                {activeTab === 'add' && (
                    <div>
                        <h3 style={styles.sectionTitle}>Basic Elements</h3>
                        <DraggableItem type="container" label="Container" icon={<Icon icon={layout} />} />
                        <DraggableItem type="text" label="Text Block" icon="T" />
                        <DraggableItem type="image" label="Image" icon="🖼️" />
                        <DraggableItem type="button" label="Button" icon="🔘" />

                        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                            <button
                                onClick={saveLayout}
                                className="components-button is-primary"
                                style={{ width: '100%', justifyContent: 'center' }}
                                disabled={state.isSaving}
                            >
                                {state.isSaving ? 'Saving...' : 'Save Layout'}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div>
                        {state.selectedElementId ? (
                            <ElementControls />
                        ) : (
                            <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                                <p>Select an element on the canvas to edit its properties.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    draggableItem: {
        padding: '12px',
        margin: '0 0 10px 0',
        backgroundColor: '#f8f9fa',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
        fontWeight: 500,
        color: '#333'
    },
    sectionTitle: {
        fontSize: '13px',
        textTransform: 'uppercase',
        color: '#666',
        marginTop: '0',
        marginBottom: '15px',
        fontWeight: 600
    }
};

export default Sidebar;
