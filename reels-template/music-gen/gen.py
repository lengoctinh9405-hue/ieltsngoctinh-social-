"""Sinh nhạc nền gốc (tự sáng tác) cho Reels IELTS Ngọc Tỉnh -> MIDI.
Render bằng FluidSynth + FluidR3_GM (MIT). Không dùng giai điệu có sẵn của ai."""
import random, sys
import mido

TPB = 480
NOTE = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11}


def n(s):  # "E5" -> midi
    name, octv = s[:-1], int(s[-1])
    return 12 * (octv + 1) + NOTE[name]


CHORD = {  # chord tones (root in octave 3)
    "C": ["C3", "E3", "G3"], "G": ["G2", "B2", "D3"], "Am": ["A2", "C3", "E3"], "F": ["F2", "A2", "C3"],
    "Em": ["E3", "G3", "B3"], "D": ["D3", "F#3", "A3"], "Dm7": ["D3", "F3", "A3", "C4"],
    "G7": ["G2", "B2", "D3", "F3"], "Cmaj7": ["C3", "E3", "G3", "B3"], "Am7": ["A2", "C3", "E3", "G3"],
    "Bb": ["A#2", "D3", "F3"], "Dm": ["D3", "F3", "A3"],
}


class Song:
    def __init__(self, bpm):
        self.bpm = bpm
        self.ev = []  # (tick, type, ch, a, b)

    def prog(self, ch, prog):
        self.ev.append((0, "program_change", ch, prog, 0))

    def note(self, ch, start_beats, dur_beats, pitch, vel):
        t0 = int(start_beats * TPB)
        t1 = int((start_beats + dur_beats) * TPB) - 10
        vel = max(1, min(127, int(vel + random.randint(-6, 6))))
        self.ev.append((t0, "note_on", ch, pitch, vel))
        self.ev.append((max(t0 + 5, t1), "note_off", ch, pitch, 0))

    def save(self, path):
        mid = mido.MidiFile(ticks_per_beat=TPB)
        tr = mido.MidiTrack()
        mid.tracks.append(tr)
        tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(self.bpm), time=0))
        order = {"program_change": 0, "control_change": 1, "note_off": 2, "note_on": 3}
        last = 0
        for t, typ, ch, a, b in sorted(self.ev, key=lambda e: (e[0], order[e[1]])):
            dt = t - last
            last = t
            if typ == "program_change":
                tr.append(mido.Message(typ, channel=ch, program=a, time=dt))
            elif typ == "control_change":
                tr.append(mido.Message(typ, channel=ch, control=a, value=b, time=dt))
            else:
                tr.append(mido.Message(typ, channel=ch, note=a, velocity=b, time=dt))
        mid.save(path)


def broot(c):  # gốc hợp âm cho bass, luôn trong quãng C2–B2
    return 36 + n(CHORD[c][0]) % 12


def mel(song, ch, bar0, bars, transpose=0, vel=92):
    for i, bar in enumerate(bars):
        for st, du, p in bar:
            song.note(ch, (bar0 + i) * 4 + st, du, n(p) + transpose, vel)


# Kit GM (kênh 9)
KICK, SNARE, CLAP, HAT, OHAT, CRASH, SHAKER, TAMB = 36, 38, 39, 42, 46, 49, 70, 54


def drums(song, bar, style, fill=False):
    b = bar * 4
    if style == "pop":
        for k in [0, 1.5, 2]:
            song.note(9, b + k, 0.25, KICK, 100)
        for s in [1, 3]:
            song.note(9, b + s, 0.25, CLAP, 92)
        for i in range(16):
            song.note(9, b + i * 0.25, 0.2, SHAKER, 55 if i % 2 else 75)
    elif style == "uke":
        for k in [0, 2.5]:
            song.note(9, b + k, 0.25, KICK, 90)
        for s in [1, 3]:
            song.note(9, b + s, 0.25, CLAP, 85)
        for i in range(8):
            song.note(9, b + i * 0.5, 0.25, TAMB, 50 if i % 2 == 0 else 70)
    elif style == "funk":
        for k in [0, 1.75, 2.5]:
            song.note(9, b + k, 0.25, KICK, 105)
        for s in [1, 3]:
            song.note(9, b + s, 0.25, SNARE, 100)
        song.note(9, b + 3.75, 0.25, SNARE, 45)
        for i in range(16):
            song.note(9, b + i * 0.25, 0.2, OHAT if i == 14 else HAT, 80 if i % 4 == 0 else 55)
    elif style == "chip":
        for k in [0, 1, 2, 3]:
            song.note(9, b + k, 0.25, KICK, 105)
        for s in [1, 3]:
            song.note(9, b + s, 0.25, SNARE, 95)
            song.note(9, b + s, 0.25, CLAP, 70)
        for i in range(8):
            song.note(9, b + i * 0.5 + 0.5 * 0, 0.2, OHAT if i % 2 else HAT, 60)
    if fill:
        for i in range(4):
            song.note(9, b + 3 + i * 0.25, 0.25, SNARE, 70 + i * 10)


