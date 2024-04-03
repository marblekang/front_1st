import { 발행기관 as createPublisher, 구독 } from "./pubsub.js";
export class Store {
  #state;
  #mutations;
  state;
  keys;
  id;

  constructor({ state, mutations, actions }) {
    this.#state = createPublisher(state);
    this.#mutations = Object.assign(mutations);
    this.state = {};
    this.keys = Object.keys(state);

    this.keys.forEach((key) => {
      const that = this;
      Object.defineProperty(this.state, key, {
        get() {
          return that.#state[key];
        },
      });
    });
  }

  commit(action, payload) {
    this.#mutations[action](this.#state, payload);
  }
}

let store = null;
store = new Store({
  state: { a: 10, b: 20 },
  mutations: {
    SET_A(state, payload) {
      state.a = payload;
    },
    SET_B(state, payload) {
      state.b = payload;
    },
  },
});

let inputACount = 0;
let inputBCount = 0;
let calculatorCount = 0;
let appCount = 0;
const InputA = () => {
  inputACount++;
  return `<input id="stateA" value="${store.state.a}" size="5" />`;
};
const InputB = () => {
  inputBCount++;
  return `<input id="stateB" value="${store.state.b}" size="5" />`;
};
const Calculator = () => {
  calculatorCount++;
  return `<p>a + b = ${store.state.a + store.state.b}</p>`;
};
const App = () => {
  appCount++;
  return `${InputA()}<br />${InputB()}<br />${Calculator()}`;
};

구독(InputA);
구독(InputB);
구독(Calculator);
구독(App);

console.log("초기호출 결과");
console.log(inputACount, "a1");
console.log(inputBCount, "b1");
console.log(calculatorCount, "calc1");
console.log(appCount, "app1");
console.log("------------------------------------");

console.log("store.state.a의 값만 변경되는 경우");
console.log("값 변경 전");
console.log(inputACount, "a");
console.log(inputBCount, "b");
console.log(calculatorCount, "calc");
console.log(appCount, "app");

store.commit("SET_A", 100);
console.log("값 변경 후");
console.log(inputACount, "a");
console.log(inputBCount, "b");
console.log(calculatorCount, "calc");
console.log(appCount, "app");

console.log("------------------------------------");

console.log("store.state.a와 b의 값이 각각 변경는 경우");
console.log("값 변경 전");
console.log(inputACount, "a");
console.log(inputBCount, "b");
console.log(calculatorCount, "calc");
console.log(appCount, "app");
console.log("값 A 변경");
store.commit("SET_A", 100);
console.log(inputACount, "a");
console.log(inputBCount, "b");
console.log(calculatorCount, "calc");
console.log(appCount, "app");
console.log("------------------------------------");
console.log("값 B 변경");
store.commit("SET_B", 200);
console.log(inputACount, "a");
console.log(inputBCount, "b");
console.log(calculatorCount, "calc");
console.log(appCount, "app");
