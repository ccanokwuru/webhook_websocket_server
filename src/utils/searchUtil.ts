type entries = [string, any];

export const deepSearch = (obj: any, key: string, val: any) => {
  const resolved = resolvePath(key);
  let currentItem = obj;

  resolved.forEach((el) => {
    currentItem = currentItem[el];
  });

  if (currentItem === val) return obj;

  if (
    // @ts-ignore
    currentItem &&
    typeof val !== "object" &&
    currentItem.toString().toLowerCase() === val.toString().toLowerCase()
  )
    return obj;

  for (const k in val) {
    // @ts-ignore
    if (Array.isArray(val[k]))
      // @ts-ignore
      for (let i = 0; i < val[k].length; i++)
        // @ts-ignore
        deepSearch(obj, key, val[k]);
    // @ts-ignore
    else if (typeof val[k] === "object")
      // @ts-ignore
      deepSearch(obj, key, val[k]);
  }
};

export const resolvePath = (path: string) =>
  // @ts-ignore
  path.replace(".", "").split(".");

export const deepIterate = (obj: object) => {
  return traverse(obj);
};

export const traverse = (obj: any, path = "", initial: entries[] = []) => {
  for (const key in obj) {
    // @ts-ignore
    const itemPath = `${path}.${key}`;
    const entries: entries = [itemPath, obj[key]];
    if (obj[key] && typeof obj[key] !== "object") initial.push(entries);
    else traverse(obj[key], itemPath, initial);
  }
  return initial;
};
