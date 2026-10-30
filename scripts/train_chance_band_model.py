"""Train the three-class chance-band model from the second uploaded CSV."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, log_loss
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "placement_chance_prediction_dataset.csv"
OUT = ROOT / "src" / "data" / "placementChanceModel.json"
REPORT = ROOT / "placement_chance_model_report.json"
SEED = 20261022
FEATURES = [
    "CGPA",
    "Internships",
    "Coding_Hours_Per_Week",
    "Projects_Completed",
    "Certifications",
    "Communication_Skills_Rating",
    "Aptitude_Test_Score",
    "Hackathon_Participation",
]
CLASSES = ["Low", "Medium", "High"]


def main() -> None:
    print(f"Loading {DATA.name}...", flush=True)
    df = pd.read_csv(DATA)
    target = "Placement_Chance"
    if target not in df or set(df[target].dropna().unique()) != set(CLASSES):
        raise ValueError(f"Expected {target} labels {CLASSES}")

    X = df[FEATURES].to_numpy(dtype=np.float64)
    y_str = df[target].astype(str).to_numpy()
    y = np.array([CLASSES.index(label) for label in y_str], dtype=np.int64)

    # Stratified split
    indices = np.arange(len(y))
    idx_train, idx_test, y_train, y_test = train_test_split(
        indices, y, test_size=0.2, random_state=SEED, stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X[idx_train])
    X_test_scaled = scaler.transform(X[idx_test])

    # Multinomial logistic regression with balanced class weights
    clf = LogisticRegression(
        class_weight="balanced",
        max_iter=1000,
        random_state=SEED,
        solver="lbfgs",
    )
    clf.fit(X_train_scaled, y_train)

    train_probs = clf.predict_proba(X_train_scaled)
    test_probs = clf.predict_proba(X_test_scaled)
    test_preds = clf.predict(X_test_scaled)

    # Confusion matrix & metrics
    cm = confusion_matrix(y_test, test_preds, labels=[0, 1, 2])
    per_class = {}
    f1s = []
    recalls = []
    for i, label in enumerate(CLASSES):
        tp = int(cm[i, i])
        fp = int(cm[:, i].sum() - tp)
        fn = int(cm[i, :].sum() - tp)
        precision = tp / max(1, tp + fp)
        recall = tp / max(1, tp + fn)
        f1 = 2 * precision * recall / max(1e-15, precision + recall)
        per_class[label] = {
            "count": int(cm[i, :].sum()),
            "precision": float(precision),
            "recall": float(recall),
            "f1": float(f1),
        }
        f1s.append(f1)
        recalls.append(recall)

    acc = float(np.mean(test_preds == y_test))
    loss = float(log_loss(y_test, test_probs))
    model_metrics = {
        "accuracy": acc,
        "macroF1": float(np.mean(f1s)),
        "balancedAccuracy": float(np.mean(recalls)),
        "logLoss": loss,
        "perClass": per_class,
        "confusionMatrix": {
            label: {CLASSES[j]: int(cm[i, j]) for j in range(len(CLASSES))}
            for i, label in enumerate(CLASSES)
        },
    }

    # Format weights: row 0 is intercepts for each class, rows 1.. are feature weights
    # clf.intercept_ has shape (3,)
    # clf.coef_ has shape (3, 8) -> transpose to (8, 3)
    weights = np.vstack([clf.intercept_, clf.coef_.T]).tolist()

    importance = []
    for idx, feature in enumerate(FEATURES):
        class_w = clf.coef_[:, idx]
        importance.append({
            "feature": feature,
            "coefficients": {label: float(class_w[c]) for c, label in enumerate(CLASSES)},
            "importance": float(np.linalg.norm(class_w)),
        })
    importance.sort(key=lambda x: x["importance"], reverse=True)

    artifact = {
        "model": "Balanced L2 multinomial logistic regression",
        "version": 2,
        "seed": SEED,
        "classes": CLASSES,
        "featureNames": FEATURES,
        "means": scaler.mean_.tolist(),
        "scales": scaler.scale_.tolist(),
        "weights": weights,
        "metrics": model_metrics,
        "trainRows": int(len(idx_train)),
        "testRows": int(len(idx_test)),
        "labelCounts": {label: int((y_str == label).sum()) for label in CLASSES},
    }

    OUT.write_text(json.dumps(artifact, indent=2), encoding="utf-8")
    print(f"Saved chance model artifact to {OUT}")

    report = {
        "dataset": DATA.name,
        "sha256": hashlib.sha256(DATA.read_bytes()).hexdigest(),
        "rows": int(len(df)),
        "columns": list(df.columns),
        "labelCounts": {label: int((y_str == label).sum()) for label in CLASSES},
        "trainRows": int(len(idx_train)),
        "testRows": int(len(idx_test)),
        "split": "stratified 80/20 holdout, seed 20261022",
        "multinomialLogisticRegression": model_metrics,
        "trainAccuracy": float(np.mean(clf.predict(X_train_scaled) == y_train)),
        "featureImportance": importance,
    }
    REPORT.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"Saved chance model report to {REPORT}")
    print(f"-> Test Accuracy: {acc * 100:.2f}% | Balanced Accuracy: {model_metrics['balancedAccuracy'] * 100:.2f}%")


if __name__ == "__main__":
    main()
