(function () {
  'use strict';

  // Workflows controller
  angular
    .module('workflows')
    .controller('WorkflowsController', WorkflowsController);

  WorkflowsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'workflowResolve'];

  function WorkflowsController ($scope, $state, $window, Authentication, workflow) {
    var vm = this;

    vm.authentication = Authentication;
    vm.workflow = workflow;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Workflow
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.workflow.$remove($state.go('workflows.list'));
      }
    }

    // Save Workflow
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.workflowForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.workflow._id) {
        vm.workflow.$update(successCallback, errorCallback);
      } else {
        vm.workflow.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('workflows.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
