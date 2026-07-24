import { useState } from "react";

let listeners = [];
let memoryState = { toasts: [] };

function dispatch(state) {
  memoryState = state;
  listeners.forEach((listener) => listener(memoryState));
}

export function toast({ title, description, variant }) {
  const id = Date.now().toString();

  dispatch({
    toasts: [
      ...memoryState.toasts,
      {
        id,
        title,
        description,
        variant,
      },
    ],
  });

  setTimeout(() => {
    dispatch({
      toasts: memoryState.toasts.filter((t) => t.id !== id),
    });
  }, 4000);
}

export function useToast() {
  const [state, setState] = useState(memoryState);

  if (!listeners.includes(setState)) {
    listeners.push(setState);
  }

  return {
    ...state,
    toast,
  };
}