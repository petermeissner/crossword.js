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
        var dimensions = 
          {
            "rows":    0, 
            "columns": 0
          };

          for ( i = 0; i < puzzle_data.length; i++ ) {
            if ( puzzle_data[i].orientation == "down" ) {
              dimensions.columns = 
                Math.max(
                  dimensions.columns, 
                  puzzle_data[i].x
                );
              
                dimensions.rows = 
                  Math.max(
                    dimensions.rows, 
                    puzzle_data[i].y + puzzle_data[i].answer.length
                  );

            } else if( puzzle_data[i].orientation == "across" ) {
              
              dimensions.columns = 
                Math.max(
                  dimensions.columns, 
                  puzzle_data[i].x + puzzle_data[i].answer.length
                );
              
              dimensions.rows = 
                Math.max(
                  dimensions.rows, 
                  puzzle_data[i].y
                );
            }
          }

          // return
          return dimensions;
      };

      // - building grid table
      crossword.cw_helper.build_grid_table = function(puzzle_data){
        
        // - sort puzzle data
        crossword.cw_helper.sort_puzzle_data(puzzle_data);
        
        // - calculate dimensions of grid
        var puzzle_dimensions = 
          crossword.cw_helper.calculate_dimensions(puzzle_data);

        // - build grid
        var puzzle_grid = crossword.cw_helper.build_grid(puzzle_data);

        // build html
           // - table start 
          var grid_table = ["<table class='puzzle_grid'>"];
            
          // - cycle through rows and add table rows and elements
          for (var i = 1; i <= puzzle_dimensions.rows; ++i) {
            // - start of row
            grid_table.push("<tr>");
              // - add elements
              for (var x = 1; x <= puzzle_dimensions.columns; ++x) {
                grid_table.push(
                  '<td ' + 
                    'data-coords="' + x + ',' + i + '" ' + 
                    'class="' + puzzle_grid.get_cell(x, i).type +
                  '"></td>'
                );
              };
            // - end of row
            grid_table.push("</tr>");
          };
          // end of table
          grid_table.push("</table>")
          
        // return 
        return grid_table.join('');
      };

      // - building a grid 
      crossword.cw_helper.build_grid = function(puzzle_data){
        
        // - calculate dimensions of grid
        var puzzle_dimensions = 
          crossword.cw_helper.calculate_dimensions(puzzle_data);
        
        // build grid 
        var puzzle_grid_data = Array(puzzle_data.rows);
        for ( rows = 0; rows < puzzle_dimensions.rows; rows++ ){
          
          // fill in arrays
          puzzle_grid_data[rows] = Array(puzzle_dimensions.columns);

            // fill arrays with default data
            for ( cols = 0; cols < puzzle_dimensions.columns; cols++ ){

              puzzle_grid_data[rows][cols] = 
                {
                  type: "empty",
                  letter: ""
                };
            }
        }

        // fill grid 
        for (i = 0; i < puzzle_data.length; i++){
          var x                = puzzle_data[i].x;
          var y                = puzzle_data[i].y;
          var word             = puzzle_data[i].answer;
          var word_orientation = puzzle_data[i].orientation;
          
          if ( word_orientation === "across" ) {
            for ( k = 0; k < word.length; k++ ) {
              
              // assign letter to cell
              puzzle_grid_data[y - 1][x - 1 + k].letter = word[k];              
              // update type of cell
              if ( puzzle_grid_data[y - 1][x - 1 + k].type === "down" ){
                puzzle_grid_data[y - 1][x - 1 + k].type = "both";
              }else{
                puzzle_grid_data[y - 1][x - 1 + k].type = "across";
              }

            }
          } else if ( word_orientation === "down" ) {
            for ( k = 0; k < word.length; k++ ) {
              // assign letter to cell
              puzzle_grid_data[y - 1 + k][x - 1].letter = word[k];
            
              // update type of cell
              if ( puzzle_grid_data[y - 1 + k][x - 1].type === "down" ){
                puzzle_grid_data[y - 1 + k][x - 1].type = "both";
              }else{
                puzzle_grid_data[y - 1 + k][x - 1].type = "down";
              }
            }
          }
          
        }

        var puzzle_grid = 
        {
          "data": puzzle_grid_data,
          
          "get_cell": function(x, y){
            // check input 
            if( x === undefined || y === undefined || x < 1 || y < 1 ){
              throw("Cannot check cell, parameter input error.");
            }

            // filter elements according to coordinates
            var cell = this.data[x - 1][y - 1];
            // return
            return cell  
          },

          // check if cell entry is correct
          "check_cell": function(x, y, letter){
            return this.get_cell(x,y).letter === letter;
          }
        };

        // return grid 
        return puzzle_grid;
      } 

      // ---- crossword API ---------------------------------------------------

      // - adding crossword to element
      crossword.append_to_element = function(el, id) {

        // check puzzle data consistency
        crossword.cw_helper.check_puzzle_data(puzzle_data = puzzle_data); 
        
        // add crossword to DOM element
        cw_html =  
          $.parseXML(
            '<div class = "crossword_wrapper" id = "' + id + '">' + 
              '    <div class = "crossword_wrapper puzzle_wrapper"></div>' + 
              '    <div class = "crossword_wrapper across_wrapper"></div>' + 
              '    <div class = "crossword_wrapper down_wrapper"></div>' + 
            '</div>'
          );
        
        // write basic structure to DOM
        $(el).append(cw_html.documentElement);
        
        // add grid table to puzzle wrapper
        $("#" + id + " .puzzle_wrapper")
          .append(
            crossword.cw_helper.build_grid_table(crossword.example_data)
          );
      }

      // return crossword module 
      return crossword;
    }
  )();


