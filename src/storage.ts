import { makeAutoObservable } from 'mobx';
import { Configuration } from './model.js';

const LAST_CONFIGURATION_KEY = 'form-builder.configuration';

export function loadLastConfiguration(): Configuration | undefined {
  const configurationJson = localStorage.getItem(LAST_CONFIGURATION_KEY);

  if (!configurationJson) return;

  try {
    const configuration = makeAutoObservable(JSON.parse(configurationJson));
    return configuration;
  } catch (e) {
    // Ignore
  }
}

export function saveLastConfiguration(configuration: Configuration) {
  const configurationJson = JSON.stringify(configuration);
  localStorage.setItem(LAST_CONFIGURATION_KEY, configurationJson);
}
