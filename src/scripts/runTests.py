import os, sys

# Compile unit test file
def compile(file_name, function_name, testing_file):
    # Create command
    gpp = "g++ -Wall -I/usr/local/cs/cs251 "
    files = file_name + " " + testing_file + " "
    lib = "-L/usr/local/cs/cs251/gtest -lgtest -lpthread "
    exe = "-o " + function_name

    # Create executable
    command = gpp + files + lib + exe
    print(command)
    os.system("echo "+command)
    os.system(command)

# Run tests
def runTests(function_name):
    print("echo "+"./"+function_name)
    os.system("echo "+"./"+function_name)
    os.system("./"+function_name+" > output.txt")


# Main
workspace_dir = sys.argv[1]
os.chdir(workspace_dir)
file_name = sys.argv[2]
function_name = sys.argv[3]
testing_file = sys.argv[4]
compile(file_name, function_name, testing_file)
runTests(function_name)
