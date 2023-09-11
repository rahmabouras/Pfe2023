export const moveItemWithinArray = (arr, item, newIndex) => {
  const arrClone = [...arr];
  const oldIndex = arrClone.indexOf(item);
  
  // If the item isn't found, just return the original array
  if (oldIndex === -1) {
      return arrClone;
  }

  // Remove the item from the old position
  const [removedItem] = arrClone.splice(oldIndex, 1);

  // If the item was before the new index in the original array,
  // the removal of the item before splice would shift the new index.
  if (oldIndex < newIndex) {
      newIndex -= 1;
  }

  // Insert the item into the new position
  arrClone.splice(newIndex, 0, removedItem);

  return arrClone;
};


export const insertItemIntoArray = (arr, item, index) => {
  const arrClone = [...arr];
  arrClone.splice(index, 0, item);
  return arrClone;
};

export const updateArrayItemById = (arr, itemId, fields) => {
  const arrClone = [...arr];
  const item = arrClone.find(({ id }) => id === itemId);
  if (item) {
    const itemIndex = arrClone.indexOf(item);
    arrClone.splice(itemIndex, 1, { ...item, ...fields });
  }
  return arrClone;
};

export const sortByNewest = (items, sortField) =>
  items.sort((a, b) => -a[sortField].localeCompare(b[sortField]));
