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

import { get } from 'svelte/store';
import { expect, test } from 'vitest';

import { disabledModels, isModelEnabled, modelKey, toggleModel } from './model-catalog';

test('modelKey joins providerId and label with colon', () => {
  expect(modelKey('gemini', 'gemini-2.5-flash')).toBe('gemini:gemini-2.5-flash');
});

test('isModelEnabled returns true when model is not in disabled set', () => {
  const disabled = new Set<string>();
  expect(isModelEnabled(disabled, 'gemini', 'gemini-2.5-flash')).toBe(true);
});

test('isModelEnabled returns false when model is in disabled set', () => {
  const disabled = new Set(['gemini:gemini-2.5-flash']);
  expect(isModelEnabled(disabled, 'gemini', 'gemini-2.5-flash')).toBe(false);
});

test('toggleModel adds model to disabled set and persists', () => {
  const key = 'toggle-test-provider:toggle-test-model';

  expect(get(disabledModels).has(key)).toBe(false);

  toggleModel('toggle-test-provider', 'toggle-test-model');

  expect(get(disabledModels).has(key)).toBe(true);

  const stored = JSON.parse(localStorage.getItem('model-catalog-disabled-models') ?? '[]') as string[];
  expect(stored).toContain(key);
});

test('toggleModel removes model from disabled set when toggled twice', () => {
  const key = 'toggle-twice-provider:toggle-twice-model';

  toggleModel('toggle-twice-provider', 'toggle-twice-model');
  expect(get(disabledModels).has(key)).toBe(true);

  toggleModel('toggle-twice-provider', 'toggle-twice-model');
  expect(get(disabledModels).has(key)).toBe(false);
});
