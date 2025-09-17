'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Dog, Heart, Calendar, ArrowRight } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useUser()
  const [step, setStep] = useState(1)

  const handleComplete = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Heart className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Welcome to Pawsitive!</h1>
          <p className="text-gray-600">Let's get you set up in just a minute</p>
        </div>

        {step === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <Dog className="h-16 w-16 text-rose-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Track Your Dog's Health</h2>
              <p className="text-gray-600">Daily check-ins help you spot health issues early</p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 transition flex items-center justify-center"
            >
              Continue <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <Calendar className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Get AI-Powered Insights</h2>
              <p className="text-gray-600">Our AI analyzes patterns and alerts you to potential issues</p>
            </div>
            <button
              onClick={() => setStep(3)}
              className="w-full bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 transition flex items-center justify-center"
            >
              Continue <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">You're All Set!</h2>
              <p className="text-gray-600">Ready to add your first dog?</p>
            </div>
            <button
              onClick={handleComplete}
              className="w-full bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 transition flex items-center justify-center"
            >
              Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        )}

        <div className="flex justify-center mt-6 gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${
                i === step ? 'bg-rose-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}



