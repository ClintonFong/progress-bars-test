Imported/Included libraries 
---------------------------
js/ractive-events-tap.umd.js for event handler on-tap retrieved from

https://github.com/ractivejs/ractive-events-tap


Files minified - Minified JS file compressed on http://jscompress.com/
--------------
progressBarTest.js 		to progressBarTest.min.js
ractive-events-tap.umd.js	to ractive-events-tap.umd.min.js



Testing
-------

test/SpecRunner.html
test/js/progressBarTestSpec.js

Comments
--------
Have tried to use Jasmine to write a test spec but due to the nature of Ractive which binds to the view in the html and needs to have its function context as part of windows, its a little challenging to modularize this to test with Jasmine.

Solution: We duplicated most of the relevant code that was in progressBarTest.js into progressBarTestSpec to unit test with Jasmine.


Things to test - testing with Jasmine
--------------
- increment bar percentage values by x units.
  	if value is greater than 100 
		bar color should be red

- decrement bar pecentage values by x units.
  	if value is less than or equal to 100
		bar color should be blue
  
	if value is decremented to less than 0
		value should be 0

- multiple bars testing


Responsive testing
------------------
- testing of usage amount display, centered is a visual thing so can't really use Jasmine.

