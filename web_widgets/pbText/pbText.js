(function () {
  try {
    return angular.module('bonitasoft.ui.widgets');
  } catch(e) {
    return angular.module('bonitasoft.ui.widgets', []);
  }
})().directive('pbText', function() {
    return {
      template: '<p class="text-{{ properties.alignment }}" ng-bind-html="properties.text | uiTranslate"></p>\n'
    };
  });
