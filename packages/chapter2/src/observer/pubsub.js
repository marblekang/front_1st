let currentObserver = null;
let observers = {};
export const 구독 = (fn) => {
  currentObserver = fn;
  fn(); // 이거 돌면서 get은 참조하는 key 갯수만큼 실행됨.
  // 참조 (구독) 은 초기에 한번만 실행되면 됨.
  currentObserver = null;
};
// observer를 이런식으로 관리할것임 observer = {a:[],b:[]}
export const 발행기관 = (obj) => {
  let _publisher = {};
  const keys = Object.keys(obj);
  const notifyObservers = (key) => {
    observers[key].forEach((fn) => fn());
  };
  keys.forEach((key) => {
    Object.defineProperty(_publisher, key, {
      get() {
        if (currentObserver) {
          if (!observers[key]) {
            observers[key] = new Set();
          }
          observers[key].add(currentObserver);
        }
        return obj[key];
      },
      set(newValue) {
        obj[key] = newValue;
        notifyObservers(key);
      },
    });
  });
  return _publisher;
};
