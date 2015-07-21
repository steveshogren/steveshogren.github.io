var tableApp2 = angular.module('TableApp2', []);

tableApp2.directive('scoreRow', function(){
    return {
        restrict: 'A',
        replace: true,
        link: function(scope, element, attrs) {
            scope.weight = 100;
            scope.score = scope.$parent.score;
            scope.scoreClass = scope.$parent.scoreClass;
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
        template: '<tr ng-class-even="evens"> <td class="tdname">{{name}}</td><td><span ng-show="$parent.showWeights">{{weight}}%  <input ng-model="weight" type="range" min="0" step="10" max="200" /></span></td> <td ng-repeat="lang in languages track by $index" style="background-color:{{scoreClass(score(lang[rowKey], weight))}}">  {{ score(lang[rowKey], weight) }}  </td> </tr>'
    };
});

tableApp2.controller('TableCtrl', function ($scope) {
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

    $scope.enforcedScore = 1;
    $scope.inabilityPenalty = 1;
    $scope.showWeights = false;
    $scope.langTotals = [];
    $scope.allLangTotals = [];

    $scope.showEdit = true;

    $scope.showRealName = true;
    $scope.getName = function(lang){
        if($scope.showRealName){return lang.name;}
        return lang.softname;
    };

    $scope.percentageTotals = function(total){
        var min = Math.min.apply(null, $scope.langTotals),
            max = Math.max.apply(null, $scope.langTotals) - min,
            shiftedTotal = total - min;
        return Math.ceil(((100*(shiftedTotal))/max));
    };

    $scope.cleanCode = function(c){
        if (!c) { return "";}
        var t = c.replace(/<![a-zA-Z-]+!>/g, "");
        return t.replace(/\s/g, "");
    };

    $scope.scoreClass = function(score){
        if (score < 0) {
            //return "red";
            //return "#FF6600";
            return "#FF6666";
        } else if (score > 0) {
            //return "green";
            return "#00CC99";
        }
        return "white";
    };
    $scope.score = function(t){
        if (!t) { return 0; } // field not defined

        if (!t.weight) { t.weight = 100;}
        var count = 0;
        var delta = 0;
        if (t.enforced === "yes") {
            delta = $scope.enforcedScore;
        } else if (t.enforced === "no"){
            delta = -$scope.inabilityPenalty;
        } else if (t.enforced === "warn"){
            delta = 0;
        }
        if ((typeof t.rawCode === "undefined" && !t.rawCode) || t.rawCode === "") {
            count = 0;
        } else {
            //count = $scope.cleanCode(t.rawCode).length;
            count = 0;
        }
        return Math.ceil((t.weight / 100) * (count + delta));
    };


    $scope.langChecks = [
        {name:"Prevent Null Variable Usage", key:"nullField",
         desc:"Ensuring that the symbol you are currently referring to is not a null reference before using it"},
        {name:"Prevent Null List Iteration", key:"nullList",
         desc:"Ensuring that a list or array is not null before iterating over it"},
        {name:"Prevent Variable Reuse for Different Type", key:"wrongVaribleType",
         desc:"Preventing the replacement of a symbol in scope with a value or reference to a different type, primitive, or data structure than was originally used"},
        {name:"Ensure List Element Exists", key:"missingListElem",
         desc:"Preventing looking up an element from a list or array that does not exist"},
        {name:"Ensure Safe Type Casting", key:"wrongCast",
         desc:"Preventing a coercion or cast that fails in a way that leaves you with invalid data or a bad reference"},
        {name:"Prevent Passing Wrong Type to Method", key:"wrongTypeToMethod",
         desc:"Preventing passing a primitive, type, or data structure to a method that cannot operate on it"},
        {name:"Calling or Setting Misspelled Method, Field, Function, Variable",
         key:"missingMethodOrField",
         desc:"Preventing referring to a symbol that does not exist in the current scope"},
        {name:"Missing Enum Value In Switch/Case or If/Else", key:"missingEnum",
         desc:"Preventing dispatch errors caused by adding a new value to an enum without updating all existing usages of that enum to handle the new case"},
        {name:"Prevent Variable Mutation", key:"variableMutation",
         desc:"For example, I pass data to a function, will the data come back the same as I passed it, or will it have mutated in some way? "},
        {name:"Prevent Deadlocks", key:"deadLocks",
         desc: "Preventing thread deadlocks at the language level"},
        {name:"Guarantee Memory Deallocation", key:"memoryDeallocation",
         desc:"Is memory automatically deallocated after all uses of it have completed their work"},
        {name:"Tail Call Optimization", key:"recursionStackOverflow",
         desc:"Are recursive calls in the tail position of a function optimized to reuse the current stack, preventing stack overflow exceptions"},
        {name:"Guaranteed Code Evaluation When Passed To a Function", key:"consistentCodeExecution",
         desc:"Does calling a function cause it to evaluate immediately, or is it instead passed as an unevaluated thunk"}
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
            // return "Unenforced (No extra penalty)";
            return "Unenforced (Runtime): 0";
        } else if(e==="yes") {
            return "Enforced (Pre-runtime): 1";
        }
        return "Impossible: -1";
    };

    $scope.languageRatios = JSON.parse("[{\"ratio\":24.506666,\"lang\":\"csharp\",\"bugs\":3676,\"repos\":150},{\"ratio\":3.6190476,\"lang\":\"fsharp\",\"bugs\":76,\"repos\":21},{\"ratio\":2.53211,\"lang\":\"clojure\",\"bugs\":276,\"repos\":109},{\"ratio\":44.226665,\"lang\":\"js\",\"bugs\":6634,\"repos\":150},{\"ratio\":23.373333,\"lang\":\"coffeescript\",\"bugs\":3506,\"repos\":150},{\"ratio\":10.786667,\"lang\":\"scala\",\"bugs\":1618,\"repos\":150},{\"ratio\":54.62,\"lang\":\"php\",\"bugs\":8193,\"repos\":150},{\"ratio\":22.693333,\"lang\":\"go\",\"bugs\":3404,\"repos\":150},{\"ratio\":36.633335,\"lang\":\"java\",\"bugs\":5495,\"repos\":150},{\"ratio\":11.171429,\"lang\":\"haskell\",\"bugs\":782,\"repos\":70},{\"ratio\":11.36,\"lang\":\"ruby\",\"bugs\":1704,\"repos\":150},{\"ratio\":18.3,\"lang\":\"python\",\"bugs\":2745,\"repos\":150}]");
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
                enforced: "warn",
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
        },
        {
            name: "Scala",
            softname: "Scala",
            markupName: "scala",
            comment: "//",
            missingEnum: {
                enforced: "warn",
                desc:"",
            },
            recursionStackOverflow: {
                enforced: "warn",
                desc:"",
            },
            nullList: {
                enforced: "yes",
                desc:"",
                rawCode:""
            },
            deadLocks: {
                enforced: "warn",
                desc:"",
            },
            missingMethodOrField: {
                enforced: "yes",
                desc:"",
                rawCode:""
            },
            wrongVaribleType: {
                enforced: "yes",
                desc:"",
            },
            consistentCodeExecution: {
                enforced: "no",
                desc:"",
            },
            missingListElem: {
                enforced: "warn",
                desc:"",
                rawCode:""
            },
            wrongTypeToMethod: {
                enforced: "yes",
                desc:"",
            },
            variableMutation: {
                enforced: "warn",
                desc:"",
                rawCode:""
            },
            memoryDeallocation: {
                enforced: "yes",
                desc:"",
            },
            wrongCast: {
                enforced: "yes",
                desc:"",
            },
            nullField: {
                enforced: "yes",
                desc:"",
                rawCode:""
            }
        },
        {
            name: "PHP",
            softname: "PHP",
            markupName: "php",
            comment: "//",
            missingEnum: {
                enforced: "no",
                desc:"",
            },
            recursionStackOverflow: {
                enforced: "no",
                desc:"",
            },
            nullList: {
                enforced: "warn",
                desc:"",
                rawCode:""
            },
            deadLocks: {
                enforced: "warn",
                desc:"",
            },
            missingMethodOrField: {
                enforced: "warn",
                desc:"",
                rawCode:""
            },
            wrongVaribleType: {
                enforced: "no",
                desc:"",
            },
            consistentCodeExecution: {
                enforced: "yes",
                desc:"",
            },
            missingListElem: {
                enforced: "warn",
                desc:"",
                rawCode:""
            },
            wrongTypeToMethod: {
                enforced: "warn",
                desc:"",
            },
            variableMutation: {
                enforced: "warn",
                desc:"",
                rawCode:""
            },
            memoryDeallocation: {
                enforced: "yes",
                desc:"",
            },
            wrongCast: {
                enforced: "warn",
                desc:"",
            },
            nullField: {
                enforced: "warn",
                desc:"",
                rawCode:""
            }
        },
        {
            name: "Go",
            softname: "Go",
            markupName: "java",
            comment: "",
            missingEnum: {
                enforced: "no",
                desc:"",
            },
            recursionStackOverflow: {
                enforced: "no",
                desc:"",
            },
            nullList: {
                enforced: "warn",
                desc:"",
                rawCode:""
            },
            deadLocks: {
                enforced: "no",
                desc:"",
            },
            missingMethodOrField: {
                enforced: "yes",
                desc:"",
            },
            wrongVaribleType: {
                enforced: "yes",
                desc:"",
            },
            consistentCodeExecution: {
                enforced: "yes",
                desc:"",
            },
            missingListElem: {
                enforced: "warn",
                desc:"",
                rawCode:""
            },
            wrongTypeToMethod: {
                enforced: "yes",
                desc:"",
            },
            variableMutation: {
                enforced: "warn",
                desc:"",
                rawCode:""
            },
            memoryDeallocation: {
                enforced: "yes",
                desc:"",
            },
            wrongCast: {
                enforced: "warn",
                desc:"",
                rawCode:""
            },
            nullField: {
                enforced: "warn",
                desc:"",
                rawCode:""
            }
        },
        {
            name: "Java",
            softname: "Java",
            markupName: "java",
            comment: "//",
            missingEnum: {
                enforced: "no",
                desc:"",
            },
            recursionStackOverflow: {
                enforced: "no",
                desc:"",
            },
            nullList: {
                enforced: "warn",
                desc:"",
                rawCode:""
            },
            deadLocks: {
                enforced: "no",
                desc:"",
            },
            missingMethodOrField: {
                enforced: "yes",
                desc:"",
            },
            wrongVaribleType: {
                enforced: "yes",
                desc:"",
            },
            consistentCodeExecution: {
                enforced: "yes",
                desc:"",
            },
            missingListElem: {
                enforced: "warn",
                desc:"",
                rawCode:""
            },
            wrongTypeToMethod: {
                enforced: "yes",
                desc:"",
            },
            variableMutation: {
                enforced: "warn",
                desc:"",
                rawCode:""
            },
            memoryDeallocation: {
                enforced: "yes",
                desc:"",
            },
            wrongCast: {
                enforced: "warn",
                desc:"",
                rawCode:""
            },
            nullField: {
                enforced: "warn",
                desc:"",
                rawCode:""
            }
        },
        {
            name: "Haskell",
            softname: "Haskell",
            markupName: "haskell",
            comment: "",
            missingEnum: {
                enforced: "yes",
                desc:"",
            },
            recursionStackOverflow: {
                enforced: "yes",
                desc:"",
            },
            nullList: {
                enforced: "yes",
                desc:"",
                rawCode:""
            },
            deadLocks: {
                enforced: "no",
                desc:"",
            },
            missingMethodOrField: {
                enforced: "yes",
                desc:"",
            },
            wrongVaribleType: {
                enforced: "yes",
                desc:"",
            },
            consistentCodeExecution: {
                enforced: "no",
                desc:"",
            },
            missingListElem: {
                enforced: "warn",
                desc:"",
                rawCode:""
            },
            wrongTypeToMethod: {
                enforced: "yes",
                desc:"",
            },
            variableMutation: {
                enforced: "yes",
                desc:"",
                rawCode:""
            },
            memoryDeallocation: {
                enforced: "yes",
                desc:"",
            },
            wrongCast: {
                enforced: "yes",
                desc:"",
                rawCode:""
            },
            nullField: {
                enforced: "yes",
                desc:"",
                rawCode:""
            }
        },
        {

            name: "Ruby",
            softname: "Ruby",
            markupName: "ruby",
            comment: "//",
            missingEnum: {
                enforced: "no",
                desc:"",
            },
            recursionStackOverflow: {
                enforced: "no",
                desc:"",
            },
            nullList: {
                enforced: "warn",
                desc:"",
                rawCode:""
            },
            deadLocks: {
                enforced: "warn",
                desc:"",
            },
            missingMethodOrField: {
                enforced: "warn",
                desc:"",
            },
            wrongVaribleType: {
                enforced: "no",
                desc:"",
            },
            consistentCodeExecution: {
                enforced: "yes",
                desc:"",
            },
            missingListElem: {
                enforced: "warn",
                desc:"",
                rawCode:""
            },
            wrongTypeToMethod: {
                enforced: "no",
                desc:"",
            },
            variableMutation: {
                enforced: "warn",
                desc:"",
                rawCode:""
            },
            memoryDeallocation: {
                enforced: "yes",
                desc:"",
            },
            wrongCast: {
                enforced: "warn",
                desc:"",
                rawCode:""
            },
            nullField: {
                enforced: "warn",
                desc:"",
                rawCode:""
            }
        },
        {
            name: "Python",
            softname: "Python",
            markupName: "python",
            comment: "",
            missingEnum: {
                enforced: "no",
                desc:"",
            },
            recursionStackOverflow: {
                enforced: "no",
                desc:"",
            },
            nullList: {
                enforced: "warn",
                desc:"",
                rawCode:""
            },
            deadLocks: {
                enforced: "warn",
                desc:"",
            },
            missingMethodOrField: {
                enforced: "warn",
                desc:"",
            },
            wrongVaribleType: {
                enforced: "no",
                desc:"",
            },
            consistentCodeExecution: {
                enforced: "yes",
                desc:"",
            },
            missingListElem: {
                enforced: "warn",
                desc:"",
                rawCode:""
            },
            wrongTypeToMethod: {
                enforced: "no",
                desc:"",
            },
            variableMutation: {
                enforced: "warn",
                desc:"",
                rawCode:""
            },
            memoryDeallocation: {
                enforced: "yes",
                desc:"",
            },
            wrongCast: {
                enforced: "warn",
                desc:"",
                rawCode:""
            },
            nullField: {
                enforced: "warn",
                desc:"",
                rawCode:""
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
