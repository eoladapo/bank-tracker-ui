declare module '@mono.co/connect.js' {
  interface MonoConnectConfig {
    key: string;
    onSuccess: (data: { code: string }) => void;
    onClose?: () => void;
    onLoad?: () => void;
    onEvent?: (eventName: string, data: Record<string, unknown>) => void;
  }

  class MonoConnect {
    constructor(config: MonoConnectConfig);
    setup(): void;
    open(): void;
    close(): void;
  }

  export default MonoConnect;
}
