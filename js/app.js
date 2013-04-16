/**
 * Main JS for MinnPost.github.io
 *
 * Github limits API requests, so getting all repos for MinnPost organization
 * could be better.
 */
(function($, undefined) {
  // Some "globals"
  var repoURL = 'https://api.github.com/repos/minnpost/[[[REPO_NAME]]]';
  var orgURL = 'https://api.github.com/orgs/minnpost';
  var templateRepos = '#template-repos';
  var templateError = '#template-error';
  var container = '#repos';
  var reposData = {};
  var orgData;
  
  // Specific repos to get with a score (1-10)
  // and a small blurb on the resusability status of project
  var repos = {
    'legislature-tracker': {
      r_score: 3,
      r_status: 'Being updated for resuse'
    },
    'jsonproxy': {
      r_score: 9,
      r_status: 'Easily deployable on Heroku'
    },
    'gs-proxy': {
      r_score: 8,
      r_status: 'Easily deployable on Heroku'
    },
    'leaflet-addons': {
      r_score: 4,
      r_status: 'Could be more tested'
    },
    'mn-boundaryservice': {
      r_score: 6,
      r_status: 'Reusable, but specific to Minnesota'
    },
    'jquery-vertical-timeline': {
      r_score: 8,
      r_status: 'Reusable'
    },
    'simple-map-d3': {
      r_score: 5,
      r_status: 'Not fully tested'
    }
  };
  
  // Make deferred repo call
  function repoDeferred(repoID) {
    return $.ajax({
      url: repoURL.replace('[[[REPO_NAME]]]', repoID) + '?callback=?',
      dataType: 'jsonp',
      cache: true
    });
  };
  
  // Main callback when all is loaded
  function display() {
    console.log(reposData);
    
    if (!reposData[0].message) {
      $(container).html(templateRepos({ repos: reposData }));
    }
    else {
      displayError(reposData[0].message);
    }
  };
  
  // Handle error
  function displayError(error) {
    $(container).html(templateError({ error: error }));
  };
  
  // Page load
  $(document).ready(function() {
    // Make template from HTML
    templateRepos = _.template($(templateRepos).html());
    templateError = _.template($(templateError).html());
    
    // Get repo data
    var deferreds = [];
    _.each(repos, function(r, k) {
      deferreds.push(repoDeferred(k));
    });
    $.when.apply($, deferreds)
      .done(function() {
        _.each(arguments, function(a) {
          if (a[0].data && a[0].data.message != 'Not Found') {
            reposData[a[0].data.name] = a[0].data;
            _.extend(reposData[a[0].data.name], repos[a[0].data.name]);
          }
        });
        
        // Sort by score
        reposData = _.sortBy(reposData, function(r) { return -1 * r.r_score; });
        
        display();
      })
      .fail(function() {
        displayError('Issue getting data from Github API.');
      });
  });
})(jQuery);