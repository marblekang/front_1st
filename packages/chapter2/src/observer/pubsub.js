let currentObserver = null;
export const 구독 = (fn) => {
  currentObserver = fn;
  fn();
  currentObserver = null;
};

export const 발행기관 = (obj) => {
  let _publisher = {};
  const keys = Object.keys(obj);

  keys.forEach((key) => {
    let observers = new Set();
    Object.defineProperty(_publisher, key, {
      get() {
        if (currentObserver) {
          observers.add(currentObserver);
        }
        return obj[key];
      },
      set(newValue) {
        obj[key] = newValue;
        observers.forEach((fn) => fn());
      },
    });
  });

  return _publisher;
};
