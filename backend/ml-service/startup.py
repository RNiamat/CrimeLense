"""
Downloads all model artifacts from HuggingFace Hub on startup.
All failures are non-fatal — Flask starts regardless.
"""
import os
from pathlib import Path

REPO_ID = "Zafia3/crimelense-models"
MODELS_DIR = Path(__file__).resolve().parent / "models"
MODELS_DIR.mkdir(exist_ok=True)

ALL_FILES = [
    "feature_cols.pkl",
    "feature_lookup_tables.pkl",
    "bin_ensemble_weights.pkl",
    "bin_threshold.pkl",
    "cat_ensemble_weights.pkl",
    "category_v2_encoder.pkl",
    "final_bin_lgb.pkl",
    "final_bin_xgb.pkl",
    "final_cat_lgb.pkl",
    "final_cat_xgb.pkl",
    "final_sev_lgb.pkl",
    "final_sev_xgb.pkl",
    "severity_encoder.pkl",
    "final_bin_cb.pkl",
    "final_cat_cb.pkl",
    "final_sev_cb.pkl",
    "hotspot_zones_v2.json",
    "area_profiles.json",
    "category_map.json",
    "model_metadata.json",
    "hourly_patterns.csv",
    "monthly_trends.csv",
]

token = os.getenv("HF_TOKEN")
print(f"[startup] HF_TOKEN present: {bool(token)}")
print(f"[startup] Models dir: {MODELS_DIR}")
print(f"[startup] Checking {len(ALL_FILES)} files ...")

try:
    from huggingface_hub import hf_hub_download
    hf_available = True
except ImportError:
    print("[startup] huggingface_hub not installed — skipping downloads")
    hf_available = False

if hf_available:
    for fname in ALL_FILES:
        dest = MODELS_DIR / fname
        if dest.exists():
            print(f"[startup] ✓ {fname} (cached)")
            continue
        try:
            print(f"[startup] Downloading {fname} ...")
            hf_hub_download(
                repo_id=REPO_ID,
                filename=fname,
                local_dir=str(MODELS_DIR),
                token=token,
            )
            print(f"[startup] ✓ {fname}")
        except Exception as e:
            print(f"[startup] ✗ {fname} FAILED: {e}")

print("[startup] Done.")