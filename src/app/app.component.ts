import { Component } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';
import { AppAnimations } from './utils/ngx/app-animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [AppAnimations.floatIn('routeAnimations')]
})
export class AppComponent {
  title = 'project-template';

  constructor(private contexts: ChildrenOutletContexts) { }

  getRouteAnimationState(): string | undefined {
    const animationState = this.contexts.getContext('primary')?.route?.snapshot.url.toString();
    console.debug(animationState);
    return animationState;
  }
}
