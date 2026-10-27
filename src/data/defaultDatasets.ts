/**
 * AegisBurn AI - Semiconductor Burn-in Sample Dataset Generator
 * Generates the authentic 27-column training dataset schema and 22-column new components dataset schema.
 */

import { RawRow } from '../services/mlEngine';

export function generateTrainingDataset(count: number = 1000): RawRow[] {
  const rows: RawRow[] = [];
  const batches = [
    'LOT-A101', 'LOT-A102', 'LOT-B201', 'LOT-B202',
    'LOT-C301', 'LOT-C302', 'LOT-D401', 'LOT-D402',
    'LOT-E501', 'LOT-E502', 'LOT-F601', 'LOT-F602'
  ];
  const parts = ['FPGA-Ultra7', 'MCU-SafeCore', 'DSP-MatrixV', 'ASIC-Neural9'];

  for (let i = 1; i <= count; i++) {
    const batch = batches[(i - 1) % batches.length];
    const part = parts[(i - 1) % parts.length];
    const isAnomaly = i % 14 === 0 || i % 19 === 0;

    // Nominal values
    const temp = 125;
    const volt = 1.2;

    const i0 = 10.5 + ((i * 7) % 30) / 10.0;
    const i24 = i0 + 0.4 + ((i * 3) % 15) / 20.0 + (isAnomaly ? 1.8 : 0);
    const i96 = i24 + 0.8 + ((i * 5) % 20) / 20.0 + (isAnomaly ? 4.2 : 0);
    const i168 = i96 + 1.2 + ((i * 2) % 15) / 20.0 + (isAnomaly ? 6.5 : 0);

    const l0 = 0.35 + ((i * 11) % 25) / 100.0;
    const l24 = l0 + 0.04 + (isAnomaly ? 0.22 : 0.02);
    const l96 = l24 + 0.08 + (isAnomaly ? 0.45 : 0.04);
    const l168 = l96 + 0.12 + (isAnomaly ? 0.65 : 0.06);

    const d0 = 1.75 + ((i * 13) % 20) / 100.0;
    const d24 = d0 + 0.03 + (isAnomaly ? 0.15 : 0.02);
    const d96 = d24 + 0.06 + (isAnomaly ? 0.32 : 0.04);
    const d168 = d96 + 0.09 + (isAnomaly ? 0.48 : 0.05);

    const i_drift_0_96 = parseFloat((i96 - i0).toFixed(3));
    const i_drift_24_96 = parseFloat((i96 - i24).toFixed(3));
    const l_drift_0_96 = parseFloat((l96 - l0).toFixed(4));
    const d_drift_0_96 = parseFloat((d96 - d0).toFixed(4));

    rows.push({
      Component_ID: `AB-TR-${String(i).padStart(5, '0')}`,
      Batch_ID: batch,
      Part_Type: part,
      Test_Temperature_C: temp,
      Voltage_V: volt,

      Iddq_uA_0h: parseFloat(i0.toFixed(3)),
      Iddq_uA_24h: parseFloat(i24.toFixed(3)),
      Iddq_uA_96h: parseFloat(i96.toFixed(3)),
      Iddq_uA_168h: parseFloat(i168.toFixed(3)),

      Leakage_Current_uA_0h: parseFloat(l0.toFixed(4)),
      Leakage_Current_uA_24h: parseFloat(l24.toFixed(4)),
      Leakage_Current_uA_96h: parseFloat(l96.toFixed(4)),
      Leakage_Current_uA_168h: parseFloat(l168.toFixed(4)),

      Propagation_Delay_ns_0h: parseFloat(d0.toFixed(4)),
      Propagation_Delay_ns_24h: parseFloat(d24.toFixed(4)),
      Propagation_Delay_ns_96h: parseFloat(d96.toFixed(4)),
      Propagation_Delay_ns_168h: parseFloat(d168.toFixed(4)),

      Batch_Iddq_Mean_uA: 12.85,
      Batch_Iddq_Std_uA: 1.42,
      Batch_Leakage_Mean_uA: 0.485,
      Batch_Leakage_Std_uA: 0.095,

      Iddq_Drift_0_to_96: i_drift_0_96,
      Iddq_Drift_24_to_96: i_drift_24_96,
      Leakage_Drift_0_to_96: l_drift_0_96,
      Delay_Drift_0_to_96: d_drift_0_96,

      Defect_Label: isAnomaly ? 1 : 0,
      Final_Status: isAnomaly ? 'Reject' : 'Pass'
    });
  }

  return rows;
}

