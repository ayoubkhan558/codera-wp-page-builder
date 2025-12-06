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
            <div className="codera-panel-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888' }}>
                <div style={{ textAlign: 'center' }}>Select an element to edit</div>
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
        <div style={{ padding: '15px' }}>
            <div className="codera-panel-header" style={{ marginBottom: '15px', padding: 0, background: 'transparent', borderBottom: '1px solid var(--codera-border)' }}>
                <h3 style={{ margin: 0, fontSize: '14px', textTransform: 'capitalize' }}>Edit {selectedElement.type}</h3>
                <button onClick={handleDelete} title="Delete Element" style={{ background: 'none', border: 'none', color: 'var(--codera-danger)', cursor: 'pointer', padding: '5px' }}>
                    <FaTrash />
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                {/* Container Controls */}
                {selectedElement.type === 'container' && (
                    <>
                        <div className="codera-field">
                            <label className="codera-label">Tag Name</label>
                            <input
                                type="text"
                                value={selectedElement.content.tagName || 'div'}
                                disabled
                                className="codera-input"
                                style={{ opacity: 0.7 }}
                            />
                        </div>
                        <div className="codera-field">
                            <label className="codera-label">Padding</label>
                            <input
                                type="text"
                                value={selectedElement.content.padding}
                                onChange={(e) => handleChange('padding', e.target.value)}
                                className="codera-input"
                            />
                        </div>
                        <div className="codera-field">
                            <label className="codera-label">Layout Direction</label>
                            <select
                                value={selectedElement.content.flexDirection}
                                onChange={(e) => handleChange('flexDirection', e.target.value)}
                                className="codera-input"
                            >
                                <option value="column">Column (Vertical)</option>
                                <option value="row">Row (Horizontal)</option>
                            </select>
                        </div>
                        <div className="codera-field">
                            <label className="codera-label">Gap</label>
                            <input
                                type="text"
                                value={selectedElement.content.gap}
                                onChange={(e) => handleChange('gap', e.target.value)}
                                className="codera-input"
                            />
                        </div>
                        <div className="codera-field">
                            <label className="codera-label">Min Height</label>
                            <input
                                type="text"
                                value={selectedElement.content.minHeight}
                                onChange={(e) => handleChange('minHeight', e.target.value)}
                                className="codera-input"
                            />
                        </div>
                    </>
                )}

                {/* Text Controls */}
                {selectedElement.type === 'text' && (
                    <>
                        <div className="codera-field">
                            <label className="codera-label">Content</label>
                            <textarea
                                value={selectedElement.content.text}
                                onChange={(e) => handleChange('text', e.target.value)}
                                className="codera-input"
                                style={{ minHeight: '80px', resize: 'vertical' }}
                            />
                        </div>
                        <div className="codera-field">
                            <label className="codera-label">Font Size</label>
                            <input
                                type="text"
                                value={selectedElement.content.fontSize}
                                onChange={(e) => handleChange('fontSize', e.target.value)}
                                className="codera-input"
                            />
                        </div>
                        <div className="codera-field">
                            <label className="codera-label">Color</label>
                            <input
                                type="color"
                                value={selectedElement.content.color}
                                onChange={(e) => handleChange('color', e.target.value)}
                                className="codera-input"
                                style={{ height: '40px', padding: 0 }}
                            />
                        </div>
                    </>
                )}

                {/* Image Controls */}
                {selectedElement.type === 'image' && (
                    <>
                        <div className="codera-field">
                            <label className="codera-label">Image URL</label>
                            <input
                                type="text"
                                value={selectedElement.content.url}
                                onChange={(e) => handleChange('url', e.target.value)}
                                className="codera-input"
                            />
                        </div>
                        <div className="codera-field">
                            <label className="codera-label">Width</label>
                            <input
                                type="text"
                                value={selectedElement.content.width}
                                onChange={(e) => handleChange('width', e.target.value)}
                                className="codera-input"
                            />
                        </div>
                    </>
                )}

                {/* Button Controls */}
                {selectedElement.type === 'button' && (
                    <>
                        <div className="codera-field">
                            <label className="codera-label">Label</label>
                            <input
                                type="text"
                                value={selectedElement.content.label}
                                onChange={(e) => handleChange('label', e.target.value)}
                                className="codera-input"
                            />
                        </div>
                        <div className="codera-field">
                            <label className="codera-label">URL</label>
                            <input
                                type="text"
                                value={selectedElement.content.url}
                                onChange={(e) => handleChange('url', e.target.value)}
                                className="codera-input"
                            />
                        </div>
                        <div className="codera-field">
                            <label className="codera-label">Background</label>
                            <input
                                type="color"
                                value={selectedElement.content.backgroundColor}
                                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                className="codera-input"
                                style={{ height: '40px', padding: 0 }}
                            />
                        </div>
                        <div className="codera-field">
                            <label className="codera-label">Text Color</label>
                            <input
                                type="color"
                                value={selectedElement.content.color}
                                onChange={(e) => handleChange('color', e.target.value)}
                                className="codera-input"
                                style={{ height: '40px', padding: 0 }}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ElementControls;
