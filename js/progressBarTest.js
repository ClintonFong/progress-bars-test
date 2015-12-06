

var NORMAL_BAR_COLOR    = "#337ab7";
var WARNING_BAR_COLOR   = "red";


//--------------------------------------------
var RactiveProgressBars = Ractive.extend({
    template         :  "#tpl-progress-bars",
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

    el:         "#progressbarContainer",
    complete:   function() 
                {
                    this.windowResize();
                },
    data:       { 
                    progressPercentages     : [ 10, 50, 70 ],
                    currentBarColors        : [ NORMAL_BAR_COLOR, NORMAL_BAR_COLOR, NORMAL_BAR_COLOR ],

                    progressBarWidthOnScreen: 0,
                    valueDisplayVisibility  :  'hidden'

                }
}); // viewProgressBars

//--------------------------------------------

var RactiveControlBars = Ractive.extend({

    template    :   "#tpl-control-bars",

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
                    },

    oninit      :   function()
                    {
                        /* ------ Event Handlers ----------- */
                        this.on({
                            minus :    function( event, value ) { this.minusValue( value ); }, 
                            plus :     function( event, value ) { this.plusValue( value ); }
                        });
                    }


}); // RactiveControlBars


var viewControlBars = new RactiveControlBars({

    el :        "#testControls",
    data :      {                        
                    progressBars :  [   { displayName: "Progress bar 1" },
                                        { displayName: "Progress bar 2" },
                                        { displayName: "Progress bar 3" } ]

                }
});

// JQuery Event Handling ----------
$(document).ready( function() {

    $(window).on( 'resize', function() {
        viewProgressBars.windowResize();
    });

}); // $(document).ready( function() {


