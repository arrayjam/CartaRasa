/** @jsx React.DOM */
/* exported Map */

/* Holds data for the map projection */
var Map = React.createClass({
  getInitialState: function() {
    var state = {};
    this.props.layers.getValue().slice(1).forEach(function(_, i) {
      var key = "layer-" + i;

      state[key] = null;
    });

    return state;
  },

  getProjection: function() {
    var projectionDetails = this.props.layers[0].data.getValue(),
        projection = d3.geo[projectionDetails.projection]();

    if (projectionDetails.scale) projection.scale(projectionDetails.scale);
    return projection;
  },

  componentWillMount: function() {
    this.props.layers.getValue().slice(1).map(function(layer, i) {
      var key = "layer-" + (i + 1);
      if (layer.type === "features") {
        this.getJSON(layer.data.url, function(data) {
          var o = {};
          o[key] = data;
          console.log(o);
          this.setState(o);
        }.bind(this));
      }
    }, this);
  },

  getJSON: function(url, callback) {
    d3.json(url, function(err, data) {
      return callback(data);
    });
  },

  render: function() {
    var contentLayers = this.props.layers.getValue().slice(1).map(function(layer, i) {
      var key = "layer-" + (i + 1);
      if (layer.type === "features") {
        console.log(this.state[key]);
        return <FeaturesGroup key={key} data={layer.data} projection={this.getProjection()} json={this.state[key]}/>;
      } else {
        return <g key={key} />;
      }
    }, this);
    return (
      <svg className="map" ref="map" projection={this.getProjection}>
        {contentLayers}
      </svg>
    );
  }
});

var FeaturesGroup = React.createClass({
  getDefaultProps: function() {
    return { data: { fill: "green" }, json: null};
  },

  render: function() {
    console.log("json received: ", this.props.json);
    if (this.props.json) {
      var path = d3.geo.path().projection(this.props.projection),
          features = topojson.feature(this.props.json, this.props.json.objects.countries).features,
          featuresPaths = features.map(function(featuresData) {
            return <path d={path(featuresData)} style={{fill: this.props.data.fill}} />;
          }, this);
      return (
        <g className="land">
          {featuresPaths}
        </g>
      );
    } else {
      return (
        <rect
          width="30"
          height="30"
          x="30"
          y="30"
          style={{fill: this.props.data.fill }} />
      );
    }
  }
});

