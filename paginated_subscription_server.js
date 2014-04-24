Meteor.methods({
  totalRecordsForpagination: function (subName, query) {
    return subName ? Collection[subName].find(query,{fields: {_id: 1}}).count() : 66;
  }
})
