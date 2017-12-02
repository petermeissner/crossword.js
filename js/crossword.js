crossword =
  (
    function() {
      // ---- Description -----------------------------------------------------
      
      // * this function returns an object which will stores the crossword module
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
      crossword.example_data = [{"clue":"First letter of greek alphabet","answer":"alpha","orientation":"across","x":1,"y":1},{"clue":"Not a one ___ motor, but a three ___ motor","answer":"phase","orientation":"across","x":7,"y":1},{"clue":"Created from a separation of charge","answer":"capacitance","orientation":"across","x":1,"y":3},{"clue":"The speeds of engines without and accelaration","answer":"idlespeeds","orientation":"across","x":1,"y":5},{"clue":"Complex resistances","answer":"impedances","orientation":"across","x":2,"y":7},{"clue":"This device is used to step-up, step-down, and/or isolate","answer":"transformer","orientation":"across","x":1,"y":9},{"clue":"Type of ray emitted frm the sun","answer":"gamma","orientation":"across","x":1,"y":11},{"clue":"C programming language operator","answer":"cysan","orientation":"across","x":7,"y":11},{"clue":"Defines the alpha-numeric characters that are typically associated with text used in programming","answer":"ascii","orientation":"down","x":1,"y":1},{"clue":"Generally, if you go over 1kV per cm this happens","answer":"arc","orientation":"down","x":5,"y":1},{"clue":"Control system strategy that tries to replicate the human through process (abbr.)","answer":"ann","orientation":"down","x":9,"y":1},{"clue":"Greek variable that usually describes rotor positon","answer":"theta","orientation":"down","x":7,"y":3},{"clue":"Electromagnetic (abbr.)","answer":"em","orientation":"down","x":11,"y":3},{"clue":"No. 13 across does this to a voltage","answer":"steps","orientation":"down","x":5,"y":5},{"clue":"Emits a lout wailing sound","answer":"siren","orientation":"down","x":11,"y":7},{"clue":"Information technology (abbr.)","answer":"it","orientation":"down","x":1,"y":8},{"clue":"Asynchronous transfer mode (abbr.)","answer":"atm","orientation":"down","x":3,"y":9},{"clue":"Offset current control (abbr.)","answer":"occ","orientation":"down","x":7,"y":9}];
      
      // DEV - use example data for now
      var puzzle_data = crossword.example_data;


      // ---- tools ----------------------------------------------------------
      
      // - check that arrays contain same values (no matter the order)
      crossword.tools.have_same_elements = function(array_1, array_2){
        return  $(array_1).not(array_2).length === 0 && $(array_2).not(array_1).length === 0;  
      };


      // - check type of input
      crossword.tools.is_type_x = function(object, type){
        
        // go through cases: undefined, object, primitive
        if( typeof(object) === "undefined" ){ 
          // undefined cannot be matched 
          return false;
        } else if( typeof(object) === "object" ){ 
          // objects have to be matched against constructor
          if( window[type] === undefined ){
            return false;
          }else{
            return ( object instanceof eval(type) );
          }
        } else if( 
          // everything not an object has to match againt its type
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


      // ---- cw_helper -------------------------------------------------------

      // - check consistency of puzzle_data
      crossword.cw_helper.check_puzzle_data = function(puzzle_data){
        
        // check that data is an array
        if( !crossword.tools.is_type_x(puzzle_data, "Array") ){
          throw "puzzle_data is not an array.";
        }

        // check that each array item has all the data needed 
        for ( i = 0; i < puzzle_data.length; i++ ){
          crossword.tools.have_same_elements(
            Object.keys(puzzle_data[i]),
            ["clue", "answer", "orientation", "x", "y"]
          );
        }
      };
      
      // - sort puzzle data
      crossword.cw_helper.sort_puzzle_data = function(puzzle_data){
        puzzle_data.sort(
          function(a,b){
            if ( a.x > b.x ) {
              return 1;
            }else if ( a.x < b.x ) {
              return -1;
            }else if ( a.y > b.y ) {
              return 1;
            }else if ( a.y < b.y ) {
              return -1;
            }else{
              return 0;
            }
          }
        )
      };

      // - calculate dimensions of grid
      crossword.cw_helper.calculate_dimensions = function(puzzle_data){
        // object to be updated and returned later on
        dimensions = 
          {
            "rows":    0, 
            "columns": 0
          };

          for ( i = 0; i < puzzle_data.length; i++ ) {
            if ( puzzle_data[i].orientation == "down" ) {
              dimensions.columns = 
                Math.max(dimensions.columns, puzzle_data[i].x);
              
                dimensions.rows = 
                Math.max(dimensions.rows, puzzle_data[i].y + puzzle_data[i].answer.length);

            } else if( puzzle_data[i].orientation == "across" ) {
              
              dimensions.columns = 
                Math.max(dimensions.columns, puzzle_data[i].x + puzzle_data[i].answer.length);
              
              dimensions.rows = 
                Math.max(dimensions.rows, puzzle_data[i].y)
            }
          }

          // return
          return dimensions;
      };


      // ---- crossword API ---------------------------------------------------

      crossword.init = function(puzzle_data){
        
        // - sort puzzle data
        crossword.cw_helper.sort_puzzle_data(puzzle_data);
        
        // - calculate dimensions of grid
        var puzzle_dimensions = crossword.cw_helper.calculate_dimensions(puzzle_data);

      }

      // - adding crossword to element
      crossword.append_to_element = function(el, id) {

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
        
      }

      // return crossword module 
      return crossword;
    }
  )();


