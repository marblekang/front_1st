let observers = new Set();
let currentObserver = null;
export const 구독 = (fn) => {
  currentObserver = { fn, keys: new Set() };
  observers.add(currentObserver);
  fn(); // 1) fn 실행 => 2) get 함수 실행 => get 할때마다 (참조하고 있는 property 갯수만큼) 실행되면서 key 추가
};
/* 
발행기관
1) state를 저장함.
2) 
*/
export const 발행기관 = (obj) => {
  let _publisher = {};
  let state = { ...obj };
  const keys = Object.keys(obj);
  function notifySubscribers(key) {
    observers.forEach((val) => {
      if (val.keys.has(key)) {
        val.fn();
      }
    });
  }
  keys.forEach((key) => {
    Object.defineProperty(_publisher, key, {
      get() {
        if (currentObserver) {
          currentObserver.keys.add(key);
        }
        return state[key];
      },
      set(newValue) {
        if (newValue === state[key]) {
          return;
        }
        state[key] = newValue;
        notifySubscribers(key);
      },
    });
  });

  return _publisher;
};
