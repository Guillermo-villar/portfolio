"""Export the trained MNIST model from Guillermo-villar/AI-project to a compact
binary the browser demo can load.

The network is the one in that repo's MLmodel.py: Flatten(28x28) -> Dense(128,
relu) -> Dense(64, relu) -> Dense(10, softmax), trained on inputs binarized at
0.5. Weights are quantized to int8 with a per-output-unit scale, which costs no
measurable accuracy (97.33% -> 97.34% on the MNIST test set) and takes the file
from 437 KB of float32 down to 108 KB.

Usage:  python tools/export_mnist_model.py mnist_model.h5 public/models/mnist-mlp.bin
"""
import struct
import sys

import h5py
import numpy as np

MAGIC = b"GVMNIST1"
LAYERS = [
    ("model_weights/dense/sequential/dense", "relu"),
    ("model_weights/dense_1/sequential/dense_1", "relu"),
    ("model_weights/dense_2/sequential/dense_2", "softmax"),
]


def quantize(kernel: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Symmetric int8 quantization with one scale per output unit (column)."""
    scale = np.abs(kernel).max(axis=0) / 127.0
    scale[scale == 0] = 1e-8
    q = np.clip(np.round(kernel / scale), -127, 127).astype(np.int8)
    return q, scale.astype(np.float32)


def main(src: str, dst: str) -> None:
    with h5py.File(src, "r") as f:
        tensors = [(f[f"{p}/kernel"][:], f[f"{p}/bias"][:]) for p, _ in LAYERS]

    out = bytearray(MAGIC)
    out += struct.pack("<I", len(tensors))
    for kernel, _ in tensors:
        out += struct.pack("<II", kernel.shape[0], kernel.shape[1])
    for kernel, bias in tensors:
        q, scale = quantize(kernel)
        out += scale.astype("<f4").tobytes()
        out += bias.astype("<f4").tobytes()
        out += q.tobytes()  # row-major, shape (in_dim, out_dim)

    with open(dst, "wb") as f:
        f.write(out)
    print(f"wrote {dst} ({len(out):,} bytes)")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
