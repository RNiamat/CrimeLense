import os
from huggingface_hub import hf_hub_download
from pathlib import Path

REPO_ID = "Zafia3/crimelense-models"
MODELS_DIR = Path(__file__).resolve().parent / "models"
MODELS_DIR.mkdir(exist_ok=True)

PKL_FILES = [
    "feature_cols.pkl",
    "feature_lookup_tables.pkl",
    "bin_ensemble_weights.pkl",
    "bin_threshold.pkl",
    "cat_ensemble_weights.pkl",
    "category_v2_encoder.pkl",
    "dbscan_model.pkl",
    "dbscan_scaler.pkl",
    "final_bin_cb.pkl",
    "final_bin_lgb.pkl",
    "final_bin_xgb.pkl",
    "final_cat_cb.pkl",
    "final_cat_lgb.pkl",
    "final_cat_xgb.pkl",
    "final_sev_cb.pkl",
    "final_sev_lgb.pkl",
    "final_sev_xgb.pkl",
    "severity_encoder.pkl",
    "shap_explainer.pkl",
]

token = os.getenv("HF_TOKEN")

for f in PKL_FILES:
    dest = MODELS_DIR / f
    if not dest.exists():
        print(f"Downloading {f}...")
        hf_hub_download(
            repo_id=REPO_ID,
            filename=f,
            local_dir=str(MODELS_DIR),
            token=token
        )

print("All models ready!")