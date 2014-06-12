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
    this.props.layers[index].name = newName;
    this.setState({ renamingSelectedLayer: false });
  },

  render: function() {
    var layers = this.props.layers.map(function(layer, i) {
      var selected = this.state.selectedLayer === layer,
          renaming = selected && this.state.renamingSelectedLayer,
          key = "layer-" + i;

      if (renaming) {
        return <RenamingSidebarLayer
          key={key}
          initialName={layer.name}
          renameLayer={this.renameLayer.bind(this, i)} />
      } else if (selected) {
        return <SelectedSidebarLayer
          key={key}
          name={layer.name}
          startRenamingLayer={this.startRenamingLayer} />;
      } else {
        return <SidebarLayer
          key={key}
          name={layer.name}
          selectLayer={this.selectLayer.bind(this, i)} />;
      }
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
        {this.props.name}
      </div>
    );
  }
});

var SelectedSidebarLayer = React.createClass({
  render: function() {
    return (
      <div className="sidebarLayer selected" onClick={this.props.startRenamingLayer}>
        {this.props.name}
      </div>
    );
  }
});

var RenamingSidebarLayer = React.createClass({
  getInitialState: function() {
    return { name: this.props.initialName };
  },

  handleChange: function(event) {
    this.setState({ name: event.target.value });
  },

  handleOutsideClick: function(event) {
    if (event.target === this.refs.input.getDOMNode()) {
      event.preventDefault();
      return false;
    } else {
      this.renameLayer();
    }
  },

  componentDidMount: function() {
    this.refs.input.getDOMNode().select();
    document.addEventListener("click", this.handleOutsideClick);
  },

  componentWillUnmount: function() {
    document.removeEventListener("click", this.handleOutsideClick);
  },

  renameLayer: function() {
    var val = this.refs.input.getDOMNode().value;
    this.props.renameLayer(val);
  },

  handleKeyPress: function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.renameLayer();
    }
  },

  render: function() {
    return (
      <input type="text" value={this.state.name} onChange={this.handleChange} onKeyPress={this.handleKeyPress} ref="input"/>
    );
  }
});

React.renderComponent(
  <App />,
  document.body
);

