import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * SEO-friendly Breadcrumb navigation component.
 * Renders a visible breadcrumb trail with proper HTML semantics.
 * 
 * @param {Array} items - Array of { name, url } objects. Last item is the current page.
 * @param {boolean} light - Use light (white) text for dark backgrounds.
 */
const Breadcrumb = ({ items = [], light = false }) => {
  if (!items || items.length === 0) return null;

  const textColor = light ? 'text-white/70' : 'text-gray-500';
  const linkColor = light ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-purple-600';
  const activeColor = light ? 'text-white' : 'text-gray-900';
  const separatorColor = light ? 'text-white/40' : 'text-gray-400';

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className={`flex flex-wrap items-center gap-1 ${textColor}`} itemScope itemType="https://schema.org/BreadcrumbList">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              {isLast ? (
                <span className={`font-medium ${activeColor}`} itemProp="name">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    to={item.url || '/'}
                    className={`transition-colors ${linkColor}`}
                    itemProp="item"
                  >
                    <span itemProp="name">{item.name}</span>
                  </Link>
                  <svg
                    className={`w-4 h-4 flex-shrink-0 ${separatorColor}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string,
    })
  ).isRequired,
  light: PropTypes.bool,
};

export default Breadcrumb;
