var ε = 1e-5;

new Ractive({
  el: ".container",
  template: "#controls",

  data: {
    lonFormat: function(number) {
      var dir = number < 0 ? "W" : "E",
          format = d3.format(".4f");

      return format(Math.abs(number)) + "&deg; " + dir;
    },

    latFormat: function(number) {
      var dir = number < 0 ? "S" : "N",
          format = d3.format(".4f");

      return format(Math.abs(number)) + "&deg; " + dir;
    },

    bloops: {
      start: 0,
      stop: 132,
      step: 20
    }
  },
  complete: function() {
    var self = this;

    var g = d3.select("body").append("svg")
        .attr("width", 960)
        .attr("height", 960)
      .append("g");

    var projection = d3.geo.naturalEarth();

    var path = d3.geo.path()
        .projection(projection);

    var circle = d3.geo.circle();

    var minimapSide = 300;

    var minimapProjection = d3.geo.equirectangular()
        .scale(50)
        .translate([minimapSide / 2, minimapSide / 2]);

    var minimapPath = d3.geo.path()
        .projection(minimapProjection);

    var minimap = d3.select(".minimap")
        .attr("width", minimapSide)
        .attr("height", minimapSide)
      .append("g");

    var draggerSize = 200;

    var dragger = d3.select(".dragger")
        .attr("width", draggerSize)
        .attr("height", draggerSize)
      .append("g");

    dragger.append("rect")
        .attr("width", draggerSize)
        .attr("height", draggerSize)
        .attr("x", 0)
        .attr("y", 0)
        .style("stroke", 1)
        .style("fill", "none");

    var bloopsContainer = g.append("g")
        .attr("class", "bloops");


    d3.json("world-50m.json", function(err, world) {
      g.append("path")
          .datum(topojson.feature(world, world.objects.land))
          .attr("class", "land")
          .attr("d", path);

      g.append("path")
          .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
          .attr("class", "boundary")
          .attr("d", path);

      minimap.append("path")
          .datum(topojson.feature(world, world.objects.land))
          .attr("class", "land")
          .attr("d", minimapPath);

      minimap.append("path")
          .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
          .attr("class", "boundary")
          .attr("d", minimapPath);

      var placer = g.append("circle")
          .attr("class", "placer")
          .attr("r", 3)
          .style("fill", "red");


      var place = function() {
        var x = d3.event.x,
            y = d3.event.y,
            coord = minimapProjection.invert([x, y]);

        move(coord[0], coord[1]);
      };

      var move = function(longitude, latitude) {
        console.log(longitude, latitude);
        var projected = projection([longitude, latitude]);

        self.set("longitude", longitude);
        self.set("latitude", latitude);

        placer.style("opacity", 1);
        placer.attr("cx", projected[0]);
        placer.attr("cy", projected[1]);
      };
      move(0, 0);

      minimap.append("rect")
          .attr("width", minimapSide)
          .attr("height", minimapSide)
          .attr("x", 0)
          .attr("y", 0)
          .style("fill", "none")
          .style("stroke", "none")
          .style("pointer-events", "all")
          .style("cursor", "crosshair")
          .call(d3.behavior.drag()
                  .on("drag", function() {
                    console.log("drag", d3.event.x);
                    place();
                  })
                  .on("dragend", function() {
                    placer.style("opacity", 0);
                  })
               );

      var dragInterval;
      dragger.append("circle")
          .datum({ x: draggerSize / 2, y: draggerSize / 2 })
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r", 5)
          .style("fill", "steelblue")
          .style("cursor", "move")
          .call(d3.behavior.drag()
                  .on("drag", function(d) {
                    d3.select(this)
                        .attr("cx", d.x = d3.event.x)
                        .attr("cy", d.y = d3.event.y);

                    console.log(d3.event.x);

                    move(self.get("longitude") + (d.x - draggerSize / 2) / 100,
                         self.get("latitude") + (d.y - draggerSize / 2) / 100 * -1);
                    clearInterval(dragInterval);
                    dragInterval = setInterval(function() {
                      move(self.get("longitude") + (d.x - draggerSize / 2) / 100,
                           self.get("latitude") + (d.y - draggerSize / 2) / 100 * -1);
                    }, 10);


                    //console.log(self.get("longitude"), d3.event.x, d3.event.y);
                  })
                  //.on("mousedown",function() {
                    //console.log(d3.event);
                  //})
                  .on("dragend", function() {
                    d3.select(this).transition()
                        .attr("cx", draggerSize / 2)
                        .attr("cy", draggerSize / 2);
                    clearInterval(dragInterval);
                  })
               );

    });

    var longitudeBound = d3.scale.linear().domain([-180, 180]).range([-180, 180]).clamp(true);
    var latitudeBound = d3.scale.linear().domain([-90, 90]).range([-90, 90]).clamp(true);
    self.observe("longitude latitude bloops", function() {
      self.set("longitude", longitudeBound(self.get("longitude")));
      self.set("latitude", latitudeBound(self.get("latitude")));

      var bloops = d3.range(self.get("bloops.start"),
                            self.get("bloops.stop"),
                            self.get("bloops.step"));

      console.log(bloops);
      var bloopers = bloopsContainer.selectAll("path")
          .data(bloops.map(function(d) {  return circle.angle(d + ε).origin([self.get("longitude"), self.get("latitude")])(); }));

      bloopers.enter().append("path");

      bloopers.attr("class", "bloop")
          .attr("d", path)
          .style("opacity", function() { console.log(arguments); });

      bloopers.exit().remove();
    });
  }
});
