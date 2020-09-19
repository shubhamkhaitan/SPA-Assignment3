(function(){

     angular.module('NarrowDownApp',[])
    .controller('NarrowDownCon',NarrowDownCon)
    .service('MenuSearchService',MenuSearchService)
    .directive('foundItems',FoundDirective)
    .constant('ApiPath',"https://davids-restaurant.herokuapp.com");



    function FoundDirective(){

        var ddo = {
            templateUrl: 'foundItems.html',
            restrict: 'E',
            scope: {
                items: '<',
                onRemove: '&',
                isValid: '<'
            }
        };
        return ddo;
    }

    NarrowDownCon.$inject = ['MenuSearchService'];

    function NarrowDownCon(MenuSearchService){
        var one = this;

        one.valid = true;
        one.searchTerm = "";
        one.found = [];


        one.search = function(){

            if(searchIsEmpty(one.searchTerm)){
                one.found = [];
                one.valid = false;
                alert('Search is empty!!')
                
            }
            else{

            

            var searchForItems = MenuSearchService.getItems(one.searchTerm);


            searchForItems.then(function(res){
                one.found = res;
                // alert(one.found[0].name)

                one.valid = (res.length > 0);
            })
            .catch(function(error){
                console.log("MenuSearchService.getMatchedMenuItems returned an error",error);
            });
        }

        };
            one.removeItem = function (index) {
                one.found.splice(index, 1);
            };
        
        
            function searchIsEmpty (searchString)
            {
                return searchString.replace(/\s/g,"").length === 0;
            };
        
    }

MenuSearchService.$inject = ['$http','ApiPath']

function MenuSearchService ($http, ApiPath){
    var service = this;


    service.getItems = function(searchTerm){

        return $http({
            method: "GET",
            url: (ApiPath +'/menu_items.json')
        }).then(function(response){

            var allmenu = response.data.menu_items;

            return allmenu.filter(function(item){
                var tot = item.name.toLowerCase().includes(searchTerm.toLowerCase()); 

                if(tot.length === false){
                    alert('Menu not Found');
                }
                else{
                    return tot;
                }

            });
        })
        .catch(function(error){
            alert('Menu not found')
            console.log("GET menu_items.json returned an error",error);
        });
    };
}


})();