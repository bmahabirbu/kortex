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

import type { RunResult } from '@openkaiden/api';
import { beforeEach, expect, test, vi } from 'vitest';

import type { CliToolRegistry } from '/@/plugin/cli-tool-registry.js';
import type { Proxy as ProxyType } from '/@/plugin/proxy.js';
import { Exec } from '/@/plugin/util/exec.js';

import { KdnCliTool } from './kdn-cli-tool.js';

vi.mock(import('node:fs'));

const cliToolRegistry = {
  createCliTool: vi.fn().mockReturnValue({ dispose: vi.fn() }),
} as unknown as CliToolRegistry;

const proxy = { isEnabled: vi.fn().mockReturnValue(false) } as unknown as ProxyType;
const exec = new Exec(proxy);
let kdnCliTool: KdnCliTool;

beforeEach(() => {
  vi.resetAllMocks();
  Object.defineProperty(process, 'resourcesPath', { value: '/resources', configurable: true });
  vi.mocked(cliToolRegistry.createCliTool).mockReturnValue({ dispose: vi.fn() } as never);
  kdnCliTool = new KdnCliTool(cliToolRegistry, exec);
});

test('registers bundled kdn binary with version', async () => {
  vi.mocked(existsSync).mockReturnValue(true);
  vi.spyOn(exec, 'exec').mockResolvedValue({ stdout: 'kdn version 0.5.0' } as RunResult);

  await kdnCliTool.init();

  expect(cliToolRegistry.createCliTool).toHaveBeenCalledWith(
    expect.objectContaining({ id: 'kaiden' }),
    expect.objectContaining({ name: 'kdn', version: '0.5.0' }),
  );
});

test('skips registration when binary is not bundled', async () => {
  vi.mocked(existsSync).mockReturnValue(false);

  await kdnCliTool.init();

  expect(cliToolRegistry.createCliTool).not.toHaveBeenCalled();
});
