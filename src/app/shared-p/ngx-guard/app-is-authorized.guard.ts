import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { AppAuthService } from "../auth/app-auth.service";
import { AppMessageBoxService } from "../bs-wrapper/app-message-box.service";
import { AppLocaleService } from "../locale/app-locale.service";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const appIsAuthorizedGuard: CanActivateFn = async (route, state) => {
  const appAuthService = inject(AppAuthService);
  const l = inject(AppLocaleService);
  const appMessageBoxService = inject(AppMessageBoxService);

  const isLoggedin = await appAuthService.isLoggedinOrStartLoginFlowAsync();
  if (isLoggedin) {
    const pageCd = route.routeConfig?.path ?? '';
    const result = await appAuthService.isAuthorizedPage(pageCd);
    if (result) {
      return true;
    }
  }
  await appMessageBoxService.showAsync(l.msg('W5005'), undefined, [{ name: 'OK', cssClass: 'btn-cta' }]);
  return false;
};
