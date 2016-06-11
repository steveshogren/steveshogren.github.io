* Use the Screen Recorder to make and ogv
* Convert the ogv to images
mplayer -ao null macro.ogv -vo jpeg:outdir=output
* Delete any images not desired from output
* Convert images to gif
convert output/* proto-macro.gif
* Shrink huge gif to small
convert proto-macro.gif -fuzz 10% -layers Optimize proto-macro-small.gif
* Copy smaller gif to the blog static dir
# cp proto-macro-small.gif ~/programming/testhugo/static/images/NEWFILE

