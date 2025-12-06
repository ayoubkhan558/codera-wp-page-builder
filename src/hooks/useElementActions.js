import { useEditorState } from './useEditorState';
import { v4 as uuidv4 } from 'uuid';

export const useElementActions = () => {
    const { state, dispatch } = useEditorState();

    const addElement = (type) => {
        const newElement = {
            id: uuidv4(),
            type,
            content: {}, // Specific content will be handled by element defaults
        };

        // Set defaults based on type
        switch (type) {
            case 'text':
                newElement.content = { text: 'New Text Block', color: '#000000', fontSize: '16px' };
                break;
            case 'image':
                newElement.content = { url: 'https://via.placeholder.com/300', alt: 'Placeholder', width: '100%' };
                break;
            case 'button':
                newElement.content = { label: 'Click Me', url: '#', backgroundColor: '#0073aa', color: '#ffffff' };
                break;
            default:
                break;
        }

        dispatch({ type: 'ADD_ELEMENT', payload: newElement });
    };

    const updateElement = (id, updates) => {
        dispatch({ type: 'UPDATE_ELEMENT', payload: { id, updates } });
    };

    const removeElement = (id) => {
        dispatch({ type: 'REMOVE_ELEMENT', payload: id });
    };

    const selectElement = (id) => {
        dispatch({ type: 'SELECT_ELEMENT', payload: id });
    };

    const saveLayout = async () => {
        if (!window.coderaData || !window.coderaData.root_url) {
            console.error("Codera API not configured");
            return;
        }

        dispatch({ type: 'SET_SAVING', payload: true });

        try {
            const response = await fetch(`${window.coderaData.root_url}/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': window.coderaData.nonce
                },
                body: JSON.stringify({
                    post_id: window.coderaData.post_id || 0,
                    elements: state.elements
                })
            });
            const result = await response.json();
            if (result.success) {
                console.log("Saved successfully");
            } else {
                console.error("Save failed:", result);
            }
        } catch (error) {
            console.error("Save error:", error);
        } finally {
            dispatch({ type: 'SET_SAVING', payload: false });
        }
    };

    return {
        addElement,
        updateElement,
        removeElement,
        selectElement,
        saveLayout
    };
};
