// Active Synthetic Network Telemetry & TWAMP / IP SLA Probing Engine
// ITU-T G.107 E-Model MOS (Mean Opinion Score) & Service Level Agreement Tracking

export type SlaProtocol = 'TWAMP' | 'ICMP_ECHO' | 'UDP_JITTER' | 'HTTP_GET' | 'DNS';
export type SlaTier = 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE';
export type VoiceQuality = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';

export interface SlaProbeTarget {
  id: string;
  name: string;
  targetHost: string;
  protocol: SlaProtocol;
  port?: number;
  tier: SlaTier;
}

export interface SlaMeasurement {
  target: SlaProbeTarget;
  rttMinMs: number;
  rttAvgMs: number;
  rttMaxMs: number;
  jitterMs: number;
  packetLossPercent: number;
  mosScore: number;
  voiceQuality: VoiceQuality;
  isCompliant: boolean;
  breachReasons: string[];
  measuredAt: string;
}

export class SyntheticSlaEngine {
  /**
   * Calculates ITU-T G.107 E-Model Transmission Rating (R-Factor) and Mean Opinion Score (MOS)
   */
  public static calculateMos(
    latencyMs: number,
    jitterMs: number,
    packetLossPercent: number
  ): { rFactor: number; mos: number; quality: VoiceQuality } {
    // 1. Delay Impairment (Id)
    let delayImpairment = 0.024 * latencyMs + 0.05 * jitterMs;
    if (latencyMs > 177.3) {
      delayImpairment += 0.11 * (latencyMs - 177.3);
    }

    // 2. Equipment / Packet Loss Impairment (Ie)
    const lossFraction = Math.max(0, packetLossPercent) / 100;
    const equipmentImpairment = lossFraction > 0 ? 11 + 40 * Math.log(1 + 10 * lossFraction) : 0;

    // 3. R-Factor calculation
    const rawR = 93.2 - delayImpairment - equipmentImpairment;
    const rFactor = Math.max(0, Math.min(100, Math.round(rawR * 10) / 10));

    // 4. Conversion to MOS (1.0 to 4.5)
    let mos = 1.0;
    if (rFactor > 0 && rFactor < 100) {
      mos = 1 + 0.035 * rFactor + rFactor * (rFactor - 60) * (100 - rFactor) * 0.000007;
    } else if (rFactor >= 100) {
      mos = 4.5;
    }

    mos = Math.max(1.0, Math.min(4.5, Math.round(mos * 100) / 100));

    let quality: VoiceQuality = 'POOR';
    if (mos >= 4.3) quality = 'EXCELLENT';
    else if (mos >= 4.0) quality = 'GOOD';
    else if (mos >= 3.6) quality = 'FAIR';

    return { rFactor, mos, quality };
  }

  /**
   * Evaluates measured SLA metrics against contract tier thresholds
   */
  public static evaluateCompliance(
    tier: SlaTier,
    rttAvg: number,
    jitter: number,
    loss: number,
    mos: number
  ): { isCompliant: boolean; breachReasons: string[] } {
    const breachReasons: string[] = [];

    const thresholds: Record<
      SlaTier,
      { maxLatency: number; maxJitter: number; maxLoss: number; minMos: number }
    > = {
      PLATINUM: { maxLatency: 15, maxJitter: 2.5, maxLoss: 0.0, minMos: 4.3 },
      GOLD: { maxLatency: 35, maxJitter: 6.0, maxLoss: 0.1, minMos: 4.05 },
      SILVER: { maxLatency: 70, maxJitter: 15.0, maxLoss: 0.5, minMos: 3.75 },
      BRONZE: { maxLatency: 120, maxJitter: 30.0, maxLoss: 2.0, minMos: 3.4 },
    };

    const limit = thresholds[tier];

    if (rttAvg > limit.maxLatency) {
      breachReasons.push(`Latency (${rttAvg}ms) exceeded ${tier} threshold (${limit.maxLatency}ms).`);
    }
    if (jitter > limit.maxJitter) {
      breachReasons.push(`Jitter (${jitter}ms) exceeded ${tier} threshold (${limit.maxJitter}ms).`);
    }
    if (loss > limit.maxLoss) {
      breachReasons.push(`Packet loss (${loss}%) exceeded ${tier} threshold (${limit.maxLoss}%).`);
    }
    if (mos < limit.minMos) {
      breachReasons.push(`VoIP MOS score (${mos}) fell below ${tier} minimum (${limit.minMos}).`);
    }

    return {
      isCompliant: breachReasons.length === 0,
      breachReasons,
    };
  }

  /**
   * Returns default synthetic probing target list for carrier networks
   */
  public static getDefaultTargets(): SlaProbeTarget[] {
    return [
      {
        id: 'sla-cf-dns',
        name: 'Cloudflare Anycast DNS',
        targetHost: '1.1.1.1',
        protocol: 'TWAMP',
        port: 862,
        tier: 'PLATINUM',
      },
      {
        id: 'sla-google-dns',
        name: 'Google Primary Resolver',
        targetHost: '8.8.8.8',
        protocol: 'ICMP_ECHO',
        tier: 'GOLD',
      },
      {
        id: 'sla-iix-peering',
        name: 'Jakarta OpenIXP Route Server',
        targetHost: '218.100.27.1',
        protocol: 'UDP_JITTER',
        port: 5000,
        tier: 'PLATINUM',
      },
      {
        id: 'sla-aws-direct',
        name: 'AWS DirectConnect Gateway',
        targetHost: '52.95.218.1',
        protocol: 'TWAMP',
        port: 862,
        tier: 'PLATINUM',
      },
    ];
  }

  /**
   * Generates high-fidelity synthetic SLA measurements
   */
  public static measureTarget(target: SlaProbeTarget): SlaMeasurement {
    const isPlat = target.tier === 'PLATINUM';
    const baseRtt = isPlat ? 4.2 : 24.5;
    const jitterFluctuation = Math.round((0.5 + Math.random() * (isPlat ? 1.2 : 4.5)) * 10) / 10;
    const rttAvg = Math.round((baseRtt + Math.random() * 2) * 10) / 10;
    const packetLoss = isPlat ? 0.0 : Math.random() > 0.85 ? 0.2 : 0.0;

    const { mos, quality } = this.calculateMos(rttAvg, jitterFluctuation, packetLoss);
    const { isCompliant, breachReasons } = this.evaluateCompliance(
      target.tier,
      rttAvg,
      jitterFluctuation,
      packetLoss,
      mos
    );

    return {
      target,
      rttMinMs: Math.max(1.0, Math.round((rttAvg - 1.2) * 10) / 10),
      rttAvgMs: rttAvg,
      rttMaxMs: Math.round((rttAvg + jitterFluctuation * 2) * 10) / 10,
      jitterMs: jitterFluctuation,
      packetLossPercent: packetLoss,
      mosScore: mos,
      voiceQuality: quality,
      isCompliant,
      breachReasons,
      measuredAt: new Date().toISOString(),
    };
  }
}
