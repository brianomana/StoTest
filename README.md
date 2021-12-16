# StoTest

StoTest is a Visual Studio Code extension designed for use in St. Olaf College CS courses. The extension offers a simple UI for students to setup and run GoogleTest testing files with little unit testing background knowledge. The intent is this tool will aid students as they complete assignments and encourage test-driven development practices. We are also begining development to equip TAs with the tools they need to use StoTest to grade student assignments. This will be done by leveraging StoGrade, the existing grader toolkit software at St. Olaf.

## Developer Quickstart

Here are some useful resources to get started contributing to StoTest.

### Developing a VS Code Extension

[Your First Extension](https://code.visualstudio.com/api/get-started/your-first-extension)
This is a tutorial for how to generate the framework for a VS Code extension. StoTest started as this based on the TypeScript template.

[Extension Guides](https://code.visualstudio.com/api/extension-guides/overview) 
General extension development documentation. The samples are simple VS Code extensions to show a certain feature or functionality. StoTest relies on Webviews being developed inside of the Tree View. Most documentation can be found within this guide.

### Integrating StoGrade

Integrating [StoGrade](https://github.com/stograde/stograde) will be an entire project within itself. Once integrated we plan on having a UI such as the image below. 
* This UI will organize and sort assignments by student to make it easy for graders to grade one student at a time 
* Importing test sets will allow graders to run these for every student 
* The grader should also have the ability to create unique tests for certain students with StoTest to test student claims 

<img width="800" alt="Grader View" src="https://user-images.githubusercontent.com/56805086/146436489-1419d8d8-9eae-4d5e-9e36-f95a4a168c28.png">
This UI reflects the concept of using the Test Explorer UI extension from VS Code to visualize test results


There are two ways StoGrade can be leveraged
1. StoGrade can connect to GitLab to pull a class of students code from StoGit using `stograde repo clone`
2. StoGrade can run a set of tests for each students' assignment. This is a built in feature of `stograde record`, but not a standalone function.

## Running the StoTest Locally

* Clone this repo
* Open within VS Code
* Run `npm install`
* Press F5 to open Extension Development Host window

