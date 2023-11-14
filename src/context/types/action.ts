export interface Action<Type = string | number, Payload = any> {
  type: Type;
  payload?: Payload;
  error?: string;
}
