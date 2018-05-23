// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  firebase:
  {
    apiKey: "AIzaSyBq_tDrPpwd2PAJeC6u2-RQ-JZsdczWxbY",
    authDomain: "geoinfocollector.firebaseapp.com",
    databaseURL: "https://geoinfocollector.firebaseio.com",
    projectId: "geoinfocollector",
    storageBucket: "geoinfocollector.appspot.com",
    messagingSenderId: "1067147816866"
  },
  mapbox: {
    accessToken: 'pk.eyJ1Ijoid2FyZTE4NSIsImEiOiJjamV0cmt5cDUyZ25iMnFtdW94Z2dodWRvIn0.jXMFMDsySuhJQG1xMzdTKg'
  }
};
