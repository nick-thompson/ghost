# Ghost
Ghost, a chrome experiment with the new capabilities of web audio in HTML5,
is a browser-based audio tracker for sequencing and manipulating samples,
written totally in javascript. Try it out [here](http://nick-thompson.github.com/ghost/)!

## How do I use it?
Right, so audio trackers are pretty confusing at first if you're not familiar
with them. If you find yourself in that category, you might want to spend a
little time learning what a tracker is. For that I would suggest you check out
[Renoise](http://www.renoise.com/), as it's probably the most popular tracker
software available, and its documentation is awesome.

### Global Controls
At the top of the app, to the left, you'll find two input boxes, one for BPM
(beats per minute), and one for LPB (lines per beat). To the right is the sample
loading section. Use the blue "+" button to add a sample to your project, entering
in any resource url pointing to an audio file (.mp3, .wav, etc...). Next, you'll
need to select a sample from the drop down menu before you can begin editing.
As long as you have not chosen a sample from the drop down menu, you will not
be able to enter notes into the grid. Finally, the space bar can be used to
start and stop playback of your pattern.

### Track Editor

![Ghost Track Editor](https://github.com/nick-thompson/ghost/raw/public/editor-diagram.png)

* Note value: the note to be played back on that tick.
* Instrument number: the number of the instrument that will fire the associated note.
* Volume: the volume of the sample played on that particular tick.
* Pan: the panning value of the sample played on that particular tick.

You can click into the track editor at any place, use the arrow keys to navigate,
and the remainder of your keyboard for input. Currently you can only enter one
note value, though I hope to soon change that by involving the Web MIDI API in
this project. Hitting any key while focused on a note cell automatically fills in
the default note value and the instrument number. The volume and pan cells are
simple input fields, and can take any number from 0 to 80. This number should
be self explanatory in terms of volume, for which the default is 80. For panning,
the default value is 40 (centered), and an input less than 40 pushes the sound
to the left, while an input greater than 40 pushes the sound to the right. Finally,
use the delete key to clear any value in the grid.

## Todo
* Stopping metronome (space bar) stops all currently playing sounds
* Local file loading
* Hit-specific DSP effects
