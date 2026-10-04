// Terminal Session Management & Stream Protocol

import { evaluateCommandRisk } from '@audira/security';

export interface TerminalSessionHandler {
  sessionId: string;
  deviceId: string;
  userId: string;
  cols: number;
  rows: number;
  sendOutput(data: string): void;
  onInput(data: string): void;
  resize(cols: number, rows: number): void;
  close(): void;
}

export class MockTerminalSession implements TerminalSessionHandler {
  public sessionId: string;
  public deviceId: string;
  public userId: string;
  public cols: number = 80;
  public rows: number = 24;

  private inputBuffer: string = '';
  private outputCallback: (data: string) => void;
  private devicePrompt: string;

  constructor(
    sessionId: string,
    deviceId: string,
    deviceName: string,
    userId: string,
    outputCallback: (data: string) => void
  ) {
    this.sessionId = sessionId;
    this.deviceId = deviceId;
    this.userId = userId;
    this.outputCallback = outputCallback;
    this.devicePrompt = `[admin@${deviceName}] > `;

    // Send PuTTY-like welcome banner
    this.sendBanner(deviceName);
  }

  private sendBanner(deviceName: string) {
    const banner = [
      '\r\n\x1b[36m  █████╗ ██╗   ██╗██████╗ ██╗██████╗  █████╗ \x1b[0m',
      '\x1b[36m ██╔══██╗██║   ██║██╔══██╗██║██╔══██╗██╔══██╗\x1b[0m',
      '\x1b[36m ███████║██║   ██║██║  ██║██║██████╔╝███████║\x1b[0m',
      '\x1b[36m ██╔══██║██║   ██║██║  ██║██║██╔══██╗██╔══██║\x1b[0m',
      '\x1b[36m ██║  ██║╚██████╔╝██████╔╝██║██║  ██║██║  ██║\x1b[0m  \x1b[33mNetOps AI Terminal v1.0\x1b[0m',
      `\r\n\x1b[90mConnected to ${deviceName} (MikroTik RouterOS v7.14.3 arm64) over SSH-2.0\x1b[0m`,
      '\x1b[90mSecurity: Session monitored and audited. Type help or ? for assistance.\x1b[0m\r\n',
      this.devicePrompt,
    ].join('\r\n');

    this.sendOutput(banner);
  }

  public sendOutput(data: string): void {
    this.outputCallback(data);
  }

  public onInput(data: string): void {
    // Handle Enter (Carriage return / Line feed)
    if (data === '\r' || data === '\n') {
      const command = this.inputBuffer.trim();
      this.sendOutput('\r\n');

      if (command.length > 0) {
        const risk = evaluateCommandRisk(command);
        if (risk === 'CRITICAL') {
          this.sendOutput(`\x1b[31;1m[SECURITY BLOCKED] Command '${command}' flagged as CRITICAL risk. Action halted.\x1b[0m\r\n`);
        } else {
          this.handleCommand(command);
        }
      }

      this.inputBuffer = '';
      this.sendOutput(this.devicePrompt);
      return;
    }

    // Handle Backspace
    if (data === '\x7f' || data === '\b') {
      if (this.inputBuffer.length > 0) {
        this.inputBuffer = this.inputBuffer.slice(0, -1);
        this.sendOutput('\b \b');
      }
      return;
    }

    // Accumulate printable chars
    this.inputBuffer += data;
    this.sendOutput(data);
  }

  private handleCommand(cmd: string): void {
    if (cmd === 'help' || cmd === '?') {
      this.sendOutput(
        '\r\nAvailable commands:\r\n  /system resource print\r\n  /interface print\r\n  /ip address print\r\n  /ip route print\r\n  /ping <target>\r\n'
      );
    } else if (cmd.includes('/system resource print') || cmd === 'resource') {
      this.sendOutput('\r\n                   uptime: 42d16h24m\r\n                  version: 7.14.3 (stable)\r\n               build-time: Feb/28/2026 12:30:11\r\n             free-memory: 3.2GiB\r\n            total-memory: 4.0GiB\r\n                     cpu: ARM64\r\n               cpu-count: 4\r\n           cpu-frequency: 1700MHz\r\n                cpu-load: 14%\r\n');
    } else if (cmd.includes('/interface print') || cmd === 'interface') {
      this.sendOutput('\r\nFlags: R - RUNNING\r\nColumns: NAME, TYPE, ACTUAL-MTU, MAC-ADDRESS\r\n #   NAME          TYPE      ACTUAL-MTU  MAC-ADDRESS\r\n 0 R sfp-sfpplus1  ether     1500        D4:CA:6D:E1:01:01\r\n 1 R ether1-wan    ether     1500        D4:CA:6D:E1:01:02\r\n 2 R ether2-lan    ether     1500        D4:CA:6D:E1:01:03\r\n 3 R bridge-lan    bridge    1500        D4:CA:6D:E1:01:04\r\n');
    } else {
      this.sendOutput(`\r\nExecuted: ${cmd}\r\n`);
    }
  }

  public resize(cols: number, rows: number): void {
    this.cols = cols;
    this.rows = rows;
  }

  public close(): void {
    this.sendOutput('\r\n\x1b[33mSession terminated by user.\x1b[0m\r\n');
  }
}
