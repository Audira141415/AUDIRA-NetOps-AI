// Real SSH Interactive Terminal Session using ssh2
// Direct PTY bidirectional streaming to web terminal

import { Client, ClientChannel, ConnectConfig } from 'ssh2';

export interface SshSessionConfig {
  host: string;
  port?: number;
  username: string;
  password?: string;
  privateKey?: string;
  passphrase?: string;
  cols?: number;
  rows?: number;
}

export class RealSshSession {
  public sessionId: string;
  public cols: number = 100;
  public rows: number = 30;

  private client: Client;
  private stream: ClientChannel | null = null;
  private outputCallback: (data: string) => void;
  private statusCallback: (status: 'connecting' | 'connected' | 'disconnected' | 'error', message?: string) => void;
  private isClosed: boolean = false;
  private isConnected: boolean = false;

  constructor(
    sessionId: string,
    config: SshSessionConfig,
    outputCallback: (data: string) => void,
    statusCallback: (status: 'connecting' | 'connected' | 'disconnected' | 'error', message?: string) => void
  ) {
    this.sessionId = sessionId;
    this.cols = config.cols && config.cols > 10 ? config.cols : 100;
    this.rows = config.rows && config.rows > 5 ? config.rows : 30;
    this.outputCallback = outputCallback;
    this.statusCallback = statusCallback;
    this.client = new Client();

    this.connect(config);
  }

  private connect(config: SshSessionConfig): void {
    const port = config.port || 22;
    this.statusCallback('connecting', `Menghubungkan ke ${config.host}:${port}...`);
    this.outputCallback(
      `\r\n\x1b[36m[SSH Client] Menghubungkan ke ${config.username}@${config.host}:${port}...\x1b[0m\r\n`
    );

    this.client.on('ready', () => {
      this.isConnected = true;
      this.statusCallback('connected', `Terhubung ke ${config.host}:${port}`);
      this.outputCallback(
        `\x1b[32m[SSH Client] Otentikasi Berhasil! Mengalokasikan pseudo-terminal (PTY)...\x1b[0m\r\n`
      );

      this.client.shell(
        {
          term: 'xterm-256color',
          cols: this.cols,
          rows: this.rows,
        },
        (err: Error | undefined, stream: ClientChannel) => {
          if (err) {
            this.outputCallback(
              `\r\n\x1b[31;1m[SSH Shell Error]\x1b[0m Gagal mengalokasikan shell: ${err.message}\r\n`
            );
            this.statusCallback('error', err.message);
            return;
          }

          this.stream = stream;

          stream.on('data', (chunk: Buffer) => {
            this.outputCallback(chunk.toString('utf-8'));
          });

          stream.stderr.on('data', (chunk: Buffer) => {
            this.outputCallback(chunk.toString('utf-8'));
          });

          stream.on('close', () => {
            if (!this.isClosed) {
              this.outputCallback(`\r\n\x1b[33m[SSH Client] Sesi shell ditutup oleh remote host.\x1b[0m\r\n`);
              this.statusCallback('disconnected', 'Sesi ditutup oleh remote host');
              this.close();
            }
          });
        }
      );
    });

    this.client.on('error', (err: Error & { level?: string; code?: string }) => {
      let friendlyMsg = err.message;
      if (err.level === 'client-authentication') {
        friendlyMsg = `Otentikasi Gagal: Kredensial username/password ditolak oleh server ${config.host}.`;
      } else if (err.code === 'ECONNREFUSED' || err.message.includes('ECONNREFUSED')) {
        friendlyMsg = `Koneksi Ditolak (ECONNREFUSED): Port ${port} pada ${config.host} tidak menerima koneksi SSH.`;
      } else if (err.code === 'ETIMEDOUT' || err.message.includes('ETIMEDOUT') || err.message.includes('timed out')) {
        friendlyMsg = `Batas Waktu Terlampaui (ETIMEDOUT): Host ${config.host}:${port} tidak merespons (periksa routing/firewall).`;
      } else if (err.code === 'ENOTFOUND') {
        friendlyMsg = `Host Tidak Ditemukan (ENOTFOUND): Alamat ${config.host} tidak dapat di-resolve.`;
      }

      this.outputCallback(`\r\n\x1b[31;1m[SSH Connection Error]\x1b[0m ${friendlyMsg}\r\n`);
      this.statusCallback('error', friendlyMsg);
    });

    this.client.on('close', () => {
      if (!this.isClosed && this.isConnected) {
        this.statusCallback('disconnected', 'Koneksi SSH terputus');
      }
    });

    const connectConfig: ConnectConfig = {
      host: config.host,
      port,
      username: config.username,
      readyTimeout: 20000,
      keepaliveInterval: 10000,
      algorithms: {
        kex: [
          'curve25519-sha256',
          'curve25519-sha256@libssh.org',
          'ecdh-sha2-nistp256',
          'ecdh-sha2-nistp384',
          'ecdh-sha2-nistp521',
          'diffie-hellman-group-exchange-sha256',
          'diffie-hellman-group14-sha256',
          'diffie-hellman-group14-sha1',
          'diffie-hellman-group-exchange-sha1',
          'diffie-hellman-group1-sha1',
        ],
        cipher: [
          'aes128-ctr',
          'aes192-ctr',
          'aes256-ctr',
          'aes128-gcm',
          'aes128-gcm@openssh.com',
          'aes256-gcm',
          'aes256-gcm@openssh.com',
          'chacha20-poly1305@openssh.com',
          'aes256-cbc',
          'aes192-cbc',
          'aes128-cbc',
          '3des-cbc',
        ],
        serverHostKey: [
          'ssh-ed25519',
          'ecdsa-sha2-nistp256',
          'ecdsa-sha2-nistp384',
          'ecdsa-sha2-nistp521',
          'rsa-sha2-512',
          'rsa-sha2-256',
          'ssh-rsa',
          'ssh-dss',
        ],
      },
    };

    if (config.privateKey) {
      connectConfig.privateKey = config.privateKey;
      if (config.passphrase) {
        connectConfig.passphrase = config.passphrase;
      }
    } else if (config.password !== undefined && config.password !== '') {
      connectConfig.password = config.password;
    }

    try {
      this.client.connect(connectConfig);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.outputCallback(`\r\n\x1b[31;1m[SSH Exception]\x1b[0m ${msg}\r\n`);
      this.statusCallback('error', msg);
    }
  }

  public onInput(data: string): void {
    if (this.stream && this.stream.writable) {
      this.stream.write(data);
    }
  }

  public resize(cols: number, rows: number): void {
    this.cols = cols;
    this.rows = rows;
    if (this.stream) {
      try {
        this.stream.setWindow(rows, cols, 0, 0);
      } catch {
        // Ignore resize error if stream is closing
      }
    }
  }

  public close(): void {
    this.isClosed = true;
    if (this.stream) {
      try {
        this.stream.end();
      } catch {
        // Ignore
      }
      this.stream = null;
    }
    try {
      this.client.end();
    } catch {
      // Ignore
    }
  }
}
