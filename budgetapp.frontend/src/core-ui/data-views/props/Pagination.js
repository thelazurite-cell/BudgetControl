import { sizes } from "./Sizes";

export const paginationProps = () => ({
  disabled: false,
  pagesUnknown: false,
  backwardText: "Previous page",
  forwardText: "Next page",
  pageSize: 10,
  itemsPerPageText: "Items per page:",
  size: sizes.Compact,
  onChange: () => console.log("Pagination Change"),
});
