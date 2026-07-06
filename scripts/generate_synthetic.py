"""
generate_synthetic.py — LabSim Synthetic Healthcare Dataset Generator
=====================================================================

Generates a five-client, five-table synthetic healthcare lab dataset
modeled on the operational patterns of real diagnostic laboratories.

Design goals:
  1. Realistic  — real-world age distributions, per-test reference ranges,
     intraday volume curves, weekday effects, distinct client personalities.
  2. Difficult  — deliberate data-quality injection: null join keys,
     zero-value insurance-style records, partial timestamp coverage,
     multilingual free text, anomalies with known ground truth.
  3. Reproducible — fixed seed; anyone can regenerate the exact dataset.

Usage:
  pip install pandas numpy faker
  python generate_synthetic.py            # writes to ../data/synthetic/
  python generate_synthetic.py ./out/     # custom output folder

Output: one folder per client, five CSVs each
  (patients, orders, order_items, patient_services, patient_service_results)
"""

import sys
import uuid
from datetime import datetime, timedelta
from pathlib import Path

import numpy as np
import pandas as pd
from faker import Faker

SEED = 42
fake = Faker()
Faker.seed(SEED)
rng = np.random.default_rng(SEED)

DAYS = 180  # six months of operations
START_DATE = datetime(2025, 1, 6)  # a Monday

# ── Client personalities ──────────────────────────────────────────────────────
CLIENT_PROFILES = {
    "client_a": {  # Multi-branch lab network
        "branches": ["Branch North", "Branch South", "Branch East"],
        "daily_volume": 220, "currency": "PHP", "corporate_share": 0.25,
        "discount_rate": 0.12, "tat_median_min": 45, "lang": "en",
    },
    "client_b": {  # Metro diagnostic center, senior-discount heavy
        "branches": ["Main"],
        "daily_volume": 140, "currency": "PHP", "corporate_share": 0.10,
        "discount_rate": 0.22, "tat_median_min": 38, "lang": "en",
    },
    "client_c": {  # Community lab + pharmacy
        "branches": ["Main"],
        "daily_volume": 90, "currency": "PHP", "corporate_share": 0.05,
        "discount_rate": 0.08, "tat_median_min": 55, "lang": "en",
    },
    "client_d": {  # Outpatient clinic with clinical notes
        "branches": ["Clinic"],
        "daily_volume": 60, "currency": "PHP", "corporate_share": 0.05,
        "discount_rate": 0.10, "tat_median_min": 35, "lang": "en",
    },
    "client_e": {  # Southeast Asian clinic, Bahasa records, insurance at zero
        "branches": ["Klinik Utama"],
        "daily_volume": 110, "currency": "IDR", "corporate_share": 0.40,
        "discount_rate": 0.05, "tat_median_min": 50, "lang": "id",
    },
}

# ── Test catalog with reference ranges ───────────────────────────────────────
TESTS = {
    "CBC":            {"lo": 4.0,  "hi": 11.0,  "unit": "10^9/L", "price": 350,  "weight": 0.22},
    "Urinalysis":     {"lo": 1.005,"hi": 1.030, "unit": "SG",     "price": 150,  "weight": 0.18},
    "FBS":            {"lo": 70,   "hi": 100,   "unit": "mg/dL",  "price": 200,  "weight": 0.14},
    "Lipid Profile":  {"lo": 120,  "hi": 200,   "unit": "mg/dL",  "price": 650,  "weight": 0.11},
    "Creatinine":     {"lo": 0.6,  "hi": 1.3,   "unit": "mg/dL",  "price": 250,  "weight": 0.09},
    "Uric Acid":      {"lo": 3.5,  "hi": 7.2,   "unit": "mg/dL",  "price": 250,  "weight": 0.07},
    "SGPT":           {"lo": 7,    "hi": 56,    "unit": "U/L",    "price": 300,  "weight": 0.06},
    "TSH":            {"lo": 0.4,  "hi": 4.0,   "unit": "mIU/L",  "price": 900,  "weight": 0.05},
    "HbA1c":          {"lo": 4.0,  "hi": 5.6,   "unit": "%",      "price": 850,  "weight": 0.04},
    "Ultrasound":     {"lo": None, "hi": None,  "unit": None,     "price": 1200, "weight": 0.04},
}

# Deliberate co-occurrence structure for bundle mining (Project 4)
BUNDLES = [
    (["CBC", "Urinalysis"], 0.35),
    (["FBS", "Lipid Profile", "Creatinine", "Uric Acid"], 0.15),
    (["FBS", "HbA1c"], 0.08),
]

ABNORMAL_RATE = 0.23
ANOMALY_RATE = 0.023  # injected financial anomalies with known ground truth

