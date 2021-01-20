export default class Utils {

    private DEBUG;
    private INFO;

    constructor(infoMessages: boolean = true, debugMessages: boolean = false){
      this.DEBUG = debugMessages;
      this.INFO = infoMessages;
    }

    public PadLeft(num:number, size:number): string {
        let s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }
   
    public GetVersionNumber(InputString: string): string
    {
      if(this.INFO || this.DEBUG){
        console.log('String to Parse version number: ' , InputString);
      }
      //const VersionRegex = "\d+\.\d+\.\d+\.\d+|\d+\.\d+\.\d+";
      //let VersionRegex = new RegExp('\d+\.\d+\.\d+\.\d+|\d+\.\d+\.\d+');
      let VersionData: RegExpMatchArray | null = InputString.match("\\d+\\.\\d+\\.\\d+\\.\\d+|\\d+\\.\\d+\\.\\d+");
      //const VersionData: any = [regex]::matches(InputString, VersionRegex);

      if(this.DEBUG){
        console.log('Version data : ');
        console.log(VersionData);
      }
      

      if(VersionData != null && VersionData.length > 0)
      {
        const parsedVersionNumber = VersionData[0]

        if(this.DEBUG){
          console.log('Matched Regex: ', VersionData[0]);
          console.log('parsedVersionNumber: ', parsedVersionNumber);
        }
        return parsedVersionNumber
      }
      else {
        if(this.INFO || this.DEBUG){
          console.log('Did not extract version number from string: ' , InputString);
        }
        return ""
      }
    }

    public GetCombinedPatchBuildNumbers(UnformattedVersionNumber: string):string
    {
      let tmpMajor = 0
      let tmpMinor = 0
      let tmpPatch = 0
      let tmpBuild = 0

      if(this.INFO || this.DEBUG){
        console.log('String to Parse version number: ' , UnformattedVersionNumber);
      }
    
      //let VersionRegex2 = new RegExp('(\d+)\.(\d+)\.(\d+)\.(\d+)|(\d+)\.(\d+)\.(\d+)');
      let VersionData: RegExpMatchArray | null = UnformattedVersionNumber.match(
          "(\\d+)\\.(\\d+)\\.(\\d+-alpha)\\.(\\d+)" + 
          "|(\\d+)\\.(\\d+)\\.(\\d+-beta)\\.(\\d+)" + 
          "|(\\d+)\\.(\\d+)\\.(\\d+-[a-zA-Z]+)\\.(\\d+)" + 
          "|(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)" + 
          
          "|(\\d+)\\.(\\d+)\\.([a-zA-Z0-9]+\\-[a-zA-Z0-9]+)" +
          "|(\\d+)\\.(\\d+)\\.([a-zA-Z0-9]+\\+[a-zA-Z0-9]+)" +

          "|(\\d+)\\.(\\d+)\\.(\\d+)"
          );
      //let VersionData: any = [regex]::matches(UnformattedVersionNumber, VersionRegex2)

      if(this.DEBUG){
       console.log('Version data : ');
       console.log(VersionData);
      }

      //we need to check which match was triggered and run the appropriate sqaush
      if(VersionData != null){

        if(VersionData[1] != undefined){
          //4 digit alpha
          tmpMajor = parseInt(VersionData[1]);
          tmpMinor = parseInt(VersionData[2]);
          tmpPatch = parseInt(VersionData[3].replace('-alpha',''));// 2-alpha
          tmpBuild = parseInt(VersionData[4]);
          return this.GetCombinedFourDigitVersionNumber(tmpMajor, tmpMinor, tmpPatch, tmpBuild);
        }

        if(VersionData[5] != undefined){
          //4 digit beta
          tmpMajor = parseInt(VersionData[5]);
          tmpMinor = parseInt(VersionData[6]);
          tmpPatch = parseInt(VersionData[7].replace('-beta',''));// 2-beta
          tmpBuild = parseInt(VersionData[8]);
          return this.GetCombinedFourDigitVersionNumber(tmpMajor, tmpMinor, tmpPatch, tmpBuild);
        }

        if(VersionData[9] != undefined){
          //4 digit rc
          tmpMajor = parseInt(VersionData[9]);
          tmpMinor = parseInt(VersionData[10]);
          tmpPatch = parseInt(VersionData[11].replace('-rc',''));// 2-rc
          tmpBuild = parseInt(VersionData[12]);
          return this.GetCombinedFourDigitVersionNumber(tmpMajor, tmpMinor, tmpPatch, tmpBuild);
        }

        if(VersionData[13] != undefined){
          //4 digit release
          tmpMajor = parseInt(VersionData[13]);
          tmpMinor = parseInt(VersionData[14]);
          tmpPatch = parseInt(VersionData[15]);
          tmpBuild = parseInt(VersionData[16]);
          return this.GetCombinedFourDigitVersionNumber(tmpMajor, tmpMinor, tmpPatch, tmpBuild);
        }



        if(VersionData[17] != undefined){
          //3 digit hyphenated version number
          tmpMajor = parseInt(VersionData[17]);
          tmpMinor = parseInt(VersionData[18]);
          //combined patch like 3-ci4, 3-4
          let delimetedParts = VersionData[19].split('-');
          
          tmpPatch = parseInt(delimetedParts[0].replace(/\D/g,''));
          tmpBuild = parseInt(delimetedParts[1].replace(/\D/g,''));

          if(this.DEBUG){
            console.log(delimetedParts);
            console.log(tmpPatch);
            console.log(tmpBuild);
          }
          

          return this.GetCombinedFourDigitVersionNumber(tmpMajor, tmpMinor, tmpPatch, tmpBuild);
        }

        if(VersionData[20] != undefined){
          //3 digit plus delimeted version number
          tmpMajor = parseInt(VersionData[20]);
          tmpMinor = parseInt(VersionData[21]);
          //combined patch like 3+ci4, 3+4
          let delimetedParts = VersionData[22].split('+');
          tmpPatch = parseInt(delimetedParts[0].replace(/\D/g,''));
          tmpBuild = parseInt(delimetedParts[1].replace(/\D/g,''));

          if(this.DEBUG){
            console.log(delimetedParts);
            console.log(tmpPatch);
            console.log(tmpBuild);
          }

          return this.GetCombinedFourDigitVersionNumber(tmpMajor, tmpMinor, tmpPatch, tmpBuild);
        }

        if(VersionData[23] != undefined){
          //3 digit version number
          return VersionData[23] + "." + VersionData[24] + "." + VersionData[25];
        }

      }
      
      if(this.INFO || this.DEBUG){
        console.log("I have no idea how to process this number");
      }

      return UnformattedVersionNumber;

    }
    
    public GetCombinedFourDigitVersionNumber(major: number, minor: number, patch: number, build: number): string{

        //if we have no tmpbuild number, it defaults to 0, we can then merge any number
        if(this.DEBUG){
          console.log('');
          console.log('About to add leading zeros to Patch Number: ' ,patch);
        }

        let newPatch = this.PadLeft(patch, 2);

        if(this.DEBUG){
          console.log('New Padded Patch Number = ' , newPatch);
          console.log('');
          console.log('About to add leading zeros to Build Number: ', build);
        }

        let newBuild = this.PadLeft(build, 3);
        
        if(this.DEBUG){
          console.log('New Padded Build Number = ', newBuild);
          console.log('');
        }

        let newPatchBuild: string = newPatch + newBuild;
    
        if (parseInt(newPatchBuild) > 65535) {
          //Throw error because we are going to get an MSI compilation error, so fix it here first.
          if(this.INFO || this.DEBUG){
            console.log('Invalid Patch Number version ' +  newPatchBuild + '. Patch Number must have a Patch version less than 65536.');
          }
        }
    
        let FinalVersionNumber = major + '.' + minor + '.' + newPatchBuild;

        if(this.INFO || this.DEBUG){
          console.log('Using Version Number : ' + FinalVersionNumber);
        }

        return FinalVersionNumber
       
    }
}
