import tl = require('azure-pipelines-task-lib/task');
import fs, { fstat } from 'fs';
import { Guid } from "guid-typescript";
import Utils from './utils';



async function run() {

    try{
        
        let utils: Utils = new Utils();
        //get parameters from form
        let ProjectFile: string | undefined = tl.getInput('ProjectFile', true);
        let MethodOfVersionNumber: string | undefined = tl.getInput('MethodOfVersionNumber', true);
        let VersionNumberEnvVar: string | undefined = tl.getInput('VersionNumberEnvVar', false);

        let CombinePatchBuildNumbers: Boolean = false;
        if(tl.getInput('CombinePatchBuildNumbers')?.toLowerCase() == 'true'){
            CombinePatchBuildNumbers = true;
        }
        
        let UpdateProjectVersion: Boolean = false;
        if(tl.getInput('UpdateProjectVersion')?.toLowerCase() == 'true'){
            UpdateProjectVersion = true;
        }

        console.log('**********************************************************************');
        console.log('** ProjectFile', ProjectFile);
        console.log('** MethodOfVersionNumber' , MethodOfVersionNumber);
        console.log('** VersionNumberEnvVar' , VersionNumberEnvVar);
        console.log('** CombinePatchBuildNumbers' , CombinePatchBuildNumbers);
        console.log('** UpdateProjectVersion' , UpdateProjectVersion);
        console.log('**********************************************************************');

        let VersionNumber = "0.1.0";

        
        

        if ( MethodOfVersionNumber == 'BuildNumber' ) {
            const BUILD_BUILDNUMBER = tl.getVariable('Build.BuildNumber');
            console.log('BUILD_BUILDNUMBER : ' , BUILD_BUILDNUMBER);
            if (BUILD_BUILDNUMBER != undefined) {
                console.log('Setting version to value stored in: BUILD_BUILDNUMBER ' , BUILD_BUILDNUMBER);
                VersionNumber = utils.GetVersionNumber(BUILD_BUILDNUMBER) 
                console.log('Found Version Number to use: ' , VersionNumber);
            } else {
                console.log('The environment variable BUILD_BUILDNUMBER was not found.');
            }
        }
        else if ( MethodOfVersionNumber == 'Environment' ) {
            console.log('Examining the Environment Variable: ' , );
            
            if (VersionNumberEnvVar != undefined) { 
                const VersionNumberEnvVarContent = tl.getVariable(VersionNumberEnvVar);
                if(VersionNumberEnvVarContent != undefined){
                    VersionNumber = VersionNumberEnvVarContent;
                }
                
            } 
            else {
                console.log('The environment variable ' + VersionNumberEnvVar + ' was not found.');
            }
        }
        else if ( MethodOfVersionNumber == "GitVersion" ) {
            const GITVERSION_SEMVER = tl.getVariable('GITVERSION_SEMVER');
            const GITVERSION_MAJORMINORPATCH = tl.getVariable('GITVERSION_MAJORMINORPATCH');
            const GITVERSION_BRANCHNAME = tl.getVariable('GITVERSION_BRANCHNAME');
            const GITVERSION_COMMITSSINCEVERSIONSOURCE = tl.getVariable('GITVERSION_COMMITSSINCEVERSIONSOURCE');
            
            if (GITVERSION_SEMVER != undefined && GITVERSION_MAJORMINORPATCH != undefined && GITVERSION_BRANCHNAME != undefined && GITVERSION_COMMITSSINCEVERSIONSOURCE != undefined) {
                console.log('Setting version to value stored in: GITVERSION_MAJORMINORPATCH');
                VersionNumber = GITVERSION_MAJORMINORPATCH
                console.log('Git Version Number to use: ' , VersionNumber);
          
                if(GITVERSION_BRANCHNAME.substr(1,5) == 'tags/') {
                    console.log('This is a tagged release, so only use GITVERSION_MAJORMINORPATCH.');
                } else { 
                    console.log('Thisis not a tagged release, so continue to modify the version number.');
                    if (GITVERSION_COMMITSSINCEVERSIONSOURCE != undefined) {
                        console.log('Setting version to value stored in: GITVERSION_MAJORMINORPATCH and GITVERSION_COMMITSSINCEVERSIONSOURCE');
                        VersionNumber = GITVERSION_MAJORMINORPATCH + "." + GITVERSION_COMMITSSINCEVERSIONSOURCE;
                    }
                }
            }
        } 
        // elseif ( $MethodOfVersionNumber -eq "DateTime" ) {
        //   # YYYY.MM.DD.HH.MM.Second
        //   2359.59
        // }
        
        // ******************************************************
        if (VersionNumber == undefined) {
            console.log('Version Number was not extracted.')
        } else {
            console.log('Extracted Version Number: ', VersionNumber);
        }
        
        if (CombinePatchBuildNumbers == true) {
            console.log('Combining the Patch and Build Numbers.');
            VersionNumber = utils.GetCombinedPatchBuildNumbers(VersionNumber);
        } else {
            console.log('Combining the Patch and Build Numbers was skipped!');
        }

        if (ProjectFile != undefined && !fs.existsSync(ProjectFile))
        {
            console.log('Could not find BTDF Project file: ' , ProjectFile);

        } else {

            console.log('Version Number to use: ' + VersionNumber);
            console.log('Project file to modify: ' + ProjectFile);

            if(ProjectFile != undefined && fs.existsSync(ProjectFile))
            {
                let FileContents = fs.readFileSync(ProjectFile,'utf8');

                let NewFileContents = FileContents.replace(/<ProductVersion>(.+?)<\/ProductVersion>/,"<ProductVersion>" + VersionNumber + "</ProductVersion>");
                if(UpdateProjectVersion == true){
                    //regex replace....
                    NewFileContents = NewFileContents.replace(/<ProjectVersion>(.+?)<\/ProjectVersion>/,"<ProjectVersion>" + VersionNumber + "</ProjectVersion>");
                }
                let NewGuidToUse = Guid.create();
                console.log('Guid to use: ', NewGuidToUse);
                let NewFileContents2 = NewFileContents.replace(/<ProductId>(.+?)<\/ProductId>/ ,"<ProductId>" + NewGuidToUse + "</ProductId>");
                
                fs.writeFileSync(ProjectFile, NewFileContents2);
            }
            
        
        }


    } catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();