export function generateNewComponentsDataset(count: number = 1000): RawRow[] {
  const rows: RawRow[] = [];
  const batches = [
    'LOT-X701', 'LOT-X702', 'LOT-Y801', 'LOT-Y802',
    'LOT-Z901', 'LOT-Z902', 'LOT-W101', 'LOT-W102',
    'LOT-K201', 'LOT-K202', 'LOT-M301', 'LOT-M302'
  ];
  const parts = ['FPGA-Ultra7', 'MCU-SafeCore', 'DSP-MatrixV', 'ASIC-Neural9'];

  for (let i = 1; i <= count; i++) {
    const batch = batches[(i - 1) % batches.length];
    const part = parts[(i - 1) % parts.length];
    const isHighRisk = i % 11 === 0 || i % 89 === 0 || i === 42 || i === 88 || i === 412 || i === 789;
    const isMediumRisk = !isHighRisk && (i % 5 === 0 || i % 7 === 0);

    const temp = 125;
    const volt = 1.2;

    const i0 = 11.2 + ((i * 9) % 28) / 10.0;
    const i24 = i0 + 0.45 + (isHighRisk ? 2.1 : isMediumRisk ? 0.9 : 0.4);
    const i96 = i24 + 0.75 + (isHighRisk ? 4.8 : isMediumRisk ? 1.8 : 0.7);

    const l0 = 0.38 + ((i * 17) % 22) / 100.0;
    const l24 = l0 + 0.03 + (isHighRisk ? 0.28 : isMediumRisk ? 0.12 : 0.02);
    const l96 = l24 + 0.06 + (isHighRisk ? 0.52 : isMediumRisk ? 0.24 : 0.05);

    const d0 = 1.78 + ((i * 19) % 18) / 100.0;
    const d24 = d0 + 0.02 + (isHighRisk ? 0.18 : isMediumRisk ? 0.08 : 0.02);
    const d96 = d24 + 0.05 + (isHighRisk ? 0.38 : isMediumRisk ? 0.16 : 0.04);

    const i_drift_0_96 = parseFloat((i96 - i0).toFixed(3));
    const i_drift_24_96 = parseFloat((i96 - i24).toFixed(3));
    const l_drift_0_96 = parseFloat((l96 - l0).toFixed(4));
    const d_drift_0_96 = parseFloat((d96 - d0).toFixed(4));

    rows.push({
      Component_ID: `DUT-${String(104200 + i)}`,
      Batch_ID: batch,
      Part_Type: part,
      Test_Temperature_C: temp,
      Voltage_V: volt,

      Iddq_uA_0h: parseFloat(i0.toFixed(3)),
      Iddq_uA_24h: parseFloat(i24.toFixed(3)),
      Iddq_uA_96h: parseFloat(i96.toFixed(3)),

      Leakage_Current_uA_0h: parseFloat(l0.toFixed(4)),
      Leakage_Current_uA_24h: parseFloat(l24.toFixed(4)),
      Leakage_Current_uA_96h: parseFloat(l96.toFixed(4)),

      Propagation_Delay_ns_0h: parseFloat(d0.toFixed(4)),
      Propagation_Delay_ns_24h: parseFloat(d24.toFixed(4)),
      Propagation_Delay_ns_96h: parseFloat(d96.toFixed(4)),

      Batch_Iddq_Mean_uA: 13.10,
      Batch_Iddq_Std_uA: 1.35,
      Batch_Leakage_Mean_uA: 0.492,
      Batch_Leakage_Std_uA: 0.088,

      Iddq_Drift_0_to_96: i_drift_0_96,
      Iddq_Drift_24_to_96: i_drift_24_96,
      Leakage_Drift_0_to_96: l_drift_0_96,
      Delay_Drift_0_to_96: d_drift_0_96
    });
  }

  return rows;
}
