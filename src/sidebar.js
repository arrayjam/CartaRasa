/** @jsx React.DOM */

var cx = React.addons.classSet;

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

  startRenamingLayer: function() {
    this.setState({ renamingSelectedLayer: true });
  },

  renameLayer: function(index, newName) {
    this.setState({ renamingSelectedLayer: false });
    this.props.layers[index].name = newName;
  },

  render: function() {
    var layers = this.props.layers.map(function(layer, i) {
      return <SidebarLayer
        key={"layer-" + i}
        name={layer.name}
        selectLayer={this.selectLayer.bind(this, i)}
        selected={this.state.selectedLayer === layer}
        startRenamingLayer={this.startRenamingLayer}
        renaming={this.state.selectedLayer === layer && this.state.renamingSelectedLayer}
        renameLayer={this.renameLayer.bind(this, i)} />;
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
  onKey: function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.props.renameLayer(this.refs.layer.getDOMNode().innerText);
    }
  },

  render: function() {
    var classes = cx({
      "sidebarLayer": true,
      "selected": this.props.selected
    });

    if (this.props.selected) {
      return (
        <div className={classes} onClick={this.props.startRenamingLayer} contentEditable={this.props.renaming} onKeyPress={this.onKey} ref="layer">
          {this.props.name}
        </div>
      );
    } else {
      return (
        <div className={classes} onClick={this.props.selectLayer}>
          {this.props.name}
        </div>
      );
    }
  }
});

React.renderComponent(
  <App />,
  document.body
);

