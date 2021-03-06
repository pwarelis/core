import {OnixJS} from '../index';
import * as path from 'path';
import {OnixConfig, BootConfig} from '../interfaces';
/**
 * @class HostBoot
 * @author Jonathan Casarrubias
 * @license MIT
 * @description This class will be the initial point for
 * any OnixJS Context.
 *
 * A OnixJS Context is a set of Applications running under the
 * same Service Host coordination.
 */
export class HostBoot {
  /**
   * @prop host
   * @description OnixJS host context reference.
   */
  private host: OnixJS;
  /**
   * @constructor
   * @author Jonathan Casarrubias
   * @param bc
   * @param hc
   * @description If apps are provided will create
   * a OnixJS Service Host and load the provided
   * Applications.
   *
   * OnixJS Applications are in SOA Contex refers to
   * SOA Services.
   *
   * SOA Services should be self-contained and as decoupled
   * as possible from other services.
   *
   * Please review the SOA Patterns and Anti-Patterns when
   * designing your OnixJS Appliactions.
   */
  constructor(
    private bc: BootConfig,
    private hc: OnixConfig = {
      // Default working directory points to ./dist
      cwd: path.join(process.cwd(), 'dist'),
    },
  ) {
    // Make sure we got the right configuration before
    // we actually try to create a OnixJS context.
    if (
      typeof bc === 'object' &&
      Array.isArray(bc.apps) &&
      bc.apps.length > 0
    ) {
      this.host = new OnixJS(hc);
    } else {
      throw new Error('OnixJS: No apps to be loaded');
    }
  }

  async run() {
    this.host = new OnixJS(this.hc);
    this.bc.apps.forEach(async app => await this.host.load(app));
    await this.host.start();
  }
}
