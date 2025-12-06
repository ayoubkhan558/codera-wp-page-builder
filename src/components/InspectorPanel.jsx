import React from 'react';
import { useEditorState } from '../hooks/useEditorState';
import { useElementActions } from '../hooks/useElementActions';
import { Panel, PanelHeader, PanelSection, Input, Select, Button } from '../ui';
import { FaTrash, FaCopy, FaLayerGroup } from 'react-icons/fa';
import Navigator from './Navigator';

const InspectorPanel = () => {
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

    const handleStyleChange = (key, value) => {
        if (!selectedElement) return;
        // Merge with existing content or separate style object if you prefer
        // For simplicity, we are keeping styles flattened in content for now based on legacy
        // But let's verify if we should separate them. The PHP renderer expects simple keys in 'content'.
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

    if (!selectedElement) {
        return (
            <Panel>
                <PanelHeader title="Inspector" />
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                    Select an element to edit styles.
                </div>
                <div style={{ flex: 1, borderTop: '1px solid var(--border)' }}>
                    <Navigator />
                </div>
            </Panel>
        );
    }

    return (
        <Panel>
            <PanelHeader title="Settings">
                <Button onClick={handleDelete} title="Delete" style={{ padding: '4px', border: 'none', color: 'var(--danger)' }}>
                    <FaTrash />
                </Button>
            </PanelHeader>

            <div style={{ flex: 1, overflowY: 'auto' }}>

                {/* Identity */}
                <PanelSection title="Identity" defaultOpen={true}>
                    <div style={{ fontSize: '12px', marginBottom: '8px', color: 'var(--primary)' }}>
                        {selectedElement.type.toUpperCase()}
                        {selectedElement.content.tagName && <span style={{ opacity: 0.7 }}> ({selectedElement.content.tagName})</span>}
                    </div>
                </PanelSection>

                {/* Layout Controls (Flexbox) */}
                {(selectedElement.type === 'container') && (
                    <PanelSection title="Layout">
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

                {/* Spacing & Dimensions */}
                <PanelSection title="Size & Spacing">
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

                {/* Typography */}
                {(selectedElement.type === 'text' || selectedElement.type === 'button') && (
                    <PanelSection title="Typography">
                        <Input
                            label="Text Content"
                            type="text" // using input for short text, switch to textarea if needed
                            value={selectedElement.content.text || selectedElement.content.label || ''}
                            onChange={(e) => {
                                if (selectedElement.type === 'button') handleChange('label', e.target.value);
                                else handleChange('text', e.target.value);
                            }}
                        />
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
                )}

                {/* Background */}
                <PanelSection title="Background">
                    <Input
                        label="Background Color"
                        type="color"
                        value={selectedElement.content.backgroundColor || '#ffffff'}
                        onChange={(e) => handleChange('backgroundColor', e.target.value)}
                        style={{ height: '30px', padding: '2px' }}
                    />
                </PanelSection>

                {/* Image Props */}
                {selectedElement.type === 'image' && (
                    <PanelSection title="Image Source">
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
            </div>

            <div style={{ height: '300px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
                <Navigator />
            </div>
        </Panel>
    );
};

export default InspectorPanel;
