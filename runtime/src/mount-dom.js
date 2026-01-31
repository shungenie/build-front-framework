import { DOM_TYPES } from './h';

export function mountDOM(vdom, parentEl) {
    switch (vdom.type) {
        case DOM_TYPES.TEXT: {
            createTextNode(vdom, parentEl);
            break;
        }

        case DOM_TYPES.ELEMENT: {
            createElementNode(vdom, parentEl);
            break;
        }

        case DOM_TYPES.FRAGMENT: {
            createFragmentNodes(vdom, parentEl);
            break;
        }

        default: {
            throw new Error(`Unknown vdom type: ${vdom.type}`);
        }
    }
}

// TODO: implement createTextNode()

// TODO: implement createElementNode()

// TODO: implement createFragmentNodes()