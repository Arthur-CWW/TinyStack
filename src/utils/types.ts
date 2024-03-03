export type Undefinable<T> = {
  [P in keyof T]: null extends T[P] ? T[P] | undefined : T[P];
};
