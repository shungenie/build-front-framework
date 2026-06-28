import { defineComponent, h, hFragment } from 'shunfwk-project'

export const Counter = defineComponent({
    state() {
        return { count: 0 }
    },

    render() {
        return hFragment([
            h('span', { 'data-qa': 'counter' }, [`${this.state.count}`]),
            h(
                'button',
                {
                    'data-qa': 'increment',
                    on: { click: () => this.increment() },
                },
                ['Increment']
            ),
        ])
    },

    increment() {
        this.updateState({ count: this.state.count + 1 })
    },
})
