import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  ViewEncapsulation,
  AfterViewInit,
} from '@angular/core';

import { isLowEndExperience$ } from '../perfume';

@Component({
  selector: 'app-navigation',
  template: `
    <div class="layout-nav">
      <a
        href="{{ path }}#/home/"
        [class.active]="navSelected === navOptions.home"
        (click)="activeNav(navOptions.home)"
        >Home</a
      >
      <a
        href="{{ path }}#/real-user-measurements/"
        [class.active]="navSelected === navOptions.rum"
        (click)="activeNav(navOptions.rum)"
        >Real User Measurement</a
      >
      <a
        href="{{ path }}#/installing-and-imports/"
        [class.active]="navSelected === navOptions.installing"
        (click)="activeNav(navOptions.installing)"
        >Installing and Imports</a
      >
      <a
        href="{{ path }}#/quick-start/"
        [class.active]="navSelected === navOptions.quickStart"
        (click)="activeNav(navOptions.quickStart)"
        >Quick start</a
      >
      <br />
      <a
        href="{{ path }}#/navigation-timing/"
        class="part-two"
        [class.active]="navSelected === navOptions.navTime"
        (click)="activeNav(navOptions.navTime)"
        >Navigation Timing</a
      >
      <a
        href="{{ path }}#/resource-timing/"
        class="part-two"
        [class.active]="navSelected === navOptions.resTime"
        (click)="activeNav(navOptions.resTime)"
        >Resource Timing</a
      >
      <a
        href="{{ path }}#/first-paint/"
        class="part-two"
        [class.active]="navSelected === navOptions.fp"
        (click)="activeNav(navOptions.fp)"
        >First Paint</a
      >
      <a
        href="{{ path }}#/first-contentful-paint/"
        class="part-two"
        [class.active]="navSelected === navOptions.fcp"
        (click)="activeNav(navOptions.fcp)"
        >First Contentful Paint</a
      >
      <a
        href="{{ path }}#/largest-contentful-paint/"
        class="part-two"
        [class.active]="navSelected === navOptions.lcp"
        (click)="activeNav(navOptions.lcp)"
        >Largest Contentful Paint</a
      >
      <a
        href="{{ path }}#/first-input-delay/"
        class="part-two"
        [class.active]="navSelected === navOptions.fid"
        (click)="activeNav(navOptions.fid)"
        >First Input Delay</a
      >
      <a
        href="{{ path }}#/annotate-metrics/"
        class="part-two"
        [class.active]="navSelected === navOptions.annotate"
        (click)="activeNav(navOptions.annotate)"
        >Annotate metrics</a
      >
      <a
        href="{{ path }}#/component-first-paint/"
        class="part-two"
        [class.active]="navSelected === navOptions.cfp"
        (click)="activeNav(navOptions.cfp)"
        >Component First Paint</a
      >
      <a
        href="{{ path }}#/custom-logging/"
        class="part-two"
        [class.active]="navSelected === navOptions.log"
        (click)="activeNav(navOptions.log)"
        *ngIf="!isLowEndExperience"
        >Custom Logging</a
      >
      <br />
      <a
        href="{{ path }}#/analytics/"
        class="part-three"
        [class.active]="navSelected === navOptions.as"
        (click)="activeNav(navOptions.as)"
        >Analytics</a
      >
      <br />
      <a
        href="{{ path }}#/default-options/"
        class="part-four"
        [class.active]="navSelected === navOptions.options"
        (click)="activeNav(navOptions.options)"
        >Default Options</a
      >
      <a
        href="{{ path }}#/copyright-and-license/"
        class="part-four"
        [class.active]="navSelected === navOptions.copyright"
        (click)="activeNav(navOptions.copyright)"
        >Copyright and licenses</a
      >
      <a
        href="{{ path }}#/articles/"
        class="part-four"
        [class.active]="navSelected === navOptions.articles"
        (click)="activeNav(navOptions.articles)"
        *ngIf="!isLowEndExperience"
        >Articles</a
      >
    </div>
  `,
  styles: [
    `
      .layout-nav {
        display: none;
        padding: 0 0 0 20px;
        font-size: 1em;
        color: #222;
      }
      .layout-nav a {
        display: block;
        padding: 5px 10px;
        border-left: 2px solid transparent;
        border-left-color: rgba(249, 200, 40, 0.4);
        line-height: 20px;
        text-decoration: none;
      }
      .layout-nav a.part-two {
        border-left-color: rgba(235, 185, 180, 0.4);
      }
      .layout-nav a.part-three {
        border-left-color: rgba(187, 219, 230, 0.4);
      }
      .layout-nav a.part-four {
        border-left-color: rgba(198, 178, 238, 0.4);
      }
      .layout-nav a.part-angular {
        border-left-color: rgba(212, 43, 38, 0.4);
      }
      .layout-nav a.part-react {
        border-left-color: rgba(97, 218, 251, 0.4);
      }
      .layout-nav a:hover,
      .layout-nav a.active {
        background: rgba(246, 225, 113, 0.3);
        border-left-color: rgba(227, 187, 180, 0.8);
      }
      @media (min-width: 960px) {
        .layout-nav {
          flex-shrink: 0;
          display: block;
          position: sticky;
          top: 10px;
          margin-top: 28px;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class NavigationComponent implements AfterViewInit {
  @HostBinding('class.layout-nav')
  classHost = true;
  path: string;
  navOptions: {
    [keyof: string]: string;
  };
  navSelected: string;
  isLowEndExperience: boolean;

  constructor(private ref: ChangeDetectorRef) {
    this.path = window.location.href.split('#')[0];
    this.navOptions = {
      rum: 'real-user-measurement',
      installing: 'installing-and-imports',
      quickStart: 'quick-start',
      navTime: 'navigation-timing',
      resTime: 'resource-timing',
      fp: 'first-paint',
      fcp: 'first-contentful-paint',
      lcp: 'largest-contentful-paint',
      fid: 'first-input-delay',
      cfp: 'component-first-paint',
      annotate: 'annotate-metrics',
      log: 'custom-logging',
      as: 'analytics',
      options: 'default-options',
      copyright: 'copyright-and-license',
      articles: 'articles',
    };
  }

  ngAfterViewInit() {
    isLowEndExperience$.subscribe(result => {
      this.isLowEndExperience = result;
      this.ref.detectChanges();
    });
  }

  activeNav(selected) {
    this.navSelected = selected;
  }
}
