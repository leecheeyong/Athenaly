<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <TrendingUp class="h-5 w-5 text-white" />
          </div>
          <div>
            <span class="text-xl font-bold text-gray-900">Athenaly</span>
            <div class="text-xs text-gray-500 -mt-1">Route Visualizer</div>
          </div>
        </div>
      </div>
    </header>

    <section class="bg-white">
      <div class="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <div class="space-y-6">
              <div class="inline-flex items-center px-3 py-1 bg-purple-100 rounded-full">
                <span class="text-sm font-medium text-purple-700">Transform your Strava routes</span>
              </div>
              
              <h1 class="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Turn your runs into
                <span class="text-purple-600">beautiful art</span>
              </h1>
              
              <p class="text-xl text-gray-600 leading-relaxed">
                Athenaly converts your Strava activities into clean, minimalist route visualizations perfect for sharing.
              </p>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-4">
              <button 
                @click="connectStrava"
                class="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.917"/>
                </svg>
                Connect with Strava
              </button>
              <button
                @click="goDemo"
                class="inline-flex items-center justify-center px-8 py-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
               <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 9.783V4h1V2H8v2h1v5.783l-4.268 9.389a1.992 1.992 0 0 0 .14 1.911A1.99 1.99 0 0 0 6.553 22h10.895a1.99 1.99 0 0 0 1.681-.917c.37-.574.423-1.289.14-1.911L15 9.783zm-4.09.631c.06-.13.09-.271.09-.414V4h2v6c0 .143.03.284.09.414L15.177 15H8.825l2.085-4.586z"></path></svg>
                Try me out
              </button>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div class="h-80 bg-gray-50 rounded-xl relative overflow-hidden">
              <svg class="w-full h-full" viewBox="0 0 320 240" fill="none">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" stroke-width="0.5"/>
                  </pattern>
                </defs>
                <rect width="320" height="240" fill="url(#grid)" />
                
                <path 
                  d="M40,200 Q80,160 120,140 T200,120 Q240,100 280,80" 
                  stroke="#7c3aed" 
                  stroke-width="3" 
                  fill="none"
                  stroke-linecap="round"
                />
                
                <circle cx="40" cy="200" r="5" fill="#10b981" />
                <circle cx="280" cy="80" r="5" fill="#ef4444" />
                
                <circle cx="120" cy="140" r="3" fill="#7c3aed" opacity="0.7" />
                <circle cx="200" cy="120" r="3" fill="#7c3aed" opacity="0.7" />
              </svg>
              
              <div class="absolute top-4 left-4 bg-white rounded-lg shadow-sm p-3 border border-gray-100">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div>
                    <div class="text-sm font-semibold text-gray-900">8.2 km</div>
                    <div class="text-xs text-gray-500">Morning Run</div>
                  </div>
                </div>
              </div>
              
              <div class="absolute bottom-4 right-4 bg-white rounded-lg shadow-sm p-3 border border-gray-100">
                <div class="text-center">
                  <div class="text-sm font-semibold text-gray-900">324</div>
                  <div class="text-xs text-gray-500">Activities</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-gray-500">
        Made with <span class="text-red-500">♥</span> by 
        <a href="https://github.com/leecheeyong" class="underline hover:text-purple-600" target="_blank" rel="noopener">Chee Yong Lee</a> ·
        Project is under the terms of 
        <a href="https://github.com/leecheeyong/Athenaly/blob/main/LICENSE" class="underline hover:text-purple-600" target="_blank" rel="noopener">MIT License</a>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { 
  TrendingUp, 
} from 'lucide-vue-next'

const connectStrava = () => {
    window.location.href = "/activity"
}
const goDemo = () => {
    window.location.href = "/demo"
}
</script>

<style scoped>
.transition-colors {
  transition: color 0.2s ease;
}
</style>
