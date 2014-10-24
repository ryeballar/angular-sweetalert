(function() {

	'use strict';

	// @ngInject
	function defaultTemplateConfiguration($templateCache) {

		$templateCache.put('sweet-alert.tpl', [
			'<div class="sweet-overlay" ng-class="{\'angularSweetalertOverlayShow\': sweetAlert.state.overlay, \'angularSweetalertOverlayHide\': sweetAlert.state.hideOverlay}"></div>',

			'<div class="sweet-alert" ng-show="sweetAlert.state.show" ng-class="{\'showSweetAlert\': sweetAlert.state.show, \'hideSweetAlert\': sweetAlert.state.hide}" style="display: block">',

				'<ng-include src="sweetAlert.state.icon"></ng-include>',

				'<h2 ng-bind="sweetAlert.state.title"></h2>',
				'<p ng-bind="sweetAlert.state.message"></p>',

				'<button ng-repeat="button in sweetAlert.state.buttons track by $index"',
					'ng-bind="button.text" ng-class="button.class" ng-click="sweetAlert.click(button.callback)"></button>',

			'</div>'
		].join(''));

		$templateCache.put('sweetalert-error-icon.tpl', [
			'<div class="icon error animateErrorIcon">',
				'<span class="x-mark animateXMark">',
					'<span class="line left"></span>',
					'<span class="line right"></span>',
				'</span>',
			'</div>'

		].join(''));

		$templateCache.put('sweetalert-warning-icon.tpl', [
			'<div class="icon warning pulseWarning angularSweetalertPulseWarningIns">',
				'<span class="body"></span>',
				'<span class="dot"></span>',
			'</div>'
		].join(''));

		$templateCache.put('sweetalert-info-icon.tpl', [
			'<div class="icon info"></div>'
		].join(''));

		$templateCache.put('sweetalert-success-icon.tpl', [
			'<div class="icon success animate">',
				'<span class="line tip animateSuccessTip"></span>',
				'<span class="line long animateSuccessLong"></span>',
				'<div class="placeholder"></div>',
				'<div class="fix"></div>',
			'</div>'
		].join(''));
	}

	// @ngInject
	function SweetAlertButtonService() {}

	var sweetButton = function(classes) {
		return function(text, callback) {
			return function(state) {
				state.buttons.push({
					classes: classes,
					text: text,
					callback: callback
				});
			};
		}
	};

	angular.forEach(['info', 'confirm', 'cancel', 'warning'], function(method) {
		SweetAlertButtonService.prototype[method] = sweetButton(method);
	});

	// @ngInject
	function SweetAlertService($q, $timeout, sweetAlertButton) {

		var vm = this,
			state = vm.state,
			tState = vm.temporaryState,
			button = vm.button = sweetAlertButton;

		this.finalize = function() {
			angular.extend(state, tState, {
				hideOverlay: false,
				overlay: true,
				show: true,
				hide: false
			});
			return $q.when(state.deferred.promise);
		};

		this.close = function(hasNext) {
			state.hide = true;
			if(!hasNext) {
				state.hideOverlay = true;
			}
			return $timeout(function() {
				state.overlay = hasNext;
				state.show = hasNext;
			}, 200);
		};

		var sweetAlert = function(method) {
			return function(title, message) {
				var state = this.temporaryState;
				state.icon = 'sweetalert-' + method + '-icon.tpl';
				state.buttons = [];
				state.title = title;
				state.message = message;
				state.deferred = $q.defer();
				return this;
			};
		};

		angular.forEach(['info', 'success', 'warning', 'error'], function(method) {
			vm[method] = sweetAlert(method);
		});
	}

	SweetAlertService.prototype.state = {};
	SweetAlertService.prototype.temporaryState = {};

	SweetAlertService.prototype.pipe = function(pipable) {
		pipable(this.temporaryState);
		return this;
	};

	// ngInject
	function SweetAlertController(sweetAlert, $q) {
		this.state = sweetAlert.state;

		this.click = function(callback) {
			$q.when(callback())
				.then(this.state.deferred.resolve)
				.catch(this.state.deferred.reject);
		};
	}

	// @ngInject
	function sweetAlertDirective() {
		return {
			restrict: 'EA',
			scope: true,
			controller: SweetAlertController,
			controllerAs: 'sweetAlert',
			templateUrl: 'sweet-alert.tpl'
		};
	}

	angular.module('angular-sweetalert', [])
		.run(defaultTemplateConfiguration)
		.service('sweetAlert', SweetAlertService)
		.service('sweetAlertButton', SweetAlertButtonService)
		.directive('sweetAlert', sweetAlertDirective);

})();