import { Pagination } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => {
          const pageNum = x + 1;
          const link = !isAdmin
            ? keyword
              ? `/search/${keyword}/page/${pageNum}`
              : `/page/${pageNum}`
            : `/admin/productlist/${pageNum}`;

          return (
            <Pagination.Item
              key={pageNum}
              active={pageNum === page}
              as={NavLink}
              to={link}
            >
              {pageNum}
            </Pagination.Item>
          );
        })}
      </Pagination>
    )
  );
};

export default Paginate;

