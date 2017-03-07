(function () {
  'use strict';

  angular
    .module('workflows')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Workflows',
      state: 'workflows',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'workflows', {
      title: 'List Workflows',
      state: 'workflows.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'workflows', {
      title: 'Create Workflow',
      state: 'workflows.create',
      roles: ['user']
    });
  }
}());
