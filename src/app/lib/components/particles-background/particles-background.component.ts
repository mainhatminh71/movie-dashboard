// src/app/lib/components/particles-background/particles-background.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxParticlesModule } from '@tsparticles/angular';
import { loadSlim } from '@tsparticles/slim';
import { loadStarsPreset } from '@tsparticles/preset-stars';
import type { Engine } from '@tsparticles/engine';

@Component({
  selector: 'app-particles-background',
  standalone: true,
  imports: [NgxParticlesModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ngx-particles
      [id]="'tsparticles'"
      [options]="particlesOptions"
      [particlesInit]="particlesInit"
      class="particles-container"
    ></ngx-particles>
  `,
  styles: [`
    .particles-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
    }
  `]
})
export class ParticlesBackgroundComponent {
  particlesOptions = {
    preset: "stars" as const,
    background: {
      color: {
        value: "transparent" // Transparent để không che background gradient
      }
    },
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#00b9ae" // Primary color của bạn
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: 0.3,
        random: true,
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.1,
          sync: false
        }
      },
      size: {
        value: 2,
        random: true,
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 0.5,
          sync: false
        }
      },
      move: {
        enable: true,
        speed: 0.5,
        direction: "none" as const,
        random: false,
        straight: false,
        outModes: {
          default: "out" as const
        }
      }
    },
    interactivity: {
      detectsOn: "canvas" as const,
      events: {
        onHover: {
          enable: true,
          mode: "repulse"
        },
        onClick: {
          enable: true,
          mode: "push"
        },
        resize: {
          enable: true
        }
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4
        },
        push: {
          quantity: 4
        }
      }
    },
    detectRetina: true
  };

  async particlesInit(engine: Engine): Promise<void> {
    await loadSlim(engine);
    await loadStarsPreset(engine);
  }
}