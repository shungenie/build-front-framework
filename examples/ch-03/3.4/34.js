function MessageComponent(level, message) {
    div = document.createElement('div');
    div.className = `message message--${level}`
    
    p = document.createElement('p');
    p.textContent = message;

    div.appendChild(p);
    return div;
}

MessageComponent('info', 'This is an informational message.');