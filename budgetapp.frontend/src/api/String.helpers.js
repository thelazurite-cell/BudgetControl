export function randstring() {
  return `${Math.random()
    .toString(36)
    .replace(/[^A-z]+/g, "")
    .substring(0, 16)}-${Math.floor(1000 + Math.random() * 9000)}`;
}
