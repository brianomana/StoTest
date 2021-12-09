import os, sys, subprocess

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
    subprocess.Popen(command, cwd=workspace_dir, shell=True).wait()

# Run tests
def runTests(function_name):
    command = "./"+function_name+" > output.txt"
    print(command)
    subprocess.Popen(command, cwd=workspace_dir, shell=True).wait()


# Main
workspace_dir = sys.argv[1]
file_name = sys.argv[2]
function_name = sys.argv[3]
testing_file = sys.argv[4]
compile(file_name, function_name, testing_file)
runTests(function_name)
