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
    this.props.layers.map(function(layer, i) {
      var key = "layer-" + i;
      if (layer.type && layer.type.getValue() === "features") {
        this.getJSON(layer.data.url.getValue(), function(data) {
          var o = {};
          o[key] = data;
          this.setState(o);
        }.bind(this));
      }
    }, this);
  },

  getJSON: function(url, callback) {
    console.log("Getting JSON");
    d3.json(url, function(err, data) {
      return callback(data);
    });
  },

  render: function() {
    var contentLayers = this.props.layers.map(function(layer, i) {
      var key = "layer-" + i;
      if (layer.type && layer.type.getValue() === "features") {
        return <FeaturesGroup key={key} data={layer.data} projection={this.getProjection()} json={this.state[key]}/>;
      } else {
        return <g key={key} />;
      }
    }, this);
    return (
      <svg className="map" ref="map">
        {contentLayers}
      </svg>
    );
  }
});

var FeaturesGroup = React.createClass({
  getDefaultProps: function() {
    return { data: { fill: "green" }, json: null};
  },

  shouldComponentUpdate: function(nextProps) {
    var equal = function(one, two) {
      return JSON.stringify(one) === JSON.stringify(two);
    },
    equalOne = function(one, two) {
      return one === two;
    },
    changedProjection = !equalOne(nextProps.projection, this.props.projection),
    changedData = !equal(nextProps.data.getValue(), this.props.data.getValue()),
    newJSON = nextProps.json && !this.props.json;

    console.log("changedData", changedData, this.props.data.getValue(), nextProps.data.getValue());

    return changedProjection || changedData || newJSON;
  },

  render: function() {
    if (this.props.json) {
      var path = d3.geo.path().projection(this.props.projection),
          features = topojson.feature(this.props.json, this.props.json.objects.countries).features,
          featuresPaths = features.map(function(featuresData, i) {
            return <path key={"feature-" + i} d={path(featuresData)} style={{fill: this.props.data.fill}} />;
            //return <g />;
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

