import { removeEventListeners } from './events.';
import { DOM_TYPES } from './h';

export function destroyDOM(vdom) {
    const { type } = vdom;

    switch (type) {
        case DOM_TYPES.TEXT: {
            removeTextNode(vdom);
            break;
        }

        case DOM_TYPES.ELEMENT: {
            removeElementNode(vdom);
            break;
        }

        case DOM_TYPES.FRAGMENT: {
            removeFragmentNode(vdom);
            break;
        }

        default: {
            throw new Error(`Unknown VDOM type: ${type}`);
        }
    }

    delete vdom.el;
}

// TODO: implement removeTextNode()

// TODO: implement removeElementNode()

// TODO: implement removeFragmentNodes()