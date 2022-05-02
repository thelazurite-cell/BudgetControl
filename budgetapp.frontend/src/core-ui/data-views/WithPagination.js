import { paginationProps } from "./props/Pagination";
import {
  unstable_PageSelector as PageSelector,
  unstable_Pagination as Pagination,
} from "@carbon/react";

export const WithPagination = () => (
  <Pagination {...paginationProps()} totalItems={350} pageSizes={[10, 20, 30]}>
    {({ currentPage, onSetPage, totalPages }) => (
      <PageSelector
        currentPage={currentPage}
        id={`page-selector`}
        onChange={(event) => onSetPage(event.target.value)}
        totalPages={totalPages}
      />
    )}
  </Pagination>
);
