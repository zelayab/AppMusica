import { Pagination } from "react-bootstrap";
import "./PaginationComponent.css";

const PaginationComponent = ({
  currentPage,
  nextPage,
  previousPage,
  paginate,
}: {
  currentPage: number;
  nextPage?: number | null;
  previousPage?: number | null;
  paginate: (page: number) => void;
}) => {
  // Verifica si la página actual es válida
  const isCurrentPageValid = currentPage >= 1;

  // Verifica si existen páginas siguientes y anteriores
  const hasPreviousPage = previousPage !== null;
  const hasNextPage = nextPage !== null;

  // Si la página actual no es válida, no muestra los números de página
  if (!isCurrentPageValid) {
    return null;
  }

  return (
    <Pagination>
      {/* Botón de página anterior */}
      <Pagination.Prev
        onClick={() => hasPreviousPage && paginate(previousPage!)}
        disabled={!hasPreviousPage}
      />

      {/* Botón de página siguiente */}
      <Pagination.Next
        onClick={() => hasNextPage && paginate(nextPage!)}
        disabled={!hasNextPage}
      />
    </Pagination>
  );
};

export default PaginationComponent;
