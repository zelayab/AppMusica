import { Card as BootstrapCard, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Artist } from "../../types/artist";
import "./DynamicCard.css";

interface DynamicCardProps {
  title: string;
  subtitle1?: string;
  subtitle2?: string;
  link?: string;
  linkText?: string;
  imageUrl?: string;
}

const DynamicCard: React.FC<DynamicCardProps> = ({
  title,
  subtitle1,
  subtitle2,
  link,
  linkText,
  imageUrl,
}) => {
  const navigate = useNavigate();
  const artist: Artist = {
    name: title,
    bio: subtitle1,
    website: link,
    imageUrl: imageUrl,
  };

  const handleNavigation = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <BootstrapCard className="dynamic-card">
      {imageUrl && !artist && (
        <BootstrapCard.Img variant="top" src={imageUrl} />
      )}
      {artist && imageUrl && (
        <BootstrapCard.Img
          variant="top"
          src={imageUrl}
          className="rounded-artist"
        />
      )}
      <BootstrapCard.Body className="card-body">
        <BootstrapCard.Title className="card-title">
          {title}
        </BootstrapCard.Title>
        <BootstrapCard.Text className="card-text">
          {subtitle1}
        </BootstrapCard.Text>
        {subtitle2 && (
          <BootstrapCard.Text className="card-text">
            {subtitle2}
          </BootstrapCard.Text>
        )}
        {link && (
          <Button variant="primary" onClick={handleNavigation}>
            {linkText || "Ver más"}
          </Button>
        )}
      </BootstrapCard.Body>
    </BootstrapCard>
  );
};

export default DynamicCard;
