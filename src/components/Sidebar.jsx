import React, { useState } from 'react';
import { Panel, PanelHeader, PanelSection, Input } from '../ui';
import {
    FaCube, FaColumns, FaHeading, FaParagraph, FaImage, FaLink,
    FaCode, FaRegSquare, FaList, FaSearch
} from 'react-icons/fa';

const DraggableItem = ({ type, label, icon, tagName }) => {
    const handleDragStart = (e) => {
        e.dataTransfer.setData('type', type);
        e.dataTransfer.setData('tagName', tagName || type);
        e.effectAllowed = 'copy';
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 6px',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                cursor: 'grab',
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
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <Panel>
            <PanelHeader title="Add Elements" />

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

            <div style={{ flex: 1, overflowY: 'auto' }}>
                <PanelSection title="Layout" defaultOpen={true}>
                    <ElementGrid>
                        <DraggableItem type="container" tagName="section" label="Section" icon={<FaColumns />} />
                        <DraggableItem type="container" tagName="div" label="Container" icon={<FaRegSquare />} />
                        <DraggableItem type="container" tagName="article" label="Article" icon={<FaCube />} />
                        <DraggableItem type="container" tagName="main" label="Main" icon={<FaCube />} />
                        <DraggableItem type="container" tagName="header" label="Header" icon={<FaList />} />
                        <DraggableItem type="container" tagName="footer" label="Footer" icon={<FaList />} />
                    </ElementGrid>
                </PanelSection>

                <PanelSection title="Basic" defaultOpen={true}>
                    <ElementGrid>
                        <DraggableItem type="text" label="Heading" icon={<FaHeading />} />
                        <DraggableItem type="text" label="Paragraph" icon={<FaParagraph />} />
                        <DraggableItem type="button" label="Button" icon={<FaLink />} />
                        <DraggableItem type="image" label="Image" icon={<FaImage />} />
                        <DraggableItem type="html" label="HTML" icon={<FaCode />} />
                        <DraggableItem type="text" label="Text Block" icon={<FaParagraph />} />
                    </ElementGrid>
                </PanelSection>
            </div>
        </Panel>
    );
};

export default Sidebar;
