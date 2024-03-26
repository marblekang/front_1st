let observers = new Set();
let currentObserver = null;
export const 구독 = (fn) => {
  currentObserver = { fn, key: new Set() };
  observers.add(currentObserver);
  fn();
};

export const 발행기관 = (obj) => {
  let _publisher = {};
  const keys = Object.keys(obj);
  function notifySubscribers(key) {
    observers.forEach((val) => {
      if (val.key.has(key)) val.fn();
    });
  }
  keys.forEach((key) => {
    Object.defineProperty(_publisher, key, {
      get() {
        if (currentObserver) {
          currentObserver.key.add(key);
        }
        return obj[key];
      },
      set(newValue) {
        obj[key] = newValue;

        notifySubscribers(key);
      },
    });
  });

  return _publisher;
};
