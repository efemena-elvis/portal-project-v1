// Function to update state deep values
export function setDeepValue<T extends object>(
  obj: T,
  path: string,
  value: any
): void {
  const keys = path.split(".");
  let current: any = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }

  current[keys[keys.length - 1]] = value;
}

// Function to get state deep values
export function getDeepValue<T extends object, R = any>(
  obj: T,
  path: string
): R | undefined {
  const keys = path.split(".");
  let current: any = obj;

  for (const key of keys) {
    if (current == null || typeof current !== "object") {
      return undefined;
    }
    current = current[key];
  }

  return current as R;
}
