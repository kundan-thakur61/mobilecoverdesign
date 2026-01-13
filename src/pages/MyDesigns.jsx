import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import customDesignAPI from '../api/customDesignAPI';
import DesignCard from '../components/DesignCard';
import { PageLoader } from '../components/Loader';
import { addToCart } from '../redux/slices/cartSlice';
import SEO from '../components/SEO';

const sortDesigns = (designs, sortBy) => {
	const list = [...designs];
	switch (sortBy) {
		case 'oldest':
			return list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
		case 'name':
			return list.sort((a, b) => {
				const nameA = (a.name || a.meta?.model || '').toLowerCase();
				const nameB = (b.name || b.meta?.model || '').toLowerCase();
				return nameA.localeCompare(nameB);
			});
		case 'recent':
		default:
			return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
	}
};

export default function MyDesigns() {
	const [designs, setDesigns] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [search, setSearch] = useState('');
	const [sortBy, setSortBy] = useState('recent');
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const loadDesigns = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await customDesignAPI.getMyDesigns();
			const list = response?.data?.designs || response?.designs || [];
			setDesigns(list);
		} catch (err) {
			const message = err.response?.data?.message || err.message || 'Failed to load designs';
			setError(message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadDesigns();
	}, [loadDesigns]);

	const filteredDesigns = useMemo(() => {
		const query = search.trim().toLowerCase();
		const searched = query
			? designs.filter((design) => {
					const meta = design.meta || {};
					return [design.name, meta.company, meta.model, meta.type]
						.filter(Boolean)
						.some((value) => value.toLowerCase().includes(query));
				})
			: designs;

		return sortDesigns(searched, sortBy);
	}, [designs, search, sortBy]);

	const handleEditDesign = useCallback((design) => {
		sessionStorage.setItem('currentDesign', JSON.stringify({
			frame: design.frame || '/frames/frame-1.svg',
			imgSrc: design.imgSrc,
			transform: design.transform,
			meta: design.meta,
		}));
		sessionStorage.setItem('editingCustomId', `custom_${design._id}`);

		const meta = design.meta || {};
		const metaKey = `${meta.company || ''}__${meta.model || ''}__${meta.type || ''}`;
		const hasMeta = meta.company || meta.model || meta.type;
		navigate(hasMeta ? `/customizer/${encodeURIComponent(metaKey)}` : '/customizer');
	}, [navigate]);

	const handleAddToCart = useCallback((design) => {
		const meta = design.meta || {};
		const productId = `custom_${design._id}`;
		const variantId = `variant_${design._id}`;
		const title = design.name || `${meta.company || 'Custom'} ${meta.model || ''} Cover`.trim();
		const price = (meta.type || '').toLowerCase() === 'glass' ? 699 : 399;

		dispatch(addToCart({
			product: {
				_id: productId,
				title,
				images: [design.frame || '/frames/frame-1.svg'],
				design: {
					frame: design.frame,
					imgSrc: design.imgSrc,
					transform: design.transform,
					meta: design.meta,
					savedId: design._id,
				},
			},
			variant: {
				_id: variantId,
				name: meta.type || 'Custom Cover',
				price,
				stock: 100,
				color: meta.type || 'Custom',
			},
			quantity: 1,
		}));

		toast.success('Design added to cart');
	}, [dispatch]);

	const handleDeleteDesign = useCallback(async (design) => {
		const confirmDelete = window.confirm(`Delete "${design.name || 'this design'}"?`);
		if (!confirmDelete) return;

		try {
			await customDesignAPI.deleteDesign(design._id);
			toast.success('Design deleted');
			loadDesigns();
		} catch (err) {
			const message = err.response?.data?.message || err.message || 'Failed to delete design';
			toast.error(message);
		}
	}, [loadDesigns]);

	const handleCreateDesign = useCallback(() => {
		navigate('/customizer');
	}, [navigate]);

	if (loading) {
		return (
			<>
				{/* Block this page from search engines */}
				<Helmet>
					<meta name="robots" content="noindex, nofollow" />
				</Helmet>
				<div className="min-h-screen bg-gray-50 flex items-center justify-center">
					<PageLoader />
				</div>
			</>
		);
	}

	return (
		<>
			{/* Block this private page from search engines */}
			<Helmet>
				<meta name="robots" content="noindex, nofollow" />
			</Helmet>
			
			<SEO
				title="My Designs | Custom Mobile Covers - CoverGhar"
				description="Manage your saved custom mobile cover designs. Edit, reorder, and purchase your personalized phone cases."
				url="/my-designs"
			/>

			<div className="min-h-screen bg-gray-50 py-10">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Header Section */}
					<header className="mb-8">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<p className="text-sm uppercase tracking-wide text-primary-600 font-semibold">
									Your Custom Covers
								</p>
								<h1 className="text-3xl font-bold text-gray-900">My Designs</h1>
								<p className="text-gray-600 mt-1">
									Manage, edit, and reorder your saved custom case designs.
								</p>
							</div>
							<div className="flex gap-3">
								<button
									onClick={loadDesigns}
									className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
									aria-label="Refresh designs list"
								>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
									</svg>
									Refresh
								</button>
								<button
									onClick={handleCreateDesign}
									className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-sm"
								>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
									</svg>
									Create New Design
								</button>
							</div>
						</div>
					</header>

					{/* Error Message */}
					{error && (
						<div className="mb-6 p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg" role="alert">
							<div className="flex items-start gap-3">
								<svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
								</svg>
								<div>
									<p className="font-semibold">Error loading designs</p>
									<p className="text-sm">{error}</p>
								</div>
							</div>
						</div>
					)}

					{/* Statistics Bar */}
					{designs.length > 0 && (
						<div className="mb-6 bg-white border rounded-lg shadow-sm p-4">
							<div className="flex items-center justify-between text-sm">
								<div className="flex items-center gap-6">
									<div>
										<span className="text-gray-600">Total Designs:</span>
										<span className="ml-2 font-semibold text-gray-900">{designs.length}</span>
									</div>
									{filteredDesigns.length !== designs.length && (
										<div>
											<span className="text-gray-600">Showing:</span>
											<span className="ml-2 font-semibold text-primary-600">{filteredDesigns.length}</span>
										</div>
									)}
								</div>
							</div>
						</div>
					)}

					{/* Search and Sort Controls */}
					<section className="mb-8 bg-white border rounded-lg shadow-sm p-4 sm:p-6">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div className="flex-1">
								<label className="sr-only" htmlFor="design-search">
									Search designs
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
										</svg>
									</div>
									<input
										id="design-search"
										type="search"
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										placeholder="Search by name, brand, model, or material"
										className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
									/>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<label htmlFor="design-sort" className="text-sm text-gray-600 whitespace-nowrap">
									Sort by
								</label>
								<select
									id="design-sort"
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
									className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
								>
									<option value="recent">Most recent</option>
									<option value="oldest">Oldest first</option>
									<option value="name">Name (A–Z)</option>
								</select>
							</div>
						</div>
					</section>

					{/* Designs Grid or Empty State */}
					{filteredDesigns.length === 0 ? (
						<div className="bg-white border rounded-lg shadow-sm p-12 text-center">
							<div className="max-w-md mx-auto space-y-4">
								<div className="w-20 h-20 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mx-auto">
									<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
									</svg>
								</div>
								<h2 className="text-2xl font-semibold text-gray-900">
									{search ? 'No matching designs found' : 'No designs yet'}
								</h2>
								<p className="text-gray-600">
									{search 
										? 'Try adjusting your search terms or filters'
										: 'Save your creations in the customizer and they will show up here for easy reordering.'
									}
								</p>
								{search ? (
									<button
										onClick={() => setSearch('')}
										className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
									>
										Clear Search
									</button>
								) : (
									<button
										onClick={handleCreateDesign}
										className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-sm font-semibold"
									>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
										</svg>
										Start Designing
									</button>
								)}
							</div>
						</div>
					) : (
						<>
							{/* Designs Grid */}
							<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{filteredDesigns.map((design) => (
									<DesignCard
										key={design._id}
										design={design}
										onEdit={handleEditDesign}
										onAddToCart={handleAddToCart}
										onDelete={handleDeleteDesign}
									/>
								))}
							</section>

							{/* Pagination or Load More (if needed) */}
							{filteredDesigns.length > 0 && (
								<div className="mt-8 text-center">
									<p className="text-sm text-gray-600">
										Showing {filteredDesigns.length} of {designs.length} design{designs.length !== 1 ? 's' : ''}
									</p>
								</div>
							)}
						</>
					)}

					{/* Help Text */}
					<div className="mt-12 bg-primary-50 border border-primary-100 rounded-lg p-6">
						<div className="flex items-start gap-4">
							<div className="flex-shrink-0">
								<svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<div className="flex-1">
								<h3 className="text-lg font-semibold text-primary-900 mb-2">
									💡 Design Tips
								</h3>
								<ul className="space-y-1 text-sm text-primary-800">
									<li>• Save your designs to quickly reorder the same cover later</li>
									<li>• Edit saved designs to try different materials or make small changes</li>
									<li>• Add designs to cart to order multiple covers at once</li>
									<li>• Use descriptive names to easily find your designs later</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}