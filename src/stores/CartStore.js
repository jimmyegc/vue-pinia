import { defineStore, acceptHMRUpdate } from "pinia";
import { groupBy } from "lodash";
import { useAuthUserStore } from "./AuthStore";

export const useCartStore = defineStore("CartStore", {
  state: () => {
    return {
      items: [],
      test: "hello world",
    };
  },
  getters: {
    count: (state) => state.items.length,
    isEmpty: (state) => state.count === 0,
    grouped: (state) => {
      const grouped = groupBy(state.items, (item) => item.name);
      const sorted = Object.keys(grouped).sort();
      let inOrder = {};
      sorted.forEach((key) => (inOrder[key] = grouped[key]));
      return inOrder;
    },
    groupCount: (state) => (name) => state.grouped[name].length,
    total: (state) => state.items.reduce((p, c) => p + c.price, 0),
  },
  actions: {
    checkout() {
      const userAuthUserStore = useAuthUserStore();
      alert(
        `${userAuthUserStore.username} bought ${this.count} items at a total of $ ${this.total}`
      );
    },
    addItems(count, item) {
      count = parseInt(count);
      //throw new Error("example error");
      for (let index = 0; index < count; index++) {
        this.items.push({ ...item });
      }
    },
    clearItem(itemName) {
      this.items = this.items.filter((item) => item.name != itemName);
    },
    setItemCount(item, count) {
      this.clearItem(item.name);
      this.addItems(count, item);
    },
  },
});

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot));
}
