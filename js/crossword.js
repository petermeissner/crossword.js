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
      crossword.crosswords = {};
      crossword.example_puzzle_data = 
      [
        {"clue":"First letter of greek alphabet","answer":"alpha","orientation":"across","x":1,"y":1},
        {"clue":"Not a one ___ motor, but a three ___ motor","answer":"phase","orientation":"across","x":7,"y":1},
        {"clue":"Created from a separation of charge","answer":"capacitance","orientation":"across","x":1,"y":3},
        {"clue":"The speeds of engines without and accelaration","answer":"idlespeeds","orientation":"across","x":1,"y":5},
        {"clue":"Complex resistances","answer":"impedances","orientation":"across","x":2,"y":7},
        {"clue":"This device is used to step-up, step-down, and/or isolate","answer":"transformer","orientation":"across","x":1,"y":9},
        {"clue":"Type of ray emitted frm the sun","answer":"gamma","orientation":"across","x":1,"y":11},
        {"clue":"C programming language operator","answer":"cysan","orientation":"across","x":7,"y":11},
        {"clue":"Defines the alpha-numeric characters that are typically associated with text used in programming","answer":"ascii","orientation":"down","x":1,"y":1},
        {"clue":"Generally, if you go over 1kV per cm this happens","answer":"arc","orientation":"down","x":5,"y":1},
        {"clue":"Control system strategy that tries to replicate the human through process (abbr.)","answer":"ann","orientation":"down","x":9,"y":1},
        {"clue":"Greek variable that usually describes rotor positon","answer":"theta","orientation":"down","x":7,"y":3},
        {"clue":"Electromagnetic (abbr.)","answer":"em","orientation":"down","x":11,"y":3},
        {"clue":"No. 13 across does this to a voltage","answer":"steps","orientation":"down","x":5,"y":5},
        {"clue":"Emits a lout wailing sound","answer":"siren","orientation":"down","x":11,"y":7},
        {"clue":"Information technology (abbr.)","answer":"it","orientation":"down","x":1,"y":8},
        {"clue":"Asynchronous transfer mode (abbr.)","answer":"atm","orientation":"down","x":3,"y":9},
        {"clue":"Offset current control (abbr.)","answer":"occ","orientation":"down","x":7,"y":9}
      ];
      
      
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

      crossword.tools.Ring = function(items = []){
        
          // items
          this.items = Array.from(items);

          // pointer to current item 
          this.pointer = 0;
          
          // get next item / item next to value
          this.next_to = function(val){
            // if no value supplied simply take next 
            if( val === undefined ){
              this.pointer = (this.pointer + 1) % items.length;
            }else{
              // look up value and set pointer to next element
              new_pointer = 
                this.items.findIndex(
                  function(el){
                    return el === val;
                  }
                );
        
              if( new_pointer !== -1 ){
                this.pointer = (new_pointer + 1) % items.length;
              }
            }
            
            return items[this.pointer];
          };
          
          // get previous item / item previous to value
          this.prev_to = function(val){
            // if no value supplied simply take previous
            if( val === undefined ){
              this.pointer = (this.pointer + items.length - 1) % items.length ;
            }else{
              // look up value and set pointer to previous element
              new_pointer = 
                this.items.findIndex(
                  function(el){
                    return el === val;
                  }
                )
        
                if( new_pointer !== -1 ){
                  this.pointer = (new_pointer + items.length - 1) % items.length ;
                }
            }
        
            return items[this.pointer];
          }
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

        return puzzle_data;
      };

      // - prepare puzzle_data
      crossword.cw_helper.enmumerate_puzzle_data = function(puzzle_data){
        var coordinates = [];
        var number      = [];

        for ( i = 0; i < puzzle_data.length; i++) {
          // look up coordinates 
          index = 
            coordinates.findIndex( 
              function(el){ 
                return el.x === puzzle_data[i].x && el.y === puzzle_data[i].y ; 
              } 
            );

          if ( index === -1 ) {
            // if coordinates not registered yet ...
            // - register coordinates
            coordinates.push({"x": puzzle_data[ i ].x, "y": puzzle_data[ i ].y});
            // - register new number 
            number.push( number.length + 1 );
            // - add number to puzzle_data
            puzzle_data[ i ].number = number[ number.length - 1 ];
          }else{
            // if coordinates have already been registered ...
            // - use lookup to retrieve number and assign to current puzzle_data element
            puzzle_data[ i ].number = number[ index ];
          }
        }
        
        return puzzle_data;
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
                    puzzle_data[i].y + puzzle_data[i].answer.length - 1
                  );

            } else if( puzzle_data[i].orientation == "across" ) {
              
              dimensions.columns = 
                Math.max(
                  dimensions.columns, 
                  puzzle_data[i].x + puzzle_data[i].answer.length - 1
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

        

      // - building a grid 
      crossword.cw_helper.build_grid = function(puzzle_data){
        // - sort puzzle data
        puzzle_data = crossword.cw_helper.sort_puzzle_data(puzzle_data);        

        // - enumerate questions - same coordinates -> same number 
        puzzle_data = crossword.cw_helper.enmumerate_puzzle_data(puzzle_data);        

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
                  letter: "",
                  words: new Set(),
                  directions: new Set(),
                  number: new Set(),
                  start: false
                };
            }
        }

        var number_counter = 0;

        // fill grid 
        for (i = 0; i < puzzle_data.length; i++){
          
          var x                = puzzle_data[i].x -1;
          var y                = puzzle_data[i].y -1;
          var word             = puzzle_data[i].answer;
          var word_orientation = puzzle_data[i].orientation;
          var xk               = x;
          var yk               = y;
          var number           = [puzzle_data[i].orientation[0], puzzle_data[i].number].join("");
          
          // mark start
          puzzle_grid_data[yk][xk].start = true; 

          for ( k = 0; k < word.length; k++ ) {
            if( word_orientation == "across" ){
              xk = x + k;
            }else{
              yk = y + k;
            }
            puzzle_grid_data[yk][xk].directions.add(word_orientation);
            puzzle_grid_data[yk][xk].words.add(i);
            puzzle_grid_data[yk][xk].number.add(number);
            puzzle_grid_data[yk][xk].letter = word[k];

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
            return this.get_cell(x,y).letter.toLowerCase() === letter.toLowerCase();
          }
        };

        // return grid 
        return puzzle_grid;
      } 


      // - building grid table
      crossword.cw_helper.build_grid_table = function(puzzle_data){
        
        // - calculate dimensions of grid
        var puzzle_dimensions = 
          crossword.cw_helper.calculate_dimensions(puzzle_data);

        // - build grid
        var puzzle_grid = crossword.cw_helper.build_grid(puzzle_data);

        // build html
           // - table start 
          var grid_table  = ["<table class='puzzle_grid'>"];
          var cell_class  = ""; 
          var number_attr = "";
          var cell_input  = ""; 

          // - cycle through rows and add table rows and elements
          for (var i = 1; i <= puzzle_dimensions.rows; ++i) {
            
            // - start of row
            grid_table.push("<tr>");
              // - add elements
              for (var x = 1; x <= puzzle_dimensions.columns; ++x) {
                
                // prepare class attribute
                if ( puzzle_grid.get_cell(x, i).directions.size == 0 ){
                  cell_class = "class='empty'";
                }else{
                  cell_class = 
                    "class='" +  
                    Array.from( puzzle_grid.get_cell(x, i).directions ).join(" ") + "'";
                }
                
                // prepare number attribute
                numbers = Array.from( puzzle_grid.get_cell(x,i).number );
                directions = Array.from( puzzle_grid.get_cell(x, i).directions );
                number_attr = [""];
                for(d=0; d < numbers.length; d++){
                  number_attr.push("number_" + directions[d] + "='" + numbers[d] + "'");
                }

                // prepare start attribute
                if ( puzzle_grid.get_cell(x,i).start ){
                  start_attr = "start='true'";
                }else{
                  start_attr = "";
                }
                
                // 
                if ( puzzle_grid.get_cell(x, i).directions.size == 0 ) {
                  cell_input = '';
                }else{
                  cell_input = 
                    '<input class="puzzle_input" maxlength="1" val="" type="text" id="' + 
                    "pid_" + x + "_" + i + '" ' + 
                    'x="' + x + '" ' + 
                    'y="' + i + '" ' + 
                    '/>';
                }

                // push cells
                grid_table.push(
                  '<td ' + 
                    'data-coords="' + x + ',' + i + '" ' + 
                    cell_class + " " + 
                    number_attr.join(" ") + " " +
                    start_attr + 
                  '">'+ 
                    cell_input +
                  '</td>'
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


      // question list - across
      crossword.cw_helper.build_question_list = function(puzzle_data, direction){
        // - sort puzzle data
        puzzle_data = crossword.cw_helper.sort_puzzle_data(puzzle_data);        
        
        // - enumerate questions - same coordinates -> same number 
        puzzle_data = crossword.cw_helper.enmumerate_puzzle_data(puzzle_data);  

        // build up list 
        var question_list = ["<ul class='question_list "+ direction +"'>"] ;

        for ( i = 0; i < puzzle_data.length; i++ ) {
          if( puzzle_data[i].orientation === direction ){
            question_list.push(
              "<li " +
                "number_" + direction + "='" + direction[0] + puzzle_data[i].number + "'" +
                "data-coords='" + 
                  puzzle_data[i].x + "," + 
                  puzzle_data[i].y + 
                "'" +
              ">" +  
                "(" + puzzle_data[i].number + ") " +
                puzzle_data[i].clue + 
              "</li>"
            )
          }
        }

        question_list.push("</ol>");

        // return
        return question_list.join('');
      }




      // ---- crossword API ---------------------------------------------------

      // - adding crossword to element
      crossword.new_crossword = function(el, id, puzzle_data, checker = "character") {

        // check puzzle data consistency
        crossword.cw_helper.check_puzzle_data(puzzle_data = puzzle_data); 
        
        // add crossword to DOM element
        cw_html =  
            '<div class = "crossword_main_wrapper" id = "' + id + '">' + 
              '    <div class = "crossword_wrapper puzzle_wrapper"></div>' + 
              '    <div class = "crossword_wrapper across_wrapper"></div>' + 
              '    <div class = "crossword_wrapper down_wrapper"></div>' + 
            '</div>';
        
        // write basic structure to DOM
        $(el).append(cw_html);
        
        // add grid table to puzzle wrapper
        $("#" + id + " .puzzle_wrapper")
          .append(
            crossword.cw_helper.build_grid_table(puzzle_data)
          );

        $("#" + id + " .across_wrapper")
          .append(
            crossword.cw_helper.build_question_list(puzzle_data, "across")
          );

        $("#" + id + " .down_wrapper")
        .append(
          crossword.cw_helper.build_question_list(puzzle_data, "down")
        );

        $("input.puzzle_input").focusin(
          function(){
            var cell = $(this).parent();

            cell.addClass("active_input");
            number_down   = cell.attr("number_down");
            number_across = cell.attr("number_across");

            $( "li[number_down="   + number_down   + "]" ).addClass("active_input");
            $( "li[number_across=" + number_across + "]" ).addClass("active_input");
            $( "td[number_down="   + number_down   + "]" ).addClass("active_input");
            $( "td[number_across=" + number_across + "]" ).addClass("active_input");
          }
        );
        
        $("input.puzzle_input").focusout(
          function(){
            var cell = $(this).parent();
            cell.removeClass("active_input");
            
            number_down   = cell.attr("number_down");
            number_across = cell.attr("number_across");

            $( "li[number_down="   + number_down + "]" ).removeClass("active_input");
            $( "li[number_across=" + number_across + "]" ).removeClass("active_input");
            $( "td[number_down="   + number_down + "]" ).removeClass("active_input");
            $( "td[number_across=" + number_across + "]" ).removeClass("active_input");
          }
        );

        $("ul.question_list > li[number_down]").hover(
          function(){
            var cell = $(this);
            var number_down = cell.attr("number_down");
            cell.addClass("active_hover");
            $( "td[number_down="   + number_down + "]" ).addClass("active_hover");
          },
          function(){
            var cell = $(this);
            var number_down = cell.attr("number_down");
            cell.removeClass("active_hover");
            $( "td[number_down="   + number_down + "]" ).removeClass("active_hover");
          }
        );

        $("ul.question_list > li[number_across]").hover(
          function(){
            var cell = $(this);
            var number_across = cell.attr("number_across");
            cell.addClass("active_hover");
            $( "td[number_across="   + number_across + "]" ).addClass("active_hover");
          },
          function(){
            var cell = $(this);
            var number_across = cell.attr("number_across");
            cell.removeClass("active_hover");
            $( "td[number_across="   + number_across + "]" ).removeClass("active_hover");
          }
        );

        $("ul.question_list > li").click(
          function(){
            coords = this.getAttribute("data-coords").split(",");
            $(
              "#pid"    + "_" +
              coords[1] + "_" +
              coords[0]
            )[0].focus();
          }
        );

        $(".puzzle_input").keydown(
          function( event ) {
            var id_parts = this.id.split("_");
            var x = Number(id_parts[1]);
            var y = Number(id_parts[2]);

            // get available x coordinates for curent input
            var puzzle_inputs_x = 
              $("#" + id + " .puzzle_input[y='" + y + "']").map(
                function(){ return Number(this.attributes.x.value); } 
              )
              .sort( function(a, b){ return (a - b); } );
            
            // get available y coordinates for curent input
            var puzzle_inputs_y = 
              $("#" + id + " .puzzle_input[x='" + x + "']").map(
                function(){ return Number(this.attributes.y.value); } 
              )
              .sort( function(a, b){ return (a - b); } );


            // filter for coordinate for current line / 
            var x_coords = new crossword.tools.Ring(puzzle_inputs_x);
            var y_coords = new crossword.tools.Ring(puzzle_inputs_y);

            // jump to next input depending on key pressed
            // or override input with new character
            if( event.which === 38 ){ // up
              $("#pid_" + x + "_" + y_coords.prev_to(y)).focus();
            }else if( event.which === 40 ){ // down 
              $("#pid_" + x + "_" + y_coords.next_to(y)).focus();
            }else if( event.which === 39 ){ // right
              $("#pid_" + x_coords.next_to(x) + "_" + y).focus();
            }else if( event.which === 37 ){ // left
              $("#pid_" + x_coords.prev_to(x) + "_" + y).focus();
            }else{
              if ( event.key.length == 1 ){
                this.value = event.key;
              }
            } 

          }
        );

        $(".puzzle_input").keyup(
          function( event ) {
            var id_parts = this.id.split("_");
            var x = Number(id_parts[1]);
            var y = Number(id_parts[2]);
            var letter = this.value;

            if ( crossword.crosswords[id].check(x = x, y = y, letter) ){
              this.classList.add("solved");
              this.parentElement.classList.add("solved");
            }else{
              this.parentElement.classList.remove("solved")
              this.classList.remove("solved")
            }
          }
        )

        // add checker for crossword
        puzzle_grid = crossword.cw_helper.build_grid(puzzle_data);
        crossword.crosswords[id] = {};

        if ( checker === "character" ){
          crossword.crosswords[id].check = 
            function(x,y, letter){
              return puzzle_grid.check_cell(x,y, letter);
            }
        }else if ( checker === "word" ) {
          crossword.crosswords[id].check = 
            function(){

            }
        }else if ( checker === "puzzle" ){
          crossword.crosswords[id].check = 
            function(){

            }
        }
        
      }

      // return crossword module 
      return crossword;
    }
  )();



