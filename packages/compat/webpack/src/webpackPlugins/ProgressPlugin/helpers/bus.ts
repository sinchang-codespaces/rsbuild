import { Console } from 'console';
import patchConsole from '../../../../compiled/patch-console';
import cliTruncate from '../../../../compiled/cli-truncate';
import type { Props } from './type';
import { FULL_WIDTH, renderBar } from './bar';
import { create } from './log';
import type { LogUpdate } from './log';
import { getProgressColor } from '@rsbuild/shared';

class Bus {
  states: Partial<Props>[] = [];

  log: LogUpdate;

  restore: () => void;

  prevOutput: string;

  destroyed: boolean = false;

  constructor() {
    this.prevOutput = '';
    this.log = create(process.stdout);
    console.Console = Console;
    this.restore = patchConsole((type, data) => {
      this.writeToStd(type, data);
    });
  }

  update(state: Partial<Props>) {
    const index = this.states.findIndex((i) => i.id === state.id);
    if (index === -1) {
      this.states.push(state);
      return;
    }
    this.states[index] = state;
  }

  writeToStd(type: 'stdout' | 'stderr' = 'stdout', data?: string) {
    this.log.clear();

    if (data) {
      if (type === 'stdout') {
        process.stdout.write(data);
      } else if (type === 'stderr') {
        process.stderr.write(data);
      }
    }

    this.log(this.prevOutput);
  }

  render() {
    const maxIdLen = Math.max(...this.states.map((i) => i.id?.length ?? 0)) + 2;
    const { columns = FULL_WIDTH } = process.stdout;
    this.prevOutput = this.states
      .map((i, k) => {
        const bar = renderBar({
          maxIdLen,
          color: i.color ?? getProgressColor(k),
          ...i,
        });
        if (bar) {
          return cliTruncate(bar, columns, { position: 'end' });
        }
        return null;
      })
      .filter((item) => item !== null)
      .join('\n');

    this.writeToStd();
  }

  destroy() {
    if (!this.destroyed) {
      this.restore();
    }
    this.destroyed = true;
  }

  clear() {
    this.log.clear();
    this.log.done();
  }
}
const bus = new Bus();

export { bus };
