# Notes

Requires a **config.js** file in the _src_ directory before building, this file will contain your API references and AWS Cognito settings, please use the following format:

```// config.js
export default {
    apiGateway: {
        REGION: 'us-east-2',
        API_URL: '',
        ITEMS_API_URL: '<API Endpoint>'
    },
    cognito: {
        REGION: '<Region>',
        USER_POOL_ID: '<Cognito User Pool ID',
        APP_CLIENT_ID: '<App Client ID>',
        IDENTITY_POOL_ID: '<Identity Pool Id>'
    }
};
```
