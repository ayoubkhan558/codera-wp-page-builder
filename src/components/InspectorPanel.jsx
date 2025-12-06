import React from 'react';
import { useEditorState } from '../hooks/useEditorState';
import { useElementActions } from '../hooks/useElementActions';
import { Panel, PanelHeader, PanelSection, Input, Select, Button } from '../ui';
import { FaTrash } from 'react-icons/fa';

const InspectorPanel = ({ activeTab = 'content' }) => {
    const { state } = useEditorState();
    const { updateElement, removeElement, selectElement } = useElementActions();

    // Recursive search for selected element
    const findElement = (elements, id) => {
        for (const el of elements) {
            if (el.id === id) return el;
            if (el.children) {
                const found = findElement(el.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const selectedElement = findElement(state.elements, state.selectedElementId);

    const handleChange = (key, value) => {
        if (!selectedElement) return;
        updateElement(selectedElement.id, {
            content: { ...selectedElement.content, [key]: value }
        });
    };

    const handleDelete = () => {
        if (confirm('Delete this element?')) {
            removeElement(selectedElement.id);
            selectElement(null);
        }
    };

    if (!selectedElement) return null;

    return (
        <div style={{ flex: 1, overflowY: 'auto' }}>

            <div style={{ padding: '12px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>
                    {selectedElement.type.toUpperCase()}
                    {selectedElement.content.tagName && <span style={{ opacity: 0.7 }}> ({selectedElement.content.tagName})</span>}
                </div>
                <Button onClick={handleDelete} title="Delete" style={{ padding: '4px', border: 'none', color: 'var(--danger)' }}>
                    <FaTrash />
                </Button>
            </div>

            {/* CONTENT TAB */}
            {activeTab === 'content' && (
                <>
                    {/* Typography Content */}
                    {(selectedElement.type === 'text' || selectedElement.type === 'button') && (
                        <PanelSection title="Text Content" defaultOpen={true}>
                            <Input
                                label="Text"
                                type="text"
                                value={selectedElement.content.text || selectedElement.content.label || ''}
                                onChange={(e) => {
                                    if (selectedElement.type === 'button') handleChange('label', e.target.value);
                                    else handleChange('text', e.target.value);
                                }}
                            />
                            {selectedElement.type === 'button' && (
                                <Input
                                    label="Link URL"
                                    type="text"
                                    value={selectedElement.content.url || ''}
                                    onChange={(e) => handleChange('url', e.target.value)}
                                />
                            )}
                        </PanelSection>
                    )}

                    {/* Image Content */}
                    {selectedElement.type === 'image' && (
                        <PanelSection title="Image Source" defaultOpen={true}>
                            <Input
                                label="URL"
                                type="text"
                                value={selectedElement.content.url || ''}
                                onChange={(e) => handleChange('url', e.target.value)}
                            />
                            <Input
                                label="Alt Text"
                                type="text"
                                value={selectedElement.content.alt || ''}
                                onChange={(e) => handleChange('alt', e.target.value)}
                            />
                        </PanelSection>
                    )}

                    {/* Container Tag */}
                    {selectedElement.type === 'container' && (
                        <PanelSection title="Semantics" defaultOpen={true}>
                            <Select
                                label="HTML Tag"
                                value={selectedElement.content.tagName || 'div'}
                                onChange={(e) => handleChange('tagName', e.target.value)}
                                options={[
                                    { value: 'div', label: 'div (Generic)' },
                                    { value: 'section', label: 'section' },
                                    { value: 'article', label: 'article' },
                                    { value: 'main', label: 'main' },
                                    { value: 'header', label: 'header' },
                                    { value: 'footer', label: 'footer' }
                                ]}
                            />
                        </PanelSection>
                    )}
                </>
            )}

            {/* STYLE TAB */}
            {activeTab === 'style' && (
                <>
                    {/* Layout Controls */}
                    {(selectedElement.type === 'container') && (
                        <PanelSection title="Layout" defaultOpen={true}>
                            <Select
                                label="Direction"
                                value={selectedElement.content.flexDirection || 'column'}
                                onChange={(e) => handleChange('flexDirection', e.target.value)}
                                options={[
                                    { value: 'column', label: 'Vertical (Column)' },
                                    { value: 'row', label: 'Horizontal (Row)' }
                                ]}
                            />
                            <Select
                                label="Align Items"
                                value={selectedElement.content.alignItems || 'flex-start'}
                                onChange={(e) => handleChange('alignItems', e.target.value)}
                                options={[
                                    { value: 'flex-start', label: 'Start' },
                                    { value: 'center', label: 'Center' },
                                    { value: 'flex-end', label: 'End' },
                                    { value: 'stretch', label: 'Stretch' }
                                ]}
                            />
                            <Select
                                label="Justify Content"
                                value={selectedElement.content.justifyContent || 'flex-start'}
                                onChange={(e) => handleChange('justifyContent', e.target.value)}
                                options={[
                                    { value: 'flex-start', label: 'Start' },
                                    { value: 'center', label: 'Center' },
                                    { value: 'flex-end', label: 'End' },
                                    { value: 'space-between', label: 'Space Between' }
                                ]}
                            />
                            <Input
                                label="Gap"
                                type="text"
                                value={selectedElement.content.gap || ''}
                                onChange={(e) => handleChange('gap', e.target.value)}
                                placeholder="e.g. 20px"
                            />
                        </PanelSection>
                    )}

                    {/* Sizing & Spacing */}
                    <PanelSection title="Size & Spacing" defaultOpen={true}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <Input
                                label="Width"
                                type="text"
                                value={selectedElement.content.width || ''}
                                onChange={(e) => handleChange('width', e.target.value)}
                            />
                            <Input
                                label="Height"
                                type="text"
                                value={selectedElement.content.height || ''}
                                onChange={(e) => handleChange('height', e.target.value)}
                            />
                            <Input
                                label="Min Height"
                                type="text"
                                value={selectedElement.content.minHeight || ''}
                                onChange={(e) => handleChange('minHeight', e.target.value)}
                            />
                            <Input
                                label="Padding"
                                type="text"
                                value={selectedElement.content.padding || ''}
                                onChange={(e) => handleChange('padding', e.target.value)}
                            />
                            <Input
                                label="Margin"
                                type="text"
                                value={selectedElement.content.margin || ''}
                                onChange={(e) => handleChange('margin', e.target.value)}
                            />
                        </div>
                    </PanelSection>

                    <PanelSection title="Background">
                        <Input
                            label="Background Color"
                            type="color"
                            value={selectedElement.content.backgroundColor || '#ffffff'}
                            onChange={(e) => handleChange('backgroundColor', e.target.value)}
                            style={{ height: '30px', padding: '2px' }}
                        />
                    </PanelSection>

                    {/* Typography Styles */}
                    <PanelSection title="Typography">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <Input
                                label="Font Size"
                                type="text"
                                value={selectedElement.content.fontSize || ''}
                                onChange={(e) => handleChange('fontSize', e.target.value)}
                            />
                            <Input
                                label="Color"
                                type="color"
                                value={selectedElement.content.color || '#000000'}
                                onChange={(e) => handleChange('color', e.target.value)}
                                style={{ height: '30px', padding: '2px' }}
                            />
                        </div>
                        <Select
                            label="Align"
                            value={selectedElement.content.textAlign || 'left'}
                            onChange={(e) => handleChange('textAlign', e.target.value)}
                            options={[
                                { value: 'left', label: 'Left' },
                                { value: 'center', label: 'Center' },
                                { value: 'right', label: 'Right' }
                            ]}
                        />
                    </PanelSection>
                </>
            )}
        </div>
    );
};

export default InspectorPanel;
