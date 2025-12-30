import {useEffect, useState} from 'react';
import type {DataJSON} from '../types';

interface UseSquidConfigReturn {
  dataJSON: DataJSON | null;
  isLoaded: boolean;
  error: Error | null;
  version: string;
  setVersion: (version: string) => void;
  updateEntry: (index: number, value: string) => void;
  toggleEntry: (index: number) => void;
  importConfig: (config: string) => Promise<string>;
}

export function useSquidConfig(): UseSquidConfigReturn {
  const [dataJSON, setDataJSON] = useState<DataJSON | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [version, setVersion] = useState('');

  useEffect(() => {
    async function loadConfigurationFile(httpRequestMethod: string, fetchUrl: string) {
      try {
        const headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        };

        const options: RequestInit = {
          method: httpRequestMethod,
          headers,
        };

        if (fetchUrl.endsWith('version')) {
          options.body = JSON.stringify({version});
        }

        const response = await fetch(fetchUrl, options);
        const json = await response.json() as DataJSON;
        setDataJSON(json);
        if (json.squid_version && json.squid_version.length > 0) {
          setVersion(json.squid_version[0]);
        }
        setIsLoaded(true);
      } catch (err) {
        setError(err as Error);
      }
    }

    setIsLoaded(false);
    if (version === '') {
      loadConfigurationFile('GET', '/json');
    } else {
      loadConfigurationFile('POST', '/version');
    }
  }, [version]);

  const updateEntry = (index: number, value: string) => {
    if (dataJSON) {
      setDataJSON({
        ...dataJSON,
        value: dataJSON.value.map((v, i) => (i === index ? value : v)),
      });
    }
  };

  const toggleEntry = (index: number) => {
    if (dataJSON) {
      setDataJSON({
        ...dataJSON,
        is_enabled: dataJSON.is_enabled.map((enabled, i) =>
          i === index ? (enabled ? 0 : 1) : enabled
        ),
      });
    }
  };

  const importConfig = async (configToImport: string): Promise<string> => {
    try {
      setIsLoaded(false);
      const response = await fetch('/import', {
        method: 'POST',
        body: configToImport,
        headers: {
          'Content-Type': 'text/plain',
        },
      });

      const json = await response.json() as DataJSON;

      if (!dataJSON) {
        throw new Error('No configuration loaded');
      }

      const newData = {...dataJSON};
      let counter = 0;
      let messageList = '';

      // Reset all entries
      for (let z = 0; z < json.id.length; z += 1) {
        newData.is_enabled[z] = 0;
      }

      // Apply imported values
      for (let z = 0; z < json.id.length; z += 1) {
        const position = json.id[z];
        if (json.id[z] === 999) {
          messageList = `${messageList} ${json.tags[z]};`;
        } else {
          newData.is_enabled[position] = 1;
          newData.value[position] = json.value[z];
          newData.switchable[position] = json.switchable[z];
          newData.switch_position[position] = json.switch_position[z];
          counter += 1;
        }
      }

      setDataJSON(newData);
      setIsLoaded(true);

      const skippedMessage = messageList
        ? ` The following entries were skipped as they are not present in current version:${messageList}`
        : '';

      return `Import completed: ${json.id.length} entries processed, ${counter} recognized.${skippedMessage}`;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    dataJSON,
    isLoaded,
    error,
    version,
    setVersion,
    updateEntry,
    toggleEntry,
    importConfig,
  };
}
