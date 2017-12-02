crossword =
  (
    function() {
      // ---- Description -----------------------------------------------------
      
      // * this function returns an object which will store the crossword module
      //
      // * the module consists of 
      //   - tools - functions to solve general JS problems 
      //   - cw_helper - functions to solve particular crossword problems
      //   - other - all other items are the offiziel crossword API to be used for 
      //      - crossword creation
      //      - crossword manipulation
      //      - crossword ...


      
      // ---- the crossword module (object) to return later on ----------------
      
      var crossword = {};
      crossword.tools     = {};
      crossword.cw_helper = {};
      


      // ---- helper ----------------------------------------------------------
      
      // - check that arrays contain same values (no matter the order)
      crossword.tools.have_same_elements = function(array_1, array_2){
        return  $(array_1).not(array_2).length === 0 && $(array_2).not(array_1).length === 0;  
      }


      // - check type of input
      crossword.tools.is_instance_of = function(object, type){
        // go through cases: undefined, object, primitive
        if( typeof(object) === "undefined" ){
          
          return false;

        } else if( typeof(object) === "object" ){
          
          if( window[type] === undefined ){
            return false;
          }

          return ( object instanceof eval(type) );
          
        } else if( 
            $.inArray(
              typeof(object), 
              ["number", "boolean", "string", "symbol", "function"]
            ) >= 0
         ){
          if ( typeof(object) === type ){
            return true;
          }else{
            return false;
          }
        }
        
        // if those checks do not catch, return false
        return false;
      };


      // - check consistency of puzzle_data
      crossword.cw_helper.check_puzzle_data = function(puzzle_data){
        if( !crossword.tools.is_instance_of(puzzle_data, "Array") ){
          throw "puzzle_data is not an array.";
        }

        for ( i = 0; i < puzzle_data.length; i++ ){
          crossword.tools.have_same_elements(
            Object.keys(puzzle_data[i]),
            ["clue", "answer", "orientation", "x", "y"]
          );
        }
      }
      

      // adding crossword to element
      crossword.append_to_element = function(el, id, puzzle_data) {

        // check puzzle data consistency
        crossword.cw_helper.check_puzzle_data(puzzle_data = puzzle_data); 
        
        // add crossword to DOM element
        cw_html =  
          $.parseXML(
            '<div class = "crossword_wrapper puzzle-clues" id = "' + id + '">' + 
              ' <table class = "crossword_wrapper" >' +
              '  <tr   class = "crossword_wrapper" >' +
              '   <td  class = "crossword_wrapper" >' +
              '    <div class = "crossword_wrapper puzzle_wrapper" >Puzzle</div>' + 
              '   </td>' + 
              '   <td  class = "crossword_wrapper" >' +
              '    <div class = "crossword_wrapper" >Across</div>' + 
              '    <ol class = "crossword_wrapper across" ></ol>' + 
              '   </td>' + 
              '   <td class = "crossword_wrapper">' +
              '    <div class = "crossword_wrapper" >Down</div>' + 
              '    <ol class = "crossword_wrapper down" ></ol>' + 
              '   </td>' + 
              ' </tr></table>' +
            '</div>'
          );
        
        $(el).append(cw_html.documentElement);
        


        // DEV : be verbose
        console.log("added to element - Baddusch");
      }

      // return crossword module 
      return crossword;
    }
  )();


