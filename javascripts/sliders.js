$('#lang').on('change', function(){
    $("#lang option").each(function() {
        $('#' + $(this).val()).hide();
    });
    $('#' + $(this).val()).show();
});

var tableApp = angular.module('TableApp', []);

tableApp.directive('scoreRow', function(){
    return {
        restrict: 'A',
        replace: true,
        link: function(scope, element, attrs) {
            scope.weight = 100;
            scope.score = scope.$parent.score;
            scope.languages = scope.$parent.languages;
            scope.$watch('weight', function(n, old){
                if(n !== old){
                    scope.languages.map(function(l){
                        scope.languageFn()(l).weight = n;
                    });

                    scope.$parent.updateTotals();
                }
            });
        },
        scope: {
            languageFn: '&',
            name: '='
        },
        template: '<tr> <td>{{name}}</td><td><span ng-show="$parent.showWeights">{{weight}}%  <input ng-model="weight" type="range" min="0" step="10" max="100" /></span></td> <td ng-repeat="lang in languages">  {{ score(languageFn()(lang), weight) }}  </td> </tr>'
    };
});

tableApp.controller('TableCtrl', function ($scope) {
    $scope.$watch('enforcedScore', function(n, old){
        if(n !== old){
            $scope.updateTotals();
        }
    });

    $scope.enforcedScore = 30;
    $scope.inabilityPenalty = 30;
    $scope.showWeights = false;
    $scope.langtotals = [];

    $scope.cleanCode = function(c){
        var t = c.replace(/<![a-zA-Z-]+!>/g, "");
        return t.replace(/\s/g, "");
    };

    $scope.score = function(t){
        if (!t.weight) { t.weight = 100;}
        var count = 0;
        var delta = 0;
        if (typeof t.rawCode === "undefined" && !t.rawCode) {
            if (t.enforced === "yes") {
                delta = -$scope.enforcedScore;
            } else if (t.enforced === "no"){
                delta = $scope.inabilityPenalty;
            } else if (t.enforced === "warn"){
                delta = 0;
            }
        } else {
            delta = t.enforced === "yes" ? -$scope.enforcedScore : 0;
            count = $scope.cleanCode(t.rawCode).length;
        }
        return Math.ceil((t.weight / 100) * (count + delta));
    };


    $scope.langChecks = [{name:"Null Reference Method/Field Invocation", fn:function(l){return l.nullField;}},
                         {name:"Null List Iteration", fn:function(l){return l.nullList;}},
                         {name:"Putting wrong type into variable", fn:function(l){return l.wrongVaribleType;}},
                         {name:"Missing List Element ", fn:function(l){return l.missingListElem;}},
                         {name:"Incorrect Type Casting", fn:function(l){return l.wrongCast;}},
                         {name:"Passing Wrong Type to Method", fn:function(l){return l.wrongTypeToMethod;}},
                         {name:"Calling Missing Method/Field/Function/Variable/Constant", fn:function(l){return l.missingMethodOrField;}},
                         {name:"Missing Enum Dispatch Implementation", fn:function(l){return l.missingEnum;}},
                         {name:"Unexpected Variable Mutation ", fn:function(l){return l.variableMutation;}},
                         {name:"Deadlock prevention", fn:function(l){return l.deadLocks;}},
                         {name:"Memory Deallocation", fn:function(l){return l.memoryDeallocation;}},
                         {name:"Stack Overflow Exceptions Caused by Recursion", fn:function(l){return l.recursionStackOverflow;}},
                         {name:"Ensure Code Executes When Passed To a Function", fn:function(l){return l.consistentCodeExecution;}}];

    $scope.updateTotals = function(){
        $scope.langTotals = [];
        $scope.languages.map(function(l){
            var t = $scope.langChecks.reduce(function(ret, next){
                return ret + $scope.score(next.fn(l));
            },0);
            $scope.langTotals.push(t);
        });};

    $scope.languages = [
        {
            missingEnum: {
                enforced: "no",
                desc: "For example, using a switch-case in C# to dispatch on an enum value. If you add a new value, the compiler does nothing, so no safety. It isn't idiomatically possible to prevent this error."
            },
            recursionStackOverflow: {
                enforced: "no",
                desc: "No way to prevent these, and therefore the alternative is to write algorithms in a loop construct. It is not idiomatic to use recursion because of this. While any recursive algorithm can be expressed in a loop, it can require more size and possibly a less intuitive algorithm."
            },
            nullList: {
                enforced: "no",
                desc: "Same check as for a null field.",
                rawCode: "if (l != null) {<!consequent!>} else {<!alternative!>}"
            },
            deadLocks: {
                enforced: "no",
                desc: "As far as I know, there is provide any way to prevent deadlocks at the compiler level, and it may not be possible, but it gets scored."
            },
            missingMethodOrField: {
                enforced: "yes",
                desc: "Compiler Enforced."
            },
            wrongVaribleType: {
                enforced: "yes",
                desc: "Compiler Enforced."
            },
            name: "C#",
            consistentCodeExecution: {
                enforced: "yes",
                desc: "Compiler Enforced."
            },
            missingListElem: {
                enforced: "no",
                desc: "",
                rawCode: "if (l.Count() > i) {<!consequent!>} else {<!alternative!>}"
            },
            wrongTypeToMethod: {
                enforced: "yes",
                desc: "Compiler Enforced."
            },
            variableMutation: {
                enforced: "no",
                desc: "For example, I pass data to a function, will the data come back the same as I passed it, or will it have mutated in some way? To prevent this, in C#, we would idiomatically make a new class and make the field readonly.",
                rawCode: "public class T {readonly <!type!> n; public T(<!type!> i) {n = i;}}"
            },
            markupName: "csharp",
            memoryDeallocation: {
                enforced: "yes",
                desc: "Handled by garbage collector."
            },
            comment: "//",
            wrongCast: {
                enforced: "no",
                desc: "",
                rawCode: "var m = o as T; if (m != null) {<!consequent!>} else {<!alternative!>}"
            },
            nullField: {
                enforced: "no",
                desc: "It is possible to use the ternary operator as well, but a quick StackOverflow search shows a lot of comments cautioning against using them 'too much', so we will count the traditional 'if-else' for the most idiomatic way of checking if the field is null before using it.",
                rawCode: "if (l != null) {<!consequent!>} else {<!alternative!>}"
            }
        },
        {
            missingEnum: {
                enforced: "warn",
                desc: "The compiler offers this as a warning with no extra code (but it is not enforced)."
            },
            recursionStackOverflow: {
                enforced: "yes",
                desc: "F# recursive functions calls are converted into loop constructs by the compiler automatically."
            },
            nullList: {
                enforced: "yes",
                desc: "In F#, the idiomatic list cannot be made null by the compiler, so there is no check."
            },
            deadLocks: {
                enforced: "no",
                desc: "As far as I know, there is provide any way to prevent deadlocks at the compiler level, and it may not be possible, but it gets scored."
            },
            missingMethodOrField: {
                enforced: "yes",
                desc: "Compiler Enforced."
            },
            wrongVaribleType: {
                enforced: "yes",
                desc: "Compiler Enforced."
            },
            name: "F#",
            consistentCodeExecution: {
                enforced: "yes",
                desc: "Compiler Enforced."
            },
            missingListElem: {
                enforced: "no",
                desc: "",
                rawCode: "if l.Count() > i then <!consequent!> else <!alternative!>"
            },
            wrongTypeToMethod: {
                enforced: "yes",
                desc: "Compiler Enforced."
            },
            variableMutation: {
                enforced: "warn",
                desc: "In F# we idiomatically would use whatever fit the need most: an existing class, a let bound primitive, a tuple, etc rather than make a whole class just for the immutability. F# class fields and values are immutable by default, so nothing extra."
            },
            markupName: "fsharp",
            memoryDeallocation: {
                enforced: "yes",
                desc: "Handled By Garbage Collector."
            },
            comment: "//",
            wrongCast: {
                enforced: "yes",
                desc: "",
                rawCode: "match o with | :? T as m -> <!consequent!> | _ -> <!alternative!>"
            },
            nullField: {
                enforced: "yes",
                desc: "In F#, it is idiomatic to use Option instead of null (most classes cannot be made null without special effort). The FSharpx library function 'sequential application' written: (<*>) automatically tests for Some or None, and applies the consequent only if the value is Some, otherwise returning a default alternative of None.",
                rawCode: "<!consequent!> <*> l"
            }
        },
        {
            missingEnum: {
                enforced: "no",
                desc: "No way to idiomatically check."
            },
            recursionStackOverflow: {
                enforced: "no",
                desc: "Clojure provides a syntax for tail-call opimization, called loop/recur.",
                rawCode: "(loop [<!params!>] (recur <!args!>))"
            },
            nullList: {
                enforced: "yes",
                desc: "In Clojure, the default iteration functions: map, reduce, filter all check and return an empty list if nil, so no need for a check."
            },
            deadLocks: {
                enforced: "yes",
                desc: "The STM and agent model built into the language cannot deadlock, and data is immutable or changes are queued."
            },
            missingMethodOrField: {
                enforced: "yes",
                desc: "Clojure, the language checks for this before runtime."
            },
            wrongVaribleType: {
                enforced: "no",
                desc: "In Clojure, the closest thing to a variable is a let bound function or an atom, and neither can be annotated by default. A wrapping call to 'instance?' will give a runtime error.",
                rawCode: "(instance? c x)"
            },
            name: "Clojure",
            consistentCodeExecution: {
                enforced: "no",
                desc: "Clojure macros can prevent parameters from executing at all by rewriting the call, and it is impossible to prevent."
            },
            missingListElem: {
                enforced: "no",
                desc: "Clojure's 'get' also gets values out of lists by index.",
                rawCode: "(get i <!list!> <!default-value!>)"
            },
            wrongTypeToMethod: {
                enforced: "warn",
                desc: "In Clojure, parameters can be annotated with a type, which is checked at runtime: "
            },
            variableMutation: {
                enforced: "yes",
                desc: "In Clojure, anything you would pass is immutable, so no check and enforced by the language before runtime."
            },
            markupName: "clojure",
            memoryDeallocation: {
                enforced: "yes",
                desc: "Handled by garbage collector."
            },
            comment: ";;",
            wrongCast: {
                enforced: "no",
                desc: "Requires a try/catch block around the primitive cast function.",
                rawCode: "(try (<!T!> o) (catch Exception e <!alternative!>))"
            },
            nullField: {
                enforced: "no",
                desc: "In Clojure, it is idiomatic to put data or functions inside primitive data structures like a hashmap. Retrieval and execution would likely use 'get' which checks for nil by default.",
                rawCode: "(get l <!lookup-keyword!> <!default-if-missing!>)"
            }
        },
        {
            missingEnum: {
                enforced: "no",
                desc: "No way to idiomatically check."
            },
            recursionStackOverflow: {
                enforced: "no",
                desc: "No way to prevent these, and therefore the alternative is to write algorithms in a loop construct. It is not idiomatic to use recursion because of this. While any recursive algorithm can be expressed in a loop, it can require more size and possibly a less intuitive algorithm."
            },
            nullList: {
                enforced: "no",
                desc: "Same check as for a null field.",
                rawCode: "if (l !== null) {<!consequent!>} else {<!alternative!>}"
            },
            deadLocks: {
                enforced: "yes",
                desc: "Javascript is single threaded, and uses a queue for asynchronous execution responses like from calls to Ajax methods. As such, deadlocks are not possible by design. Javascript therefore is restricted in its abilities, but this is about categorizing safety only."
            },
            missingMethodOrField: {
                enforced: "no",
                desc: "It is common to use the OR statement to get a field OR something else if it isn't there or empty.",
                rawCode: "t.f || <alternative>"
            },
            wrongVaribleType: {
                enforced: "no",
                desc: "No real idiomatic way to check."
            },
            name: "JavaScript",
            consistentCodeExecution: {
                enforced: "yes",
                desc: "Compiler Enforced."
            },
            missingListElem: {
                enforced: "no",
                desc: "",
                rawCode: "if (l.length > i) {<!consequent!>} else {<!alternative!>}"
            },
            wrongTypeToMethod: {
                enforced: "no",
                desc: "No real idiomatic way to check."
            },
            variableMutation: {
                enforced: "no",
                desc: "The Immutabile.js library offers a simple set of tools for adding in immutability, under the Immutabile namespace.",
                rawCode: "Immutable.Map(<!object!>)"
            },
            markupName: "javascript",
            memoryDeallocation: {
                enforced: "yes",
                desc: "Handled By Garbage Collector."
            },
            comment: "//",
            wrongCast: {
                enforced: "no",
                desc: "No real idiomatic way to check."
            },
            nullField: {
                enforced: "no",
                desc: "Javascript the common pattern is to check if something is there with an OR statement.",
                rawCode: "if (l !== null) {<!consequent!>} else {<!alternative!>}"
            }
        }
    ];

    $scope.updateTotals();
    $scope.selectedLang = $scope.languages[0];
});
