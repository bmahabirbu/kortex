import { writable } from 'svelte/store';

const STORAGE_KEY = 'model-catalog-disabled-models';

function loadDisabledModels(): Set<string> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return new Set();
  try {
    return new Set(JSON.parse(stored) as string[]);
  } catch {
    return new Set();
  }
}

function saveDisabledModels(disabled: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...disabled]));
  } catch (err: unknown) {
    console.error('Failed to persist disabled models', err);
  }
}

const initial = loadDisabledModels();
export const disabledModels = writable<Set<string>>(initial);

export function modelKey(providerId: string, label: string): string {
  return `${providerId}:${label}`;
}

export function toggleModel(providerId: string, label: string): void {
  disabledModels.update(set => {
    const key = modelKey(providerId, label);
    const next = new Set(set);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    saveDisabledModels(next);
    return next;
  });
}

export function isModelEnabled(disabled: Set<string>, providerId: string, label: string): boolean {
  return !disabled.has(modelKey(providerId, label));
}
