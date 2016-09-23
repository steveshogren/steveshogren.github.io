# Test Helper
def assertEqual(a, b):
    if(a != b):
        assert (a == b), "Test Failed. Expected: " + str(a) + " but found: " + str(b)
    else:
        print "."



# Code under test 
def add(x, y):
    return x + y



# Tests
assertEqual(6, add(2,4))
assertEqual(4, add(2,2))
assertEqual(2, add(2,2)) # failing! this test is just to illustrate a failure and should be deleted!
