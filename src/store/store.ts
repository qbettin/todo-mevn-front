import { createStore } from 'vuex';
import * as serviceUtil from '@/util/serviceUtil';
import { Todo } from '@/entity/todo';

export default createStore({
    state: {
        currentUser: localStorage.getItem('currentUser') || null as string | null,
        todos: [] as Todo[],
    },
    mutations: {
        setUser(state, user: string) {
            state.currentUser = user;
            // Persist the user to localStorage
            localStorage.setItem('currentUser', user);
        },
        clearUser(state) {
            state.currentUser = null;
            localStorage.removeItem('currentUser');
        },
        setTodos(state, todos: Todo[]) {
            state.todos = todos;
        },
        addTodo(state, todo: Todo) {
            state.todos.push(todo);
        },
        updateTodo(state, updatedTodo: Todo) {
            const index = state.todos.findIndex(todo => todo._id === updatedTodo._id);
            if (index !== -1) {
                state.todos.splice(index, 1, updatedTodo);
            }
        },
        removeTodo(state, id: string) {
            state.todos = state.todos.filter(todo => todo._id !== id);
        },
    },
    actions: {
        async login({ commit }, { username, password }) {
            await serviceUtil.loginUser(username, password);
            commit('setUser', username);
        },
        async register({ commit }, { username, password }) {
            await serviceUtil.registerUser(username, password);
        },
        async logout({ commit }) {
            // Clear the currentUser from both the store and localStorage
            commit('clearUser');
        },
        async loadTodos({ commit }) {
            const todos = await serviceUtil.loadTodos();
            commit('setTodos', todos);
        },
        async createTodo({ commit }, task: string) {
            const todo = await serviceUtil.createTodo(task);
            if (todo !== undefined || null) {
                commit('addTodo', todo);
            }
        },
        async editTodo({ commit }, { id, task, completed }: { id: string; task: string; completed: boolean }) {
            const updatedTodo = await serviceUtil.editTodo(id, task, completed);
            commit('updateTodo', updatedTodo);
        },
        async deleteTodo({ commit }, id: string) {
            await serviceUtil.deleteTodo(id);
            commit('removeTodo', id);
        },
    },
    getters: {
        getTodos(state) {
            return state.todos;
        },
        getCurrentUser(state) {
            // Always return the current user from localStorage if available
            return state.currentUser || localStorage.getItem('currentUser');
        },
    },
});
