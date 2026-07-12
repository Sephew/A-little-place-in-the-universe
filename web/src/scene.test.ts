import { describe, it, expect } from 'vitest';
import { SceneRouter } from './scene';
import type { Scene } from './scene';

function fakeScene(log: string[], name: string): Scene {
  return {
    mount: () => log.push(`mount ${name}`),
    unmount: () => log.push(`unmount ${name}`),
  };
}

describe('SceneRouter', () => {
  it('mounts one scene and tears down the previous before the next mounts', () => {
    const log: string[] = [];
    const router = new SceneRouter({} as HTMLElement);

    router.go(() => fakeScene(log, 'a'));
    router.go(() => fakeScene(log, 'b'));

    expect(log).toEqual(['mount a', 'unmount a', 'mount b']);
  });

  it('the first switch mounts without an unmount', () => {
    const log: string[] = [];
    const router = new SceneRouter({} as HTMLElement);

    router.go(() => fakeScene(log, 'only'));

    expect(log).toEqual(['mount only']);
    expect(router.active).not.toBeNull();
  });
});
