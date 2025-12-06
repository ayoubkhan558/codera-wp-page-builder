import React from 'react';
import { useEditorState } from '../hooks/useEditorState';
import { useElementActions } from '../hooks/useElementActions';
import { FaColumns, FaImage, FaFont, FaSquare, FaLink, FaCode } from 'react-icons/fa';

const NavigatorItem = ({ element, depth = 0 }) => {
    const { state } = useEditorState();
    const { selectElement } = useElementActions();
    const isSelected = state.selectedElementId === element.id;

    const handleSelect = (e) => {
        e.stopPropagation();
        selectElement(element.id);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'container': return <FaColumns />;
            case 'image': return <FaImage />;
            case 'text': return <FaFont />;
            case 'button': return <FaLink />;
            case 'html': return <FaCode />;
            default: return <FaSquare />;
        }
    };

    return (
        <div>
            <div
                onClick={handleSelect}
                style={{
                    padding: '6px 8px',
                    paddingLeft: `${depth * 12 + 12}px`,
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                    color: isSelected ? '#fff' : 'var(--text)',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '11px',
                    gap: '8px',
                    borderBottom: '1px solid rgba(255,255,255,0.02)'
                }}
            >
                <span style={{ opacity: 0.7, fontSize: '10px' }}>{getIcon(element.type)}</span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {element.content.tagName || element.type}
                </span>
            </div>
            {element.children && element.children.length > 0 && (
                <div>
                    {element.children.map(child => (
                        <NavigatorItem key={child.id} element={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

const Navigator = () => {
    const { state } = useEditorState();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div
                style={{
                    padding: '8px 12px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    backgroundColor: 'var(--panel-alt)',
                    borderBottom: '1px solid var(--border)'
                }}
            >
                NAVIGATOR
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {state.elements.length === 0 ? (
                    <div style={{ padding: '20px', color: 'var(--text-muted)', textAlign: 'center', fontSize: '11px' }}>
                        Empty Canvas
                    </div>
                ) : (
                    state.elements.map(el => (
                        <NavigatorItem key={el.id} element={el} />
                    ))
                )}
            </div>
        </div>
    );
};

export default Navigator;