# Bahasa Indonesia radiology impression components (Project 8)
ID_ORGANS = ["hepar", "ginjal kanan", "ginjal kiri", "vesica urinaria", "vesica fellea", "lien"]
ID_NORMAL = ["dalam batas normal", "tidak tampak kelainan", "normal"]
ID_ABNORMAL = ["membesar", "tampak lesi hipoechoic", "tampak batu", "dinding menebal"]


def pick_tests():
    """Pick tests for one order, honoring bundle structure."""
    r = rng.random()
    acc = 0.0
    for bundle, p in BUNDLES:
        acc += p
        if r < acc:
            extra = []
            if rng.random() < 0.3:
                names = list(TESTS.keys())
                weights = np.array([TESTS[t]["weight"] for t in names])
                extra = [str(rng.choice(names, p=weights / weights.sum()))]
            return list(dict.fromkeys(bundle + extra))
    names = list(TESTS.keys())
    weights = np.array([TESTS[t]["weight"] for t in names])
    n = int(rng.choice([1, 2, 3], p=[0.5, 0.35, 0.15]))
    picks = rng.choice(names, size=min(n, len(names)), replace=False, p=weights / weights.sum())
    return [str(p) for p in picks]


def sample_age():
    """Bimodal-ish real-world lab demographic: working adults + seniors."""
    if rng.random() < 0.30:
        return int(np.clip(rng.normal(66, 8), 60, 95))
    return int(np.clip(rng.normal(38, 13), 18, 59))


def sample_result(test, age):
    """Draw a lab value with controlled abnormal probability (age-linked)."""
    spec = TESTS[test]
    if spec["lo"] is None:
        return None, 0
    p_abn = ABNORMAL_RATE + (0.10 if age >= 60 else 0.0)
    is_abn = rng.random() < p_abn
    lo, hi = spec["lo"], spec["hi"]
    if is_abn:
        if rng.random() < 0.7:
            val = hi * (1 + rng.uniform(0.05, 0.6))
        else:
            val = lo * (1 - rng.uniform(0.05, 0.4))
    else:
        val = rng.uniform(lo, hi)
    return round(float(val), 3), int(is_abn)


def radiology_impression():
    """Compositional Bahasa impression with clause-level negation traps."""
    parts = []
    for organ in ID_ORGANS:
        if rng.random() < 0.15:
            finding = str(rng.choice(ID_ABNORMAL))
        else:
            finding = str(rng.choice(ID_NORMAL))
        parts.append(organ + " " + finding)
    return ". ".join(parts).capitalize() + "."


def intraday_hour():
    """Volume peaks mid-morning; realistic collection-hour curve."""
    hours = np.arange(6, 20)
    w = np.exp(-0.5 * ((hours - 10.0) / 3.0) ** 2)
    return int(rng.choice(hours, p=w / w.sum()))


