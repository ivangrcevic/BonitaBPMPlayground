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
        //Create message digest with SHA1
        // TODO : USAR HMAC!!!!
        var md = forge.md.sha1.create();
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
            "signButton.text": "Firmar",
            "psswdPromt.text": "Ingrese contraseña... "
        },
        "en": {
            "label.text": "Sign with certificate:",
            "signButton.text": "Sign",
            "psswdPromt.text": "Enter Password... "
        }
    };
    var LANGUAGE = "es";
    
    $scope.texts = TEXTS[LANGUAGE];
    
    var fileInput = $element.find("input")[0]
    fileInput.onchange = function (changeEvent) {
        $scope.$apply(function() {
            $scope.file = changeEvent.target.files[0];
        });
    };
    
    $scope.sign = function (){
        promptForPassword().then(function (password){
            doLoadPrivateKeyFromPEM($scope.file, password).then(function (privateKey){
                if(privateKey){
                    var textToSign = JSON.stringify($scope.properties.formOutput)
                    $scope.value = doSign(privateKey, textToSign);    
                } else {
                    alert("Invalid password");
                }
            });
        }, function (err){
            console.log(err);
        });
    }
 
 
},
      template: '<!-- The custom widget template is defined here\n   - You can use standard HTML tags and AngularJS built-in directives, scope and interpolation system\n   - Custom widget properties defined on the right can be used as variables in a templates with properties.newProperty\n   - Functions exposed in the controller can be used with ctrl.newFunction()\n   - You can use the \'environment\' property injected in the scope when inside the Editor whiteboard. It allows to define a mockup\n     of the Custom Widget to be displayed in the whiteboard only. By default the widget is represented by an auto-generated icon\n     and its name (See the <span> below).\n-->\n\n    <div class="digital-signature-uic">\n        <span ng-if="environment"><identicon name="{{environment.component.id}}" size="30" background-color="[255,255,255, 0]" foreground-color="[51,51,51]"></identicon> {{environment.component.name}}</span>\n        <p>{{properties.value}}</p>\n        <p>{{properties.formOutput}}</p>\n        <p><label for="file">{{texts[\'label.text\']}}</label></p>\n        <input type="file" class="file-loader" name="file" > \n        <button type="button" class="sign-button" ng-click="sign()" ng-hide="!file"> \n           {{texts[\'signButton.text\']}} \n        </button>\n    </div>\n\n<!-- \n    \n    \n    <div style="color: {{ properties.color }}; background-color: {{ backgroudColor }}" ng-click="ctrl.toggleBackgroundColor()">\n        Value is:  <i>{{ properties.value }}</i>. Click me to toggle background color\n    </div>\n-->'
    };
  });
