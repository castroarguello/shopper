(function () {
  'use strict';

  angular
    .module('workflows')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('workflows', {
        abstract: true,
        url: '/workflows',
        template: '<ui-view/>'
      })
      .state('workflows.list', {
        url: '',
        templateUrl: '/modules/workflows/client/views/list-workflows.client.view.html',
        controller: 'WorkflowsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Workflows List'
        }
      })
      .state('workflows.create', {
        url: '/create',
        templateUrl: '/modules/workflows/client/views/form-workflow.client.view.html',
        controller: 'WorkflowsController',
        controllerAs: 'vm',
        resolve: {
          workflowResolve: newWorkflow
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Workflows Create'
        }
      })
      .state('workflows.edit', {
        url: '/:workflowId/edit',
        templateUrl: '/modules/workflows/client/views/form-workflow.client.view.html',
        controller: 'WorkflowsController',
        controllerAs: 'vm',
        resolve: {
          workflowResolve: getWorkflow
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Workflow {{ workflowResolve.name }}'
        }
      })
      .state('workflows.view', {
        url: '/:workflowId',
        templateUrl: '/modules/workflows/client/views/view-workflow.client.view.html',
        controller: 'WorkflowsController',
        controllerAs: 'vm',
        resolve: {
          workflowResolve: getWorkflow
        },
        data: {
          pageTitle: 'Workflow {{ workflowResolve.name }}'
        }
      });
  }

  getWorkflow.$inject = ['$stateParams', 'WorkflowsService'];

  function getWorkflow($stateParams, WorkflowsService) {
    return WorkflowsService.get({
      workflowId: $stateParams.workflowId
    }).$promise;
  }

  newWorkflow.$inject = ['WorkflowsService'];

  function newWorkflow(WorkflowsService) {
    return new WorkflowsService();
  }
}());
