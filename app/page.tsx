import Link from 'next/link'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { Heart, Shield, TrendingUp, Check, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        '1 dog profile',
        'Basic health tracking',
        'Weekly insights',
        'Emergency vet finder'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Basic',
      price: '$9.99',
      period: 'per month',
      features: [
        '3 dog profiles',
        'Daily health tracking',
        'AI-powered insights',
        'Vet reminders',
        'Health history export'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Premium',
      price: '$29.99',
      period: 'per month',
      features: [
        'Unlimited dogs',
        'Advanced AI analysis',
        'Priority vet matching',
        'Telehealth access',
        'Family sharing',
        'API access'
      ],
      cta: 'Start Free Trial',
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-rose-500" />
              <span className="ml-2 text-xl font-bold">Pawsitive</span>
            </div>
            <div className="flex items-center gap-4">
              <SignInButton mode="modal">
                <button className="text-gray-700 hover:text-gray-900">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition">
                  Get Started
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Your Dog's Health,{' '}
            <span className="text-rose-500">Simplified</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track symptoms, get AI-powered insights, and know exactly when to visit the vet. 
            Peace of mind for dog parents, better health for your furry friend.
          </p>
          <SignUpButton mode="modal">
            <button className="bg-rose-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-rose-600 transition inline-flex items-center">
              Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </SignUpButton>
          <p className="mt-4 text-sm text-gray-500">No credit card required • 7-day free trial</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Dog Parents Love Pawsitive</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Daily Health Checks</h3>
              <p className="text-gray-600">Quick 30-second daily check-ins to track your dog's appetite, energy, and behavior patterns</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-gray-600">Our AI analyzes patterns and alerts you to potential health issues before they become serious</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Health Trends</h3>
              <p className="text-gray-600">Visual charts and reports to share with your vet during checkups</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 ${
                  plan.popular
                    ? 'border-2 border-rose-500 shadow-lg scale-105'
                    : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="bg-rose-500 text-white text-sm px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <SignUpButton mode="modal">
                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition ${
                      plan.popular
                        ? 'bg-rose-500 text-white hover:bg-rose-600'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </SignUpButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-rose-500" />
            <span className="ml-2 text-xl font-bold">Pawsitive</span>
          </div>
          <p className="text-gray-400 mb-4">© 2025 Pawsitive. All rights reserved.</p>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}



