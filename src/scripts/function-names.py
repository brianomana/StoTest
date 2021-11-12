import sys, os, glob, re

def functionSearch(file_name):
    with open(file_name) as openfile:
        for line in openfile:
            if re.findall("^(int).*\(...*\)", line): # Need better regex than this probably?
                name = re.findall(" .*\(", line)[0] # Gets function name
                print(name[1:-1])
                # function_def = line.strip()

workspace_dir = sys.argv[1]
os.chdir(workspace_dir)
for file in glob.glob("*.cpp"):
    if not re.findall("_test.cpp$", file):
        functionSearch(file)
