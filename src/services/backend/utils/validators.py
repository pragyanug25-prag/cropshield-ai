"""
utils/validators.py — Reusable validation helpers.
"""

from __future__ import annotations


def validate_content_type(content_type: str | None, accepted: set[str]) -> None:
    """
    Raise ValueError if the MIME type is not in the accepted set.

    Parameters
    ----------
    content_type: MIME type string from the UploadFile (may be None).
    accepted:     Set of valid MIME type strings.
    """
    if not content_type:
        raise ValueError(
            "Could not determine the file type. "
            "Please upload a JPG, PNG, or WebP image."
        )

    # Strip parameters (e.g. "image/jpeg; charset=utf-8" → "image/jpeg")
    base_type = content_type.split(";")[0].strip().lower()

    if base_type not in accepted:
        raise ValueError(
            f"Unsupported media type '{base_type}'. "
            f"Accepted types: {', '.join(sorted(accepted))}."
        )
