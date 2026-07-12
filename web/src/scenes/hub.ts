import { makeCanvasScene } from './canvas-scene';
import type { Scene } from '../scene';

export const hub = (): Scene => makeCanvasScene('hub — the void', 160);
