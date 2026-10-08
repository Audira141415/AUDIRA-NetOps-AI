// Golden Configuration Drift & Shadow Change Detection Engine
// Audits running device configurations against declared IaC/GitOps baselines

export type DriftSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'IN_SYNC';

export interface DriftDiscrepancy {
  type: 'UNAUTHORIZED_ADDITION' | 'MISSING_MANDATORY_BASELINE' | 'VALUE_MODIFIED';
  lineContent: string;
  severity: DriftSeverity;
  reason: string;
}

export interface ConfigDriftResult {
  isDrifted: boolean;
  driftScore: number; // 0 - 100 (100 = completely in sync)
  severity: DriftSeverity;
  addedLinesCount: number;
  removedLinesCount: number;
  discrepancies: DriftDiscrepancy[];
  criticalViolationsCount: number;
  reconciliationSuggestions: string[];
  evaluatedAt: string;
}

export class GoldenConfigDriftEngine {
  /**
   * Normalizes configuration text by stripping comments, volatile timestamps, and empty whitespace
   */
  public static cleanConfigLines(configText: string): string[] {
    return configText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => {
        if (!l) return false;
        if (l.startsWith('#') || l.startsWith('!') || l.startsWith('//')) return false;
        // Strip volatile RouterOS / Cisco timestamp comments
        if (l.toLowerCase().includes('by routeros') || l.toLowerCase().includes('last configuration change')) {
          return false;
        }
        return true;
      });
  }

  /**
   * Classifies the security & operational risk of a deviated configuration statement
   */
  public static classifyLineSeverity(line: string): DriftSeverity {
    const lower = line.toLowerCase();

    // Critical: Security, Authentication, Gateway, Mass Deletion
    if (
      lower.includes('user ') ||
      lower.includes('password') ||
      lower.includes('firewall') ||
      lower.includes('strong-crypto') ||
      lower.includes('dst-address=0.0.0.0/0') ||
      lower.includes('0.0.0.0 0.0.0.0') ||
      lower.includes('secret')
    ) {
      return 'CRITICAL';
    }

    // High: Routing, BGP, OSPF, Interface State, VLAN Trunks
    if (
      lower.includes('bgp') ||
      lower.includes('ospf') ||
      lower.includes('route') ||
      lower.includes('vlan') ||
      lower.includes('interface') ||
      lower.includes('ip address') ||
      lower.includes('shutdown')
    ) {
      return 'HIGH';
    }

    // Medium: QoS, MTU, Descriptions, NTP, SNMP, Logging
    if (
      lower.includes('queue') ||
      lower.includes('mtu') ||
      lower.includes('description') ||
      lower.includes('snmp') ||
      lower.includes('ntp') ||
      lower.includes('logging')
    ) {
      return 'MEDIUM';
    }

    return 'LOW';
  }

  /**
   * Evaluates running configuration against the declared Golden Baseline
   */
  public static detectDrift(
    runningConfigText: string,
    goldenConfigText: string
  ): ConfigDriftResult {
    const runningLines = this.cleanConfigLines(runningConfigText);
    const goldenLines = this.cleanConfigLines(goldenConfigText);

    const goldenSet = new Set(goldenLines);
    const runningSet = new Set(runningLines);

    const discrepancies: DriftDiscrepancy[] = [];
    let criticalCount = 0;
    let highCount = 0;

    // 1. Detect unauthorized shadow additions in running config
    for (const rLine of runningLines) {
      if (!goldenSet.has(rLine)) {
        const severity = this.classifyLineSeverity(rLine);
        if (severity === 'CRITICAL') criticalCount++;
        if (severity === 'HIGH') highCount++;

        discrepancies.push({
          type: 'UNAUTHORIZED_ADDITION',
          lineContent: rLine,
          severity,
          reason: `Statement exists on live router but is absent from Golden Template (Shadow Change).`,
        });
      }
    }

    // 2. Detect missing mandatory baseline configurations
    for (const gLine of goldenLines) {
      if (!runningSet.has(gLine)) {
        const severity = this.classifyLineSeverity(gLine);
        if (severity === 'CRITICAL') criticalCount++;
        if (severity === 'HIGH') highCount++;

        discrepancies.push({
          type: 'MISSING_MANDATORY_BASELINE',
          lineContent: gLine,
          severity,
          reason: `Mandatory baseline standard missing from live device running configuration.`,
        });
      }
    }

    const isDrifted = discrepancies.length > 0;

    // Overall severity classification
    let overallSeverity: DriftSeverity = 'IN_SYNC';
    if (criticalCount > 0) {
      overallSeverity = 'CRITICAL';
    } else if (highCount > 0) {
      overallSeverity = 'HIGH';
    } else if (discrepancies.length > 0) {
      overallSeverity = 'MEDIUM';
    }

    // Calculate Drift Score (100 = perfect alignment)
    const penalty = criticalCount * 20 + highCount * 10 + (discrepancies.length - criticalCount - highCount) * 2;
    const driftScore = Math.max(0, 100 - penalty);

    const addedLines = discrepancies.filter((d) => d.type === 'UNAUTHORIZED_ADDITION').length;
    const removedLines = discrepancies.filter((d) => d.type === 'MISSING_MANDATORY_BASELINE').length;

    // Build Actionable Suggestions
    const reconciliationSuggestions: string[] = [];
    if (!isDrifted) {
      reconciliationSuggestions.push('Live device is 100% compliant with Golden Template.');
    } else {
      if (criticalCount > 0) {
        reconciliationSuggestions.push(
          `CRITICAL: Immediate audit required for ${criticalCount} unauthorized security/credential statements.`
        );
      }
      reconciliationSuggestions.push(
        `Execute pre-flight backup snapshot and apply Golden Reconciliation playbook to remove ${addedLines} shadow lines and restore ${removedLines} baseline standards.`
      );
    }

    return {
      isDrifted,
      driftScore,
      severity: overallSeverity,
      addedLinesCount: addedLines,
      removedLinesCount: removedLines,
      discrepancies,
      criticalViolationsCount: criticalCount,
      reconciliationSuggestions,
      evaluatedAt: new Date().toISOString(),
    };
  }
}
