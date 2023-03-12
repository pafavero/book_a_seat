
import * as d3 from 'd3';

// https://bl.ocks.org/Herst/093ff9962405dd564ef58ad8af9544d0
// var MAP_HEIGHT = 2500;
// var MAP_WIDTH = MAP_HEIGHT * Math.sqrt(2);

// var MAX_TRANSLATE_X = MAP_WIDTH / 2;
// var MIN_TRANSLATE_X = -MAX_TRANSLATE_X;

// var MAX_TRANSLATE_Y = MAP_HEIGHT / 2;
// var MIN_TRANSLATE_Y = -MAX_TRANSLATE_Y;

var MIN_RECT_WIDTH = 15;
var MIN_RECT_HEIGHT = 8;

// var HANDLE_R = 5;
// var HANDLE_R_ACTIVE = 12;

/**
 * Outside the react.js world!
 * @param {*} svg 
 */
const SeatsAndTablesClass = class  {
  constructor(svg, data, role, setSelSeat){
    this.svg = svg;
    this.role = role;
    this.seatData = data.seats;
    this.tableData = data.tables;

    this.selChair = null;
    this.setSelSeat = setSelSeat;

    // finds max id
    this.maxSeatId = this.seatData.length === 0 ? 0 : Math.max(...this.seatData.map(o => o.id));
    this.maxTableId = this.tableData.length === 0 ? 0 : Math.max(...this.tableData.map(o => o.id));
    
    // this.makeZoomPan();
    this.initSeatsSvg();
    this.initTableSvg();

    this.tableWidth = document.getElementById("table-width");
    this.tableHeight = document.getElementById("table-height");
    this.popup = d3.select("#popup1");
    this.popupClose = d3.select("#popup1 .close");
    this.popupClose.on("click", (event, d)=>{this.popup.classed("is_shown", false);});
  }

  // -------- seats ------------------------------------------------------------------------------
  initSeatsSvg(){
    // this.svg
    //   .selectAll("circle.chair").remove()
    const self = this;
    let c = this.svg
      .selectAll("circle.chair")
      .data(this.seatData, function(d) { return d.id; })
      .enter()
      .remove()
      .append("circle")
      .lower()
      .classed("chair", true);
      c.attr("name", function(d){return d.name});
    c.attr("cx", function(d){ return d.x; }).attr("cy", function(d){ return d.y; }).attr("r", 10);
    if(this.role === 'admin'){
      c.call(d3.drag()
        .on("start", this.dragStarted)
        .on("drag", this.draggingSeat));
    }
    c.on("mouseenter mouseleave", this.rectHover)
    c.on("click", function(event, d){self.clickSeat(event, d, d3.select(this))});
    
    // this.svg
    //   .selectAll("circle.chair").each(function(d, i) {
    //   // console.log(this, d, i);
    //  })
  }

  addSeat(event, d) {
    this.maxSeatId += 1;
    this.seatData.push({ id: this.maxSeatId, "name": `chair ${this.maxSeatId}`, x: 5, y: 5 });
    this.initSeatsSvg();
  }

  draggingSeat(event, d) {
    // console.log(event.dx, d.x);
    // d3.select(this).attr("cx", d.x = event.dx + d.x).attr("cy", d.y = event.dy + d.y);
    d3.select(this).attr("cx", d.x = event.x ).attr("cy", d.y = event.y);
  }

  clickSeat(event, d, item){
    d3.selectAll("circle.chair").classed('selected', false);
    this.selChair = d.id;
    item.classed('selected', true);
    this.setSelSeat(d.id);
    // popup.classed("is_shown", true);
    // popup.text('select chair with name');
  }

  rectHover(event, d) {
    var el = d3.select(this), isEntering = event.type === "mouseenter";
    el.classed("hovering", isEntering)
  }

  // --------- tables -------------------------------------------------------------------------------
  initTableSvg(){
    const self = this;
    let gTable = this.svg
      .selectAll("g.rectangle")
      .data(this.tableData)
      .enter()
      .append("g")
      .classed("rectangle", true)
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    gTable
      .append("rect")
      .attr("width", function (d) {return d.width}).attr("height", function (d) {return d.height});
    if(this.role === 'admin'){
      gTable.call(d3.drag() 
        .on("drag", function(event, d){self.tableWidth.value = ""; self.tableHeight.value = "";self.draggedTable.call(this, event, d)})
      );
    }

    if(this.role === 'admin'){
      let smallcircle = gTable
        .append("circle")
        .classed("bottomright", true)
        .attr("r", 4)
        .attr("cx", function (d) {
          return d.width;
        })
        .attr("cy",function (d) {
          return d.height;
        });

        smallcircle.on("mouseenter mouseleave", this.resizerHover)
          .call(d3.drag()
            .container("g")
            .on("start", this.rectResizeStart)
            .on("drag", function(event, d){self.rectResizing.apply(this, [event, d, 
              (val)=>{self.tableWidth.value = val;}, (val)=>{self.tableHeight.value = val;}])})
            // .on("end", ()=>{self.tableWidth.value = ""; self.tableHeight.value = "";})
          );
    }
  }

  addTable(event, d) {
    this.maxTableId += 1;
    this.tableData.push({ id: this.maxTableId, "name": `table ${this.maxSeatId}`, x: 2, y: 2, width: 100, height: 60 });
    this.initTableSvg();
  }

  draggedTable(event, d) {
    // d3.select(this).attr("x", d.x = event.x).attr("y", d.y = event.y);
    d3.select(this).attr("transform", function (d) {
      d.x = event.x;
      d.y = event.y;
      return "translate(" + d.x + "," + d.y + ")";
    });
  }

  resizerHover(event, d) {
    var el = d3.select(this), isEntering = event.type === "mouseenter";
    el.classed("hovering", isEntering)
  }

  rectResizing(event, d, setWidthVal, setHeightVal) {
    d.width = Math.max(event.x - d.x + d.initWidth, MIN_RECT_WIDTH);
    d.height = Math.max(event.y - d.y + d.initHeight, MIN_RECT_HEIGHT);
    
    setWidthVal(d.width);
    setHeightVal(d.height);

    d3.select(this.parentNode).select("rect").attr("width", d.width);
    d3.select(this.parentNode).select("rect").attr("height", d.height);

    d3.select(this.parentNode).select("circle").attr("cx", d.width);
    d3.select(this.parentNode).select("circle").attr("cy", d.height);

  }

  rectResizeStart(event, d) {
    // console.log('=========>', event.sourceEvent.clientX, event.sourceEvent.clientY);

    d.initWidth = d.width;
    d.initHeight = d.height;

    // d3.select(this.parentNode).select("rect").attr("width", d.width);
    // d3.select(this.parentNode).select("rect").attr("height", d.height);

    // d3.select(this.parentNode).select("circle").attr("cx", d.width);
    // d3.select(this.parentNode).select("circle").attr("cy", d.height);
  }
}

export default SeatsAndTablesClass;
