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

def searchandaddTests(testing_file, test_name, function_name, function_def, user_input, exp_output):
    # Hunt for test suite
    searchLine = "TEST("+function_name+"Test, "+ test_name +")"
    linetoedit = 0
    suite_exists = False
    with open(testing_file) as openfile:
        for line in openfile:
            linetoedit += 1
            if searchLine in line:
                suite_exists = True
                break
    
    if suite_exists:
        # Pull all lines
        openfile = open(testing_file)
        contents = openfile.readlines()
        openfile.close()

        # Adding test manually
        contents.insert(linetoedit, "\tEXPECT_EQ(" + function_name + "(" + user_input + "), " + exp_output + ");\n")
        openfile = open(testing_file, "w")
        contents = "".join(contents)
        openfile.write(contents)
        openfile.close()
    else:
        linetoedit = 0
        with open(testing_file) as openfile:
            for line in openfile:
                if "int main(int argc, char **argv) {" in line:
                    break
                linetoedit += 1

        openfile = open(testing_file)
        contents = openfile.readlines()
        openfile.close()

        contents.insert(linetoedit, "TEST("+function_name+"Test, "+ test_name +") {\n")
        contents.insert(linetoedit+1, "\tEXPECT_EQ(" + function_name + "(" + user_input + "), " + exp_output + ");\n")
        contents.insert(linetoedit+2, "}\n\n")

        openfile = open(testing_file, "w")
        contents = "".join(contents)
        openfile.write(contents)
        openfile.close()
    



    # lineNum = 0
    # with open(testing_file, "w") as openfile:
    #     for line in openfile:
    #         if linetoedit == lineNum:
    #             writeTests(function_name, openfile, user_input, exp_output)
    #             next()
    #         else:
    #             next()


# These will be the input when creating the file, but we also need to check if that file exists to see if only writing singular tests is the right move
workspace_dir = sys.argv[1]
os.chdir(workspace_dir)
test_name = sys.argv[2]
function_name = sys.argv[3]
function_def = sys.argv[4]
user_input = sys.argv[5]
exp_output = sys.argv[6]


for file in glob.glob("*.cpp"):
    if file == function_name+"_test.cpp":
        testing_file = file

try:
    testing_file
    searchandaddTests(testing_file, test_name, function_name, function_def, user_input, exp_output)
    print(testing_file)
except NameError:
    testing_file = createUnitTest(test_name, function_name, function_def, user_input, exp_output)

