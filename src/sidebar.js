/** @jsx React.DOM */

var defaultLayers = [
  { name: "Basemap" },
  { name: "Blast Radius" },
  { name: "Missile Travel Path" },
  { name: "Cities" },
  { name: "Military Bases" }
];

var App = React.createClass({
  render: function() {
    return (
      <div className="appContainer">
        <SidebarLayerList layers={defaultLayers} />
      </div>
    );
  }
});

var LayersHeader = React.createClass({
  render: function() {
    return (
      <div className="layersHeader">
        Layers:
      </div>
    );
  }
});

var SidebarLayerList = React.createClass({
  getInitialState: function() {
    return { selectedLayer: this.props.layers[0] };
  },

  selectLayer: function(index) {
    this.setState({ selectedLayer: this.props.layers[index] });
  },

  render: function() {
    var layers = this.props.layers.map(function(layer, i) {
      return <SidebarLayer key={"layer-" + i} name={layer.name} selectLayer={this.selectLayer.bind(this, i)} selected={this.state.selectedLayer === layer} />;
    }, this);
    return (
      <div className="sidebarLayerList">
        <LayersHeader />
        {layers}
      </div>
    );
  }
});

var SidebarLayer = React.createClass({
  render: function() {
    return (
      <div className="sidebarLayer" onClick={this.props.selectLayer}>
        {this.props.selected ? "Selected: " : ""} {this.props.name}
      </div>
    );
  }
});

React.renderComponent(
  <App />,
  document.body
);

