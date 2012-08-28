winjq
=====
Light-weight, jQuery-like interface to the WinJS library (use jQuery in Windows 8 apps). Facade to WinJS using jQuery's familiar interface

why
=====
jQuery doesn't really work in Windows 8, unless you manually sandbox a bunch of methods or update the source to not use innerHTML. 

You: "So do that"

I know, I know; however, making the changes will still give me a lot of code that I won't need, especially given the fact that I don't care about multi-browser support and I for sure have HTML5/CSS3/ECMA-252, edition 5 support. So I implemented the methods I think are most core to jQuery, and am working a subset of the animation lib (namely fadeIn/Out and the slideUp/Down animation). What is left is a very light-weight subset of jQuery that runs on Windows 8.

notes
=====
'jQuery' isn't used, only $

For the methods I implemented, the documentation on jQuery's website will hold up.