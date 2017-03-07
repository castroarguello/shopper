(function () {
  'use strict';

  angular
    .module('applicants')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Shopper Applications',
      state: 'applicants',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'applicants', {
      title: 'List Applications',
      state: 'applicants.list',
      roles: ['user']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'applicants', {
      title: 'My Applications',
      state: 'applicants.my',
      roles: ['*']
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'applicants', {
      title: 'Create Application',
      state: 'applicants.create',
      roles: ['*']
    });
  }
}());
