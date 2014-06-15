/** @jsx React.DOM */
/* exported Map */

/* Holds data for the map projection */
var Map = React.createClass({
  getProjection: function() {
    var projectionDetails = this.props.layers[0].data.getValue(),
        projection = d3.geo[projectionDetails.projection]();

    if (projectionDetails.scale) projection.scale(projectionDetails.scale);
    return projection;
  },

  render: function() {
    var contentLayers = this.props.layers.getValue().slice(1);
    return (
      <svg
        className="map"
        ref="map"
        projection={this.getProjection}
        layers={contentLayers} />
    );
  }
});

