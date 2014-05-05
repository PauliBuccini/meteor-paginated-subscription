Package.describe({
  summary: "A paginated subscription; views a subset of a subscription."
});

Package.on_use(function (api, where) {
  api.use(['session'], 'client');

  api.add_files('paginated_subscription_client.js', 'client');
  api.add_files('paginated_subscription_server.js', 'server');
});
