crossword =
  (
    function() {
      // ---- Description -----------------------------------------------------
      
      // * this function returns an object which will store the crossword module
      //
      // * the module consists of 
      //   - the official crossword API to be used for 
      //      > crossword creation
      //      > crossword instance handling
      //   - tools: functions to solve general JS problems 
      //   - cw_helper: functions to solve particular crossword problems



      
      // ---- the crossword module (object) to return later on ----------------
      
      var crossword = {};
      crossword.tools     = {};
      crossword.cw_helper = {};
      crossword.crosswords = {};



      // ---- example data ----------------------------------------------------
      
      crossword.example_puzzle_data = 
      {
        "grid":
        [// 1   2   3   4   5   6   7   8   9   10
          ["C","A","T","T","L","E", "","D","O","G"], //  1
          ["F","I","S","H", "", "", "", "","X","O"], //  2
          [ "", "","W","O","M","B","A","T", "","R"], //  3
          ["C","S", "","H","Y","E","N","A", "","I"], //  4
          ["O","K", "","G","O","A","T", "","S","L"], //  5
          ["D","U","C","K", "","V","E","F","N","L"], //  6
          [ "","N", "", "","D","E","L","L","A","A"], //  7
          [ "","K","G", "","E","R","O","Y","K", ""], //  8
          [ "", "","N", "","E", "","P", "","E", ""], //  9
          ["S","Q","U","I","R","R","E","L", "", ""]  // 10
        ],
        "words":
        [
          {"row":10, "col": 1, "length": 8, "direction":"right","clue":"squirrel","word":"SQUIRREL"},
          {"row": 3, "col": 7, "length": 8, "direction":"down","clue":"Even-toad hoofed animal which is neither sheep, cattle, nor goat","word":"ANTELOPE"},
          {"row": 3, "col": 3, "length": 6, "direction":"right","clue":"wombat","word":"WOMBAT"},
          {"row": 4, "col": 4, "length": 5, "direction":"right","clue":"hyena","word":"HYENA"},
          {"row": 8, "col": 3, "length": 3, "direction":"down","clue":"gnu","word":"GNU"},
          {"row": 1, "col":10, "length": 7, "direction":"down","clue":"Largest primate","word":"GORILLA"},
          {"row": 3, "col": 6, "length": 6, "direction":"down","clue":"beaver","word":"BEAVER"},
          {"row": 1, "col": 1, "length": 6, "direction":"right","clue":"cattle","word":"CATTLE"},
          {"row": 5, "col": 4, "length": 4, "direction":"right","clue":"goat","word":"GOAT"},
          {"row": 2, "col": 1, "length": 4, "direction":"right","clue":"fish","word":"FISH"},
          {"row": 6, "col": 1, "length": 4, "direction":"right","clue":"duck","word":"DUCK"},
          {"row": 5, "col": 9, "length": 5, "direction":"down","clue":"snake","word":"SNAKE"},
          {"row": 6, "col": 8, "length": 3, "direction":"down","clue":"fly","word":"FLY"},
          {"row": 4, "col": 2, "length": 5, "direction":"down","clue":"skunk","word":"SKUNK"},
          {"row": 4, "col": 1, "length": 3, "direction":"down","clue":"cod","word":"COD"},
          {"row": 7, "col": 5, "length": 4, "direction":"down","clue":"deer","word":"DEER"},
          {"row": 1, "col": 8, "length": 3, "direction":"right","clue":"dog","word":"DOG"},
          {"row": 1, "col": 9, "length": 2, "direction":"down","clue":"Castrated adult male cattle","word":"OX"}
        ]
      };
      
      
      


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

      crossword.tools.Ring = function(items){
          // initialize
          if ( items === undefined ) {
            items = [];
          }

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
                );
        
                if( new_pointer !== -1 ){
                  this.pointer = (new_pointer + items.length - 1) % items.length ;
                }
            }
        
            return items[this.pointer];
          };
        };
        


      // ---- cw_helper -------------------------------------------------------

      // - check consistency of puzzle_data
      crossword.cw_helper.check_puzzle_data = function(puzzle_data){

        // check that each word item has all the fields needed
        var fields_needed    = ["row", "col", "length","direction", "clue", "word"];
        var field_check      = true;

        for ( var i = 0; i < puzzle_data.words.length; i++ ){
          
          // check for nbecessary fields
          var fields_available = Object.keys(puzzle_data.words[i])
          for (var j = 0; j < fields_needed.length; j++){
            field_check = 
              field_check && 
              ( $.inArray( fields_needed[j], fields_available) ) !== -1 ;
          }

          if ( !field_check ) {
            window.i = i;
            window.e = puzzle_data.words[i];
            throw("elements do not match, required fields: row, col, length, direction, clue, word");
          }

          // check for direction values
          var direction_check = 
            puzzle_data.words[i].direction === "down" || 
            puzzle_data.words[i].direction === "right"; 
          if ( !direction_check ) {
            throw("direction neither down nor right")
          }

        }
        
      };
      
      // - sort puzzle data
      crossword.cw_helper.sort_puzzle_data = function(puzzle_data){
        puzzle_data.words.sort(
          function(a,b){
            if ( a.row > b.row ) {
              return 1;
            }else if ( a.row < b.row ) {
              return -1;
            }else if ( a.col > b.col ) {
              return 1;
            }else if ( a.col < b.col ) {
              return -1;
            }else{
              return 0;
            }
          }
        );

        return puzzle_data;
      };


      // - prepare puzzle_data
      crossword.cw_helper.enmumerate_puzzle_data = function(puzzle_data){
        var coordinates = [];
        var number      = [];

        for (var i = 0; i < puzzle_data.words.length; i++) {
          // look up coordinates 
          index = 
            coordinates.findIndex( 
              function(item){ 
                // check
                var found = 
                  item.col === puzzle_data.words[i].col && 
                  item.row === puzzle_data.words[i].row
                // return
                return found; 
              } 
            );

          if ( index === -1 ) {
            // if coordinates not registered yet ...
            // - register coordinates
            coordinates.push({"row": puzzle_data.words[ i ].row, "col": puzzle_data.words[ i ].col});
            // - register new number 
            number.push( number.length + 1 );
            // - add number to puzzle_data
            puzzle_data.words[i].number = number[ number.length - 1 ];
          }else{
            // if coordinates have already been registered ...
            // - use lookup to retrieve number and assign to current puzzle_data element
            puzzle_data.words[i].number = number[ index ];
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
          
          if ( puzzle_data.grid.length > 0 ){
            dimensions.rows = puzzle_data.grid.length;
            dimensions.columns = puzzle_data.grid[0].length;
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
        for (var rows = 0; rows < puzzle_dimensions.rows; rows++ ){
          
          // fill in arrays
          puzzle_grid_data[rows] = Array(puzzle_dimensions.columns);

            // fill arrays with default data
            for (var cols = 0; cols < puzzle_dimensions.columns; cols++ ){
              var word = 
                puzzle_data.words.filter(
                  function(item){
                    return ( item.row === 1 && item.col === 10 );
                  }
                );
              puzzle_grid_data[rows][cols] = 
                {
                  "row":        rows + 1,
                  "column":     cols + 1,
                  "letter":     puzzle_data.grid[rows][cols],
                  "words":      new Set(),
                  "directions": new Set(),
                  "number":     new Set(),
                  "start":      false
                };
            }
        }

        // fill grid 
        for ( var i = 0; i < puzzle_data.words.length; i++){
          
          var row              = puzzle_data.words[i].row;
          var col              = puzzle_data.words[i].col;
          
          var row_i            = puzzle_data.words[i].row;
          var col_i            = puzzle_data.words[i].col;

          var word             = puzzle_data.words[i].word;
          var word_direction   = puzzle_data.words[i].direction;
          var number           = [puzzle_data.words[i].direction[0], puzzle_data.words[i].number].join("");
          

         
          // mark start
          puzzle_grid_data[row-1][col-1].start        = true; 
          puzzle_grid_data[row-1][col-1].start_number = number; 

          for ( var k = 0; k < word.length; k++ ) {
            if( word_direction == "right" ){
              col_i = col + k;
            }else{
              row_i = row + k;
            }
            puzzle_grid_data[row_i-1][col_i-1].directions.add(word_direction);
            puzzle_grid_data[row_i-1][col_i-1].words.add(i);
            puzzle_grid_data[row_i-1][col_i-1].number.add(number);
            puzzle_grid_data[row_i-1][col_i-1].letter = word[k];
          }
        }


        var puzzle_grid = 
        {
          "grid_data": puzzle_grid_data,
          "word_data": puzzle_data.words,
          
          "get_cell": function(x, y){
            // check input 
            if( x === undefined || y === undefined || x < 1 || y < 1 ){
              throw("Cannot check cell, parameter input error.");
            }

            // filter elements according to coordinates
            var cell = this.grid_data[y - 1][x - 1];
            // return
            return cell;
          },

          // check if cell entry is correct
          "check_cell": function(x, y, letter){
            return this.get_cell(x,y).letter.toLowerCase() === letter.toLowerCase();
          },

          "get_word": function(number, direction){
            res = this.word_data.filter(
              function(item){
                return item.direction[0] === direction[0] && item.number === number;
              }
            );
            return res[0];
          },

          // check if word is correct
          "check_word": function(number, direction, letter){
            // get word
            var word = this.get_word(number = number, direction = direction).answer;
            
            // check it 
            for ( var i = 0; i < word.length; i++ ) {
              if( word[i].toLowerCase() != letter[i].toLowerCase() ){
                return false;
              }
            }

            // return
            return true; 
          },

          "get_grid": function(){

          },

          "check_grid": function(){

          }
        };

        // return grid 
        return puzzle_grid;
      };


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
          for ( var i = 1; i <= puzzle_dimensions.rows; ++i ) {
            
            // - start of row
            grid_table.push("<tr>");
              // - add elements
              for ( var x = 1; x <= puzzle_dimensions.columns; ++x ) {
                
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
                for ( var d = 0; d < numbers.length; d++ ) {
                  number_attr.push("number_" + directions[d] + "='" + numbers[d] + "'");
                }


                // prepare start attribute
                if ( puzzle_grid.get_cell(x,i).start ){
                  start_attr   = " start='true' ";
                  start_number = 
                    " start_number=" + 
                    Number(puzzle_grid.get_cell(x,i).start_number.substr(1));
                }else{
                  start_attr   = "";
                  start_number = ""
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
                    start_number +
                  '>' + 
                    cell_input +
                  '</td>'
                );

              }
            
              // - end of row
            grid_table.push("</tr>");

          }

          // end of table
          grid_table.push("</table>");
          
        window.puzzle_grid = puzzle_grid;
        // return 
        return grid_table.join('');
      };


      // question list - across
      crossword.cw_helper.build_question_list = function(puzzle_data, direction){
        // [<~side-effect] - sort puzzle data
        puzzle_data = crossword.cw_helper.sort_puzzle_data(puzzle_data);        
        
        // [<~side-effect] - enumerate questions - same coordinates -> same number
        puzzle_data = crossword.cw_helper.enmumerate_puzzle_data(puzzle_data);  

        // build up list 
        var question_list = ["<ul class='question_list "+ direction +"'>"] ;

        for (var i = 0; i < puzzle_data.length; i++ ) {
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
            );
          }
        }

        question_list.push("</ol>");

        // return
        return question_list.join('');
      };




      // ---- crossword API ---------------------------------------------------

      // - adding crossword to element
      crossword.new_crossword = function(el, id, puzzle_data, checker) {

        // check puzzle data consistency
        crossword.cw_helper.check_puzzle_data(puzzle_data = puzzle_data); 
        
        // add crossword to DOM element
        var cw_html =  
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

        $("#" + id + " input.puzzle_input").focusin(
          function(){
            var cell = $(this).parent();

            cell.addClass("active_input");
            number_down   = cell.attr("number_down");
            number_across = cell.attr("number_across");

            $("#" + id + " li[number_down="   + number_down   + "]" ).addClass("active_input");
            $("#" + id + " li[number_across=" + number_across + "]" ).addClass("active_input");
            $("#" + id + " td[number_down="   + number_down   + "]" ).addClass("active_input");
            $("#" + id + " td[number_across=" + number_across + "]" ).addClass("active_input");
          }
        );
        
        $("#" + id + " input.puzzle_input").focusout(
          function(){
            var cell = $(this).parent();
            cell.removeClass("active_input");
            
            number_down   = cell.attr("number_down");
            number_across = cell.attr("number_across");

            $("#" + id + " li[number_down="   + number_down + "]" ).removeClass("active_input");
            $("#" + id + " li[number_across=" + number_across + "]" ).removeClass("active_input");
            $("#" + id + " td[number_down="   + number_down + "]" ).removeClass("active_input");
            $("#" + id + " td[number_across=" + number_across + "]" ).removeClass("active_input");
          }
        );

        $("#" + id + " ul.question_list > li[number_down]").hover(
          function(){
            var cell = $(this);
            var number_down = cell.attr("number_down");
            cell.addClass("active_hover");
            $("#" + id + " td[number_down="   + number_down + "]" ).addClass("active_hover");
          },
          function(){
            var cell = $(this);
            var number_down = cell.attr("number_down");
            cell.removeClass("active_hover");
            $("#" + id +  " td[number_down="   + number_down + "]" ).removeClass("active_hover");
          }
        );

        $("#" + id + " ul.question_list > li[number_across]").hover(
          function(){
            var cell = $(this);
            var number_across = cell.attr("number_across");
            cell.addClass("active_hover");
            $("#" + id + " td[number_across="   + number_across + "]" ).addClass("active_hover");
          },
          function(){
            var cell = $(this);
            var number_across = cell.attr("number_across");
            cell.removeClass("active_hover");
            $("#" + id + " td[number_across="   + number_across + "]" ).removeClass("active_hover");
          }
        );

        $("#" + id + " ul.question_list > li").click(
          function(){
            var coords = this.getAttribute("data-coords").split(",");
            var input_elements = 
              $(
                "#" + id + " " +
                "#pid_" + coords[0] + "_" + coords[1]
              );
            input_elements[0].focus();
          }
        );

        $("#" + id + " .puzzle_input").keydown(
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
              $("#" + id + " #pid_" + x + "_" + y_coords.prev_to(y)).focus();
            }else if( event.which === 40 ){ // down 
              $("#" + id + " #pid_" + x + "_" + y_coords.next_to(y)).focus();
            }else if( event.which === 39 ){ // right
              $("#" + id + " #pid_" + x_coords.next_to(x) + "_" + y).focus();
            }else if( event.which === 37 ){ // left
              $("#" + id + " #pid_" + x_coords.prev_to(x) + "_" + y).focus();
            }else{
              if ( event.key.length == 1 ){
                this.value = event.key;
              }
            } 

          }
        );

        if ( checker === "character" || checker === 1 || checker === "letter" ){
          
          $("#" + id + " .puzzle_input").keyup(
            function( event ) {
              var id_parts      = this.id.split("_");
              var x             = Number(id_parts[1]);
              var y             = Number(id_parts[2]);
              var letter        = this.value;
  
              if ( crossword.crosswords[id].check(x = x, y = y, letter) ){
                this.classList.add("solved_letter");
                this.parentElement.classList.add("solved_letter");
              }else{
                this.parentElement.classList.remove("solved_letter");
                this.classList.remove("solved_letter");
              }
            }
          );

        } else if ( checker === "word" || checker === 2 ) {
          $("#" + id + " .puzzle_input").keyup(
            function( event ) {
              
              var direction_array = [];
              var number_array    = [];

              // get number down or set it to 0
              var number_down = 
                this.parentElement.getAttribute("number_down");

              if ( number_down !== null ){
                direction_array.push("down");
                number_down = Number(number_down.substr(1));
                number_array.push(number_down);
              }
              
              // get number across or set it to 0
              var number_across = 
                this.parentElement.getAttribute("number_across");

              if(number_across !== null ){
                direction_array.push("across");
                number_across = Number(number_across.substr(1));
                number_array.push(number_across);
              }

              for ( var i = 0; i < direction_array.length; i++ ) {
                // get input elements that belong to word
                var elements     = 
                  $(
                    "#" + id + 
                    " td[" + 
                      "number_" + direction_array[i] + "='" + 
                      direction_array[i][0] + number_array[i] + 
                    "']" + 
                    " input"
                  );
                
                // extract their value
                var letter = 
                Array.from(
                  elements.map(
                    function(){
                      return this.value;
                    }
                  )
                );
                
                // check value against word
                var check_result = 
                  crossword.crosswords[id].check(
                    number    = number_array[i], 
                    direction = direction_array[i], 
                    letter    = letter
                  );

                // act upon check 
                var solve_class = "solved_" + direction_array[i];
                if ( check_result ) {
                  elements.addClass(solve_class);
                  elements.parent().addClass(solve_class);
                } else {
                  elements.removeClass(solve_class);
                  elements.parent().removeClass(solve_class);
                }
              }
              
            }
          );

        }else if ( checker === "grid" || checker === 3){
          // get grid / check grid
        }else{
          // do nothing
        }

        
        // add data and functions to crossword module per crossword instance 
        var puzzle_grid = crossword.cw_helper.build_grid(puzzle_data);
        crossword.crosswords[id] = 
        {
          "id": id,
          "get_current_grid": function(){
            // retrieve relevant data from inputs 
            var grid = 
              $("#" + this.id + " .puzzle_input").map(
                function(){
                  return {
                    "x":   Number(this.getAttribute("x")),
                    "y":   Number(this.getAttribute("y")),
                    "val": this.value
                  };
                }
              ).sort(
              function(a,b){
                if( a.y === b.y ){
                  return (a.x - b.x);
                }else{
                  return (a.y - b.y);
                }
              }
            );

            // return
            return grid;
          }
        };

        // add checker for crossword
        if ( checker === "character" || checker === 1 || checker === "letter"){
          crossword.crosswords[id].check = 
            function(x,y, letter){
              return puzzle_grid.check_cell(x,y, letter);
            };
        }else if ( checker === "word" || checker === 2) {
          crossword.crosswords[id].check = 
            function(number, direction, letter){
              return puzzle_grid.check_word(number, direction, letter);
            };
        }else if ( checker === "grid" || checker === 3){
          crossword.crosswords[id].check = 
            function(current_grid){
              return puzzle_grid.check_grid(grid_coord_values);
            };
        }else{
          crossword.crosswords[id].check = 
            function(){
              return false;  
            };
        }
        
      };

      // return crossword module 
      return crossword;
    }
  )();



