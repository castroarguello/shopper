'use strict';

describe('Applicants E2E Tests:', function () {
  describe('Test Applicants page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/applicants');
      expect(element.all(by.repeater('applicant in applicants')).count()).toEqual(0);
    });
  });
});
