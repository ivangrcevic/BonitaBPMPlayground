(function () {
  try {
    return angular.module('bonitasoft.ui.widgets');
  } catch(e) {
    return angular.module('bonitasoft.ui.widgets', []);
  }
})().directive('customFirmaDigital', function() {
    return {
      controllerAs: 'ctrl',
      controller: /**
 * The controller is a JavaScript function that augments the AngularJS scope and exposes functions that can be used in the custom widget template
 * 
 * Custom widget properties defined on the right can be used as variables in a controller with $scope.properties
 * To use AngularJS standard services, you must declare them in the main function arguments.
 * 
 * You can leave the controller empty if you do not need it.
 */
function digitalSignatureController($scope, $element, $q) {
    
    function doLoadPrivateKeyFromPEM (pemFile, password) {
        var deferred = $q.defer();
        //load file
        var reader = new FileReader();
        reader.onload = (function (){
            return function(evt) {
                var content = evt.target.result;
                var privateKey = forge.pki.decryptRsaPrivateKey(content, password);
                deferred.resolve(privateKey);
            };
        })();
        reader.readAsBinaryString(pemFile);
        return deferred.promise;
    }
    
    function doSign (privateKey, string) {
        //Create message digest with SHA512 (SHA-2)
        var md = forge.md.sha512.create();
        md.update(string);
        //sign with RSA algorithm (default)
        return privateKey.sign(md);
    }
    
    function promptForPassword() {
        var deferred = $q.defer();

        var password  = window.prompt($scope.texts["psswdPromt.text"]);
        deferred.resolve(password);

        return deferred.promise;
    }
    
    
    var TEXTS = {
        "es": {
            "label.text": "Firmar con certificado:",
            "label.password": "Contraseña:",
            "error.text": "Contraseña incorrecta o clave privada inválida.",
            "success.text": "Firma generada correctamente.",
            "signButton.text": "Firmar"
        },
        "en": {
            "label.text": "Sign with certificate:",
            "label.password": "Password:",
            "error.text": "Wrong password or invalid private key file.",
            "success.text": "Signature successfully generated.",
            "signButton.text": "Sign"
        }
    };
    var LANGUAGE = "es";
    
    $scope.signSuccess = false;
    $scope.errorFound = false;
    $scope.texts = TEXTS[LANGUAGE];
    $scope.password = "";
    
    var fileInput = $element.find("input")[0]
    fileInput.onchange = function (changeEvent) {
        $scope.$apply(function() {
            $scope.file = changeEvent.target.files[0];
        });
    };

    $scope.sign = function (){
        $scope.signSuccess = false;
        $scope.errorFound = false;
        doLoadPrivateKeyFromPEM($scope.file, $scope.password).then(function (privateKey){
            if(privateKey){
                var jsonData = JSON.stringify($scope.properties.formOutput);
                var textToSign = btoa(unescape(encodeURIComponent(jsonData)));
                var signatureString = btoa(doSign(privateKey, textToSign));
                console.log("json Data " + jsonData);
                console.log("textToSign " + textToSign);
                console.log("signature " + signatureString);
                $scope.properties.value = signatureString;
                $scope.signSuccess = true;
            } else {
                $scope.errorFound = true;
            }
        }, function (error) {
            $scope.errorFound = true;
        });
    }
 
 
},
      template: '<!-- The custom widget template is defined here\n   - You can use standard HTML tags and AngularJS built-in directives, scope and interpolation system\n   - Custom widget properties defined on the right can be used as variables in a templates with properties.newProperty\n   - Functions exposed in the controller can be used with ctrl.newFunction()\n   - You can use the \'environment\' property injected in the scope when inside the Editor whiteboard. It allows to define a mockup\n     of the Custom Widget to be displayed in the whiteboard only. By default the widget is represented by an auto-generated icon\n     and its name (See the <span> below).\n-->\n\n    <div class="digital-signature-uic">\n        <span ng-if="environment"><identicon name="{{environment.component.id}}" size="30" background-color="[255,255,255, 0]" foreground-color="[51,51,51]"></identicon> {{environment.component.name}}</span>\n        <p><label for="file">{{texts[\'label.text\']}}</label></p>\n        <input type="file" class="file-loader" name="file" > \n        <div>\n            <label for="keyFilePassword">{{texts[\'label.password\']}}</label>\n            <input type="password" name="keyPassword" ng-model="password" id="keyFilePassword" ng-disabled="!file"/>\n            <button type="button" class="sign-button" ng-click="sign()" ng-disabled="!file">\n                {{texts[\'signButton.text\']}}\n            </button>\n        </div>\n        <div class="error-text" ng-show="errorFound">\n            {{texts[\'error.text\']}}\n        </div>\n        <div class="success-text" ng-show="signSuccess">\n            {{texts[\'success.text\']}}\n        </div>\n    </div>\n\n<!-- \n    \n    \n    <div style="color: {{ properties.color }}; background-color: {{ backgroudColor }}" ng-click="ctrl.toggleBackgroundColor()">\n        Value is:  <i>{{ properties.value }}</i>. Click me to toggle background color\n    </div>\n-->'
    };
  });
