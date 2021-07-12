split-path -parent $MyInvocation.MyCommand.Definition | cd;
yarn build;
cd .\build\;
C:\tizen-studio\tools\ide\bin\tizen.bat package --type wgt;
C:\tizen-studio\tools\sdb.exe install .\Weargram.wgt;