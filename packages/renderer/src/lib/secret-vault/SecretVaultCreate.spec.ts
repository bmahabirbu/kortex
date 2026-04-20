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

import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import SecretVaultCreate from './SecretVaultCreate.svelte';

vi.mock(import('/@/navigation'));

beforeEach(() => {
  vi.resetAllMocks();
});

test('Expect page title displayed', () => {
  render(SecretVaultCreate);

  const headings = screen.getAllByText('Add Secret');
  expect(headings.length).toBeGreaterThanOrEqual(1);
});

test('Expect display name input rendered', () => {
  render(SecretVaultCreate);

  expect(screen.getByPlaceholderText('e.g. GitHub · docs repo')).toBeInTheDocument();
});

test('Expect category selector rendered', () => {
  render(SecretVaultCreate);

  expect(screen.getByText('API Token')).toBeInTheDocument();
  expect(screen.getByText('Infrastructure')).toBeInTheDocument();
});

test('Expect credential type dropdown rendered', () => {
  render(SecretVaultCreate);

  expect(screen.getByRole('combobox', { name: 'Credential type' })).toBeInTheDocument();
});

test('Expect secret value input rendered', () => {
  render(SecretVaultCreate);

  expect(screen.getByPlaceholderText('Paste token or key')).toBeInTheDocument();
});

test('Expect expiration date input rendered', () => {
  render(SecretVaultCreate);

  expect(screen.getByLabelText('Expiration date')).toBeInTheDocument();
});

test('Expect no expiry checkbox rendered', () => {
  render(SecretVaultCreate);

  expect(screen.getByLabelText('No expiry')).toBeInTheDocument();
});

test('Expect Save Secret button disabled when required fields are empty', () => {
  render(SecretVaultCreate);

  expect(screen.getByRole('button', { name: 'Save Secret' })).toBeDisabled();
});

test('Expect Cancel button rendered', () => {
  render(SecretVaultCreate);

  expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
});

test('Expect cancel navigates back to secret vault', async () => {
  const { handleNavigation } = await import('/@/navigation');

  render(SecretVaultCreate);

  const cancelButton = screen.getByRole('button', { name: 'Cancel' });
  await fireEvent.click(cancelButton);

  expect(handleNavigation).toHaveBeenCalledWith({ page: 'secret-vault' });
});

test('Expect info callout displayed', () => {
  render(SecretVaultCreate);

  expect(screen.getByText(/you can connect this credential from agent workspaces/i)).toBeInTheDocument();
});
