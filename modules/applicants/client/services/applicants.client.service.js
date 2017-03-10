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
        url: '/funnels.json',
        isArray: false,
        method: 'GET',
        params: {
          start_date: '@start_date',
          end_date: '@end_date'
        }
      }
    });

    angular.extend(Applicants, {
      getWorkflows: function() {
        return [
          { id: 'applied', name: 'Applied' },
          { id: 'quiz_started', name: 'Quiz  Started'},
          { id: 'quiz_completed', name: 'Quiz  Completed'},
          { id: 'onboarding_requested', name: 'Onboarding  Requested'},
          { id: 'onboarding_completed', name: 'Onboarding  Completed'},
          { id: 'hired', name: 'Hired' },
          { id: 'rejected', name: 'Rejected' }
        ];
      },
      getFunnel: function (params) {
        params.start_date = moment(params.start_date).format('YYYY-MM-DD')
        params.end_date = moment(params.end_date).format('YYYY-MM-DD')
        return this.funnel(params);
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
