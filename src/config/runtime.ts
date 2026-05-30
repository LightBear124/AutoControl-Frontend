const APP_MODE_STORAGE_KEY = 'autocontrol_app_mode';

function detectMockMode(): boolean {
  /*
    На GitHub Pages всегда используем mock.
    Даже если в localStorage случайно осталось значение api.
  */
  if (window.location.hostname.endsWith('github.io')) {
    return true;
  }

  const savedMode = localStorage.getItem(APP_MODE_STORAGE_KEY);

  if (savedMode === 'mock') {
    return true;
  }

  if (savedMode === 'api') {
    return false;
  }

  return false;
}

export const IS_MOCK_MODE = detectMockMode();

export const DATA_SOURCE_LABEL = IS_MOCK_MODE
  ? 'Mock-данные'
  : 'Backend API';

export function enableMockMode(): void {
  localStorage.setItem(APP_MODE_STORAGE_KEY, 'mock');
  window.location.reload();
}

export function enableApiMode(): void {
  localStorage.setItem(APP_MODE_STORAGE_KEY, 'api');
  window.location.reload();
}

export function resetAppMode(): void {
  localStorage.removeItem(APP_MODE_STORAGE_KEY);
  window.location.reload();
}