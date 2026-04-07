import { createApp, h, hFragment } from 'https://unpkg.com/shunfwk-project@1.0.8'

const state = {
    currentTodo: '',
    edit: {
        idx: null,
        original: null,
        edited: null,
    },
    todos: ['Walk the dog', 'Water the plants'],
}

const reducers = {
    'update-current-todo': (state, currentTodo) => ({
        ...state,
        currentTodo,
    }),
    'add-todo': (state) => ({
        ...state,
        currentTodo: '',
        todos: [...state.todos, state.currentTodo],
    }),
    'start-editing-todo': (state, idx) => ({
        ...state,
        edit: {
            idx,
            original: state.todos[idx],
            edited: state.todos[idx],
        }
    }),
    'edit-todo': (state, edited) => ({
        ...state,
        edit: { ...state.edit, edited },
    }),
    'save-edited-todo': (state) => {
        const todos = [...state.todos];
        todos[state.edit.idx] = state.edit.edited;

        return {
            ...state,
            edit: { idx: null, original: null, edited: null },
            todos,
        }
    },
    'cancel-editing-todo': (state) => ({
        ...state,
        edit: { idx: null, original: null, edited: null },
    }),
    'remove-todo': (state, idx) => ({
        ...state,
        todos: state.todos.filter((_, i) => i !== idx),
    })
}

function App(state, emit) {
    return hFragment([
        h('h1', {}, 'My TODOs'),
        CreateTodo(state, emit),
        TodoList(state, emit),
    ])
}

function CreateTodo({ currentTodo }, emit) {
  // Destructures the currentTodo from the state object
  return h('div', {}, [
    // The input's label
    h('label', { for: 'todo-input' }, ['New TODO']),
    h('input', {
      type: 'text',
      id: 'todo-input',
      // The input field's value is the currentTodo in the state.
      value: currentTodo,
      on: {
        // Updates the field's value when the user types in it
        input: ({ target }) => 
          emit('update-current-todo', target.value),
        // Checks whether the user pressed the Enter key and the input field has at least three characters
        keydown: ({ key }) => {
          if (key === 'Enter' && currentTodo.length >= 3) {
            // Dispatches the 'add-todo' command
            emit('add-todo')
          }
        },
      },
    }),
    h(
      'button',
      {
        // Disables the button if the input field has fewer than three characters
        disabled: currentTodo.length < 3,
        // Dispatches the 'add-todo' command when the user clicks the button
        on: { click: () => emit('add-todo') },
      },
      ['Add']
    ),
  ])
}

function TodoList({ todos, edit }, emit) {
    return h(
        'ul',
        {},
        todos.map((todo, i) => TodoItem({ todo, i, edit }, emit))
    )
}

function TodoItem({ todo, i, edit }, emit) {
  const isEditing = edit.idx === i

  return isEditing
    ? h('li', {}, [
        // The item in edit mode
        h('input', {
          // The input field's value is the edited TODO's description.
          value: edit.edited,
          on: {
            // Updates the field's value when the user types in it
            input: ({ target }) => emit('edit-todo', target.value)
          },
        }),
        h(
          'button',
          {
            on: {
              // Saves the edited TODO by dispatching the 'save-edited-todo' command
              click: () => emit('save-edited-todo')
            }
          },
          ['Save']
        ),
        h(
          'button',
          {
            on: {
              // Cancels the edit mode by dispatching the 'cancel-editing-todo' command
              click: () => emit('cancel-editing-todo')
            }
          },
          ['Cancel']
        ),
      ])
    : h('li', {}, [
        // The item in read mode
        h(
          'span',
          {
            on: {
              // Starts editing the TODO by dispatching the 'start-editing-todo' command
              dblclick: () => emit('start-editing-todo', i)
            }
          },
          // The TODO's description coming from the state
          [todo]
        ),
        h(
          'button',
          {
            on: {
              // Removes the TODO by dispatching the 'remove-todo' command
              click: () => emit('remove-todo', i)
            }
          },
          ['Done']
        ),
      ])
}

createApp({state, reducers, view: App}).mount(document.body);