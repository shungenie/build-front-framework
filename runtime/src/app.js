import { destroyDOM } from './destroy-dom';
import { moundDOM } from './mound-dom';

export function createApp({state, view}) {
    let parentEl = null;
    let vdom = null;

    function renderApp() {
        if (vdom) {
            destroyDOM(vdom);
        }

        vdom = view(state);
        mountDOM(vdom, parentEl);
    }

    return {
        mount(_parentEl) {
            parentEl = _parentEl;
            renderApp();
        }
    }
}