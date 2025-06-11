import "./style/card.css";
const Card = ({ pg, onClick }) => (
  <div className="card" onClick={onClick}>
<img src={`${import.meta.env.VITE_API_BASE_URL}/uploads/pgImages/${pg.media.images[0]}`} alt={pg.pgName} />
  <h3>{pg.pgName}</h3>
    <p className="owner">Owner: {pg.ownerName}</p>
    <p className="content-number">Content Number: {pg.contactInfo.phone}</p>
    <button className="details">View Details</button>
  </div>
);

export default Card;
