import React, { useState } from 'react';
import { IconButton } from '../ui';
import { useEditorState } from '../hooks/useEditorState';
import {
    FaSave, FaEye, FaUndo, FaRedo, FaDesktop, FaTabletAlt, FaMobileAlt,
    FaColumns, FaLayerGroup, FaCog
} from 'react-icons/fa';

const Topbar = ({
    isLeftVisible,
    toggleLeft,
    isRightVisible,
    toggleRight,
    onSave,
    isSaving
}) => {
    const { state } = useEditorState();
    const [zoom, setZoom] = useState(100);

    return (
        <div style={{
            height: 'var(--header-height)',
            backgroundColor: 'var(--panel)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            color: 'var(--text)',
            gap: '20px'
        }}>
            {/* Left: Branding & Panels */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontWeight: 800, fontSize: '14px', letterSpacing: '0.5px' }}>
                    <span style={{ color: 'var(--primary)' }}>CODERA</span>
                </div>
                <div style={{ width: '1px', height: '20px', background: 'var(--border)' }}></div>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <IconButton
                        icon={<FaColumns />}
                        active={isLeftVisible}
                        onClick={toggleLeft}
                        title="Toggle Elements Panel"
                    />
                    <IconButton
                        icon={<FaLayerGroup />}
                        active={isRightVisible}
                        onClick={toggleRight}
                        title="Toggle Inspector"
                    />
                </div>
            </div>

            {/* Center: Device & Validation */}
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '6px' }}>
                <IconButton icon={<FaDesktop />} active={true} title="Desktop View" />
                <IconButton icon={<FaTabletAlt />} title="Tablet View" />
                <IconButton icon={<FaMobileAlt />} title="Mobile View" />
            </div>

            {/* Right: Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Zoom: {zoom}%
                </div>
                <div style={{ width: '1px', height: '20px', background: 'var(--border)' }}></div>
                <IconButton
                    icon={<FaUndo />}
                    title="Undo"
                    style={{ opacity: 0.5 }}
                />
                <IconButton
                    icon={<FaRedo />}
                    title="Redo"
                    style={{ opacity: 0.5 }}
                />
                <button
                    onClick={onSave}
                    disabled={isSaving}
                    style={{
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        padding: '6px 16px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        opacity: isSaving ? 0.7 : 1
                    }}
                >
                    <FaSave />
                    {isSaving ? 'Saving...' : 'Save'}
                </button>
            </div>
        </div>
    );
};

export default Topbar;
