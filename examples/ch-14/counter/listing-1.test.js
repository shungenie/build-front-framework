import { test, expect, beforeEach, afterEach } from 'vitest';
import { createApp } from 'shunfwk-project'
import { Counter } from './counter'

let app = null;

beforeEach(() => {
    app = createApp(Counter)
    app.mount(document.body)
})

afterEach(() => {
    app.unmount()
})

test('the counter starts at 0', () => {
    const counter = document.querySelector('[data-qa="counter"]');
    expect(counter.textContent).toBe('0')
});

test('clicking the increment button increases the counter', () => {
    const incrementButton = document.querySelector('[data-qa="increment"]');
    incrementButton.click();
    const counter = document.querySelector('[data-qa="counter"]');
    expect(counter.textContent).toBe('1')
});