'use strict';

module.exports = function(list, filterID) {

  var sortByLikes = function(a, b) {
    return a.likes <= b.likes;
  };

  var sortByDate = function(a, b) {
    return a.date <= b.date;
  };

  var sortByDiscussed = function(a, b) {
    return a.comments <= b.comments;
  };

  if (filterID === 'filter-popular') {
    return list.sort(sortByLikes);
  }
  if (filterID === 'filter-new') {
    return list.sort(sortByDate);
  }
  if(filterID === 'filter-discussed') {
    return list.sort(sortByDiscussed);
  }

};
