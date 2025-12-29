import type {DataJSON} from '../types';

export function generateSquidConfiguration(dataJSON: DataJSON): string {
  let generatedSquidConfiguration = '';
  for (let i = 0; i < dataJSON.section_number.length; i += 1) {
    if (dataJSON.is_enabled[i]) {
      generatedSquidConfiguration = `${generatedSquidConfiguration}\n${dataJSON.value[i]}`;
    }
  }
  return generatedSquidConfiguration;
}

export function createVersionDropdownOptions(availableVersions: string[]) {
  return availableVersions.map((version, i) => ({
    key: i,
    text: version,
    value: version,
  }));
}

export function createSwitchOptions(tag: string) {
  return ['on', 'off'].map((key) => ({
    key: `${tag} ${key}`,
    text: `${tag} ${key}`,
    value: `${tag} ${key}`,
  }));
}
