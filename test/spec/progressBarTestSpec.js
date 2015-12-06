describe("progressBarTest", function() {
  
    // -- begin imported from progressBarTest.js

    var NORMAL_BAR_COLOR    = "#337ab7";
    var WARNING_BAR_COLOR   = "red";


    //--------------------------------------------
    var RactiveProgressBars = Ractive.extend({
        windowResize     :  function() 
                            {
                                this.set( 'progressBarWidthOnScreen', $(".progress-bar").innerWidth() );
                                this.set( 'valueDisplayVisibility', 'visible' );
                            },

        checkBarColors   :  function( barIndex )
                            {
                                if( barIndex >= 0 && ( barIndex < this.get('progressPercentages').length ) )
                                {
                                    var progressPercentage = this.get( 'progressPercentages['+barIndex+']' );
                                    var currentBarColor = this.get( 'currentBarColors['+barIndex+']' );

                                    if( (progressPercentage > 100) && (this.currentBarColor != WARNING_BAR_COLOR) )
                                    {
                                        this.set( 'currentBarColors['+barIndex+']', WARNING_BAR_COLOR );
                                    }
                                    else if( (progressPercentage <= 100) && (currentBarColor != NORMAL_BAR_COLOR) )
                                    { 
                                        this.set( 'currentBarColors['+barIndex+']', NORMAL_BAR_COLOR );
                                    }
                                }
                                else
                                {
                                    //console.log( "Incorrect bar index range");
                                    return false;
                                }
                                return true;
                            }

    }); // RactiveProgressBars

    var viewProgressBars = new RactiveProgressBars({ 

        data:       { 
                        progressPercentages     : [ 10, 50, 70 ],
                        currentBarColors        : [ NORMAL_BAR_COLOR, NORMAL_BAR_COLOR, NORMAL_BAR_COLOR ],

                        progressBarWidthOnScreen: 0,
                        valueDisplayVisibility  :  'hidden'

                    }
    }); // viewProgressBars

    //--------------------------------------------

    var RactiveControlBars = Ractive.extend({

        minusValue  :   function( value )
                        {
                            var idx = this.get( 'selectedProgressBar' ); 
                            var dataAttrName = 'progressPercentages[' + idx + ']';
                            viewProgressBars.set(  dataAttrName, Math.max( 0, viewProgressBars.get( dataAttrName) - value) );
                            viewProgressBars.checkBarColors( idx ); 
                        },

        plusValue   :   function( value ) 
                        {
                            var idx = this.get( 'selectedProgressBar' ); 
                            var dataAttrName = 'progressPercentages[' + idx + ']';
                            viewProgressBars.set( dataAttrName, viewProgressBars.get( dataAttrName )+value );
                            viewProgressBars.checkBarColors( idx ); 
                        }



    }); // RactiveControlBars


    var viewControlBars = new RactiveControlBars({

        data :      {                        
                        progressBars :  [   { displayName: "Progress bar 1" },
                                            { displayName: "Progress bar 2" },
                                            { displayName: "Progress bar 3" } ]

                    }
    });

    // -- end imported from progressBarTest.js

    beforeEach(function() {
    });

    // Window Resize ------------
    it("- Should adjust to window resize ", function() {
        viewProgressBars.windowResize();
        expect( viewProgressBars.get( 'progressBarWidthOnScreen' ) ).toEqual( $(".progress-bar").innerWidth() );
        expect( viewProgressBars.get( 'valueDisplayVisibility' ) ).toEqual( 'visible' );
    });


    // Bar change value -> color change  ------------
    it("- Test Bar change value and check for color change", function() {

        viewProgressBars.set( 'progressPercentages[0]', 120 );
        expect( viewProgressBars.get( 'progressPercentages[0]' ) ).toEqual( 120 );
        viewProgressBars.checkBarColors( 0 );
        expect( viewProgressBars.get( 'currentBarColors[0]' ) ).toEqual( WARNING_BAR_COLOR );
    });

    // Control - minusValue --------------
    it("- Test Control minusValue - change back to normal color", function() {

        // currentBarColors[0] = 120 from previous test

        viewControlBars.set( 'selectedProgressBar', 0 );
        viewControlBars.minusValue(25);
        expect( viewProgressBars.get( 'progressPercentages[0]' ) ).toEqual( 95 );
        expect( viewProgressBars.get( 'currentBarColors[0]' ) ).toEqual( NORMAL_BAR_COLOR );
    });

    it("- Test Control minusValue below 0", function() {

        // currentBarColors[0] = 95 from previous test

        viewControlBars.set( 'selectedProgressBar', 0 );
        viewControlBars.minusValue(100);
        expect( viewProgressBars.get( 'progressPercentages[0]' ) ).toEqual( 0 );
        expect( viewProgressBars.get( 'currentBarColors[0]' ) ).toEqual( NORMAL_BAR_COLOR );
    });

    // Control - plusValue --------------
    it("- Test Control plusValue", function() {

        // currentBarColors[0] = 0 from previous test

        viewControlBars.set( 'selectedProgressBar', 0 );
        viewControlBars.plusValue(10);
        expect( viewProgressBars.get( 'progressPercentages[0]' ) ).toEqual( 10 );
        expect( viewProgressBars.get( 'currentBarColors[0]' ) ).toEqual( NORMAL_BAR_COLOR );
    });

    it("- Test Control plusValue + color change", function() {

        // currentBarColors[0] = 10 from previous test

        viewControlBars.set( 'selectedProgressBar', 0 );
        viewControlBars.plusValue(91);
        expect( viewProgressBars.get( 'progressPercentages[0]' ) ).toEqual( 101 );
        expect( viewProgressBars.get( 'currentBarColors[0]' ) ).toEqual( WARNING_BAR_COLOR );
    });

    // Control - multiple bars --------------
    it("- Test Multiple bars", function() {

        for( iBar=0; iBar < 3; iBar++ ) // 3 progress bars
        {
            //var progressPercentages = 'progressPercentages[' + i +']';

            viewProgressBars.set( 'progressPercentages[' + iBar +']', 20 );
            expect( viewProgressBars.checkBarColors( iBar ) ).toEqual( true ); 
            expect( viewProgressBars.get( 'progressPercentages['+iBar+']' ) ).toEqual( 20 );
            expect( viewProgressBars.get( 'currentBarColors['+iBar+']' ) ).toEqual( NORMAL_BAR_COLOR );

            viewControlBars.set( 'selectedProgressBar', iBar );
            viewControlBars.plusValue(100);
            expect( viewProgressBars.get( 'progressPercentages['+iBar+']' ) ).toEqual( 120 );
            expect( viewProgressBars.get( 'currentBarColors['+iBar+']' ) ).toEqual( WARNING_BAR_COLOR );

            viewControlBars.minusValue(150);
            expect( viewProgressBars.get( 'progressPercentages['+iBar+']' ) ).toEqual( 0 );
            expect( viewProgressBars.get( 'currentBarColors['+iBar+']' ) ).toEqual( NORMAL_BAR_COLOR );
        }
    });

    // Control - non-existant bar --------------
    it("- Non-Existant bar - will add ", function() {
        viewProgressBars.set( 'progressPercentages[4]', 120 );
        expect( viewProgressBars.get( 'progressPercentages[4]' ) ).toEqual( 120 );
        expect( viewProgressBars.checkBarColors( 4 ) ).toEqual( true ); 
        expect( viewProgressBars.get( 'currentBarColors[4]' ) ).toEqual( WARNING_BAR_COLOR );
    });

    // Bar - non-existant bar --------------
    it("- Non-Existant bar - color check", function() {
        expect( viewProgressBars.checkBarColors( 5 ) ).toEqual( false ); 
    });

}); // describe("progressBarTest", function() {
