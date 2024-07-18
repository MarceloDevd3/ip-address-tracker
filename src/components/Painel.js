import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L, { Icon } from 'leaflet';
import "leaflet/dist/leaflet.css";
import markerIconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import markerIconUrl from './images/icon-location.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';
import axios from "axios";
import arrow from './images/icon-arrow.svg';

export default function Painel() {

  const customIcon = new Icon({
    iconRetinaUrl: markerIconRetinaUrl,
    iconUrl: markerIconUrl,
    shadowUrl: markerShadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [25, 41],
  });

  const [painelInfo, setPainelInfo] = useState({
    CurrentIpAddress: "192.212.174.101",
    CurrentLocation: "Brooklyn",
    CurrentState: "NY 10001",
    CurrentTimezone: "05:00",
    CurrentIsp: "SpaceX Starlink"
  })

  const [locationCode, setLocationCode] = useState({
    lt: 34.08057,
    lg: -118.07285
  })

  const [ip, setIp] = useState('');
  const [location, setLocation] = useState(null);

  const fetchLocation = async () => {
    try {
      const response = await axios.get(`https://geo.ipify.org/api/v2/country,city,vpn?`, {
        params: {
          apiKey: 'at_tTE8Nfzn42Qc50LxlJktTGdfto6HZ', // Substitua pela sua chave de API
          ipAddress: ip
        }
      });
      const data = response.data
      setLocation(response.data);
      setPainelInfo({
        CurrentIpAddress: `${data.ip}`,
        CurrentLocation: `${data.location.city}`,
        CurrentState: `${data.location.region} ${data.location.postalCode}`,
        CurrentTimezone: data.location.timezone,
        CurrentIsp: data.isp
      });

      setLocationCode({
        lt: data.location.lat,
        lg: data.location.lng
      })


    } catch (error) {
      console.error('Erro ao buscar a localização:', error);
      setLocation(null);
    }
  };

  function subForm(e) {
    e.preventDefault()
  }


  const UpdateMap = () => {
    const map = useMap();
    useEffect(() => {
      map.setView([locationCode.lt, locationCode.lg], 17);
    }, [locationCode, map]);
    return null;
  };


  return (
    <main>
      <div className="painel">
        <div className="top-painel">
        <h1 className="Painel--title">IP address Tracker</h1>
        <form onSubmit={subForm}>
          <label htmlFor="pesquisa" aria-description="search-form" ></label>
          <input type="text"
            value={ip}
            placeholder="Search for any IP address or domain"
            onChange={(e) => setIp(e.target.value)} />

          <button aria-description="button to submit your search" className="btn-black" onClick={fetchLocation}> <img src={arrow} alt="arrow-icon"/></button>

        </form>
        </div>
        <article id="Painel--information-zone">
          <div className="info-1 info" >
           <div>
           <h2 className="Ip-address">Ip Address</h2>
           <p className="data">{painelInfo.CurrentIpAddress}</p>
           </div>
            <div className="line">
            <div className="dd">

</div>
            </div>
          </div>
          <div className="info-2 info">
            <div>
            <h2 className="location">Location</h2>
            <p className="data">{painelInfo.CurrentLocation}, {painelInfo.CurrentState}</p>
            </div>
            <div className="line"> 
            <div className="dd">

</div>
            </div>
          </div>
          <div className="info-3 info">
            <div>
            <h2 className="TimeZone">Timezone</h2>
            <p className="data"> UTC  {painelInfo.CurrentTimezone}</p>
            </div>
            <div className="line">
            <div className="dd">

</div>
            </div>
          </div>
          <div className="info-4 info">
            <div>
            <h2 className="Isp">Isp</h2>
            <p className="data">{painelInfo.CurrentIsp}</p>
            </div>
            
          </div>
      </article>
      </div>
     
      <div className="map">
        <MapContainer center={[locationCode.lt, locationCode.lg]} zoom={17} >
          <UpdateMap />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[locationCode.lt, locationCode.lg]} icon={customIcon} />
        </MapContainer>
      </div>
    </main>
  )
}