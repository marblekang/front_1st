let observers = new Set();
let currentObserver = null;
export const 구독 = (fn) => {
  currentObserver = { fn, key: new Set() };
  observers.add(currentObserver);
  fn(); //durlt
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

const 상태 = 발행기관({ a: 10, b: 20 });

const mockFn1 = () => `a = ${상태.a}`;
const mockFn2 = () => `b = ${상태.b}`;
const mockFn3 = () => `a + b = ${상태.a + 상태.b}`;
const mockFn4 = () => `a * b = ${상태.a * 상태.b}`;
const mockFn5 = () => `a - b = ${상태.a - 상태.b}`;

구독(mockFn1); // 1)
구독(mockFn2);
구독(mockFn3);
구독(mockFn4);
구독(mockFn5);

// 구독을 하면 일단 알림을 받는다.

// 발행기관의 상태가 변경되면 알림을 전송한다.
상태.a = 100;

상태.b = 200;
