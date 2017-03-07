(function () {
  'use strict';

  angular
    .module('applicants')
    .controller('ApplicantsListController', ApplicantsListController);

  ApplicantsListController.$inject = ['ApplicantsService'];

  function ApplicantsListController(ApplicantsService) {
    var vm = this;

    vm.applicants = ApplicantsService.query();
  }
}());
