import sys, os, glob, re

def createUnitTest(test_name, function_name, function_def, user_input, exp_output):
    # Create the test label related to function
    test_suite = function_name+"Test"

    # Create and write header stuff to the testing file
    # This doesn't work if there is an existing testing file! MUST DELETE FILE BEFORE RUNNING!
    testing_file = function_name.partition(".")[0]+"_test.cpp"
    f = open(testing_file, "x")
    f.write("#include <gtest/gtest.h>\n")
    f.write("extern "+function_def+";\n\n")

    # Get test label info
    f.write("TEST("+test_suite+", "+test_name+") {\n")

    writeTests(function_name, f, user_input, exp_output)

    f.write("}\n\n")
    # Write main
    f.write("int main(int argc, char **argv) {\n\t::testing::InitGoogleTest(&argc, argv); \n\treturn RUN_ALL_TESTS();\n}")
    f.close()
    return testing_file


def writeTests(function_name, f, user_input, exp_output):
    # Get and write subtest info
    f.write("\tEXPECT_EQ(" + function_name + "(" + user_input + "), " + exp_output + ");\n")

# These will be the input when creating the file, but we also need to check if that file exists to see if only writing singular tests is the right move
workspace_dir = sys.argv[1]
os.chdir(workspace_dir)
test_name = sys.argv[2]
function_name = sys.argv[3]
function_def = sys.argv[4]
user_input = sys.argv[5]
exp_output = sys.argv[6]

testing_file = createUnitTest(test_name, function_name, function_def, user_input, exp_output)
print(testing_file)