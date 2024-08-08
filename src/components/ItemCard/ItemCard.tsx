import { IconEdit, IconTrash } from "@tabler/icons-react";
import React from "react";
import { Button, Card } from "react-bootstrap";
import "./ItemCard.css";

interface ItemCardProps {
  title: string;
  description: string;
  onEdit: () => void;
  onDelete: () => void;
  imageUrl?: string;
  website?: string;
}

const ItemCard: React.FC<ItemCardProps> = ({
  title,
  description,
  onEdit,
  onDelete,
  imageUrl,
  website,
}) => {
  return (
    <Card className="item-card">
      {imageUrl && (
        <Card.Img variant="top" src={imageUrl} className="item-card-image" />
      )}
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        {website && (
          <Card.Text>
            <a href={website} target="_blank" rel="noreferrer">
              {website}
            </a>
          </Card.Text>
        )}
        <div className="item-card-actions">
          <Button variant="outline-primary" onClick={onEdit}>
            <IconEdit className="icon" />
          </Button>
          <Button variant="outline-danger" onClick={onDelete}>
            <IconTrash className="icon" />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ItemCard;
