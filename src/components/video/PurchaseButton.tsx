'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ShoppingCart, Loader2, CreditCard, Package } from 'lucide-react';
import { ProductType, VIDEO_PRICES } from '@/types/video';

interface PurchaseButtonProps {
  productType: ProductType;
  videoSlug?: string;
  label?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

/**
 * Purchase button component for video products
 * Initiates Stripe checkout flow
 */
export function PurchaseButton({
  productType,
  videoSlug,
  label,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const price = VIDEO_PRICES[productType];
  const priceFormatted = (price / 100).toFixed(0);

  const defaultLabels: Record<ProductType, string> = {
    single: `Kup dostęp – ${priceFormatted}€`,
    standard: `Pakiet Standard – ${priceFormatted}€`,
    full: `Pakiet Pełny – ${priceFormatted}€`,
  };
  const defaultLabel = defaultLabels[productType];

  const handlePurchase = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/video/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_type: productType,
          video_slug: videoSlug,
        }),
      });

      const data = await response.json();

      if (data.checkout_url) {
        // Redirect to Stripe checkout
        window.location.href = data.checkout_url;
      } else {
        console.error('Checkout error:', data.error);
        alert('Wystąpił błąd. Spróbuj ponownie.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Wystąpił błąd. Spróbuj ponownie.');
      setIsLoading(false);
    }
  };

  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-[#2563EB] text-white hover:bg-[#1D4ED8] focus:ring-[#2563EB] shadow-sm hover:shadow-md',
    secondary:
      'bg-[#0F172A] text-white hover:bg-[#1E293B] focus:ring-[#0F172A] shadow-sm hover:shadow-md',
    outline:
      'border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white focus:ring-[#2563EB]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-3',
  };

  const Icon = productType === 'full' ? Package : CreditCard;

  return (
    <button
      onClick={handlePurchase}
      disabled={isLoading}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Przekierowanie...
        </>
      ) : (
        <>
          <Icon className="w-5 h-5" />
          {label || defaultLabel}
        </>
      )}
    </button>
  );
}

/**
 * Compact purchase card with price highlight
 */
interface PurchaseCardProps {
  productType: ProductType;
  videoSlug?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function PurchaseCard({
  productType,
  videoSlug,
  title,
  description,
  className,
}: PurchaseCardProps) {
  const price = VIDEO_PRICES[productType];
  const priceFormatted = (price / 100).toFixed(0);

  const defaultTitle = productType === 'full' ? 'Pełny pakiet' : 'Pojedynczy film';
  const defaultDescription =
    productType === 'full'
      ? 'Dostęp do wszystkich filmów edukacyjnych'
      : 'Dostęp do wybranego filmu przez 30 dni';

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-200 p-6 space-y-4',
        productType === 'full' && 'border-[#2563EB] ring-2 ring-[#2563EB]/20',
        className
      )}
    >
      {/* Best value badge for full package */}
      {productType === 'full' && (
        <div className="flex justify-center -mt-9">
          <span className="bg-[#2563EB] text-white text-xs font-semibold px-3 py-1 rounded-full">
            Najlepsza wartość
          </span>
        </div>
      )}

      {/* Header */}
      <div className="text-center">
        <h3 className="font-semibold text-[#0F172A] text-lg">
          {title || defaultTitle}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{description || defaultDescription}</p>
      </div>

      {/* Price */}
      <div className="text-center py-4">
        <span className="text-4xl font-bold text-[#0F172A]">{priceFormatted}</span>
        <span className="text-xl text-gray-500 ml-1">€</span>
        <p className="text-sm text-gray-500 mt-1">Jednorazowa płatność</p>
      </div>

      {/* Features */}
      <ul className="space-y-2 text-sm">
        <li className="flex items-center gap-2 text-gray-600">
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Dostęp przez 30 dni
        </li>
        {productType === 'full' && (
          <>
            <li className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Wszystkie kategorie ćwiczeń
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Oszczędność vs. pojedyncze filmy
            </li>
          </>
        )}
        <li className="flex items-center gap-2 text-gray-600">
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Bez konta i logowania
        </li>
      </ul>

      {/* Button */}
      <PurchaseButton
        productType={productType}
        videoSlug={videoSlug}
        variant={productType === 'full' ? 'primary' : 'outline'}
        fullWidth
        size="lg"
      />
    </div>
  );
}
