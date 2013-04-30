var personCtrl = function ($scope) {
    var scope = $scope;
    WAF.onAfterInit = function () {        
        ds.Employee.all().toArray('lastname, firstname, age', {
                	top		 : 40,
                    onSuccess: function (evt) {                               
                        scope.$apply( function() {
                            scope.employees = evt.result;
                            //scope.employees = angular.copy(scope.employees);
                        })
                    } 
         })
	}
}