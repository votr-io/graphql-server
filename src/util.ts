export type RecursiveRequired<T> = {
  [P in keyof T]-?: T[P] extends (infer U)[]
    ? Required<U>[]
    : T[P] extends object
    ? Required<T[P]>
    : T[P];
};

//helper function to take an array of something with ids on it and turn it into a Record keyed by that id
export function keyById<T extends { id: string }>(tt: T[]) {
  return tt.reduce<Record<string, T>>((acc, t) => {
    acc[t.id] = t;
    return acc;
  }, {});
}
