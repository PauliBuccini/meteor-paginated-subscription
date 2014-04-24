Meteor.methods({
  totalRecordsForpagination: function (subName) {
    return subName ? Collection[subName].find({},{fields: {_id: 1}}).count() : 66;
  }
})
