import { useEditorState } from './useEditorState';
import { v4 as uuidv4 } from 'uuid';

export const useElementActions = () => {
    const { state, dispatch } = useEditorState();

    // Recursive helper to find and update an element in the tree
    const updateElementInTree = (elements, id, updates) => {
        return elements.map(el => {
            if (el.id === id) {
                return { ...el, ...updates };
            }
            if (el.children && el.children.length > 0) {
                return { ...el, children: updateElementInTree(el.children, id, updates) };
            }
            return el;
        });
    };

    // Recursive helper to find and remove an element
    const removeElementFromTree = (elements, id) => {
        return elements.filter(el => el.id !== id).map(el => {
            if (el.children) {
                return { ...el, children: removeElementFromTree(el.children, id) };
            }
            return el;
        });
    };

    // Recursive helper to add an element to a specific parent
    const addElementToParent = (elements, parentId, newElement) => {
        return elements.map(el => {
            if (el.id === parentId) {
                return { ...el, children: [...(el.children || []), newElement] };
            }
            if (el.children) {
                return { ...el, children: addElementToParent(el.children, parentId, newElement) };
            }
            return el;
        });
    };

    const addElement = (type, parentId = null) => {
        const newElement = {
            id: uuidv4(),
            type,
            content: {},
            children: [] // Initialize with empty children array
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
            case 'container':
                newElement.content = { padding: '20px', backgroundColor: '#f9f9f9', flexDirection: 'column', gap: '10px' };
                break;
            default:
                break;
        }

        if (parentId) {
            // Add to specific parent
            const newElements = addElementToParent(state.elements, parentId, newElement);
            dispatch({ type: 'SET_ELEMENTS', payload: newElements });
        } else {
            // Add to root
            dispatch({ type: 'ADD_ELEMENT', payload: newElement });
        }

        // Auto select new element
        dispatch({ type: 'SELECT_ELEMENT', payload: newElement.id });
    };

    const updateElement = (id, updates) => {
        const newElements = updateElementInTree(state.elements, id, updates);
        dispatch({ type: 'SET_ELEMENTS', payload: newElements });
    };

    const removeElement = (id) => {
        const newElements = removeElementFromTree(state.elements, id);
        dispatch({ type: 'SET_ELEMENTS', payload: newElements });
        // Deselect if removed
        if (state.selectedElementId === id) {
            dispatch({ type: 'SELECT_ELEMENT', payload: null });
        }
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
