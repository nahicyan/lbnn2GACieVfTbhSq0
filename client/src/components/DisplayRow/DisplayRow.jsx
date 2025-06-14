import React, { useState, useRef, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import PropertyCard from "../PropertyCard/PropertyCard";
import { PuffLoader } from "react-spinners";

/**
 * DisplayRow Component with Dynamic Pagination
 * 
 * @param {Object} props
 * @param {Array} props.properties - All properties data
 * @param {Object} props.filter - Filter configuration
 * @param {string} props.title - Section title
 * @param {string} props.subtitle - Section subtitle (optional)
 * @param {boolean} props.showDivider - Show divider line above section (optional)
 * @param {boolean} props.loading - Loading state (optional)
 * @param {string} props.emptyMessage - Message when no properties found (optional)
 * @param {Function} props.onPropertyClick - Callback when property clicked (optional)
 */
const DisplayRow = ({
  properties = [],
  filter = { type: 'all' },
  title,
  subtitle,
  showDivider = false,
  loading = false,
  emptyMessage = "No properties found.",
  onPropertyClick,
  className = ""
}) => {
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const [scrollState, setScrollState] = useState({ showLeft: false, showRight: false });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [usePagination, setUsePagination] = useState(true);
  const [useVerticalLayout, setUseVerticalLayout] = useState(false);

  // Calculate items per page based on container width
  const calculateItemsPerPage = () => {
    if (!containerRef.current) return 3;
    
    const containerWidth = containerRef.current.offsetWidth;
    const cardWidth = 380; // Based on PropertyCard width + spacing
    const padding = 32; // Container padding
    const spacing = 20; // Space between cards
    
    const availableWidth = containerWidth - padding;
    const minWidthForTwoCards = (cardWidth * 2) + spacing;
    
    // If can't fit 2 cards horizontally, switch to vertical layout
    if (availableWidth < minWidthForTwoCards) {
      setUseVerticalLayout(true);
      setUsePagination(false);
      return 1;
    }
    
    // Horizontal layout
    setUseVerticalLayout(false);
    const cardsPerRow = Math.floor((availableWidth + spacing) / (cardWidth + spacing));
    
    // Mobile: <2 cards = scroll mode, no pagination
    // Tablet: 2 cards = pagination with 2 per page
    // Desktop: 3+ cards = pagination with that many per page
    if (cardsPerRow < 2) {
      setUsePagination(false);
      return cardsPerRow;
    } else {
      setUsePagination(true);
      return Math.max(2, cardsPerRow);
    }
  };

  // Update items per page on resize
  useEffect(() => {
    const updateLayout = () => {
      const newItemsPerPage = calculateItemsPerPage();
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1); // Reset to first page
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  // Filter properties based on filter configuration
  const getFilteredProperties = () => {
    if (!properties || properties.length === 0) return [];

    switch (filter.type) {
      case 'all':
        return properties;

      case 'featured':
        if (filter.rowIds && filter.rowIds.length > 0) {
          const orderedProperties = [];
          filter.rowIds.forEach(id => {
            const property = properties.find(p => p.id === id);
            if (property) {
              orderedProperties.push(property);
            }
          });
          return orderedProperties;
        }
        return properties.filter(p => p.featured === "Featured");

      case 'area':
        return properties.filter(p => p.area === filter.value);

      case 'landType':
        return properties.filter(p => 
          Array.isArray(p.landType) 
            ? p.landType.includes(filter.value)
            : p.landType === filter.value
        );

      case 'custom':
        if (typeof filter.filterFn === 'function') {
          return properties.filter(filter.filterFn);
        }
        return properties;

      case 'combination':
        return handleCombinationFilter(properties, filter.filters, filter.operator);

      case 'exclude':
        if (filter.excludeIds && Array.isArray(filter.excludeIds)) {
          return properties.filter(p => !filter.excludeIds.includes(p.id));
        }
        return properties;

      default:
        return properties;
    }
  };

  // Handle combination filters with AND/OR operators
  const handleCombinationFilter = (props, filters, operator = 'AND') => {
    if (!filters || !Array.isArray(filters)) return props;

    if (operator === 'AND') {
      return props.filter(property => {
        return filters.every(f => matchesFilter(property, f));
      });
    } else if (operator === 'OR') {
      const matchedIds = new Set();
      const matchedProperties = [];

      filters.forEach(f => {
        const filtered = props.filter(p => matchesFilter(p, f));
        filtered.forEach(p => {
          if (!matchedIds.has(p.id)) {
            matchedIds.add(p.id);
            matchedProperties.push(p);
          }
        });
      });

      return matchedProperties;
    }

    return props;
  };

  // Check if a property matches a single filter
  const matchesFilter = (property, filter) => {
    switch (filter.type) {
      case 'featured':
        return property.featured === "Featured";
      case 'area':
        return property.area === filter.value;
      case 'landType':
        return Array.isArray(property.landType) 
          ? property.landType.includes(filter.value)
          : property.landType === filter.value;
      case 'custom':
        return typeof filter.filterFn === 'function' ? filter.filterFn(property) : true;
      default:
        return true;
    }
  };

  const filteredProperties = getFilteredProperties();

  // Pagination calculations
  const totalPages = usePagination ? Math.ceil(filteredProperties.length / itemsPerPage) : 1;
  const startIndex = usePagination ? (currentPage - 1) * itemsPerPage : 0;
  const endIndex = usePagination ? startIndex + itemsPerPage : filteredProperties.length;
  const currentProperties = usePagination 
    ? filteredProperties.slice(startIndex, endIndex)
    : filteredProperties;

  // Reset to first page when properties change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProperties.length, filter]);

  // Update scroll state
  const updateScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
      setScrollState({
        showLeft: scrollLeft > 0,
        showRight: scrollLeft + clientWidth < scrollWidth,
      });
    }
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, []);

  useEffect(() => {
    updateScrollState();
  }, [currentProperties.length, filter]);

  // Scroll handlers
  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -380, behavior: "smooth" });
      setTimeout(updateScrollState, 300);
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 380, behavior: "smooth" });
      setTimeout(updateScrollState, 300);
    }
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Handle property click
  const handlePropertyClick = (property) => {
    if (onPropertyClick) {
      onPropertyClick(property);
    }
  };

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  // Don't render section if no properties and hideWhenEmpty is true
  if (!loading && filteredProperties.length === 0 && filter.hideWhenEmpty) {
    return null;
  }

  return (
    <div className={`display-row-section ${className}`} ref={containerRef}>
      {/* Divider */}
      {showDivider && <hr className="my-8 border-t border-[#4b5b4d]/20" />}

      {/* Title Section */}
      {title && (
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h2>
          {filter.type === 'featured' && (
            <div className="mx-auto w-16 h-1 bg-[#D4A017] mb-3"></div>
          )}
          {subtitle && <p className="text-[#324c48]/80">{subtitle}</p>}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <PuffLoader size={50} color="#D4A017" />
        </div>
      ) : currentProperties.length > 0 ? (
        <>
          <div className="relative">
            {/* Left Scroll Button - Show in scroll mode or when content overflows (not in vertical layout) */}
            {!useVerticalLayout && (!usePagination || scrollState.showLeft) && (
              <button
                onClick={handleScrollLeft}
                className="hidden sm:block sm:absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                aria-label="Scroll left"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
            )}

            {/* Scrollable Container */}
            <div
              className={`px-2 py-4 ${usePagination ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden sm:overflow-x-auto sm:overflow-y-hidden'} no-scrollbar`}
              ref={scrollRef}
              onScroll={updateScrollState}
            >
              <div className={`flex ${useVerticalLayout ? 'flex-col space-y-8 items-center' : 'flex-col sm:flex-row space-y-8 sm:space-y-0 sm:space-x-5'} py-8`}>
                {currentProperties.map((property, index) => (
                  <div
                    key={property.id}
                    className={`${useVerticalLayout ? 'w-full' : 'flex-shrink-0'} transition hover:scale-105 ${!useVerticalLayout && index === 0 ? 'ml-3' : ''}`}
                    onClick={() => handlePropertyClick(property)}
                  >
                    <PropertyCard card={property} />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Scroll Button - Show in scroll mode or when content overflows (not in vertical layout) */}
            {!useVerticalLayout && (!usePagination || scrollState.showRight) && (
              <button
                onClick={handleScrollRight}
                className="hidden sm:block sm:absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                aria-label="Scroll right"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Pagination Controls - Only show when using pagination mode */}
          {usePagination && totalPages > 1 && (
            <div className="flex flex-col items-center mt-8 space-y-4">
              {/* Pagination Buttons */}
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200
                    ${currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-[#324c48] text-white hover:bg-[#3f4f24] hover:scale-110 shadow-lg hover:shadow-xl'
                    }
                  `}
                  aria-label="Previous page"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>

                {/* Page Numbers */}
                {getPaginationNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === '...' ? (
                      <span className="px-3 py-2 text-gray-500">...</span>
                    ) : (
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`
                          w-10 h-10 rounded-full font-semibold transition-all duration-200 transform
                          ${currentPage === page
                            ? 'bg-[#D4A017] text-white shadow-lg scale-110 ring-2 ring-[#D4A017]/30'
                            : 'bg-white text-[#324c48] border border-[#324c48]/20 hover:bg-[#324c48] hover:text-white hover:scale-105 hover:shadow-md'
                          }
                        `}
                      >
                        {page}
                      </button>
                    )}
                  </React.Fragment>
                ))}

                {/* Next Button */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200
                    ${currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-[#324c48] text-white hover:bg-[#3f4f24] hover:scale-110 shadow-lg hover:shadow-xl'
                    }
                  `}
                  aria-label="Next page"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Results Info */}
              <div className="text-sm text-gray-600">
                {startIndex + 1}-{Math.min(endIndex, filteredProperties.length)} of {filteredProperties.length} results
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-600 py-4">{emptyMessage}</p>
      )}
    </div>
  );
};

export default DisplayRow;

// Export filter helper functions for easier usage
export const createFilter = {
  all: () => ({ type: 'all' }),
  
  featured: (rowType = null, rowIds = null) => ({
    type: 'featured',
    rowType,
    rowIds
  }),
  
  area: (areaName) => ({
    type: 'area',
    value: areaName
  }),
  
  landType: (type) => ({
    type: 'landType',
    value: type
  }),
  
  custom: (filterFn) => ({
    type: 'custom',
    filterFn
  }),
  
  exclude: (propertyIds) => ({
    type: 'exclude',
    excludeIds: propertyIds
  }),
  
  // Combination filters
  and: (...filters) => ({
    type: 'combination',
    operator: 'AND',
    filters
  }),
  
  or: (...filters) => ({
    type: 'combination',
    operator: 'OR',
    filters
  })
};