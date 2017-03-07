// Applicants service used to communicate Applicants REST endpoints
(function () {
  'use strict';

  angular
    .module('applicants')
    .factory('ApplicantsService', ApplicantsService);

  ApplicantsService.$inject = ['$resource'];

  function ApplicantsService($resource) {
    return $resource('api/applicants/:applicantId', {
      applicantId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
