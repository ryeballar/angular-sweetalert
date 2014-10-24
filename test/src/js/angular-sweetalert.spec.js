describe('angular-sweetalert', function() {

	'use strict';

	beforeEach(module('angular-sweetalert'));

	describe('service', function() {

	});

	describe('directive', function() {

	});

	describe('templates', function() {

		var $templateCache;

		beforeEach(inject(function(_$templateCache_) {
			$templateCache = _$templateCache_;
		}));

		it('should test the templates', function() {

			expect($templateCache.get('sweetalert-error-icon.tpl')).toBeDefined();

		});
	});

});