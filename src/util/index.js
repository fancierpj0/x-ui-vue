const findByField = (which, value, field='id') => {
  return which.filter(item => item[field] === value)[0];
};

const findInDeepByField = (which, value, field='id') => {
  let noChildren = [];
  let hasChildren = [];
  which.forEach(item => {
    if (item.children) {
      hasChildren.push(item);
    } else {
      noChildren.push(item);
    }
  });
  let found = findByField(noChildren, value);
  if (found) {
    return found;
  } else {
    found = findByField(hasChildren, value);
    if (found) {
      return found
    } else {
      for(let i=0;i<hasChildren.length;++i){
        let found = findInDeepByField(hasChildren[i].children, value, field);
        if(found) return found;
      }
    }
    return undefined;
  }
};

export {findByField,findInDeepByField}
