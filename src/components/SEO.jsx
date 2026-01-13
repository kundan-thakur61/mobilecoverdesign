import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'Cover Ghar | Custom Mobile Covers - Design Your Own Phone Case',
  description = 'Design personalized mobile covers with premium materials. Fast shipping across India from Cover Ghar.',
  keywords = 'cover ghar, mobile covers, custom phone cases, personalized mobile covers, phone case design, premium mobile covers',
  image = '/mobile-covers-banner.png',
  url = '',
  type = 'website',
  schema = null
}) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://www.coverghar.in';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Cover Ghar" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      
      <link rel="canonical" href={fullUrl} />
      
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
  schema: PropTypes.object
};

export default SEO;
