import starOutline from "../assets/images/decor/star-outline.svg";
import starFilled from "../assets/images/decor/star-filled.svg";
import balloonBlack from "../assets/images/decor/balloon-black.svg";
import discoBall from "../assets/images/decor/disco-ball.svg";
import zigzag from "../assets/images/decor/zigzag.svg";

const ICONOS = {
  "star-outline": starOutline,
  "star-filled": starFilled,
  "balloon-black": balloonBlack,
  "disco-ball": discoBall,
  zigzag: zigzag,
};

/** Sticker decorativo (estrella / globo negro / disco ball / zigzag). */
export default function Decor({ icon, className }) {
  return <img src={ICONOS[icon]} alt="" className={`decor ${className}`} />;
}
