export const getChangedFields = (oldObj:any, newObj:any) => {
  const changed: Record<string, any> = {};

  Object.keys(newObj).forEach((key) => {
    const oldVal = oldObj[key];
    const newVal = newObj[key];

    const isDifferent =
      typeof newVal === "object" && newVal !== null
        ? JSON.stringify(oldVal) !== JSON.stringify(newVal)
        : oldVal !== newVal;

    if (isDifferent) {
      changed[key] = newVal;
    }
  });

  return changed;
};
