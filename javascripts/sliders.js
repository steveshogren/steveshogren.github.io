var tableApp = angular.module('TableApp', []);

tableApp.directive('scoreRow', function(){
    return {
        restrict: 'A',
        replace: true,
        link: function(scope, element, attrs) {
            scope.weight = 100;
            scope.score = scope.$parent.score;
            scope.languages = scope.$parent.languages;
            scope.allLanguages = scope.$parent.allLanguages;
            scope.$watch('weight', function(n, old){
                if(n !== old){
                    scope.languages.map(function(l){
                        l[scope.rowKey].weight = n;
                    });
                    scope.allLanguages.map(function(l){
                        l[scope.rowKey].weight = n;
                    });

                    scope.$parent.updateTotals();
                }
            });
        },
        scope: {
            rowKey: '=',
            name: '='
        },
        template: '<tr ng-class-even="evens"> <td class="tdname">{{name}}</td><td><span ng-show="$parent.showWeights">{{weight}}%  <input ng-model="weight" type="range" min="0" step="10" max="100" /></span></td> <td ng-repeat="lang in languages track by $index" ng-class="{enforcedscore:lang[rowKey].enforced===\'yes\'}">  {{ score(lang[rowKey], weight) }}  </td> </tr>'
    };
});

tableApp.controller('TableCtrl', function ($scope) {
    $scope.watchTotalsFn = function(n, old){
        if(n !== old){
            $scope.updateTotals();
        }
    };
    $scope.$watch('inabilityPenalty', $scope.watchTotalsFn);
    $scope.$watchCollection('languages', $scope.watchTotalsFn);
    $scope.$watch('enforcedScore', $scope.watchTotalsFn);
    $scope.$watch('languages[0]', $scope.watchTotalsFn, true);
    $scope.$watch('languages[1]', $scope.watchTotalsFn, true);
    $scope.$watch('languages[2]', $scope.watchTotalsFn, true);
    $scope.$watch('languages[3]', $scope.watchTotalsFn, true);

    $scope.enforcedScore = 30;
    $scope.inabilityPenalty = 30;
    $scope.showWeights = false;
    $scope.langTotals = [];
    $scope.allLangTotals = [];

    $scope.showEdit = false;

    $scope.showRealName = false;
    $scope.getName = function(lang){
        if($scope.showRealName){return lang.name;}
        return lang.softname;
    };
    
    $scope.percentageTotals = function(total){
        var min = Math.min.apply(null, $scope.langTotals),
            max = Math.max.apply(null, $scope.langTotals) - min,
            shiftedTotal = total - min;
        return Math.ceil(100-((100*(shiftedTotal))/max));
    };

    $scope.cleanCode = function(c){
        if (!c) { return "";}
        var t = c.replace(/<![a-zA-Z-]+!>/g, "");
        return t.replace(/\s/g, "");
    };

    $scope.score = function(t){
        if (!t) { return 0; } // field not defined

        if (!t.weight) { t.weight = 100;}
        var count = 0;
        var delta = 0;
        if (t.enforced === "yes") {
            delta = -$scope.enforcedScore;
        } else if (t.enforced === "no"){
            delta = $scope.inabilityPenalty;
        } else if (t.enforced === "warn"){
            delta = 0;
        }
        if ((typeof t.rawCode === "undefined" && !t.rawCode) || t.rawCode === "") {
            count = 0;
        } else {
            count = $scope.cleanCode(t.rawCode).length;
        }
        return Math.ceil((t.weight / 100) * (count + delta));
    };


    $scope.langChecks = [
        {name:"Test for Null Variable Reference", key:"nullField"},
        {name:"Null List Iteration", key:"nullList"},
        {name:"Putting wrong type into variable", key:"wrongVaribleType"},
        {name:"Missing List Element ", key:"missingListElem"},
        {name:"Incorrect Type Casting", key:"wrongCast"},
        {name:"Passing Wrong Type to Method", key:"wrongTypeToMethod"},
        {
            name:"Calling or Setting Misspelled Method, Field, Function, Variable",
            key:"missingMethodOrField"
        },
        {name:"Missing Enum Value In Switch/Case or If/Else", key:"missingEnum"},
        {name:"Unexpected Variable Mutation", key:"variableMutation"},
        {name:"Deadlock prevention", key:"deadLocks"},
        {name:"Memory Deallocation", key:"memoryDeallocation"},
        {name:"Stack Overflow Exceptions Caused by Recursion", key:"recursionStackOverflow"},
        {name:"Guaranteed Code Evaluation When Passed To a Function", key:"consistentCodeExecution"}
    ];

    $scope.updateAllTotals = function(){
        $scope.allLangTotals = [];
        $scope.allLanguages.map(function(l){
            var t = $scope.langChecks.reduce(function(ret, next){
                return ret + $scope.score(l[next.key]);
            },0);
            $scope.allLangTotals.push(t);
        });};
    $scope.updateTotals = function(){
        $scope.updateAllTotals();
        $scope.langTotals = [];
        $scope.languages.map(function(l){
            var t = $scope.langChecks.reduce(function(ret, next){
                return ret + $scope.score(l[next.key]);
            },0);
            $scope.langTotals.push(t);
        });};
    $scope.copyToClipboard = function(text){
        window.prompt("Copy to clipboard: Ctrl+C, Enter", JSON.stringify(text));
    };
    $scope.enforcedTypes = ["yes", "no", "warn"];
    $scope.enforcedNice = function(e){
        if (e==="warn") {
            return "Unenforced (No extra penalty)";
        } else if(e==="yes") {
            return "Enforced (Add bonus)";
        } 
        return "Impossible (Add penalty)";
    };

    $scope.allLanguages = [
        {
            missingEnum: {
                enforced: "no",
                desc: "For example, using a switch-case in C# to dispatch on an enum value. If you add a new value, the compiler does nothing, so no safety. It isn't idiomatically possible to prevent this error."
            },
            recursionStackOverflow: {
                enforced: "no",
                desc: "No way to prevent these, and therefore the alternative is to write algorithms in a loop construct. It is not idiomatic to use recursion because of this. While any recursive algorithm can be expressed in a loop, it can require more size and possibly a less intuitive algorithm. Source: http://stackoverflow.com/a/18582585/496112"
            },
            nullList: {
                enforced: "warn",
                desc: "Same check as for a null field.",
                rawCode: "if (l != null) {<!consequent!>} else {<!alternative!>}"
            },
            deadLocks: {
                enforced: "no",
                desc: "As far as I know, there is way to prevent deadlocks at the compiler level, and it may not be possible, but it gets scored."
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
            softname: "Popular VM Lang",
            consistentCodeExecution: {
                enforced: "yes",
                desc: "Compiler Enforced."
            },
            missingListElem: {
                enforced: "warn",
                desc: "Source: http://www.dotnetperls.com/indexoutofrangeexception",
                rawCode: "if (l.Count() > i) {<!consequent!>} else {<!alternative!>}"
            },
            wrongTypeToMethod: {
                enforced: "yes",
                desc: "Compiler Enforced."
            },
            variableMutation: {
                enforced: "warn",
                desc: "For example, I pass data to a function, will the data come back the same as I passed it, or will it have mutated in some way? To prevent this, in C#, we would idiomatically make a new class and make the field readonly. Source: https://msdn.microsoft.com/en-us/library/acdd6hb7.aspx",
                rawCode: "public class T {readonly <!type!> n; public T(<!type!> i) {n = i;}}"
            },
            markupName: "csharp",
            memoryDeallocation: {
                enforced: "yes",
                desc: "Handled by garbage collector."
            },
            comment: "//",
            wrongCast: {
                enforced: "warn",
                desc: "Source: http://stackoverflow.com/a/13405826/496112",
                rawCode: "var m = o as T; if (m != null) {<!consequent!>} else {<!alternative!>}"
            },
            nullField: {
                enforced: "warn",
                desc: "It is possible to use the ternary operator as well, but a quick StackOverflow search shows a lot of comments cautioning against using them 'too much', so we will count the traditional 'if-else' for the most idiomatic way of checking if the field is null before using it. Sourced from: http://stackoverflow.com/a/4660186/496112 and http://stackoverflow.com/a/3312825/496112 ",
                rawCode: "if (l != null) {<!consequent!>} else {<!alternative!>}"
            }
        },
        {
            missingEnum: {
                enforced: "warn",
                desc: "The compiler offers this as a warning with no extra code (but it is not enforced). Source: http://fsharpforfunandprofit.com/posts/match-expression/"
            },
            recursionStackOverflow: {
                enforced: "yes",
                desc: "F# recursive function calls are converted into loop constructs by the compiler automatically. Source: http://blogs.msdn.com/b/fsharpteam/archive/2011/07/08/tail-calls-in-fsharp.aspx"
            },
            nullList: {
                enforced: "yes",
                desc: "In F#, the idiomatic list cannot be made null by the compiler, so there is no check. Source: https://msdn.microsoft.com/en-us/library/dd233197(v=vs.110).aspx"
            },
            deadLocks: {
                enforced: "no",
                desc: "As far as I know, there is no way to prevent deadlocks at the compiler level, and it may not be possible, but it gets scored."
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
            softname: "ML VM Lang",
            consistentCodeExecution: {
                enforced: "yes",
                desc: "Compiler Enforced."
            },
            missingListElem: {
                enforced: "warn",
                desc: "",
                rawCode: "if l.Count() > i then <!consequent!> else <!alternative!>"
            },
            wrongTypeToMethod: {
                enforced: "yes",
                desc: "Compiler Enforced."
            },
            variableMutation: {
                enforced: "warn",
                desc: "In F# we idiomatically would use whatever fit the need most: an existing class, a let bound primitive, a tuple, etc rather than make a whole class just for the immutability. F# class fields and values are immutable by default, so nothing extra. Source: http://fsharpforfunandprofit.com/posts/correctness-immutability/ "
            },
            markupName: "fsharp",
            memoryDeallocation: {
                enforced: "yes",
                desc: "Handled By Garbage Collector."
            },
            comment: "//",
            wrongCast: {
                enforced: "yes",
                desc: "Source: http://stackoverflow.com/a/2362114/496112",
                rawCode: "match o with | :? T as m -> <!consequent!> | _ -> <!alternative!>"
            },
            nullField: {
                enforced: "yes",
                desc: "In F#, it is idiomatic to use Option instead of null (most classes cannot be made null without special effort). The FSharpx library function 'sequential application' written: (<*>) automatically tests for Some or None, and applies the consequent only if the value is Some, otherwise returning a default alternative of None. Source: http://tomasp.net/blog/applicative-functors.aspx/",
                rawCode: "<!consequent!> <*> l"
            }
        },
        {
            missingEnum: {
                enforced: "no",
                desc: "No way to idiomatically check."
            },
            recursionStackOverflow: {
                enforced: "warn",
                desc: "Clojure provides an optional syntax for tail-call optimization, called loop/recur.",
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
                desc: "Clojure checks for this before runtime."
            },
            wrongVaribleType: {
                enforced: "warn",
                desc: "In Clojure, the closest thing to a variable is a let bound function or an atom, and neither can be annotated by default. A wrapping call to 'instance?' will give a runtime check.",
                rawCode: "(instance? c x)"
            },
            name: "Clojure",
            softname: "Lisp VM Lang",
            consistentCodeExecution: {
                enforced: "no",
                desc: "Clojure macros can prevent parameters from executing at all by rewriting the call, and it is impossible to prevent."
            },
            missingListElem: {
                enforced: "warn",
                desc: "Clojure's 'get' also gets values out of lists by index.",
                rawCode: "(get i <!list!> <!default-value!>)"
            },
            wrongTypeToMethod: {
                enforced: "warn",
                desc: "In Clojure, parameters can be annotated with a type or typeshape using a typeshaping library like Schema, which is checked at runtime."
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
                enforced: "warn",
                desc: "Requires a try/catch block around the primitive cast function, for example (double ...)",
                rawCode: "(try (T o) (catch Exception e <!alternative!>))"
            },
            nullField: {
                enforced: "warn",
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
                desc: "No way to prevent these, and therefore the alternative is to write algorithms in a loop construct. It is not idiomatic to use recursion because of this. While any recursive algorithm can be expressed in a loop, it can require more size and possibly a less intuitive algorithm. Source: http://stackoverflow.com/questions/9497625/javascript-recursion-maximum-call-stack-size-exceeded "
            },
            nullList: {
                enforced: "warn",
                desc: "Same check as for a null field.",
                rawCode: "if (l !== null) {<!consequent!>} else {<!alternative!>}"
            },
            deadLocks: {
                enforced: "warn",
                desc: "Javascript is single threaded, and uses a queue for asynchronous execution responses like from calls to Ajax methods. As such, deadlocks are not possible by design. Javascript therefore is restricted in its abilities, but this is about categorizing safety only. Source: http://stackoverflow.com/a/17969359/496112"
            },
            missingMethodOrField: {
                enforced: "warn",
                desc: "It is common to use the OR statement to get a field OR something else if it isn't there or empty.",
                rawCode: "t.f || <alternative>"
            },
            wrongVaribleType: {
                enforced: "no",
                desc: "No real idiomatic way to check."
            },
            name: "JavaScript",
            softname: "Browser Lang",
            consistentCodeExecution: {
                enforced: "yes",
                desc: "Compiler Enforced."
            },
            missingListElem: {
                enforced: "warn",
                desc: "",
                rawCode: "if (l.length > i) {<!consequent!>} else {<!alternative!>}"
            },
            wrongTypeToMethod: {
                enforced: "no",
                desc: "No real idiomatic way to check."
            },
            variableMutation: {
                enforced: "warn",
                desc: "Core javascript offers Object.freeze as a means of looking the value and structure of an object.  Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze The Immutable.js library offers a simple set of tools for adding in immutability, under the Immutable namespace. Source: https://github.com/facebook/immutable-js",
                rawCode: "a = Object.freeze(<!object!>)"
            },
            markupName: "javascript",
            memoryDeallocation: {
                enforced: "yes",
                desc: "For most cases this is handled By Garbage Collector. See: http://javascript.info/tutorial/memory-leaks"
            },
            comment: "//",
            wrongCast: {
                enforced: "no",
                desc: "No real idiomatic way to check."
            },
            nullField: {
                enforced: "warn",
                desc: "In Javascript, the common pattern is to check if something is there with an if statement before accessing something that might not be there.",
                rawCode: "if (l !== null) {<!consequent!>} else {<!alternative!>}"
            }
        },
        {
            name: "Coffee Script",
            softname: "Caffinated Lang",
            markupName: "coffeescript",
            comment: "#",

            nullField: {
                enforced: "warn",
                desc: "The Existential Operator alleviates the difficulty in testing for undefined Javascript variables. ",
                rawCode: "l ? <!alternative!>"
            },
            nullList: {
                enforced: "warn",
                desc: "This could potentially be accomplished with the existential operator (?) as well, but this is a more general case.",
                rawCode: "l || []"
            },
            wrongVaribleType: {
                enforced: "warn",
                desc: "The instance of operator allows complex types in both Coffee Script and Javascript to be examined for a common prototype.  This does not work on most primitive types.",
                rawCode: "o instanceof <!prototype!>"
            },
            missingListElem: {
                enforced: "warn",
                desc: "Coffeescript arrays grow as needed to fit their data and are commonly implemented as sparse arrays.  They do not do automatic bounds checking.",
                rawCode: "if l.length > i <!consequent!> else <!alternative!>"
            },
            wrongCast: {
                enforced: "no",
                desc: "No real idiomatic way to check."
            },
            wrongTypeToMethod: {
                enforced: "no",
                desc: "Method arguments, like variables have no intrinsic type associated with them.  The typeof and instanceof operators may be used as needed."
            },
            missingMethodOrField: {
                enforced: "warn",
                desc: "The accessor variant of the Existential Operator will cause access to undefined fields/methods to return 'undefined' rather than throwing an exception.",
                rawCode: "a?.b"
            },
            missingEnum: {
                enforced: "no",
                desc: "Neither Javascript or Coffeescript support the concept of an Enum. No way to idiomatically check."
            },
            variableMutation: {
                enforced: "warn",
                desc: "Core javascript, and hence Coffescript offers Object.freeze as a means of looking the value and structure of an object.  Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze The Immutable.js library offers a simple set of tools for adding in immutability, under the Immutable namespace. Source: https://github.com/facebook/immutable-js",
                rawCode: "a = Object.freeze(<!object!>)"
            },
            deadLocks: {
                enforced: "warn",
                desc: "Javascript is single threaded, and uses a queue for asynchronous execution responses like from calls to Ajax methods. As such, deadlocks are not possible by design. Javascript therefore is restricted in its abilities, but this is about categorizing safety only. Source: http://stackoverflow.com/a/17969359/496112"
            },
            memoryDeallocation: {
                enforced: "yes",
                desc: "For most cases this is handled By Garbage Collector. See: http://javascript.info/tutorial/memory-leaks"
            },
            recursionStackOverflow: {
                enforced: "no",
                desc: "No way to prevent these, and therefore the alternative is to write algorithms in a loop construct. It is not idiomatic to use recursion because of this. While any recursive algorithm can be expressed in a loop, it can require more size and possibly a less intuitive algorithm. Source: http://stackoverflow.com/questions/9497625/javascript-recursion-maximum-call-stack-size-exceeded "
            },
            consistentCodeExecution: {
                enforced: "yes",
                desc: "Compiler Enforced."
            }
        }
    ];

    $scope.languages = [
        $scope.allLanguages[0],
        $scope.allLanguages[1],
        $scope.allLanguages[2],
        $scope.allLanguages[3],
    ];

    $scope.updateTotals();
    $scope.selectedLang = $scope.languages[0];
});
