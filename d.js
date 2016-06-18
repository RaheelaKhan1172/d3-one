(function() {
    'use strict';
    
  var q = d3_queue.queue();
  console.info(q);
  q.defer(d3.json,'./GDP-data.json');
  console.info(q);
  q.await(fixData);
  
    function fixData(error, data) {
        if (error) throw error;
        
        var dataToDisplay = {name: data.source_name, data:[]};
        
        d3.select('.name').text(dataToDisplay.name);
        
        //closure
        var parseDate = d3.time.format("%Y-%m-%d").parse;
        
        data.data.map((a,i) => {
            return dataToDisplay.data.push({
                value: a[1],
                date: parseDate(a[0])
            });
        });
        makeMap(dataToDisplay);
    };

  /** cb for results 
    @return{null}
  **/

  function makeMap(dataToDisplay) {

      var data = dataToDisplay.data;
      
      var timeExtent = d3.extent(data,function(d) {return d.date;});
      

      var margin = {top: 20,right:20, bottom:30, left:50, width:960, height:500};
        margin.width = margin.width - margin.left - margin.right;
        margin.height = margin.height - margin.top  - margin.bottom;
     
      
      /************************** TOOLTIP **************/
      var div = d3.select(".d3stuff").append("div")
                  .attr("class", "tooltip")
                  .style("display", "none");
      
      function mouseOver() {
          div.style("display", "inline");
      }
      
      function mouseMove(axisObj) {
          
          return function() {
              var originalDate = axisObj.invert(d3.event.pageX - margin.left);
              var toDisplay = {};
              
              toDisplay = data.filter(function(a) {
                  if(a.date.getMonth() === originalDate.getMonth() && a.date.getYear() === originalDate.getYear()) {
                      return {
                          date: a.date.getMonth(),
                          value: a.value
                      }
                  };
              });
              console.log(toDisplay);
               if(toDisplay.length) {
                   var date = toDisplay[0].date.toDateString().slice(4,7) + '-' + toDisplay[0].date.toDateString().slice(-4);
                   console.log(date);
                   var toDisplayValue = String(toDisplay[0].value);
                   var val = '';
                   var ind = toDisplayValue.slice(0,toDisplayValue.indexOf('.'));
                   if (toDisplayValue) {
                       if (ind.length <= 3) {
                           val = toDisplayValue;
                       } else if (ind.length === 4) {
                           val = toDisplayValue.slice(0,1) + ',' + toDisplayValue.slice(1);
                       } else {
                           val = toDisplayValue.slice(0,2) + ',' + toDisplayValue.slice(2);
                       }
                   }
                   
                       var div = d3.select('.tooltip');
                         div.html("<h3> $" + val + " Billion</h3><p>" + date +"</p>")
                          .style("left", (d3.event.pageX-34) +"px")
                          .style("top", (d3.event.pageY - 12) + "px");
               }
           
          }
     
      }
      
      function mouseOut() {
          div.style("display", "none");
      }
      
      
      /************** END TOOLTIP ********************/
      
      /********** CLOSURES *****/
      
      var x = d3.time.scale()
                .range([0,margin.width]);
      
      var y = d3.scale.linear()
                .range([margin.height,0]);
          
      
      
      var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");
      
      var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");
      
      //fix this
      var area = d3.svg.area()
                   .x(function(d) {return x(d.date);})
                   .y0(margin.height)
                   .y1(function(d) {return y(d.value);});
      
      /******** CLOSURES END ********/
      
      
      
    /***************************************** GRAPH ******************************/  
      
    var svg = d3.select(".d3stuff").append("svg")
                .attr("width", margin.width + margin.left + margin.right)
                .attr("height", margin.height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
     
      x.domain(timeExtent);
      y.domain([0,d3.max(data,function(d) {return d.value;})]);
      
      svg.append("path")
         .datum(data)
         .attr("class", "area")
         .attr("d", area)
          .on("mouseover", mouseOver)
          .on("mousemove", mouseMove(x))
          .on("mouseout", mouseOut);
      
      svg.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(0," + margin.height + ")")
         .call(xAxis)
         .style("fill", "pink");
      
      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(dataToDisplay.name);
      
        /*********************************** END GRAPH **************************************/
  }   
    
  // margin object
    
    

})();

