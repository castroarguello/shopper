// Applicants service used to communicate Applicants REST endpoints
(function () {
  'use strict';

  angular
    .module('applicants')
    .factory('ApplicantsService', ApplicantsService);

  ApplicantsService.$inject = ['$resource'];

  function ApplicantsService($resource) {
    var Applicants = $resource('/api/applicants/:applicantId', {applicantId: '@_id'}, {
      update: {
        method: 'PUT'
      },
      funnel: {
        isArray: true,
        method: 'GET',
        url: '/funnels.json'
      }
    });

    angular.extend(Applicants, {
      getFunnel: function () {
        return this.funnel();
      }
    });

    return Applicants;
  }

  // TODO this should be Applicants service
  angular
    .module('users.admin.services')
    .factory('AdminService', AdminService);

  AdminService.$inject = ['$resource'];

  function AdminService($resource) {
    return $resource('/api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
