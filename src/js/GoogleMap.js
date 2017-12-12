import React from 'react';
import PropTypes from 'prop-types';

class GoogleMap extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      markers: []
    }
  }

  componentDidMount() {
    const { properties, activeProperty } = this.props;
    const { latitude, longitude } = activeProperty;

    this.map = new google.maps.Map(this.refs.map, {
      center: {lat: latitude, lng: longitude},
      mapTypeControl: false,
      zoom: 15
    });

    this.createMarkers(properties);
  }

  createMarkers(properties) {
    const { setActiveProperty, activeProperty } = this.props;
    const activePropertyIndex = activeProperty.index;
    const { markers } = this.state;

    properties.map(property => {
      const { latitude, longitude, index, address } = property;
      this.marker = new google.maps.Marker({
        position: {lat: latitude, lng: longitude},
        map: this.map,
        label: {
          color: '#ffffff',
          text: `${index+1}`
        },
        icon: {
          url: "https://ihatetomatoes.net/react-tutorials/google-maps/images/img_map-marker.png",
          // This marker is 22 pixels wide by 55 pixels high.
          size: new google.maps.Size(22, 55),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, -15),
          // The anchor for this image is the base of the cross (11, 52).
          anchor: new google.maps.Point(11, 52)
        }
      });

      // create info window for each marker
      const iw = new google.maps.InfoWindow({
        content: `<h1>${address}</h1>`
      });

      this.marker.iw = iw;

      this.marker.addListener('click', function() {

        // hide all other info boxes on click
        markers.forEach(marker => {
          marker.iw.close();
        });

        // set active property into the state
        setActiveProperty(property, true);

      });

      // push this marker to the markers array on the state
      markers.push(this.marker);

      // show active property info window
      markers[activePropertyIndex] && markers[activePropertyIndex].iw.open(this.map, markers[activePropertyIndex]);
    });
  }

  render() {
    return (
      <div className="mapContainer">
        <div id="map" ref="map"></div>
      </div>
    );
  }

}

GoogleMap.propTypes = {
  properties: PropTypes.array.isRequired,
  activeProperty: PropTypes.object.isRequired,
  setActiveProperty: PropTypes.func.isRequired
};

export default GoogleMap;
