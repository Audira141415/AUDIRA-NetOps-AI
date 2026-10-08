// AIOps Alert Storm Deduplication & Root Cause Analysis (RCA) Engine
// Suppresses alarm floods and isolates the single upstream root cause across multi-layer topology

import { Alert } from '@audira/types';

export type FailureLayer =
  | 'PHYSICAL_L1'
  | 'DATALINK_L2'
  | 'NETWORK_L3'
  | 'OVERLAY_VPN'
  | 'APPLICATION_L7';

export interface CorrelatedIncident {
  incidentId: string;
  rootCauseAlert: Alert;
  suppressedAlerts: Alert[];
  detectedLayer: FailureLayer;
  confidenceScore: number; // 0 - 100
  impactSummary: {
    affectedDevicesCount: number;
    suppressedAlertsCount: number;
    primaryFailureReason: string;
    estimatedSubscribersAffected?: number;
  };
  suggestedRemediation: string;
  createdAt: string;
}

export class AlertCorrelationEngine {
  private static readonly LAYER_HIERARCHY: Record<FailureLayer, number> = {
    PHYSICAL_L1: 1,
    DATALINK_L2: 2,
    NETWORK_L3: 3,
    OVERLAY_VPN: 4,
    APPLICATION_L7: 5,
  };

  /**
   * Classifies an alert into its primary OSI architectural layer
   */
  public static classifyAlertLayer(alert: Alert): FailureLayer {
    const text = `${alert.title} ${alert.message} ${alert.category}`.toLowerCase();

    if (
      text.includes('optical') ||
      text.includes('sfp') ||
      text.includes('power') ||
      text.includes('laser') ||
      text.includes('voltage') ||
      text.includes('temperature') ||
      text.includes('los')
    ) {
      return 'PHYSICAL_L1';
    }

    if (
      alert.category === 'INTERFACE' ||
      text.includes('carrier') ||
      text.includes('link-down') ||
      text.includes('port down') ||
      text.includes('lacp') ||
      text.includes('ethernet')
    ) {
      return 'DATALINK_L2';
    }

    if (
      alert.category === 'OSPF' ||
      text.includes('ospf') ||
      text.includes('isis') ||
      text.includes('gateway') ||
      text.includes('unreachable route')
    ) {
      return 'NETWORK_L3';
    }

    if (
      alert.category === 'BGP' ||
      text.includes('bgp') ||
      text.includes('vpls') ||
      text.includes('pseudowire') ||
      text.includes('mpls') ||
      text.includes('ldp')
    ) {
      return 'OVERLAY_VPN';
    }

    return 'APPLICATION_L7';
  }

  /**
   * Evaluates a storm of alerts and produces deduplicated, correlated root-cause incidents
   */
  public static correlateAlerts(
    alerts: Alert[],
    _timeWindowSeconds = 45
  ): CorrelatedIncident[] {
    if (!alerts || alerts.length === 0) {
      return [];
    }

    if (alerts.length === 1) {
      const single = alerts[0];
      if (!single) return [];
      const layer = this.classifyAlertLayer(single);
      return [
        {
          incidentId: `inc-${Date.now()}-1`,
          rootCauseAlert: single,
          suppressedAlerts: [],
          detectedLayer: layer,
          confidenceScore: 85,
          impactSummary: {
            affectedDevicesCount: single.deviceName ? 1 : 0,
            suppressedAlertsCount: 0,
            primaryFailureReason: single.title,
          },
          suggestedRemediation: `Inspect ${single.deviceName || 'target device'} for ${single.category} event.`,
          createdAt: new Date().toISOString(),
        },
      ];
    }

    // Sort alerts by hierarchy rank (lower layer = parent cause)
    const sorted = [...alerts].sort((a, b) => {
      const layerA = this.LAYER_HIERARCHY[this.classifyAlertLayer(a)];
      const layerB = this.LAYER_HIERARCHY[this.classifyAlertLayer(b)];
      if (layerA !== layerB) {
        return layerA - layerB; // Lowest layer first
      }
      return (b.severity === 'CRITICAL' ? 1 : 0) - (a.severity === 'CRITICAL' ? 1 : 0);
    });

    const rootCause = sorted[0];
    if (!rootCause) return [];

    const rootLayer = this.classifyAlertLayer(rootCause);
    const suppressed = sorted.slice(1);

    const affectedDevices = new Set<string>();
    alerts.forEach((a) => {
      if (a.deviceName) affectedDevices.add(a.deviceName);
    });

    // Calculate confidence score based on layer discrepancy and symptom volume
    const baseConfidence = 80;
    const volumeBonus = Math.min(suppressed.length * 2, 15);
    const layerBonus = rootLayer === 'PHYSICAL_L1' ? 4 : rootLayer === 'DATALINK_L2' ? 3 : 0;
    const confidenceScore = Math.min(baseConfidence + volumeBonus + layerBonus, 99);

    let suggestedRemediation = 'Investigate physical link continuity and optical transceiver levels.';
    if (rootLayer === 'PHYSICAL_L1' || rootLayer === 'DATALINK_L2') {
      suggestedRemediation = `Prioritize physical link inspection on ${rootCause.deviceName || 'core node'}. Suppress downstream BGP/VPLS alarms until interface carrier state is restored.`;
    } else if (rootLayer === 'NETWORK_L3') {
      suggestedRemediation = `Verify IGP adjacency and loopback reachability on ${rootCause.deviceName || 'router'}.`;
    } else if (rootLayer === 'OVERLAY_VPN') {
      suggestedRemediation = `Check peer AS timer negotiation and TCP port 179 accessibility.`;
    }

    return [
      {
        incidentId: `rca-${Date.now()}`,
        rootCauseAlert: rootCause,
        suppressedAlerts: suppressed,
        detectedLayer: rootLayer,
        confidenceScore,
        impactSummary: {
          affectedDevicesCount: affectedDevices.size,
          suppressedAlertsCount: suppressed.length,
          primaryFailureReason: `${rootCause.title}: Primary failure at ${rootLayer}`,
          estimatedSubscribersAffected: Math.max(affectedDevices.size * 250, 100),
        },
        suggestedRemediation,
        createdAt: new Date().toISOString(),
      },
    ];
  }
}
