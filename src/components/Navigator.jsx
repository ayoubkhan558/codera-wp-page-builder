import React from 'react';
import { useEditorState } from '../hooks/useEditorState';
import { useElementActions } from '../hooks/useElementActions';
import { FaColumns, FaImage, FaFont, FaSquare, FaLink, FaCode, FaTrash } from 'react-icons/fa';

const NavigatorItem = ({ element, depth = 0 }) => {
    const { state } = useEditorState();
    const { selectElement, moveElement, removeElement } = useElementActions();
    const isSelected = state.selectedElementId === element.id;

    // Drag state: 'before', 'after', 'inside' (if container), or null
    const [dragPosition, setDragPosition] = React.useState(null);

    const handleSelect = (e) => {
        e.stopPropagation();
        selectElement(element.id);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        removeElement(element.id);
    };

    const handleDragStart = (e) => {
        e.stopPropagation();
        e.dataTransfer.setData('sourceId', element.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const height = rect.height;
        const isContainer = element.type === 'container';

        // Zones:
        // Top 25% -> Before
        // Bottom 25% -> After
        // Middle 50% -> Inside (if container) OR split between before/after

        if (y < height * 0.25) {
            setDragPosition('before');
        } else if (y > height * 0.75) {
            setDragPosition('after');
        } else {
            if (isContainer) {
                setDragPosition('inside');
            } else {
                setDragPosition(y < height * 0.5 ? 'before' : 'after');
            }
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragPosition(null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const sourceId = e.dataTransfer.getData('sourceId');

        if (sourceId && sourceId !== element.id && dragPosition) {
            moveElement(sourceId, element.id, dragPosition);
        }
        setDragPosition(null);
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

    // Style for drag feedback
    let borderStyle = {};
    if (dragPosition === 'before') borderStyle = { borderTop: '2px solid var(--primary)' };
    if (dragPosition === 'after') borderStyle = { borderBottom: '2px solid var(--primary)' };
    if (dragPosition === 'inside') borderStyle = { backgroundColor: 'rgba(0,183,255,0.2)', border: '1px solid var(--primary)' };

    return (
        <div>
            <div
                draggable
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
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
                    borderBottom: '1px solid rgba(255,255,255,0.02)',
                    transition: 'all 0.1s',
                    ...borderStyle
                }}
            >
                <span style={{ opacity: 0.7, fontSize: '10px' }}>{getIcon(element.type)}</span>
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {element.content.tagName || element.type}
                </span>
                <button
                    onClick={handleDelete}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        opacity: 0.6,
                        fontSize: '10px'
                    }}
                    title="Delete"
                >
                    <FaTrash />
                </button>
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
