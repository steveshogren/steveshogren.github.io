#lang planet neil/sicp

(define (assert-equal x y)
  (if (equal? x y)
      #t
      (display (string-append "failed: expected " (number->string y) " was "  (number->string x)))))

(define (add x y)
  (+ x y))

(assert-equal (add 5 0) 5)
(assert-equal (add 5 1) 6)
(assert-equal (add 5 0) 6) ;; failing for the right reason, should be deleted
 
