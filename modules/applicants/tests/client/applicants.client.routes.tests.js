(function () {
  'use strict';

  describe('Applicants Route Tests', function () {
    // Initialize global variables
    var $scope,
      ApplicantsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ApplicantsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ApplicantsService = _ApplicantsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('applicants');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/applicants');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ApplicantsController,
          mockApplicant;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('applicants.view');
          $templateCache.put('modules/applicants/client/views/view-applicant.client.view.html', '');

          // create mock Applicant
          mockApplicant = new ApplicantsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Applicant Name'
          });

          // Initialize Controller
          ApplicantsController = $controller('ApplicantsController as vm', {
            $scope: $scope,
            applicantResolve: mockApplicant
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:applicantId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.applicantResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            applicantId: 1
          })).toEqual('/applicants/1');
        }));

        it('should attach an Applicant to the controller scope', function () {
          expect($scope.vm.applicant._id).toBe(mockApplicant._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/applicants/client/views/view-applicant.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ApplicantsController,
          mockApplicant;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('applicants.create');
          $templateCache.put('modules/applicants/client/views/form-applicant.client.view.html', '');

          // create mock Applicant
          mockApplicant = new ApplicantsService();

          // Initialize Controller
          ApplicantsController = $controller('ApplicantsController as vm', {
            $scope: $scope,
            applicantResolve: mockApplicant
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.applicantResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/applicants/create');
        }));

        it('should attach an Applicant to the controller scope', function () {
          expect($scope.vm.applicant._id).toBe(mockApplicant._id);
          expect($scope.vm.applicant._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/applicants/client/views/form-applicant.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ApplicantsController,
          mockApplicant;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('applicants.edit');
          $templateCache.put('modules/applicants/client/views/form-applicant.client.view.html', '');

          // create mock Applicant
          mockApplicant = new ApplicantsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Applicant Name'
          });

          // Initialize Controller
          ApplicantsController = $controller('ApplicantsController as vm', {
            $scope: $scope,
            applicantResolve: mockApplicant
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:applicantId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.applicantResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            applicantId: 1
          })).toEqual('/applicants/1/edit');
        }));

        it('should attach an Applicant to the controller scope', function () {
          expect($scope.vm.applicant._id).toBe(mockApplicant._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/applicants/client/views/form-applicant.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
