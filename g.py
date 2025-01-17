import pyautogui
import time
import keyboard

# Define the message to be typed
message = "MESSI
MESSI.


MESSI.
."

# Define how many times you want the message to be typed
repeat_count = 1000

# Control variables
is_typing = False
should_stop = False

# Function to start typing
def start_typing():
    global is_typing, should_stop
    is_typing = True
    should_stop = False
    print("Typing started...")

# Function to pause typing
def pause_typing():
    global is_typing
    is_typing = False
    print("Typing paused...")

# Function to stop typing
def stop_typing():
    global is_typing, should_stop
    is_typing = False
    should_stop = True
    print("Typing stopped...")

# Bind keyboard shortcuts
keyboard.add_hotkey('ctrl+shift+s', start_typing)
keyboard.add_hotkey('ctrl+shift+p', pause_typing)
keyboard.add_hotkey('ctrl+shift+q', stop_typing)

# Inform the user about the controls
print("Press 'Ctrl+Shift+S' to start typing.")
print("Press 'Ctrl+Shift+P' to pause typing.")
print("Press 'Ctrl+Shift+Q' to stop typing.")
print("You have 5 seconds to switch to the target window...")

# Small delay to switch to the desired window
time.sleep(5)

# Loop to type the message with control
for _ in range(repeat_count):
    if should_stop:
        break
    if is_typing:
        pyautogui.typewrite(message)
        pyautogui.press('enter')  # Press Enter after each message
    time.sleep(0.1)  # Small delay to reduce CPU usage

print("Script ended.")
