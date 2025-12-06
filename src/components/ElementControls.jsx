import React, { useState, useEffect } from 'react';
import { useEditorState } from '../hooks/useEditorState';
import { useElementActions } from '../hooks/useElementActions';
import { FaTrash } from 'react-icons/fa';

const ElementControls = () => {
    const { state } = useEditorState();
    const { updateElement, removeElement } = useElementActions();

    // Recursive helper to find element
    const findElement = (elements, id) => {
        for (const el of elements) {
            if (el.id === id) return el;
            if (el.children && el.children.length > 0) {
                const found = findElement(el.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const selectedElement = findElement(state.elements, state.selectedElementId);

    if (!selectedElement) {
        return (
            <div style={styles.container}>
                <div style={styles.placeholder}>Select an element to edit</div>
            </div>
        );
    }

    const handleChange = (key, value) => {
        updateElement(selectedElement.id, {
            content: {
                ...selectedElement.content,
                [key]: value
            }
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this element?')) {
            removeElement(selectedElement.id);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.title}>Edit {selectedElement.type}</h3>
                <button onClick={handleDelete} style={styles.deleteBtn} title="Delete Element">
                    <FaTrash />
                </button>
            </div>

            <div style={styles.form}>

                {/* Text Controls */}
                {selectedElement.type === 'text' && (
                    <>
                        <div style={styles.field}>
                            <label style={styles.label}>Content</label>
                            <textarea
                                value={selectedElement.content.text}
                                onChange={(e) => handleChange('text', e.target.value)}
                                style={styles.textarea}
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Font Size</label>
                            <input
                                type="text"
                                value={selectedElement.content.fontSize}
                                onChange={(e) => handleChange('fontSize', e.target.value)}
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Color</label>
                            <input
                                type="color"
                                value={selectedElement.content.color}
                                onChange={(e) => handleChange('color', e.target.value)}
                                style={styles.colorParams}
                            />
                        </div>
                    </>
                )}

                {/* Image Controls */}
                {selectedElement.type === 'image' && (
                    <>
                        <div style={styles.field}>
                            <label style={styles.label}>Image URL</label>
                            <input
                                type="text"
                                value={selectedElement.content.url}
                                onChange={(e) => handleChange('url', e.target.value)}
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Width</label>
                            <input
                                type="text"
                                value={selectedElement.content.width}
                                onChange={(e) => handleChange('width', e.target.value)}
                                style={styles.input}
                            />
                        </div>
                    </>
                )}

                {/* Button Controls */}
                {selectedElement.type === 'button' && (
                    <>
                        <div style={styles.field}>
                            <label style={styles.label}>Label</label>
                            <input
                                type="text"
                                value={selectedElement.content.label}
                                onChange={(e) => handleChange('label', e.target.value)}
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>URL</label>
                            <input
                                type="text"
                                value={selectedElement.content.url}
                                onChange={(e) => handleChange('url', e.target.value)}
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Background</label>
                            <input
                                type="color"
                                value={selectedElement.content.backgroundColor}
                                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                style={styles.colorParams}
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Text Color</label>
                            <input
                                type="color"
                                value={selectedElement.content.color}
                                onChange={(e) => handleChange('color', e.target.value)}
                                style={styles.colorParams}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        width: '300px',
        backgroundColor: '#fff',
        borderLeft: '1px solid #ddd',
        padding: '20px',
        overflowY: 'auto'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px'
    },
    title: {
        margin: 0,
        fontSize: '16px',
        textTransform: 'capitalize'
    },
    placeholder: {
        color: '#999',
        textAlign: 'center',
        marginTop: '50px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    },
    label: {
        fontSize: '13px',
        fontWeight: 600,
        color: '#444'
    },
    input: {
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        width: '100%'
    },
    textarea: {
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        width: '100%',
        minHeight: '80px',
        resize: 'vertical'
    },
    deleteBtn: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#d63638',
        cursor: 'pointer',
        padding: '5px',
        fontSize: '14px'
    },
    colorParams: {
        width: '100%',
        height: '40px',
        padding: '0 2px',
        border: '1px solid #ddd',
        borderRadius: '4px'
    }
};

export default ElementControls;
