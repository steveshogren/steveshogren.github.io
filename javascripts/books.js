window.addEventListener("load", function(){

    var books = {
        '#pl': [
            {'name': 'Structure and Interpretation of Computer Programs (Scheme)',
             'id': 'sicp',
             'desc': 'Covers data structures, interpreters, functional programming, abstraction design, OOP, type hierarchies, immutability, collections, and lazy streams. Instead of just providing text on those, it makes you build them using 350+ exercises. One of my highest recommendations. My opinion is that all serious professional programmers who want to improve their skills in any language should work through this book. <a target="_blank" href="https://mitpress.mit.edu/sicp/full-text/book/book.html">Free download</a>'
            },
            {'name': 'Programming Languages - Application And Interpretation (Typed Racket)',
             'id': 'pl',
             'desc': 'A deep dive on interpreters and language building. While reading the book, the exercises were converted from Racket to Typed Racket, which gave me a fascinating view on the value of a good type system for keeping a complex domain easy to understand. <a target="_blank" href="http://cs.brown.edu/~sk/Publications/Books/ProgLangs/">Free download</a>'
            },
            {'name': 'Haskell Programming From First Principles',
             'id': 'hpffp',
             'desc': 'An intro to Haskell AND an intro to programming with very gently sloping difficulty curve and exercises! I believe this is a fantastic book for the learner desiring more in Haskell or even starting programming for the first time.'
            },
            {'name': 'Let Over Lambda (Common Lisp, Forth)',
             'id': 'lol',
             'desc': 'No book has made me sit back and hold my pounding head more than Let Over Lambda. A deep dive into lisp macros, both reader and anaphoric. The final project is remaking Forth inside Common Lisp using macros. Yep, you read that right. <a target="_blank" href="https://letoverlambda.com/index.cl/toc">Free download</a>'
            },
            {'name': 'Clojure Programming',
             'id': 'cp',
             'desc': ''},
            {'name': 'F# 3.0',
             'id': 'fsharp',
             'desc': ''},
            {'name': 'Haskell And Yesod',
             'id': 'hay',
             'desc': 'Taught me a lot about the different ways the Haskell type system could be used to represent complex domains. The book explains how CSS, JS, and HTML can all designed in the type system in ways to prevent bugs.'},
            {'name': 'Javascript the Good Parts',
             'id': 'jstgp',
             'desc': ''},
            {'name': 'Learn You a Haskell',
             'id': 'lyah',
             'desc': 'A short, humorous survey of a lot of Haskell. Afterwards, I really needed more substance and exercises to solidify my knowledge, but it helped me to get over my fear of spooky Haskell. <a target="_blank" href="http://learnyouahaskell.com/">Free download</a>'},
            {'name': 'Software Foundations (Coq)',
             'id': 'sfs',
             'desc': 'I am in the middle this book\'s exercises, but so far it is amazing. I cannot in good faith give it a bold recommendation until I have finished it, but right now it is tied with Let Over Lambda for mind-bending concepts. Until you have represented numbers as cons cells, which you then use to prove the commutativity of multiplication IN the type system, you haven\'t really felt brain pain ;) <a target="_blank" href="https://softwarefoundations.cis.upenn.edu/current/index.html">Free download</a>'},
            {'name': 'The Art of SQL',
             'id': 'taos',
             'desc': ''}
        ],

        '#peep': [
            {'name': 'Reinventing Organizations',
             'id': 'reinvorg',
             'desc': 'Twelve case studies of companies who "self-correct" and how they do it. These companies have fewer meetings, fewer managers, and report higher job satisfaction than their peer companies. The book finds trends in all twelve and offers some suggestions for how to implement those trends. Ultimately a simple conclusion, but hard to put into practice. I found it indispensable for maintaining and improving a self-organizing team. <a target="_blank" href="http://www.reinventingorganizations.com/pay-what-feels-right.html">Free download</a>'
            },

            {'name': 'Peopleware',
             'id': 'peopleware',
             'desc': 'A collection of many different bodies of research all composed into a straighforward and easy read. While the book doesn\'t dive too deep in any one topic, it offers a lot of practical wisdom. Mandatory reading for managers, and highly recommended for all developers.'
            },

            {'name': 'Good To Great',
             'id': 'goodtogreat',
             'desc': 'A set of case studies around companies that out-performed their competition and what trends made them different. In all cases, servant leadership was the defining factor. Has influenced my leadership styles immeasurably.'
            },

            {'name': 'Becoming A Technical Leader',
             'id': 'becomtechlead',
             'desc': ''
            },

            {'name': 'Emotional Intelligence 2.0',
             'id': 'emointl',
             'desc': ''
            },

            {'name': 'How to Win Friends and Influence People',
             'id': 'winfriends',
             'desc': ''
            },

            {'name': 'Managing Humans',
             'id': 'manhum',
             'desc': ''
            },
        ],

        '#proj':[
            {'name': 'Art of Agile Development',
             'id': 'artagile',
             'desc': ''
            },

            {'name': 'Death March',
             'id': 'deathm',
             'desc': ''
            },

            {'name': 'Extreme Programming Explained',
             'id': 'xpexp',
             'desc': ''
            },

            {'name': 'Managerial Accounting',
             'id': 'manacc',
             'desc': ''
            },

            {'name': 'Mythical Man Month',
             'id': 'mythman',
             'desc': ''
            },

            {'name': 'Planning Extreme Programming',
             'id': 'planxp',
             'desc': ''
            },
        ],

        '#product':[
            {'name': 'Code Complete',
             'id': 'codecomp',
             'desc': ''
            },

            {'name': 'Productive Programmer',
             'id': 'prodprog',
             'desc': ''
            },

            {'name': 'Growing Object-Oriented Software Guided by Tests',
             'id': 'goos',
             'desc': ''
            },

            {'name': 'Harry Potter and the Methods of Rationality&#8224;',
             'id': 'hpmor',
             'desc': 'An entertaining book that illustrates how to apply the scientific method to day-to-day life. After reading and internalizing this book, my abilities as a developer improved greatly. <a target="_blank" href="http://www.hpmor.com/">Free download</a>'
            },

            {'name': 'How to Read a Book &#8224;',
             'id': 'howread',
             'desc': ''
            },

            {'name': 'Pragmatic Programmer',
             'id': 'pragprog',
             'desc': ''
            },

            {'name': 'The Passionate Programmer',
             'id': 'passion',
             'desc': ''
            },

            {'name': 'Working Effectively with Legacy Code',
             'id': 'wfwlc',
             'desc': ''
            },
        ],

        '#patterns':[
            {'name': 'Clean Code',
             'id': 'clean',
             'desc': 'A short, useful book of common patterns to make code easier to read. Much of the content of this book has seeped into the public consciousness of the developer community, but still worth reading.'
            },

            {'name': 'Algorithm Design Manual',
             'id': 'adm',
             'desc': 'Required reading for anyone not familiar with the underlying algorithms that make up most searching and sorting library functions. Also a great reference manual for advanced, infrequent algorithms.'
            },

            {'name': 'Propagation Networks: A Flexible and Expressive Substrate for Computation',
             'id': 'propnet',
             'desc': 'Fascinating thesis about designing high-performance constraint solvers using electric circuits as an underlying model. <a target="_blank" href="https://dspace.mit.edu/handle/1721.1/54635">Free download</a>'
            },

            {'name': 'Design Patterns',
             'id': 'despat',
             'desc': 'A dangerous book. Readers often attempt to over-fit the patterns to their whole codebase. I recommend the reader start by never applying the patterns found within, only identify places where they already exist. My favorite wisdom on the subject: \'even if you do not know the design patterns, good coding practices will drive you to implement them anyway.\' <br /> Most codebases I have seen might only have one or two places where a given pattern should exist. Forcing any pattern without need causes poor code. Despite the danger, the book is a valuable read to be able to clearly communicate with others who have read and adopted it.'
            },

            {'name': 'Domain Driven Design',
             'id': 'ddd',
             'desc': 'One of the most dangerous books on this list. I recommend most developers read this only when they are confident they will not be persuaded to implement the patterns without serious reflection. Some of the worst code I have ever seen was written directly after reading this book, in an attempt to over-fit the patterns where they did not belong.'
            },

            {'name': 'Implementing Domain Driven Design',
             'id': 'iddd',
             'desc': ''
            },

            {'name': 'Patterns of Enterprise Application Architecture',
             'id': 'poeaa',
             'desc': ''
            },

            {'name': 'Refactoring',
             'id': 'refa',
             'desc': ''
            }
        ],
    };

    var bookIconAndDescList = [];

    var showBookDesc = function(bookIconId, bookDescId) {
        $.map(bookIconAndDescList, function(bookIds) {
            hideBookDesc(bookIds.bookIconId, bookIds.bookDescId);
        });
        $("#" + bookIconId).removeClass();
        $("#" + bookIconId).addClass("icon fa fa-minus-circle");
        $("#" + bookDescId).show();
    };

    var hideBookDesc = function(bookIconId, bookDescId) {
        $("#" + bookIconId).removeClass();
        $("#" + bookIconId).addClass("icon fa fa-plus-circle");
        $("#" + bookDescId).hide();
    };

    $.map(Object.keys(books), function(plId) {
        var pl = $(plId);
        $.map(books[plId], function(book) {
            var description = book['desc'];
            var bookId = "#c-" + book['id'];
            var $book = $(bookId);
            $book.addClass("bookList");
            if( description) {
                var bookDescId = "d-" + book['id'];
                var bookIconId = "i-" + book['id'];
                $book.prepend($('<span id="' + bookIconId + '" class="icon fa fa-plus-circle">'));
                var desc = $('<p class="bookDesc" hidden="true" id="' + bookDescId + '">').append(description);
                $book.append(desc);
                $book.addClass("onHover");

                bookIconAndDescList.push({'bookIconId':bookIconId, 'bookDescId':bookDescId});

                $book.click(function() {
                    var $bookDesc = $("#" + bookDescId);
                    if($bookDesc.is(":visible")) {
                        hideBookDesc(bookIconId, bookDescId);
                    } else {
                        showBookDesc(bookIconId, bookDescId);
                    }
                });
            } else {
                $book.prepend($('<span class="icon fa fa-circle">'));
            }
        });
    });


});
