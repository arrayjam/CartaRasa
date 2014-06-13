/** @jsx React.DOM */
/* exported LayerDetails */

var LayerDetails = React.createClass({
  render: function() {
    if (this.props.layer.type === "map") {
      return (
        <MapLayerDetails />
      );
    } else {
      return (
        <UnimplementedLayerDetails />
      );
    }
  }
});

var MapLayerDetails = React.createClass({
  render: function() {
    return (
      <div>I'm a map</div>
    );
  }
});

var UnimplementedLayerDetails = React.createClass({
  render: function() {
    return (
      <div>Unimplemented!</div>
    );
  }
});
