var g = d3.select("body").append("svg")
    .attr("width", 960)
    .attr("height", 960)
  .append("g");

var projection = d3.geo.azimuthalEquidistant();

var path = d3.geo.path()
    .projection(projection);

var circle = d3.geo.circle();

var bloops = d3.range(0, 130, 32);

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

});

new Ractive({
  el: ".container",
  template: "#controls",
  complete: function() {
    var self = this;

    self.observe("longitude latitude", function() {
      g.select(".bloops").selectAll(".bloop")
        .data(bloops.map(function(d) { return circle.angle(d).origin([self.get("longitude"), self.get("latitude")])(); }))
        .attr("d", path);
    });
  }
});
