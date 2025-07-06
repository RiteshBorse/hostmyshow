const areArraysEqual = (arr1, arr2) => {
  if (!arr1 || !arr2 || arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    const obj2 = arr2[i];

    // Simple comparison for primitive values or direct object equality
    if (obj1 === obj2) {
      continue;
    }

    // Deep comparison for objects
    if (typeof obj1 === 'object' && obj1 !== null &&
        typeof obj2 === 'object' && obj2 !== null) {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      if (keys1.length !== keys2.length) {
        return false;
      }

      for (const key of keys1) {
        if (!keys2.includes(key) || obj1[key] !== obj2[key]) {
          return false;
        }
      }
    } else {
      // If not objects and not strictly equal
      return false;
    }
  }
  return true;
};

export { areArraysEqual }; 