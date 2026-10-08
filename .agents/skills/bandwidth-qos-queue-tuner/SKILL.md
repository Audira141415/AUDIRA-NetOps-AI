---
name: bandwidth-qos-queue-tuner
description: Standard Operating Procedure (SOP) for ISP bandwidth traffic shaping, MikroTik PCQ / Queue Tree optimization, Bufferbloat mitigation (FQ-CoDel / CAKE), and Cisco CBWFQ/LLQ QoS SLA tuning.
---

# Bandwidth QoS & Queue Tuning Skill

This skill guides the AI Network Copilot through architecting, triaging, and optimizing bandwidth allocation, traffic prioritization, and queue disciplines across MikroTik RouterOS v7, Cisco IOS-XE, and Huawei VRP routers.

---

## 1. Bufferbloat Diagnostics & Active Queue Management (AQM)

Bufferbloat occurs when network buffers are excessively large and unmanaged, causing latency to surge from `< 15ms` to `> 300ms` during heavy downloads or uploads.

### Evaluation Criteria
- **Grade A+ / A (Low Latency Under Load)**: Added buffer latency `< 15ms`.
- **Grade B / C (Noticeable Jitter)**: Added buffer latency `15ms` to `80ms`.
- **Grade D / F (Severe Bufferbloat)**: Added buffer latency `> 80ms`.

### AQM Algorithm Selection
1. **CAKE (Common Applications Kept Enhanced)**:
   - Recommended for WAN / Uplink connections up to 1 Gbps.
   - Includes automatic RTT estimation, diffserv classification, and smart ack-filtering.
2. **FQ-CoDel (Fair Queuing with Controlled Delay)**:
   - High-performance AQM for core and high-throughput aggregation interfaces.
   - Target delay: `5ms`, Interval: `100ms`.
3. **PCQ (Per Connection Queue)**:
   - Best for dynamic subscriber distribution where hundreds of LAN users share a single bandwidth pool without individual static queues.

---

## 2. Multi-Vendor Implementation Protocols

### A. MikroTik RouterOS v7

#### 1. Zero-Bufferbloat WAN Shaping with CAKE / FQ-CoDel
```routeros
# Create CAKE queue type (set bandwidth to 95% of ISP line speed)
/queue/type
add name=cake-wan-down kind=cake cake-bandwidth=95M cake-diffserv=diffserv4 cake-nat=yes
add name=cake-wan-up kind=cake cake-bandwidth=45M cake-diffserv=diffserv4 cake-nat=yes

# Apply directly via Simple Queue on WAN interface
/queue/simple
add name=sq-wan-bufferbloat target=ether1-wan queue=cake-wan-up/cake-wan-down max-limit=50M/100M
```

#### 2. High-Density Dynamic Subscriber Sharing with PCQ
```routeros
# Define PCQ queue types for fair distribution
/queue/type
add name=pcq-subscribers-down kind=pcq pcq-rate=0 pcq-classifier=dst-address pcq-total-limit=4000KiB
add name=pcq-subscribers-up kind=pcq pcq-rate=0 pcq-classifier=src-address pcq-total-limit=4000KiB

# Attach to local subnet
/queue/simple
add name=sq-lan-subscribers target=192.168.10.0/24 queue=pcq-subscribers-up/pcq-subscribers-down max-limit=100M/100M
```

#### 3. Real-Time Diagnostics & Counter Audit
```routeros
# Inspect active queue statistics, byte rates, and dropped packets
/queue/simple/print stats
/queue/tree/print stats

# Monitor CPU consumption of the queuing engine
/tool/profile cpu=all
```

---

### B. Cisco IOS & IOS-XE (Modular QoS CLI - MQC)

#### 1. Low Latency Queuing (LLQ) for Voice & Critical Business Apps
```cisco
! Classify traffic
class-map match-any CLASS_VOICE
 match dscp ef
 match protocol rtp

class-map match-any CLASS_BUSINESS_CRITICAL
 match dscp af31 af32 af33
 match dscp af21 af22 af23

! Build Policy Map
policy-map POLICY_EDGE_SHAPER
 class CLASS_VOICE
  priority percent 20
 class CLASS_BUSINESS_CRITICAL
  bandwidth percent 50
  random-detect dscp-based
 class class-default
  fair-queue

! Attach to outbound interface with physical shaper (95% of line rate)
policy-map PARENT_SHAPE_WAN
 class class-default
  shape average 100000000
  service-policy POLICY_EDGE_SHAPER

interface GigabitEthernet0/0/1
 service-policy output PARENT_SHAPE_WAN
```

#### 2. Diagnostic Inspection Commands
```cisco
# Inspect packet drop counters and queue depth in real-time
show policy-map interface GigabitEthernet0/0/1
show queue GigabitEthernet0/0/1
```

---

### C. Huawei VRP

#### 1. Hierarchical Traffic Shaping & Prioritization
```huawei
# 1. Define traffic classifier
traffic classifier TC_VOICE operator or
 if-match dscp ef
traffic classifier TC_DATA operator or
 if-match dscp af31

# 2. Define traffic behavior
traffic behavior TB_VOICE
 queue ef bandwidth 20000 cbs 500000
traffic behavior TB_DATA
 queue af bandwidth 40000

# 3. Create traffic policy and apply to interface
traffic policy TP_EDGE
 classifier TC_VOICE behavior TB_VOICE
 classifier TC_DATA behavior TB_DATA

interface GigabitEthernet0/0/1
 qos lr outbound cir 95000 cbs 11875000
 traffic-policy TP_EDGE outbound
```

#### 2. Diagnostic Inspection Commands
```huawei
display qos queue statistics interface GigabitEthernet0/0/1
display traffic policy statistics interface GigabitEthernet0/0/1
```

---

## 3. Triage & Decision Tree for Queue Degradation

```
Symptom                                      Root Cause                               Remediation Protocol
--------------------------------------------------------------------------------------------------------------------------------
Ping spikes to 300ms during upload/download  Deep FIFO buffers (Bufferbloat)          Replace default-small queue with FQ-CoDel
                                                                                      or CAKE shaped to 95% of measured bandwidth.

High packet drops on specific queue          Queue limit (depth) too small            Increase `pcq-total-limit` (e.g. from 2000
                                             for bursty TCP traffic                   to 6000 KiB) or adjust burst-threshold.

VoIP calls robotic or jittery under load     Voice packets queuing behind large MTU   Implement Strict Priority Queue (LLQ)
                                             bulk file downloads                      with DSCP EF (46) prioritization.

One client hogging entire bandwidth pool     Flat FIFO queue without per-host caps    Migrate to PCQ with `dst-address` classifier
                                                                                      or assign hard Simple Queue per client IP.

Router CPU hits 100% after adding queues     Simple Queue list too long (> 500)       Migrate from serialized Simple Queues to
                                             processed sequentially on CPU core 0     Hierarchical Queue Tree using multi-core HTB.
```

---

## 4. Safety Guardrails for QoS Configuration

1. **Never shape WAN below 85% of physical capacity**: Overly aggressive shaping artificially wastes contracted bandwidth.
2. **Never configure strict priority (`priority`) without an absolute policer**: An unpoliced priority queue can starve all other traffic on the router if misclassified.
3. **Always preserve Mangle packet-mark passthrough logic**: In RouterOS, ensure `passthrough=no` on final packet classification to prevent rule loop execution.
4. **Queue changes are classified as `MEDIUM` risk**: They alter latency profiles but do not disconnect management sessions.
