import glob, os

# Find function in file to get full function definition
def functionSearch(file_name, function_name):
    with open(file_name) as openfile:
        for line in openfile:
            if function_name in line:
                function_def = line.strip()
                break
    # Check if function doesn't exist
    try:
        function_def
        return function_def
    except NameError:
        print("That is not a defined function, please try again.")
        exit()

def writeTests(function_name, f):
    # Create subsets
    print("How many subtests? ")
    count = int(input())

    # Get and write subtest info
    for x in range (0, count):
        print("Input: ")
        user_input = input()
        print("Expected output: ")
        exp_output = input()
        f.write("\tEXPECT_EQ(" + function_name + "(" + user_input + "), " + exp_output + ");\n")

def createUnitTest(file_name, function_def, function_name):
    # Create the test label related to function
    test_suite = function_name+"Test"

    # Create and write header stuff to the testing file
    # This doesn't work if there is an existing testing file! MUST DELETE FILE BEFORE RUNNING!
    testing_file = file_name.partition(".")[0]+"_test.cpp"
    f = open(testing_file, "x")
    f.write("#include <gtest/gtest.h>\n")
    f.write("extern "+function_def+";\n\n")

    # Get test label info
    print("Name of test: ")
    test_name = input()
    f.write("TEST("+test_suite+", "+test_name+") {\n")

    writeTests(function_name, f)

    f.write("}\n\n")
    # Write main
    f.write("int main(int argc, char **argv) {\n\t::testing::InitGoogleTest(&argc, argv); \n\treturn RUN_ALL_TESTS();\n}")
    f.close()
    return testing_file

# Compile unit test file
def compile(file_name, function_name, testing_file):
    # Create command
    gpp = "g++ -Wall -I/usr/local/cs/cs251 "
    files = file_name + " " + testing_file + " "
    lib = "-L/usr/local/cs/cs251/gtest -lgtest -lpthread "
    exe = "-o " + function_name

    # Create executable
    command = gpp + files + lib + exe
    os.system("echo "+command)
    os.system(command)

# Run tests
def runTests(function_name):
    os.system("echo "+"./"+function_name)
    os.system("./"+function_name)



# MAIN

# Find cpp files in current directory
# We would need to make a list if more than one
os.chdir(".")
for file in glob.glob("*.cpp"):
    file_name = file

# Get name of function
print("Which function would you like to test? ")
function_name = input()

function_def = functionSearch(file_name, function_name)

testing_file = createUnitTest(file_name, function_def, function_name)

print("Would you like to run the test?")
a = input()

compile(file_name, function_name, testing_file)

runTests(function_name)