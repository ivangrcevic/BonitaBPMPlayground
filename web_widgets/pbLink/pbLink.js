(function () {
  try {
    return angular.module('bonitasoft.ui.widgets');
  } catch(e) {
    return angular.module('bonitasoft.ui.widgets', []);
  }
})().directive('pbLink', function() {
    return {
      controllerAs: 'ctrl',
      controller: function PbLinkCtrl($scope, $location, $window) {

  'use strict';

  this.getHref = function getHref() {
    if ($scope.properties.type === 'page') {
      return $window.top.location.href + '../' + $scope.properties.pageToken;
    } else if ($scope.properties.type === 'process') {
      return getPortalUrl() + '/portal/form/process/' + $scope.properties.processName + '/' + $scope.properties.processVersion + '?app=' + getAppToken('app');
    } else if ($scope.properties.type === 'task') {
      return getPortalUrl() + '/portal/form/taskInstance/' + $scope.properties.taskId + '?app=' + getAppToken('app');
    } else if ($scope.properties.type === 'overview') {
      return getPortalUrl() + '/portal/form/processInstance/' + $scope.properties.caseId + '?app=' + getAppToken('app');
    } else {
      return $scope.properties.targetUrl;
    }
  };

  this.getTarget = function getTarget() {
    if ($scope.properties.type === 'page') {
      return '_top';
    }
    return $scope.properties.target;
  };

  function getAppToken(param) {
    if (!$scope.properties.appToken) {
      return getUrlParam(param);
    }
    return $scope.properties.appToken;
  }

  /**
   * Extract the param value from a URL query
   * e.g. if param = "id", it extracts the id value in the following cases:
   *  1. http://localhost/bonita/portal/resource/process/ProcName/1.0/content/?id=8880000
   *  2. http://localhost/bonita/portal/resource/process/ProcName/1.0/content/?param=value&id=8880000&locale=en
   *  3. http://localhost/bonita/portal/resource/process/ProcName/1.0/content/?param=value&id=8880000&locale=en#hash=value
   * @returns {id}
   */
  function getUrlParam(param) {
    var paramValue = $location.absUrl().match('[//?&]' + param + '=([^&#]*)($|[&#])');
    if (paramValue) {
      return paramValue[1];
    }
    return '';
  }

  function getPortalUrl() {
    var locationHref = $location.absUrl();
    var indexOfPortal = locationHref.indexOf('/portal');
    return locationHref.substring(0, indexOfPortal);
  }
}
,
      template: '<div class="text-{{ properties.alignment }}">\n  <a ng-class="properties.buttonStyle !== \'none\' ? \'btn btn-\' + properties.buttonStyle : \'\'" ng-href="{{ctrl.getHref()}}" target="{{ctrl.getTarget()}}" ng-bind-html="properties.text | uiTranslate"></a>\n</div>\n'
    };
  });
