import { destroyDOM } from './destroy-dom';
import { Dispatcher } from './dispatcher';
import { moundDOM } from './mound-dom';

export function createApp({state, view, reducers = {}}) {
    let parentEl = null;
    let vdom = null;

    const dispatcher = new Dispatcher();
    const subscriptions = [dispatcher.afterEveryCommand(renderApp)];

    for (const actionName in reducers) {
        const reducer = reducers[actionName];

        const subs = dispatcher.subscribe(actionName, (payload) => {
            state = reducer(state, payload);
        })
        subscriptions.push(subs);
    }

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