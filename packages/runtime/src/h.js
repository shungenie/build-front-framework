import { withoutNulls } from './utils/arrays'

export const DOM_TYPES = {
    TEXT: 'text',
    ELEMENT: 'element',
    FRAGMENT: 'fragment',
    COMPONENT: 'component',
}

export function h(tag, props = {}, children = []) {
    const type = typeof tag === 'string' ? DOM_TYPES.ELEMENT : DOM_TYPES.COMPONENT;
    return {
        tag,
        props,
        type,
        children: mapTextNodes(withoutNulls(children)),
    }
}

function mapTextNodes(children) {
    return children.map((child) => 
        typeof child === 'string' ? hString(child) : child
    )
}

export function hString(str) {
    return { type: DOM_TYPES.TEXT, value: str }
}

export function hFragment(vNodes) {
    return {
        type: DOM_TYPES.FRAGMENT,
        children: mapTextNodes(withoutNulls(vNodes)),
    }
}

export function lipsum(words) {
    const lipsumText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`
    return lipsumText.split(' ').slice(0, words).join(' ')
}

export function extractChildren(vdom) {
    if (vdom.children == null) {
        return [];
    }

    const children = [];

    for (const child of vdom.children) {
        if (child.type === DOM_TYPES.FRAGMENT) {
            children.push(...extractChildren(child, children));
        } else {
            children.push(child);
        }
    }

    return children;
}