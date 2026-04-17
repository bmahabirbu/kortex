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

import { expect, test } from 'vitest';

import type { ProviderInfo } from '/@api/provider-info';

import { getCatalogModels, getInferenceConnectionSummaries, getModels } from './models-utils';

function makeProviderInfo(overrides: Partial<ProviderInfo> = {}): ProviderInfo {
  return {
    internalId: 'internal-1',
    id: 'test-provider',
    extensionId: 'ext-1',
    name: 'Test Provider',
    containerConnections: [],
    kubernetesConnections: [],
    vmConnections: [],
    inferenceConnections: [],
    ragConnections: [],
    flowConnections: [],
    status: 'ready',
    containerProviderConnectionCreation: false,
    containerProviderConnectionInitialization: false,
    kubernetesProviderConnectionCreation: false,
    kubernetesProviderConnectionInitialization: false,
    vmProviderConnectionCreation: false,
    vmProviderConnectionInitialization: false,
    inferenceProviderConnectionCreation: false,
    inferenceProviderConnectionInitialization: false,
    ragProviderConnectionCreation: false,
    ragProviderConnectionInitialization: false,
    links: [],
    detectionChecks: [],
    warnings: [],
    images: {},
    installationSupport: false,
    cleanupSupport: false,
    ...overrides,
  } as ProviderInfo;
}

test('getModels returns empty array for providers without inference connections', () => {
  const result = getModels([makeProviderInfo()]);
  expect(result).toEqual([]);
});

test('getModels extracts models from inference connections', () => {
  const provider = makeProviderInfo({
    id: 'openai',
    inferenceConnections: [
      {
        connectionType: 'inference',
        name: 'default',
        type: 'cloud',
        status: 'started',
        models: [{ label: 'gpt-4' }, { label: 'gpt-3.5' }],
      },
    ],
  });

  const result = getModels([provider]);
  expect(result).toHaveLength(2);
  expect(result[0]).toEqual({
    providerId: 'openai',
    connectionName: 'default',
    type: 'cloud',
    label: 'gpt-4',
  });
});

test('getCatalogModels includes connectionStatus and providerName', () => {
  const provider = makeProviderInfo({
    id: 'anthropic',
    name: 'Anthropic',
    inferenceConnections: [
      {
        connectionType: 'inference',
        name: 'my-connection',
        type: 'cloud',
        status: 'started',
        models: [{ label: 'claude-3' }],
      },
    ],
  });

  const result = getCatalogModels([provider]);
  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    providerId: 'anthropic',
    providerName: 'Anthropic',
    connectionName: 'my-connection',
    type: 'cloud',
    label: 'claude-3',
    connectionStatus: 'started',
  });
});

test('getCatalogModels returns empty array when no providers', () => {
  expect(getCatalogModels([])).toEqual([]);
});

test('getCatalogModels handles connections with no models', () => {
  const provider = makeProviderInfo({
    inferenceConnections: [
      {
        connectionType: 'inference',
        name: 'empty',
        type: 'cloud',
        status: 'stopped',
        models: [],
      },
    ],
  });

  expect(getCatalogModels([provider])).toEqual([]);
});

test('getInferenceConnectionSummaries returns summaries for each connection', () => {
  const provider = makeProviderInfo({
    id: 'openai',
    name: 'OpenAI',
    inferenceConnections: [
      {
        connectionType: 'inference',
        name: 'conn-1',
        type: 'cloud',
        status: 'started',
        models: [{ label: 'gpt-4' }, { label: 'gpt-3.5' }],
      },
      {
        connectionType: 'inference',
        name: 'conn-2',
        type: 'self-hosted',
        status: 'stopped',
        models: [{ label: 'custom-model' }],
      },
    ],
  });

  const result = getInferenceConnectionSummaries([provider]);
  expect(result).toHaveLength(2);
  expect(result[0]).toEqual({
    providerName: 'OpenAI',
    providerId: 'openai',
    providerInternalId: 'internal-1',
    connectionName: 'conn-1',
    connectionType: 'cloud',
    status: 'started',
    modelCount: 2,
    creationDisplayName: 'OpenAI',
  });
  expect(result[1]).toEqual({
    providerName: 'OpenAI',
    providerId: 'openai',
    providerInternalId: 'internal-1',
    connectionName: 'conn-2',
    connectionType: 'self-hosted',
    status: 'stopped',
    modelCount: 1,
    creationDisplayName: 'OpenAI',
  });
});

test('getInferenceConnectionSummaries returns empty for no providers', () => {
  expect(getInferenceConnectionSummaries([])).toEqual([]);
});

test('getInferenceConnectionSummaries skips providers without inference connections', () => {
  const result = getInferenceConnectionSummaries([makeProviderInfo()]);
  expect(result).toEqual([]);
});
