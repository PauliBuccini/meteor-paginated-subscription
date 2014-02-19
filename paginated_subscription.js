PaginatedSubscriptionHandle = function(perPage) {

  this.perPage = perPage;
  //  Initinal skip number same as per page
  this.skipNumber = perPage;
  this._limit = perPage;
  this._limitListeners = new Deps.Dependency();
  this._loaded = 0;
  this._loadedListeners = new Deps.Dependency();
  //  How many skipped items
  this._skip = 0;
  //  How many times skipped
  this._skipTimes = 0;
  this._skipTimesListeners = new Deps.Dependency();
  //  How many times loaded, as a helper for skip method
  this._loadedTimes = 0;
}

PaginatedSubscriptionHandle.prototype.loaded = function() {
  this._loadedListeners.depend();
  return this._loaded;
}

PaginatedSubscriptionHandle.prototype.limit = function() {
  this._limitListeners.depend();
  return this._limit;
}

PaginatedSubscriptionHandle.prototype.ready = function() {
  return this.loaded() === this.limit();
}

// deprecated
PaginatedSubscriptionHandle.prototype.loading = function() {
  return ! this.ready();
}

PaginatedSubscriptionHandle.prototype.loadNextPage = function() {
  this._limit += this.perPage;
  this._limitListeners.changed();
  // how many Loads
  this._loadedTimes ++;

  this._skipTimes = this._loadedTimes - 1;
}

PaginatedSubscriptionHandle.prototype.done = function() {
  // XXX: check if subs that are canceled before they are ready ever fire ready?
  // if they do we need to increase loaded by perPage, not set it to limit
  //  dadeta skip cancelingas
  this._loaded = this._limit;
  this._skipTimes = this._skipTimes;
  this._loadedListeners.changed();
  this._skipTimesListeners.changed();
}

PaginatedSubscriptionHandle.prototype.reset = function() {
  this._loadedTimes = 0;
  this._limit = this.perPage;
  this._limitListeners.changed();

  this._skip = 0;
  //  How many times skipped
  this._skipTimes = 0;
  this._skipTimesListeners.changed();
}
//  How many items to skip
PaginatedSubscriptionHandle.prototype.skip = function() {
 this._skipTimesListeners.depend();
  this._skip = this._skipTimes * this.skipNumber || 0;
  return this._skip;
}

//  Load skipped files
PaginatedSubscriptionHandle.prototype.loadPreviuosPage = function() {

  if ((this._loaded - this._skip) === this.perPage * 2 ) {
    this._loadedTimes --;
    this._skipTimes --;
    this._skipTimesListeners.changed();
  this._limit -= this.perPage;
  this._limitListeners.changed();
  }
}


// XXX: deal with last argument being a callback
Meteor.subscribeWithPagination = function (/*name, arguments, perPage */) {
  var args = Array.prototype.slice.call(arguments, 0);
  var perPage = args.pop();
  var handle = new PaginatedSubscriptionHandle(perPage);

  Meteor.autorun(function() {
    var ourArgs = _.map(args, function(arg) {
      return _.isFunction(arg) ? arg() : arg;
    });

    var subHandle = Meteor.subscribe.apply(this, ourArgs.concat([
      handle.limit(), function() { handle.done(); }
    ]));
    handle.stop = subHandle.stop;
  });

  return handle;
}
