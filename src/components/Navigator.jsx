import React from 'react';
import { useEditorState } from '../hooks/useEditorState';
import { useElementActions } from '../hooks/useElementActions';

const NavigatorItem = ({ element, depth = 0 }) => {
    const { state } = useEditorState();
    const { selectElement } = useElementActions();
    const isSelected = state.selectedElementId === element.id;

    const handleSelect = (e) => {
        e.stopPropagation();
        selectElement(element.id);
    };

    return (
        <div style={{ marginLeft: `${depth * 10}px` }}>
            <div
                onClick={handleSelect}
                style={{
                    padding: '8px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#e6f7ff' : 'transparent',
                    borderLeft: isSelected ? '3px solid #1890ff' : '3px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '13px'
                }}
            >
                <span style={{ marginRight: '5px' }}>
                    {element.type === 'container' ? '⬜' : 'Item'}
                </span>
                {element.type}
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
        <div style={{ padding: '10px', height: '100%', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>Navigator</h3>
            {state.elements.length === 0 ? (
                <div style={{ color: '#999', fontSize: '12px', textAlign: 'center', marginTop: '20px' }}>
                    No elements
                </div>
            ) : (
                state.elements.map(el => (
                    <NavigatorItem key={el.id} element={el} />
                ))
            )}
        </div>
    );
};

export default Navigator;
