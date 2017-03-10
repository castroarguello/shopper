(function () {
  'use strict';

  angular
    .module('applicants')
    .controller('ApplicantsAnalyticsController', ApplicantsAnalyticsController);

  ApplicantsAnalyticsController.$inject = ['ApplicantsService', 'moment'];

  function ApplicantsAnalyticsController(ApplicantsService, moment) {
    var vm = this;
    vm.workflows = ApplicantsService.getWorkflows();
    vm.start_date = moment().day(1).toDate();
    vm.end_date = moment(vm.date_from).day(7).toDate();
    vm.update = function() {
      vm.funnels = ApplicantsService.getFunnel({
        start_date: vm.start_date,
        end_date: vm.end_date
      });
    }

    vm.update();
  }
}());
