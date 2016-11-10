'use strict';

module.exports = function(list, from, to) {
  if (from && to <= from){
    return list.slice(from, to);
  }
  return list;
};
