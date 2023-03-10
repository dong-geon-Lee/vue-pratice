import { defineStore } from "pinia";

const API_URL = import.meta.env.VITE_APP_TASKS;

export const useTaskStore = defineStore("taskStore", {
  state: () => ({
    tasks: [],
    loading: false,
  }),
  getters: {
    favs: (state) => {
      return state.tasks.filter((t) => t.isFav);
    },
    favCount: (state) => {
      return state.tasks.reduce((p, c) => (c.isFav ? p + 1 : p), 0);
    },
    totalCount: (state) => {
      return state.tasks.length;
    },
  },
  actions: {
    async getTasks() {
      this.loading = true;
      const response = await fetch(`${API_URL}`);
      const data = await response.json();
      this.tasks = data;
      this.loading = false;
    },
    async addTask(task) {
      this.tasks.push(task);

      const response = await fetch(`${API_URL}`, {
        method: "POST",
        body: JSON.stringify(task),
        headers: { "Content-Type": "application/json" },
      });

      if (response.error) console.log(response.error);
    },
    async deleteTask(id) {
      this.tasks = this.tasks.filter((t) => t.id !== id);

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.error) console.log(response.error);
    },
    async toggleFav(id) {
      const task = this.tasks.find((t) => t.id === id);
      task.isFav = !task.isFav;

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(task),
        headers: { "Content-Type": "application/json" },
      });

      if (response.error) console.log(response.error);
    },
  },
});
