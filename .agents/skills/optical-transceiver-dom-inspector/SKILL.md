---
name: optical-transceiver-dom-inspector
description: Standard Operating Procedure (SOP) for DDM/DOM optical transceiver diagnostics, fiber link health evaluation, RX/TX power (dBm) threshold monitoring, and optical budget degradation mitigation across MikroTik, Cisco, and Huawei hardware.
---

# Optical Transceiver DOM Inspector & Fiber Health Skill

This skill guides the AI Network Copilot through analyzing Digital Optical Monitoring (DOM) and Digital Diagnostic Monitoring (DDM) telemetry from SFP, SFP+, QSFP28, and CFP transceivers to prevent fiber link outages before they occur.

---

## 1. DDM / DOM Telemetry Metric Specifications

Each standard optical transceiver (SFF-8472 / SFF-8636) reports five continuous telemetry values:

| Parameter | Unit | Normal Operating Range | Warning / Degradation Threshold | Failure / Critical State |
| :--- | :--- | :--- | :--- | :--- |
| **RX Optical Power** | dBm | Single-Mode: `-3.0` to `-15.0 dBm`<br>Multi-Mode: `-1.0` to `-9.5 dBm` | `-16.0` to `-23.0 dBm` (High Attenuation) | `< -24.0 dBm` (Loss of Signal)<br>`> -1.0 dBm` (Receiver Overload) |
| **TX Optical Power** | dBm | Single-Mode: `-2.0` to `+3.0 dBm`<br>Multi-Mode: `-6.5` to `-1.0 dBm` | `< -3.5 dBm` (Laser weakness) | `< -10.0 dBm` (Laser failure / disabled) |
| **TX Bias Current** | mA | `20.0` to `55.0 mA` (nominal) | `60.0` to `75.0 mA` (Elevated drive current) | `> 80.0 mA` (Imminent laser diode burnout) |
| **Transceiver Temp** | °C | `20.0` to `65.0 °C` (commercial grade) | `68.0` to `74.0 °C` (Elevated thermal) | `> 75.0 °C` (Thermal shutdown risk) |
| **Supply Voltage** | V | `3.15` to `3.45 V` (3.3V ± 5%) | `3.05` to `3.14 V` or `3.46` to `3.55 V` | `< 3.0 V` or `> 3.6 V` (Power rail instability) |

---

## 2. Multi-Vendor Diagnostic Commands

### A. MikroTik RouterOS v7
```routeros
# 1. Comprehensive SFP hardware & optical telemetry monitor
/interface/ethernet/monitor [find name="sfp-sfpplus1"] once

# 2. Dedicated SFP DDM monitor (real-time optical readouts)
/interface/ethernet/sfp/monitor [find name="sfp-sfpplus1"] once

# 3. View installed SFP module inventory (serial, vendor, wavelength, connector)
/interface/ethernet/sfp/print detail

# 4. Check interface CRC and link flap counters
/interface/print stats-detail where name="sfp-sfpplus1"
```

### B. Cisco IOS & IOS-XE
```cisco
# 1. Real-time optical power and threshold limits (High/Low Alarms & Warnings)
show interfaces <INTERFACE> transceiver detail

# 2. Brief transceiver optical summary
show interfaces <INTERFACE> transceiver

# 3. Hardware inventory, optical wavelength, part number, and serial
show inventory
show idprom interface <INTERFACE>

# 4. Check link flap history and CRC input errors
show interfaces <INTERFACE> | include errors|CRC|drops|carrier
```

### C. Huawei VRP
```huawei
# 1. Detailed transceiver optical parameters and calibration
display transceiver interface <INTERFACE> verbose

# 2. Check active optical alarms and threshold warnings
display transceiver alarm interface <INTERFACE>

# 3. View optical module inventory and electronic label
display transceiver interface <INTERFACE>

# 4. Check interface CRC error counters
display interface <INTERFACE> | include CRC|Input|Output|Discard
```

---

## 3. Optical Triage & Root Cause Decision Tree

```
Telemetry Finding                           Probable Root Cause                      NOC Action
-----------------------------------------------------------------------------------------------------------------------
RX Power < -24 dBm (LOS)                   Fiber cut, unplugged patch cord,          Check ODF patch cord, test OTDR,
                                           remote laser disabled, or TX/RX inverted  verify remote SFP port is un-shut.

RX Power between -17 and -23 dBm           Dirty optical connector (LC/SC),          Clean LC ferrule with one-click cleaner,
with incrementing CRC errors               micro-bend in fiber tray, or bad splice   inspect fiber cassette, test attenuation.

RX Power > -1 dBm                          Overload (distance too short for optic,   Insert inline optical attenuator
                                           e.g. 40km ZR optic on 100m patch cord)    (e.g., 5dB or 10dB attenuator).

TX Bias Current > 75 mA                    Laser aging / end-of-life diode           Order replacement SFP module;
with decreasing TX power                   degradation                               schedule hot-swap maintenance window.

Transceiver Temp > 72 °C                   Inadequate chassis airflow, fan tray      Inspect chassis intake filters, verify
                                           failure, or high ambient NOC rack temp    chassis fan speed, check rack AC.

TX Power normal, but Remote RX is low      Tx optical path attenuation or            Inspect local patch cord and patch panel
                                           dirty local bulkhead adapter              coupling; clean local Tx port.
```

---

## 4. Proactive SLA Degradation Mitigation

When an optical link's RX power enters the **WARNING zone** (`-17 dBm` to `-23 dBm`):
1. **Prevent Routing Churn (Dampening)**:
   - Configure interface carrier-delay / link debounce timer to avoid repeated BGP/OSPF flaps while fiber is vibrating or being handled:
     - **MikroTik**: `/interface/ethernet set [find name="sfp-sfpplus1"] rx-flow-control=off auto-negotiation=no`
     - **Cisco**: `carrier-delay msec 2000` under the interface.
     - **Huawei**: `dampening carrier-loss` or `carrier-delay 2`.
2. **Graceful Traffic Shifting**:
   - If redundant fiber path exists (e.g., LACP bundle, OSPF cost, BGP local-pref), demote the degrading link so traffic shifts before total loss of signal occurs.
3. **Automated Alerting**:
   - Generate high-priority NOC ticket containing: SFP Port, Current RX/TX dBm, Bias Current, and Estimated Optical Margin Remaining.

---

## 5. Risk Assessment Classification
- **LOW**: All read-only optical monitoring commands (`show transceiver`, `/interface/ethernet/monitor`).
- **MEDIUM**: Adjusting carrier-delay debounce timers, cleaning interface stats counters.
- **CRITICAL**: Disabling/enabling laser (`shutdown`, `power-off`), replacing SFP hot-swap.
