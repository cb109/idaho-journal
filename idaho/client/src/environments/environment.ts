// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export var environment = {
  production: false,

  apiUrl: 'http://localhost:8000/api',
  tokenVerifyUrl: 'http://localhost:8000/api/token-verify/',
  tokenAuthUrl: 'http://localhost:8000/api/token-auth/',
  entriesCountUrl: 'http://localhost:8000/api/entries/count/',
  entriesUrl: 'http://localhost:8000/api/entries/',

  maxImageSize: 800,  // Pixels to limit images to in width/height.
};
