import TdClient from 'tdweb/dist/tdweb';
import packageJson from '../../package.json';
import EventEmitter from './EventEmitter';

function databaseExists(dbname, callback) {
  let req = indexedDB.open(dbname);
  let existed = true;
  req.onsuccess = function() {
    req.result.close();
    if (!existed) indexedDB.deleteDatabase(dbname);
    callback(existed);
  };
  req.onupgradeneeded = () => {
    existed = false;
  };
}

class TdLibController extends EventEmitter {
  constructor() {
    super();

    // prod: uncomment
    // const deviceInfo = tizen.systeminfo.getPropertyValue('BUILD', (build) => {
    //   console.log(build);
    //   return build;
    // });
    const deviceInfo = {
      manufacturer: 'Samsung',
      model: 'Galaxy Watch 3',
      buildVersion: 'Tizen 5.5',
    };

    this.disableLog = false;
    this.parameters = {
      '@type': 'tdParameters',
      use_test_dc: true, // prod: use_test_dc: false
      api_id: process.env['REACT_APP_APP_ID'],
      api_hash: process.env['REACT_APP_APP_HASH'],
      system_language_code: /*tizen.systeminfo.getPropertyValue('LOCALE', (locale) => locale.language) ||*/ 'en',
      device_model: [deviceInfo.manufacturer, deviceInfo.model].join(' '),
      system_version: deviceInfo.buildVersion,
      application_version: packageJson.version,
      use_secret_chats: false,
      use_message_database: true,
      use_file_database: true,
    };
  };

  init = async () => {
    const options = {
      instanceName: 'tdweb',
      isBackground: false,
      logVerbosityLevel: 1,
      jsLogVerbosityLevel: 3,
      fastUpdating: true,
      mode: 'auto',
      useDatabase: true,
    };

    return new Promise((resolve, reject) => {
      databaseExists(options.instanceName, exists => {
        this.clientUpdate({'@type': 'clientUpdateTdLibDatabaseExists', exists});

        console.log(
            `[TdLibController] (fast_updating=${options.fastUpdating}) 
          Start client with params=${JSON.stringify(options)}`,
        );

        this.client = new TdClient(options);
        this.client.onUpdate = update => {
          if (!this.disableLog) {
            if (update['@type'] === 'updateFile') {
              console.log('receive updateFile file_id=' + update.file.id, update);
            } else {
              console.log('receive update', update);
            }
          }
          this.emit('update', update);
        };
        resolve();
      });
    });
  };

  send = async (request) => {
    if (!this.client) {
      console.log('send (none init)', request);
      return Promise.reject('tdweb client is not ready yet');
    }

    if (!this.disableLog) {
      console.log('send', request);

      return this.client.send(request).then(result => {
        console.log('send result', result);
        return result;
      }).catch(error => {
        console.error('send error', error);

        throw error;
      });
    } else {
      return this.client.send(request);
    }
  };

  clientUpdate = (update) => {
    if (!this.disableLog) {
      console.log('clientUpdate', update);
    }
    this.emit('clientUpdate', update);
  };

  sendTdParameters = () => {
    if (!this.parameters.api_id || !this.parameters.api_hash) {
      console.error('API id is missing!');
    }

    this.send({'@type': 'setTdlibParameters', parameters: this.parameters});
    this.send({
      '@type': 'setOption',
      name: 'use_quick_ack',
      value: {
        '@type': 'optionValueBoolean',
        value: true,
      },
    });
  };

  logOut() {
    this.send({'@type': 'logOut'}).catch(error => {
      this.emit('tdlib_auth_error', error);
    });
  }

  setChatId = (chatId, messageId = null, options = {}) => {
    const update = {
      '@type': 'clientUpdateChatId',
      chatId,
      messageId,
      options,
    };

    this.clientUpdate(update);
  };

  setMediaViewerContent(content) {
    this.clientUpdate({
      '@type': 'clientUpdateMediaViewerContent',
      content: content,
    });
  }
}

const controller = new TdLibController();
export default controller;
