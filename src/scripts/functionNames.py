import sys, os, glob, re

def functionSearch(file_name):
    with open(file_name) as openfile:
        for line in openfile:
            if re.findall("^[(int)|(double)|(float)|(bool)|(char*)].*\(...*\)", line): # Need better regex than this probably?
                definition = line.strip() # Remove newline character
                if definition[-1] == '{':
                    definition = definition[:-1] # Remove open curly brace
                name = re.findall(" .*\(", line)[0] # Gets function name
                if not glob.glob(name[1:-1] + "_test.cpp"):
                    print("{ \"name\": \"" + name[1:-1] + "\", \"def\": \"" + definition + "\", \"file\": \"" + file_name +"\", \"tests\": false }")
                else:
                    print("{ \"name\": \"" + name[1:-1] + "\", \"def\": \"" + definition + "\", \"file\": \"" + file_name +"\", \"tests\": true }")
                # Also include file name

workspace_dir = sys.argv[1]
os.chdir(workspace_dir)
for file in glob.glob("*.cpp"):
    if not re.findall("_test.cpp$", file):
        functionSearch(file)

