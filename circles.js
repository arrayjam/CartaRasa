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

    var bloops = d3.range(0, 130, 32);

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

    d3.json("world-50m.json", function(err, world) {
      g.append("path")
          .datum(topojson.feature(world, world.objects.land))
          .attr("class", "land")
          .attr("d", path);

      g.append("path")
          .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
          .attr("class", "boundary")
          .attr("d", path);

      g.append("g")
          .attr("class", "bloops")
        .selectAll("path")
          .data(bloops.map(function(d) { return circle.angle(d).origin([0, 0])(); }))
        .enter().append("path")
          .attr("class", "bloop")
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

        self.set("longitude", coord[0]);
        self.set("latitude", coord[1]);

        placer.style("opacity", 1);
        placer.attr("cx", projection(coord)[0]);
        placer.attr("cy", projection(coord)[1]);
      };

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

    });

    self.observe("longitude latitude", function() {
      g.select(".bloops").selectAll(".bloop")
        .data(bloops.map(function(d) { return circle.angle(d).origin([self.get("longitude"), self.get("latitude")])(); }))
        .attr("d", path);
    });
  }
});
