/** @jsx React.DOM */
/* exported LayerDetails */
/* global defaultProjections */

var LayerDetails = React.createClass({
  render: function() {
    if (this.props.layer.type === undefined) {
      return (
        <UnimplementedLayerDetails />
      );
    } else if (this.props.layer.type.getValue() === "projection") {
      return (
        <ProjectionDetails
          layer={this.props.layer}
          projection={getValOrUndefined(this.props.layer.projection)}
          scale={getValOrUndefined(this.props.layer.scale)} />
      );
    }
  }
});

var ProjectionDetails = React.createClass({
  getDefaultProps: function() {
    return { projection: "naturalEarth", scale: null };
  },

  render: function() {
    return (
      <ProjectionSelect
        layer={this.props.layer}
        projection={this.props.projection} />
    );
  }
});

var ProjectionSelect = React.createClass({
  handleChange: function() {
    this.props.layer.projection.set(this.refs.select.getDOMNode().value);
  },

  render: function() {
    var projections = defaultProjections,
        projectionOptions = projections.map(function(projection) {
          return <option key={projection.projection} value={projection.projection}>{projection.name}</option>;
        }, this);

    return (
      <select value={this.props.projection} onChange={this.handleChange} ref="select">
        {projectionOptions}
      </select>
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
