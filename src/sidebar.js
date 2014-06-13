/** @jsx React.DOM */
/* exported SidebarLayerList */


var SidebarLayerList = React.createClass({
  getInitialState: function() {
    return { renamingSelectedLayer: false };
  },

  startRenamingLayer: function() {
    this.setState({ renamingSelectedLayer: true });
  },

  renameLayer: function(index, newName) {
    this.props.layers[index].name.set(newName);
    this.setState({ renamingSelectedLayer: false });
  },

  render: function() {
    var layers = this.props.layers.getValue().map(function(layer, i) {
      var selected = this.props.selectedLayer === i,
          renaming = selected && this.state.renamingSelectedLayer,
          key = "layer-" + i;

      if (renaming) {
        return <RenamingSidebarLayer
          key={key}
          initialName={layer.name}
          renameLayer={this.renameLayer.bind(this, i)} />;
      } else if (selected) {
        return <SelectedSidebarLayer
          key={key}
          name={layer.name}
          startRenamingLayer={this.startRenamingLayer} />;
      } else {
        return <SidebarLayer
          key={key}
          name={layer.name}
          selectLayer={this.props.selectLayer.bind(null, i)} />;
      }
    }, this);
    return (
      <div className="sidebarLayerList">
        {layers}
        <div className="sidebarLayerFiller" />
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
    window.addEventListener("click", this.handleOutsideClick, true);
  },

  componentWillUnmount: function() {
    window.removeEventListener("click", this.handleOutsideClick, true);
  },

  renameLayer: function() {
    var val = this.state.name,
        newName = val.trim() === "" ? this.props.initialName : val;
    this.props.renameLayer(newName);
  },

  handleKeyPress: function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.renameLayer();
    }
  },

  render: function() {
    return (
      <input className="sidebarLayer sidebarLayerRenamer selected" type="text" value={this.state.name} onChange={this.handleChange} onKeyPress={this.handleKeyPress} ref="input"/>
    );
  }
});

