# Amy

from lib import *
import speech_recognition as sr
import sys

MIN_PYTHON = (3, 9)
if sys.version_info < MIN_PYTHON:
    sys.exit("Python %s.%s or later is required.\n" % MIN_PYTHON)

r = sr.Recognizer()
mic = sr.Microphone()

with mic as source:
    audio = r.listen(source)

text = r.recognize_google(audio)
print(text)

