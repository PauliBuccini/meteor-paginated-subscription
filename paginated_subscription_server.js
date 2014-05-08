Meteor.methods({
  totalRecordsForpagination: function (subName, query) {
    // console.log(subName, query)
    if (subName)
      var count = Collection[subName].find(query,{fields: {_id: 1}}).count() || 0;
    // console.log(count)
    return count ? count : 1;
  }
})