def generate_client(client_key, profile, out_dir):
    patients, orders, order_items, services, results = [], [], [], [], []

    n_patients = int(profile["daily_volume"] * DAYS * 0.45)  # repeat visits
    patient_pool = []
    for _ in range(n_patients):
        pid = uuid.uuid4().hex[:12]
        patient_pool.append({
            "patient_id": pid,
            "name": fake.name(),
            "age": sample_age(),
            "sex": str(rng.choice(["Male", "Female"])),
            "civil_status": str(rng.choice(["Single", "Married", "Widowed"], p=[0.45, 0.45, 0.10])),
            "branch": str(rng.choice(profile["branches"])),
        })
    patients.extend(patient_pool)

    for day in range(DAYS):
        date = START_DATE + timedelta(days=day)
        weekday_factor = 1.35 if date.weekday() == 0 else (0.6 if date.weekday() == 6 else 1.0)
        n_orders = max(5, int(rng.poisson(profile["daily_volume"] * weekday_factor / 2.2)))

        for _ in range(n_orders):
            patient = patient_pool[int(rng.integers(0, len(patient_pool)))]
            order_id = uuid.uuid4().hex[:12]
            branch = patient["branch"]
            hour = intraday_hour()
            created = date.replace(hour=hour, minute=int(rng.integers(0, 60)))
            is_corporate = rng.random() < profile["corporate_share"]
            tests = pick_tests()
            if is_corporate and rng.random() < 0.5:
                extra_pool = [t for t in TESTS if t not in tests]
                k = min(len(extra_pool), int(rng.integers(2, 4)))
                idx = rng.choice(len(extra_pool), size=k, replace=False)
                tests = tests + [extra_pool[i] for i in idx]

            gross = sum(TESTS[t]["price"] for t in tests)
            fx = 380 if profile["currency"] == "IDR" else 1  # IDR-scale amounts
            gross = gross * fx

            discount = 0.0
            if is_corporate:
                discount = gross * rng.uniform(0.10, 0.25)
            elif patient["age"] >= 60 and rng.random() < profile["discount_rate"] * 3:
                discount = gross * 0.20

            # Known-ground-truth financial anomalies (Project 5)
            is_anomaly = rng.random() < ANOMALY_RATE
            if is_anomaly:
                discount = gross * rng.uniform(0.55, 0.95)

            # Client E insurance-style zero-value records (like BPJS)
            total = gross - discount
            if profile["currency"] == "IDR" and is_corporate:
                total = 0.0

            is_cancelled = int(rng.random() < 0.083)

            orders.append({
                "order_id": order_id,
                "patient_id": patient["patient_id"],
                "branch_name": branch,
                "partner_name": ("Corporate Partner " + str(rng.integers(1, 6))) if is_corporate else None,
                "created_at": created.isoformat(),
                "total_amount": round(total, 2),
                "total_discount": round(discount, 2),
                "is_cancelled": is_cancelled,
                "is_anomaly_gt": int(is_anomaly),  # ground-truth flag for evaluation
            })

            for t in tests:
                oi_id = uuid.uuid4().hex[:12]
                order_items.append({
                    "order_item_id": oi_id,
                    "order_id": order_id,
                    "product_name": t,
                    "type": "laboratory" if t != "Ultrasound" else "imaging",
                    "amount": round(TESTS[t]["price"] * fx, 2),
                    "status": "cancelled" if is_cancelled else "active",
                })

                # patient_services with injected quality issues
                ps_id = uuid.uuid4().hex[:12]
                collected = created + timedelta(minutes=int(rng.integers(5, 40)))
                tat = max(8, rng.lognormal(np.log(profile["tat_median_min"]), 0.55))
                locked = collected + timedelta(minutes=float(tat))
                # batch-lock artifact: some lock at end of shift
                if rng.random() < 0.12:
                    locked = created.replace(hour=17, minute=0)

                has_collected = rng.random() < 0.66  # partial timestamp coverage
                null_join = rng.random() < 0.15      # broken service→order join

                services.append({
                    "patient_service_id": ps_id,
                    "patient_id": patient["patient_id"],
                    "order_id": None if null_join else order_id,
                    "service_name": t,
                    "status": "cancelled" if is_cancelled else str(rng.choice(["completed", "completed", "completed", "pending"])),
                    "created_at": created.isoformat(),
                    "collected_at": collected.isoformat() if has_collected else None,
                    "locked_at": locked.isoformat() if has_collected else None,
                })

                if not is_cancelled:
                    if t == "Ultrasound" and profile["lang"] == "id":
                        results.append({
                            "result_id": uuid.uuid4().hex[:12],
                            "patient_service_id": ps_id,
                            "service_name": t,
                            "number_value": None,
                            "word_value": radiology_impression(),
                            "ref_range_min": None,
                            "ref_range_max": None,
                            "unit": None,
                            "is_abnormal_gt": None,
                        })
                    elif TESTS[t]["lo"] is not None:
                        val, abn = sample_result(t, patient["age"])
                        # inject null/implausible reference ranges (data-quality)
                        broken_range = rng.random() < 0.04
                        results.append({
                            "result_id": uuid.uuid4().hex[:12],
                            "patient_service_id": ps_id,
                            "service_name": t,
                            "number_value": val,
                            "word_value": None,
                            "ref_range_min": None if broken_range else TESTS[t]["lo"],
                            "ref_range_max": None if broken_range else TESTS[t]["hi"],
                            "unit": TESTS[t]["unit"],
                            "is_abnormal_gt": abn,
                        })

    out = out_dir / client_key
    out.mkdir(parents=True, exist_ok=True)
    pd.DataFrame(patients).to_csv(out / "patients.csv", index=False)
    pd.DataFrame(orders).to_csv(out / "orders.csv", index=False)
    pd.DataFrame(order_items).to_csv(out / "order_items.csv", index=False)
    pd.DataFrame(services).to_csv(out / "patient_services.csv", index=False)
    pd.DataFrame(results).to_csv(out / "patient_service_results.csv", index=False)
    print("  ok  {}: {} patients, {} orders, {} services, {} results".format(
        client_key, len(patients), len(orders), len(services), len(results)))


def main():
    out_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent.parent / "data" / "synthetic"
    print("")
    print("LabSim Synthetic Dataset Generator (seed={})".format(SEED))
    print("Output: {}".format(out_dir))
    print("-" * 60)
    for key, profile in CLIENT_PROFILES.items():
        generate_client(key, profile, out_dir)
    print("-" * 60)
    print("Done. 5 clients x 5 tables generated.")
    print("Ground-truth flags included: is_abnormal_gt, is_anomaly_gt")
    print("Quality issues injected: null joins (~15%), partial timestamps (~66% coverage),")
    print("  batch-locked times (~12%), broken ref ranges (~4%), zero-value insurance records.")


if __name__ == "__main__":
    main()
