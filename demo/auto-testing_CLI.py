import glob, os


# Find cpp files in current directory
# We would need to make a list if more than one
os.chdir(".")
for file in glob.glob("*.cpp"):
    file_name = file

# Get name of function
print("Which function would you like to test? ")
function_name = input()
test_suite = function_name+"Test"

# Find function in file to get full function definition
with open(file_name) as openfile:
    for line in openfile:
            if function_name in line:
                function_def = line.strip()
                break

# Create and write header stuff to the testing file
# This doesn't work if there is an existing testing file! MUST DELETE FILE BEFORE RUNNING!
testing_file = file_name.partition(".")[0]+"_test.cpp"
f = open(testing_file, "x")
f.write("#include <gtest/gtest.h>\n")
f.write("extern "+function_def+";\n\n")


# Get test info
print("Input: ")
user_input = input()
print("Expected output: ")
exp_output = input()
print("Name of test: ")
test_name = input()

# Write test
f.write("TEST("+test_suite+", "+test_name+") {\n")
f.write("\tEXPECT_EQ(" + function_name + "(" + user_input + "), " + exp_output + ");\n")
f.write("}\n\n")

# Write main
f.write("int main(int argc, char **argv) {\n\t::testing::InitGoogleTest(&argc, argv); \n\treturn RUN_ALL_TESTS();\n}")
f.close()

print("Would you like to run the test?")
a = input()

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
os.system("echo "+"./"+function_name)
os.system("./"+function_name)