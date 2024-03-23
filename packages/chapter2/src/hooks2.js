export function createHooks(callback) {
  const stateContext = {
    current: 0,
    states: [],
  };

  const memoContext = {
    current: 0,
    memos: [],
  };

  const batchingContext = {
    newStates: [],
  };
  function resetContext() {
    stateContext.current = 0;
    memoContext.current = 0;
  }

  const useState = (initState) => {
    const { current, states } = stateContext;
    stateContext.current += 1;
    states[current] = states[current] ?? initState;

    const setState = (newState) => {
      if (newState === states[current]) return;
      batchingContext.newStates.push(newState);
      requestAnimationFrame(() => {
        let lastIndex = batchingContext.newStates.length - 1;
        if (newState === batchingContext.newStates[lastIndex]) {
          states[current] = newState;
          callback();
        }
      });
    };

    return [states[current], setState];
  };

  const useMemo = (fn, refs) => {
    const { current, memos } = memoContext;
    memoContext.current += 1;

    const memo = memos[current];

    const resetAndReturn = () => {
      const value = fn();
      memos[current] = {
        value,
        refs,
      };
      return value;
    };

    if (!memo) {
      return resetAndReturn();
    }

    if (refs.length > 0 && memo.refs.find((v, k) => v !== refs[k])) {
      return resetAndReturn();
    }
    return memo.value;
  };

  return { useState, useMemo, resetContext };
}
const waitOneFrame = () =>
  new Promise((resolve) => requestAnimationFrame(resolve));

const getRender = async () => {
  let currentState = null;
  const render = () => {
    resetContext();
    const [a, setA] = useState("foo");
    currentState = a;
    return { setA };
  };

  const { useState, resetContext } = createHooks(render);

  const { setA } = render();
  // expect(render).toBeCalledTimes(1);

  setA("test1");
  setA("test2");
  setA("test3");
  setA("test4");
  setA("test5");
  await waitOneFrame();
  console.log(currentState, "currentState");
};

getRender();
