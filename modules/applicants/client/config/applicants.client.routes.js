(function () {
  'use strict';

  angular
    .module('applicants')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('applicants', {
        abstract: true,
        url: '/applicants',
        template: '<ui-view/>'
      })
      .state('applicants.list', {
        url: '',
        templateUrl: '/modules/applicants/client/views/list-applicants.client.view.html',
        controller: 'ApplicantsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Applicants List'
        }
      })
      .state('applicants.create', {
        url: '/create',
        templateUrl: '/modules/applicants/client/views/form-applicant.client.view.html',
        controller: 'ApplicantsController',
        controllerAs: 'vm',
        resolve: {
          applicantResolve: newApplicant
        },
        data: {
          pageTitle: 'Applicants Create'
        }
      })
      .state('applicants.edit', {
        url: '/:applicantId/edit',
        templateUrl: '/modules/applicants/client/views/form-applicant.client.view.html',
        controller: 'ApplicantsController',
        controllerAs: 'vm',
        resolve: {
          applicantResolve: getApplicant
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Applicant {{ applicantResolve.name }}'
        }
      })
      .state('applicants.view', {
        url: '/:applicantId',
        templateUrl: '/modules/applicants/client/views/view-applicant.client.view.html',
        controller: 'ApplicantsController',
        controllerAs: 'vm',
        resolve: {
          applicantResolve: getApplicant
        },
        data: {
          pageTitle: 'Applicant {{ applicantResolve.name }}'
        }
      });
  }

  getApplicant.$inject = ['$stateParams', 'ApplicantsService'];

  function getApplicant($stateParams, ApplicantsService) {
    return ApplicantsService.get({
      applicantId: $stateParams.applicantId
    }).$promise;
  }

  newApplicant.$inject = ['ApplicantsService'];

  function newApplicant(ApplicantsService) {
    return new ApplicantsService();
  }
}());
