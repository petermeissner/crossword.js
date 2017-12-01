crossword =
  (
    function() {
    
      // initialize crossword module to be returned
      var crossword = {
        "data" : []
      };
      
      // adding crossword to element
      crossword.append_to_element = function(el, id) {
        
        // add crossword to DOM element
        cw_html = 
        '<div class = "crossword_wrapper puzzle-clues" id = "' + id + '">' + 
          ' <table class = "crossword_wrapper" >' +
          '  <tr   class = "crossword_wrapper" >' +
          '   <td  class = "crossword_wrapper" >' +
          '    <div class = "crossword_wrapper" >Puzzle</div>' + 
          '   </td>' + 
          '   <td  class = "crossword_wrapper" >' +
          '    <div class = "crossword_wrapper" >Across</div>' + 
          '    <ol class = "crossword_wrapper across" ></ol>' + 
          '   </td>' + 
          '   <td class = "crossword_wrapper">' +
          '    <div class = "crossword_wrapper" >Down</div>' + 
          '    <ol class = "crossword_wrapper down" ></ol>' + 
          '   </td>' + 
          ' </tr></table>'
        '</div>';

        $(el).append(cw_html);

        // DEV : be verbose
        console.log("added to element Baddusch");
      }

      // return crossword module 
      return crossword;
    }
  )();