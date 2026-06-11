import { Link } from 'react-router-dom';
import { FiMapPin, FiHome, FiCamera, FiHeart, FiMaximize2 } from 'react-icons/fi';
import { useState } from 'react';

export default function PropertyCard({ property }) {
  const [imgError, setImgError] = useState(false);
  const primaryImg = property.images?.find(i => i.isPrimary) || property.images?.[0];
  const formatPrice = (price) => {
    if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `${(price / 1000).toFixed(0)}K`;
    return price?.toLocaleString();
  };

  return (
    <Link to={`/properties/${property._id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl card-hover border border-gray-100">
        <div className="relative h-52 image-zoom">
          {primaryImg && !imgError ? (
            <img src={primaryImg.url} alt={property.title} className="w-full h-full object-cover" onError={() => setImgError(true)} loading="lazy" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <FiCamera className="text-gray-400 text-4xl" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className={`px-3 py-1 rounded-lg text-xs font-semibold text-white shadow-lg backdrop-blur-sm ${property.purpose === 'sale' ? 'bg-primary-600/90' : 'bg-emerald-600/90'}`}>
              {property.purpose === 'sale' ? 'For Sale' : 'For Rent'}
            </span>
            {property.featured && (
              <span className="px-3 py-1 rounded-lg text-xs font-semibold text-white shadow-lg bg-amber-500/90">Featured</span>
            )}
          </div>
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <div className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
              <FiHeart className="text-gray-600 text-sm" />
            </div>
          </div>
          <div className="absolute bottom-3 right-3">
            <div className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg">
              <span className="text-sm font-bold text-primary-600">${formatPrice(property.price)}</span>
              {property.currency === 'LBP' && <span className="text-xs text-gray-500"> L.L</span>}
              {property.purpose === 'rent' && <span className="text-xs text-gray-500">/mo</span>}
            </div>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-gray-800 truncate group-hover:text-primary-600 transition-colors">{property.title}</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1.5">
            <FiMapPin className="shrink-0 text-primary-400" /> {property.location?.city}{property.location?.district ? `, ${property.location.district}` : ''}
          </p>
          {property.type !== 'land' && (
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <FiHome className="text-primary-500 text-xs" />
                <span className="font-medium">{property.bedrooms}</span>
                <span className="text-gray-400">Beds</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <FiMaximize2 className="text-primary-500 text-xs" />
                <span className="font-medium">{property.bathrooms}</span>
                <span className="text-gray-400">Baths</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600 ml-auto">
                <span className="font-medium">{property.floorArea || property.landArea}</span>
                <span className="text-gray-400">m²</span>
              </div>
            </div>
          )}
          {property.type === 'land' && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-sm text-gray-600">
              <FiMaximize2 className="text-primary-500 text-xs" />
              <span className="font-medium">{property.landArea}</span>
              <span className="text-gray-400">m²</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
