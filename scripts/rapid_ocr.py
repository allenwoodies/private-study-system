#!/usr/bin/env python3
import json
import os
import re
import sys

import cv2
import numpy as np
from rapidocr_onnxruntime import RapidOCR


ROTATIONS = (0, 90, 180, 270)


def emit(payload, code=0):
    print(json.dumps(payload, ensure_ascii=False))
    return code


def load_image(image_path):
    data = np.fromfile(image_path, dtype=np.uint8)
    if data.size == 0:
        return None
    image = cv2.imdecode(data, cv2.IMREAD_COLOR)
    if image is None:
        return None

    max_side = int(os.getenv("RAPID_OCR_MAX_SIDE", "2400"))
    height, width = image.shape[:2]
    longest = max(height, width)
    if max_side > 0 and longest > max_side:
        scale = max_side / longest
        image = cv2.resize(image, (int(width * scale), int(height * scale)), interpolation=cv2.INTER_AREA)
    return image


def rotate_image(image, angle):
    if angle == 90:
        return cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE)
    if angle == 180:
        return cv2.rotate(image, cv2.ROTATE_180)
    if angle == 270:
        return cv2.rotate(image, cv2.ROTATE_90_COUNTERCLOCKWISE)
    return image


def normalize_items(result):
    items = []
    for item in result or []:
        if not item or len(item) < 2:
            continue
        text = str(item[1] or "").strip()
        if not text:
            continue
        try:
            score = float(item[2]) if len(item) > 2 else 0.0
        except (TypeError, ValueError):
            score = 0.0
        items.append({"text": text, "score": score})
    return items


def summarize(angle, result):
    items = normalize_items(result)
    texts = [item["text"] for item in items]
    scores = [item["score"] for item in items]
    text = "\n".join(texts).strip()
    chinese_chars = len(re.findall(r"[\u4e00-\u9fff]", text))
    alnum_chars = len(re.findall(r"[A-Za-z0-9]", text))
    avg_score = sum(scores) / len(scores) if scores else 0.0
    confidence_sum = sum(scores)
    quality = (len(text) * max(avg_score, 0.1)) + chinese_chars * 1.8 + alnum_chars * 0.4 + confidence_sum * 4
    return {
        "angle": angle,
        "text": text,
        "lineCount": len(texts),
        "charCount": len(text),
        "chineseChars": chinese_chars,
        "avgScore": round(avg_score, 4),
        "quality": round(quality, 4),
    }


def main():
    if len(sys.argv) < 2:
        return emit({"ok": False, "error": "missing image path"}, 2)

    image_path = sys.argv[1]
    max_chars = int(sys.argv[2]) if len(sys.argv) >= 3 else 24000
    image = load_image(image_path)
    if image is None:
        return emit({"ok": False, "error": "image could not be loaded"}, 2)

    engine = RapidOCR()
    alternatives = []
    best = None
    for angle in ROTATIONS:
        rotated = rotate_image(image, angle)
        result, _ = engine(rotated)
        summary = summarize(angle, result)
        alternatives.append({k: v for k, v in summary.items() if k != "text"})
        if best is None or summary["quality"] > best["quality"]:
            best = summary

    text = (best or {}).get("text", "")
    truncated = False
    if len(text) > max_chars:
        text = text[:max_chars]
        truncated = True

    return emit({
        "ok": True,
        "engine": "rapidocr-onnxruntime",
        "rotation": (best or {}).get("angle", 0),
        "text": text,
        "characters": len(text),
        "lineCount": (best or {}).get("lineCount", 0),
        "avgScore": (best or {}).get("avgScore", 0),
        "truncated": truncated,
        "alternatives": alternatives,
    })


if __name__ == "__main__":
    raise SystemExit(main())
