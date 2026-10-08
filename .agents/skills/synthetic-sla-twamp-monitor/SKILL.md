---
name: synthetic-sla-twamp-monitor
description: Standard Operating Procedure (SOP) for active synthetic network telemetry, TWAMP / Cisco IP SLA / MikroTik Traffic-Gen probing, Jitter & Packet loss tracking, Mean Opinion Score (MOS) calculation for VoIP/Video, and endpoint latency monitoring.
---

# Active Synthetic Telemetry & TWAMP / IP SLA Monitoring Skill

This skill guides the AI Network Copilot through active synthetic telemetry probing using Two-Way Active Measurement Protocol (TWAMP RFC 5357), Cisco IP SLA, MikroTik Netwatch, and ITU-T G.107 E-Model Mean Opinion Score (MOS) calculations for mission-critical VoIP, video conferencing, and low-latency financial feeds.

---

## 1. Passive vs Active Synthetic Telemetry

Standard passive monitoring (SNMP polling every 5 minutes) only captures byte counters and CPU utilization. It is blind to:
- **Micro-burst packet drops (0.1% – 2%)** that ruin real-time video/voice.
- **Jitter variation** caused by intermediate bufferbloat.
- **DNS resolution latency spikes** to critical SaaS and Cloud endpoints.

**Active Synthetic Telemetry** generates continuous micro-probes timestamped with sub-millisecond precision, providing round-trip time (RTT), one-way delay, packet jitter, and transmission loss statistics.

---

## 2. Voice & Video Quality Rating: ITU-T G.107 E-Model (MOS)

AUDIRA NetOps AI calculates the **Mean Opinion Score (MOS)** to quantify user experience for VoIP (G.711 / Opus) and UCaaS (Zoom / Teams):

### The E-Model Formula:
$$R = 93.2 - I_d - I_e$$
Where:
- $I_d$ is delay impairment: $I_d = 0.024 \times \text{Latency} + 0.11 \times (\text{Latency} - 177.3) \times H(\text{Latency} - 177.3) + 0.05 \times \text{Jitter}$
- $I_e$ is equipment/packet loss impairment: $I_e = 11 + 40 \times \ln(1 + 10 \times \text{PacketLossFraction})$
- $R$ is scaled to MOS ($1.0$ to $4.5+$):
$$\text{MOS} = 1 + 0.035 \times R + R \times (R - 60) \times (100 - R) \times 7 \times 10^{-6}$$

| MOS Score | Voice Quality Rating | User Experience | SLA Conformance |
| :---: | :--- | :--- | :--- |
| **$\ge$ 4.30** | **EXCELLENT** | Pristine HD audio, imperceptible delay | **PLATINUM SLA** |
| **4.00 – 4.29** | **GOOD** | Standard PSTN toll quality, clear call | **GOLD SLA** |
| **3.60 – 3.99** | **FAIR** | Noticeable distortion, mild delay, speaker re-talk | **SILVER SLA** |
| **< 3.60** | **POOR / UNUSABLE** | Audio drops, robotic syllables, call abandonment | **SLA BREACHED** |

---

## 3. SLA Service Tier Matrix

| Metric | Platinum (Datacenter/Finance) | Gold (Enterprise B2B) | Silver (SMB Branch) | Bronze (Best Effort) |
| :--- | :--- | :--- | :--- | :--- |
| **Latency RTT** | $< 10\text{ ms}$ | $< 35\text{ ms}$ | $< 70\text{ ms}$ | $< 120\text{ ms}$ |
| **Jitter (PDV)** | $< 2\text{ ms}$ | $< 5\text{ ms}$ | $< 15\text{ ms}$ | $< 30\text{ ms}$ |
| **Packet Loss** | $0.00\%$ | $< 0.10\%$ | $< 0.50\%$ | $< 2.00\%$ |
| **Target MOS** | $> 4.35$ | $> 4.10$ | $> 3.80$ | $> 3.50$ |
| **Availability**| $99.999\%$ | $99.95\%$ | $99.90\%$ | $99.50\%$ |

---

## 4. Multi-Vendor Probing Commands

### A. MikroTik RouterOS v7
```routeros
# 1. Real-time ICMP & TCP Probe status
/tool/netwatch/print detail

# 2. Add high-frequency microsecond SLA probe
/tool/netwatch/add host=1.1.1.1 interval=5s timeout=800ms type=icmp comment="SLA-CLOUDFLARE"

# 3. On-demand latency & bandwidth verification
/tool/bandwidth-test address=<REMOTE_PEER> protocol=udp duration=10s direction=both
```

### B. Cisco IOS & IOS-XE
```cisco
# 1. Summary of all configured IP SLA operations
show ip sla summary
show ip sla statistics

# 2. Detailed UDP Jitter probing for voice SLA
show ip sla statistics 100

# 3. Configure IP SLA UDP Jitter probe (Cisco IP SLA 100)
ip sla 100
 udp-jitter 10.100.1.2 5000 codec g711alaw
 frequency 30
ip sla schedule 100 life forever start-time now
```

### C. Huawei VRP
```huawei
# 1. View NQA (Network Quality Analysis) jitter results
display nqa results test-instance admin voip-jitter
display nqa history test-instance admin voip-jitter

# 2. Check NQA statistics and packet loss
display nqa statistics test-instance admin voip-jitter
```

### D. Juniper Junos OS
```junos
# 1. View Real-Time Performance Monitoring (RPM) probe results
show services rpm probe-results
show services rpm history-results

# 2. Extensive jitter and round-trip delay statistics
show services rpm probe-results extensive
```

---

## 5. Automated Triage Workflow for AI Copilot

1. **Jitter Spike Detection**: If jitter $> 15\text{ ms}$ while link bandwidth is $< 70\%$, trigger [bandwidth-qos-queue-tuner](file:///f:/AUDIRA-NetOps-AI/.agents/skills/bandwidth-qos-queue-tuner/SKILL.md) to inspect Bufferbloat and apply FQ-CoDel/CAKE queueing.
2. **Micro-Loss Anomaly**: If packet loss is $0.5\% – 2.0\%$ without link congestion, trigger [optical-transceiver-dom-inspector](file:///f:/AUDIRA-NetOps-AI/.agents/skills/optical-transceiver-dom-inspector/SKILL.md) to check optical RX power attenuation and laser bias current.
3. **SLA Breach Alerting**: When MOS drops below $3.80$, generate an incident ticket with exact latency, jitter, loss, and impacted destination endpoints before customer complaints occur.
