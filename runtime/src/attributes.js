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

// TODO: implement setClass

// TODO: implement setStyle

// TODO: implement setAttribute
