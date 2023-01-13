export function formatJsonNull<T = any>(origin = {}): T {
  return JSON.parse(JSON.stringify(origin).replace(/:null,/g, ':"",'));
}
