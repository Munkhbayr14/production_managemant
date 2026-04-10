export const CONSTANTS = {
  entities: ['./dist/src/**/**/entities/*'],
  entitiesTs: ['./src/**/**/**/entities/*'],
};

export const CACHE_KEYS = {
  FAQ_LIST: 'FAQ_LIST',
};

export const PUSH_NOTIF_OPTION_IOS = {
  headers: {
    'apns-priority': '10',
  },
  payload: {
    aps: {
      sound: 'default',
    },
  },
};

export const PUSH_NOTIF_OPTION_ANDROID = {
  notification: {
    sound: 'default',
  },
};

export const jwtConstants = {
  secret: "secretKey",
};

export default CONSTANTS;
