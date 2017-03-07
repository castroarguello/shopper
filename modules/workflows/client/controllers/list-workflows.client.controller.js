(function () {
  'use strict';

  angular
    .module('workflows')
    .controller('WorkflowsListController', WorkflowsListController);

  WorkflowsListController.$inject = ['WorkflowsService'];

  function WorkflowsListController(WorkflowsService) {
    var vm = this;

    vm.workflows = WorkflowsService.query();
  }
}());
