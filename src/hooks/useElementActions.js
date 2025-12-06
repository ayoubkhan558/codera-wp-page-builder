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

    // Recursive helper to find element
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


    const addElement = (type, parentId = null, extraProps = {}) => {
        const newElement = {
            id: uuidv4(),
            type,
            children: [],
            content: {
                ...extraProps, // tagName, etc.
                padding: '10px',
                margin: '0',
                color: '#e5e5e5',
                fontSize: '16px',
                backgroundColor: 'transparent',
                // Text default
                text: type === 'text' ? 'New Text' : '',
                // Image defaults
                url: type === 'image' ? 'https://via.placeholder.com/150' : '',
                // Button defaults
                label: type === 'button' ? 'Click Me' : '',
                // Container defaults
                flexDirection: 'column',
                gap: '0px',
                // HTML
                html: '<div>HTML</div>'
            }
        };

        // Specific type defaults
        if (type === 'container') {
            if (!newElement.content.tagName) newElement.content.tagName = 'div';
            if (newElement.content.tagName === 'section') newElement.content.minHeight = '100px';
        }

        if (parentId) {
            const newElements = addElementToParent(state.elements, parentId, newElement);
            dispatch({ type: 'UPDATE_ELEMENTS', payload: newElements });
        } else {
            // Add to root
            dispatch({ type: 'ADD_ELEMENT', payload: newElement });
        }

        // Auto select
        dispatch({ type: 'SELECT_ELEMENT', payload: newElement.id });
    };

    const updateElement = (id, updates) => {
        const newElements = updateElementInTree(state.elements, id, updates);
        dispatch({ type: 'UPDATE_ELEMENTS', payload: newElements });
    };

    const removeElement = (id) => {
        const newElements = removeElementFromTree(state.elements, id);
        dispatch({ type: 'UPDATE_ELEMENTS', payload: newElements });
        if (state.selectedElementId === id) {
            dispatch({ type: 'SELECT_ELEMENT', payload: null });
        }
    };

    const moveElement = (sourceId, targetParentId) => {
        if (sourceId === targetParentId) return;

        // 1. Find the element
        const elementToMove = findElement(state.elements, sourceId);
        if (!elementToMove) return;

        // 2. Remove from old pos
        const elementsWithoutSource = removeElementFromTree(state.elements, sourceId);

        // 3. Add to new pos
        let newElements;
        if (targetParentId) {
            newElements = addElementToParent(elementsWithoutSource, targetParentId, elementToMove);
        } else {
            newElements = [...elementsWithoutSource, elementToMove];
        }

        dispatch({ type: 'UPDATE_ELEMENTS', payload: newElements });
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
        moveElement,
        selectElement,
        saveLayout
    };
};
