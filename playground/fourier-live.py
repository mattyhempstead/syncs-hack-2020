import sounddevice as sd
import numpy as np
import matplotlib.pyplot as plt

def record_freqs(duration):
    fs = 44100
    samples = int(duration*fs)
    recording = sd.rec(samples, samplerate=fs, channels=1)
    sd.wait()
    #xS = [i/fs for i in range(0,fs)]
    y = recording
    yf = np.fft.fft(y, n=None, norm=None)
    T = 1/fs
    N = samples
    xf = np.linspace(0.0, 1.0//(2.0*T), N//2)
    return xf, N, yf

def display(xf, N, yf, points, fig, ax):
    points.set_ydata(2.0/N * np.abs(yf[:N//2]))
    fig.canvas.draw()
    fig.canvas.flush_events()

def display_first(xf, N, yf, fig, ax):
    ax.clear()
    ax.plot(xf, 2.0/N * np.abs(yf[:N//2]))

record_freqs(0.5)
plt.ion()
fig = plt.figure()
ax = fig.add_subplot(111)
points = display_first(*record_freqs(0.1), fig, ax)
plt.show(block=False)
for i in range(1000):
    display_first(*record_freqs(0.5), fig, ax)