def build(spec, path):
    random.seed(spec["seed"])
    s = Song(spec["bpm"])
    for ch, p in spec["programs"].items():
        s.prog(ch, p)
    for ch in range(16):  # reverb nhẹ cho đẹp
        s.ev.append((0, "control_change", ch, 91, 40 if ch != 9 else 25))
    prog = spec["prog"]
    plan = spec["plan"]  # list of section names per 4-bar block
    bar = 0
    for sec in plan:
        for i in range(4 if sec != "end" else 1):
            ch_name = prog[i] if sec != "end" else spec["tonic"]
            spec["accomp"](s, bar, ch_name, sec)
            if True:
                drums(s, bar, spec["drums"], fill=(i == 3 and sec != "end"))
            if sec == "end":
                s.note(9, bar * 4, 2, CRASH, 100)
                s.note(9, bar * 4, 1, KICK, 110)
            bar += 1
        if sec in spec["melodies"]:
            ch, tr, vel = spec["lead"]
            mel(s, ch, bar - 4, spec["melodies"][sec], tr, vel)
            if spec.get("double") and sec == "B":
                dch, dtr, dvel = spec["double"]
                mel(s, dch, bar - 4, spec["melodies"][sec], dtr, dvel)
        if sec == "intro" or sec == "B":
            s.note(9, (bar - 4) * 4, 2, CRASH, 80) if sec == "B" else None
    s.save(path)


# ---------- Bài 1: "Nắng sớm" – marimba pop vui (C, 118 bpm) ----------
def acc_marimba(s, bar, c, sec):
    b = bar * 4
    tones = [n(x) + 12 for x in CHORD[c]]
    pat = [0, 1, 2, 1, 0 + 12 - 12, 2, 1, 2]
    arp = [tones[0], tones[1], tones[2], tones[1] + 0, tones[0] + 12, tones[2], tones[1], tones[2]]
    for i, p in enumerate(arp):
        s.note(1, b + i * 0.5, 0.45, p, 78 if i % 2 == 0 else 64)
    if sec == "end":
        for p in tones:
            s.note(1, b, 2, p, 90)
    root = broot(c)
    for st, off in [(0, 0), (0.75, 0), (1.5, 7), (2, 0), (2.75, 12), (3.5, 7)]:
        if sec == "end" and st > 0:
            break
        s.note(2, b + st, 0.4, root + off, 92)
    if sec in ("B", "A2"):
        for p in tones:
            s.note(3, b, 4, p + 12, 48)  # pad dây


SONG1 = dict(
    seed=11, bpm=118, tonic="C", drums="pop", prog=["C", "G", "Am", "F"],
    programs={0: 12, 1: 12, 2: 33, 3: 48, 4: 9},
    lead=(0, 0, 100), double=(4, 12, 70), accomp=acc_marimba,
    plan=["intro", "A", "A2", "B", "A", "end"],
    melodies={
        "A": [
            [(0, .5, "E5"), (.5, .5, "G5"), (1, 1, "G5"), (2, .5, "E5"), (2.5, .5, "D5"), (3, 1, "C5")],
            [(0, .5, "D5"), (.5, .5, "D5"), (1, 1, "G5"), (2, 1, "B4"), (3, 1, "D5")],
            [(0, .5, "C5"), (.5, .5, "E5"), (1, 1.5, "A5"), (2.5, .5, "G5"), (3, 1, "E5")],
            [(0, .5, "F5"), (.5, .5, "E5"), (1, .5, "D5"), (1.5, .5, "C5"), (2, 2, "D5")],
        ],
        "A2": [
            [(0, .5, "E5"), (.5, .5, "G5"), (1, 1, "G5"), (2, .5, "E5"), (2.5, .5, "D5"), (3, 1, "C5")],
            [(0, .5, "D5"), (.5, .5, "D5"), (1, 1, "G5"), (2, 1, "B4"), (3, 1, "D5")],
            [(0, .5, "C5"), (.5, .5, "E5"), (1, 1.5, "A5"), (2.5, .5, "G5"), (3, 1, "E5")],
            [(0, .5, "A5"), (.5, .5, "G5"), (1, .5, "F5"), (1.5, .5, "E5"), (2, 1, "D5"), (3, 1, "C5")],
        ],
        "B": [
            [(0, 1.5, "G5"), (1.5, .5, "A5"), (2, .5, "G5"), (2.5, .5, "E5"), (3, 1, "C6")],
            [(0, 1, "B5"), (1, .5, "A5"), (1.5, .5, "G5"), (2, 2, "D5")],
            [(0, .5, "E5"), (.5, .5, "A5"), (1, 1, "C6"), (2, .5, "B5"), (2.5, .5, "A5"), (3, 1, "E5")],
            [(0, .5, "F5"), (.5, .5, "G5"), (1, 1, "A5"), (2, 1, "G5"), (3, .5, "E5"), (3.5, .5, "G5")],
        ],
    },
)


