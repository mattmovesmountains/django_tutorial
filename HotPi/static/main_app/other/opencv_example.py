"""
A basic use tutorial of opencv to detect faces
Source: NeuralNine YT - "Simple Face Detection in Python"

Tested 2/27/22 and it works with existing video. 
Camera option won't work because I don't have one connected
"""

# IMPORTS

# a module to find a file
import pathlib
# the pip install is opencv-python
#   *even though this shows an import warning, it appears to work
import cv2



# OUR VARIABLES

cascade_path = pathlib.Path(cv2.__file__).parent.absolute() / "data/haarcascade_frontalface_default.xml"
# Breaking down this command
#   pathlib.Path(cv2.__file__) -- I think this just determines the current file
#   .parent.absolute()         -- Get the absolute path of the parent directory of the above mentioned file
#   /                          -- he said "..and combine it with.."; I'm not really sure how this works
#   "data/blabla..."           -- append this to the end of the file path

# If you were to print cascade_path, you would get:
#   /home/pi/.local/lib/python3.7/site-packages/cv2/data/haarcascade_frontalface_default.xml
#
# Which shows us that the apparent mumbo-jumbo that he passed in as a string is actually something 
#   that's part of opencv. Just what that is, I don't know at the moment.



# Make a "classifier"
clf = cv2.CascadeClassifier(str(cascade_path))

# This option shows how to use this with a camera. I don't have one. Not sure what'll happen.
#   The "0" represents "the first camera" (i.e. it would be '1' for a second camera, and so on)
#   camera = cv2.VideoCapture(0)
# However, he also shows how to use it with existing videos. You simply pass in the string of the file
#   name instead of an integer representing the camera:
camera = cv2.VideoCapture("three_faces.mp4")



# THE MAIN LOOP

while True:
    # "camera.read()" evidently returns a tuple that includes some throw-away data, as well as 
    #   a frame. An underscore is a standard throw-away variable
    _, frame = camera.read()

    # Then we want to convert the color stream to grayscale...
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    # NOTE:
    #   This is where the script errors out if you try to run it with no camera.
    #   Makes sense since it's trying to manipulate data that was never received.

    # Use that classifier to find faces. I think.
    faces = clf.detectMultiScale(
        gray,                           # pass in our image
        scaleFactor=1.1,                # Why? I don't know
        minNeighbors=5,                 # Bigger number = more strict interpretation of "what's a face?, i.e. fewer results"
        minSize=(30,30),                # Not exactly sure
        flags=cv2.CASCADE_SCALE_IMAGE   # He didn't say
    )

    # This is how we plot the green rectangle around faces
    for (x, y, width, height) in faces:
        # Breaking down this next line line:
        cv2.rectangle(
            frame,                      # the current frame
            (x,y),                      # the start x/y coord of the 'face'
            (x+width, y+height),        # the width/height of the 'face'
            (255,255,0),                # the color in B-G-R format; why? I don't know, that's just what open cv does I guess
            2                           # thickness of the rectangle
        )

    # I'm guessing "Faces" will be a label of some sort?
    cv2.imshow("Faces", frame)
    # The 1 refers to 1 millisecond
    #   the ord('q') means pressing the 'q' key on the keyboard
    # I don't understand the 'wait' and associated 1 ms.
    if cv2.waitKey(1) == ord('q'):
        break

# Once the while loop is broken via keypress,
#   do these two self-explanatory things...
camera.release()
cv2.destroyAllWindows()