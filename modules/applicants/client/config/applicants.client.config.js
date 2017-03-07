(function () {
  'use strict';

  angular
    .module('applicants')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Applicants',
      state: 'applicants',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'applicants', {
      title: 'List Applicants',
      state: 'applicants.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'applicants', {
      title: 'Create Applicant',
      state: 'applicants.create',
      roles: ['user']
    });
  }
}());
