import { describe, it, expect } from 'vitest';
import { Device } from '@audira/types';

describe('Device Filtering and Query Logic', () => {
  const mockDevices: Device[] = [
    {
      id: 'dev-1',
      name: 'Core-CCR2004',
      hostname: 'core-router.netops.local',
      ipAddress: '192.168.1.1',
      vendor: 'MIKROTIK',
      model: 'CCR2004-16G-2S+',
      osVersion: 'RouterOS v7.15.2',
      status: 'ONLINE',
      cpuUsage: 12,
      memoryUsage: 35,
      temperature: 42,
      uptime: 864000,
      portCount: 16,
      portsUpCount: 14,
      lastSeenAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'dev-2',
      name: 'Dist-Catalyst9300',
      hostname: 'dist-sw01.netops.local',
      ipAddress: '192.168.1.2',
      vendor: 'CISCO',
      model: 'Catalyst 9300-48P',
      osVersion: 'Cisco IOS-XE 17.9',
      status: 'ONLINE',
      cpuUsage: 18,
      memoryUsage: 50,
      temperature: 38,
      uptime: 432000,
      portCount: 48,
      portsUpCount: 38,
      lastSeenAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'dev-3',
      name: 'Border-CloudEngine',
      hostname: 'border-gw.netops.local',
      ipAddress: '10.0.0.1',
      vendor: 'HUAWEI',
      model: 'CloudEngine 6857',
      osVersion: 'Huawei VRP V200R019',
      status: 'WARNING',
      cpuUsage: 78,
      memoryUsage: 82,
      temperature: 55,
      uptime: 120000,
      portCount: 24,
      portsUpCount: 20,
      lastSeenAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  it('should filter devices by vendor accurately', () => {
    const mikrotikOnly = mockDevices.filter(d => d.vendor === 'MIKROTIK');
    expect(mikrotikOnly).toHaveLength(1);
    expect(mikrotikOnly[0]!.name).toBe('Core-CCR2004');
  });

  it('should filter devices by status accurately', () => {
    const warningNodes = mockDevices.filter(d => d.status === 'WARNING');
    expect(warningNodes).toHaveLength(1);
    expect(warningNodes[0]!.name).toBe('Border-CloudEngine');
  });

  it('should support search query matching name, ip, or hostname', () => {
    const search = '10.0.0.1';
    const found = mockDevices.filter(
      d =>
        d.name.toLowerCase().includes(search) ||
        d.ipAddress.includes(search) ||
        d.hostname.toLowerCase().includes(search)
    );
    expect(found).toHaveLength(1);
    expect(found[0]!.id).toBe('dev-3');
  });
});
