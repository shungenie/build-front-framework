export function setAttributes(el, attrs) {
    const { class: className, style, ...otherAttrs } = attrs;

    if (className) {
        setClass(el, className);
    }

    if (style) {
        Object.entries(style).forEach(([prompt, value]) => {
            setStyle(el, prompt, value);
        });
    }

    for (const [name, value] of Object.entries(otherAttrs)) {
        setAttribute(el, name, value);
    }
}

function setClass(el, className) {
    el.className = '';

    if (typeof className === 'string') {
        el.className = className;
    }

    if (Array.isArray(className)) {
        el.classList.add(...className);
    }
}

export function setStyle(el, name, value) {
    el.style[name] = value;
}

export function removeStyle(el, name) {
    el.style[name] = null;
}


// TODO: implement setAttribute
