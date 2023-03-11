export const appconfig = {
  DEBUG_STUB_HTTP_CLIENT_MODE: true,

  appHttpTimeout_sec: 15,
  appAjaxServerUrl: 'http://localhost:4200/Api/',
  appAjaxRetryCount: 2,
  appAjaxRetryDelay_sec: 5,

  appLoginDialogComponentInitialData: {
    endpoint_GetDialogMode: 'Login/GetDialogMode',
    endpoint_SetUserPassword: 'Login/SetUserPassword',
    endpoint_Login: 'Login/Login',
    hasCloseButton: false
  },

  appAuthEndpoints: {
    isLoggedin: 'Auth/IsLoggedin',
    getLoggedinUserInfo: 'Auth/GetLoggedinUserInfo',
    isAuthorizedPage: 'Auth/IsAuthorizedPage',
  },
};