'use strict';

module.exports = function(list, filterID) {


  var sortByDate = function(a, b) {
    var date1 = a.likes;
    var date2 = b.likes;
    if(date1 <= date2) {
      return -1;
    } else {
      return 1;
    }
    return 0;
  };

  var sortByDate = function(a, b) {
    var date1 = a.date;
    var date2 = b.date;
    if(date1 <= date2) {
      return -1;
    } else {
      return 1;
    }
    return 0;
  };

  var sortByDiscussed = function(a, b) {
    var date1 = a.comments;
    var date2 = b.comments;
    if(date1 < date2) {
      return -1;
    } else {
      return 1;
    }
    return 0;
  };

  if (filterID === 'filter-popular') {
    return list.sort(sortByDate);
  }
  if (filterID === 'filter-new') {
    return list.sort(sortByDate);
  }
  if(filterID === 'filter-discussed') {
    return list.sort(sortByDiscussed);
  }

};
