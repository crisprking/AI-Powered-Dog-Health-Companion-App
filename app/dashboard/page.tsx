import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Dog, Calendar, TrendingUp, Settings, CreditCard } from 'lucide-react'

export default async function DashboardPage() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')
  
  const user = await currentUser()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold">Welcome back, {user?.firstName || 'Friend'}!</h1>
            <Link href="/dashboard/settings" className="text-gray-600 hover:text-gray-900">
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">My Dogs</p>
                <p className="text-2xl font-semibold">0</p>
              </div>
              <Dog className="h-8 w-8 text-rose-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Health Checks</p>
                <p className="text-2xl font-semibold">0</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Streak</p>
                <p className="text-2xl font-semibold">0 days</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Plan</p>
                <p className="text-2xl font-semibold">Free</p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Add First Dog CTA */}
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Dog className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Add Your First Dog</h2>
          <p className="text-gray-600 mb-6">Start tracking your dog's health with daily check-ins and AI-powered insights</p>
          <Link 
            href="/dashboard/dogs/new" 
            className="inline-flex items-center bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Dog Profile
          </Link>
        </div>

        {/* Upgrade Banner */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-1">Upgrade to Premium</h3>
              <p className="opacity-90">Track unlimited dogs and get advanced AI insights</p>
            </div>
            <Link 
              href="/pricing" 
              className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              View Plans
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}



