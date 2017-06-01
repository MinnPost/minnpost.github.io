/**
 * Main JS for MinnPost.github.io
 *
 * Github limits API requests, so getting all repos for MinnPost organization
 * could be better.
 */
(function($, undefined) {
  // Some "globals"
  var repoURL = 'https://api.github.com/repos/minnpost/[[[REPO_NAME]]]';
  var reposURL = 'https://api.github.com/users/minnpost/repos?page=[[[PAGE]]]&per_page=100';
  var repoSearchURL = 'https://api.github.com/search/repositories?q=[[[REPOS]]]+user:minnpost';
  var orgURL = 'https://api.github.com/orgs/minnpost';
  var templateProjects = $('#template-projects').html();
  var $container = $('.projects');
  var reposData = {};
  var orgData;

  // Specific repos to get with a score (1-10)
  // and a small blurb on the resusability status of project
  var repos = [
    {
      r: 'object-sync-for-salesforce',
      r_score: 10,
      r_status: 'Public plugin for WordPress'
    },
    {
      r: 'legislature-tracker',
      r_score: 9,
      r_status: 'Reusable and launched in multiple states'
    },
    {
      r: 'election-night-api',
      r_score: 8,
      r_status: 'Intended for adaptation to multiple states'
    },
    {
      r: 'jsonproxy',
      r_score: 8,
      r_status: 'Easily deployable on Heroku'
    },
    {
      r: 'gs-proxy',
      r_score: 8,
      r_status: 'Easily deployable on Heroku'
    },
    {
      r: 'all-good-proxy',
      r_score: 8,
      r_status: 'Easily deployable on Heroku'
    },
    {
      r: 'drupal-permissions',
      r_score: 7,
      r_status: 'Reusable'
    },
    {
      r: 'leaflet-addons',
      r_score: 3,
      r_status: 'Could be more tested (not maintained)'
    },
    {
      r: 'mn-boundaryservice',
      r_score: 6,
      r_status: 'Reusable, but specific to Minnesota'
    },
    {
      r: 'jquery-vertical-timeline',
      r_score: 8,
      r_status: 'Reusable'
    },
    {
      r: 'simple-map-d3',
      r_score: 6,
      r_status: 'Not fully tested'
    },
    {
      r: 'tulip',
      r_score: 9,
      r_status: 'Public application'
    },
    {
      r: 'minnpost-styles',
      r_score: 5,
      r_status: 'Could be a good starting point for other organizations'
    },
    {
      r: 'aranger',
      r_score: 9,
      r_status: 'Public application'
    },
    {
      r: 'car-code',
      r_score: 9,
      r_status: 'Public application'
    },
    {
      r: 'mbtiles2s3',
      r_score: 9,
      r_status: 'Easily resuable tool'
    },
    {
      r: 'tilestream-server',
      r_score: 7,
      r_status: 'Reusable instructions'
    }
  ];
  repos = _.sortBy(repos, function(r, ri) {
    return -1 * r.r_score;
  });

  // Set up ractive view
  var view = new Ractive({
    el: $container,
    template: templateProjects,
    data: {
      repos: repos,
      moment: moment
    }
  });

  // Get data from Github
  var requests = [1, 2, 3];
  requests = _.map(requests, function(r, ri) {
    return $.ajax({
      url: reposURL.replace('[[[PAGE]]]', r) + '&callback=?',
      dataType: 'jsonp',
      cache: true
    });
  });
  $.when.apply($, requests).done(function() {
    if (arguments[0][1] === 'success' && !arguments[0][0].data.message) {
      _.each(arguments, function(a, ai) {
        _.each(a[0].data, function(d, di) {
          _.each(repos, function(r, ri) {
            if (r.r === d.name) {
              repos[r] = $.extend(true, r, d);
            }
          });
        });
      });

      view.set('repos', repos);
    }
    else {
      // Error
      view.set('githubError', arguments[0][0].data.message);
    }
  });

})(jQuery);
