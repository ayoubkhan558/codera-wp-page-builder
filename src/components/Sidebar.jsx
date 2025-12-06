import React from 'react';
import { FaFont, FaImage, FaRegSquare, FaSave } from 'react-icons/fa';
import { useElementActions } from '../hooks/useElementActions';
import { useEditorState } from '../hooks/useEditorState';

const Sidebar = () => {
    const { saveLayout } = useElementActions();
    const { state } = useEditorState();

    const onDragStart = (e, type) => {
        e.dataTransfer.setData('type', type);
    };

    return (
        <div style={styles.sidebar}>
            <h3 style={styles.header}>Elements</h3>
            <div style={styles.list}>
                <div
                    draggable
                    onDragStart={(e) => onDragStart(e, 'text')}
                    style={styles.item}
                >
                    <FaFont style={styles.icon} /> Text
                </div>
                <div
                    draggable
                    onDragStart={(e) => onDragStart(e, 'image')}
                    style={styles.item}
                >
                    <FaImage style={styles.icon} /> Image
                </div>
                <div
                    draggable
                    onDragStart={(e) => onDragStart(e, 'button')}
                    style={styles.item}
                >
                    <FaRegSquare style={styles.icon} /> Button
                </div>
            </div>

            <div style={styles.divider}></div>

            <div style={styles.actions}>
                <button
                    onClick={saveLayout}
                    style={styles.saveBtn}
                    disabled={state.isSaving}
                >
                    <FaSave style={{ marginRight: '8px' }} />
                    {state.isSaving ? 'Saving...' : 'Save Layout'}
                </button>
            </div>
        </div>
    );
};

const styles = {
    sidebar: {
        width: '250px',
        backgroundColor: '#fff',
        borderRight: '1px solid #ddd',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column'
    },
    header: {
        marginTop: 0,
        marginBottom: '20px',
        fontSize: '16px',
        color: '#333'
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 15px',
        backgroundColor: '#f6f7f7',
        border: '1px solid #dcdcde',
        borderRadius: '4px',
        cursor: 'grab',
        transition: 'all 0.2s',
        fontSize: '14px',
        color: '#3c434a'
    },
    icon: {
        marginRight: '10px',
        color: '#646970'
    },
    divider: {
        marginTop: 'auto',
        marginBottom: '20px',
        height: '1px',
        backgroundColor: '#eee'
    },
    actions: {
    },
    saveBtn: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#2271b1',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
};

export default Sidebar;