# ---------- Bài 2: "Dạo phố" – guitar/ukulele vui (G, 112 bpm) ----------
def acc_uke(s, bar, c, sec):
    b = bar * 4
    tones = [n(x) + 12 for x in CHORD[c]]
    voicing = sorted(tones + [tones[0] + 12])
    hits = [(0, 95), (1, 80), (1.5, 70), (2.5, 72), (3, 82), (3.5, 68)]
    for st, v in hits:
        if sec == "end" and st > 0:
            break
        for k, p in enumerate(voicing if st in (0, 1, 3) else list(reversed(voicing))):
            s.note(1, b + st + k * 0.02, 0.45 if sec != "end" else 2, p, v - k * 3)
    root = broot(c)
    for st, off in [(0, 0), (1, 7), (2, 0), (2.5, 12), (3, 7)]:
        if sec == "end" and st > 0:
            break
        s.note(2, b + st, 0.45, root + off, 90)


SONG2 = dict(
    seed=22, bpm=112, tonic="G", drums="uke", prog=["G", "Em", "C", "D"],
    programs={0: 13, 1: 24, 2: 32, 4: 78},
    lead=(0, 0, 96), double=(4, 0, 62), accomp=acc_uke,
    plan=["intro", "A", "B", "A", "B", "end"],
    melodies={
        "A": [
            [(0, .5, "B4"), (.5, .5, "D5"), (1, .5, "G5"), (1.5, .5, "F#5"), (2, 1, "G5"), (3, 1, "D5")],
            [(0, .5, "E5"), (.5, .5, "G5"), (1, 1, "B5"), (2, .5, "A5"), (2.5, .5, "G5"), (3, 1, "E5")],
            [(0, .5, "C5"), (.5, .5, "E5"), (1, .5, "G5"), (1.5, .5, "A5"), (2, .5, "G5"), (2.5, .5, "E5"), (3, 1, "C5")],
            [(0, 1, "D5"), (1, .5, "F#5"), (1.5, .5, "A5"), (2, .5, "G5"), (2.5, .5, "F#5"), (3, 1, "D5")],
        ],
        "B": [
            [(0, 1, "D6"), (1, .5, "B5"), (1.5, .5, "G5"), (2, .5, "A5"), (2.5, .5, "B5"), (3, 1, "G5")],
            [(0, .5, "G5"), (.5, .5, "A5"), (1, 1.5, "B5"), (2.5, .5, "E5"), (3, 1, "G5")],
            [(0, .5, "E5"), (.5, .5, "G5"), (1, 1, "C6"), (2, .5, "B5"), (2.5, .5, "A5"), (3, 1, "G5")],
            [(0, .5, "F#5"), (.5, .5, "G5"), (1, 1, "A5"), (2, 1, "D5"), (3, 1, "F#5")],
        ],
    },
)


# ---------- Bài 3: "Groove" – funk vui, không lời (C, 104 bpm) ----------
def acc_funk(s, bar, c, sec):
    b = bar * 4
    tones = [n(x) + 12 for x in CHORD[c]]
    for st in ([0.5, 1.5, 2.25, 3.5] if sec != "end" else [0]):
        for p in tones:
            s.note(1, b + st, 0.2 if sec != "end" else 2, p, 72)
    root = broot(c)
    third = n(CHORD[c][1]) - n(CHORD[c][0])
    pat = [(0, .25, 0, 108), (.75, .25, 0, 80), (1, .25, 12, 100), (1.5, .25, 0, 85), (2, .25, 7, 95),
           (2.5, .25, 10 if len(CHORD[c]) > 3 else 9, 85), (2.75, .25, 12, 100), (3.5, .25, third, 85)]
    for st, du, off, v in pat:
        if sec == "end" and st > 0:
            break
        s.note(2, b + st, du if sec != "end" else 2, root + off, v)
    if sec != "intro" and sec != "end":  # guitar chank 16th
        for i in range(16):
            if i % 4 in (1, 3) or i in (6, 14):
                s.note(3, b + i * 0.25, 0.12, tones[-1] + 12, 50 if i % 2 else 70)


