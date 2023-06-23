// I ♥︎ JS :)

// eslint-disable-next-line no-unused-vars
enum ADAPTER_EVENTS {
    // eslint-disable-next-line no-unused-vars
    ADAPTER_DATA_UPDATED = 'adapter_data_updated',
    // eslint-disable-next-line no-unused-vars
    NOT_READY = 'not_ready',
    // eslint-disable-next-line no-unused-vars
    READY = 'ready',
    // eslint-disable-next-line no-unused-vars
    CONNECTING = 'connecting',
    // eslint-disable-next-line no-unused-vars
    CONNECTED = 'connected',
    // eslint-disable-next-line no-unused-vars
    DISCONNECTED = 'disconnected',
    // eslint-disable-next-line no-unused-vars
    ERRORED = 'errored',
}

// eslint-disable-next-line no-unused-vars
enum CHAIN_NAMESPACES {
    // eslint-disable-next-line no-unused-vars
    EIP155 = 'eip155',
    // eslint-disable-next-line no-unused-vars
    SOLANA = 'solana',
    // eslint-disable-next-line no-unused-vars
    OTHER = 'other',
}

// declare const ADAPTER_STATUS: {
//     readonly NOT_READY: 'not_ready';
//     readonly READY: 'ready';
//     readonly CONNECTING: 'connecting';
//     readonly CONNECTED: 'connected';
//     readonly DISCONNECTED: 'disconnected';
//     readonly ERRORED: 'errored';
// };

export { ADAPTER_EVENTS, CHAIN_NAMESPACES };
