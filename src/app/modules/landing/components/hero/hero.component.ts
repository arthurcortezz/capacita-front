import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'landing-hero',
  templateUrl: './hero.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class LandingHeroComponent {
  constructor() {}

  scrollToAbout() {
    const aboutDiv = document.getElementById('about');
    if (aboutDiv) {
      const divRect = aboutDiv.getBoundingClientRect();
      const yOffset = divRect.top * 2 + window.scrollY;
      window.scrollTo({ top: yOffset, behavior: 'smooth' });
    }
  }
}
