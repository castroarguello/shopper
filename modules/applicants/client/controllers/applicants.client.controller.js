(function () {
  'use strict';

  // Applicants controller
  angular
    .module('applicants')
    .controller('ApplicantsController', ApplicantsController);

  ApplicantsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'applicantResolve',
    'WorkflowsService'];

  function ApplicantsController ($scope, $state, $window, Authentication, applicant, WorkflowsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.applicant = applicant;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.workflows = WorkflowsService.query();

    // Remove existing Applicant
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.applicant.$remove($state.go('applicants.list'));
      }
    }

    // Save Applicant
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.applicantForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.applicant._id) {
        vm.applicant.$update(successCallback, errorCallback);
      } else {
        vm.applicant.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('applicants.view', {
          applicantId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
