# Unofficial Telegram client for Galaxy Wearables

## Dev setup

   1. Add custom device to devtools of your browser with the following parameters:
   
      * width = 360px
      * height = 360px
      * device pixel ratio = 1.5
      * user agent type = mobile
   
   2. Obtain API ID and API hash on [my.telegram.org](https://my.telegram.org) and populate the `.env` file
   
   3. Manually copy TDLib files into the public folder.
       ```sh
       cp node_modules/tdweb/dist/* public/
       ```
   
   4. To start app run following commands:
       ```sh
       yarn install
       yarn start
       ```
   
   5. Open browser devtools, enable Device Mode and select the device you have created in step 1.

## Run on emulator

   ### Using CLI script
   
   1. Set up and start tizen wearable emulator
   2. Run `build.ps1` powershell script
   
   ### Manual installation
   
   1. Run `yarn build` 
   2. Open the created `build/` folder in Tizen Studio
   3. Press run button in Tizen Studio's toolbar
