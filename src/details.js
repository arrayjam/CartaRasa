/** @jsx React.DOM */
/* exported LayerDetails */
/* global defaultProjections, getValOrUndefined*/

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
          projectionData={this.props.layer.data} />
      );
    } else if (this.props.layer.type.getValue() === "features") {
      return <div>Here be features</div>;
    }
  }
});

var ProjectionDetails = React.createClass({
  getDefaultProps: function() {
    return { projectionData: { name: "Natural Earth", projection: "naturalEarth", scale: null }};
  },

  render: function() {
    return (
      <ProjectionSelect
        layer={this.props.layer}
        projectionName={this.props.projectionData.name} />
    );
  }
});

var ProjectionSelect = React.createClass({
  getInitialState: function() {
    return { projections: defaultProjections };
  },

  handleChange: function() {
    var index = this.refs.select.getDOMNode().value,
        projection = this.state.projections[index];

    this.props.layer.data.set(projection);
  },

  render: function() {
    console.log("render", this.props);
    var currentProjectionName = this.props.projectionName.getValue(),
        currentProjectionIndex = null,
        projectionOptions = this.state.projections.map(function(projection, i) {
          if (projection.name === currentProjectionName) currentProjectionIndex = i;
          return <option key={projection.projection} value={i}>{projection.name}</option>;
        }, this);

    return (
      <select value={currentProjectionIndex} onChange={this.handleChange} ref="select">
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
