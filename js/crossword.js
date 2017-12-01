crossword =
  (
    function() {
    
      // initialize crossword module to be returned
      var crossword = {};
      
      // adding crossword to element
      crossword.append_to_element = function(el) {
        
        

        // add crossword to DOM element
        cw_html = 
        '<div id="puzzle-clues">' + 
          ' <h2>Across</h2>' + 
          ' <ol id="across"></ol>' + 
          ' <h2>Down</h2>' + 
          ' <ol id="down"></ol>' +
        '</div>';

        $(el).append(cw_html);

        // DEV : be verbose
        console.log("added to element Baddusch");
      }

      // return crossword module 
      return crossword;
    }
  )();