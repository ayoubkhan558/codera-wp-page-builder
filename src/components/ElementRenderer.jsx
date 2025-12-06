import React from 'react';
import TextElement from '../elements/TextElement';
import ImageElement from '../elements/ImageElement';
import ButtonElement from '../elements/ButtonElement';
import ContainerElement from '../elements/ContainerElement';
import { useElementActions } from '../hooks/useElementActions';
import { useEditorState } from '../hooks/useEditorState';

const ElementRenderer = ({ element }) => {
    const { state } = useEditorState();
    const { selectElement } = useElementActions();

    const isSelected = state.selectedElementId === element.id;

    const handleClick = (e) => {
        e.stopPropagation();
        selectElement(element.id);
    };

    let Component;
    switch (element.type) {
        case 'text':
            Component = TextElement;
            break;
        case 'image':
            Component = ImageElement;
            break;
        case 'button':
            Component = ButtonElement;
            break;
        case 'container':
            Component = ContainerElement;
            break;
        default:
            return <div>Unknown Element</div>;
    }

    return (
        <div
            onClick={handleClick}
            style={{
                margin: '10px 0',
                position: 'relative',
                transition: 'all 0.2s ease'
            }}
        >
            <Component content={element.content} isSelected={isSelected} />
        </div>
    );
};

export default ElementRenderer;