SONG3 = dict(
    seed=33, bpm=104, tonic="Cmaj7", drums="funk", prog=["Dm7", "G7", "Cmaj7", "Am7"],
    programs={0: 61, 1: 4, 2: 36, 3: 28, 4: 56},
    lead=(0, 0, 88), double=(4, 0, 70), accomp=acc_funk,
    plan=["intro", "A", "B", "A", "B", "end"],
    melodies={
        "A": [
            [(1.5, .25, "A4"), (1.75, .25, "C5"), (2, .5, "D5"), (3, .5, "F5"), (3.5, .5, "D5")],
            [(0, .5, "B4"), (1.5, .25, "D5"), (1.75, .25, "F5"), (2, .5, "G5"), (3, 1, "F5")],
            [(0, .5, "E5"), (.5, .5, "G5"), (1.5, .5, "E5"), (2, .5, "C5"), (3, .5, "B4")],
            [(0, .5, "C5"), (.5, .25, "E5"), (.75, .25, "G5"), (1, 1, "A5"), (3, .25, "G5"), (3.25, .25, "E5"), (3.5, .5, "D5")],
        ],
        "B": [
            [(0, .25, "F5"), (.25, .25, "F5"), (.5, .5, "A5"), (1.5, .5, "F5"), (2, 1, "D5"), (3.5, .5, "C5")],
            [(0, .5, "D5"), (.5, .5, "F5"), (1, .5, "G5"), (1.5, .5, "B5"), (2, 1, "A5"), (3, .5, "G5")],
            [(0, 1, "E5"), (1.5, .25, "D5"), (1.75, .25, "E5"), (2, .5, "G5"), (2.5, .5, "B5"), (3, 1, "C6")],
            [(0, .5, "A5"), (.5, .5, "G5"), (1, .5, "E5"), (1.5, .5, "C5"), (2, 1, "E5"), (3, .5, "G5"), (3.5, .5, "A5")],
        ],
    },
)


# ---------- Bài 4: "Quiz Time" – 8-bit vui nhộn (C, 128 bpm) ----------
def acc_chip(s, bar, c, sec):
    b = bar * 4
    tones = [n(x) + 12 for x in CHORD[c]]
    arp = tones + [tones[0] + 12]
    for i in range(16 if sec != "end" else 1):
        s.note(1, b + i * 0.25, 0.22 if sec != "end" else 2, arp[i % 4], 58)
    root = broot(c)
    for i in range(8 if sec != "end" else 1):
        s.note(2, b + i * 0.5, 0.4 if sec != "end" else 2, root + (12 if i % 2 else 0), 95)


SONG4 = dict(
    seed=44, bpm=128, tonic="C", drums="chip", prog=["F", "G", "Em", "Am"],
    programs={0: 80, 1: 81, 2: 38, 4: 9},
    lead=(0, -12, 84), double=(4, 12, 60), accomp=acc_chip,
    plan=["intro", "A", "B", "A", "B", "end"],
    melodies={
        "A": [
            [(0, .5, "A5"), (.5, .5, "C6"), (1, .5, "A5"), (1.5, .5, "F5"), (2, .5, "G5"), (2.5, .5, "A5"), (3, 1, "C6")],
            [(0, .5, "B5"), (.5, .5, "D6"), (1, .5, "B5"), (1.5, .5, "G5"), (2, .5, "A5"), (2.5, .5, "B5"), (3, 1, "D6")],
            [(0, .5, "G5"), (.5, .5, "B5"), (1, 1, "E6"), (2, .5, "D6"), (2.5, .5, "B5"), (3, 1, "G5")],
            [(0, .5, "A5"), (.5, .5, "C6"), (1, .5, "E6"), (1.5, .5, "D6"), (2, .5, "C6"), (2.5, .5, "B5"), (3, 1, "A5")],
        ],
        "B": [
            [(0, .25, "C6"), (.25, .25, "C6"), (.5, .5, "A5"), (1, .5, "F5"), (1.5, .5, "A5"), (2, 1, "C6"), (3, 1, "A5")],
            [(0, .25, "D6"), (.25, .25, "D6"), (.5, .5, "B5"), (1, .5, "G5"), (1.5, .5, "B5"), (2, 1, "D6"), (3, 1, "G5")],
            [(0, .5, "E6"), (.5, .5, "D6"), (1, .5, "B5"), (1.5, .5, "G5"), (2, 1, "E5"), (3, 1, "G5")],
            [(0, 1, "A5"), (1, .5, "B5"), (1.5, .5, "C6"), (2, 2, "E6")],
        ],
    },
)

if __name__ == "__main__":
    out = sys.argv[1]
    for name, spec in [("nang-som", SONG1), ("dao-pho", SONG2), ("groove", SONG3), ("quiz-time", SONG4)]:
        build(spec, f"{out}/{name}.mid")
        print("ok", name)
