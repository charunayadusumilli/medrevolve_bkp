import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

export default function PersonalizedRecommendations({ currentProductId, title = "Recommended For You" }) {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPersonalized, setIsPersonalized] = useState(false);

    useEffect(() => {
        loadRecommendations();
    }, [currentProductId]);

    const loadRecommendations = async () => {
        try {
            setLoading(true);
            const isAuthenticated = await base44.auth.isAuthenticated();
            
            if (!isAuthenticated) {
                // Show default recommendations for non-authenticated users
                setRecommendations([
                    { id: '1', name: 'Semaglutide', category: 'weight', price: 299, subtitle: 'FDA-Approved Weight Loss' },
                    { id: '10', name: 'Testosterone Therapy', category: 'hormone', price: 199, subtitle: 'Hormone Optimization' },
                    { id: '7', name: 'NAD+ Spray', category: 'longevity', price: 179, subtitle: 'Cellular Rejuvenation' },
                    { id: '5', name: 'Sermorelin', category: 'longevity', price: 199, subtitle: 'Growth Hormone Support' }
                ]);
                setIsPersonalized(false);
                return;
            }

            const user = await base44.auth.me();
            const { data } = await base44.functions.invoke('getPersonalizedRecommendations', {
                userEmail: user.email,
                currentProductId: currentProductId || null,
                limit: 4
            });

            setRecommendations(data.recommendations || []);
            setIsPersonalized(data.personalized || false);
        } catch (error) {
            console.error('Error loading recommendations:', error);
            // Fallback to default products
            setRecommendations([
                { id: 'semaglutide', name: 'Semaglutide', category: 'weight', price: 299, subtitle: 'FDA-Approved Weight Loss' },
                { id: 'nad', name: 'NAD+ Therapy', category: 'longevity', price: 349, subtitle: 'Cellular Rejuvenation' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 text-[#4A6741] animate-spin" />
            </div>
        );
    }

    if (recommendations.length === 0) return null;

    return (
        <section className="py-16 bg-gradient-to-br from-[#F5F1E8] to-[#FDFBF7]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-8">
                    <Sparkles className="w-6 h-6 text-[#4A6741]" />
                    <h2 className="text-3xl font-bold text-[#2D3A2D]">
                        {title}
                        {isPersonalized && <span className="ml-2 text-lg font-normal text-[#6B8F5E]">• Personalized</span>}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recommendations.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-[#E8E0D5] h-full">
                                <CardContent className="p-6 flex flex-col h-full">
                                    <div className="mb-4">
                                        <span className="inline-block px-3 py-1 bg-[#4A6741]/10 text-[#4A6741] rounded-full text-xs font-medium mb-3">
                                            {product.category}
                                        </span>
                                        <h3 className="text-xl font-semibold text-[#2D3A2D] mb-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-[#5A6B5A]">
                                            {product.subtitle}
                                        </p>
                                    </div>

                                    <div className="mt-auto">
                                        <div className="flex items-baseline gap-2 mb-4">
                                            <span className="text-2xl font-bold text-[#2D3A2D]">
                                                ${product.price}
                                            </span>
                                            <span className="text-sm text-[#5A6B5A]">/month</span>
                                        </div>

                                        <Link to={createPageUrl(`ProductDetail?id=${product.id}`)}>
                                            <Button className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full group-hover:shadow-lg transition-all">
                                                Learn More
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}