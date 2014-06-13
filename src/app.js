/** @jsx React.DOM */
/* global LayerDetails, SidebarLayerList */

var cx = React.addons.classSet;

var defaultLayers = [
  { name: "Basemap", type: "map" },
  { name: "Blast Radius" },
  { name: "Missile Travel Path" },
  { name: "Cities" },
  { name: "Military Bases" }
];

var App = React.createClass({
  getInitialState: function() {
    return { selectedLayer: this.props.layers[0] };
  },

  selectLayer: function(index) {
    this.setState({ selectedLayer: this.props.layers[index] });
  },

  render: function() {
    return (
      <div className="appContainer">
        <SidebarLayerList
          layers={this.props.layers}
          selectedLayer={this.state.selectedLayer}
          selectLayer={this.selectLayer} />
        <LayerDetails layer={this.state.selectedLayer} />
      </div>
    );
  }
});

React.renderComponent(
  <App layers={defaultLayers}/>,
  document.body
);

