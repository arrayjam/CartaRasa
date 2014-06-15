/** @jsx React.DOM */
/* global LayerDetails, SidebarLayerList, Map, Cortex */
/* exported getValOrUndefined */

var cx = React.addons.classSet;

var getValOrUndefined = function(cortex) {
  return cortex ? cortex.getValue() : undefined;
};

var App = React.createClass({
  getInitialState: function() {
    return { selectedLayer: 0 };
  },

  selectLayer: function(index) {
    this.setState({ selectedLayer: index });
  },

  render: function() {
    return (
      <div className="appContainer">
        <SidebarLayerList
          layers={this.props.layers}
          selectedLayer={this.state.selectedLayer}
          selectLayer={this.selectLayer} />
        <LayerDetails layer={this.props.layers[this.state.selectedLayer]} />
        <Map layers={this.props.layers} />
      </div>
    );
  }
});

var layers = [
  { name: "Countries", type: "features", data: { fill: "#222" } },
  { name: "Blast Radius" },
  { name: "Missile Travel Path" },
  { name: "Cities" },
  { name: "Military Bases" }
];

layers.unshift({ name: "Projection", type: "projection", data: { name: "Natural Earth", projection: "naturalEarth" }});

var layersCortex = new Cortex(layers);

var appComponent = React.renderComponent(
  <App layers={layersCortex}/>,
  document.body
);

layersCortex.on("update", function(updated) {
  appComponent.setProps({layers: updated});
});

