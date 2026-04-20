/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

import { existsSync } from 'node:fs';
import { join } from 'node:path';

import type { Disposable } from '@openkaiden/api';
import { inject, injectable, preDestroy } from 'inversify';

import { CliToolRegistry } from '/@/plugin/cli-tool-registry.js';
import { Exec } from '/@/plugin/util/exec.js';

@injectable()
export class KdnCliTool implements Disposable {
  private cliToolDisposable: Disposable | undefined;

  constructor(
    @inject(CliToolRegistry)
    private readonly cliToolRegistry: CliToolRegistry,
    @inject(Exec)
    private readonly exec: Exec,
  ) {}

  private getBundledPath(): string | undefined {
    if (!process.resourcesPath) {
      return undefined;
    }
    const binaryName = process.platform === 'win32' ? 'kdn.exe' : 'kdn';
    const bundledPath = join(process.resourcesPath, 'kdn', binaryName);
    if (existsSync(bundledPath)) {
      return bundledPath;
    }
    return undefined;
  }

  private async getVersion(binaryPath: string): Promise<string | undefined> {
    try {
      const result = await this.exec.exec(binaryPath, ['version']);
      // kdn writes version to stderr: "kdn version 0.5.0"
      const output = (result.stdout || result.stderr).trim();
      const parts = output.split(' ');
      return parts[parts.length - 1];
    } catch {
      return undefined;
    }
  }

  async init(): Promise<void> {
    const bundledPath = this.getBundledPath();
    if (!bundledPath) {
      return;
    }

    const version = await this.getVersion(bundledPath);

    this.cliToolDisposable = this.cliToolRegistry.createCliTool(
      { id: 'kaiden', label: 'Kaiden' },
      {
        name: 'kdn',
        displayName: 'kdn',
        markdownDescription: 'Kaiden CLI for managing agent workspaces',
        images: {},
        version,
        path: bundledPath,
        installationSource: 'bundled',
      },
    );
  }

  @preDestroy()
  dispose(): void {
    this.cliToolDisposable?.dispose();
  }
}
